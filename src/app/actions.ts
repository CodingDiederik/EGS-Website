'use server';

import { fetchNewsData } from '@/lib/news';

export async function loadMoreNews(cursor: string) {
  // Fetch the next 12 items after the cursor
  const data = await fetchNewsData(12, cursor);
  return data;
}
