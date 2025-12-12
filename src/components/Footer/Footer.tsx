// src/components/Footer/Footer.tsx
import Link from 'next/link';
import styles from './Footer.module.css';
import Image from 'next/image';

// Definitie van de links voor eenvoudige aanpassing
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
        {/* Sectie 1: Navigatie Links */}
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

        {/* Sectie 2: Contactgegevens */}
        <div className={styles.contactSection}>
          <h3 className={styles.footerHeading}>Contact</h3>
          <address className={styles.address}>
            <p>Wijkcentrum &apos;De Wildacker&apos;</p>
            <p>van Hogendorpplein 73</p>
            <p>5051 ST Goirle</p>
            <a href="mailto:egs@schaakclubegs.nl" className={styles.link}>
              egs@schaakclubegs.nl
            </a>
          </address>
        </div>

        {/* Sectie 3: Social Media Links */}
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
                <Image
                  src="/facebook.png"
                  alt="Facebook Logo"
                  width={32}
                  height={32}
                  className={styles.imageFacebook}
                />
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
                <Image
                  src="/instagram.png"
                  alt="Instagram Logo"
                  width={28}
                  height={28}
                  className={styles.imageInstagram}
                />
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/*Copyright */}
      <div className={styles.copyrightBar}>
        <small>
          Copyright &copy; {currentYear} EGS Goirle. Alle rechten voorbehouden.
          Website gemaakt door Diederik Webster.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
