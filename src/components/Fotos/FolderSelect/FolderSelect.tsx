import { fetchPhotoIds, fetchFolders } from '@/lib/filebird/photos';
import Image from 'next/image';
import Link from 'next/link';
import { fetchPhoto } from '@/lib/graphql/services/photos';
import { removeEmptyFolders } from '@/lib/services/gallerySelect';
import styles from './FolderSelect.module.css';

export default async function FolderSelect() {
  // None of these fetches throw; an unavailable backend yields no folders,
  // which renders as an empty state instead of breaking the build.
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

  if (foldersWithPreview.length === 0) {
    return (
      <div className={styles.wrap}>
        <p className={styles.emptyState}>
          Er zijn op dit moment geen fotoalbums beschikbaar. Kom later nog eens
          terug.
        </p>
      </div>
    );
  }

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
