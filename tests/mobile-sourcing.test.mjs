import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { tsImport } from 'tsx/esm/api';
import { mobileProducts, productById, referencePrice } from '../src/features/mobile-sourcing/catalog.mjs';
import { emptyDraft, normalizeDraft, parseAmount, parseQuantity, buyingScenario, buildMobilePayload, validateMobileDraft, mobileJourneyAnalytics } from '../src/features/mobile-sourcing/buying.mjs';
import { mobilePages } from '../src/features/mobile-sourcing/routes.mjs';
import { mobileMetadata } from '../src/features/mobile-sourcing/seo.mjs';
import { productAlternates, localizedProductPath } from '../src/lib/productLocalization.mjs';
import { submitInquiry } from '../src/features/commercial-kitchen/data/inquiry.mjs';
import { inspectionOptions, supplierDimensions, orderCheckSteps } from '../src/features/mobile-sourcing/inspection-content.mjs';
const { default: Content }=await tsImport('../src/features/mobile-sourcing/MobileContent.jsx',import.meta.url);

test('supplier tiers switch at exact minimums and never quote samples or invalid quantities',()=>{
 assert.equal(mobileProducts.length,18);
 assert.equal(mobileProducts.filter(p=>p.tiers).length,14);
 for(const p of mobileProducts){
  for(const q of [0,-1,null,NaN,Infinity,1.5,1000001])assert.equal(referencePrice(p,q),null);
  if(!p.tiers){assert.equal(referencePrice(p,500),null);continue;}
  assert.equal(referencePrice(p,p.tiers[0][0]-1),null);
  p.tiers.forEach(([min,price],i)=>{assert.equal(referencePrice(p,min),price);if(i)assert.equal(referencePrice(p,min-1),p.tiers[i-1][1]);});
  assert.match(p.url,/^https:\/\/www\.alibaba\.(?:com|it)\/product-detail\/.+_\d+\.html$/);
 }
 assert.equal(referencePrice(productById('patch-trendcomm'),100),5.79);
 assert.equal(productById('patch-trendcomm').sample,34.06);
 assert.equal(referencePrice(productById('chain-trendcomm'),100),38.50);
 assert.equal(productById('patch-trendcomm').assembly,'component');
});
test('localized numeric inputs reject malformed and negative values',()=>{
 assert.equal(parseAmount('2,50'),2.5);
 assert.equal(parseAmount('٢٫٥٠'),2.5);
 assert.equal(parseQuantity('٥٠٠'),500);
 for(const s of ['', '1,000.25','-1','1e3','Infinity'])assert.equal(parseAmount(s),null);
 for(const s of ['0','2,5','1000001'])assert.equal(parseQuantity(s),null);
});
test('cost model requires explicit costs, uses entered FX and shows losses as gross margin',()=>{
 const base={...emptyDraft().calculator,currency:'USD',rate:'6',quantity:'100',freight:'0',tax:'0',pack:'0',other:'0',sale:'5'};
 let r=buyingScenario(base);assert.equal(r.status,'complete');assert.ok(Math.abs(r.unitCost-3.07)<1e-9);assert.ok(Math.abs(r.batchCost-307)<1e-9);assert.ok(Math.abs(r.grossMargin-38.6)<1e-9);
 r=buyingScenario({...base,sale:'3',tax:'0.50'});assert.ok(Math.abs(r.unitCost-3.57)<1e-9);assert.ok(r.grossMargin<0);
 r=buyingScenario({...base,currency:'CNY',rate:'',sale:'25'});assert.equal(r.unitCost,18.42);assert.ok(Math.abs(r.batchCost-1842)<1e-9);
 for(const patch of [{rate:''},{rate:'0'},{freight:''},{sale:'0'},{other:'-1'}])assert.equal(buyingScenario({...base,...patch}).status,'incomplete');
 assert.equal(buyingScenario({...base,quantity:'4'}).status,'below');
});
test('draft restores only known products and preserves buyer data across languages',()=>{
 const d=emptyDraft();Object.assign(d.contact,{name:'Preview Buyer',email:'qa@example.invalid',destination:'Dubai',company:'Test Company'});
 d.rows=[{id:'folio-bida',quantity:'٥٠٠',model:'Buyer device',colours:'Black 500'}];
 assert.deepEqual(validateMobileDraft(d),{});
 const copy=normalizeDraft(JSON.parse(JSON.stringify(d)));assert.deepEqual(copy,d);
 const bad=normalizeDraft({...d,rows:[...d.rows,...d.rows,{id:'unknown'}],calculator:{currency:'XYZ',id:'unknown'}});assert.equal(bad.rows.length,1);assert.equal(bad.calculator.currency,'CNY');
 for(const locale of ['en','es','ar']){const p=buildMobilePayload(copy,locale);assert.ok(p.message.includes(productById('folio-bida').name[locale]));assert.ok(p.message.includes('Buyer device'));assert.ok(p.message.includes('Dubai'));assert.ok(p.message.includes('CNY 17.72'));assert.doesNotMatch(p.message,/JPY/);}
 d.rows[0].quantity='0';d.rows[0].model='';assert.ok(validateMobileDraft(d)['folio-bida-quantity']);assert.ok(validateMobileDraft(d)['folio-bida-model']);
});
test('old currency drafts retain buyer details without relabelling saved costs or FX',()=>{
 const old={...emptyDraft(),schemaVersion:undefined,rows:[{id:'folio-bida',quantity:'100',model:'Model',colours:'Black'}],contact:{...emptyDraft().contact,name:'Buyer'},calculator:{...emptyDraft().calculator,id:'patch-trendcomm',quantity:'500',currency:'JPY',freight:'250',sale:'900',rate:'1'}};
 const migrated=normalizeDraft(old);assert.equal(migrated.schemaVersion,2);assert.equal(migrated.calculator.currency,'CNY');assert.equal(migrated.calculator.rate,'1');assert.equal(migrated.calculator.freight,'');assert.equal(migrated.calculator.sale,'');assert.equal(migrated.calculator.id,'patch-trendcomm');assert.equal(migrated.calculator.quantity,'500');assert.deepEqual(migrated.rows,old.rows);assert.equal(migrated.contact.name,'Buyer');
 const dollars=normalizeDraft({...old,calculator:{...old.calculator,currency:'USD',rate:'150',freight:'2'}});assert.equal(dollars.calculator.rate,'');assert.equal(dollars.calculator.freight,'2');
 const current=normalizeDraft({...dollars,schemaVersion:2,calculator:{...dollars.calculator,rate:'7'}});assert.equal(current.calculator.rate,'7');
});
test('inspection requests work without a catalogue selection and carry localized scope',()=>{
 const draft=emptyDraft();Object.assign(draft.contact,{name:'Preview Buyer',email:'qa@example.invalid',destination:'Dubai'});draft.inspectionChecks=['factory','shipment','factory','untrusted'];
 assert.deepEqual(normalizeDraft(draft).inspectionChecks,['factory','shipment']);assert.equal(validateMobileDraft(draft).notes,'required');
 draft.contact.notes='Supplier link and product specification to follow';assert.deepEqual(validateMobileDraft(draft),{});
 for(const locale of ['en','es','ar']){const message=buildMobilePayload(draft,locale).message;for(const id of ['factory','shipment'])assert.ok(message.includes(inspectionOptions.find(x=>x.id===id).label[locale]));}
});
test('local simulation sends nothing and analytics accepts no free-form payload',async()=>{
 let requests=0;const result=await submitInquiry(buildMobilePayload(emptyDraft()),{hostname:'127.0.0.1',fetchImpl:()=>{requests++;throw Error('Must not send');}});
 assert.equal(requests,0);assert.equal(result.mode,'preview');
 assert.equal(mobileJourneyAnalytics('en','qa@example.invalid'),null);
 assert.deepEqual(Object.keys(mobileJourneyAnalytics('ar','add_style').params),['content_group','content_language','journey_action']);
});
test('all twelve SSR pages have complete localized content, valid media and reciprocal URLs',()=>{
 for(const page of mobilePages)for(const locale of ['en','es','ar']){
  const html=renderToStaticMarkup(React.createElement(Content,{pageId:page.id,locale}));
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  assert.ok(html.includes(`lang="${locale}" dir="${locale==='ar'?'rtl':'ltr'}"`));
  assert.ok(html.includes('id="buying-brief"'));assert.ok(html.includes('id="price-comparison"'));
  assert.doesNotMatch(html,/Supplier [A-D]|Good \/ Better|iPhone18fold|\[object Object\]|undefined|NaN|JPY|From samples to repeatable orders/);
  if(['compare','hub'].includes(page.id)){assert.equal(supplierDimensions.length,7);for(const d of supplierDimensions)assert.ok(html.includes(d.name[locale].replaceAll('&','&amp;')));}
  if(page.id!=='straps')for(const step of orderCheckSteps)assert.ok(html.includes(step.title[locale]));
  for(const [,src] of html.matchAll(/<(?:img|source)[^>]*src="([^"]+)"/g))assert.ok(fs.existsSync(new URL('../public'+src,import.meta.url)),src);
  const meta=mobileMetadata(page.id,locale);assert.equal(meta.path,localizedProductPath(page.path,locale));assert.equal(meta.schema['@graph'][0].inLanguage,locale);
  assert.equal(productAlternates(page.path).length,3);
  assert.ok(productAlternates(page.path).some(x=>x.hrefLang===locale&&x.href==='https://www.ddnzglobal.com'+meta.path));
  assert.doesNotMatch(JSON.stringify(meta.schema),/AggregateRating|priceCurrency|availability/);
 }
});
