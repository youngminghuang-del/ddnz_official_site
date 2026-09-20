import fs from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import FreightReleaseContent, { freightReleasePaths } from '../src/features/freight/FreightReleaseContent';
import { freightLanguages } from '../src/features/freight/freightLanguages';

// Local preparation only. Copies only files referenced by the 24 release pages.
const source = process.argv[2];
if (!source) throw new Error('Provide the approved preview public directory.');
const assets = new Set<string>();
for (const language of freightLanguages) for (const route of freightReleasePaths) {
  const html = renderToStaticMarkup(createElement(FreightReleaseContent, {path: route, language}));
  for (const match of html.matchAll(/(?:src|poster|href)="(\/(?:images|media)\/[^"?#]+)"/g)) assets.add(match[1]);
}
for (const asset of assets) {
  const input = path.join(source, asset);
  const output = path.join('public', asset);
  if (!fs.existsSync(input)) throw new Error(`Missing approved asset: ${asset}`);
  if (fs.existsSync(output)) {
    if (!fs.readFileSync(input).equals(fs.readFileSync(output))) throw new Error(`Existing production asset differs: ${asset}`);
    continue;
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.copyFileSync(input, output);
}
console.log(`Staged ${assets.size} referenced freight assets; existing production assets preserved.`);
