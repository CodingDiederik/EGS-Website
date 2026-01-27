import styles from './Agenda.module.css';
import { AgendaItem } from '@/lib/graphql/services/agenda';
import { FaClock, FaCalendar, FaArchive } from 'react-icons/fa';

export default function Agenda({
  timeFrame,
  agendaItems,
}: {
  timeFrame: Readonly<string>;
  agendaItems: ReadonlyArray<AgendaItem>;
}) {
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

      {/* Set the table data for upcoming items */}
      <div className={styles.tableWrapper}>
        <table className={styles.agendaTable}>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Activiteiten</th>
              <th>Opmerkingen</th>
            </tr>
          </thead>
          <tbody>
            {agendaItems
              .filter((item) => item.upcoming)
              .map((item) => (
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
      </div>

      {/* Past items */}
      <details className={styles.archiveDetails}>
        <summary className={styles.archiveSummary}>
          <FaArchive />
          <span>Toon eerdere activiteiten</span>
        </summary>
        <div className={`${styles.tableWrapper} ${styles.archiveTable}`}>
          <table className={styles.agendaTable}>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Activiteiten</th>
                <th>Opmerkingen</th>
              </tr>
            </thead>
            <tbody>
              {agendaItems
                .filter((item) => !item.upcoming)
                .map((item) => (
                  <tr key={item.Datum + item.Activiteit}>
                    <td>{item.Datum}</td>
                    <td>
                      {item.Activiteit}
                      {item.Tweedeactiviteit
                        ? ` / ${item.Tweedeactiviteit}`
                        : ''}
                    </td>
                    <td>{item.Opmerkingen || '-'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
