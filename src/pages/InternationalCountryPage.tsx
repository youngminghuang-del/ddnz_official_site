import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import InternationalCountryContent, { internationalCountryMeta } from '../features/freight/InternationalCountryContent';
export default function InternationalCountryPage(){
 const {pathname}=useLocation();
 // Route content must not read the previous locale while LanguageRouteSync catches up.
 const locale: 'pt' | 'tr' = pathname.startsWith('/tr/') ? 'tr' : 'pt';
 const country=pathname.split('/').filter(Boolean).at(-1)!.replace('shipping-from-china-to-','');const meta=internationalCountryMeta(country,locale);
 return <div className="ddnz-home"><SEO title={meta.title} description={meta.desc} canonicalPath={pathname}/><SourcingHomepageNav showFreightExecutor/><InternationalCountryContent country={country} locale={locale}/><Footer/></div>;
}
