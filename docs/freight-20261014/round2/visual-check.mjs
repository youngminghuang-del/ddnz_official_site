import { chromium } from '/Users/huangyangming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context=await browser.newContext({viewport:{width:1536,height:960},reducedMotion:'reduce'});await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
await context.addInitScript(()=>localStorage.setItem('cookieConsent','declined'));
const page=await context.newPage();
for(const country of ['qatar','oman'])for(const lang of ['en','ar']){
 await page.setViewportSize({width:1536,height:960});await page.goto(`http://127.0.0.1:4187/${lang==='ar'?'ar/':''}shipping-from-china-to-${country}/?ddnz_test=1`);await page.locator('.gulf-hero').waitFor();
 for(const img of await page.locator('main img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(img=>img.decode());}
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`docs/freight-20261014/round2/screenshots/${country}-${lang}-full.png`,fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.locator('.gulf-diagram').scrollIntoViewIfNeeded();await page.screenshot({path:`docs/freight-20261014/round2/screenshots/${country}-${lang}-diagram-390.png`});
}
await browser.close();
