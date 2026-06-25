import { fetchGraphQL } from '../client';

/**
 * WordPress category IDs that must never surface as news articles. The news
 * list and the statically generated article pages exclude the exact same set,
 * so the listed posts and the pre-rendered/sitemapped posts stay in sync.
 */
export const EXCLUDED_NEWS_CATEGORY_IDS = ['2', '9'];

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
      query GetNewsItems($first: Int!, $after: String, $exclude: [ID]) {
        posts(first: $first, after: $after, where: {categoryNotIn: $exclude}) {
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
      exclude: EXCLUDED_NEWS_CATEGORY_IDS,
    };

    const result: { posts: NewsResponse } = await fetchGraphQL(
      query,
      { next: { revalidate: 600, tags: ['news'] } },
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

  const data: { post: NewsPost } = await fetchGraphQL(
    query,
    { next: { revalidate: 600, tags: ['newspost'] } },
    { slug: sanitizedSlug },
  );

  return data.post as NewsPost;
}

export async function fetchNewsArticleSlugs(): Promise<{ slug: string }[]> {
  const query = `
    query GetAllPostSlugs($exclude: [ID]) {
      posts(first: 100, where: {categoryNotIn: $exclude}) {
        nodes {
          slug
        }
      }
    }
  `;

  try {
    const data: { posts: { nodes: { slug: string }[] } } = await fetchGraphQL(
      query,
      { next: { revalidate: 600, tags: ['newspost-slugs'] } },
      { exclude: EXCLUDED_NEWS_CATEGORY_IDS },
    );
    return data.posts.nodes;
  } catch (error) {
    console.error('Error fetching news article slugs:', error);
    return [];
  }
}
