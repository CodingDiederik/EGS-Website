'use server';

import { fetchNewsData } from '@/lib/graphql/services/news';

function isValidCursor(cursor: string): boolean {
  return (
    typeof cursor === 'string' && /^[A-Za-z0-9\-_+=/]{1,256}$/.test(cursor)
  );
}

export async function loadMoreNews(cursor: string) {
  // Validate cursor before using
  const safeCursor = isValidCursor(cursor) ? cursor : undefined;

  // Fetch the next 12 items after the cursor
  const data = await fetchNewsData(12, safeCursor);

  return data;
}
