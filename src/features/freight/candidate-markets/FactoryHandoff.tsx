import { ArrowRight } from 'lucide-react';
import copy from './factoryHandoffCopy.json';
import { candidatePrefix, type CandidateCountry, type CandidateLocale } from './model';

const servicePaths = {
 japan: '/sourcing-services/inspection-quality-control/',
 'south-korea': '/sourcing-services/consolidation-export/',
};

export function FactoryHandoff({country, locale}: {country: CandidateCountry; locale: CandidateLocale}) {
 if (country !== 'japan' && country !== 'south-korea') return null;
 const {title, steps, note, link} = copy[country][locale];
 return <section id="factory-handoff" className="candidate-factory-handoff" aria-labelledby="factory-handoff-title">
  <h3 id="factory-handoff-title">{title}</h3>
  <ol>{steps.map(([heading, body]) => <li key={heading}>
   <strong>{heading}</strong>
   <p>{body}</p>
  </li>)}</ol>
  <p>{note}</p>
  <a href={candidatePrefix(locale)+servicePaths[country]}>
   {link}<ArrowRight className="candidate-direction" size={16} aria-hidden="true"/>
  </a>
 </section>;
}
