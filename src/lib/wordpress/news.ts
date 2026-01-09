import { fetchAPI } from './articles';

interface NewsPost {
  id: string;
  databaseId: number;
  title: string;
  date: string;
  content: string;
  author?: {
    node?: {
      firstName?: string;
    };
  } | null;
}

function sanitizeSlug(slug: string | null | undefined): string {
  if (!slug) return '';
  return slug.toString().replaceAll(/[^a-zA-Z0-9-_]/g, '');
}

export async function fetchAndSanitizeNews(
  slug: string | null | undefined,
): Promise<NewsPost | null> {
  const sanitizedSlug = sanitizeSlug(slug);

  if (!sanitizedSlug) {
    return null;
  }

  const query = `
    query GetPostBySlug {
      post(id: "${sanitizedSlug}", idType: SLUG) {
        id
        databaseId
        title
        date
        content
        author { node { firstName } }
      }
  }`;

  let data;
  try {
    data = await fetchAPI(query);
  } catch (error) {
    console.error('Error fetching news article:', error);
    return null;
  }

  return data.post as NewsPost;
}
