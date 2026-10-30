import { useEffect } from 'react';
import { freightServiceSchema } from '../features/freight/freightServiceSchema';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from '../components/SEO';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import FreightReleaseContent, { freightReleaseMetadata, freightReleasePaths } from '../features/freight/FreightReleaseContent';
import { establishedFreightServiceLanguages, freightAlternates, freightLanguagePrefix } from '../features/freight/freightLanguages';
import '../features/freight/freight.css';

export default function FreightReleasePage() {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const path = pathname.replace(/^\/(?:zh-cn|ru|fr|es|ar|pt|tr)\//, '/').replace(/^\/+|\/+$/g, '');
  const meta = freightReleaseMetadata(path, language);
  useEffect(() => {
    // Replace the static snapshot (or the previous route's graph) with the same source.
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
    const script = document.createElement('script');
    script.id = 'schema-jsonld-freight-service'; script.type = 'application/ld+json';
    script.textContent = JSON.stringify(freightServiceSchema(path, language, meta)).replace(/</g, '\\u003c');
    document.head.appendChild(script);
    return () => script.remove();
  }, [path, language, meta.title, meta.desc]);
  const alternateLanguages = freightReleasePaths.includes(path) ? undefined : establishedFreightServiceLanguages;
  return <div className="ddnz-home min-h-screen bg-[#fffdf9] text-[#10243f]" dir={language === 'ar' ? 'rtl' : 'ltr'}><SEO title={meta.title} description={meta.desc} contentLanguage={language} canonicalPath={`${freightLanguagePrefix(language)}/${path}/`} alternateUrls={path==='services/ddp-shipping-from-china'?[{hrefLang:'zh-CN',href:'https://www.ddnzglobal.com/zh-cn/services/ddp-shipping-from-china/'},{hrefLang:'x-default',href:'https://www.ddnzglobal.com/services/ddp-shipping-from-china/'},{hrefLang:'en',href:'https://www.ddnzglobal.com/services/ddp-shipping-from-china/'}]:freightAlternates(`/${path}/`, alternateLanguages)}/><SourcingHomepageNav showFreightExecutor/><FreightReleaseContent path={path} language={language}/><Footer/></div>;
}
