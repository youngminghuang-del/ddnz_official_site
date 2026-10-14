import test from 'node:test';
import assert from 'node:assert/strict';
import { gulfLocaleFromPath, gulfLanguagePrefix, gulfLanguageTag, gulfLocales } from '../src/features/freight/gulfLocale';
import stories from '../src/features/freight/gulfStories.json';
import journeys from '../src/features/freight/gulfJourneys.json';
import qatar from '../src/features/freight/qatarCargoGallery.json';
import oman from '../src/features/freight/omanCargoGallery.json';
import maps from '../src/features/freight/gulfMaps.json';
import regions from '../src/features/freight/gulfRegionalMaps.json';
import customs from '../src/features/freight/gulfCustoms.json';
import ui from '../src/features/freight/gulfUi.json';
import chapters from '../src/features/freight/gulfChapterLabels.json';
import checklist from '../src/features/freight/gulfDeliveryChecklist.json';

test('eight Gulf routes round-trip locale prefixes including zh-cn', () => {
 for (const locale of gulfLocales) for (const country of ['qatar','oman']) {
  assert.equal(gulfLocaleFromPath(`${gulfLanguagePrefix(locale)}/shipping-from-china-to-${country}/`),locale);
  assert.equal(gulfLanguageTag(locale),locale==='zh'?'zh-CN':locale);
 }
});
test('every bilingual content object has all eight locale keys', () => {
 function inspect(value: unknown, path: string) {
  if (!value || typeof value!=='object') return;
  const record=value as Record<string,unknown>;
  if ('en' in record && 'ar' in record) for(const locale of gulfLocales) assert.ok(locale in record,`${path}.${locale}`);
  for(const [key,entry] of Object.entries(record))inspect(entry,`${path}.${key}`);
 }
 for(const [key,value] of Object.entries({stories,journeys,qatar,oman,maps,regions,customs,ui,chapters,checklist}))inspect(value,key);
});
test('every country translation retains seven story sections and five journey stages', () => {
 for(const country of ['qatar','oman'] as const)for(const locale of gulfLocales){
  assert.equal(stories[country][locale].sections.length,7);
  assert.equal(journeys[country][locale].steps.length,5);
  assert.equal(chapters[country][locale].length,4);
  assert.ok(stories[country][locale].heading.trim());
 }
});
