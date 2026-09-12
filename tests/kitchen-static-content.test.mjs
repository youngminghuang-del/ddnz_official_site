import test from 'node:test';
import assert from 'node:assert/strict';
import products from '../src/features/commercial-kitchen/data/products.mjs';
import launch from '../src/features/commercial-kitchen/data/launch.mjs';
import { renderKitchenStaticContent } from '../scripts/kitchen-static-content.mjs';

test('static kitchen HTML retains all eight indicative quotes, reference quantities and valid media', () => {
  const html = renderKitchenStaticContent(products, launch);
  assert.equal((html.match(/<article>/g) || []).length, 8);
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  for (const id of launch.featuredProductIds) {
    const p = products.find(p => p.id === id);
    assert.ok(html.includes(`CNY ${p.quote.price.toFixed(2)}`));
    assert.ok(html.includes(`Reference order quantity: ${p.quote.minUnits} units.`));
    assert.ok(html.includes(p.image));
  }
  assert.match(html, /Freight and taxes are extra/);
  assert.match(html, /UAE, Singapore and Mexico/);
  assert.doesNotMatch(html, /\.xlsx|row \d+|alibaba\.com|CONTENT PREVIEW|1\/5|1\/6/);
});

test('static generation fails if a featured product loses its price, rather than publishing stale data', () => {
  assert.throws(() => renderKitchenStaticContent(products.map(p => p.id === launch.featuredProductIds[0] ? {...p, quote:null} : p),launch), /Featured kitchen price missing/);
});
