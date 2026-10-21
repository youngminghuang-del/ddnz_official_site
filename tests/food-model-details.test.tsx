import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import facts from '../src/features/food-processing/modelDetails.json';
import labels from '../src/features/food-processing/locales/model-details.json';
import {FoodModelFacts,FoodModelPhoto} from '../src/features/food-processing/FoodModelDetails';
import {machines,selectionTotals,packageSelection,packages} from '../src/features/food-processing/catalog.mjs';

test('model-specific loads and speeds do not leak between similar configurations',()=>{
 assert.deepEqual(facts.h20.rows.find(([k])=>k==='bowl'),['bowl','20 L']);
 assert.deepEqual(facts['b20-guard'].rows.find(([k])=>k==='flour'),['flour','5 kg']);
 assert.deepEqual(facts['hw-j15-copper'].rows.find(([k])=>k==='flour'),['flour','15 kg']);
 assert.ok(!JSON.stringify(facts['jr-gg22']).includes('320 kg/h'));
 assert.ok(!facts['tm-hl'].rows.length,'No row from an unconfirmed poultry-plucker mapping');
 assert.deepEqual(selectionTotals(packageSelection(packages[1])),{equipment:9900,packing:0,units:3});
});
test('catalogue conflicts remain distinct from price-list values',()=>{
 assert.equal(machines.find(m=>m.id==='mj-h12')!.weight,28);
 assert.deepEqual(facts['mj-h12'].rows.find(([k])=>k==='catalogueWeight'),['catalogueWeight','31 kg']);
 assert.equal(machines.find(m=>m.id==='h20')!.dimensions,'750 × 400 × 850 mm');
 assert.deepEqual(facts.h20.rows.find(([k])=>k==='catalogueSize'),['catalogueSize','750 × 400 × 860 mm']);
 assert.equal(Object.keys(facts).length,machines.length);
});
test('all eight languages render their labels, conflict note and image controls',()=>{
 for(const locale of Object.keys(labels) as (keyof typeof labels)[]){
  const html=renderToStaticMarkup(<FoodModelFacts id="mj-h12" locale={locale}/>);
  assert.ok(html.includes(labels[locale].catalogueWeight));
  assert.ok(html.includes(labels[locale].conflict.replaceAll('&','&amp;')));
  assert.ok(html.includes('31 kg'));
  const photo=renderToStaticMarkup(<FoodModelPhoto src="/test.webp" alt="H20" locale={locale}/>);
  assert.ok(photo.includes(labels[locale].close));assert.ok(photo.includes('<dialog'));
 }
});
