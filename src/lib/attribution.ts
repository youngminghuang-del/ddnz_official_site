export const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'source',
  'article',
] as const;

export type Attribution = Partial<Record<typeof ATTRIBUTION_KEYS[number], string>>;

const STORAGE_KEY = 'ddnz_attribution';

function safeSessionStorage() {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function readAttribution(search = typeof window === 'undefined' ? '' : window.location.search): Attribution {
  const params = new URLSearchParams(search);
  const stored = safeSessionStorage()?.getItem(STORAGE_KEY);
  let previous: Attribution = {};
  if (stored) {
    try {
      previous = JSON.parse(stored) as Attribution;
    } catch {
      previous = {};
    }
  }

  const current = Object.fromEntries(
    ATTRIBUTION_KEYS
      .map((key) => [key, params.get(key)?.trim() || ''] as const)
      .filter(([, value]) => value),
  ) as Attribution;
  return { ...previous, ...current };
}

export function rememberAttribution(search: string) {
  const storage = safeSessionStorage();
  if (!storage) return;
  const next = readAttribution(search);
  if (Object.keys(next).length) storage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function appendAttribution(href: string, attribution = readAttribution()) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return href;
  try {
    const base = typeof window === 'undefined' ? 'https://www.ddnzglobal.com' : window.location.origin;
    const url = new URL(href, base);
    const isInternal = url.origin === base || url.hostname === 'www.ddnzglobal.com' || url.hostname === 'ddnzglobal.com';
    if (!isInternal) return href;
    Object.entries(attribution).forEach(([key, value]) => {
      if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
    });
    return href.startsWith('http') ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

export function buildAttributedWhatsAppUrl(
  baseMessage = 'Hi DDNZ / Heaven Born, I’m interested in sourcing or logistics support from China. Can we talk?',
  attribution = readAttribution(),
) {
  const reference = [attribution.utm_source, attribution.utm_campaign, attribution.utm_content]
    .filter(Boolean)
    .join(' / ');
  const message = reference ? `${baseMessage}\n\nReference: ${reference}` : baseMessage;
  return `https://wa.me/85261077362?text=${encodeURIComponent(message)}`;
}
