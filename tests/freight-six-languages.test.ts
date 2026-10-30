import test from 'node:test';import assert from 'node:assert/strict';
import {freightLocalizations,localizedCutoff,localizedDestination,localePrefix} from '../src/features/freight/locales/index.mjs';
import {rateCopy} from '../src/features/freight/rates/copy.mjs';
import {deliveryAssessmentSummary,emptyDeliveryAssessment} from '../src/features/freight/deliveryAssessment.mjs';
import {doorQuote,doorDeliveryMetadata} from '../src/features/freight/DoorDeliveryContent';
import {freightServiceSchema} from '../src/features/freight/freightServiceSchema';
import {previewAllowed} from '../src/features/freight/rates/model.mjs';
for(const [locale,data]of Object.entries(freightLocalizations) as [string,any][]){
 test(`${locale}: complete UI and explicit unconfirmed delivery values`,()=>{
 assert.deepEqual(Object.keys(data.rate).sort(),Object.keys(rateCopy.en).sort());assert.equal(data.form.fields.length,9);assert.equal(data.door.cards.length,3);assert.equal(data.door.costs.length,3);assert.equal(data.door.fees.length,16);
 const brief=deliveryAssessmentSummary(emptyDeliveryAssessment(),locale);assert.equal(brief.split(data.form.unknown).length-1,9);assert.ok(!brief.includes('To be confirmed'));
 const chosen=deliveryAssessmentSummary({...emptyDeliveryAssessment(),importer:'Need help assessing importer'},locale);assert.ok(chosen.includes(data.form.options[2][2]));
 assert.equal(previewAllowed(true,'127.0.0.1',locale,'ghana'),true);assert.equal(previewAllowed(true,'www.ddnzglobal.com',locale,'ghana'),false);
 assert.ok(localizedCutoff('cutting/ETD： Mon/Tue',locale).startsWith(data.extra.cutoff));assert.ok(localizedDestination('ghana',locale));
 });
 test(`${locale}: inquiry destination and visible breadcrumb preserve locale without speculative offers`,()=>{
 const props=doorQuote('ghana',locale);assert.equal(props.href,localePrefix(locale)+'/get-a-quote/');const c=JSON.parse(props['data-quote-context']);assert.equal(c.destinationText,localizedDestination('ghana',locale));assert.equal(c.deliveryAssessment,'1');assert.ok(c.notes.includes(data.door.prepText));
 const graph=freightServiceSchema('services/ddp-shipping-from-china',locale,doorDeliveryMetadata(locale));const svc=graph['@graph'][1] as any;assert.equal(svc.offers,undefined);assert.equal(svc.areaServed,undefined);assert.equal(svc.provider.name,'Heaven Born (HB)');assert.deepEqual((graph['@graph'][2] as any).itemListElement.map(x=>x.name),[data.door.home,data.door.freight,data.door.breadcrumb]);
 });
}
