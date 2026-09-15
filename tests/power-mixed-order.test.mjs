import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {powerProducts} from '../src/features/mobile-sourcing/power-products.mjs';
import {referencePrice} from '../src/features/mobile-sourcing/catalog.mjs';
import {emptyDraft,normalizeDraft,validateMobileDraft,buildMobilePayload} from '../src/features/mobile-sourcing/buying.mjs';
test('power references use selected variants, not cheaper unrelated variants',()=>{
 assert.equal(referencePrice(powerProducts.find(p=>p.id==='pd30-wzk'),50),13.85);
 assert.equal(referencePrice(powerProducts.find(p=>p.id==='cable-orphie'),2),2.66);
 assert.equal(referencePrice(powerProducts.find(p=>p.id==='gan65-toye'),999),null);
 for(const p of powerProducts)assert.ok(fs.statSync(new URL('../public'+p.image,import.meta.url)).size>1000);
});
test('power, cases, straps and film retain all rows and specifications in one request',()=>{
 const d=emptyDraft();d.contact={...d.contact,name:'Buyer',email:'buyer@example.com',destination:'Dubai'};
 d.rows=[{id:'folio-bida',quantity:'5',model:'iPhone 16',colours:'Black 5'},{id:'rope-bintu',quantity:'50',model:'120cm',colours:'Blue 50'},{id:'film-001',quantity:'500',model:'iPhone 16',colours:''},{id:'pd30-wzk',quantity:'50',model:'30W / EU',colours:'White 50'}];
 assert.equal(normalizeDraft(d).rows.length,4);assert.deepEqual(validateMobileDraft(d),{});
 const text=buildMobilePayload(d).message;assert.match(text,/30W \/ EU/);assert.match(text,/CNY 13.85/);assert.match(text,/C05/);assert.match(text,/S01/);assert.match(text,/001/);
 d.rows[3].model='';assert.equal(validateMobileDraft(d)['pd30-wzk-model'],'required');
});
