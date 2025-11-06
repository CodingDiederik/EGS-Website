'use client';
import './login.css';
import Head from 'next/head';
import Image from 'next/image';

function LoginButton() {
  async function handleLogin() {
    const email = (
      document.querySelector('input[type="email"]') as HTMLInputElement
    )?.value;
    const password = (
      document.querySelector('input[type="password"]') as HTMLInputElement
    )?.value;

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
      } else {
        console.error('Login mislukte:', data.message);
      }
    } catch (error) {
      console.error('Error connecting to the backend:', error);
    }
  }

  return <button onClick={handleLogin}>Login</button>;
}

function EmailInput() {
  return <input type="email" />;
}

function PasswordInput() {
  return <input type="password" />;
}

function LoginForm() {
  return (
    <div>
      <div className="loginContainer">
        <h2>Inloggen op de beheerpagina</h2>
        <p className="merriweather">Email:</p>
        <EmailInput />
        <p className="merriweather">Wachtwoord:</p>
        <PasswordInput />
        <p></p>
        <LoginButton />
      </div>
      <div className="backgroundLogo">
        <Image src="/EGS-logo.svg" alt="EGS Logo" width={200} height={200} />
      </div>
    </div>
  );
}

function AdminPanel() {
  return <div>Welcome to the admin panel!</div>;
}

export default function BeheerPage() {
  const isLoggedIn = false;

  let content;

  if (isLoggedIn) {
    content = <AdminPanel />;
  } else {
    content = <LoginForm />;
  }

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>
      <main>{content}</main>
    </>
  );
}
