import { useLanguage } from '../contexts/LanguageContext';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import WhatsAppFloat from '../components/WhatsAppFloat';
import NigeriaContent, { nigeriaMetadata } from '../features/freight/NigeriaContent';
import '../features/freight/freight.css';

export default function NigeriaFreightPage() {
  const {language} = useLanguage();
  const locale = language === 'zh' || language === 'es' ? language : 'en';
  const meta = nigeriaMetadata(locale);
  return <div className="ddnz-home"><SEO title={meta.title} description={meta.desc}/><SourcingHomepageNav showFreightExecutor/><NigeriaContent locale={locale}/><Footer/><WhatsAppFloat/></div>;
}
