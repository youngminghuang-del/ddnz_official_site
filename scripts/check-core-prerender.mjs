import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { buyerQuestions } from '../src/features/search-intent/buyer-questions.mjs';
const root=path.resolve(process.argv[2] || 'dist');
const routes=[...fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
let count=0;
for(const route of routes){
 const html=fs.readFileSync(path.join(root,route,'index.html'),'utf8');
 if(!html.includes('data-core-prerender="true"'))continue;
 count++;
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`${route}: one H1`);
 assert(!/opacity:0(?=[;" ])/.test(html),`${route}: hidden initial body`);
 assert(!html.includes('ddnz-review-switch'),`${route}: internal review controls visible`);
 for(const q of buyerQuestions[route.replace(/^\/+|\/+$/g,'')]||[]){
  assert(html.includes(q.q.replaceAll('&','&amp;')),`${route}: missing buyer question ${q.q}`);
 }
 for(const match of html.matchAll(/href="([^"?#]+)[^"]*"/g)){
  const href=match[1];
  if(!href.startsWith('/')||href.startsWith('//')||path.extname(href))continue;
  assert(fs.existsSync(path.join(root,href,'index.html')),`${route}: broken internal link ${href}`);
 }
 if(route.endsWith('/insights/'))assert(html.includes('/blog/'),`${route}: article discovery missing`);
}
assert.equal(count,48,'Expected 48 core page versions including eight enquiry pages');
for (const locale of ['', 'zh-cn/', 'ru/', 'fr/', 'es/', 'ar/', 'pt/', 'tr/']) {
 const route = `${locale}get-a-quote`;
 const html = fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');
 assert(html.includes('data-core-prerender="true"'), `${route}: enquiry content must be pre-rendered`);
 assert(html.includes('<main>') && html.includes('id="get-a-quote"'), `${route}: missing enquiry body`);
}
console.log(`Verified ${count} core pages: visible HTML, unique H1, buyer answers, article discovery and internal links.`);
