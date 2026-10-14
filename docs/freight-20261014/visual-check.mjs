import {chromium} from '/Users/huangyangming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const c=await b.newContext({reducedMotion:'reduce'});
await c.addInitScript(()=>{localStorage.setItem('cookieConsent','declined');localStorage.setItem('cookiePreferences',JSON.stringify({necessary:true,functional:true,tracking:false,targeting:false}));});
await c.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:4187'?r.continue():r.abort());
const p=await c.newPage();
for(const width of [360,390,430,1536])for(const lang of ['en','ar']){
 await p.setViewportSize({width,height:900});await p.goto(`http://127.0.0.1:4187/${lang==='ar'?'ar/':''}shipping-from-china-to-qatar/?ddnz_test=1`);
 await p.locator('#get-a-quote button').nth(4).click();const next=p.locator('#get-a-quote').getByRole('button',{name:lang==='en'?'Next Step':'الخطوة التالية',exact:true});await next.click();await p.locator('#quote-cargo-weight').waitFor();await p.waitForTimeout(800);await p.locator('#quote-cargo-weight').scrollIntoViewIfNeeded();
 await p.screenshot({path:`docs/freight-20261014/evidence/viewport-cargo-${lang}-${width}.png`});
 await next.click();await p.locator('#quote-form').waitFor();await p.waitForTimeout(800);await p.locator('#quote-form').scrollIntoViewIfNeeded();
 await p.screenshot({path:`docs/freight-20261014/evidence/viewport-contact-${lang}-${width}.png`});
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 console.log('viewport',lang,width);
}
await b.close();
