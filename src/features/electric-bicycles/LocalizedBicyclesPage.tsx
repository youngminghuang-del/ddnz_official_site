import {useState} from 'react';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import {buildQuoteHref} from '../../lib/quoteLinks';
import {CatalogueCard} from '../electric-mobility/ElectricScootersPage';
import catalogue from './catalogue.json';
import copies from './locales.json';
import common from '../home-storage/locales.json';
import type {Language} from '../../i18n/translations';
export const bicycleLanguages:Language[]=['en','zh','ru','fr','es','ar','pt','tr'];
export const bicycleAlternates=bicycleLanguages.map(l=>({hrefLang:l==='zh'?'zh-cn':l,href:`https://www.ddnzglobal.com${l==='en'?'':l==='zh'?'/zh-cn':'/'+l}/sourcing/electric-bicycles-from-china/`}));
const fields=['Motor power','Battery voltage','Battery capacity','Tyres','Frame','Brakes','Gearing','Suspension','Folding','Packed dimensions'];
const values=['Confirm for order','Confirm configuration','20-inch','20 × 4.0 inches','26 × 2.1 inches','20-inch; width by configuration','Steel','Carbon steel','6061 aluminium alloy','Front & rear disc brakes','Front & rear hydraulic disc brakes','7-speed','8-speed','Front fork & rear shocks','Front suspension fork','Non-folding','Folding frame'];
const images=['Side view','Display and controls','Overall view','Front and rear suspension','Bicycle with front and rear racks','Overall and folded views','Tyre and front fork details','Frame and overall view','Brake system detail','Rear three-quarter view','Disc brake detail'];
export default function LocalizedBicyclesPage({language}:{language:keyof typeof copies}){
 const c=copies[language],ui=common[language],[category,setCategory]=useState('all');
 const quote=buildQuoteHref({intent:'Product Sourcing',language,industry:'Other',source:'electric_bicycle_hero',subcategory:c.heading});
 const translated=catalogue.map((p,i)=>({...p,enTitle:c.names[i],enLabel:c.labels[i],enSpecs:p.enSpecs.map(([k,v])=>[c.fields[fields.indexOf(k)],values.includes(v)?c.values[values.indexOf(v)]:v]),gallery:p.gallery.map(g=>({...g,enTitle:c.images[images.indexOf(g.enTitle)]}))}));
 return <><SEO title={c.title} description={c.summary} canonicalPath={`/${language}/sourcing/electric-bicycles-from-china/`} contentLanguage={language} image="/images/electric-bicycles/b1-hero.webp" alternateUrls={bicycleAlternates}/><SourcingHomepageNav supportedLanguages={bicycleLanguages}/>
 <main id="main-content" className="mobility-page bicycle-page" lang={language} dir={language==='ar'?'rtl':'ltr'}><section className="mobility-hero"><div><p className="mobility-eyebrow">DDNZ GLOBAL · {ui.manufacturing}</p><h1>{c.heading}</h1><p>{c.summary}</p><a className="mobility-primary" href={quote}>{c.quote} ↗</a></div><img src="/images/electric-bicycles/b1-hero.webp" alt={c.names[0]} width="1600" height="1600"/></section>
 <section className="mobility-catalogue" aria-labelledby="bicycle-catalogue-heading"><p className="mobility-eyebrow">{c.eyebrow}</p><h2 id="bicycle-catalogue-heading">{c.catalogueHeading}</h2><p>{c.intro}</p><div className="mobility-filters" aria-label={c.filter}>{['all','folding','fat','trekking'].map((id,i)=><button key={id} aria-pressed={category===id} onClick={()=>setCategory(id)}>{c.categories[i]}</button>)}</div><div className="mobility-grid">{translated.filter(p=>category==='all'||p.category===category).map(p=><CatalogueCard key={p.id} product={p} zh={false} language={language} ui={ui.ui} source="electric_bicycle_catalogue"/>)}</div></section>
 <section className="mobility-order"><p className="mobility-eyebrow">{c.orderEyebrow}</p><h2>{c.orderHeading}</h2><div className="mobility-order-grid">{c.order.map(([h,b],i)=><article key={h}><span>0{i+1}</span><h3>{h}</h3><p>{b}</p></article>)}</div><a className="mobility-primary" href={quote}>{c.send} ↗</a></section></main><Footer description={c.heading}/></>;
}
