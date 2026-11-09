import {createHash} from 'node:crypto';
export const protectedSlug='top-10-screen-protector-manufacturers-alibaba';
export const hash = v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
export function releaseRevision(r){const copy=structuredClone(r);delete copy.articleDate;return hash(copy)}
export function schemaRevision(g){const copy=structuredClone(g);for(const n of copy['@graph'])if(n['@type']==='BlogPosting'){delete n.datePublished;delete n.dateModified}return hash(copy)}
export function planWriteback({catalog,registry,pending,receipt,files}){
 if(receipt?.branch!=='main'||receipt?.conclusion!=='success'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/.test(receipt.published_at)||!Number.isFinite(Date.parse(receipt.published_at)))throw new Error('Verified main Pages receipt required');
 if(!Number.isSafeInteger(receipt.run_id)||receipt.run_id<=0||! /^[a-f0-9]{40}$/.test(receipt.commit))throw new Error('Invalid deployment identity');
 const next=structuredClone(registry),writes={},targets=[];
 for(const request of pending){
  const e=catalog.releases.find(e=>e.slug===request.slug);if(!e||e.slug===protectedSlug||!e.publication_authorized||!e.reviewer||!e.image_rights_confirmed)throw new Error('Unapproved or protected release');
  for(const file of [e.release_file,e.schema_file])if(!/^src\/data\/[A-Za-z0-9_-]+\.json$/.test(file))throw new Error('Unsafe publication write path');
  const r=structuredClone(files[e.release_file]),g=structuredClone(files[e.schema_file]);
  if(releaseRevision(r)!==request.release_revision||schemaRevision(g)!==request.schema_revision)throw new Error('Article changed since deployed version; do not overwrite');
  const existing=registry.publications[e.slug];
  if(existing){
   // Historical registrations and re-runs never acquire a new timestamp.
   if(existing.run_id!==receipt.run_id)continue;
   targets.push({entry:e,published_at:existing.published_at});continue;
  }
  if(!request.new_url)throw new Error('Previously published URL needs verified historical registration, not automatic backfill');
  const article=g['@graph'].find(n=>n['@type']==='BlogPosting');if(!article)throw new Error('BlogPosting missing');
  const provisional=article.datePublished;article.datePublished=receipt.published_at;if(article.dateModified===provisional)article.dateModified=receipt.published_at;r.articleDate=receipt.published_at;
  writes[e.release_file]=r;writes[e.schema_file]=g;next.publications[e.slug]={published_at:receipt.published_at,run_id:receipt.run_id,commit:receipt.commit,source:'Successful Deploy to GitHub Pages step'};targets.push({entry:e,published_at:receipt.published_at});
 }
 if(Object.keys(writes).length)writes['src/data/blog-publications.json']=next;
 return {writes,targets,registry:next};
}
