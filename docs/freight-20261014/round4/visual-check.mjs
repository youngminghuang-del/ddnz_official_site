import { chromium } from '/Users/huangyangming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const base='http://127.0.0.1:4187',out='docs/freight-20261014/round4/screenshots';
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),ctx=await b.newContext({reducedMotion:'reduce'});
await ctx.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());await ctx.addInitScript(()=>localStorage.setItem('cookieConsent','declined'));
const p=await ctx.newPage();
for(const country of ['qatar','oman'])for(const locale of ['en','ar'])for(const width of [390,1536]){
 await p.setViewportSize({width,height:1050});await p.goto(base+(locale==='ar'?'/ar':'')+`/shipping-from-china-to-${country}/?ddnz_test=1`);await p.locator('[data-regional-map]').waitFor();
 await p.locator('[data-customs-resources]').scrollIntoViewIfNeeded();await p.waitForFunction(()=>[...document.querySelectorAll('[data-customs-resources] img')].every(i=>i.complete&&i.naturalWidth>0));
 await p.locator('.gulf-arrival-section').evaluate(el=>window.scrollTo({top:scrollY+el.getBoundingClientRect().top-140,behavior:'instant'}));await p.waitForTimeout(100);
 await p.screenshot({path:`${out}/${country}-${locale}-${width}-arrival-context.png`});
}
await b.close();
