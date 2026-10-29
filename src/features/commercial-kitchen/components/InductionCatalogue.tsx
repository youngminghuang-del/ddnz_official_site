import ProgressiveSection from '../../product-experience/ProgressiveSection';
import {kitchenLocales} from '../data/localization.mjs';
import {useRef} from 'react';
import {inductionModels,multiZoneModels,steamModels,noodleModels,roundCookerModels,largeWokModels} from '../data/inductionModels.mjs';
import copies from '../locales/planning/induction-catalogue.json';
import {buildQuoteHref} from '../../../lib/quoteLinks';
import {foodPrefix} from '../../food-processing/localization';
type Locale=keyof typeof copies;
function Photo({src,model,caption,locale}:{src:string;model:string;caption:string;locale:Locale}){
 const dialog=useRef<HTMLDialogElement>(null),c=copies[locale];
 return <figure className="induction-photo"><button type="button" aria-label={`${c.enlarge}: ${model}`} onClick={()=>dialog.current?.showModal()}><img src={src} alt={`${model} · ${caption}`} width="1536" height="1024" loading="lazy"/><span>{c.enlarge} ↗</span></button><figcaption>{caption}</figcaption><dialog ref={dialog} aria-label={`${c.enlarge}: ${model}`} onClick={e=>{if(e.target===dialog.current)dialog.current.close();}}><header><strong><bdi>{model}</bdi></strong><button type="button" onClick={()=>dialog.current?.close()} aria-label={c.close}>×</button></header><img src={src} alt={`${model} · ${caption}`} width="1536" height="1024"/></dialog></figure>;
}
export default function InductionCatalogue({locale:language='en',group='single',onAdd,onCompare,isCompared}:{locale?:Locale|'zh-cn';group?:'single'|'multi'|'steam'|'noodle'|'round'|'large';onAdd?:(id:string)=>void;onCompare?:(id:string)=>void;isCompared?:(id:string)=>boolean}){
 const locale=language==='zh-cn'?'zh':language;
 const base=copies[locale];
 const groups={
  large:{models:largeWokModels,id:'large-wok-cookers',copy:{...base,heading:base.largeHeading,intro:base.largeIntro,names:base.largeNames,bodies:base.largeBodies,caption:base.largeCaption,configuration:base.largeConfiguration}},
  round:{models:roundCookerModels,id:'soup-bun-cookers',copy:{...base,heading:base.roundHeading,intro:base.roundIntro,names:base.roundNames,bodies:base.roundBodies,caption:base.roundCaption,configuration:base.roundConfiguration,fields:{...base.fields,power:base.roundPower}}},
  single:{models:inductionModels,id:'induction-cooking',copy:base},
  multi:{models:multiZoneModels,id:'multi-zone-cooking',copy:{...base,heading:base.multiHeading,intro:base.multiIntro,names:base.multiNames,bodies:base.multiBodies}},
  steam:{models:steamModels,id:'steam-cabinets',copy:{...base,heading:base.steamHeading,intro:base.steamIntro,names:base.steamNames,bodies:base.steamBodies,caption:base.steamCaption,configuration:base.steamConfiguration,fields:{...base.fields,power:base.steamPower}}},
  noodle:{models:noodleModels,id:'noodle-cookers',copy:{...base,heading:base.noodleHeading,intro:base.noodleIntro,names:base.noodleNames,bodies:base.noodleBodies,caption:base.noodleCaption,configuration:base.noodleConfiguration,fields:{...base.fields,power:base.noodlePower}}},
 };
 const {models,id:sectionId,copy:c}=groups[group],titleId=sectionId+'-title',prefix=foodPrefix(locale),keys=['power','supply','footprint'] as const;
 return <ProgressiveSection title={c.heading} locale={locale}><section id={sectionId} className="induction-catalogue wrap section" lang={locale==='zh'?'zh-CN':locale} dir={locale==='ar'?'rtl':'ltr'} aria-labelledby={titleId}><p className="induction-eyebrow">DDNZ GLOBAL</p><h2 id={titleId}>{c.heading}</h2><p className="induction-intro">{c.intro}</p><nav aria-label={c.heading}>{models.map((p,i)=><a key={p.id} href={'#model-'+p.id}>{c.names[i]} ↓</a>)}</nav><div className="induction-list">{models.map((p,i)=>{
 const caption=p.kind==='wok'?c.seriesCaption:c.caption;
 const fields=Object.keys(c.fields).filter(k=>p[k]);
 const brief=[p.model,c.names[i],...fields.map(k=>`${c.fields[k]}: ${p[k]}`),c.configuration].join(' · ');
 return <article id={'model-'+p.id} key={p.id} className="induction-card"><Photo src={p.image} model={p.model} caption={caption} locale={locale}/><div className="induction-copy"><p className="induction-eyebrow"><bdi>{p.model}</bdi></p><h3>{c.names[i]}</h3><p>{c.bodies[i]}</p><dl className="induction-metrics">{keys.map(k=><div key={k}><dt>{c.fields[k]}</dt><dd><bdi dir="ltr">{p[k]}</bdi></dd></div>)}</dl><details><summary>{c.details}</summary><dl className="induction-details">{fields.filter(k=>!keys.includes(k as typeof keys[number])).map(k=><div key={k}><dt>{c.fields[k]}</dt><dd><bdi dir="ltr">{p[k]}</bdi></dd></div>)}</dl><p>{c.configuration}</p></details>{onAdd&&<div className="induction-shared-actions"><button type="button" onClick={()=>onAdd(p.id)}>{locale==='en'?'Add to list':kitchenLocales[locale].ui.add} +</button><button type="button" aria-pressed={isCompared?.(p.id)||false} onClick={()=>onCompare?.(p.id)}>{locale==='en'?'Compare':kitchenLocales[locale].ui.compare}</button></div>}<a className="induction-quote" href={buildQuoteHref({intent:'Product Sourcing',industry:'Commercial Kitchen Equipment',source:'induction_catalogue',language:locale,subcategory:brief})}>{c.quote} ↗</a></div></article>;
 })}</div></section></ProgressiveSection>;
}

export function InductionEntry({locale:language='en',group='single'}:{locale?:Locale|'zh-cn';group?:'single'|'multi'|'steam'|'noodle'|'round'|'large'}){const locale=language==='zh-cn'?'zh':language;return <a href={group==='large'?'#large-wok-cookers':group==='multi'?'#multi-zone-cooking':group==='steam'?'#steam-cabinets':group==='noodle'?'#noodle-cookers':group==='round'?'#soup-bun-cookers':'#induction-cooking'}>{group==='large'?copies[locale].largeNav:group==='multi'?copies[locale].multiNav:group==='steam'?copies[locale].steamNav:group==='noodle'?copies[locale].noodleNav:group==='round'?copies[locale].roundNav:copies[locale].nav}</a>;}
