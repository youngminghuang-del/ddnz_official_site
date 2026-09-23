import {translatedText,translatedTree} from '../site-localization/translate.mjs';
import {PRODUCTS,BASIS,preset,calculate,economics,cartonFacts} from './calculator.mjs';
import {EN,t} from './locales/en.mjs';
export {PRODUCTS,BASIS,preset,economics,cartonFacts};
export const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'CNY',currencyDisplay:'code',minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
export const number=(n,d=0)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:d}).format(n);
export const referenceDate=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(BASIS.date+'T00:00:00Z'));
export const names=EN.product.names;
export function packingLine(g,locale='en'){
 const number=(n,d=0)=>new Intl.NumberFormat(locale==='zh'?'zh-CN':locale,{maximumFractionDigits:d}).format(n);
 const t=(key,params={})=>translatedText(key.split('.').reduce((v,k)=>v?.[k],EN),locale).replace(/\{(\w+)\}/g,(_,k)=>String(params[k]??`{${k}}`));
  const parts=[];
  if(g.full)parts.push(t(g.full===1?'packingText.fullOne':'packingText.fullOther',{count:number(g.full)}));
  if(g.tail)parts.push(t('packingText.partial',{pieces:number(g.tail)}));
  return t('packingText.line',{qty:number(g.qty),packing:parts.join(' + '),cartons:number(g.cartons)});
}
function englishError(error){
  if(error==='请至少添加一行产品。')return t('errors.empty');
  if(error==='一份方案最多支持100行。')return t('errors.rows');
  if(error==='请选择有效的装箱与计费口径。')return t('errors.options');
  if(error==='一份方案最多支持1,000,000片。')return t('errors.total');
  const qty=error.match(/^第(\d+)行：数量须为(\d+)至/);
  if(qty)return t('errors.quantity',{row:qty[1],min:qty[2]});
  const product=error.match(/^第(\d+)行：请选择有效产品/);
  if(product)return t('errors.product',{row:product[1]});
  const model=error.match(/^第(\d+)行：机型名称/);
  if(model)return t('errors.model',{row:model[1]});
  if(error.includes('重复，请合并'))return t('errors.duplicate');
  if(error.startsWith('OG28 防窥膜合计至少'))return t('errors.og28');
  return t('errors.generic');
}
export function estimate(rows,packing,charging){
  const result=calculate(rows,packing,charging);
  return {...result,errors:result.errors.map(englishError),warnings:(result.warnings||[]).map(w=>t(w.startsWith('001')?'errors.partial001':'errors.partialOg28')),groups:result.groups?.map(g=>({...g,models:g.models.map(m=>m==='机型待填写'?t('quote.modelMissing'):m)}))};
}
export function makeBrief(result,state,locale='en'){
 const native=translatedTree(EN,locale),names=native.product.names;
 const number=(n,d=0)=>new Intl.NumberFormat(locale==='zh'?'zh-CN':locale,{maximumFractionDigits:d}).format(n);
 const money=n=>new Intl.NumberFormat(locale==='zh'?'zh-CN':locale,{style:'currency',currency:'CNY',currencyDisplay:'code',minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
 const referenceDate=new Intl.DateTimeFormat(locale==='en'?'en-GB':locale==='zh'?'zh-CN':locale,{day:'numeric',month:locale==='en'?'short':'long',year:'numeric',timeZone:'UTC'}).format(new Date(BASIS.date+'T00:00:00Z'));
 const t=(key,params={})=>key.split('.').reduce((v,k)=>v?.[k],native).replace(/\{(\w+)\}/g,(_,k)=>String(params[k]??`{${k}}`));
  if(!result.valid)return [t('calc.invalid'),...result.errors].join('\n');
  const route=result[state.route];
  return [t('quote.heading'),t('quote.reference',{date:referenceDate}),t('quote.destination'),' ',
    ...result.rows.map((r,i)=>t('quote.line',{row:i+1,product:names[r.product],model:r.model||t('quote.modelMissing'),qty:number(r.qty),price:money(PRODUCTS[r.product].price)})),
    '',t('quote.totalQty',{qty:number(result.qty),goods:money(result.goods)}),t('quote.moq'),
    t('quote.packing',{packing:t('calc.packingOptions.'+state.packing)}),
    ...result.groups.map(g=>`${names[g.product]}${state.packing==='model'?' / '+g.models.join(', '):''}: `+packingLine(g,locale)+'; '+t('calc.groupMeta',{dimensions:PRODUCTS[g.product].cartonCm.join(' × '),volume:number(g.cbm,5),weight:number(g.actualKg,3)})),
    ...result.warnings.map(w=>translatedText(w,locale)),t('quote.airBilling',{charging:t('calc.chargingOptions.'+state.charging)}),
    t('quote.shipment',{cartons:number(result.cartons),volume:number(result.cbm,5),gross:number(result.actualKg,3),dim:number(result.dimensionalKg,3),charge:number(result.chargeKg,3)}),'',
    t('quote.route',{route:t('calc.'+state.route),fee:money(route.fee),total:money(route.total),unit:money(route.unit)}),
    t('quote.comparison',{sea:money(result.sea.total),air:money(result.air.total)}),t('calc.formulaSea'),t('calc.formulaDim'),t('calc.scope'),t('calc.timing'),t('calc.limits'),t('calc.classification'),'',
    t('quote.checks'),...native.quote.confirm.map((x,i)=>`${i+1}. ${x}`),
    ...state.requests.filter(id=>Object.hasOwn(EN.requests,id)).map(id=>'• '+native.requests[id]),'',t('quote.final')].join('\n');
}
