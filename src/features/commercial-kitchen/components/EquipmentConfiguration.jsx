import React, {useId, useState} from 'react';
import copy from '../locales/planning/configuration.json';
import {categoryProducts, kitchenCategories} from '../data/categories.mjs';

const normalLocale = locale => locale === 'zh-cn' ? 'zh' : locale;
export const emptyConfiguration = {standard:'0', electrical:'', documents:''};
export function configurationBrief(locale, value) {
 const t=copy[normalLocale(locale)] || copy.en;
 return [`${t.standard}: ${t.options[Number(value.standard)]}`,`${t.electrical}: ${value.electrical}`,`${t.documents}: ${value.documents}`].join('\n');
}
export function ConfigurationFields({locale='en',value,onChange}) {
 const t=copy[normalLocale(locale)] || copy.en,id=useId();
 const update=(key,event)=>onChange({...value,[key]:event.target.value});
 return <fieldset className="equipment-config-fields"><legend>{t.title}</legend><p>{t.intro}</p><div className="equipment-config-grid">
 <label>{t.standard}<select value={value.standard} onChange={e=>update('standard',e)}>{t.options.map((label,index)=><option key={index} value={String(index)}>{label}</option>)}</select></label>
 <label>{t.electrical}<input value={value.electrical} onChange={e=>update('electrical',e)} maxLength={300} aria-describedby={`${id}-electric`}/><small id={`${id}-electric`}>{t.electricalHint}</small></label>
 <label>{t.documents}<input value={value.documents} onChange={e=>update('documents',e)} maxLength={400} aria-describedby={`${id}-documents`}/><small id={`${id}-documents`}>{t.documentsHint}</small></label>
 </div></fieldset>;
}
export function IceSpecificationComparison({locale='en'}) {
 const t=copy[normalLocale(locale)] || copy.en,products=categoryProducts(kitchenCategories[0]);
 return <section className="section wrap equipment-config" aria-labelledby="ice-specification-title"><h2 id="ice-specification-title">{t.compare}</h2><div className="equipment-spec-scroll" role="region" aria-label={t.compare} tabIndex="0"><table><thead><tr>{t.headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{products.map(p=><tr key={p.id}><th scope="row"><a href={`#model-${p.id}`}><bdi>{p.model}</bdi></a></th><td><bdi>{p.specs['Daily output']}</bdi></td><td><bdi>{p.dimensions}</bdi></td><td>{t.pending}</td></tr>)}</tbody></table></div><p className="fine">{t.note}</p></section>;
}
export default function EquipmentConfiguration({locale='en',gulf=false}) {
 locale=normalLocale(locale);const t=copy[locale] || copy.en,prefix=locale==='en'?'':locale==='zh'?'/zh-cn':'/'+locale;
 const [config,setConfig]=useState(emptyConfiguration),[model,setModel]=useState(''),[destination,setDestination]=useState(''),[needs,setNeeds]=useState('');
 const brief=[t.title,`${t.model}: ${model}`,`${t.destination}: ${destination}`,configurationBrief(locale,config),`${t.needs}: ${needs}`].join('\n');
 const quote=`${prefix}/get-a-quote/?`+new URLSearchParams({leadGoal:'Product Sourcing',source:gulf?'gulf_configuration':'ice_configuration',overviewBrief:brief,dest:destination});
 const routes=['/sourcing/restaurant-kitchen-packages-from-china/cafe-light-meals/','/sourcing/restaurant-kitchen-packages-from-china/casual-dining/','#equipment-configuration'];
 return <section className="section wrap equipment-config" id="equipment-configuration" dir={locale==='ar'?'rtl':'ltr'}>
 {gulf&&<><h2>{t.scenarios}</h2><div className="equipment-config-grid">{t.sceneNames.map((name,index)=><article key={name}><h3><a href={index===2?routes[index]:prefix+routes[index]} onClick={()=>{if(index===2)setNeeds(t.sceneTexts[index]);}}>{name} <span aria-hidden="true">↗</span></a></h3><p>{t.sceneTexts[index]}</p></article>)}</div></>}
 <ConfigurationFields locale={locale} value={config} onChange={setConfig}/>
 <div className="equipment-config-grid"><label>{t.model}<input value={model} onChange={e=>setModel(e.target.value)} maxLength={500}/></label><label>{t.destination}<input value={destination} onChange={e=>setDestination(e.target.value)} maxLength={160}/></label><label>{t.needs}<textarea value={needs} onChange={e=>setNeeds(e.target.value)} maxLength={1500}/></label></div>
 <a className="button primary" href={quote}>{t.next} <span aria-hidden="true">→</span></a><p className="fine">{t.review}</p>
 </section>;
}
