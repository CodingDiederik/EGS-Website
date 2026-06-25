/**
 * Default timeout (ms) for outbound fetches to the WordPress GraphQL backend
 * and the FileBird REST API. Without it a slow or unresponsive upstream would
 * hang page rendering indefinitely; with it the fetch rejects and the caller's
 * error handling / error boundary takes over.
 */
export const FETCH_TIMEOUT_MS = 10_000;
