import React from 'react';
import test from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import FactoryProductionEvidence from '../src/features/commercial-kitchen/components/FactoryProductionEvidence.jsx';
import GulfKitchenPlanning from '../src/features/commercial-kitchen/components/GulfKitchenPlanning.jsx';

test('factory clips wait for user playback and use lightweight posters in both languages',()=>{
 for(const locale of ['en','ar']){
  const html=renderToStaticMarkup(<FactoryProductionEvidence locale={locale}/>);
  assert.equal((html.match(/preload="none"/g)||[]).length,2);
  assert.equal((html.match(/poster="/g)||[]).length,2);
  assert.doesNotMatch(html,/autoPlay|autoplay|\.MOV/);
  assert.match(html,/cabinet-detail-discussion\.mp4/);
  assert.match(html,locale==='ar'?/مديرة المصنع/:/factory manager/);
 }
});
test('Gulf planning links directly to same-language ice selection',()=>{
 for(const locale of ['en','ar']){
  const html=renderToStaticMarkup(<GulfKitchenPlanning locale={locale}/>);
  assert.ok(html.includes(`href="${locale==='ar'?'/ar':''}/sourcing/commercial-ice-machines-from-china/"`));
  assert.equal((html.match(/id="factory-production"/g)||[]).length,1);
 }
});
