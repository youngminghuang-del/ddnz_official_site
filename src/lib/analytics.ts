const GA_MEASUREMENT_ID = 'G-TZD9QT4W8H';
const CLARITY_PROJECT_ID = 'xswyojgnjd';

type AnalyticsValue = string | number | boolean;
type AnalyticsParams = Record<string, AnalyticsValue | null | undefined>;
type ConsentPreferences = {
  tracking?: boolean;
  targeting?: boolean;
};
type PageContext = {
  page_language: string;
  service?: string;
  country?: string;
};

type ClarityFunction = ((...args: unknown[]) => void) & {
  q?: unknown[][];
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ClarityFunction;
  }
}

let analyticsConsentGranted = false;

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

function readStoredConsent(): ConsentPreferences {
  if (typeof window === 'undefined') return {};

  try {
    return JSON.parse(window.localStorage.getItem('cookiePreferences') || '{}');
  } catch {
    return {};
  }
}

function getPageLanguage(pathname = window.location.pathname) {
  if (pathname.startsWith('/zh-cn')) return 'zh';
  if (pathname.startsWith('/es')) return 'es';
  if (pathname.startsWith('/ar')) return 'ar';
  if (pathname.startsWith('/fr')) return 'fr';
  if (pathname.startsWith('/ru')) return 'ru';
  return 'en';
}

function getPageContext(): PageContext {
  if (typeof window === 'undefined') return { page_language: 'en' };

  const url = new URL(window.location.href);
  const service = url.pathname.match(/\/services\/([^/?#]+)/)?.[1];
  const pathCountry = url.pathname.match(
    /shipping-from-china-to-(saudi-arabia|uae|kuwait|qatar|oman|bahrain|kazakhstan|uzbekistan|nigeria|ghana|mexico|brazil|argentina|peru|chile)(?:\/|$)/,
  )?.[1];
  const country = url.searchParams.get('country') || pathCountry;

  return {
    page_language: getPageLanguage(url.pathname),
    ...(service ? { service } : {}),
    ...(country ? { country } : {}),
  };
}

function sanitizeParams(params: AnalyticsParams = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([key, value]) => {
      const normalizedKey = key.toLowerCase();
      return (
        value !== null &&
        value !== undefined &&
        !SENSITIVE_PARAMETER_KEYS.has(normalizedKey)
      );
    }),
  ) as Record<string, AnalyticsValue>;
}

function ensureClarity() {
  if (typeof window === 'undefined') return;

  if (!window.clarity) {
    const clarity: ClarityFunction = (...args: unknown[]) => {
      clarity.q = clarity.q || [];
      clarity.q.push(args);
    };
    window.clarity = clarity;
  }

  if (!document.getElementById('microsoft-clarity-script')) {
    const script = document.createElement('script');
    script.id = 'microsoft-clarity-script';
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
    document.head.appendChild(script);
  }
}

export function updateAnalyticsConsent(tracking: boolean, targeting = false) {
  if (typeof window === 'undefined') return;

  analyticsConsentGranted = tracking;
  window.gtag?.('consent', 'update', {
    analytics_storage: tracking ? 'granted' : 'denied',
    ad_storage: targeting ? 'granted' : 'denied',
    ad_user_data: targeting ? 'granted' : 'denied',
    ad_personalization: targeting ? 'granted' : 'denied',
  });

  ensureClarity();
  window.clarity?.('consentv2', {
    ad_Storage: targeting ? 'granted' : 'denied',
    analytics_Storage: tracking ? 'granted' : 'denied',
  });
}

export function initializeAnalyticsConsent() {
  const preferences = readStoredConsent();
  updateAnalyticsConsent(Boolean(preferences.tracking), Boolean(preferences.targeting));
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined' || !analyticsConsentGranted) return;

  const eventParams = {
    ...getPageContext(),
    ...sanitizeParams(params),
  };

  window.gtag?.('event', eventName, eventParams);
  window.clarity?.('event', eventName);
}

export function trackPageView() {
  if (typeof window === 'undefined' || !analyticsConsentGranted) return;

  const pageContext = getPageContext();
  window.gtag?.('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
    ...pageContext,
  });

  window.clarity?.('set', 'page_language', pageContext.page_language);
  if ('service' in pageContext) {
    window.clarity?.('set', 'service', pageContext.service);
    trackEvent('service_page_view', { service: pageContext.service });
  }
  if ('country' in pageContext) {
    window.clarity?.('set', 'country', pageContext.country);
    trackEvent('country_page_view', { country: pageContext.country });
  }
}

export { GA_MEASUREMENT_ID, CLARITY_PROJECT_ID };
