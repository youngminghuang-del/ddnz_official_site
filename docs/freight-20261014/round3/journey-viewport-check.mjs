import { chromium } from '/Users/huangyangming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),ctx=await browser.newContext({reducedMotion:'reduce'});await ctx.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await ctx.addInitScript(()=>localStorage.setItem('cookieConsent','declined'));const page=await ctx.newPage();
for(const width of [360,390,430,1110,1536])for(const country of ['qatar','oman'])for(const locale of ['en','ar']) {
 await page.setViewportSize({width,height:960});await page.goto(`http://127.0.0.1:4187/${locale==='ar'?'ar/':''}shipping-from-china-to-${country}/?ddnz_test=1`);await page.locator('[data-cargo-journey]').waitFor();
 await page.locator('[data-cargo-journey]').evaluate(el=>scrollTo({top:scrollY+el.getBoundingClientRect().top-140,behavior:'instant'}));await page.waitForTimeout(100);
 await page.screenshot({path:`docs/freight-20261014/round3/screenshots/${country}-${locale}-${width}-journey.png`});
 if(width===390){await page.locator('[data-cargo-journey] li').nth(3).evaluate(el=>scrollTo({top:scrollY+el.getBoundingClientRect().top-140,behavior:'instant'}));await page.screenshot({path:`docs/freight-20261014/round3/screenshots/${country}-${locale}-${width}-journey-handover.png`});}
}
await browser.close();
