import {localePrefix} from '../site-localization/translate.mjs';
import { normalizeDraft, MOBILE_DRAFT_KEY } from './buying.mjs';
import { PRODUCTS } from '../screen-protectors/calculator.mjs';
import { parsePhoneQuantity, restoreLocalizedDraft } from '../screen-protectors/localization.mjs';
export const mixedBriefPath=locale=>localePrefix(locale)+'/sourcing/mobile-accessories-from-china/#buying-brief';
export const newRowId=()=> 'line-'+globalThis.crypto.randomUUID();
export function replaceFilms(draft,selection,locale='en'){
 const d=normalizeDraft(draft);
 if(d.rows.filter(r=>!r.id.startsWith('film-')).length+selection.rows.length>100)throw Error('Maximum 100 combined lines');
 d.rows=[...d.rows.filter(r=>!r.id.startsWith('film-')),...selection.rows.filter(r=>Object.hasOwn(PRODUCTS,r.product)).map((r,i)=>({id:'film-'+r.product,rowId:r.rowId||'film-line-'+i,quantity:String(locale==='en'?r.qty:Number.isFinite(parsePhoneQuantity(locale,r.qty))?parsePhoneQuantity(locale,r.qty):r.qty),model:r.model||'',colours:r.colours||''}))].slice(0,100);
 d.contact.destination=selection.destination??d.contact.destination;
 d.contact.notes=selection.notes??d.contact.notes;
 return normalizeDraft(d);
}
export function readMixedDraft(storage){
 const text=storage.getItem(MOBILE_DRAFT_KEY);
 const raw=text?JSON.parse(text):null;
 let draft=normalizeDraft(raw);
 // Import the previous localized draft once. The Istanbul calculator is never imported automatically.
 if(!raw?.mixedOrderVersion){
  const old=JSON.parse(storage.getItem('ddnz_phone_localized_draft_v1')||'null');
  if(old&&['zh','es','ar','ru','fr','pt','tr'].includes(old.locale)){
   const selection=restoreLocalizedDraft(old,old.locale);
   if(selection)draft=replaceFilms(draft,{...selection,destination:draft.contact.destination||selection.destination,notes:[draft.contact.notes,selection.notes].filter(Boolean).join('\n')},old.locale);
  }
 }
 return draft;
}
export function saveMixedDraft(storage,draft){const d=normalizeDraft(draft);storage.setItem(MOBILE_DRAFT_KEY,JSON.stringify(d));return d;}
export function filmSelection(draft){return {rows:draft.rows.filter(r=>r.id.startsWith('film-')).map(r=>({product:r.id.slice(5),rowId:r.rowId,model:r.model,colours:r.colours,qty:r.quantity})),destination:draft.contact.destination,notes:draft.contact.notes};}
export function addFilm(storage,product){
 if(!Object.hasOwn(PRODUCTS,product))throw Error('Unknown product');
 const draft=readMixedDraft(storage);if(draft.rows.length>=100)throw Error('Maximum 100 lines');
 draft.rows.push({id:'film-'+product,rowId:newRowId(),quantity:String(PRODUCTS[product].addQty),model:'',colours:''});return saveMixedDraft(storage,draft);
}

export function importCalculator(storage,state){
 const d=readMixedDraft(storage),current=filmSelection(d);
 const rows=[...current.rows];
 for(const row of state.rows){
  if(!rows.some(r=>r.product===row.product&&r.model===row.model&&String(r.qty)===String(row.qty)))rows.push({...row,rowId:newRowId()});
 }
 return saveMixedDraft(storage,replaceFilms(d,{rows},'en'));
}
