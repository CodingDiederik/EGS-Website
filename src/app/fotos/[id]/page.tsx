import {
  fetchPhotoIds,
  PhotoDetails,
  getFolderTitle,
  fetchFolders,
} from '@/lib/filebird/photos';
import PhotoGalleryClient from '@/components/Fotos/PhotoGallery/PhotoGallery';
import './page.css';
import { fetchPhotos } from '@/lib/graphql/services/photos';
import { notFound } from 'next/navigation';
import {
  removeEmptyFolders,
  EXCLUDED_FOLDER_IDS,
} from '@/lib/services/gallerySelect';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/siteConfig';

type PhotoPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: Readonly<PhotoPageProps>): Promise<Metadata> {
  const { id: idParam } = await params;
  const numericId = Number(idParam);

  if (!Number.isFinite(numericId) || EXCLUDED_FOLDER_IDS.includes(numericId)) {
    return {
      title: "Foto's niet gevonden",
      robots: { index: false, follow: false },
    };
  }

  const title = (await getFolderTitle(numericId)) ?? "Foto's";

  return buildMetadata({
    title,
    description: `Bekijk foto's van ${title} bij de jeugdafdeling van Schaakclub EGS Goirle.`,
    path: `/fotos/${idParam}`,
  });
}

async function loadPhotos(id: number): Promise<PhotoDetails[] | null> {
  try {
    const photoIds = await fetchPhotoIds(id);
    return await fetchPhotos(photoIds);
  } catch (error) {
    console.error(`Failed to load photos for folder ${id}`, error);
    return null;
  }
}

export default async function PhotoPage({ params }: Readonly<PhotoPageProps>) {
  const { id: idParam } = await params;
  const numericId = Number(idParam);
  const id = Number.isFinite(numericId) ? numericId : null;

  if (id == null || EXCLUDED_FOLDER_IDS.includes(id)) {
    notFound();
  }

  let mediaItems: PhotoDetails[] | null = null;
  let title: string | null = null;
  try {
    mediaItems = await loadPhotos(id);
    title = await getFolderTitle(id);
  } catch (error) {
    console.error(`Failed to load data for folder ${id}`, error);
  }

  return (
    <div className="photo-page">
      <PhotoGalleryClient id={id} mediaItems={mediaItems} title={title} />
    </div>
  );
}

export async function generateStaticParams() {
  const folderIds = await fetchFolders();
  const folderIdsFiltered = removeEmptyFolders(folderIds);
  const ids = folderIdsFiltered.map((folder) => ({ id: folder.id.toString() }));
  return ids;
}

export const dynamicParams = true;

export const revalidate = 600;
