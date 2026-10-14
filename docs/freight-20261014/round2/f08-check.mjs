import { chromium } from '/Users/huangyangming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';import fs from 'node:fs';
const base='http://127.0.0.1:4187',out='docs/freight-20261014/round2';
const labels=JSON.parse(fs.readFileSync('src/features/freight/freightFactLabels.json'));
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
await context.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
await context.addInitScript(()=>localStorage.setItem('cookieConsent','declined'));
const page=await context.newPage(),results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
for(const lang of Object.keys(labels)){
 const prefix=lang==='en'?'':lang==='zh'?'/zh-cn':'/'+lang;
 await page.goto(base+prefix+'/shipping-from-china-to-kuwait/?ddnz_test=1');await page.locator('header').first().waitFor();await page.waitForTimeout(200);
 const navigation=await page.locator('header').first().innerText();const footer=await page.locator('footer').innerText();assert.ok(!navigation.includes('1997'));assert.ok(!footer.includes('1997'));
 if(!['pt','tr'].includes(lang)){
  const text=await page.locator('main').innerText();assert.ok(!text.includes('Tailored Solutions Header'));assert.ok(text.includes(labels[lang].importPlanning));assert.ok(!text.includes('SABER & Customs Compliant'));
  for(const key of ['consolidationCta','inspectionCta','documentsCta']){
    const button=page.getByRole('button',{name:labels[lang][key],exact:true});await button.focus();await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'middle-east-quote-form');
  }
 }
 results.push({lang,footerAndNavYearRemoved:true,realCards:!['pt','tr'].includes(lang)});
}
await page.goto(base+'/shipping-from-china-to-saudi-arabia/?ddnz_test=1');await page.getByText(labels.en.saudiSaber,{exact:true}).first().waitFor();assert.ok((await page.locator('main').innerText()).includes(labels.en.saudiSaber));
assert.deepEqual(errors,[]);
}finally{fs.writeFileSync(`${out}/f08-results.json`,JSON.stringify({results,errors},null,2));await browser.close();}
