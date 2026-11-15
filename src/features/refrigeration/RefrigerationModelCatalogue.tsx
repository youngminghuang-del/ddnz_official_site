import { SharedKitchenListBar, useSharedKitchenList } from '../commercial-kitchen/components/SharedKitchenList';
import { kitchenCopy } from '../commercial-kitchen/data/localization.mjs';
import kitchenProducts from '../commercial-kitchen/data/products.mjs';
import {useRef} from 'react';
import {refrigerationModels} from './catalogueModels.mjs';
import {kitchenModelHref} from '../commercial-kitchen/data/categories.mjs';
import {selectionCopy} from './selection-copy';
import copies from './catalogue-copy.json';
import {buildQuoteHref} from '../../lib/quoteLinks';
import {foodPrefix} from '../food-processing/localization';
type Locale=keyof typeof copies;

const alternatives = {
 upright: ['cold-2', 'cold-4', 'cold-5'],
 counter: ['cold-6', 'cold-7'],
 display: ['cold-42', 'cold-13'],
};

function ModelOptions({ kind, locale }: {kind: keyof typeof alternatives; locale: Locale}) {
 const labels = selectionCopy[locale];
 const c = copies[locale];
 const headingId = `refrigeration-${kind}-options`;
 return <section className="cold-options" aria-labelledby={headingId}>
  <h4 id={headingId}>{labels.alternatives}</h4>
  <ul>{alternatives[kind].map(id => {
   const model = kitchenProducts.find(product => product.id === id);
   if (!model) return null;
   const name = locale==='en' ? model.name : kitchenCopy(locale).names[model.name];
   return <li key={id}>
    <a href={foodPrefix(locale) + kitchenModelHref(id)}><bdi>{model.model}</bdi><span aria-hidden="true"> ↗</span></a>
    <p className="cold-option-name">{name}</p>
    <dl>
     <div><dt>{c.capacity}</dt><dd><bdi>{model.specs.Capacity}</bdi></dd></div>
     <div><dt>{c.temperature}</dt><dd><bdi>{model.specs.Temperature.replace(' to ', ' – ')}</bdi></dd></div>
     <div><dt>{c.size}</dt><dd><bdi>{model.dimensions.replace(/\s*mm$/, ' mm')}</bdi></dd></div>
    </dl>
   </li>;
  })}</ul>
 </section>;
}
function CataloguePhoto({src,model,caption,locale}:{src:string;model:string;caption:string;locale:Locale}){
 const dialog=useRef<HTMLDialogElement>(null),c=copies[locale];
 return <figure className="cold-model-photo"><button type="button" onClick={()=>dialog.current?.showModal()} aria-label={c.enlarge+': '+model}><img src={src} alt={model+' · '+caption} width="1536" height="1024" loading="lazy"/><span>{c.enlarge} ↗</span></button><figcaption>{caption}</figcaption><dialog className="cold-model-dialog" ref={dialog} aria-label={c.enlarge+': '+model} onClick={e=>{if(e.target===dialog.current)dialog.current.close();}}><div><strong><bdi>{model}</bdi></strong><button type="button" aria-label={c.close} onClick={()=>dialog.current?.close()}>×</button></div><img src={src} alt={model+' · '+caption} width="1536" height="1024"/></dialog></figure>;
}
export default function RefrigerationModelCatalogue({locale='en'}:{locale?:Locale}){
 const sharedList=useSharedKitchenList(locale);
 const addLabel=locale==='en'?'Add to equipment list':kitchenCopy(locale).ui.add;
 const c=copies[locale],prefix=foodPrefix(locale),name=(kind:string)=>c[kind as 'upright'|'counter'|'display'];
 const selection=selectionCopy[locale];
 const schema={'@context':'https://schema.org','@type':'ItemList',name:c.heading,itemListElement:refrigerationModels.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.model+' · '+name(p.kind),url:`https://www.ddnzglobal.com${prefix}/refrigeration-equipment/#model-${p.id}`}))};
 return <section id="refrigeration-models" className="cold-models" lang={locale==='zh'?'zh-CN':locale} dir={locale==='ar'?'rtl':'ltr'} aria-labelledby="cold-models-title">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <h2 id="cold-models-title">{selection.heading}</h2><p className="cold-intro">{selection.intro}</p>
  <nav className="cold-use-nav" aria-label={selection.heading}>{refrigerationModels.map(p=>{
   const kind=p.kind as keyof typeof alternatives;
   return <a key={kind} href={'#refrigeration-'+kind}><strong>{selection.groups[kind][0]}</strong><span aria-hidden="true">↓</span></a>;
  })}</nav>
  {locale==='en'&&<p className="cold-intro"><a href="/blog/commercial-refrigerators-gulf-kitchens-climate-class-high-ambient/">Checking refrigeration for Gulf kitchens ↗</a> · Review climate class and ambient temperature before choosing a model.</p>}
  <SharedKitchenListBar locale={locale} count={sharedList.count} status={sharedList.status}/>
  <div className="cold-model-list">{refrigerationModels.map(p=>{
   const kind=p.kind as keyof typeof alternatives;
   const [title, guidance]=selection.groups[kind];
   const caption=c[(p.kind+'Caption') as 'uprightCaption'|'counterCaption'|'displayCaption'];
   const fields={capacity:p.capacity,temperature:p.temperature.replace(' to ',' – '),power:p.power+' W',size:p.size,refrigerant:p.refrigerant,net:p.netKg+' kg',gross:p.grossKg+' kg',packing:p.packing,cooling:c.air};
   const brief=[p.model,name(p.kind),...Object.entries(fields).map(([k,v])=>c[k as keyof typeof c]+': '+v),c.configuration].join(' · ');
   const kitchenItem=kitchenProducts.find(item=>item.model===p.model);
   return <section className="cold-use-group" id={'refrigeration-'+kind} aria-labelledby={'refrigeration-'+kind+'-title'} key={kind}>
    <h3 id={'refrigeration-'+kind+'-title'}>{title}</h3><p className="cold-intro">{guidance}</p>
    <article id={'model-'+p.id} className="cold-model-card">
    <CataloguePhoto src={p.image} model={p.model} caption={caption} locale={locale}/>
    <div className="cold-model-copy"><p className="cold-eyebrow"><bdi>{p.model}</bdi></p><h4>{name(p.kind)}</h4><p>{c[(p.kind+'Body') as 'uprightBody'|'counterBody'|'displayBody']}</p>
     <dl className="cold-model-metrics">{(['capacity','temperature','power'] as const).map(k=><div key={k}><dt>{c[k]}</dt><dd><bdi>{fields[k]}</bdi></dd></div>)}</dl>
     <details><summary>{c.details}</summary><dl className="cold-model-details">{(['size','cooling','refrigerant','net','gross','packing'] as const).map(k=><div key={k}><dt>{c[k]}</dt><dd><bdi>{fields[k]}</bdi></dd></div>)}</dl><p className="cold-configuration">{c.configuration}</p></details>
     {kitchenItem&&<button className="cold-quote shared-kitchen-add" type="button" aria-label={locale==='en'?`Add ${p.model} to equipment list`:`${addLabel} · ${p.model}`} onClick={()=>sharedList.add(kitchenItem.id)}>{addLabel}</button>}
     <a className="cold-quote" href={buildQuoteHref({intent:'Product Sourcing',language:locale,source:'refrigeration_model_catalogue',industry:'Commercial Kitchen Equipment',subcategory:brief})}>{c.quote} ↗</a>
    </div>
   </article>
   <ModelOptions kind={kind} locale={locale}/>
   </section>;
  })}</div>
 </section>;
}
