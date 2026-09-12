import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES } from '../src/features/screen-protectors/routes.mjs';
import { prepareScreenProtectorSeo } from './prepare-screen-protector-seo.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const urlNodes = xml => xml.match(/<url>[\s\S]*?<\/url>/g) || [];
const sitemapUrls = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);

async function assertSafeDestination(target, expectedRoot) {
  const relative = path.relative(expectedRoot, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Output is outside its allowed root.');
  if (await fs.realpath(expectedRoot) !== expectedRoot) throw new Error('Output root cannot be a symbolic link.');
  let current = expectedRoot;
  for (const segment of relative.split(path.sep)) {
    current = path.join(current, segment);
    try {
      if ((await fs.lstat(current)).isSymbolicLink()) throw new Error('Output path cannot contain a symbolic link: ' + current);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

export async function finalizeScreenProtectorPages({ sitemapPath, outputDir } = {}) {
  const root = await fs.realpath(projectRoot);
  if (await fs.realpath(process.cwd()) !== root) throw new Error('Run the finalizer from its own project root.');
  const dist = path.join(root, 'dist');
  const publicRoot = path.join(root, 'public');
  const destinations = Object.values(ROUTES).map(route => route.slice(1) + '/index.html');
  const distSitemap = path.join(dist, 'sitemap.xml');
  const publicSitemap = path.join(publicRoot, 'sitemap.xml');
  for (const file of [...destinations, 'sitemap.xml']) await assertSafeDestination(path.join(dist, file), dist);
  await assertSafeDestination(publicSitemap, publicRoot);
  const baselineSitemap = sitemapPath || distSitemap;
  const previous = await fs.readFile(baselineSitemap, 'utf8');
  const previousNodes = urlNodes(previous);
  if (!previousNodes.length) throw new Error('The generated site sitemap must contain existing entries.');
  const overlay = await prepareScreenProtectorSeo({ buildRoot: dist, outputDir, production: true, sitemapPath: baselineSitemap });
  if (overlay.pages.length !== 8 || new Set(overlay.pages.map(page => page.file)).size !== 8 || overlay.pages.some(page => !destinations.includes(page.file))) throw new Error('Unexpected phone-page output list.');
  const merged = await fs.readFile(path.join(overlay.output, 'sitemap.xml'), 'utf8');
  if (previousNodes.some(node => !merged.includes(node))) throw new Error('Existing sitemap entries changed.');
  const urls = sitemapUrls(merged);
  for (const [page, route] of Object.entries(ROUTES)) {
    const present = urls.includes('https://www.ddnzglobal.com' + route + '/');
    if ((page === 'quote' && present) || (page !== 'quote' && !present)) throw new Error('Unexpected phone-page indexing: ' + page);
  }
  const brief = await fs.readFile(path.join(overlay.output, ROUTES.quote.slice(1), 'index.html'), 'utf8');
  if (!/name="robots"[^>]*noindex/.test(brief)) throw new Error('The sourcing brief must remain noindex.');
  for (const page of overlay.pages) {
    const target = path.join(dist, page.file);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(path.join(overlay.output, page.file), target);
  }
  await fs.copyFile(path.join(overlay.output, 'sitemap.xml'), distSitemap);
  await fs.copyFile(path.join(overlay.output, 'sitemap.xml'), publicSitemap);
  return { mode: 'static-pages-finalized-not-deployed', pages: 8, publicPhonePages: 7, previousSitemapUrls: sitemapUrls(previous).length, sitemapUrls: urls.length, overlay: overlay.output };
}

if (process.argv[1] && await fs.realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length > 2) throw new Error('This finalizer takes no command-line arguments.');
    console.log(JSON.stringify(await finalizeScreenProtectorPages(), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
