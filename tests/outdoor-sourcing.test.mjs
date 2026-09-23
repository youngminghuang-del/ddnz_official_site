import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {tsImport} from 'tsx/esm/api';
import {outdoorProducts,getProduct,priceAt,FX,OUTDOOR_PATH} from '../src/features/outdoor-sourcing/catalog.mjs';
import {numberInput,quantityInput,runtime,trialDefaults,changeCurrency,referenceInCurrency,trialEconomics,emptyBrief,normalizeBrief,validBrief,buildOutdoorPayload,outdoorEvent} from '../src/features/outdoor-sourcing/buying.mjs';
import {outdoorMetadata} from '../src/features/outdoor-sourcing/seo.mjs';
import {productAlternates,localizedProductPath} from '../src/lib/productLocalization.mjs';
import {submitInquiry} from '../src/features/commercial-kitchen/data/inquiry.mjs';
import {ui} from '../src/features/outdoor-sourcing/copy.mjs';
const {default:Content}=await tsImport('../src/features/outdoor-sourcing/OutdoorContent.jsx',import.meta.url);

test('outdoor prices use the user-approved CNY amount and convert actual source tiers',()=>{
 assert.equal(outdoorProducts.length,9);
 assert.equal(getProduct('sanhe-st').date,'2026-09-14');assert.equal(getProduct('sanhe-st').priceKind,'reference');
 assert.equal(getProduct('sanhe-st').quoteQuantity,undefined);assert.equal(getProduct('sanhe-st').moq,undefined);
 assert.equal(getProduct('sanhe-st').tiers,undefined);assert.equal(priceAt(getProduct('sanhe-st'),100),450);
 assert.equal(FX.cnyPerJpy,7.7762/178.56);
 assert.deepEqual(getProduct('glory-100').tiers,[[2,536.4],[20,509.22],[50,485.49]]);
 assert.deepEqual(getProduct('colku-20').tiers,[[10,828.36],[50,787.59],[200,712.91]]);
 for(const p of outdoorProducts){for(const q of [null,0,-1,1.5,Infinity,1000001])assert.equal(priceAt(p,q),null);if(p.tiers){assert.equal(priceAt(p,p.tiers[0][0]-1),null);p.tiers.forEach(([q,v])=>assert.equal(priceAt(p,q),v));}}
 assert.equal(priceAt(getProduct('tieding-45'),1000),null);
 assert.equal(priceAt(getProduct('colku-20'),49),828.36);assert.equal(priceAt(getProduct('colku-20'),50),787.59);
});
test('numeric entry supports Spanish and Arabic decimals without accepting malformed costs',()=>{
 assert.equal(numberInput('2,50'),2.5);assert.equal(numberInput('٢٫٥٠'),2.5);assert.equal(numberInput('۲٫۵'),2.5);assert.equal(quantityInput('٥٠'),50);
 for(const v of ['',null,'-1','1e3','1,000.25','Infinity','1.2.3'])assert.equal(numberInput(v),null);
 for(const v of ['0','1.5','1000001'])assert.equal(quantityInput(v),null);
});
test('runtime separates stored energy from continuous inverter limit',()=>{
 const p=getProduct('sanhe-st');assert.ok(Math.abs(runtime(p,'60','85').hours-2.8106666667)<1e-8);
 assert.equal(runtime(p,'301','85').status,'overload');assert.equal(runtime(p,'300','85').status,'complete');
 for(const [load,efficiency] of [['0','85'],['60','101'],['','85'],['60','0']])assert.equal(runtime(p,load,efficiency).status,'incomplete');
 assert.equal(runtime(getProduct('tieding-45'),'60','85').status,'incomplete');
});
test('trial economics allocates batch fees and separates recoverable tax cash from margin',()=>{
 const s={...trialDefaults(),goods:'350',quantity:'10',freight:'1000',fees:'200',tax:'30',prep:'20',vat:'40',sale:'800',channel:'10'};
 let r=trialEconomics(s);assert.equal(r.landed,520);assert.equal(r.cash,5600);assert.equal(r.contribution,200);assert.equal(r.margin,25);
 r=trialEconomics({...s,quantity:'20'});assert.equal(r.landed,460);assert.equal(r.cash,10000);
 r=trialEconomics({...s,vat:'0'});assert.equal(r.landed,520);assert.equal(r.cash,5200);assert.equal(r.contribution,200);
 assert.ok(trialEconomics({...s,sale:'400'}).contribution<0);
 for(const change of [{fees:''},{vat:''},{tax:'-1'},{quantity:'0'},{sale:'0'},{channel:'101'},{currency:'JPY'}])assert.equal(trialEconomics({...s,...change}).status,'incomplete');
});
test('currency changes clear entered values and USD references divide by CNY per USD',()=>{
 const d=trialDefaults();assert.equal(referenceInCurrency({...d,currency:'USD',rate:'7'}),64.29);
 assert.equal(referenceInCurrency({...d,currency:'USD',rate:'0'}),null);
 const converted=changeCurrency({...d,freight:'100',sale:'500'},'USD');assert.equal(converted.goods,'');assert.equal(converted.freight,'');assert.equal(converted.sale,'');
 assert.equal(referenceInCurrency({...d,id:'colku-20',quantity:'1'}),null);
});
test('brief carries chosen model, quantities and verification scope in every language',()=>{
 const d=emptyBrief();d.rows=[{id:'sanhe-st',quantity:'٢٠'}];d.checks=['factory','shipment'];Object.assign(d.form,{name:'Preview Buyer',email:'preview@example.invalid',destination:'Mexico',voltage:'120V / 60Hz / type B',notes:'Run lights at 40W'});
 assert.equal(validBrief(d,true),true);assert.equal(validBrief(d,false),false);
 for(const locale of ['en','es','ar']){const p=buildOutdoorPayload(d,locale);assert.ok(p.message.includes('3HZ-300ST'));assert.ok(p.message.includes('CNY 450.00'));assert.ok(p.message.includes('120V'));assert.ok(p.message.includes(ui.steps[0].title[locale]));assert.ok(p.message.includes(ui.reference[locale]));}
 const n=normalizeBrief({...d,rows:[...d.rows,...d.rows,{id:'unknown',quantity:3}],checks:['factory','unknown','factory']});assert.equal(n.rows.length,1);assert.deepEqual(n.checks,['factory']);
 assert.equal(validBrief({...d,rows:[{id:'sanhe-st',quantity:'1.5'}]},true),false);
 assert.equal(validBrief({...d,rows:[]},true),true);
 assert.equal(validBrief({...d,rows:[],form:{...d.form,notes:''}},true),false);
});
test('local outdoor enquiries never transmit and analytics excludes free text',async()=>{
 let count=0;const result=await submitInquiry(buildOutdoorPayload(emptyBrief()),{hostname:'127.0.0.1',fetchImpl:()=>{count++;throw Error('No network');}});
 assert.equal(result.mode,'preview');assert.equal(count,0);assert.equal(outdoorEvent('en','buyer@email.com'),null);
 assert.deepEqual(Object.keys(outdoorEvent('es','add_product').params),['content_group','content_language','journey_action']);
});
test('all authored outdoor pages render readable sources, media and reciprocal metadata',()=>{
 for(const locale of ['en','es','ar']){
  const html=renderToStaticMarkup(React.createElement(Content,{locale}));
  assert.equal((html.match(/<h1>/g)||[]).length,1);assert.equal((html.match(/id="product-/g)||[]).length,9);
  for(const id of ['outdoor-range','power-matching','supply-prices','trial-economics','supplier-checks','buying-brief'])assert.ok(html.includes(`id="${id}"`));
  assert.ok(html.includes(`lang="${locale}" dir="${locale==='ar'?'rtl':'ltr'}"`));
  assert.ok(html.includes('CNY 450.00')||locale!=='en');assert.ok(html.includes(ui.reference[locale]));
  assert.doesNotMatch(html,/NaN|undefined|\[object Object\]|Supplier [A-D]|EXW|FOB|formspree\.io/);
  assert.doesNotMatch(html,/<td[^>]*>[^<]*JPY/);assert.doesNotMatch(html,/@3hz|\+86|Victor/);
  for(const [,src]of html.matchAll(/<img[^>]*src="([^"]+)"/g))assert.ok(fs.existsSync(new URL('../public'+src,import.meta.url)),src);
  const meta=outdoorMetadata(locale);assert.equal(meta.path,localizedProductPath(OUTDOOR_PATH,locale));assert.equal(meta.schema['@graph'][0].inLanguage,locale);assert.equal(productAlternates(OUTDOOR_PATH).length,8);assert.doesNotMatch(JSON.stringify(meta.schema),/AggregateRating|priceCurrency|availability/);
 }
});
