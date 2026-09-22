import { useLanguage } from '../contexts/LanguageContext';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import WhatsAppFloat from '../components/WhatsAppFloat';
import MexicoContent, { mexicoMetadata } from '../features/freight/MexicoContent';
import '../features/freight/freight.css';

export default function MexicoFreightPage() {
  const {language} = useLanguage();
  const locale = language === 'zh' || language === 'es' ? language : 'en';
  const meta = mexicoMetadata(locale);
  return <div className="ddnz-home"><SEO title={meta.title} description={meta.desc}/><SourcingHomepageNav showFreightExecutor/><MexicoContent locale={locale}/><Footer/><WhatsAppFloat/></div>;
}
