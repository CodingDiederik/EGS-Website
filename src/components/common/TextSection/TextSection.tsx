
import './TextSection.css';

const TextSection: React.FC<{ text: React.ReactNode }> = ({ text }) => {
  return (
    <section className="content-section">
      <div className="text-section">{text}</div>
    </section>
  );
};

export default TextSection;
