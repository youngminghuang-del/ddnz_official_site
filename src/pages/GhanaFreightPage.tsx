import { useLanguage } from '../contexts/LanguageContext';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import WhatsAppFloat from '../components/WhatsAppFloat';
import GhanaContent, { ghanaMetadata } from '../features/freight/GhanaContent';
import '../features/freight/freight.css';

export default function GhanaFreightPage() {
  const {language} = useLanguage();
  const locale = language === 'zh' || language === 'es' ? language : 'en';
  const meta = ghanaMetadata(locale);
  return <div className="ddnz-home"><SEO title={meta.title} description={meta.desc}/><SourcingHomepageNav showFreightExecutor/><GhanaContent locale={locale} preview={import.meta.env.DEV}/><Footer/><WhatsAppFloat/></div>;
}
