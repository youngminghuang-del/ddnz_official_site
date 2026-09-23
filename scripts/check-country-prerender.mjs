import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(process.argv[2] || 'dist');
const routes=[...fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname).filter(p=>/\/shipping-from-china-to-[^/]+\/$/.test(p));
let rendered=0;
for(const route of routes){
 const html=fs.readFileSync(path.join(root,route,'index.html'),'utf8');
 assert(!/<div id="root">\s*<\/div>/.test(html),`${route}: empty static root`);
 if(!html.includes('data-country-prerender="true"'))continue;
 rendered++;
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`${route}: one H1 required`);
 assert(html.includes('data-country-cargo-planning'),`${route}: cargo planning missing`);
 assert(html.includes('source=country_cargo_planning') && html.includes('leadGoal=Freight+Export') && html.includes('dest='),`${route}: scoped freight CTA missing`);
 assert(!/opacity:0(?=[;" ])/.test(html),`${route}: hidden animation initial state`);
 assert(html.includes('/sourcing/food-processing-machinery-from-china/'),`${route}: equipment link missing`);
 assert(html.includes('/sourcing-services/consolidation-export/'),`${route}: service link missing`);
 for(const match of html.matchAll(/href="([^"?#]+)[^\"]*"/g)){
  const href=match[1];
  if(!href.startsWith('/')||href.startsWith('//')||path.extname(href))continue;
  assert(fs.existsSync(path.join(root,href,'index.html')),`${route}: broken local page link ${href}`);
 }
}
assert(rendered>0,'No legacy country pages were pre-rendered');
console.log(`Verified ${rendered} pre-rendered country versions and ${routes.length} region/country routes: H1, cargo scope, quote parameters, links and visible static body.`);
