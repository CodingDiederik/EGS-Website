'use client';
import './login.css';
import { useState } from 'react';
import { AUTH_COOKIE_NAME } from '@/constants';

function LoginButton({
  setError,
  setIsLoggedIn,
}: {
  setError: (message: string) => void;
  setIsLoggedIn: (value: boolean) => void;
}) {
  async function handleLogin() {
    const email = (
      document.querySelector('input[type="email"]') as HTMLInputElement
    )?.value;
    const password = (
      document.querySelector('input[type="password"]') as HTMLInputElement
    )?.value;

    if (!email || !password) {
      setError('Vul zowel email als wachtwoord in');
      return;
    }

    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data: { message: string[]; statusCode: number } =
        await response.json();

      if (response.ok) {
        console.info('Login successful:', data);
        setIsLoggedIn(true);
      } else {
        console.info('Login mislukte:', data);
        if (data.statusCode === 401) {
          setError('Onjuiste email of wachtwoord');
          return;
        }

        for (const msg of data.message) {
          // check if email is valid input format
          if (msg.includes('email')) {
            setError('Ongeldig email formaat');
            return;
          } else if (msg.includes('password')) {
            setError('Ongeldig wachtwoord formaat');
            return;
          }
        }

        setError('Onjuiste email of wachtwoord');
        return;
      }
    } catch (error) {
      console.error('Error connecting to the backend:', error);
      setError(
        'Kan geen verbinding maken met de server. Probeer het later opnieuw.',
      );
    }
  }

  return <button onClick={handleLogin}>Inloggen</button>;
}

function EmailInput() {
  return <input type="email" placeholder="schaakclub@egs.nl" />;
}

function PasswordInput() {
  return <input type="password" placeholder="Voer je wachtwoord in" />;
}

function LoginForm({
  error,
  setError,
  setIsLoggedIn,
}: {
  error: string;
  setError: (message: string) => void;
  setIsLoggedIn: (value: boolean) => void;
}) {
  return (
    <div className="loginContainer">
      <h2>Inloggen op de beheerpagina</h2>
      <p className="merriweather">Email:</p>
      <EmailInput />
      <p className="merriweather">Wachtwoord:</p>
      <PasswordInput />
      {error && <div className="errorMessage">{error}</div>}
      <LoginButton setError={setError} setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
}

function AdminPanel() {
  return <div>Welcome to the admin panel!</div>;
}

function CheckAlreadyLoggedIn() {
  // check if user has a cookie
  if (typeof document === 'undefined') {
    return false;
  }
  const cookies = document.cookie.split('; ');
  const authCookie = cookies.find((cookie) =>
    cookie.startsWith(AUTH_COOKIE_NAME),
  );
  if (authCookie === undefined) {
    return false;
  }

  // check if the cookie is not expired
  const token = authCookie.split('=')[1];
  const payload = JSON.parse(atob(token.split('.')[1]));
  const isExpired = payload.exp < Date.now() / 1000;
  return !isExpired;
}

export default function BeheerPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  let content;

  if (isLoggedIn || CheckAlreadyLoggedIn()) {
    content = <AdminPanel />;
  } else {
    content = (
      <LoginForm
        error={error}
        setError={setError}
        setIsLoggedIn={setIsLoggedIn}
      />
    );
  }

  return (
    <>
      <main>{content}</main>
    </>
  );
}
