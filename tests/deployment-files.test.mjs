import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { auditDeploymentFiles, parseArguments, sitemapLocations, sitemapLocationToFile } from '../scripts/audit-deployment-files.mjs';

const script = fileURLToPath(new URL('../scripts/audit-deployment-files.mjs', import.meta.url));
const origin = 'https://www.ddnzglobal.com';
const verification = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body>Verification: d492e0480d36c2c1</body></html>\n';
const categories = ['commercial-kitchen-equipment', 'audio-speakers', 'mobile-accessories', 'outdoor-products'];
const aliases = ['commercial-kitchen', 'audio-speakers', 'mobile-accessories', 'outdoor-products'];
const publicRoutes = ['/', '/fr/', '/blog/new-article/', '/ar/blog/saber-2026/', '/blog/Case-Sensitive/', '/blog/café/',
  ...categories.map(category => `/sourcing/${category}-from-china/`),
  '/screen-protectors/', '/screen-protectors/compare/', '/screen-protectors/guides/',
  '/screen-protectors/guides/price-differences/', '/screen-protectors/guides/curved-glass/',
  '/screen-protectors/videos/', '/screen-protectors/calculator/'];
const redirects = [{ from: '/blog/old-article', to: '/blog/new-article' }, { from: '/ar/blog/saber-2025', to: '/ar/blog/saber-2026' }];
const escapeXml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const sitemap = locations => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${locations.map(location => `<url><loc>${escapeXml(location)}</loc><xhtml:link rel="alternate" hreflang="x-default" href="${origin}/" /><lastmod>2026-09-12</lastmod></url>`).join('\n')}</urlset>`;
const page = (route, robots = 'index,follow', extra = '') => `<!doctype html><html lang="en"><head><link rel="canonical" href="${origin}${route}"><meta name="robots" content="${robots}">${extra}</head><body><div id="root"></div></body></html>`;
const moved = (target, absolute = false) => page(target, 'noindex,follow', `<meta http-equiv="refresh" content="0;url=${absolute ? origin : ''}${target}"><script>location.replace(${JSON.stringify((absolute ? origin : '') + target)})</script>`);

async function put(root, file, content) {
  const target = path.join(root, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content);
}

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ddnz-deployment-inventory-'));
  // Cleanup is confined to this test's freshly allocated temporary directory.
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  for (const route of publicRoutes) await put(root, `dist${route}index.html`, page(route));
  await put(root, 'dist/sitemap.xml', sitemap(publicRoutes.map(route => origin + route)));
  for (const [index, alias] of aliases.entries()) {
    await put(root, `dist/${alias}/index.html`, moved(`/sourcing/${categories[index]}-from-china/`));
  }
  // These model the actual finalizer, fallback, Vite copy, and Notion redirects.
  await put(root, 'dist/screen-protectors/brief/index.html', page('/screen-protectors/brief/', 'noindex, nofollow, noarchive'));
  await put(root, 'dist/404.html', page('/'));
  await put(root, 'public/yandex_d492e0480d36c2c1.html', verification);
  await put(root, 'dist/yandex_d492e0480d36c2c1.html', verification);
  await put(root, 'src/data/notionRedirects.json', JSON.stringify(redirects));
  for (const redirect of redirects) await put(root, `dist${redirect.from}/index.html`, moved(redirect.to, true));
  await put(root, 'dist/assets/app.js', '/* asset, not HTML */');
  await put(root, 'dist/.well-known/health.txt', 'ok');
  return root;
}

async function snapshot(root) {
  const hash = createHash('sha256');
  async function walk(directory) {
    for (const name of (await fs.readdir(directory)).sort()) {
      const file = path.join(directory, name);
      const stat = await fs.lstat(file);
      hash.update(JSON.stringify([path.relative(root, file), stat.mode, stat.size, stat.mtimeMs]));
      if (stat.isDirectory()) await walk(file);
      else if (stat.isSymbolicLink()) hash.update(await fs.readlink(file));
      else hash.update(await fs.readFile(file));
    }
  }
  await walk(root);
  return hash.digest('hex');
}

function cli(root, extra = []) {
  const result = spawnSync(process.execPath, [script, '--project-root', root, ...extra], { cwd: os.tmpdir(), encoding: 'utf8', timeout: 10000 });
  assert.ifError(result.error);
  return result;
}

function hasIssue(report, code, file) {
  assert.ok(report.issues.some(issue => issue.code === code && (!file || issue.file === file)), JSON.stringify(report.issues, null, 2));
  assert.equal(report.ok, false);
}

test('complete finished output passes API and CLI with exact artifact owners and no writes', async t => {
  const root = await fixture(t);
  const before = await snapshot(root);
  const report = await auditDeploymentFiles({ projectRoot: root });
  assert.deepEqual(report.issues, []);
  assert.equal(report.ok, true);
  assert.deepEqual(report.summary, { htmlFiles: publicRoutes.length + 9, sitemapPages: publicRoutes.length, explicitArtifacts: 9, failures: 0 });
  assert.deepEqual(report.inventory.filter(file => file.owner !== 'sitemap'), [
    { file: '404.html', owner: 'spa-fallback' },
    { file: 'ar/blog/saber-2025/index.html', owner: 'article-redirect' },
    { file: 'audio-speakers/index.html', owner: 'legacy-alias' },
    { file: 'blog/old-article/index.html', owner: 'article-redirect' },
    { file: 'commercial-kitchen/index.html', owner: 'legacy-alias' },
    { file: 'mobile-accessories/index.html', owner: 'legacy-alias' },
    { file: 'outdoor-products/index.html', owner: 'legacy-alias' },
    { file: 'screen-protectors/brief/index.html', owner: 'noindex-brief' },
    { file: 'yandex_d492e0480d36c2c1.html', owner: 'site-verification' },
  ]);
  const result = cli(root);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).ok, true);
  assert.equal(result.stderr, '');
  assert.equal(await snapshot(root), before);
});

test('literal and escaped HTML attribute ampersands pass for the actual fallback and brief shapes', async t => {
  const root = await fixture(t);
  for (const amp of ['&', '&amp;', '&#38;', '&#x26;']) {
    // Attributes observed in the finished 404.html and screen-protector brief.
    const attributes = `<meta name="title" content="DDNZ Global | China Sourcing, Quality Control ${amp} Export Delivery"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800${amp}display=swap" rel="stylesheet">`;
    await put(root, 'dist/404.html', page('/', 'index,follow', attributes));
    await put(root, 'dist/screen-protectors/brief/index.html', page('/screen-protectors/brief/', 'noindex, nofollow, noarchive', attributes));
    const before = await snapshot(root);
    assert.deepEqual((await auditDeploymentFiles({ projectRoot: root })).issues, [], amp);
    assert.equal(await snapshot(root), before);
  }
});

test('HTML attribute ampersands do not bypass canonical, noindex or fallback-root requirements', async t => {
  const root = await fixture(t);
  const attributes = '<meta name="title" content="Quality Control & Export Delivery"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap">';
  await put(root, 'dist/404.html', page('/fr/', 'index,follow', attributes).replace('<div id="root"></div>', ''));
  await put(root, 'dist/screen-protectors/brief/index.html', page('/fr/', 'index,follow', attributes));
  const report = await auditDeploymentFiles({ projectRoot: root });
  hasIssue(report, 'INVALID_ARTIFACT', '404.html');
  assert.ok(report.issues.some(issue => issue.file === '404.html' && issue.message.includes('SPA fallback root')));
  hasIssue(report, 'INVALID_ARTIFACT', 'screen-protectors/brief/index.html');
  hasIssue(report, 'MISSING_NOINDEX', 'screen-protectors/brief/index.html');
});

test('sitemap ampersands still require XML escaping in both loc text and attributes', () => {
  const escaped = sitemap([`${origin}/blog/a&b/`]);
  assert.deepEqual(sitemapLocations(escaped), [`${origin}/blog/a&b/`]);
  assert.throws(() => sitemapLocations(escaped.replace('a&amp;b', 'a&b')), /Invalid XML entity/);
  assert.throws(() => sitemapLocations(escaped.replace(`href="${origin}/"`, `href="${origin}/blog/a&b/"`)), /Invalid XML entity/);
});

test('all 19 previously observed index copies fail deterministically, regardless of robots', async t => {
  const root = await fixture(t);
  const copies = ['outdoor-products', 'audio-speakers', 'shipping-from-china-to-kazakhstan', 'how-we-work',
    'shipping-from-china-to-bahrain', 'shipping-from-china-to-peru', 'shipping-from-china-to-kuwait', 'pt',
    'shipping-from-china-to-brazil', 'tr', 'shipping-from-china-to-mexico', 'commercial-kitchen',
    'shipping-from-china-to-qatar', 'shipping-from-china-to-chile', 'screen-protectors',
    'shipping-from-china-to-uzbekistan', 'get-a-quote', 'es', 'fr'];
  for (const [index, route] of copies.entries()) await put(root, `dist/${route}/index 2.html`, page(`/${route}/`, index % 2 ? 'noindex,follow' : 'index,follow'));
  const before = await snapshot(root);
  const report = await auditDeploymentFiles({ projectRoot: root });
  const duplicateFiles = report.issues.filter(issue => issue.code === 'STRAY_INDEX_COPY').map(issue => issue.file);
  assert.deepEqual(duplicateFiles, copies.map(route => `${route}/index 2.html`).sort());
  assert.equal(report.issues.filter(issue => issue.code === 'UNEXPECTED_HTML').length, 19);
  assert.deepEqual(await auditDeploymentFiles({ projectRoot: root }), report);
  const first = cli(root);
  const second = cli(root);
  assert.equal(first.status, 1);
  assert.equal(first.stderr, second.stderr);
  assert.match(first.stderr, /STRAY_INDEX_COPY.*"screen-protectors\/index 2\.html"/);
  assert.equal(JSON.parse(first.stdout).htmlFiles, publicRoutes.length + 9 + 19);
  assert.equal(await snapshot(root), before);
});

test('hidden HTML, uppercase extensions, flat files and noindex orphans are all inventoried', async t => {
  const root = await fixture(t);
  const extras = ['.cache/old.HTML', 'assets/leftover.htm', 'nested/page.xhtml', '.hidden/index.html',
    '404 2.html', 'blog/404.html', 'yandex_old.html', 'preview/index.html', 'old-landing.html', 'page.shtml'];
  for (const file of extras) await put(root, `dist/${file}`, page('/', 'noindex, nofollow'));
  const report = await auditDeploymentFiles({ projectRoot: root });
  assert.deepEqual(report.issues.filter(issue => issue.code === 'UNEXPECTED_HTML').map(issue => issue.file), extras.sort());
});

test('copy spellings cannot be legitimized even by a sitemap entry', async t => {
  const root = await fixture(t);
  const copies = ['index 2.html', 'index (3).html', 'index-copy.html', 'INDEX_4.HTM', 'index copy 2.html', 'index(5).html'];
  for (const file of copies) await put(root, `dist/copies/${file}`, page('/', 'noindex'));
  await put(root, 'dist/sitemap.xml', sitemap([...publicRoutes.map(route => origin + route), `${origin}/copies/index%202.html`]));
  const report = await auditDeploymentFiles({ projectRoot: root });
  assert.equal(report.issues.filter(issue => issue.code === 'STRAY_INDEX_COPY').length, copies.length);
  hasIssue(report, 'STRAY_INDEX_COPY', 'copies/index 2.html');
  assert.equal(report.inventory.find(file => file.file === 'copies/index 2.html').owner, 'sitemap');
});

test('URL normalization preserves path case and safely decodes Unicode and XML paths', () => {
  const cases = [
    ['HTTPS://WWW.DDNZGLOBAL.COM:443/', 'index.html'], [origin, 'index.html'],
    [`${origin}/route`, 'route/index.html'], [`${origin}/route/`, 'route/index.html'],
    [`${origin}/route/index.html`, 'route/index.html'],
    [`${origin}/blog/Case-Sensitive/`, 'blog/Case-Sensitive/index.html'],
    [`${origin}/blog/caf%C3%A9/`, 'blog/café/index.html'], [`${origin}/blog/cafe\u0301/`, 'blog/café/index.html'],
    [`${origin}/blog/a%26b/`, 'blog/a&b/index.html'],
    [`${origin}/blog/para-evitar-costosas-retenciones-en-puerto./`, 'blog/para-evitar-costosas-retenciones-en-puerto./index.html'],
  ];
  for (const [url, expected] of cases) assert.equal(sitemapLocationToFile(url), expected, url);
  const xml = sitemap([`${origin}/blog/a&b/`]).replace('/blog/a&amp;b/', '/blog/a&#38;b/');
  assert.deepEqual(sitemapLocations(xml).map(sitemapLocationToFile), ['blog/a&b/index.html']);
  assert.deepEqual(sitemapLocations(sitemap([origin + '/']).replace(`<loc>${origin}/</loc>`, `<loc><![CDATA[${origin}/]]></loc>`)), [origin + '/']);
});

test('unsafe origins and paths fail before URL normalization can hide them', () => {
  const invalid = ['http://www.ddnzglobal.com/', 'https://ddnzglobal.com/', 'https://www.ddnzglobal.com.evil.test/',
    'https://evil.test/', 'https://www.ddnzglobal.com:8443/', 'https://user:password@www.ddnzglobal.com/',
    'https://www.ddnzglobal.com@evil.test/', '//www.ddnzglobal.com/', '/relative/',
    ...['/a/../', '/./', '/a/%2e%2e/', '/%2e/', '/a/%2fsecret/', '/a/%5csecret/', '/%252e%252e/',
      '/%00/', '/%0a/', '/%zz/', '/%ff/', '/a//b/', '/a\\b/', '/a\nb/', '/a/?', '/a/#',
      '/a/?q=1', '/a/#section', '/a/%3fq=1/', '/a/%23hash/', '/C:/outside/'].map(route => origin + route)];
  for (const url of invalid) assert.throws(() => sitemapLocationToFile(url), undefined, url);
});

test('normalized URL collisions and unsafe URLs fail in the actual inventory audit', async t => {
  const root = await fixture(t);
  await put(root, 'dist/sitemap.xml', sitemap([...publicRoutes.map(route => origin + route),
    'https://WWW.DDNZGLOBAL.COM:443/fr/index.html', `${origin}/blog/caf%C3%A9/`,
    `${origin}/fr/%2e%2e/`, 'https://evil.test/fr/', `${origin}/fr/?`]));
  const report = await auditDeploymentFiles({ projectRoot: root });
  hasIssue(report, 'DUPLICATE_SITEMAP_TARGET', 'fr/index.html');
  hasIssue(report, 'DUPLICATE_SITEMAP_TARGET', 'blog/café/index.html');
  assert.equal(report.issues.filter(issue => issue.code === 'INVALID_SITEMAP_URL').length, 3);
});

test('comments and hreflang links do not grant HTML ownership', async t => {
  const root = await fixture(t);
  const ghost = `${origin}/ghost/`;
  const xml = sitemap(publicRoutes.map(route => origin + route)).replace('</urlset>', `<!-- <url><loc>${ghost}</loc></url> --></urlset>`).replace(`href="${origin}/"`, `href="${ghost}"`);
  await put(root, 'dist/sitemap.xml', xml);
  await put(root, 'dist/ghost/index.html', page('/ghost/', 'noindex'));
  hasIssue(await auditDeploymentFiles({ projectRoot: root }), 'UNEXPECTED_HTML', 'ghost/index.html');
});

test('malformed, empty, foreign-namespace and non-URL-set XML fail closed', async t => {
  const valid = sitemap([origin + '/']);
  const invalid = ['', '<urlset></urlset>', '<sitemapindex><sitemap><loc>https://example.test/s.xml</loc></sitemap></sitemapindex>',
    `<!DOCTYPE urlset [<!ENTITY x "${origin}/">]>${valid}`, valid.replace('</urlset>', ''),
    valid.replace('<loc>', '<loc><nested>'), valid.replace('</loc>', `</loc><loc>${origin}/other/</loc>`),
    valid.replace(`<loc>${origin}/</loc>`, ''), valid.replace('/sitemap/0.9', '/sitemap/evil'),
    valid.replace(`${origin}/</loc>`, `${origin}/bad&entity;/</loc>`), valid.replace('</url>', '</wrong>'),
    valid.replace('<url>', '<url>unexpected text')];
  for (const xml of invalid) assert.throws(() => sitemapLocations(xml), undefined, xml);
  const root = await fixture(t);
  await put(root, 'dist/sitemap.xml', invalid[5]);
  hasIssue(await auditDeploymentFiles({ projectRoot: root }), 'INVALID_SITEMAP');
});

test('missing sitemap pages and required generator artifacts are reported', async t => {
  const root = await fixture(t);
  const missing = ['fr/index.html', 'audio-speakers/index.html', 'screen-protectors/brief/index.html', '404.html', 'yandex_d492e0480d36c2c1.html', 'blog/old-article/index.html'];
  for (const file of missing) await fs.unlink(path.join(root, 'dist', file));
  const report = await auditDeploymentFiles({ projectRoot: root });
  assert.deepEqual(report.issues.filter(issue => issue.code === 'MISSING_HTML').map(issue => issue.file), missing.sort());
});

test('missing dist and missing sitemap fail without creating either', async t => {
  const root = await fixture(t);
  const absent = path.join(root, 'not-built');
  hasIssue(await auditDeploymentFiles({ projectRoot: root, distDir: absent }), 'INVENTORY_READ_ERROR');
  await assert.rejects(fs.stat(absent), { code: 'ENOENT' });
  await fs.unlink(path.join(root, 'dist/sitemap.xml'));
  const before = await snapshot(root);
  hasIssue(await auditDeploymentFiles({ projectRoot: root }), 'INVALID_SITEMAP');
  assert.equal(await snapshot(root), before);
});

test('brief and redirect noindex must be real metadata, not comments or script strings', async t => {
  const root = await fixture(t);
  const brief = 'dist/screen-protectors/brief/index.html';
  await put(root, brief, page('/screen-protectors/brief/', 'index', '<!-- <meta name="robots" content="noindex"> --><script>const fake = \'<meta name="robots" content="noindex">\';</script>'));
  await put(root, 'dist/audio-speakers/index.html', moved('/sourcing/audio-speakers-from-china/').replace('noindex,follow', 'index,follow'));
  let report = await auditDeploymentFiles({ projectRoot: root });
  hasIssue(report, 'MISSING_NOINDEX', 'screen-protectors/brief/index.html');
  hasIssue(report, 'MISSING_NOINDEX', 'audio-speakers/index.html');
  await put(root, brief, page('/screen-protectors/brief/', 'noindex').replace('<meta name="robots" content="noindex">', "<META CONTENT='NOINDEX, NOFOLLOW' NAME='ROBOTS'>"));
  report = await auditDeploymentFiles({ projectRoot: root });
  assert.ok(!report.issues.some(issue => issue.file === 'screen-protectors/brief/index.html'));
});

test('redirect targets, fallback canonical and exact verification bytes constrain exceptions', async t => {
  const root = await fixture(t);
  await put(root, 'dist/audio-speakers/index.html', moved('/sourcing/outdoor-products-from-china/'));
  await put(root, 'dist/blog/old-article/index.html', moved('/blog/new-article', true).replace(`0;url=${origin}`, '0;url=https://evil.test'));
  await put(root, 'dist/404.html', page('/fr/'));
  await put(root, 'dist/yandex_d492e0480d36c2c1.html', verification + '<p>stale page</p>');
  const report = await auditDeploymentFiles({ projectRoot: root });
  for (const file of ['audio-speakers/index.html', 'blog/old-article/index.html', '404.html', 'yandex_d492e0480d36c2c1.html']) hasIssue(report, 'INVALID_ARTIFACT', file);
});

test('noindex-only exceptions cannot also be sitemap pages', async t => {
  const root = await fixture(t);
  await put(root, 'dist/sitemap.xml', sitemap([...publicRoutes.map(route => origin + route), `${origin}/screen-protectors/brief/`, `${origin}/audio-speakers/`, `${origin}/blog/old-article/`]));
  const report = await auditDeploymentFiles({ projectRoot: root });
  for (const file of ['screen-protectors/brief/index.html', 'audio-speakers/index.html', 'blog/old-article/index.html']) hasIssue(report, 'OWNERSHIP_CONFLICT', file);
});

test('redirects require current manifest ownership and sitemap-owned destinations', async t => {
  const root = await fixture(t);
  await put(root, 'src/data/notionRedirects.json', JSON.stringify([redirects[1], { from: '/blog/not-generated', to: '/blog/missing' }]));
  await put(root, 'dist/blog/not-generated/index.html', moved('/blog/missing', true));
  let report = await auditDeploymentFiles({ projectRoot: root });
  hasIssue(report, 'UNEXPECTED_HTML', 'blog/old-article/index.html');
  hasIssue(report, 'REDIRECT_TARGET_NOT_IN_SITEMAP', 'blog/not-generated/index.html');
  await put(root, 'src/data/notionRedirects.json', '{invalid json');
  hasIssue(await auditDeploymentFiles({ projectRoot: root }), 'INVALID_REDIRECT_MANIFEST');
  await put(root, 'src/data/notionRedirects.json', JSON.stringify([{ from: '/blog/../escape', to: '/blog/new-article' }, { from: '/blog/old-article', to: 'https://evil.test/' }, redirects[1], redirects[1]]));
  report = await auditDeploymentFiles({ projectRoot: root });
  hasIssue(report, 'INVALID_REDIRECT_MANIFEST');
  hasIssue(report, 'OWNERSHIP_CONFLICT', 'ar/blog/saber-2025/index.html');
  await fs.unlink(path.join(root, 'src/data/notionRedirects.json'));
  report = await auditDeploymentFiles({ projectRoot: root });
  hasIssue(report, 'UNEXPECTED_HTML', 'ar/blog/saber-2025/index.html');
});

test('an absent optional redirect manifest passes only when no old redirect outputs remain', async t => {
  const root = await fixture(t);
  await fs.unlink(path.join(root, 'src/data/notionRedirects.json'));
  for (const redirect of redirects) await fs.unlink(path.join(root, `dist${redirect.from}/index.html`));
  assert.deepEqual((await auditDeploymentFiles({ projectRoot: root })).issues, []);
});

test('file, directory, dangling, sitemap and root symlinks fail without being followed', async t => {
  const root = await fixture(t);
  await put(root, 'outside/secret.html', 'must not appear in the inventory');
  await fs.symlink(path.join(root, 'outside'), path.join(root, 'dist/linked-directory'));
  await fs.symlink(path.join(root, 'outside/secret.html'), path.join(root, 'dist/linked.html'));
  await fs.symlink(path.join(root, 'absent'), path.join(root, 'dist/dangling.html'));
  let report = await auditDeploymentFiles({ projectRoot: root });
  for (const file of ['linked-directory', 'linked.html', 'dangling.html']) hasIssue(report, 'SYMLINK', file);
  assert.ok(report.inventory.every(file => !file.file.includes('linked') && !file.file.includes('secret')));
  await fs.rename(path.join(root, 'dist/sitemap.xml'), path.join(root, 'outside/sitemap.xml'));
  await fs.symlink(path.join(root, 'outside/sitemap.xml'), path.join(root, 'dist/sitemap.xml'));
  report = await auditDeploymentFiles({ projectRoot: root });
  hasIssue(report, 'INVALID_SITEMAP');
  assert.equal(report.summary.sitemapPages, 0);
  await fs.symlink(path.join(root, 'outside'), path.join(root, 'linked-root'));
  const before = await snapshot(root);
  report = await auditDeploymentFiles({ projectRoot: root, distDir: path.join(root, 'linked-root') });
  hasIssue(report, 'INVENTORY_READ_ERROR');
  assert.equal(report.summary.htmlFiles, 0);
  assert.equal(report.summary.sitemapPages, 0);
  assert.equal(await snapshot(root), before);
});

test('case-sensitive sitemap ownership never silently folds URL paths', async t => {
  const root = await fixture(t);
  await put(root, 'dist/sitemap.xml', sitemap(publicRoutes.map(route => origin + route.replace('Case-Sensitive', 'case-sensitive'))));
  const report = await auditDeploymentFiles({ projectRoot: root });
  hasIssue(report, 'MISSING_HTML', 'blog/case-sensitive/index.html');
  hasIssue(report, 'UNEXPECTED_HTML', 'blog/Case-Sensitive/index.html');
});

test('standalone CLI defaults to its own project, supports output copies, and rejects mutation flags', async t => {
  const root = await fixture(t);
  await put(root, 'scripts/audit-deployment-files.mjs', await fs.readFile(script));
  const result = spawnSync(process.execPath, [path.join(root, 'scripts/audit-deployment-files.mjs')], { cwd: os.tmpdir(), encoding: 'utf8', timeout: 10000 });
  assert.equal(result.status, 0, result.stderr);
  await fs.cp(path.join(root, 'dist'), path.join(root, 'release-copy'), { recursive: true });
  assert.equal(cli(root, ['--dist', path.join(root, 'release-copy')]).status, 0);
  const before = await snapshot(root);
  const bad = cli(root, ['--fix']);
  assert.equal(bad.status, 2);
  assert.match(bad.stderr, /Unknown or repeated option: --fix/);
  assert.equal(await snapshot(root), before);
  for (const args of [['--dist'], ['--clean'], ['--delete'], ['constructor'], ['--dist', 'one', '--dist', 'two']]) assert.throws(() => parseArguments(args));
});
