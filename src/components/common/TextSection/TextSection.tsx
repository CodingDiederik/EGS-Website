import styles from './TextSection.module.css';

const TextSection: React.FC<{ text: React.ReactNode }> = ({ text }) => {
  return (
    <section className={styles['content-section']}>
      <div className={styles['text-section']}>{text}</div>
    </section>
  );
};

export default TextSection;
