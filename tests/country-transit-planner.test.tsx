import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import fs from 'node:fs';
import CountryTransitPlanner from '../src/features/freight/CountryTransitPlanner';
import profiles from '../src/features/freight/route-locales/country-transit.json';
import {freightQuoteService} from '../src/lib/freightQuoteService';

test('twenty country plans expose scoped time ranges in eight languages before optional sources',()=>{
 for(const country of Object.keys(profiles) as (keyof typeof profiles)[])for(const locale of ['en','zh','es','ar','fr','ru','pt','tr']){
  const html=renderToStaticMarkup(<CountryTransitPlanner country={country} locale={locale}/>);
  const visibleTable=html.slice(0,html.indexOf('<details'));
  assert.match(visibleTable,/<table/);assert.doesNotMatch(visibleTable,/undefined|NaN/);
  for(const row of profiles[country].rows)assert.ok(visibleTable.includes(`${row.days[0]}–${row.days[1]}`),`${country}/${locale}/${row.mode}`);
  if(locale==='ar')assert.match(html,/dir="rtl"/);
  const context=[...html.matchAll(/data-quote-context="([^"]+)"/g)].map(m=>JSON.parse(m[1].replaceAll('&quot;','"').replaceAll('&amp;','&')));
  assert.equal(context.length,profiles[country].rows.length);
  context.forEach((c,i)=>{const mode=profiles[country].rows[i].mode;assert.equal(freightQuoteService(c.source),mode==='air'?'Air':mode==='fcl'||mode==='lcl'?'Sea':'Land');assert.ok(c.destinationText);assert.ok(c.notes);});
  assert.doesNotMatch(html,/get-a-quote\/\?/);
 }
});

test('FCL summary never silently diverges from populated customer records; landlocked destinations do not gain ocean modes',()=>{
 const feed=JSON.parse(fs.readFileSync(new URL('../public/api/freight-rates/q4-2026.json',import.meta.url),'utf8'));
 for(const [country,profile] of Object.entries(profiles)){
  for(const row of profile.rows){assert.ok(row.days.length===2&&row.days[0]>0&&row.days[1]>=row.days[0]);if(row.scope==='ocean-records'){
   const days=feed.rows.filter((v:any)=>v.country===country&&typeof v.days==='number').map((v:any)=>v.days);
   assert.equal(profile.recordCount,days.length);assert.ok(days.includes(row.days[0])&&days.includes(row.days[1]));assert.ok(days.every((v:number)=>v>=row.days[0]&&v<=row.days[1]));
  }}
 }
 for(const country of ['kazakhstan','kyrgyzstan','tajikistan','turkmenistan','uzbekistan'] as const)assert.ok(profiles[country].rows.every(row=>!['fcl','lcl'].includes(row.mode)));
 assert.deepEqual(profiles.kyrgyzstan.rows.map(row=>row.mode),['road','air']);
});
