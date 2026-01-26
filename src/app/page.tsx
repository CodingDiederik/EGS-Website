import styles from './Home.module.css';
import HeroGallery from '@/components/HomePage/Gallery/HeroGallery';
import NewsSection from '@/components/common/News/NewsSection/NewsSection';
import MainContentWrapper from '@/components/HomePage/MainContentWrapper';

export default function Home() {
  return (
    <div className={styles['home-container']}>
      <div className={styles['photo-overview']}>
        <HeroGallery />
      </div>

      <MainContentWrapper>
        <main className={styles['main-content']}>
          <h2>Recent nieuws</h2>
          <NewsSection count={6} />
        </main>
      </MainContentWrapper>
    </div>
  );
}
