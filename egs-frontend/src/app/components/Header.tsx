'use client';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  LoggedIn?: boolean;
}

const Header = ({ LoggedIn }: HeaderProps) => {
  return (
    <header>
      <nav aria-label="Main navigation">
        <Link href="/">
          <Image
            src="/EGS-logo.svg"
            alt="EGS Logo"
            className="logo"
            width={40}
            height={40}
          />
        </Link>
        <ul>
          <li>
            <Link href="/agenda">Agenda</Link>
          </li>
          <li>
            <Link href="/jeugd">Jeugd</Link>
          </li>
          <li>
            <Link href="/over">Over</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            <Link href="/archief">Archief</Link>
          </li>

          {LoggedIn === true ? (
            <li className="admin-links">
              <ul>
                <li>
                  <Link href="/beheer/dashboard">Beheer</Link>
                </li>
                <li>
                  <Link href="/beheer/logout">Uitloggen</Link>
                </li>
              </ul>
            </li>
          ) : null}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
