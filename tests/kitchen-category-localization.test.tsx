import React from 'react';
import test from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import {categoryCopy,categoryAlternates,type CategoryLocale} from '../src/features/commercial-kitchen/categoryLocalization';
import {kitchenCategories,categoryProducts} from '../src/features/commercial-kitchen/data/categories.mjs';
import LocalizedCategoryContent from '../src/features/commercial-kitchen/LocalizedCategoryContent';
import {navigationPath,supportedNavigationLanguages} from '../src/lib/productLanguageRouting';
const shape=(x:unknown,p=''):string[]=>x&&typeof x==='object'?Object.entries(x).flatMap(([k,v])=>shape(v,`${p}.${k}`)):[p];
test('21 category translations have native content, exact reference prices and authored language destinations',()=>{
 for(const locale of Object.keys(categoryCopy) as CategoryLocale[]){const c=categoryCopy[locale];assert.deepEqual(shape(c),shape(categoryCopy.zh));
 for(const [i,category] of kitchenCategories.entries()){
 const html=renderToStaticMarkup(<LocalizedCategoryContent category={category} locale={locale}/>);
 assert.ok(html.includes(c.titles[i]));assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.ok(html.includes(`dir="${locale==='ar'?'rtl':'ltr'}"`));
 for(const p of categoryProducts(category)){assert.ok(html.includes(`id="model-${p.id}"`));if(p.quote)assert.ok(html.includes(p.quote.price.toFixed(2)));else assert.ok(html.includes(c.ui.request));}
 assert.equal(categoryAlternates(category.path).length,8);assert.equal(supportedNavigationLanguages(category.path).length,8);
 assert.equal(navigationPath(category.path,locale),`/${locale==='zh'?'zh-cn':locale}${category.path}`);
 }
 }
});
