import React from 'react';
import Image from 'next/image'; // Import next/image for optimized logo
import styles from './HeroGallery.module.css';

// --- Track 1 Images ---
const track1Images = [
  'https://images.pexels.com/photos/2703461/pexels-photo-2703461.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1007021/pexels-photo-1007021.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1363874/pexels-photo-1363874.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=800',
];

// --- Track 2 Images ---
const track2Images = [
  'https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2193300/pexels-photo-2193300.jpeg?auto=compress&cs=tinysrgb&w=800',
];

// --- Track 3 Images ---
const track3Images = [
  'https://images.pexels.com/photos/1586973/pexels-photo-1586973.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3748221/pexels-photo-3748221.jpeg?auto=compress&cs=tinysrgb&w=800',
];

// Duplicate images for seamless looping
const allTrack1Images = [...track1Images, ...track1Images];
const allTrack2Images = [...track2Images, ...track2Images];
const allTrack3Images = [...track3Images, ...track3Images];

const HeroGallery: React.FC = () => {
  return (
    <section className={styles.heroGallery}>
      {/* Background container with blur */}
      <div className={styles.backgroundContainer}>
        {/* Track 1: Scrolls Right-to-Left (Fast) */}
        <div
          className={`${styles.imageTrack} ${styles.scrollRightToLeft} ${styles.track1}`}
        >
          {allTrack1Images.map((src, index) => (
            <div
              key={`track1-${src}-${index}`}
              className={styles.imageWrapper}
              style={{ backgroundImage: `url(${src})` }}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Track 2: Scrolls Left-to-Right (Slow) */}
        <div
          className={`${styles.imageTrack} ${styles.scrollLeftToRight} ${styles.track2}`}
        >
          {allTrack2Images.map((src, index) => (
            <div
              key={`track2-${src}-${index}`}
              className={styles.imageWrapper}
              style={{ backgroundImage: `url(${src})` }}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Track 3: Scrolls Right-to-Left (Medium) */}
        <div
          className={`${styles.imageTrack} ${styles.scrollRightToLeft} ${styles.track3}`}
        >
          {allTrack3Images.map((src, index) => (
            <div
              key={`track3-${src}-${index}`}
              className={styles.imageWrapper}
              style={{ backgroundImage: `url(${src})` }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Foreground content */}
      <div className={styles.foregroundContent}>
        <div className={styles.textBox}>
          <div className={styles.logoWrapper}>
            <Image
              src="/EGS-logo.png"
              alt="Schaakclub EGS Logo"
              width={180}
              height={180}
              className={styles.logo}
            />
          </div>

          <div className={styles.textContent}>
            <h1>
              Welkom bij de jeugdafdeling van de Eerste Goirlese Schaakclub!
            </h1>
            <p className={styles.subtitle}>
              De gezelligste schaakclub van Goirle! <br />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroGallery;
