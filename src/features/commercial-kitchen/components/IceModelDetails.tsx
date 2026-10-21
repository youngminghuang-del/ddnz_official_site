import {useRef} from 'react';
import details from '../data/iceDetails.json';
import copies from '../locales/ice-details.json';
type Locale=keyof typeof copies;
type IceDetail={panel:string;display?:string;power?:string;storage?:string;weight?:string;cycle?:string;construction?:string;heightConflict?:boolean};
export function IceModelDetails({id,locale='en'}:{id:string;locale?:Locale}){
 const d=(details as Record<string,IceDetail>)[id],c=copies[locale];
 if(!d)return null;
 const fields=['panel','display','power','storage','weight','cycle','construction'] as const;
 return <details className="ice-model-details"><summary>{c.details}</summary><dl>{fields.filter(key=>d[key]).map(key=><div key={key}><dt>{c[key]}</dt><dd><bdi>{c[d[key] as keyof typeof c]||d[key]}</bdi></dd></div>)}</dl>{d.heightConflict&&<p className="fine">{c.heightNote}</p>}</details>;
}
export function IceModelPhoto({src,alt,model,locale='en'}:{src:string;alt:string;model:string;locale?:Locale}){
 const dialog=useRef<HTMLDialogElement>(null),c=copies[locale];
 return <div className="category-model-photo"><button type="button" className="ice-photo-button" onClick={()=>dialog.current?.showModal()} aria-label={`${c.enlarge}: ${model}`}><img src={src} alt={alt} width="1200" height="900" loading="lazy"/><span>{c.enlarge} ↗</span></button><dialog className="ice-photo-dialog" ref={dialog} aria-label={`${c.enlarge}: ${model}`} onClick={e=>{if(e.target===dialog.current)dialog.current.close();}}><div><strong><bdi>{model}</bdi></strong><button type="button" onClick={()=>dialog.current?.close()} aria-label={c.close}>×</button></div><img src={src} alt={alt} width="1200" height="900"/></dialog></div>;
}
