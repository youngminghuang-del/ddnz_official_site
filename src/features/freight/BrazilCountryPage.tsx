import {useLocation} from 'react-router-dom';
import SEO from '../../components/SEO';
import Footer from '../../components/Footer';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import BrazilCountryContent,{brazilCountryMetadata} from './BrazilCountryContent';
import './freight.css';
import './gulf-stories.css';
import './market-stories.css';
export default function BrazilCountryPage(){const locale=useLocation().pathname.startsWith('/zh-cn/')?'zh':'en';const meta=brazilCountryMetadata(locale);return <div className="ddnz-home"><SEO title={meta.title} description={meta.description}/><SourcingHomepageNav showFreightExecutor/><BrazilCountryContent locale={locale}/><Footer/></div>;}
