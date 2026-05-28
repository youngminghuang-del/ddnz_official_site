import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import BlogDetail from './pages/BlogDetail';
import InsightsHub from './pages/InsightsHub';
import ServiceDetail from './pages/ServiceDetail';
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

          {/* Chinese Bundle Router */}
          <Route path="/zh-cn" element={<Home />} />
          <Route path="/zh-cn/blog/:id" element={<BlogDetail />} />
          <Route path="/zh-cn/insights" element={<InsightsHub />} />
          <Route path="/zh-cn/services/:serviceId" element={<ServiceDetail />} />

          {/* Russian Bundle Router */}
          <Route path="/ru" element={<Home />} />
          <Route path="/ru/blog/:id" element={<BlogDetail />} />
          <Route path="/ru/insights" element={<InsightsHub />} />
          <Route path="/ru/services/:serviceId" element={<ServiceDetail />} />

          {/* French Bundle Router */}
          <Route path="/fr" element={<Home />} />
          <Route path="/fr/blog/:id" element={<BlogDetail />} />
          <Route path="/fr/insights" element={<InsightsHub />} />
          <Route path="/fr/services/:serviceId" element={<ServiceDetail />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
