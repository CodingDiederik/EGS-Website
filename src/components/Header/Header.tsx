import Image from 'next/image';
import Link from 'next/link';
import './Header.css';

const Header = () => {
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
          {/*<li>
            <Link href="/archief">Archief</Link>
          </li>*/}
          <li className= "back-to-main-site">
            <Link href="https://www.schaakclubegs.nl">Terug naar de hoofdsite</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
