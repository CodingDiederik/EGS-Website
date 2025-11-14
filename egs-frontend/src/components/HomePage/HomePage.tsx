import './HomePage.css';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  publicationDate: Date;
  publicAuthor: string;
}

/**
 * Function to convert the content to show only the first part
 * @param content 
 * @returns 
 */
function convertContent(content: string): string {
  const MAXLENGTH = 200; // Maximum length of the preview
  if (content.length <= MAXLENGTH) {
    return content;
  }
  if (content.charAt(MAXLENGTH) === ' ') {
    return content.slice(0, MAXLENGTH) + '...';
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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/recent`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    },
  );
  if (!response.ok) {
    throw new Error('Failed to fetch news data');
  }
  return response.json();
}

const HomePage: React.FC = async () => {
  const newsItems = await fetchNewsData();

  return (
    <div className="home-container">
      <div className="photo-overview"></div>

      {/* Recent Nieuws sectie */}
      <main className="main-content">
        <section id="news" className="content-section">
          <h2>Recent nieuws</h2>
          <div className="news-grid">
            {newsItems.map((item) => (
              <article key={item.id} className="news-card">
                <span className="news-date">{convertDate(item.publicationDate)}</span>
                <h3>{item.title}</h3>
                <span className="news-separator">
                  <span className="news-author">{item.publicAuthor}</span>
                </span>
                <p>{convertContent(item.content)}</p>
                <a href={process.env.NEXT_PUBLIC_FRONTEND_URL + "/articles/" + item.id.toString()} className="read-more">
                  Lees verder &rarr;
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
