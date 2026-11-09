import fs from 'node:fs/promises';
import {releaseRevision,schemaRevision} from './blog-publication-state.mjs';
const read=async f=>JSON.parse(await fs.readFile(f,'utf8'));
const catalog=await read('src/data/blog-release-manifest.json'),registry=await read('src/data/blog-publications.json');const pending=[];
const candidates=catalog.releases.filter(e=>!registry.publications[e.slug]);
if(candidates.length){
 const response=await fetch(catalog.site+'/sitemap.xml',{headers:{'cache-control':'no-cache'},signal:AbortSignal.timeout(20000)});if(!response.ok)throw new Error('Cannot verify prior publication inventory');
 const xml=await response.text(),urls=new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&')));
 for(const e of candidates){
  if(urls.has(e.canonical))throw new Error('Existing URL cannot receive a new first-publication timestamp: '+e.slug);
  const existing=await fetch(e.canonical,{method:'HEAD',redirect:'manual',headers:{'cache-control':'no-cache'},signal:AbortSignal.timeout(15000)});
  if(existing.status!==404)throw new Error('New-URL status could not be verified (expected 404): '+e.slug);
  pending.push({slug:e.slug,new_url:true,release_revision:releaseRevision(await read(e.release_file)),schema_revision:schemaRevision(await read(e.schema_file))});
 }
}
await fs.mkdir('artifacts',{recursive:true});await fs.writeFile('artifacts/blog-pending.json',JSON.stringify(pending,null,2)+'\n');
if(process.env.GITHUB_OUTPUT)await fs.appendFile(process.env.GITHUB_OUTPUT,`count=${pending.length}\n`);console.log(JSON.stringify({pending:pending.length}));
