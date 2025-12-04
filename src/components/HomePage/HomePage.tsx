import HeroGallery from './Gallery/HeroGallery';
import './HomePage.css';
import NewsSection from './News/NewsSection';

const HomePage: React.FC = async () => {
  return (
    <div className="home-container">
      <div className="photo-overview">
          <HeroGallery />
        </div>
        {/* Recent Nieuws sectie */}
        <main className="main-content">
          <NewsSection />
        </main>
    </div>
  );
};

export default HomePage;
