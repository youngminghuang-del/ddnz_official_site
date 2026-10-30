import test from 'node:test';
import assert from 'node:assert/strict';
import {previewAllowed,publicRateEligible,filteredRates,routeExamples,inquiryNotes,referencePrice,customerConditions,routeDescription} from './model.mjs';

test('internal preview cannot run on production or with a disabled build flag',()=>{
 assert.equal(previewAllowed(true,'127.0.0.1','zh','ghana'),true);
 assert.equal(previewAllowed(true,'127.0.0.1','en','ghana'),true);
 for(const args of [[false,'127.0.0.1','zh','ghana'],[true,'www.ddnzglobal.com','zh','ghana'],[true,'127.0.0.1','fr','ghana'],[true,'127.0.0.1','zh','russia']])assert.equal(previewAllowed(...args),false);
});
test('source captures without a confirmed year or approved selling price are never public offers',()=>{
 const now='2026-10-30T06:00:00Z';
 assert.equal(publicRateEligible({publicPriceApproved:false,validFromISO:'2026-10-01T00:00:00Z',validThroughISO:'2026-10-31T23:59:59Z'},now),false);
 assert.equal(publicRateEligible({publicPriceApproved:true,validFromISO:null,validThroughISO:null},now),false);
 assert.equal(publicRateEligible({publicPriceApproved:true,validFromISO:'bad',validThroughISO:'bad'},now),false);
});
test('public validity admits current confirmed rates and excludes expired or future rates',()=>{
 const row={publicPriceApproved:true,validFromISO:'2026-10-20T00:00:00Z',validThroughISO:'2026-10-30T08:00:00Z'};
 assert.equal(publicRateEligible(row,'2026-10-30T07:00:00Z'),true);
 assert.equal(publicRateEligible(row,'2026-10-30T09:00:00Z'),false);
 assert.equal(publicRateEligible(row,'2026-10-19T23:59:59Z'),false);
});
test('route filters keep different ports and actual departure ports separate',()=>{
 const rows=[{country:'ghana',port:'TEMA',origin:'NANSHA'},{country:'ghana',port:'TEMA',origin:'HUANGPU'},{country:'ghana',port:'TAKORADI',origin:'NANSHA'},{country:'nigeria',port:'APAPA',origin:'NANSHA'}];
 assert.deepEqual(filteredRates(rows,{countries:['ghana'],port:'TEMA',origin:'NANSHA'}),[rows[0]]);
 assert.equal(filteredRates(rows,{countries:['ghana'],port:'CHANCAY',origin:'all'}).length,0);
});
test('regional examples preserve explicit route identity and do not choose a minimum price',()=>{
 const rows=[{country:'ghana',port:'TEMA',origin:'NANSHA',price:5000},{country:'ghana',port:'TEMA',origin:'NANSHA',price:4000},{country:'ghana',port:'TEMA',origin:'HUANGPU',price:5500}];
 assert.deepEqual(routeExamples(rows),[rows[0],rows[2]]);
 assert.equal(rows.length,3);
});
test('inquiry handoff identifies the selected container and route without presenting a source cost as an offer',()=>{
 const notes=inquiryNotes({id:'FCL-EXAMPLE',origin:'NANSHA',port:'TEMA',carrier:'MSC',service:'AFRICA',price:5470},'40HQ');
 for(const term of ['FCL-EXAMPLE','40HQ','特马','南沙','不是锁价报价'])assert.ok(notes.includes(term));
 assert.equal(notes.includes('5470'),false);
});


test('quarter reference uses a 10 percent gross margin rather than a 10 percent markup',()=>{
 assert.equal(referencePrice(450),500);assert.equal(referencePrice(5070),5633.34);
 assert.equal(referencePrice(645),716.67);assert.equal(referencePrice(210),233.34);
 assert.equal(referencePrice(null),null);assert.equal(referencePrice(0),0);
 assert.ok((referencePrice(5070)-5070)/referencePrice(5070)>=0.1);
});
test('customer condition copy preserves cargo thresholds but leaves conditional carrier costs to inquiry',()=>{
 const text=customerConditions('小柜超过21.5吨，NANSHA100RMB；40HQ超过26吨加USD300');
 assert.ok(text.includes('21.5吨'));assert.ok(text.includes('26吨'));assert.ok(!text.includes('100RMB'));assert.ok(!text.includes('USD300'));
 const compound=customerConditions('DG USD150/250；CIC $150/300；21天+100/200；USD150/20’ USD250/40’；USD100/20GP；26TON、66CBM');
 for(const unit of ['21天','20’','40’','20GP','26TON','66CBM'])assert.ok(compound.includes(unit),unit);
 for(const cost of ['USD150','USD250','$150','/250','/300','100/200'])assert.ok(!compound.includes(cost),cost);
});

test('a source route that repeats its destination requires transit confirmation',()=>{
 assert.equal(routeDescription({route:'Transfer JEBEL ALI',port:'JEBEL ALI'}),'中转安排待确认');
 assert.equal(routeDescription({route:'Transfer SINGAPORE',port:'TEMA'}),'中转 · SINGAPORE');
 assert.equal(routeDescription({route:'Direct',port:'CALLAO'}),'直航');
});

test('English routing leaves ambiguous transshipment for confirmation',async()=>{
 const {routeLabelEn}=await import('./copy.mjs');
 assert.equal(routeLabelEn({route:'Transfer JEBEL ALI',port:'JEBEL ALI'}),'Transshipment to confirm');
 assert.equal(routeLabelEn({route:'Transfer singapore',port:'TEMA'}),'Via Singapore');
 assert.equal(routeLabelEn({route:'Transfer',port:'TEMA'}),'Transshipment to confirm');
});
