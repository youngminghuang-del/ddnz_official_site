export type AnalyticsValue = string | number | boolean;
export type AnalyticsParams = Record<string, AnalyticsValue | null | undefined>;

const MAX_ANALYTICS_TEXT_LENGTH = 120;
const SENSITIVE_PARAMETER_KEYS = new Set([
  'name',
  'first_name',
  'last_name',
  'fname',
  'email',
  'phone',
  'telephone',
  'whatsapp',
  'message',
  'notes',
  'goods',
  'cargo_description',
  'address',
]);

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_PATTERN = /(?:\+?\d[\d\s().-]{7,}\d)/;

export function sanitizeAnalyticsText(value: string) {
  const normalized = value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
  if (!normalized || EMAIL_PATTERN.test(normalized) || PHONE_PATTERN.test(normalized)) {
    return undefined;
  }
  return normalized.slice(0, MAX_ANALYTICS_TEXT_LENGTH);
}

export function sanitizeAnalyticsParams(params: AnalyticsParams = {}) {
  const safeEntries: Array<[string, AnalyticsValue]> = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || SENSITIVE_PARAMETER_KEYS.has(key.toLowerCase())) {
      return;
    }
    if (typeof value === 'string') {
      const sanitized = sanitizeAnalyticsText(value);
      if (sanitized !== undefined) safeEntries.push([key, sanitized]);
      return;
    }
    safeEntries.push([key, value]);
  });

  return Object.fromEntries(safeEntries) as Record<string, AnalyticsValue>;
}

export function getSafeAnalyticsPageFields(href: string) {
  const url = new URL(href);
  return {
    page_location: `${url.origin}${url.pathname}`,
    page_path: url.pathname,
  };
}
