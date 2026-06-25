import Introduction from '@/components/common/IntroductionImage/IntroductionImage';
import './page.css';
import NewsSection from '@/components/common/News/NewsSection/NewsSection';
import { buildMetadata } from '@/lib/siteConfig';

export const metadata = buildMetadata({
  title: 'Nieuws',
  description:
    'Het laatste nieuws van de jeugdafdeling van Schaakclub EGS Goirle: ' +
    'toernooiverslagen, uitslagen, activiteiten en mededelingen.',
  path: '/nieuws',
});

export default function Nieuws() {
  return (
    <div className="image-text">
      {/* Default introduction component*/}
      <Introduction text="Nieuws" />
      <div className="content-wrapper">
        <div className="spacer" />
        <NewsSection displayLoadMore={true} />
      </div>
    </div>
  );
}
