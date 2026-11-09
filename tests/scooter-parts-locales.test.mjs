import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {partsLanguages,partsPrefix,partsLanguage,partName,partsText} from '../src/features/electric-mobility/parts-i18n.ts';
import {partsSchema} from '../src/features/electric-mobility/parts-schema.ts';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const data=read('../src/features/electric-mobility/parts-catalogue.json');
const locales=read('../src/features/electric-mobility/parts-locales.json');
for(const language of partsLanguages)test(`${language}: parts, scope and route stay aligned`,()=>{
 const path=partsPrefix(language)+'/sourcing/electric-scooter-spare-parts-from-china/';
 assert.equal(partsLanguage(path),language);
 const graph=partsSchema(language)['@graph'];
 assert.equal(graph[1].numberOfItems,data.length);
 assert.equal(graph[0].url,'https://www.ddnzglobal.com'+path);
 assert.equal(graph[0].inLanguage,language==='zh'?'zh-CN':language);
 for(const [i,p] of data.entries()){
  assert(partName(p,language).trim());
  assert.equal(graph[1].itemListElement[i].name,`${p.id} · ${partName(p,language)}`);
  assert.equal(graph[1].itemListElement[i].url,'https://www.ddnzglobal.com'+path+'#'+p.slug);
 }
 if(!locales[language])return;
 assert.deepEqual(Object.keys(locales[language].names).sort(),data.map(p=>p.slug).sort(),'new products must receive a translation');
 for(const [key,value] of Object.entries(locales[language].ui)){
  assert(value.trim(),key);
  assert.deepEqual([...key.matchAll(/\{\w+\}/g)].map(x=>x[0]).sort(),[...value.matchAll(/\{\w+\}/g)].map(x=>x[0]).sort(),`${key}: preserve all quantities`);
  assert.equal(partsText(language,'unused',key),value);
 }
 assert(!JSON.stringify(graph).includes('"@type":"Offer"'),'no invented price offers');
});
