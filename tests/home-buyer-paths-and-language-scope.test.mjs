import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';

const url = name => new URL(`../${name}`, import.meta.url);
const read = name => readFileSync(url(name), 'utf8');

test('homepage leads with the approved import promise and three distinct buyer paths', () => {
  const home = read('src/pages/Home.tsx');
  const hero = read('src/components/SourcingHomepageHero.tsx');
  const bridge = read('src/components/HomeOneTeamBridge.tsx');

  assert.match(home, /<SourcingHomepageHero afterIntro=\{<HomeOneTeamBridge \/>\} \/>/);
  assert.ok(hero.indexOf('{afterIntro}') < hero.indexOf('id="product-categories"'));
  assert.match(hero, /Import from China with one accountable team\./);
  assert.match(hero, /大递诺展负责采购与出口前准备；华正邦泰负责经确认范围内的国际货运执行。/);

  const pathTitles = ['Import from China', 'Consolidate orders in China', 'Ship from China'];
  for (let index = 1; index < pathTitles.length; index += 1) {
    assert.ok(bridge.indexOf(pathTitles[index - 1]) < bridge.indexOf(pathTitles[index]));
  }
  for (const detail of ['Supplier development', 'multiple suppliers', 'dangerous goods', 'DDNZ Global Trade Co., Ltd.', 'Heaven Born International Freight Co., Ltd.']) {
    assert.ok(bridge.includes(detail), detail);
  }
  for (const language of ['en', 'zh', 'ru', 'fr', 'es', 'ar', 'pt', 'tr']) {
    assert.match(bridge, new RegExp(`\\n  ${language}: \\{`));
  }
  assert.match(bridge, /Central Asia/);
});

test('navigation discloses English fallbacks and destination selectors match authored language scope', () => {
  const nav = read('src/components/SourcingHomepageNav.tsx');
  const productLocalization = read('src/lib/productLocalization.mjs');
  const app = read('src/App.tsx');

  assert.match(nav, /discloseFallbackLanguage/);
  assert.match(nav, /`\$\{label\} \(EN\)`/);
  assert.match(productLocalization, /productContentLanguages = Object\.freeze\(\['en', 'es', 'ar'\]\)/);
  assert.match(app, /<EnglishLocaleFallback prefix="\/pt" \/>/);
  assert.match(app, /<EnglishLocaleFallback prefix="\/tr" \/>/);

  for (const page of ['UaeFreightPage.tsx', 'NigeriaFreightPage.tsx', 'MexicoFreightPage.tsx', 'GhanaFreightPage.tsx']) {
    assert.match(read(`src/pages/${page}`), /supportedLanguages=\{\['en', 'zh', 'es'\]\}/, page);
  }
  for (const page of ['FreightRegionPage.tsx', 'shipping-from-china-to-middle-east.tsx', 'shipping-from-china-to-central-asia.tsx', 'shipping-from-china-to-west-africa.tsx', 'shipping-from-china-to-latin-america.tsx']) {
    assert.match(read(`src/pages/${page}`), /supportedLanguages=\{\['en', 'zh', 'ru', 'fr', 'es', 'ar'\]\}/, page);
  }
});

test('supplier scorecard keeps the confirmed source method and removes the unapproved redraw', () => {
  const scorecard = readFileSync(url('public/media/evidence/2026-08-14/supplier-scorecard-criteria-redacted.webp'));
  const digest = createHash('sha256').update(scorecard).digest('hex');
  assert.equal(digest, '903e6c1f044eeb44a12fa20c796df633779e5d40684a1805ae183f7a63574fd4');
  assert.equal(existsSync(url('public/media/evidence/2026-08-14/supplier-scorecard-criteria-zh-business.svg')), false);
  assert.match(read('src/pages/HomeV2Preview.tsx'), /zh: \{ src: '\/media\/evidence\/2026-08-14\/supplier-scorecard-criteria-redacted\.webp'/);
});

test('homepage serves a smaller mobile LCP image and preloads it only through the home build path', () => {
  const hero = read('src/components/SourcingHomepageHero.tsx');
  const generator = read('scripts/generate-static-pages.ts');
  const mobile = statSync(url('public/images/operations/ddnz-team-cutout-20260914-768.webp'));
  const desktop = statSync(url('public/images/operations/ddnz-team-cutout-20260914.webp'));

  assert.ok(mobile.size < desktop.size * 0.5, `${mobile.size} should be less than half of ${desktop.size}`);
  assert.match(hero, /<source media="\(max-width: 760px\)" srcSet="\/images\/operations\/ddnz-team-cutout-20260914-768\.webp" \/>/);
  assert.match(generator, /if \(relPath === ''\) \{/);
  assert.match(generator, /ddnz-team-cutout-20260914-768\.webp/);
  assert.match(generator, /media="\(min-width: 761px\)" fetchpriority="high"/);
});
