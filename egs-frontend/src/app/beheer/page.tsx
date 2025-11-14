import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from './loginpage';
import { AUTH_COOKIE_NAME } from '@/data/constants';
import './login.css';

/**
 * This function now runs on the SERVER.
 * It reads the cookie from the incoming request and forwards it to the backend.
 */
async function checkLoggedIn() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!sessionCookie) {
    return false;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Forward the cookie to the backend
          Cookie: `${sessionCookie.name}=${sessionCookie.value}`,
        },
      },
    );
    return response.ok;
  } catch (error) {
    console.error('Failed to connect to backend for auth check:', error);
    return false;
  }
}

export default async function BeheerPage() {
  // 1. Check login status on the server
  if (await checkLoggedIn()) {
    // 2. Redirect on the server if already logged in
    redirect('/beheer/dashboard');
  }

  // 3. If not logged in, render the Client Component
  return (
    <main>
      <div className="LoginFormContainer">
        <LoginForm />
      </div>
    </main>
  );
}
