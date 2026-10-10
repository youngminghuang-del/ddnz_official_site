import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import CookingModelSelection,{cookingQuote} from '../src/features/commercial-kitchen/components/CookingModelSelection.jsx';
import {additionalCookingModels} from '../src/features/commercial-kitchen/data/additionalCookingModels.mjs';
import {kitchenCategories,kitchenCategorySchema} from '../src/features/commercial-kitchen/data/categories.mjs';
import LocalizedCategoryContent from '../src/features/commercial-kitchen/LocalizedCategoryContent';

test('supplier specifications preserve capacity, controls and separate dimensions',()=>{
 const f=additionalCookingModels['electric-fryers'],g=additionalCookingModels['electric-griddles'];
 assert.equal(f.length,9);assert.equal(g.length,7);
 assert.equal(f.find(p=>p.model==='DF-12L').metric,'8 L');
 assert.equal(g[0].controls,'1');assert.equal(g[2].controls,'2');
 assert.equal(g[6].metric,'1210 × 490 mm');assert.equal(g[6].dimensions,'1220 × 620 × 380 mm');
 for(const p of [...f,...g])assert.equal(p.quote,undefined);
});
test('all languages render new model anchors and localized request controls',()=>{
 for(const locale of ['en','zh','es','fr','pt','ru','tr','ar'])for(const category of kitchenCategories.slice(1)){
 const html=renderToStaticMarkup(locale==='en'?<CookingModelSelection category={category}/>:<LocalizedCategoryContent category={category} locale={locale as any}/>);
 for(const p of additionalCookingModels[category.id])assert.ok(html.includes(`id="model-${p.id}"`));
 assert.ok(!html.includes('undefined'));
 assert.ok(html.includes('dir="rtl"')===(locale==='ar'));
 }
 for(const category of kitchenCategories.slice(1))assert.equal(kitchenCategorySchema(category)['@graph'][0].mainEntity.itemListElement.length,category.id==='electric-fryers'?11:9);
});
test('quote handoff preserves model, quantity, destination and electrical requirements',()=>{
 const models=additionalCookingModels['electric-griddles'];
 const url=new URL(cookingQuote('ar','Griddles',models,{[models[6].id]:3},'Dubai','Packing', {standard:'2',electrical:'208 V / 60 Hz / 3 phase',documents:'Buyer list'}),'https://www.ddnzglobal.com');
 assert.equal(url.pathname,'/ar/get-a-quote/');
 const brief=url.searchParams.get('overviewBrief');
 for(const v of ['CN-8159-DPL-1220-16 × 3','1210 × 490 mm','1220 × 620 × 380 mm','16 mm','12 kW','Dubai','208 V / 60 Hz / 3 phase','Buyer list'])assert.ok(brief.includes(v));
});
