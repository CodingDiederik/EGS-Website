import {
  fetchPhotoIds,
  fetchPhotos,
  PhotoDetails,
  getFolderTitle,
} from '@/lib/wordpress/photos';
import PhotoGalleryClient from '@/components/Fotos/PhotoGalleryClient';
import './page.css';

type PhotoPageProps = {
  params: Promise<{ id: string }>;
};

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

  if (id == null) {
    return <PhotoGalleryClient id={null} mediaItems={null} title={null} />;
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
