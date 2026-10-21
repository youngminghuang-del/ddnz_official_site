import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import data from '../src/features/commercial-kitchen/data/iceDetails.json';
import copies from '../src/features/commercial-kitchen/locales/ice-details.json';
import {IceModelDetails} from '../src/features/commercial-kitchen/components/IceModelDetails';
test('different-model image parameters are withheld and ambiguous installation height remains visible',()=>{
 for(const id of ['ice-39','ice-49']){
  assert.equal('storage' in data[id],false);
  assert.equal('power' in data[id],false);
 }
 assert.equal(data['ice-58'].storage,'18 kg');assert.equal(data['ice-61'].power,'330 W');
 assert.equal(data['ice-69'].storage,'220 kg');assert.equal('weight' in data['ice-64'],false);
 for(const locale of Object.keys(copies) as (keyof typeof copies)[]){
  const height=renderToStaticMarkup(<IceModelDetails id="ice-64" locale={locale}/>);
  assert.ok(height.includes('832 mm')&&height.includes('890–925 mm'),locale);
  const ab=renderToStaticMarkup(<IceModelDetails id="ice-49" locale={locale}/>);
  assert.ok(!ab.includes('220 W')&&!ab.includes('18 kg'),locale);
  assert.ok(height.includes(copies[locale].details.replaceAll('&','&amp;'))&&height.includes(copies[locale].storage),locale);
 }
});
