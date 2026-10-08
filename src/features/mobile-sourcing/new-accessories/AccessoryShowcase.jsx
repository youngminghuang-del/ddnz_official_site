import React, { useState, useId } from 'react';
import { copyFor, formatMoney, formatNumber } from '../catalog.mjs';
import { newAccessories } from './products.mjs';
import { accessoryCopy } from './copy.mjs';

export default function AccessoryShowcase({locale, draft, onSelect}) {
 const [group,setGroup]=useState('audio'),[selected,setSelected]=useState(newAccessories[0].id),[view,setView]=useState(0);
 const uid=useId(), c=key=>copyFor(accessoryCopy[key],locale), products=newAccessories.filter(p=>p.group===group);
 const p=newAccessories.find(p=>p.id===selected), added=draft.rows.some(r=>r.id===p.id);
 const choose=p=>{setSelected(p.id);setView(0);};
 const date=new Intl.DateTimeFormat(locale==='zh'?'zh-CN':locale,{dateStyle:'medium',timeZone:'UTC'}).format(new Date('2026-10-08T00:00:00Z'));
 return <section className="ms-section ms-new-range" id="new-accessories" aria-labelledby={uid+'-heading'}>
  <header className="ms-new-heading"><p className="ms-eyebrow">{c('eyebrow')}</p><h2 id={uid+'-heading'}>{c('title')}</h2><p>{c('intro')}</p></header>
  <div className="ms-new-tabs" role="group" aria-label={c('title')}>{['audio','style','gear'].map(key=><button key={key} type="button" aria-pressed={group===key} onClick={()=>{setGroup(key);choose(newAccessories.find(p=>p.group===key));}}>{c(key)}</button>)}</div>
  <div className="ms-new-picker" role="group" aria-label={c(group)}>{products.map(item=><button type="button" key={item.id} aria-pressed={p.id===item.id} onClick={()=>choose(item)}><img src={item.image} width="100" height="100" alt="" loading="lazy"/><span>{copyFor(item.name,locale)}</span></button>)}</div>
  <div className="ms-new-detail" key={p.id}>
   <div className="ms-new-gallery"><figure><img src={p.images[view]} width="1000" height="1000" alt={copyFor(p.name,locale)+' · '+formatNumber(view+1,locale)} loading="lazy" decoding="async"/></figure>
    <div className="ms-new-thumbs" role="group" aria-label={c('views')}>{p.images.map((src,index)=><button type="button" key={src} aria-pressed={index===view} aria-label={c('views')+' '+formatNumber(index+1,locale)} onClick={()=>setView(index)}><img src={src} alt="" width="70" height="70" loading="lazy"/></button>)}</div>
   </div>
   <div className="ms-new-description"><p className="ms-eyebrow">{p.code} / {c(group)}</p><h3>{copyFor(p.name,locale)}</h3><p>{copyFor(p.detail,locale)}</p>
    <dl className="ms-new-facts"><div><dt>{c('price')}</dt><dd><bdi>{p.priceRange?p.priceRange.map(v=>formatMoney(v,locale,p.currency)).join(' – '):formatMoney(p.tiers[0][1],locale,p.currency)}</bdi></dd></div><div><dt>{c('moq')}</dt><dd>{formatNumber(p.addQty,locale)} <span>{c('pieces')}</span></dd></div></dl>
    <button className="ms-button" type="button" onClick={()=>onSelect(p.id)} aria-pressed={added}>{c(added?'added':'add')} <span aria-hidden="true">{added?'✓':'+'}</span></button>
    <p><a className="ms-secondary" href={'#'+({audio:'audio-selection',style:'strap-selection',gear:'power-selection'}[group])}>{c('more')} ↓</a></p>
    <details className="ms-new-notes"><summary>{c('details')}</summary>{p.tiers&&<dl>{p.tiers.map(([q,value])=><div key={q}><dt>{formatNumber(q,locale)}+</dt><dd><bdi>{formatMoney(value,locale,p.currency)}</bdi></dd></div>)}</dl>}<p>{c('note').replace('{date}',date)}</p><a href={p.sourceRecord.conversion.source} target="_blank" rel="noopener noreferrer">{c('fxSource')} ↗</a></details>
   </div>
  </div>
 </section>;
}
