import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import CookieConsent from './components/CookieConsent';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { initializeAnalyticsConsent, trackEvent, trackPageView } from './lib/analytics';
import { readAttribution, rememberAttribution } from './lib/attribution';

const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const InsightsHub = lazy(() => import('./pages/InsightsHub'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const ShippingMiddleEast = lazy(() => import('./pages/shipping-from-china-to-middle-east'));
const ShippingCentralAsia = lazy(() => import('./pages/shipping-from-china-to-central-asia'));
const ShippingWestAfrica = lazy(() => import('./pages/shipping-from-china-to-west-africa'));
const ShippingLatinAmerica = lazy(() => import('./pages/shipping-from-china-to-latin-america'));
const GetAQuotePage = lazy(() => import('./pages/get-a-quote'));
const SourcingCategoryPage = lazy(() => import('./pages/SourcingCategory'));
const ContentOpsDashboard = lazy(() => import('./pages/ContentOpsDashboard'));

const SHIPPING_COUNTRIES = [
  'saudi-arabia',
  'uae',
  'kuwait',
  'qatar',
  'oman',
  'bahrain',
  'kazakhstan',
  'uzbekistan',
  'nigeria',
  'ghana',
  'mexico',
  'brazil',
  'argentina',
  'peru',
  'chile',
] as const;

function CountryShippingRoute() {
  const location = useLocation();
  const normalizedCountry = location.pathname.split('/').filter(Boolean).at(-1)?.replace('shipping-from-china-to-', '').toLowerCase() || '';

  if (['saudi-arabia', 'uae', 'kuwait', 'qatar', 'oman', 'bahrain'].includes(normalizedCountry)) {
    return <ShippingMiddleEast />;
  }
  if (['kazakhstan', 'uzbekistan'].includes(normalizedCountry)) {
    return <ShippingCentralAsia />;
  }
  if (['nigeria', 'ghana'].includes(normalizedCountry)) {
    return <ShippingWestAfrica />;
  }
  if (['mexico', 'brazil', 'argentina', 'peru', 'chile'].includes(normalizedCountry)) {
    return <ShippingLatinAmerica />;
  }

  return <Navigate to="/" replace />;
}

function RouteLoadingFallback() {
  return (
    <main className="min-h-[70dvh] bg-[#F5F8FC] pt-28" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-7 w-44 rounded-lg bg-slate-200" />
        <div className="mt-6 h-12 max-w-2xl rounded-xl bg-slate-200" />
        <div className="mt-5 h-5 max-w-xl rounded-lg bg-slate-200" />
        <span className="sr-only">Loading page</span>
      </div>
    </main>
  );
}

function LanguageRouteSync() {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    let targetLang: 'en' | 'zh' | 'ru' | 'fr' | 'es' | 'ar' = 'en';

    if (pathname.startsWith('/zh-cn')) {
      targetLang = 'zh';
    } else if (pathname.startsWith('/ru')) {
      targetLang = 'ru';
    } else if (pathname.startsWith('/fr')) {
      targetLang = 'fr';
    } else if (pathname.startsWith('/es')) {
      targetLang = 'es';
    } else if (pathname.startsWith('/ar')) {
      targetLang = 'ar';
    }

    if (language !== targetLang) {
      setLanguage(targetLang);
    }
  }, [location.pathname, language, setLanguage]);

  return null;
}

function HashScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const targetId = decodeURIComponent(location.hash.slice(1));
    let attempts = 0;
    let retryTimer = 0;

    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }

      attempts += 1;
      if (attempts < 40) {
        retryTimer = window.setTimeout(scrollToTarget, 50);
      }
    };

    scrollToTarget();

    return () => {
      window.clearTimeout(retryTimer);
    };
  }, [location.hash, location.pathname]);

  return null;
}

function AnalyticsRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    initializeAnalyticsConsent();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      trackPageView();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
}

function AttributionSessionSync() {
  const location = useLocation();

  useEffect(() => {
    rememberAttribution(location.search);
  }, [location.search]);

  return null;
}

function RoutedCookieConsent() {
  const location = useLocation();
  if (location.pathname === '/content-ops') return null;
  return <CookieConsent />;
}

function GlobalConversionTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const clickable = target.closest<HTMLAnchorElement | HTMLButtonElement>('a, button');
      if (!clickable || clickable.dataset.analyticsTracked === 'true') return;

      const href = clickable instanceof HTMLAnchorElement
        ? clickable.getAttribute('href') || ''
        : '';
      const ctaLocation = clickable.closest('section')?.id || 'global_navigation';

      if (href.includes('wa.me') || href.includes('api.whatsapp.com')) {
        const attribution = readAttribution();
        trackEvent('whatsapp_click', {
          cta_location: ctaLocation,
          utm_source: attribution.utm_source,
          utm_campaign: attribution.utm_campaign,
          utm_content: attribution.utm_content,
        });
      } else if (href.startsWith('tel:')) {
        trackEvent('phone_click', { cta_location: ctaLocation });
      } else if (href.startsWith('mailto:')) {
        trackEvent('email_click', { cta_location: ctaLocation });
      } else if (
        href.includes('get-a-quote') ||
        href.includes('#get-a-quote') ||
        href.includes('#rfq-form-section')
      ) {
        trackEvent('quote_click', { cta_location: ctaLocation });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <Router>
          <LanguageRouteSync />
          <HashScrollHandler />
          <AttributionSessionSync />
          <AnalyticsRouteTracker />
          <GlobalConversionTracker />
          <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            {/* English Default / Fallback Hub */}
            <Route path="/" element={<Home />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/insights" element={<InsightsHub />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
            <Route path="/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
            <Route path="/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
            <Route path="/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
            {SHIPPING_COUNTRIES.map((country) => (
              <Route key={`en-${country}`} path={`/shipping-from-china-to-${country}`} element={<CountryShippingRoute />} />
            ))}
            <Route path="/get-a-quote" element={<GetAQuotePage />} />
            {import.meta.env.DEV ? (
              <Route path="/content-ops" element={<ContentOpsDashboard />} />
            ) : null}
            <Route
              path="/sourcing/commercial-kitchen-equipment-from-china"
              element={<SourcingCategoryPage kind="commercial-kitchen" />}
            />
            <Route
              path="/sourcing/outdoor-products-from-china"
              element={<SourcingCategoryPage kind="outdoor" />}
            />

            {/* Chinese Bundle Router */}
            <Route path="/zh-cn" element={<Home />} />
            <Route path="/zh-cn/blog/:slug" element={<BlogDetail />} />
            <Route path="/zh-cn/insights" element={<InsightsHub />} />
            <Route path="/zh-cn/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/zh-cn/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
            <Route path="/zh-cn/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
            <Route path="/zh-cn/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
            <Route path="/zh-cn/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
            {SHIPPING_COUNTRIES.map((country) => (
              <Route key={`zh-${country}`} path={`/zh-cn/shipping-from-china-to-${country}`} element={<CountryShippingRoute />} />
            ))}
            <Route path="/zh-cn/get-a-quote" element={<GetAQuotePage />} />

            {/* Russian Bundle Router */}
            <Route path="/ru" element={<Home />} />
            <Route path="/ru/blog/:slug" element={<BlogDetail />} />
            <Route path="/ru/insights" element={<InsightsHub />} />
            <Route path="/ru/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/ru/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
            <Route path="/ru/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
            <Route path="/ru/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
            <Route path="/ru/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
            {SHIPPING_COUNTRIES.map((country) => (
              <Route key={`ru-${country}`} path={`/ru/shipping-from-china-to-${country}`} element={<CountryShippingRoute />} />
            ))}
            <Route path="/ru/get-a-quote" element={<GetAQuotePage />} />

            {/* French Bundle Router */}
            <Route path="/fr" element={<Home />} />
            <Route path="/fr/blog/:slug" element={<BlogDetail />} />
            <Route path="/fr/insights" element={<InsightsHub />} />
            <Route path="/fr/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/fr/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
            <Route path="/fr/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
            <Route path="/fr/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
            <Route path="/fr/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
            {SHIPPING_COUNTRIES.map((country) => (
              <Route key={`fr-${country}`} path={`/fr/shipping-from-china-to-${country}`} element={<CountryShippingRoute />} />
            ))}
            <Route path="/fr/get-a-quote" element={<GetAQuotePage />} />

            {/* Spanish routes */}
            <Route path="/es" element={<Home />} />
            <Route path="/es/blog/:slug" element={<BlogDetail />} />
            <Route path="/es/insights" element={<InsightsHub />} />
            <Route path="/es/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/es/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
            <Route path="/es/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
            <Route path="/es/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
            <Route path="/es/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
            {SHIPPING_COUNTRIES.map((country) => (
              <Route key={`es-${country}`} path={`/es/shipping-from-china-to-${country}`} element={<CountryShippingRoute />} />
            ))}
            <Route path="/es/get-a-quote" element={<GetAQuotePage />} />

            {/* Arabic routes */}
            <Route path="/ar" element={<Home />} />
            <Route path="/ar/blog/:slug" element={<BlogDetail />} />
            <Route path="/ar/insights" element={<InsightsHub />} />
            <Route path="/ar/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/ar/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
            <Route path="/ar/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
            <Route path="/ar/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
            <Route path="/ar/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
            {SHIPPING_COUNTRIES.map((country) => (
              <Route key={`ar-${country}`} path={`/ar/shipping-from-china-to-${country}`} element={<CountryShippingRoute />} />
            ))}
            <Route path="/ar/get-a-quote" element={<GetAQuotePage />} />
          </Routes>
          </Suspense>
          <RoutedCookieConsent />
        </Router>
      </LanguageProvider>
    </HelmetProvider>
  );
}
