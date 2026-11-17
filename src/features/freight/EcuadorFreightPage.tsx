import {useLocation} from 'react-router-dom';
import SEO from '../../components/SEO';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import EcuadorContent from './EcuadorContent';
import {ecuadorLocales,type EcuadorLocale} from './ecuadorCopy';
import {isLatinDoorMarket,latinDoorAlternates,latinDoorInfo,latinDoorPath} from './latinDoorMarket';
import './freight.css';
import './gulf-stories.css';
import './market-preparation.css';
import './candidate-markets/candidate.css';

export default function EcuadorFreightPage(){
 const {pathname}=useLocation();
 const segments=pathname.split('/').filter(Boolean);
 const locale=(segments.length===1?'en':segments[0]==='zh-cn'?'zh':segments[0]) as EcuadorLocale;
 const market=segments.at(-1)!.replace('shipping-from-china-to-','');
 if(!isLatinDoorMarket(market)) return null;
 const page=latinDoorInfo(market,locale);
 return <div className="ddnz-home" dir={locale==='ar'?'rtl':'ltr'}>
  <SEO title={page.title} description={page.description} contentLanguage={locale} canonicalPath={latinDoorPath(market,locale)} alternateUrls={latinDoorAlternates(market)}/>
  <SourcingHomepageNav showFreightExecutor supportedLanguages={ecuadorLocales}/>
  <EcuadorContent locale={locale} market={market}/>
  <Footer/>
 </div>;
}
