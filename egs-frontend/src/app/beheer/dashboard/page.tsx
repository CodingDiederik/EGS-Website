'use client';
import { redirect } from 'next/navigation';
import './dashboard.css';
import { useEffect, useState } from 'react';
import { SpinnerCircular } from 'spinners-react';

function AdminUserPanel() {
  return <div>Welcome to the admin panel!</div>;
}

function UserPanel() {
  return <div>Welcome to the user panel!</div>;
}

async function fetchUserRole() {
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
      redirect('/beheer');
    }
  }

  const data = await response.json();
  return data.role;
}

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkUserRole() {
      const role = await fetchUserRole();
      if (role === 'admin') {
        setIsAdmin(true);
      }
      setIsLoading(false);
    }

    checkUserRole();
  }, []);

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
    return <AdminUserPanel />;
  } else {
    return <UserPanel />;
  }
}
