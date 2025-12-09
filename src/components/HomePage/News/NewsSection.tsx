import Link from 'next/link';
import styles from './NewsSection.module.css';
import { fetchAPI } from '@/getter/fetch';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: Date;
  author: {
    node: {
      lastName: string;
    };
  } | null;
}

/**
 * Function to convert the content to show only the first part
 * @param content
 * @returns
 */
function convertContent(content: string): string {
  const MAXLENGTH = 200; // Maximum length of the preview
  // The string contains <p> and </p> tags from Wordpress, so we need to remove them
  content = content.replaceAll(/<[^>]*>?/gm, '').trim();
  if (content.length <= MAXLENGTH) {
    return content;
  }
  return content.slice(0, MAXLENGTH) + '...';
}

/**
 * Function to convert the data format to only show dd-mm-yyyy
 * @param dateString
 * @returns string in format dd-mm-yyyy
 */
function convertDate(dateString: Date): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Function to fetch news data from the backend
 * @returns the news data as an array of NewsItem objects
 */
async function fetchNewsData(): Promise<NewsItem[]> {
  try {
    const query = `
      query {
        posts(first: 6) {
          nodes {
            id
            title
            excerpt
            date
            author {
              node {
                lastName
              }
            }
          }
        }
      }
    `;

    const data = await fetchAPI(query);
    return data.posts.nodes;
  } catch {
    return [];
  }
}

const NewsSection: React.FC = async () => {
  const newsItems = await fetchNewsData();

  return (
    <section id="news" className={styles['content-section']}>
      <h2>Recent nieuws</h2>
      <div className={styles['news-grid']}>
        {newsItems.map((item) => (
          <article key={item.id} className={styles['news-card']}>
            <span className={styles['news-date']}>
              {convertDate(item.date)}
            </span>
            <h3>{item.title}</h3>
            <span className={styles['news-separator']}>
              <span className={styles['news-author']}>
                {item.author?.node?.lastName ?? ' '}
              </span>
            </span>
            <p>{convertContent(item.excerpt)}</p>
            <Link href={`/nieuws/${item.id}`} className={styles['read-more']}>
              Lees verder &rarr;
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
