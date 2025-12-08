import Image from 'next/image';
import './IntroductionImage.css';

const IntroductionImage: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="imagecard">
      <Image
        src="https://placehold.co/1920x500/png"
        alt="Proefles bij EGS Goirle"
        width={1920}
        height={500}
      />
      <h1>{text}</h1>
    </div>
  );
};

export default IntroductionImage;
