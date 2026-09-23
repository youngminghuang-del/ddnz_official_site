import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { kitchenPackagePath, kitchenPackageScenarioPaths } from '../src/features/commercial-kitchen/routes.mjs';

const pagePath = new URL('../src/pages/product-showcase/RestaurantKitchenPackages.jsx', import.meta.url);
const cssPath = new URL('../src/pages/product-showcase/restaurant-kitchen-packages.css', import.meta.url);
const appPath = new URL('../src/App.tsx', import.meta.url);
const generatorPath = new URL('../scripts/generate-static-pages.ts', import.meta.url);
const scenarioPagePath = new URL('../src/pages/product-showcase/RestaurantKitchenScenario.jsx', import.meta.url);

test('restaurant kitchen package route is canonical and wired into the SPA and static build', async () => {
  assert.equal(kitchenPackagePath, '/sourcing/restaurant-kitchen-packages-from-china');
  const [app, generator] = await Promise.all([readFile(appPath, 'utf8'), readFile(generatorPath, 'utf8')]);
  assert.match(app, /path=\{kitchenPackagePath\}/);
  assert.match(generator, /sourcing\/restaurant-kitchen-packages-from-china/);
  assert.match(generator, /Restaurant Kitchen Packages from China/);
  assert.equal(kitchenPackageScenarioPaths.length, 6);
  assert.match(app, /RestaurantKitchenScenario/);
});

test('page contains three scenario plans, scoped pricing and local responsibility boundaries', async () => {
  const page = await readFile(pagePath, 'utf8') + await readFile(new URL('../src/features/commercial-kitchen/data/restaurant-scenarios.mjs', import.meta.url), 'utf8');
  for (const phrase of ['Takeaway + QSR', 'Cafe + light meals', 'Casual dining', 'EXAMPLE DATA SLOT', 'Illustrative ranges for page development only', 'Not included', 'Local professional scope']) {
    assert.match(page, new RegExp(phrase.replace(/[+]/g, '\\+')));
  }
  assert.match(page, /Amazon, Noon, Jumia or Mercado Libre/);
  assert.doesNotMatch(page, /total project cost is|guaranteed savings/i);
  assert.doesNotMatch(page, /[—–]/);
  for (const asset of ['qsr-isometric-concept-v1.webp', 'cafe-isometric-concept-v1.webp', 'casual-isometric-concept-v1.webp']) assert.match(page, new RegExp(asset.replace('.', '\\.')));
});

test('scenario breadth is split into six standalone working briefs', async () => {
  const [page, scenarioPage] = await Promise.all([readFile(pagePath, 'utf8'), readFile(scenarioPagePath, 'utf8')]);
  for (const phrase of ['Bakery + pastry', 'Pizza shop', 'Cloud kitchen']) assert.match(page + scenarioPage, new RegExp(phrase.replace(/[+]/g, '\\+')));
  assert.match(scenarioPage, /DIMENSIONED CONCEPT/);
  assert.match(scenarioPage, /BUY FROM CHINA|SOURCING BRIEF|Source a /);
  assert.doesNotMatch(scenarioPage, /[—–]/);
});

test('page presents four clearly labelled evidence layers', async () => {
  const page = await readFile(pagePath, 'utf8') + await readFile(new URL('../src/features/commercial-kitchen/data/restaurant-scenarios.mjs', import.meta.url), 'utf8');
  for (const phrase of ['Generated concept', 'Package-specific products', 'DDNZ field record', 'Delivery record and context', 'not represented as a DDNZ installation case']) assert.match(page, new RegExp(phrase, 'i'));
});

test('each scenario has distinct dimensions, placed equipment and three visible route types', async () => {
  const page = await readFile(pagePath, 'utf8') + await readFile(new URL('../src/features/commercial-kitchen/data/restaurant-scenarios.mjs', import.meta.url), 'utf8');
  for (const dimension of ['8,000 x 6,000 mm', '8,000 x 7,500 mm', '12,000 x 10,000 mm']) assert.match(page, new RegExp(dimension));
  for (const route of ["kind: 'food'", "kind: 'staff'", "kind: 'ware'"]) assert.equal(page.split(route).length - 1, 3, route);
  for (const code of ['E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07']) assert.match(page, new RegExp(code));
  assert.match(page, /rkp-plan-drawing/);
  assert.match(page, /Equipment sizes shown/);
});

test('page CSS includes responsive and reduced-motion treatments', async () => {
  const css = await readFile(cssPath, 'utf8');
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /\.rkp-floor-plan/);
});

test('complete plan downloads are gated by a qualified two-step lead form', async () => {
  const page = await readFile(pagePath, 'utf8') + await readFile(new URL('../src/features/commercial-kitchen/data/restaurant-scenarios.mjs', import.meta.url), 'utf8');
  for (const phrase of ['STEP {step} OF 2', 'Destination country', 'Project stage', 'Business email', 'WhatsApp or phone', 'Unlock my complete plan']) {
    assert.match(page, new RegExp(phrase.replace(/[{}]/g, '\\$&')));
  }
  assert.match(page, /submitInquiry\(planLeadPayload\(lead, scenario\)\)/);
  assert.match(page, /const unlocked = status === 'success' \|\| status === 'preview'/);
  assert.match(page, /href=\{scenario\.download\}/);
  assert.match(page, /lead\.whatsapp\.replace\(\/\\D\/g, ''\)\.length < 7/);
  assert.match(page, /kitchen_plan_pdf_download/);
});

test('each scenario has a real eight-page quasi-engineering PDF asset', async () => {
  const downloads = [
    '../public/downloads/ddnz-takeaway-qsr-kitchen-package.pdf',
    '../public/downloads/ddnz-cafe-light-meals-kitchen-package.pdf',
    '../public/downloads/ddnz-casual-dining-kitchen-package.pdf',
  ];
  for (const relative of downloads) {
    const path = new URL(relative, import.meta.url);
    const [contents, details] = await Promise.all([readFile(path), stat(path)]);
    assert.equal(contents.subarray(0, 5).toString(), '%PDF-');
    assert.ok(details.size > 100_000, `${relative} should contain the full package and evidence imagery`);
    assert.match(contents.toString('latin1'), /\/Count 8\b/);
  }
});
