import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { freightQuoteService } from '../src/lib/freightQuoteService';
import { quoteLinkProps, sanitizeQuoteContext } from '../src/lib/quoteLinkPolicy.mjs';
import { freightServiceSchema } from '../src/features/freight/freightServiceSchema';
import FreightReleaseContent, {freightReleaseMetadata,freightReleasePaths,modernizedFreightServicePaths} from '../src/features/freight/FreightReleaseContent';
import type {Language} from '../src/i18n/translations';
const languages:Language[]=['en','zh','es','pt','ru','fr','tr','ar'];
test('explicit air and warehouse entries retain their mode without overriding embedded region presets',()=>{
 assert.equal(freightQuoteService('air_freight'),'Air');
 assert.equal(freightQuoteService('warehouse_services'),'Warehouse');
 assert.equal(freightQuoteService('amazon_fba'),'Sea');
 assert.equal(freightQuoteService('dangerous_goods_shipping'),'Sea');
 assert.equal(freightQuoteService(null),'Sea');
 assert.equal(freightQuoteService('central_asia_route_builder'),'Land');
 assert.equal(freightQuoteService('land_door_delivery'),'Land');
 assert.equal(freightQuoteService('air_freight','Land'),'Land');
});
test('service handoff survives the existing query-free link policy, including localized brief',()=>{
 for(const language of languages) for(const path of modernizedFreightServicePaths){
  const html=renderToStaticMarkup(<FreightReleaseContent path={path} language={language}/>);
  const raw=html.match(/href="([^"]*get-a-quote[^\"]*)"/)![1].replaceAll('&amp;','&');
  const props=quoteLinkProps(raw); const context=JSON.parse(props['data-quote-context']);
  assert.equal(context.leadGoal,'Freight Export');
  assert.ok(context.notes.length>4);
  assert.equal(context.source,path.split('/').pop()!.replaceAll('-','_'));
  assert.deepEqual(sanitizeQuoteContext(context),sanitizeQuoteContext(JSON.parse(JSON.stringify(context))));
  assert.equal(props.href.includes('?'),false);
 }
});
test('48 service graphs describe visible localized copy without invented prices, global coverage, breadcrumbs or English offer boilerplate',()=>{
 for(const language of languages) for(const path of [...freightReleasePaths,...modernizedFreightServicePaths]){
  const meta=freightReleaseMetadata(path,language); const schema=freightServiceSchema(path,language,meta);
  const graph=schema['@graph']; const page=graph[0], service=graph[1];
  assert.equal(page.description,meta.desc); assert.equal(service.description,meta.desc);
  assert.equal(new Set(graph.map(n=>n['@id'])).size,2);
  assert.equal(service.provider?.['@type'],'Organization');
  assert.ok(service.availableChannel?.serviceUrl.includes(language==='en'?'/get-a-quote/':`/${language==='zh'?'zh-cn':language}/get-a-quote/`));
  assert.equal('offers' in service,false); assert.equal('areaServed' in service,false);
 }
});
