import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MarketFreightContent,marketMetadata} from '../src/features/freight/MarketFreightContent';
import {gulfLocales,gulfLanguagePrefix} from '../src/features/freight/gulfLocale';
import {marketLocaleData} from '../src/features/freight/marketLocaleData';
for(const locale of gulfLocales) for(const country of ['nigeria','peru'] as const){
 test(`${country}/${locale}: localized evidence and destination-specific quote survive SSR`,()=>{
  const html=renderToStaticMarkup(createElement(MarketFreightContent,{country,locale}));
  const prefix=gulfLanguagePrefix(locale);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.equal((html.match(/class="gulf-chapter-top"/g)||[]).length,4);
  assert(html.includes(`${prefix}/get-a-quote/?leadGoal=Freight+Export&amp;source=${country}_country&amp;dest=${country==='peru'?'Peru':'Nigeria'}`));
  for(const anchor of html.matchAll(/href="#([^"]+)"/g))assert(html.includes(`id="${anchor[1]}"`),anchor[1]);
  assert(!/<video[^>]*autoplay/i.test(html));
  assert(html.includes(country==='nigeria'?'son.png':'sunat.gif'));
  if(country==='nigeria'){assert(html.includes('ceramic-tiles-3.jpg'));assert(html.includes('9.438'));assert(html.includes('9.44'));assert(html.includes('son.gov.ng/soncap-faq/'));}
  else{assert(html.includes('4.5'));assert(!html.includes('9.44'));assert(html.includes('sunat.gob.pe'));}
  if(locale!=='en'){
   const d=marketLocaleData[locale];assert(html.includes(d[country].heading));
   assert(html.includes(`.${locale}.vtt`)||country==='peru');
   assert(!html.includes('View full image')&&!html.includes('Questions buyers ask'));
   assert(marketMetadata(country,locale).title===d[country].title);
   for(const link of html.matchAll(/href="(\/[^"#?]+)/g)){if(link[1].startsWith('/media/')||link[1].startsWith('/images/'))continue;assert(link[1].startsWith(prefix+'/'),link[1]);}
  }
  if(locale==='ar')assert(html.includes('dir="rtl"'));
 });
}
