import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { tsImport } from 'tsx/esm/api';
import { outdoorCategoryFromSearch, outdoorCategorySearch, outdoorCategoryHref, outdoorNavigationCurrent } from '../src/features/outdoor-sourcing/navigation.mjs';
import { outdoorProducts } from '../src/features/outdoor-sourcing/catalog.mjs';
const { outdoorCategoryNavigation } = await tsImport('../src/config/outdoorCategoryNavigation.ts', import.meta.url);
const { navigationPath } = await tsImport('../src/lib/productLanguageRouting.ts', import.meta.url);
const { default: Content } = await tsImport('../src/features/outdoor-sourcing/OutdoorContent.jsx', import.meta.url);

test('category URLs preserve attribution, validate unknown values and reset to all', () => {
  for (const category of ['power', 'solar', 'cold']) {
    const url = new URL(outdoorCategoryHref(category), 'https://www.ddnzglobal.com');
    assert.equal(outdoorCategoryFromSearch(url.search), category);
    assert.equal(url.hash, '#outdoor-range');
  }
  for (const search of ['', '?category=bad', '?category=ALL']) assert.equal(outdoorCategoryFromSearch(search), 'all');
  assert.equal(outdoorCategorySearch('?utm_source=partner&category=solar', 'cold'), '?utm_source=partner&category=cold');
  assert.equal(outdoorCategorySearch('?utm_source=partner&category=solar', 'all'), '?utm_source=partner');
  assert.equal(outdoorCategorySearch('?category=solar', 'all'), '');
});
test('every navigation language reaches authored category content and the standalone guide', () => {
  for (const language of ['en', 'es', 'ar', 'zh', 'fr', 'ru', 'pt', 'tr']) {
    const items = outdoorCategoryNavigation(language);
    assert.equal(items.length, 4);
    assert.equal(new Set(items.map(item => item.label)).size, 4);
    for (const [i, item] of items.entries()) {
      const destination = new URL(navigationPath(item.to, language), 'https://www.ddnzglobal.com');
      assert.ok(destination.pathname.startsWith(['es', 'ar'].includes(language) ? `/${language}/` : '/'));
      assert.equal(outdoorNavigationCurrent(destination.pathname, destination.search, destination.pathname + destination.search), true);
      if (i < 3) {
        assert.equal(outdoorCategoryFromSearch(destination.search), ['power', 'solar', 'cold'][i]);
        assert.equal(destination.hash, '#outdoor-range');
        assert.equal(outdoorNavigationCurrent(destination.pathname, '?category=other', destination.pathname + destination.search), false);
      } else assert.ok(destination.pathname.endsWith('/portable-power/selection-guide/'));
    }
  }
});
test('filtered product views expose only the chosen family without removing purchasing tools', () => {
  for (const category of ['all', 'power', 'solar', 'cold']) {
    const html = renderToStaticMarkup(React.createElement(Content, { category, onCategoryChange: () => {} }));
    const displayed = [...html.matchAll(/<article id="product-([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(displayed, outdoorProducts.filter(p => category === 'all' || p.category === category).map(p => p.id));
    assert.ok(html.includes('id="buying-brief"'));
    assert.ok(html.includes('id="supply-prices"'));
  }
});
