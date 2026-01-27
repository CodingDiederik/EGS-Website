'use client';

import { NewsItem } from '@/lib/graphql/services/news';
import { useState } from 'react';
import NewsCard from '../NewsCard/NewsCard';
import { loadMoreNews } from '@/app/actions';
import styles from './NewsList.module.css';

interface NewsListProps {
  initialPosts: NewsItem[];
  initialCursor: string | null;
  initialHasNext: boolean;
  displayLoadMore?: boolean;
}

export default function NewsList({
  initialPosts,
  initialCursor,
  initialHasNext,
  displayLoadMore,
}: Readonly<NewsListProps>) {
  const [posts, setPosts] = useState<NewsItem[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasNext, setHasNext] = useState<boolean>(initialHasNext);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    if (!cursor || loading) return;
    setLoading(true);

    try {
      const newData = await loadMoreNews(cursor);

      // Append new posts to the list
      setPosts((prev) => [...prev, ...newData.nodes]);

      // Update cursor for the next fetch
      setCursor(newData.pageInfo.endCursor);
      setHasNext(newData.pageInfo.hasNextPage);
    } catch (error) {
      console.error('Failed to load more news', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles['news-grid']}>
        {posts.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {hasNext && displayLoadMore && (
        <div className={styles['pagination-wrapper']}>
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className={styles['load-more-btn']}
          >
            {loading ? 'Bezig met laden...' : 'Laad meer artikelen'}
          </button>
        </div>
      )}
    </>
  );
}
