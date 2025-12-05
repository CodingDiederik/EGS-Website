// src/components/Footer/Footer.tsx
import Link from 'next/link';
import styles from './Footer.module.css';

// Definitie van de links voor eenvoudige aanpassing
const navLinks = [
  { href: '/agenda', label: 'Agenda' },
  { href: '/jeugd', label: 'Jeugd' },
  { href: '/over', label: 'Over' },
  { href: '/contact', label: 'Contact' },
  { href: '/archief', label: 'Archief' },
  { href: '/beheer', label: 'Beheer' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Sectie 1: Navigatie Links */}
        <div className={styles.linkSection}>
          <h3 className={styles.footerHeading}>Links</h3>
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
      </div>

      {/* Sectie 3: Copyright */}
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
