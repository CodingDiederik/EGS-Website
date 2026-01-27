import Image from 'next/image';
import styles from './TrainerProfile.module.css';

interface TrainerProfileProps {
  name: string;
  imageSrc?: string;
  bio: string;
  objectPosition?: string;
  scale?: number;
}

export default function TrainerProfile({
  name,
  imageSrc,
  bio,
  objectPosition = '50% 50%',
  scale = 1,
}: Readonly<TrainerProfileProps>) {
  const effectiveImageSrc = imageSrc ?? '/trainer/person.jpg';

  return (
    <div className={styles.trainerProfile}>
      <div className={styles.trainerImage}>
        <Image
          src={effectiveImageSrc}
          alt={`Foto van trainer ${name}`}
          width={150}
          height={150}
          className={styles.image}
          style={{ objectPosition, transform: `scale(${scale})` }}
        />
      </div>
      <h2 className={styles.trainerName}>{name}</h2>
      <p className={styles.trainerBio}>{bio}</p>
    </div>
  );
}
