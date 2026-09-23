import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { ROUTES } from '../src/features/screen-protectors/routes.mjs';
import { EN } from '../src/features/screen-protectors/locales/en.mjs';
import { FACTORY_CLIPS } from '../src/features/screen-protectors/production.mjs';
import { screenProtectorMetadata, SCREEN_PROTECTOR_SEO, SITE_ORIGIN, renderScreenProtectorBody, appendScreenProtectorSitemap, escapeHtml } from '../src/features/screen-protectors/seo.mjs';
import { renderScreenProtectorHtml, prepareScreenProtectorSeo, parseArguments } from '../scripts/prepare-screen-protector-seo.mjs';
import { screenProtectorBreadcrumbs, renderScreenProtectorBreadcrumbs, SCREEN_PROTECTOR_NEXT_STEPS } from '../src/features/screen-protectors/browsing.mjs';

const shell = '<!doctype html><html lang="zh" dir="rtl"><head><meta charset="utf-8"><title>Old home</title><meta name="description" content="Old"><meta name="robots" content="index"><meta property="og:title" content="Old"><link rel="canonical" href="https://wrong.invalid/"><link rel="alternate" hreflang="zh" href="https://wrong.invalid/zh"><script type="application/ld+json">{"@type":"VideoObject"}</script><script type="module" src="/assets/main.js"></script><link rel="stylesheet" href="/assets/main.css"></head><body><div id="root"><div>Old homepage body</div></div></body></html>';
const baseSitemap = '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.ddnzglobal.com/old-page</loc><lastmod>2026-08-22</lastmod></url></urlset>';

test('all eight exact routes have unique English metadata and canonical URLs', () => {
  assert.deepEqual(Object.keys(SCREEN_PROTECTOR_SEO), Object.keys(ROUTES));
  const metadata = Object.values(ROUTES).map(route => screenProtectorMetadata(route, { preview: false }));
  assert.equal(new Set(metadata.map(item => item.title)).size, 8);
  assert.equal(new Set(metadata.map(item => item.description)).size, 8);
  for (const item of metadata) {
    assert.equal(item.canonical, SITE_ORIGIN + ROUTES[item.page] + '/');
    assert.equal(item.language, 'en');
    assert.match(item.image, /^https:\/\/www\.ddnzglobal\.com\/screen-protector-media\//);
    assert.ok(item.description.length >= 90 && item.description.length <= 170);
  }
  assert.equal(metadata.filter(item => item.indexable).length, 7);
  assert.match(metadata.find(item => item.page === 'quote').robots, /noindex/);
  assert.throws(() => screenProtectorMetadata('/zh-cn/screen-protectors'), /Unknown/);
});

test('all routes default to noindex, including trailing-slash routes', () => {
  for (const pathname of Object.values(ROUTES)) {
    assert.match(screenProtectorMetadata(pathname).robots, /noindex/);
    assert.equal(screenProtectorMetadata(pathname + '/').canonical, SITE_ORIGIN + pathname + '/');
  }
});

test('static breadcrumbs match the only emitted schema, including nested guide hierarchy', () => {
  for (const [page, route] of Object.entries(ROUTES)) {
    const html = renderScreenProtectorHtml(shell, route, { preview: false });
    assert.ok(html.includes(renderScreenProtectorBreadcrumbs(page)));
    const schemas = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([^]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    if (page === 'quote') { assert.equal(schemas.length, 0); continue; }
    assert.equal(schemas.length, 1);
    assert.equal(schemas[0]['@type'], 'BreadcrumbList');
    const crumbs = screenProtectorBreadcrumbs(page);
    assert.deepEqual(schemas[0].itemListElement.map(item => [item.name, item.item]), crumbs.map(item => [item.name, SITE_ORIGIN + item.href]));
    assert.deepEqual(schemas[0].itemListElement.map(item => item.position), crumbs.map((_, index) => index + 1));
    assert.equal(crumbs[0].href, '/');
    assert.equal(crumbs[1].href, '/sourcing/mobile-accessories-from-china/');
    assert.equal(crumbs.at(-1).href, route + '/');
    if (['prices', 'curves'].includes(page)) assert.equal(crumbs.at(-2).href, ROUTES.guides + '/');
  }
});

test('every static route names the product and exposes contextual sourcing next steps without JavaScript', () => {
  for (const [page, route] of Object.entries(ROUTES)) {
    const html = renderScreenProtectorHtml(shell, route);
    const h1 = html.match(/<h1>([^]*?)<\/h1>/)[1].replace(/<br>/g, ' ');
    assert.match(h1, /screen\s+protector/i);
    assert.match(html, /class="phone-film" lang="en" dir="ltr"/);
    for (const [target, label] of SCREEN_PROTECTOR_NEXT_STEPS[page]) {
      assert.ok(html.includes(`href="${ROUTES[target]}/">${escapeHtml(label)}`), `${page} links to ${target}`);
    }
    assert.doesNotMatch(html, /href="#(?:home|products|guides|prices|curves|videos|calculator|quote)"|kitchen/);
    assert.equal((html.match(/hreflang=/g) || []).length, page === 'quote' ? 0 : 9);
  }
});

test('static HTML replaces inherited homepage body and metadata without changing build assets', () => {
  for (const pathname of Object.values(ROUTES)) {
    const html = renderScreenProtectorHtml(shell, pathname, { preview: false });
    assert.match(html, /<html lang="en" dir="ltr">/);
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.equal((html.match(/name="robots"/g) || []).length, 1);
    assert.match(html, /src="\/assets\/main.js"/);
    assert.match(html, /href="\/assets\/main.css"/);
    assert.doesNotMatch(html, /Old home|Old homepage body|wrong.invalid|VideoObject|display:\s*none/);
    assert.equal((html.match(/hreflang=/g) || []).length, pathname === ROUTES.quote ? 0 : 9);
    assert.match(html, /data-static-fallback="screen-protectors"/);
  }
  assert.throws(() => renderScreenProtectorHtml('<html></html>', ROUTES.home), /complete head/);
});

test('static body derives actual product prices, all eleven checks and ten stage descriptions', () => {
  const products = renderScreenProtectorBody('products');
  for (const price of ['2.50', '6.00', '4.30', '5.10']) assert.ok(products.includes(price));
  for (const value of ['1,000 pieces', '100 pieces per phone model', '500 pieces per phone model', '16.5 kg', '14 kg']) assert.ok(products.includes(value));
  const guides = renderScreenProtectorBody('guides');
  for (const question of Object.values(EN.requests)) assert.ok(guides.includes(escapeHtml(question)));
  const videos = renderScreenProtectorBody('videos');
  for (const stage of FACTORY_CLIPS) {
    assert.ok(videos.includes(escapeHtml(stage.title)));
    assert.ok(videos.includes(escapeHtml(stage.description)));
    assert.ok(videos.includes(escapeHtml(stage.check)));
  }
  assert.match(renderScreenProtectorBody('calculator'), /5,000/);
  assert.match(renderScreenProtectorBody('calculator'), /No additional duty or KDV/);
  assert.doesNotMatch(renderScreenProtectorBody('quote'), /TEST-MODEL|61,682|sessionStorage|manager@/);
});

test('every metadata image refers to an existing approved local asset', async () => {
  for (const metadata of Object.values(SCREEN_PROTECTOR_SEO)) {
    assert.ok((await readFile(new URL('../public' + metadata.image, import.meta.url))).length > 0);
  }
});

test('sitemap merge is additive, idempotent and preserves every old entry verbatim', () => {
  const merged = appendScreenProtectorSitemap(baseSitemap);
  assert.ok(merged.includes('<url><loc>https://www.ddnzglobal.com/old-page</loc><lastmod>2026-08-22</lastmod></url>'));
  assert.equal((merged.match(/<loc>/g) || []).length, 8);
  assert.doesNotMatch(merged, /screen-protectors\/brief/);
  assert.equal((merged.match(/hreflang=/g) || []).length, 63);
  assert.equal(appendScreenProtectorSitemap(merged), merged);
  assert.match(merged, /<loc>https:\/\/www.ddnzglobal.com\/screen-protectors\/videos\/<\/loc>/);
  const oneOldPhoneEntry = baseSitemap.replace('</urlset>', '<url><loc>https://www.ddnzglobal.com/screen-protectors/</loc><lastmod>2026-08-22</lastmod></url></urlset>');
  const withExistingPhone = appendScreenProtectorSitemap(oneOldPhoneEntry);
  assert.equal((withExistingPhone.match(/<loc>/g) || []).length, 8);
  assert.ok(withExistingPhone.includes('<url><loc>https://www.ddnzglobal.com/screen-protectors/</loc><lastmod>2026-08-22</lastmod></url>'));
  assert.throws(() => appendScreenProtectorSitemap('<sitemapindex></sitemapindex>'), /URL-set sitemap/);
  assert.throws(() => appendScreenProtectorSitemap('<urlset>'), /URL-set sitemap/);
});

test('CLI defaults to isolated noindex output without mutating source sitemap', async () => {
  const sitemapFile = new URL('../public/sitemap.xml', import.meta.url);
  const before = await readFile(sitemapFile);
  const result = await prepareScreenProtectorSeo();
  assert.equal(result.mode, 'noindex-review');
  assert.equal(result.sitemapFile, 'sitemap.proposed.xml');
  assert.ok(result.output.includes('ddnz-screen-protector-seo-'));
  assert.equal(result.pages.length, 8);
  for (const item of result.pages) {
    const html = await readFile(path.join(result.output, item.file), 'utf8');
    assert.match(html, /name="robots" content="noindex, nofollow, noarchive"/);
  }
  assert.deepEqual(await readFile(sitemapFile), before);
});

test('production overlay requires a reviewed build and leaves all its input files untouched', async () => {
  await assert.rejects(prepareScreenProtectorSeo({ production: true }), /explicit --build-root/);
  const build = await mkdtemp(path.join(os.tmpdir(), 'ddnz-seo-build-test-'));
  await writeFile(path.join(build, 'index.html'), shell);
  await writeFile(path.join(build, 'sitemap.xml'), baseSitemap);
  const result = await prepareScreenProtectorSeo({ buildRoot: build, production: true });
  assert.notEqual(result.output, build);
  assert.equal(result.pages.filter(page => page.indexable).length, 7);
  assert.equal(result.sitemapFile, 'sitemap.xml');
  assert.equal(await readFile(path.join(build, 'index.html'), 'utf8'), shell);
  assert.equal(await readFile(path.join(build, 'sitemap.xml'), 'utf8'), baseSitemap);
  await assert.rejects(prepareScreenProtectorSeo({ buildRoot: build, outputDir: build }), /separate|not overwritten/);
  const occupied = path.join(build, 'occupied');
  await mkdir(occupied);
  await assert.rejects(prepareScreenProtectorSeo({ buildRoot: build, outputDir: occupied }), /separate|overlaps/);
  await writeFile(path.join(build, 'index.html'), shell.replace('Old home', 'Local integration review'));
  await assert.rejects(prepareScreenProtectorSeo({ buildRoot: build, production: true }), /local\/noindex/);
  assert.throws(() => parseArguments(['--build-root']), /Missing/);
  assert.throws(() => parseArguments(['--deploy']), /Unknown/);
});
