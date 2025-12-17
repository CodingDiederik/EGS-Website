'use client';
import React, { useEffect, useRef, useState, ReactNode } from 'react';

const MainContentWrapper: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [offset, setOffset] = useState(0);
  const [isSmall, setIsSmall] = useState(
    () =>
      typeof globalThis !== 'undefined' &&
      globalThis.matchMedia('(max-width: 780px)').matches,
  );
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        globalThis.requestAnimationFrame(() => {
          setOffset(Math.min(globalThis.scrollY, 150));
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    globalThis.addEventListener('scroll', handleScroll);
    return () => globalThis.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const mq = globalThis.matchMedia('(max-width: 780px)');
    const update = () => setIsSmall(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.onchange = update;
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update);
      else mq.onchange = null;
    };
  }, []);

  return (
    <div
      style={{
        transform: isSmall ? 'none' : `translateY(-${offset}px)`,
        transition: isSmall
          ? 'none'
          : 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {children}
    </div>
  );
};

export default MainContentWrapper;
