import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import InductionCatalogue from '../src/features/commercial-kitchen/components/InductionCatalogue';
import {largeWokModels} from '../src/features/commercial-kitchen/data/inductionModels.mjs';
import catalog from '../src/features/commercial-kitchen/data/products.mjs';
import copies from '../src/features/commercial-kitchen/locales/planning/induction-catalogue.json';
import {getLocalizedKitchenProducts,filterKitchenProducts,buildLocalizedKitchenInquiry} from '../src/features/commercial-kitchen/data/localization.mjs';
test('large wok rows retain the distinct source diameters, power and dimensions without merging duplicate supplier codes',()=>{
 assert.deepEqual(largeWokModels.map(p=>[p.model,p.diameter,p.power,p.dimensions]),[['Z-SCD04H','Ø 900 mm','25 kW','1100 × 1200 × 800 (400) mm'],['Z-SCD05H','Ø 1000 mm','30 kW','1200 × 1300 × 800 (400) mm'],['Z-SCD06H','Ø 1200 mm','35 kW','1400 × 1470 × 800 (400) mm']]);
 for(const p of largeWokModels){assert.equal(p.supply,'380 V · 50 Hz');assert.ok(fs.existsSync('public'+p.image));assert.equal(p.capacity,undefined);assert.equal(p.current,undefined);assert.equal(p.breaker,undefined);assert.equal(p.moq,undefined);assert.equal(p.price,undefined);}
 for(const code of ['Z-SCD01H','Z-SCD02H','Z-SCD03H'])assert.ok(!catalog.some(p=>p.model===code));
 assert.equal(catalog.length,40);assert.equal(catalog.filter(p=>p.quote).length,8);
});
test('eight locales disclose the series image scope and hand off all three configurations',()=>{
 for(const locale of Object.keys(copies) as (keyof typeof copies)[]){
  const c=copies[locale],html=renderToStaticMarkup(<InductionCatalogue group="large" locale={locale}/>);
  assert.ok(html.includes(c.largeHeading));assert.ok(html.includes(c.largeCaption));assert.ok(html.includes(c.largeConfiguration));assert.ok(html.includes(c.fields.diameter));
  assert.equal((html.match(/class="induction-card"/g)||[]).length,3);
  assert.doesNotMatch(html,/<h1\b|"Offer"|100A|23A|德国|German|IGBT|CE certified/);
  const urls=[...html.matchAll(/href="([^"]+)"/g)].map(m=>new URL(m[1].replaceAll('&amp;','&'),'https://www.ddnzglobal.com'));
  for(const p of largeWokModels){assert.ok(html.includes(`id="model-${p.id}"`));const quote=urls.find(u=>u.searchParams.get('subcategory')?.startsWith(p.model));assert.ok(quote);for(const key of ['power','diameter','dimensions','supply'])assert.ok(quote.searchParams.get('subcategory')!.includes(p[key]));}
  if(locale!=='en'){const products=getLocalizedKitchenProducts(locale);for(const p of largeWokModels){assert.equal(filterKitchenProducts(products,{search:p.model})[0].id,p.id);const payload=buildLocalizedKitchenInquiry(locale,{list:{[p.id]:2},form:{country:'Other'}});assert.ok(payload.message.includes(p.model));assert.ok(payload.message.includes(c.largeConfiguration));}}
 }
});
