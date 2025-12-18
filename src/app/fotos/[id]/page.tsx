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

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { id: idParam } = await params;
  const numericId = Number(idParam);
  const id = Number.isFinite(numericId) ? numericId : null;

  if (id == null) {
    return <PhotoGalleryClient id={null} mediaItems={null} title={null} />;
  }

  const mediaItems = await loadPhotos(id);
  const title = await getFolderTitle(id);

  return (
    <div className="photo-page">
      <PhotoGalleryClient id={id} mediaItems={mediaItems} title={title} />
    </div>
  );
}
