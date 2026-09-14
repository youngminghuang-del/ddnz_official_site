import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { kitchenCategories, categoryProducts, kitchenModelHref, requestedKitchenModel, kitchenCategorySchema } from '../src/features/commercial-kitchen/data/categories.mjs';
import { kitchenCategoryPaths } from '../src/features/commercial-kitchen/routes.mjs';
import { kitchenCategoryAnalytics } from '../src/features/commercial-kitchen/site-analytics.mjs';
import { kitchenArticleDiscovery } from '../src/data/kitchenArticleDiscovery.mjs';
import { createPriceDraft } from '../src/features/commercial-kitchen/data/model.mjs';

test('each published category has distinct inventory, matching route and complete short metadata', () => {
  assert.deepEqual(kitchenCategories.map(c => c.path.slice(0, -1)), kitchenCategoryPaths);
  assert.deepEqual(kitchenCategories.map(c => categoryProducts(c).length), [6, 2, 2]);
  for (const c of kitchenCategories) {
    assert.ok(c.title.length <= 65 && c.description.length <= 155);
    const items = categoryProducts(c);
    assert.ok(items.some(p => p.id === c.heroId));
    for (const p of items) assert.ok(fs.existsSync(`public${p.image}`), p.image);
    const schema = kitchenCategorySchema(c);
    assert.doesNotMatch(JSON.stringify(schema), /"Offer"|"aggregateRating"|"Product"/);
    assert.equal(schema['@graph'][0].mainEntity.itemListElement.length, items.length);
  }
});

test('model links preserve identity and initialize the existing order tier; unknown models never acquire a quote', () => {
  const single = requestedKitchenModel(new URL(kitchenModelHref('ZH-101V'), 'https://www.ddnzglobal.com').search);
  assert.equal(single.id, 'ZH-101V');
  const draft = createPriceDraft(single, 'CNY');
  assert.equal(Number(draft.units), 10);
  assert.equal(Number(draft.price), 348.8);
  const unpriced = requestedKitchenModel('?model=ZH-820');
  assert.equal(unpriced.quote, null);
  assert.equal(createPriceDraft(unpriced, 'CNY').price, '');
  for (const query of ['', '?model=unknown', '?model=__proto__', '?model=%3Cscript%3E']) assert.equal(requestedKitchenModel(query), null);
  assert.throws(() => kitchenModelHref('missing'), /Unknown kitchen model/);
});

test('category telemetry rejects arbitrary actions and never includes buyer-entered details', () => {
  assert.equal(kitchenCategoryAnalytics('ice-machines', 'someone@example.com'), null);
  assert.equal(kitchenCategoryAnalytics('phone=12345', 'select_model'), null);
  assert.deepEqual(kitchenCategoryAnalytics('electric-fryers', 'select_model'), {
    event: 'kitchen_category_action', params: { content_group: 'commercial_kitchen', equipment_category: 'electric-fryers', exploration_action: 'select_model' },
  });
});

test('article metadata overrides reference real articles and existing or new category destinations', () => {
  const articles = JSON.parse(fs.readFileSync('src/data/notionBlogData.json', 'utf8'));
  for (const [slug, entry] of Object.entries(kitchenArticleDiscovery)) {
    assert.ok(articles.some(p => p.slug === slug), slug);
    assert.ok(entry.title.length <= 65 && entry.description.length <= 155);
    assert.ok(entry.links.length);
    for (const link of entry.links) assert.match(link.href, /^\/(sourcing\/commercial-|refrigeration-equipment\/)/);
  }
});
