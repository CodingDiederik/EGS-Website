import * as cheerio from 'cheerio';

// Elements that can execute scripts or otherwise break out of the article body
// when injected via dangerouslySetInnerHTML. They are dropped entirely.
const FORBIDDEN_TAGS = [
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'noscript',
  'form',
  'input',
  'button',
  'textarea',
  'select',
  'link',
  'meta',
  'base',
];

const URL_ATTRS = new Set([
  'href',
  'src',
  'xlink:href',
  'action',
  'formaction',
]);
const UNSAFE_SCHEME = /^\s*(?:javascript|vbscript):/i;

/**
 * Sanitizes HTML before it is rendered via dangerouslySetInnerHTML.
 *
 * Replaces the previous DOMPurify implementation (which pulled in jsdom on the
 * server) with a cheerio-based pass: script-capable elements are removed, along
 * with inline event handlers, javascript:/vbscript: URLs, and unsafe styles.
 * The HTML originates from the trusted WordPress backend, so this is
 * defence-in-depth rather than a hostile-input sanitizer.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  const $ = cheerio.load(html, null, false);

  $(FORBIDDEN_TAGS.join(',')).remove();

  $('*').each((_, element) => {
    if (!('attribs' in element)) return;

    for (const name of Object.keys(element.attribs)) {
      const lower = name.toLowerCase();
      const value = element.attribs[name] ?? '';

      const isEventHandler = lower.startsWith('on');
      const isUnsafeUrl = URL_ATTRS.has(lower) && UNSAFE_SCHEME.test(value);
      const isUnsafeStyle =
        lower === 'style' && /expression\s*\(|javascript:/i.test(value);

      if (isEventHandler || isUnsafeUrl || isUnsafeStyle) {
        $(element).removeAttr(name);
      }
    }
  });

  return $.html();
}
