import React from 'react';import test from 'node:test';import assert from 'node:assert/strict';import {renderToStaticMarkup} from 'react-dom/server';
import AudioCategoryContent,{AudioCategoryLinks} from '../src/features/audio/AudioCategoryContent';
import {categoryCopy,audioCategoryPaths,audioCategoryMeta,audioCategorySchema,type CategoryLanguage} from '../src/features/audio/categories';
import {productAlternates,localizedProductPath} from '../src/lib/productLocalization.mjs';
import {navigationPath} from '../src/lib/productLanguageRouting';
test('40 category pages render unique titles, useful products, bundles and local links',()=>{
 const titles=new Set();
 for(const locale of Object.keys(categoryCopy) as CategoryLanguage[]){
  const c=categoryCopy[locale];assert.equal(c.names.length,5);
  const parent=renderToStaticMarkup(<AudioCategoryLinks locale={locale}/>);
  for(let index=0;index<5;index++){
   const path=audioCategoryPaths[index],meta=audioCategoryMeta(index,locale),html=renderToStaticMarkup(<AudioCategoryContent index={index} locale={locale}/>);
   assert.ok(!titles.has(meta.title));titles.add(meta.title);assert.equal((html.match(/<h1\b/g)||[]).length,1);
   assert.ok(html.includes('id="product-1"'));assert.ok(html.includes('id="product-2"'));assert.ok(html.includes('id="order-packages"'));
   assert.ok(c.packBodies[index].every(x=>x.length>20));assert.ok(html.includes(c.answers[index].replaceAll('&','&amp;')));
   assert.equal(navigationPath(path,locale),meta.path);assert.equal(localizedProductPath(path,locale),meta.path);assert.ok(parent.includes(meta.path));
   const alternates=productAlternates(path);assert.equal(alternates.length,8);assert.ok(alternates.some(a=>a.href==='https://www.ddnzglobal.com'+meta.path));
   assert.equal(audioCategorySchema(index,locale)['@graph'][0].url,'https://www.ddnzglobal.com'+meta.path);
   const links=[...html.matchAll(/href="([^"]+)"/g)].map(m=>new URL(m[1].replaceAll('&amp;','&'),'https://www.ddnzglobal.com'));
   for(const link of links.filter(x=>x.pathname.endsWith('/get-a-quote/'))){assert.equal(link.searchParams.get('source'),'audio_category');assert.ok(link.searchParams.get('productScope'));}
  }
 }
 assert.equal(titles.size,40);
});
