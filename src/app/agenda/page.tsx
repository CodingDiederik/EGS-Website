import Agenda from '@/components/Agenda/Agenda';
import {
  getAgendaItems,
  getCurrentSchoolyear,
} from '@/lib/graphql/services/agenda';
import AgendaErrorContent from './AgendaErrorContent';
import { buildMetadata } from '@/lib/siteConfig';

export const metadata = buildMetadata({
  title: 'Agenda',
  description:
    'Bekijk de agenda van de jeugdafdeling van Schaakclub EGS Goirle: ' +
    'lesavonden, toernooien, het jeugdkamp en andere activiteiten.',
  path: '/agenda',
});

export default async function AgendaPage() {
  const agendaData = await getAgendaItems();
  const timeframe = getCurrentSchoolyear();

  if (!agendaData) {
    return <AgendaErrorContent />;
  }

  return <Agenda timeFrame={timeframe} agendaItems={agendaData} />;
}
