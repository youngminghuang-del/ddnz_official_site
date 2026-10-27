import copies from './locales/standing-grinders.json';
import {inquiryUrl,machines} from './catalog.mjs';
import {localizedFoodInquiry,foodPrefix,foodLocales} from './localization';
export type GrinderLocale=keyof typeof copies;
export const standingGrinders=[
 {id:'jr-gg32a',model:'JR-GG32A',power:'2.2 kW',supply:'220 / 380 V · 50 Hz',dimensions:'480 × 800 × 780 mm',weight:'89 kg',output:'450 kg/h',quotationDimensions:'800 × 482 × 780 mm'},
 {id:'jr-gg42a',model:'JR-GG42A',power:'4 kW',supply:'380 V · 50 Hz',dimensions:'600 × 930 × 880 mm',weight:'115 kg',output:'800 kg/h',reference:{price:8700,packing:0,currency:'CNY'}},
 {id:'jr-gl22',model:'JR-GL22',series:'gl',power:'1.5 kW',supply:'220 / 380 V · 50 Hz',dimensions:'470 × 410 × 700 mm',weight:'35 kg',output:'220 kg/h',reference:{price:1950,packing:30,currency:'CNY'}},
 {id:'jr-gl32',model:'JR-GL32',series:'gl',power:'1.5 kW',supply:'220 / 380 V · 50 Hz',dimensions:'470 × 410 × 700 mm',weight:'36 kg',output:'320 kg/h',reference:{price:2100,packing:30,currency:'CNY'}},
];
export const grinderEligible=(page:{kind:string;category?:{slug:string}})=>page.kind==='hub'||page.category?.slug==='meat-processing-machinery';
export function grinderQuantity(value:unknown){const text=String(value??'').replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-0x660)).trim();return /^\d{1,2}$/.test(text)&&Number(text)>=1&&Number(text)<=99?Number(text):null;}
export function cleanGrinderSelection(raw:Record<string,unknown>={}){return Object.fromEntries(standingGrinders.flatMap(p=>{const quantity=Object.hasOwn(raw,p.id)?grinderQuantity(raw[p.id]):null;return quantity===null?[]:[[p.id,quantity]];}));}
export function grinderName(p:typeof standingGrinders[number],locale:GrinderLocale){return p.series==='gl'?copies[locale].compactName:copies[locale].name;}
export function grinderCaption(p:typeof standingGrinders[number],locale:GrinderLocale){return p.series==='gl'?copies[locale].glCaption:copies[locale].caption;}
export function grinderImageFor(p:typeof standingGrinders[number]){return p.series==='gl'?'/food-processing-media/compact-standing-grinder-series.webp':'/food-processing-media/standing-grinder-series.webp';}
export function grinderPacking(p:typeof standingGrinders[number],locale:GrinderLocale,quantity?:number){const c=copies[locale];return p.reference?.packing?`${c.woodPacking}: ${grinderMoney(p.reference.packing)}${quantity?` × ${quantity} = ${grinderMoney(p.reference.packing*quantity)}`:''}. ${quantity?'':c.exportPacking}`:c.packing;}
export const grinderMoney=(value:number)=>`CNY ${value.toLocaleString('en-US')}`;
export function standingGrinderTotals(selection:Record<string,unknown>){const clean=cleanGrinderSelection(selection);return standingGrinders.reduce((sum,p)=>{const n=clean[p.id]||0;return p.reference?{...sum,equipment:sum.equipment+p.reference.price*n,packing:sum.packing+p.reference.packing*n,units:sum.units+n}:{...sum,pendingUnits:sum.pendingUnits+n};},{equipment:0,packing:0,units:0,pendingUnits:0});}
export function grinderBrief(selection:Record<string,unknown>,locale:GrinderLocale){
 const c=copies[locale],clean=cleanGrinderSelection(selection),selected=standingGrinders.filter(p=>clean[p.id]);
 if(!selected.length)return '';
 const rows=selected.map(p=>{const n=clean[p.id];return `${p.model} × ${n}; ${c.power}: ${p.power}; ${c.supply}: ${p.supply}; ${c.dimensions}: ${p.dimensions}; ${c.weight}: ${p.weight}; ${c.output}: ${p.output}. ${p.reference?`${c.reference}: ${grinderMoney(p.reference.price)} × ${n} = ${grinderMoney(p.reference.price*n)}; ${grinderPacking(p,locale,n)}`:c.pending+'.'} ${p.quotationDimensions?`${c.alternateSize}: ${p.quotationDimensions}. ${c.sizeCheck}`:''}`;});
 return [c.name,...rows,selected.some(p=>p.series==='gl')?c.exportPacking:'',`${c.material}: ${c.stainless}.`,c.confirm,selected.some(p=>p.supply.includes(' / '))?c.voltageNote:'',c.performance].filter(Boolean).join('\n');
}
// Preserve priced equipment totals, but never represent an unquoted grinder as free.
export function combinedFoodInquiry(selection:Record<string,number>,grinders:Record<string,unknown>,destination:string,requirement:string,locale:GrinderLocale){
 const c=copies[locale],extra=grinderBrief(grinders,locale);
 const base=locale==='en'?inquiryUrl(selection,destination,extra?'':requirement):localizedFoodInquiry(selection,destination,extra?'':requirement,locale);
 if(!extra)return base;
 const url=new URL(base,'https://www.ddnzglobal.com');
 const hasPriced=Boolean(url.searchParams.get('productScope'));
 let legacy=url.searchParams.get('overviewBrief')||'';
 if(locale!=='en')for(const p of machines){const name=foodLocales[locale].names[machines.indexOf(p)];legacy=legacy.replaceAll(` · ${name} · `,' · ');}
 const notes=[c.costScope,hasPriced?c.legacyScope+'\n'+legacy:'',extra,requirement].filter(Boolean).join('\n\n');
 url.searchParams.set('overviewBrief',notes);url.searchParams.set('notes',notes);
 url.searchParams.set('productScope',[hasPriced?url.searchParams.get('productScope'):'',extra].filter(Boolean).join('\n'));
 url.searchParams.set('source','food_processing_standing_grinders');
 return url.pathname+'?'+url.searchParams.toString();
}
export const grinderImage='/food-processing-media/standing-grinder-series.webp';
export const grinderCopy=copies;
export {foodPrefix};
