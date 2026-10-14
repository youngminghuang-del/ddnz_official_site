import { chromium } from '/Users/huangyangming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base='http://127.0.0.1:4187',out='docs/freight-20261014/round2',errors=[],results=process.env.SWITCH_ONLY ? JSON.parse(fs.readFileSync('docs/freight-20261014/round2/browser-results.json')).results.filter(r=>r.check!=='eight-language-round-trip') : [];let blocked=0;
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():(blocked++,route.abort()));
await context.addInitScript(()=>{localStorage.setItem('cookieConsent','declined');localStorage.setItem('cookiePreferences',JSON.stringify({necessary:true,functional:true,tracking:false,targeting:false}));});
const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
const next=async ar=>{await page.locator('#get-a-quote').getByRole('button',{name:ar?'الخطوة التالية':'Next Step',exact:true}).click();await page.waitForTimeout(650);};
try {
 for(const width of (process.env.SWITCH_ONLY ? [] : [360,390,430,1536])) for(const country of (process.env.SWITCH_ONLY ? [] : ['qatar','oman'])) for(const lang of ['en','ar']) {
  const ar=lang==='ar',route=(ar?'/ar':'')+`/shipping-from-china-to-${country}/`;
  await page.setViewportSize({width,height:900});await page.goto(base+route+'?ddnz_test=1');await page.locator('.gulf-hero').waitFor();
  assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('.gulf-page').getAttribute('dir'),ar?'rtl':'ltr');
  assert.equal(await page.locator('main').getAttribute('data-destination'),country==='qatar'?'Qatar':'Oman');
  assert.equal(await page.locator('.gulf-page').evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`${route} ${width} overflow`);
  for(const img of await page.locator('main img').all()) {await img.scrollIntoViewIfNeeded();await img.evaluate(img=>img.decode());}
  await page.evaluate(()=>scrollTo(0,0));
  const broken=await page.locator('main img').evaluateAll(imgs=>imgs.filter(x=>!x.complete||!x.naturalWidth).map(x=>x.src));assert.deepEqual(broken,[]);
  await page.screenshot({path:`${out}/screenshots/${country}-${lang}-${width}-hero.png`});
  // Every authored anchor points to an existing target or generated local page.
  const hrefs=await page.locator('main a').evaluateAll(as=>as.map(a=>a.getAttribute('href')));
  for(const href of hrefs) {
   if(href.startsWith('#')) assert.equal(await page.locator(href).count(),1,href);
   else if(href.startsWith('/')) assert.equal((await context.request.get(base+href)).status(),200,href);
  }
  for(const sel of ['.gulf-cta','.gulf-secondary']) {await page.locator(sel).click();await page.waitForTimeout(100);assert.equal(new URL(page.url()).hash,'#gulf-quote');}
  for(const link of await page.locator('.gulf-chapters a').all()) {await link.click();assert.equal(await page.locator(await link.getAttribute('href')).isVisible(),true);}
  for(const detail of await page.locator('.gulf-faq details').all()){await detail.locator('summary').click();assert.equal(await detail.getAttribute('open'),'');await detail.locator('summary').click();}
  const v=page.locator('video');await v.scrollIntoViewIfNeeded();
  assert.equal(await v.getAttribute('preload'),'none');assert.equal(await v.getAttribute('autoplay'),null);
  await v.evaluate(async video=>{video.muted=true;await video.play();});
  await page.waitForFunction(()=>{const v=document.querySelector('video');return v.currentTime>.4&&v.videoWidth>0;});
  await page.waitForFunction(lang=>{const v=document.querySelector('video');return [...v.textTracks].some(t=>t.language===lang&&t.mode==='showing'&&t.cues?.length>0);},lang);
  const media=await v.evaluate(video=>({duration:video.duration,width:video.videoWidth,height:video.videoHeight,time:video.currentTime,tracks:[...video.textTracks].map(t=>({language:t.language,mode:t.mode,cues:t.cues?.length}))}));
  await v.evaluate(video=>video.pause());await page.screenshot({path:`${out}/screenshots/${country}-${lang}-${width}-video.png`});
  assert.equal(await page.locator('#get-a-quote h4').count(),3);
  assert.ok(!/Central Asia|Russia|أفضل/.test(await page.locator('#get-a-quote').innerText()));
  if(ar) assert.ok(!/Sea services|Air services|Warehouse services/.test(await page.locator('#get-a-quote').innerText()));
  await page.locator('#get-a-quote button').filter({has:page.locator('h4')}).first().click();await next(ar);assert.equal(await page.locator('#quote-cargo-weight').inputValue(),'');assert.equal(await page.locator('#quote-cargo-volume').inputValue(),'');await next(ar);
  assert.equal(await page.locator('[name="Destination"]').inputValue(),country==='qatar'?'Qatar':'Oman');assert.equal(await page.locator('[name="Weight_Status"]').inputValue(),'unknown');assert.equal(await page.locator('[name="Volume_Status"]').inputValue(),'unknown');
  await page.locator('#quote-contact-name').scrollIntoViewIfNeeded();await page.waitForTimeout(200);if(width<768) assert.equal(await page.locator('[data-floating-control]:visible').count(),0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.screenshot({path:`${out}/screenshots/${country}-${lang}-${width}-form.png`});
  results.push({route,width,media,anchors:hrefs.length,form:'unknown values and country retained',pass:true});console.log(route,width,'pass');
 }
 // Each displayed transport option retains its existing backend enum.
 for(const country of (process.env.SWITCH_ONLY ? [] : ['qatar','oman'])) for(const lang of ['en','ar']) for(const mode of ['Sea','Air','Warehouse']) {
  const ar=lang==='ar';await page.goto(base+(ar?'/ar':'')+`/shipping-from-china-to-${country}/?ddnz_test=1`);
  const names=ar?{Sea:'الشحن البحري',Air:'الشحن الجوي',Warehouse:'خدمات المستودعات'}:{Sea:'Sea',Air:'Air',Warehouse:'Warehouse'};
  const option=page.locator('#get-a-quote button').filter({has:page.locator('h4').filter({hasText:names[mode]})});await option.click();
  await next(ar);await next(ar);
  assert.equal(await page.locator('[name="Selected_Service"]').inputValue(),mode);
  assert.equal(await page.locator('[name="Destination"]').inputValue(),country==='qatar'?'Qatar':'Oman');
  assert.equal(await page.locator('[name="Weight_Status"]').inputValue(),'unknown');
  results.push({check:'mode-contract',country,lang,mode,pass:true});
 }
 // In-app round trips through all existing language versions retain country.
 await page.setViewportSize({width:390,height:844});
 for(const country of ['qatar','oman']){
  await page.goto(base+`/shipping-from-china-to-${country}/?source=round2&ddnz_test=1#main-content`);
  for(const lang of ['ar','fr','pt','tr','zh-CN','ru','es','en']){
   await page.locator('[aria-controls="mobile-language-menu"]').click();await page.locator(`#mobile-language-menu a[lang="${lang}"]`).click();
   const prefix=lang==='en'?'':lang==='zh-CN'?'/zh-cn':'/'+lang;
   await page.waitForURL(u=>u.pathname===`${prefix}/shipping-from-china-to-${country}/`);
   await page.locator('h1').waitFor();await page.waitForTimeout(300);assert.equal(await page.locator('h1').count(),1);assert.equal(new URL(page.url()).searchParams.get('source'),'round2');
  }
  results.push({check:'eight-language-round-trip',country,pass:true});
 }
 assert.deepEqual(errors,[]);
} finally {fs.writeFileSync(`${out}/browser-results.json`,JSON.stringify({results,errors,blockedExternal:blocked},null,2));await browser.close();}
