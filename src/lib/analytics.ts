import { readAttribution } from './attribution';
import {
  ANALYTICS_TEST_SESSION_KEY,
  isLocalAnalyticsHostname,
  resolveAnalyticsTestMode,
} from './analyticsPolicy';
import {
  AnalyticsParams,
  getSafeAnalyticsPageFields,
  sanitizeAnalyticsParams,
} from './analyticsPayload';
import { createGtagCommandQueue } from './gtagQueue';

const GA_MEASUREMENT_ID = 'G-TZD9QT4W8H';
const CLARITY_PROJECT_ID = 'xswyojgnjd';

type ConsentPreferences = {
  tracking?: boolean;
  targeting?: boolean;
};
type PageContext = {
  page_language: string;
  service?: string;
  country?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_page?: string;
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
let consentQueueInitialized = false;

function isAnalyticsDisabled() {
  if (typeof window === 'undefined') return true;

  let sessionDisabled = false;
  try {
    sessionDisabled = window.sessionStorage.getItem(ANALYTICS_TEST_SESSION_KEY) === 'true';
  } catch {
    // Storage can be unavailable in privacy-restricted browsers. URL rules still apply.
  }

  const testMode = resolveAnalyticsTestMode({
    search: window.location.search,
    sessionDisabled,
  });

  try {
    if (testMode.persistSessionDisabled) {
      window.sessionStorage.setItem(ANALYTICS_TEST_SESSION_KEY, 'true');
    } else {
      window.sessionStorage.removeItem(ANALYTICS_TEST_SESSION_KEY);
    }
  } catch {
    // The current page is still protected even when the session flag cannot persist.
  }

  return (
    import.meta.env.DEV ||
    import.meta.env.VITE_DISABLE_ANALYTICS === 'true' ||
    isLocalAnalyticsHostname(window.location.hostname) ||
    testMode.disabled
  );
}

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
  if (pathname.startsWith('/pt')) return 'pt';
  if (pathname.startsWith('/tr')) return 'tr';
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
  const attribution = readAttribution(url.search);

  return {
    page_language: getPageLanguage(url.pathname),
    ...(service ? { service } : {}),
    ...(country ? { country } : {}),
    ...(attribution.utm_source ? { utm_source: attribution.utm_source } : {}),
    ...(attribution.utm_medium ? { utm_medium: attribution.utm_medium } : {}),
    ...(attribution.utm_campaign ? { utm_campaign: attribution.utm_campaign } : {}),
    ...(attribution.utm_content ? { utm_content: attribution.utm_content } : {}),
    ...(attribution.utm_term ? { utm_term: attribution.utm_term } : {}),
    ...(attribution.landing_page ? { landing_page: attribution.landing_page } : {}),
  };
}

function ensureGtagQueue() {
  if (typeof window === 'undefined') return;

  const dataLayer = (window.dataLayer ||= []);
  if (!window.gtag) {
    window.gtag = createGtagCommandQueue(dataLayer);
  }

  if (!consentQueueInitialized) {
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500,
    });
    consentQueueInitialized = true;
  }
}

function ensureGoogleAnalytics() {
  if (typeof window === 'undefined' || isAnalyticsDisabled()) return;

  ensureGtagQueue();
  if (document.getElementById('google-analytics-script')) return;

  const script = document.createElement('script');
  script.id = 'google-analytics-script';
  script.async = true;
  script.referrerPolicy = 'strict-origin-when-cross-origin';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag?.('js', new Date());
  window.gtag?.('config', GA_MEASUREMENT_ID, { send_page_view: false });
}

function ensureClarity() {
  if (typeof window === 'undefined' || isAnalyticsDisabled()) return;

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
    script.referrerPolicy = 'strict-origin-when-cross-origin';
    script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
    document.head.appendChild(script);
  }
}

export function updateAnalyticsConsent(tracking: boolean, targeting = false) {
  if (typeof window === 'undefined') return;

  if (isAnalyticsDisabled()) {
    analyticsConsentGranted = false;
    return;
  }

  ensureGtagQueue();
  analyticsConsentGranted = tracking;
  const targetingGranted = tracking && targeting;
  window.gtag?.('consent', 'update', {
    analytics_storage: tracking ? 'granted' : 'denied',
    ad_storage: targetingGranted ? 'granted' : 'denied',
    ad_user_data: targetingGranted ? 'granted' : 'denied',
    ad_personalization: targetingGranted ? 'granted' : 'denied',
  });

  // Advanced Consent Mode keeps the Google tag loaded in denied states. The
  // tag can then send limited cookieless measurement pings and switch to full
  // analytics storage only after the visitor grants analytics consent.
  ensureGoogleAnalytics();

  // Clarity Consent Mode keeps a limited, cookieless page-view signal when
  // analytics storage is denied. The project-level Cookies switch must remain
  // Off so this denied state cannot create first- or third-party cookies.
  ensureClarity();

  if (!tracking) {
    window.clarity?.('consentv2', {
      ad_Storage: 'denied',
      analytics_Storage: 'denied',
    });
    return;
  }

  window.clarity?.('consentv2', {
    ad_Storage: targetingGranted ? 'granted' : 'denied',
    analytics_Storage: 'granted',
  });
}

export function initializeAnalyticsConsent() {
  const preferences = readStoredConsent();
  updateAnalyticsConsent(Boolean(preferences.tracking), Boolean(preferences.targeting));
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined' || isAnalyticsDisabled()) return;

  ensureGoogleAnalytics();

  const eventParams = sanitizeAnalyticsParams({
    ...getSafeAnalyticsPageFields(window.location.href),
    ...getPageContext(),
    ...params,
    consent_state: analyticsConsentGranted ? 'granted' : 'denied',
  });

  window.gtag?.('event', eventName, eventParams);
  if (analyticsConsentGranted) {
    window.clarity?.('event', eventName);
  }
}

export function trackPageView({ sendGooglePageView = true } = {}) {
  if (typeof window === 'undefined' || isAnalyticsDisabled()) return;

  const pageContext = getPageContext();
  ensureGoogleAnalytics();
  const safePageFields = getSafeAnalyticsPageFields(window.location.href);
  // Enhanced Measurement handles SPA history changes. Set a query-free page
  // location before its page_view is dispatched so sourcing-brief fields in
  // the URL cannot be copied into GA request metadata.
  window.gtag?.('set', safePageFields);
  if (sendGooglePageView) {
    window.gtag?.('event', 'page_view', {
      page_title: document.title,
      ...safePageFields,
      ...sanitizeAnalyticsParams(pageContext),
      consent_state: analyticsConsentGranted ? 'granted' : 'denied',
    });
  }

  if (analyticsConsentGranted) {
    window.clarity?.('set', 'page_language', pageContext.page_language);
  }
  if ('service' in pageContext) {
    if (analyticsConsentGranted) {
      window.clarity?.('set', 'service', pageContext.service);
    }
    trackEvent('service_page_view', { service: pageContext.service });
  }
  if ('country' in pageContext) {
    if (analyticsConsentGranted) {
      window.clarity?.('set', 'country', pageContext.country);
    }
    trackEvent('country_page_view', { country: pageContext.country });
  }
}

export { GA_MEASUREMENT_ID, CLARITY_PROJECT_ID };
