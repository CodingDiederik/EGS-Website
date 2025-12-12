import Introduction from '@/components/common/IntroductionImage/IntroductionImage';
import TextSection from '@/components/common/TextSection/TextSection';
import './page.css';

export default function Agenda() {
  return (
    <div className="image-text">
      {/* Default introduction component*/}
      <Introduction text="Nieuws" />

      {/* Explanation about proeflessen */}
      <TextSection
        text={
          <>
            <p>
              Hier vindt u het laatste nieuws van EGS Goirle. Blijf op de hoogte
              van onze nieuwste ontwikkelingen, evenementen en speciale
              aankondigingen. We delen regelmatig updates om u geïnformeerd te
              houden over alles wat er speelt binnen onze gemeenschap.
            </p>
            <p>
              Of het nu gaat om nieuwe lesprogramma&apos;s, bijzondere evenementen of
              andere belangrijke informatie, ons nieuwsoverzicht is uw bron voor
              alles wat er bij EGS Goirle gebeurt. Kom regelmatig terug om niets
              te missen!
            </p>
          </>
        }
      />
    </div>
  );
}
