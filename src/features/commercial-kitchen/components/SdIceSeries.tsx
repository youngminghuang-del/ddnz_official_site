import {sdIceModels} from '../data/sdIceModels.mjs';
import {IceModelPhoto} from './IceModelDetails';
import copies from '../locales/sd-series.json';
import {supplyPositioning} from '../../product-positioning/ProductSupply';
import {buildQuoteHref} from '../../../lib/quoteLinks';
export default function SdIceSeries({locale='en',inCatalogue=false}:{locale?:keyof typeof copies;inCatalogue?:boolean}){
 const c=copies[locale];
 const heading=inCatalogue && locale==='en' ? 'SD cube ice machines' : c.heading;
 const photo=<figure className="sd-series-photo">
   <IceModelPhoto src="/commercial-kitchen-media/sd-series-three-views-v1.webp" alt={c.caption} model="SD" locale={locale}/>
   <figcaption>{c.caption}</figcaption>
 </figure>;
 return <section id="sd-series" className={inCatalogue?'sd-ice-series sd-in-catalogue':'section wrap sd-ice-series'} aria-labelledby="sd-series-heading">
   <div className="sd-series-intro">
     <div><h2 id="sd-series-heading">{heading}</h2><p>{c.intro}</p></div>
     {photo}
   </div>
   <div className="sd-model-grid">{sdIceModels.map(p=><article id={`model-${p.model.toLowerCase()}`} key={p.model}>
     <h3><bdi>{p.model}</bdi></h3>
     <dl>{(['output','storage','power','size'] as const).map(key=><div key={key}><dt>{c[key]}</dt><dd><bdi>{p[key]}</bdi></dd></div>)}</dl>
     <a className="button primary" href={buildQuoteHref({
       intent:'Product Sourcing',language:locale,source:'ice_sd_catalogue',industry:'Other',
       subcategory:`${p.model} commercial cube ice machine · ${p.output} · ${p.storage} storage · ${p.power} · ${p.size}`,
     })}>{supplyPositioning[locale].primary} ↗</a>
   </article>)}</div>
 </section>;
}
