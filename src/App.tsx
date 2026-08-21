import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
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
const SourcingServicePage = lazy(() => import('./pages/SourcingServicePage'));
const HowWeWork = lazy(() => import('./pages/HowWeWork'));
const ContentOpsDashboard = lazy(() => import('./pages/ContentOpsDashboard'));
const HomeV2Preview = lazy(() => import('./pages/HomeV2Preview'));
const CookieConsent = lazy(() => import('./components/CookieConsent'));
const ProductsIndex = lazy(() => import('./pages/product-showcase/ProductsIndex'));
const SourcingServices = lazy(() => import('./pages/product-showcase/SourcingServices'));
const CommercialKitchen = lazy(() => import('./pages/product-showcase/CommercialKitchen').then((module) => ({ default: module.App })));
const RefrigerationEquipment = lazy(() => import('./pages/product-showcase/RefrigerationEquipment').then((module) => ({ default: module.RefrigerationEquipment })));
const MobileAccessories = lazy(() => import('./pages/product-showcase/MobileAccessories').then((module) => ({ default: module.MobileAccessories })));
const AudioSpeakers = lazy(() => import('./pages/product-showcase/AudioSpeakers'));
const OutdoorProducts = lazy(() => import('./pages/product-showcase/OutdoorProducts').then((module) => ({ default: module.OutdoorProducts })));

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

const SOURCING_CATEGORIES = [
  { slug: 'commercial-kitchen-equipment-from-china', kind: 'commercial-kitchen' },
  { slug: 'audio-speakers-from-china', kind: 'audio-speakers' },
  { slug: 'mobile-accessories-from-china', kind: 'mobile-accessories' },
  { slug: 'outdoor-products-from-china', kind: 'outdoor' },
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

function EnglishSourcingCategoryRedirect({ slug }: { slug: string }) {
  const location = useLocation();
  return <Navigate to={`/sourcing/${slug}${location.search}${location.hash}`} replace />;
}

function EnglishShowcaseRedirect({ path }: { path: string }) {
  const location = useLocation();
  return <Navigate to={`${path}${location.search}${location.hash}`} replace />;
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

const skipLinkCopy = {
  en: 'Skip to main content',
  zh: '跳到主要内容',
  ru: 'Перейти к основному содержанию',
  fr: 'Aller au contenu principal',
  es: 'Saltar al contenido principal',
  ar: 'انتقل إلى المحتوى الرئيسي',
} as const;

function SkipToMainContent() {
  const { language } = useLanguage();
  const location = useLocation();
  const [targetId, setTargetId] = useState('main-content');

  useEffect(() => {
    let timer = 0;
    let observer: MutationObserver | null = null;

    const assignTarget = () => {
      const main = document.querySelector<HTMLElement>('main');
      if (!main) return false;
      const nextTargetId = main.id || 'main-content';
      if (!main.id) main.id = nextTargetId;
      if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
      setTargetId((current) => current === nextTargetId ? current : nextTargetId);
      return true;
    };

    timer = window.requestAnimationFrame(() => {
      assignTarget();
      observer = new MutationObserver(assignTarget);
      observer.observe(document.getElementById('root') || document.body, {
        attributes: true,
        attributeFilter: ['id', 'tabindex'],
        childList: true,
        subtree: true,
      });
    });

    return () => {
      window.cancelAnimationFrame(timer);
      observer?.disconnect();
    };
  }, [location.pathname]);

  const focusMainContent = () => {
    window.requestAnimationFrame(() => {
      const target = document.getElementById(targetId);
      if (!target) return;
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'start' });
    });
  };

  return (
    <a className="ddnz-skip-link" href={`#${targetId}`} onClick={focusMainContent}>
      {skipLinkCopy[language] || skipLinkCopy.en}
    </a>
  );
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
          <SkipToMainContent />
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
            <Route path="/how-we-work" element={<HowWeWork />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
            <Route path="/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
            <Route path="/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
            <Route path="/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
            {SHIPPING_COUNTRIES.map((country) => (
              <Route key={`en-${country}`} path={`/shipping-from-china-to-${country}`} element={<CountryShippingRoute />} />
            ))}
            <Route path="/get-a-quote" element={<GetAQuotePage />} />
            <Route path="/products" element={<ProductsIndex />} />
            <Route path="/sourcing-services" element={<SourcingServices />} />
            <Route path="/refrigeration-equipment" element={<RefrigerationEquipment />} />
            <Route path="/sourcing/commercial-kitchen-equipment-from-china" element={<CommercialKitchen />} />
            <Route path="/sourcing/audio-speakers-from-china" element={<AudioSpeakers />} />
            <Route path="/sourcing/mobile-accessories-from-china" element={<MobileAccessories />} />
            <Route path="/sourcing/outdoor-products-from-china" element={<OutdoorProducts />} />
            <Route path="/commercial-kitchen" element={<Navigate to="/sourcing/commercial-kitchen-equipment-from-china" replace />} />
            <Route path="/audio-speakers" element={<Navigate to="/sourcing/audio-speakers-from-china" replace />} />
            <Route path="/mobile-accessories" element={<Navigate to="/sourcing/mobile-accessories-from-china" replace />} />
            <Route path="/outdoor-products" element={<Navigate to="/sourcing/outdoor-products-from-china" replace />} />
            {import.meta.env.DEV ? (
              <>
                <Route path="/content-ops" element={<ContentOpsDashboard />} />
                <Route path="/design-preview/home-v2" element={<HomeV2Preview />} />
              </>
            ) : null}
            <Route path="/sourcing-services/supplier-search" element={<SourcingServicePage kind="supplier-search" />} />
            <Route path="/sourcing-services/inspection-quality-control" element={<SourcingServicePage kind="inspection-quality-control" />} />
            <Route path="/sourcing-services/consolidation-export" element={<SourcingServicePage kind="consolidation-export" />} />

            {/* Chinese Bundle Router */}
            <Route path="/zh-cn" element={<Home />} />
            <Route path="/zh-cn/blog/:slug" element={<BlogDetail />} />
            <Route path="/zh-cn/insights" element={<InsightsHub />} />
            <Route path="/zh-cn/how-we-work" element={<HowWeWork />} />
            <Route path="/zh-cn/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/zh-cn/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
            <Route path="/zh-cn/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
            <Route path="/zh-cn/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
            <Route path="/zh-cn/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
            {SHIPPING_COUNTRIES.map((country) => (
              <Route key={`zh-${country}`} path={`/zh-cn/shipping-from-china-to-${country}`} element={<CountryShippingRoute />} />
            ))}
            <Route path="/zh-cn/get-a-quote" element={<GetAQuotePage />} />
            <Route path="/zh-cn/products" element={<EnglishShowcaseRedirect path="/products" />} />
            <Route path="/zh-cn/sourcing-services" element={<EnglishShowcaseRedirect path="/sourcing-services" />} />
            <Route path="/zh-cn/refrigeration-equipment" element={<EnglishShowcaseRedirect path="/refrigeration-equipment" />} />
            {SOURCING_CATEGORIES.map(({ slug, kind }) => (
              <Route key={`zh-${kind}`} path={`/zh-cn/sourcing/${slug}`} element={<EnglishSourcingCategoryRedirect slug={slug} />} />
            ))}
            <Route path="/zh-cn/sourcing-services/supplier-search" element={<SourcingServicePage kind="supplier-search" />} />
            <Route path="/zh-cn/sourcing-services/inspection-quality-control" element={<SourcingServicePage kind="inspection-quality-control" />} />
            <Route path="/zh-cn/sourcing-services/consolidation-export" element={<SourcingServicePage kind="consolidation-export" />} />

            {/* Russian Bundle Router */}
            <Route path="/ru" element={<Home />} />
            <Route path="/ru/blog/:slug" element={<BlogDetail />} />
            <Route path="/ru/insights" element={<InsightsHub />} />
            <Route path="/ru/how-we-work" element={<HowWeWork />} />
            <Route path="/ru/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/ru/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
            <Route path="/ru/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
            <Route path="/ru/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
            <Route path="/ru/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
            {SHIPPING_COUNTRIES.map((country) => (
              <Route key={`ru-${country}`} path={`/ru/shipping-from-china-to-${country}`} element={<CountryShippingRoute />} />
            ))}
            <Route path="/ru/get-a-quote" element={<GetAQuotePage />} />
            <Route path="/ru/products" element={<EnglishShowcaseRedirect path="/products" />} />
            <Route path="/ru/sourcing-services" element={<EnglishShowcaseRedirect path="/sourcing-services" />} />
            <Route path="/ru/refrigeration-equipment" element={<EnglishShowcaseRedirect path="/refrigeration-equipment" />} />
            {SOURCING_CATEGORIES.map(({ slug, kind }) => (
              <Route key={`ru-${kind}`} path={`/ru/sourcing/${slug}`} element={<EnglishSourcingCategoryRedirect slug={slug} />} />
            ))}
            <Route path="/ru/sourcing-services/supplier-search" element={<SourcingServicePage kind="supplier-search" />} />
            <Route path="/ru/sourcing-services/inspection-quality-control" element={<SourcingServicePage kind="inspection-quality-control" />} />
            <Route path="/ru/sourcing-services/consolidation-export" element={<SourcingServicePage kind="consolidation-export" />} />

            {/* French Bundle Router */}
            <Route path="/fr" element={<Home />} />
            <Route path="/fr/blog/:slug" element={<BlogDetail />} />
            <Route path="/fr/insights" element={<InsightsHub />} />
            <Route path="/fr/how-we-work" element={<HowWeWork />} />
            <Route path="/fr/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/fr/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
            <Route path="/fr/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
            <Route path="/fr/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
            <Route path="/fr/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
            {SHIPPING_COUNTRIES.map((country) => (
              <Route key={`fr-${country}`} path={`/fr/shipping-from-china-to-${country}`} element={<CountryShippingRoute />} />
            ))}
            <Route path="/fr/get-a-quote" element={<GetAQuotePage />} />
            <Route path="/fr/products" element={<EnglishShowcaseRedirect path="/products" />} />
            <Route path="/fr/sourcing-services" element={<EnglishShowcaseRedirect path="/sourcing-services" />} />
            <Route path="/fr/refrigeration-equipment" element={<EnglishShowcaseRedirect path="/refrigeration-equipment" />} />
            {SOURCING_CATEGORIES.map(({ slug, kind }) => (
              <Route key={`fr-${kind}`} path={`/fr/sourcing/${slug}`} element={<EnglishSourcingCategoryRedirect slug={slug} />} />
            ))}
            <Route path="/fr/sourcing-services/supplier-search" element={<SourcingServicePage kind="supplier-search" />} />
            <Route path="/fr/sourcing-services/inspection-quality-control" element={<SourcingServicePage kind="inspection-quality-control" />} />
            <Route path="/fr/sourcing-services/consolidation-export" element={<SourcingServicePage kind="consolidation-export" />} />

            {/* Spanish routes */}
            <Route path="/es" element={<Home />} />
            <Route path="/es/blog/:slug" element={<BlogDetail />} />
            <Route path="/es/insights" element={<InsightsHub />} />
            <Route path="/es/how-we-work" element={<HowWeWork />} />
            <Route path="/es/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/es/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
            <Route path="/es/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
            <Route path="/es/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
            <Route path="/es/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
            {SHIPPING_COUNTRIES.map((country) => (
              <Route key={`es-${country}`} path={`/es/shipping-from-china-to-${country}`} element={<CountryShippingRoute />} />
            ))}
            <Route path="/es/get-a-quote" element={<GetAQuotePage />} />
            <Route path="/es/products" element={<EnglishShowcaseRedirect path="/products" />} />
            <Route path="/es/sourcing-services" element={<EnglishShowcaseRedirect path="/sourcing-services" />} />
            <Route path="/es/refrigeration-equipment" element={<EnglishShowcaseRedirect path="/refrigeration-equipment" />} />
            {SOURCING_CATEGORIES.map(({ slug, kind }) => (
              <Route key={`es-${kind}`} path={`/es/sourcing/${slug}`} element={<EnglishSourcingCategoryRedirect slug={slug} />} />
            ))}
            <Route path="/es/sourcing-services/supplier-search" element={<SourcingServicePage kind="supplier-search" />} />
            <Route path="/es/sourcing-services/inspection-quality-control" element={<SourcingServicePage kind="inspection-quality-control" />} />
            <Route path="/es/sourcing-services/consolidation-export" element={<SourcingServicePage kind="consolidation-export" />} />

            {/* Arabic routes */}
            <Route path="/ar" element={<Home />} />
            <Route path="/ar/blog/:slug" element={<BlogDetail />} />
            <Route path="/ar/insights" element={<InsightsHub />} />
            <Route path="/ar/how-we-work" element={<HowWeWork />} />
            <Route path="/ar/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/ar/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
            <Route path="/ar/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
            <Route path="/ar/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
            <Route path="/ar/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
            {SHIPPING_COUNTRIES.map((country) => (
              <Route key={`ar-${country}`} path={`/ar/shipping-from-china-to-${country}`} element={<CountryShippingRoute />} />
            ))}
            <Route path="/ar/get-a-quote" element={<GetAQuotePage />} />
            <Route path="/ar/products" element={<EnglishShowcaseRedirect path="/products" />} />
            <Route path="/ar/sourcing-services" element={<EnglishShowcaseRedirect path="/sourcing-services" />} />
            <Route path="/ar/refrigeration-equipment" element={<EnglishShowcaseRedirect path="/refrigeration-equipment" />} />
            {SOURCING_CATEGORIES.map(({ slug, kind }) => (
              <Route key={`ar-${kind}`} path={`/ar/sourcing/${slug}`} element={<EnglishSourcingCategoryRedirect slug={slug} />} />
            ))}
            <Route path="/ar/sourcing-services/supplier-search" element={<SourcingServicePage kind="supplier-search" />} />
            <Route path="/ar/sourcing-services/inspection-quality-control" element={<SourcingServicePage kind="inspection-quality-control" />} />
            <Route path="/ar/sourcing-services/consolidation-export" element={<SourcingServicePage kind="consolidation-export" />} />
          </Routes>
          </Suspense>
          <Suspense fallback={null}>
            <RoutedCookieConsent />
          </Suspense>
        </Router>
      </LanguageProvider>
    </HelmetProvider>
  );
}
