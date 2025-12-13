import Introduction from '@/components/common/IntroductionImage/IntroductionImage';
import './page.css';
import NewsSection from '@/components/common/News/NewsSection';

export default function Nieuws() {
  return (
    <div className="image-text">
      {/* Default introduction component*/}
      <Introduction text="Nieuws" />
      <div className="content-wrapper">
        <div className="spacer" />
        <NewsSection />
      </div>
    </div>
  );
}
