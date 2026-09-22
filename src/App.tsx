import { BrowserRouter as Router, Navigate, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
const Home = lazy(() => import('./pages/Home'));
import InternalPageNavigation from './components/InternalPageNavigation';
import CookieConsent from './components/CookieConsent';
const FreightReleasePage = lazy(() => import('./pages/FreightReleasePage'));
import { kitchenCategoryPaths, kitchenPackagePath, kitchenPackageScenarioPaths } from './features/commercial-kitchen/routes.mjs';
import { buyerGuidePaths, productContentLanguages, localizedProductPath, isLocalizedProductPath, productRouteParts } from './lib/productLocalization.mjs';
import './features/buyer-guides/buyer-guides.css';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { initializeAnalyticsConsent, trackEvent, trackPageView } from './lib/analytics';
import { readAttribution, rememberAttribution } from './lib/attribution';
import { englishProductPaths, englishProductRedirect, isEnglishProductPath, navigationPrefixes, navigationState, resolveNavigationLanguage, routeHashId, routeScrollAction, scrollPositionKey } from './lib/productLanguageRouting';

const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const InsightsHub = lazy(() => import('./pages/InsightsHub'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const FreightRegionPage = lazy(() => import('./pages/FreightRegionPage'));
const UaeFreightPage = lazy(() => import('./pages/UaeFreightPage'));
const NigeriaFreightPage = lazy(() => import('./pages/NigeriaFreightPage'));
const MexicoFreightPage = lazy(() => import('./pages/MexicoFreightPage'));
const GhanaFreightPage = lazy(() => import('./pages/GhanaFreightPage'));
const ShippingMiddleEast = lazy(() => import('./pages/shipping-from-china-to-middle-east'));
const ShippingCentralAsia = lazy(() => import('./pages/shipping-from-china-to-central-asia'));
const ShippingWestAfrica = lazy(() => import('./pages/shipping-from-china-to-west-africa'));
const ShippingLatinAmerica = lazy(() => import('./pages/shipping-from-china-to-latin-america'));
const GetAQuotePage = lazy(() => import('./pages/get-a-quote'));
const ScreenProtectorPage = lazy(() => import('./features/screen-protectors/ScreenProtectorPage'));
const SourcingServicePage = lazy(() => import('./pages/SourcingServicePage'));
const HowWeWork = lazy(() => import('./pages/HowWeWork'));
const ContentOpsDashboard = lazy(() => import('./pages/ContentOpsDashboard'));
const HomeV2Preview = lazy(() => import('./pages/HomeV2Preview'));
const FreightMapPreview = lazy(() => import('./pages/FreightMapPreview'));
const ProductsIndex = lazy(() => import('./pages/product-showcase/ProductsIndex'));
const SourcingServices = lazy(() => import('./pages/product-showcase/SourcingServices'));
const CommercialKitchen = lazy(() => import('./features/commercial-kitchen/KitchenPage'));
const RestaurantKitchenPackages = lazy(() => import('./pages/product-showcase/RestaurantKitchenPackages'));
const RestaurantKitchenScenario = lazy(() => import('./pages/product-showcase/RestaurantKitchenScenario'));
const KitchenCategoryPage = lazy(() => import('./features/commercial-kitchen/KitchenCategoryPage'));
const LocalizedKitchenPage = lazy(() => import('./features/commercial-kitchen/LocalizedKitchenPage'));
const LocalizedScreenProtectorPage = lazy(() => import('./features/screen-protectors/LocalizedScreenProtectorPage'));
const BuyerGuidePage = lazy(() => import('./features/buyer-guides/BuyerGuidePage'));
const RefrigerationEquipment = lazy(() => import('./pages/product-showcase/RefrigerationEquipment').then((module) => ({ default: module.RefrigerationEquipment })));
const MobileAccessories = lazy(() => import('./features/mobile-sourcing/MobileSourcingPage'));
import { mobilePaths } from './features/mobile-sourcing/routes.mjs';
import { shippingCountries as SHIPPING_COUNTRIES, sourcingCategories as SOURCING_CATEGORIES } from './config/siteNavigation';
const AudioSpeakers = lazy(() => import('./pages/product-showcase/AudioSpeakers'));
const OutdoorProducts = lazy(() => import('./features/outdoor-sourcing/OutdoorPage'));

function CountryShippingRoute() {
  const location = useLocation();
  const normalizedCountry = location.pathname.split('/').filter(Boolean).at(-1)?.replace('shipping-from-china-to-', '').toLowerCase() || '';

  if (normalizedCountry === 'uae' && !/^\/(ar|fr|ru|pt|tr)\//.test(location.pathname)) return <UaeFreightPage />;
  if (normalizedCountry === 'nigeria' && !/^\/(ar|fr|ru|pt|tr)\//.test(location.pathname)) return <NigeriaFreightPage />;
  if (normalizedCountry === 'mexico' && !/^\/(ar|fr|ru|pt|tr)\//.test(location.pathname)) return <MexicoFreightPage />;
  if (normalizedCountry === 'ghana' && !/^\/(ar|fr|ru|pt|tr)\//.test(location.pathname)) return <GhanaFreightPage />;
  if (['saudi-arabia', 'uae', 'kuwait', 'qatar', 'oman', 'bahrain'].includes(normalizedCountry)) {
    return <ShippingMiddleEast />;
  }
  if (['russia', 'kazakhstan', 'uzbekistan', 'kyrgyzstan', 'tajikistan', 'turkmenistan'].includes(normalizedCountry)) {
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
  if (slug === 'outdoor-products-from-china' && isLocalizedProductPath(location.pathname)) return <OutdoorProducts />;
  if (slug === 'mobile-accessories-from-china' && isLocalizedProductPath(location.pathname)) return <MobileAccessories />;
  if (slug === 'commercial-kitchen-equipment-from-china' && isLocalizedProductPath(location.pathname)) return <LocalizedKitchenPage locale={productRouteParts(location.pathname).locale as 'es' | 'ar'} />;
  return <EnglishShowcaseRedirect path={`/sourcing/${slug}`} />;
}

function EnglishShowcaseRedirect({ path }: { path: string }) {
  const location = useLocation();
  const { language } = useLanguage();
  const redirect = englishProductRedirect(`${location.pathname}${location.search}${location.hash}`, language, location.state);
  return <Navigate to={redirect?.to || `${path}${location.search}${location.hash}`} state={redirect?.state} replace />;
}

function EnglishLocaleFallback({ prefix }: { prefix: '/pt' | '/tr' }) {
  const location = useLocation();
  const englishPath = location.pathname.replace(new RegExp(`^${prefix}(?=/|$)`), '') || '/';
  return <Navigate to={`${englishPath}${location.search}${location.hash}`} replace />;
}

function RouteLoadingFallback() {
  return (
    <main data-route-loading className="min-h-[70dvh] bg-[#F5F8FC] pt-28" aria-busy="true" aria-live="polite">
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

  useLayoutEffect(() => {
    const target = resolveNavigationLanguage(location.pathname, language, location.state);
    if (language !== target) setLanguage(target);
  }, [location.pathname, location.state, language, setLanguage]);

  // Remember each product history entry independently, including native-link arrivals.
  useEffect(() => {
    if (!isEnglishProductPath(location.pathname) || location.state?.navigationLanguage) return;
    const target = resolveNavigationLanguage(location.pathname, language, location.state);
    window.history.replaceState({ ...window.history.state, usr: navigationState(location.state, target) }, '');
  }, [location.pathname, location.state, language]);

  return null;
}

function HashScrollHandler() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map<string, { x: number; y: number }>());
  const previousPath = useRef<string | undefined>(undefined);

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = previous; };
  }, []);

  useLayoutEffect(() => {
    const positionKey = scrollPositionKey(location);
    const saved = positions.current.get(positionKey);
    const action = routeScrollAction({ pathname: location.pathname, previousPathname: previousPath.current,
      hash: location.hash, navigationType, hasSavedPosition: !!saved });
    previousPath.current = location.pathname;
    let frame = 0;
    let timer = 0;
    let observer: MutationObserver | undefined;
    let active = true;
    const stop = () => {
      active = false;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      observer?.disconnect();
    };
    const apply = () => {
      if (!active || document.querySelector('[data-route-loading]')) return;
      if (action === 'restore' && saved) {
        window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
        if (Math.abs(window.scrollY - saved.y) < 2) stop();
      } else if (action === 'hash') {
        const target = document.getElementById(routeHashId(location.hash) || '');
        if (target) { target.scrollIntoView({ block: 'start', behavior: 'instant' }); stop(); }
      } else if (action === 'top') {
        window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
        stop();
      }
    };
    if (action === 'top' || action === 'hash' || action === 'restore') {
      // Wait until lazy content and page-level controllers have committed.
      frame = window.requestAnimationFrame(() => { frame = window.requestAnimationFrame(apply); });
      observer = new MutationObserver(() => {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(apply);
      });
      observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
      timer = window.setTimeout(stop, 5000);
    }
    const remember = () => {
      // Native anchors can scroll before React processes hashchange. Do not write
      // the new anchor's viewport into the entry we just left.
      if (`${window.location.pathname}${window.location.search}${window.location.hash}` !==
        `${location.pathname}${location.search}${location.hash}`) return;
      positions.current.set(positionKey, { x: window.scrollX, y: window.scrollY });
      if (positions.current.size > 100) positions.current.delete(positions.current.keys().next().value!);
    };
    // Capture before the next page's controller changes the viewport; never sample on cleanup.
    const onScroll = () => { if (!active || action === 'preserve' || action === 'phone') remember(); };
    const onUserScroll = () => { stop(); remember(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onUserScroll, { passive: true });
    window.addEventListener('touchstart', onUserScroll, { passive: true });
    if (!saved) positions.current.set(positionKey, { x: 0, y: 0 });
    return () => {
      stop();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onUserScroll);
      window.removeEventListener('touchstart', onUserScroll);
    };
  }, [location.key, location.hash, location.pathname, location.search, navigationType]);

  return null;
}

function AnalyticsRouteTracker() {
  const location = useLocation();
  const isInitialRoute = useRef(true);

  useEffect(() => {
    initializeAnalyticsConsent();
  }, []);

  useEffect(() => {
    const sendGooglePageView = isInitialRoute.current;
    isInitialRoute.current = false;
    const timer = window.setTimeout(() => {
      trackPageView({ sendGooglePageView });
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
  pt: 'Ir para o conteúdo principal',
  tr: 'Ana içeriğe geç',
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
          <InternalPageNavigation />
          <SkipToMainContent />
          <LanguageRouteSync />
          <HashScrollHandler />
          <AttributionSessionSync />
          <AnalyticsRouteTracker />
          <GlobalConversionTracker />
          <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            {['', '/zh-cn', '/ru', '/fr', '/es', '/ar', '/pt', '/tr'].flatMap(prefix => ['sea-freight', 'lcl-shipping-from-china', 'dangerous-goods-shipping-from-china'].map(slug => <Route key={prefix + slug} path={prefix + '/services/' + slug} element={<FreightReleasePage/>}/>))}
            {/* English Default / Fallback Hub */}
            <Route path="/" element={<Home />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/insights" element={<InsightsHub />} />
            <Route path="/how-we-work" element={<HowWeWork />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/shipping-from-china-to-middle-east" element={<FreightRegionPage />} />
            <Route path="/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
            <Route path="/shipping-from-china-to-west-africa" element={<FreightRegionPage />} />
            <Route path="/shipping-from-china-to-latin-america" element={<FreightRegionPage />} />
            {SHIPPING_COUNTRIES.map((country) => (
              <Route key={`en-${country}`} path={`/shipping-from-china-to-${country}`} element={<CountryShippingRoute />} />
            ))}
            <Route path="/get-a-quote" element={<GetAQuotePage />} />
            {buyerGuidePaths.flatMap(path => productContentLanguages.map(locale => <Route key={`buyer-${locale}-${path}`} path={localizedProductPath(path, locale)} element={<BuyerGuidePage />} />))}
            {['/screen-protectors', '/screen-protectors/compare', '/screen-protectors/guides', '/screen-protectors/guides/price-differences', '/screen-protectors/guides/curved-glass', '/screen-protectors/videos', '/screen-protectors/calculator', '/screen-protectors/brief'].map(path => (
              <Route key={path} path={path} element={<ScreenProtectorPage />} />
            ))}
            <Route path="/products" element={<ProductsIndex />} />
            <Route path="/sourcing-services" element={<SourcingServices />} />
            <Route path="/refrigeration-equipment" element={<RefrigerationEquipment />} />
            <Route path="/sourcing/commercial-kitchen-equipment-from-china" element={<CommercialKitchen />} />
            <Route path={kitchenPackagePath} element={<RestaurantKitchenPackages />} />
            <Route path={`${kitchenPackagePath}/:scenarioSlug`} element={<RestaurantKitchenScenario />} />
            {kitchenCategoryPaths.map(path => <Route key={path} path={path} element={<KitchenCategoryPage />} />)}
            <Route path="/sourcing/audio-speakers-from-china" element={<AudioSpeakers />} />
            {mobilePaths.flatMap(path => productContentLanguages.map(locale => <Route key={`mobile-${locale}-${path}`} path={localizedProductPath(path, locale)} element={<MobileAccessories />} />))}
            <Route path="/sourcing/outdoor-products-from-china" element={<OutdoorProducts />} />
            {productContentLanguages.map(locale => <Route key={`power-guide-${locale}`} path={localizedProductPath("/portable-power/selection-guide", locale)} element={<OutdoorProducts guide />} />)}
            <Route path="/commercial-kitchen" element={<EnglishShowcaseRedirect path="/sourcing/commercial-kitchen-equipment-from-china" />} />
            <Route path="/audio-speakers" element={<EnglishShowcaseRedirect path="/sourcing/audio-speakers-from-china" />} />
            <Route path="/mobile-accessories" element={<EnglishShowcaseRedirect path="/sourcing/mobile-accessories-from-china" />} />
            <Route path="/outdoor-products" element={<EnglishShowcaseRedirect path="/sourcing/outdoor-products-from-china" />} />
            {import.meta.env.DEV ? (
              <>
                <Route path="/content-ops" element={<ContentOpsDashboard />} />
                <Route path="/design-preview/home-v2" element={<HomeV2Preview />} />
              </>
            ) : null}
            <Route path="/design-preview/freight-maps" element={<FreightMapPreview />} />
            <Route path="/sourcing-services/supplier-search" element={<SourcingServicePage kind="supplier-search" />} />
            <Route path="/sourcing-services/inspection-quality-control" element={<SourcingServicePage kind="inspection-quality-control" />} />
            <Route path="/sourcing-services/consolidation-export" element={<SourcingServicePage kind="consolidation-export" />} />

            {/* Compatibility only: localized product aliases retain intent, then use the English URL. */}
            {Object.values(navigationPrefixes).filter(Boolean).flatMap(prefix => [
              ...englishProductPaths.filter(path => path.startsWith('/screen-protectors') && !buyerGuidePaths.includes(path)),
              ...kitchenCategoryPaths, kitchenPackagePath, ...kitchenPackageScenarioPaths,
              ...(!['/es','/ar'].includes(prefix) ? mobilePaths.filter(path => !path.startsWith('/sourcing/')) : []),
              '/commercial-kitchen', '/audio-speakers', '/mobile-accessories', '/outdoor-products',
            ].map(path => (
              <Route key={`${prefix}${path}`} path={`${prefix}${path}`} element={isLocalizedProductPath(`${prefix}${path}`) && path.startsWith('/screen-protectors') ? <LocalizedScreenProtectorPage /> : <EnglishShowcaseRedirect path={path} />} />
            )))}

            {/* Chinese Bundle Router */}
            <Route path="/zh-cn" element={<Home />} />
            <Route path="/zh-cn/blog/:slug" element={<BlogDetail />} />
            <Route path="/zh-cn/insights" element={<InsightsHub />} />
            <Route path="/zh-cn/how-we-work" element={<HowWeWork />} />
            <Route path="/zh-cn/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/zh-cn/shipping-from-china-to-middle-east" element={<FreightRegionPage />} />
            <Route path="/zh-cn/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
            <Route path="/zh-cn/shipping-from-china-to-west-africa" element={<FreightRegionPage />} />
            <Route path="/zh-cn/shipping-from-china-to-latin-america" element={<FreightRegionPage />} />
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
            <Route path="/es/shipping-from-china-to-middle-east" element={<FreightRegionPage />} />
            <Route path="/es/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
            <Route path="/es/shipping-from-china-to-west-africa" element={<FreightRegionPage />} />
            <Route path="/es/shipping-from-china-to-latin-america" element={<FreightRegionPage />} />
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

            {/* Portuguese routes */}
            <Route path="/pt" element={<Home />} />
            <Route path="/pt/blog/:slug" element={<BlogDetail />} />
            <Route path="/pt/insights" element={<InsightsHub />} />
            <Route path="/pt/how-we-work" element={<HowWeWork />} />
            <Route path="/pt/services/:serviceId" element={<EnglishLocaleFallback prefix="/pt" />} />
            <Route path="/pt/shipping-from-china-to-middle-east" element={<EnglishLocaleFallback prefix="/pt" />} />
            <Route path="/pt/shipping-from-china-to-central-asia" element={<EnglishLocaleFallback prefix="/pt" />} />
            <Route path="/pt/shipping-from-china-to-west-africa" element={<EnglishLocaleFallback prefix="/pt" />} />
            <Route path="/pt/shipping-from-china-to-latin-america" element={<EnglishLocaleFallback prefix="/pt" />} />
            {SHIPPING_COUNTRIES.map((country) => (
              <Route key={`pt-${country}`} path={`/pt/shipping-from-china-to-${country}`} element={<EnglishLocaleFallback prefix="/pt" />} />
            ))}
            <Route path="/pt/get-a-quote" element={<GetAQuotePage />} />
            <Route path="/pt/products" element={<EnglishShowcaseRedirect path="/products" />} />
            <Route path="/pt/sourcing-services" element={<EnglishShowcaseRedirect path="/sourcing-services" />} />
            <Route path="/pt/refrigeration-equipment" element={<EnglishShowcaseRedirect path="/refrigeration-equipment" />} />
            {SOURCING_CATEGORIES.map(({ slug, kind }) => (
              <Route key={`pt-${kind}`} path={`/pt/sourcing/${slug}`} element={<EnglishSourcingCategoryRedirect slug={slug} />} />
            ))}
            <Route path="/pt/sourcing-services/supplier-search" element={<SourcingServicePage kind="supplier-search" />} />
            <Route path="/pt/sourcing-services/inspection-quality-control" element={<SourcingServicePage kind="inspection-quality-control" />} />
            <Route path="/pt/sourcing-services/consolidation-export" element={<SourcingServicePage kind="consolidation-export" />} />

            {/* Turkish routes */}
            <Route path="/tr" element={<Home />} />
            <Route path="/tr/blog/:slug" element={<BlogDetail />} />
            <Route path="/tr/insights" element={<InsightsHub />} />
            <Route path="/tr/how-we-work" element={<HowWeWork />} />
            <Route path="/tr/services/:serviceId" element={<EnglishLocaleFallback prefix="/tr" />} />
            <Route path="/tr/shipping-from-china-to-middle-east" element={<EnglishLocaleFallback prefix="/tr" />} />
            <Route path="/tr/shipping-from-china-to-central-asia" element={<EnglishLocaleFallback prefix="/tr" />} />
            <Route path="/tr/shipping-from-china-to-west-africa" element={<EnglishLocaleFallback prefix="/tr" />} />
            <Route path="/tr/shipping-from-china-to-latin-america" element={<EnglishLocaleFallback prefix="/tr" />} />
            {SHIPPING_COUNTRIES.map((country) => (
              <Route key={`tr-${country}`} path={`/tr/shipping-from-china-to-${country}`} element={<EnglishLocaleFallback prefix="/tr" />} />
            ))}
            <Route path="/tr/get-a-quote" element={<GetAQuotePage />} />
            <Route path="/tr/products" element={<EnglishShowcaseRedirect path="/products" />} />
            <Route path="/tr/sourcing-services" element={<EnglishShowcaseRedirect path="/sourcing-services" />} />
            <Route path="/tr/refrigeration-equipment" element={<EnglishShowcaseRedirect path="/refrigeration-equipment" />} />
            {SOURCING_CATEGORIES.map(({ slug, kind }) => (
              <Route key={`tr-${kind}`} path={`/tr/sourcing/${slug}`} element={<EnglishSourcingCategoryRedirect slug={slug} />} />
            ))}
            <Route path="/tr/sourcing-services/supplier-search" element={<SourcingServicePage kind="supplier-search" />} />
            <Route path="/tr/sourcing-services/inspection-quality-control" element={<SourcingServicePage kind="inspection-quality-control" />} />
            <Route path="/tr/sourcing-services/consolidation-export" element={<SourcingServicePage kind="consolidation-export" />} />
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
