'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { loadMoreNews } from '@/app/actions';
import {
  NewsItem,
  extractFirstImage,
  getFillerImage,
  createExcerpt,
  formatDate,
} from '@/lib/news';
import styles from './NewsSection.module.css'; // Make sure this path is correct

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
        {posts.map((item) => {
          const extractedUrl = extractFirstImage(item.content || '');
          const displayImage =
            extractedUrl || getFillerImage(item.id || 'default');
          const excerpt = createExcerpt(item.content || '');
          const authorName = createExcerpt(
            item.author?.node?.firstName || 'Jeugdsecretaris',
          );

          return (
            <article key={item.id} className={styles['news-card']}>
              <div className={styles['card-image-wrapper']}>
                <Image
                  src={displayImage}
                  alt={item.title || 'Nieuwsafbeelding'}
                  fill
                  className={styles['card-image']}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <span className={styles['news-date']}>
                  {formatDate(item.date || new Date().toISOString())}
                </span>
              </div>

              <div className={styles['card-content']}>
                <h3>{item.title}</h3>
                <span className={styles['news-meta']}>
                  <span className={styles['news-author']}>{authorName}</span>
                </span>
                <p>{excerpt}</p>
                <Link
                  href={`/nieuws/${item.id}`}
                  className={styles['read-more']}
                >
                  Lees verder &rarr;
                </Link>
              </div>
            </article>
          );
        })}
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
