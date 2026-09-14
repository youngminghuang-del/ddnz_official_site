import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { kitchenJourney, kitchenReading, kitchenFaq, kitchenStructuredData } from '../src/features/commercial-kitchen/data/discovery.mjs';
import { renderKitchenStaticContent } from '../scripts/kitchen-static-content.mjs';
import products from '../src/features/commercial-kitchen/data/products.mjs';
import launch from '../src/features/commercial-kitchen/data/launch.mjs';

test('discovery links remain in the crawlable HTML and every journey has a target', () => {
  const html = renderKitchenStaticContent(products, launch);
  for (const item of kitchenJourney) {
    assert.ok(html.includes(`href="${item.href}"`));
    assert.ok(html.includes(`id="${item.href.slice(1)}"`));
  }
  for (const item of kitchenReading) assert.ok(html.includes(`/blog/${item.slug}/`));
  for (const item of kitchenFaq) assert.ok(html.includes(item.question));
});

test('recommended guides refer to real published English articles', () => {
  const posts = JSON.parse(fs.readFileSync(new URL('../src/data/notionBlogData.json', import.meta.url)));
  for (const item of kitchenReading) assert.ok(posts.some(post => post.slug === item.slug && post.language === 'en' && post.status === 'Published'), item.slug);
});

test('collection schema agrees with the visible breadcrumb and does not invent product offers or ratings', () => {
  const schema = kitchenStructuredData(launch);
  const collection = schema['@graph'].find(node => node['@type'] === 'CollectionPage');
  const breadcrumb = schema['@graph'].find(node => node['@type'] === 'BreadcrumbList');
  assert.equal(collection.inLanguage, 'en');
  assert.equal(collection.url, breadcrumb.itemListElement[2].item);
  assert.deepEqual(breadcrumb.itemListElement.map(item => item.name), ['Home','Products','Commercial kitchen equipment']);
  assert.doesNotMatch(JSON.stringify(schema), /"(?:Offer|AggregateRating|Review|FAQPage)"/);
});
