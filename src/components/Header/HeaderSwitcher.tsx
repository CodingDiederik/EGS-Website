'use client';
import { useEffect, useState } from 'react';
import Header from './Header';

export default function HeaderSwitcher() {
  // undefined = loading, true = logged in, false = not logged in
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    async function checkLoggedIn() {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';
        const url = base ? `${base}/auth/me` : '/auth/me';

        const res = await fetch(url, {
          method: 'GET',
          credentials: 'include', // browser includes cookies
          cache: 'no-store',
        });

        if (!mounted) return;

        // explicit handling so we don't accidentally treat "truthy" non-boolean values as logged in
        if (res.status === 401 || res.status === 403) {
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(Boolean(res.ok));
        }
      } catch {
        if (!mounted) return;
        setIsLoggedIn(false);
      }
    }

    checkLoggedIn();
    return () => {
      mounted = false;
    };
  }, []);

  return <Header LoggedIn={isLoggedIn} />;
}
