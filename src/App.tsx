import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import BlogDetail from './pages/BlogDetail';
import InsightsHub from './pages/InsightsHub';
import ServiceDetail from './pages/ServiceDetail';
import ShippingMiddleEast from './pages/shipping-from-china-to-middle-east';
import ShippingCentralAsia from './pages/shipping-from-china-to-central-asia';
import ShippingWestAfrica from './pages/shipping-from-china-to-west-africa';
import ShippingLatinAmerica from './pages/shipping-from-china-to-latin-america';
import GetAQuotePage from './pages/get-a-quote';
import CookieConsent from './components/CookieConsent';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

function LanguageRouteSync() {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    let targetLang: 'en' | 'zh' | 'ru' | 'fr' = 'en';

    if (pathname.startsWith('/zh-cn')) {
      targetLang = 'zh';
    } else if (pathname.startsWith('/ru')) {
      targetLang = 'ru';
    } else if (pathname.startsWith('/fr')) {
      targetLang = 'fr';
    }

    if (language !== targetLang) {
      setLanguage(targetLang);
    }
  }, [location.pathname, language, setLanguage]);

  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <LanguageRouteSync />
        <Routes>
          {/* English Default / Fallback Hub */}
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/insights" element={<InsightsHub />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
          <Route path="/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
          <Route path="/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
          <Route path="/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
          <Route path="/get-a-quote" element={<GetAQuotePage />} />

          {/* Chinese Bundle Router */}
          <Route path="/zh-cn" element={<Home />} />
          <Route path="/zh-cn/blog/:id" element={<BlogDetail />} />
          <Route path="/zh-cn/insights" element={<InsightsHub />} />
          <Route path="/zh-cn/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/zh-cn/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
          <Route path="/zh-cn/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
          <Route path="/zh-cn/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
          <Route path="/zh-cn/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
          <Route path="/zh-cn/get-a-quote" element={<GetAQuotePage />} />

          {/* Russian Bundle Router */}
          <Route path="/ru" element={<Home />} />
          <Route path="/ru/blog/:id" element={<BlogDetail />} />
          <Route path="/ru/insights" element={<InsightsHub />} />
          <Route path="/ru/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/ru/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
          <Route path="/ru/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
          <Route path="/ru/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
          <Route path="/ru/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
          <Route path="/ru/get-a-quote" element={<GetAQuotePage />} />

          {/* French Bundle Router */}
          <Route path="/fr" element={<Home />} />
          <Route path="/fr/blog/:id" element={<BlogDetail />} />
          <Route path="/fr/insights" element={<InsightsHub />} />
          <Route path="/fr/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/fr/shipping-from-china-to-middle-east" element={<ShippingMiddleEast />} />
          <Route path="/fr/shipping-from-china-to-central-asia" element={<ShippingCentralAsia />} />
          <Route path="/fr/shipping-from-china-to-west-africa" element={<ShippingWestAfrica />} />
          <Route path="/fr/shipping-from-china-to-latin-america" element={<ShippingLatinAmerica />} />
          <Route path="/fr/get-a-quote" element={<GetAQuotePage />} />
        </Routes>
        <CookieConsent />
      </Router>
    </LanguageProvider>
  );
}
