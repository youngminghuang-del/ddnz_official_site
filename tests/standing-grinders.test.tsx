import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import StandingGrinderCatalogue,{StandingGrinderRequest} from '../src/features/food-processing/StandingGrinderCatalogue';
import {standingGrinders,grinderQuantity,cleanGrinderSelection,grinderBrief,combinedFoodInquiry,standingGrinderTotals,grinderCopy,grinderEligible,type GrinderLocale} from '../src/features/food-processing/standingGrinders';
import {machines,selectionTotals,inquiryUrl} from '../src/features/food-processing/catalog.mjs';
import {foodPage} from '../src/features/food-processing/pages.mjs';
import FoodProcessingContent from '../src/features/food-processing/FoodProcessingContent.jsx';
import LocalizedFoodContent from '../src/features/food-processing/LocalizedFoodContent';
test('standing models retain handbook power, weight, output and distinct dimensions without invented prices',()=>{
 assert.deepEqual(standingGrinders.map(p=>[p.model,p.power,p.supply,p.weight,p.dimensions,p.output]),[['JR-GG32A','2.2 kW','220 / 380 V · 50 Hz','89 kg','480 × 800 × 780 mm','450 kg/h'],['JR-GG42A','4 kW','380 V · 50 Hz','115 kg','600 × 930 × 880 mm','800 kg/h']]);
 assert.ok(fs.existsSync('public/food-processing-media/standing-grinder-series.webp'));
 assert.equal(machines.length,16);assert.equal(selectionTotals({'jr-gg32a':2}).equipment,0);assert.equal(selectionTotals({'jr-gg32a':2}).units,0);
});
test('new model quantities accept local digits but reject decimals, overflow, zero and unknown identities',()=>{
 for(const value of ['0','100','1.5','-1','','Infinity'])assert.equal(grinderQuantity(value),null);
 assert.equal(grinderQuantity('٩٩'),99);assert.deepEqual(cleanGrinderSelection({'jr-gg32a':'٢','jr-gg42a':3,unknown:4}),{'jr-gg32a':2,'jr-gg42a':3});
});
for(const locale of Object.keys(grinderCopy) as GrinderLocale[])test(`${locale}: quote-only and mixed equipment requests preserve quantities and keep unquoted costs separate`,()=>{
 const c=grinderCopy[locale];const newOnly=new URL(combinedFoodInquiry({},{'jr-gg32a':2,'jr-gg42a':3},'Lima','Plate size to confirm',locale),'https://www.ddnzglobal.com');
 const notes=newOnly.searchParams.get('overviewBrief')!;
 for(const p of standingGrinders){assert.ok(notes.includes(p.model));assert.ok(notes.includes(p.supply));assert.ok(notes.includes(p.dimensions));assert.ok(notes.includes(p.weight));}
 assert.ok(notes.includes('JR-GG32A · '+c.name+' × 2'));assert.ok(notes.includes('JR-GG42A · '+c.name+' × 3'));assert.ok(notes.includes(c.pending));assert.ok(notes.includes('CNY 8,700 × 3 = CNY 26,100'));assert.equal(standingGrinderTotals({'jr-gg32a':2,'jr-gg42a':3}).equipment,26100);assert.equal(standingGrinderTotals({'jr-gg32a':2,'jr-gg42a':3}).pendingUnits,2);assert.ok(notes.includes(c.costScope));assert.ok(notes.includes(c.performance));assert.ok(notes.includes('Plate size to confirm'));assert.ok(!notes.includes('CNY 0'));
 const mixed=new URL(combinedFoodInquiry({'jr-gg22':2},{'jr-gg32a':3},'Lima','Test',locale),'https://www.ddnzglobal.com');
 assert.ok(mixed.searchParams.get('overviewBrief')!.includes('3,360'));assert.ok(mixed.searchParams.get('productScope')!.includes('JR-GG22'));assert.ok(mixed.searchParams.get('productScope')!.includes('JR-GG32A'));
 assert.equal(selectionTotals({'jr-gg22':2}).equipment,3360);
 if(locale==='en')assert.equal(combinedFoodInquiry({'jr-gg22':2},{},'Lima','Test','en'),inquiryUrl({'jr-gg22':2},'Lima','Test'));
 const html=renderToStaticMarkup(<StandingGrinderCatalogue locale={locale} selection={{}} onChange={()=>{}} path="/sourcing/food-processing-machinery-from-china"/>);
 assert.ok(html.includes(c.heading));assert.ok(html.includes(c.caption));assert.ok(html.includes(c.confirm));assert.doesNotMatch(html,/"Offer"|priceCurrency|CNY 0|V-KEEPER|CE certified/);assert.ok(html.includes('CNY 8,700'));assert.ok(html.includes(c.sizeCheck));
 for(const p of standingGrinders)assert.ok(html.includes(`id="machine-${p.id}"`));
 const selected=renderToStaticMarkup(<StandingGrinderRequest locale={locale} selection={{'jr-gg32a':2}} onChange={()=>{}}/>);assert.ok(selected.includes('value="2"'));assert.ok(selected.includes(c.pending));
 assert.ok(grinderBrief({'jr-gg32a':1},locale).includes(c.stainless));assert.ok(grinderBrief({'jr-gg32a':1},locale).includes(c.voltageNote));assert.ok(!grinderBrief({'jr-gg42a':1},locale).includes('220 / 380'));
});
test('new catalogue appears on the hub and meat category but never expands a predefined priced package',()=>{
 for(const path of ['/sourcing/food-processing-machinery-from-china','/sourcing/food-processing-machinery-from-china/meat-processing-machinery','/sourcing/food-processing-machinery-from-china/packages/meat-prep','/sourcing/food-processing-machinery-from-china/vegetable-processing-machinery']){
 const page=foodPage(path)!;const expected=page.kind==='hub'||page.category?.slug==='meat-processing-machinery';assert.equal(grinderEligible(page),expected);
 const en=renderToStaticMarkup(<FoodProcessingContent page={page}/>),zh=renderToStaticMarkup(<LocalizedFoodContent page={{...page,categoryIndex:1,bundleIndex:2}} locale="zh"/>);
 assert.equal(en.includes('id="standing-grinders"'),expected);assert.equal(zh.includes('id="standing-grinders"'),expected);
 }
});
