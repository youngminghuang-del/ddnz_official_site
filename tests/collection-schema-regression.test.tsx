import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderKitchenStaticContent} from '../scripts/kitchen-static-content.mjs';
import {renderToStaticMarkup} from 'react-dom/server';
import {kitchenStructuredData} from '../src/features/commercial-kitchen/data/discovery.mjs';
import launch from '../src/features/commercial-kitchen/data/launch.mjs';
import catalog from '../src/features/commercial-kitchen/data/products.mjs';
import {getLocalizedKitchenMetadata,kitchenLocales} from '../src/features/commercial-kitchen/data/localization.mjs';
import InductionCookingContent from '../src/features/commercial-kitchen/InductionCookingContent';
import ChineseCookingContent from '../src/features/commercial-kitchen/ChineseCookingContent';
import LocalizedKitchenContent from '../src/features/commercial-kitchen/LocalizedKitchenContent.jsx';
import {chineseCookingModelLinks,chineseCookingPages,chineseCookingSchema,inductionPageSchema} from '../src/features/commercial-kitchen/data/inductionPage.mjs';
import {foodPage,foodPageSchema} from '../src/features/food-processing/pages.mjs';
import {localizedFoodSchema,localizedFoodPage,foodLocales} from '../src/features/food-processing/localization';
import {standingGrinders} from '../src/features/food-processing/standingGrinders';
import {audioCategorySchema,categoryCopy,type CategoryLanguage} from '../src/features/audio/categories';
import AudioCategoryContent from '../src/features/audio/AudioCategoryContent';
const lists=(value:any):any[]=>Array.isArray(value)?value.flatMap(lists):value&&typeof value==='object'?[...(value['@type']==='ItemList'?[value]:[]),...Object.values(value).flatMap(lists)]:[];
const check=(schema:any,html:string)=>{assert.equal(lists(schema).length,1);const entries=lists(schema)[0].itemListElement;const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'unique DOM ids');assert.deepEqual(entries.map((e:any)=>e.position),entries.map((_:any,i:number)=>i+1));assert.equal(new Set(entries.map((e:any)=>e.url)).size,entries.length);for(const e of entries)assert.ok(html.includes(`id="${new URL(e.url).hash.slice(1)}"`),e.url);};
test('kitchen collection schemas list the model cards on each catalogue and category page',()=>{
 const englishCatalogue=renderKitchenStaticContent(catalog,launch);
 const englishSchema=kitchenStructuredData(launch);
 check(englishSchema,englishCatalogue);
 assert.equal(lists(englishSchema)[0].itemListElement.length,catalog.length);
 for(const product of catalog.filter(product=>product.handbookGroup))assert.ok(englishCatalogue.includes(`id="catalog-${product.id}"`));
 const englishInduction=renderToStaticMarkup(<InductionCookingContent/>);
 assert.doesNotMatch(englishInduction,/application\/ld\+json/);
 check(inductionPageSchema(),englishInduction);
 for(const page of chineseCookingPages)check(chineseCookingSchema(page),renderToStaticMarkup(<ChineseCookingContent page={page}/>));
 for(const locale of Object.keys(kitchenLocales)){
  const schema=getLocalizedKitchenMetadata(locale).structuredData;
  const html=renderToStaticMarkup(<LocalizedKitchenContent locale={locale}/>);
  check(schema,html);
  const modelIds=lists(schema)[0].itemListElement.map((entry:any)=>new URL(entry.url).hash.slice('#model-'.length));
  const expected=catalog.filter(product=>locale!=='zh'||!chineseCookingModelLinks.has(product.id)).map(product=>product.id);
  assert.deepEqual(new Set(modelIds),new Set(expected));
 }
});
test('food collection schema includes the additional four visible grinders once in every language',()=>{
 for(const path of ['/sourcing/food-processing-machinery-from-china','/sourcing/food-processing-machinery-from-china/meat-processing-machinery']){
  const page=foodPage(path)!;const schema=foodPageSchema(page);assert.equal(lists(schema)[0].itemListElement.length,page.machines.length+standingGrinders.length);
  for(const locale of Object.keys(foodLocales)){const localized=localizedFoodPage(path,locale as any);const entries=lists(localizedFoodSchema(localized,locale as any))[0].itemListElement;assert.equal(entries.length,page.machines.length+4);for(const p of standingGrinders)assert.equal(entries.filter((e:any)=>e.url.endsWith('#machine-'+p.id)).length,1);}
 }
});
test('speaker category references and named models form one list, with real visible anchors',()=>{
 for(const locale of Object.keys(categoryCopy) as CategoryLanguage[])for(const index of [2,3]){const html=renderToStaticMarkup(<AudioCategoryContent index={index} locale={locale}/>);assert.equal((html.match(/application\/ld\+json/g)||[]).length,0);check(audioCategorySchema(index,locale),html);}
});
