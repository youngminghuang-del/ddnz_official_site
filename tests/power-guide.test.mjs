import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import fs from 'node:fs';
import {renderToStaticMarkup} from 'react-dom/server';
import {tsImport} from 'tsx/esm/api';
import {powerModels,powerModel,loadPreset,analysePlan,capacityPercent,chargeFloor,guideHandoff,readGuideHandoff} from '../src/features/outdoor-sourcing/power-guide.mjs';
import {emptyBrief,normalizeBrief,buildOutdoorPayload} from '../src/features/outdoor-sourcing/buying.mjs';
import {outdoorProducts,priceAt} from '../src/features/outdoor-sourcing/catalog.mjs';
import {powerGuideMetadata} from '../src/features/outdoor-sourcing/seo.mjs';
import {powerGuidePath,productAlternates,localizedProductPath} from '../src/lib/productLocalization.mjs';
import {powerScenes} from '../src/features/outdoor-sourcing/power-scenes.mjs';
const {default:Content}=await tsImport('../src/features/outdoor-sourcing/PowerGuideContent.jsx',import.meta.url);
const {default:DeviceCards}=await tsImport('../src/features/outdoor-sourcing/PowerDeviceLab.jsx',import.meta.url);
test('catalogue variants have specific energy/output pairs without invented prices or boost substitutions',()=>{
 assert.equal(powerModels.length,6);
 for(const [id,wh,w] of [['ecoflow-classic',1024,1800],['ecoflow-max',2048,2400],['eboom-lxyt24',3500,2400]]){const m=powerModel(id);assert.equal(m.wh,wh);assert.equal(m.watts,w);assert.equal(priceAt(m,10),null);}
 for(const id of ['sanhe-st','sanhe-bg'])assert.equal(priceAt(powerModel(id),10),450);
});
test('simultaneous power and duration energy are tested independently',()=>{
 const p=loadPreset('camp'),r=analysePlan(powerModel('sanhe-st'),p.rows,p.hours,'85');
 assert.equal(r.watts,25);assert.equal(r.energy,100);assert.equal(r.usable,168.64);assert.equal(r.hours,6.7456);assert.equal(r.overload,false);assert.equal(r.shortfall,false);
 assert.equal(analysePlan(powerModel('sanhe-st'),p.rows,'8','85').shortfall,true);
 const high=p.rows.map(x=>x.id==='kettle'?{...x,on:true}:x);assert.equal(analysePlan(powerModel('sanhe-st'),high,'0.05','85').overload,true);assert.equal(analysePlan(powerModel('sanhe-st'),high,'0.05','85').shortfall,false);
 const doubled=p.rows.map(x=>({...x,count:'2'}));assert.equal(analysePlan(powerModel('sanhe-st'),doubled,'4','85').watts,50);
 const fridge=p.rows.map(x=>x.id==='fridge'?{...x,on:true}:x);assert.equal(analysePlan(powerModel('sanhe-st'),fridge,'4','85').starting,true);
 const same=analysePlan(powerModel('ecoflow-max'),p.rows,'4','85');assert.ok(same.hours>r.hours);assert.equal(same.watts,r.watts);
});
test('invalid, empty, extreme and localized user inputs do not create false estimates',()=>{
 const p=loadPreset();for(const [h,e] of [['0','85'],['169','85'],['4','49'],['4','96'],['','85'],['4','NaN']])assert.equal(analysePlan(powerModel('sanhe-st'),p.rows,h,e).status,'incomplete');
 for(const value of ['0','-1','1e3','', '10001']){const rows=p.rows.map(r=>r.id==='light'?{...r,watts:value}:r);assert.equal(analysePlan(powerModel('sanhe-st'),rows,'4','85').status,'incomplete');}
 for(const value of ['0','1.5','101']){const rows=p.rows.map(r=>r.id==='light'?{...r,count:value}:r);assert.equal(analysePlan(powerModel('sanhe-st'),rows,'4','85').status,'incomplete');}
 assert.equal(analysePlan(powerModel('sanhe-st'),p.rows.map(r=>({...r,on:false})),'4','85').status,'incomplete');
 assert.equal(analysePlan(powerModel('sanhe-st'),p.rows,'٤','٨٥').energy,100);
 assert.equal(analysePlan(powerModel('sanhe-st'),p.rows,'2,5','85').energy,62.5);
});
test('capacity chart uses a common linear scale and solar estimates respect input caps',()=>{
 assert.equal(capacityPercent(3500),100);assert.equal(capacityPercent(198.4),198.4/3500*100);assert.equal(capacityPercent(37)/capacityPercent(18.5),2);
 assert.equal(chargeFloor(powerModel('ecoflow-classic'),'1000','100'),2.048);assert.equal(chargeFloor(powerModel('ecoflow-classic'),'100','50'),20.48);assert.equal(chargeFloor(powerModel('sanhe-st'),'100','70'),null);
 assert.equal(chargeFloor(powerModel('tieding-51'),'100','70'),null);
 for(const [w,r] of [['','70'],['0','70'],['100','0'],['100','101'],['10001','70']])assert.equal(chargeFloor(powerModel('sanhe-st'),w,r),null);
});
test('brief handoff carries only a known model and validated load/duration',()=>{
 const p=loadPreset('work'),m=powerModel('ecoflow-max'),result=analysePlan(m,p.rows,p.hours,'85');
 for(const locale of ['en','es','ar']){const href=guideHandoff(m,result,locale,localizedProductPath('/sourcing/outdoor-products-from-china',locale));const u=new URL(href,'https://example.test');assert.equal(u.hash,'#buying-brief');const parsed=readGuideHandoff(u.search,locale);assert.equal(parsed.id,m.id);assert.ok(parsed.note.includes('72W'));assert.ok(parsed.note.includes('4h'));}
 for(const search of ['?powerModel=bad&powerLoad=10&powerHours=4','?powerModel=sanhe-st&powerLoad=-1&powerHours=4','?powerModel=sanhe-st&powerLoad=10&powerHours=169'])assert.equal(readGuideHandoff(search),null);
 assert.equal(guideHandoff(m,{status:'incomplete'}),null);
});
test('guide SSR, assets, language alternates and catalogue links exist in three languages',()=>{
 for(const locale of ['en','es','ar']){const html=renderToStaticMarkup(React.createElement(Content,{locale}));assert.equal((html.match(/<h1>/g)||[]).length,1);assert.ok(html.includes('id="power-guide-model"'));assert.ok(html.includes('id="appliance-plan"'));assert.ok(html.includes('id="energy-flow"'));assert.ok(html.includes('id="power-charge-model"'));assert.ok(html.includes('id="power-plan-model"'));assert.doesNotMatch(html,/NaN|undefined|\[object Object\]|16 phone charges|renewal needed/);for(const [,src]of html.matchAll(/<img[^>]*src="([^"]+)"/g))assert.ok(fs.existsSync(new URL('../public'+src,import.meta.url)));assert.equal(powerGuideMetadata(locale).path,localizedProductPath(powerGuidePath,locale));assert.equal(productAlternates(powerGuidePath).length,8);}
});

test('load-plan notes persist separately without truncating existing buyer notes',()=>{const b=emptyBrief();b.form.notes='x'.repeat(1200);b.guideNote='Power plan: 3HZ-300ST; simultaneous AC load 25W; target 4h.';const d=normalizeBrief(b);assert.equal(d.form.notes.length,1200);assert.equal(d.guideNote,b.guideNote);assert.ok(buildOutdoorPayload(d).message.includes(b.guideNote));});

test('every photographed scene offers the same appliances as its load preset and a responsive asset',()=>{
 for(const scene of powerScenes){
  const preset=loadPreset(scene.id);
  assert.deepEqual(scene.hotspots.filter(p=>p.id!=='power').map(p=>p.id).sort(),preset.rows.filter(r=>r.on).map(r=>r.id).sort());
  for(const point of scene.hotspots){assert.ok(point.x>0&&point.x<100&&point.y>0&&point.y<100);}
  for(const name of [scene.image,scene.image.replace('.webp','-768.webp')])assert.ok(fs.existsSync(new URL('../public/outdoor-sourcing-media/'+name,import.meta.url)));
 }
});

test('appliance cards expose checked state and editable values for the supplied custom plan in every language',()=>{
 const rows=loadPreset('work').rows.map(r=>r.id==='laptop'?{...r,watts:'90',count:'2'}:r);
 for(const locale of ['en','es','ar']){
  const html=renderToStaticMarkup(React.createElement(DeviceCards,{rows,locale,onEdit:()=>{}}));
  assert.equal((html.match(/type="checkbox"/g)||[]).length,8);
  assert.equal((html.match(/checked=""/g)||[]).length,2);
  assert.match(html,/id="power-watts-laptop"[^>]+value="90"/);
  assert.match(html,/id="power-count-laptop"[^>]+value="2"/);
  assert.match(html,/id="power-watts-kettle"[^>]+disabled=""/);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
 }
 const small=analysePlan(powerModel('sanhe-st'),rows,'4','85'),large=analysePlan(powerModel('ecoflow-classic'),rows,'4','85');
 assert.equal(small.watts,192);assert.equal(large.watts,192);assert.equal(small.shortfall,true);assert.equal(large.shortfall,false);
});
