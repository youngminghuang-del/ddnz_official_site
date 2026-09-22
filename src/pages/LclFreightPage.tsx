import { useLanguage } from '../contexts/LanguageContext';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import WhatsAppFloat from '../components/WhatsAppFloat';
import LclContent, { lclMetadata } from '../features/freight/LclContent';
import LclMaterialPreview from '../features/freight/LclMaterialPreview';
import LclInternationalContent, { internationalLclMetadata } from '../features/freight/LclInternationalContent';
import { type LclExtraLocale } from '../features/freight/lclInternationalCopy';
import { freightAlternates, freightLanguagePrefix } from '../features/freight/freightLanguages';
import '../features/freight/freight.css';

export default function LclFreightPage() {
  const {language} = useLanguage();
  const original = language === 'zh' || language === 'en' || language === 'es';
  const meta = original ? lclMetadata(language) : internationalLclMetadata(language as LclExtraLocale);
  const path = '/services/lcl-shipping-from-china/';
  return <div className="ddnz-home" dir={language === 'ar' ? 'rtl' : 'ltr'}><SEO title={meta.title} description={meta.desc} contentLanguage={language} canonicalPath={`${freightLanguagePrefix(language)}${path}`} alternateUrls={freightAlternates(path)}/><SourcingHomepageNav showFreightExecutor/>{original ? <LclContent locale={language} materialPreview={<LclMaterialPreview locale={language}/>}/> : <LclInternationalContent locale={language as LclExtraLocale}/>}<Footer/><WhatsAppFloat/></div>;
}
