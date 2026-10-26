import {useRef} from 'react';
import {refrigerationModels} from './catalogueModels.mjs';
import copies from './catalogue-copy.json';
import {buildQuoteHref} from '../../lib/quoteLinks';
import {foodPrefix} from '../food-processing/localization';
type Locale=keyof typeof copies;
function CataloguePhoto({src,model,caption,locale}:{src:string;model:string;caption:string;locale:Locale}){
 const dialog=useRef<HTMLDialogElement>(null),c=copies[locale];
 return <figure className="cold-model-photo"><button type="button" onClick={()=>dialog.current?.showModal()} aria-label={c.enlarge+': '+model}><img src={src} alt={model+' · '+caption} width="1536" height="1024" loading="lazy"/><span>{c.enlarge} ↗</span></button><figcaption>{caption}</figcaption><dialog className="cold-model-dialog" ref={dialog} aria-label={c.enlarge+': '+model} onClick={e=>{if(e.target===dialog.current)dialog.current.close();}}><div><strong><bdi>{model}</bdi></strong><button type="button" aria-label={c.close} onClick={()=>dialog.current?.close()}>×</button></div><img src={src} alt={model+' · '+caption} width="1536" height="1024"/></dialog></figure>;
}
export default function RefrigerationModelCatalogue({locale='en'}:{locale?:Locale}){
 const c=copies[locale],prefix=foodPrefix(locale),name=(kind:string)=>c[kind as 'upright'|'counter'|'display'];
 const schema={'@context':'https://schema.org','@type':'ItemList',name:c.heading,itemListElement:refrigerationModels.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.model+' · '+name(p.kind),url:`https://www.ddnzglobal.com${prefix}/refrigeration-equipment/#model-${p.id}`}))};
 return <section id="refrigeration-models" className="cold-models" lang={locale==='zh'?'zh-CN':locale} dir={locale==='ar'?'rtl':'ltr'} aria-labelledby="cold-models-title">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <p className="cold-eyebrow">DDNZ GLOBAL</p><h2 id="cold-models-title">{c.heading}</h2><p className="cold-intro">{c.intro}</p>
  <nav className="cold-model-nav" aria-label={c.heading}>{refrigerationModels.map(p=><a key={p.id} href={'#model-'+p.id}>{name(p.kind)} ↓</a>)}</nav>
  <div className="cold-model-list">{refrigerationModels.map(p=>{
   const caption=c[(p.kind+'Caption') as 'uprightCaption'|'counterCaption'|'displayCaption'];
   const fields={capacity:p.capacity,temperature:p.temperature.replace(' to ',' – '),power:p.power+' W',size:p.size,refrigerant:p.refrigerant,net:p.netKg+' kg',gross:p.grossKg+' kg',packing:p.packing,cooling:c.air};
   const brief=[p.model,name(p.kind),...Object.entries(fields).map(([k,v])=>c[k as keyof typeof c]+': '+v),c.configuration].join(' · ');
   return <article id={'model-'+p.id} className="cold-model-card" key={p.id}>
    <CataloguePhoto src={p.image} model={p.model} caption={caption} locale={locale}/>
    <div className="cold-model-copy"><p className="cold-eyebrow"><bdi>{p.model}</bdi></p><h3>{name(p.kind)}</h3><p>{c[(p.kind+'Body') as 'uprightBody'|'counterBody'|'displayBody']}</p>
     <dl className="cold-model-metrics">{(['capacity','temperature','power'] as const).map(k=><div key={k}><dt>{c[k]}</dt><dd><bdi>{fields[k]}</bdi></dd></div>)}</dl>
     <details><summary>{c.details}</summary><dl className="cold-model-details">{(['size','cooling','refrigerant','net','gross','packing'] as const).map(k=><div key={k}><dt>{c[k]}</dt><dd><bdi>{fields[k]}</bdi></dd></div>)}</dl><p className="cold-configuration">{c.configuration}</p></details>
     <a className="cold-quote" href={buildQuoteHref({intent:'Product Sourcing',language:locale,source:'refrigeration_model_catalogue',industry:'Commercial Kitchen Equipment',subcategory:brief})}>{c.quote} ↗</a>
    </div>
   </article>;
  })}</div>
 </section>;
}
