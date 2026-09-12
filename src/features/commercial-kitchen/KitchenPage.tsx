import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import LegalModal, { LegalType } from '../../components/LegalModal';
import SEO from '../../components/SEO';
import { trackEvent } from '../../lib/analytics';
import KitchenContent from './KitchenContent.jsx';
import launch from './data/launch.mjs';
import { kitchenInquiryAnalytics } from './site-analytics.mjs';
import { canonicalKitchenHash } from './routes.mjs';

const route = '/sourcing/commercial-kitchen-equipment-from-china/';
const canonical = `https://www.ddnzglobal.com${route}`;

export default function KitchenPage() {
  const [legalType, setLegalType] = useState<LegalType>(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const hash = canonicalKitchenHash(location.hash);
    if (hash !== location.hash) navigate(`${location.pathname}${location.search}${hash}`, { replace: true });
  }, [location.hash, location.pathname, location.search, navigate]);
  useEffect(() => {
    const onInquiry = (event: Event) => {
      let preferences = {};
      try { preferences = JSON.parse(localStorage.getItem('cookiePreferences') || '{}'); } catch { /* Consent remains denied. */ }
      const payload = kitchenInquiryAnalytics((event as CustomEvent).detail, preferences);
      if (payload) trackEvent(payload.event, payload.params);
    };
    window.addEventListener('ddnz:inquiry', onInquiry);
    if (['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)) {
      document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex,nofollow');
    }
    return () => window.removeEventListener('ddnz:inquiry', onInquiry);
  }, []);
  return <>
    <SEO title={launch.meta.title} description={launch.meta.description}
      canonicalPath={route} alternateUrls={[{ hrefLang: 'en', href: canonical }]}
      image="/commercial-kitchen-media/kitchen-hero.webp" />
    <SourcingHomepageNav quotePath={`${route}#commercial-kitchen-list`} supportedLanguages={['en']} />
    <KitchenContent onPrivacy={() => setLegalType('privacy')} />
    <Footer quotePath={`${route}#commercial-kitchen-list`} pageKey="commercial_kitchen"
      description="Commercial kitchen equipment sourcing for importers, wholesalers and distributors."
      pageLinks={[{ href: '#commercial-kitchen-equipment', label: 'Equipment' }, { href: '#commercial-kitchen-benchmarks', label: 'Price references' }, { href: '#commercial-kitchen-list', label: 'Your sourcing list' }]} />
    <LegalModal type={legalType} onClose={() => setLegalType(null)} />
  </>;
}
