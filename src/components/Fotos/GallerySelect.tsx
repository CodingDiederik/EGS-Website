import {
  fetchPhotoIds,
  fetchFolders,
  removeEmptyFolders,
  fetchPhoto,
} from '@/lib/wordpress/photos';
import Image from 'next/image';
import Link from 'next/link';
import styles from './GallerySelect.module.css';

export default async function GallerySelect() {
  const folders = await fetchFolders();
  const filteredFolders = removeEmptyFolders(folders);

  // Fetch previews for all folders
  const foldersWithPreview = await Promise.all(
    filteredFolders.map(async (folder) => {
      const photoIds = await fetchPhotoIds(folder.id);
      const photoId = photoIds && photoIds.length > 0 ? photoIds[0] : null;
      const preview = await fetchPhoto(photoId);
      return { folder, preview };
    }),
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        {foldersWithPreview.map(({ folder, preview }) => (
          <Link
            href={`/fotos/${folder.id}`}
            key={folder.id}
            className={styles.cardLink}
          >
            <div className={styles.folder}>
              {preview ? (
                <div className={styles.preview}>
                  <Image
                    src={preview.src}
                    alt={preview.alt}
                    fill
                    className={styles.previewImage}
                    sizes="(max-width: 768px) 100vw, 320px"
                    priority
                  />
                </div>
              ) : (
                <div className={`${styles.preview} ${styles.previewEmpty}`}>
                  <span className={styles.previewEmptyText}>
                    Geen afbeelding
                  </span>
                </div>
              )}
              <h2 className={styles.title}>{folder.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
