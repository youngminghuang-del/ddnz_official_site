import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import RefrigerationModelCatalogue from '../src/features/refrigeration/RefrigerationModelCatalogue';
import {refrigerationModels} from '../src/features/refrigeration/catalogueModels.mjs';
import products from '../src/features/commercial-kitchen/data/products.mjs';
import copies from '../src/features/refrigeration/catalogue-copy.json';

test('three handbook configurations deepen existing identities without changing capacity or quotations',()=>{
 assert.deepEqual(refrigerationModels.map(p=>p.id),['cold-3','cold-8','cold-15']);
 assert.deepEqual(refrigerationModels.map(p=>[p.model,p.power,p.netKg,p.grossKg]),[['GN1410TNPro',265,145,160],['GNT3MTNPro',185,96.5,109],['LC-1253M2W',450,177,199]]);
 for(const p of refrigerationModels){const prior=products.find(item=>item.id===p.id);assert.equal(p.model,prior.model);assert.equal(p.capacity,prior.specs.Capacity);assert.equal(p.temperature,prior.specs.Temperature);assert.equal(p.quote,null);assert.equal(p.refrigerant,'R290');assert.ok(fs.existsSync('public'+p.image));}
});
test('eight language catalogues render distinct anchors and preserve complete model enquiry context',()=>{
 for(const locale of Object.keys(copies) as (keyof typeof copies)[]){
  const c=copies[locale],html=renderToStaticMarkup(<RefrigerationModelCatalogue locale={locale}/>);
  assert.ok(html.includes(c.heading));assert.ok(html.includes(`dir="${locale==='ar'?'rtl':'ltr'}"`));assert.equal((html.match(/class="cold-model-card"/g)||[]).length,3);assert.doesNotMatch(html,/<h1\b|CNY|220 V|50 Hz|"Offer"/);
  const hrefs=[...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&'));
  for(const p of refrigerationModels){assert.ok(html.includes('id="model-'+p.id+'"'));assert.ok(html.includes(p.image));assert.ok(html.includes(c[p.kind+'Caption']));const href=hrefs.find(h=>new URL(h,'https://www.ddnzglobal.com').searchParams.get('subcategory')?.startsWith(p.model));assert.ok(href);const url=new URL(href,'https://www.ddnzglobal.com');assert.equal(url.searchParams.get('industry'),'Commercial Kitchen Equipment');const brief=url.searchParams.get('subcategory')!;for(const v of [p.model,p.capacity,p.power+' W',p.netKg+' kg',p.grossKg+' kg',p.packing,'R290'])assert.ok(brief.includes(v),v);}
 }
});
