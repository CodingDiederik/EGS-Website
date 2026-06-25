import Introduction from '@/components/common/IntroductionImage/IntroductionImage';
import TextSection from '@/components/common/TextSection/TextSection';
import './page.css';
import FolderSelect from '@/components/Fotos/FolderSelect/FolderSelect';
import { buildMetadata } from '@/lib/siteConfig';

export const metadata = buildMetadata({
  title: "Foto's",
  description:
    "Bekijk foto's van de lessen, toernooien en activiteiten van de " +
    'jeugdafdeling van Schaakclub EGS Goirle.',
  path: '/fotos',
});

export default function Fotos() {
  return (
    <div className="image-text">
      {/* Default introduction component*/}
      <Introduction text="Foto's" />

      <TextSection
        text={
          <>
            <p>
              Hier vindt u een verzameling van foto&apos;s die de sfeer en
              activiteiten bij Schaakclub EGS vastleggen. Blader door onze
              galerij om een indruk te krijgen van wat wij te bieden hebben en
              om de herinneringen aan onze evenementen en lessen te beleven.
            </p>
            <br />
            <p>
              Onze fotogalerij wordt regelmatig bijgewerkt met nieuwe kiekjes,
              dus kom gerust later terug om de nieuwste toevoegingen te
              bekijken. Of u nu op zoek bent naar inspiratie of gewoon wilt zien
              wat er bij Schaakclub EGS gebeurt, onze foto&apos;s geven u een
              kijkje in onze levendige en gezellige vereniging.
            </p>
          </>
        }
      />

      <FolderSelect />
    </div>
  );
}
