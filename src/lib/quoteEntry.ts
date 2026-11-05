const quoteSectionIds = new Set([
  'get-a-quote', 'rfq-form-section', 'rfq', 'package-rfq', 'gulf-quote',
  'uae-quote', 'ghana-quote', 'mexico-quote', 'audio-rfq',
  'speaker-model-request', 'refrigeration-rfq',
]);

export function isQuoteEntry(href: string, currentUrl: string) {
  if (!href) return false;
  let destination: URL;
  try {
    destination = new URL(href, currentUrl);
  } catch {
    return false;
  }
  const current = new URL(currentUrl);
  if (destination.origin !== current.origin) return false;
  const path = destination.pathname.replace(/\/$/, '');
  if (/\/(get-a-quote|screen-protectors\/brief)$/.test(path)) return true;
  return destination.pathname === current.pathname
    && quoteSectionIds.has(destination.hash.slice(1));
}
