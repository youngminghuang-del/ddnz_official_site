import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import catalogue from '../src/features/portable-power-catalogue/catalogue.json';
import locales from '../src/features/portable-power-catalogue/locales.json';

test('new power configurations keep source models, energy and continuous power distinct',()=>{
 const p=catalogue.find(p=>p.code==='PP-H02')!,w=catalogue.find(p=>p.code==='PP-W01')!;
 assert.ok(p.enTitle.includes('BP120B'));assert.ok(w.enTitle.includes('BP360H'));
 assert.deepEqual(p.enSpecs.find(([k])=>k==='Stored energy'),['Stored energy','1120 Wh']);
 assert.deepEqual(w.enSpecs.find(([k])=>k==='Rated AC output'),['Rated AC output','3600 W']);
 assert.deepEqual(w.enSpecs.find(([k])=>k==='Stored energy'),['Stored energy','5120 Wh']);
 assert.ok(!JSON.stringify([p,w]).match(/18000|3600KW|IP54|IP66|217 × 131|595\.50 cm/));
 assert.equal(p.enSpecs.find(([k])=>k==='Unit dimensions')?.[1],'Confirm for sample configuration');
 assert.equal(catalogue.filter(p=>p.category==='capacity').length,3);
 assert.equal(catalogue.filter(p=>p.category==='fast').length,2);
});
test('each additional model retains four view groups and native image copies',()=>{
 const gallery=catalogue.slice(5).flatMap(p=>p.gallery);
 assert.equal(gallery.length,8);
 for(const g of gallery){assert.ok(fs.existsSync('public'+g.web));assert.ok(fs.existsSync('public'+g.thumb));}
 for(const c of Object.values(locales)){
  assert.equal(c.names.length,catalogue.length);assert.equal(c.notes.length,catalogue.length);
  assert.equal(c.labels.length,catalogue.length);assert.equal(c.fields.length,12);
  assert.equal(c.values.length,23);assert.equal(c.images.length,21);
  assert.ok(c.names[5].includes('BP120B'));assert.ok(c.names[6].includes('BP360H'));
 }
});
