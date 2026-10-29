import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { inquiryIntent } from '../src/features/inquiry/intent.mjs';
import { intentCopy } from '../src/features/inquiry/IntentChoice';
import InquirySourceFields, { inquirySourceFields } from '../src/features/inquiry/InquirySourceFields';
import { rememberAttribution, readAttribution, safePagePath } from '../src/lib/attribution';
import { captureQuoteLink, quoteParamsForLocation, clearQuoteContext } from '../src/lib/quoteLinkPolicy.mjs';
const store = () => { const data = new Map(); return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string,v: string) => data.set(k,v), removeItem: (k: string) => data.delete(k) }; };
const browser = () => { globalThis.window = { location: { origin: 'https://www.ddnzglobal.com', hostname: 'www.ddnzglobal.com', pathname: '/sourcing/mobile-accessories-from-china/' }, sessionStorage: store(), localStorage: store() } as any; };
test('generic and UTM-only requests ask for intent; explicit and legacy routes retain their intent', () => {
 for (const query of ['', '?source=footer_primary', '?utm_source=google&ddnz_test=1', '?leadGoal=unknown']) assert.equal(inquiryIntent(new URLSearchParams(query)), null);
 for (const goal of ['Product Sourcing','Supplier Inspection & Consolidation','Freight Only','Freight Export']) assert.equal(inquiryIntent(new URLSearchParams({leadGoal:goal})),goal);
 assert.equal(inquiryIntent(new URLSearchParams({dest:'Istanbul, Turkey',mode:'Air'})), 'Freight Export');
 assert.equal(inquiryIntent(new URLSearchParams({model:'CK-129'})), 'Product Sourcing');
 for (const c of Object.values(intentCopy)) assert.equal(c.length, 9);
});
test('first landing and campaign stay separate from later campaign and internal button context', () => {
 browser(); rememberAttribution('?utm_source=google&utm_medium=organic&utm_campaign=first', '/es/phone-cases/?email=private@example.test#details', 'https://www.google.com/search?q=private');
 rememberAttribution('?source=phone_cases&utm_campaign=later', '/get-a-quote/', 'https://www.ddnzglobal.com/es/phone-cases/');
 const fields = inquirySourceFields(new URLSearchParams({source:'phone_cases',model:'CK-129',entryPage:'/es/phone-cases/'}), '/get-a-quote/?email=private@example.test');
 assert.equal(fields.Landing_Page, '/es/phone-cases/'); assert.equal(fields.First_Referrer_Host, 'www.google.com');
 assert.equal(fields.First_UTM_Campaign, 'first'); assert.equal(fields.UTM_Campaign, 'later'); assert.equal(fields.Current_Page, '/get-a-quote/'); assert.equal(fields.Selected_Product_Model,'CK-129');
 const html = renderToStaticMarkup(<InquirySourceFields params={new URLSearchParams()} pathname="/get-a-quote/" />);
 assert.ok(!html.includes('private')); assert.equal((html.match(/name="UTM_Source"/g)||[]).length,1);
});
test('an untagged first visit is not retroactively labeled by a later campaign; invalid source values are blank', () => {
 browser(); rememberAttribution('', '/products/', ''); rememberAttribution('?utm_source=linkedin', '/get-a-quote/');
 assert.equal(readAttribution().first_utm_source, '');
 const fields = inquirySourceFields(new URLSearchParams({utm_source:'private@example.test',model:'invented',entryPage:'https://other.test/private'}), '/get-a-quote/');
 assert.equal(fields.UTM_Source, 'linkedin'); assert.equal(fields.Selected_Product_Model,''); assert.equal(fields.Inquiry_Entry_Page,'');
 assert.equal(safePagePath('//other.test/path'),'');
});
test('blocked storage and corrupted session data do not block inquiry rendering', () => {
 browser(); window.sessionStorage.setItem('ddnz_attribution', 'null'); assert.doesNotThrow(() => readAttribution());
 Object.defineProperty(window, 'sessionStorage', {value: {getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}}});
 assert.doesNotThrow(() => rememberAttribution('', '/products/'));
 assert.doesNotThrow(() => inquirySourceFields(new URLSearchParams(), '/get-a-quote/'));
});
test('real quote-link handoff keeps originating product page and works with preview flags', () => {
 browser(); clearQuoteContext('/get-a-quote/');
 const attrs = new Map([['href','/get-a-quote/'],['data-quote-context',JSON.stringify({leadGoal:'Product Sourcing', model:'CK-129', overviewBrief:'CK-129 × 20'})]]);
 const anchor = {hasAttribute:(key:string)=>key==='data-quote-context',getAttribute:(key:string)=>attrs.get(key)};
 captureQuoteLink({target:{closest:()=>anchor}});
 const p = quoteParamsForLocation('?ddnz_test=1','/get-a-quote/');
 assert.equal(p.get('model'),'CK-129'); assert.equal(p.get('overviewBrief'),'CK-129 × 20'); assert.equal(p.get('entryPage'),window.location.pathname);
 captureQuoteLink({target:{closest:()=>({hasAttribute:()=>false,getAttribute:()=>'/get-a-quote/'})}});
 assert.equal(quoteParamsForLocation('', '/get-a-quote/').get('leadGoal'),null);
 clearQuoteContext('/get-a-quote/');
});
