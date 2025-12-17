import { fetchAPI } from '@/lib/fetch';
import { load } from 'cheerio';
import sanitizeHtml from 'sanitize-html';

export async function getTimeFrame(): Promise<string> {
  const now = new Date();

  if (now.getMonth() >= 6) {
    return `${now.getFullYear()} - ${now.getFullYear() + 1}`;
  }
  return `${now.getFullYear() - 1} - ${now.getFullYear()}`;
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
        '*': ['class'],
        td: ['colspan', 'rowspan'],
        th: ['colspan', 'rowspan'],
      },
    });
  } catch (error) {
    console.error('Agenda Fetch Error:', error);
    return null;
  }
}
