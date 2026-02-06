import Agenda from '@/components/Agenda/Agenda';
import {
  getAgendaItems,
  getCurrentSchoolyear,
} from '@/lib/graphql/services/agenda';
import { notFound } from 'next/navigation';

export default async function AgendaPage() {
  const agendaData = await getAgendaItems();
  const timeframe = getCurrentSchoolyear();

  if (!agendaData) {
    return notFound();
  }

  return <Agenda timeFrame={timeframe} agendaItems={agendaData} />;
}
