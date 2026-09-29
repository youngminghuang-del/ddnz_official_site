import { useLanguage } from '../../contexts/LanguageContext';
import { navigationPath } from '../../lib/productLanguageRouting';
import { locationCopy } from './copy';
import './sourcing-locations.css';

export default function SourcingLocations() {
  const { language } = useLanguage();
  const c = locationCopy[language];
  const paths = ['/sourcing-services/supplier-search/', '/sourcing-services/inspection-quality-control/', '/sourcing-services/consolidation-export/'];
  return <section id="sourcing-locations" className="sourcing-locations" dir={language === 'ar' ? 'rtl' : 'ltr'} aria-labelledby="sourcing-locations-title">
    <div className="sourcing-locations__story">
      <p className="sourcing-locations__eyebrow">{c.eyebrow}</p>
      <h2 id="sourcing-locations-title">{c.title}</h2>
      <p className="sourcing-locations__intro">{c.intro}</p>
      {c.paragraphs.map(text => <p key={text}>{text}</p>)}
    </div>
    <ul className="sourcing-locations__links">
      {c.links.map(([title, body], i) => <li key={title}>
        <a href={navigationPath(paths[i], language)}><span>{title}</span><span aria-hidden="true">{language === 'ar' ? '←' : '→'}</span></a>
        <p>{body}</p>
      </li>)}
    </ul>
  </section>;
}
