import Introduction from '@/components/common/IntroductionImage/IntroductionImage';
import TextSection from '@/components/common/TextSection/TextSection';
import './page.css';
import ProeflesForm from '@/components/Proefles/ProeflesForm';

export default function Proefles() {
  return (
    <div className="image-text">
      {/* Default introduction component*/}
      <Introduction text="Proeflessen" />

      {/* Explanation about proeflessen */}
      <TextSection
        text={
          <>
            <p>
              Bij EGS Goirle bieden we de mogelijkheid om een proefles te volgen
              voordat je besluit lid te worden. Dit geeft je de kans om onze
              faciliteiten te verkennen, onze instructeurs te ontmoeten en een
              idee te krijgen van wat we te bieden hebben.
            </p>
            <p>
              Tijdens de proefles krijg je een introductie tot onze
              trainingsmethoden en kun je deelnemen aan een groepsles of een
              individuele sessie, afhankelijk van je voorkeur. Onze ervaren
              instructeurs zullen ervoor zorgen dat je je op je gemak voelt en
              je begeleiden bij elke stap van de les.
            </p>
            <p>
              Om een proefles in te plannen, kun je contact met ons opnemen via
              onze website of telefonisch. We raden aan om van tevoren te
              reserveren, zodat we voldoende tijd kunnen inplannen voor jouw
              sessie. We kijken ernaar uit je te verwelkomen bij EGS Goirle en
              je te laten zien wat we te bieden hebben!
            </p>
          </>
        }
      />
      <ProeflesForm />
    </div>
  );
}
