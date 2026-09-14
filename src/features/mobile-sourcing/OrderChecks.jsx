import React,{useState} from 'react';
import {copyFor} from './catalog.mjs';
import {inspectionCopy as copy,orderCheckSteps} from './inspection-content.mjs';
export default function OrderChecks({locale='en',onAction=(_action)=>{},onRequest=(_id)=>{}}){
 const [selected,setSelected]=useState('sample'),step=orderCheckSteps.find(s=>s.id===selected),c=key=>copyFor(copy[key],locale);
 return <section className="ms-section ms-order-checks" id="evidence"><div className="ms-section-head"><div><p className="ms-eyebrow">DDNZ / 01 — 04</p><h2>{c('workflow')}</h2><p>{c('workflowIntro')}</p></div></div>
  <div className="ms-stage-buttons" role="group" aria-label={c('workflow')}>{orderCheckSteps.map((s,i)=><button type="button" aria-pressed={s.id===selected} key={s.id} onClick={()=>setSelected(s.id)}><span>{String(i+1).padStart(2,'0')}</span>{copyFor(s.title,locale)}</button>)}</div>
  <div className="ms-stage-panel"><figure key={step.id}>{step.video?<video controls preload="none" playsInline poster={step.image} onPlay={()=>onAction('play_video')} aria-label={copyFor(step.title,locale)}><source src={step.video} type="video/mp4"/></video>:<img src={step.image} alt={copyFor(step.title,locale)} width="1100" height="850" loading="lazy"/>}</figure><div aria-live="polite"><p className="ms-eyebrow">0{orderCheckSteps.indexOf(step)+1} / 04</p><h3>{copyFor(step.title,locale)}</h3><p>{copyFor(step.text,locale)}</p><div className="ms-stage-record"><strong>{c('deliverable')}</strong><p>{copyFor(step.record,locale)}</p></div><a href="#buying-brief" className="ms-secondary" onClick={()=>onRequest(step.id)}>{c('request')} ↗</a></div></div>
  <p className="ms-small">{c('examples')}</p>
 </section>;
}
