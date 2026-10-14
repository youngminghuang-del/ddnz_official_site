import { chromium } from '/Users/huangyangming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';import assert from 'node:assert/strict';import fs from 'node:fs';
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),results=[];
for(const reducedMotion of ['reduce','no-preference']){
 const c=await b.newContext({viewport:{width:390,height:844},reducedMotion});await c.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await c.addInitScript(()=>localStorage.setItem('cookieConsent','declined'));const p=await c.newPage();await p.goto('http://127.0.0.1:4187/ar/shipping-from-china-to-oman/?ddnz_test=1');const a=p.locator('.gulf-chapters a').first();await a.waitFor();
 const before=await a.evaluate(el=>getComputedStyle(el).backgroundColor);await a.hover();await p.waitForTimeout(250);const after=await a.evaluate(el=>getComputedStyle(el).backgroundColor);assert.notEqual(before,after);
 const style=await a.evaluate(el=>({transition:getComputedStyle(el).transitionDuration,scroll:getComputedStyle(document.documentElement).scrollBehavior}));if(reducedMotion==='reduce'){assert.ok(parseFloat(style.transition)<=0.00001,'Global reduced-motion transition must be effectively instant (<=0.01ms)');assert.equal(style.scroll,'auto');}
 await a.click();await p.waitForTimeout(reducedMotion==='reduce'?100:900);assert.equal(await a.getAttribute('aria-current'),'location');results.push({reducedMotion,hoverChanges:true,...style,anchorCurrent:true});await c.close();
}
fs.writeFileSync('docs/freight-20261014/round3/motion-results.json',JSON.stringify(results,null,2));await b.close();
