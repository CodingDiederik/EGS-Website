'use client';
import styles from './ProeflesForm.module.css';
import { useState } from 'react';
import {
  validateProeflesForm,
  submitProeflesForm,
  ProeflesFormData,
  FieldErrors,
  StudentLevels,
} from '@/lib/proeflesFormLogic';

const ProeflesForm = () => {
  const [formData, setFormData] = useState<ProeflesFormData>({
    name: '',
    studentName: '',
    age: -1,
    level: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
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
      setFormData({
        name: '',
        studentName: '',
        age: -1,
        level: '',
        email: '',
        message: '',
      });
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
        method="post"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* NAME parent */}
        <div className={styles.fieldGroup}>
          <label htmlFor="person-name" className={styles.label}>
            Naam ouder/verzorger:
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
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
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

        {/* NAME student */}
        <div className={styles.fieldGroup}>
          <label htmlFor="student-name" className={styles.label}>
            Naam kind:
          </label>
          <input
            type="text"
            id="student-name"
            name="student-name"
            className={`${styles.input} ${
              fieldErrors['student-name'] ? styles.inputError : ''
            }`}
            disabled={status === 'loading'}
            value={formData.studentName}
            onChange={(e) =>
              setFormData({ ...formData, studentName: e.target.value })
            }
          />
          {fieldErrors['student-name'] && (
            <span className={styles.errorText}>
              {fieldErrors['student-name']}
            </span>
          )}
        </div>

        {/* AGE student */}
        <div className={styles.fieldGroup}>
          <label htmlFor="student-age" className={styles.label}>
            Leeftijd kind:
          </label>
          <input
            type="number"
            id="student-age"
            name="student-age"
            className={`${styles.input} ${
              fieldErrors['student-age'] ? styles.inputError : ''
            }`}
            disabled={status === 'loading'}
            min={1}
            max={120}
            value={formData.age === -1 ? '' : formData.age}
            onChange={(e) => {
              const value = e.target.value;
              setFormData({
                ...formData,
                age: value === '' ? -1 : Number(value),
              });
            }}
          />
          {fieldErrors['student-age'] && (
            <span className={styles.errorText}>
              {fieldErrors['student-age']}
            </span>
          )}
        </div>

        {/* LEVEL student */}
        <div className={styles.fieldGroup}>
          <label htmlFor="student-level" className={styles.label}>
            Speelniveau kind:
          </label>
          <select
            id="student-level"
            name="student-level"
            className={`${styles.select} ${
              fieldErrors['student-level'] ? styles.inputError : ''
            }`}
            disabled={status === 'loading'}
            value={formData.level}
            onChange={(e) =>
              setFormData({
                ...formData,
                level: e.target.value as StudentLevels,
              })
            }
          >
            <option value="">-- Selecteer niveau --</option>
            <option value="Beginner (geen ervaring)">
              Beginner (geen ervaring)
            </option>
            <option value="Basiskennis (loop stukken)">
              Basiskennis (loop stukken)
            </option>
            <option value="Ervaren (speelt partijen)">
              Ervaren (speelt partijen)
            </option>
            <option value="Anders (specificeer in bericht)">
              Anders (specificeer in bericht)
            </option>
          </select>
          {fieldErrors['student-level'] && (
            <span className={styles.errorText}>
              {fieldErrors['student-level']}
            </span>
          )}
        </div>

        {/* MESSAGE */}
        <div className={styles.fieldGroup}>
          <label htmlFor="message" className={styles.label}>
            Bericht:
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={styles.textarea}
            disabled={status === 'loading'}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
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
