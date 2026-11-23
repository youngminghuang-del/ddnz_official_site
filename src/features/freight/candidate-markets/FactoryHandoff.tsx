import { ArrowRight } from 'lucide-react';
import southAfricaCopy from './southAfricaCopy.json';
import copy from './factoryHandoffCopy.json';
import { candidatePrefix, type StandardCandidateCountry, type CandidateLocale } from './model';

const servicePaths = {
 japan: '/sourcing-services/inspection-quality-control/',
 'south-korea': '/sourcing-services/consolidation-export/',
 vietnam: '/services/sea-freight/',
 malaysia: '/services/ddp-shipping-from-china/#delivery-scope',
 singapore: '/sourcing-services/consolidation-export/',
 thailand: '/services/sea-freight/',
 indonesia: '/sourcing-services/inspection-quality-control/',
 philippines: '/sourcing-services/consolidation-export/',
};

function hasFactoryHandoff(country: StandardCandidateCountry): country is keyof typeof servicePaths {
 return Object.prototype.hasOwnProperty.call(servicePaths, country);
}

export function FactoryHandoff({country, locale}: {country: StandardCandidateCountry; locale: CandidateLocale}) {
 if (country === 'south-africa') {
  const c = southAfricaCopy[locale];
  return <section id="factory-handoff" className="candidate-factory-handoff" aria-labelledby="factory-handoff-title">
   <h3 id="factory-handoff-title">{c.factoryTitle}</h3>
   <p>{c.factoryText}</p>
   <a href={candidatePrefix(locale)+'/sourcing-services/consolidation-export/'}>
    {c.factoryLink}<ArrowRight className="candidate-direction" size={16} aria-hidden="true"/>
   </a>
  </section>;
 }
 if (!hasFactoryHandoff(country)) return null;
 const content = copy[country][locale];
 const {title, steps, link} = content;
 return <section id="factory-handoff" className="candidate-factory-handoff" aria-labelledby="factory-handoff-title">
  <h3 id="factory-handoff-title">{title}</h3>
  <ol>{steps.map(([heading, body]) => <li key={heading}>
   <strong>{heading}</strong>
   <p>{body}</p>
  </li>)}</ol>
  {'note' in content && <p>{content.note}</p>}
  <a href={candidatePrefix(locale)+servicePaths[country]}>
   {link}<ArrowRight className="candidate-direction" size={16} aria-hidden="true"/>
  </a>
 </section>;
}
