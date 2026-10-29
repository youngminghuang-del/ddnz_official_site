import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import EquipmentBuyingSupport,{buyingSupportQuote,type EquipmentFamily} from '../src/features/equipment-buying-support/EquipmentBuyingSupport';
import copy from '../src/features/equipment-buying-support/copy.json';

test('equipment terms preserve same-language product inquiry routing and complete family-specific requirements',()=>{
 for(const locale of Object.keys(copy) as (keyof typeof copy)[]){
  const briefs:string[]=[];
  for(const family of ['kitchen','ice','refrigeration'] as EquipmentFamily[]){
   const url=new URL(buyingSupportQuote(locale,family),'https://www.ddnzglobal.com');
   assert.equal(url.pathname,`${locale==='en'?'':`/${locale==='zh'?'zh-cn':locale}`}/get-a-quote/`);
   assert.equal(url.searchParams.get('leadGoal'),'Product Sourcing');
   assert.equal(url.searchParams.get('industry'),'Commercial Kitchen Equipment');
   const brief=url.searchParams.get('overviewBrief')!;briefs.push(brief);
   assert.ok(brief.includes(copy[locale].brief));assert.ok(brief.includes(copy[locale].pending));
   for(const s of copy[locale].families[family])assert.ok(brief.includes(s));
   assert.ok(brief.length<5000);
   const html=renderToStaticMarkup(<EquipmentBuyingSupport locale={locale} family={family}/>);
   assert.equal((html.match(/id="equipment-buying-support"/g)||[]).length,1);
   assert.ok(html.includes(`dir="${locale==='ar'?'rtl':'ltr'}"`));
   assert.ok(!html.includes('application/ld+json')); // No invented Product/Offer or warranty assertions.
  }
  assert.equal(new Set(briefs).size,3);
 }
});
