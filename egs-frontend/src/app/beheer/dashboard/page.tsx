'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SpinnerCircular } from 'spinners-react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

function AdminUserPanel() {
  return <div>Welcome to the admin panel!</div>;
}

function UserPanel() {
  return <div>Welcome to the user panel!</div>;
}

async function fetchUserRole(router: AppRouterInstance) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    },
  );

  if (!response.ok) {
    if (response.status === 403) {
      // Not logged in
      router.push('/beheer');
    }
  }

  const data = await response.json();
  return data.role;
}

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkUserRole() {
      const role = await fetchUserRole(router);
      if (role === 'admin') {
        setIsAdmin(true);
      }
      setIsLoading(false);
    }

    checkUserRole();
  }, [router]);

  if (isLoading) {
    return (
      <output
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(200, 200, 200, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}
        aria-label="Loading"
      >
        <SpinnerCircular
          size={50}
          thickness={100}
          speed={100}
          color="var(--accent-primary)"
        />
      </output>
    );
  }

  if (isAdmin) {
    return (
      <main>
        <AdminUserPanel />
      </main>
    );
  } else {
    return (
      <main>
        <UserPanel />
      </main>
    );
  }
}
