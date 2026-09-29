import CompanyStrength, {strengthCopy} from '../features/company-identity/CompanyStrength';
import OfficeGallery from '../features/company-identity/OfficeGallery';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import { navigationPath } from '../lib/productLanguageRouting';
import { buildQuoteHref } from '../lib/quoteLinks';
import CompanyIdentity from '../features/company-identity/CompanyIdentity';
import SourcingTrust from '../features/company-identity/SourcingTrust';
import { aboutCopy, aboutLanguages, aboutMeta } from '../features/company-identity/aboutCopy';
export default function About() {
 const {language}=useLanguage(); const c=aboutCopy[language]; const strength=strengthCopy[language];const meta=aboutMeta(language);
 const href=(path:string)=>navigationPath(path,language);
 const url=`https://www.ddnzglobal.com${href('/about/')}`;
 const city={en:'Guangzhou',zh:'广州',es:'Guangzhou',fr:'Guangzhou',pt:'Guangzhou',ru:'Гуанчжоу',tr:'Guangzhou',ar:'قوانغتشو'}[language];
 const quote=buildQuoteHref({intent:'Product Sourcing',language,source:'about_company'});
 return <div className="about-page" dir={language==='ar'?'rtl':'ltr'}>
  <SEO title={meta.title} description={meta.desc} image={meta.image} contentLanguage={language} canonicalPath={href('/about/')} alternateUrls={aboutLanguages.map(lang=>({hrefLang:lang==='zh'?'zh-CN':lang,href:`https://www.ddnzglobal.com${navigationPath('/about/',lang)}`}))}/>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'AboutPage','@id':`${url}#page`,url,name:c.title,description:c.description,inLanguage:language==='zh'?'zh-CN':language,about:{'@type':'Organization',name:'DDNZ Global',url:'https://www.ddnzglobal.com/'}})}}/>
  <SourcingHomepageNav/>
  <main id="main-content">
   <section className="about-hero"><div className="about-inner about-hero-grid"><div><p className="about-eyebrow">{c.nav} · {city}</p><h1>{c.heading}</h1><p className="about-lead">{c.intro}</p><a className="about-button" href={quote}>{c.contact}<span aria-hidden="true">→</span></a></div>
    <figure><img src="/images/company/office/workspace-1600.webp" width="1290" height="1690" alt={strength[5]} fetchPriority="high"/><figcaption><strong>{strength[5]}</strong></figcaption></figure>
   </div></section>
   <CompanyStrength/>
   <section className="about-history"><div className="about-inner"><h2>{strength[1]}</h2><ol>{['1997','2005','2008',strength[2]].map((year,i)=><li key={year}><strong>{year}</strong><p>{i===0?strength[3]:i===3?strength[4]:c.years[i]}</p></li>)}</ol></div></section>
   <CompanyIdentity/>
   <OfficeGallery/>
   <section className="about-evidence"><div className="about-inner"><h2>{c.evidence}</h2><div className="about-field-visit"><img src="/images/operations/supplier-visit-speaker-redacted-v2.webp" width="1086" height="1448" alt={c.visit} loading="lazy"/><div><h3>{c.visit}</h3><p>{c.visitBody}</p></div></div><div className="about-evidence-grid">
    <figure><img src="/media/evidence/2026-08-14/mobile-accessories-container-loading-04-redacted.webp" width="960" height="1708" alt={c.loading} loading="lazy"/><figcaption><strong>{c.loading}</strong><span>{c.loadingBody}</span></figcaption></figure>
    <article><p className="about-eyebrow">GUANGZHOU → ABIDJAN</p><h3>{c.caseTitle}</h3><p>{c.caseBody}</p><a className="about-text-link" href={href('/sourcing-services/consolidation-export/')}>{c.caseLink} <span aria-hidden="true">→</span></a><div className="about-related"><a href={href('/sourcing-services/')}>{c.services}</a><a href={href('/services/sea-freight/')}>{c.freight}</a></div></article>
   </div></div></section>
   <SourcingTrust onAbout/>
   <section className="about-contact"><div className="about-inner"><h2>{c.final}</h2><a className="about-button" href={quote}>{c.contact}<span aria-hidden="true">→</span></a></div></section>
  </main><Footer/>
 </div>;
}
