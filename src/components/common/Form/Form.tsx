'use client';
import { FormField } from '@/lib/common/form';
import styles from './Form.module.css';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FormValues = Record<string, any>;

const Form = ({
  formFields,
  header,
  onSubmit,
}: {
  formFields: FormField[];
  header: string;
  onSubmit: (data: FormValues) => void;
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data: FormValues = Object.fromEntries(formData.entries());

    onSubmit(data);
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
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
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.label}
                  required={field.required}
                  className={styles.select}
                >
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option} className={styles.option}>
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
                />
              )}
            </label>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
