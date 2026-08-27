import type { Metadata } from 'next';
import * as cheerio from 'cheerio';
import styles from './NewsPage.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { sanitizeHtml } from '@/lib/sanitize';
import {
  fetchNewsArticle,
  fetchNewsArticleSlugs,
} from '@/lib/graphql/services/news';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/siteConfig';
import { isAllowedImageHost } from '@/lib/images';

type NewsPageProps = {
  params: Promise<{ slug: string }>;
};

// Decode HTML entities and strip markup from a WordPress string (titles often
// contain entities like &amp;).
const toPlainText = (html: string): string =>
  cheerio.load(html, null, false).root().text();

const buildExcerpt = (html: string, maxLength = 160): string => {
  const text = toPlainText(html).replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + '…';
};

const extractFirstImage = (html: string): string | null => {
  const src = cheerio.load(html, null, false)('img').first().attr('src');
  if (!src) return null;
  // Force https to avoid mixed-content blocking on social crawlers.
  return src.startsWith('http://') ? src.replace('http://', 'https://') : src;
};

export async function generateMetadata({
  params,
}: Readonly<NewsPageProps>): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchNewsArticle(slug);

  if (!article) {
    return {
      title: 'Artikel niet gevonden',
      robots: { index: false, follow: false },
    };
  }

  const title = toPlainText(article.title);
  const description = buildExcerpt(article.content);
  const image = extractFirstImage(article.content);

  return buildMetadata({
    title,
    description: description || undefined,
    path: `/nieuws/${slug}`,
    type: 'article',
    publishedTime: article.date,
    images: image ? [{ url: image, alt: title }] : undefined,
  });
}

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
          {isAllowedImageHost(heroImageSrc) ? (
            <Image
              src={heroImageSrc}
              alt={newsArticleData.title}
              width={0}
              height={0}
              sizes="100vw"
              className={styles.heroImage}
              priority
            />
          ) : (
            // WordPress can embed images from hosts that next/image isn't
            // configured for; rendering those through next/image would 500 the
            // page, so fall back to a plain <img>.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImageSrc}
              alt={newsArticleData.title}
              className={styles.heroImage}
            />
          )}
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
  return [];
}

export const dynamicParams = true;

export const revalidate = 600;
