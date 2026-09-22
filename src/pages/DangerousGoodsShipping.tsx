import { useLanguage } from '../contexts/LanguageContext';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import WhatsAppFloat from '../components/WhatsAppFloat';
import DgInternationalContent, { internationalDgMetadata } from '../features/freight/DgInternationalContent';
import type { LclExtraLocale } from '../features/freight/lclInternationalCopy';
import { freightAlternates, freightLanguagePrefix } from '../features/freight/freightLanguages';
import '../features/freight/freight.css';

import { copy, DangerousGoodsOriginalContent } from '../features/freight/DangerousGoodsOriginalContent';

export default function DangerousGoodsShipping() {
  const { language } = useLanguage();
  const path = '/services/dangerous-goods-shipping-from-china/';
  if (language !== 'zh' && language !== 'en' && language !== 'es') {
    const meta = internationalDgMetadata(language as LclExtraLocale);
    return <div className="ddnz-home" dir={language === 'ar' ? 'rtl' : 'ltr'}><SEO title={meta.title} description={meta.desc} contentLanguage={language} canonicalPath={`${freightLanguagePrefix(language)}${path}`} alternateUrls={freightAlternates(path)}/><SourcingHomepageNav showFreightExecutor/><DgInternationalContent locale={language as LclExtraLocale}/><Footer/><WhatsAppFloat/></div>;
  }
  const lang = language === 'zh' || language === 'es' ? language : 'en';
  const text = copy[lang];
  const prefix = lang === 'zh' ? '/zh-cn' : lang === 'es' ? '/es' : '';
  return (
    <div className="ddnz-home min-h-screen bg-[#fffdf9] text-[#10243f]">
      <SEO title={`${text.title} | DDNZ Global`} description={text.intro} contentLanguage={language} canonicalPath={`${prefix}${path}`} alternateUrls={freightAlternates(path)} />
      <SourcingHomepageNav showFreightExecutor />
      <DangerousGoodsOriginalContent lang={lang}/>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
