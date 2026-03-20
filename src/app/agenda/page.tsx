import Agenda from '@/components/Agenda/Agenda';
import {
  getAgendaItems,
  getCurrentSchoolyear,
} from '@/lib/graphql/services/agenda';
import AgendaErrorContent from './AgendaErrorContent';

export default async function AgendaPage() {
  const agendaData = await getAgendaItems();
  const timeframe = getCurrentSchoolyear();

  if (!agendaData) {
    return <AgendaErrorContent />;
  }

  return <Agenda timeFrame={timeframe} agendaItems={agendaData} />;
}
