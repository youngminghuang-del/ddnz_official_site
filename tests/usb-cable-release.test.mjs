import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const release=JSON.parse(fs.readFileSync('src/data/usbCableRelease.json','utf8'));
const nodes=JSON.parse(fs.readFileSync('src/data/usb-cable-schema.json','utf8'))['@graph'];
test('USB cable release keeps five approved images, Turkish FAQ and human review consistent',()=>{
 assert.equal(release.language,'tr');assert.deepEqual(release.reviewer,['Huang Matthew']);
 assert.equal((release.content.match(/<img /g)||[]).length,4);assert.ok(!release.content.includes('<figcaption'));
 assert.equal(nodes.filter(n=>n['@type']==='ImageObject').length,5);
 assert.equal(nodes.find(n=>n['@type']==='WebPage').reviewedBy.name,'Huang Matthew');
 const article=nodes.find(n=>n['@type']==='BlogPosting');
 assert.match(article.datePublished,/T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/);
 assert.equal(article.dateModified,article.datePublished);
 assert.equal(nodes.find(n=>n['@type']==='ItemList').numberOfItems,6);
 assert.ok(!article.hasPart.some(n=>n['@id'].endsWith('#cable-quote-checklist')));
 const faq=nodes.find(n=>n['@type']==='FAQPage').mainEntity;assert.equal(faq.length,4);
 for(const q of faq){assert.ok(release.content.includes(q.name));assert.ok(release.content.includes(q.acceptedAnswer.text));}
 for(const im of nodes.filter(n=>n['@type']==='ImageObject')){
  assert.ok(im.contentUrl.startsWith('https://www.ddnzglobal.com/images/posts/'+release.slug+'/'));
  assert.ok(fs.existsSync('public'+new URL(im.contentUrl).pathname));
 }
 assert.ok(!/urn:ddnz:draft|file:/.test(JSON.stringify(nodes)));
});
