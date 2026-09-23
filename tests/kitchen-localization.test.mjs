import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import LocalizedKitchenContent, { IsolatedText } from '../src/features/commercial-kitchen/LocalizedKitchenContent.jsx';
import LocalizedKitchenMargin from '../src/features/commercial-kitchen/components/LocalizedKitchenMargin.jsx';
import catalog from '../src/features/commercial-kitchen/data/products.mjs';
import launch from '../src/features/commercial-kitchen/data/launch.mjs';
import references from '../src/features/commercial-kitchen/data/benchmarks.mjs';
import { categoryProducts, kitchenCategories } from '../src/features/commercial-kitchen/data/categories.mjs';
import {
  addKitchenSelection, buildLocalizedKitchenInquiry, cleanKitchenSelection, filterKitchenProducts,
  getLocalizedKitchenAssortments, getLocalizedKitchenBenchmarks, getLocalizedKitchenMetadata,
  getLocalizedKitchenProducts, kitchenCopy, kitchenReferenceStatus, localMoney, localSpecValue,
  parseKitchenQuantity, parseKitchenMoney, calculateLocalizedKitchenMargin, toggleKitchenComparison, validateLocalizedKitchenInquiry,
} from '../src/features/commercial-kitchen/data/localization.mjs';
import { kitchenExplorationAnalytics, kitchenInquiryAnalytics } from '../src/features/commercial-kitchen/site-analytics.mjs';
import { buildDraftLinks, createInquirySubmitter, FORMSPREE_ENDPOINT, submitInquiry } from '../src/features/commercial-kitchen/data/inquiry.mjs';

const render = props => renderToStaticMarkup(React.createElement(LocalizedKitchenContent, props));
const textOnly = html => html.replace(/<[^>]+>/g, '').replaceAll('&amp;', '&');
const allSelected = Object.fromEntries(catalog.map(product => [product.id, product.quote?.minUnits || 2]));

for (const locale of ['es', 'ar']) {
  test(`${locale}: all 26 records, eight exact CNY prices and per-model quantity tiers survive localization`, () => {
    const products = getLocalizedKitchenProducts(locale);
    assert.equal(products.length, 26);
    assert.deepEqual(new Set(products.map(product => product.id)), new Set(catalog.map(product => product.id)));
    assert.deepEqual(products.slice(0, 8).map(product => product.id), launch.featuredProductIds);
    assert.equal(products.filter(product => product.quote).length, 8);
    for (const source of catalog) {
      const product = products.find(item => item.id === source.id);
      assert.equal(product.model, source.model);
      assert.deepEqual(product.quote, source.quote);
      assert.deepEqual(product.specs, source.specs);
      assert.equal(product.dimensions, localSpecValue(source.dimensions, locale));
      for (const field of ['name', 'note', 'categoryLabel', 'metric', 'detail', 'dimensions']) assert.ok(product[field], `${source.id} lacks ${field}`);
      assert.ok(product.localizedSpecs.every(spec => spec.label && spec.value));
      if (source.quote) assert.equal(source.quote.currency, 'CNY');
      if (source.quote?.configurationNote) assert.ok(product.configurationNote);
    }
    for (const branded of kitchenCategories.flatMap(categoryProducts)) {
      const product = products.find(item => item.id === branded.id);
      assert.equal(product.image, branded.image);
      assert.equal(product.imageSmall, branded.imageSmall);
      assert.ok(fs.existsSync(new URL(`../public${product.image}`, import.meta.url)));
    }
  });

  test(`${locale}: initial SSR contains the full localized catalogue, specifications, references and quotation UI`, () => {
    const html = render({ locale }), text = textOnly(html), t = kitchenCopy(locale);
    assert.equal((html.match(/data-product-id=/g) || []).length, 26);
    assert.equal((html.match(/data-reference-cny=/g) || []).length, 8);
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.match(html, new RegExp(`lang="${locale}" dir="${t.dir}"`));
    assert.ok(text.includes(t.ui.heading));
    assert.ok(text.includes(t.ui.emptyList));
    assert.ok(text.includes(t.ui.productionHelp));
    assert.ok(!text.includes(t.ui.previewHelp));
    assert.ok(!text.includes(t.ui.simulate));
    assert.ok(text.includes(t.ui.electricity));
    assert.ok(text.includes(t.ui.priceScope));
    for (const country of Object.values(t.countries)) assert.ok(text.includes(country));
    for (const source of references) {
      assert.ok(html.includes(source.url));
      assert.ok(text.includes(source.date));
    }
    for (const source of catalog) {
      assert.ok(html.includes(`id="model-${source.id}"`));
      if (source.quote) {
        assert.ok(html.includes(`data-reference-cny="${source.quote.price}" data-reference-units="${source.quote.minUnits}"`));
        assert.ok(text.includes(localMoney(source.quote.price, 'CNY', locale)));
      }
    }
    assert.doesNotMatch(text, /Daily output|Rated power|Add to list|Confirm with quotation|No valid models|Enter your name|Compare up to|variant|undefined|Tap or bottled|Forced air/);
    assert.doesNotMatch(html, /https:\/\/formspree/); // Rendering does not send or preload the endpoint.
    assert.doesNotMatch(html, /href="\/get-a-quote/);
  });

  test(`${locale}: metadata has self canonical, reciprocal eight-language alternates and all model anchors`, () => {
    const meta = getLocalizedKitchenMetadata(locale);
    assert.equal(meta.canonicalPath, `/${locale}/sourcing/commercial-kitchen-equipment-from-china/`);
    assert.equal(meta.canonicalUrl, `https://www.ddnzglobal.com${meta.canonicalPath}`);
    assert.equal(meta.contentLanguage, locale);
    assert.deepEqual(meta.alternateUrls.map(item => item.hrefLang), ['en','zh-cn','es','ar','ru','fr','pt','tr']);
    assert.ok(meta.alternateUrls.some(item => item.hrefLang === locale && item.href === meta.canonicalUrl));
    const page = meta.structuredData['@graph'][0];
    assert.equal(page.mainEntity.itemListElement.length, 26);
    assert.ok(page.mainEntity.itemListElement.every(item => item.url.startsWith(`${meta.canonicalUrl}#model-`)));
    assert.doesNotMatch(JSON.stringify(meta.structuredData), /"Offer"|priceCurrency|availability/);
  });

  test(`${locale}: market facts and editable assortment quantities retain their source basis`, () => {
    for (const reference of getLocalizedKitchenBenchmarks(locale)) {
      const original = references.find(item => item.id === reference.id);
      for (const field of ['id', 'productId', 'price', 'currency', 'date', 'url', 'country']) assert.equal(reference[field], original[field]);
      for (const field of ['name', 'spec', 'match', 'difference', 'context', 'capture']) assert.ok(reference[field]);
    }
    getLocalizedKitchenAssortments(locale).forEach((assortment, index) => {
      assert.deepEqual(assortment.items, launch.assortments[index].items);
      assert.deepEqual(assortment.selection, Object.fromEntries(assortment.items.map(item => [item.productId, item.defaultQty])));
    });
  });

  test(`${locale}: selection and all quantity tiers carry into a translated inquiry and both draft links`, () => {
    const form = { country: 'Mexico', port: 'Veracruz', type: 'distributor', company: 'Sample company', contact: '+52 000', notes: 'Buyer requirement <script> is text.' };
    const payload = buildLocalizedKitchenInquiry(locale, { list: allSelected, form, name: '  Test\n Buyer  ', email: ' buyer@example.test ' });
    const t = kitchenCopy(locale);
    assert.equal(payload.name, 'Test Buyer');
    assert.equal(payload.email, 'buyer@example.test');
    assert.ok(payload.message.includes(t.countries.Mexico));
    assert.ok(payload.message.includes('Veracruz'));
    assert.ok(payload.message.includes(form.notes));
    for (const product of getLocalizedKitchenProducts(locale)) assert.ok(payload.message.includes(product.displayModel));
    for (const product of catalog.filter(item => item.quote)) assert.ok(payload.message.includes(localMoney(product.quote.price, 'CNY', locale)));
    assert.doesNotMatch(payload.message, /Indicative reference:|Buyer type:|Requested models:|To confirm|subject to quotation|No valid models selected|variant/);
    const links = buildDraftLinks(payload);
    assert.equal(new URL(links.whatsapp).searchParams.get('text'), payload.message);
    assert.equal(new URL(links.email).searchParams.get('body'), payload.message);
    assert.equal(new URL(links.email).searchParams.get('subject'), payload.subject);
    const seeded = render({ locale, initialList: allSelected, initialCompared: ['ZH-101V', 'ZH-102V'], initialForm: form });
    assert.equal((seeded.match(/data-selected-id=/g) || []).length, 26);
    assert.match(seeded, /<table class="compare-table">/);
    assert.doesNotMatch(seeded, /<script>/);
  });

  test(`${locale}: below-tier request never quotes the ten-unit reference as its unit price`, () => {
    const product = catalog.find(item => item.id === 'ZH-101V');
    assert.equal(kitchenReferenceStatus(product, 9), 'below');
    assert.equal(kitchenReferenceStatus(product, 10), 'reference');
    const payload = buildLocalizedKitchenInquiry(locale, { list: { 'ZH-101V': 9 }, form: { country: 'Singapore' } });
    assert.ok(payload.message.includes(kitchenCopy(locale).inquiry.below));
    assert.ok(!payload.message.includes(localMoney(348.8, 'CNY', locale)));
    assert.equal(kitchenReferenceStatus(catalog.find(item => item.id === 'CK-136'), 10), 'pending');
  });

  test(`${locale}: contact, destination and empty-list validation uses localized errors`, () => {
    const invalid = validateLocalizedKitchenInquiry(locale, { name: ' ', email: 'invalid', list: { 'ice-49': '0' }, form: { country: ' ' } });
    const t = kitchenCopy(locale).ui;
    assert.deepEqual(invalid, { name: t.nameError, email: t.emailError, list: t.listError, country: t.countryError });
    assert.deepEqual(validateLocalizedKitchenInquiry(locale, { name: 'Buyer', email: 'buyer@example.test', list: { 'ice-49': '٢' }, form: { country: 'Mexico' } }), {});
  });
}

test('Spanish and Arabic searches match translated names, accent-insensitive categories, model IDs and either numeral script', () => {
  assert.equal(filterKitchenProducts(getLocalizedKitchenProducts('es'), { search: 'freidora' }).length, 2);
  assert.equal(filterKitchenProducts(getLocalizedKitchenProducts('es'), { search: 'refrigeracion', category: 'Cold storage' }).length, 4);
  assert.equal(filterKitchenProducts(getLocalizedKitchenProducts('ar'), { search: 'ثَلْج' }).length, 6);
  assert.equal(filterKitchenProducts(getLocalizedKitchenProducts('ar'), { search: '55', category: 'Ice making' })[0].id, 'ice-49');
  assert.equal(filterKitchenProducts(getLocalizedKitchenProducts('ar'), { search: '٥٥', category: 'Ice making' })[0].id, 'ice-49');
  assert.equal(filterKitchenProducts(getLocalizedKitchenProducts('es'), { search: 'zh-101v' })[0].id, 'ZH-101V');
  assert.deepEqual(filterKitchenProducts(getLocalizedKitchenProducts('ar'), { search: 'missing-equipment' }), []);
  assert.equal(filterKitchenProducts(getLocalizedKitchenProducts('ar'), { category: 'Display cooling' }).length, 3);
});

test('quantities accept Western, Arabic and Persian integer input; reject blank, fractional, grouped and out-of-range values', () => {
  for (const [input, expected] of [['1', 1], [' 12 ', 12], ['٩٩٩٩', 9999], ['۲۴', 24], [10, 10]]) assert.equal(parseKitchenQuantity(input), expected);
  for (const input of ['', null, 0, -1, 1.5, '1e3', '1,000', '١٫٥', '1.000', 'Infinity', true, '10000', 'NaN']) assert.equal(parseKitchenQuantity(input), null, String(input));
  const input = { 'ice-49': '٣', 'ZH-101V': 10, 'cold-2': 2.5, unknown: 5 };
  assert.deepEqual(cleanKitchenSelection(input), { 'ice-49': 3, 'ZH-101V': 10 });
  assert.equal(input['ice-49'], '٣');
  assert.deepEqual(cleanKitchenSelection(Object.create({ 'ice-49': 4 })), {});
  assert.deepEqual(addKitchenSelection({ 'ice-49': 9998 }, { 'ice-49': 5, 'ZH-101V': 10 }), { 'ice-49': 9999, 'ZH-101V': 10 });
});

test('comparison enforces three valid unique models and permits removal before another addition', () => {
  const initial = ['ice-49', 'ZH-101V', 'cold-2'];
  assert.deepEqual(toggleKitchenComparison(initial, 'cold-7'), { ids: initial, limited: true });
  const removed = toggleKitchenComparison(initial, 'ZH-101V');
  assert.deepEqual(toggleKitchenComparison(removed.ids, 'cold-7'), { ids: ['ice-49', 'cold-2', 'cold-7'], limited: false });
  assert.deepEqual(toggleKitchenComparison(['unknown', 'ice-49', 'ice-49'], 'bad'), { ids: ['ice-49'], limited: false });
});

test('Arabic bidi isolates complete model codes, negative temperatures and numeric measurements', () => {
  const html = renderToStaticMarkup(React.createElement(IsolatedText, null, 'HZB-50/AB · -١٨°C إلى -٢٢°C · ٥٥ kg / ٢٤h'));
  assert.ok(html.includes('<bdi dir="ltr">HZB-50/AB</bdi>'));
  assert.ok(html.includes('<bdi dir="ltr">-١٨°C</bdi>'));
  assert.ok(html.includes('<bdi dir="ltr">-٢٢°C</bdi>'));
  assert.ok(html.includes('<bdi dir="ltr">٥٥ kg / ٢٤h</bdi>'));
});

test('localized inquiry uses the existing endpoint only through a mocked production transport; preview stays offline', async () => {
  const payload = buildLocalizedKitchenInquiry('ar', { list: { 'ZH-101V': 10 }, form: { country: 'United Arab Emirates' }, name: 'اختبار', email: 'test@example.test' });
  let requests = 0;
  const fetchImpl = async (url, options) => {
    requests++;
    assert.equal(url, FORMSPREE_ENDPOINT);
    assert.equal(options.method, 'POST');
    assert.equal(options.body.get('message'), payload.message);
    assert.equal(options.body.get('email'), payload.email);
    return { ok: true, json: async () => ({ ok: true }) };
  };
  assert.deepEqual(await submitInquiry(payload, { hostname: 'localhost', fetchImpl }), { mode: 'preview', networked: false });
  assert.equal(requests, 0);
  assert.deepEqual(await submitInquiry(payload, { hostname: 'www.ddnzglobal.com', fetchImpl }), { mode: 'production', networked: true });
  assert.equal(requests, 1);
  await assert.rejects(submitInquiry(payload, { hostname: 'www.ddnzglobal.com', fetchImpl: async () => ({ ok: false, json: async () => ({}) }) }));
  let finish;
  const submitter = createInquirySubmitter(() => new Promise(resolve => { finish = resolve; }));
  const first = submitter.submit(payload);
  assert.equal(submitter.pending, true);
  assert.deepEqual(await submitter.submit(payload), { mode: 'blocked', networked: false });
  finish({ mode: 'preview', networked: false });
  await first;
  assert.equal(submitter.pending, false);
});

test('seven localized kitchen languages are supported; English uses its existing view', () => {
  assert.throws(() => kitchenCopy('en'), RangeError);
  assert.throws(() => render({ locale: 'de' }), RangeError);
});

for (const locale of ['es', 'ar']) {
  test(`${locale}: margin uses all eight original references, explicit CNY, blank buyer inputs and no example`, () => {
    const html = renderToStaticMarkup(React.createElement(LocalizedKitchenMargin, { locale }));
    assert.equal((html.match(/<option /g) || []).length, 8);
    assert.ok(textOnly(html).includes(kitchenCopy(locale).margin.empty));
    assert.match(html, /id="kitchen-margin-selling"[^>]*value=""/);
    assert.match(html, /id="kitchen-margin-landed"[^>]*value=""/);
    assert.doesNotMatch(html, /USD|EUR|AED|margin-track|WORKED EXAMPLE/);
    for (const product of catalog.filter(item => item.quote)) {
      const calculation = calculateLocalizedKitchenMargin(locale, { productId: product.id, units: product.quote.minUnits, selling: '10000', landed: '100' });
      assert.deepEqual(calculation.errors, {});
      assert.equal(calculation.result.purchase, product.quote.price);
      assert.equal(calculation.result.units, product.quote.minUnits);
    }
  });

  test(`${locale}: margin rejects missing inputs and below-tier quantities, including partial decimals`, () => {
    const incomplete = calculateLocalizedKitchenMargin(locale, { productId: 'ZH-101V', units: '9', selling: '', landed: '' });
    assert.equal(incomplete.result, null);
    assert.deepEqual(incomplete.errors, { units: kitchenCopy(locale).margin.below, selling: kitchenCopy(locale).margin.sellingError, landed: kitchenCopy(locale).margin.landedError });
    for (const selling of ['0', '-1', '1.000', '1e4', '1000000000', '9.']) {
      assert.equal(calculateLocalizedKitchenMargin(locale, { productId: 'ZH-101V', units: '10', selling, landed: '0' }).result, null);
    }
    assert.equal(calculateLocalizedKitchenMargin(locale, { productId: 'CK-136', units: '1', selling: '500', landed: '0' }).result, null);
  });

  test(`${locale}: margin computes profit, loss, zero extra costs, per-order totals and cents consistently`, () => {
    const profitable = calculateLocalizedKitchenMargin(locale, { productId: 'ZH-101V', units: '10', selling: locale === 'ar' ? '٥٠٠٫٥٠' : '500,50', landed: locale === 'ar' ? '٥٠٫٢٥' : '50,25' }).result;
    assert.equal(profitable.unitCost, 399.05);
    assert.equal(profitable.unitProfit, 101.45);
    assert.equal(profitable.orderProfit, 1014.5);
    assert.equal(profitable.orderCost, 3990.5);
    assert.equal(profitable.marginPct, 10145 / 50050 * 100);
    const loss = calculateLocalizedKitchenMargin(locale, { productId: 'ZH-101V', units: '10', selling: '300', landed: '50' }).result;
    assert.equal(loss.unitProfit, -98.8);
    assert.equal(loss.orderProfit, -988);
    assert.ok(loss.marginPct < 0);
    assert.equal(calculateLocalizedKitchenMargin(locale, { productId: 'ZH-101V', units: '10', selling: '500', landed: '0' }).result.unitCost, 348.8);
  });
}

test('localized money parsing supports explicit decimal forms without silently interpreting thousands separators', () => {
  assert.equal(parseKitchenMoney('1500,25', 'es'), 1500.25);
  assert.equal(parseKitchenMoney('1500.25', 'es'), 1500.25);
  assert.equal(parseKitchenMoney('١٥٠٠٫٢٥', 'ar'), 1500.25);
  assert.equal(parseKitchenMoney('۱۵۰۰.۲۵', 'ar'), 1500.25);
  assert.equal(parseKitchenMoney('0', 'ar'), 0);
  for (const value of ['1.000', '1,000', '1 000', '', '١٬٠٠٠', '-1', 'Infinity', '1.2.3']) {
    assert.equal(parseKitchenMoney(value, 'es'), null);
    assert.equal(parseKitchenMoney(value, 'ar'), null);
  }
});

test('localized action contract covers comparison and list entry without PII or preview lead events', () => {
  for (const action of ['add_to_list', 'add_assortment', 'compare_models', 'start_brief', 'plan_margin']) {
    assert.equal(kitchenExplorationAnalytics(action).params.exploration_action, action);
  }
  assert.equal(kitchenExplorationAnalytics('buyer@example.test'), null);
  const detail = { action: 'submit_success', mode: 'production', productCount: 1, unitCount: 10, name: 'Private buyer', email: 'buyer@example.test', notes: 'Private requirements' };
  const event = kitchenInquiryAnalytics(detail, { tracking: true });
  assert.equal(event.event, 'generate_lead');
  assert.deepEqual(Object.keys(event.params).sort(), ['form_id', 'inquiry_action', 'product_count', 'unit_count']);
  assert.equal(kitchenInquiryAnalytics({ ...detail, mode: 'preview' }, { tracking: true }), null);
  assert.equal(kitchenInquiryAnalytics(detail, { tracking: false }), null);
  const actions = [];
  render({ locale: 'ar', onAction: (...args) => actions.push(args) });
  assert.deepEqual(actions, []);
});
