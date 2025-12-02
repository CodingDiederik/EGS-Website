import './NewsSection.css';
import { fetchAPI } from '@/getter/fetch';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: Date;
  author: {
    node: {
      lastName: string;
    };
  };
}

/**
 * Function to convert the content to show only the first part
 * @param content
 * @returns
 */
function convertContent(content: string): string {
  const MAXLENGTH = 200; // Maximum length of the preview
  // The string contains <p> and </p> tags from Wordpress, so we need to remove them
  content = content.replace(/<\/?p>/g, '').trim();
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
            content
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
    <section id="news" className="content-section">
      <h2>Recent nieuws</h2>
      <div className="news-grid">
        {newsItems.map((item) => (
          <article key={item.id} className="news-card">
            <span className="news-date">{convertDate(item.date)}</span>
            <h3>{item.title}</h3>
            <span className="news-separator">
              <span className="news-author">{item.author.node.lastName}</span>
            </span>
            <p>{convertContent(item.content)}</p>
            <a href={`/articles/${item.id}`} className="read-more">
              Lees verder &rarr;
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
