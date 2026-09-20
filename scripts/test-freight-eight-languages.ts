import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { freightLanguages, freightLanguagePrefix } from '../src/features/freight/freightLanguages';
import { lclInternationalCopy } from '../src/features/freight/lclInternationalCopy';
import { seaInternationalCopy } from '../src/features/freight/seaInternationalCopy';
import { dgInternationalCopy } from '../src/features/freight/dgInternationalCopy';
import { navigationPath } from '../src/lib/productLanguageRouting';
const routes=['lcl-shipping-from-china','sea-freight','dangerous-goods-shipping-from-china'];
const sitemap=fs.readFileSync('dist/sitemap.xml','utf8');
let checked=0;
for(const locale of freightLanguages) for(const route of routes) {
 const pathname=`${freightLanguagePrefix(locale)}/services/${route}/`;
 const html=fs.readFileSync(path.join('dist',pathname,'index.html'),'utf8');
 const label=`${locale}/${route}`;
 assert(html.includes(`<html lang="${locale==='zh'?'zh-CN':locale}"`),`${label}: html language`);
 assert(!html.includes('<div id="root"></div>'),`${label}: empty static body`);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${label}: H1 count`);
 assert(html.includes(`rel="canonical" href="https://www.ddnzglobal.com${pathname}"`),`${label}: canonical`);
 assert(sitemap.includes(`https://www.ddnzglobal.com${pathname}`),`${label}: sitemap`);
 for(const lang of freightLanguages) assert(new RegExp(`hreflang="${lang==='zh'?'zh-CN':lang}"`,'i').test(html),`${label}: alternate ${lang}`);
 if(locale==='ar') assert(/<html[^>]+dir="rtl"/.test(html),`${label}: RTL`);
 assert(!html.includes('lcl-material-preview'),`${label}: internal material slots`);
 assert.equal(navigationPath(`/services/${route}`,locale),pathname,`${label}: navigation changes locale`);
 const main=html.match(/<main[\s\S]*?<\/main>/)?.[0]||'';
 if(locale in lclInternationalCopy) {
  const key=locale as keyof typeof lclInternationalCopy;
  const copy=route==='lcl-shipping-from-china'?lclInternationalCopy[key]:route==='sea-freight'?seaInternationalCopy[key]:dgInternationalCopy[key];
  assert(main.includes(copy.title),`${label}: localized heading`);
  assert(!/[\u4e00-\u9fff]/.test(main),`${label}: Chinese leaked into localized content`);
  assert(!main.includes('One container.')&&!main.includes('Before booking'),`${label}: English fallback`);
 }
 const imgs=[...main.matchAll(/<img[^>]*src="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(imgs.length,new Set(imgs).size,`${label}: duplicate image`);
 assert.equal(imgs.length,route==='lcl-shipping-from-china'?6:route==='sea-freight'?2:7,`${label}: media parity`);
 const videos=[...main.matchAll(/<video\b/g)].length;
 assert.equal(videos,route==='lcl-shipping-from-china'?0:route==='sea-freight'?4:3,`${label}: video parity`);
 for(const m of main.matchAll(/(?:src|poster)="(\/[^"#?]+)"/g)) assert(fs.existsSync(path.join('dist',m[1])),`${label}: missing media ${m[1]}`);
 for(const m of main.matchAll(/href="#([^"]+)"/g)) assert(main.includes(`id="${m[1]}"`),`${label}: dead anchor ${m[1]}`);
 for(const m of main.matchAll(/href="(\/[^"?#]*)/g)) {
   const target=path.join('dist',m[1]);
   assert(fs.existsSync(target)||fs.existsSync(path.join(target,'index.html')),`${label}: missing linked page ${m[1]}`);
 }
 checked++;
}
console.log(`Freight eight-language checks passed: ${checked} pages, localized content, canonical/hreflang, navigation, static bodies, media parity and anchors.`);
