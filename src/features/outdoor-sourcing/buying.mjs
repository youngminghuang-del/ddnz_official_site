import { outdoorProducts, getProduct, priceAt, copy, FX } from './catalog.mjs';
import { ui } from './copy.mjs';
import { validEmail } from '../commercial-kitchen/data/inquiry.mjs';

export function numberInput(value) {
 const s=String(value??'').normalize('NFKC').replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).trim().replace(/[٫,]/g,'.');
 if(!/^\d+(?:\.\d+)?$/.test(s))return null;
 const n=Number(s);return Number.isFinite(n)&&n<=1e9?n:null;
}
export function quantityInput(value){const n=numberInput(value);return Number.isInteger(n)&&n>=1&&n<=1000000?n:null;}
export function runtime(product,load,efficiency){
 const watts=numberInput(load),usable=numberInput(efficiency);
 if(!product?.wh||!product?.watts||!watts||!usable||usable>100)return {status:'incomplete'};
 if(watts>product.watts)return {status:'overload'};
 return {status:'complete',hours:product.wh*usable/100/watts};
}
export const costKeys=['goods','freight','fees','tax','prep','vat','sale','channel'];
export function trialDefaults(){return {id:'sanhe-st',quantity:'10',currency:'CNY',rate:FX.cnyPerUsd.toFixed(6),goods:'450',freight:'',fees:'',tax:'',prep:'',vat:'',sale:'',channel:''};}
export function changeCurrency(state,currency){return {...state,currency:currency==='USD'?'USD':'CNY',...Object.fromEntries(costKeys.map(k=>[k,'']))};}
export function referenceInCurrency(state){const p=priceAt(getProduct(state.id),quantityInput(state.quantity));const rate=state.currency==='USD'?numberInput(state.rate):1;return p===null||!rate?null:Math.round(p/rate*100)/100;}
export function trialEconomics(state){
 const quantity=quantityInput(state.quantity),values=Object.fromEntries(costKeys.map(k=>[k,numberInput(state[k])]));
 if(!quantity||!['CNY','USD'].includes(state.currency)||costKeys.some(k=>values[k]===null)||values.sale<=0||values.channel>100)return {status:'incomplete'};
 const {goods,freight,fees,tax,prep,vat,sale,channel}=values;
 const landed=goods+(freight+fees)/quantity+tax+prep;
 const contribution=sale-landed-sale*channel/100;
 return {status:'complete',quantity,landed,cash:quantity*(landed+vat),contribution,margin:contribution/sale*100,batchContribution:contribution*quantity};
}
const text=(value,max=500)=>String(value??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
export function emptyBrief(){return {version:1,rows:[],checks:[],guideNote:'',form:{name:'',email:'',company:'',destination:'',voltage:'',notes:''}};}
export function normalizeBrief(input){
 const d=emptyBrief(),seen=new Set();
 if(!input||typeof input!=='object'||input.version!==1)return d;
 for(const row of Array.isArray(input.rows)?input.rows:[]){if(getProduct(row?.id)&&!seen.has(row.id)){seen.add(row.id);d.rows.push({id:row.id,quantity:text(row.quantity,12)});}}
 d.guideNote=String(input.guideNote??'').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g,' ').trim().slice(0,2400);
 d.checks=ui.steps.filter(step=>Array.isArray(input.checks)&&input.checks.includes(step.id)).map(step=>step.id);
 for(const key of Object.keys(d.form))d.form[key]=text(input.form?.[key],key==='notes'?1200:key==='email'?254:160);
 return d;
}
export function validBrief(input,consent){const d=normalizeBrief(input);return Boolean(consent&&d.form.name&&validEmail(d.form.email)&&d.form.destination&&d.form.voltage&&(d.rows.length||d.form.notes)&&d.rows.every(row=>quantityInput(row.quantity)));}
export function buildOutdoorPayload(input,locale='en'){
 const d=normalizeBrief(input),t=key=>copy(ui[key],locale);
 const lines=['DDNZ — '+t('brief'),`${t('destination')}: ${d.form.destination}`,`${t('company')}: ${d.form.company||'—'}`,`${t('voltage')}: ${d.form.voltage}`,'',t('selected')+':'];
 for(const row of d.rows){const p=getProduct(row.id),qty=quantityInput(row.quantity),price=priceAt(p,qty);lines.push(`- ${p.model} | ${copy(p.name,locale)} | ${t('qty')}: ${qty??'—'}`);if(price!==null)lines.push(`  ${t('unitPrice')}: CNY ${price.toFixed(2)} (${t(p.priceKind==='reference'?'reference':'listing')})`);else lines.push('  '+t('quoteOnly'));}
 if(d.checks.length)lines.push('',t('checks')+':',...ui.steps.filter(s=>d.checks.includes(s.id)).map(s=>'- '+copy(s.title,locale)));
 if(d.guideNote)lines.push('',d.guideNote);
 lines.push('',`${t('notes')}: ${d.form.notes||'—'}`,'',t('requestNote'));
 return {name:d.form.name,email:d.form.email,subject:'DDNZ — '+t('brief'),message:lines.join('\n')};
}
export function outdoorEvent(locale,action){return ['en','zh','es','ar','ru','fr','pt','tr'].includes(locale)&&['add_product','review_brief','calculate','request_check','submit_success','submit_error'].includes(action)?{event:'outdoor_sourcing_journey',params:{content_group:'outdoor',content_language:locale,journey_action:action}}:null;}
