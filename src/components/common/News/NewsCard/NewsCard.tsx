import Image from 'next/image';
import { useState } from 'react';
import {
  extractFirstImage,
  getFillerImage,
  formatDate,
  createExcerpt,
} from '@/lib/services/newsSection';
import { NewsItem } from '@/lib/graphql/services/news';
import styles from './NewsCard.module.css';
import Link from 'next/link';

export default function NewsCard({ item }: { item: Readonly<NewsItem> }) {
  const extractedUrl = extractFirstImage(item.content || '');
  const displayImage = extractedUrl || getFillerImage(item.id || 'default');
  const excerpt = createExcerpt(item.content || '');
  const authorName = createExcerpt(
    item.author?.node?.firstName || 'Jeugdsecretaris',
  );
  const [imgSrc, setImgSrc] = useState(displayImage);

  return (
    <article className={styles['news-card']}>
      <div className={styles['card-image-wrapper']}>
        <Image
          src={imgSrc}
          alt={item.title || 'Nieuwsafbeelding'}
          fill
          className={styles['card-image']}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => {
            setImgSrc(getFillerImage(item.id || 'default'));
          }}
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
        <Link href={`/nieuws/${item.slug}`} className={styles['read-more']}>
          Lees verder &rarr;
        </Link>
      </div>
    </article>
  );
}
