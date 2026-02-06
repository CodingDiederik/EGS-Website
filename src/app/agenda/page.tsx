import Agenda from '@/components/Agenda/Agenda';
import {
  getAgendaItems,
  getCurrentSchoolyear,
} from '@/lib/graphql/services/agenda';
import ErrorAgenda from './error';

export default async function AgendaPage() {
  const agendaData = await getAgendaItems();
  const timeframe = getCurrentSchoolyear();

  if (!agendaData) {
    return <ErrorAgenda />;
  }

  return <Agenda timeFrame={timeframe} agendaItems={agendaData} />;
}
