import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {buildFreightRateBatch,sha256} from '../scripts/freight-rate-batch.mjs';
import {validateCustomerFreight} from '../src/features/freight/rates/public-feed.mjs';
const published=JSON.parse(fs.readFileSync(new URL('../public/api/freight-rates/q4-2026.json',import.meta.url),'utf8'));
const countries=['colombia','ivory-coast','senegal'];
const base={...published,rows:published.rows.filter(r=>!countries.includes(r.country)),coverage:published.coverage.filter(r=>!countries.includes(r.country))};
const baselineText=JSON.stringify(base);
function source(){return {kind:'internal-freight-cost-snapshot',currency:'USD',period:'2026-Q4',collectedAt:'2026-11-02',reviewStatus:'reviewed',reviewedCountries:['colombia'],coverage:[{country:'colombia',port:'CARTAGENA,CO',status:'已确认港名'}],rows:[{sourceKey:'CO-TEST-1',country:'colombia',origin:'NANSHA',port:'CARTAGENA,CO',carrier:'TEST',service:'TEST',route:'Transfer TEST',cutoff:'Thu/Fri',days:44,prices:{'20GP':90,'40GP':180,'40HQ':null},fees:[{name:'THC',values:[9,18,null],ticket:null,currency:'RMB'}],flags:[],remarksRaw:'PRIVATE-SUPPLIER-CONDITIONS',validityRaw:'PRIVATE-VALIDITY'}]};}
const run=(s=source(),text=baselineText,idMap)=>buildFreightRateBatch({source:s,baselineText:text,expectedBaseHash:sha256(text),idMap});
test('batch export applies agreed margin once, preserves existing public rows and strips internal material',()=>{
 const x=run(),r=x.candidate.rows.at(-1);assert.equal(r.prices['20GP'],100);assert.equal(r.prices['40GP'],200);assert.equal(r.prices['40HQ'],null);assert.equal(r.fees[0].values[0],10);assert.deepEqual(x.candidate.rows.slice(0,base.rows.length),base.rows);
 assert.ok(!JSON.stringify(x.candidate).includes('PRIVATE-'));assert.ok(!('sourceKey' in r));assert.equal(x.report.added.length,1);assert.equal(x.report.removed.length,0);validateCustomerFreight(x.candidate,'2026-11-02');
});
test('subsequent cost changes retain route IDs, produce a diff and do not reprice untouched destinations',()=>{
 const one=run(),next=source();next.rows[0].prices['20GP']=180;const two=run(next,JSON.stringify(one.candidate),one.idMap);assert.equal(two.candidate.rows.at(-1).id,one.candidate.rows.at(-1).id);assert.equal(two.candidate.rows.at(-1).prices['20GP'],200);assert.deepEqual(two.candidate.rows.slice(0,base.rows.length),base.rows);assert.deepEqual(two.report.added,[]);assert.equal(two.report.changed.length,1);assert.ok(two.report.changed[0].fields.includes('prices'));
});
test('batch preparation rejects stale baselines, already-public data, accidental country withdrawal and invalid amounts',()=>{
 assert.throws(()=>buildFreightRateBatch({source:source(),baselineText,expectedBaseHash:'stale'}),/Baseline changed/);
 assert.throws(()=>run({...source(),kind:'customer-fcl-reference'}),/never reprice/);
 assert.throws(()=>run({...source(),reviewedCountries:['colombia','senegal']}),/Missing country data/);
 const negative=source();negative.rows[0].prices['20GP']=-1;assert.throws(()=>run(negative),/Invalid source price/);
 const unknownFee=source();unknownFee.rows[0].fees[0].name='UNREVIEWED FEE';assert.throws(()=>run(unknownFee),/Invalid fee/);
 const wrongScope=source();wrongScope.rows[0].country='senegal';assert.throws(()=>run(wrongScope),/outside the reviewed scope/);
});
test('the preview extension preserves the first published rows and adds only the three reviewed markets',()=>{
 assert.equal(base.rows.length,366);assert.equal(published.rows.length,400);assert.deepEqual(new Set(published.rows.slice(366).map(r=>r.country)),new Set(countries));assert.equal(new Set(published.rows.map(r=>r.id)).size,400);
});
