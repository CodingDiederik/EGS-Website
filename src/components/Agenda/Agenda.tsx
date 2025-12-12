import React from 'react';
import { fetchAPI } from '@/getter/fetch';
import { load } from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import styles from './Agenda.module.css';

// --- Helper Components for Icons ---
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

async function getTimeFrame(): Promise<string> {
  const now = new Date();

  if (now.getMonth() > 6) {
    return `${now.getFullYear()} - ${now.getFullYear() + 1}`;
  }
  return `${now.getFullYear() - 1} - ${now.getFullYear()}`;
}

async function fetchAgendaTable(): Promise<string | null> {
  try {
    const query = `
      query GetAgenda {
        posts(where: {id: 90}) {
          edges {
            node {
              content
            }
          }
        }
      }
    `;

    const data = await fetchAPI(query);
    const rawContent = data?.posts?.edges?.[0]?.node?.content;

    if (!rawContent) return null;

    const $ = load(rawContent);
    const tableElement = $('.wp-block-table');

    if (tableElement.length === 0) return null;

    const tableHTML = tableElement.prop('outerHTML') || '';

    return sanitizeHtml(tableHTML, {
      allowedTags: [
        'figure',
        'table',
        'tbody',
        'thead',
        'tr',
        'td',
        'th',
        'strong',
        'b',
        'span',
      ],
      allowedAttributes: {
        '*': ['class', 'style'],
        td: ['colspan', 'rowspan'],
        th: ['colspan', 'rowspan'],
      },
    });
  } catch (error) {
    console.error('Agenda Fetch Error:', error);
    return null;
  }
}

const AgendaComponent: React.FC = async () => {
  const agendaHTML = await fetchAgendaTable();

  if (!agendaHTML) {
    return (
      <div className="text-center p-4 text-gray-400">Agenda unavailable</div>
    );
  }

  return (
    // 1. Colorful Outer Widget Container
    <div className={styles.widgetContainer}>
      {/* 2. Header Section with Title & Icons */}
      <div className={styles.header}>
        <CalendarIcon />
        <h2 className={styles.headerTitle}>Agenda & Activiteiten</h2>

        {/* Optional: A small subtitle or extra icon on the right */}
        <div className={styles.headerSubtitle}>
          <ClockIcon />
          <span>{await getTimeFrame()}</span>
        </div>
      </div>

      {/* 3. White Table Container */}
      <div className={styles.tableWrapper}>
        <div dangerouslySetInnerHTML={{ __html: agendaHTML }} />
      </div>
    </div>
  );
};

export default AgendaComponent;
