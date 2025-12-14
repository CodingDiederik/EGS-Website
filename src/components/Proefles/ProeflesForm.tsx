'use client';
import styles from './ProeflesForm.module.css';
import { useState } from 'react';
import { validateProeflesForm, submitProeflesForm, ProeflesFormData, FieldErrors } from '@/lib/proeflesFormLogic';


const ProeflesForm = () => {
  const [formData, setFormData] = useState<ProeflesFormData>({
    name: '',
    email: '',
    optionalMessage: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setStatusMessage(null);
    setFieldErrors({});

    // Use centralized validation
    const errors = validateProeflesForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus('error');
      return;
    }

    // Use centralized submit logic
    const result = await submitProeflesForm(formData);
    if (result.success) {
      setStatus('success');
      setStatusMessage(result.message);
      setFormData({ name: '', email: '', optionalMessage: '' });
    } else {
      setStatus('error');
      setStatusMessage(result.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Gratis Proefles Aanvragen</h2>

      <form
        className={styles.form}
        action={
          process.env.NEXT_PUBLIC_FORMS_URL ||
          (() => {
            throw new Error('FORMS_URL not defined');
          })()
        }
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
            className={`${styles.input} ${
              fieldErrors['person-name'] ? styles.inputError : ''
            }`}
            disabled={status === 'loading'}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            className={`${styles.input} ${
              fieldErrors['email'] ? styles.inputError : ''
            }`}
            disabled={status === 'loading'}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {fieldErrors['email'] && (
            <span
              className={styles.errorText}
              aria-describedby="Email is geen geldig formaat"
            >
              {fieldErrors['email']}
            </span>
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
            value={formData.optionalMessage}
            onChange={(e) => setFormData({ ...formData, optionalMessage: e.target.value })}
          ></textarea>
        </div>

        {/* STATUS & BUTTON */}
        {statusMessage && (
          <div
            className={`${styles.statusMessage} ${
              status === 'success' ? styles.success : styles.error
            }`}
          >
            {statusMessage}
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
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
