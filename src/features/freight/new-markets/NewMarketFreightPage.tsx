import {useLocation} from 'react-router-dom';
import SEO from '../../../components/SEO';
import SourcingHomepageNav from '../../../components/SourcingHomepageNav';
import Footer from '../../../components/Footer';
import {newMarketMetadata,newMarketAlternates,newMarketLocales,type NewMarket,type NewMarketLocale} from './model';
import NewMarketContent from './NewMarketContent';
import '../freight.css';import '../market-preparation.css';
import '../gulf-stories.css';
export default function NewMarketFreightPage(){const parts=useLocation().pathname.split('/').filter(Boolean),locale=(parts.length===1?'en':parts[0]==='zh-cn'?'zh':parts[0]) as NewMarketLocale,country=parts.at(-1)!.replace('shipping-from-china-to-','') as NewMarket,meta=newMarketMetadata(country,locale);return <div className="ddnz-home" dir={locale==='ar'?'rtl':'ltr'}><SEO title={meta.title+' | DDNZ'} description={meta.description} contentLanguage={locale} canonicalPath={meta.path} alternateUrls={newMarketAlternates(country)}/><SourcingHomepageNav showFreightExecutor supportedLanguages={[...newMarketLocales]}/><NewMarketContent country={country} locale={locale}/><Footer/></div>;}
