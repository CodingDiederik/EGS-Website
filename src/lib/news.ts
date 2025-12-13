import { fetchAPI } from '@/getter/fetch';

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
  const match = /<img[^>]+src=['"]([^'"]+)['"]/.exec(content);
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
  const cleanText = content
    .replaceAll(/<img[^>]*>/g, '')
    .replaceAll(/<[^>]*>/g, '')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&amp;', '&')
    .replaceAll(/\s+/g, ' ')
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
    const interpolatedQuery = `
        query GetNewsItems {
          posts(first: ${nrItems}, after: "${afterCursor || ''}", where: {categoryNotIn: "9"}) {
            pageInfo {
                endCursor
                hasNextPage
            }
            nodes {
              id, title, content, date
              author { node { firstName } }
            }
          }
        }
    `;

    // Use the interpolated query
    const result = await fetchAPI(interpolatedQuery);
    return result.posts;
  } catch (e) {
    console.error('Error fetching news:', e);
    return { nodes: [], pageInfo: { endCursor: null, hasNextPage: false } };
  }
}
