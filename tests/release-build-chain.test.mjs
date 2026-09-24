import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const oldNode = '<url><loc>https://www.ddnzglobal.com/old-guide/</loc><lastmod>2026-08-22</lastmod></url>';
const sitemap = '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + oldNode + '</urlset>';
const shell = '<!doctype html><html lang="en"><head><title>Existing site</title><script type="module" src="/assets/app.js"></script></head><body><div id="root"></div></body></html>';
async function fixture() {
  const project = await fs.mkdtemp(path.join(os.tmpdir(), 'ddnz-build-chain-'));
  await fs.mkdir(path.join(project, 'scripts'));
  await fs.mkdir(path.join(project, 'src/features'), { recursive: true });
  await fs.cp(path.join(root, 'src/features/site-localization'), path.join(project, 'src/features/site-localization'), { recursive: true });
  await fs.mkdir(path.join(project, 'dist'));
  await fs.mkdir(path.join(project, 'public'));
  await fs.writeFile(path.join(project, 'package.json'), '{"type":"module"}');
  for (const name of ['finalize-screen-protector-pages.mjs', 'prepare-screen-protector-seo.mjs']) await fs.copyFile(path.join(root, 'scripts', name), path.join(project, 'scripts', name));
  await fs.cp(path.join(root, 'src/features/screen-protectors'), path.join(project, 'src/features/screen-protectors'), { recursive: true });
  await fs.mkdir(path.join(project, 'src/features/buyer-guides/locales'), { recursive: true });
  await fs.copyFile(path.join(root, 'src/features/buyer-guides/locales/en.json'), path.join(project, 'src/features/buyer-guides/locales/en.json'));
  await fs.mkdir(path.join(project, 'src/features/commercial-kitchen'), { recursive: true });
  await fs.copyFile(path.join(root, 'src/features/commercial-kitchen/routes.mjs'), path.join(project, 'src/features/commercial-kitchen/routes.mjs'));
  await fs.cp(path.join(root, 'src/features/food-processing'), path.join(project, 'src/features/food-processing'), { recursive: true });
  await fs.mkdir(path.join(project, 'src/lib'), { recursive: true });
  await fs.mkdir(path.join(project, 'src/features/mobile-sourcing'), { recursive: true });
  await fs.copyFile(path.join(root, 'src/features/mobile-sourcing/routes.mjs'), path.join(project, 'src/features/mobile-sourcing/routes.mjs'));
  await fs.mkdir(path.join(project, 'src/features/audio'), { recursive: true });
  await fs.copyFile(path.join(root, 'src/features/audio/category-routes.mjs'), path.join(project, 'src/features/audio/category-routes.mjs'));
  await fs.copyFile(path.join(root, 'src/lib/productLocalization.mjs'), path.join(project, 'src/lib/productLocalization.mjs'));
  await fs.writeFile(path.join(project, 'dist/index.html'), shell);
  await fs.writeFile(path.join(project, 'dist/sitemap.xml'), sitemap);
  await fs.writeFile(path.join(project, 'public/sitemap.xml'), sitemap);
  await fs.writeFile(path.join(project, 'dist/unchanged.txt'), 'Keep this existing public file.');
  return project;
}
function run(project, cwd = project) {
  return spawnSync(process.execPath, [path.join(project, 'scripts/finalize-screen-protector-pages.mjs')], { cwd, encoding: 'utf8', timeout: 10000 });
}
test('ordinary npm build preserves its pipeline and finishes with SEO and deployment inventory checks', async () => {
  const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
  const expected = ['npm run fetch-notion', 'npm run optimize-insights-cards', 'vite build', 'tsx scripts/generate-static-pages.ts', 'npm run build:screen-protectors', 'node scripts/prerender-country-pages.mjs', 'node scripts/prerender-core-pages.mjs', 'node scripts/finalize-p0-seo.mjs', 'node scripts/check-country-prerender.mjs', 'node scripts/check-core-prerender.mjs', 'node scripts/audit-seo-output.mjs', 'node scripts/audit-deployment-files.mjs'];
  assert.deepEqual(pkg.scripts.build.split(' && '), expected);
  assert.doesNotMatch(pkg.scripts['build:preview'], /fetch-notion|npm run deploy|deploy-pages|git push|push-indexnow|push-baidu/);
  assert.ok(pkg.scripts['build:preview'].endsWith('node scripts/audit-deployment-files.mjs && node scripts/stage-local-preview.mjs'));
  assert.equal(pkg.scripts['build:screen-protectors'], 'node scripts/finalize-screen-protector-pages.mjs');
  const source = await fs.readFile(path.join(root, 'scripts/finalize-screen-protector-pages.mjs'), 'utf8');
  assert.doesNotMatch(source, /fetch\(|dotenv|execFile|formspree|deploy-pages|push-indexnow|push-baidu/);
});
test('CI finalizer adds eight HTML pages, syncs both sitemaps and preserves old entries and unrelated files', async () => {
  const project = await fixture();
  const first = run(project);
  assert.equal(first.status, 0, first.stderr);
  const result = JSON.parse(first.stdout);
  assert.equal(result.pages, 8);
  assert.equal(result.publicPhonePages, 7);
  assert.equal(result.sitemapUrls, 8);
  const distSitemap = await fs.readFile(path.join(project, 'dist/sitemap.xml'), 'utf8');
  assert.equal(await fs.readFile(path.join(project, 'public/sitemap.xml'), 'utf8'), distSitemap);
  assert.ok(distSitemap.includes(oldNode));
  assert.doesNotMatch(distSitemap, /screen-protectors\/brief/);
  assert.match(await fs.readFile(path.join(project, 'dist/screen-protectors/brief/index.html'), 'utf8'), /name="robots"[^>]*noindex/);
  assert.equal(await fs.readFile(path.join(project, 'dist/index.html'), 'utf8'), shell);
  assert.equal(await fs.readFile(path.join(project, 'dist/unchanged.txt'), 'utf8'), 'Keep this existing public file.');
  const second = run(project);
  assert.equal(second.status, 0, second.stderr);
  assert.equal(await fs.readFile(path.join(project, 'dist/sitemap.xml'), 'utf8'), distSitemap);
});
test('CI finalizer rejects the wrong working directory and symlinked output without writing outside the project', async () => {
  const project = await fixture();
  const other = await fs.mkdtemp(path.join(os.tmpdir(), 'ddnz-build-outside-'));
  assert.notEqual(run(project, other).status, 0);
  const outsideFile = path.join(other, 'keep.xml');
  await fs.writeFile(outsideFile, 'unchanged');
  await fs.rename(path.join(project, 'public/sitemap.xml'), path.join(project, 'public/sitemap.before.xml'));
  await fs.symlink(outsideFile, path.join(project, 'public/sitemap.xml'));
  const blocked = run(project);
  assert.notEqual(blocked.status, 0);
  assert.match(blocked.stderr, /symbolic link/);
  assert.equal(await fs.readFile(outsideFile, 'utf8'), 'unchanged');
  assert.equal(await fs.readFile(path.join(project, 'dist/sitemap.xml'), 'utf8'), sitemap);
});
