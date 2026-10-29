import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const release=JSON.parse(fs.readFileSync('src/data/kitchenSparePartsRelease.json','utf8'));
const schema=JSON.parse(fs.readFileSync('src/data/kitchen-spare-parts-schema.json','utf8'));
test('owner-approved spare-parts release keeps images, FAQ and public schema in sync',()=>{
 const article=schema['@graph'].find(n=>n['@type']==='BlogPosting');
 const images=schema['@graph'].filter(n=>n['@type']==='ImageObject');
 const faq=schema['@graph'].find(n=>n['@type']==='FAQPage');
 assert.deepEqual(release.reviewer,['Huang Matthew']);
 assert.equal((release.content.match(/<img /g)||[]).length,3);
 assert.ok(!release.content.includes('<figcaption'));
 assert.ok(!/file:|urn:ddnz:draft/.test(JSON.stringify(schema)));
 assert.equal(images.length,4);
 assert.ok(images.every(n=>n.contentUrl.startsWith('https://www.ddnzglobal.com/images/posts/'+release.slug+'/')));
 assert.equal(article.reviewedBy.name,'Huang Matthew');
 assert.equal(faq.mainEntity.length,4);
 for(const q of faq.mainEntity){assert.ok(release.content.includes(q.name));assert.ok(release.content.includes(q.acceptedAnswer.text.replaceAll('&','&amp;')));}
 const cover=JSON.parse(fs.readFileSync('public/images/posts/'+release.slug+'/preview-assets.json','utf8'));
 assert.ok(cover.cover.src.endsWith('B-oven-blower.jpg'));
});
