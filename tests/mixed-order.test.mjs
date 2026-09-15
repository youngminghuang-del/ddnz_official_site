import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyDraft, normalizeDraft, buildMobilePayload, validateMobileDraft, MOBILE_DRAFT_KEY } from '../src/features/mobile-sourcing/buying.mjs';
import { readMixedDraft, saveMixedDraft, replaceFilms, filmSelection, addFilm, importCalculator } from '../src/features/mobile-sourcing/mixed-storage.mjs';
import { minimumNote } from '../src/features/mobile-sourcing/mixed-products.mjs';
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)}};
const caseRow={id:'silicone-jmetec',quantity:'100',model:'iPhone 16',colours:'Black'};
test('case and multiple film models survive page and locale transitions with actual destination',()=>{
 const storage=memory(),d=emptyDraft();d.rows=[caseRow];Object.assign(d.contact,{name:'Test',email:'test@example.invalid',destination:'Accra, Ghana',notes:'Use neutral packaging'});saveMixedDraft(storage,d);
 addFilm(storage,'001');let selected=filmSelection(readMixedDraft(storage));selected.rows[0].model='iPhone 16';selected.rows.push({product:'001',model:'iPhone 15',qty:'1.000'});
 saveMixedDraft(storage,replaceFilms(readMixedDraft(storage),selected,'es'));
 const restored=readMixedDraft(storage);assert.equal(restored.rows.length,3);assert.equal(restored.rows[2].quantity,'1000');assert.equal(restored.contact.destination,'Accra, Ghana');assert.deepEqual(validateMobileDraft(restored),{});
 for(const locale of ['en','es','ar']){const payload=buildMobilePayload(restored,locale);assert.match(payload.message,/iPhone 16/);assert.match(payload.message,/iPhone 15/);assert.match(payload.message,/Accra, Ghana/);assert.match(payload.message,/CNY 6.00/);assert.doesNotMatch(payload.message,/Istanbul|10,000/);}
 assert.deepEqual(normalizeDraft(restored),restored);
});
test('fresh request is empty; old Istanbul calculator is never imported automatically',()=>{
 const s=memory();s.setItem('ddnz_phone_draft_v1',JSON.stringify({rows:[{product:'001',qty:10000,model:''}]}));
 const d=readMixedDraft(s);assert.deepEqual(d.rows,[]);assert.equal(d.contact.destination,'');assert.equal(validateMobileDraft(d).destination,'required');assert.doesNotMatch(buildMobilePayload(d).message,/Istanbul/);
});
test('a case quantity does not satisfy the OG28 product minimum',()=>{
 const film={id:'film-og28',quantity:'100',model:'iPhone 16',colours:''};const rows=[{...caseRow,quantity:'900'},film];
 assert.match(minimumNote(film,rows),/Below this product/);
 assert.doesNotMatch(minimumNote(film,[...rows,{...film,rowId:'another',quantity:'900',model:'iPhone 15'}]),/Below this product/);
 const d=emptyDraft();d.rows=rows;assert.match(buildMobilePayload(d).message,/supplier approval is required/);
});
test('localized migration happens once and deletion is not resurrected',()=>{
 const s=memory();s.setItem('ddnz_phone_localized_draft_v1',JSON.stringify({locale:'es',draft:{rows:[{product:'001',model:'iPhone 16',qty:'1.000'}],destination:'Lima',notes:''}}));
 let d=readMixedDraft(s);assert.equal(d.rows[0].quantity,'1000');d.rows=[];saveMixedDraft(s,d);assert.deepEqual(readMixedDraft(s).rows,[]);
});
test('explicit calculator import retains selected cases and films and is idempotent',()=>{
 const s=memory(),d=emptyDraft();d.rows=[caseRow];d.contact.destination='Lima';saveMixedDraft(s,d);addFilm(s,'og28');
 const state={rows:[{product:'001',model:'iPhone 16',qty:500}]};importCalculator(s,state);importCalculator(s,state);
 const saved=readMixedDraft(s);assert.equal(saved.rows.length,3);assert.equal(saved.contact.destination,'Lima');
});
test('invalid localized input remains editable and combined limit cannot silently discard rows',()=>{
 const d=emptyDraft();const changed=replaceFilms(d,{rows:[{product:'001',model:'iPhone 16',qty:'1,5'}]},'es');assert.equal(changed.rows[0].quantity,'1,5');assert.equal(validateMobileDraft(changed)['film-line-0-quantity'],'invalid');
 d.rows=[caseRow];assert.throws(()=>replaceFilms(d,{rows:Array.from({length:100},()=>({product:'001',qty:500,model:'x'}))}));
});

test('film editor roundtrip preserves variant identity and extra specifications',()=>{const d=emptyDraft();d.rows=[{id:'film-001',rowId:'custom-line',quantity:'500',model:'iPhone 16',colours:'Custom frame'}];const out=replaceFilms(d,filmSelection(d),'es');assert.deepEqual(out.rows,d.rows);});
