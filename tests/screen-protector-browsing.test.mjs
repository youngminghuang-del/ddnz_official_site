import test from 'node:test';
import assert from 'node:assert/strict';
import { isPlainAnchorClick } from '../src/features/screen-protectors/browsing.mjs';
import { applyScreenProtectorSEO, removeScreenProtectorSchema, SITE_ORIGIN } from '../src/features/screen-protectors/seo.mjs';
import { ROUTES } from '../src/features/screen-protectors/routes.mjs';

test('SPA interception preserves modifier keys, new tabs, named targets and downloads', () => {
  const event = { button: 0, defaultPrevented: false };
  const anchor = { target: '', hasAttribute: () => false };
  assert.equal(isPlainAnchorClick(event, anchor), true);
  assert.equal(isPlainAnchorClick(event, { ...anchor, target: '_self' }), true);
  for (const modifier of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey', 'defaultPrevented']) {
    assert.equal(isPlainAnchorClick({ ...event, [modifier]: true }, anchor), false, modifier);
  }
  for (const button of [1, 2]) assert.equal(isPlainAnchorClick({ ...event, button }, anchor), false);
  for (const target of ['_blank', '_parent', '_top', 'sourcing-window']) {
    assert.equal(isPlainAnchorClick(event, { ...anchor, target }), false, target);
  }
  assert.equal(isPlainAnchorClick(event, { ...anchor, hasAttribute: name => name === 'download' }), false);
  assert.equal(isPlainAnchorClick(event, null), false);
});

// Minimal head implementation exercises SEO mutations without requiring a browser dependency.
function documentHead() {
  const nodes = [];
  const document = {
    title: '',
    documentElement: Object.freeze({ lang: 'ar', dir: 'rtl' }),
    createElement(tag) {
      return {
        tag, attributes: {},
        setAttribute(name, value) { this.attributes[name] = value; },
        remove() { const index = nodes.indexOf(this); if (index >= 0) nodes.splice(index, 1); },
      };
    },
    head: {
      appendChild(node) { nodes.push(node); },
      querySelectorAll(selector) {
        return nodes.filter(node => selector.split(', ').some(part => {
          if (part === 'script[data-screen-protector-schema]') return node.tag === 'script' && Object.hasOwn(node.attributes, 'data-screen-protector-schema');
          if (part.startsWith('#')) return node.id === part.slice(1);
          if (part === 'link[rel="alternate"][hreflang]') return node.tag === 'link' && node.rel === 'alternate' && node.hreflang;
          const match = part.match(/^(meta|link)\[([\w-]+)="([^"]+)"\]$/);
          return match && node.tag === match[1] && (node.attributes[match[2]] ?? node[match[2]]) === match[3];
        }));
      },
    },
  };
  return { document, nodes };
}

test('SPA metadata preserves the global language and replaces canonical and breadcrumb per route', () => {
  const { document, nodes } = documentHead();
  const fakeAlternate = document.createElement('link');
  Object.assign(fakeAlternate, { rel: 'alternate', hreflang: 'fr', href: '/fr/screen-protectors/' });
  document.head.appendChild(fakeAlternate);
  for (const id of ['schema-jsonld-static-page', 'schema-jsonld-static-home', 'schema-jsonld-static-blog']) {
    const stale = document.createElement('script');
    Object.assign(stale, { id, textContent: '{"@type":"FAQPage"}' });
    document.head.appendChild(stale);
  }
  for (const [page, route] of Object.entries(ROUTES)) {
    applyScreenProtectorSEO(document, route, { preview: true, breadcrumbs: { homeHref: '/ar/', homeLabel: 'الرئيسية', homeLanguage: 'ar' } });
    assert.deepEqual(document.documentElement, { lang: 'ar', dir: 'rtl' });
    assert.equal(nodes.filter(node => node.rel === 'canonical').length, 1);
    assert.equal(nodes.find(node => node.rel === 'canonical').href, SITE_ORIGIN + route + '/');
    const alternates = nodes.filter(node => node.rel === 'alternate');
    assert.equal(alternates.length, page === 'quote' ? 0 : 9);
    if (page !== 'quote') assert.equal(alternates.find(node => node.hreflang === 'fr').href, SITE_ORIGIN + '/fr' + route + '/');
    assert.equal(nodes.filter(node => node.attributes.name === 'description').length, 1);
    assert.match(nodes.find(node => node.attributes.name === 'robots').content, /noindex/);
    const schemas = nodes.filter(node => node.tag === 'script');
    assert.equal(schemas.length, page === 'quote' ? 0 : 1);
    if (schemas.length) {
      const items = JSON.parse(schemas[0].textContent).itemListElement;
      assert.equal(items.at(-1).item, SITE_ORIGIN + route + '/');
      assert.equal(items[0].item, SITE_ORIGIN + '/ar/');
      assert.equal(items[0].name, 'الرئيسية');
    }
  }
  applyScreenProtectorSEO(document, ROUTES.home, { preview: false });
  removeScreenProtectorSchema(document);
  assert.equal(nodes.filter(node => node.tag === 'script').length, 0);
});
