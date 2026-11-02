import {useLocation} from 'react-router-dom';
import SEO from '../../components/SEO';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import EcuadorContent from './EcuadorContent';
import {ecuadorCopy,ecuadorLocales,ecuadorPrefix,ecuadorPath,ecuadorAlternates,type EcuadorLocale} from './ecuadorCopy';
import './freight.css';
import './market-preparation.css';
export default function EcuadorFreightPage(){
 const {pathname}=useLocation();const locale:EcuadorLocale=(pathname.split('/').filter(Boolean).length===1?'en':pathname.split('/')[1]==='zh-cn'?'zh':pathname.split('/')[1]) as EcuadorLocale;const c=ecuadorCopy[locale],prefix=ecuadorPrefix(locale);
 return <div className="ddnz-home" dir={locale==='ar'?'rtl':'ltr'}><SEO title={`${c.title} | DDNZ`} description={c.description} contentLanguage={locale} canonicalPath={prefix+ecuadorPath} alternateUrls={ecuadorAlternates()}/><SourcingHomepageNav showFreightExecutor supportedLanguages={ecuadorLocales}/><EcuadorContent locale={locale}/><Footer/></div>;
}
