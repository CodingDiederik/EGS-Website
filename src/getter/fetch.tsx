/**
 * Function to fetch data from the backend GraphQL endpoint. (Wordpress)
 * @param query GraphQL query string
 * @returns
 */
export async function fetchAPI(query: string) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
      throw new Error('Failed to fetch news data');
    }

    // extract data
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching news data:', error);
    throw new Error('Error fetching data');
  }
}
