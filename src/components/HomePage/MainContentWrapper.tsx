'use client';
import React, { useEffect, useRef, useState, ReactNode } from 'react';

const MainContentWrapper: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [offset, setOffset] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        globalThis.requestAnimationFrame(() => {
          setOffset(Math.min(window.scrollY, 150));
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    globalThis.addEventListener('scroll', handleScroll);
    return () => globalThis.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        transform: `translateY(-${offset}px)`,
        transition: 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {children}
    </div>
  );
};

export default MainContentWrapper;
