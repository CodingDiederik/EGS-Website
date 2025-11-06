'use client';
import './login.css';
import Head from 'next/head';
import Image from 'next/image';

function LoginButton() {
  function handleLogin() {
    console.log('Logging in...');
  }

  return <button onClick={handleLogin}>Login</button>;
}

function TextInput() {
  return <input type="text" />;
}

function LoginForm() {
  return (
    <div>
      <div className="loginContainer">
        <h2>Inloggen op de beheerpagina</h2>
        <p className='merriweather'>Email:</p>
        <TextInput />
        <p className='merriweather'>Wachtwoord:</p>
        <TextInput />
        <p></p>
        <LoginButton />
      </div>
      <div className="backgroundLogo">
        <Image
          src="/EGS-logo.svg"
          alt="EGS Logo"
          width={200}
          height={200}
        />  
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <main>{content}</main>
    </>
  );
}
