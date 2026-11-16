import {useLocation} from 'react-router-dom';
import SEO from '../../../components/SEO';
import SourcingHomepageNav from '../../../components/SourcingHomepageNav';
import Footer from '../../../components/Footer';
import CandidateContent from './CandidateContent';
import {candidateInfo,candidateLanguage,candidateLocale,candidateLocales,candidatePath,type CandidateCountry} from './model';
import '../freight.css';
import '../gulf-stories.css';
import '../country-editorial.css';
import './candidate.css';
export default function CandidatePage() {
 const {pathname}=useLocation(),locale=candidateLocale(pathname.split('/')[1]) ?? 'en',country=pathname.split('/').filter(Boolean).at(-1)!.replace('shipping-from-china-to-','') as CandidateCountry,p=candidateInfo(country,locale);
 return <div className="ddnz-home"><SEO title={p.title} description={p.description} contentLanguage={locale} canonicalPath={candidatePath(country,locale)} alternateUrls={candidateLocales.map(l=>({hrefLang:candidateLanguage(l),href:candidateInfo(country,l).url}))}/><SourcingHomepageNav showFreightExecutor supportedLanguages={candidateLocales}/><CandidateContent country={country} locale={locale}/><Footer/></div>;
}
