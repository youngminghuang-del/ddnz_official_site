import {useState} from 'react';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import {buildQuoteHref} from '../../lib/quoteLinks';
import {CatalogueCard} from '../electric-mobility/ElectricScootersPage';
import catalogue from './catalogue.json';
import copies from './locales.json';
import type {Language} from '../../i18n/translations';

export const storageLanguages:Language[]=['en','zh','ru','fr','es','ar','pt','tr'];
const path='/sourcing/home-energy-storage-from-china/';
export const storageAlternates=storageLanguages.map(l=>({hrefLang:l==='zh'?'zh-cn':l,href:`https://www.ddnzglobal.com${l==='en'?'':l==='zh'?'/zh-cn':'/'+l}${path}`}));
const fieldKeys=['Nominal voltage','Capacity','Nominal energy','Chemistry','Dimensions','Battery net weight','Battery weight','Enclosure rating','Battery modules','Nominal system voltage','System capacity','Per battery module','Communication'];
const imageKeys=['Front and side views','Three module formats','Handles, terminals and stacking details','Stacked enclosure','Side connectors and handle','Module configurations and assembly'];
type Locale=keyof typeof copies;
function Range({p,language}:{p:typeof catalogue[number];language:Locale}){
 const c=copies[language], [selected,setSelected]=useState(0),v=p.variants?.[selected];
 const configuration=(s:string)=>s.replace('modules',c.modules);
 const product={...p,code:v?p.code+'-'+v.code:p.code,enTitle:c.products[p.id-1][0]+(v?' · '+configuration(v.label):''),enLabel:c.products[p.id-1][1],enSpecs:(v?.enSpecs||p.enSpecs).map(([k,value])=>[c.fields[fieldKeys.indexOf(k)],value]),gallery:p.gallery.map(g=>({...g,enTitle:c.images[imageKeys.indexOf(g.enTitle)]}))};
 return <section className="storage-range" id={p.variants?p.code.toLowerCase():undefined} aria-label={c.products[p.id-1][0]}>
 {p.variants&&<label className="storage-configuration" htmlFor={p.code+'-configuration'}><span>{c.choose}</span><select id={p.code+'-configuration'} value={selected} onChange={e=>setSelected(Number(e.target.value))}>{p.variants.map((variant,i)=><option key={variant.code} value={i}>{configuration(variant.label)}</option>)}</select></label>}
 <CatalogueCard product={product} zh={false} language={language} ui={c.ui} source="home_storage_catalogue"/>
 <p className="storage-scope">{c.scopes[p.id-1]}</p></section>;
}
export default function LocalizedStoragePage({language}:{language:Locale}){
 const c=copies[language],quote=buildQuoteHref({intent:'Product Sourcing',language,source:'home_storage_hero',industry:'Other',subcategory:c.heading});
 return <><SEO title={c.title} description={c.summary} canonicalPath={'/'+language+path} contentLanguage={language} image="/images/home-storage/hv-modules.webp" alternateUrls={storageAlternates}/><SourcingHomepageNav supportedLanguages={storageLanguages}/><main id="main-content" className="mobility-page storage-page" lang={language} dir={language==='ar'?'rtl':'ltr'}>
 <section className="mobility-hero storage-hero"><img className="storage-hero-image" src="/images/home-storage/hv-modules.webp" alt={c.images[5]} width="1916" height="821"/><div className="storage-hero-shade" aria-hidden="true"/><div className="storage-hero-copy"><p className="mobility-eyebrow">DDNZ GLOBAL · {c.manufacturing}</p><h1>{c.heading}</h1><p>{c.summary}</p><a href={quote} className="mobility-primary">{c.quote} ↗</a></div></section>
 <nav className="storage-jump" aria-label={c.choose}>{catalogue.map((p,i)=><a key={p.code} href={'#'+p.code.toLowerCase()}>{c.formats[i]} ↓</a>)}</nav>
 <div className="storage-intro"><h2>{c.introTitle}</h2><p>{c.intro}</p></div><div className="storage-catalogue">{catalogue.map(p=><Range key={p.id} p={p} language={language}/>)}</div>
 <section className="mobility-order"><p className="mobility-eyebrow">{c.orderEyebrow}</p><h2>{c.orderTitle}</h2><div className="mobility-order-grid">{c.order.map(([h,b],i)=><article key={h}><span>0{i+1}</span><h3>{h}</h3><p>{b}</p></article>)}</div><a href={quote} className="mobility-primary">{c.send} ↗</a></section></main><Footer description={c.heading}/></>;
}
