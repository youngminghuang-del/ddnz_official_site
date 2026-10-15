import {useId,useState} from 'react';
import ReactMarkdown from 'react-markdown';
import {marketLocaleData,type MarketTranslatedLocale} from './marketLocaleData';
import {gulfLanguagePrefix,gulfLanguageTag,gulfLanguageNames} from './gulfLocale';
import {FreightChapters} from './GulfChapters';
import NigeriaMarketGuide from './NigeriaMarketGuide';
import type {MarketCountry} from './MarketFreightContent';
const root='/media/freight-20261014-round19/';
const portSource='https://www.gob.pe/institucion/mtc/noticias/1182446-mtc-otorga-al-terminal-portuario-de-chancay-la-licencia-para-el-inicio-oficial-de-sus-operaciones';
const sources=['https://son.gov.ng/soncapservice/','https://nigerianports.gov.ng/','https://www.sunat.gob.pe/legislacion/procedim/despacho/importacion/importac/procGeneral/despa-pg.01.htm'];
function LocalGallery({locale,group}:{locale:MarketTranslatedLocale;group:'nigeria'|'peru'|'tiles'}) {
 const d=marketLocaleData[locale],u=d.ui;const id=useId();const [index,setIndex]=useState(group==='tiles'?2:0);
 const ids=group==='nigeria'?[0,1,2]:group==='peru'?[3,4]:[5,6,7];
 const files=['lagos-unloading.jpg','lagos-transfer.jpg','lagos-collection.jpg','/images/operations/peru-tile-loading-case.webp','chancay.jpeg','ceramic-tiles-1.jpg','ceramic-tiles-2.jpg','ceramic-tiles-3.jpg'];
 const src=(i:number)=>files[i].startsWith('/')?files[i]:root+files[i];
 const current=ids[index],item=d.media[current],video=current<3?src(current).replace('.jpg','.mp4'):null;
 return <div className={`market-gallery market-gallery-${group}`}><figure id={id}><div className="market-gallery-title"><bdi>{index+1} / {ids.length}</bdi><strong>{item.heading}</strong></div>
 {video?<video key={video} controls playsInline preload="none" poster={src(current)} aria-label={item.heading}><source src={video} type="video/mp4"/><track kind="captions" src={video.replace('.mp4',`.${locale}.vtt`)} srcLang={gulfLanguageTag(locale)} label={gulfLanguageNames[locale]} default/></video>:<img src={src(current)} alt={item.heading} loading="lazy"/>}
 <figcaption><p>{item.body}</p>{video?<span className="market-media-note">{u.silent}</span>:<a href={src(current)} target="_blank" rel="noreferrer">{u.full} ↗</a>}{current===4&&<a href={portSource} target="_blank" rel="noreferrer">{u.source}: MTC ↗</a>}</figcaption></figure>
 <div className="market-gallery-controls" role="group" aria-label={u.choose}>{ids.map((n,i)=><button key={n} type="button" aria-controls={id} aria-pressed={i===index} onClick={()=>setIndex(i)}><img src={src(n)} alt="" loading="lazy"/><span>{d.media[n].heading}</span></button>)}</div></div>;
}
function Resources({locale,country}:{locale:MarketTranslatedLocale;country:MarketCountry}){
 const d=marketLocaleData[locale],u=d.ui;const ids=country==='nigeria'?[0,1]:[2];const names=['Standards Organisation of Nigeria · SONCAP','Nigerian Ports Authority','SUNAT'];const logos=['son.png','npa.png','sunat.gif'];
 return <section className="market-official" data-customs-resources aria-label={u.official}><h3>{u.official}</h3><div className="market-official-grid">{ids.map(i=><article key={i}><div className="market-official-logo"><img src={root+logos[i]} alt={names[i]} loading="lazy"/></div><h4><bdi>{names[i]}</bdi></h4><p>{d.resources[i]}</p><a href={sources[i]} target="_blank" rel="noreferrer">{u.guidance} ↗</a></article>)}</div>{country==='nigeria'&&<a className="market-authority-link" href="https://customs.gov.ng/" target="_blank" rel="noreferrer">{u.customs} ↗</a>}</section>;
}
function DestinationMap({locale,country}:{locale:MarketTranslatedLocale;country:MarketCountry}){
 const u=marketLocaleData[locale].ui;const cities=country==='peru'?['Callao, Peru','Chancay, Peru','Lima, Peru']:['Lagos Port Complex, Nigeria','Onitsha, Nigeria','Kano, Nigeria'];
 return <figure className="market-route-map"><div className="market-gallery-title"><strong>{u.mapHeading}</strong></div><img src={root+country+'-map.svg'} alt={u.mapIntro} loading="lazy"/><figcaption><p>{u.mapIntro}</p><div>{cities.map(city=><a key={city} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city)}`} target="_blank" rel="noreferrer"><bdi>{city}</bdi> ↗</a>)}</div><small>{u.mapNote} <a href="https://www.naturalearthdata.com/">Natural Earth</a></small></figcaption></figure>;
}
export default function MarketLocalizedContent({country,locale}:{country:MarketCountry;locale:MarketTranslatedLocale}) {
 const d=marketLocaleData[locale],u=d.ui,data=d[country],peru=country==='peru',prefix=gulfLanguagePrefix(locale);
 const quote=`${prefix}/get-a-quote/?leadGoal=Freight+Export&source=${country}_country&dest=${peru?'Peru':'Nigeria'}`;
 const labels=peru?d.chaptersPE:d.chaptersNG,ids=peru?[1,3,4,6]:[1,4,2,6];
 return <main id="main-content" className="freight-editorial market-story" lang={gulfLanguageTag(locale)} dir={locale==='ar'?'rtl':'ltr'} data-country-cargo-planning="true">
 <header className="market-hero market-wrap"><div><a className="market-back" href={`${prefix}/shipping-from-china-to-${peru?'latin-america':'west-africa'}/`}>← {peru?u.backLatin:u.backWest}</a><p className="freight-kicker">{u.china} → <bdi>{data.country}</bdi></p><h1>{data.heading}</h1><p>{data.intro}</p><a className="freight-cta" href={quote}>{u.request} ↗</a></div>
 <aside className="market-plan"><p className="freight-kicker">{u.before}</p><h2>{u.briefHeading}</h2><ol>{[[u.cargo,peru?u.cargoPE:u.cargoNG],[u.importer,u.importHint],[u.receiving,u.receivingHint]].map(([title,hint],i)=><li key={title}><b><bdi>0{i+1}</bdi> / {title}</b><span>{hint}</span></li>)}</ol><a href="#market-section-7">{u.prepare} ↓</a></aside></header>
 <div className="market-wrap"><FreightChapters items={ids.map((id,i)=>({id:`market-section-${id}`,label:labels[i]}))} ariaLabel={u.chapters} reading={u.reading+' · '}/><ol className="market-journey" aria-label={u.prepare}>{(peru?d.journeyPE:d.journeyNG).map((stage,i)=><li key={stage}><span><bdi>0{i+1}</bdi></span><strong>{stage}</strong></li>)}</ol></div>
 <div className="market-wrap">{data.sections.map((section,i)=><section className="market-section" id={`market-section-${i+1}`} tabIndex={-1} key={i} aria-labelledby={`market-heading-${i}`}><div className="market-section-head"><span className="freight-kicker"><bdi>0{i+1}</bdi></span><h2 id={`market-heading-${i}`}>{section.heading}</h2></div><div className="market-copy">
 {i===0&&<LocalGallery locale={locale} group={country}/>}<ReactMarkdown>{section.body}</ReactMarkdown>
 {i===0&&peru&&<aside className="market-calculation" aria-label={u.packingExample}><span>{u.packingExample}</span><div dir="ltr"><strong>3 m³</strong><b> / </b><strong>4,500 kg</strong></div><p dir="ltr">4,500 ÷ 1,000 = <strong>4.5 W/M</strong></p><small>{u.unitNote}</small></aside>}
 {i===0&&!peru&&<section className="market-tile-case" aria-label={u.caseLabel}><p className="freight-kicker">{u.caseLabel}</p><h3>{u.caseHeading}</h3><p>{u.caseIntro}</p><LocalGallery locale={locale} group="tiles"/><div className="market-case-checks">{d.case.map((item,j)=><article key={j}><h4><bdi>0{j+1}</bdi> / {item.heading}</h4><p>{item.body}</p>{j===0&&<p dir="ltr" className="market-case-formula">4,719 kg ÷ 500 = <strong>9.438 ≈ 9.44</strong></p>}{j===1&&<a href="https://son.gov.ng/soncap-faq/" target="_blank" rel="noreferrer">{u.guidance}: SONCAP ↗</a>}</article>)}</div></section>}
 {i===(peru?1:2)&&<Resources locale={locale} country={country}/>}{i===(peru?3:1)&&<DestinationMap locale={locale} country={country}/>}{i===6&&<a className="freight-cta" href={quote}>{u.send} ↗</a>}
 </div></section>)}</div>
 {!peru&&<NigeriaMarketGuide locale={locale} sectionNumber="08"/>}{peru&&<div className="market-wrap market-related"><h2>{u.related}</h2><a href={`${prefix}/sourcing/commercial-kitchen-equipment-from-china/`}>{u.kitchen} →</a><a href={`${prefix}/sourcing/food-processing-machinery-from-china/`}>{u.food} →</a></div>}
 </main>;
}
