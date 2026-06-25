import type { Metadata } from 'next';

/**
 * Shared SEO configuration for the EGS jeugd website.
 *
 * The canonical production domain is jeugd.schaakclubegs.nl. It can be
 * overridden via NEXT_PUBLIC_SITE_URL (e.g. for preview deployments) without
 * touching code.
 */
export const SITE_NAME = 'Schaakclub EGS Goirle';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jeugd.schaakclubegs.nl'
).replace(/\/$/, '');

export const DEFAULT_TITLE = `${SITE_NAME} — Jeugdschaak in Goirle`;

export const SITE_DESCRIPTION =
  'De jeugdafdeling van de Eerste Goirlese Schaakclub (EGS) in Goirle: ' +
  'schaaklessen, gratis proeflessen, toernooien en gezellige activiteiten ' +
  'voor de jeugd.';

export type OgImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

export const DEFAULT_OG_IMAGE: OgImage = {
  url: '/common/schaken.jpg',
  width: 1386,
  height: 924,
  alt: 'Schaakstukken — Eerste Goirlese Schaakclub',
};

type BuildMetadataOptions = {
  /** Section title, e.g. "Nieuws". The site name is appended via the template. */
  title: string;
  description?: string;
  /** Absolute path of the page, e.g. "/nieuws". Used for canonical + OG url. */
  path: string;
  /** Defaults to the chess OG image when omitted. */
  images?: OgImage[];
  type?: 'website' | 'article';
  publishedTime?: string;
};

/**
 * Builds a complete per-page Metadata object. Next.js shallow-merges metadata
 * between segments, so nested objects (openGraph/twitter) are replaced rather
 * than merged — this helper re-applies the shared defaults so every page keeps
 * a full set of cards.
 */
export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  images = [DEFAULT_OG_IMAGE],
  type = 'website',
  publishedTime,
}: BuildMetadataOptions): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: 'nl_NL',
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: path,
      images,
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: images.map((image) => image.url),
    },
  };
}
