import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import LocalizedCoolingContent from '../src/features/outdoor-sourcing/LocalizedCoolingContent.jsx';
import {coolingLocales,coolingCurrency} from '../src/features/outdoor-sourcing/cooling-copy.mjs';
import {productAlternates,localizedProductPath} from '../src/lib/productLocalization.mjs';
import {acMetadata,fridgeMetadata} from '../src/features/outdoor-sourcing/seo.mjs';
import {quoteLinkProps} from '../src/lib/quoteLinkPolicy.mjs';
import {acProducts} from '../src/features/outdoor-sourcing/ac-catalog.mjs';
const keys=Object.keys(coolingLocales.en).sort();
for(const [lang,t] of Object.entries(coolingLocales)){
 assert.deepEqual(Object.keys(t).sort(),keys,lang+' complete keys');
 for(const key of keys){assert.ok(t[key].length,lang+': '+key);if(Array.isArray(t[key]))assert.equal(t[key].length,coolingLocales.en[key].length,lang+': '+key);}
 for(const kind of ['ac','fridge']){
  const meta=(kind==='ac'?acMetadata:fridgeMetadata)(lang),alts=productAlternates(meta.path);
  assert.equal(alts.length,8);assert.equal(meta.path,localizedProductPath(meta.path,lang));
  assert.equal(meta.schema.inLanguage,lang==='zh'?'zh-CN':lang);
  const html=renderToStaticMarkup(React.createElement(LocalizedCoolingContent,{locale:lang,kind}));
  assert.ok(html.includes(t[kind+'Title']));assert.ok(html.includes(`dir="${lang==='ar'?'rtl':'ltr'}"`));
  assert.equal((html.match(/class="ac-card"/g)||[]).length,kind==='ac'?3:10);
  assert.ok(!html.includes('undefined'));assert.ok(!html.includes('NaN'));
  for(const [,src] of html.matchAll(/<img[^>]+src="([^"]+)"/g))assert.ok(fs.existsSync('public'+src),src);
  const prices=kind==='ac'?acProducts.flatMap(p=>p.prices):[889,859,2230,2330];
  for(const price of prices)assert.ok(html.includes(coolingCurrency(lang,price)),`${lang} ${kind} ${price}`);
  if(lang!=='en')for(const bad of ['Add to request','Minimum order','Cooling only','Your buying request','Confirm with quotation'])assert.ok(!html.includes(bad),lang+' leaked '+bad);
  const prefix=lang==='en'?'':`/${lang==='zh'?'zh-cn':lang}`;
  const props=quoteLinkProps(prefix+'/get-a-quote/?'+new URLSearchParams({overviewBrief:t[kind+'Title'],dest:'UAE'}));
  assert.equal(props.href,prefix+'/get-a-quote/');assert.equal(JSON.parse(props['data-quote-context']).overviewBrief,t[kind+'Title']);
 }
}
console.log('8 languages: complete copy, 16 renders, all CNY prices, 8-way URLs, RTL, media and localized quote handoff passed.');
if(process.argv.includes('--built')){
 const sitemap=fs.readFileSync('dist/sitemap.xml','utf8');
 for(const lang of Object.keys(coolingLocales))for(const meta of [acMetadata(lang),fridgeMetadata(lang)]){
  const html=fs.readFileSync('dist'+meta.path+'index.html','utf8');
  assert.ok(html.includes(`rel="canonical" href="https://www.ddnzglobal.com${meta.path}"`),meta.path+' canonical');
  assert.equal((html.match(/hreflang=/g)||[]).length,9,meta.path+' hreflang');
  assert.ok(html.includes('x-default'));assert.ok(sitemap.includes('https://www.ddnzglobal.com'+meta.path));
  const main=html.match(/<main\b[\s\S]*?<\/main>/)?.[0];assert.ok(main,meta.path+' static body');
  for(const [,href] of main.matchAll(/href="(\/[^"]*)"/g)){
   const url=new URL(href,'https://www.ddnzglobal.com');
   assert.ok(fs.existsSync('dist'+url.pathname+'index.html'),meta.path+' missing link '+href);
  }
 }
 console.log('Built: 16 static bodies, self canonicals, 9 alternates, sitemap inclusion and internal link targets passed.');
}
