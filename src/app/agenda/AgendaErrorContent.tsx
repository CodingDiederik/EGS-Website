'use client';

import Link from 'next/link';
import styles from '../error-content.module.css';

export default function AgendaErrorContent({
  onRetry,
}: {
  onRetry?: () => void;
}) {
  return (
    <div className={styles['wrapper']}>
      <div className={styles['not-found']}>
        <h1>500 - Interne serverfout &#128577;</h1>
        <p>Oeps, de agenda kon niet worden geladen.</p>
        <p>
          Probeer het later opnieuw of neem contact op met de websitebeheerder
          als het probleem aanhoudt.
        </p>
        {onRetry && <button onClick={onRetry}>Probeer opnieuw</button>}
        <Link href="/">Klik hier om terug naar de homepagina te gaan</Link>
      </div>
    </div>
  );
}
