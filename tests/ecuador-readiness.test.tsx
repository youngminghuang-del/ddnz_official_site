import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import EcuadorContent from '../src/features/freight/EcuadorContent';
import {ecuadorLocales,ecuadorCopy,ecuadorPrefix,ecuadorPath,ecuadorAlternates} from '../src/features/freight/ecuadorCopy';
import {freightPageSchema,freightPageInfo} from '../src/features/freight/freightPageSchema';
import MarketPreparationDepth from '../src/features/freight/MarketPreparationDepth';
import EcuadorRegionEntry from '../src/features/freight/EcuadorRegionEntry';
import {threeMarketExtra} from '../src/features/freight/threeMarketExtra';
import {supportedNavigationLanguages} from '../src/lib/productLanguageRouting';
for(const locale of ecuadorLocales)test(`Ecuador ${locale}: visible planning, scoped schema and inquiry handover`,()=>{
 const route=ecuadorPrefix(locale)+ecuadorPath;
 const html=renderToStaticMarkup(<EcuadorContent locale={locale}/>);
 const graph=freightPageSchema(route)!['@graph'];const service=graph.find(x=>x['@type']==='Service') as any;
 assert.equal(service.provider.name,'DDNZ Global');assert.equal(service.areaServed.identifier,'EC');
 assert(!JSON.stringify(graph).match(/"(?:offers|price|review|aggregateRating|hasOfferCatalog)"/));
 assert.equal((html.match(/<h1\b/g)||[]).length,1);assert(html.includes(ecuadorCopy[locale].title));
 assert(html.includes(ecuadorCopy[locale].diagram));assert(html.includes(ecuadorCopy[locale].rateBody));
 const trail=(graph.find(x=>x['@type']==='BreadcrumbList') as any).itemListElement;
 for(const item of trail)assert(html.includes(item.name));
 const context=JSON.parse(html.match(/data-quote-context="([^"]+)"/)![1].replaceAll('&quot;','"').replaceAll('&amp;','&'));
 assert.equal(context.leadGoal,'Freight Export');assert.equal(context.destinationText,ecuadorCopy[locale].name);assert.equal(context.notes,ecuadorCopy[locale].notes);
 assert(html.includes(`href="${ecuadorPrefix(locale)}/get-a-quote/"`));assert(!/href="[^\"]*get-a-quote[^\"]*\?/.test(html));
 assert.deepEqual(new Set(supportedNavigationLanguages(route)),new Set(ecuadorLocales));
});
test('Ecuador exposes exactly eight authored language equivalents',()=>{
 assert.equal(ecuadorAlternates().length,9);
 for(const locale of ecuadorLocales)assert(freightPageInfo(ecuadorPrefix(locale)+ecuadorPath));
 assert.equal(freightPageInfo('/id'+ecuadorPath),null);
});

for(const locale of ['ar','fr','ru','pt','tr'] as const)test(`${locale}: complete copy, regional destination and two country inquiry briefs`,()=>{
 const data=threeMarketExtra[locale];
 assert.deepEqual(Object.keys(data.ecuador).sort(),Object.keys(ecuadorCopy.en).sort());
 assert.equal(data.ecuador.steps.length,4);assert.equal(data.ecuador.fields.length,6);assert.equal(data.market.cards.length,4);
 const region=renderToStaticMarkup(<EcuadorRegionEntry locale={locale} prefix={'/'+locale}/>);
 assert(region.includes(`href="/${locale}/shipping-from-china-to-ecuador/"`));assert(region.includes(data.region.link));
 for(const country of ['bahrain','qatar']){
  const markup=renderToStaticMarkup(<MarketPreparationDepth locale={locale} country={country}/>);
  const context=JSON.parse(markup.match(/data-quote-context="([^"]+)"/)![1].replaceAll('&quot;','"').replaceAll('&amp;','&'));
  const expected={ar:['قطر','البحرين'],fr:['Qatar','Bahreïn'],ru:['Катар','Бахрейн'],pt:['Catar','Barein'],tr:['Katar','Bahreyn']}[locale];
  assert.equal(context.destinationText,expected[country==='qatar'?0:1]);assert.equal(context.notes,data.market.notes);
  assert(markup.includes(`href="/${locale}/get-a-quote/"`));
  if(locale==='ar'){assert(markup.includes('dir="rtl"'));assert(markup.includes('<bdi dir="ltr">'));}
 }
 if(locale==='ar'){
  const markup=renderToStaticMarkup(<EcuadorContent locale="ar"/>);
  assert(markup.includes('dir="rtl"'));assert(markup.includes('<bdi dir="ltr">CO</bdi>'));
 }
});
