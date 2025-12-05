'use client';
import Image from 'next/image';
import Link from 'next/link';
import './Header.css';
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
    <header>
      <nav aria-label="Main navigation">
        <Link href="/">
          <Image
            src="/EGS-logo.png"
            alt="EGS Logo"
            className="logo"
            width={60}
            height={60}
          />
        </Link>
        <ul>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={pathname === href ? 'current-page' : ''}
                onClick={
                  pathname === href ? (e) => e.preventDefault() : undefined
                }
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="back-to-main-site">
            <Link href="https://www.schaakclubegs.nl">
              Terug naar de hoofdsite
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
