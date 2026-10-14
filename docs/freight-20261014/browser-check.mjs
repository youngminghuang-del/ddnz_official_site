import { chromium } from '/Users/huangyangming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.PREVIEW_URL || 'http://127.0.0.1:4187';
const out='docs/freight-20261014/evidence';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const langs=['en','zh','ru','fr','es','ar','pt','tr'];
const prefix=l=>l==='en'?'':l==='zh'?'/zh-cn':'/'+l;
const nextNames=['Next Step','下一步','Далее','Étape suivante','Siguiente paso','الخطوة التالية','Próxima etapa','Sonraki adım'];
const results=[];let mockResult='success';const captured=[];const errors=[];let blocked=0;
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
await context.route('**/*',async route=>{
 const req=route.request(),u=new URL(req.url());
 if(u.hostname==='formspree.io'){
   assert.equal(req.method(),'POST');captured.push({url:req.url(),body:req.postData()});
   return route.fulfill({status:mockResult==='success'?200:422,contentType:'application/json',body:JSON.stringify(mockResult==='success'?{next:base+'/?isolated_success=1'}:{errors:[{message:'Isolated test: please retry'}]})});
 }
 if(u.origin!==base){blocked++;return route.abort();}
 return route.continue();
});
await context.addInitScript(()=>{localStorage.setItem('cookieConsent','declined');localStorage.setItem('cookiePreferences',JSON.stringify({necessary:true,functional:true,tracking:false,targeting:false}));});
const page=await context.newPage();page.on('pageerror',e=>errors.push(e.stack+' CAUSE '+e.cause?.stack));
async function go(path){const url=new URL(base+path);url.searchParams.set('ddnz_test','1');await page.goto(url.href);await page.locator('header').first().waitFor();const decline=page.getByRole('button',{name:'Decline',exact:true});if(await decline.isVisible())await decline.click();}
async function widthCheck(label){const v=await page.evaluate(()=>({width:innerWidth,body:document.documentElement.scrollWidth}));assert.ok(v.body<=v.width+1,`${label}: overflow ${JSON.stringify(v)}`);return v;}
async function shot(name,el){await page.waitForTimeout(650);await (el||page).screenshot({path:`${out}/${name}.png`});}
async function next(l='en'){await page.locator('#get-a-quote').getByRole('button',{name:nextNames[langs.indexOf(l)],exact:true}).click();await page.waitForTimeout(650);}
async function cargo(l='en',path=prefix(l)+'/shipping-from-china-to-qatar/'){
 await go(['pt','tr'].includes(l)&&path.includes('shipping-from-china-to-qatar')?prefix(l)+'/get-a-quote/?dest=Qatar':path);await page.locator('#get-a-quote button').nth(4).click();await next(l);await page.locator('#quote-cargo-weight').waitFor();await page.waitForTimeout(650);
}
try {
 for(const width of (process.env.HANDOFF_ONLY ? [] : [360,390,430,1536])){
  await page.setViewportSize({width,height:900});
  for(const lang of langs){
   await go(prefix(lang)+'/shipping-from-china-to-qatar/?source=isolated_nav#main-content');
   const mobile=width<1280;
   if(mobile){
    await page.locator('[aria-controls="mobile-navigation"]').click();
    await page.locator('[aria-controls="mobile-markets-menu"]').click();
    const trigger=page.locator('[aria-controls="mobile-language-menu"]');
    const before=await trigger.boundingBox();assert.ok(before.y>=0&&before.y+before.height<150);
    await page.locator('#mobile-navigation').evaluate(el=>el.scrollTop=el.scrollHeight);
    const after=await trigger.boundingBox();assert.equal(after.y,before.y);
    if(lang==='en' || lang==='ar'){await page.locator('#mobile-navigation').evaluate(el=>el.scrollTop=0);await shot(`nav-${lang}-${width}`);}
    await trigger.click();
    assert.equal(await page.locator('#mobile-language-menu a').count(),8);
    assert.equal(await page.locator('#mobile-language-menu a[lang="fr"]').innerText(),'Français');
    await widthCheck(`language panel ${lang} ${width}`);
    if(lang==='en'||lang==='ar')await shot(`languages-${lang}-${width}`);
    await page.keyboard.press('Escape');assert.equal(await trigger.getAttribute('aria-expanded'),'false');assert.ok(await trigger.evaluate(el=>el===document.activeElement));
    await trigger.click();
    const target=langs[(langs.indexOf(lang)+1)%8];
    await page.locator(`#mobile-language-menu a[lang="${target==='zh'?'zh-CN':target}"]`).click();
    await page.waitForURL(url=>url.pathname===prefix(target)+'/shipping-from-china-to-qatar/');
    assert.equal(new URL(page.url()).searchParams.get('source'),'isolated_nav');assert.equal(new URL(page.url()).hash,'#main-content');
    await page.waitForFunction(dir=>document.querySelector('header')?.dir===dir,target==='ar'?'rtl':'ltr');assert.equal(await page.locator('header').first().getAttribute('dir'),target==='ar'?'rtl':'ltr');
   }else{
    await page.locator('[data-dropdown-trigger="language"]').click();
    assert.equal(await page.locator('#desktop-language-menu a').count(),8);await page.keyboard.press('Escape');
    if(lang==='en'||lang==='ar')await shot(`desktop-${lang}`);
   }
   await widthCheck(`navigation ${lang} ${width}`);results.push({check:'navigation-language-same-route',lang,width,passed:true});console.log('nav',lang,width);
  }
 }
 for(const width of (process.env.HANDOFF_ONLY ? [] : [360,390,430,1536])){
  await page.setViewportSize({width,height:900});
  for(const lang of langs){
   await cargo(lang);
   assert.equal(await page.locator('#quote-cargo-weight').inputValue(),'');assert.equal(await page.locator('#quote-cargo-volume').inputValue(),'');
   await widthCheck(`cargo ${lang} ${width}`);
   if(width<768) { await page.locator('#quote-cargo-weight').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('#get-a-quote')?.hasAttribute('data-quote-visible'));assert.equal(await page.locator('[data-floating-control]:visible').count(),0); }
   if(['en','ar'].includes(lang)){await page.locator('#quote-cargo-weight').scrollIntoViewIfNeeded();await shot(`cargo-${lang}-${width}`,page.locator('#get-a-quote .max-w-4xl'));}
   await next(lang);await page.locator('#quote-form').waitFor();
   assert.equal(await page.locator('[name="Weight_Status"]').inputValue(),'unknown');assert.equal(await page.locator('[name="Volume_Status"]').inputValue(),'unknown');
   const destination=await page.locator('[name="Destination"]').inputValue();assert.ok(destination);assert.notEqual(destination,'UAE');
   await widthCheck(`contact ${lang} ${width}`);
   if(['en','ar'].includes(lang))await shot(`contact-${lang}-${width}`,page.locator('#get-a-quote .max-w-4xl'));
   results.push({check:'blank-cargo-contact-layout',width,lang,destination,passed:true});console.log('form',lang,width);
  }
 }
 await page.setViewportSize({width:390,height:844});await go('/shipping-from-china-to-qatar/');
 const languageTrigger=page.locator('[aria-controls="mobile-language-menu"]');await languageTrigger.focus();await page.keyboard.press('ArrowDown');await page.locator('#mobile-language-menu').waitFor();
 assert.ok(await page.locator('#mobile-language-menu').evaluate(el=>el.contains(document.activeElement)));
 await page.locator('#mobile-language-menu a').last().focus();await page.keyboard.press('Tab');assert.equal(await languageTrigger.getAttribute('aria-expanded'),'false');
 await page.locator('[aria-controls="mobile-navigation"]').click();await page.keyboard.press('Escape');assert.equal(await page.locator('[aria-controls="mobile-navigation"]').getAttribute('aria-expanded'),'false');assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
 assert.ok(await page.locator('[data-floating-control]').first().isVisible());results.push({check:'keyboard-arrow-tab-escape-and-scroll-restoration',passed:true});
 await cargo();
 for(const invalid of ['0','-2','e','Infinity']){
  await page.locator('#quote-cargo-weight').fill(invalid);assert.equal(await page.locator('#quote-cargo-weight').getAttribute('aria-invalid'),'true');assert.ok(await page.getByRole('button',{name:'Next Step',exact:true}).isDisabled());
 }
 await page.locator('#quote-cargo-weight').fill('35.5');await next();
 assert.equal(await page.locator('[name="Estimated_Weight_KG"]').inputValue(),'35.5 KG');assert.equal(await page.locator('[name="Volume_Status"]').inputValue(),'unknown');
 await page.locator('#quote-contact-name').fill('Isolated Validation');
 await page.locator('#quote-form button[type="submit"]').click();assert.equal(captured.length,0);assert.equal(await page.locator('#quote-contact-email').getAttribute('aria-invalid'),'true');
 await page.locator('#quote-contact-email').fill('isolated-validation@example.invalid');mockResult='error';
 await page.locator('#quote-form button[type="submit"]').click();await page.getByText('Isolated test: please retry',{exact:true}).waitFor();
 assert.equal(captured.length,1);assert.ok(!await page.locator('#quote-form button[type="submit"]').isDisabled());
 assert.ok(captured[0].body.includes('35.5 KG'));assert.ok(captured[0].body.includes('Unknown'));assert.ok(captured[0].body.includes('unknown'));assert.ok(!captured[0].body.includes('350 KG'));
 mockResult='success';await page.locator('#quote-form button[type="submit"]').click();await page.locator('#quote-form').waitFor({state:'hidden'});assert.equal(captured.length,2);
 results.push({check:'invalid-contact-failure-retry-partial-cargo-mocked-success',passed:true});
 await cargo();await page.locator('#quote-cargo-weight').fill('350.5');await page.locator('#quote-cargo-volume').fill('2.5');await next();
 assert.equal(await page.locator('[name="Estimated_Weight_KG"]').inputValue(),'350.5 KG');assert.equal(await page.locator('[name="Estimated_Volume_CBM"]').inputValue(),'2.5 CBM');
 await page.getByRole('button',{name:'Back',exact:true}).click();await page.getByRole('button',{name:'I do not know these measurements yet',exact:true}).click();await next();
 assert.equal(await page.locator('[name="Weight_Status"]').inputValue(),'unknown');assert.equal(await page.locator('[name="Volume_Status"]').inputValue(),'unknown');
 results.push({check:'known-values-back-and-explicit-clear',passed:true});
 await go('/shipping-from-china-to-uae/');
 const uaeQuote=page.locator('a[href*="get-a-quote"]:visible').filter({hasText:/quote/i}).first();await uaeQuote.click();await page.waitForURL(/get-a-quote/);await page.locator('#get-a-quote button').nth(4).click();await next();await next();
 assert.match(await page.locator('[name="Destination"]').inputValue(),/UAE|Emirates/);results.push({check:'uae-route-destination-handoff',passed:true});
 await go('/sourcing/portable-air-conditioners-from-china/');await page.getByRole('button',{name:/Add.*configuration/i}).first().click();
 await page.getByLabel('Destination country or port',{exact:true}).fill('UAE');await page.getByRole('link',{name:/Review air conditioner request/}).click();await page.waitForURL(/get-a-quote/);
 await page.waitForFunction(()=>document.querySelector('#trade-product-details')?.value.includes('SOG-1'));
 const values=await page.locator('input,textarea').evaluateAll(nodes=>nodes.map(n=>({name:n.name,value:n.value})));assert.ok(values.some(x=>/SOG-1/.test(x.value)));assert.ok(values.some(x=>/AC (110|220) V/.test(x.value)));await shot('product-handoff');assert.ok(values.some(x=>x.value==='UAE'));assert.ok(values.some(x=>/20/.test(x.value)&&/SOG-1/.test(x.value)));results.push({check:'product-model-voltage-quantity-destination-handoff',passed:true});
 await go('/blog/top-10-privacy-screen-protector-manufacturers-china/');assert.match(await page.locator('h1').innerText(),/privacy/i);await page.locator('form').first().waitFor();assert.ok(await page.locator('form').count());results.push({check:'pr64-65-article-and-form-retained',passed:true});
 assert.deepEqual(errors,[]);
 fs.writeFileSync(`${out}/browser-results.json`,JSON.stringify({base,browserVersion:browser.version(),mode:process.env.HANDOFF_ONLY?'handoff-only':'full',results,mockRequests:captured,externalRequestsBlocked:blocked,errors},null,2));
 console.log(JSON.stringify({passed:results.length,mockRequests:captured.length,blocked,errors},null,2));
} catch(error){await shot('failure');fs.writeFileSync(`${out}/browser-failure.json`,JSON.stringify({error:String(error),url:page.url(),results,errors},null,2));throw error;} finally {await browser.close();}
