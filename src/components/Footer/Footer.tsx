import Link from 'next/link';
import styles from './Footer.module.css';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/agenda', label: 'Agenda' },
  { href: '/proefles', label: 'Proeflessen' },
  { href: '/nieuws', label: 'Nieuws' },
  { href: '/fotos', label: "Foto's" },
  { href: '/over', label: 'Over' },
  { href: '/contact', label: 'Contact' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Quick Links */}
        <div className={styles.linkSection}>
          <h3 className={styles.footerHeading}>Snel naar</h3>
          <ul className={styles.linkList}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className={styles.contactSection}>
          <h3 className={styles.footerHeading}>Contact</h3>
          <address className={styles.address}>
            <p>Wijkcentrum &apos;De Wildacker&apos;</p>
            <p>van Hogendorpplein 73</p>
            <p>5051 ST Goirle</p>
            <a href="mailto:egsjeugd@gmail.com" className={styles.link}>
              egsjeugd@gmail.com
            </a>
          </address>
        </div>

        {/* Social Media */}
        <div className={styles.socialSection}>
          <h3 className={styles.footerHeading}>Volg ons op</h3>
          <ul className={styles.linkList}>
            <li>
              <a
                href="https://www.facebook.com/schaakclubegs"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <FaFacebook className={styles.imageFacebook} size={28} />
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/schaakclubegs/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <FaInstagram className={styles.imageInstagram} size={28} />
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.copyrightBar}>
        <small>
          Copyright &copy; {currentYear} Eerste Goirlese Schaakclub. Alle
          rechten voorbehouden. Website gemaakt door Diederik Webster.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
