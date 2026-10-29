import test from 'node:test';
import assert from 'node:assert/strict';
import { comparisonGroups, renderPriceComparison, renderComparisonActions } from '../src/features/screen-protectors/price-comparison.mjs';
import { screenProtectorSchema, renderScreenProtectorBody, screenProtectorMetadata } from '../src/features/screen-protectors/seo.mjs';

test('comparison retains independent price tiers, historical basis and real detail targets', () => {
  const groups = comparisonGroups();
  assert.equal(groups.length, 7);
  assert.match(groups[0].prices, /3.75.*300–2,999.*3.50.*3,000\+/s);
  assert.match(groups[1].prices, /3.45.*3.20/s);
  assert.match(groups[2].minimum, /5,000/);
  const og = groups.find(r => r.anchor === 'film-product-og28');
  assert.match(og.minimum, /100 pieces per phone model; 1,000 pieces total/);
  assert.match(og.code, /2026-09-11/);
  const staticBody = renderScreenProtectorBody('products');
  for (const group of groups) assert.ok(staticBody.includes(`id="${group.anchor}"`));
  assert.ok(staticBody.indexOf('id="price-comparison"') < staticBody.indexOf('id="bear-glass"'));
  assert.ok(staticBody.includes(renderPriceComparison()));
});
test('collection graph uses one real breadcrumb and all visible groups without invented offers', () => {
  const graph = screenProtectorSchema('products')['@graph'];
  assert.equal(graph.filter(x=>x['@type']==='BreadcrumbList').length,1);
  const list=graph.find(x=>x['@type']==='ItemList');
  assert.equal(list.numberOfItems,7);
  assert.deepEqual(list.itemListElement.map(x=>x.url.split('#')[1]),comparisonGroups().map(x=>x.anchor));
  assert.ok(!JSON.stringify(graph).match(/AggregateOffer|"offers"|AggregateRating|InStock/));
  assert.equal(screenProtectorSchema('home')['@type'],'BreadcrumbList');
  assert.match(screenProtectorMetadata('/screen-protectors/compare/').title,/Prices & MOQ from China/);
});

test('request CTA retains the existing private brief route', () => {
  assert.match(renderComparisonActions(), /href="\/screen-protectors\/brief\/"/);
});
