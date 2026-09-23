import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Language } from '../src/i18n/translations';
import RegionContent from '../src/features/freight/RegionContent';
import CentralAsiaOverviewContent from '../src/features/freight/CentralAsiaOverviewContent';
import NigeriaContent, { nigeriaMetadata } from '../src/features/freight/NigeriaContent';

const languages: Language[] = ['en', 'zh', 'ru', 'fr', 'es', 'ar', 'pt', 'tr'];

test('regional freight hubs have one H1, a geolocated gateway map and country navigation in each authored language', () => {
  for (const locale of languages) {
    for (const region of ['middle-east', 'west-africa', 'latin-america'] as const) {
      const html = renderToStaticMarkup(createElement(RegionContent, { region, locale }));
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${locale} ${region}`);
      assert.match(html, /freight-regional-map/);
      assert.match(html, /Ningbo/);
      assert.match(html, /Qingdao/);
      assert.match(html, /id="china-origins-heading"/);
      assert.match(html, /Guangzhou|广州/);
      assert.doesNotMatch(html, /<h2 id="region-map-heading">[^<]+<\/h2><p>/);
      assert.match(html, /id="country-routes"/);
      if (region === 'west-africa') {
        assert.match(html, /Abidjan/);
        assert.match(html, /CIABJ/);
        assert.match(html, /id="west-africa-markets"/);
        assert.match(html, /Alaba International Market/);
        assert.match(html, /Computer Village/);
        assert.match(html, /Ladipo Market/);
        assert.doesNotMatch(html, /freight-region-stage-pending/);
      } else {
        assert.match(html, /freight-region-evidence-grid/);
      }
      assert.match(html, /shipping-from-china-to-/);
    }
  }
});

test('Central Asia hub does not silently choose Kazakhstan and keeps destination links independent', () => {
  const html = renderToStaticMarkup(createElement(CentralAsiaOverviewContent, { locale: 'en' }));
  assert.match(html, /Select a country/);
  assert.match(html, /shipping-from-china-to-kazakhstan/);
  assert.match(html, /shipping-from-china-to-uzbekistan/);
  assert.doesNotMatch(html, /Open country route/);
  assert.match(html, /China-side loading/);
});

test('Nigeria country guide replaces generic unloading films with sourced market planning', () => {
  for (const locale of ['en', 'zh', 'es'] as const) {
    const html = renderToStaticMarkup(createElement(NigeriaContent, { locale }));
    assert.match(html, /id="nigeria-markets"/);
    assert.match(html, /Alaba International Market/);
    assert.match(html, /Computer Village/);
    assert.match(html, /Ladipo Market/);
    assert.match(html, /\/images\/markets\/ladipo-market-mushin-lagos.webp/);
    for (const cardCopy of html.matchAll(/<div class="freight-market-copy">([\s\S]*?)<\/div>/g)) {
      assert.doesNotMatch(cardCopy[1], /<small>/);
    }
    assert.match(html, /freight-market-credits/);
    assert.doesNotMatch(html, /lagos-unloading\.mp4/);
    assert.match(nigeriaMetadata(locale).keywords, /Alaba International Market/);
  }
});

test('origin-to-destination content is unique to each freight hub and only rendered in authored languages', () => {
  const middleEast = renderToStaticMarkup(createElement(RegionContent, { region: 'middle-east', locale: 'en' }));
  const westAfrica = renderToStaticMarkup(createElement(RegionContent, { region: 'west-africa', locale: 'en' }));
  const latinAmerica = renderToStaticMarkup(createElement(RegionContent, { region: 'latin-america', locale: 'en' }));
  const centralAsia = renderToStaticMarkup(createElement(CentralAsiaOverviewContent, { locale: 'en' }));
  const nigeria = renderToStaticMarkup(createElement(NigeriaContent, { locale: 'en' }));
  assert.match(middleEast, /Foshan → Saudi Arabia/);
  assert.match(westAfrica, /Yiwu → Ghana/);
  assert.match(latinAmerica, /Foshan → Peru/);
  assert.match(centralAsia, /Yongkang → Uzbekistan/);
  assert.match(nigeria, /Shenzhen → Computer Village/);
  assert.doesNotMatch(middleEast, /Yongkang → Uzbekistan/);
  assert.doesNotMatch(latinAmerica, /Foshan → Saudi Arabia/);
  assert.match(renderToStaticMarkup(createElement(RegionContent, { region: 'latin-america', locale: 'zh' })), /佛山 → 秘鲁/);
  assert.match(renderToStaticMarkup(createElement(RegionContent, { region: 'latin-america', locale: 'es' })), /Foshan → Perú/);
  assert.match(renderToStaticMarkup(createElement(RegionContent, { region: 'latin-america', locale: 'ar' })), /freight-origin-opportunities/);
});
