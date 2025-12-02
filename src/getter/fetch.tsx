/**
 * Function to fetch data from the backend GraphQL endpoint. (Wordpress)
 * @param query GraphQL query string
 * @returns
 */
export async function fetchAPI(query: string) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  if (!process.env.WP_USERNAME || !process.env.WP_PASSWORD) {
    throw new Error(
      'Missing WordPress credentials: WP_USERNAME and WP_PASSWORD must be set',
    );
  }

  if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    throw new Error('Missing NEXT_PUBLIC_BACKEND_URL environment variable');
  }

  try {
    const auth = Buffer.from(
      `${process.env.WP_USERNAME}:${process.env.WP_PASSWORD}`,
    ).toString('base64');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({ query }),
      credentials: 'include',
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const errorMsg = `HTTP error! status: ${response.status} statusText: ${response.statusText}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    // extract data
    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error('GraphQL error occurred');
    }

    if (!json.data) {
      throw new Error('No data received from GraphQL API');
    }

    return json.data;
  } catch (error) {
    console.error('Error fetching news data:', error);
    throw new Error(
      `Error fetching data: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
