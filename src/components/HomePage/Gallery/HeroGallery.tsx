import React from 'react';
import Image from 'next/image';
import styles from './HeroGallery.module.css';
import { getPhotosHomepage } from '@/lib/homepage';

const { track1Images, track2Images, track3Images } = getPhotosHomepage();

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
              aria-hidden="true"
            >
              <Image
                src={src}
                alt=""
                fill
                className={styles.image}
                sizes="(max-width: 480px) 260px, 380px"
                priority={index < 3}
              />
            </div>
          ))}
        </div>

        <div className={styles.trackSeparator} aria-hidden="true" />

        {/* Track 2: Scrolls Left-to-Right (Slow) */}
        <div
          className={`${styles.imageTrack} ${styles.scrollLeftToRight} ${styles.track2}`}
        >
          {allTrack2Images.map((src, index) => (
            <div
              key={`track2-${src}-${index}`}
              className={styles.imageWrapper}
              aria-hidden="true"
            >
              <Image
                src={src}
                alt=""
                fill
                className={styles.image}
                sizes="(max-width: 480px) 260px, 380px"
                priority={index < 3}
              />
            </div>
          ))}
        </div>

        <div className={styles.trackSeparator} aria-hidden="true" />

        {/* Track 3: Scrolls Right-to-Left (Medium) */}
        <div
          className={`${styles.imageTrack} ${styles.scrollRightToLeft} ${styles.track3}`}
        >
          {allTrack3Images.map((src, index) => (
            <div
              key={`track3-${src}-${index}`}
              className={styles.imageWrapper}
              aria-hidden="true"
            >
              <Image
                src={src}
                alt=""
                fill
                className={styles.image}
                sizes="(max-width: 480px) 260px, 380px"
                priority={index < 3}
              />
            </div>
          ))}
        </div>

        <div className={styles.trackSeparator} aria-hidden="true" />
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
