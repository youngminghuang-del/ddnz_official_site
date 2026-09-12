import test from 'node:test';
import assert from 'node:assert/strict';
import { kitchenInquiryAnalytics } from '../src/features/commercial-kitchen/site-analytics.mjs';
const detail = { action: 'submit_success', mode: 'production', productCount: 2, unitCount: 11 };
test('kitchen lead events require tracking consent and production submission', () => {
  for (const consent of [undefined, null, {}, {tracking:false}, {tracking:'true'}]) assert.equal(kitchenInquiryAnalytics(detail,consent),null);
  assert.equal(kitchenInquiryAnalytics({...detail,mode:'preview'},{tracking:true}),null);
  assert.equal(kitchenInquiryAnalytics({...detail,action:'preview_success'},{tracking:true}),null);
});
test('only aggregate inquiry data is forwarded and malformed counts are rejected', () => {
  assert.deepEqual(kitchenInquiryAnalytics({...detail,email:'customer@example.com',message:'Private buying notes'},{tracking:true}),{
    event:'generate_lead', params:{form_id:'commercial_kitchen',inquiry_action:'submit_success',product_count:2,unit_count:11},
  });
  assert.equal(kitchenInquiryAnalytics({...detail,unitCount:NaN},{tracking:true}),null);
  assert.equal(kitchenInquiryAnalytics({...detail,productCount:27},{tracking:true}),null);
  assert.equal(kitchenInquiryAnalytics({...detail,unitCount:1},{tracking:true}),null);
});
