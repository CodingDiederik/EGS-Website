'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/agenda', label: 'Agenda' },
  { href: '/proefles', label: 'Proeflessen' },
  { href: '/nieuws', label: 'Nieuws' },
  { href: '/fotos', label: "Foto's" },
  { href: '/over', label: 'Over' },
  { href: '/contact', label: 'Contact' },
];

const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navListRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const navList = navListRef.current;
    if (!navList) {
      return;
    }

    const focusableElements = Array.from(
      navList.querySelectorAll<HTMLElement>('a, button'),
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        return;
      }

      if (event.key !== 'Tab' || focusableElements.length === 0) {
        return;
      }

      const activeElement = document.activeElement as HTMLElement | null;
      if (event.shiftKey) {
        if (
          activeElement === firstElement ||
          !navList.contains(activeElement)
        ) {
          event.preventDefault();
          (lastElement ?? firstElement)?.focus();
        }
        return;
      }

      if (activeElement === lastElement) {
        event.preventDefault();
        (firstElement ?? lastElement)?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/" onClick={() => setIsOpen(false)}>
          <Image
            src="/EGS-logo.png"
            alt="EGS Logo"
            className={styles.logo}
            width={60}
            height={60}
          />
        </Link>

        <div className={styles.hamburgerWrapper}>
          <span className={styles.hamburgerLabel}>Menu</span>
          <button
            className={styles.hamburger}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            aria-controls="primary-navigation"
            data-open={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        </div>

        <div
          className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ''}`}
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        ></div>

        <ul
          id="primary-navigation"
          ref={navListRef}
          className={`${styles.navList} ${isOpen ? styles.open : ''}`}
        >
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={
                  styles.navLink +
                  (pathname === href ? ' ' + styles['current-page'] : '')
                }
                onClick={(e) => {
                  if (pathname === href) {
                    e.preventDefault();
                  }
                  setIsOpen(false);
                }}
              >
                {label}
              </Link>
            </li>
          ))}
          <li className={styles.backToMainSite}>
            <Link
              href="https://www.schaakclubegs.nl"
              className={styles.backToMainSiteLink}
              onClick={() => setIsOpen(false)}
            >
              Terug naar de hoofdsite
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
