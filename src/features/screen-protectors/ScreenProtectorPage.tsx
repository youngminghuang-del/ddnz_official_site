import { useEffect, useRef } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import { mountScreenProtectors } from './controller.mjs';
import { pageForPath, ROUTES } from './routes.mjs';
import { applyScreenProtectorSEO, removeScreenProtectorSchema } from './seo.mjs';
import { canonicalSitePath } from '../../lib/notionArticleRouting';
import { useLanguage } from '../../contexts/LanguageContext';
import { navigationPath } from '../../lib/productLanguageRouting';
import { screenProtectorHomeLabels } from '../../config/screenProtectorNavigation';
import { trackEvent } from '../../lib/analytics';
import { screenProtectorJourneyAnalytics } from './site-analytics.mjs';
import './screen-protectors.css';
import BuyerGuideLinks from '../buyer-guides/BuyerGuideLinks.jsx';
import { buyerJourneyAnalytics } from '../buyer-guides/data.mjs';

declare const __LOCAL_CANDIDATE__: boolean;

export default function ScreenProtectorPage() {
  const root = useRef<HTMLDivElement>(null);
  const controller = useRef<ReturnType<typeof mountScreenProtectors> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const prefixHomeLink = navigationPath('/', language);
  const destination = useRef(navigate);
  destination.current = navigate;
  const page = pageForPath(location.pathname);
  useEffect(() => {
    if (!root.current) return;
    const mounted = mountScreenProtectors(root.current, (path: string) => destination.current(canonicalSitePath(path)), (action: string) => {
      const payload = screenProtectorJourneyAnalytics(action);
      if (payload) trackEvent(payload.event, payload.params);
    });
    controller.current = mounted;
    return () => { mounted.destroy(); controller.current = null; removeScreenProtectorSchema(document); };
  }, []);
  useEffect(() => {
    const breadcrumbs = { homeHref: prefixHomeLink, homeLabel: screenProtectorHomeLabels[language], homeLanguage: language === 'zh' ? 'zh-CN' : language };
    controller.current?.setBreadcrumbs(breadcrumbs);
    if (page) applyScreenProtectorSEO(document, location.pathname, {
      breadcrumbs,
      preview: (typeof __LOCAL_CANDIDATE__ !== 'undefined' && __LOCAL_CANDIDATE__)
        || ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname),
    });
  }, [location.pathname, page, language, prefixHomeLink]);
  useEffect(() => {
    controller.current?.activate(location.pathname, location.hash);
  }, [location.pathname, location.hash, page]);
  if (!page) return <Navigate to={canonicalSitePath(ROUTES.home)} replace />;
  // The shared navigation renders ProductLanguageNotice outside the English body.
  return <><SourcingHomepageNav quotePath={ROUTES.quote} /><div className="phone-film" lang="en" dir="ltr" ref={root} />{['home','products'].includes(page) && <BuyerGuideLinks group="phone" locale="en" onAction={(id: string, action: string) => { const payload = buyerJourneyAnalytics(id, 'en', action); if (payload) trackEvent(payload.event, payload.params); }} />}<Footer quotePath={ROUTES.quote} /></>;
}
