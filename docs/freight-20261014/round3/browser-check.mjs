import { chromium } from '/Users/huangyangming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';import fs from 'node:fs';
const base='http://127.0.0.1:4187',out='docs/freight-20261014/round3',maps=JSON.parse(fs.readFileSync('src/features/freight/gulfMaps.json'));
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),ctx=await b.newContext({reducedMotion:'reduce'}),results=[],errors=[];let blocked=0;
await ctx.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():(blocked++,r.abort()));await ctx.addInitScript(()=>localStorage.setItem('cookieConsent','declined'));
const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
try {
 for(const width of [360,390,430,1110,1536])for(const country of ['qatar','oman'])for(const locale of ['en','ar']){
  const route=(locale==='ar'?'/ar':'')+`/shipping-from-china-to-${country}/`;await p.setViewportSize({width,height:960});await p.goto(base+route+'?ddnz_test=1');await p.locator('.gulf-chapters').waitFor();
  const nav=p.locator('.gulf-chapters'),links=nav.locator('a');assert.equal(await links.count(),4);assert.equal(await nav.getAttribute('role'),null);
  const cols=await nav.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);assert.equal(cols,width<=640?2:4);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  const areas=await links.evaluateAll(els=>els.map(el=>({w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height})));assert.ok(areas.every(x=>x.w>44&&x.h>44));
  await nav.scrollIntoViewIfNeeded();await p.screenshot({path:`${out}/screenshots/${country}-${locale}-${width}-chapters.png`});
  for(let i=0;i<4;i++){
   const link=links.nth(i),hash=await link.getAttribute('href');await link.focus();
   const focus=await link.evaluate(el=>({outline:getComputedStyle(el).outlineStyle,width:getComputedStyle(el).outlineWidth}));assert.equal(focus.outline,'solid');assert.notEqual(focus.width,'0px');
   await p.keyboard.press('Enter');await p.waitForTimeout(250);assert.equal(new URL(p.url()).hash,hash);assert.equal(await p.evaluate(()=>document.activeElement.id),hash.slice(1));
   await p.waitForFunction(hash=>document.querySelector(`.gulf-chapters a[href="${hash}"]`)?.getAttribute('aria-current')==='location',hash);
   const rect=await p.locator(hash).boundingBox();const header=await p.locator('header').first().boundingBox();assert.ok(rect.y>=header.y+header.height-1,`${route}: ${hash} hidden by header ${rect.y}`);
  }
  // Pointer near the outer edge activates the full tile, not just its label.
  await links.nth(0).click({position:{x:10,y:10}});await p.waitForTimeout(150);assert.equal(new URL(p.url()).hash,'#gulf-section-0');
  const map=p.locator('[data-destination-map]');assert.equal(await map.count(),1);assert.equal(await map.locator('.gulf-map-outline').getAttribute('d'),maps[country].outline);
  assert.equal(await map.locator('svg').first().evaluate(el=>getComputedStyle(el).transform),'none');
  assert.equal(await map.locator('ol li').count(),2);assert.equal(await map.locator('svg title').count(),1);assert.equal(await map.locator('svg desc').count(),1);
  assert.equal(await p.locator('[data-cargo-journey] ol li').count(),5);
  assert.ok(await p.locator('[data-cargo-journey]').innerText().then(t=>locale==='en'?t.includes('Planning example'):t.includes('مثال تخطيطي')));
  await map.scrollIntoViewIfNeeded();await map.screenshot({path:`${out}/screenshots/${country}-${locale}-${width}-map.png`});
  await p.locator('[data-cargo-journey]').screenshot({path:`${out}/screenshots/${country}-${locale}-${width}-journey.png`});
  await p.locator('[data-cargo-journey]>a').click();await p.waitForTimeout(200);assert.equal(new URL(p.url()).hash,'#gulf-quote');
  const step=p.locator('#get-a-quote button').filter({has:p.locator('h4')});assert.equal(await step.count(),3);await step.first().click();
  for(let i=0;i<2;i++){await p.locator('#get-a-quote').getByRole('button',{name:locale==='ar'?'الخطوة التالية':'Next Step',exact:true}).click();await p.waitForTimeout(650);}
  assert.equal(await p.locator('[name="Destination"]').inputValue(),country==='qatar'?'Qatar':'Oman');assert.equal(await p.locator('[name="Weight_Status"]').inputValue(),'unknown');
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  results.push({route,width,columns:cols,keyboardAnchors:4,pointerTile:true,mapNodes:2,journeySteps:5,rfqDestination:true,unknown:true,passed:true});console.log(route,width,'passed');
 }
 assert.deepEqual(errors,[]);
}finally{fs.writeFileSync(`${out}/browser-results.json`,JSON.stringify({results,errors,blockedExternal:blocked},null,2));await b.close();}
