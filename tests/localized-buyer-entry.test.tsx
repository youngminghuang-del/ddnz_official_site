import test from 'node:test';
import assert from 'node:assert/strict';
import {buyerEntryCopy,renderLocalizedEntry} from '../src/features/buyer-entry/localized.mjs';
import {packageCopy} from '../src/features/commercial-kitchen/packageLocalization';
import {sanitizeQuoteContext} from '../src/lib/quoteLinkPolicy.mjs';
const shape=(value:any,p=''):string[]=>value&&typeof value==='object'?Object.entries(value).flatMap(([k,v])=>shape(v,`${p}.${k}`)):[p];
const decode=(s:string)=>s.replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>');
test('all seven buying-entry translations cover the same complete content without English fallback',()=>{
 for(const [locale,copy] of Object.entries(buyerEntryCopy)){
  assert.deepEqual(shape(copy),shape(buyerEntryCopy.zh),locale);
  for(const kind of ['cases','films','vegetables','refrigeration','kitchen']){
   const html=renderLocalizedEntry(kind,locale,packageCopy[locale as keyof typeof packageCopy].scenarios);
   assert.ok(!html.includes('undefined'));assert.ok(!html.includes('Scenario brief'));assert.ok(!html.includes('Request matching'));assert.ok(!html.includes('{name}'));
   assert.ok(html.includes(`dir="${locale==='ar'?'rtl':'ltr'}"`));
   assert.equal((html.match(/<article>/g)||[]).length,{cases:4,films:3,vegetables:3,refrigeration:5,kitchen:6}[kind as 'cases']);
   const prefix=locale==='zh'?'/zh-cn':`/${locale}`;
   for(const [,href] of html.matchAll(/href="([^"]+)"/g))assert.ok(href.startsWith('#')||href.startsWith(prefix+'/'),href);
   assert.equal((html.match(/data-quote-context=/g)||[]).length,1);
   const context=JSON.parse(decode(html.match(/data-quote-context="([^"]+)"/)![1]));
   assert.deepEqual({...sanitizeQuoteContext(context)},context);
   assert.equal(context.productScope,(copy as any)[kind].scope);
   assert.ok(html.includes(`href="${prefix}/get-a-quote/"`));
   if(kind==='cases'){assert.equal((html.match(/href="#style-/g)||[]).length,5);assert.ok(html.includes('#style-fabric-feishile'));}
   if(kind==='films')for(const id of ['og28','001','titan-hd','titan-privacy'])assert.ok(html.includes('#phone-product-'+id));
   if(kind==='kitchen'){assert.equal((html.match(/class="entry-media"/g)||[]).length,3);assert.equal((html.match(/class="entry-brief-preview"/g)||[]).length,3);}
  }
 }
 assert.equal(renderLocalizedEntry('cases','zh-cn'),renderLocalizedEntry('cases','zh'));
});
