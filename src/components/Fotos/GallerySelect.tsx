import { fetchFolders, removeEmptyFolders } from '@/lib/wordpress/photos';
import Link from 'next/link';
import styles from './GallerySelect.module.css';

export default async function GallerySelect() {
  const folders = await fetchFolders();
  const cleanedFolders = removeEmptyFolders(folders);
  const sortedFolders = cleanedFolders.slice().sort((a, b) => {
    const na = Number(a.id);
    const nb = Number(b.id);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return nb - na;
    return String(a.id).localeCompare(String(b.id));
  });

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        {sortedFolders.map((folder) => (
          <Link
            href={`/fotos/${folder.id}`}
            key={folder.id}
            className={styles.cardLink}
          >
            <div className={styles.folder}>
              <h2 className={styles.title}>{folder.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
