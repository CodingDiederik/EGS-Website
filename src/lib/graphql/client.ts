/**
 * Function to fetch data from the backend GraphQL endpoint. (Wordpress)
 * @param query GraphQL query string
 * @param variables Optional variables for the GraphQL query
 * @param options Optional fetch options
 * @returns
 */
export async function fetchGraphQL<TResult, TVariables = unknown>(
  query: string,
  variables?: TVariables,
  options?: RequestInit & { next?: NextFetchRequestConfig },
): Promise<TResult> {
  // Check environment variables
  const envError = checkEnvironmentVariables();
  if (envError) {
    throw new Error(envError);
  }

  // Prepare authorization header, used by Wordpress basic auth
  const auth = Buffer.from(
    `${process.env.WP_USERNAME}:${process.env.WP_PASSWORD}`,
  ).toString('base64');

  const response = await fetch(`${process.env.BACKEND_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    credentials: 'include',
    ...options,
  });

  if (!response.ok) {
    const errorMsg = `HTTP error! status: ${response.status} statusText: ${response.statusText} body: ${await response.text()}`;
    throw new Error(errorMsg);
  }

  // extract data
  const json = await response.json();

  if (json.errors) {
    const errorMessage = json.errors.map((e: any) => e.message).join('\n');
    throw new Error(`GraphQL Error: ${errorMessage}`);
  }

  if (!json.data) {
    throw new Error('No data received from GraphQL API');
  }

  return json.data;
}

function checkEnvironmentVariables(): string | null {
  if (!process.env.WP_USERNAME || !process.env.WP_PASSWORD) {
    return 'Missing WordPress credentials: WP_USERNAME and WP_PASSWORD must be set';
  }

  if (!process.env.BACKEND_URL) {
    return 'Missing BACKEND_URL environment variable';
  }

  return null;
}
