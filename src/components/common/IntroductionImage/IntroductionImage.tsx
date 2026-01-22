import Image from 'next/image';
import styles from './IntroductionImage.module.css';

const IntroductionImage: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className={styles.imagecard}>
      <Image
        src="/common/schaken.jpg"
        alt={`${text} bij EGS Goirle`}
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />
      <h1>{text}</h1>
    </div>
  );
};

export default IntroductionImage;
