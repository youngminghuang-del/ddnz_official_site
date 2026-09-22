import { useLanguage } from '../contexts/LanguageContext';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import WhatsAppFloat from '../components/WhatsAppFloat';
import UaeContent, { uaeMetadata } from '../features/freight/UaeContent';
import '../features/freight/freight.css';

export default function UaeFreightPage() {
  const {language} = useLanguage();
  const locale = language === 'zh' || language === 'es' ? language : 'en';
  const meta = uaeMetadata(locale);
  return <div className="ddnz-home"><SEO title={meta.title} description={meta.desc} /><SourcingHomepageNav showFreightExecutor /><UaeContent locale={locale} /><Footer /><WhatsAppFloat /></div>;
}
