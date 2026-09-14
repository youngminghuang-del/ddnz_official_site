import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import SEO from '../../components/SEO';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import LegalModal, { type LegalType } from '../../components/LegalModal';
import { trackEvent } from '../../lib/analytics';
import { productAlternates, productRouteParts } from '../../lib/productLocalization.mjs';
import { buyerGuideForPath, buyerMeta, buyerSchema, buyerJourneyAnalytics } from './data.mjs';
import BuyerGuideContent from './BuyerGuideContent.jsx';

export default function BuyerGuidePage() {
  const { pathname } = useLocation();
  const guide = buyerGuideForPath(pathname), locale = productRouteParts(pathname).locale as 'en' | 'es' | 'ar';
  const [legal, setLegal] = useState<LegalType>(null);
  useEffect(() => {
    if (!guide) return;
    document.getElementById('schema-jsonld-static-page')?.remove();
    const node = document.createElement('script'); node.id = 'schema-jsonld-buyer'; node.type = 'application/ld+json';
    node.textContent = JSON.stringify(buyerSchema(guide, locale)); document.head.appendChild(node);
    return () => node.remove();
  }, [guide, locale]);
  if (!guide) return <Navigate to="/products/" replace />;
  const meta = buyerMeta(guide, locale);
  return <><SEO title={meta.title} description={meta.description} image={meta.image} canonicalPath={meta.path} contentLanguage={locale} alternateUrls={productAlternates(guide.path)} />
    <SourcingHomepageNav quotePath={`${meta.path}#buyer-brief`} />
    <BuyerGuideContent key={guide.id} guide={guide} locale={locale} onPrivacy={() => setLegal('privacy')} onAction={(action: string) => {
      const payload = buyerJourneyAnalytics(guide.id, locale, action); if (payload) trackEvent(payload.event, payload.params);
    }} />
    <Footer quotePath={`${meta.path}#buyer-brief`} pageKey={guide.id} />
    <LegalModal type={legal} onClose={() => setLegal(null)} /></>;
}
