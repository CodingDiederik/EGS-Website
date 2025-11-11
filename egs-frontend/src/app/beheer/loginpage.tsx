function checkFields(email: string, password: string) {
  if (!email || !password) {
    return 'Vul zowel email als wachtwoord in';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Ongeldig email formaat';
  }

  if (password.length < 8) {
    return 'Wachtwoord moet minstens 8 tekens lang zijn';
  }

  if (password.length > 64) {
    return 'Wachtwoord mag maximaal 64 tekens lang zijn';
  }

  return null;
}

function extractFail(data: { message: string[]; statusCode: number }): string {
  console.info('Login mislukte:', data);
  if (data.statusCode === 401) {
    return 'Onjuiste email of wachtwoord';
  }

  if (Array.isArray(data.message)) {
    for (const msg of data.message) {
      // check if email is valid input format
      if (msg.includes('email')) {
        return 'Ongeldig email formaat';
      } else if (msg.includes('password')) {
        return 'Ongeldig wachtwoord formaat';
      }
    }
  }

  return 'Onjuiste email of wachtwoord';
}

function LoginButton({
  setError,
  setIsLoggedIn,
  email,
  password,
  isLoading,
  setIsLoading,
}: Readonly<{
  setError: (message: string) => void;
  setIsLoggedIn: (value: boolean) => void;
  email: string;
  password: string;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}>) {
  async function handleLogin(email: string, password: string) {
    const error = checkFields(email, password);

    if (error) {
      setError(error);
      return;
    }

    setIsLoading(true);

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
        setError(extractFail(data));
        return;
      }
    } catch (error) {
      console.error('Error connecting to the backend:', error);
      setError(
        'Kan geen verbinding maken met de server. Probeer het later opnieuw.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button onClick={() => handleLogin(email, password)} disabled={isLoading}>
      {isLoading ? 'Inloggen...' : 'Inloggen'}
    </button>
  );
}

function EmailInput({
  email,
  setEmail,
}: Readonly<{
  email: string;
  setEmail: (value: string) => void;
}>) {
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
}: Readonly<{
  password: string;
  setPassword: (value: string) => void;
}>) {
  return (
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Voer je wachtwoord in"
    />
  );
}

export function LoginForm({
  error,
  setError,
  setIsLoggedIn,
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  setIsLoading,
}: Readonly<{
  error: string;
  setError: (message: string) => void;
  setIsLoggedIn: (value: boolean) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}>) {
  return (
    <div className="loginContainer">
      <h2>Inloggen op de beheerpagina</h2>
      <p className="merriweather" aria-label="email">
        Email:
      </p>
      <EmailInput email={email} setEmail={setEmail} />
      <p className="merriweather" aria-label="password">
        Wachtwoord:
      </p>
      <PasswordInput password={password} setPassword={setPassword} />
      {error && (
        <div className="errorMessage" role="alert">
          {error}
        </div>
      )}
      <LoginButton
        setError={setError}
        setIsLoggedIn={setIsLoggedIn}
        email={email}
        password={password}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}
