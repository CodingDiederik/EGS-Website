/**
 * Hosts that next/image is allowed to optimise. This mirrors the
 * `images.remotePatterns` list in next.config.ts (which imports this array), so
 * the two can never drift apart.
 *
 * Article hero images are extracted from WordPress HTML and can therefore point
 * at arbitrary hosts. next/image throws — and 500s the whole page — for any
 * host that isn't configured, so the article page uses isAllowedImageHost() to
 * decide between next/image and a plain <img> fallback.
 */
export const ALLOWED_IMAGE_HOSTS = [
  'api.schaakclubegs.nl',
  'schaakclubegs.nl',
  'www.schaakclubegs.nl',
];

/**
 * Returns true when the given image src can safely be rendered with next/image.
 * Relative URLs (local /public assets) are always allowed; unparseable values
 * are rejected so callers fall back to a plain <img>.
 */
export function isAllowedImageHost(src: string): boolean {
  if (src.startsWith('/')) return true;
  try {
    return ALLOWED_IMAGE_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}
