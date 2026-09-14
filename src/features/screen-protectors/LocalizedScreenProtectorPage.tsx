import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import BuyerGuideLinks from '../buyer-guides/BuyerGuideLinks.jsx';
import { buyerJourneyAnalytics } from '../buyer-guides/data.mjs';
import { trackEvent } from '../../lib/analytics';
import { localizedScreenProtectorJourneyAnalytics } from './site-analytics.mjs';
import LocalizedScreenProtectorContent from './LocalizedScreenProtectorContent.jsx';
import { LOCALIZED_SCREEN_PROTECTOR_ROUTES, applyLocalizedScreenProtectorSEO } from './localized-seo.mjs';
import './screen-protectors.css';
import './phone-localized.css';

declare const __LOCAL_CANDIDATE__: boolean;

export default function LocalizedScreenProtectorPage() {
  const location = useLocation(), navigate = useNavigate();
  const route = LOCALIZED_SCREEN_PROTECTOR_ROUTES.find(item => item.path === `${location.pathname.replace(/\/+$/, '')}/`);
  useEffect(() => {
    if (!route) return;
    applyLocalizedScreenProtectorSEO(document, route.locale, route.page, {
      preview: (typeof __LOCAL_CANDIDATE__ !== 'undefined' && __LOCAL_CANDIDATE__)
        || ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname),
    });
    return () => { document.head.querySelectorAll('script[data-screen-protector-schema]').forEach(node => node.remove()); };
  }, [route]);
  if (!route) return <Navigate to="/screen-protectors/" replace />;
  const quotePath = `${route.path}#phone-inquiry`;
  return <><SourcingHomepageNav quotePath={quotePath} />
    <LocalizedScreenProtectorContent locale={route.locale} page={route.page} onNavigate={href => navigate(href)} onAction={(action: string) => {
      const payload = localizedScreenProtectorJourneyAnalytics(route.locale, action);
      if (payload) trackEvent(payload.event, payload.params);
    }} />
    <BuyerGuideLinks group="phone" locale={route.locale} onAction={(id: string, action: string) => {
      const payload = buyerJourneyAnalytics(id, route.locale, action);
      if (payload) trackEvent(payload.event, payload.params);
    }} />
    <Footer quotePath={quotePath} />
  </>;
}
