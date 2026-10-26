import {useRef} from 'react';
import modelDetails from './modelDetails.json';
import copies from './locales/model-details.json';

type Locale = keyof typeof copies;
export function FoodModelFacts({id,locale='en'}:{id:string;locale?:Locale}) {
 const item=modelDetails[id as keyof typeof modelDetails];
 if(!item) return null;
 const c=copies[locale];
 const conflict=item.rows.some(([key])=>key==='catalogueSize'||key==='catalogueWeight');
 return <div className="fp-model-facts"><dl>{item.rows.map(([key,value])=><div key={key}><dt>{c[key as keyof typeof c]}</dt><dd><bdi>{value}</bdi></dd></div>)}</dl>{conflict&&<p className="fp-model-conflict">{c.conflict}</p>}{item.rows.some(([key])=>key.includes('Output')||key==='ratedOutput')&&<p>{c.performance}</p>}</div>;
}

export function FoodModelPhoto({src,alt,locale='en'}:{src:string;alt:string;locale?:Locale}) {
 const dialog=useRef<HTMLDialogElement>(null),opener=useRef<HTMLButtonElement>(null),c=copies[locale];
 return <div className="fp-machine-image"><button ref={opener} type="button" className="fp-photo-open" aria-label={`${c.photo}: ${alt}`} onClick={()=>dialog.current?.showModal()}><img src={src} alt={alt} width="420" height="420" loading="lazy"/><span>{c.photo} ↗</span></button><dialog ref={dialog} className="fp-photo-dialog" aria-label={alt} onClose={()=>opener.current?.focus()} onClick={event=>{if(event.target===event.currentTarget)dialog.current?.close();}}><div className="fp-photo-dialog-head"><strong>{alt}</strong><button type="button" aria-label={c.close} onClick={()=>dialog.current?.close()}>×</button></div><img src={src} alt={alt} width="1200" height="1200" loading="lazy"/></dialog></div>;
}
