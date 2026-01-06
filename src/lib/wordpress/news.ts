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

export async function fetchAndSanitizeNews(slug: string): Promise<NewsPost> {
  const query = `
    query GetPostBySlug {
      post(id: "${slug}", idType: SLUG) {
        id
        databaseId
        title
        date
        content
        author { node { firstName } }
      }
  }`;

  const data = await fetchAPI(query);

  return data.post;
}
