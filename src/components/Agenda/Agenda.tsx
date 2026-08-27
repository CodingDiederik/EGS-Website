import styles from './Agenda.module.css';
import { AgendaItem } from '@/lib/graphql/services/agenda';
import { FaClock, FaCalendar, FaArchive } from 'react-icons/fa';

function AgendaTable({ items }: { items: ReadonlyArray<AgendaItem> }) {
  return (
    <table className={styles.agendaTable}>
      <thead>
        <tr>
          <th>Datum</th>
          <th>Activiteiten</th>
          <th>Opmerkingen</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.Datum + item.Activiteit}>
            <td>{item.Datum}</td>
            <td>
              {item.Activiteit}
              {item.Tweedeactiviteit ? ` / ${item.Tweedeactiviteit}` : ''}
            </td>
            <td>{item.Opmerkingen || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Agenda({
  timeFrame,
  agendaItems,
}: {
  timeFrame: Readonly<string>;
  agendaItems: ReadonlyArray<AgendaItem>;
}) {
  const upcomingItems = agendaItems.filter((item) => item.upcoming);
  const pastItems = agendaItems.filter((item) => !item.upcoming);

  return (
    <div className={styles.widgetContainer}>
      {/* Agenda header */}
      <div className={styles.header}>
        <FaCalendar size="1.5em" />
        <h2 className={styles.headerTitle}>Agenda</h2>
        <div className={styles.headerSubtitle}>
          <FaClock />
          <span>{timeFrame}</span>
        </div>
      </div>

      {/* Upcoming items, or an empty state when the agenda is unavailable */}
      {upcomingItems.length > 0 ? (
        <div className={styles.tableWrapper}>
          <AgendaTable items={upcomingItems} />
        </div>
      ) : (
        <p className={styles.emptyState}>
          Er zijn op dit moment geen agenda-items beschikbaar. Kom later nog
          eens terug.
        </p>
      )}

      {/* Past items */}
      {pastItems.length > 0 && (
        <details className={styles.archiveDetails}>
          <summary className={styles.archiveSummary}>
            <FaArchive />
            <span>Toon eerdere activiteiten</span>
          </summary>
          <div className={`${styles.tableWrapper} ${styles.archiveTable}`}>
            <AgendaTable items={pastItems} />
          </div>
        </details>
      )}
    </div>
  );
}
