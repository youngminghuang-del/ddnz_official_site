import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { homeSourcingLabel } from '../src/data/homeSourcingLabel.mjs';
import { localePrefix, localeCode } from '../src/features/site-localization/locale.mjs';
import { translatedText } from '../src/features/site-localization/translate.mjs';

test('homepage label preserves reviewed text in every language', () => {
  for (const locale of ['en','zh','ru','fr','es','ar','pt','tr']) {
    assert.equal(homeSourcingLabel[locale], translatedText('SOURCING + INTERNATIONAL FREIGHT', locale));
  }
});
test('lightweight URL helpers preserve language routes including Chinese aliases', () => {
  for (const [locale, prefix] of [['en',''],['zh','/zh-cn'],['zh-cn','/zh-cn'],['ar','/ar'],['ru','/ru'],['es','/es'],['fr','/fr'],['pt','/pt'],['tr','/tr']]) {
    assert.equal(localePrefix(locale), prefix);
  }
  assert.equal(localeCode('zh-cn'), 'zh');
});
test('homepage label and URL helpers stay independent of full dictionaries', () => {
  for (const path of ['../src/data/homeSourcingLabel.mjs','../src/features/site-localization/locale.mjs']) {
    const source = fs.readFileSync(new URL(path, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /\bimport\b|\bfrom\s+['"]/);
  }
  const hero = fs.readFileSync(new URL('../src/components/SourcingHomepageHero.tsx',import.meta.url),'utf8');
  assert.doesNotMatch(hero, /site-localization\/translate/);
});

test('compact product discovery preserves every existing non-Chinese translation', async () => {
  const { mobileDiscoveryCopy } = await import('../src/data/mobileDiscoveryCopy.mjs');
  const { ui, pages } = await import('../src/features/mobile-sourcing/locales.mjs');
  const { copyFor } = await import('../src/features/mobile-sourcing/catalog.mjs');
  for (const locale of ['en','ru','fr','es','ar','pt','tr']) {
    assert.deepEqual(mobileDiscoveryCopy[locale], {name:copyFor(ui.hub,locale),description:copyFor(pages.cases.intro,locale),cases:copyFor(ui.cases,locale),straps:copyFor(ui.straps,locale)});
  }
  assert.equal(mobileDiscoveryCopy.zh.name, '手机配件');
  assert.match(mobileDiscoveryCopy.zh.description, /确认样品/);
  const source = fs.readFileSync(new URL('../src/components/ProductDiscoveryLinks.tsx',import.meta.url),'utf8');
  assert.doesNotMatch(source, /mobile-sourcing\/(?:catalog|locales)/);
});
