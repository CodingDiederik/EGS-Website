'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';
import { usePathname } from 'next/navigation';

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

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/">
          <Image
            src="/EGS-logo.png"
            alt="EGS Logo"
            className={styles.logo}
            width={60}
            height={60}
          />
        </Link>
        <ul className={styles.navList}>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={styles.navLink + (pathname === href ? ' ' + styles['current-page'] : '')}
                onClick={
                  pathname === href ? (e) => e.preventDefault() : undefined
                }
              >
                {label}
              </Link>
            </li>
          ))}
          <li className={styles.backToMainSite}>
            <Link href="https://www.schaakclubegs.nl" className={styles.navLink}>
              Terug naar de hoofdsite
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
