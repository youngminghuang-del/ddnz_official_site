import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { buyerGuides, buyerLocales, buyerGuideForPath, buyerSchema, buyerMeta, buildBuyerPayload, validateBuyerBrief, buyerJourneyAnalytics } from '../src/features/buyer-guides/data.mjs';
import { localizedProductPath, productAlternates, productRouteParts, hasProductTranslation } from '../src/lib/productLocalization.mjs';
import { submitInquiry } from '../src/features/commercial-kitchen/data/inquiry.mjs';

test('four distinct purchasing needs have complete equivalent copy and real media in all three languages', () => {
  assert.equal(buyerGuides.length, 4);
  assert.equal(new Set(buyerGuides.map(guide => guide.path)).size, 4);
  const required = Object.keys(buyerLocales.en);
  for (const locale of ['en', 'es', 'ar']) {
    const copy = buyerLocales[locale];
    assert.deepEqual(Object.keys(copy), required);
    assert.deepEqual(Object.keys(copy.form), Object.keys(buyerLocales.en.form));
    for (const guide of buyerGuides) {
      const page = copy.guides[guide.id], source = buyerLocales.en.guides[guide.id];
      assert.deepEqual(Object.keys(page), Object.keys(source));
      assert.equal(page.steps.length, 3); assert.equal(page.faqs.length, 3);
      assert.deepEqual(page.fields.map(field => field.key), source.fields.map(field => field.key));
      assert.ok(page.description.length >= 40); assert.ok(page.steps.every(step => step[1].length > 80));
      assert.ok(existsSync(new URL(`../public${guide.image}`, import.meta.url)));
    }
    assert.equal(new Set(Object.values(copy.guides).map(page => page.title)).size, 4);
  }
});

test('buyer routes have reciprocal English/Spanish/Arabic canonicals and correct breadcrumb parents', () => {
  for (const guide of buyerGuides) for (const locale of ['en', 'es', 'ar']) {
    const route = localizedProductPath(guide.path, locale);
    assert.equal(buyerGuideForPath(route), guide);
    const meta = buyerMeta(guide, locale), schema = buyerSchema(guide, locale);
    assert.equal(meta.path, route); assert.equal(schema['@graph'][0].inLanguage, locale);
    const last = schema['@graph'][1].itemListElement.at(-1);
    assert.equal(last.item, `https://www.ddnzglobal.com${route}`);
    assert.deepEqual(productAlternates(route).map(item => item.hrefLang), ['en', 'es', 'ar']);
  }
  assert.equal(buyerGuideForPath('/screen-protectors/private-label-copy/'), undefined);
  assert.equal(hasProductTranslation('/screen-protectors/calculator/', 'ar'), false);
  assert.deepEqual(productRouteParts('/ar/screen-protectors/?a=1#b'), { path: '/screen-protectors', locale: 'ar', suffix: '?a=1#b' });
});

test('buyer briefs retain destination and buyer-specific requirements without adding prices, freight or capabilities', () => {
  for (const guide of buyerGuides) for (const locale of ['en','es','ar']) {
    const page = buyerLocales[locale].guides[guide.id];
    const input = { name: 'A Buyer', email: 'buyer@example.com', country: 'Singapore', company: 'Test Co', notes: 'Sample before approval',
      ...Object.fromEntries(page.fields.map(field => [field.key, `Requested ${field.key}: 1200`])), unexpected: 'SECRET' };
    assert.deepEqual(validateBuyerBrief(page, input), {});
    const payload = buildBuyerPayload(guide, locale, input);
    assert.deepEqual(Object.keys(payload).sort(), ['email','message','name','subject']);
    assert.ok(payload.message.includes('Singapore')); assert.ok(payload.message.includes('1200'));
    assert.ok(!payload.message.includes('SECRET')); assert.ok(!payload.message.includes('Istanbul'));
    assert.ok(validateBuyerBrief(page, { ...input, country: '' }).country);
    assert.ok(validateBuyerBrief(page, { ...input, email: 'not an email' }).email);
    assert.ok(validateBuyerBrief(page, { ...input, [page.fields[0].key]: '' })[page.fields[0].key]);
  }
});

test('local buyer enquiries never call the network; analytics contain only bounded classifications', async () => {
  let calls = 0;
  const payload = buildBuyerPayload(buyerGuides[0], 'es', { name: 'Buyer', email: 'buyer@example.com', country: 'México', range: '10 fryers' });
  const result = await submitInquiry(payload, { hostname: '127.0.0.1', fetchImpl: () => { calls++; throw Error('Must not send'); } });
  assert.equal(calls, 0); assert.equal(result.mode, 'preview');
  assert.equal(buyerJourneyAnalytics('private-label','ar','submit_success').event, 'generate_lead');
  assert.equal(buyerJourneyAnalytics('private-label','ar','buyer@example.com'), null);
  assert.equal(buyerJourneyAnalytics('unknown','ar','submit_success'), null);
  assert.equal(buyerJourneyAnalytics('private-label','constructor','submit_success'), null);
});
