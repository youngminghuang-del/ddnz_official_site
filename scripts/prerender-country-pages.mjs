import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import os from 'node:os';
const root=process.cwd();
const sitemap=fs.readFileSync(path.join(root,'dist/sitemap.xml'),'utf8');
const candidates=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname).filter(p=>/\/shipping-from-china-to-[^/]+\/$/.test(p));
const targets=candidates.filter(p=>/<div id="root">\s*<\/div>|data-country-prerender="true"/.test(fs.readFileSync(path.join(root,'dist',p,'index.html'),'utf8')));
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'ddnz-country-ssr-'));
const bundle=path.join(temporary,'renderer.cjs');
try {
 await build({entryPoints:[path.join(root,'scripts/render-country-pages.tsx')],outfile:bundle,bundle:true,platform:'node',format:'cjs',jsx:'automatic',loader:{'.css':'empty'},define:{'import.meta.env':JSON.stringify({DEV:false,PROD:true,MODE:'production',BASE_URL:'/'})},logLevel:'warning'});
 const {renderCountryPage}=createRequire(import.meta.url)(bundle);
 const outputs=[];
 for(const route of targets){
  const file=path.join(root,'dist',route,'index.html');
  const html=fs.readFileSync(file,'utf8');
  const rendered=renderCountryPage(route);
  if((rendered.match(/<h1\b/g)||[]).length!==1 || !rendered.includes('data-country-cargo-planning'))throw new Error(`Missing rendered main/H1: ${route}`);
  // Motion's initial hidden state must not hide the no-JavaScript document.
  const visible=rendered.replace(/opacity:0(?=[;" ])/g,'opacity:1');
  const original=html.replace(/<div id="root" data-country-prerender="true">[\s\S]*<\/div>(?=\s*<\/body>)/,'<div id="root"></div>');
  let output=original.replace('<div id="root"></div>',`<div id="root" data-country-prerender="true">${visible}</div>`);
  for(const css of fs.readdirSync(path.join(root,'dist/assets')).filter(f=>/^freight-.*\.css$/.test(f))){
   if(!output.includes(`/assets/${css}`))output=output.replace('</head>',`<link rel="stylesheet" href="/assets/${css}"></head>`);
  }
  outputs.push([file,output]);
 }
 for(const [file,output] of outputs)fs.writeFileSync(file,output);
 console.log(`Country pre-render: ${targets.length} existing routes; client page components and locale data reused.`);
} finally {fs.rmSync(temporary,{recursive:true,force:true});}
