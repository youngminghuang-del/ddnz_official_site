import {IceModelPhoto} from './IceModelDetails';
import copy from '../locales/ice-use-series.json';
import {iceUseModels} from '../data/iceUseModels.mjs';
import {buildQuoteHref} from '../../../lib/quoteLinks';
type Locale=keyof typeof copy;
export default function IceUseSeries({locale='en'}:{locale?:Locale}) {
 const c=copy[locale];
 const title=(kind:string)=>c[kind as 'crescent'|'granular'|'split'];
 return <section id="ice-shapes" className="section wrap ice-use-series" aria-labelledby="ice-shapes-title">
  <p className="eyebrow">DDNZ GLOBAL</p><h2 id="ice-shapes-title">{c.heading}</h2><p className="ice-use-intro">{c.intro}</p>
  <nav className="ice-use-nav" aria-label={c.heading}>{iceUseModels.map(p=><a key={p.id} href={'#model-'+p.id}>{title(p.kind)}<span aria-hidden="true"> ↓</span></a>)}</nav>
  <div className="ice-use-models">{iceUseModels.map(p=>{
   const name=title(p.kind),description=c[(p.kind+'Body') as 'crescentBody'|'granularBody'|'splitBody'];
   const brief=[p.model,name,`${c.output}: ${p.output} kg / 24h`,`${c.storage}: ${p.storage} kg`,`${c.power}: ${p.power} W`,`${c.voltage}: ${p.voltage} V`,`${c.size}: ${p.size}`,c.installationBody,p.kind==='split'?c.splitScope:'',p.kind==='crescent'?c.heightNote:''].filter(Boolean).join(' · ');
   return <article key={p.id} id={'model-'+p.id} className="ice-use-card">
    <figure><IceModelPhoto src={p.image} model={p.model} alt={name+' · '+(p.kind==='granular'?c.mechanismCaption:c.caption)} locale={locale}/><figcaption>{p.kind==='granular'?c.mechanismCaption:c.caption}</figcaption></figure>
    <div className="ice-use-copy"><p className="eyebrow"><bdi>{p.model}</bdi></p><h3>{name}</h3><p>{description}</p>
     <dl className="ice-use-metrics">{(['output','storage','power'] as const).map(k=><div key={k}><dt>{c[k]}</dt><dd><bdi>{p[k]} {k==='output'?'kg / 24h':k==='storage'?'kg':'W'}</bdi></dd></div>)}</dl>
     <details className="ice-use-details"><summary>{c.details}</summary><dl><div><dt>{c.size}</dt><dd><bdi>{p.size}</bdi></dd></div><div><dt>{c.voltage}</dt><dd><bdi>{p.voltage} V</bdi></dd></div></dl>{p.kind==='crescent'&&<p>{c.heightNote}</p>}<p>{c.installationBody}</p>{p.kind==='split'&&<p>{c.splitScope}</p>}</details>
     <a className="button primary" href={buildQuoteHref({intent:'Product Sourcing',language:locale,source:'ice_shape_catalogue',industry:'Commercial Kitchen Equipment',subcategory:brief})}>{c.quote} ↗</a>
    </div>
   </article>;
  })}</div><p className="fine">{c.ratedNote}</p>
 </section>;
}
