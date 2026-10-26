import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {privacyOFold,oFoldCopy,oFoldImages} from '../src/features/mobile-sourcing/privacy-o-fold.mjs';
import {referencePrice} from '../src/features/mobile-sourcing/catalog.mjs';
import {productById} from '../src/features/mobile-sourcing/mixed-products.mjs';
import {buildMobilePayload,emptyDraft,normalizeDraft} from '../src/features/mobile-sourcing/buying.mjs';
import {renderOFold} from '../src/features/mobile-sourcing/o-fold-gallery.mjs';

test('O-fold quantity boundaries use the user-confirmed supply prices',()=>{
 for(const [q,price] of [[299,null],[300,3.45],[2999,3.45],[3000,3.2],[5000,3.2]])assert.equal(referencePrice(privacyOFold,q),price);
 assert.equal(productById('privacy-o-fold'),privacyOFold);
 assert.equal(productById('privacy28-hd').tiers[0][1],4.8);
});
test('phone-model quantities combine within this product and exclude other privacy glass',()=>{
 const draft=emptyDraft();
 draft.rows=[{id:'privacy-o-fold',rowId:'a',quantity:'1500',model:'Phone A',colours:''},{id:'privacy-o-fold',rowId:'b',quantity:'1500',model:'Phone B',colours:''},{id:'privacy28-hd',quantity:'5000',model:'Phone C',colours:''}];
 assert.equal(normalizeDraft(draft).rows.length,3);
 let message=buildMobilePayload(draft,'en').message;
 assert.equal((message.match(/Supply price: CNY 3.20/g)||[]).length,2);
 draft.rows[1].quantity='1499';message=buildMobilePayload(draft,'en').message;
 assert.equal((message.match(/Supply price: CNY 3.45/g)||[]).length,2);
 draft.rows=[{id:'privacy-o-fold',quantity:'299',model:'Phone A',colours:''},draft.rows[2]];
 assert.ok(!buildMobilePayload(draft,'en').message.includes('Supply price: CNY 3.20'));
 assert.ok(!buildMobilePayload(draft,'en').message.includes('Supply price: CNY 3.45'));
});
test('eight-language entries retain all six processed images, prices and accessible controls',()=>{
 assert.equal(Object.keys(oFoldCopy).length,8);
 for(const [locale,c] of Object.entries(oFoldCopy)){
  const html=renderOFold(locale);
  assert.ok(html.includes(c.title));assert.ok(html.includes(c.minimum));
  assert.ok(html.includes('CNY 3.45'));assert.ok(html.includes('CNY 3.20'));
  assert.equal((html.match(/data-ofold-index=/g)||[]).length,6);
  assert.ok(html.includes('<dialog'));assert.ok(html.includes(c.close));
  assert.ok(html.includes('aria-pressed="true"'));assert.ok(!html.includes('undefined'));
  for(const src of oFoldImages)assert.ok(fs.existsSync(new URL('../public'+src,import.meta.url)));
 }
});
