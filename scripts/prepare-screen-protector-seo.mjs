import { readFile, writeFile, mkdir, mkdtemp, readdir, realpath, lstat } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { ROUTES } from '../src/features/screen-protectors/routes.mjs';
import { renderScreenProtectorHead, renderScreenProtectorBody, appendScreenProtectorSitemap, screenProtectorMetadata } from '../src/features/screen-protectors/seo.mjs';

const candidateRoot = fileURLToPath(new URL('../', import.meta.url));
const defaultShell = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div></body></html>';

function replaceRoot(html, body) {
  const open = /<div\b[^>]*\bid=["']root["'][^>]*>/i.exec(html);
  if (!open) throw new Error('Build shell must contain one React root div.');
  const start = open.index + open[0].length;
  const tags = /<!--[^]*?-->|<\/?div\b[^>]*>/gi;
  tags.lastIndex = start;
  let depth = 1;
  let match;
  while ((match = tags.exec(html))) {
    if (match[0].startsWith('<!--')) continue;
    depth += /^<\/div/i.test(match[0]) ? -1 : 1;
    if (depth === 0) return html.slice(0, start) + body + html.slice(match.index);
  }
  throw new Error('React root div was not balanced.');
}

export function renderScreenProtectorHtml(shell, pathname, { preview = true } = {}) {
  const meta = screenProtectorMetadata(pathname, { preview });
  if (!/<head\b[^>]*>[^]*?<\/head>/i.test(shell)) throw new Error('Build shell needs a complete head.');
  let html = shell.replace(/<html\b[^>]*>/i, '<html lang="en" dir="ltr">');
  html = html.replace(/<head\b[^>]*>([^]*?)<\/head>/i, (_, head) => {
    const retained = head
      .replace(/<title\b[^>]*>[^]*?<\/title>/gi, '')
      .replace(/<meta\b(?=[^>]*(?:name|property)\s*=\s*["'](?:title|description|keywords|robots|googlebot|bingbot|og:[^"']*|twitter:[^"']*|article:[^"']*)["'])[^>]*>/gi, '')
      .replace(/<link\b(?=[^>]*rel\s*=\s*["']canonical["'])[^>]*>/gi, '')
      .replace(/<link\b(?=[^>]*rel\s*=\s*["']alternate["'])(?=[^>]*hreflang)[^>]*>/gi, '')
      .replace(/<script\b(?=[^>]*type\s*=\s*["']application\/ld\+json["'])[^>]*>[^]*?<\/script>/gi, '');
    return `<head>${retained}\n${renderScreenProtectorHead(pathname, { preview })}\n</head>`;
  });
  return replaceRoot(html, renderScreenProtectorBody(meta.page));
}

function isInside(child, parent) {
  const relative = path.relative(parent, child);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

async function freshOutput(directory, buildRoot) {
  if (!directory) return mkdtemp(path.join(os.tmpdir(), 'ddnz-screen-protector-seo-'));
  if (!path.isAbsolute(directory)) throw new Error('--output-dir must be absolute.');
  const output = path.resolve(directory);
  if (isInside(output, candidateRoot) || (buildRoot && (isInside(output, buildRoot) || isInside(buildRoot, output)))) {
    throw new Error('Output must be separate from source and build roots. Build inputs are read-only.');
  }
  try {
    if ((await lstat(output)).isSymbolicLink()) throw new Error('Output cannot be a symbolic link.');
    if ((await readdir(output)).length) throw new Error('Output directory must be new or empty; existing files are not overwritten.');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await mkdir(output, { recursive: true });
  }
  const resolved = await realpath(output);
  if (isInside(resolved, candidateRoot) || (buildRoot && (isInside(resolved, buildRoot) || isInside(buildRoot, resolved)))) throw new Error('Resolved output overlaps source or build.');
  return resolved;
}

export async function prepareScreenProtectorSeo({ buildRoot, outputDir, production = false, sitemapPath } = {}) {
  if (production && !buildRoot) throw new Error('Production metadata requires an explicit --build-root.');
  if (buildRoot && !path.isAbsolute(buildRoot)) throw new Error('--build-root must be absolute.');
  const build = buildRoot ? await realpath(buildRoot) : undefined;
  const shell = build ? await readFile(path.join(build, 'index.html'), 'utf8') : defaultShell;
  if (production && /local integration review|__LOCAL_CANDIDATE__|name=["']robots["'][^>]*noindex/i.test(shell)) {
    throw new Error('Refusing to make a local/noindex build indexable. Supply the separately reviewed production build.');
  }
  if (production && !/<script\b[^>]*src=["']\/assets\/[^"']+\.js["']/i.test(shell)) throw new Error('Production input must be a built website shell with its entry assets.');
  const sitemapSource = sitemapPath || (build ? path.join(build, 'sitemap.xml') : path.join(candidateRoot, 'public/sitemap.xml'));
  const previousSitemap = await readFile(sitemapSource, 'utf8');
  const nextSitemap = appendScreenProtectorSitemap(previousSitemap);
  const output = await freshOutput(outputDir, build);
  const pages = [];
  for (const [page, pathname] of Object.entries(ROUTES)) {
    const destination = path.join(output, pathname.slice(1), 'index.html');
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, renderScreenProtectorHtml(shell, pathname, { preview: !production }), { flag: 'wx' });
    pages.push({ page, path: pathname, file: path.relative(output, destination), indexable: production && page !== 'quote' });
  }
  const sitemapFile = production ? 'sitemap.xml' : 'sitemap.proposed.xml';
  await writeFile(path.join(output, sitemapFile), nextSitemap, { flag: 'wx' });
  const manifest = {
    mode: production ? 'production-overlay-not-deployed' : 'noindex-review',
    buildRoot: build || null, pages, sitemapFile,
    notes: [
      'This is an eight-page HTML overlay, not a complete website or deployment approval.',
      'Build inputs, existing routes, robots.txt, redirects and media are not modified.',
      'Preserve the matching build assets and media when merging this overlay into a release copy.',
      'The proposed sitemap preserves all existing entries and adds only missing public screen-protector routes.',
      'No fabricated language alternates or VideoObject markup are emitted. The brief is always noindex.',
      'Review normal enquiry delivery, CDN headers, route status codes and rollback before publishing.',
    ],
  };
  await writeFile(path.join(output, 'screen-protector-seo-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  return { output, ...manifest };
}

export function parseArguments(args) {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--production') options.production = true;
    else if (['--build-root', '--output-dir', '--sitemap'].includes(arg)) {
      const value = args[++i];
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`);
      options[({ '--build-root': 'buildRoot', '--output-dir': 'outputDir', '--sitemap': 'sitemapPath' })[arg]] = value;
    } else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    const result = await prepareScreenProtectorSeo(parseArguments(process.argv.slice(2)));
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
