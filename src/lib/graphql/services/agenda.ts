import { fetchGraphQL } from '../client';
import DOMPurify from 'isomorphic-dompurify';

export interface AgendaItem {
  upcoming: boolean;
  Activiteit: string;
  Datum: string;
  Tweedeactiviteit?: string;
  Opmerkingen?: string;
}

interface GetAgendaResponse {
  posts?: {
    edges?: { node: { content: string } }[];
  };
}
const GET_AGENDA_QUERY = `
  query GetAgenda {
    posts(where: {categoryName: "agenda"}, first: 1) {
      edges {
        node {
          content
        }
      }
    }
  }
`;

function sanitizeAgendaContent(rawContent: string): string | null {
  return DOMPurify.sanitize(rawContent, {
    ALLOWED_TAGS: [
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
  });
}

function convertToAgendaItem(row: string): AgendaItem | null {
  // extract all <td>...</td> contents
  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  const cells: string[] = [];
  let m;
  while ((m = tdRegex.exec(row)) !== null) {
    let cell = m[1] || '';
    // remove inner HTML tags
    cell = cell.replaceAll(/<[^>]+>/g, '');
    // decode common HTML entities minimally
    cell = cell.replaceAll('&nbsp;', ' ').replaceAll('&amp;', '&').trim();
    // normalize multiple spaces
    cell = cell.replaceAll(/\s+/g, ' ').trim();
    cells.push(cell);
  }

  if (cells.length === 0) return null;

  // detect header row (contains "Datum" or "Activiteit" etc.)
  const firstLower = (cells[0] || '').toLowerCase();
  if (firstLower.includes('datum') || firstLower.includes('activiteit'))
    return null;

  // map cells to fields (expecting 4 columns)
  const [datumRaw = '', activiteit = '', tweede = '', opmerkingen = ''] = cells;

  // parse date in format DD-MM-YYYY (fall back to invalid -> upcoming=false)
  let upcoming = false;
  const dateRegex = /(\d{1,2})-(\d{1,2})-(\d{4})/;
  const dateMatch = dateRegex.exec(datumRaw);
  if (dateMatch) {
    const day = Number.parseInt(dateMatch[1], 10);
    const month = Number.parseInt(dateMatch[2], 10) - 1;
    const year = Number.parseInt(dateMatch[3], 10);
    const eventDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    upcoming = eventDate >= today;
  }

  return {
    upcoming,
    Activiteit: activiteit,
    Datum: datumRaw,
    Tweedeactiviteit: tweede || undefined,
    Opmerkingen: opmerkingen || undefined,
  };
}

function extractTable(sanitizedContent: string): AgendaItem[] | null {
  const tableRegex = /<figure class="wp-block-table">[\s\S]*?<\/figure>/gi;
  const matches = Array.from(sanitizedContent.matchAll(tableRegex));
  if (matches.length === 0) return null;

  const tableHtml = matches[0][0];

  // Parse the tableHtml into AgendaItem objects
  const rowRegex = /<tr[\s\S]*?<\/tr>/gi;
  const rows = tableHtml.match(rowRegex);
  if (!rows || rows.length === 0) return null;

  const agendaItems: AgendaItem[] = [];

  // Convert rows to AgendaItem, skipping header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const agendaItem = convertToAgendaItem(row);
    if (agendaItem) {
      agendaItems.push(agendaItem);
    }
  }

  return agendaItems.length > 0 ? agendaItems : null;
}

export async function getAgendaItems(): Promise<AgendaItem[] | null> {
  try {
    const agendaData = await fetchGraphQL<GetAgendaResponse>(GET_AGENDA_QUERY, {
      next: { revalidate: 600, tags: ['agenda'] },
    });

    if (!agendaData) return null;

    const rawHTMLContent = agendaData.posts?.edges?.[0]?.node?.content;
    if (!rawHTMLContent) return null;

    const sanitizedContent = sanitizeAgendaContent(rawHTMLContent);
    if (!sanitizedContent) return null;

    const extractedTable = extractTable(sanitizedContent);
    return extractedTable;
  } catch (error) {
    console.error('Error fetching agenda items:', error);
    return null;
  }
}

export function getCurrentSchoolyear(): string {
  const now = new Date();

  if (now.getMonth() < 6) {
    return `${now.getFullYear() - 1} - ${now.getFullYear()}`;
  }

  return `${now.getFullYear()} - ${now.getFullYear() + 1}`;
}
