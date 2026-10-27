import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import InductionCatalogue from '../src/features/commercial-kitchen/components/InductionCatalogue';
import {inductionModels} from '../src/features/commercial-kitchen/data/inductionModels.mjs';
import copies from '../src/features/commercial-kitchen/locales/planning/induction-catalogue.json';
test('induction catalogue keeps source configurations, electrical ratings and dimensions distinct',()=>{
 assert.deepEqual(inductionModels.map(p=>[p.model,p.power,p.supply,p.dimensions]),[['YST-K8C','5 kW','220 V · 50 Hz','405 × 510 × 180 mm'],['Z-DCL02H','15 kW','380 V · 50 Hz','1000 × 900 × 800 (400) mm'],['YJ-0020','15 kW','380 V · 50 Hz','650 × 750 × 500 + 700 × 70 mm']]);
 for(const p of inductionModels){assert.ok(fs.existsSync('public'+p.image));assert.equal(p.price,undefined);assert.equal(p.moq,undefined);}
});
test('eight locales hand off the complete selected model without implying price or installation instructions',()=>{
 for(const locale of Object.keys(copies) as (keyof typeof copies)[]){
  const c=copies[locale],html=renderToStaticMarkup(<InductionCatalogue locale={locale}/>);
  assert.ok(html.includes(c.heading));assert.ok(html.includes(c.seriesCaption));assert.ok(html.includes(`dir="${locale==='ar'?'rtl':'ltr'}"`));assert.equal((html.match(/class="induction-card"/g)||[]).length,3);assert.doesNotMatch(html,/<h1\b|"Offer"|CNY|63A|40A|CE certified/);
  const links=[...html.matchAll(/href="([^"]+)"/g)].map(m=>new URL(m[1].replaceAll('&amp;','&'),'https://www.ddnzglobal.com'));
  for(const p of inductionModels){assert.ok(html.includes(`id="model-${p.id}"`));const q=links.find(u=>u.searchParams.get('subcategory')?.startsWith(p.model));assert.ok(q);assert.equal(q.searchParams.get('industry'),'Commercial Kitchen Equipment');for(const k of ['power','supply','footprint','dimensions','packing','net','gross','zone','pan'])if(p[k])assert.ok(q.searchParams.get('subcategory')!.includes(p[k]),`${p.model} ${k}`);}
 }
});

test("Chinese hub accepts its existing zh-cn route locale",()=>{assert.ok(renderToStaticMarkup(<InductionCatalogue locale="zh-cn"/>).includes(copies.zh.heading));});

test('multi-zone models preserve per-zone load, total load and model-specific footprint', async()=>{
 const {multiZoneModels}=await import('../src/features/commercial-kitchen/data/inductionModels.mjs');
 assert.deepEqual(multiZoneModels.map(p=>[p.model,p.power,p.total,p.footprint]),[['Z-BZL01H','4 × 3.5 kW','14 kW','800 × 800 mm'],['Z-BZL02H','6 × 3.5 kW','21 kW','1100 × 800 mm']]);
 for(const locale of Object.keys(copies) as (keyof typeof copies)[]){const html=renderToStaticMarkup(<><InductionCatalogue locale={locale}/><InductionCatalogue locale={locale} group="multi"/></>);assert.equal((html.match(/class="induction-card"/g)||[]).length,5);assert.equal((html.match(/id="multi-zone-cooking"/g)||[]).length,1);assert.ok(html.includes(copies[locale].multiHeading));assert.doesNotMatch(html,/63A|100A|"Offer"/);for(const p of multiZoneModels){assert.ok(fs.existsSync('public'+p.image));const urls=[...html.matchAll(/href="([^"]+)"/g)].map(m=>new URL(m[1].replaceAll('&amp;','&'),'https://www.ddnzglobal.com'));const q=urls.find(u=>u.searchParams.get('subcategory')?.startsWith(p.model));assert.ok(q);for(const k of ['power','total','zones','dimensions','supply'])assert.ok(q.searchParams.get('subcategory')!.includes(p[k]));}}
});

test('steam cabinets retain alternative power configurations without inventing tray counts or production rates', async()=>{
 const {steamModels}=await import('../src/features/commercial-kitchen/data/inductionModels.mjs');
 assert.deepEqual(steamModels.map(p=>[p.model,p.power,p.dimensions,p.doors]),[['YST-ZFG12X','15 / 20 kW','650 × 900 × 1850 mm','1'],['YST-ZFG24X','2 × (15 / 20 kW)','1150 × 800 × 1850 mm','2']]);
 for(const locale of Object.keys(copies) as (keyof typeof copies)[]){const html=renderToStaticMarkup(<><InductionCatalogue locale={locale}/><InductionCatalogue locale={locale} group="multi"/><InductionCatalogue locale={locale} group="steam"/></>);assert.equal((html.match(/class="induction-card"/g)||[]).length,7);assert.equal((html.match(/id="steam-cabinets"/g)||[]).length,1);const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);assert.ok(html.includes(copies[locale].steamHeading));assert.ok(html.includes(copies[locale].steamConfiguration));assert.doesNotMatch(html,/12 trays|24 trays|12盘|24盘|kg\/h|kg\/batch|"Offer"/);
 for(const p of steamModels){assert.ok(fs.existsSync('public'+p.image));assert.equal(p.capacity,undefined);assert.equal(p.trays,undefined);const urls=[...html.matchAll(/href="([^"]+)"/g)].map(m=>new URL(m[1].replaceAll('&amp;','&'),'https://www.ddnzglobal.com'));const q=urls.find(u=>u.searchParams.get('subcategory')?.startsWith(p.model));assert.ok(q);for(const k of ['power','supply','footprint','dimensions','doors'])assert.ok(q.searchParams.get('subcategory')!.includes(p[k]));}}
});

test('noodle cookers keep basket counts separate from electrical options and unconfirmed capacity',async()=>{
 const {noodleModels}=await import('../src/features/commercial-kitchen/data/inductionModels.mjs');
 assert.deepEqual(noodleModels.map(p=>[p.model,p.power,p.supply,p.dimensions,p.baskets]),[['YST-ZML50X','5 kW','220 V · 50 Hz','350 × 530 × (360 + 100) mm','2'],['YST-ZML50-2','5 / 8 kW','220 / 380 V · 50 Hz','520 × 630 × (340 + 100) mm','4']]);
 for(const locale of Object.keys(copies) as (keyof typeof copies)[]){const html=renderToStaticMarkup(<><InductionCatalogue locale={locale}/><InductionCatalogue locale={locale} group="multi"/><InductionCatalogue locale={locale} group="steam"/><InductionCatalogue locale={locale} group="noodle"/></>);assert.equal((html.match(/class="induction-card"/g)||[]).length,9);const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);assert.ok(html.includes(copies[locale].noodleHeading));assert.ok(html.includes(copies[locale].noodleConfiguration));assert.doesNotMatch(html,/15\.35|kg\/h|"Offer"/);for(const p of noodleModels){assert.ok(fs.existsSync('public'+p.image));assert.equal(p.zones,undefined);assert.equal(p.capacity,undefined);const urls=[...html.matchAll(/href="([^"]+)"/g)].map(m=>new URL(m[1].replaceAll('&amp;','&'),'https://www.ddnzglobal.com'));const q=urls.find(u=>u.searchParams.get('subcategory')?.startsWith(p.model));assert.ok(q);for(const k of ['power','supply','dimensions','baskets'])assert.ok(q.searchParams.get('subcategory')!.includes(p[k]));}}
});
