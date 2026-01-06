import styles from './NewsComponent.module.css';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from "isomorphic-dompurify";
import { fetchAndSanitizeNews } from '@/lib/wordpress/news';
import NotFound from '@/app/not-found';

// Helper to format the date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const NewsArticle = async ({ slug }: { slug: string }) => {
  const newsArticleData = await fetchAndSanitizeNews(slug);

  // check if newsArticleData exists, if not display 404 page
  if (!newsArticleData) {
    return (
      <div className={styles.NotFound}>
        <NotFound />
      </div>
    ); 
  }

  // 1. Extract the first image SRC using Regex
  const imgRegex = /<figure[^>]*wp-block-image[^>]*>.*?<img[^>]*src="([^"]+)"[^>]*>.*?<\/figure>/;
  const match = newsArticleData.content.match(imgRegex);
  const heroImageSrc = match ? match[1] : null;

  // 2. Remove the extracted image block from the content
  let contentHtml = newsArticleData.content;
  if (match) {
    contentHtml = contentHtml.replace(match[0], '');
  }

  // 3. Sanitize the remaining HTML
  const cleanContent = DOMPurify.sanitize(contentHtml);


  return (
    <article className={styles.newsArticle}>
      <header className={styles.header}>
        {/* Flex container for Date and Button */}
        <div className={styles.metaContainer}>
            <time className={styles.date} dateTime={newsArticleData.date}>
                {formatDate(newsArticleData.date)}
            </time>

            <Link href="/nieuws">
                <button className={styles.backButton}>
                  Terug naar nieuws
                </button>
            </Link>
        </div>

        <h1>{newsArticleData.title}</h1>
      </header>

      {/* Render Next.js Image with natural aspect ratio */}
      {heroImageSrc && (
        <div className={styles.imageContainer}>
          <Image 
            src={heroImageSrc} 
            alt={newsArticleData.title}
            // The following props + CSS make the image responsive without cropping
            width={0}
            height={0}
            sizes="100vw"
            className={styles.heroImage}
            priority
          />
        </div>
      )}

      <div className={styles.author}>
        {newsArticleData.author?.node?.firstName 
          ? `Geschreven door: ${newsArticleData.author.node.firstName.replaceAll('&amp;', '&')}` 
          : 'Geschreven door: EGS-Goirle'}
      </div>
      
      {/* Render the rest of the text */}
      <div 
        className={styles.articleBody}
        dangerouslySetInnerHTML={{ __html: cleanContent }} 
      />
    </article>
  );
};

export default NewsArticle;