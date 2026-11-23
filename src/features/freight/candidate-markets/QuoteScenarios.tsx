import { ArrowRight, ClipboardList, Ship, Truck } from 'lucide-react';
import { quoteLinkProps } from '../../../lib/quoteLinkPolicy.mjs';
import { candidateCopy, candidateQuoteDestination, candidatePrefix, isSeaCandidate, seaCountryCopy, seaMarketBadges, type StandardCandidateCountry, type CandidateLocale } from './model';
import scenarioCopy from './quoteScenarioCopy.json';

const subjects = {
 'united-kingdom': { tag: 'GB / XI EORI', door: 'ukDoor', steps: ['ukStart', 'ukDeclare', 'ukRelease'] },
 france: { tag: 'EORI · TVA / CA3', door: 'frDoor', steps: ['frStart', 'frDeclare', 'frRelease'] },
 netherlands: { tag: 'T1 · Article 23', door: 'nlDoor', steps: ['nlStart', 'nlDeclare', 'nlRelease'] },
} as const;

export function QuoteScenarios({country,locale}: {country:StandardCandidateCountry; locale:CandidateLocale}) {
 const c = scenarioCopy[locale];
 const page = candidateCopy(country, locale);
 const sea = isSeaCandidate(country);
 const guidance = sea ? seaCountryCopy(country, locale) : null;
 const subject = sea ? null : subjects[country];
 const clearanceSteps = guidance?.steps ?? subject!.steps.map(step => c[step]);
 const doorScope = guidance?.door ?? c[subject!.door];
 const tag = sea ? seaMarketBadges[country][3] : subject!.tag;
 const doorRows = [
  [page.origin, page.originBody],
  [page.mainLeg, page.mainLegBody],
  [c.clearance, c.doorTaxes],
  [page.destination, doorScope],
 ];
 const quote = (scenario: string, notes: string, scope: 'port' | 'door' = 'port') => quoteLinkProps(
  `${candidatePrefix(locale)}/get-a-quote/?${new URLSearchParams({
   leadGoal: 'Freight Export',
   source: 'international_country',
   destinationText: candidateQuoteDestination(country,locale,page.name,scope),
   notes: `${scenario}\n${notes}`,
  })}`);
 return <section id="quotation" className="gulf-section candidate-scenarios" aria-labelledby="quote-scenario-title">
  <h2 id="quote-scenario-title">{c.title}</h2>
  <div className="candidate-scenario-grid">
   <article data-quote-scenario="port">
    <Ship size={23} aria-hidden="true"/>
    <h3>{c.port}</h3>
    <p>{c.portIntro}</p>
    <a className="candidate-scenario-detail" href="#cost-transit">{c.rateLink}</a>
    <a className="candidate-scenario-cta" {...quote(c.port,c.portIntro)}>{c.portQuote}<ArrowRight className="candidate-direction" size={16} aria-hidden="true"/></a>
   </article>
   <article data-quote-scenario="door">
    <Truck size={23} aria-hidden="true"/>
    <h3>{c.door}</h3>
    <p>{c.doorIntro}</p>
    <details>
     <summary>{c.doorDetails}</summary>
     <dl>{doorRows.map(([label,body]) => <div key={label}><dt>{label}</dt><dd>{body}</dd></div>)}</dl>
     <p>{page.quoteBoundary}</p>
    </details>
    <a className="candidate-scenario-cta" {...quote(c.door,doorScope,'door')}>{c.doorQuote}<ArrowRight className="candidate-direction" size={16} aria-hidden="true"/></a>
   </article>
   <article data-quote-scenario="clearance">
    <ClipboardList size={23} aria-hidden="true"/>
    <h3>{c.clearance}</h3>
    <p className="candidate-scenario-tag"><bdi>{tag}</bdi></p>
    <details>
     <summary>{c.clearanceDetails}</summary>
     <ol>{clearanceSteps.map(step => <li key={step}>{step}</li>)}</ol>
    </details>
    <a className="candidate-scenario-cta" {...quote(c.clearance,clearanceSteps[0])}>{c.clearanceQuote}<ArrowRight className="candidate-direction" size={16} aria-hidden="true"/></a>
   </article>
  </div>
 </section>;
}
