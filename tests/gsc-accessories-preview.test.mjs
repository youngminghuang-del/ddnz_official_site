import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {tsImport} from 'tsx/esm/api';
import {mobileMetadata} from '../src/features/mobile-sourcing/seo.mjs';
import {mobileArticleDiscovery} from '../src/data/mobileArticleDiscovery.mjs';
const {default:Content}=await tsImport('../src/features/mobile-sourcing/MobileContent.jsx',import.meta.url);

test('Spanish buying paths resolve to visible sections and leave the original mixed inquiry form intact',()=>{
 for(const id of ['cases','hub']){
  const html=renderToStaticMarkup(React.createElement(Content,{pageId:id,locale:'es'}));
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length);
  for(const anchor of ['collection','price-comparison','buying-brief'])assert.ok(ids.includes(anchor));
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  assert.match(html,/Su pedido de accesorios/);
  assert.match(html,/Los mínimos se aplican por producto y modelo/);
  if(id==='cases'){
   assert.match(html,/<h1>Fundas para celular de China al por mayor<\/h1>/);
   assert.match(html,/href="#price-comparison">Comparar precios en CNY/);
   assert.ok(ids.includes('plan-de-reposicion'));
  }else{
   assert.match(html,/href="\/es\/phone-cases\/"/);
   assert.match(html,/href="\/es\/screen-protectors\/compare\/"/);
  }
  const meta=mobileMetadata(id,'es');
  assert.match(meta.title,/al por mayor de China/);
  assert.equal(meta.schema['@graph'][0].description,meta.description);
  assert.equal(meta.schema['@graph'][0].name,meta.title);
 }
 for(const locale of ['en','zh','ar','fr','ru','pt','tr']){
  const html=renderToStaticMarkup(React.createElement(Content,{pageId:'hub',locale}));
  assert.doesNotMatch(html,/id="es-buying-paths"/);
 }
});

test('privacy article connects to product comparison and retains legacy article exclusion',()=>{
 const c=mobileArticleDiscovery['top-10-privacy-screen-protector-manufacturers-china'];
 assert.match(c.title,/10 Privacy Screen Protector Manufacturers in China/);
 assert.equal(c.links.length,3);
 assert.equal(c.links[0].href,'/screen-protectors/compare/#price-comparison');
 assert.equal(c.links[2].href,'/screen-protectors/brief/');
 assert.equal(mobileArticleDiscovery['top-10-screen-protector-manufacturers-alibaba'],undefined);
});
