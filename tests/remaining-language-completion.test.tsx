import test from 'node:test';import assert from 'node:assert/strict';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import fs from 'node:fs';
import Calculator,{calculatorMeta} from '../src/features/screen-protectors/LocalizedCalculator.jsx';
import {translations,translatedText} from '../src/features/site-localization/translate.mjs';
import {EN} from '../src/features/screen-protectors/locales/en.mjs';
import {saveHandoff,readHandoff} from '../src/features/screen-protectors/handoff.mjs';
import {estimate,preset} from '../src/features/screen-protectors/model.mjs';
import {phoneCopy,phoneNumber,restoreLocalizedDraft,validateLocalizedSelection} from '../src/features/screen-protectors/localization.mjs';
import {kitchenCopy,getLocalizedKitchenProducts} from '../src/features/commercial-kitchen/data/localization.mjs';
import {productAlternates,localizedProductPath} from '../src/lib/productLocalization.mjs';
import BuyerDecisionContent from '../src/features/search-intent/BuyerDecisionContent.jsx';
import OriginDestinationOpportunities from '../src/features/freight/OriginDestinationOpportunities';
const languages=['zh','ru','fr','pt','tr','es','ar'];
const tokens=(s:string)=>[...s.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
for(const lang of languages){
 test(`${lang}: complete templates, static calculator, valid language cluster`,()=>{
  for(const [source,target] of Object.entries(translations[lang]) as [string,string][]){assert.ok(target.trim(),source);assert.deepEqual(tokens(target),tokens(source),source);assert.doesNotMatch(target,/[▁�]|access-date=/,source)}
  const body=renderToStaticMarkup(<Calculator locale={lang}/>);assert.equal((body.match(/<h1/g)||[]).length,1);assert.doesNotMatch(body,/undefined|NaN|\[object Object\]/);assert.match(body,/550/);assert.match(body,/130/);assert.equal(calculatorMeta(lang).alternateUrls.length,8);assert.ok(body.includes(calculatorMeta(lang).title.replace(' | DDNZ','')));
  assert.ok(translatedText(EN.calc.formulaCbm,lang).includes('÷'));assert.ok(translatedText(EN.calc.formulaDim,lang).includes('÷'));
  for(const path of ['/screen-protectors/calculator','/phone-cases','/screen-protectors','/portable-power/selection-guide','/sourcing/commercial-kitchen-equipment-from-china'])assert.equal(productAlternates(path).length,8);
 });
 test(`${lang}: calculator handoff retains 100 rows and recalculates every amount`,()=>{
  const state={rows:Array.from({length:100},(_,i)=>({product:'001',model:'Buyer model '+i,qty:500})),packing:'model',charging:'carton',route:'air',requests:[]};const map=new Map();const storage={setItem:(k,v)=>map.set(k,v),getItem:k=>map.get(k)};
  assert.deepEqual(saveHandoff(storage,state),{ok:true});const result=estimate(state.rows,state.packing,state.charging),plan=readHandoff(storage,'?source=screen_protector_planner&leadGoal=Product+Sourcing',Date.now(),lang);
  assert.ok(plan);assert.equal(plan.state.rows.length,100);assert.equal(plan.summary.landedCny,result.air.total);assert.equal(plan.summary.goodsCny,300000);assert.ok(plan.brief.includes('Buyer model 99'));assert.ok(plan.brief.includes(translatedText(EN.calc.scope,lang)));assert.equal(plan.displayLocale,lang);
 });
 test(`${lang}: shared modules have body text and stable destination slugs`,()=>{
  for(const page of ['how-we-work','insights']){const body=renderToStaticMarkup(<BuyerDecisionContent page={page} locale={lang}/>);assert.match(body,/data-buyer-decisions/);assert.doesNotMatch(body,new RegExp('/'+(lang==='zh'?'zh-cn':lang)+'/blog/'));assert.doesNotMatch(body,/Decisions before the next handoff|Start with the question behind/)}
  for(const context of ['middle-east','west-africa','latin-america','central-asia','nigeria']){const body=renderToStaticMarkup(<OriginDestinationOpportunities context={context as any} locale={lang as any}/>);assert.match(body,/<h2/);assert.doesNotMatch(body,/undefined|\[object Object\]/);for(const [,dest]of body.matchAll(/shipping-from-china-to-([^/]+)\//g))assert.match(dest,/^[a-z-]+$/)}
 });
}
test('every localized phone selection survives all language switches without translating buyer data',()=>{
 for(const from of languages)for(const to of languages){const draft={rows:[{product:'001',model:'Buyer model / طراز',qty:phoneNumber(from,1000)}],destination:'Buyer city',notes:'Buyer note'};const restored=restoreLocalizedDraft({locale:from,draft},to);const valid=validateLocalizedSelection(to,restored);assert.ok(valid.valid,`${from} → ${to}`);assert.equal(valid.state.rows[0].qty,1000);assert.equal(valid.state.rows[0].model,draft.rows[0].model);assert.equal(valid.state.notes,draft.notes)}
});
test('kitchen and phone catalogues retain complete field contracts and reference prices',()=>{
 const keys=o=>Object.keys(o).sort();const originals=getLocalizedKitchenProducts('es');
 for(const l of languages){assert.deepEqual(keys(phoneCopy(l)),keys(phoneCopy('es')),l);assert.deepEqual(keys(kitchenCopy(l)),keys(kitchenCopy('es')),l);const products=getLocalizedKitchenProducts(l);assert.equal(products.length,26);products.forEach((p,i)=>{assert.ok(p.name);assert.ok(p.categoryLabel);assert.deepEqual(p.quote,originals[i].quote);assert.equal(p.id,originals[i].id)})}
});
test('reviewed purchasing copy preserves margin division, input limits and destination labels',()=>{
 for(const l of ['zh','ru','fr','pt','tr']){
  const k=kitchenCopy(l),p=phoneCopy(l);
  assert.match(k.margin.formula,/÷/);
  assert.match(k.margin.sellingError,/999999999(?!9)/);
  assert.doesNotMatch(k.margin.sellingError,/9{10,}/);
  assert.doesNotMatch(k.margin.landedError,/9{10,}/);
  assert.doesNotMatch(p.destination,/País y ciudad/);
  assert.doesNotMatch(p.errors.destination,/Indique país/);
  if(l!=='pt')assert.doesNotMatch(k.inquiry.destination,/Destino/);
  assert.equal(k.benchmarks['ae-ice'].name,'COOLBABY HZB-50/AB');
  assert.ok(k.benchmarks['ae-griddle'].name.includes('GR-818'));
  for(const target of Object.values(translations[l]) as string[])assert.doesNotMatch(target,/\b(\w+)(?:\s+\1){3,}\b/i);
 }
 assert.equal(kitchenCopy('zh').countries.Mexico,'墨西哥');
});
