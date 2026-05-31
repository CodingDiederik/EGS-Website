import { fetchGraphQL } from '../client';
import * as cheerio from 'cheerio';

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

function convertToAgendaItem(cells: string[]): AgendaItem | null {
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

function extractTable(rawContent: string): AgendaItem[] | null {
  const $ = cheerio.load(rawContent, null, false);

  const table = $('figure.wp-block-table').first();
  if (table.length === 0) return null;

  const rows = table.find('tr').toArray();
  if (rows.length === 0) return null;

  const agendaItems: AgendaItem[] = [];

  // Convert rows to AgendaItem, skipping the header row
  for (const row of rows.slice(1)) {
    // extract the text content of each cell (cheerio strips inner tags and
    // decodes HTML entities for us)
    const cells = $(row)
      .find('td')
      .toArray()
      .map((td) => $(td).text().replaceAll(/\s+/g, ' ').trim());

    const agendaItem = convertToAgendaItem(cells);
    if (agendaItem) {
      agendaItems.push(agendaItem);
    }
  }

  return agendaItems.length > 0 ? agendaItems : null;
}

export async function getAgendaItems(): Promise<AgendaItem[] | null> {
  const agendaData = await fetchGraphQL<GetAgendaResponse>(GET_AGENDA_QUERY, {
    next: { revalidate: 600, tags: ['agenda'] },
  });

  const rawHTMLContent = agendaData.posts?.edges?.[0]?.node?.content;
  if (!rawHTMLContent) return null;

  return extractTable(rawHTMLContent);
}

export function getCurrentSchoolyear(): string {
  const now = new Date();

  if (now.getMonth() < 6) {
    return `${now.getFullYear() - 1} - ${now.getFullYear()}`;
  }

  return `${now.getFullYear()} - ${now.getFullYear() + 1}`;
}
