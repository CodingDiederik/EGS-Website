import { htmlToText } from 'html-to-text';
import DOMPurify from 'isomorphic-dompurify';

export function extractFirstImage(content: string): string | null {
  const cleanContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['img'],
  });
  const match = /<img[^>]+src=['"]([^'"]+)['"]/.exec(cleanContent);
  const matchedImage = match ? match[1] : null;

  if (!matchedImage) return null;
  return matchedImage.replaceAll('http://', 'https://');
}

export function getFillerImage(id: string): string {
  const fillers = [
    '/fillers/filler1.jpg',
    '/fillers/filler2.jpg',
    '/fillers/filler3.jpg',
  ];
  let sum = 0;
  for (let i = 0; i < id.length; i++) {
    sum += id.codePointAt(i) || 0;
  }
  return fillers[sum % fillers.length];
}

export function createExcerpt(content: string): string {
  const MAXLENGTH = 150;
  if (!content) return '';

  // Convert HTML to plain text, skipping images
  const cleanText = htmlToText(content, {
    wordwrap: false,
    selectors: [{ selector: 'img', format: 'skip' }],
    // decodeEntities is true by default
  })
    .replaceAll(/\s+/g, ' ')
    .trim();

  if (cleanText.length <= MAXLENGTH) return cleanText;

  return cleanText.slice(0, MAXLENGTH) + '...';
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
    .format(date)
    .replaceAll('/', '-');
}
