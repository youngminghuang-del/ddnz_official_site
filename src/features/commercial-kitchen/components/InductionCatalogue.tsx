import {useRef} from 'react';
import {inductionModels,multiZoneModels} from '../data/inductionModels.mjs';
import copies from '../locales/planning/induction-catalogue.json';
import {buildQuoteHref} from '../../../lib/quoteLinks';
import {foodPrefix} from '../../food-processing/localization';
type Locale=keyof typeof copies;
function Photo({src,model,caption,locale}:{src:string;model:string;caption:string;locale:Locale}){
 const dialog=useRef<HTMLDialogElement>(null),c=copies[locale];
 return <figure className="induction-photo"><button type="button" aria-label={`${c.enlarge}: ${model}`} onClick={()=>dialog.current?.showModal()}><img src={src} alt={`${model} · ${caption}`} width="1536" height="1024" loading="lazy"/><span>{c.enlarge} ↗</span></button><figcaption>{caption}</figcaption><dialog ref={dialog} aria-label={`${c.enlarge}: ${model}`} onClick={e=>{if(e.target===dialog.current)dialog.current.close();}}><header><strong><bdi>{model}</bdi></strong><button type="button" onClick={()=>dialog.current?.close()} aria-label={c.close}>×</button></header><img src={src} alt={`${model} · ${caption}`} width="1536" height="1024"/></dialog></figure>;
}
export default function InductionCatalogue({locale:language='en',group='single'}:{locale?:Locale|'zh-cn';group?:'single'|'multi'}){
 const locale=language==='zh-cn'?'zh':language;
 const base=copies[locale],c=group==='multi'?{...base,heading:base.multiHeading,intro:base.multiIntro,names:base.multiNames,bodies:base.multiBodies}:base;
 const models=group==='multi'?multiZoneModels:inductionModels,sectionId=group==='multi'?'multi-zone-cooking':'induction-cooking',titleId=sectionId+'-title',prefix=foodPrefix(locale),keys=['power','supply','footprint'] as const;
 const schema={'@context':'https://schema.org','@type':'ItemList',name:c.heading,itemListElement:models.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.model+' · '+c.names[i],url:`https://www.ddnzglobal.com${prefix}/sourcing/commercial-kitchen-equipment-from-china/#model-${p.id}`}))};
 return <section id={sectionId} className="induction-catalogue wrap section" lang={locale==='zh'?'zh-CN':locale} dir={locale==='ar'?'rtl':'ltr'} aria-labelledby={titleId}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><p className="induction-eyebrow">DDNZ GLOBAL</p><h2 id={titleId}>{c.heading}</h2><p className="induction-intro">{c.intro}</p><nav aria-label={c.heading}>{models.map((p,i)=><a key={p.id} href={'#model-'+p.id}>{c.names[i]} ↓</a>)}</nav><div className="induction-list">{models.map((p,i)=>{
 const caption=p.kind==='wok'?c.seriesCaption:c.caption;
 const fields=Object.keys(c.fields).filter(k=>p[k]);
 const brief=[p.model,c.names[i],...fields.map(k=>`${c.fields[k]}: ${p[k]}`),c.configuration].join(' · ');
 return <article id={'model-'+p.id} key={p.id} className="induction-card"><Photo src={p.image} model={p.model} caption={caption} locale={locale}/><div className="induction-copy"><p className="induction-eyebrow"><bdi>{p.model}</bdi></p><h3>{c.names[i]}</h3><p>{c.bodies[i]}</p><dl className="induction-metrics">{keys.map(k=><div key={k}><dt>{c.fields[k]}</dt><dd><bdi dir="ltr">{p[k]}</bdi></dd></div>)}</dl><details><summary>{c.details}</summary><dl className="induction-details">{fields.filter(k=>!keys.includes(k as typeof keys[number])).map(k=><div key={k}><dt>{c.fields[k]}</dt><dd><bdi dir="ltr">{p[k]}</bdi></dd></div>)}</dl><p>{c.configuration}</p></details><a className="induction-quote" href={buildQuoteHref({intent:'Product Sourcing',industry:'Commercial Kitchen Equipment',source:'induction_catalogue',language:locale,subcategory:brief})}>{c.quote} ↗</a></div></article>;
 })}</div></section>;
}

export function InductionEntry({locale:language='en',group='single'}:{locale?:Locale|'zh-cn';group?:'single'|'multi'}){const locale=language==='zh-cn'?'zh':language;return <a href={group==='multi'?'#multi-zone-cooking':'#induction-cooking'}>{group==='multi'?copies[locale].multiNav:copies[locale].nav}</a>;}
