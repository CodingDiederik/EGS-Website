'use client';

import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

type SafeImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'onError'
> & {
  src: string;
  fallbackSrc?: string;
  hideOnError?: boolean;
  priority?: boolean;
};

export default function SafeImage({
  src,
  fallbackSrc,
  hideOnError = true,
  priority: _priority, // ignored for native img
  ...rest
}: Readonly<SafeImageProps>) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hidden, setHidden] = useState(false);

  if (hideOnError && hidden) return null;

  return (
    <img
      {...rest}
      src={currentSrc}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        } else if (hideOnError) {
          setHidden(true);
        }
      }}
    />
  );
}
