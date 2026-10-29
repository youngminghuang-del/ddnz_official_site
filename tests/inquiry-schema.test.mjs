import test from 'node:test';
import assert from 'node:assert/strict';
import { inquiryPageSchema, replaceInquirySchema } from '../src/features/inquiry/schema.mjs';
import { intentCopy } from '../src/features/inquiry/copy.mjs';
const locales = ['en','zh','es','ar','fr','pt','ru','tr'];
const goals = ['Product Sourcing','Supplier Inspection & Consolidation','Freight Export'];
test('all eight generic pages describe the three visible choices without invented commercial terms', () => {
 for (const lang of locales) {
  const schema = inquiryPageSchema(lang), [page, ...services] = schema['@graph'];
  assert.equal(page['@type'], 'ContactPage'); assert.equal(services.length, 3);
  assert.deepEqual(services.map(s=>s.name), [2,4,6].map(i=>intentCopy[lang][i]));
  assert.deepEqual(services.map(s=>s.description), [3,5,7].map(i=>intentCopy[lang][i]));
  assert.deepEqual(page.about.map(s=>s['@id']), services.map(s=>s['@id']));
  assert.equal(page.url, `https://www.ddnzglobal.com${lang==='en'?'':'/'+(lang==='zh'?'zh-cn':lang)}/get-a-quote/`);
  assert.equal(page.inLanguage, lang==='zh'?'zh-CN':lang);
  const encoded = JSON.stringify(schema);
  for(const field of ['offers','price','priceCurrency','availability','aggregateRating','areaServed']) assert.ok(!encoded.includes(`"${field}"`));
  assert.equal(new Set(schema['@graph'].map(n=>n['@id'])).size,4);
 }
});
test('choosing one request describes only that service with the correct executing organization', () => {
 for (const lang of locales) for (const [i,goal] of goals.entries()) {
  const [page, service, ...extra] = inquiryPageSchema(lang,goal)['@graph'];
  assert.equal(extra.length,0); assert.equal(page.about.length,1);
  assert.equal(service.name,intentCopy[lang][2+i*2]);
  assert.equal(service.provider.name,i===2?'Heaven Born International Freight (Guangzhou) Co., Ltd.':'DDNZ Global Trade Co., Ltd.');
  assert.equal(service.availableChannel.serviceUrl,page.url); assert.ok(!page.url.includes('?'));
 }
 assert.deepEqual(inquiryPageSchema('en','Freight Only'),inquiryPageSchema('en','Freight Export'));
 assert.deepEqual(inquiryPageSchema('zh-cn'),inquiryPageSchema('zh'));
});
test('runtime replacement removes a previous route graph, updates the intent, and cleans up on exit', () => {
 let scripts=[{id:'old-products',remove(){ scripts=scripts.filter(s=>s!==this); }}];
 const doc={querySelectorAll:()=>[...scripts],createElement:()=>({remove(){ scripts=scripts.filter(s=>s!==this); }}),head:{appendChild:s=>scripts.push(s)}};
 const leaveGeneric=replaceInquirySchema(doc,inquiryPageSchema('en'));
 assert.equal(scripts.length,1); assert.equal(JSON.parse(scripts[0].textContent)['@graph'].length,4);
 leaveGeneric(); const leaveSelected=replaceInquirySchema(doc,inquiryPageSchema('en','Product Sourcing'));
 assert.equal(scripts.length,1); assert.equal(JSON.parse(scripts[0].textContent)['@graph'].length,2);
 leaveSelected(); assert.equal(scripts.length,0);
});
