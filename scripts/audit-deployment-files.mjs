import { lstat, readdir, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Read-only, dependency-free deployment gate. Run AFTER generate-static-pages.ts
// and finalize-screen-protector-pages.mjs (and alongside audit-seo-output.mjs):
//   node scripts/audit-deployment-files.mjs
// No build, cleanup, network calls, or source-generator imports occur here.
const defaultProjectRoot = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://www.ddnzglobal.com';
const htmlExtension = /\.(?:html?|xhtml|shtml)$/i;
const indexCopy = /^index(?:[\s._-]+(?:\d+|copy|duplicate|副本).*|\s*\(\d+\))\.(?:html?|xhtml|shtml)$/i;
const verificationFile = 'yandex_d492e0480d36c2c1.html';
const briefFile = 'screen-protectors/brief/index.html';
const aliasTargets = [
  ['commercial-kitchen', 'sourcing/commercial-kitchen-equipment-from-china'],
  ['audio-speakers', 'sourcing/audio-speakers-from-china'],
  ['mobile-accessories', 'sourcing/mobile-accessories-from-china'],
  ['outdoor-products', 'sourcing/outdoor-products-from-china'],
];

function decodeXml(value) {
  return value.replace(/&(?:#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);|&/gi, entity => {
    const named = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" };
    if (Object.hasOwn(named, entity)) return named[entity];
    const numeric = /^&#(x[\da-f]+|\d+);$/i.exec(entity);
    const code = numeric && (numeric[1][0].toLowerCase() === 'x'
      ? Number.parseInt(numeric[1].slice(1), 16) : Number(numeric[1]));
    if (!numeric || !(code === 9 || code === 10 || code === 13
      || (code >= 32 && code <= 0xd7ff) || (code >= 0xe000 && code <= 0xfffd)
      || (code >= 0x10000 && code <= 0x10ffff))) throw new Error('Invalid XML entity.');
    return String.fromCodePoint(code);
  });
}

function xmlAttributes(source) {
  const attributes = Object.create(null);
  const pattern = /\s+([\w:.-]+)\s*=\s*(?:"([^"<]*)"|'([^'<]*)')/gy;
  let offset = 0;
  while (source.slice(offset).trim()) {
    pattern.lastIndex = offset;
    const match = pattern.exec(source);
    if (!match || Object.hasOwn(attributes, match[1])) throw new Error('Invalid or duplicate XML attribute.');
    attributes[match[1]] = decodeXml(match[2] ?? match[3]);
    offset = pattern.lastIndex;
  }
  return attributes;
}

// Deliberately accepts the URL-set vocabulary emitted by the current generators,
// not sitemap indexes, DTDs, or arbitrary nested <loc> text. Comments and hreflang
// links never grant ownership. Unsupported/malformed XML fails closed.
export function sitemapLocations(xml) {
  const source = xml.replace(/^\uFEFF/, '').replace(/<!--([\s\S]*?)-->/g, (_, body) => {
    if (body.includes('--')) throw new Error('Invalid XML comment.');
    return '';
  }).trim().replace(/^<\?xml\s[^?]*\?>\s*/, '');
  const root = /^<urlset\b((?:[^<>"']|"[^"<]*"|'[^'<]*')*)>([\s\S]*)<\/urlset\s*>$/.exec(source);
  if (!root) throw new Error('Expected a complete URL-set sitemap (no DTD or sitemap index).');
  const namespaces = xmlAttributes(root[1]);
  if (namespaces.xmlns !== 'http://www.sitemaps.org/schemas/sitemap/0.9') {
    throw new Error('Unexpected sitemap namespace.');
  }
  const locations = [];
  const urls = /<url\s*>([\s\S]*?)<\/url\s*>/g;
  let end = 0;
  for (const url of root[2].matchAll(urls)) {
    if (root[2].slice(end, url.index).trim()) throw new Error('Unexpected content in sitemap URL set.');
    end = url.index + url[0].length;
    const nodes = /<(loc|lastmod|changefreq|priority)\s*>([\s\S]*?)<\/\1\s*>|<xhtml:link\b((?:[^<>"']|"[^"<]*"|'[^'<]*')*)\/>/g;
    let nodeEnd = 0;
    const locs = [];
    for (const node of url[1].matchAll(nodes)) {
      if (url[1].slice(nodeEnd, node.index).trim()) throw new Error('Unexpected content inside sitemap URL.');
      nodeEnd = node.index + node[0].length;
      if (node[1]) {
        const cdata = /^<!\[CDATA\[([^]*?)\]\]>$/.exec(node[2]);
        if (!cdata && /[<>]/.test(node[2])) throw new Error('Nested markup in sitemap text.');
        const value = cdata ? cdata[1] : decodeXml(node[2]);
        if (node[1] === 'loc') locs.push(value.trim());
      } else {
        if (namespaces['xmlns:xhtml'] !== 'http://www.w3.org/1999/xhtml') throw new Error('Unexpected hreflang namespace.');
        xmlAttributes(node[3]);
      }
    }
    if (url[1].slice(nodeEnd).trim() || locs.length !== 1 || !locs[0]) {
      throw new Error('Each sitemap URL must contain exactly one nonempty loc.');
    }
    locations.push(locs[0]);
  }
  if (root[2].slice(end).trim() || !locations.length) throw new Error('Sitemap URL set is empty or malformed.');
  return locations;
}

// Inspect raw segments BEFORE WHATWG URL parsing can erase dot segments. Only
// the canonical HTTPS origin is accepted; host case/default :443 normalize via
// URL. Decode path segments once, preserve case, normalize Unicode to NFC for
// macOS/Linux inventories, and reject encoded separators/double encoding.
// /route, /route/ and /route/index.html identify the same physical HTML file.
export function sitemapLocationToFile(location) {
  if (typeof location !== 'string') throw new Error('Expected a URL string.');
  const value = location.trim();
  const parts = /^(https?):\/\/([^/?#]+)([^?#]*)$/i.exec(value);
  if (!parts || /[\u0000-\u0020\u007f\\]/.test(value) || /[@%]/.test(parts[2])) {
    throw new Error('Expected an absolute HTTPS URL without credentials, query, fragment, or unsafe characters.');
  }
  const url = new URL(value);
  if (url.origin !== origin || url.username || url.password) throw new Error(`URL must use ${origin}.`);
  const rawPath = parts[3] || '/';
  if (!rawPath.startsWith('/') || rawPath.includes('//')) throw new Error('Empty or repeated path separators.');
  const rawSegments = rawPath === '/' ? [] : rawPath.slice(1).replace(/\/$/, '').split('/');
  const segments = rawSegments.map(segment => {
    const decoded = decodeURIComponent(segment).normalize('NFC');
    if (!decoded || decoded === '.' || decoded === '..'
      || /[\u0000-\u001f\u007f-\u009f/\\%?#<>"*:|]/.test(decoded)) {
      throw new Error('Unsafe path segment (traversal, separator, control character, or repeated encoding).');
    }
    return decoded;
  });
  const relative = segments.join('/');
  const file = relative && !rawPath.endsWith('/') && htmlExtension.test(relative)
    ? relative : (relative ? `${relative}/index.html` : 'index.html');
  if (path.posix.isAbsolute(file) || file.split('/').includes('..')) throw new Error('Path escapes deployment root.');
  return file;
}

function decodeHtmlAttribute(value) {
  // HTML permits literal ampersands in prose and URL query strings. Decode the
  // references emitted by our generators without applying XML's bare-& error.
  return value.replace(/&(?:#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, entity => decodeXml(entity.toLowerCase()));
}

function headTags(html) {
  // Do not accept fake directives in comments, scripts, or inert HTML content.
  const active = html.replace(/<!--[^]*?-->/g, '').replace(/<(script|style|template|title|textarea|noscript)\b[^>]*>[^]*?<\/\1\s*>/gi, '');
  const head = /<head\b[^>]*>([^]*?)<\/head\s*>/i.exec(active)?.[1] || '';
  return [...head.matchAll(/<(meta|link)\b((?:[^<>"']|"[^"<>]*"|'[^'<>]*')*)>/gi)].map(tag => {
    const attributes = Object.create(null);
    for (const attr of tag[2].matchAll(/([^\s=/'"<>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
      const key = attr[1].toLowerCase();
      if (Object.hasOwn(attributes, key)) throw new Error('Duplicate HTML metadata attribute.');
      attributes[key] = decodeHtmlAttribute(attr[2] ?? attr[3] ?? attr[4]);
    }
    return { ...attributes, tag: tag[1].toLowerCase() };
  });
}

/**
 * Inspect a finished deployment without changing it. Only regular HTML files
 * owned by dist/sitemap.xml or the exact generator artifacts below are allowed.
 * Returns sorted inventory/issues and ok=false on missing, unsafe, or stale data.
 * projectRoot selects the source manifest/public verification file; distDir may
 * select a separate output copy. Neither option creates directories or files.
 */
export async function auditDeploymentFiles({ projectRoot = defaultProjectRoot, distDir } = {}) {
  const root = path.resolve(projectRoot);
  const dist = path.resolve(distDir ?? path.join(root, 'dist'));
  const issues = [];
  const files = new Map();
  const expected = new Map();
  const sitemapFiles = new Set();
  const issue = (code, file, message) => issues.push({ code, file, message });
  const own = (file, owner) => {
    if (expected.has(file)) issue('OWNERSHIP_CONFLICT', file, `Already owned by ${expected.get(file).kind}; also claimed by ${owner.kind}.`);
    else expected.set(file, owner);
  };
  const foldedPaths = new Map();
  async function walk(directory, prefix = '') {
    for (const name of (await readdir(directory)).sort()) {
      const actual = path.join(directory, name);
      const relative = `${prefix}${name}`.normalize('NFC');
      const key = relative.toLowerCase();
      if (foldedPaths.has(key)) issue('PATH_COLLISION', relative, `Case/Unicode collision with ${foldedPaths.get(key)}.`);
      else foldedPaths.set(key, relative);
      const stat = await lstat(actual);
      if (stat.isSymbolicLink()) issue('SYMLINK', relative, 'Symbolic links are not allowed; target was not followed.');
      else if (stat.isDirectory()) await walk(actual, `${relative}/`);
      else if (!stat.isFile()) issue('SPECIAL_FILE', relative, 'Cannot inventory a non-regular filesystem entry.');
      else if (htmlExtension.test(name)) files.set(relative, actual);
    }
  }
  let resolvedDist;
  try {
    const stat = await lstat(dist);
    if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error('Deployment root must be a directory, not a symbolic link.');
    resolvedDist = await realpath(dist);
    await walk(resolvedDist);
  } catch (error) {
    issue('INVENTORY_READ_ERROR', '.', error.message);
  }
  try {
    // The walker reports symlinks, but never read even a symlinked sitemap.
    if (!resolvedDist) throw new Error('Deployment root could not be safely opened.');
    const sitemap = path.join(resolvedDist, 'sitemap.xml');
    if (!(await lstat(sitemap)).isFile()) throw new Error('Sitemap must be a regular file.');
    for (const location of sitemapLocations(await readFile(sitemap, 'utf8'))) {
      try {
        const file = sitemapLocationToFile(location);
        if (sitemapFiles.has(file)) issue('DUPLICATE_SITEMAP_TARGET', file, `Multiple URLs resolve to the same HTML file: ${location}`);
        else {
          sitemapFiles.add(file);
          own(file, { kind: 'sitemap', reason: location });
        }
      } catch (error) {
        issue('INVALID_SITEMAP_URL', 'sitemap.xml', `${JSON.stringify(location)}: ${error.message}`);
      }
    }
    if (!sitemapFiles.has('index.html')) issue('MISSING_SITEMAP_ROOT', 'sitemap.xml', 'The generated homepage must be in the sitemap.');
  } catch (error) {
    issue('INVALID_SITEMAP', 'sitemap.xml', error.message);
  }

  // generate-static-pages.ts: four exact legacy showcase redirects, plus the
  // root 404 SPA shell. Its fallback deliberately inherits homepage metadata;
  // noindex is NOT required for that exact artifact (the host supplies 404).
  for (const [from, to] of aliasTargets) own(`${from}/index.html`, {
    kind: 'legacy-alias', reason: 'generate-static-pages.ts showcaseAliasRedirects',
    target: `${to}/index.html`, noindex: true, redirect: true,
  });
  own('404.html', { kind: 'spa-fallback', reason: 'generate-static-pages.ts root fallback', target: 'index.html' });
  // The finalizer copies eight phone pages, with only this one omitted from the
  // sitemap. Its temporary overlay/manifest does not authorize extra dist HTML.
  own(briefFile, { kind: 'noindex-brief', reason: 'finalize-screen-protector-pages.mjs ROUTES.quote', target: briefFile, noindex: true });
  // Vite copies this exact public verification file. No public/*.html wildcard.
  own(verificationFile, { kind: 'site-verification', reason: `public/${verificationFile}` });

  const redirectManifest = 'src/data/notionRedirects.json';
  try {
    const redirects = JSON.parse(await readFile(path.join(root, redirectManifest), 'utf8'));
    if (!Array.isArray(redirects)) throw new Error('Expected a JSON array.');
    for (const [index, redirect] of redirects.entries()) {
      try {
        const articlePath = /^\/(?:(?:zh-cn|ru|fr|es|ar|pt|tr)\/)?blog\/[^/%?#]+\/?$/;
        if (!articlePath.test(redirect?.from) || !articlePath.test(redirect?.to)) throw new Error('Expected explicit same-origin article route paths.');
        const file = sitemapLocationToFile(origin + redirect.from.replace(/\/?$/, '/'));
        const target = sitemapLocationToFile(origin + redirect.to.replace(/\/?$/, '/'));
        if (file === target) throw new Error('Self redirect is not an artifact.');
        own(file, { kind: 'article-redirect', reason: `${redirectManifest}[${index}]`, target, noindex: true, redirect: true });
      } catch (error) {
        issue('INVALID_REDIRECT_MANIFEST', redirectManifest, `Entry ${index}: ${error.message}`);
      }
    }
  } catch (error) {
    // The generator itself skips an absent manifest. Old redirects then become
    // unexpected HTML; malformed/unreadable manifests must not silently pass.
    if (error.code !== 'ENOENT') issue('INVALID_REDIRECT_MANIFEST', redirectManifest, error.message);
  }

  for (const [file, owner] of expected) {
    if (!files.has(file)) {
      issue('MISSING_HTML', file, `Missing output owned by ${owner.kind} (${owner.reason}).`);
      continue;
    }
    if (owner.redirect && !sitemapFiles.has(owner.target)) {
      issue('REDIRECT_TARGET_NOT_IN_SITEMAP', file, `Redirect target ${owner.target} must be a sitemap-owned page.`);
    }
    if (owner.kind === 'sitemap') continue;
    try {
      const bytes = await readFile(files.get(file));
      if (owner.kind === 'site-verification') {
        if (!bytes.equals(await readFile(path.join(root, 'public', verificationFile)))) {
          issue('INVALID_ARTIFACT', file, `Must exactly match public/${verificationFile}.`);
        }
        continue;
      }
      const html = bytes.toString('utf8');
      const tags = headTags(html);
      const canonicals = tags.filter(tag => tag.tag === 'link' && tag.rel?.toLowerCase().split(/\s+/).includes('canonical'));
      if (canonicals.length !== 1 || sitemapLocationToFile(canonicals[0].href) !== owner.target) {
        issue('INVALID_ARTIFACT', file, `Expected one same-origin canonical identifying ${owner.target}.`);
      }
      if (owner.noindex) {
        const robots = tags.filter(tag => tag.tag === 'meta' && tag.name?.toLowerCase() === 'robots');
        const tokens = robots.flatMap(tag => (tag.content || '').toLowerCase().split(/[\s,]+/));
        if (!tokens.includes('noindex') || tokens.includes('index')) issue('MISSING_NOINDEX', file, 'Expected an active robots noindex directive without a conflicting index directive.');
      }
      if (owner.redirect) {
        const refreshes = tags.filter(tag => tag.tag === 'meta' && tag['http-equiv']?.toLowerCase() === 'refresh');
        const destination = refreshes.length === 1 && /^0\s*;\s*url\s*=\s*(.+)$/i.exec(refreshes[0].content || '')?.[1];
        if (!destination || sitemapLocationToFile(destination.startsWith('/') ? origin + destination : destination) !== owner.target) {
          issue('INVALID_ARTIFACT', file, `Expected an immediate refresh to ${owner.target}.`);
        }
      }
      if (owner.kind === 'spa-fallback' && !/<div\b[^>]*\bid\s*=\s*["']root["']/i.test(html)) {
        issue('INVALID_ARTIFACT', file, 'Expected the generated SPA fallback root.');
      }
    } catch (error) {
      issue('INVALID_ARTIFACT', file, error.message);
    }
  }
  for (const file of files.keys()) {
    if (indexCopy.test(path.posix.basename(file))) issue('STRAY_INDEX_COPY', file, 'Local index copy is forbidden, even if present in the sitemap or marked noindex.');
    if (!expected.has(file)) issue('UNEXPECTED_HTML', file, 'Not owned by the sitemap or an explicitly justified generated artifact; noindex alone does not grant ownership.');
  }
  issues.sort((a, b) => {
    const left = `${a.file}\0${a.code}\0${a.message}`;
    const right = `${b.file}\0${b.code}\0${b.message}`;
    return left < right ? -1 : left > right ? 1 : 0;
  });
  return {
    ok: issues.length === 0,
    distDir: dist,
    summary: { htmlFiles: files.size, sitemapPages: sitemapFiles.size, explicitArtifacts: [...expected.values()].filter(owner => owner.kind !== 'sitemap').length, failures: issues.length },
    inventory: [...files.keys()].sort().map(file => ({ file, owner: expected.get(file)?.kind ?? null })),
    issues,
  };
}

export function parseArguments(args) {
  const options = {};
  const names = new Map([['--dist', 'distDir'], ['--project-root', 'projectRoot']]);
  for (let i = 0; i < args.length; i++) {
    const option = names.get(args[i]);
    if (!option || Object.hasOwn(options, option)) throw new Error(`Unknown or repeated option: ${args[i]}`);
    const value = args[++i];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${args[i - 1]}`);
    options[option] = value;
  }
  return options;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length === 3 && process.argv[2] === '--help') {
      console.log('Usage: node scripts/audit-deployment-files.mjs [--dist DIRECTORY] [--project-root DIRECTORY]\nRead-only HTML inventory audit; defaults to this repository and its dist directory. Run after both static generators.');
    } else {
      const report = await auditDeploymentFiles(parseArguments(process.argv.slice(2)));
      console.log(JSON.stringify({ ok: report.ok, distDir: report.distDir, ...report.summary }, null, 2));
      if (!report.ok) {
        console.error('Deployment HTML inventory audit failed:\n' + report.issues.map(item => `- [${item.code}] ${JSON.stringify(item.file)}: ${item.message}`).join('\n'));
        process.exitCode = 1;
      }
    }
  } catch (error) {
    console.error(`Deployment HTML inventory audit: ${error.message}`);
    process.exitCode = 2;
  }
}
