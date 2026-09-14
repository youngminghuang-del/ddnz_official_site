import { FACTORY_CLIPS, VIDEO_COPY } from './production.mjs';
import {EN,t} from './locales/en.mjs';
import {PRODUCTS,BASIS,preset,economics,cartonFacts,money,number,referenceDate,names,estimate,makeBrief,packingLine} from './model.mjs';
import { ROUTES, INQUIRY_PATH, pageForPath } from './routes.mjs';
import { DRAFT_KEY, saveHandoff } from './handoff.mjs';
import { renderScreenProtectorBreadcrumbs, renderScreenProtectorNextSteps, isPlainAnchorClick, pageHref } from './browsing.mjs';
import { createScreenProtectorActionReporter } from './site-analytics.mjs';

/** @param {(action: string) => void} [onAction] */
export function mountScreenProtectors(root, go, onAction) {
const lifecycle=new AbortController();
const on=(target,type,handler)=>target.addEventListener(type,handler,{signal:lifecycle.signal});
const onRoot=(type,handler)=>on(root,type,handler);
const report=createScreenProtectorActionReporter(onAction,lifecycle.signal);
const playedVideos=new WeakSet();
const $=s=>s==='#app'?root:root.querySelector(s),all=s=>[...root.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=file=>'/screen-protector-media/assets/'+file;
const media=file=>'/screen-protector-media/media/'+file;
const key=DRAFT_KEY;
let state={rows:preset(),packing:'product',charging:'shipment',route:'sea',price:'',monthly:'',feeRate:'',requests:[]};
let storage=true,result,brief='';
try{const saved=JSON.parse(sessionStorage.getItem(key)||'null');if(saved&&Array.isArray(saved.rows)&&saved.rows.length<=100){
  state={...state,rows:saved.rows.map(r=>({product:Object.hasOwn(PRODUCTS,r.product)?r.product:'001',model:String(r.model??'').slice(0,80),qty:typeof r.qty==='number'||typeof r.qty==='string'?r.qty:''})),requests:Array.isArray(saved.requests)?[...new Set(saved.requests.filter(x=>Object.hasOwn(EN.requests,x)))]:[]};
  for(const [field,options] of [['packing',['product','model']],['charging',['shipment','carton']],['route',['sea','air']]])if(options.includes(saved[field]))state[field]=saved[field];
  for(const field of ['price','monthly','feeRate'])if(['string','number'].includes(typeof saved[field]))state[field]=saved[field];
}}catch{storage=false;}
const link=(href,label,cls='')=>`<a class="${cls}" href="${href}">${label}</a>`;
const action=(page,label,secondary=false)=>link('#'+page,label+' <span aria-hidden="true">↗</span>',secondary?'button secondary':'button');
const heading=(tag,title,body)=>`<div class="page-heading"><p class="eyebrow">${tag}</p><h1 tabindex="-1">${title.replaceAll('\n','<br>')}</h1><p class="lede">${body}</p></div>`;
const section=(id,html)=>`<section class="view" id="view-${id}" hidden>${renderScreenProtectorBreadcrumbs(id)}${html}${renderScreenProtectorNextSteps(id)}</section>`;
const fields=ids=>`<div class="check-list">${ids.map(id=>`<label><input type="checkbox" data-check="${id}"><span>${EN.requests[id]}</span></label>`).join('')}</div><div class="check-summary"><span data-check-count></span>${link('#quote',t('guides.viewBrief')+' →')}</div>`;
const cards=()=>`<div class="guide-cards"><a href="#prices" class="guide-card"><img src="${asset('001-kit-photo.jpg')}" width="1280" height="720" loading="lazy" alt="${t('guides.kit001')}"><div><p class="eyebrow">01 / ${t('pages.prices')}</p><h3>${t('guides.priceTitle').replace('\n','<br>')}</h3><p>${t('guides.priceDesc')}</p><b>${t('guides.open')} ↗</b></div></a><a href="#curves" class="guide-card"><img src="${asset('curved-glass-cover-v1.png')}" width="1672" height="941" loading="lazy" alt="${t('comparisonCoverAlt')}"><div><p class="eyebrow">02 / ${t('pages.curves')}</p><h3>${t('guides.curveTitle').replace('\n','<br>')}</h3><p>${t('guides.curveDesc')}</p><b>${t('guides.open')} ↗</b></div></a></div>`;
const clip=(c,scope='guide')=>`<figure class="clip"><div class="clip-player"><video controls playsinline preload="none" poster="${media(c.poster+'.jpg')}" aria-label="${c.title}" aria-describedby="desc-${scope}-${c.id}"><source src="${media(c.file+'.mp4')}" type="video/mp4"><track kind="captions" src="/screen-protector-media/captions/${c.file}.en.vtt" srclang="en" label="${t('media.captions')}" default></video><button type="button" class="play-clip" aria-label="Play: ${c.title}"><span aria-hidden="true">▶</span> ${VIDEO_COPY.play}</button></div><figcaption><div class="clip-heading"><h3>${c.title}</h3><span>${c.duration}s</span></div><small>${t('media.silent')}</small><p id="desc-${scope}-${c.id}">${c.description}</p><p class="media-error" role="status"></p></figcaption></figure>`;
const stage=(c)=>`<div class="process-stage-heading"><p class="eyebrow">${VIDEO_COPY.shown}</p><h2>${c.title}</h2></div>${clip(c,'library')}<div class="process-question"><h3>${VIDEO_COPY.check}</h3><p>${c.check}</p></div>`;
const videos=section('videos',heading(VIDEO_COPY.eyebrow,VIDEO_COPY.title,VIDEO_COPY.intro)+`<p class="process-scope">${VIDEO_COPY.scope}</p><div class="factory-library" id="process-library"><nav class="process-directory" aria-label="${VIDEO_COPY.nav}">${FACTORY_CLIPS.map((c,i)=>`<a href="${pageHref('videos')}#${c.id}" data-process-index="${i}"${i===0?' aria-current="true"':''}><span>${String(i+1).padStart(2,'0')}</span><span>${c.title}<small>Watch ${c.duration}s</small></span><b aria-hidden="true">↗</b></a>`).join('')}</nav><section class="process-stage" id="process-stage" aria-label="Selected production stage">${stage(FACTORY_CLIPS[0])}</section></div><section class="process-notes"><h2>Production observations and procurement checks</h2><p>Use these notes to identify what each clip shows and what still needs confirmation for your order.</p><ol>${FACTORY_CLIPS.map(c=>`<li><h3>${c.title}</h3><p>${c.description}</p><p><strong>Ask before ordering:</strong> ${c.check}</p><a href="${pageHref('videos')}#${c.id}">Watch ${c.title.toLowerCase()} (${c.duration} seconds) →</a></li>`).join('')}</ol></section><section class="installation-library"><h2>${VIDEO_COPY.installation}</h2><p>${VIDEO_COPY.installIntro}</p><div class="clip-grid">${EN.media.clips.slice(0,3).map(c=>clip(c,'library-install')).join('')}</div></section><div class="next-step"><div><h2>${t('guides.checksTitle')}</h2><p>Carry the specifications that matter into your sourcing brief.</p></div>${action('guides',t('pages.guides'))}</div>`);

const overview=()=>`<figure class="overview"><video controls playsinline preload="none" poster="${media('factory-fixture-poster.jpg')}" aria-label="${t('home.videoTitle')}" aria-describedby="factory-credit"><source src="/screen-protector-media/media/ddnz-factory-en-720p-v1.mp4" type="video/mp4">${t('media.unavailable')}</video><figcaption><strong>${t('home.videoLabel')}</strong><span id="factory-credit">${t('home.credit')}</span><p class="media-error" role="status"></p></figcaption></figure>`;
const nav=`<div class="section-nav"><a href="#home" class="section-name">${t('pages.home')}</a><nav aria-label="${t('nav.section')}">${['home','products','guides','videos','calculator'].map(id=>`<a href="#${id}" data-nav="${id}" aria-label="${EN.pages[id]}"><span class="nav-label">${EN.pages[id]}</span><span class="nav-short" aria-hidden="true">${({home:"Overview",products:"Products",guides:"Guides",videos:"Videos",calculator:"Landed cost"})[id]}</span></a>`).join('')}</nav><span class="locale-label">EN</span></div>`;
const home=section('home',`<div class="hero"><div>${heading(t('home.eyebrow'),t('home.title'),t('home.intro'))}<div class="actions">${action('products',t('home.compare'))}<a href="#videos" class="factory-cta"><span class="factory-cta-play" aria-hidden="true">▶</span><span><strong>${VIDEO_COPY.watch}</strong><small>${VIDEO_COPY.count}</small></span><b aria-hidden="true">↗</b></a></div></div><div>${overview()}<details class="transcript"><summary>${t('home.transcriptTitle')}</summary><p>${t('home.transcript')}</p></details></div></div><div class="journey">${EN.home.journey.map(([tag,title,body,page])=>`<a href="#${page}"><span class="eyebrow">${tag}</span><h3>${title}</h3><p>${body}</p><span aria-hidden="true">↗</span></a>`).join('')}</div><div class="section-heading"><p class="eyebrow">${t('home.notes')}</p><h2>${t('home.notesTitle')}</h2></div>${cards()}<div class="product-teaser"><div><p class="eyebrow">${t('home.offers')}</p><h2>${t('home.offersTitle')}</h2><p>${t('home.offersBody')}</p>${action('products',t('pages.products'),true)}</div><div class="price-list">${Object.entries(PRODUCTS).map(([id,p])=>`<a href="#products"><img loading="lazy" src="${asset(p.image)}" width="100" height="100" alt=""><span>${names[id]}</span><b>${money(p.price)}</b></a>`).join('')}</div></div><div class="next-step"><div><h2>${t('home.planTitle')}</h2><p>${t('home.planBody')}</p></div>${action('calculator',t('home.planCta'))}</div>`);
const products=section('products',heading(t('home.offers'),t('product.title'),t('product.intro'))+`<p class="notice">${t('home.offersBody')}</p><div id="product-cards"></div><div class="next-step"><div><h2>${t('home.planTitle')}</h2><p>${t('home.planBody')}</p></div>${action('calculator',t('home.planCta'))}</div>`);
const guides=section('guides',heading(t('home.notes'),t('guides.title'),t('guides.intro'))+cards()+fields(Object.keys(EN.requests)));
const prices=section('prices',heading('01 / '+t('pages.prices'),t('guides.priceTitle'),t('guides.priceIntro'))+`<div class="article"><h2>${t('guides.factorsTitle')}</h2><div class="factor-list">${EN.guides.factors.map(([title,body],i)=>`<details ${i===0?'open':''}><summary><span>0${i+1}</span>${title}</summary><p>${body}</p></details>`).join('')}</div><h2>${t('guides.configuration')}</h2><div class="configuration"><figure><img src="${asset('001-kit-photo.jpg')}" width="1280" height="720" loading="lazy" alt="${t('guides.kit001')}"><figcaption>${t('guides.kit001')}</figcaption></figure><figure><img src="${asset('titan-kit.jpg')}" width="2000" height="2000" loading="lazy" alt="${t('guides.kitTitan')}"><figcaption>${t('guides.kitTitan')}</figcaption></figure></div><h2>${t('guides.actions')}</h2><div class="clip-grid">${EN.media.clips.slice(0,2).map(clip).join('')}</div><p class="notice">${t('guides.sampleAdvice')}</p><h2>${t('guides.observing')}</h2><p>${t('guides.observation')}</p>${clip(EN.media.clips[2])}<h2>${t('guides.checksTitle')}</h2>${fields(['material','edge','optical','adhesive','kit','repeat'])}<div class="actions">${action('products',t('pages.products'))}${action('curves',t('pages.curves'),true)}</div></div>`);
const diagram=curved=>`<svg viewBox="0 0 360 160" role="img" aria-label="${t(curved?'guides.curvedTitle':'guides.flatTitle')}"><path d="${curved?'M40 112 Q43 67 91 67 H269 Q317 67 320 112 L302 118 Q300 85 265 85 H95 Q60 85 58 118Z':'M40 93 Q40 70 63 70 H297 Q320 70 320 93 V100 H40Z'}" fill="#e4d8ed" stroke="#763c9c" stroke-width="3"/><path d="M40 139H320" stroke="#7e8a9c" stroke-dasharray="5 6" stroke-width="2"/></svg>`;
const curves=section('curves',heading('02 / '+t('pages.curves'),t('guides.curveTitle'),t('guides.curveIntro'))+`<div class="article"><h2>${t('guides.shapeTitle')}</h2><div class="shape-grid">${[false,true].map(c=>`<figure>${diagram(c)}<figcaption><h3>${t(c?'guides.curvedTitle':'guides.flatTitle')}</h3><p>${t(c?'guides.curvedBody':'guides.flatBody')}</p></figcaption></figure>`).join('')}</div><p class="small">${t('guides.diagramNote')}</p><h2>${t('guides.processTitle')}</h2><div class="process-list">${EN.guides.processes.map(([title,body],i)=>`<article><span>0${i+1}</span><div><h3>${title}</h3><p>${body}</p></div></article>`).join('')}</div><section id="factory-scenes"><p class="eyebrow">${t('factoryCredit')}</p><h2>${t('guides.factoryTitle')}</h2><p>${t('guides.factoryIntro')}</p><div class="factory-guide-entry"><h3>${VIDEO_COPY.library}</h3><p>From glass preparation to retail packing, match the operation to its footage.</p>${action('videos',VIDEO_COPY.watch)}</div>${EN.media.clips.slice(3).map(clip).join('')}</section><h2>${t('guides.fitTitle')}</h2><p>${t('guides.fitBody')}</p>${fields(['phone','case','touch','forming','sample'])}<div class="actions">${action('products',t('pages.products'))}${action('calculator',t('pages.calculator'),true)}</div></div>`);
const calculator=section('calculator',heading('ISTANBUL / LANDED COST',t('calc.title'),t('calc.intro'))+`<p class="small">${t('calc.basis',{date:referenceDate})}</p><div class="planner-layout"><div class="planner"><h2>${t('calc.mix')}</h2><div class="presets" role="group" aria-label="${t('calc.replace')}">${[1000,5000,10000].map(q=>`<button data-preset="${q}">${number(q)}</button>`).join('')}</div><p class="small">${t('calc.presetNote')}</p><div id="sku-rows"></div><button id="add-row" class="button secondary">${t('calc.add')} +</button><p id="draft-state" class="small"></p><div id="input-errors" role="alert" hidden></div><p id="model-warning" class="notice"></p><h2>${t('calc.pack')}</h2><div class="packing-fields"><label>${t('calc.packing')}<select id="packing">${Object.entries(EN.calc.packingOptions).map(([v,label])=>`<option value="${v}">${label}</option>`).join('')}</select></label><label>${t('calc.charging')}<select id="charging">${Object.entries(EN.calc.chargingOptions).map(([v,label])=>`<option value="${v}">${label}</option>`).join('')}</select></label></div><p class="small">${t('calc.notMix')}</p><div id="packing-summary"></div><details class="formula"><summary>${t('calc.details')}</summary><div id="carton-detail"></div>${['formulaCbm','formulaDim','formulaBill','formulaSea'].map(k=>`<p>${t('calc.'+k)}</p>`).join('')}</details><details class="sales-panel"><summary>${t('calc.optional')}</summary><div class="sales-fields">${[['price','sale-price'],['monthly','monthly'],['fee','fee-rate']].map(([k,id])=>`<label>${t('calc.'+k)}<input id="${id}" type="number" min="0" max="${k==='price'?100000:k==='monthly'?1000000:100}" step="${k==='monthly'?1:'any'}"></label>`).join('')}</div><p class="small">${t('calc.salesNote')}</p><div id="sales-results" aria-live="polite"></div></details></div><aside class="cost-sidebar"><div id="route-results" aria-live="polite"></div><details open class="scope"><summary>${t('calc.scopeTitle')}</summary><p>${t('calc.scope')}</p><p>${t('calc.timing')}</p><p>${t('calc.limits')}</p><p class="small">${t('calc.classification')}</p></details><a href="#quote" id="quote-entry" class="button">${t('calc.quote')} →</a></aside></div>`);
const quote=section('quote',heading(t('nav.cta'),t('quote.title'),t('quote.intro'))+`<div class="brief-layout"><div><label for="quote-text" class="sr-only">${t('quote.label')}</label><textarea id="quote-text" readonly rows="25"></textarea><div class="actions"><button id="copy-quote" class="button">${t('quote.copy')}</button><button id="download-quote" class="button secondary">${t('quote.download')}</button></div><p id="copy-status" role="status"></p></div><aside><h2>${t('quote.confirmTitle')}</h2><ul>${EN.quote.confirm.map(x=>`<li>${x}</li>`).join('')}</ul><p class="notice">Review your plan, then add your contact details. Nothing is sent until you submit the enquiry.</p><a id="continue-inquiry" class="button" href="${INQUIRY_PATH}">Continue to enquiry →</a><p id="handoff-status" role="status"></p>${action('calculator',t('pages.calculator'),true)}</aside></div>`);
root.innerHTML=nav+`<main id="main" tabindex="-1">${home+products+guides+videos+prices+curves+calculator+quote}</main>`;

function renderProducts(){
  $('#product-cards').innerHTML=Object.entries(PRODUCTS).map(([id,p])=>`<article class="product-row"><figure><img src="${asset(p.image)}" width="1000" height="1000" alt="${names[id]}" loading="lazy"></figure><div><p class="eyebrow">${EN.product.labels[id]}</p><div class="product-top"><h2>${names[id]}</h2><div class="product-price">${money(p.price)}<small>${t('product.perPiece')}</small></div></div><p>${EN.product.notes[id]}</p><dl class="spec-grid">${[[t('product.min'),number(p.minQty)],[t('product.box'),number(p.unitsPerCarton)],[t('product.weight'),number(cartonFacts(p).fullKg,3)+' kg']].map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl><p class="small">${t('product.dimensions')}: ${p.cartonCm.join(' × ')} cm. ${EN.product.packing[id]}</p><button class="button secondary" data-product-add="${id}">${t('product.add',{qty:number(p.addQty)})} +</button><details><summary>${t('product.details')}</summary><p>${t('product.detailNote')} ${t('product.priceNote')}</p></details></div></article>`).join('');
}
const rowSummary=p=>t('calc.rowSummary',{price:money(p.price),qty:number(p.unitsPerCarton),min:number(p.minQty)});
function renderRows(){
  $('#sku-rows').innerHTML=state.rows.map((r,i)=>`<div class="sku-row" data-row="${i}"><div class="row-head"><strong>${t('calc.row',{row:i+1})}</strong><button data-remove="${i}" aria-label="${t('calc.remove')} ${t('calc.row',{row:i+1})}">${t('calc.remove')} ×</button></div><div class="row-fields"><label>${t('calc.product')}<select data-field="product">${Object.keys(PRODUCTS).map(id=>`<option value="${id}"${id===r.product?' selected':''}>${names[id]}</option>`).join('')}</select></label><label>${t('calc.qty')}<input data-field="qty" type="number" min="${PRODUCTS[r.product].minQty}" max="${BASIS.maxQty}" step="1" value="${esc(r.qty)}"></label><label class="model-field">${t('calc.model')}<input data-field="model" maxlength="80" placeholder="${t('calc.modelPlaceholder')}" value="${esc(r.model)}"></label></div><p class="small row-summary">${rowSummary(PRODUCTS[r.product])}</p></div>`).join('');
  $('#add-row').disabled=state.rows.length>=BASIS.maxRows;
  all('[data-product-add]').forEach(b=>b.disabled=state.rows.length>=BASIS.maxRows);
}
function routeCard(route){const r=result[route],selected=route===state.route;return `<article class="route-card ${selected?'selected':''}"><div class="route-heading"><h3>${t('calc.'+route)}</h3><span>${t('calc.days',{days:r.days})}</span></div><strong class="unit-cost">${money(r.unit)}</strong><p class="small">${t('calc.unit')}</p><p class="small">${route==='sea'?t('calc.seaBasis',{volume:number(result.seaBillableCbm,5)}):t('calc.airBasis',{weight:number(result.chargeKg,3)})}</p><dl class="cost-lines">${[['goods',result.goods],['freight',r.fee],['total',r.total]].map(([label,value])=>`<div><dt>${t('calc.'+label)}</dt><dd>${money(value)}</dd></div>`).join('')}</dl><button class="button ${selected?'':'secondary'}" data-route="${route}" aria-pressed="${selected}">${t(selected?'calc.selected':'calc.select')}</button></article>`;}
function updateSales(){const x=economics(result,state.route,{price:state.price,monthly:state.monthly,feeRate:state.feeRate});if(!x){$('#sales-results').textContent=t('calc.invalid');return;}
  const warnings=[['price','priceOK','priceError'],['monthly','monthlyOK','monthlyError'],['feeRate','feeOK','feeError']].filter(([key,ok])=>String(state[key]).trim()&&!x[ok]).map(([,,error])=>t('calc.'+error));
  $('#sales-results').innerHTML=`<p class="small">${t('calc.salesBasis',{route:t('calc.'+state.route)})}</p><dl class="cost-lines">${['revenue','spread','contribution'].map(k=>`<div><dt>${t('calc.'+k)}</dt><dd>${x[k]===null?t('calc.empty'):money(x[k])}</dd></div>`).join('')}<div><dt>${t('calc.months')}</dt><dd>${x.months===null?t(x.monthlyZero?'calc.zeroMonthly':'calc.empty'):t('calc.monthValue',{months:number(x.months,2)})}</dd></div></dl><p class="error">${warnings.join(' ')}</p>`;
}
function update(){
  result=estimate(state.rows,state.packing,state.charging);
  try{sessionStorage.setItem(key,JSON.stringify(state));}catch{storage=false;}
  $('#draft-state').textContent=t(storage?'calc.draft':'calc.draftFailed');
  $('#input-errors').hidden=result.valid;$('#input-errors').innerHTML=result.errors.map(e=>`<p>${esc(e)}</p>`).join('');
  $('#model-warning').hidden=!result.valid;
  $('#quote-entry').setAttribute('aria-disabled',String(!result.valid));
  all('[data-preset]').forEach(b=>{const rows=preset(Number(b.dataset.preset)),match=state.rows.length===rows.length&&state.rows.every((r,i)=>r.product===rows[i].product&&Number(r.qty)===rows[i].qty);b.setAttribute('aria-pressed',String(match));});
  if(result.valid){
    $('#model-warning').textContent=[t(result.missingModels?'calc.missing':'calc.modelsComplete',{count:result.missingModels}),...result.warnings].join(' ');
    $('#packing-summary').innerHTML=`<dl class="packing-facts">${[['cartons',number(result.cartons)],['cbm',number(result.cbm,5)+' m³'],['gross',number(result.actualKg,3)+' kg'],['charge',number(result.chargeKg,3)+' kg']].map(([k,v])=>`<div><dd>${v}</dd><dt>${t('calc.'+k)}</dt></div>`).join('')}</dl><p class="small">${t('calc.compareWeights',{shipment:number(result.shipmentChargeKg,3),carton:number(result.cartonChargeKg,3)})}</p>`;
    $('#carton-detail').innerHTML=result.groups.map(g=>`<article class="carton-detail"><b>${names[g.product]}${state.packing==='model'?' / '+esc(g.models.join(', ')):''}</b><p>${packingLine(g)}</p><small>${t('calc.groupMeta',{dimensions:PRODUCTS[g.product].cartonCm.join(' × '),volume:number(g.cbm,5),weight:number(g.actualKg,3)})}</small></article>`).join('');
    $('#route-results').innerHTML=routeCard('sea')+routeCard('air');
  }else{for(const id of ['packing-summary','carton-detail','route-results'])$('#'+id).innerHTML=`<p class="error">${t('calc.invalid')}</p>`;}
  updateSales();brief=makeBrief(result,state);$('#quote-text').value=brief;
  $('#continue-inquiry').setAttribute('aria-disabled',String(!result.valid));
  $('#copy-quote').disabled=!result.valid;$('#download-quote').disabled=!result.valid;$('#copy-status').textContent='';
  all('[data-check]').forEach(i=>i.checked=state.requests.includes(i.dataset.check));
  all('[data-check-count]').forEach(el=>el.textContent=t('guides.selected',{count:state.requests.length}));
}
function addRow(product='001'){if(state.rows.length>=BASIS.maxRows)return;state.rows.push({product,model:'',qty:PRODUCTS[product].addQty});renderRows();update();report('select_configuration');go(ROUTES.calculator);requestAnimationFrame(()=>{if(!lifecycle.signal.aborted)$('#sku-rows').lastElementChild.querySelector('[data-field="model"]').focus();});}
onRoot('click',e=>{
  const summary=e.target.closest('summary');
  if(summary&&!summary.parentElement.open&&!e.defaultPrevented&&e.button===0){
    if(summary.closest('#product-cards'))report('compare_products');
    else if(summary.closest('.factor-list'))report('read_guide');
  }
  const add=e.target.closest('[data-product-add]');if(add)addRow(add.dataset.productAdd);
  const remove=e.target.closest('[data-remove]');if(remove){const i=Number(remove.dataset.remove);state.rows.splice(i,1);renderRows();update();report('calculator_change');const next=all('[data-remove]')[Math.min(i,state.rows.length-1)];(next||$('#add-row')).focus();}
  const chosen=e.target.closest('[data-route]');if(chosen){const changed=state.route!==chosen.dataset.route;state.route=chosen.dataset.route;update();if(changed)report('calculator_change');$(`[data-route="${state.route}"]`).focus();}
  const example=e.target.closest('[data-preset]');if(example){state.rows=preset(Number(example.dataset.preset));renderRows();update();report('calculator_change');}
});
on($('#sku-rows'),'input',e=>{const input=e.target;if(!input.dataset.field)return;const i=Number(input.closest('[data-row]').dataset.row);state.rows[i][input.dataset.field]=input.value;if(input.dataset.field==='product'){input.closest('[data-row]').querySelector('.row-summary').textContent=rowSummary(PRODUCTS[input.value]);input.closest('[data-row]').querySelector('[data-field="qty"]').min=PRODUCTS[input.value].minQty;}update();});
// Commit-based analytics: typing still updates the calculator without sending each input.
on($('#sku-rows'),'change',e=>{
  if(e.target.dataset.field==='product')report('select_configuration');
  else if(e.target.dataset.field==='model')report('model_change');
  else if(e.target.dataset.field==='qty')report('calculator_change');
});
on($('#add-row'),'click',()=>addRow());
for(const field of ['packing','charging']){$('#'+field).value=state[field];on($('#'+field),'change',e=>{state[field]=e.target.value;update();report('calculator_change');});}
for(const [id,field] of [['sale-price','price'],['monthly','monthly'],['fee-rate','feeRate']]){$('#'+id).value=state[field];on($('#'+id),'input',e=>{state[field]=e.target.value;update();});on($('#'+id),'change',()=>report('calculator_change'));}
all('[data-check]').forEach(el=>on(el,'change',()=>{state.requests=el.checked?[...new Set([...state.requests,el.dataset.check])]:state.requests.filter(x=>x!==el.dataset.check);update();report('specification_change');}));
on($('#quote-entry'),'click',e=>{if(isPlainAnchorClick(e,e.currentTarget)&&!result.valid){e.preventDefault();$('#input-errors').scrollIntoView({block:'center'});}});
on($('#copy-quote'),'click',async()=>{if(!result.valid)return;try{await navigator.clipboard.writeText(brief);if(lifecycle.signal.aborted)return;$('#copy-status').textContent=t('quote.copied');report('copy_brief');}catch{if(lifecycle.signal.aborted)return;$('#quote-text').focus();$('#quote-text').select();$('#copy-status').textContent=t('quote.fallback');}});
on($('#download-quote'),'click',()=>{if(!result.valid)return;const url=URL.createObjectURL(new Blob(['\ufeff'+brief],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='DDNZ-screen-protector-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);$('#copy-status').textContent=t('quote.downloaded');report('download_brief');});
function bindVideos(scope=root) {
  scope.querySelectorAll('video').forEach(video=>{
    if(video.dataset.bound)return;
    video.dataset.bound='true';
    const button=video.parentElement.querySelector('.play-clip');
    const error=video.closest('figure').querySelector('.media-error');
    on(video,'play',()=>{all('video').forEach(other=>{if(other!==video)other.pause();});if(button)button.hidden=true;error.textContent='';if(!playedVideos.has(video)){playedVideos.add(video);report('play_video');}});
    on(video,'pause',()=>{if(button){button.hidden=false;button.innerHTML='<span aria-hidden="true">▶</span> '+VIDEO_COPY.play;}});
    on(video,'error',()=>{error.textContent=t('media.unavailable');if(button){button.hidden=false;button.textContent=VIDEO_COPY.retry;}});
  });
}
function selectProcess(index,scroll=false) {
  const c=FACTORY_CLIPS[index];if(!c)return;
  $('#process-stage').querySelectorAll('video').forEach(v=>v.pause());
  $('#process-stage').innerHTML=stage(c);
  all('[data-process-index]').forEach(a=>{if(Number(a.dataset.processIndex)===index)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
  bindVideos($('#process-stage'));
  if(scroll&&window.innerWidth<900)$('#process-stage').scrollIntoView({block:'start',behavior:'instant'});
}
bindVideos();
onRoot('click',async event=>{
  const button=event.target.closest('.play-clip');if(!button)return;
  const video=button.closest('.clip-player').querySelector('video');
  button.disabled=true;button.setAttribute('aria-busy','true');button.textContent=VIDEO_COPY.loading;
  try { if(video.error)video.load(); await video.play(); }
  catch { if(lifecycle.signal.aborted)return;const error=video.closest('figure').querySelector('.media-error');error.textContent=t('media.unavailable');button.hidden=false;button.textContent=VIDEO_COPY.retry; }
  finally {button.disabled=false;button.removeAttribute('aria-busy');}
});
let currentPage='';
function activate(pathname, hash='') {
  const page=pageForPath(pathname)||'home';
  all('.view').forEach(v=>v.hidden=v.id!=='view-'+page);
  all('[data-nav]').forEach(a=>{if(a.dataset.nav===(['prices','curves'].includes(page)?'guides':page))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  all('video').forEach(v=>{if(v.closest('.view').hidden)v.pause();});
  const processIndex=page==='videos'?FACTORY_CLIPS.findIndex(c=>'#'+c.id===hash):-1;
  if(processIndex>=0){selectProcess(processIndex);$('#process-stage').scrollIntoView({block:'start'});}
  else if(page==='curves'&&hash==='#factory-scenes')$('#factory-scenes').scrollIntoView({block:'start'});
  else { window.scrollTo({top:0,behavior:'instant'}); if(currentPage&&page!==currentPage)$('#view-'+page+' h1').focus({preventScroll:true}); }
  currentPage=page;
}
renderProducts();renderRows();update();
all('a[href]').forEach(a=>{
  const href=a.getAttribute('href');
  if(href==='#factory-scenes')a.setAttribute('href',ROUTES.curves+'#factory-scenes');
  else if(href.startsWith('#')&&ROUTES[href.slice(1)])a.setAttribute('href',ROUTES[href.slice(1)]);
  const target=a.getAttribute('href');
  if(target.startsWith('/')&&!target.startsWith('//')){
    const url=new URL(target,location.origin);
    url.pathname=url.pathname.replace(/\/+$/,'')+'/';
    a.setAttribute('href',url.pathname+url.search+url.hash);
  }
});
onRoot('click',e=>{
  const a=e.target.closest('a[href]');
  if(!isPlainAnchorClick(e,a))return;
  const url=new URL(a.href,location.href);
  if(url.origin!==location.origin)return;
  e.preventDefault();
  if(a.id==='continue-inquiry'){
    let saved;
    try{saved=saveHandoff(sessionStorage,state);}catch{saved={ok:false,reason:'storage'};}
    if(!saved.ok){$('#handoff-status').textContent=saved.reason==='invalid'?'Please correct the quantities before continuing.':'Your browser cannot save the plan. Copy or download the brief, then paste it into the enquiry form.';return;}
    report('continue_inquiry');
  }else{
    const targetPage=pageForPath(url.pathname);
    if(targetPage==='videos'&&FACTORY_CLIPS.some(c=>'#'+c.id===url.hash))report('select_video_stage');
    else if(targetPage!==currentPage){
      if(targetPage==='products')report('compare_products');
      else if(['guides','prices','curves'].includes(targetPage))report('read_guide');
      else if(targetPage==='videos')report('open_videos');
      else if(targetPage==='calculator')report('open_calculator');
      else if(targetPage==='quote'&&result.valid)report('create_brief');
    }
  }
  go(url.pathname+url.search+url.hash);
});
// Mount with the requested view already visible, including direct deep links.
activate(location.pathname,location.hash);
return {activate, setBreadcrumbs(options){all('.view').forEach(view=>{view.querySelector('.breadcrumbs').outerHTML=renderScreenProtectorBreadcrumbs(view.id.slice(5),options);});}, destroy(){lifecycle.abort();all('video').forEach(video=>video.pause());root.replaceChildren();}};
}
