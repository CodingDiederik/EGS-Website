import Introduction from '@/components/common/IntroductionImage/IntroductionImage';
import TextSection from '@/components/common/TextSection/TextSection';
import './page.css';
import Form from '@/components/common/Form/Form';
import { PROEFLES_FORM_FIELDS, PROEFLES_FORM_NAME } from './constants';

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
              Bij Schaakclub EGS is er de mogelijkheid om een gratis proefles te
              volgen voordat u besluit lid te worden. Bij ons schaakclub doen we
              daar nog een schepje bovenop, omdat we het belangrijk vinden dat u
              goed de sfeer van onze vereniging kan proeven. Daarom heeft u hier
              niet recht op één proefles, maar op drie!
            </p>
            <br />
            <p>
              Deelnemen aan proeflessen geeft je de kans om onze faciliteiten te
              verkennen, onze instructeurs te ontmoeten en een idee te krijgen
              van wat we te bieden hebben. Tijdens de proefles krijg je een
              introductie tot onze trainingsmethoden en neem je deel aan een
              groepsles. Onze ervaren instructeurs zullen ervoor zorgen dat je
              je op je gemak voelt en je begeleiden bij elke stap van de les.
            </p>
            <br />
            <p>
              Als u niet drie lessen achter elkaar een proefles kunt volgen,
              hoeft u niet bang te zijn dat u er minder dan drie mag volgen,
              want ze hoeven niet direct achter elkaar opgenomen te worden.
            </p>
            <br />
            <p>
              Om een proefles aan te vragen, kunt hieronder het contactformulier
              invullen. U kunt ook altijd een e-mail sturen naar{' '}
              <a href="mailto:egsjeugd@gmail.com">egsjeugd@gmail.com</a>. Heeft
              u liever telefonisch contact? Dat kan. Dan vragen wij u een e-mail
              met belverzoek te sturen naar{' '}
              <a href="mailto:egsjeugd@gmail.com">egsjeugd@gmail.com</a> en dan
              maakt onze jeugdsecretaris met u een afspraak.
            </p>
            <br />
            <p>
              We kijken ernaar uit je te verwelkomen bij EGS Goirle en je te
              laten zien wat we te bieden hebben!
            </p>
          </>
        }
      />
      <Form
        formFields={PROEFLES_FORM_FIELDS}
        header="Aanvraag proeflessen"
        formName={PROEFLES_FORM_NAME}
      />
    </div>
  );
}
