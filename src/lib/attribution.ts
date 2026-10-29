import { sanitizeAnalyticsText } from './analyticsPayload';
export const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'source',
  'article',
] as const;

export type Attribution = Partial<Record<typeof ATTRIBUTION_KEYS[number] | 'landing_page' | 'referrer_host' | 'first_utm_source' | 'first_utm_medium' | 'first_utm_campaign' | 'first_utm_content' | 'first_utm_term', string>>;

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
  let stored: string | null = null;
  try { stored = safeSessionStorage()?.getItem(STORAGE_KEY) || null; } catch { /* Optional storage. */ }
  let previous: Attribution = {};
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) previous = parsed;
    } catch {
      previous = {};
    }
  }

  const current = Object.fromEntries(
    ATTRIBUTION_KEYS
      .map((key) => [key, sanitizeAnalyticsText(params.get(key) || '') || ''] as const)
      .filter(([, value]) => value),
  ) as Attribution;
  return { ...previous, ...current };
}

export function rememberAttribution(
  search: string,
  landingPage = typeof window === 'undefined' ? '' : window.location.pathname,
  referrer = typeof document === 'undefined' ? '' : document.referrer,
) {
  const storage = safeSessionStorage();
  if (!storage) return;
  const next = readAttribution(search);
  if (!next.landing_page && landingPage) {
    next.landing_page = safePagePath(landingPage);
    next.referrer_host = externalReferrerHost(referrer);
    const incoming = new URLSearchParams(search);
    for (const key of ATTRIBUTION_KEYS.filter(key => key.startsWith('utm_'))) {
      next[`first_${key}` as keyof Attribution] = sanitizeAnalyticsText(incoming.get(key) || '') || '';
    }
  }
  try { if (Object.keys(next).length) storage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Optional storage. */ }
}

export function appendAttribution(href: string, attribution = readAttribution()) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return href;
  try {
    const base = typeof window === 'undefined' ? 'https://www.ddnzglobal.com' : window.location.origin;
    const url = new URL(href, base);
    const isInternal = url.origin === base || url.hostname === 'www.ddnzglobal.com' || url.hostname === 'ddnzglobal.com';
    if (!isInternal) return href;
    ATTRIBUTION_KEYS.forEach((key) => {
      const value = attribution[key];
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

// Inquiry context never includes URL queries, hashes, external paths or contact details.
export function safePagePath(value: unknown) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '';
  const path = value.split(/[?#]/)[0];
  try {
    const decoded = decodeURIComponent(path);
    return path.length <= 500 && !!sanitizeAnalyticsText(decoded) && !/[@\s\\\u0000-\u001f]/.test(decoded) ? path : '';
  } catch { return ''; }
}
export function externalReferrerHost(value: string) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    const own = typeof window === 'undefined' ? '' : window.location.hostname;
    return [own, 'ddnzglobal.com', 'www.ddnzglobal.com'].includes(url.hostname) ? '' : url.hostname.slice(0, 253);
  } catch { return ''; }
}
