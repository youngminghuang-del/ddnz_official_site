import test from 'node:test';
import assert from 'node:assert/strict';
import { transformSync } from '@babel/core';
import plugin from '../scripts/quote-link-babel-plugin.mjs';
import { quoteLinkProps,normalizeQuoteHtml,sanitizeQuoteContext,saveQuoteContext,readQuoteContext,quoteParamsForLocation,clearQuoteContext } from '../src/lib/quoteLinkPolicy.mjs';
const store=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}};
globalThis.window={location:{origin:'https://www.ddnzglobal.com'},sessionStorage:store(),localStorage:store()};
test('eight languages emit plain links and retain multilingual briefs outside href',()=>{
 for(const locale of ['', 'zh-cn/','ar/','fr/','ru/','es/','pt/','tr/']){
  const p=quoteLinkProps(`/${locale}get-a-quote/?overviewBrief=${encodeURIComponent('需求 طلب русский & quote "')}&leadGoal=Product+Sourcing&source=products_index`);
  assert.equal(p.href,`/${locale}get-a-quote/`);assert.match(JSON.parse(p['data-quote-context']).overviewBrief,/需求 طلب русский/);
 }
});
test('external links, hashes, downloads and non-quote parameters are unchanged',()=>{
 for(const s of ['https://other.test/get-a-quote/?notes=x','#form','mailto:sales@example.com','/manual.pdf?download=1','/sourcing/mobile/?model=CK-129'])assert.deepEqual(quoteLinkProps(s),{href:s});
});
test('unknown enum identifiers are rejected; free destination text stays in local brief',()=>{
 const d=sanitizeQuoteContext({dest:'my project city',model:'invented',phoneLocale:'xx',cargo:'General cargo',overviewBrief:'exact scope',industry:'Exact product',subcategory:'free product description'});
 assert.equal(d.dest,undefined);assert.equal(d.destinationText,'my project city');assert.equal(d.model,undefined);assert.equal(d.phoneLocale,undefined);assert.equal(d.cargo,'General cargo');assert.equal(d.overviewBrief,'exact scope');assert.equal(d.productScope,'free product description');
});
test('HTML processing is escaped and idempotent without modifying title, body text or script strings',()=>{
 const input='<title>Unchanged | DDNZ Global</title><main><h1>Unchanged</h1><a class="cta" href="/fr/get-a-quote/?source=article&amp;notes=%22%3E%3Cscript%3E">Quote</a></main><script>const example=\'<a href="/get-a-quote/?notes=x">\';</script>';
 const out=normalizeQuoteHtml(input);assert.match(out,/href="\/fr\/get-a-quote\/"/);assert.match(out,/data-quote-context=".*&quot;/);assert.ok(out.includes('<title>Unchanged | DDNZ Global</title>'));assert.ok(out.includes(input.slice(input.indexOf('<script>'))));assert.equal(normalizeQuoteHtml(out),out);
});
test('handoffs survive same-tab and new-tab storage contexts; old query URLs preserve behavior',()=>{
 saveQuoteContext('/ar/get-a-quote/',{source:'products_index',overviewBrief:'Arabic request',leadGoal:'Product Sourcing'});
 assert.equal(quoteParamsForLocation('', '/ar/get-a-quote/').get('overviewBrief'),'Arabic request');
 window.sessionStorage=store();assert.equal(readQuoteContext('/ar/get-a-quote/').overviewBrief,'Arabic request');
 assert.equal(quoteParamsForLocation('?overviewBrief=legacy&dest=Free+Legacy+Place','/ar/get-a-quote/').get('dest'),'Free Legacy Place');
 assert.equal(readQuoteContext('/fr/get-a-quote/'),null);clearQuoteContext('/ar/get-a-quote/');assert.equal(readQuoteContext('/ar/get-a-quote/'),null);
});
test('expired and malformed storage never blocks the form',()=>{
 saveQuoteContext('/get-a-quote/',{notes:'expired'},1000);assert.equal(readQuoteContext('/get-a-quote/',601001),null);
 window.localStorage.setItem('ddnz_quote_context_v2:/get-a-quote/','invalid');assert.doesNotThrow(()=>readQuoteContext('/get-a-quote/'));
});
test('compiler applies policy to anchors and router links before React creates DOM',()=>{
 const output=transformSync('const c=<><a href={href}>A</a><Link to={target}>B</Link><motion.a href="/get-a-quote/?notes=x">C</motion.a></>',{plugins:[plugin],parserOpts:{plugins:['jsx']},configFile:false,babelrc:false}).code;
 assert.match(output,/import.*quoteLinkProps/);assert.equal((output.match(/\.\.\._quoteLinkProps/g)||[]).length,3);
});
test('React Router path objects retain hashes while removing quote queries',()=>{
 const result=quoteLinkProps({pathname:'/fr/get-a-quote/',search:'?leadGoal=Product+Sourcing&overviewBrief=Scope',hash:'#brief'},'to');
 assert.deepEqual(result.to,{pathname:'/fr/get-a-quote/',search:'',hash:'#brief'});
 assert.equal(JSON.parse(result['data-quote-context']).leadGoal,'Product Sourcing');
});
test('same-tab handoff works when both browser storage APIs are blocked',()=>{
 const previous=window;
 const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')},removeItem(){throw Error('blocked')}};
 try {
  globalThis.window={location:previous.location,sessionStorage:blocked,localStorage:blocked};
  saveQuoteContext('/get-a-quote/',{leadGoal:'Product Sourcing',overviewBrief:'Memory fallback'});
  assert.equal(quoteParamsForLocation('','/get-a-quote/').get('overviewBrief'),'Memory fallback');
  clearQuoteContext('/get-a-quote/');assert.equal(readQuoteContext('/get-a-quote/'),null);
 } finally {globalThis.window=previous;}
});
