import Introduction from '@/components/common/IntroductionImage/IntroductionImage';
import TextSection from '@/components/common/TextSection/TextSection';
import './page.css';
import GalleryPage from '@/components/Fotos/Photogallery';

export default function Fotos() {
  return (
    <div className="image-text">
      {/* Default introduction component*/}
      <Introduction text="Fotos" />

      {/* Explanation about proeflessen */}
      <TextSection
        text={
          <>
            <p>
              Hier vindt u een verzameling van foto&apos;s die de sfeer en
              activiteiten bij EGS Goirle vastleggen. Blader door onze galerij
              om een indruk te krijgen van wat wij te bieden hebben en om de
              herinneringen aan onze evenementen en lessen te herbeleven.
            </p>
            <p>
              Onze fotogalerij wordt regelmatig bijgewerkt met nieuwe beelden,
              dus kom gerust terug om de nieuwste toevoegingen te bekijken. Of u
              nu op zoek bent naar inspiratie of gewoon wilt zien wat er bij EGS
              Goirle gebeurt, onze foto&apos;s geven u een kijkje in onze
              levendige gemeenschap.
            </p>
          </>
        }
      />
      <GalleryPage />
    </div>
  );
}
