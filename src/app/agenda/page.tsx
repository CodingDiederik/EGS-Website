import AgendaComponent from '@/components/Agenda/Agenda';
import {
  getAgendaItems,
  getCurrentSchoolyear,
} from '@/lib/graphql/services/agenda';

export default async function Agenda() {
  const agendaData = await getAgendaItems();
  const timeframe = getCurrentSchoolyear();

  if (!agendaData) {
    return <div>Geen agenda items beschikbaar.</div>;
  }

  return <AgendaComponent timeFrame={timeframe} agendaItems={agendaData} />;
}
