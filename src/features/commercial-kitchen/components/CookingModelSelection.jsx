import React, {useState} from 'react';
import {additionalCookingModels} from '../data/additionalCookingModels.mjs';
import copy from '../locales/planning/cooking-selection.json';
import configCopy from '../locales/planning/configuration.json';
import {ConfigurationFields,configurationBrief,emptyConfiguration} from './EquipmentConfiguration';

export function cookingQuote(locale,category,models,selection,destination,notes,configuration) {
 const t=copy[locale], c=configCopy[locale],prefix=locale==='en'?'':locale==='zh'?'/zh-cn':'/'+locale;
 const brief=[category,...models.filter(p=>selection[p.id]>0).map(p=>`${p.model} × ${selection[p.id]} · ${p.metric} · ${p.power} · ${p.dimensions}${p.thickness?` · ${t.thickness}: ${p.thickness} · ${t.controls}: ${p.controls}`:''}`),`${c.destination}: ${destination}`,notes,configurationBrief(locale,configuration)].join('\n');
 return `${prefix}/get-a-quote/?`+new URLSearchParams({leadGoal:'Product Sourcing',source:'kitchen_category',overviewBrief:brief,dest:destination});
}
export default function CookingModelSelection({category,locale='en',onAdd=null}) {
 const t=copy[locale],c=configCopy[locale],models=additionalCookingModels[category.id]||[],fryer=category.id==='electric-fryers';
 const [selection,setSelection]=useState({}),[destination,setDestination]=useState(''),[notes,setNotes]=useState(''),[config,setConfig]=useState(emptyConfiguration);
 if(!models.length)return null;
 const amount=(id,n)=>setSelection(s=>({...s,[id]:Math.max(0,Math.min(999,Math.floor(n)||0))}));
 const groups=fryer?['single','twin','drain']:['8','12','16'];
 return <section className="section wrap equipment-config cooking-selection" id="additional-models" dir={locale==='ar'?'rtl':'ltr'}><h2>{t.title}</h2><p>{fryer?t.fryerNote:t.griddleNote}</p>{groups.map(group=><div key={group} className="cooking-model-group"><h3>{fryer?t[group]:`${group} mm · ${t.chrome}`}</h3><div className="equipment-spec-scroll" role="region" tabIndex="0" aria-label={fryer?t[group]:`${group} mm`}><table><thead><tr>{[t.model,fryer?t.capacity:t.surface,t.power,t.dimensions,t.voltage,...(fryer?[]:[t.controls]),t.add].map((h,i)=><th key={i} scope="col">{h}</th>)}</tr></thead><tbody>{models.filter(p=>p.group===group).map(p=><tr key={p.id} id={`model-${p.id}`}><th scope="row"><bdi>{p.model}</bdi></th><td><bdi>{p.metric}</bdi></td><td><bdi>{p.power}</bdi></td><td><bdi>{p.dimensions}</bdi></td><td><bdi>{p.voltage}</bdi></td>{!fryer&&<td>{p.controls}</td>}<td><button className="text-link" type="button" aria-label={`${t.add} ${p.model}`} onClick={()=>{if(onAdd)onAdd(p.id);else amount(p.id,(selection[p.id]||0)+1);document.getElementById(onAdd?'category-rfq':'cooking-rfq')?.scrollIntoView({block:'start'});}}>{t.add}</button></td></tr>)}</tbody></table></div></div>)}
 {!onAdd&&<div id="cooking-rfq"><h3>{t.selected}</h3>{models.filter(p=>selection[p.id]>0).map(p=><div className="cooking-selected-row" key={p.id}><strong><bdi>{p.model}</bdi></strong><label>{t.quantity}<input aria-label={`${p.model} ${t.quantity}`} type="number" min="1" max="999" value={selection[p.id]} onChange={e=>amount(p.id,Number(e.target.value))}/></label><button className="text-link" onClick={()=>amount(p.id,0)}>{t.remove}</button></div>)}<div className="equipment-config-grid"><label>{c.destination}<input maxLength={160} value={destination} onChange={e=>setDestination(e.target.value)}/></label><label>{c.needs}<textarea maxLength={1500} value={notes} onChange={e=>setNotes(e.target.value)}/></label></div><ConfigurationFields locale={locale} value={config} onChange={setConfig}/>{Object.values(selection).some(n=>n>0)&&<a className="button primary" href={cookingQuote(locale,category.label,models,selection,destination,notes,config)}>{c.next}</a>}<p className="fine">{c.review}</p></div>}
 </section>;
}
