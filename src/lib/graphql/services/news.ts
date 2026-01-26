import { fetchGraphQL } from '../client';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  slug: string;
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
            slug
            author { node { firstName } }
          }
        }
      }
    `;

    const variables = {
      first: nrItems,
      after: afterCursor || null,
    };

    const result: { posts: NewsResponse } = await fetchGraphQL(
      query,
      { next: { revalidate: 3600, tags: ['news'] } },
      variables,
    );
    return result.posts;
  } catch (e) {
    console.error('Error fetching news:', e);
    return { nodes: [], pageInfo: { endCursor: null, hasNextPage: false } };
  }
}

function sanitizeSlug(slug: string | null | undefined): string {
  if (!slug) return '';
  return slug.toString().replaceAll(/[^a-zA-Z0-9-_]/g, '');
}

export async function fetchNewsArticle(
  slug: string | null | undefined,
): Promise<NewsPost | null> {
  const sanitizedSlug = sanitizeSlug(slug);

  if (!sanitizedSlug) {
    return null;
  }

  const query = `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        databaseId
        title
        date
        content
        author { node { firstName } }
      }
  }`;

  try {
    const data: { post: NewsPost } = await fetchGraphQL(
      query,
      { next: { revalidate: 3600, tags: ['newspost'] } },
      { slug: sanitizedSlug },
    );
    return data.post as NewsPost;
  } catch (error) {
    console.error('Error fetching news article:', error);
    return null;
  }
}
