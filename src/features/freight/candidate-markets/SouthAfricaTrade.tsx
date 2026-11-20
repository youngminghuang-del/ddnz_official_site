import {ArrowRight, Clock3, Container, Package, Plane, ReceiptText} from 'lucide-react';
import {quoteLinkProps} from '../../../lib/quoteLinkPolicy.mjs';
import copy from './southAfricaTradeCopy.json';
import countryCopy from './southAfricaCopy.json';
import {candidatePrefix, type CandidateLocale} from './model';

const mobile = '/images/product-showcase/mobile';
const kitchen = '/images/product-showcase/kitchen';
const marketPhotos = {
 phone: {src:`${mobile}/phone-case-colorway-proof-v1.webp`, width:1000, height:1000},
 kitchen: {src:`${kitchen}/kitchen-mixers-sanitized.webp`, width:1448, height:1086},
};

export function SouthAfricaTrade({locale}: {locale:CandidateLocale}) {
 const c = copy[locale];
 const {name, durban} = countryCopy[locale];
 const prefix = candidatePrefix(locale);
 const quote = (source: 'lcl_shipping' | 'international_country', mode: string, details: string) =>
  quoteLinkProps(`${prefix}/get-a-quote/?${new URLSearchParams({
   leadGoal: 'Freight Export',
   source,
   destinationText: `${name} · ${durban}`,
   notes: `${mode}\n${details}`,
  })}`);
 return <section id="local-trade" className="gulf-section freight-local-trade" aria-labelledby="local-trade-title">
  <h2 id="local-trade-title">{c.title}</h2>
  <div className="freight-local-market-grid">
   <article>
    <img {...marketPhotos.phone} alt={c.phoneAlt} loading="lazy" decoding="async"/>
    <h3>{c.phoneTitle}</h3>
    <p>{c.phone}</p>
    <a href={prefix+'/phone-cases/'}>{c.phoneLink} <ArrowRight size={16} className="candidate-direction" aria-hidden="true"/></a>
   </article>
   <article>
    <img {...marketPhotos.kitchen} alt={c.kitchenAlt} loading="lazy" decoding="async"/>
    <h3>{c.kitchenTitle}</h3>
    <p>{c.kitchen}</p>
    <a href={prefix+'/sourcing/commercial-kitchen-equipment-from-china/'}>{c.kitchenLink} <ArrowRight size={16} className="candidate-direction" aria-hidden="true"/></a>
   </article>
  </div>
  <h3 className="freight-local-trade-routes-title">{c.routesTitle}</h3>
  <div className="candidate-policy-grid">
   <article data-trade-mode="air">
    <div className="candidate-policy-label"><Plane size={20} aria-hidden="true"/><bdi>{locale === 'zh' ? '空运' : 'AIR'}</bdi></div>
    <h3>{c.airTitle}</h3><p>{c.airBody}</p>
    <a href="#air-freight">{c.quote} <ArrowRight size={16} className="candidate-direction" aria-hidden="true"/></a>
   </article>
   <article data-trade-mode="lcl">
    <div className="candidate-policy-label"><Package size={20} aria-hidden="true"/><bdi>LCL</bdi></div>
    <h3>{c.lclTitle}</h3><p>{c.lclBody}</p>
    <a {...quote('lcl_shipping','LCL',c.lclBody)}>{c.quote} <ArrowRight size={16} className="candidate-direction" aria-hidden="true"/></a>
   </article>
   <article data-trade-mode="fcl">
    <div className="candidate-policy-label"><Container size={20} aria-hidden="true"/><bdi>FCL</bdi></div>
    <h3>{c.fclTitle}</h3><p>{c.fclBody}</p>
    <a {...quote('international_country','FCL',c.fclBody)}>{c.quote} <ArrowRight size={16} className="candidate-direction" aria-hidden="true"/></a>
   </article>
  </div>
 </section>;
}


export function SouthAfricaAirFreight({locale}: {locale:CandidateLocale}) {
 const c = copy[locale];
 const {name, johannesburg} = countryCopy[locale];
 const prefix = candidatePrefix(locale);
 const quote = quoteLinkProps(`${prefix}/get-a-quote/?${new URLSearchParams({
  leadGoal: 'Freight Export',
  source: 'air_freight',
  destinationText: `${name} · ${johannesburg} (JNB)`,
  notes: `${c.airHeading}\n${c.air.rateText}`,
 })}`);
 return <section id="air-freight" className="gulf-section candidate-market-guide" aria-labelledby="south-africa-air-title">
  <div className="candidate-policy-label"><Plane size={20} aria-hidden="true"/><bdi>JNB</bdi></div>
  <h2 id="south-africa-air-title">{c.airHeading}</h2>
  <div className="freight-local-air-intro">
   <p>{c.airRoute}</p>
   <figure>
    <img src="/images/operations/warehouse-receiving-count-candid-v1.webp" width={1122} height={1402} alt={c.airAlt} loading="lazy" decoding="async"/>
    <figcaption>{c.airCaption}</figcaption>
   </figure>
  </div>
  <div className="candidate-handover">
   <article><Clock3 size={24} aria-hidden="true"/><h3>{c.air.timeTitle}</h3><p>{c.air.timeText}</p></article>
   <article><ReceiptText size={24} aria-hidden="true"/><h3>{c.air.rateTitle}</h3><p>{c.air.rateText}</p></article>
  </div>
  <div className="gulf-actions">
   <a className="gulf-cta" {...quote}>{c.air.quote} ↗</a>
   <a className="gulf-secondary" href={prefix+'/services/air-freight/'}>{c.air.service} ↗</a>
  </div>
 </section>;
}
