import {Clock3, Ship} from 'lucide-react';
import copy from './southAfricaCopy.json';
import type {CandidateLocale} from './model';

const sailingSource = 'https://www.cma-cgm.com/ebusiness/schedules/line-services/schedules/SHAKA2?Direction=Next&LastPageIndex=1';
const nanshaSource = 'https://www.jhz56.com/en/lanes/nansha-to-durban.html';

export function SouthAfricaFreightReference({locale}: {locale: CandidateLocale}) {
 const c = copy[locale];
 return <section id="cost-transit" className="gulf-section candidate-market-guide" aria-labelledby="cost-transit-title">
  <h2 id="cost-transit-title">{c.ratesTitle}</h2>
  <div className="candidate-policy-grid">
   <article data-za-reference="shekou">
    <div className="candidate-policy-label"><Clock3 size={20} aria-hidden="true"/><bdi>SHAKA2</bdi></div>
    <h3>{c.sailingLabel}</h3>
    <p><strong><bdi>29</bdi> {c.days}</strong></p>
    <p>{c.sailingNote}</p>
    <a href={sailingSource}><bdi>CMA CGM</bdi> ↗</a>
   </article>
   <article data-za-reference="shenzhen">
    <div className="candidate-policy-label"><Ship size={20} aria-hidden="true"/><bdi>Seabay · CMA CGM</bdi></div>
    <h3>{c.shenzhenLabel}</h3>
    <dl className="candidate-za-prices">
     <div><dt><bdi>20GP</bdi></dt><dd><bdi>USD 6,199</bdi></dd></div>
     <div><dt><bdi>40GP / 40HQ</bdi></dt><dd><bdi>USD 8,649</bdi></dd></div>
    </dl>
    <p>{c.shenzhenNote} {c.expiry} <bdi><time dateTime="2026-11-21">2026-11-21</time></bdi>.</p>
   </article>
   <article data-za-reference="nansha">
    <div className="candidate-policy-label"><Ship size={20} aria-hidden="true"/><bdi>40HQ</bdi></div>
    <h3>{c.nanshaLabel}</h3>
    <p><strong><bdi>USD 6,200–6,650</bdi></strong></p>
    <p>{c.nanshaNote} {c.snapshot} <bdi><time dateTime="2026-11-19">2026-11-19</time></bdi>.</p>
    <a href={nanshaSource}><bdi>JHZ</bdi> ↗</a>
   </article>
  </div>
  <p>{c.scope}</p>
 </section>;
}
