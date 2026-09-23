import React from 'react';import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {renderToStaticMarkup} from 'react-dom/server';
import FilmGuideContent,{filmGuideInquiry,guideAssets} from '../src/features/film-guide/FilmGuideContent';import {filmGuideCopy,filmGuideKind,type FilmGuideLocale,filmGuidePath,filmGuideAlternates} from '../src/features/film-guide/copy';import {navigationPath} from '../src/lib/productLanguageRouting';
test('seven guides render eleven selectable specifications, two localized guide links and eight alternates',()=>{
 for(const locale of Object.keys(filmGuideCopy) as FilmGuideLocale[]){const c=filmGuideCopy[locale],html=renderToStaticMarkup(<FilmGuideContent locale={locale}/>);assert.equal(c.checks.length,11);assert.equal((html.match(/type="checkbox"/g)||[]).length,11);assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.ok(html.includes(c.title));assert.ok(html.includes(c.labels[3]));assert.equal(filmGuideAlternates().length,8);assert.equal(navigationPath(filmGuidePath,locale),`/${locale==='zh'?'zh-cn':locale}${filmGuidePath}/`);
 const url=new URL(filmGuideInquiry(locale,[0,4,10],'Sample before order & <check>'),'https://example.com');const brief=url.searchParams.get('overviewBrief')!;for(const i of [0,4,10])assert.ok(brief.includes(c.checks[i]));assert.ok(!brief.includes(c.checks[1]));assert.ok(brief.includes('Sample before order & <check>'));assert.equal(url.pathname,`/${locale==='zh'?'zh-cn':locale}/get-a-quote/`);
 }
 for(const name of guideAssets)assert.ok(fs.existsSync('public/screen-protector-media/assets/'+name));
});

test('fourteen detail bodies preserve cost factors, process explanations, media and relevant checks',()=>{
 for(const locale of Object.keys(filmGuideCopy) as FilmGuideLocale[])for(const kind of ['price-differences','curved-glass'] as const){
  const c=filmGuideCopy[locale],html=renderToStaticMarkup(<FilmGuideContent locale={locale} kind={kind}/>),price=kind==='price-differences';
  assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.equal((html.match(/<video\b/g)||[]).length,3);assert.equal((html.match(/type="checkbox"/g)||[]).length,price?6:5);
  for(const [,body] of price?c.details.factors:c.details.processes)assert.ok(html.includes(body));
  assert.ok(html.includes(c.details.notes[price?1:3]));
  for(const match of html.matchAll(/(?:src|poster)="(\/[^"?]+)"/g))assert.ok(fs.existsSync('public'+match[1]),match[1]);
  const prefix=locale==='zh'?'zh-cn':locale;
  assert.ok(html.includes(`href="/${prefix}/screen-protectors/guides/price-differences/"`));assert.ok(html.includes(`href="/${prefix}/screen-protectors/guides/curved-glass/"`));
  const request=new URL(filmGuideInquiry(locale,[price?0:6],'test',kind),'https://example.com');assert.ok(request.searchParams.get('overviewBrief')!.startsWith(c.details.heads[price?1:3]));
  assert.equal(filmGuideAlternates(kind).length,8);assert.equal(navigationPath(`${filmGuidePath}/${kind}`,locale),`/${prefix}${filmGuidePath}/${kind}/`);
 }
});

test('seven video pages retain all fourteen media and ten native stage links',()=>{
 for(const locale of Object.keys(filmGuideCopy) as FilmGuideLocale[]){
 const c=filmGuideCopy[locale],html=renderToStaticMarkup(<FilmGuideContent locale={locale} kind="videos"/>);
 assert.equal(c.video.stages.length,10);assert.equal((html.match(/<video\b/g)||[]).length,14);assert.equal((html.match(/type="checkbox"/g)||[]).length,11);assert.ok(html.includes(c.video.title));assert.ok(html.includes(c.video.impact[1]));
 for(let i=0;i<10;i++){assert.ok(html.includes(`href="#production-${i}"`));assert.ok(html.includes(`id="production-${i}"`));assert.ok(html.includes(c.video.stages[i][1]));}
 for(const match of html.matchAll(/(?:src|poster)="(\/[^"?]+)"/g))assert.ok(fs.existsSync('public'+match[1]),match[1]);
 assert.equal(filmGuideAlternates('videos').length,8);assert.ok(filmGuideAlternates('videos').every(a=>a.href.endsWith('/screen-protectors/videos/')));
 assert.ok(new URL(filmGuideInquiry(locale,[3],'test','videos'),'https://example.com').searchParams.get('overviewBrief')!.startsWith(c.video.title));
 }
});

test('video kind resolves localized browser and static paths',()=>{for(const path of ['screen-protectors/videos','/screen-protectors/videos/',...['zh-cn','es','ar','ru','fr','pt','tr'].map(l=>`/${l}/screen-protectors/videos/`)])assert.equal(filmGuideKind(path),'videos');});
