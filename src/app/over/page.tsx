import Introduction from '@/components/common/IntroductionImage/IntroductionImage';
import TextSection from '@/components/common/TextSection/TextSection';
import Link from 'next/link';
import './page.css';
import TrainerProfile from '@/components/Contact/TrainerProfile';
import Image from 'next/image';
import { buildMetadata } from '@/lib/siteConfig';

export const metadata = buildMetadata({
  title: 'Over ons',
  description:
    'Maak kennis met de Eerste Goirlese Schaakclub (EGS), opgericht in 1935, ' +
    'en haar jeugdafdeling: lesopzet, trainers en praktische informatie.',
  path: '/over',
});

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
          bio="Binnen Schaakclub EGS is Jasper werkzaam als jeugdleider en trainer voor de hoogste groep van onze club. Hij is heel erg op de hoogte van actualiteiten in de schaakwereld en heeft veel ervaring met het spelen van toernooien en wedstrijden. Verder heeft hij ook al vele jaren theoretische schaakkennis achter de rug en heeft hij veel ervaring binnen EGS. Deze theoretische en praktijkkennis wil hij graag doorgeven aan de volgende generatie schakers.
Met zijn werk in de zorg, weet hij ook goed hoe hij om moet gaan met niet-schaakgerelateerde problemen en helpt hij graag kinderen.
Als jeugdleider zorgt hij ervoor dat er op elk niveau passend lesgegeven wordt. Hij neemt daarnaast, samen met Ciske, de organisatie van de jeugdafdeling voor zijn rekening.
Tot slot is Jasper nauw betrokken bij de kampcommissie en streeft hij ernaar om schaken voor iedereen zo leuk te maken als hij het zelf vindt.
"
        />
        <TrainerProfile
          name="Ciske"
          imageSrc="/trainer/Ciske.jpeg"
          objectPosition="100% -10px"
          bio="Ciske is binnen Schaakclub EGS werkzaam als jeugdsecretaris. Hij schaakt al meer dan tien jaar bij onze vereniging en traint zelf om beter te worden. Als jeugdsecretaris is hij verantwoordelijk voor het reilen en zeilen van de jeugd en neemt hij, samen met Jasper, de organisatorische taken van de jeugdafdeling op zich.
Ciske studeert een bachelor Politicologie aan de Radboud Universiteit te Nijmegen. Hij is nauw betrokken bij politiek en maatschappij en brengt die kennis ook terug in de organisatie van de jeugdschaak.
De liefde voor organisatie en bestuur neemt hij ook mee naar de kampcommissie, waarbinnen hij actief deelneemt aan de organisatie van het jeugdkamp.
Hij houdt binnen zijn taken ook contact met de leden en zorgt ervoor dat de club goed en voldoende bereikbaar blijft. Met veel plezier zet hij zich in om de jeugdafdeling van de schaakclub elke dag beter, soepeler en gezelliger te laten werken.
"
        />
        <TrainerProfile
          name="Sil"
          imageSrc="/trainer/Sil.jpeg"
          scale={1.1}
          objectPosition="5px -20px"
          bio="Sil is in het dagelijks leven aan het studeren om Aardrijkskunde te geven aan middelbare scholieren. Met zijn volle overtuiging en veel plezier geeft hij graag les en leert hij leerlingen nieuwe dingen aan. Niet alleen de cognitieve kennis vergroten is voor Sil belangrijk, maar ook de sociale ontwikkeling van kinderen is voor hem een opdracht. Hij past daarom zeer goed in zijn taak als jeugdtrainer van de stap-1-groep.
De stap-1-groep is binnen Schaakclub EGS de groep met de jongste kinderen en Sil zet zich ervoor in dat die kinderen niet alleen beter leren schaken, maar ook een grotere sociale ontwikkeling doormaken.
Dit zie je daarnaast ook terug in Sil zijn actieve bijdrage aan de kampcommissie voor het jaarlijkse jeugdkamp, waar we kinderen uitdagen om zich te laten zien van een andere kant dan ze doen achter het schaakbord. Sil schaakt daarnaast zelf al meer dan tien jaar bij onze vereniging en traint zelf nog om beter te worden.
"
        />
        <TrainerProfile
          name="Thijs"
          imageSrc="/trainer/Thijs.jpeg"
          objectPosition="5px 0px"
          bio="Thijs is binnen EGS werkzaam als jeugdtrainer voor de middengroep. Hij zet zich met veel passie en enthousiasme in om leerlingen verder te trainen en hun basisvaardigheden te versterken en uit te bouwen. Daarbij weet hij de spelers te motiveren en uit te dagen om zich stap voor stap te ontwikkelen.
Thijs is zelf in 2010 als kind begonnen bij EGS en is de club sindsdien altijd trouw gebleven. Door de jaren heen heeft hij niet alleen als speler, maar ook als trainer veel binding met de vereniging opgebouwd.
Met enige ervaring voor de klas en zijn huidige functie als IT-consultant, brengt hij bovendien waardevolle vaardigheden mee op het gebied van communicatie, samenwerken en het ondersteunen van anderen. In zijn rol als trainer ligt zijn kracht vooral in het creëren van een fijne leeromgeving waarin samenwerking en persoonlijke ontwikkeling centraal staan.
"
        />
        <TrainerProfile
          name="Niels"
          imageSrc="/trainer/Niels.jpeg"
          objectPosition="10px 0px"
          scale={1.1}
          bio="Niels is binnen de Eerste Goirlese Schaakclub actief als jeugdtrainer van de middengroep en helpt daarnaast regelmatig bij de stap-1-groep. Hij is via de schaakbond opgeleid als trainer en heeft al langere tijd ervaring binnen de club.
In zijn trainingen staat plezier centraal. Hij vindt het belangrijk dat iedere leerling zich op zijn eigen niveau kan ontwikkelen en hij legt de nadruk op duidelijke uitleg en helpt spelers stap voor stap verder. 
Niels is de zoon van oud-schaaktrainer Pieter Couwenberg, waardoor hij al op jonge leeftijd met schaken in aanraking kwam. Dat heeft hem gevormd in hoe hij zelf nu training geeft: met aandacht voor zowel het spel als het plezier eromheen.
Naast het trainen vind je hem ook vaak terug bij de kampcommissie, waar hij graag meedenkt en helpt om activiteiten neer te zetten waar jeugdspelers met plezier aan terugdenken.
"
        />
        <TrainerProfile
          name="Sjaak"
          imageSrc="/trainer/Sjaak.jpeg"
          bio="Binnen Schaakclub EGS speelt Sjaak bij het wedstrijdteam EGS2 en is werkzaam als trainer voor de hoogste groep. Hij wil leerlingen graag voorbereiden en motiveren om mee te doen aan wedstrijden in de schaakwereld van de volwassenen.
Dankzij zijn werk heeft hij veel ervaring met training, discipline en strategie. Drie essentiële competenties die je nodig hebt om beter te worden in schaken. Hij vindt het belangrijk dat in de hoogste groep niet alleen maar gekeken wordt naar eindeloze schaaktheorie, maar ook naar het plezier in het spel en de sportiviteit onderling.
"
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
