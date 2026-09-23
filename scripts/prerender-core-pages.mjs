import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
const root=process.cwd(), dist=path.join(root,'dist');
const routes=[...fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname)
 .filter(p=>/^\/(?:(?:zh-cn|ru|fr|es|ar|pt|tr)\/)?(?:(?:insights|how-we-work|products|sourcing-services)\/)?$/.test(p)||['/products/','/sourcing-services/'].includes(p));
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'ddnz-core-ssr-'));
try {
 const bundle=path.join(temporary,'renderer.cjs');
 await build({entryPoints:[path.join(root,'scripts/render-country-pages.tsx')],outfile:bundle,bundle:true,platform:'node',format:'cjs',jsx:'automatic',loader:{'.css':'empty'},define:{'import.meta.env':JSON.stringify({DEV:false,PROD:true,MODE:'production',BASE_URL:'/'})},logLevel:'warning'});
 const {renderCorePage}=createRequire(import.meta.url)(bundle);
 const outputs=[];
 for(const route of routes){
  const file=path.join(dist,route,'index.html'), html=fs.readFileSync(file,'utf8');
  const body=renderCorePage(route).replace(/opacity:0(?=[;" ])/g,'opacity:1');
  if((body.match(/<h1\b/g)||[]).length!==1)throw new Error(`Core H1 count: ${route}`);
  const rootPattern=/<div id="root"(?: data-core-prerender="true")?>[\s\S]*<\/div>(?=\s*<\/body>)/;
  if(!rootPattern.test(html))throw new Error(`Core root not found: ${route}`);
  let output=html.replace(rootPattern,`<div id="root" data-core-prerender="true">${body}</div>`);
  // Core routes use their existing page CSS; bundle filenames vary by build.
  const cssPrefixes=route==='/products/'?['ProductsIndex-','food-processing-','ShowcaseContactFooter-']:route==='/sourcing-services/'?['SourcingServices-','ServiceMotion-','ShowcaseContactFooter-']:['Footer-'];
  for(const css of fs.readdirSync(path.join(dist,'assets')).filter(f=>f.endsWith('.css')&&cssPrefixes.some(prefix=>f.startsWith(prefix)))){
   if(!output.includes(`/assets/${css}`))output=output.replace('</head>',`<link rel="stylesheet" href="/assets/${css}"></head>`);
  }
  outputs.push([file,output]);
 }
 for(const [file,html]of outputs)fs.writeFileSync(file,html);
 console.log(`Core pre-render: ${outputs.length} existing pages with buyer questions, process details and article discovery.`);
} finally {fs.rmSync(temporary,{recursive:true,force:true});}
