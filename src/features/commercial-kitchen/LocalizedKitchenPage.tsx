import type {Language} from '../../i18n/translations';
import {productRouteParts} from '../../lib/productLocalization.mjs';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../../components/SEO';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import BuyerGuideLinks from '../buyer-guides/BuyerGuideLinks.jsx';
import { buyerJourneyAnalytics } from '../buyer-guides/data.mjs';
import { trackEvent } from '../../lib/analytics';
import { kitchenExplorationAnalytics, kitchenInquiryAnalytics } from './site-analytics.mjs';
import LocalizedKitchenContent from './LocalizedKitchenContent.jsx';
import { getLocalizedKitchenMetadata, kitchenCopy } from './data/localization.mjs';
import './styles/kitchen.css';
import './styles/localized-kitchen.css';

export { getLocalizedKitchenMetadata } from './data/localization.mjs';
export { LocalizedKitchenContent } from './LocalizedKitchenContent.jsx';

export default function LocalizedKitchenPage({ locale: providedLocale }: { locale?: 'zh' | 'es' | 'ar' | 'ru' | 'fr' | 'pt' | 'tr' } = {}) {
  const { pathname } = useLocation();
  const locale = providedLocale || productRouteParts(pathname).locale as Language;
  const metadata = useMemo(() => getLocalizedKitchenMetadata(locale), [locale]);
  const copy = kitchenCopy(locale).ui;
  const quotePath = `${metadata.canonicalPath}#commercial-kitchen-list`;
  function onAction(action: string, detail?: { mode: string; productCount: number; unitCount: number }) {
    if (detail) {
      let preferences = {};
      try { preferences = JSON.parse(localStorage.getItem('cookiePreferences') || '{}'); } catch { /* Deny tracking without consent. */ }
      const payload = kitchenInquiryAnalytics({ ...detail, action }, preferences);
      if (payload) trackEvent(payload.event, payload.params);
    } else {
      const payload = kitchenExplorationAnalytics(action);
      if (payload) trackEvent(payload.event, payload.params);
    }
  }
  useEffect(() => {
    document.getElementById('schema-jsonld-static-page')?.remove();
    const schema = document.createElement('script');
    schema.id = 'schema-jsonld-localized-kitchen';
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify(metadata.structuredData);
    document.head.appendChild(schema);
    return () => schema.remove();
  }, [metadata]);
  return <>
    <SEO title={metadata.title} description={metadata.description} contentLanguage={locale}
      canonicalPath={metadata.canonicalPath} alternateUrls={metadata.alternateUrls} image={metadata.image}/>
    <SourcingHomepageNav quotePath={quotePath}/>
    <LocalizedKitchenContent locale={locale} onAction={onAction}/>
    <BuyerGuideLinks group="kitchen" locale={locale} onAction={(id: string, action: string) => {
      const payload = buyerJourneyAnalytics(id, locale, action);
      if (payload) trackEvent(payload.event, payload.params);
    }}/>
    <Footer quotePath={quotePath} pageKey="commercial_kitchen" description={copy.footerDescription}
      pageLinks={[{ href: '#commercial-kitchen-equipment', label: copy.equipment }, { href: '#commercial-kitchen-benchmarks', label: copy.prices }, { href: '#commercial-kitchen-list', label: copy.list }]}/>
  </>;
}
