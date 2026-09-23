import { Navigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';
import CentralAsiaOverviewContent, { centralAsiaMetadata } from '../features/freight/CentralAsiaOverviewContent';
import { freightPrefix } from '../features/freight/regions';
import '../features/freight/freight.css';

const countrySlugs = new Set(['kazakhstan', 'uzbekistan', 'kyrgyzstan', 'tajikistan', 'turkmenistan', 'russia']);

export default function CentralAsiaOverviewPage() {
  const { language } = useLanguage();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const requestedCountry = (params.get('country') || params.get('dest') || '').toLowerCase();
  if (countrySlugs.has(requestedCountry)) {
    params.delete('country');
    params.delete('dest');
    const countryPrefix = freightPrefix(language);
    return <Navigate replace to={`${countryPrefix}/shipping-from-china-to-${requestedCountry}/${params.size ? `?${params}` : ''}`} />;
  }
  const meta = centralAsiaMetadata(language);
  return <div className="ddnz-home freight-editorial"><SEO title={meta.title} description={meta.desc} /><SourcingHomepageNav showFreightExecutor /><CentralAsiaOverviewContent locale={language} /><Footer /><WhatsAppFloat /></div>;
}
