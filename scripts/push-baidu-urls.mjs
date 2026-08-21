import fs from 'node:fs/promises';

const DEFAULT_SITE = 'https://www.ddnzglobal.com';
const DEFAULT_SITEMAP = 'https://www.ddnzglobal.com/sitemap.xml';

function readArgument(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function loadSitemap(source) {
  if (!/^https?:\/\//i.test(source)) {
    return fs.readFile(source, 'utf8');
  }

  let lastError;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const separator = source.includes('?') ? '&' : '?';
      const response = await fetch(`${source}${separator}deployed=${Date.now()}`, {
        headers: { 'cache-control': 'no-cache' },
      });
      if (!response.ok) {
        throw new Error(`Sitemap returned HTTP ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < 6) {
        console.log(`Sitemap is not ready yet (attempt ${attempt}/6); retrying in 10 seconds.`);
        await wait(10_000);
      }
    }
  }

  throw lastError;
}

function extractSiteUrls(xml, site, recentDays) {
  const siteOrigin = new URL(site).origin;
  const cutoff = recentDays > 0 ? Date.now() - recentDays * 24 * 60 * 60 * 1000 : null;
  const urls = [...xml.matchAll(/<url>(.*?)<\/url>/gs)].flatMap((entry) => {
    const value = entry[1].match(/<loc>(.*?)<\/loc>/s)?.[1]?.trim().replaceAll('&amp;', '&');
    const lastmod = entry[1].match(/<lastmod>(.*?)<\/lastmod>/s)?.[1]?.trim();
    if (!value) return [];

    try {
      if (new URL(value).origin !== siteOrigin) return [];
    } catch {
      return [];
    }

    if (cutoff) {
      if (!lastmod) return [];
      const modifiedAt = Date.parse(lastmod);
      if (!Number.isFinite(modifiedAt) || modifiedAt < cutoff) return [];
    }

    return [value];
  });

  return [...new Set(urls)];
}

async function main() {
  const token = process.env.BAIDU_PUSH_TOKEN?.trim();
  if (!token) {
    console.log('BAIDU_PUSH_TOKEN is not configured; skipping Baidu URL submission.');
    return;
  }

  const site = readArgument('--site', DEFAULT_SITE);
  const sitemap = readArgument('--sitemap', DEFAULT_SITEMAP);
  const recentDays = Number(readArgument('--recent-days', '0'));
  const xml = await loadSitemap(sitemap);
  const urls = extractSiteUrls(xml, site, recentDays);

  if (urls.length === 0) {
    if (recentDays > 0) {
      console.log(`No sitemap URLs were modified in the last ${recentDays} day(s); skipping Baidu submission.`);
      return;
    }
    throw new Error('No valid same-site URLs were found in the sitemap.');
  }

  const endpoint = `http://data.zz.baidu.com/urls?site=${encodeURIComponent(site)}&token=${encodeURIComponent(token)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: urls.join('\n'),
  });
  const responseText = await response.text();

  let result;
  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error(`Baidu returned a non-JSON response (HTTP ${response.status}).`);
  }

  if (!response.ok || result.error) {
    throw new Error(`Baidu submission failed: ${result.message || result.error || `HTTP ${response.status}`}`);
  }

  console.log(`Baidu accepted ${result.success ?? 0} of ${urls.length} URLs.`);
  console.log(`Baidu daily submission quota remaining: ${result.remain ?? 'unknown'}.`);

  if (result.not_same_site?.length) {
    console.warn(`Rejected as a different site: ${result.not_same_site.length} URL(s).`);
  }
  if (result.not_valid?.length) {
    console.warn(`Rejected as invalid: ${result.not_valid.length} URL(s).`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
