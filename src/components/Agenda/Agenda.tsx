import React from 'react';
import styles from './Agenda.module.css';
import { fetchAgendaTable, getTimeFrame, splitTableDate } from '@/lib/agenda';

const CalendarIcon = () => (
  <svg
    className={styles.headerIcon}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ArchiveIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
    />
  </svg>
);

const AgendaComponent: React.FC = async () => {
  const rawAgendaHTML = await fetchAgendaTable();
  const timeFrame = await getTimeFrame();

  if (!rawAgendaHTML) {
    return (
      <div className="text-center p-4 text-gray-400">Agenda unavailable</div>
    );
  }

  // Split the raw HTML into two parts
  const agendaData = splitTableDate(rawAgendaHTML);

  if (!agendaData) return null;

  return (
    <div className={styles.widgetContainer}>
      {/* --- UPCOMING EVENTS SECTION --- */}
      <div className={styles.header}>
        <CalendarIcon />
        <h2 className={styles.headerTitle}>Agenda</h2>
        <div className={styles.headerSubtitle}>
          <ClockIcon />
          <span>{timeFrame}</span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <div dangerouslySetInnerHTML={{ __html: agendaData.upcomingHtml }} />
      </div>

      {/* --- PAST EVENTS (ARCHIVE) SECTION --- */}
      <details className={styles.archiveDetails}>
        <summary className={styles.archiveSummary}>
          <ArchiveIcon />
          <span>Toon eerdere activiteiten</span>
        </summary>
        <div className={`${styles.tableWrapper} ${styles.archiveTable}`}>
          <div dangerouslySetInnerHTML={{ __html: agendaData.pastHtml }} />
        </div>
      </details>
    </div>
  );
};

export default AgendaComponent;
