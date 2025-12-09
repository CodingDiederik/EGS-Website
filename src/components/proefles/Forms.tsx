'use client';
import styles from './Forms.module.css';

const Forms = () => {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <label htmlFor="naam" className={styles.label}>
          Naam:
        </label>
        <input
          type="text"
          id="naam"
          name="naam"
          required
          className={styles.input}
        />

        <label htmlFor="email" className={styles.label}>
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className={styles.input}
        />

        <label htmlFor="bericht" className={styles.label}>
          Bericht:
        </label>
        <textarea
          id="bericht"
          name="bericht"
          rows={4}
          className={styles.textarea}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
          }}
        ></textarea>

        <button type="submit" className={styles.button}>
          Indienen
        </button>
      </form>
    </div>
  );
};

export default Forms;
