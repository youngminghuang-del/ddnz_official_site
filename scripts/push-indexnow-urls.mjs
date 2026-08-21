import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_SITE = 'https://www.ddnzglobal.com';
const DEFAULT_SITEMAP = 'https://www.ddnzglobal.com/sitemap.xml';
const DEFAULT_ENDPOINT = 'https://api.indexnow.org/indexnow';
const DEFAULT_KEY_FILE = 'public/fc7fa522855ca37b1e4a8060f9311519.txt';
const MAX_URLS_PER_RUN = 10_000;
const DEFAULT_DELAY_MS = 100;
const MAX_SUBMISSION_ATTEMPTS = 3;

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

    if (cutoff) {
      if (!lastmod) return [];
      const modifiedAt = Date.parse(lastmod);
      if (!Number.isFinite(modifiedAt) || modifiedAt < cutoff) return [];
    }

    return [loc];
  });

  return [...new Set(urls)].slice(0, MAX_URLS_PER_RUN);
}

async function submitUrl({ endpoint, url, key, keyLocation, delayMs }) {
  const requestUrl = new URL(endpoint);
  requestUrl.searchParams.set('url', url);
  requestUrl.searchParams.set('key', key);
  requestUrl.searchParams.set('keyLocation', keyLocation);

  for (let attempt = 1; attempt <= MAX_SUBMISSION_ATTEMPTS; attempt += 1) {
    const response = await fetch(requestUrl, { method: 'GET' });
    if ([200, 202].includes(response.status)) return response.status;

    const responseText = await response.text();
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === MAX_SUBMISSION_ATTEMPTS) {
      throw new Error(
        `IndexNow submission failed for ${url} (HTTP ${response.status}): ${responseText || 'empty response'}`,
      );
    }

    const retryDelay = Math.max(delayMs, 1_000) * attempt;
    console.log(
      `IndexNow returned HTTP ${response.status} for ${url}; retrying in ${retryDelay}ms (${attempt}/${MAX_SUBMISSION_ATTEMPTS}).`,
    );
    await wait(retryDelay);
  }

  throw new Error(`IndexNow submission failed for ${url}.`);
}

async function main() {
  const site = readArgument('--site', DEFAULT_SITE).replace(/\/$/, '');
  const sitemap = readArgument('--sitemap', DEFAULT_SITEMAP);
  const endpoint = readArgument('--endpoint', DEFAULT_ENDPOINT);
  const keyFile = readArgument('--key-file', DEFAULT_KEY_FILE);
  const recentDays = Number(readArgument('--recent-days', '0'));
  const delayMs = Number(readArgument('--delay-ms', String(DEFAULT_DELAY_MS)));
  const dryRun = process.argv.includes('--dry-run');
  const key = (process.env.INDEXNOW_KEY || await fs.readFile(keyFile, 'utf8')).trim();
  const keyFileName = path.basename(keyFile);
  const keyLocation = readArgument('--key-location', `${site}/${keyFileName}`);

  if (!/^[a-zA-Z0-9_-]{8,128}$/.test(key)) {
    throw new Error('IndexNow key must contain 8–128 URL-safe characters.');
  }

  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new Error('IndexNow delay must be a non-negative number of milliseconds.');
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
    console.log(`IndexNow streaming dry run prepared ${urlList.length} URL(s) for ${new URL(site).host}.`);
    console.log(`Key location: ${keyLocation}`);
    console.log(`Delay between URL notifications: ${delayMs}ms.`);
    return;
  }

  const statusCounts = new Map();
  for (const [index, url] of urlList.entries()) {
    const status = await submitUrl({ endpoint, url, key, keyLocation, delayMs });
    statusCounts.set(status, (statusCounts.get(status) || 0) + 1);

    if ((index + 1) % 25 === 0 || index === urlList.length - 1) {
      console.log(`IndexNow streaming progress: ${index + 1}/${urlList.length} URL(s).`);
    }
    if (index < urlList.length - 1 && delayMs > 0) await wait(delayMs);
  }

  const statusSummary = [...statusCounts.entries()]
    .map(([status, count]) => `HTTP ${status}: ${count}`)
    .join(', ');
  console.log(`IndexNow accepted ${urlList.length} streaming URL notification(s) (${statusSummary}).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
