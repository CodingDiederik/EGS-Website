import Image from 'next/image';
import styles from './IntroductionImage.module.css';

const IntroductionImage: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className={styles.imagecard}>
      <Image
        src="/1920x500.jpg"
        alt="Proefles bij EGS Goirle"
        width={1920}
        height={500}
      />
      <h1>{text}</h1>
    </div>
  );
};

export default IntroductionImage;
