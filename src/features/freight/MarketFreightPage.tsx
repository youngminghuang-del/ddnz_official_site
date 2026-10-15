import { useLocation } from 'react-router-dom';
import SEO from '../../components/SEO';
import Footer from '../../components/Footer';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import {MarketFreightContent, marketMetadata, type MarketCountry} from './MarketFreightContent';
import {gulfLocaleFromPath} from './gulfLocale';
import './freight.css';
import './gulf-stories.css';
import './market-stories.css';

export default function MarketFreightPage() {
  const {pathname}=useLocation();
  const country: MarketCountry=pathname.includes('to-peru')?'peru':'nigeria';
  const locale=gulfLocaleFromPath(pathname);
  const data=marketMetadata(country,locale);
  return <div className="ddnz-home"><SEO title={data.title} description={data.desc}/><SourcingHomepageNav showFreightExecutor/><MarketFreightContent country={country} locale={locale}/><Footer/></div>;
}
