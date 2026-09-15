import { EN } from '../screen-protectors/locales/en.mjs';
import { referencePrice, copyFor } from './catalog.mjs';
import { productById, rowKey, minimumNote, mixedCopy } from './mixed-products.mjs';
import { ui } from './locales.mjs';
import { inspectionOptions } from './inspection-content.mjs';
import { validEmail } from '../commercial-kitchen/data/inquiry.mjs';
export const MOBILE_DRAFT_KEY='ddnz-mobile-buying-v1';
export const emptyDraft=()=>({schemaVersion:2,mixedOrderVersion:1,filmChecks:[],inspectionChecks:[],rows:[],contact:{name:'',email:'',company:'',destination:'',channel:'0',packaging:'',notes:''},comparisonQty:'100',calculator:{id:'folio-bida',quantity:'100',currency:'CNY',rate:'1',freight:'',tax:'',pack:'',other:'',sale:''}});
export const cleanText=(s,n=1500)=>String(s??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').slice(0,n);
export function numericText(value){return String(value??'').trim().replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-0x660)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-0x6f0)).replace(/٫/g,'.').replace(/,/g,'.');}
export function parseAmount(value){const s=numericText(value);return /^\d+(?:\.\d+)?$/.test(s)&&Number(s)<=1e9?Number(s):null;}
export function parseQuantity(value){const s=numericText(value);return /^\d+$/.test(s)&&Number(s)>=1&&Number(s)<=1000000?Number(s):null;}
export function normalizeDraft(raw){
 const d=emptyDraft();if(!raw||typeof raw!=='object'||Array.isArray(raw))return d;
 d.filmChecks=Object.keys(EN.requests).filter(key=>Array.isArray(raw.filmChecks)&&raw.filmChecks.includes(key));
 d.inspectionChecks=inspectionOptions.filter(option=>Array.isArray(raw.inspectionChecks)&&raw.inspectionChecks.includes(option.id)).map(option=>option.id);
 const seen=new Set();
 d.rows=(Array.isArray(raw.rows)?raw.rows:[]).filter(r=>r&&productById(r.id)&&!seen.has(rowKey(r))&&seen.add(rowKey(r))).slice(0,100).map(r=>({id:r.id,...(r.rowId?{rowId:cleanText(r.rowId,120)}:{}),quantity:cleanText(r.quantity,16),model:cleanText(r.model,120),colours:cleanText(r.colours,300)}));
 for(const key of Object.keys(d.contact)) if(raw.contact&&typeof raw.contact[key]==='string')d.contact[key]=cleanText(raw.contact[key],key==='email'?254:1500);
 if(!['0','1','2','3'].includes(d.contact.channel))d.contact.channel='0';
 if(typeof raw.comparisonQty==='string')d.comparisonQty=cleanText(raw.comparisonQty,16);
 if(raw.calculator&&typeof raw.calculator==='object')for(const key of Object.keys(d.calculator))if(typeof raw.calculator[key]==='string')d.calculator[key]=cleanText(raw.calculator[key],60);
 if(!productById(d.calculator.id)?.tiers)d.calculator.id='folio-bida';
 if(!['CNY','USD','AED','SGD','MXN'].includes(d.calculator.currency))d.calculator.currency='CNY';
 if(raw.schemaVersion!==2&&raw.calculator){
  if(raw.calculator.currency==='JPY')d.calculator={...emptyDraft().calculator,id:d.calculator.id,quantity:d.calculator.quantity};
  else d.calculator.rate='';
 }
 if(d.calculator.currency==='CNY')d.calculator.rate='1';
 return d;
}
export function validateMobileDraft(draft){
 const errors={};const d=normalizeDraft(draft);
 if(!d.contact.name.trim())errors.name='required';
 if(!validEmail(d.contact.email))errors.email='validEmail';
 if(!d.contact.destination.trim())errors.destination='required';
 if(!d.rows.length&&!d.inspectionChecks.length)errors.rows='needStyle';
 if(!d.rows.length&&d.inspectionChecks.length&&!d.contact.notes.trim())errors.notes='required';
 for(const row of d.rows){const p=productById(row.id),key=rowKey(row);if(!parseQuantity(row.quantity))errors[key+'-quantity']='invalid';if(['cases','film','power'].includes(p.group)&&!row.model.trim())errors[key+'-model']='required';if(p.group!=='film'&&!row.colours.trim())errors[key+'-colours']='required';}
 return errors;
}
export function buyingScenario(input){
 const p=productById(input.id),quantity=parseQuantity(input.quantity),rate=input.currency==='CNY'?1:parseAmount(input.rate);
 if(!quantity||!rate)return {status:'incomplete'};
 const reference=referencePrice(p,quantity);if(reference===null)return {status:'below'};
 const unitGoods=reference/rate;
 const costs=['freight','tax','pack','other'].map(key=>parseAmount(input[key]));const selling=parseAmount(input.sale);
 if(costs.some(v=>v===null)||selling===null||selling<=0)return {status:'incomplete',unitGoods,reference,quantity};
 const unitCost=unitGoods+costs.reduce((a,b)=>a+b,0);const grossProfit=selling-unitCost;
 return {status:'complete',reference,unitGoods,quantity,unitCost,batchCost:unitCost*quantity,grossProfit,grossMargin:grossProfit/selling*100};
}
export function buildMobilePayload(draft,locale='en'){
 const d=normalizeDraft(draft),c=key=>copyFor(ui[key],locale);
 const lines=['DDNZ — '+c('brief'),`${c('destination')}: ${d.contact.destination}`,`${c('company')}: ${d.contact.company||'—'}`,`${c('channel')}: ${copyFor(ui.channels[Number(d.contact.channel)],locale)}`,'',c('selected')+':'];
 for(const row of d.rows){const p=productById(row.id),q=parseQuantity(row.quantity),price=referencePrice(p,q);
  lines.push(`- ${p.code} | ${copyFor(p.name,locale)} | ${c('quantity')}: ${q??'—'}`,`  ${p.group==='power'?copyFor({en:'Plug / output / cable length',es:'Enchufe / potencia / longitud',ar:'القابس / القدرة / طول الكابل'},locale):c('model')}: ${row.model||'—'}; ${c('colours')}: ${row.colours||'—'}`);
  lines.push('  '+minimumNote(row,d.rows,locale));
  if(p.group==='film')lines.push('  '+copyFor(mixedCopy.reference,locale));
  if(p.sourceRecord)lines.push(`  Alibaba.com: ${p.sourceRecord.checkedAt}`,...(p.sourceRecord.model?[`  SKU: ${p.sourceRecord.model}`]:[]));
  if(p.pack&&!p.assembly)lines.push('  '+copyFor(p.pack,locale));
  if(p.assembly)lines.push(`  ${c(p.assembly)}. ${copyFor(p.pack,locale)}`);
  if(p.url)lines.push(`  ${c('source')}: ${p.url}`,price===null?c('below'):`  ${c('reference')}: CNY ${price.toFixed(2)}`);
  else lines.push(c('onRequest'));
 }
 if(d.filmChecks.length)lines.push('',...d.filmChecks.map(key=>'- '+EN.requests[key]));
 if(d.inspectionChecks.length)lines.push('',...inspectionOptions.filter(x=>d.inspectionChecks.includes(x.id)).map(x=>'- '+copyFor(x.label,locale)));
 lines.push('',copyFor(mixedCopy.scope,locale),`${c('packaging')}: ${d.contact.packaging||'—'}`,`${c('notes')}: ${d.contact.notes||'—'}`,'',c('scope'),...(d.rows.some(r=>productById(r.id).group!=='film')?[c('cases')+' / '+c('straps')+': '+c('quoteNote')]:[]));
 return {name:cleanText(d.contact.name,100),email:cleanText(d.contact.email,254),subject:`DDNZ — ${c('brief')} — ${d.rows.length}`,message:lines.join('\n')};
}
export function mobileJourneyAnalytics(locale,action){if(!['en','es','ar'].includes(locale)||!['add_style','remove_style','compare_quantity','calculate','review_brief','submit_success','submit_error','view_category','play_video'].includes(action))return null;return {event:'mobile_sourcing_journey',params:{content_group:'mobile_accessories',content_language:locale,journey_action:action}};}
