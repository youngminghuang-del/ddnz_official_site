import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');
const localePrefixes = ['zh-cn', 'ru', 'fr', 'es', 'ar'];
const expectedLanguage = { 'zh-cn': 'zh-CN', ru: 'ru', fr: 'fr', es: 'es', ar: 'ar' };

const failures = [];
const notices = [];

const read = (filePath) => fs.readFileSync(filePath, 'utf8');
const matchAll = (source, pattern) => [...source.matchAll(pattern)].map((match) => match[1]);

if (!fs.existsSync(sitemapPath)) {
  throw new Error('dist/sitemap.xml is missing. Run the production build first.');
}

const sitemap = read(sitemapPath);
const urls = matchAll(sitemap, /<loc>([^<]+)<\/loc>/g);
const duplicateUrls = urls.filter((url, index) => urls.indexOf(url) !== index);

if (duplicateUrls.length) failures.push(`Duplicate sitemap URLs: ${[...new Set(duplicateUrls)].join(', ')}`);

for (const absoluteUrl of urls) {
  const url = new URL(absoluteUrl);
  const relative = url.pathname.replace(/^\/+|\/+$/g, '');
  const htmlPath = relative ? path.join(distDir, relative, 'index.html') : path.join(distDir, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    failures.push(`Sitemap target missing: ${url.pathname}`);
    continue;
  }

  const html = read(htmlPath);
  const canonicals = matchAll(html, /<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?>(?:\s*)/gi);
  if (canonicals.length !== 1) failures.push(`${url.pathname}: expected 1 canonical, found ${canonicals.length}`);
  if (canonicals[0] && canonicals[0] !== absoluteUrl) {
    failures.push(`${url.pathname}: canonical ${canonicals[0]} does not match sitemap ${absoluteUrl}`);
  }

  const languageSegments = relative.split('/');
  const locale = localePrefixes.includes(languageSegments[0]) ? languageSegments[0] : 'en';
  const expectedLang = locale === 'en' ? 'en' : expectedLanguage[locale];
  const htmlLang = html.match(/<html\s+[^>]*lang="([^"]+)"/i)?.[1];
  if (htmlLang !== expectedLang) failures.push(`${url.pathname}: html lang is ${htmlLang || 'missing'}, expected ${expectedLang}`);
  const htmlDir = html.match(/<html\s+[^>]*dir="([^"]+)"/i)?.[1];
  if (locale === 'ar' && htmlDir !== 'rtl') failures.push(`${url.pathname}: Arabic page is missing dir="rtl"`);
  if (locale !== 'ar' && htmlDir === 'rtl') failures.push(`${url.pathname}: non-Arabic page incorrectly uses dir="rtl"`);

  const alternates = [...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"\s*\/?>(?:\s*)/gi)]
    .map((match) => ({ language: match[1], href: match[2] }));
  const duplicateLanguages = alternates
    .map((alternate) => alternate.language)
    .filter((language, index, all) => all.indexOf(language) !== index);
  if (duplicateLanguages.length) failures.push(`${url.pathname}: duplicate hreflang ${[...new Set(duplicateLanguages)].join(', ')}`);
  if (!alternates.some((alternate) => alternate.language === 'x-default')) {
    failures.push(`${url.pathname}: missing x-default alternate`);
  }
  if (!alternates.some((alternate) => alternate.href === absoluteUrl)) {
    failures.push(`${url.pathname}: hreflang cluster is missing the self-referencing URL`);
  }

  const descriptions = matchAll(html, /<meta\s+name="description"\s+content="([^"]*)"\s*\/?>(?:\s*)/gi);
  const minimumDescriptionLength = locale === 'zh-cn' ? 20 : 40;
  if (descriptions.length !== 1 || descriptions[0].trim().length < minimumDescriptionLength) {
    failures.push(`${url.pathname}: missing or thin meta description`);
  }

  const jsonLdBlocks = matchAll(html, /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  for (const [index, jsonLd] of jsonLdBlocks.entries()) {
    try {
      JSON.parse(jsonLd);
    } catch (error) {
      failures.push(`${url.pathname}: invalid JSON-LD block ${index + 1}: ${error.message}`);
    }
  }
  if (!jsonLdBlocks.length) notices.push(`${url.pathname}: no static JSON-LD block`);
}

const summary = {
  sitemapUrls: urls.length,
  htmlPagesChecked: urls.length,
  failures: failures.length,
  notices: notices.length,
};

console.log(JSON.stringify(summary, null, 2));
if (notices.length) console.log(`Notices:\n- ${notices.join('\n- ')}`);
if (failures.length) {
  console.error(`Failures:\n- ${failures.join('\n- ')}`);
  process.exitCode = 1;
}
