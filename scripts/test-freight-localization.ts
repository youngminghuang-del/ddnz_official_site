import assert from 'node:assert/strict';
import {COUNTRY_SPEC_DATA} from '../src/data/countrySpecData';
import {reviewedMiddleEastFaqs} from '../src/features/freight/reviewedMiddleEastFaqs';
import {freightPageInfo,freightPageSchema,freightCountries,freightRegions} from '../src/features/freight/freightPageSchema';
const locales=['en','zh','es','fr','ru','ar','pt','tr'];
for(const country of ['Saudi-Arabia','UAE','Kuwait'] as const){
 for(const locale of locales.slice(0,6)){
  const spec=COUNTRY_SPEC_DATA[country][locale];assert.ok(spec,`${country}/${locale}: no English fallback`);
  assert.equal(spec.redlines.length,5);assert.equal(spec.guideCards.length,3);
  const faqs=reviewedMiddleEastFaqs(country,locale)!;assert.equal(faqs.length,3);assert.equal(new Set(faqs.map(f=>f.id)).size,3);
  const serialized=JSON.stringify([spec,faqs]);
  if(locale==='ar')assert.doesNotMatch(serialized,/(?:[A-Za-z]{3,} ){5}/,`${country}: English sentence in Arabic`);
  if(locale!=='zh')assert.doesNotMatch(serialized,/[\u4e00-\u9fff]/,`${country}/${locale}: Chinese leakage`);
  assert.doesNotMatch(serialized,/24 [Hh]eures|24 часа|英标|24 hours|normal transit range/);
 }
}
for(const locale of locales)for(const slug of [...Object.keys(freightCountries),...Object.keys(freightRegions)]){
 const p=freightPageInfo(`/shipping-from-china-to-${slug}/`,locale)!;
 const [page,entity]=freightPageSchema(p.url.replace('https://www.ddnzglobal.com',''))!['@graph'] as any[];
 assert.equal(page.name,p.title);assert.equal(page.description,p.description);
 if(freightCountries[slug]){assert.ok(entity.serviceType);if(locale!=='en')assert.notEqual(entity.serviceType,'Freight route planning and shipment coordination');}
}
assert.equal(freightPageInfo('/fr/shipping-from-china-to-uae/')?.title,'Transport de Chine vers les Émirats arabes unis | DDNZ');
assert.equal(freightPageInfo('/pt/shipping-from-china-to-brazil/')?.title,'Transporte da China para o Brasil | DDNZ');
assert.equal(freightPageInfo('/ru/shipping-from-china-to-saudi-arabia/')?.title,'Доставка грузов из Китая в Саудовскую Аравию | DDNZ');
assert.equal(freightPageInfo('/tr/shipping-from-china-to-uae/')?.title,'Çin’den Birleşik Arap Emirlikleri’ne yük taşımacılığı | DDNZ');
console.log('208 localized metadata graphs and 18 country-document/FAQ variants passed.');
