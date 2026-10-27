import RoutePlanningDepth from './RoutePlanningDepth';
import MarketLocalizedContent from './MarketLocalizedContent';
import {marketLocaleData} from './marketLocaleData';
import type {GulfLocale} from './gulfLocale';
import {FreightChapters} from './GulfChapters';
import {NigeriaTileCase, MarketGallery, MarketOfficialResources, MarketRouteMap, MarketJourney} from './MarketVisuals';
import ReactMarkdown from 'react-markdown';
import NigeriaMarketGuide from './NigeriaMarketGuide';
import stories from './marketStories.json';
export type MarketCountry = 'nigeria' | 'peru';
export function marketMetadata(country: MarketCountry,locale:GulfLocale='en') { return {...(locale==='en'?stories[country]:marketLocaleData[locale][country]), keywords: `shipping from China to ${country}, consolidation, freight delivery planning`}; }
export function MarketFreightContent({country,locale='en'}: {country: MarketCountry;locale?:GulfLocale}) {
  if(locale!=='en') return <MarketLocalizedContent country={country} locale={locale}/>;
  const data = stories[country];
  const peru = country === 'peru';
  const destination = peru ? 'Peru' : 'Nigeria';
  const quote = `/get-a-quote/?leadGoal=Freight+Export&source=${country}_country&dest=${destination}`;
  return <main id="main-content" className="freight-editorial market-story" data-country-cargo-planning="true">
    <header className="market-hero market-wrap">
      <div><a className="market-back" href={`/shipping-from-china-to-${peru ? 'latin-america' : 'west-africa'}/`}>← {peru ? 'Latin America' : 'West Africa'} freight</a>
        <p className="freight-kicker">CHINA → {destination.toUpperCase()}</p><h1>{data.heading}</h1>
        <ReactMarkdown>{data.intro}</ReactMarkdown><a className="freight-cta" href={quote}>{data.action} ↗</a>
      </div>
      <aside className="market-plan"><p className="freight-kicker">BEFORE THE QUOTE</p><h2>One brief. An agreed handover.</h2><ol>
        <li><b>01 / Cargo</b><span>{peru ? 'Pallet dimensions, gross weight and stackability.' : 'Every supplier, package count and cargo-ready date.'}</span></li>
        <li><b>02 / Importer</b><span>Product details and a named clearance contact.</span></li>
        <li><b>03 / Receiving</b><span>The exact address, access and unloading arrangements.</span></li>
      </ol><a href="#market-section-7">Prepare your shipment brief ↓</a></aside>
    </header>
    <RoutePlanningDepth country={country} locale={locale}/>
    <div className="market-wrap"><FreightChapters items={[
      {id:'market-section-1',label:peru?'Plan the heavy cargo':'Bring supplier orders together'},
      {id:'market-section-'+(peru?3:4),label:'Compare costs and responsibilities'},
      {id:'market-section-'+(peru?4:2),label:peru?'Prepare Peru receiving':'Prepare Nigeria receiving'},
      {id:'market-section-6',label:'Questions before you ship'},
    ]}/><MarketJourney country={country}/></div>
    <div className="market-wrap">{data.sections.map((section,i)=><section className="market-section" id={`market-section-${i+1}`} tabIndex={-1} key={section.heading} aria-labelledby={`market-heading-${i}`}>
      <div className="market-section-head"><span className="freight-kicker">{String(i+1).padStart(2,'0')}</span><h2 id={`market-heading-${i}`}>{section.heading}</h2></div>
      <div className="market-copy">{i===0 && <MarketGallery country={country}/>}<ReactMarkdown>{section.body}</ReactMarkdown>
        {i===0 && peru && <aside className="market-calculation" aria-label="Hypothetical weight measure calculation"><span>PLANNING EXAMPLE</span><div><strong>3 CBM</strong><b>vs.</b><strong>4.5 tonnes</strong></div><p>4,500 kg ÷ 1,000 = <b>4.5 W/M units</b></p><small>Only for a quote comparing 1 CBM with 1 metric tonne. Check minimums, rounding and local charges.</small></aside>}
        {i===0 && !peru && <NigeriaTileCase/>}
        {i===0 && !peru && <div className="market-checklist"><h3>One row per supplier and product</h3><ul><li>Description, material and quantity</li><li>Carton count, packed size and gross weight</li><li>Supplier location and ready date</li><li>Battery, liquid or powered components</li></ul></div>}
        {i===(peru?1:2) && <MarketOfficialResources country={country}/>}
        {i===(peru?3:1) && <MarketRouteMap country={country}/>}
        {i===data.sections.length-1 && <a className="freight-cta" href={quote}>Send my {destination} cargo brief ↗</a>}
      </div>
    </section>)}</div>
    {!peru && <NigeriaMarketGuide locale="en" sectionNumber="08"/>}
    {peru && <div className="market-wrap market-related"><h2>Also sourcing equipment?</h2><a href="/sourcing/commercial-kitchen-equipment-from-china/">Commercial kitchen equipment from China →</a><a href="/sourcing/food-processing-machinery-from-china/">Food processing machinery from China →</a></div>}
  </main>;
}
