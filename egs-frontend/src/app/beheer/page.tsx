'use client';
import './login.css';
import { useState } from 'react';

function LoginButton({
  setError,
  setIsLoggedIn,
  email,
  password,
}: {
  setError: (message: string) => void;
  setIsLoggedIn: (value: boolean) => void;
  email: string;
  password: string;
}) {
  async function handleLogin(email: string, password: string) {
    if (!email || !password) {
      setError('Vul zowel email als wachtwoord in');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ongeldig email formaat');
      return;
    }

    if (password.length < 8) {
      setError('Wachtwoord moet minstens 8 tekens lang zijn');
      return;
    }

    if (password.length > 64) {
      setError('Wachtwoord mag maximaal 64 tekens lang zijn');
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
          credentials: 'include',
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

  return <button onClick={() => handleLogin(email, password)}>Inloggen</button>;
}

function EmailInput({
  email,
  setEmail,
}: {
  email: string;
  setEmail: (value: string) => void;
}) {
  return (
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="schaakclub@egs.nl"
    />
  );
}

function PasswordInput({
  password,
  setPassword,
}: {
  password: string;
  setPassword: (value: string) => void;
}) {
  return (
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Voer je wachtwoord in"
    />
  );
}

function LoginForm({
  error,
  setError,
  setIsLoggedIn,
  email,
  setEmail,
  password,
  setPassword,
}: {
  error: string;
  setError: (message: string) => void;
  setIsLoggedIn: (value: boolean) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
}) {
  return (
    <div className="loginContainer">
      <h2>Inloggen op de beheerpagina</h2>
      <p className="merriweather">Email:</p>
      <EmailInput email={email} setEmail={setEmail} />
      <p className="merriweather">Wachtwoord:</p>
      <PasswordInput password={password} setPassword={setPassword} />
      {error && <div className="errorMessage">{error}</div>}
      <LoginButton
        setError={setError}
        setIsLoggedIn={setIsLoggedIn}
        email={email}
        password={password}
      />
    </div>
  );
}

function AdminPanel() {
  return <div>Welcome to the admin panel!</div>;
}

export default function BeheerPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  let content;

  if (isLoggedIn) {
    content = <AdminPanel />;
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
      />
    );
  }

  return (
    <>
      <main>{content}</main>
    </>
  );
}
