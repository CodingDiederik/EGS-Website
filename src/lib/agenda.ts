import { fetchAPI } from '@/lib/wordpress/articles';
import { load } from 'cheerio';
import DOMPurify from 'isomorphic-dompurify';

export async function getTimeFrame(): Promise<string> {
  const now = new Date();

  return `${now.getFullYear()} - ${now.getFullYear() + 1}`;
}

export function splitTableDate(
  tableContent: string,
): { upcomingHtml: string; pastHtml: string } | null {
  if (!tableContent) return null;

  // 1. Extract the Header Row
  // We look for the first <tr>...</tr> inside the string
  const rowRegex = /<tr[\s\S]*?<\/tr>/gi;
  const allRows = tableContent.match(rowRegex);

  if (!allRows || allRows.length === 0) return null;

  const headerRow = allRows[0]; // The first row is the header
  const dataRows = allRows.slice(1); // The rest are data

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to ensure fair comparison

  let upcomingRows = '';
  let pastRows = '';

  // 2. Iterate through rows to find the date
  // Regex to find the date pattern DD-MM-YYYY inside a row
  const dateRegex = /(\d{2})-(\d{2})-(\d{4})/;

  dataRows.forEach((row) => {
    const match = dateRegex.exec(row);
    if (match) {
      // match[0] = full date, match[1]=DD, match[2]=MM, match[3]=YYYY
      // Create date object (Month is 0-indexed in JS)
      const rowDate = new Date(
        Number.parseInt(match[3]),
        Number.parseInt(match[2]) - 1,
        Number.parseInt(match[1]),
      );

      // Compare dates
      if (rowDate >= today) {
        upcomingRows += row;
      } else {
        pastRows += row;
      }
    } else {
      // If no date found, we default to adding it to upcoming (or handle as error)
      upcomingRows += row;
    }
  });

  // 3. Helper to wrap rows back into the table structure
  const wrapInTable = (rows: string) => {
    if (!rows)
      return '<div class="p-4 text-center text-gray-500">Geen activiteiten gevonden.</div>';

    return `
      <figure class="wp-block-table">
        <table class="has-fixed-layout">
          <tbody>
            ${headerRow}
            ${rows}
          </tbody>
        </table>
      </figure>
    `;
  };

  return {
    upcomingHtml: wrapInTable(upcomingRows),
    pastHtml: wrapInTable(pastRows),
  };
}

export async function fetchAgendaTable(): Promise<string | null> {
  try {
    const query = `
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

    const data = await fetchAPI(query);
    const rawContent = data?.posts?.edges?.[0]?.node?.content;

    if (!rawContent) return null;

    const $ = load(rawContent);
    const tableElement = $('.wp-block-table');

    if (tableElement.length === 0) return null;

    const tableHTML = tableElement.prop('outerHTML') || '';

    return DOMPurify.sanitize(tableHTML, {
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
  } catch (error) {
    console.error('Agenda Fetch Error:', error);
    return null;
  }
}
