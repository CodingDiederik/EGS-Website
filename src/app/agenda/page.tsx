import Introduction from '@/components/common/IntroductionImage/IntroductionImage';
import TextSection from '@/components/common/TextSection/TextSection';
import './page.css';

export default function Agenda() {
  return (
    <div className="image-text">
      {/* Default introduction component*/}
      <Introduction text="Agenda" />

      {/* Explanation about proeflessen */}
      <TextSection
        text={
          <>
            <p>
              Hier vindt u de agenda van EGS Goirle met alle geplande
              evenementen, lessen en speciale activiteiten. Blijf op de hoogte
              van wat er gaande is en mis geen enkele kans om deel te nemen aan
              onze spannende evenementen!
            </p>
            <p>
              Onze agenda wordt regelmatig bijgewerkt, dus zorg ervoor dat u
              regelmatig terugkomt om de nieuwste informatie te bekijken. Of u
              nu geïnteresseerd bent in groepslessen, workshops of speciale
              evenementen, onze agenda biedt een overzicht van alles wat er te
              doen is bij EGS Goirle.
            </p>
          </>
        }
      />
    </div>
  );
}
