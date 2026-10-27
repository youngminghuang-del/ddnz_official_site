import assert from 'node:assert/strict';
import {freightPageSchema,freightCountries,freightRegions} from '../src/features/freight/freightPageSchema';
for(const locale of ['en','zh-cn','es','pt','fr','ru','ar','tr'])for(const slug of [...Object.keys(freightCountries),...Object.keys(freightRegions)]){
 const prefix=locale==='en'?'':`/${locale}`;const path=`${prefix}/shipping-from-china-to-${slug}/`;
 const graph=freightPageSchema(path+'?ddnz_test=1#freight-route-options')!;
 const [page,entity]=graph['@graph'] as any[];
 assert.equal(page.url,'https://www.ddnzglobal.com'+path);assert.equal(page['@id'],page.url);
 assert.equal(page.mainEntity['@id'],entity['@id']);assert.ok(!('offers' in entity));assert.ok(!('priceCurrency' in entity));
 assert.equal(page.inLanguage,locale==='zh-cn'?'zh-CN':locale==='pt'&&slug==='brazil'?'pt-BR':locale);
 if(freightCountries[slug]){assert.equal(entity.areaServed.identifier,freightCountries[slug]);assert.equal(entity.provider['@type'],'Organization');}
 else{assert.equal(page['@type'],'CollectionPage');assert.equal(entity['@type'],'ItemList');assert.equal(entity.itemListElement.length,freightRegions[slug].length);assert.ok(entity.itemListElement.every((x:any)=>x.url.startsWith('https://www.ddnzglobal.com'+prefix+'/shipping-from-china-to-')));}
}
assert.equal(freightPageSchema('/products/'),null);assert.equal(freightPageSchema('/shipping-from-china-to-unknown/'),null);
console.log('208 freight graphs: canonical identity, locale, provider, list scope and no speculative offers passed.');
