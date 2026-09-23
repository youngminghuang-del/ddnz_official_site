import test from 'node:test';
import assert from 'node:assert/strict';
import { overviewCopy, overviewMeta, overviewAlternates } from '../src/features/overview/copy.ts';
import { navigationPath, supportedNavigationLanguages } from '../src/lib/productLanguageRouting.ts';
const leaves = (value: unknown, path = ''): string[] => typeof value === 'object' && value !== null ? Object.entries(value).flatMap(([key, item]) => leaves(item, `${path}.${key}`)) : [path];
test('seven authored overview dictionaries have complete matching content shapes', () => {
 for (const [locale, copy] of Object.entries(overviewCopy)) {
  assert.deepEqual(leaves(copy), leaves(overviewCopy.pt), locale);
  assert.equal(copy.categories.length, 5); assert.equal(copy.packageNames.length, 6);
  assert.equal(copy.steps.length, 7); assert.equal(copy.faqs.length, 4);
  assert.ok(!JSON.stringify(copy).includes('""'), locale);
  for (const kind of ['products', 'sourcing-services'] as const) {
   const meta = overviewMeta(kind, locale);
   assert.equal(meta.title, kind === 'products' ? copy.productsMetaTitle : copy.servicesMetaTitle);
   assert.equal(meta.desc, kind === 'products' ? copy.productsIntro : copy.servicesIntro);
   assert.equal(overviewAlternates(kind).length, 8);
   assert.equal(supportedNavigationLanguages(`/${kind}/`).length, 8);
   const prefix = locale === 'zh' ? 'zh-cn' : locale;
   assert.equal(navigationPath(`/${kind}/?source=test#rfq`, locale as keyof typeof overviewCopy), `/${prefix}/${kind}/?source=test#rfq`);
  }
 }
});
