import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const out='docs/freight-20261014/round2';
const copy=JSON.parse(fs.readFileSync('src/features/freight/gulfStories.json'));
const manifest=JSON.parse(fs.readFileSync(`${out}/media-manifest.json`));
const results=[];
for(const country of ['qatar','oman'])for(const locale of ['en','ar']){
 const route=(locale==='ar'?'/ar':'')+`/shipping-from-china-to-${country}/`;
 const html=fs.readFileSync(`dist${route}index.html`,'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.ok(html.includes(copy[country][locale].heading));
 assert.ok(html.includes(copy[country][locale].title));
 assert.ok(html.includes(`href="https://www.ddnzglobal.com${route}"`));
 assert.equal((html.match(/rel="alternate"/g)||[]).length,9);
 assert.ok(html.includes(`data-destination="${country==='qatar'?'Qatar':'Oman'}"`));
 assert.ok(html.includes(`src="/media/freight-20261014/${country==='qatar'?'qatar-receiving':'oman-loading'}.mp4"`));
 assert.ok(html.includes(`src="/media/freight-20261014/${country}-explainer.${locale}.svg"`));
 assert.equal((html.match(/kind="captions"/g)||[]).length,2);
 assert.ok(!/Tailored Solutions Header|Media caption|تعليق الوسائط|SABER &amp; Customs Compliant/.test(html));
 for(const word of country==='qatar'?[locale==='en'?'Al Nadeeb':'النديب','customs.gov.qa','mwani.com.qa']:[locale==='en'?'Bayan':'بيان','soharportandfreezone.om','customs.gov.om'])assert.ok(html.includes(word),word);
 assert.ok(html.includes('id="quote-form"')||html.includes('id="get-a-quote"'));
 assert.ok(/GulfFreightPage-[^" ]+\.css/.test(html),'static story CSS missing');
 results.push({route,singleH1:true,canonical:true,alternates:9,sourceLinks:true,countryIntent:true,media:true});
}
for(const asset of manifest.assets){const data=fs.readFileSync('public'+asset.suggested_web_path);assert.equal(crypto.createHash('sha256').update(data).digest('hex'),asset.sha256);if(asset.type==='image/svg+xml')assert.ok(data.toString().includes('width="720" height="960"'));}
const baseline=fs.readFileSync('docs/freight-20261014/evidence/production-cms/src/data/notionBlogData.json');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync('src/data/notionBlogData.json')).digest('hex'),crypto.createHash('sha256').update(baseline).digest('hex'),'CMS changed');
const urls=[...fs.readFileSync('dist/sitemap.xml','utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert.equal(urls.length,733);
for(const locale of ['en','zh','ru','fr','es','ar','pt','tr']){
 const footer=JSON.parse(fs.readFileSync(`src/components/site-footer/locales/${locale}.json`));assert.ok(!footer.hbLabel.includes('1997'));
}
fs.writeFileSync(`${out}/static-results.json`,JSON.stringify({results,assets:manifest.assets.length,sitemap:urls.length,cmsUnchanged:true},null,2));console.log('4 stories: country intent, H1, metadata, alternates, media, sources and static CSS; 12 manifest hashes; 733 routes; CMS preserved.');
