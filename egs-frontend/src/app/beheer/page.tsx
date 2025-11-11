'use client';

import './login.css';
import { useState, useEffect } from 'react';
import { SpinnerCircular } from 'spinners-react';
import { LoginForm } from './loginpage';
import { redirect } from 'next/navigation';

async function checkLoggedIn() {
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
  return response.ok;
}

export default function BeheerPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchLoginStatus() {
      if (await checkLoggedIn()) {
        setIsLoggedIn(true);
      }
    }
    fetchLoginStatus();
  }, []);

  let content;

  if (isLoggedIn) {
    // redirect to dashboard
    redirect('/beheer/dashboard');
  } else {
    content = (
      <LoginForm
        error={error}
        setError={setError}
        setIsLoggedIn={setIsLoggedIn}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    );
  }

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
