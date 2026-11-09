import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
export const VERSION = 1;
const protectedPath='/top-10-screen-protector-manufacturers-alibaba/';
const hash = text => createHash('sha256').update(text).digest('hex');
export function normalizeHtml(html) {
  // Bundle/cache filenames and executable code are not a page content change.
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, tag => /type=["']application\/ld\+json["']/i.test(tag) ? tag : '')
    .replace(/<link\b[^>]*(?:modulepreload|stylesheet)[^>]*>/gi,'')
    .replace(/\s+/g,' ').trim();
}
export function validateManifest(m) {
  if (m?.version !== VERSION || !m.site || !m.urls || Array.isArray(m.urls)) throw new Error('Invalid manifest version/data');
  if(m.deployment_completed_at && !Number.isFinite(Date.parse(m.deployment_completed_at)))throw new Error('Invalid deployment ordering');
  if(m.source_run_id && (!Number.isSafeInteger(m.source_run_id)||m.source_run_id<=0))throw new Error('Invalid production run');
  const site=new URL(m.site);if(site.protocol!=='https:')throw new Error('HTTPS site required');
  for(const [url,digest] of Object.entries(m.urls)) {
    const u=new URL(url);if(u.pathname.endsWith(protectedPath))throw new Error('Protected legacy URL is excluded from automatic notifications');if(u.origin!==site.origin||u.search||u.hash||!/^[a-f0-9]{64}$/.test(digest))throw new Error('Invalid manifest URL/hash');
  }
  return m;
}
export async function buildManifest(dist, site='https://www.ddnzglobal.com') {
  dist=path.resolve(dist);const xml=await fs.readFile(path.join(dist,'sitemap.xml'),'utf8');const urls={};
  for(const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const url=match[1].replaceAll('&amp;','&');const u=new URL(url);if(u.pathname.endsWith(protectedPath))continue;if(u.origin!==site)throw new Error('Off-site sitemap URL');
    const filename=path.resolve(dist,'.'+decodeURIComponent(u.pathname),u.pathname.endsWith('/')?'index.html':'');
    if(!filename.startsWith(dist+path.sep))throw new Error('Unsafe sitemap route');
    const html=await fs.readFile(filename,'utf8');const media=[];
    for(const m of html.matchAll(/<(?:img|source)\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
      const src=new URL(m[1].replaceAll('&amp;','&'),url);if(src.origin!==site||!src.pathname.startsWith('/images/'))continue;
      const asset=path.resolve(dist,'.'+decodeURIComponent(src.pathname));if(!asset.startsWith(dist+path.sep))throw new Error('Unsafe image route');
      try { media.push([src.pathname,hash(await fs.readFile(asset))]); }
      catch(error) { if(error.code!=='ENOENT')throw error; media.push([src.pathname,'missing']); }
      // Legacy missing references are fingerprinted, not repaired. Selected blog images still fail the template gate.
    }
    urls[url]=hash(normalizeHtml(html)+'\n'+JSON.stringify([...new Map(media)].sort()));
  }
  return validateManifest({version:VERSION,site,urls});
}
export function diffManifests(current, previous) {
  validateManifest(current);if(!previous)return {bootstrap:true,added:[],changed:[],removed:[],urls:[]};
  validateManifest(previous);if(previous.site!==current.site)throw new Error('Manifest sites differ');
  const added=Object.keys(current.urls).filter(u=>!(u in previous.urls));const changed=Object.keys(current.urls).filter(u=>u in previous.urls&&current.urls[u]!==previous.urls[u]);
  return {bootstrap:false,added,changed,removed:Object.keys(previous.urls).filter(u=>!(u in current.urls)),urls:[...added,...changed].sort()};
}
