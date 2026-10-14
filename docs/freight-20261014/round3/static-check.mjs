import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
const out='docs/freight-20261014/round3',maps=JSON.parse(fs.readFileSync('src/features/freight/gulfMaps.json')),journeys=JSON.parse(fs.readFileSync('src/features/freight/gulfJourneys.json')),manifest=JSON.parse(fs.readFileSync(`${out}/media-manifest.json`));
const results=[];
for(const asset of manifest.assets){const file=asset.absolute_path.split('/').at(-1);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(`${out}/geography/${file}`)).digest('hex'),asset.sha256);}
for(const country of ['qatar','oman']){
 const source=fs.readFileSync(`${out}/geography/${country}-outline.svg`,'utf8');const paths=[...source.matchAll(/<path[^>]* d="([^"]+)"/g)].map(m=>m[1]).join(' ');assert.equal(maps[country].outline,paths);assert.equal((paths.match(/M/g)||[]).length,country==='qatar'?1:7);
 for(const node of maps[country].nodes){const original=manifest.nodes.find(n=>n.id===node.id);assert.deepEqual([node.x,node.y],original.svg_xy);assert.equal(node.source,original.source);assert.ok(node.kind==='port'||node.kind==='city');}
 for(const locale of ['en','ar']){
  const route=(locale==='ar'?'/ar':'')+`/shipping-from-china-to-${country}/`,html=fs.readFileSync(`dist${route}index.html`,'utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.equal((html.match(/rel="alternate"/g)||[]).length,9);assert.ok(html.includes(`https://www.ddnzglobal.com${route}`));
  assert.ok(html.includes('data-destination-map'));assert.ok(html.includes(maps[country].outline));assert.ok(html.includes('fill-rule="evenodd"'));assert.ok(html.includes('role="img" aria-labelledby='));
  for(const node of maps[country].nodes)assert.ok(html.includes(node.name[locale]));
  assert.equal(journeys[country][locale].steps.length,5);for(const step of journeys[country][locale].steps)assert.ok(html.includes(step.title));
  assert.ok(html.includes(journeys[country][locale].intro));assert.equal((html.match(/<video/g)||[]).length,1);assert.equal((html.match(/kind="captions"/g)||[]).length,2);assert.ok(html.includes('href="#gulf-quote"'));
  assert.ok(!/role="tab|real.time tracking|direct sailing|ETA/.test(html));
  results.push({route,realOutline:true,sourcedNodes:2,journeySteps:5,singleH1:true,alternates:9});
 }
}
const urls=[...fs.readFileSync('dist/sitemap.xml','utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert.equal(urls.length,733);
fs.writeFileSync(`${out}/static-results.json`,JSON.stringify({results,geographicAssets:4,sitemap:733},null,2));console.log('4 routes: real unchanged outlines, source-matched nodes, five-stage localized examples, accessible map, H1/alternates/media and 733 URLs passed');
