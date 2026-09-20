import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from '../components/SEO';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import FreightReleaseContent, { freightReleaseMetadata } from '../features/freight/FreightReleaseContent';
import { freightAlternates, freightLanguagePrefix } from '../features/freight/freightLanguages';
import '../features/freight/freight.css';

export default function FreightReleasePage() {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const path = pathname.replace(/^\/(?:zh-cn|ru|fr|es|ar|pt|tr)\//, '/').replace(/^\/+|\/+$/g, '');
  const meta = freightReleaseMetadata(path, language);
  return <div className="ddnz-home min-h-screen bg-[#fffdf9] text-[#10243f]" dir={language === 'ar' ? 'rtl' : 'ltr'}><SEO title={meta.title} description={meta.desc} contentLanguage={language} canonicalPath={`${freightLanguagePrefix(language)}/${path}/`} alternateUrls={freightAlternates(`/${path}/`)}/><SourcingHomepageNav showFreightExecutor/><FreightReleaseContent path={path} language={language}/><Footer/><WhatsAppFloat/></div>;
}
