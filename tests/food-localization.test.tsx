import React from 'react';
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { foodProcessingRoutes } from '../src/features/food-processing/pages.mjs';
import { foodLocales, localizedFoodPage, localizedFoodSchema, localizedFoodInquiry, foodAlternates, foodPrefix, type FoodLocale } from '../src/features/food-processing/localization';
import LocalizedFoodContent from '../src/features/food-processing/LocalizedFoodContent';
import { navigationPath, supportedNavigationLanguages } from '../src/lib/productLanguageRouting';
const shape=(x:unknown,p=''):string[]=>x&&typeof x==='object'?Object.entries(x).flatMap(([k,v])=>shape(v,`${p}.${k}`)):[p];
test('all 77 food translations render native text, matching data, and reciprocal language URLs',()=>{
 for(const locale of Object.keys(foodLocales) as FoodLocale[]){
  const c=foodLocales[locale];assert.deepEqual(shape(c),shape(foodLocales.zh));assert.equal(c.names.length,16);assert.equal(c.notes.length,16);assert.ok(!JSON.stringify(c).includes('""'));
  for(const route of foodProcessingRoutes){
   const page=localizedFoodPage(route,locale)!;
   const html=renderToStaticMarkup(<LocalizedFoodContent page={page} locale={locale}/>);
   assert.equal((html.match(/<h1\b/g)||[]).length,1);
   assert.ok(html.includes(c.ui.compare));assert.ok(html.includes(`dir="${locale==='ar'?'rtl':'ltr'}"`));
   assert.ok(!html.includes('Specifications &amp; buying notes'));
   for(const m of page.machines){assert.ok(html.includes(`id="machine-${m.id}"`));assert.ok(html.includes(`CNY ${m.price.toLocaleString('en-US')}`));}
   assert.equal(navigationPath(route,locale),`${foodPrefix(locale)}${route}/`);
   assert.equal(supportedNavigationLanguages(route).length,8);assert.equal(foodAlternates(route).length,8);
   assert.equal(localizedFoodSchema(page,locale)['@graph'][0].inLanguage,locale==='zh'?'zh-CN':locale);
  }
 }
});
test('localized inquiry preserves selected quantities, configuration, packing and destination',()=>{
 for(const locale of Object.keys(foodLocales) as FoodLocale[]){
  const url=new URL(localizedFoodInquiry({'hw-j15-copper':2,'b20-guard':1},'Almaty','220 V; 50 Hz',locale),'https://www.ddnzglobal.com');
  assert.equal(url.pathname,`${foodPrefix(locale)}/get-a-quote/`);assert.equal(url.searchParams.get('dest'),'Almaty');
  const notes=url.searchParams.get('notes')!;assert.ok(notes.includes(foodLocales[locale].variants[0]));assert.match(notes,/× 2/);assert.match(notes,/CNY 5,090/);assert.match(notes,/CNY 80/);assert.match(notes,/220 V; 50 Hz/);
 }
});
