import Image from 'next/image';
import styles from './TrainerProfile.module.css';

type TrainerProfileProps = {
  name: string;
  imageSrc?: string;
  bio: string;
};

export default function TrainerProfile({
  name,
  imageSrc,
  bio,
}: Readonly<TrainerProfileProps>) {
  const effectiveImageSrc = imageSrc ?? '/trainer/person.jpg';

  return (
    <div className={styles.trainerProfile}>
      <div className={styles.trainerImage}>
        <Image
          src={effectiveImageSrc}
          alt={`Foto van trainer ${name}`}
          width={200}
          height={200}
          className={styles.image}
        />
      </div>
      <h2 className={styles.trainerName}>{name}</h2>
      <p className={styles.trainerBio}>{bio}</p>
    </div>
  );
}
