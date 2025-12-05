import HeroGallery from './Gallery/HeroGallery';
import './HomePage.css';
import NewsSection from './News/NewsSection';
import MainContentWrapper from './MainContentWrapper';

const HomePage: React.FC = async () => {
  return (
    <div className="home-container">
      <div className="photo-overview">
          <HeroGallery />
        </div>
        <MainContentWrapper >
          {/* Recent Nieuws sectie */}
          <main className="main-content">
            <NewsSection />
          </main>
        </MainContentWrapper>
    </div>
  );
};

export default HomePage;
