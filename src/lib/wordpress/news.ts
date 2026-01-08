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

function sanitizeSlug(slug: string): string {
  return slug.replaceAll(/[^a-zA-Z0-9-_]/g, '');
}

export async function fetchAndSanitizeNews(
  slug: string,
): Promise<NewsPost | null> {
  const sanitizedSlug = sanitizeSlug(slug);

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
