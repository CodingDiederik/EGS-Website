import Agenda from '@/components/Agenda/Agenda';
import {
  getAgendaItems,
  getCurrentSchoolyear,
} from '@/lib/graphql/services/agenda';
import { buildMetadata } from '@/lib/siteConfig';

export const metadata = buildMetadata({
  title: 'Agenda',
  description:
    'Bekijk de agenda van de jeugdafdeling van Schaakclub EGS Goirle: ' +
    'lesavonden, toernooien, het jeugdkamp en andere activiteiten.',
  path: '/agenda',
});

export default async function AgendaPage() {
  // getAgendaItems() never throws; a failing backend yields an empty agenda,
  // which Agenda renders as an empty state instead of breaking the build.
  const agendaData = await getAgendaItems();
  const timeframe = getCurrentSchoolyear();

  return <Agenda timeFrame={timeframe} agendaItems={agendaData} />;
}

// Keep revalidating even when the build-time fetch failed, so an empty agenda
// repairs itself without a redeploy.
export const revalidate = 600;
