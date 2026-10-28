import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ProductSeries,{cleanSeriesSelection} from '../src/features/product-series/ProductSeries';
import {seriesModels,seriesSpecs,seriesQuote} from '../src/features/product-series/models.mjs';
import {getLocalizedKitchenProducts,buildLocalizedKitchenInquiry,cleanKitchenSelection} from '../src/features/commercial-kitchen/data/localization.mjs';
import catalog from '../src/features/commercial-kitchen/data/products.mjs';
import copy from '../src/features/product-series/copy.json';

test('coffee catalogue retains old prices and identifies six new unpriced source models',()=>{
 assert.equal(catalog.length,46);assert.equal(catalog.filter(p=>p.quote).length,8);
 assert.equal(catalog.filter(p=>p.coffeeSeries).length,6);assert.ok(catalog.filter(p=>p.coffeeSeries).every(p=>p.quote===null));
 const by=Object.fromEntries(seriesModels.map(p=>[p.model,p]));
 assert.equal(by['G3200D'].size,undefined);assert.equal(by['YS-3120GM'].water,'plumbed');assert.equal(by['F11 Big Plus'].water,'8 L');assert.equal(by['DR-8828'].battery,'11.1 V / 4500 mAh');
});
test('new coffee models survive the existing shared list and have complete same-language mixed inquiry specifications',()=>{
 for(const locale of ['zh','es','fr','pt','ru','ar','tr']){
  const products=getLocalizedKitchenProducts(locale);const selection=Object.fromEntries(catalog.filter(p=>p.coffeeSeries).map(p=>[p.id,2]));selection['ice-49']=1;
  assert.equal(Object.keys(cleanKitchenSelection(selection)).length,7);
  const payload=buildLocalizedKitchenInquiry(locale,{list:selection,form:{country:'Other',type:'importer'}});
  for(const p of products.filter(p=>p.coffeeSeries)){assert.ok(p.name&&p.note&&p.dimensions);assert.ok(p.localizedSpecs.every(s=>s.label&&s.value));assert.ok(payload.message.includes(p.model));}
  assert.doesNotMatch(payload.message,/undefined|NaN/);
 }
});
test('speaker selection validates family and quantity, and quotations include model-specific battery and controls',()=>{
 assert.deepEqual(cleanSeriesSelection({'speaker-dr602':2,'coffee-fr-e139':1,'speaker-dr8828':1000,unknown:4},'speaker'),{'speaker-dr602':2,'speaker-dr8828':99});
 for(const locale of Object.keys(copy))for(const family of ['coffee','speaker'] as const){
  const models=seriesModels.filter(m=>m.family===family),selection=Object.fromEntries(models.map(m=>[m.id,2]));
  const url=new URL(seriesQuote(locale,family,selection,'Test destination'),'https://www.ddnzglobal.com');
  assert.equal(url.searchParams.get('leadGoal'),'Product Sourcing');
  assert.equal(url.pathname,`${locale==='en'?'':`/${locale==='zh'?'zh-cn':locale}`}/get-a-quote/`);
  const brief=url.searchParams.get('overviewBrief')!;assert.ok(brief.length<5000);
  for(const m of models){assert.ok(brief.includes(m.model+' × 2'));for(const spec of seriesSpecs(m,locale))assert.ok(spec.label&&spec.value);}
  const html=renderToStaticMarkup(<ProductSeries family={family} locale={locale}/>);assert.equal((html.match(/class="product-series-card"/g)||[]).length,models.length);assert.doesNotMatch(html,/undefined|NaN/);
  assert.ok(html.includes('"numberOfItems":'+models.length));assert.ok(!html.includes('"offers"'));assert.ok(html.includes(`dir="${locale==='ar'?'rtl':'ltr'}"`));
 }
});

test('coffee page has distinct buying content, eight linked references and complete alternates',async()=>{
 const {default:CoffeeContent}=await import('../src/features/coffee/CoffeeContent');
 const {coffeeMeta,coffeePath,coffeeAlternates}=await import('../src/features/coffee/data.mjs');
 const {localizedProductPath}=await import('../src/lib/productLocalization.mjs');
 for(const lang of Object.keys(copy)){
  const html=renderToStaticMarkup(<CoffeeContent locale={lang}/>);
  assert.equal((html.match(/<h1/g)||[]).length,1);assert.equal((html.match(/class="product-series-card"/g)||[]).length,8);
  assert.ok(html.includes(coffeeMeta(lang).description));assert.ok(html.includes(`${coffeePath}/#series-model-CK-129`));
  assert.ok(!html.includes('undefined'));assert.ok(html.includes('5700 W'));assert.ok(html.includes('5500 W'));
  assert.equal(coffeeAlternates().length,8);assert.ok(localizedProductPath(coffeePath,lang).endsWith(coffeePath+'/'));
 }
});
test('portable and party categories keep their own models without dropping the shared request',()=>{
 const portable=renderToStaticMarkup(<ProductSeries family="speaker" segment="portable"/>),party=renderToStaticMarkup(<ProductSeries family="speaker" segment="party"/>);
 assert.ok(portable.includes('TG117')&&portable.includes('SP18'));assert.ok(!portable.includes('DR-602'));assert.ok(party.includes('DR-602')&&!party.includes('TG117'));
 const cleaned=cleanSeriesSelection({'speaker-sp18':2,'speaker-dr602':3},'speaker');
 const brief=new URL(seriesQuote('zh','speaker',cleaned),'https://www.ddnzglobal.com').searchParams.get('overviewBrief');
 assert.ok(brief?.includes('SP18 × 2')&&brief.includes('DR-602 × 3'));assert.ok(brief.includes('5.4'));
});
