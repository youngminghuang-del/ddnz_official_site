import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import OriginDestinationOpportunities from '../src/features/freight/OriginDestinationOpportunities';

const contexts = ['middle-east', 'west-africa', 'latin-america', 'central-asia', 'nigeria'] as const;

test('each freight context has three distinct crawlable origin plans in authored languages', () => {
  for (const context of contexts) {
    for (const locale of ['en', 'zh', 'es', 'ar', 'ru', 'fr', 'pt', 'tr'] as const) {
      const html = renderToStaticMarkup(createElement(OriginDestinationOpportunities, { context, locale }));
      assert.equal((html.match(/<article>/g) || []).length, 3, `${context} ${locale}`);
      assert.equal((html.match(/<h3>/g) || []).length, 3, `${context} ${locale}`);
      assert.match(html, /freight-origin-opportunities-note/);
    }
  }
});

test('origin plans retain their own destination and do not claim an unrelated shipment', () => {
  const peru = renderToStaticMarkup(createElement(OriginDestinationOpportunities, { context: 'latin-america', locale: 'en' }));
  const centralAsia = renderToStaticMarkup(createElement(OriginDestinationOpportunities, { context: 'central-asia', locale: 'en' }));
  assert.match(peru, /Foshan → Peru/);
  assert.match(peru, /shipping-from-china-to-peru/);
  assert.doesNotMatch(peru, /Yongkang → Uzbekistan/);
  assert.match(centralAsia, /Yongkang → Uzbekistan/);
  assert.doesNotMatch(centralAsia, /Foshan → Peru/);
});
