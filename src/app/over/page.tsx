import Introduction from '@/components/common/IntroductionImage/IntroductionImage';
import TextSection from '@/components/common/TextSection/TextSection';
import Link from 'next/link';
import './page.css';
import TrainerProfile from '@/components/Contact/TrainerProfile';
import Image from 'next/image';

export default function Over() {
  return (
    <div className="image-text">
      {/* Default introduction component*/}
      <Introduction text="Over" />

      <TextSection
        text={
          <>
            <p>
              90 jaar geleden, op 1 september 1935, werd de Eerste Goirlese
              Schaakclub opgericht door echte schaakfanaten. Inmiddels hebben we
              al voor een aantal decennia daarbij ook een jeugdafdeling
              ingericht. Op deze jeugdafdeling krijgen leden les in de
              schaaksport en worden ze gestimuleerd om deel te nemen aan
              verschillende soorten toernooien. Daarnaast wordt er ook een
              jeugdkamp georganiseerd en kunnen er prijzen worden verdiend
              tijdens twee interne competities. Bovendien krijgen de leerlingen
              die succesvol een lesboek afwerken en examen halen een diploma.
            </p>
            <br />
            <p>
              Elke les staat ons team van trainers klaar om elke leerling te
              begeleiden op zijn of haar eigen niveau. Samen zorgen zij ervoor
              dat alle leerlingen zich thuis voelen en dat er een hechte groep
              ontstaat.
            </p>
            <br />
            <p>
              De schaaklessen zijn onderverdeeld in zes stappen waarbij er ook
              nog tussenstappen zijn. Stap 1 is voor beginnende schakers en
              behandelt alle basisregels en -stappen. In stap 2 leren de
              leerlingen tactischer denken, aanvallen en verdedigen, waarna ze
              in stap 3 tot echte clubschakers worden getraind. In stap 4, 5 en
              6 wordt er meer aandacht besteed aan tactiek, strategie en inzicht
              en wordt je echt een hele goede schaker.
            </p>
            <br />
            <p>
              Als de leerlingen op een gegeven moment klaar zijn voor
              uitdagendere en langere partijen, dan kunnen ze meespelen bij de
              volwassenen, waar je nog meer leert. Ook kunnen ze dan meespelen
              met de externe competitie tegen andere schaakverenigingen.
            </p>
            <br />

            <h2>Praktische informatie</h2>
            <p>
              Verder is een van de mooiere dingen aan schaakclub EGS de lage
              contributie. Voor maar liefst €95,- bent u al een heel jaar
              jeugdlid. Wordt u verderop in het jaar lid, dan wordt deze
              contributie ook nog eens naar beneden bijgesteld. Het jeugdkamp en
              externe toernooien zitten niet inbegrepen bij de contributie en
              kunnen extra kosten met zich meebrengen. Voor de volwassenen zijn
              hogere tarieven van toepassing.
            </p>
            <br />
            <p>
              De lessen van de jeugd vinden plaats op vrijdagavond van 18.45 uur
              tot 20.15 uur bij Wijkcentrum &apos;De Wildacker&apos;, van
              Hogendorpplein 73, 5051 ST Goirle. Voor de actuele data en{' '}
              <Link href="/agenda">agenda</Link> kunt u hier kijken. U kunt
              natuurlijk ook <Link href="/contact">contact</Link> met ons
              opnemen. Hier vindt u meer informatie over onze contactgegevens en
              -mogelijkheden.
            </p>

            <br />
            <p>Hopelijk kunnen we u snel verwelkomen bij onze vereniging!</p>
            <br />
            <h2>Onze trainers</h2>
          </>
        }
      />
      <div className="trainer-section">
        <TrainerProfile
          name="Jasper"
          imageSrc="/trainer/Jasper.jpeg"
          objectPosition="170% -10px"
          scale={1.6}
          bio="Jasper is een ervaren schaaktrainer die al vele jaren lesgeeft aan jeugdspelers van alle niveaus. Met zijn geduldige en enthousiaste aanpak weet hij elke leerling te motiveren en te inspireren om het beste uit zichzelf te halen."
        />
        <TrainerProfile
          name="Ciske"
          imageSrc="/trainer/Ciske.jpeg"
          objectPosition="100% -10px"
          bio="Ciske is een ervaren schaaktrainer die al vele jaren lesgeeft aan jeugdspelers van alle niveaus. Met zijn geduldige en enthousiaste aanpak weet hij elke leerling te motiveren en te inspireren om het beste uit zichzelf te halen."
        />
        <TrainerProfile
          name="Sil"
          imageSrc="/trainer/Sil.jpeg"
          scale={1.1}
          objectPosition="5px -20px"
          bio="Sil is een ervaren schaaktrainer die al vele jaren lesgeeft aan jeugdspelers van alle niveaus. Met zijn geduldige en enthousiaste aanpak weet hij elke leerling te motiveren en te inspireren om het beste uit zichzelf te halen."
        />
        <TrainerProfile
          name="Thijs"
          imageSrc="/trainer/Thijs.jpeg"
          objectPosition="5px 0px"
          bio="Thijs is een ervaren schaaktrainer die al vele jaren lesgeeft aan jeugdspelers van alle niveaus. Met zijn geduldige en enthousiaste aanpak weet hij elke leerling te motiveren en te inspireren om het beste uit zichzelf te halen."
        />
        <TrainerProfile
          name="Niels"
          imageSrc="/trainer/Niels.jpeg"
          objectPosition="10px 0px"
          scale={1.1}
          bio="Niels is een ervaren schaaktrainer die al vele jaren lesgeeft aan jeugdspelers van alle niveaus. Met zijn geduldige en enthousiaste aanpak weet hij elke leerling te motiveren en te inspireren om het beste uit zichzelf te halen."
        />
        <TrainerProfile
          name="Sjaak"
          imageSrc="/trainer/Sjaak.jpeg"
          bio="Sjaak is een ervaren schaaktrainer die al vele jaren lesgeeft aan jeugdspelers van alle niveaus. Met zijn geduldige en enthousiaste aanpak weet hij elke leerling te motiveren en te inspireren om het beste uit zichzelf te halen."
        />
        <Image
          src="/trainer/Group.jpeg"
          alt="Onze trainers"
          width={800}
          height={600}
          className="group-image"
        />
      </div>
    </div>
  );
}
