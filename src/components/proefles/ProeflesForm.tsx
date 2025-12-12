'use client';
import styles from './ProeflesForm.module.css';
import { useState, useRef } from 'react';
// Import the Turnstile component
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

const ProeflesForm = () => {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // State to hold the Turnstile token
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Ref to control the Turnstile widget (to reset it later)
  const turnstileRef = useRef<TurnstileInstance>(null);

  const validateForm = (formData: FormData) => {
    const errors: { [key: string]: string } = {};
    const name = formData.get('person-name') as string;
    const email = formData.get('email') as string;

    if (!name || name.trim().length < 2) {
      errors['person-name'] = 'Voer a.u.b. een geldige naam in.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors['email'] = 'Voer a.u.b. een geldig emailadres in.';
    }

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFieldErrors({});
    setStatus('loading');
    setStatusMessage('');

    // 1. Check if Turnstile is completed
    if (!turnstileToken) {
      setStatus('error');
      setStatusMessage('Bevestig a.u.b. dat u geen robot bent.');
      return;
    }

    const form = event.currentTarget;
    const body = new FormData(form);

    // 2. Client-side Validation
    const validationErrors = validateForm(body);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setStatus('error');
      setStatusMessage('Controleer de rood gemarkeerde velden.');
      return;
    }

    // 3. Add Necessary Hidden Fields
    body.append('_wpcf7_unit_tag', 'wpcf7-f78-p1-o1'); // CF7 Unit Tag
    body.append('cf-turnstile-response', turnstileToken); // Turnstile Token

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: body,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'mail_sent') {
        setStatus('success');
        setStatusMessage('Bedankt! Uw aanvraag is succesvol verzonden.');
        form.reset();
        setTurnstileToken(null);
        turnstileRef.current?.reset(); // Reset the captcha for a new try
      } else if (data.status === 'spam') {
        setStatus('error');
        setStatusMessage(
          'Uw bericht is gemarkeerd als spam. Probeer het later opnieuw.',
        );
        turnstileRef.current?.reset();
      } else if (data.status === 'validation_failed') {
        setStatus('error');
        setStatusMessage(data.message || 'Er zijn validatiefouten.');
        if (data.invalid_fields) {
          const serverErrors: { [key: string]: string } = {};
          data.invalid_fields.forEach(
            (field: { field: string; message: string }) => {
              serverErrors[field.field] = field.message;
            },
          );
          setFieldErrors(serverErrors);
        }
        turnstileRef.current?.reset();
      } else {
        setStatus('error');
        setStatusMessage(
          data.message || 'Er is iets misgegaan bij het verzenden.',
        );
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setStatusMessage('Er is een technische fout opgetreden.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Gratis Proefles Aanvragen</h2>

      <form
        className={styles.form}
        action={process.env.NEXT_PUBLIC_FORMS_URL}
        method="post"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* NAME */}
        <div className={styles.fieldGroup}>
          <label htmlFor="person-name" className={styles.label}>
            Naam:
          </label>
          <input
            type="text"
            id="person-name"
            name="person-name"
            className={`${styles.input} ${fieldErrors['person-name'] ? styles.inputError : ''}`}
            disabled={status === 'loading'}
          />
          {fieldErrors['person-name'] && (
            <span className={styles.errorText}>
              {fieldErrors['person-name']}
            </span>
          )}
        </div>

        {/* EMAIL */}
        <div className={styles.fieldGroup}>
          <label htmlFor="email" className={styles.label}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`${styles.input} ${fieldErrors['email'] ? styles.inputError : ''}`}
            disabled={status === 'loading'}
          />
          {fieldErrors['email'] && (
            <span className={styles.errorText}>{fieldErrors['email']}</span>
          )}
        </div>

        {/* MESSAGE */}
        <div className={styles.fieldGroup}>
          <label htmlFor="optional-message" className={styles.label}>
            Bericht (optioneel):
          </label>
          <textarea
            id="optional-message"
            name="optional-message"
            rows={4}
            className={styles.textarea}
            disabled={status === 'loading'}
          ></textarea>
        </div>

        {/* TURNSTILE WIDGET */}
        <div className={styles.captchaContainer}>
          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => setStatusMessage('Fout bij laden van verificatie.')}
            options={{
              theme: 'light',
              size: 'normal',
            }}
          />
        </div>

        {/* STATUS & BUTTON */}
        {statusMessage && (
          <div
            className={`${styles.statusMessage} ${status === 'success' ? styles.success : styles.error}`}
          >
            {statusMessage}
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          // Disable button if loading OR if turnstile is not yet done
          disabled={status === 'loading'}
        >
          {status === 'loading'
            ? 'Bezig met verzenden...'
            : 'Aanvraag Versturen'}
        </button>
      </form>
    </div>
  );
};

export default ProeflesForm;
