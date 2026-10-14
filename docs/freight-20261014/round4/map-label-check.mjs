import { chromium } from '/Users/huangyangming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';
const base='http://127.0.0.1:4187',out='docs/freight-20261014/round4',paths=[...fs.readFileSync('public/media/freight-20261014-round4/oman-regional.svg','utf8').matchAll(/ d="([^"]+)"/g)].map(m=>m[1]);
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),ctx=await b.newContext({reducedMotion:'reduce'}),results=[];
await ctx.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());await ctx.addInitScript(()=>localStorage.setItem('cookieConsent','declined'));
const p=await ctx.newPage();try {
for(const locale of ['en','ar'])for(const width of [360,390,430,1110,1536]){
 await p.setViewportSize({width,height:1050});await p.goto(base+(locale==='ar'?'/ar':'')+'/shipping-from-china-to-oman/?ddnz_test=1');const map=p.locator('[data-regional-map]');await map.waitFor();
 const bounds=await map.locator('.gulf-region-label').filter({hasText:locale==='en'?'Sea of Oman':'بحر عُمان'}).evaluate(el=>{const r=el.getBBox();return {x:r.x,y:r.y,w:r.width,h:r.height};});
 const samples=await p.evaluate(({paths,bounds})=>{const ctx=document.createElement('canvas').getContext('2d'),land=paths.map(d=>new Path2D(d));const hits=[];for(let x=bounds.x;x<=bounds.x+bounds.w;x+=4)for(let y=bounds.y;y<=bounds.y+bounds.h;y+=4)if(land.some(path=>ctx.isPointInPath(path,x,y,'evenodd')))hits.push({x,y});return hits;},{paths,bounds});assert.equal(samples.length,0,JSON.stringify({locale,width,bounds,samples:samples.slice(0,3)}));
 const overlap=await map.locator('.gulf-point-label').evaluateAll((els,sea)=>els.some(el=>{const r=el.getBBox();return r.x<sea.x+sea.w&&r.x+r.width>sea.x&&r.y<sea.y+sea.h&&r.y+r.height>sea.y;}),bounds);assert.equal(overlap,false);
 const pointCollision=await map.evaluate(el=>{
  const labels=[...el.querySelectorAll('.gulf-point-label')].map(t=>t.getBBox()),points=[...el.querySelectorAll('[data-map-point] circle')].map(c=>({x:Number(c.getAttribute('cx')),y:Number(c.getAttribute('cy'))}));
  return labels.some(r=>points.some(p=>{const dx=Math.max(r.x-p.x,0,p.x-r.x-r.width),dy=Math.max(r.y-p.y,0,p.y-r.y-r.height);return Math.hypot(dx,dy)<30;}));
 });assert.equal(pointCollision,false,'Node names must clear all node markers by 30 SVG units');
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await map.scrollIntoViewIfNeeded();await map.screenshot({path:`${out}/screenshots/oman-${locale}-${width}-map.png`});results.push({locale,width,seaLabelEntireBoundingBoxInWater:true,noPointLabelOverlap:true,noLabelMarkerCollision:true});
}
}finally{fs.writeFileSync(`${out}/map-label-results.json`,JSON.stringify(results,null,2));await b.close();}
