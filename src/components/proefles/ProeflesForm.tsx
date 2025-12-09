'use client';
import styles from './ProeflesForm.module.css';

const ProeflesForm = () => {
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

        <button type="submit">Indienen</button>
        {/* TODO, add handler */}
      </form>
    </div>
  );
};

export default ProeflesForm;
