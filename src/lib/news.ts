import { fetchAPI } from '@/getter/fetch';
import sanitizeHtml from 'sanitize-html';
import { htmlToText } from 'html-to-text';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  author?: {
    node?: {
      firstName?: string;
    };
  } | null;
}

export interface NewsResponse {
  nodes: NewsItem[];
  pageInfo: {
    endCursor: string | null;
    hasNextPage: boolean;
  };
}

export function extractFirstImage(content: string): string | null {
  const cleanContent = sanitizeHtml(content, {
    allowedTags: ['img'],
    allowedAttributes: {
      img: ['src'],
    },
  });
  const match = /<img[^>]+src=['"]([^'"]+)['"]/.exec(cleanContent);
  return match ? match[1] : null;
}

export function getFillerImage(id: string): string {
  const fillers = [
    '/fillers/filler1.jpg',
    '/fillers/filler2.jpg',
    '/fillers/filler3.jpg',
  ];
  let sum = 0;
  for (let i = 0; i < id.length; i++) {
    sum += id.codePointAt(i) || 0;
  }
  return fillers[sum % fillers.length];
}

export function createExcerpt(content: string): string {
  const MAXLENGTH = 150;
  if (!content) return '';
  // Convert HTML to plain text, skipping images
  const cleanText = htmlToText(content, {
    wordwrap: false,
    selectors: [{ selector: 'img', format: 'skip' }],
    // decodeEntities is true by default
  })
    .replace(/\s+/g, ' ')
    .trim();
  if (cleanText.length <= MAXLENGTH) return cleanText;
  return cleanText.slice(0, MAXLENGTH) + '...';
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
    .format(date)
    .replaceAll('/', '-');
}

export async function fetchNewsData(
  nrItems: number = 12,
  afterCursor: string | null = null,
): Promise<NewsResponse> {
  try {
    const query = `
      query GetNewsItems($first: Int!, $after: String) {
        posts(first: $first, after: $after, where: {categoryNotIn: "9"}) {
          pageInfo {
            endCursor
            hasNextPage
          }
          nodes {
            id
            title
            content
            date
            author { node { firstName } }
          }
        }
      }
    `;

    const variables = {
      first: nrItems,
      after: afterCursor || null,
    };

    const result = await fetchAPI(query, variables);
    return result.posts;
  } catch (e) {
    console.error('Error fetching news:', e);
    return { nodes: [], pageInfo: { endCursor: null, hasNextPage: false } };
  }
}
