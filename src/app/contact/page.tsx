import Introduction from '@/components/common/IntroductionImage/IntroductionImage';
import TextSection from '@/components/common/TextSection/TextSection';
import Form from '@/components/common/Form/Form';
import './page.css';
import { CONTACT_FORM_FIELDS, CONTACT_FORM_NAME } from './constants';
import { buildMetadata } from '@/lib/siteConfig';

export const metadata = buildMetadata({
  title: 'Contact',
  description:
    'Neem contact op met de jeugdafdeling van Schaakclub EGS Goirle. ' +
    'Stel je vraag via het contactformulier of per e-mail.',
  path: '/contact',
});

export default function Contact() {
  return (
    <div className="image-text">
      {/* Default introduction component*/}
      <Introduction text="Contact" />

      <TextSection
        text={
          <>
            <p>
              Hebt u nog vragen of wilt u graag meer weten? Neem dan gerust
              contact op met onze vereniging. Wij staan klaar voor al uw vragen,
              opmerkingen en verzoeken, of u nu meer wilt weten over onze
              lesprogramma&apos;s, speciale evenementen of lidmaatschapsopties,
              ons team is beschikbaar om uw vragen te beantwoorden.
            </p>
            <br />
            <p>
              U kunt ons bereiken via het contactformulier hieronder, of via de
              e-mail <a href="mailto:egsjeugd@gmail.com">egsjeugd@gmail.com</a>.
              Heeft u liever telefonisch contact? Dat kan. Dan vragen wij u een
              e-mail met belverzoek te sturen naar{' '}
              <a href="mailto:egsjeugd@gmail.com">egsjeugd@gmail.com</a> en dan
              maakt onze jeugdsecretaris met u een afspraak.
            </p>
          </>
        }
      />

      <Form
        formFields={CONTACT_FORM_FIELDS}
        header="Contactformulier"
        formName={CONTACT_FORM_NAME}
      />
    </div>
  );
}
