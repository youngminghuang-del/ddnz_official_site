import { chromium } from '/Users/huangyangming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';
const base='http://127.0.0.1:4187',out='docs/freight-20261014/round5',before=process.env.BASELINE==='1';
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),ctx=await b.newContext({reducedMotion:'reduce'}),results=[],errors=[];let blocked=0;
await ctx.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():(blocked++,r.abort()));await ctx.addInitScript(()=>localStorage.setItem('cookieConsent','declined'));
const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
try {
for(const width of before?[360,1536]:[360,390,430,1110,1536])for(const country of ['qatar','oman'])for(const locale of ['en','ar']){
 const route=(locale==='ar'?'/ar':'')+`/shipping-from-china-to-${country}/`;await p.setViewportSize({width,height:1050});await p.goto(base+route+'?ddnz_test=1');await p.locator('#gulf-section-0').waitFor();
 const section=p.locator('#gulf-section-0').locator('..').locator('..');const height=await section.evaluate(el=>el.getBoundingClientRect().height);
 if(!before){
 const refs=p.locator('[data-cargo-references]'),images=refs.locator('img');await refs.scrollIntoViewIfNeeded();await p.waitForFunction(()=>[...document.querySelectorAll('[data-cargo-references] img')].every(i=>i.complete&&i.naturalWidth>0));
 const imageData=await images.evaluateAll(els=>els.map(i=>({src:i.getAttribute('src'),naturalWidth:i.naturalWidth,loading:i.loading,alt:i.alt,width:i.getAttribute('width'),height:i.getAttribute('height'),fit:getComputedStyle(i).objectFit})));
 assert.ok(imageData.length>=1&&imageData.length<=2);assert.ok(imageData.every(i=>i.naturalWidth>0&&i.loading==='lazy'&&i.alt&&i.width&&i.height&&i.fit==='contain'));
 assert.equal(await p.locator('.gulf-chapters a').count(),4);assert.equal(await p.locator('[data-cargo-journey] ol li').count(),5);assert.equal(await p.locator('[data-regional-map]').count(),1);assert.equal(await p.locator('[data-official-resource]').count(),2);
 assert.ok(!(await section.innerText()).includes('No actual shipment data'));
 if(country==='oman'){assert.equal(await p.locator('[data-delivery-checklist] li').count(),4);await p.locator('[data-delivery-checklist]').screenshot({path:`${out}/screenshots/${country}-${locale}-${width}-delivery.png`});}
 await refs.screenshot({path:`${out}/screenshots/${country}-${locale}-${width}-references.png`});
 await section.evaluate(el=>scrollTo({top:scrollY+el.getBoundingClientRect().top-140,behavior:'instant'}));await p.screenshot({path:`${out}/screenshots/${country}-${locale}-${width}-cargo-context.png`});
 }
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));results.push({route,width,sectionHeight:Math.round(height),passed:true});
}
assert.deepEqual(errors,[]);
}finally{fs.writeFileSync(`${out}/${before?'baseline':'layout'}-results.json`,JSON.stringify({results,errors,blockedExternal:blocked},null,2));await b.close();}
