import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
let count=0;
for(const locale of ['en','zh-cn','es','fr','pt','tr','ru','ar'])for(const country of ['nigeria','peru']){
 const route=`${locale==='en'?'':'/'+locale}/shipping-from-china-to-${country}/`;
 const html=fs.readFileSync(path.join('dist',route,'index.html'),'utf8');const main=html.match(/<main[\s\S]*?<\/main>/)?.[0]||'';
 assert(main.includes('market-story'),`${route}: localized template was overwritten`);
 assert.equal((main.match(/<h1[ >]/g)||[]).length,1,route);
 assert(html.includes(`rel="canonical" href="https://www.ddnzglobal.com${route}"`),route);
 for(const lang of ['en','zh-cn','es','fr','pt','tr','ru','ar'])assert(html.toLowerCase().includes(`hreflang="${lang}"`),`${route}: ${lang}`);
 for(const match of main.matchAll(/(?:src|poster)="(\/[^"?#]+)/g))assert(fs.existsSync(path.join('dist',match[1])),match[1]);
 for(const match of main.matchAll(/href="(\/[^"?#]+)/g))assert(fs.existsSync(path.join('dist',match[1])),match[1]);
 if(locale!=='en')assert(!main.includes('View full image')&&!main.includes('Questions buyers ask'),route);
 count++;
}
console.log(`Market country static checks passed: ${count} localized pages, canonical, alternates, media and links.`);
