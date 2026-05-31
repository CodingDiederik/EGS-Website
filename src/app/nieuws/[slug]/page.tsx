import styles from './NewsPage.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { sanitizeHtml } from '@/lib/sanitize';
import {
  fetchNewsArticle,
  fetchNewsArticleSlugs,
} from '@/lib/graphql/services/news';
import { notFound } from 'next/navigation';

type NewsPageProps = {
  params: Promise<{ slug: string }>;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default async function NewsPage({ params }: Readonly<NewsPageProps>) {
  const { slug } = await params;

  const newsArticleData = await fetchNewsArticle(slug);

  // check if newsArticleData exists, if not display 404 page
  if (!newsArticleData) {
    return notFound();
  }

  // Extract the first image
  const imgRegex =
    /<figure[^>]*wp-block-image[^>]*>.*?<img[^>]*src="([^"]+)"[^>]*>.*?<\/figure>/;
  const match = imgRegex.exec(newsArticleData.content);

  // Ensure we use https to avoid mixed-content blocking
  let heroImageSrc;
  if (match) {
    if (match[1].startsWith('http://')) {
      heroImageSrc = match[1].replace('http://', 'https://');
    } else {
      heroImageSrc = match[1];
    }
  } else {
    heroImageSrc = null;
  }

  // Remove the extracted image block from the content
  let contentHtml = newsArticleData.content;
  if (match) {
    contentHtml = contentHtml.replace(match[0], '');
  }

  // Sanitize the remaining HTML
  const cleanContent = sanitizeHtml(contentHtml);

  return (
    <article className={styles.newsArticle}>
      <header className={styles.header}>
        <div className={styles.metaContainer}>
          <time className={styles.date} dateTime={newsArticleData.date}>
            {formatDate(newsArticleData.date)}
          </time>

          <Link href="/nieuws">
            <button className={styles.backButton}>Terug naar nieuws</button>
          </Link>
        </div>

        <h1>{newsArticleData.title}</h1>
      </header>

      {heroImageSrc && (
        <div className={styles.imageContainer}>
          <Image
            src={heroImageSrc}
            alt={newsArticleData.title}
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

      <div
        className={styles.articleBody}
        dangerouslySetInnerHTML={{ __html: cleanContent }}
      />
    </article>
  );
}

export async function generateStaticParams() {
  const posts = await fetchNewsArticleSlugs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export const dynamicParams = true;

export const revalidate = 600;
