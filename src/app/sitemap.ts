import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteConfig';
import { fetchNewsArticleSlugs } from '@/lib/graphql/services/news';
import { fetchFolders } from '@/lib/filebird/photos';
import { removeEmptyFolders } from '@/lib/services/gallerySelect';

const STATIC_PATHS = [
  '',
  '/over',
  '/agenda',
  '/nieuws',
  '/fotos',
  '/proefles',
  '/contact',
];

// Match the revalidation window used by the underlying data fetchers so the
// sitemap stays reasonably fresh without hitting WordPress on every request.
export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));

  let newsEntries: MetadataRoute.Sitemap = [];
  try {
    const slugs = await fetchNewsArticleSlugs();
    newsEntries = slugs.map(({ slug }) => ({
      url: `${SITE_URL}/nieuws/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Failed to build news sitemap entries', error);
  }

  let photoEntries: MetadataRoute.Sitemap = [];
  try {
    // removeEmptyFolders also strips the excluded folder ids.
    const folders = removeEmptyFolders(await fetchFolders());
    photoEntries = folders.map((folder) => ({
      url: `${SITE_URL}/fotos/${folder.id}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    }));
  } catch (error) {
    console.error('Failed to build photo sitemap entries', error);
  }

  return [...staticEntries, ...newsEntries, ...photoEntries];
}
