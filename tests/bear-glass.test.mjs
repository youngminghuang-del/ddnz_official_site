import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {bearProducts,bearCopy,bearImages} from '../src/features/mobile-sourcing/bear-glass.mjs';
import {renderBear,renderFilmNavigator} from '../src/features/mobile-sourcing/bear-gallery.mjs';
import {emptyDraft,buildMobilePayload,normalizeDraft} from '../src/features/mobile-sourcing/buying.mjs';
import {referencePrice} from '../src/features/mobile-sourcing/catalog.mjs';
import {minimumNote} from '../src/features/mobile-sourcing/mixed-products.mjs';
test('HD and privacy share the confirmed minimum and tier group across model rows only',()=>{
 const d=emptyDraft();d.rows=[{id:'bear-glass-hd',rowId:'a',quantity:'1500',model:'16 Pro',colours:''},{id:'bear-glass-privacy',rowId:'b',quantity:'1500',model:'16 Pro Max',colours:''},{id:'privacy-o-fold',rowId:'c',quantity:'3000',model:'15 Pro',colours:''}];
 assert.equal(normalizeDraft(d).rows.length,3);
 let m=buildMobilePayload(d).message;assert.equal((m.match(/Supply price: CNY 3.50/g)||[]).length,2);assert.ok(m.includes('Supply price: CNY 3.20'));
 d.rows[1].quantity='1499';m=buildMobilePayload(d).message;assert.equal((m.match(/Supply price: CNY 3.75/g)||[]).length,2);
 d.rows[0].quantity='150';d.rows[1].quantity='149';m=buildMobilePayload(d).message;assert.ok(!m.includes('Supply price: CNY 3.75'));assert.ok(minimumNote(d.rows[0],d.rows).includes('Below'));
 d.rows[1].quantity='150';m=buildMobilePayload(d).message;assert.equal((m.match(/Supply price: CNY 3.75/g)||[]).length,2);
 for(const p of bearProducts)for(const [q,v] of [[299,null],[300,3.75],[2999,3.75],[3000,3.5]])assert.equal(referencePrice(p,q),v);
});
test('eight localized series preserve distinct variants, prices and six detail images',()=>{
 for(const [lang,c] of Object.entries(bearCopy)){const html=renderBear(lang),nav=renderFilmNavigator(lang);assert.ok(html.includes(c[0].replaceAll('&','&amp;')));assert.ok(html.includes(c[4]));assert.equal((html.match(/data-bear-image-index=/g)||[]).length,6);assert.ok(html.includes('CNY 3.75'));assert.ok(html.includes('CNY 3.50'));assert.ok(html.includes('data-bear-variant="bear-glass-hd"'));assert.ok(html.includes('data-bear-variant="bear-glass-privacy"'));assert.ok(html.includes('<dialog'));assert.ok(nav.includes('#bear-glass'));assert.ok(!html.includes('undefined'));}
 for(const path of bearImages)assert.ok(fs.existsSync(new URL('../public'+path,import.meta.url)));
});
