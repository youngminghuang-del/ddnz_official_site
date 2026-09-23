import React from 'react';import test from 'node:test';import assert from 'node:assert/strict';import {renderToStaticMarkup} from 'react-dom/server';import fs from 'node:fs';
import RefrigerationContent from '../src/features/refrigeration/RefrigerationContent';import {refrigerationCopy,refrigerationPath,refrigerationAlternates,type RefrigerationLocale} from '../src/features/refrigeration/copy';import {navigationPath,supportedNavigationLanguages} from '../src/lib/productLanguageRouting';
test('seven refrigeration bodies contain native ranges, six configuration checks, five scoring steps and real media',()=>{
 for(const locale of Object.keys(refrigerationCopy) as RefrigerationLocale[]){const c=refrigerationCopy[locale],html=renderToStaticMarkup(<RefrigerationContent locale={locale}/>);assert.equal(c.families.length,4);assert.equal(c.checks.length,6);assert.equal(c.steps.length,5);assert.ok(html.includes(c.title));assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.equal((html.match(/<video\b/g)||[]).length,1);assert.ok(html.includes(`dir="${locale==='ar'?'rtl':'ltr'}"`));
 for(const match of html.matchAll(/(?:src|poster)="(\/[^"?]+)"/g))assert.ok(fs.existsSync('public'+match[1]),match[1]);
 assert.equal(navigationPath(refrigerationPath,locale),`/${locale==='zh'?'zh-cn':locale}${refrigerationPath}/`);assert.equal(supportedNavigationLanguages(refrigerationPath).length,8);assert.equal(refrigerationAlternates().length,8);
 }
});
