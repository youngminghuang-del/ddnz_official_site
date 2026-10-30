import test from 'node:test';
import assert from 'node:assert/strict';
import {previewAllowed,publicRateEligible,filteredRates,routeExamples,inquiryNotes} from './model.mjs';

test('internal preview cannot run on production or with a disabled build flag',()=>{
 assert.equal(previewAllowed(true,'127.0.0.1','zh','ghana'),true);
 for(const args of [[false,'127.0.0.1','zh','ghana'],[true,'www.ddnzglobal.com','zh','ghana'],[true,'127.0.0.1','en','ghana'],[true,'127.0.0.1','zh','russia']])assert.equal(previewAllowed(...args),false);
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
 for(const term of ['FCL-EXAMPLE','40HQ','特马','南沙','非有效报价'])assert.ok(notes.includes(term));
 assert.equal(notes.includes('5470'),false);
});
