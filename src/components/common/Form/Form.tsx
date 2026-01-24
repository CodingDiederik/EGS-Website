'use client';
import { FormField } from '@/lib/common/form';
import styles from './Form.module.css';
import { useActionState, useState, useRef } from 'react';
import { submitFormData } from '@/lib/common/form';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FormValues = Record<string, any>;

export type FormState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

const initialState: FormState = {
  status: 'idle',
  message: '',
};

async function action(
  state: FormState,
  formData: FormData,
  formName: string,
): Promise<FormState> {
  try {
    await submitFormData(formData, formName);
    return {
      status: 'success',
      message: 'Formulier succesvol verzonden!',
    };
  } catch {
    return {
      status: 'error',
      message: 'Er is een fout opgetreden bij het verzenden van het formulier.',
    };
  }
}

const Form = ({
  formFields,
  header,
  formName,
}: {
  formFields: FormField[];
  header: string;
  formName: string;
}) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [validationError, setValidationError] = useState('');
  const [state, formAction, isPending] = useActionState(
    (state: FormState, formData: FormData) => action(state, formData, formName),
    initialState,
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const missingFields = formFields.filter((field) => {
      if (!field.required) return false;
      const value = formData.get(field.label);
      return !String(value ?? '').trim();
    });

    if (missingFields.length > 0) {
      const fieldList = missingFields.map((f) => f.label).join(', ');
      setValidationError(`Vul de verplichte velden in: ${fieldList}.`);
      return;
    }

    if (formData.get('Email')) {
      // Check email format
      const email = String(formData.get('Email'));
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setValidationError('Vul een geldig e-mailadres in.');
        return;
      }
    }

    setValidationError('');
    formAction(formData);
  };

  return (
    <div className={styles.formContainer}>
      <form
        ref={formRef}
        className={styles.form}
        action={formAction}
        noValidate
        onSubmit={handleSubmit}
      >
        <h2 className={styles.heading}>{header}</h2>
        {formFields.map((field, index) => (
          <div key={index}>
            <label className={styles.label}>
              {field.label + ':'}
              {field.type === 'textarea' ? (
                <textarea
                  name={field.label}
                  required={field.required}
                  className={styles.textarea}
                  disabled={isPending}
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.label}
                  required={field.required}
                  className={styles.select}
                  disabled={isPending}
                >
                  {field.options?.map((option, idx) => (
                    <option
                      key={idx}
                      value={option}
                      className={styles.option}
                      disabled={isPending}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.label}
                  required={field.required}
                  className={styles.input}
                  disabled={isPending}
                />
              )}
            </label>
          </div>
        ))}
        <button type="submit" disabled={isPending}>
          {isPending ? 'Bezig met verzenden...' : 'Verzenden'}
        </button>
        {(validationError || state.status !== 'idle') && (
          <div
            className={`${styles.statusMessage} ${
              validationError || state.status === 'error'
                ? styles.error
                : styles.success
            }`}
          >
            {validationError || state.message}
          </div>
        )}
        <input
          type="text"
          name="website"
          style={{ display: 'none' }}
          aria-hidden="true"
          tabIndex={-1}
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default Form;
