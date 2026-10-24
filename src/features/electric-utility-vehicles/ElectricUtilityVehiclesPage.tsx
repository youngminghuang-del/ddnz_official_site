import CatalogueHeroMedia, { heroRanges } from '../../components/catalogue-hero/CatalogueHeroMedia';
import {useState} from 'react';
import {useLocation} from 'react-router-dom';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import {buildQuoteHref} from '../../lib/quoteLinks';
import {navigationPath} from '../../lib/productLanguageRouting';
import {CatalogueCard} from '../electric-mobility/ElectricScootersPage';
import common from '../home-storage/locales.json';
import copies from './locales.json';
import catalogue from './catalogue.json';
import type {Language} from '../../i18n/translations';
import '../electric-mobility/electric-mobility.css';
export const utilityVehiclePath='/sourcing/electric-utility-vehicles-from-china';
export const utilityVehicleLanguages:Language[]=['en','zh','ru','fr','es','ar','pt','tr'];
export const utilityVehicleAlternates=utilityVehicleLanguages.map(l=>({hrefLang:l==='zh'?'zh-cn':l,href:`https://www.ddnzglobal.com${navigationPath(utilityVehiclePath,l)}`}));
export function ElectricUtilityVehiclesContent({language}:{language:Language}){
 const c=copies[language],[category,setCategory]=useState('all');
 const ui=language==='en'||language==='zh'?undefined:common[language].ui;
 const quote=buildQuoteHref({intent:'Product Sourcing',language,industry:'Other',source:'electric_utility_vehicle_hero',subcategory:c.heading});
 const products=catalogue.map((p,i)=>({id:p.id,code:p.code,category:p.category,title:c.names[i],enTitle:c.names[i],label:c.labels[i],enLabel:c.labels[i],specs:p.values.map((v,n)=>[c.fields[n],v.startsWith('@')?c.values[Number(v.slice(1))]:v]),enSpecs:p.values.map((v,n)=>[c.fields[n],v.startsWith('@')?c.values[Number(v.slice(1))]:v]),gallery:p.gallery.map(([asset,index])=>({web:`/images/electric-utility-vehicles/${asset}.webp`,thumb:`/images/electric-utility-vehicles/${asset}-thumb.webp`,title:c.images[Number(index)],enTitle:c.images[Number(index)],kind:'产品图片'}))}));
 return <main id="main-content" className="mobility-page utility-vehicle-page" lang={language==='zh'?'zh-CN':language} dir={language==='ar'?'rtl':'ltr'}><section className="mobility-hero catalogue-hero"><div><p className="mobility-eyebrow">DDNZ GLOBAL · {language==='zh'?'中国制造与出口':language==='en'?'MANUFACTURING & EXPORT':common[language].manufacturing}</p><h1>{c.heading}</h1><p>{c.summary}</p><a className="mobility-primary" href={quote}>{c.quote} ↗</a></div><CatalogueHeroMedia onNavigate={()=>setCategory('all')} {...heroRanges.utility} alt={heroRanges.utility.label} language={language}/></section><section className="mobility-catalogue" aria-labelledby="utilityVehicle-catalogue-heading"><p className="mobility-eyebrow">{c.eyebrow}</p><h2 id="utilityVehicle-catalogue-heading">{c.catalogue}</h2><p>{c.intro}</p><div className="mobility-filters" aria-label={c.catalogue}>{['all','delivery','seated'].map((id,i)=><button key={id} aria-pressed={category===id} onClick={()=>setCategory(id)}>{c.categories[i]}</button>)}</div><div className="mobility-grid">{products.filter(p=>category==='all'||p.category===category).map(p=><CatalogueCard key={p.id} product={p} zh={language==='zh'} language={language} ui={ui} note={c.notes[catalogue.findIndex(x=>x.id===p.id)]} source="electric_utility_vehicle_catalogue"/>)}</div></section><section className="mobility-order"><h2>{c.orderTitle}</h2><div className="mobility-order-grid">{c.order.map(([h,b],i)=><article key={h}><span>0{i+1}</span><h3>{h}</h3><p>{b}</p></article>)}</div><a className="mobility-primary" href={quote}>{c.quote} ↗</a><p className="mt-6"><a href={navigationPath('/sourcing/electric-tricycles-from-china',language)}>{c.back} ↗</a></p></section></main>;
}
export default function ElectricUtilityVehiclesPage(){const {pathname}=useLocation();const raw=pathname.split('/')[1];const language:Language=raw==='zh-cn'?'zh':utilityVehicleLanguages.includes(raw as Language)?raw as Language:'en';const c=copies[language];return <><SEO title={c.title} description={c.summary} contentLanguage={language} canonicalPath={navigationPath(utilityVehiclePath,language)} alternateUrls={utilityVehicleAlternates} image="/images/electric-utility-vehicles/delivery-main.webp"/><SourcingHomepageNav supportedLanguages={utilityVehicleLanguages}/><ElectricUtilityVehiclesContent language={language}/><Footer description={c.heading}/></>;}
