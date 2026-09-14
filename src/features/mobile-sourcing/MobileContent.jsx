import React, { useEffect, useRef, useState, useId } from 'react';
import { mobileProducts, productById, copyFor, referencePrice, formatMoney, formatNumber } from './catalog.mjs';
import SupplierComparison from './SupplierComparison.jsx';
import OrderChecks from './OrderChecks.jsx';
import { inspectionCopy, inspectionOptions } from './inspection-content.mjs';
import { pages, ui, editorial } from './locales.mjs';
import { mobilePages, mobileArticleSlugs } from './routes.mjs';
import { localizedProductPath } from '../../lib/productLocalization.mjs';
import { emptyDraft, normalizeDraft, MOBILE_DRAFT_KEY, parseQuantity, buyingScenario, buildMobilePayload, validateMobileDraft } from './buying.mjs';
import { submitInquiry, isProductionHost, currentHostname } from '../commercial-kitchen/data/inquiry.mjs';

const tr=(locale)=>(key)=>copyFor(ui[key],locale);
const link=(id,locale)=>localizedProductPath(mobilePages.find(p=>p.id===id).path,locale);
const money=(n,l,c='CNY')=><bdi>{formatMoney(n,l,c)}</bdi>;
function Field({label,value,onChange,error,hint,type='text',multiline=false,inputMode,id,required=false,disabled=false}){
 const own=useId(),uid=id||own;
 return <label className={'ms-field'+(multiline?' ms-wide':'')} htmlFor={uid}><span>{label}{required?' *':''}</span>
 {multiline?<textarea id={uid} value={value} onChange={e=>onChange(e.target.value)} rows={3} maxLength={1500} aria-invalid={!!error} aria-describedby={uid+'-help'} dir="auto" required={required}/>:
 <input id={uid} type={type} inputMode={inputMode} value={value} onChange={e=>onChange(e.target.value)} maxLength={type==='email'?254:300} aria-invalid={!!error} aria-describedby={uid+'-help'} dir={type==='email'?'ltr':'auto'} required={required} disabled={disabled}/>}
 <small id={uid+'-help'} className={error?'ms-error':''}>{error||hint||''}</small></label>;
}
export function MobileCategoryLinks({locale='en',current}){
 const c=tr(locale);
 return <nav className="ms-category-nav" aria-label={c('hub')}>
 {['hub','cases','straps','compare'].map(id=><a href={link(id,locale)} key={id} aria-current={current===id?'page':undefined}>{c(id)}</a>)}
 <a href={localizedProductPath('/screen-protectors',locale)}>{c('film')}</a></nav>;
}
function ProductCard({p,locale,selected,onSelect}){
 const c=tr(locale);
 return <article className="ms-product" id={'style-'+p.id} data-style-id={p.id}>
  <div className="ms-product-visual"><img src={p.image} width="1000" height="1000" alt={copyFor(p.name,locale)} loading="lazy" decoding="async"/></div>
  <div className="ms-product-body"><div className="ms-product-meta"><span>{p.code}</span><span>{c(p.type==='sample'?'style':p.assembly||'listing')}</span></div>
  <h3>{copyFor(p.name,locale)}</h3><p>{copyFor(p.detail,locale)}</p>
  {p.tiers?<div className="ms-tier-block"><p>{c('reference')}</p><dl>{p.tiers.map(([min,price],i)=><div key={min}><dt>{formatNumber(min,locale)}{i<p.tiers.length-1?`–${formatNumber(p.tiers[i+1][0]-1,locale)}`:'+'}</dt><dd>{money(price,locale)}</dd></div>)}</dl>
   <p className="ms-seller" dir="auto">{p.seller}</p><p>{copyFor(p.pack,locale)}</p>{p.sample&&<p>{c('sample')}: {money(p.sample,locale)}</p>}</div>:<p className="ms-on-request">{c('onRequest')}</p>}
  <details><summary>{c('checks')}</summary><p>{copyFor(p.check,locale)}</p></details>
  <div className="ms-product-actions"><button type="button" className={selected?'ms-added':'ms-button'} onClick={()=>onSelect(p.id)} aria-pressed={selected}>{c(selected?'selected':'select')}<span aria-hidden="true">{selected?'✓':'+'}</span></button>
  <div>{p.url&&<a href={p.url} target="_blank" rel="noopener noreferrer">{c('source')} ↗</a>}{p.original&&<a href={p.original} target="_blank" rel="noopener noreferrer">{c('original')} ↗</a>}</div></div></div>
 </article>;
}
function QuoteTable({products,locale,qty,onQuantity}){
 const c=tr(locale),q=parseQuantity(qty);
 return <section className="ms-section" id="price-comparison"><div className="ms-section-head"><div><p className="ms-eyebrow">CNY / {formatNumber(products.length,locale)}</p><h2>{c('comparison')}</h2><p>{c('compareIntro')}</p></div><Field id="ms-comparison-qty" label={c('quantity')} value={qty} onChange={onQuantity} inputMode="numeric" error={q===null?c('invalid'):undefined}/></div>
  <div className="ms-table-scroll" tabIndex="0" role="region" aria-label={c('comparison')}><table><thead><tr><th scope="col">{c('product')}</th><th scope="col">{c('min')}</th><th scope="col">{c('unit')}</th><th scope="col">{c('total')}</th></tr></thead><tbody>{products.map(p=>{const price=referencePrice(p,q);return <tr key={p.id}><th scope="row"><a href={link(p.group,locale)+'#style-'+p.id}>{copyFor(p.name,locale)}</a><small>{p.seller}</small></th><td>{formatNumber(p.tiers[0][0],locale)}</td><td>{price===null?c('below'):money(price,locale)}</td><td>{price===null?'—':money(price*q,locale)}</td></tr>})}</tbody></table></div><p className="ms-small">{c('note')}</p><p className="ms-small">{c('quoteNote')} <a href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html" target="_blank" rel="noopener noreferrer">{c('fxSource')} ↗</a></p></section>;
}
function Calculator({locale,input,onChange,onAction}){
 const c=tr(locale),result=buyingScenario(input),products=mobileProducts.filter(p=>p.tiers);
 const change=(k,v)=>{onChange({...input,[k]:v,...(k==='currency'?{rate:v==='CNY'?'1':'',freight:'',tax:'',pack:'',other:'',sale:''}:{})});};
 return <section className="ms-calculator ms-section" id="buying-cost"><div><p className="ms-eyebrow">{c('compare')}</p><h2>{c('calculator')}</h2><p>{c('calcIntro')}</p><p className="ms-small">{c('calcHint')}</p></div><div>
 <div className="ms-calc-inputs" onBlur={()=>onAction('calculate')}>
 <label className="ms-field ms-wide"><span>{c('product')}</span><select value={input.id} onChange={e=>change('id',e.target.value)}>{products.map(p=><option key={p.id} value={p.id}>{p.code} · {copyFor(p.name,locale)}</option>)}</select></label>
 <Field id="ms-calc-quantity" label={c('quantity')} value={input.quantity} onChange={v=>change('quantity',v)} inputMode="numeric"/>
 <label className="ms-field"><span>{c('currency')}</span><select value={input.currency} onChange={e=>change('currency',e.target.value)}>{['CNY','USD','AED','SGD','MXN'].map(x=><option key={x}>{x}</option>)}</select></label>
 {input.currency!=='CNY'&&<Field id="ms-calc-rate" label={c('rate')} value={input.rate} onChange={v=>change('rate',v)} inputMode="decimal"/>}
 {['freight','tax','pack','other','sale'].map(k=><Field id={'ms-calc-'+k} key={k} label={c(k)+` (${input.currency})`} value={input[k]} onChange={v=>change(k,v)} inputMode="decimal"/>)}
 </div><div className="ms-calc-result" aria-live="polite">
 {result.status==='complete'?<><dl><div><dt>{c('landed')}</dt><dd>{money(result.unitCost,locale,input.currency)}</dd></div><div><dt>{c('cash')}</dt><dd>{money(result.batchCost,locale,input.currency)}</dd></div><div><dt>{c('gross')}</dt><dd className={result.grossProfit<0?'ms-negative':''}>{money(result.grossProfit,locale,input.currency)}</dd></div><div><dt>{c('margin')}</dt><dd className={result.grossMargin<0?'ms-negative':''} data-testid="mobile-margin">{formatNumber(result.grossMargin,locale,1)}%</dd></div></dl><p>{c('marginNote')}</p></>:<p>{c(result.status==='below'?'below':'incomplete')}</p>}
 </div></div></section>;
}
function Brief({draft,setDraft,locale,onPrivacy,onAction,pageId}){
 const c=tr(locale),id=useId(),[errors,setErrors]=useState({}),[status,setStatus]=useState('idle'),[production,setProduction]=useState(true),sending=useRef(false);
 useEffect(()=>setProduction(isProductionHost(currentHostname())),[]);
 useEffect(()=>{setStatus(s=>s==='submitting'?s:'idle')},[draft.rows.length,draft.inspectionChecks.join(',')]);
 const payload=buildMobilePayload(draft,locale);
 const change=(key,value)=>{setDraft(d=>({...d,contact:{...d.contact,[key]:value}}));setErrors(e=>({...e,[key]:undefined}));if(status!=='submitting')setStatus('idle');};
 const rowChange=(row,key,value)=>{setDraft(d=>({...d,rows:d.rows.map(r=>r.id===row.id?{...r,[key]:value}:r)}));setErrors(e=>({...e,[row.id+'-'+key]:undefined}));setStatus('idle');};
 const err=key=>errors[key]?c(errors[key]):undefined;
 async function submit(e){e.preventDefault();if(sending.current)return;const next=validateMobileDraft(draft);setErrors(next);if(Object.keys(next).length){document.getElementById(id+'-'+Object.keys(next)[0])?.focus();return;}
  sending.current=true;setStatus('submitting');try{const r=await submitInquiry(payload);setStatus(r.mode==='preview'?'preview':'success');if(r.mode==='production')onAction('submit_success');}catch{setStatus('error');if(production)onAction('submit_error');}finally{sending.current=false;}}
 return <section className="ms-section ms-brief" id="buying-brief"><span id="rfq"/><div className="ms-section-head"><div><p className="ms-eyebrow">DDNZ / {formatNumber(draft.rows.length,locale)} {c('selected')}</p><h2>{c('brief')}</h2><p>{c('briefIntro')}</p></div></div>
 <form noValidate onSubmit={submit}><fieldset disabled={status==='submitting'}>
 <div className="ms-brief-rows" id={id+'-rows'} tabIndex="-1">{draft.rows.length===0&&draft.inspectionChecks.length>0?<p>{copyFor(inspectionCopy.inspectionOnly,locale)}</p>:draft.rows.length===0?<p>{c('empty')} <a href={pageId==='compare'?link('cases',locale)+'#collection':'#collection'}>{c('range')} ↑</a></p>:draft.rows.map(row=>{const p=productById(row.id);return <div className="ms-brief-row" key={row.id} data-brief-style={row.id}><div className="ms-brief-style"><img src={p.image} alt="" width="90" height="90" loading="lazy"/><strong>{p.code} · {copyFor(p.name,locale)}</strong><button type="button" className="ms-text-button" onClick={()=>{setDraft(d=>({...d,rows:d.rows.filter(r=>r.id!==row.id)}));onAction('remove_style');setStatus('idle');}} aria-label={c('remove')+' '+copyFor(p.name,locale)}>{c('remove')}</button></div>
 <Field id={id+'-'+row.id+'-quantity'} label={c('quantity')} value={row.quantity} onChange={v=>rowChange(row,'quantity',v)} inputMode="numeric" error={err(row.id+'-quantity')} required/>
 <Field id={id+'-'+row.id+'-model'} label={c('model')} value={row.model} onChange={v=>rowChange(row,'model',v)} error={err(row.id+'-model')} required={p.group==='cases'}/>
 <Field id={id+'-'+row.id+'-colours'} label={c('colours')} value={row.colours} onChange={v=>rowChange(row,'colours',v)} error={err(row.id+'-colours')} required/>
 </div>})}</div>{errors.rows&&<p className="ms-error" role="alert">{c('needStyle')}</p>}
 <div className="ms-contact-fields">{['name','email','company','destination'].map(key=><Field id={id+'-'+key} key={key} label={c(key)} value={draft.contact[key]} onChange={v=>change(key,v)} error={err(key)} required={key!=='company'} type={key==='email'?'email':'text'} hint={key==='destination'?c('destinationHint'):undefined}/>)}
 <label className="ms-field"><span>{c('channel')}</span><select value={draft.contact.channel} onChange={e=>change('channel',e.target.value)}>{ui.channels.map((x,i)=><option value={String(i)} key={i}>{copyFor(x,locale)}</option>)}</select></label>
 <Field id={id+'-packaging'} label={c('packaging')} value={draft.contact.packaging} onChange={v=>change('packaging',v)} hint={c('packHint')} multiline/>
 <fieldset className="ms-inspection-options ms-wide"><legend>{copyFor(inspectionCopy.checksLabel,locale)}</legend>{inspectionOptions.map(option=><label key={option.id}><input type="checkbox" checked={draft.inspectionChecks.includes(option.id)} onChange={e=>setDraft(d=>({...d,inspectionChecks:e.target.checked?[...d.inspectionChecks,option.id]:d.inspectionChecks.filter(x=>x!==option.id)}))}/><span>{copyFor(option.label,locale)}</span></label>)}</fieldset>
 <Field id={id+'-notes'} label={c('notes')} value={draft.contact.notes} onChange={v=>change('notes',v)} error={err('notes')} hint={copyFor(inspectionCopy.inspectionHint,locale)} multiline/>
 </div></fieldset>
 <details className="ms-review" onToggle={e=>{if(e.currentTarget.open)onAction('review_brief')}}><summary>{c('review')}</summary><pre dir="auto">{payload.message}</pre></details>
 <p className="ms-small">{c('privacyText')} <button type="button" className="ms-text-button" onClick={onPrivacy}>{c('privacy')}</button></p>
 <button className="ms-button" type="submit" disabled={status==='submitting'}>{c(status==='submitting'?'sending':production?'send':'simulate')}<span aria-hidden="true">→</span></button><p className="ms-small">{c(production?'scope':'previewScope')}</p>
 {['success','preview','error'].includes(status)&&<p className={status==='error'?'ms-error':'ms-status'} role={status==='error'?'alert':'status'}>{c(status)}</p>}
 </form></section>;
}
export default function MobileContent({pageId='cases',locale='en',onPrivacy=()=>{},onAction=(_action)=>{}}){
 const c=tr(locale),page=pages[pageId],[draft,setDraft]=useState(emptyDraft),[loaded,setLoaded]=useState(false),[filter,setFilter]=useState('all');
 useEffect(()=>{try{const saved=sessionStorage.getItem(MOBILE_DRAFT_KEY);if(saved)setDraft(normalizeDraft(JSON.parse(saved)));}catch{}setLoaded(true);},[]);
 useEffect(()=>{if(loaded)try{sessionStorage.setItem(MOBILE_DRAFT_KEY,JSON.stringify(draft));}catch{}},[draft,loaded]);
 useEffect(()=>setFilter('all'),[pageId]);
 const all=mobileProducts.filter(p=>pageId==='hub'||(pageId==='compare'?p.group==='cases':p.group===pageId));
 const visible=all.filter(p=>pageId!=='hub'||['color-ring','silicone-jmetec','rope-bintu','chain-trendcomm'].includes(p.id)).filter(p=>filter==='all'||(filter==='sample'?p.type==='sample':filter==='listing'?p.type==='listing':p.assembly===filter));
 const quoted=all.filter(p=>p.tiers);
 const requestInspection=id=>setDraft(d=>({...d,inspectionChecks:[...new Set([...d.inspectionChecks,id])]}));
 const add=id=>{if(draft.rows.some(r=>r.id===id)){document.getElementById('buying-brief')?.scrollIntoView({behavior:'smooth'});return;}const p=productById(id);setDraft(d=>({...d,rows:[...d.rows,{id,quantity:String(p.tiers?.[0][0]||100),model:'',colours:''}]}));onAction('add_style');};
 return <main className={'ms-page ms-'+pageId} lang={locale} dir={locale==='ar'?'rtl':'ltr'}>
 <nav className="ms-breadcrumbs" aria-label={c('home')}><a href={locale==='en'?'/':`/${locale}/`}>{c('home')}</a><span>/</span><a href="/products/">{c('products')}</a>{pageId!=='hub'&&<><span>/</span><a href={link('hub',locale)}>{c('hub')}</a></>}<span>/</span><span aria-current="page">{c(pageId)}</span></nav>
 <section className="ms-hero"><div><p className="ms-eyebrow">{copyFor(page.eyebrow,locale)}</p><h1>{copyFor(page.heading,locale)}</h1><p className="ms-lead">{copyFor(page.intro,locale)}</p><div className="ms-actions"><a className="ms-button" href={pageId==='hub'?'#categories':pageId==='compare'?'#price-comparison':'#collection'}>{c(pageId==='compare'?'comparison':'range')}<span aria-hidden="true">↓</span></a><a href="#buying-brief" className="ms-secondary">{c('brief')} ↗</a></div></div><figure><img src={page.image} alt={c(pageId==='compare'?'cases':pageId)} width="1200" height="1200" fetchPriority="high"/><figcaption>{c(pageId==='straps'?'set':pageId==='hub'?'cases':pageId==='compare'?'checks':'style')}</figcaption></figure></section>
 <MobileCategoryLinks locale={locale} current={pageId}/>
 {pageId==='hub'&&<section id="categories" className="ms-section"><div className="ms-section-head"><h2>{c('range')}</h2></div><div className="ms-families">{['cases','straps','film'].map((key,i)=><a key={key} href={key==='film'?localizedProductPath('/screen-protectors',locale):link(key,locale)} onClick={()=>onAction('view_category')} className={'ms-family ms-family-'+key}><img src={key==='film'?'/screen-protector-media/assets/001-kit-photo.jpg':pages[key].image} alt={c(key)} width="800" height="800" loading="lazy"/><div><span className="ms-eyebrow">0{i+1}</span><h3>{c(key)}</h3><p>{key==='film'?c('packing'):copyFor(pages[key].intro,locale)}</p><span className="ms-secondary">{c('view')} ↗</span></div></a>)}</div>
 <div className="ms-power-entry" id="power"><img src="/images/product-showcase/mobile/family-chargers-v2.webp" alt={locale==='es'?'Cargadores':locale==='ar'?'شواحن':'Chargers'} width="240" height="240" loading="lazy"/><div><h3>{locale==='es'?'Carga y alimentación':locale==='ar'?'الشحن والطاقة':'Charging & power'}</h3><p>{locale==='es'?'Indique conector, enchufe, potencia, cables incluidos y mercado de destino. Revisamos la configuración y documentación antes de cotizar.':locale==='ar'?'حدد الموصل والقابس والقدرة والكابلات المشمولة وسوق الوجهة. نراجع التكوين والوثائق قبل عرض السعر.':'Specify connector, wall plug, output, included cables and destination market. We review the configuration and documentation before quoting.'}</p><a className="ms-secondary" href={(locale==='en'?'':'/'+locale)+'/get-a-quote/'}>{c('brief')} ↗</a></div></div></section>}
 {pageId==='compare'&&<section className="ms-section ms-editorial"><h2>{c('checks')}</h2><div>{editorial.compare.map(([title,body],i)=><article key={i}><span className="ms-step">0{i+1}</span><h3>{copyFor(title,locale)}</h3><p>{copyFor(body,locale)}</p></article>)}</div><a className="ms-secondary" href={link('cases',locale)}>{c('cases')} ↗</a></section>}
 {pageId!=='compare'&&<section className="ms-section" id="collection"><span id="assortment"/><div className="ms-section-head"><div><p className="ms-eyebrow">{c('products')}</p><h2>{c('range')}</h2></div><a href="#buying-brief" className="ms-brief-count" aria-live="polite">{c('brief')} · {formatNumber(draft.rows.length,locale)} ↓</a></div>
 <div className="ms-filters" role="group" aria-label={c('filters')}>{(pageId==='straps'?['all','set','strap','chain','charm','component']:['all','sample','listing']).map(key=><button type="button" key={key} aria-pressed={filter===key} onClick={()=>setFilter(key)}>{c(key==='sample'?'samples':key==='listing'?'priced':key)}</button>)}</div>
 <div className="ms-product-grid">{visible.map(p=><ProductCard key={p.id} p={p} locale={locale} selected={draft.rows.some(r=>r.id===p.id)} onSelect={add}/>)}</div>
 {(pageId==='cases'||pageId==='hub')&&<p className="ms-fit-note">{c('fitNote')} <a href="https://www.apple.com/iphone/" target="_blank" rel="noopener noreferrer">{c('apple')} ↗</a></p>}
 </section>}
 <QuoteTable products={quoted} locale={locale} qty={draft.comparisonQty} onQuantity={v=>{setDraft(d=>({...d,comparisonQty:v}));onAction('compare_quantity');}}/>
 {(pageId==='compare'||pageId==='hub')&&<SupplierComparison locale={locale} pageId={pageId} onRequest={requestInspection}/>}
 {pageId!=='compare'&&<section className="ms-section ms-editorial" id="control"><h2>{c('checks')}</h2><div>{editorial[pageId].map(([title,body],i)=><article key={i}><span className="ms-step">0{i+1}</span><h3>{copyFor(title,locale)}</h3><p>{copyFor(body,locale)}</p></article>)}</div>{pageId==='cases'&&<a className="ms-secondary" href={link('compare',locale)}>{c('compare')} ↗</a>}</section>}
 {pageId!=='straps'&&<OrderChecks locale={locale} onAction={onAction} onRequest={requestInspection}/>}
 <Calculator locale={locale} input={draft.calculator} onChange={v=>setDraft(d=>({...d,calculator:v}))} onAction={onAction}/>
 <Brief pageId={pageId} draft={draft} setDraft={setDraft} locale={locale} onPrivacy={onPrivacy} onAction={onAction}/>
 <section className="ms-section ms-related"><h2>{c('related')}</h2><MobileCategoryLinks locale={locale}/><div>{mobileArticleSlugs.map((slug,i)=><a href={'/blog/'+slug+'/'} key={slug}><small>{c('englishArticle')}</small>{['Mixed-SKU cases: MOQ, packing and reorders','Magnetic phone cases: dealer verification','Ring stands: four-sample comparison'][i]} ↗</a>)}</div></section>
 </main>;
}
