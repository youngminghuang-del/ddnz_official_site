import React from 'react';
import test from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import {packageCopy,restaurantPackagePaths,packageAlternates,packageInquiry,type PackageLocale} from '../src/features/commercial-kitchen/packageLocalization';
import {libraryOrder} from '../src/features/commercial-kitchen/data/restaurant-scenarios.mjs';
import LocalizedPackageContent from '../src/features/commercial-kitchen/LocalizedPackageContent';
import {navigationPath,supportedNavigationLanguages} from '../src/lib/productLanguageRouting';
const shape=(x:unknown,p=''):string[]=>x&&typeof x==='object'?Object.entries(x).flatMap(([k,v])=>shape(v,`${p}.${k}`)):[p];
test('49 restaurant package pages have complete native schedules, utilities, paths and metadata alternates',()=>{
 for(const locale of Object.keys(packageCopy) as PackageLocale[]){const c=packageCopy[locale];assert.deepEqual(shape(c),shape(packageCopy.zh));
 for(const [i,path] of restaurantPackagePaths.entries()){
 const slug=i?libraryOrder[i-1]:undefined,html=renderToStaticMarkup(<LocalizedPackageContent locale={locale} slug={slug}/>);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.ok(html.includes(c.ui.boundary));assert.ok(html.includes(`dir="${locale==='ar'?'rtl':'ltr'}"`));
 const s=c.scenarios[i?i-1:0];assert.equal(s.equipment.length,7);assert.equal(s.utilities.length,4);
 assert.ok(html.includes('E07'));assert.ok(!html.includes('SCENARIO BRIEF'));
 assert.equal(packageAlternates(path).length,8);assert.equal(supportedNavigationLanguages(path).length,8);assert.equal(navigationPath(path,locale),`/${locale==='zh'?'zh-cn':locale}${path}/`);
 }
 }
});
test('scenario brief preserves chosen equipment, utilities, destination and user requirements',()=>{
 for(const locale of Object.keys(packageCopy) as PackageLocale[]){for(const [i,slug] of libraryOrder.entries()){
 const url=new URL(packageInquiry(locale,slug,'Almaty','120 m²; 380 V'),'https://www.ddnzglobal.com');assert.equal(url.searchParams.get('projectNeed'),slug);assert.equal(url.searchParams.get('dest'),'Almaty');
 const brief=url.searchParams.get('overviewBrief')!;assert.ok(brief.includes(packageCopy[locale].scenarios[i].equipment[6]));assert.ok(brief.includes(packageCopy[locale].scenarios[i].utilities[3]));assert.ok(brief.includes('120 m²; 380 V'));assert.ok(brief.length<5000);
 }}
});
