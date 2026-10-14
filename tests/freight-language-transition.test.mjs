import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';

test('Portuguese and Turkish country routes tolerate previous language context during navigation', async () => {
  const temporary = mkdtempSync(join(tmpdir(), 'ddnz-language-transition-'));
  const bundle = join(temporary, 'render.cjs');
  try {
    // Match the production prerenderer: bundle CJS dependencies and omit CSS;
    // browser regression separately verifies rendered styling and interactions.
    await build({ stdin: { contents: `
      import {renderToStaticMarkup} from 'react-dom/server';
      import {MemoryRouter} from 'react-router-dom';
      import {HelmetProvider} from 'react-helmet-async';
      import {LanguageProvider} from './src/contexts/LanguageContext';
      import Page from './src/pages/InternationalCountryPage';
      export function render(previous, locale) {
        return renderToStaticMarkup(<HelmetProvider><MemoryRouter initialEntries={['/'+locale+'/shipping-from-china-to-qatar/']}><LanguageProvider initialLanguage={previous}><Page/></LanguageProvider></MemoryRouter></HelmetProvider>);
      }`, resolveDir: process.cwd(), loader: 'tsx' }, outfile: bundle, bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', loader: { '.css': 'empty' }, define: { 'import.meta.env': JSON.stringify({ DEV: false, PROD: true, MODE: 'production', BASE_URL: '/' }) }, logLevel: 'silent' });
    const { render } = createRequire(import.meta.url)(bundle);
    for (const previous of ['en', 'ar', 'pt', 'tr']) {
      for (const locale of ['pt', 'tr']) {
        const html = render(previous, locale);
        assert.equal((html.match(/<h1\b/g) || []).length, 1);
        assert.match(html, new RegExp(`<main[^>]+lang="${locale}"`));
        assert.doesNotMatch(html, /undefined|NaN/);
      }
    }
  } finally { rmSync(temporary, { recursive: true, force: true }); }
});
