import {Building2, CheckSquare2, ClipboardCheck, ClipboardList, FileCheck2, FileSearch, FileText, MapPin, Ruler, ScanLine, Truck, Warehouse} from 'lucide-react';
import {LatinDoorRouteMap} from '../../components/FreightRouteMap';
import {FreightChapters} from './GulfChapters';
import {EcuadorProcessPhoto, LatinDoorFaq} from './LatinDoorVisuals';
import visualCopy from './latinDoorVisualCopy.json';
import gulfUi from './gulfUi.json';
import guide from './candidate-markets/marketGuideCopy.json';
import shared from './candidate-markets/sharedCopy.json';
import CountryTransitPlanner from './CountryTransitPlanner';
import MarketBidiText from './MarketBidiText';
import {breadcrumbLabel} from './freightPageSchema';
import {ecuadorCopy,type EcuadorLocale} from './ecuadorCopy';
import {LatinDoorClearance, LatinDoorRates, LatinDoorScenarios, LatinFactoryHandoff, latinDoorQuote} from './LatinDoorSections';
import {latinDoorCopy, latinDoorInfo, latinDoorMarkets, latinDoorTrail, type LatinDoorMarket} from './latinDoorMarket';
import scenarioCopy from './candidate-markets/quoteScenarioCopy.json';
import type {MarketRateRow} from './candidate-markets/MarketGuides';
import {localizedPacificPort} from './locales/index.mjs';

const stepIcons=[ClipboardList,Warehouse,FileCheck2,Truck];
const documentIcons=[FileSearch,Building2,ClipboardCheck];
const checklistIcons=[Building2,ScanLine,Ruler,FileText,MapPin,CheckSquare2];

export default function EcuadorContent({locale,market='ecuador',initialRates}:{
  locale:EcuadorLocale;market?:LatinDoorMarket;initialRates?:readonly MarketRateRow[];
}){
 const c=ecuadorCopy[locale], page=latinDoorCopy(market,locale), p=latinDoorInfo(market,locale), q=scenarioCopy[locale];
 const trail=latinDoorTrail(market,locale);
 const port=localizedPacificPort(latinDoorMarkets[market].port,locale);
 const isEcuador=market==='ecuador';
 const visual=visualCopy[locale], ui=gulfUi[locale];
 const chapters=[
  {id:'quotation',label:q.title},{id:'cost-transit',label:guide[locale].costNav},
  {id:'import-rules',label:q.clearance},{id:'factory-handoff',label:isEcuador?ui.consolidation:shared[locale].documents},
 ];
 const ports=(isEcuador?['GUAYAQUIL','POSORJA']:['CAUCEDO']).map(code=>localizedPacificPort(code,locale));
 return <main id="main-content" className={`country-editorial market-preparation latin-door-page${isEcuador?' ecuador-page':''}`} lang={p.language} data-country-cargo-planning={isEcuador?'ecuador-preparation':market} dir={locale==='ar'?'rtl':'ltr'}>
  <div className="mp-wrap">
   <nav className="mp-breadcrumb" aria-label={breadcrumbLabel(locale)} data-freight-breadcrumb>
    {trail.slice(0,-1).map(item=><span key={item.path}><a href={item.path}>{item.name}</a><span aria-hidden="true"> / </span></span>)}<span aria-current="page">{p.name}</span>
   </nav>
   <header className="mp-hero latin-door-hero">
    <div>
     <p className="mp-kicker">{c.region} · <bdi>{port}</bdi></p><h1>{page.title}</h1><p className="mp-lede">{page.intro}</p>
     <a className="mp-primary" {...latinDoorQuote({market,locale},q.door,page.door)}>{q.doorQuote} <span aria-hidden="true">↗</span></a>
    </div>
    <aside className="latin-door-gateway" aria-label={page.routes}>
     <LatinDoorRouteMap market={market} labels={{china:shared[locale].china,country:p.name,ports,city:isEcuador?visual.quito:visual.santoDomingo,caption:visual.mapCaption}}/>
     <div className="latin-gateway-note">
     <h2>{page.routes}</h2><p>{page.routeNote}</p>
     <a className="candidate-scenario-detail" href="#cost-transit">{q.rateLink} <span aria-hidden="true">↓</span></a>
     </div>
    </aside>
   </header>
   <p className="mp-role" data-freight-provider><strong>{p.provider}</strong>{isEcuador&&<> · {c.roles}</>}</p>
   <FreightChapters items={chapters} ariaLabel={ui.chaptersAria} reading={ui.reading}/>
   <LatinDoorScenarios market={market} locale={locale}/>
   {isEcuador&&<CountryTransitPlanner country="ecuador" locale={locale}/>}
   <LatinDoorRates market={market} locale={locale} initialRates={initialRates}/>
   <LatinDoorClearance market={market} locale={locale}/>
   <LatinFactoryHandoff market={market} locale={locale}/>
   {isEcuador&&<>
 <section className="mp-section latin-door-consolidation">
  <div><h2>{c.heading}</h2><p>{c.intro}</p></div>
  <div>
   <EcuadorProcessPhoto locale={locale} kind="consolidation"/>
   <p className="latin-consolidation-note">{c.diagram} · {c.hubNote}</p>
  </div>
 </section>
 <section className="mp-section" id="dispatch-steps"><h2>{c.sequence}</h2>
  <ol className="mp-steps">{c.steps.map(([heading,body],i)=>{
   const Icon=stepIcons[i];
   return <li key={heading}><span className="latin-small-visual"><Icon aria-hidden="true" size={24}/></span><h3>{heading}</h3><p>{locale==='ar'?<MarketBidiText text={body}/>:body}</p></li>;
  })}</ol>
 </section>
 <section className="mp-section" id="export-documents"><h2>{c.docs}</h2>
  <p className="mp-lede">{locale==='ar'?<MarketBidiText text={c.docIntro}/>:c.docIntro}</p>
  <div className="mp-cards">{c.docCards.map(([heading,body],i)=>{
   const Icon=documentIcons[i];
   return <article key={heading}><span className="latin-small-visual"><Icon aria-hidden="true" size={24}/>{i===0&&<bdi>CO</bdi>}</span><h3>{heading}</h3><p>{locale==='ar'?<MarketBidiText text={body}/>:body}</p></article>;
  })}</div>
 </section>
 <section className="mp-section"><h2>{c.ports}</h2><p className="mp-lede">{locale==='ar'?<MarketBidiText text={c.portIntro}/>:c.portIntro}</p><div className="mp-port-list"><article><h3>{locale==='ar'?<MarketBidiText text={c.portA}/>:c.portA}</h3><a href="https://www.ictsi.com/our-offering/our-terminals/contecon-guayaquil-sa" rel="noreferrer" target="_blank">ICTSI · Contecon Guayaquil <span aria-hidden="true">{locale==='ar'?'↖':'↗'}</span></a></article><article><h3>{locale==='ar'?<MarketBidiText text={c.portB}/>:c.portB}</h3><a href="https://www.dpworld.com/en/news/dp-world-inaugurates-posorja-terminal-expansion-boosting-ecuadors-global-trade-capacity" rel="noreferrer" target="_blank">DP World · Posorja <span aria-hidden="true">{locale==='ar'?'↖':'↗'}</span></a></article></div><p>{locale==='ar'?<MarketBidiText text={c.portNote}/>:c.portNote}</p></section>
 <section className="mp-section" id="quote-checklist"><h2>{c.brief}</h2>
  <ul className="mp-checks">{c.fields.map((field,i)=>{
   const Icon=checklistIcons[i];
   return <li key={field}><span className="latin-small-visual"><Icon aria-hidden="true" size={22}/></span><span>{field}</span></li>;
  })}</ul>
 </section>
 <section className="mp-section mp-sources"><h2>{c.sources}</h2><a href="https://www.aduana.gob.ec/servicio-al-ciudadano/para-importar/" target="_blank" rel="noreferrer">{locale==='ar'?<MarketBidiText text={c.importGuide}/>:c.importGuide} <span aria-hidden="true">{locale==='ar'?'↖':'↗'}</span></a><a href="https://www.aduana.gob.ec/gaceta-boletin/informacion-relevante-sobre-aplicacion-de-certificado-de-origen-china/" target="_blank" rel="noreferrer">{locale==='ar'?<MarketBidiText text={c.fta}/>:c.fta} <span aria-hidden="true">{locale==='ar'?'↖':'↗'}</span></a><a href="https://co.ccpit.org/front/process" target="_blank" rel="noreferrer">{locale==='ar'?<MarketBidiText text={c.origin}/>:c.origin} <span aria-hidden="true">{locale==='ar'?'↖':'↗'}</span></a></section>
   </>}
   <LatinDoorFaq market={market} locale={locale}/>
  </div>
 </main>;
}
