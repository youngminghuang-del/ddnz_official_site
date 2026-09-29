import { useLanguage } from '../../contexts/LanguageContext';
import { navigationPath } from '../../lib/productLanguageRouting';
import { aboutCopy } from './aboutCopy';
export default function SourcingTrust({onAbout = false}: {onAbout?: boolean}) {
 const {language}=useLanguage(); const c=aboutCopy[language];
 const paths=['/sourcing-services/supplier-search/','/sourcing-services/inspection-quality-control/','/sourcing-services/consolidation-export/'];
 return <section className="about-trust" dir={language==='ar'?'rtl':'ltr'} aria-labelledby="sourcing-trust-title">
  <div className="about-inner"><h2 id="sourcing-trust-title">{c.trust}</h2><p className="about-lead">{c.trustIntro}</p>
   <ol className="about-checks">{c.checks.map(([title,body],i)=><li key={title}><span aria-hidden="true">0{i+1}</span><div><h3><a href={navigationPath(paths[i],language)}>{title}</a></h3><p>{body}</p></div></li>)}</ol>
   <a className="about-text-link" href={navigationPath(onAbout?'/how-we-work/':'/about/',language)}>{onAbout?c.process:c.nav} <span aria-hidden="true">→</span></a>
  </div>
 </section>;
}
