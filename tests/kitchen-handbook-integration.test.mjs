import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../src/features/commercial-kitchen/data/products.mjs';
import {handbookProducts} from '../src/features/commercial-kitchen/data/handbookProducts.mjs';
import {getLocalizedKitchenProducts,filterKitchenProducts,cleanKitchenSelection,addKitchenSelection,toggleKitchenComparison,buildLocalizedKitchenInquiry} from '../src/features/commercial-kitchen/data/localization.mjs';
import {buildInquiryPayload} from '../src/features/commercial-kitchen/data/inquiry.mjs';
import {makeBrief} from '../src/features/commercial-kitchen/data/model.mjs';
test('fourteen handbook records extend the original catalogue without invented prices or duplicated identities',()=>{
 assert.equal(catalog.length,46);assert.equal(handbookProducts.length,14);assert.equal(new Set(catalog.map(p=>p.id)).size,46);
 assert.equal(catalog.filter(p=>!p.handbookGroup&&!p.coffeeSeries).length,26);assert.equal(catalog.filter(p=>p.quote).length,8);
 assert.ok(handbookProducts.every(p=>p.quote===null));
 assert.equal(catalog.find(p=>p.id==='yst-zfg24x').power,'2 × (15 / 20 kW)');
 assert.equal(catalog.find(p=>p.id==='yst-zml50-2').supply,'220 / 380 V · 50 Hz');
});
test('saved mixed selections survive restoration, quantity merges and the three-model comparison limit',()=>{
 const old=catalog[0].id;
 const list=cleanKitchenSelection({[old]:2,'yst-dtl150x':3,'yst-zfg24x':4,unknown:5});
 assert.equal(Object.keys(list).length,3);assert.equal(addKitchenSelection(list,{'yst-dtl150x':2})['yst-dtl150x'],5);
 let comparison=[];for(const id of Object.keys(list))comparison=toggleKitchenComparison(comparison,id).ids;
 assert.equal(toggleKitchenComparison(comparison,'yst-k8c').limited,true);
 assert.equal(toggleKitchenComparison(comparison,'yst-dtl150x').ids.length,2);
});
for(const locale of ['zh','es','ar','ru','fr','pt','tr'])test(`${locale}: new records are searchable and complete in a mixed inquiry`,()=>{
 const products=getLocalizedKitchenProducts(locale),old=catalog[0].id;
 for(const p of handbookProducts){const translated=products.find(item=>item.id===p.id);assert.ok(translated.name&&translated.note);assert.ok(translated.localizedSpecs.every(s=>s.label&&s.value));assert.equal(filterKitchenProducts(products,{search:p.model})[0].id,p.id);assert.ok(filterKitchenProducts(products,{search:translated.name}).some(item=>item.id===p.id));}
 const list=Object.fromEntries(catalog.map(p=>[p.id,p.id===old?3:2]));
 const message=buildLocalizedKitchenInquiry(locale,{list,form:{country:'Other',type:'importer'}}).message;
 for(const p of products)assert.ok(message.includes(p.displayModel),p.displayModel);
 const steam=products.find(p=>p.id==='yst-zfg24x');assert.ok(message.includes(steam.configurationNote));assert.ok(message.includes(steam.localizedSpecs.find(s=>s.key==='Total rated power').value));
 assert.doesNotMatch(message,/undefined|Configuration for/);
});
test('English inquiry and downloadable brief retain alternative configurations and every requested model',()=>{
 const list=Object.fromEntries(catalog.map(p=>[p.id,2]));
 const payload=buildInquiryPayload({products:catalog,list,form:{}});
 const brief=makeBrief(catalog,list,{});
 for(const p of catalog){assert.ok(payload.message.includes(p.model));assert.ok(brief.includes(p.model));}
 for(const text of [payload.message,brief]){assert.ok(text.includes('2 × (15 / 20 kW)'));assert.ok(text.includes('220 / 380 V · 50 Hz'));}
});
