import {ArrowRight, Box, ClipboardList, Ship, Truck} from 'lucide-react';
import {quoteLinkProps} from '../../lib/quoteLinkPolicy.mjs';
import {localizedPacificPort} from './locales/index.mjs';
import {marketGuide, type MarketRateRow} from './candidate-markets/MarketGuides';
import sharedCopy from './candidate-markets/sharedCopy.json';
import ecuadorImportCopy from './ecuadorImportCopy.json';
import scenarioCopy from './candidate-markets/quoteScenarioCopy.json';
import FreightRatePreview from './rates/FreightRatePreview';
import {latinDoorInfo, latinDoorCopy, latinDoorMarkets, type LatinDoorMarket} from './latinDoorMarket';
import {EcuadorProcessPhoto} from './LatinDoorVisuals';
import type {EcuadorLocale} from './ecuadorCopy';

type Props = {market:LatinDoorMarket;locale:EcuadorLocale};
const containers=['20GP','40GP','40HQ'] as const;

export function latinDoorQuote({market,locale}:Props, scenario:string, notes:string, hasPort=false) {
  const {prefix,name}=latinDoorInfo(market,locale);
  const port=localizedPacificPort(latinDoorMarkets[market].port,locale);
  return quoteLinkProps(`${prefix}/get-a-quote/?${new URLSearchParams({
    leadGoal:'Freight Export', source:'international_country', destinationText:hasPort?`${name} · ${port}`:name, notes:`${scenario}\n${notes}`,
  })}`);
}

export function LatinDoorScenarios({market,locale}:Props) {
  const c=latinDoorCopy(market,locale), q=scenarioCopy[locale], shared=sharedCopy[locale];
  const costs=[[shared.origin,shared.originBody],[shared.mainLeg,shared.mainLegBody],[q.clearance,q.doorTaxes],[shared.destination,c.clearanceRelease]];
  return <section id="quotation" tabIndex={-1} className="mp-section candidate-scenarios latin-door-scenarios">
    <h2>{q.title}</h2>
    <div className="candidate-scenario-grid">
      <article data-quote-scenario="door">
        <Truck size={23} aria-hidden="true"/><h3>{q.door}</h3><p>{c.door}</p>
        <details><summary>{q.doorDetails}</summary><dl>{costs.map(([label,text])=><div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl><p>{shared.quoteBoundary}</p></details>
        <a className="candidate-scenario-cta" {...latinDoorQuote({market,locale},q.door,c.door)}>{q.doorQuote}<ArrowRight className="candidate-direction" size={16} aria-hidden="true"/></a>
      </article>
      <article data-quote-scenario="port">
        <Ship size={23} aria-hidden="true"/><h3>{q.port}</h3><p>{q.portIntro}</p>
        <a className="candidate-scenario-detail" href="#cost-transit">{q.rateLink}</a>
        <a className="candidate-scenario-cta" {...latinDoorQuote({market,locale},q.port,q.portIntro,true)}>{q.portQuote}<ArrowRight className="candidate-direction" size={16} aria-hidden="true"/></a>
      </article>
      <article data-quote-scenario="clearance">
        <ClipboardList size={23} aria-hidden="true"/><h3>{q.clearance}</h3><p className="candidate-scenario-tag"><bdi>{latinDoorMarkets[market].clearance}</bdi></p>
        <a className="candidate-scenario-detail" href="#import-rules">{q.clearanceDetails}</a>
        <a className="candidate-scenario-cta" {...latinDoorQuote({market,locale},q.clearance,c.clearanceStart)}>{q.clearanceQuote}<ArrowRight className="candidate-direction" size={16} aria-hidden="true"/></a>
      </article>
    </div>
  </section>;
}

export function LatinDoorRates({market,locale,initialRates=[]}:Props & {initialRates?:readonly MarketRateRow[]}) {
  const g=marketGuide[locale];
  const port=localizedPacificPort(latinDoorMarkets[market].port,locale);
  const numbers=new Intl.NumberFormat(locale==='zh'?'zh-CN':locale,{maximumFractionDigits:2});
  const range=(values:(number|null)[])=>{
    const known=values.filter((value):value is number=>value!==null&&value>0);
    if (!known.length) return '—';
    const min=numbers.format(Math.min(...known)), max=numbers.format(Math.max(...known));
    return min===max?min:`${min}–${max}`;
  };
  return <FreightRatePreview context={market} locale={locale} renderOverview={payload=>{
    const rows=(payload?.rows??initialRates).filter(row=>row.country===market);
    return <section className="mp-section latin-door-rates" id="cost-transit" tabIndex={-1}>
      <h2>{g.costTitle.replace('{port}',port)}</h2>
      {rows.length>0&&<div className="candidate-rate-summary">
        <div className="candidate-rate-transit"><p>{g.sailing}</p><strong><bdi>{range(rows.map(row=>row.days))}</bdi> <small>{g.days}</small></strong><span>{numbers.format(rows.length)} {g.routes}</span></div>
        <table><caption>{g.main}</caption><tbody>{containers.map(container=><tr key={container}><th scope="row"><bdi>{container}</bdi></th><td><bdi>{range(rows.map(row=>row.prices[container]))}</bdi></td></tr>)}</tbody></table>
      </div>}
      <p>{g.scope}</p>
    </section>;
  }}/>;
}

export function LatinDoorClearance({market,locale}:Props) {
  const c=latinDoorCopy(market,locale), g=marketGuide[locale], d=latinDoorMarkets[market];
  return <section id="import-rules" tabIndex={-1} className="mp-section">
    <p className="mp-kicker"><bdi>{d.clearance}</bdi></p><h2>{g.rulesTitle}</h2>
    <ol className="latin-door-steps">{[c.clearanceStart,c.clearanceDeclare,c.clearanceRelease].map(step=><li key={step}>{step}</li>)}</ol>
    {market==='ecuador'&&<div id="ecuador-import-start">
      <h3>{ecuadorImportCopy[locale].title}</h3>
      <div className="mp-cards">{ecuadorImportCopy[locale].cards.map(([title,body])=><article key={title}><h4>{title}</h4><p>{body}</p></article>)}</div>
      <p>{ecuadorImportCopy[locale].partner}</p>
    </div>}
    <a href={d.authorityUrl} target="_blank" rel="noreferrer">{d.authority} <span aria-hidden="true">↗</span></a>
    {market==='dominican-republic'&&<a className="latin-door-source" href="https://vucerd.gob.do/" target="_blank" rel="noreferrer">VUCE-RD <span aria-hidden="true">↗</span></a>}
  </section>;
}

export function LatinFactoryHandoff({market,locale}:Props) {
  const c=latinDoorCopy(market,locale), {prefix}=latinDoorInfo(market,locale);
  return <section className="mp-section latin-door-factory" id="factory-handoff" tabIndex={-1}>
    <div>
      <h2>{c.factory}</h2><p>{c.factoryBody}</p><p>{c.factoryDocs}</p>
      <a className="candidate-scenario-detail" href={prefix+latinDoorMarkets[market].service}>{c.service}<ArrowRight className="candidate-direction" size={16} aria-hidden="true"/></a>
    </div>
    {market==='ecuador'
      ? <EcuadorProcessPhoto locale={locale} kind="measurement"/>
      : <div className="latin-handoff-diagram" aria-hidden="true"><Box size={40}/><ArrowRight size={22}/><ClipboardList size={40}/></div>}
  </section>;
}
