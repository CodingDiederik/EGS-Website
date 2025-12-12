import Introduction from '@/components/common/IntroductionImage/IntroductionImage';
import TextSection from '@/components/common/TextSection/TextSection';
import './page.css';

export default function Agenda() {
  return (
    <div className="image-text">
      {/* Default introduction component*/}
      <Introduction text="Over" />

      {/* Explanation about proeflessen */}
      <TextSection
        text={
          <>
            <p>
              EGS Goirle is een toonaangevende organisatie die zich inzet voor
              het bevorderen van sport en gemeenschap in de regio Goirle. Met
              een breed scala aan activiteiten en programma&apos;s, streven we
              ernaar om een inclusieve omgeving te creëren waar iedereen zich
              welkom voelt.
            </p>
            <p>
              Onze missie is om mensen van alle leeftijden en achtergronden te
              inspireren om actief deel te nemen aan sportieve en sociale
              evenementen. Bij EGS Goirle geloven we in de kracht van
              gemeenschap en samenwerking, en we nodigen u uit om deel uit te
              maken van onze levendige groep.
            </p>
          </>
        }
      />
    </div>
  );
}
