import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { machines, packages, packageSelection, selectionTotals, inquiryUrl } from '../src/features/food-processing/catalog.mjs';
import { foodProcessingRoutes, foodPage, foodPageMeta, foodPageSchema } from '../src/features/food-processing/pages.mjs';
import FoodProcessingContent from '../src/features/food-processing/FoodProcessingContent.jsx';
import { englishProductRedirect } from '../src/lib/productLanguageRouting';

test('display prices are 150% of the PDF wholesale column; packing stays unchanged',()=>{
  const expected = [['hw-j15-copper',1470,40],['yh-gt300',1180,0],['h20',2300,0],['b20-guard',2150,0],['q31b',2150,0],['dq-t',580,0],['jr-gg22',1120,0],['dj-h18',870,40],['cx-l',2560,0],['tp-350',1200,50],['dq-ps300-copper',1150,0],['sc-r22',380,0],['mj-d100',650,0],['mj-h12',780,0],['gz-tc',1370,0],['tm-hl',1380,45]];
  assert.deepEqual(machines.map(m=>[m.id,m.price,m.packing]),expected.map(([id,price,packing])=>[id,Number(price)*1.5,packing]));
  for(const m of machines) assert.ok(fs.existsSync(`public/food-processing-media/${m.image}.webp`));
});
test('package totals use one of each machine and keep packing separate',()=>{
  assert.deepEqual(packages.map(p=>selectionTotals(packageSelection(p))),[
    {equipment:3975,packing:40,units:2},{equipment:9900,packing:0,units:3},{equipment:2550,packing:0,units:2},{equipment:6825,packing:40,units:3},{equipment:4095,packing:50,units:3},{equipment:2145,packing:0,units:2}]);
  assert.deepEqual(selectionTotals({'hw-j15-copper':2,'yh-gt300':3}),{equipment:9720,packing:80,units:5});
  assert.deepEqual(selectionTotals({'h20':-1,'cx-l':1.5,'unknown':4,'dq-t':100}),{equipment:0,packing:0,units:0});
});
test('quotation preserves model configuration, quantities, packing and destination',()=>{
  const url=new URL(inquiryUrl({'hw-j15-copper':2,'b20-guard':1},'Almaty, Kazakhstan','220 V; 50 Hz'), 'https://www.ddnzglobal.com');
  assert.equal(url.searchParams.get('source'),'food_processing');
  assert.equal(url.searchParams.get('dest'),'Almaty, Kazakhstan');
  const notes=url.searchParams.get('notes')!;
  assert.match(notes,/Copper-core motor · 15 kg model/);assert.match(notes,/With bowl guard/);
  assert.match(notes,/CNY 7,635/);assert.match(notes,/Listed packing: CNY 80/);assert.match(notes,/220 V; 50 Hz/);
});
test('all 11 landing pages render unique metadata, crawlable products, internal links and breadcrumbs',()=>{
  const titles=new Set();
  for(const route of foodProcessingRoutes){
    const page=foodPage(route)!;const meta=foodPageMeta(page);assert.ok(!titles.has(meta.title));titles.add(meta.title);
    const html=renderToStaticMarkup(<FoodProcessingContent page={page}/>);
    assert.equal((html.match(/<h1\b/g)||[]).length,1);
    for(const m of page.machines){assert.ok(html.includes(m.model));assert.ok(html.includes(m.variant.replaceAll('&', '&amp;')));}
    assert.ok(html.includes('/sourcing-services/inspection-quality-control/'));assert.ok(html.includes('id="main-content"'));
    const schema=foodPageSchema(page);assert.ok(schema['@graph'].some(s=>s['@type']==='BreadcrumbList'));
    assert.ok(englishProductRedirect('/zh-cn'+route, 'en'));
    const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
  }
  assert.equal(titles.size,11);assert.equal(foodPage('/sourcing/food-processing-machinery-from-china/nonexistent'),null);
});
