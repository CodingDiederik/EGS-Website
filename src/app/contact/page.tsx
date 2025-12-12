import Introduction from '@/components/common/IntroductionImage/IntroductionImage';
import TextSection from '@/components/common/TextSection/TextSection';
import './page.css';

export default function Agenda() {
  return (
    <div className="image-text">
      {/* Default introduction component*/}
      <Introduction text="Contact" />

      {/* Explanation about proeflessen */}
      <TextSection
        text={
          <>
            <p>
              Neem contact op met EGS Goirle voor al uw vragen, opmerkingen of
              verzoeken. Wij staan klaar om u te helpen en te voorzien van de
              informatie die u nodig heeft.
            </p>
            <p>
              Of u nu meer wilt weten over onze lesprogramma&apos;s, speciale
              evenementen of lidmaatschapsopties, ons team is beschikbaar om uw
              vragen te beantwoorden. U kunt ons bereiken via telefoon, e-mail
              of door het contactformulier op deze pagina in te vullen.
            </p>
          </>
        }
      />
    </div>
  );
}
