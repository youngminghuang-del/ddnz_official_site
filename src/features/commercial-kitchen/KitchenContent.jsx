import { marginHref, equipmentFilters, kitchenHeroItems, legacyHotGroups } from './data/catalogueNavigation.mjs';
import { coffeePath } from '../coffee/data.mjs';
import { seriesModels } from '../product-series/models.mjs';
import CatalogueHeroMedia from '../../components/catalogue-hero/CatalogueHeroMedia';
import React,{useState,useEffect,useRef} from 'react';
import { quoteLinkProps } from '../../lib/quoteLinkPolicy.mjs';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { kitchenFaq } from './data/discovery.mjs';
import { kitchenPurchasePaths, orderSupportPaths } from './data/purchase-paths.mjs';
import { requestedKitchenModel } from './data/categories.mjs';
import './styles/category.css';

import catalog from './data/products.mjs';
import launch from './data/launch.mjs';
import InquiryActions from './components/InquiryActions.jsx';
import {formatPrice} from './data/fx.mjs';
const products=[...launch.featuredProductIds.map(id=>catalog.find(p=>p.id===id)),...catalog.filter(p=>!launch.featuredProductIds.includes(p.id))];
import {quantity,cleanList,addItems,buyingIntents,makeBrief,currentBuyingTarget} from './data/model.mjs';
import './styles/kitchen.css';
import ProductPrice from './components/ProductPrice.jsx';

const countries=['United Arab Emirates','Saudi Arabia','Qatar','Oman','Kuwait','Bahrain','Singapore','Malaysia','Indonesia','Thailand','Vietnam','Philippines','Mexico','Brazil','Chile','Colombia','Peru','Other'];
const featuredHotGroups = new Set(['steam','noodle','round']);
const hotModels = [...products.filter(p=>featuredHotGroups.has(p.handbookGroup)), ...products.filter(p=>!featuredHotGroups.has(p.handbookGroup))];
const byId=id=>products.find(p=>p.id===id);
function ModelQuoteLink({product}) {
 const context=new URLSearchParams({leadGoal:'Product Sourcing',source:'commercial_kitchen_product',
   notes:`Please quote ${product.model} — ${product.name}. ${product.detail}. Confirm electrical configuration for my destination.`});
 return <a className="estimate-price" {...quoteLinkProps('/get-a-quote/?'+context)}>Request model quote ↗</a>;
}
function OtherJuicerPowers({product}){
 if(!product.otherPowers)return null;
 const choices=product.otherPowers.map(watts=>`${watts} W`).join(', ');
 const context=new URLSearchParams({leadGoal:'Product Sourcing',source:'commercial_kitchen_product',notes:`Please quote a commercial cold press juicer in a power option other than TK-600. Available options to discuss: ${choices}. Please specify desired power and quantity.`});
 return <div className="juicer-options"><p><strong>Other power options</strong><br/>{choices}</p><a className="text-link" {...quoteLinkProps('/get-a-quote/?'+context)}>Request a separate quote <Arrow diagonal/></a></div>;
}
function Arrow({diagonal=false}){return <span aria-hidden="true">{diagonal?'↗':'→'}</span>}
export default function KitchenContent({onPrivacy,onExplore=(_action)=>{}}){
 const location=useLocation();
 const {language}=useLanguage();
 const homePath=language==='en'?'/':`/${language==='zh'?'zh-cn':language}/`;
 const [category,setCategory]=useState('all'),[search,setSearch]=useState(''),[all,setAll]=useState(false);
 const [list,setList]=useState(()=>{try{return cleanList(JSON.parse(localStorage.getItem('ddnz-kitchen-list-v1')),products)}catch{return {}}});
 const [compared,setCompared]=useState([]),[modal,setModal]=useState(null),[toast,setToast]=useState('');
 const [destination,setDestination]=useState('');
 const [form,setForm]=useState({type:'Importer / wholesaler',port:'',company:'',contact:'',notes:'',buyingTargets:{}});
 const [brief,setBrief]=useState('');const dialog=useRef(null),returnFocus=useRef(null);
 const count=Object.values(list).reduce((a,b)=>a+b,0),selected=products.filter(p=>list[p.id]);
 const filter=equipmentFilters.find(item=>item.id===category) || equipmentFilters[0];
 const [legacyGroup,setLegacyGroup]=useState('');
 const ordered=category==='hot'?hotModels:products;
 const filtered=ordered.filter(p=>(!filter.categories.length||filter.categories.includes(p.category))
   &&(!legacyGroup||p.handbookGroup===legacyGroup)
   &&`${p.name} ${p.model} ${p.metric} ${p.detail} ${p.dimensions} ${Object.values(p.specs).join(' ')}`.toLowerCase().includes(search.trim().toLowerCase()));
 const shown=all?filtered:filtered.slice(0,8);

 useEffect(()=>{
  const anchor=location.hash.slice(1);
  const params=new URLSearchParams(location.search);
  const model=requestedKitchenModel(location.search) || products.find(p=>anchor==='model-'+p.id||anchor==='catalog-'+p.id);
  const group=legacyHotGroups[anchor];
  const requestedFilter=equipmentFilters.find(item=>item.id===params.get('category'));
  if(model){setCategory('all');setLegacyGroup('');setSearch(model.model);onExplore('model_entry');}
  else if(group||anchor==='kitchen-induction-range'||anchor==='coffee-machine-catalogue'||(requestedFilter&&(!anchor||anchor==='commercial-kitchen-equipment'))){
    setCategory(anchor==='coffee-machine-catalogue'?'beverage':requestedFilter?.id || 'hot');setLegacyGroup(group || '');setSearch('');
  }
  if(!anchor)return;
  // A filtered model may only be mounted after the state update above.
  const timer=window.setTimeout(()=>document.getElementById(anchor)?.scrollIntoView(),100);
  return ()=>window.clearTimeout(timer);
 },[location.hash,location.search]);
 useEffect(()=>{try{localStorage.setItem('ddnz-kitchen-list-v1',JSON.stringify(list))}catch{}},[list]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),4000);return()=>clearTimeout(t)},[toast]);
 useEffect(()=>{setAll(false)},[category,search,legacyGroup]);
 function selectCategory(id){setCategory(id);setLegacyGroup('');setSearch('');}
 useEffect(()=>{setBrief('')},[list,form,destination]);
 useEffect(()=>{if(modal){returnFocus.current=document.activeElement;dialog.current?.showModal()}else{dialog.current?.close();returnFocus.current?.focus?.()}},[modal]);
 function add(id){setList(l=>addItems(l,{[id]:1},products));setToast(`${byId(id).model} added to your sourcing list.`);onExplore('add_to_list')}
 function update(id,value){setList(l=>cleanList({...l,[id]:quantity(value)},products));if(!quantity(value))setForm(f=>{const targets={...f.buyingTargets};delete targets[id];return {...f,buyingTargets:targets}})}
 function toggleCompare(id){if(compared.includes(id)){setCompared(compared.filter(x=>x!==id));return}if(compared.length===3){setToast('Compare up to 3 models. Remove one to add another.');return}setCompared([...compared,id])}
 function download(text,filename){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 async function copyBrief(){try{await navigator.clipboard.writeText(brief);setToast('Sourcing brief copied.')}catch{setToast('Clipboard unavailable. Use Download brief instead.')}}
 return <section className="ddnz-kitchen kitchen-brand" lang="en" dir="ltr" aria-label="Commercial kitchen equipment sourcing" onClick={event=>{const source=event.target.closest?.('[data-discovery-link]')?.dataset.discoveryLink;if(source)onExplore(source)}}>
 <a className="skip" href="#commercial-kitchen-equipment">Skip to equipment</a>
 <nav className="kitchen-subnav" aria-label="Commercial kitchen sections">
   <a href="#commercial-kitchen-equipment">Equipment</a>
   {compared.length>0&&<button type="button" disabled={compared.length<2} onClick={()=>setModal('compare')}>Compare ({compared.length}/3)</button>}
   <a href="#commercial-kitchen-list" className="kitchen-subnav-list">Your list <span>{count}</span></a>
 </nav><main id="commercial-kitchen-top">
 <nav className="kitchen-breadcrumb wrap" aria-label="Breadcrumb"><ol><li><Link to={homePath}>Home</Link></li><li><Link to="/products/">Products</Link></li><li aria-current="page">Commercial kitchen equipment</li></ol></nav>
 <section className="hero wrap catalogue-hero"><div className="hero-copy"><p className="eyebrow">DDNZ / MANUFACTURING & EXPORT</p><h1>Commercial kitchen equipment.<br/><em>Wholesale from China.</em></h1><p className="hero-description">DDNZ is a China-based manufacturer and exporter. Our commercial kitchen range includes equipment from specialist manufacturers. Compare {products.length} models and request a quote by model, configuration, quantity and destination.</p><nav className="kitchen-purchase-paths kitchen-purchase-illustrated" aria-label="Choose your purchasing task">
 {kitchenPurchasePaths.map(({href,label,description,image})=><a href={href} key={href} data-discovery-link="kitchen-journey"><img src={image} alt="" width="64" height="48" decoding="async"/><div><strong>{label}</strong><span>{description}</span></div><Arrow diagonal={!href.startsWith('#')}/></a>)}
 </nav></div>
 <CatalogueHeroMedia src="/commercial-kitchen-media/kitchen-hero.webp" alt="Commercial kitchen application" scene items={kitchenHeroItems}/>

 </section>

 <section id="commercial-kitchen-equipment" className="section wrap"><div className="section-heading"><div><p className="eyebrow">01 / THE EQUIPMENT EDIT</p><h2>Compare commercial<br/>kitchen equipment.</h2></div><p>Start with what your customers use. Compare core specifications and add the models you want to your sourcing list.</p></div>
 <span id="kitchen-induction-range" className="catalogue-anchor"/>
 {Object.keys(legacyHotGroups).map(anchor=><span key={anchor} id={anchor} className="catalogue-anchor"/>)}
 <span id="coffee-machine-catalogue" className="catalogue-anchor"/>
 {seriesModels.filter(m=>m.family==='coffee').map(m=><a key={m.id} id={'series-model-'+m.id}
   className={location.hash==='#series-model-'+m.id?'text-link':'catalogue-hidden-anchor'} href={coffeePath+'/#series-model-'+m.id}>View {m.model} on the coffee machine page ↗</a>)}
 <div className="catalog-tools">
   <div className="filters" aria-label="Equipment categories">{equipmentFilters.map(item=><button key={item.id}
     type="button" className={item.id===category?'active':''} aria-pressed={item.id===category} onClick={()=>selectCategory(item.id)}>
     {item.label}
   </button>)}</div>
   <label className="search"><span>Search equipment</span><input type="search" placeholder="Search model, type or capacity" value={search}
     onChange={e=>{setLegacyGroup('');setSearch(e.target.value);}}/></label>
 </div>
 {filter.links.length>0&&<nav className="category-entry-links" aria-label="Full equipment ranges">{filter.links.map(item=>
   <Link key={item.path} to={item.path} data-discovery-link="kitchen-category">{item.label} · View full range ↗</Link>)}</nav>}
 <div className="catalog-meta"><span>{filtered.length} models <b>·</b> Key specifications at a glance</span><button className="text-link" disabled={compared.length<2} onClick={()=>setModal('compare')}>Compare selected ({compared.length}/3) <Arrow/></button></div>
 <div className="product-grid" id="commercial-kitchen-catalog-models">{shown.map(p=><article className="product" id={`model-${p.id}`} key={p.id}>{p.handbookGroup&&<span className="catalogue-anchor" id={`catalog-${p.id}`}/>}<div className="product-image"><span className="product-kind">{p.category}</span><button className="image-button" onClick={()=>setModal(p)} aria-label={`View ${p.model} details`}><img src={p.image} alt={`${p.model} ${p.name}`} loading="lazy" width="420" height="290"/></button><label className="compare-check"><input type="checkbox" aria-label={`Compare ${p.model}`} checked={compared.includes(p.id)} onChange={()=>toggleCompare(p.id)}/> Compare</label></div><div className="product-info"><p className="model">{p.model}</p><h3><button onClick={()=>setModal(p)}>{p.name}</button></h3><div className="product-spec"><strong>{p.metric}</strong><span>{p.detail}</span></div>{launch.productHighlights[p.id]&&<p className="product-use-case">{launch.productHighlights[p.id].useCase}</p>}{p.handbookGroup&&<dl className="catalogue-key-specs">
  <div><dt>Footprint</dt><dd>{p.footprint}</dd></div>
  {p.doors&&<div><dt>Doors</dt><dd>{p.doors}</dd></div>}
  {p.baskets&&<div><dt>Basket positions</dt><dd>{p.baskets}</dd></div>}
  {p.openings&&<div><dt>Steamer openings</dt><dd>{p.openings}</dd></div>}
 </dl>}<OtherJuicerPowers product={p}/><div className="product-bottom"><div><ProductPrice product={p} compact/>{!p.quote&&<ModelQuoteLink product={p}/>}{p.quote&&<a className="estimate-price" href={marginHref(p.id)} aria-label={`Estimate margin for ${p.model}`}>Estimate margin ↗</a>}</div><button onClick={()=>add(p.id)} aria-label={`Add ${p.model} to sourcing list`} className={list[p.id]?'added':''}>{list[p.id]?`${list[p.id]} in list`:'Add to list'} <span aria-hidden="true">+</span></button></div></div></article>)}</div>
 {!filtered.length&&<div className="empty">No models match this search. <button onClick={()=>{selectCategory('all')}}>Clear filters</button></div>}
 {filtered.length>8&&<div className="show-more"><button className="button outline" onClick={()=>setAll(!all)}>{all?'Show fewer models':`See all ${filtered.length} models`} <span aria-hidden="true">{all?'−':'+'}</span></button></div>}
 <p className="catalog-note">Electrical configuration will be confirmed for your destination during quotation. Images may show a related model; see product details for your selection.</p></section>

 <section id="commercial-kitchen-list" className="planner-section"><div className="section wrap"><div className="section-heading"><div><p className="eyebrow">05 / YOUR NEXT ORDER STARTS HERE</p><h2>Build your<br/>sourcing brief.</h2></div><p>Choose the equipment. Tell us where it is going. Review a short enquiry, then send it to our team or open a WhatsApp draft.</p></div><div className="planner"><div className="selected-list"><div className="list-title"><h3>Your equipment</h3><span>{selected.length} {selected.length===1?'model':'models'} / {count} {count===1?'unit':'units'}</span></div>{!selected.length?<div className="list-empty"><span aria-hidden="true">＋</span><h3>Make room for your next range.</h3><p>Add individual products or choose an assortment to start.</p><a href="#commercial-kitchen-equipment" className="button outline">Explore equipment <Arrow/></a></div>:<><div className="list-rows">{selected.map(p=><div className="selected-row" key={p.id}><img src={p.image} alt={`${p.model} ${p.name}`}/><div className="selected-name"><strong>{p.model}</strong><span>{p.name}</span><small>{p.metric}</small>{form.buyingTargets?.[p.id]&&<small className="buying-target">{buyingIntents[form.buyingTargets[p.id].intent].label}{form.buyingTargets[p.id].price!==null&&!(form.buyingTargets[p.id].priceBasis==='reference'&&list[p.id]<p.quote?.minUnits)?` · ${form.buyingTargets[p.id].priceBasis==='reference'?'Indicative':'Target'} ${formatPrice(currentBuyingTarget(p,form.buyingTargets[p.id],list[p.id]).price,form.buyingTargets[p.id].currency)} / unit`: ' · Price to quote'}</small>}</div><label className="qty">Qty<input aria-label={`Quantity for ${p.model}`} type="number" min="1" max="9999" step="1" value={list[p.id]} onChange={e=>{if(e.target.value!=='')update(p.id,e.target.value)}} onBlur={e=>{if(!e.target.value)update(p.id,1)}}/></label><button className="remove" aria-label={`Remove ${p.model}`} onClick={()=>update(p.id,0)}>×</button></div>)}</div><p className="fine">Wholesale prices, minimum quantities and availability will be confirmed for this list. Quantities are your purchasing request.</p><button className="text-link" onClick={()=>setModal('clear')}>Clear sourcing list</button></>}</div><form className="brief-form" onSubmit={e=>{e.preventDefault();if(!destination.trim())return;setBrief(makeBrief(products,list,{...form,country:destination.trim()}));setToast('Brief created below. Review it before sharing.')}}><h3>Where is the equipment going?</h3><div className="two-fields"><label>Destination country<input required maxLength={100} list="kitchen-destination-options" autoComplete="country-name" placeholder="Enter a country" value={destination} onChange={e=>setDestination(e.target.value)}/><datalist id="kitchen-destination-options">{countries.filter(c=>c!=='Other').map(c=><option key={c} value={c}/>)}</datalist></label><label>City / destination port<input value={form.port} onChange={e=>setForm({...form,port:e.target.value})} placeholder="Enter a city or port"/></label></div><label>Business type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Importer / wholesaler</option><option>Distributor / dealer</option><option>Restaurant / hospitality buyer</option><option>Other</option></select></label><div className="two-fields"><label>Company <span>(optional)</span><input value={form.company} onChange={e=>setForm({...form,company:e.target.value})} autoComplete="organization"/></label><label>Email or WhatsApp <span>(optional)</span><input value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})}/></label></div><label>Anything else to include?<textarea rows="3" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Target price, other equipment, local product links, branding or spare parts…"/></label><p className="configuration-note"><b>Choose first. Configure with the quote.</b><br/>Voltage, frequency, phase and plug will be confirmed for your selected models and destination.</p><button className="button primary" type="submit" disabled={!selected.length}>Generate sourcing brief <Arrow/></button><p className="fine">Review your brief, then send it to DDNZ. We confirm pricing, configuration and shipping options with you.</p></form></div>{brief&&<div className="generated-brief"><div><h3>Your sourcing brief is ready.</h3><div className="actions"><button className="button outline" onClick={()=>download(brief,'DDNZ-kitchen-sourcing-brief.txt')}>Download brief ↓</button><button className="text-link" onClick={copyBrief}>Copy brief</button></div></div><pre>{brief}</pre></div>}{brief&&<InquiryActions products={products} list={list} form={{...form,country:destination.trim()}} brief={brief} onPrivacy={onPrivacy}/>}</div></section>

 <section id="commercial-kitchen-guide" className="section wrap catalogue-support">
   <h2>Before you order</h2>
   <p>We confirm configuration, packing and shipment options for your models and destination.</p>
   <nav aria-label="Order support" className="kitchen-support-cards">
     {orderSupportPaths(requestedKitchenModel(location.search)?.id).map(({id,href,label,description,image})=>
       <a key={id} id={id} href={href} className="kitchen-support-card">
         <img src={image} alt="" width="96" height="76" loading="lazy" decoding="async"/>
         <div><strong>{label}</strong><span>{description}</span></div>
         <Arrow diagonal/>
       </a>)}
   </nav>
 </section>
 <section className="section wrap faq"><div><p className="eyebrow">BEFORE YOU REQUEST A QUOTE</p><h2>A few useful<br/>answers.</h2></div><div>{[...kitchenFaq,...launch.faq.slice(0,2)].map(item=>[item.question,item.answer]).map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
 </main>
 {toast&&<div className="toast" role="status">{toast}<button aria-label="Dismiss notification" onClick={()=>setToast('')}>×</button></div>}
 <dialog ref={dialog} aria-label={modal==='compare'?'Compare equipment':modal==='clear'?'Clear sourcing list':`${modal?.model||'Equipment'} details`} className="detail-dialog" onCancel={()=>setModal(null)} onClick={e=>{if(e.target===dialog.current)setModal(null)}}><button className="dialog-close" aria-label="Close dialog" onClick={()=>setModal(null)}>×</button>
 {modal==='clear'?<div className="clear-dialog"><h2>Clear your equipment list?</h2><p>This removes {selected.length} selected models. You can add them again from the catalogue.</p><div className="actions"><button className="button primary" onClick={()=>{setList({});setForm(f=>({...f,buyingTargets:{}}));setModal(null)}}>Clear list</button><button className="button outline" onClick={()=>setModal(null)}>Keep list</button></div></div>:modal==='compare'?<div><p className="eyebrow">YOUR MODEL COMPARISON</p><h2>Compare the details.</h2><p className="fine">Different equipment types may use different capacity measurements. Compare like specifications.</p><div className="compare-table"><table><thead><tr><th>Specification</th>{compared.map(id=><th key={id}><img src={byId(id).image} alt={`${byId(id).model} ${byId(id).name}`}/>{byId(id).model}</th>)}</tr></thead><tbody>{['Category','Primary specification','Dimensions',...new Set(compared.flatMap(id=>Object.keys(byId(id).specs)))].map(key=><tr key={key}><th scope="row">{key}</th>{compared.map(id=><td key={id}>{key==='Category'?byId(id).category:key==='Primary specification'?byId(id).metric:key==='Dimensions'?byId(id).dimensions:byId(id).specs[key]||'—'}</td>)}</tr>)}<tr><th>Indicative supply price</th>{compared.map(id=><td key={id}><ProductPrice product={byId(id)} compact/></td>)}</tr><tr><th>Select a model</th>{compared.map(id=><td key={id}><button className="button outline" onClick={()=>add(id)}>Add to list +</button></td>)}</tr></tbody></table></div></div>:modal&&typeof modal==='object'?<div className="product-detail"><div><div className="product-photo-stage"><img src={modal.image} alt={`${modal.model} ${modal.name}`}/></div>{modal.imageNote&&<p className="fine">{modal.imageNote}</p>}{modal.gallery&&<div className="juicer-gallery">{modal.gallery.map(photo=><figure key={photo.src}><img src={photo.src} alt={`${modal.model} — ${photo.label}`} loading="lazy"/><figcaption>{photo.label}</figcaption></figure>)}</div>}</div><div><p className="eyebrow">{modal.category}</p><h2>{modal.model}</h2><h3>{modal.name}</h3>{launch.productHighlights[modal.id]&&<ul className="detail-highlights">{launch.productHighlights[modal.id].sellingPoints.map(point=><li key={point}>{point}</li>)}</ul>}<dl>{Object.entries({...modal.specs,'External dimensions':modal.dimensions}).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl><p>{modal.note}</p><OtherJuicerPowers product={modal}/>{modal.quote&&<div className="detail-supply-price"><ProductPrice product={modal}/><a className="text-link" href={marginHref(modal.id)}>Estimate your margin <Arrow/></a></div>}<button className="button primary" onClick={()=>add(modal.id)}>Add to sourcing list +</button><p className="fine">Final price, order minimums and electrical configuration confirmed with your quotation.</p></div></div>:null}
 </dialog>
 </section>
}
