import SupplierDimensionVisual from './SupplierDimensionVisual.jsx';
import React,{useState} from 'react';
import {copyFor} from './catalog.mjs';
import {ui} from './locales.mjs';
import {inspectionCopy as copy,supplierDimensions} from './inspection-content.mjs';
export default function SupplierComparison({locale='en',onRequest=()=>{}}){
 const [selected,setSelected]=useState('materials'),dimension=supplierDimensions.find(x=>x.id===selected),c=key=>copyFor(copy[key],locale);
 return <section className="ms-section ms-supplier-review" id="supplier-comparison">
  <div className="ms-section-head"><div><p className="ms-eyebrow">DDNZ / {copyFor(ui.checks,locale)}</p><h2>{c('title')}</h2><p>{c('intro')}</p></div></div>
  <div className="ms-dimension-buttons" role="group" aria-label={c('dimensions')}>{supplierDimensions.map((d,i)=><button type="button" key={d.id} aria-pressed={selected===d.id} onClick={()=>setSelected(d.id)}><span>{String(i+1).padStart(2,'0')}</span>{copyFor(d.name,locale)}</button>)}</div>
  <div className="ms-dimension-detail"><SupplierDimensionVisual dimension={dimension} locale={locale}/><div aria-live="polite"><h3>{copyFor(dimension.name,locale)}</h3><p className="ms-eyebrow">{c('compare')}</p><p>{copyFor(dimension.compare,locale)}</p><p className="ms-eyebrow">{c('verify')}</p><p>{copyFor(dimension.verify,locale)}</p><a href="#buying-brief" className="ms-button" onClick={()=>onRequest('factory')}>{c('request')} ↗</a></div></div>

 </section>;
}
