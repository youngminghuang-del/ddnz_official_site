import { useLanguage } from '../contexts/LanguageContext';
import { useLocation, Navigate } from 'react-router-dom';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';
import RegionContent, { regionPageMetadata } from '../features/freight/RegionContent';
import { regions, freightPrefix, type RegionId } from '../features/freight/regions';
import '../features/freight/freight.css';

export default function FreightRegionPage() {
  const { language } = useLanguage();
  const { pathname, search } = useLocation();
  const locale = language;
  const region = pathname.split('/').filter(Boolean).at(-1)!.replace('shipping-from-china-to-', '') as RegionId;
  const meta = regionPageMetadata(region, locale);
  const params = new URLSearchParams(search);
  const legacyCountry = (params.get('country') || params.get('dest') || '').toLowerCase();
  if (regions[region].countries.some(country => country.slug === legacyCountry)) {
    params.delete('country');
    params.delete('dest');
    const countryPrefix = freightPrefix(locale);
    return <Navigate replace to={`${countryPrefix}/shipping-from-china-to-${legacyCountry}/${params.size ? `?${params}` : ''}`} />;
  }
  return <div className="ddnz-home freight-editorial"><SEO title={meta.title} description={meta.desc} /><SourcingHomepageNav showFreightExecutor /><RegionContent region={region} locale={locale} /><Footer /><WhatsAppFloat /></div>;
}
