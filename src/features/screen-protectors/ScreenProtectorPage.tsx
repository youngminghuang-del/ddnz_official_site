import { useEffect, useRef } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import { mountScreenProtectors } from './controller.mjs';
import { pageForPath, ROUTES } from './routes.mjs';
import { applyScreenProtectorSEO } from './seo.mjs';
import { canonicalSitePath } from '../../lib/notionArticleRouting';
import './screen-protectors.css';

declare const __LOCAL_CANDIDATE__: boolean;

export default function ScreenProtectorPage() {
  const root = useRef<HTMLDivElement>(null);
  const controller = useRef<ReturnType<typeof mountScreenProtectors> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const destination = useRef(navigate);
  destination.current = navigate;
  const page = pageForPath(location.pathname);
  useEffect(() => {
    if (!root.current) return;
    const mounted = mountScreenProtectors(root.current, (path: string) => destination.current(canonicalSitePath(path)));
    controller.current = mounted;
    return () => { mounted.destroy(); controller.current = null; };
  }, []);
  useEffect(() => {
    controller.current?.activate(location.pathname, location.hash);
    if (page) applyScreenProtectorSEO(document, location.pathname, {
      preview: (typeof __LOCAL_CANDIDATE__ !== 'undefined' && __LOCAL_CANDIDATE__)
        || ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname),
    });
  }, [location.pathname, location.hash, page]);
  if (!page) return <Navigate to={canonicalSitePath(ROUTES.home)} replace />;
  return <><SourcingHomepageNav quotePath={ROUTES.quote} supportedLanguages={['en']} /><div className="phone-film" ref={root} /><Footer quotePath={ROUTES.quote} /></>;
}
