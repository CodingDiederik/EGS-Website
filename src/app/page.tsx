import type { Metadata } from 'next';
import styles from './Home.module.css';
import HeroGallery from '@/components/HomePage/Gallery/HeroGallery';
import NewsSection from '@/components/common/News/NewsSection/NewsSection';
import MainContentWrapper from '@/components/HomePage/MainContentWrapper';

// Title and Open Graph cards are inherited from the root layout defaults; only
// the canonical URL is page-specific here.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <div className={styles['home-container']}>
      <HeroGallery />

      <MainContentWrapper>
        <main className={styles['main-content']}>
          <h2>Recent nieuws</h2>
          <NewsSection count={6} />
        </main>
      </MainContentWrapper>
    </div>
  );
}
