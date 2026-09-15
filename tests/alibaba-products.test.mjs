import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { mobileProducts, productById, referencePrice } from '../src/features/mobile-sourcing/catalog.mjs';
import { featuredProductIds } from '../src/features/mobile-sourcing/alibaba-records.mjs';
import { emptyDraft,normalizeDraft,buildMobilePayload } from '../src/features/mobile-sourcing/buying.mjs';
import { minimumNote } from '../src/features/mobile-sourcing/mixed-products.mjs';
const ledger=JSON.parse(fs.readFileSync(new URL('../docs/reviews/alibaba-product-records-20260915.json',import.meta.url)));
test('featured products match live recorded sources, images and rounded CNY tiers',()=>{
 assert.equal(featuredProductIds.length,9);
 for(const id of featuredProductIds){const p=productById(id),record=ledger.records[id];assert.equal(p.url,record.url);assert.equal(p.sourceRecord.checkedAt,'2026-09-15');assert.ok(p.specs.length);assert.ok(fs.statSync(new URL('../public'+p.image,import.meta.url)).size>1000);for(let i=0;i<record.rawTiers.length;i++){const [q,jpy]=record.rawTiers[i];assert.equal(referencePrice(p,q),Math.round(jpy*ledger.rate.cnyPerJpy*100)/100);}}
 assert.equal(referencePrice(productById('chain-trendcomm'),50),38.50); // regular JPY 884, not promotional JPY 441
 assert.equal(referencePrice(productById('fabric-feishile'),10),13.63);
 assert.equal(referencePrice(productById('mesh-longan'),5),12.80);
});
test('new listings have their own identity and keep existing sample drafts intact',()=>{
 assert.equal(new Set(mobileProducts.map(p=>p.id)).size,mobileProducts.length);
 const d=emptyDraft();d.rows=[{id:'textured',quantity:'100',model:'Buyer phone',colours:'Black'},{id:'fabric-feishile',quantity:'10',model:'iPhone 16',colours:'Black'}];
 assert.equal(normalizeDraft(d).rows.length,2);assert.equal(productById('textured').type,'sample');assert.equal(productById('fabric-feishile').type,'listing');
 const message=buildMobilePayload(d).message;assert.match(message,/C07/);assert.match(message,/1,000/);assert.match(message,/2026-09-15/);assert.match(message,/20 × 10 × 2.5/);assert.match(message,/CNY 13.63/);
});
test('stock tier and custom minimum remain distinct in order notes',()=>{
 const row={id:'fabric-feishile',quantity:'10'};assert.match(minimumNote(row,[row]),/10 pieces/);assert.match(minimumNote(row,[row]),/1,000/);
 assert.match(productById('silicone-jmetec').orderNote.en,/FAQ/);assert.match(productById('silicone-jmetec').orderNote.en,/26 per model\/colour/);
});
