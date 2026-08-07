import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_SITE = 'https://www.ddnzglobal.com';
const DEFAULT_SITEMAP = 'https://www.ddnzglobal.com/sitemap.xml';
const DEFAULT_ENDPOINT = 'https://api.indexnow.org/indexnow';
const DEFAULT_KEY_FILE = 'public/fc7fa522855ca37b1e4a8060f9311519.txt';
const MAX_URLS_PER_REQUEST = 10_000;

function readArgument(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function loadText(source, attempts = 6) {
  if (!/^https?:\/\//i.test(source)) {
    return fs.readFile(source, 'utf8');
  }

  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const separator = source.includes('?') ? '&' : '?';
      const response = await fetch(`${source}${separator}deployed=${Date.now()}`, {
        headers: { 'cache-control': 'no-cache' },
      });
      if (!response.ok) {
        throw new Error(`${source} returned HTTP ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        console.log(`Resource is not ready yet (attempt ${attempt}/${attempts}); retrying in 10 seconds.`);
        await wait(10_000);
      }
    }
  }

  throw lastError;
}

function extractSitemapUrls(xml, site, recentDays) {
  const siteOrigin = new URL(site).origin;
  const cutoff = recentDays > 0 ? Date.now() - recentDays * 24 * 60 * 60 * 1000 : null;
  const entries = [...xml.matchAll(/<url>(.*?)<\/url>/gs)];

  const urls = entries.flatMap((entry) => {
    const loc = entry[1].match(/<loc>(.*?)<\/loc>/s)?.[1]?.trim().replaceAll('&amp;', '&');
    const lastmod = entry[1].match(/<lastmod>(.*?)<\/lastmod>/s)?.[1]?.trim();
    if (!loc) return [];

    try {
      if (new URL(loc).origin !== siteOrigin) return [];
    } catch {
      return [];
    }

    if (cutoff && lastmod) {
      const modifiedAt = Date.parse(lastmod);
      if (Number.isFinite(modifiedAt) && modifiedAt < cutoff) return [];
    }

    return [loc];
  });

  return [...new Set(urls)].slice(0, MAX_URLS_PER_REQUEST);
}

async function main() {
  const site = readArgument('--site', DEFAULT_SITE).replace(/\/$/, '');
  const sitemap = readArgument('--sitemap', DEFAULT_SITEMAP);
  const endpoint = readArgument('--endpoint', DEFAULT_ENDPOINT);
  const keyFile = readArgument('--key-file', DEFAULT_KEY_FILE);
  const recentDays = Number(readArgument('--recent-days', '0'));
  const dryRun = process.argv.includes('--dry-run');
  const key = (process.env.INDEXNOW_KEY || await fs.readFile(keyFile, 'utf8')).trim();
  const keyFileName = path.basename(keyFile);
  const keyLocation = readArgument('--key-location', `${site}/${keyFileName}`);

  if (!/^[a-zA-Z0-9_-]{8,128}$/.test(key)) {
    throw new Error('IndexNow key must contain 8–128 URL-safe characters.');
  }

  const deployedKey = (await loadText(dryRun ? keyFile : keyLocation)).trim();
  if (deployedKey !== key) {
    throw new Error(`The deployed IndexNow key file does not match ${keyFileName}.`);
  }

  const xml = await loadText(sitemap);
  const urlList = extractSitemapUrls(xml, site, recentDays);

  if (urlList.length === 0) {
    console.log(`No sitemap URLs were modified in the last ${recentDays} day(s); skipping IndexNow.`);
    return;
  }

  if (dryRun) {
    console.log(`IndexNow dry run prepared ${urlList.length} URL(s) for ${new URL(site).host}.`);
    console.log(`Key location: ${keyLocation}`);
    return;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(site).host,
      key,
      keyLocation,
      urlList,
    }),
  });

  if (![200, 202].includes(response.status)) {
    const responseText = await response.text();
    throw new Error(`IndexNow submission failed (HTTP ${response.status}): ${responseText || 'empty response'}`);
  }

  console.log(`IndexNow accepted ${urlList.length} URL(s) with HTTP ${response.status}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
