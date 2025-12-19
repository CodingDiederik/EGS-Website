'use client';

import { PhotoDetails } from '@/lib/wordpress/photos';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  RenderImageContext,
  RenderImageProps,
  RowsPhotoAlbum,
} from 'react-photo-album';
import 'react-photo-album/rows.css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import styles from './GallerySelect.module.css';

function renderNextImage(
  { alt = '', title, sizes }: RenderImageProps,
  { photo, width, height }: RenderImageContext,
) {
  const photoSrc = typeof photo === 'string' ? photo : photo.src;

  return (
    <div
      style={{
        width: '100%',
        position: 'relative',
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <Image
        fill
        src={photoSrc}
        alt={alt}
        title={title}
        sizes={sizes}
        placeholder={
          typeof photo === 'object' && photo !== null && 'blurDataURL' in photo
            ? 'blur'
            : undefined
        }
      />
    </div>
  );
}

type PhotoGalleryClientProps = {
  id: number | null;
  mediaItems: PhotoDetails[] | null;
  title: string | null;
};

export default function PhotoGalleryClient({
  id,
  mediaItems,
  title,
}: Readonly<PhotoGalleryClientProps>) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const photos = (mediaItems ?? []).map((item) => ({
    src: item.src,
    width: Math.max(item.width, 250),
    height: Math.max(item.height, 250),
    alt: item.alt || 'Photo',
  }));
  const slides = useMemo(
    () =>
      photos.map((photo) => ({
        src: photo.src,
        width: photo.width,
        height: photo.height,
        alt: photo.alt,
      })),
    [photos],
  );
  const hasPhotos = photos.length > 0;

  let galleryContent;
  if (id == null) {
    galleryContent = (
      <div className="no-pictures">
        <h1>Ongeldig foto-album</h1>
        <p>Deze pagina kon geen geldige map-ID vinden.</p>
      </div>
    );
  } else if (hasPhotos) {
    galleryContent = (
      <>
        <div className={styles.heading}>
          <h1>{title ?? 'Foto-album'}</h1>
          {/* Button to return to gallery overview */}
          <button
            onClick={() => {
              window.location.href = '/fotos';
            }}
            className={styles['back-to-gallery-button']}
          >
            Terug naar foto-overzicht
          </button>
        </div>
        <RowsPhotoAlbum
          photos={photos}
          render={{ image: renderNextImage }}
          targetRowHeight={360}
          spacing={16}
          padding={8}
          defaultContainerWidth={1200}
          sizes={{
            size: '1168px',
            sizes: [
              {
                viewport: '(max-width: 1200px)',
                size: 'calc(100vw - 32px)',
              },
            ],
          }}
          onClick={({ index }) => {
            setLightboxIndex(index);
            return false;
          }}
        />
        <Lightbox
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          index={lightboxIndex}
          slides={slides}
        />
      </>
    );
  } else {
    galleryContent = (
      <div className="no-pictures">
        <h1>Er zijn geen foto&apos;s gevonden</h1>
        <p>Probeer het later nog eens.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="photo-album-wrapper">{galleryContent}</div>
    </div>
  );
}
