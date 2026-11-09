import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {diffManifests,normalizeHtml} from '../scripts/url-change-manifest.mjs';
import {submitChanges} from '../scripts/push-indexnow-urls.mjs';
import {planWriteback,releaseRevision,schemaRevision} from '../scripts/blog-publication-state.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=async f=>JSON.parse(await fs.readFile(path.join(root,f),'utf8'));
const make=urls=>({version:1,site:'https://www.ddnzglobal.com',urls});
test('preview stages a language correction on an existing post without changing unrelated posts',async()=>{
 const p=await fs.mkdtemp(path.join(os.tmpdir(),'blog-language-'));await fs.mkdir(path.join(p,'src/data'),{recursive:true});
 const catalog=await read('src/data/blog-release-manifest.json'),e=catalog.releases.find(e=>e.slug==='coffee-shop-equipment-checklist');
 const r=await read(e.release_file),g=await read(e.schema_file),other={id:'unrelated',slug:'other',language:'es',title:'Keep this',date:'2020-01-01'};
 await fs.writeFile(path.join(p,'src/data/blog-release-manifest.json'),JSON.stringify({...catalog,releases:[e]}));
 for(const f of [e.release_file,e.schema_file])await fs.writeFile(path.join(p,f),JSON.stringify(await read(f)));
 await fs.writeFile(path.join(p,'src/data/notionBlogData.json'),JSON.stringify([{id:e.notion_page_id,slug:e.slug,language:'zh-CN',title:'旧中文标题',summary:'旧摘要'},other]));
 const result=spawnSync(process.execPath,[path.join(root,'scripts/stage-blog-release-preview.mjs')],{cwd:p,encoding:'utf8'});assert.equal(result.status,0,result.stderr);
 const posts=JSON.parse(await fs.readFile(path.join(p,'src/data/notionBlogData.json'),'utf8')),post=posts[0],article=g['@graph'].find(n=>n['@type']==='BlogPosting');
 assert.equal(post.language,e.language);assert.equal(post.title,article.headline);assert.equal(post.summary,article.description);assert.equal(post.date,r.articleDate);assert.equal(post.lastEdited,r.modifiedAt || r.articleDate);assert.deepEqual(posts[1],other);
});
const a='https://www.ddnzglobal.com/a/',b='https://www.ddnzglobal.com/b/',c='https://www.ddnzglobal.com/c/';
test('IndexNow bootstraps without a bulk push and selects only added/changed URLs',()=>{
 const old=make({[a]:'a'.repeat(64),[b]:'b'.repeat(64)});assert.deepEqual(diffManifests(old,null).urls,[]);assert.deepEqual(diffManifests(old,old).urls,[]);
 const delta=diffManifests(make({[a]:'c'.repeat(64),[c]:'d'.repeat(64)}),old);assert.deepEqual(delta.urls,[a,c]);assert.deepEqual(delta.removed,[b]);
 assert.equal(normalizeHtml('<p>A</p><script src="/assets/old.js"></script>'),normalizeHtml('<p>A</p><script src="/assets/new.js"></script>'));
 assert.notEqual(normalizeHtml('<p>A</p>'),normalizeHtml('<p>B</p>'));
 assert.throws(()=>diffManifests(make({'https://www.ddnzglobal.com/blog/top-10-screen-protector-manufacturers-alibaba/':'a'.repeat(64)}),null),/Protected legacy/);
});
test('IndexNow uses one bounded POST and fails without advancing after HTTP errors',async()=>{
 const current=make({[a]:'b'.repeat(64),[b]:'c'.repeat(64)}),previous=make({[a]:'a'.repeat(64)}),calls=[];
 const common={current,previous,key:'test-key-12345',keyLocation:'https://www.ddnzglobal.com/key.txt'};
 const result=await submitChanges({...common,fetchImpl:async(url,o)=>{calls.push(o);return o.method==='POST'?{status:200}:{ok:true,text:async()=>common.key}}});assert.equal(result.submitted,2);assert.equal(calls.filter(o=>o.method==='POST').length,1);assert.deepEqual(JSON.parse(calls[1].body).urlList,[a,b]);
 await assert.rejects(submitChanges({...common,fetchImpl:async(url,o)=>o.method==='POST'?{status:422}:{ok:true,text:async()=>common.key}}),/checkpoint not advanced/);
 await assert.rejects(submitChanges({...common,current:make({'https://evil.example/':'a'.repeat(64)})}),/Invalid manifest/);
});
async function stateFixture(){
 const catalog=await read('src/data/blog-release-manifest.json'),e=catalog.releases[0],r=await read(e.release_file),g=await read(e.schema_file);
 return {catalog,registry:{version:1,publications:{}},pending:[{slug:e.slug,new_url:true,release_revision:releaseRevision(r),schema_revision:schemaRevision(g)}],receipt:{branch:'main',conclusion:'success',published_at:'2026-11-10T01:02:03Z',run_id:123,commit:'c'.repeat(40)},files:{[e.release_file]:r,[e.schema_file]:g}};
}
test('first publication is written once; retry and later deployments preserve it',async()=>{
 const f=await stateFixture(),first=planWriteback(f),e=f.catalog.releases[0];assert.equal(Object.keys(first.writes).length,3);assert.equal(first.writes[e.release_file].articleDate,f.receipt.published_at);
 const updated={...f,registry:first.registry,files:{...f.files,...first.writes}};assert.deepEqual(planWriteback(updated).writes,{});const later=planWriteback({...updated,receipt:{...f.receipt,run_id:124,published_at:'2026-11-11T01:02:03Z'}});assert.deepEqual(later.writes,{});assert.deepEqual(later.targets,[]);
});
test('date writer rejects old URLs, changed content, unapproved releases and unverified receipts',async()=>{
 const f=await stateFixture();assert.throws(()=>planWriteback({...f,pending:[{...f.pending[0],new_url:false}]}),/Previously published/);
 const changed=structuredClone(f);changed.files[changed.catalog.releases[0].release_file].content+='changed';assert.throws(()=>planWriteback(changed),/changed since deployed/);
 const denied=structuredClone(f);denied.catalog.releases[0].publication_authorized=false;assert.throws(()=>planWriteback(denied),/Unapproved/);
 assert.throws(()=>planWriteback({...f,receipt:{...f.receipt,conclusion:'failure'}}),/receipt/);assert.throws(()=>planWriteback({...f,receipt:{...f.receipt,published_at:'2026-11-10T01:02Z'}}),/receipt/);
});
async function fixture(mutate=x=>x){
 const p=await fs.mkdtemp(path.join(os.tmpdir(),'blog-template-'));await fs.mkdir(path.join(p,'src/data'),{recursive:true});const catalog=await read('src/data/blog-release-manifest.json'),e=catalog.releases[0],r=await read(e.release_file),g=await read(e.schema_file);
 await fs.writeFile(path.join(p,'src/data/blog-release-manifest.json'),JSON.stringify({...catalog,releases:[e]}));
 await fs.copyFile(path.join(root,'src/data/blog-publications.json'),path.join(p,'src/data/blog-publications.json'));
 await fs.writeFile(path.join(p,'src/data/blog-release-legacy-ids.json'),JSON.stringify({ids:[]}));await fs.writeFile(path.join(p,'src/data/notionBlogData.json'),JSON.stringify([{id:e.notion_page_id,slug:e.slug}]));await fs.writeFile(path.join(p,e.release_file),JSON.stringify(r));await fs.writeFile(path.join(p,e.schema_file),JSON.stringify(g));
 for(const src of e.images){const dest=path.join(p,'dist',src);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.copyFile(path.join(root,'public',src),dest);}
 const dest=path.join(p,'dist',new URL(e.canonical).pathname,'index.html');await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,`<html lang="es"><head><meta property="article:published_time" content="${r.articleDate}"><link rel="canonical" href="${e.canonical}"><script type="application/ld+json">${JSON.stringify(g)}</script></head><body><h1>${g['@graph'].find(n=>n['@type']==='BlogPosting').headline}</h1><p>Huang Matthew</p><time datetime="${r.articleDate}"></time><img src="${e.cover}" alt="Cover">${mutate(r.content)}</body></html>`);return {p,e,g,r};
}
const check=f=>spawnSync('python3',[path.join(root,'scripts/check_blog_release.py'),'--root',f.p,'--dist',path.join(f.p,'dist')],{encoding:'utf8'});
test('complete template accepts six images and four FAQs, rejecting duplicate cover and missing answer',async()=>{
 const good=await fixture();const result=check(good);assert.equal(result.status,0,result.stdout);
 const dup=await fixture(body=>body+`<img src="${good.e.cover}" alt="Duplicate">`);assert.match(check(dup).stdout,/display once/);assert.notEqual(check(dup).status,0);
 const answer=good.g['@graph'].find(n=>n['@type']==='FAQPage').mainEntity[0].acceptedAnswer.text;const missing=await fixture(body=>body.replace(answer,''));assert.notEqual(check(missing).status,0);assert.match(check(missing).stdout,/FAQ differs/);
});
test('unregistered new articles and unzoned publication dates are blocked',async()=>{
 const f=await fixture();await fs.writeFile(path.join(f.p,'src/data/notionBlogData.json'),JSON.stringify([{id:'new-id',slug:'unregistered'}]));assert.notEqual(check(f).status,0);
 const bad=await fixture();bad.g['@graph'].find(n=>n['@type']==='BlogPosting').datePublished='2026-11-09';await fs.writeFile(path.join(bad.p,bad.e.schema_file),JSON.stringify(bad.g));assert.notEqual(check(bad).status,0);
});
test('production and notification queues are independent and npm always runs the full template gate',async()=>{
 const deploy=await fs.readFile(path.join(root,'.github/workflows/deploy.yml'),'utf8'),notify=await fs.readFile(path.join(root,'.github/workflows/indexnow.yml'),'utf8'),pkg=await read('package.json');assert.doesNotMatch(deploy,/push-indexnow|push-baidu/);assert.match(notify,/workflow_run/);assert.match(notify,/group: indexnow-notifications/);assert.match(deploy,/group: github-pages-production/);assert.match(deploy,/if: needs.build.outputs.pending != '0'/);assert.match(deploy,/artifact_name: github-pages-reconciled/);assert.match(pkg.scripts.postbuild,/check_blog_release.py --dist dist/);assert.match(pkg.scripts['postbuild:preview'],/check_blog_release.py --dist dist/);
});
test('older notification replays do not roll checkpoints back; dry runs never write a checkpoint',async()=>{
 const previous={...make({[a]:'a'.repeat(64)}),deployment_completed_at:'2026-11-10T01:00:00Z'},current={...make({[a]:'b'.repeat(64)}),deployment_completed_at:'2026-11-09T01:00:00Z'};
 const result=await submitChanges({current,previous,key:'test-key-12345',keyLocation:'https://www.ddnzglobal.com/key.txt',fetchImpl:()=>{throw new Error('Must not notify older content')}});assert.equal(result.stale,true);assert.equal(result.submitted,0);
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'indexnow-dry-'));await fs.writeFile(path.join(dir,'current.json'),JSON.stringify(make({[a]:'b'.repeat(64)})));await fs.writeFile(path.join(dir,'prior.json'),JSON.stringify(make({[a]:'a'.repeat(64)})));
 const checkpoint=path.join(dir,'checkpoint.json');const r=spawnSync(process.execPath,['scripts/push-indexnow-urls.mjs','--manifest',path.join(dir,'current.json'),'--baseline',path.join(dir,'prior.json'),'--checkpoint',checkpoint,'--dry-run'],{cwd:root,encoding:'utf8'});assert.equal(r.status,0,r.stderr);await assert.rejects(fs.stat(checkpoint));
});

test('complete template blocks unconfirmed image rights',async()=>{
 const f=await fixture();const manifest=JSON.parse(await fs.readFile(path.join(f.p,'src/data/blog-release-manifest.json'),'utf8'));manifest.releases[0].image_rights_confirmed=false;await fs.writeFile(path.join(f.p,'src/data/blog-release-manifest.json'),JSON.stringify(manifest));const result=check(f);assert.notEqual(result.status,0);assert.match(result.stdout,/rights/);
});
