import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyPowerDraft,normalizePowerDraft,readPowerDraft,savePowerDraft,comparePowerModels,powerGuideEvent} from '../src/features/outdoor-sourcing/power-draft.mjs';
import {powerModel,analysePlan,guideHandoff,readGuideHandoff} from '../src/features/outdoor-sourcing/power-guide.mjs';
import {emptyBrief,normalizeBrief,buildOutdoorPayload} from '../src/features/outdoor-sourcing/buying.mjs';
import {submitInquiry,formspreeBody} from '../src/features/commercial-kitchen/data/inquiry.mjs';
import {powerGuideMetadata} from '../src/features/outdoor-sourcing/seo.mjs';
import fs from 'node:fs';

test('draft round-trip retains edits, blank invalid fields and charging settings without arbitrary data',()=>{
 const d=emptyPowerDraft();d.modelId='ecoflow-max';d.plan.rows[1].watts='22';d.plan.rows[1].count='2';d.plan.hours='';d.eff='80';d.panel='400';d.port='usb';d.email='private@example.com';
 let stored='';const storage={getItem:()=>stored,setItem:(_,s)=>{stored=s;}};
 assert.equal(savePowerDraft(storage,d),true);const restored=readPowerDraft(storage);assert.equal(restored.plan.hours,'');assert.equal(restored.plan.rows[1].watts,'22');assert.equal(restored.plan.rows[1].count,'2');assert.equal(restored.modelId,'ecoflow-max');assert.equal(restored.eff,'80');assert.equal(restored.panel,'400');assert.equal(restored.port,'usb');assert.equal(restored.scenario,'');assert.equal(restored.email,undefined);
 assert.equal(readPowerDraft({getItem:()=>'{'}),null);assert.equal(readPowerDraft({getItem:()=>{throw Error();}}),null);assert.equal(savePowerDraft({setItem:()=>{throw Error();}},d),false);assert.equal(normalizePowerDraft({version:99,plan:{rows:[]}}),null);
});
test('detailed handoff recomputes from whitelisted rows and preserves every device in all languages',()=>{
 const d=emptyPowerDraft();d.plan.rows=d.plan.rows.map(r=>({...r,on:true,watts:'20',count:'2'}));d.plan.hours='3';d.eff='80';const m=powerModel(d.modelId),r=analysePlan(m,d.plan.rows,d.plan.hours,d.eff);
 for(const locale of ['en','es','ar']){const href=guideHandoff(m,r,locale,'/catalogue/',d),parsed=readGuideHandoff(new URL(href,'https://test.invalid').search,locale);assert.equal(parsed.id,m.id);assert.equal((parsed.note.match(/20W × 2 = 40W/g)||[]).length,8);assert.ok(parsed.note.includes('320W'));assert.ok(parsed.note.includes('80%'));assert.ok(parsed.note.includes('3h'));assert.ok(parsed.note.includes('20W.'));const brief=emptyBrief();brief.guideNote=parsed.note;assert.equal(normalizeBrief(brief).guideNote,parsed.note);assert.ok(buildOutdoorPayload(brief,locale).message.includes(parsed.note));}
 const encode=d=>'?powerPlan='+encodeURIComponent(JSON.stringify(d));
 for(const bad of [{v:3,m:m.id,h:3,e:80,r:[['phone',20,1]]},{v:2,m:'unknown',h:3,e:80,r:[['phone',20,1]]},{v:2,m:m.id,h:3,e:80,r:[['phone',20,1],['phone',20,1]]},{v:2,m:m.id,h:3,e:80,r:[['unknown',20,1]]},{v:2,m:m.id,h:3,e:80,r:[['phone',0,1]]},{v:2,m:m.id,h:3,e:96,r:[['phone',20,1]]}])assert.equal(readGuideHandoff(encode(bad)),null);
 assert.equal(readGuideHandoff('?powerPlan=bad&powerModel=sanhe-st&powerLoad=25&powerHours=4'),null);
});
test('model comparison separates power and energy gaps with exact threshold handling',()=>{
 const d=emptyPowerDraft();let results=comparePowerModels(d.plan.rows,'8','85');const sanhe=results.find(r=>r.model.id==='sanhe-st');assert.equal(sanhe.fits,false);assert.equal(sanhe.powerGap,0);assert.ok(Math.abs(sanhe.energyGap-31.36)<1e-8);assert.ok(results.find(r=>r.model.id==='ecoflow-classic').fits);
 const rows=d.plan.rows.map(r=>({...r,on:r.id==='kettle',watts:'300'}));const exact=comparePowerModels(rows,'0.5621333333333333','85').find(r=>r.model.id==='sanhe-st');assert.equal(exact.powerGap,0);assert.ok(exact.fits);
 results=comparePowerModels(rows.map(r=>({...r,watts:'10000'})),'4','85');assert.ok(results.every(r=>!r.fits));assert.deepEqual(comparePowerModels(d.plan.rows,'','85'),[]);
});
test('guide analytics carries enum identifiers only, never raw user fields',()=>{
 const e=powerGuideEvent('en','model_select',{modelId:'sanhe-st',sceneId:'camp',deviceId:'phone',email:'private@example.com',watts:'72',notes:'private'});assert.deepEqual(Object.keys(e.params).sort(),['content_group','content_language','device_id','journey_action','product_id','scene_id']);assert.equal(powerGuideEvent('en','raw_input',{}),null);assert.equal(powerGuideEvent('de','model_select',{}),null);assert.equal(powerGuideEvent('en','model_select',{modelId:'private@example.com'}).params.product_id,undefined);
});
test('inquiry production transport preserves human-readable details and handles timeout, rejection and retry',async()=>{
 const payload={name:'Internal test',email:'qa@example.invalid',subject:'Fixture only',message:'Phone: 20W × 2\nTarget: 3h'};let calls=0;const sent=[];
 const fetchImpl=async(_url,opts)=>{calls++;sent.push(opts);return{ok:true,json:async()=>({ok:true})};};
 assert.equal((await submitInquiry(payload,{hostname:'localhost',fetchImpl})).mode,'preview');assert.equal(calls,0);
 await submitInquiry(payload,{hostname:'www.ddnzglobal.com',fetchImpl});assert.equal(new URLSearchParams(sent[0].body).get('message'),payload.message);assert.equal(new URLSearchParams(formspreeBody(payload)).get('email'),payload.email);
 await assert.rejects(submitInquiry(payload,{hostname:'www.ddnzglobal.com',fetchImpl:async()=>({ok:false,json:async()=>({ok:false})})}));
 await assert.rejects(submitInquiry(payload,{hostname:'www.ddnzglobal.com',timeoutMs:10,fetchImpl:()=>new Promise(()=>{})}),{code:'TIMEOUT'});
 await assert.rejects(submitInquiry(payload,{hostname:'www.ddnzglobal.com',timeoutMs:10,fetchImpl:async()=>({ok:true,json:()=>new Promise(()=>{})})}),{code:'TIMEOUT'});
 assert.equal((await submitInquiry(payload,{hostname:'www.ddnzglobal.com',fetchImpl})).mode,'production');
});
test('all guide languages share the new scene cover as a real local asset',()=>{for(const lang of ['en','es','ar']){const m=powerGuideMetadata(lang);assert.match(m.image,/power-guide-share-v1\.jpg$/);assert.ok(fs.existsSync(new URL('../public'+m.image,import.meta.url)));}});
