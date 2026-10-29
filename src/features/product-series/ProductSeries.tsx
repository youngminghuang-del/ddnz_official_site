import ProductGallery from './ProductGallery';
import React,{useEffect,useState} from 'react';
import catalog from '../commercial-kitchen/data/products.mjs';
import {cleanList} from '../commercial-kitchen/data/model.mjs';
import {seriesModels,seriesCopy,seriesSpecs,seriesQuote} from './models.mjs';
export function cleanSeriesSelection(raw:unknown,family:string):Record<string,number>{
 const allowed=new Set(seriesModels.filter(m=>m.family===family).map(m=>m.id));
 return Object.fromEntries(Object.entries(raw&&typeof raw==='object'?raw:{}).filter(([id])=>allowed.has(id)).flatMap(([id,v])=>{const n=Number(v);return Number.isFinite(n)&&n>=1?[[id,Math.min(99,Math.floor(n))]]:[]}));
}
export function SeriesEntry({family,locale='en'}:{family:'coffee'|'speaker';locale?:string}){const c=seriesCopy(locale);return <a className="series-entry-link" href={family==='coffee'?'#coffee-machine-catalogue':'#bluetooth-model-catalogue'}>{family==='coffee'?c.linkCoffee:c.linkSpeaker} ↗</a>;}
export default function ProductSeries({family,locale='en',onAdd,onCompare,standalone=false,segment,canonicalPath}:{family:'coffee'|'speaker';locale?:string;onAdd?:(id:string)=>void;onCompare?:(id:string)=>void;standalone?:boolean;segment?:'portable'|'party';canonicalPath?:string}){
 const lang=locale==='zh-cn'?'zh':locale,c=seriesCopy(lang),allModels=seriesModels.filter(m=>m.family===family),models=allModels.filter(m=>!segment||(m.segment||'party')===segment),id=family==='coffee'?'coffee-machine-catalogue':'bluetooth-model-catalogue';
 const [selected,setSelected]=useState<Record<string,number>>({}),[notes,setNotes]=useState(''),[notice,setNotice]=useState(''),[comparison,setComparison]=useState<string[]>([]);
 useEffect(()=>{try{setSelected(standalone?cleanList(JSON.parse(localStorage.getItem('ddnz-kitchen-list-v1')||'{}'),catalog):cleanSeriesSelection(JSON.parse(localStorage.getItem('ddnz-model-series-'+family)||'{}'),family));}catch{}},[family,standalone]);
 function quantity(key:string,value:number){setSelected(prev=>{const next=standalone?cleanList({...prev,[key]:value},catalog):cleanSeriesSelection({...prev,[key]:value},family);try{localStorage.setItem(standalone?'ddnz-kitchen-list-v1':'ddnz-model-series-'+family,JSON.stringify(next));}catch{}return next;});}
 const chosen=allModels.filter(m=>selected[m.id]);
 const prefix=lang==='en'?'':`/${lang==='zh'?'zh-cn':lang}`;
 const schema={'@context':'https://schema.org','@type':'ItemList',name:family==='coffee'?c.coffeeTitle:c.speakerTitle,numberOfItems:models.length,itemListElement:models.map((m,i)=>({'@type':'ListItem',position:i+1,name:`${m.model} ${c.names[m.index]}`,image:'https://www.ddnzglobal.com'+m.image,url:`https://www.ddnzglobal.com${prefix}${canonicalPath||(family==='coffee'?'/sourcing/commercial-kitchen-equipment-from-china/':'/sourcing/audio-speakers-from-china/')}#series-model-${m.id}`}))};
 return <section className="product-series" id={id} lang={lang==='zh'?'zh-CN':lang} dir={lang==='ar'?'rtl':'ltr'} aria-labelledby={id+'-title'}>
 <script id={id+'-schema'} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
 <header><p className="product-series-kicker">DDNZ · {family==='coffee'?'COFFEE':'BLUETOOTH AUDIO'}</p><h2 id={id+'-title'}>{family==='coffee'?c.coffeeTitle:c.speakerTitle}</h2><p>{family==='coffee'?c.coffeeIntro:c.speakerIntro}</p>{family==='coffee'&&!standalone&&<a href={`${prefix}/sourcing/commercial-kitchen-equipment-from-china/?model=CK-129#commercial-kitchen-equipment`}>{c.existing} ↗</a>}</header>
 <div className="product-series-grid">{models.map(m=>{const specs=seriesSpecs(m,lang);return <article className="product-series-card" id={'series-model-'+m.id} key={m.id}>
 <ProductGallery model={m} locale={lang} name={c.names[m.index]}/>
 <div className="product-series-copy"><p className="product-series-code"><bdi>{m.model}</bdi></p><h3>{c.names[m.index]}</h3><p>{c.uses[m.index]}</p><dl>{specs.slice(0,3).map(s=><div key={s.key}><dt>{s.label}</dt><dd><bdi>{s.value}</bdi></dd></div>)}</dl>
 <details><summary>{c.details}</summary><dl>{specs.slice(3).map(s=><div key={s.key}><dt>{s.label}</dt><dd><bdi>{s.value}</bdi></dd></div>)}</dl><p>{c.notes[m.index]}</p><small>{c.caption}</small></details>
 <div className="product-series-actions">{onAdd&&<button type="button" onClick={()=>{onAdd(m.id);setNotice(`${m.model} · ${c.add}`);}}>{c.add} +</button>}{onCompare&&<button className="series-secondary" type="button" onClick={()=>onCompare(m.id)}>{c.compare}</button>}<a href={seriesQuote(lang,family,{[m.id]:1})}>{c.quote} ↗</a></div>
 {standalone&&<button className="series-secondary" type="button" aria-pressed={comparison.includes(m.id)} onClick={()=>setComparison(prev=>prev.includes(m.id)?prev.filter(v=>v!==m.id):[...prev.slice(-2),m.id])}>{c.compare} · {m.model}</button>}
 {((family==='speaker')||standalone)&&<label className="product-series-quantity">{c.quantity}<input aria-label={`${m.model} ${c.quantity}`} type="number" min="0" max="99" step="1" value={selected[m.id]||0} onChange={e=>quantity(m.id,Number(e.target.value))}/></label>}
 </div></article>;})}</div>
 {standalone&&comparison.length>0&&<div className="series-comparison"><h3>{c.compare}</h3><div className="series-table-scroll"><table><thead><tr><th>{c.details}</th>{models.filter(m=>comparison.includes(m.id)).map(m=><th key={m.id}>{m.model}</th>)}</tr></thead><tbody>{['power','voltage','pressure','water','boilers','size'].map(key=><tr key={key}><th>{c.fields[key]}</th>{models.filter(m=>comparison.includes(m.id)).map(m=><td key={m.id}>{seriesSpecs(m,lang).find(s=>s.key===key)?.value||c.confirm}</td>)}</tr>)}</tbody></table></div></div>}
 {(family==='speaker'||standalone)?<div id={family+'-model-request'} className="product-series-request"><h3>{c.selected}</h3>{chosen.length?<ul>{chosen.map(m=><li key={m.id}><bdi>{m.model} × {selected[m.id]}</bdi></li>)}</ul>:<p>{c.empty}</p>}<label>{c.destination}<textarea rows={3} maxLength={700} value={notes} onChange={e=>setNotes(e.target.value)}/></label>{chosen.length>0&&<a className="series-request-button" href={seriesQuote(lang,family,selected,notes)}>{c.request} ↗</a>}<small>{c.save}</small>{standalone&&<p><a href={`${prefix}/sourcing/commercial-kitchen-equipment-from-china/#commercial-kitchen-list`}>{c.mixedList} ↗</a></p>}</div>:<p className="product-series-unified"><a href="#commercial-kitchen-list">{c.selected} · {c.add} ↗</a></p>}<p className="product-series-terms">{c.terms}</p>{notice&&<p role="status">{notice}</p>}
 </section>;
}
