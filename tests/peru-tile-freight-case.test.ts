import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import {
  PERU_TILE_CASE_COPY,
  PERU_TILE_CASE_IMAGE,
} from '../src/components/PeruTileFreightCase.tsx';

const locales = ['en', 'zh', 'ru', 'fr', 'es', 'ar'] as const;

test('Peru tile case has complete localized decision content', () => {
  for (const locale of locales) {
    const content = PERU_TILE_CASE_COPY[locale];
    assert.ok(content.title.length > 12, `${locale} needs a specific case title`);
    assert.equal(content.gates.length, 3, `${locale} needs three pre-loading gates`);
    assert.equal(content.checklist.length, 4, `${locale} needs four quote inputs`);
    assert.ok(content.wmBody.length > 24, `${locale} needs a chargeable-weight explanation`);
    assert.ok(content.evidenceCaption.length > 24, `${locale} needs an evidence limitation`);
  }

  const visibleCopy = JSON.stringify(PERU_TILE_CASE_COPY);
  assert.doesNotMatch(visibleCopy, /[–—]/, 'case copy should not use en or em dashes');
  assert.doesNotMatch(visibleCopy, /FORM R/i, 'the case must use the current FTA origin-proof wording');
  assert.doesNotMatch(visibleCopy, /personal cannot clear|个人无法清关/i, 'the case must preserve SUNAT occasional-import exceptions');
});

test('Peru tile case image exists and the module is limited to the Peru route', () => {
  assert.ok(
    existsSync(new URL(`../public${PERU_TILE_CASE_IMAGE}`, import.meta.url)),
    `missing case image ${PERU_TILE_CASE_IMAGE}`,
  );

  const page = readFileSync(new URL('../src/pages/shipping-from-china-to-latin-america.tsx', import.meta.url), 'utf8');
  assert.match(page, /selectedCountry === 'peru'/);
  assert.match(page, /<PeruTileFreightCase locale=\{activeLang\} onQuote=\{scrollToQuote\} \/>/);
});
