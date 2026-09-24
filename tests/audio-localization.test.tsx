import React from 'react';import test from 'node:test';import assert from 'node:assert/strict';import {renderToStaticMarkup} from 'react-dom/server';import fs from 'node:fs';
import AudioContent from '../src/features/audio/AudioContent';import {audioCopy,audioPath,audioAlternates,type AudioLocale} from '../src/features/audio/copy';import {navigationPath,supportedNavigationLanguages} from '../src/lib/productLanguageRouting';
test('seven audio bodies contain native ranges, six configuration checks, four sample steps and real media',()=>{
 for(const locale of Object.keys(audioCopy) as AudioLocale[]){const c=audioCopy[locale],html=renderToStaticMarkup(<AudioContent locale={locale}/>);assert.equal(c.families.length,3);assert.equal(c.checks.length,6);assert.equal(c.steps.length,4);assert.ok(html.includes(c.title));assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.equal((html.match(/<video\b/g)||[]).length,3);assert.ok(html.includes(`dir="${locale==='ar'?'rtl':'ltr'}"`));
 for(const match of html.matchAll(/(?:src|poster)="(\/[^"?]+)"/g))assert.ok(fs.existsSync('public'+match[1]),match[1]);
 assert.equal(navigationPath(audioPath,locale),`/${locale==='zh'?'zh-cn':locale}${audioPath}/`);assert.equal(supportedNavigationLanguages(audioPath).length,8);assert.equal(audioAlternates().length,8);
 }
});

import AudioAssortments from '../src/features/audio/AudioAssortments';
import assortments from '../src/features/audio/assortments.json';
test('all eight seller assortments preserve local quotation paths and chosen product scope',()=>{
 for(const locale of Object.keys(assortments) as (keyof typeof assortments)[]){
  const html=renderToStaticMarkup(<AudioAssortments locale={locale}/>);
  assert.equal((html.match(/<article\b/g)||[]).length,12);
  assert.ok(html.includes('Amazon'));assert.ok(html.includes('Noon'));assert.ok(html.includes('Jumia'));
  const links=[...html.matchAll(/href="([^"]+)"/g)].map(m=>new URL(m[1].replaceAll('&amp;','&'),'https://www.ddnzglobal.com'));
  assert.equal(links.length,9);
  for(const link of links){assert.equal(link.pathname,`${locale==='en'?'':`/${locale==='zh'?'zh-cn':locale}`}/get-a-quote/`);assert.ok(link.searchParams.get('productScope'));assert.equal(link.searchParams.get('source'),'audio_assortments');}
 }
});
