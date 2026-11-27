import {Fragment} from 'react';
import {PortMarketContent} from './PortMarketContent';
import {isPortMarketCountry} from './portMarkets';
import {ArrowRight, Ship, PackageCheck, Truck, FileText} from 'lucide-react';
import { MarketImportRules, MarketRateOverview, marketGuide, type MarketRateRow } from './MarketGuides';
import { getMarketDecisionCopy } from './marketDecisionCopy';
import scenarioCopy from './quoteScenarioCopy.json';
import { QuoteScenarios } from './QuoteScenarios';
import { RoutePhotoStory } from './RoutePhotoStory';
import tradeCopy from './southAfricaTradeCopy.json';
import { SouthAfricaAirFreight, SouthAfricaTrade } from './SouthAfricaTrade';
import { SouthAfricaFreightReference } from './SouthAfricaFreightReference';
import { FactoryHandoff } from './FactoryHandoff';
import FreightRatePreview from '../rates/FreightRatePreview';
import {CountryGatewayMap} from '../../../components/FreightRouteMap';
import {quoteLinkProps} from '../../../lib/quoteLinkPolicy.mjs';
import {candidateData,candidateQuoteDestination,candidateCopy,candidateInfo,candidateTrail,candidatePrefix,europeCandidateSlugs,pacificCandidateSlugs,isSeaCandidate,candidateSeaLabel,candidatePath,type CandidateCountry,type CandidateLocale} from './model';

export default function CandidateContent({country,locale,initialRates=[]}:{country:CandidateCountry;locale:CandidateLocale;initialRates?:readonly MarketRateRow[]}) {
 if (isPortMarketCountry(country)) return <PortMarketContent country={country} locale={locale}/>;
 const m=candidateData[country],c=candidateCopy(country,locale),p=candidateInfo(country,locale),prefix=candidatePrefix(locale);
 const quote=quoteLinkProps(`${prefix}/get-a-quote/?${new URLSearchParams({leadGoal:'Freight Export',source:'international_country',destinationText:candidateQuoteDestination(country,locale,p.name),notes:`${c.summary}\n${c.quoteNote}`})}`);
 const breadcrumb=candidateTrail(country,locale);
 const sea=isSeaCandidate(country);
 const decision = getMarketDecisionCopy(country, locale);
 const documents = decision?.documents ?? [
  [c.invoice, c.invoiceFields],
  [c.packing, c.packingFields],
  [c.transportDocument, c.transportFields],
 ];
 const isSouthAfrica = country === 'south-africa';
 const modes=[
  [c.fcl,c.fclBody],
  [c.lcl,c.lclBody],
  [c.air.replace('{airport}',m.airport),c.airBody],
 ];
 return <main id="main-content" className="country-editorial gulf-page candidate-freight" lang={p.language} dir={locale==='ar'?'rtl':'ltr'} data-country-cargo-planning={country}>
  <div className="gulf-wrap">
   <nav className="gulf-breadcrumb" aria-label={c.breadcrumb} data-freight-breadcrumb>{breadcrumb.map((b,n)=><Fragment key={b.path}>{n>0&&<span aria-hidden="true"> / </span>}{n===breadcrumb.length-1?<span aria-current="page">{b.name}</span>:<a href={b.path}>{b.name}</a>}</Fragment>)}</nav>
   <header className="gulf-hero">
    <div className="gulf-hero-copy"><p className="gulf-eyebrow">{(sea ? p.name : c.europe)} · {m.gateway.toUpperCase()}</p><h1>{c.title}</h1><p className="gulf-lede">{p.description}</p><p className="candidate-hero-detail">{c.summary}</p><div className="gulf-actions"><a className="gulf-cta" {...quote}>{c.ask} ↗</a><a className="gulf-secondary" href="#arrival">{c.arrivalLink} ↓</a></div></div>
    <div className="candidate-hero-map"><CountryGatewayMap country={country} locale={locale} destination={p.name}/></div>
   </header>
   <nav className="gulf-chapters" aria-label={c.onPage}><a href="#quotation">{decision?.quoteNav ?? scenarioCopy[locale].title}</a><a href="#cost-transit">{marketGuide[locale].costNav}</a><a href="#routes">{c.routes}</a>{isSouthAfrica && <><a href="#air-freight">{tradeCopy[locale].air.nav}</a><a href="#local-trade">{tradeCopy[locale].nav}</a></>}<a href="#import-rules">{marketGuide[locale].rulesNav}</a><a href="#preparation">{decision?.documentNav ?? c.documents}</a><a href="#arrival">{c.arrival}</a></nav>
   <QuoteScenarios country={country} locale={locale}/>
   {isSouthAfrica ? <SouthAfricaFreightReference locale={locale}/> : <FreightRatePreview context={country} locale={locale} renderOverview={payload => <MarketRateOverview country={country} locale={locale} rows={payload?.rows ?? initialRates}/>}/>}
   <section id="routes" className="gulf-section"><p className="gulf-eyebrow">01 / {c.routeChoice}</p><h2>{c.routeHeading}</h2><div className="candidate-mode-grid">{modes.map(([title,text],n)=><article key={title}><span className="candidate-number">0{n+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="candidate-route-note"><Ship size={25} aria-hidden="true"/><div><h3>{c.sailing}</h3><p>{c.routeText}</p><p>{c.sailingBody}</p></div></div><RoutePhotoStory country={country} locale={locale}/></section>
   {isSouthAfrica && <><SouthAfricaAirFreight locale={locale}/><SouthAfricaTrade locale={locale}/></>}
   <MarketImportRules country={country} locale={locale}/>
   <section id="preparation" className="gulf-section"><p className="gulf-eyebrow">03 / {c.documentCheck}</p><h2>{decision?.documentHeading ?? c.documents}</h2><div className="candidate-document-flow" role="group" aria-label={decision?.documentNav ?? c.documentWorkflow}>{documents.map(([a,b],n)=><article key={a}><div><FileText size={24}/><span>0{n+1}</span></div><h3>{a}</h3><p>{b}</p></article>)}</div><p>{decision?.documentText ?? c.documentText}</p>{!sea&&<a className="candidate-document-link" href={`${prefix}/shipping-from-china-to-europe/#europe-documents`}>
    <span className="candidate-document-thumbnail" dir="ltr" aria-hidden="true">
     {['INV', 'PL', 'B/L'].map(label => <span key={label}><b>{label}</b><i/></span>)}
    </span>
    <span><strong>{c.documentLink}</strong><small>{c.documentLinkBody}</small></span>
    <ArrowRight className="candidate-direction" size={20} aria-hidden="true"/>
   </a>}
    <FactoryHandoff country={country} locale={locale}/>
   </section>
   <section id="arrival" className="gulf-section"><p className="gulf-eyebrow">04 / {c.arrivalSection}</p><h2>{c.gatewayHeading}</h2><p>{c.gatewayText}</p><div className="candidate-handover"><article><PackageCheck size={28}/><h3>{c.release}</h3><p>{c.releaseBody}</p></article><article><Truck size={28}/><h3>{c.addressDelivery}</h3><p>{c.inlandText}</p></article></div></section>
   {'freightQuestion' in c && c.freightQuestion && <section className="gulf-section candidate-market-guide">
    <details className="candidate-scenario-details">
     <summary>{c.freightQuestion[0]}</summary>
     <p>{c.freightQuestion[1]}</p>
    </details>
   </section>}
   <section className="gulf-section candidate-final"><p className="gulf-eyebrow">05 / {c.shipment}</p><h2>{c.shipmentHeading}</h2><p>{c.shipmentBody}</p><p data-freight-provider>{c.providerBody}</p><a className="gulf-cta" {...quote}>{c.ask} ↗</a><div className="candidate-related"><a href={sea?`${prefix}/services/sea-freight/`:`${prefix}/shipping-from-china-to-europe/`}>{sea?candidateSeaLabel(locale):c.europeLink} ↗</a><a href={`${prefix}/services/lcl-shipping-from-china/`}>{c.lclLink} ↗</a><a href={`${prefix}/sourcing-services/consolidation-export/`}>{c.consolidationLink} ↗</a>{!isSouthAfrica && (sea?pacificCandidateSlugs:europeCandidateSlugs).filter(s=>s!==country).map(s=><a key={s} href={candidatePath(s,locale)}>{candidateInfo(s,locale).name} ↗</a>)}</div></section>
  </div>
 </main>;
}
