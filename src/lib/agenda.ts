import { fetchAPI } from '@/lib/wordpress/articles';
import { load } from 'cheerio';
import DOMPurify from 'isomorphic-dompurify';

export async function getTimeFrame(): Promise<string> {
  const now = new Date();

  return `${now.getFullYear()} - ${now.getFullYear() + 1}`;
}

export function tableToCome() {}

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
