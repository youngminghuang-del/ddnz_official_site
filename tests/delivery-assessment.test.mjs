import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyDeliveryAssessment,deliveryAssessmentSummary,deliveryMessage} from '../src/features/freight/deliveryAssessment.mjs';
import {quoteLinkProps} from '../src/lib/quoteLinkPolicy.mjs';
test('blank delivery details remain explicitly unconfirmed without inventing an importer or tax scope',()=>{
 const v=emptyDeliveryAssessment();const text=deliveryAssessmentSummary(v,'en');assert.equal(Object.values(v).every(x=>x===''),true);assert.equal((text.match(/To be confirmed/g)||[]).length,9);assert.ok(text.includes('not confirmed service scope'));
});
test('the reviewed delivery brief preserves customer-provided address, value, currency and importer requirements',()=>{
 const v={...emptyDeliveryAssessment(),terms:'DDP',postcode:'TEST-000',address:'Preview test address',value:'2500',currency:'USD',importer:'Need help assessing importer',unloading:'Consignee can unload'};
 const text=deliveryAssessmentSummary(v);for(const s of ['DDP','TEST-000','Preview test address','2500','USD','Need help assessing importer','Consignee can unload'])assert.ok(text.includes(s));assert.ok(deliveryAssessmentSummary(v,'zh').includes('客户需求，非已确认服务范围'));
});
test('only the assessment flag crosses the quote link; customer details stay out of the URL',()=>{
 const props=quoteLinkProps('/get-a-quote/?deliveryAssessment=1&notes=Preview+only');assert.equal(props.href,'/get-a-quote/');assert.equal(JSON.parse(props['data-quote-context']).deliveryAssessment,'1');
});

test('delivery requirements enter the existing message field without losing the original note',()=>{
 const note='Original cargo note\nKeep this line.';const brief=deliveryAssessmentSummary({...emptyDeliveryAssessment(),address:'Preview address',currency:'USD',value:'2500'});
 assert.equal(deliveryMessage(note,''),note);assert.equal(deliveryMessage(note,brief),note+'\n\n'+brief);assert.equal(deliveryMessage('',brief),brief);
});
