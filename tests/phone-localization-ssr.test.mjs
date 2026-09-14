import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { tsImport } from 'tsx/esm/api';
import { localizedScreenProtectorMetadata, renderLocalizedScreenProtectorHead, LOCALIZED_SCREEN_PROTECTOR_ROUTES } from '../src/features/screen-protectors/localized-seo.mjs';
import { screenProtectorMetadata, renderScreenProtectorHead, renderScreenProtectorBody, appendScreenProtectorSitemap } from '../src/features/screen-protectors/seo.mjs';
import { ROUTES } from '../src/features/screen-protectors/routes.mjs';
import { PHONE_PRODUCT_IDS, phoneCopy, phoneMoney } from '../src/features/screen-protectors/localization.mjs';
import { PRODUCTS } from '../src/features/screen-protectors/calculator.mjs';
const { default: Content } = await tsImport('../src/features/screen-protectors/LocalizedScreenProtectorContent.jsx', import.meta.url);
const { PlanCardFixture } = await tsImport('./phone-localization-fixture.jsx', import.meta.url);
const { saveLocalizedHandoff, readHandoff } = await import('../src/features/screen-protectors/handoff.mjs');
const { localizedQuoteHref } = await import('../src/features/screen-protectors/localization.mjs');

test('all four pure SSR bodies are complete, deterministic and browser independent', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis,'window',{configurable:true,get(){throw Error('SSR accessed window');}});
  try {
    for (const {locale,page} of LOCALIZED_SCREEN_PROTECTOR_ROUTES) {
      const copy=phoneCopy(locale);
      const render=()=>renderToStaticMarkup(React.createElement(Content,{locale,page,onAction(){throw Error('SSR must not report actions');}}));
      const html=render(); assert.equal(render(),html);
      assert.equal((html.match(/<h1>/g)||[]).length,1);
      assert.ok(html.includes(`lang="${locale}" dir="${copy.direction}"`));
      assert.ok(html.includes(copy.inquiry)); assert.ok(html.includes(copy.destinationHelp));
      assert.ok(html.includes(copy.istanbul)); assert.ok(html.includes(copy.review));
      assert.match(html,/id="phone-destination"[^>]*value=""/);
      assert.match(html,/href="\/screen-protectors\/calculator\/" hrefLang="en"/);
      assert.doesNotMatch(html,/Istanbul|Estimated landed|Phone model|CNY \/ piece|saved in this browser|[\u4e00-\u9fff]|\{(?:date|min|max|row|grams|contents|tare)\}/);
      for(const id of PHONE_PRODUCT_IDS) {
        assert.ok(html.includes(`id="phone-product-${id}"`));
        assert.ok(html.includes(copy.names[id])); assert.ok(html.includes(phoneMoney(locale,PRODUCTS[id].price)));
      }
      if(locale==='ar') assert.match(html,/<bdi dir="ltr">٤٢ × ٣٥ × ٤٢<\/bdi>/);
      for(const [,src] of html.matchAll(/<img[^>]*src="([^"]+)"/g)) assert.ok(fs.existsSync(new URL(`../public${src}`,import.meta.url)),src);
    }
  } finally { if(previous)Object.defineProperty(globalThis,'window',previous);else delete globalThis.window; }
});

test('each EN/ES/AR core page has one self canonical and four reciprocal alternates', () => {
  for(const page of ['home','compare']) {
    const englishPath=page==='home'?ROUTES.home:ROUTES.products;
    const english=screenProtectorMetadata(englishPath,{preview:false});
    for(const locale of ['en','es','ar']) {
      const meta=locale==='en'?english:localizedScreenProtectorMetadata(locale,page);
      const html=locale==='en'?renderScreenProtectorHead(englishPath,{preview:false}):renderLocalizedScreenProtectorHead(locale,page);
      assert.deepEqual(meta.alternateUrls,english.alternateUrls);
      assert.deepEqual(meta.alternateUrls.map(item=>item.hrefLang),['en','es','ar','x-default']);
      assert.equal(meta.alternateUrls.find(item=>item.hrefLang===locale).href,meta.canonical);
      assert.equal(meta.alternateUrls.at(-1).href,english.canonical);
      assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
      assert.equal((html.match(/hreflang=/g)||[]).length,4);
      assert.ok(html.includes(`href="${meta.canonical}"`));
      if(locale!=='en') {
        assert.ok(meta.description.length>=80 && meta.description.length<=170);
        assert.equal(meta.schema.itemListElement.at(-1).item,meta.canonical);
        assert.match(localizedScreenProtectorMetadata(locale,page,{preview:true}).robots,/noindex/);
      }
    }
  }
  for(const key of ['guides','prices','curves','videos','calculator','quote']) {
    assert.deepEqual(screenProtectorMetadata(ROUTES[key]).alternateUrls,[]);
    assert.doesNotMatch(renderScreenProtectorHead(ROUTES[key]),/hreflang/);
  }
});

test('finalizer sitemap stays additive and preserves localized pages while adding only two EN clusters', () => {
  const old='<url><loc>https://www.ddnzglobal.com/old/</loc><lastmod>2026-09-13</lastmod></url>';
  const localized=LOCALIZED_SCREEN_PROTECTOR_ROUTES.map(item=>`<url><loc>https://www.ddnzglobal.com${item.path}</loc></url>`).join('');
  const baseline=`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${old}${localized}</urlset>`;
  const merged=appendScreenProtectorSitemap(baseline);
  assert.ok(merged.includes(old)); assert.ok(merged.includes(localized));
  assert.match(merged,/xmlns:xhtml="http:\/\/www.w3.org\/1999\/xhtml"/);
  assert.equal((merged.match(/<loc>/g)||[]).length,12);
  assert.equal((merged.match(/<xhtml:link /g)||[]).length,8);
  assert.equal(appendScreenProtectorSitemap(merged),merged);
  assert.doesNotMatch(merged,/<loc>[^<]*\/brief\//);
});

test('English home and comparison SSR include the exact shared buyer copy and real guide links', () => {
  const copy=JSON.parse(fs.readFileSync(new URL('../src/features/buyer-guides/locales/en.json',import.meta.url),'utf8'));
  for(const page of ['home','products']) {
    const html=renderScreenProtectorBody(page);
    assert.ok(html.includes(copy.entryTitle));
    for(const [id,path] of [['phone-stores','wholesale-for-stores'],['private-label','private-label']]) {
      assert.ok(html.includes(`href="/screen-protectors/${path}/"`));
      // These labels contain &, which the semantic fallback correctly escapes.
      assert.ok(html.includes(copy.guides[id].card.replaceAll('&','&amp;')));
      assert.ok(html.includes(copy.guides[id].cardCopy));
    }
  }
  assert.doesNotMatch(renderScreenProtectorBody('calculator'),/class="buyer-links"/);
});

test('the existing quote attachment renders localized product totals and edit links without Istanbul', () => {
  for(const locale of ['es','ar']) {
    let value; const storage={setItem(_,v){value=v;},getItem(){return value;}};
    const state={rows:[{product:'titan-hd',model:'iPhone 16 Pro',qty:500}],destination:'Singapore',notes:''};
    saveLocalizedHandoff(storage,locale,state);
    const plan=readHandoff(storage,new URL(localizedQuoteHref(locale,state.destination),'https://www.ddnzglobal.com').search);
    const html=renderToStaticMarkup(React.createElement(PlanCardFixture,{plan}));
    assert.ok(html.includes(phoneCopy(locale).attachment)); assert.ok(html.includes('Singapore'));
    assert.ok(html.includes(`href="/${locale}/screen-protectors/compare/#phone-inquiry"`));
    assert.match(html,/name="Screen_Protector_Plan_JSON"/);
    assert.doesNotMatch(html,/Istanbul|Turkey|Sea freight|Air freight|freightCny|landedCny/);
  }
});

test('missing localized attachments recover via the current-language comparison page, never Istanbul', () => {
  for(const locale of ['es','ar']) {
    const other=locale==='es'?'ar':'es';
    const entry=`/${locale}/get-a-quote/?source=screen_protector_localized&phoneLocale=${other}&leadGoal=Product+Sourcing`;
    const html=renderToStaticMarkup(React.createElement(PlanCardFixture,{missing:true,entry}));
    assert.ok(html.includes(phoneCopy(locale).attachmentMissing));
    assert.ok(html.includes(`lang="${locale}" dir="${phoneCopy(locale).direction}"`));
    assert.ok(html.includes(`href="/${locale}/screen-protectors/compare/#phone-inquiry"`));
    assert.doesNotMatch(html,/calculator|Istanbul|Turkey|Return to the planner|Your screen-protector plan/);
    assert.equal(renderToStaticMarkup(React.createElement(PlanCardFixture,{missing:false,entry})), '');
  }
  const english=renderToStaticMarkup(React.createElement(PlanCardFixture,{missing:true,entry:'/get-a-quote/?source=screen_protector_planner'}));
  assert.match(english,/Return to the planner/); assert.match(english,/href="\/screen-protectors\/calculator"/);
  const missingLocale=renderToStaticMarkup(React.createElement(PlanCardFixture,{missing:true,entry:'/get-a-quote/?source=screen_protector_localized'}));
  assert.match(missingLocale,/href="\/es\/screen-protectors\/compare\/#phone-inquiry"/);
  assert.doesNotMatch(missingLocale,/calculator|Return to the planner/);
});
