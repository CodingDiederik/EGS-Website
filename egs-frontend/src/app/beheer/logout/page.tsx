'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { SpinnerCircular } from 'spinners-react';

async function logout() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    },
  );
  return response.ok;
}

export default function BeheerPage() {
  const isLoading = true; // Always show loading for logout page

  useEffect(() => {
    async function performLogout() {
      await logout();
      // After logout, redirect to home or login page
      redirect('/beheer');
    }
    performLogout();
  }, []);

  let content;

  return (
    <>
      <main>{content}</main>
      {isLoading && (
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
      )}
    </>
  );
}
