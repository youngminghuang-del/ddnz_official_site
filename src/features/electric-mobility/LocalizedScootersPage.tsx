import {useState} from 'react';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import {buildQuoteHref} from '../../lib/quoteLinks';
import {CatalogueCard} from './ElectricScootersPage';
import catalogue from './catalogue.json';
import copies from './locales.json';
import keys from './localizationKeys.json';
import common from '../home-storage/locales.json';
import type {Language} from '../../i18n/translations';
export const scooterLanguages:Language[]=['en','zh','ru','fr','es','ar','pt','tr'];
export const scooterAlternates=scooterLanguages.map(l=>({hrefLang:l==='zh'?'zh-cn':l,href:`https://www.ddnzglobal.com${l==='en'?'':l==='zh'?'/zh-cn':'/'+l}/sourcing/electric-scooters-from-china/`}));
export default function LocalizedScootersPage({language}:{language:keyof typeof copies}){
 const c=copies[language],ui=common[language],[category,setCategory]=useState('all');
 const quote=buildQuoteHref({intent:'Product Sourcing',language,industry:'Other',source:'electric_scooter_hero',subcategory:c.heading});
 const value=(v:string)=>keys.values.includes(v)?c.values[keys.values.indexOf(v)]:v.replace('Approx.',c.approx).replace(/\b(?:inches|in)\b/g,'″').replace(/\bhours\b/g,'h');
 const translated=catalogue.map((p,i)=>({...p,enTitle:c.names[i],enLabel:c.labels[i],enSpecs:p.enSpecs.map(([k,v])=>[c.fields[keys.fields.indexOf(k)],value(v)]),gallery:p.gallery.map(g=>({...g,enTitle:c.images[keys.images.indexOf(g.enTitle)]}))}));
 return <><SEO title={c.title} description={c.summary} canonicalPath={`/${language}/sourcing/electric-scooters-from-china/`} contentLanguage={language} image="/images/electric-mobility/p1-hero.webp" alternateUrls={scooterAlternates}/><SourcingHomepageNav supportedLanguages={scooterLanguages}/><main id="main-content" className="mobility-page scooter-page" lang={language} dir={language==='ar'?'rtl':'ltr'}>
 <section className="mobility-hero"><div><p className="mobility-eyebrow">DDNZ GLOBAL · {ui.manufacturing}</p><h1>{c.heading}</h1><p>{c.summary}</p><a className="mobility-primary" href={quote}>{c.quote} ↗</a></div><img src="/images/electric-mobility/p1-hero.webp" alt={c.names[0]} width="1400" height="933"/></section>
 <section className="mobility-catalogue" aria-labelledby="mobility-catalogue-heading"><p className="mobility-eyebrow">{c.eyebrow}</p><h2 id="mobility-catalogue-heading">{c.catalogueHeading}</h2><p>{c.intro}</p><div className="mobility-filters" aria-label={c.filter}>{['all','adult','kids','balance'].map((id,i)=><button key={id} aria-pressed={category===id} onClick={()=>setCategory(id)}>{c.categories[i]}</button>)}</div><div className="mobility-grid">{translated.filter(p=>category==='all'||p.category===category).map(p=><CatalogueCard key={p.id} product={p} zh={false} language={language} ui={[...ui.ui,c.illustration]} source="electric_mobility_catalogue"/>)}</div></section>
 <section className="mobility-order"><p className="mobility-eyebrow">{c.orderEyebrow}</p><h2>{c.orderHeading}</h2><div className="mobility-order-grid">{c.order.map(([h,b],i)=><article key={h}><span>0{i+1}</span><h3>{h}</h3><p>{b}</p></article>)}</div><a className="mobility-primary" href={quote}>{c.send} ↗</a></section></main><Footer description={c.heading}/></>;
}
