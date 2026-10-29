import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const release=JSON.parse(fs.readFileSync('src/data/commercialMixerRelease.json','utf8'));
const schema=JSON.parse(fs.readFileSync('src/data/commercial-mixer-schema.json','utf8'));
test('owner-approved mixer release keeps images, FAQ and public schema in sync',()=>{
 const article=schema['@graph'].find(n=>n['@type']==='BlogPosting');
 const images=schema['@graph'].filter(n=>n['@type']==='ImageObject');
 const faq=schema['@graph'].find(n=>n['@type']==='FAQPage');
 assert.deepEqual(release.reviewer,['Huang Matthew']);
 assert.equal((release.content.match(/<img /g)||[]).length,4);
 assert.ok(!release.content.includes('<figcaption'));
 assert.ok(!/file:|urn:ddnz:draft/.test(JSON.stringify(schema)));
 assert.equal(images.length,5);
 assert.ok(images.every(n=>n.contentUrl.startsWith('https://www.ddnzglobal.com/images/posts/'+release.slug+'/')));
 assert.equal(article.reviewedBy,undefined);
 assert.equal(schema['@graph'].find(n=>n['@type']==='WebPage').reviewedBy.name,'Huang Matthew');
 assert.equal(article.datePublished,'2026-10-05');
 assert.equal(article.dateModified,'2026-10-29');
 assert.equal(faq.mainEntity.length,4);
 for(const q of faq.mainEntity){assert.ok(release.content.includes(q.name));assert.ok(release.content.includes(q.acceptedAnswer.text.replaceAll('&','&amp;').replaceAll(String.fromCharCode(39),'&#x27;')));}
 const cover=JSON.parse(fs.readFileSync('public/images/posts/'+release.slug+'/preview-assets.json','utf8'));
 assert.ok(cover.cover.src.endsWith('A-spiral-mixer.png'));
});
