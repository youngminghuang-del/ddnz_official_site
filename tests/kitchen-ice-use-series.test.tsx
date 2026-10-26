import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import IceUseSeries from '../src/features/commercial-kitchen/components/IceUseSeries';
import {iceUseModels} from '../src/features/commercial-kitchen/data/iceUseModels.mjs';
import copy from '../src/features/commercial-kitchen/locales/ice-use-series.json';

test('three source configurations retain independent output, bin, power and dimension records',()=>{
 const by=Object.fromEntries(iceUseModels.map(p=>[p.model,p]));
 assert.deepEqual(['SD-120Y','SD-120K','SD-350F'].map(m=>[by[m].output,by[m].storage,by[m].power]),[[55,20,420],[54,25,480],[150,130,780]]);
 assert.equal(by['SD-120Y'].size,'530 × 620 × 780/800 mm');
 assert.equal(by['SD-120K'].size,'530 × 730 × 900 mm');
 assert.equal(by['SD-350F'].size,'560 × 830 × 1560 mm');
 assert.ok(iceUseModels.every(p=>p.voltage===220));
});

test('eight languages expose all three models and carry model-specific quote context without invented prices',()=>{
 for(const locale of Object.keys(copy) as (keyof typeof copy)[]){
  const html=renderToStaticMarkup(<IceUseSeries locale={locale}/>);
  assert.ok(html.includes(copy[locale].heading));assert.ok(html.includes('15°C'));assert.ok(html.includes('10°C'));
  assert.equal((html.match(/id="model-sd-/g)||[]).length,3);
  assert.ok(!html.includes('CNY'));assert.ok(!html.includes('50 Hz'));
  for(const p of iceUseModels){
   assert.ok(html.includes('id="model-'+p.id+'"'));assert.ok(html.includes(p.image));
   const anchors=[...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&'));
   const href=anchors.find(a=>a.includes('subcategory=')&&new URL(a,'https://www.ddnzglobal.com').searchParams.get('subcategory')?.startsWith(p.model));
   assert.ok(href,p.model+' quote');const url=new URL(href,'https://www.ddnzglobal.com');
   assert.equal(url.searchParams.get('industry'),'Commercial Kitchen Equipment');assert.equal(url.searchParams.get('leadGoal'),'Product Sourcing');assert.equal(url.searchParams.get('source'),'ice_shape_catalogue');
   assert.ok(url.searchParams.get('subcategory')?.includes(p.power+' W'));assert.ok(url.searchParams.get('subcategory')?.includes(p.size));
  }
  assert.ok(html.includes(copy[locale].heightNote));assert.ok(html.includes(copy[locale].splitScope));
 }
});
