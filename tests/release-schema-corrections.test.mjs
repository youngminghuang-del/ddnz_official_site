import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const schema=JSON.parse(fs.readFileSync(new URL('../src/data/solar-cable-schema.json',import.meta.url),'utf8'));
test('solar cable article keeps publication and authorship while attaching the real reviewer to its WebPage',()=>{
 const graph=schema['@graph'],article=graph.find(n=>n['@type']==='BlogPosting'),page=graph.find(n=>n['@type']==='WebPage');
 assert.equal(article.reviewedBy,undefined);
 assert.deepEqual(page.reviewedBy,{'@type':'Person',name:'Huang Matthew'});
 assert.deepEqual(article.author,{'@id':'https://www.ddnzglobal.com/#organization'});
 assert.equal(article.datePublished,'2026-10-26');assert.equal(article.dateModified,'2026-10-26');
 assert.equal(page.mainEntity['@id'],article['@id']);
});
test('solar cable breadcrumb uses the same real Spanish resource hub as visible navigation',()=>{
 const graph=schema['@graph'],page=graph.find(n=>n['@type']==='WebPage'),crumb=graph.find(n=>n['@type']==='BreadcrumbList');
 assert.equal(page.breadcrumb['@id'],crumb['@id']);
 assert.deepEqual(crumb.itemListElement.map(n=>n.position),[1,2,3]);
 assert.equal(crumb.itemListElement[1].item,'https://www.ddnzglobal.com/es/insights/');
 assert.equal(crumb.itemListElement[1].name,'Recursos');
 assert.equal(crumb.itemListElement[2].item,page.url);
});
