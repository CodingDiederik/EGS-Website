import Link from 'next/link';
import Image from 'next/image';
import styles from './NewsSection.module.css';
import { fetchAPI } from '@/getter/fetch';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: Date;
  author: {
    node: {
      firstName: string;
    };
  } | null;
}

/**
 * Extract the first image src from HTML content string
 */
function extractFirstImage(content: string): string | null {
  const match = /<img[^>]+src=['"]([^'"]+)['"]/.exec(content);
  return match ? match[1] : null;
}

/**
 * Select a filler image based on ID (deterministic)
 */
function getFillerImage(id: string): string {
  const fillers = [
    '/fillers/filler1.jpg',
    '/fillers/filler2.jpg',
    '/fillers/filler3.jpg',
  ];

  // Convert string hash to a number
  let sum = 0;
  for (let i = 0; i < id.length; i++) {
    sum += id.codePointAt(i) || 0;
  }

  // Modulo operator ensures we cycle through the 3 images endlessly
  return fillers[sum % fillers.length];
}

function createExcerpt(content: string): string {
  const MAXLENGTH = 150;
  let cleanText = content.replace(/<img[^>]*>/g, '').replace(/<[^>]*>/g, '');
  cleanText = cleanText
    .replaceAll(/&nbsp;/g, ' ')
    .replaceAll(/&amp;/g, '&')
    .replaceAll(/\s+/g, ' ')
    .trim();

  if (cleanText.length <= MAXLENGTH) return cleanText;
  return cleanText.slice(0, MAXLENGTH) + '...';
}

function formatDate(dateString: Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
    .format(date)
    .replaceAll(/\//g, '-');
}

async function fetchNewsData(): Promise<NewsItem[]> {
  try {
    const query = `
      query GetNewsItems {
        posts(first: 6, where: {categoryNotIn: "9"}) {
          nodes {
            id, title, content, date
            author { node { firstName } }
          }
        }
      }
    `;
    const data = await fetchAPI(query);
    return data.posts.nodes;
  } catch (e) {
    console.error('Error fetching news:', e);
    return [];
  }
}

const NewsSection: React.FC = async () => {
  const newsItems = await fetchNewsData();

  return (
    <section id="news" className={styles['content-section']}>
      <h2>Recent nieuws</h2>
      <div className={styles['news-grid']}>
        {newsItems.map((item) => {
          // 1. Try to get image from content
          const extractedUrl = extractFirstImage(item.content);

          // 2. If no image found, use the filler function
          const displayImage = extractedUrl || getFillerImage(item.id);

          const excerpt = createExcerpt(item.content);
          const authorName = createExcerpt(
            item.author?.node?.firstName || 'Jeugdsecretaris',
          );

          return (
            <article key={item.id} className={styles['news-card']}>
              <div className={styles['card-image-wrapper']}>
                <Image
                  src={displayImage}
                  alt="Plaatje bij nieuwsartikel"
                  fill
                  className={styles['card-image']}
                  // Important: If using external WP images + local fillers,
                  // Next.js handles optimization automatically for both.
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <span className={styles['news-date']}>
                  {formatDate(item.date)}
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
    </section>
  );
};

export default NewsSection;
