import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles['not-found']}>
      <h1>404 - Pagina niet gevonden &#128577;</h1>
      <p>De opgevraagde pagina bestaat niet.</p>
      <Link href="/">Klik hier om terug naar de homepagina te gaan</Link>
    </div>
  );
}
