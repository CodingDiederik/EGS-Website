import HeroGallery from './Gallery/HeroGallery';
import styles from './HomePage.module.css';
import NewsSection from './News/NewsSection';
import MainContentWrapper from './MainContentWrapper';

const HomePage: React.FC = async () => {
  return (
    <div className={styles['home-container']}>
      <div className={styles['photo-overview']}>
        <HeroGallery />
      </div>
      <MainContentWrapper>
        {/* Recent Nieuws sectie */}
        <main className={styles['main-content']}>
          <NewsSection />
        </main>
      </MainContentWrapper>
    </div>
  );
};

export default HomePage;
