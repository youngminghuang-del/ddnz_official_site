import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import EquipmentConfiguration,{configurationBrief,IceSpecificationComparison} from '../src/features/commercial-kitchen/components/EquipmentConfiguration.jsx';
import copy from '../src/features/commercial-kitchen/locales/planning/configuration.json';
import {categoryProducts,kitchenCategories} from '../src/features/commercial-kitchen/data/categories.mjs';

test('configuration requests retain exact electrical and document requirements in every locale',()=>{
 for(const locale of Object.keys(copy)){
  const brief=configurationBrief(locale,{standard:'2',electrical:'208 V / 60 Hz / 3 phase / hardwired',documents:'Buyer document list pending'});
  assert.ok(brief.includes('208 V / 60 Hz / 3 phase / hardwired'));
  assert.ok(brief.includes('Buyer document list pending'));
  assert.ok(brief.includes(copy[locale].options[2]));
  const html=renderToStaticMarkup(<EquipmentConfiguration locale={locale}/>);
  const prefix=locale==='en'?'':locale==='zh'?'/zh-cn':'/'+locale;
  assert.ok(html.includes(`${prefix}/get-a-quote/?`));
  assert.ok(html.includes('overviewBrief='));
  assert.ok(html.includes('dir="rtl"')=== (locale==='ar'));
 }
});
test('comparison uses catalogue output and dimensions without inventing missing storage figures',()=>{
 const html=renderToStaticMarkup(<IceSpecificationComparison/>);
 for(const product of categoryProducts(kitchenCategories[0])){
  assert.ok(html.includes(product.specs['Daily output']));
  assert.ok(html.includes(product.dimensions));
 }
 assert.equal((html.match(/Confirm for selected model/g)||[]).length,6);
});
