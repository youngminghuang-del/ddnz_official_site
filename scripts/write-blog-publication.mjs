// Writes are restricted to the approved manifest, two JSON files per NEW article,
// and the append-only publication registry. Non-fast-forward/protected pushes fail.
import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {Client} from '@notionhq/client';
import {planWriteback} from './blog-publication-state.mjs';
const read=async f=>JSON.parse(await fs.readFile(f,'utf8'));
const catalog=await read('src/data/blog-release-manifest.json'),registry=await read('src/data/blog-publications.json'),pending=await read('artifacts/blog-pending.json'),receipt=await read('artifacts/pages-receipt.json');const files={};
for(const e of catalog.releases)for(const f of [e.release_file,e.schema_file])files[f]=await read(f);
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(head!==receipt.commit && pending.some(p=>registry.publications[p.slug]?.run_id!==receipt.run_id))throw new Error('main advanced since first deployment; preserve receipt and resolve before writeback');
if(process.env.GITHUB_RUN_ID && (receipt.run_id!==Number(process.env.GITHUB_RUN_ID)||receipt.commit!==process.env.GITHUB_SHA))throw new Error('Receipt must belong to this production workflow');
const plan=planWriteback({catalog,registry,pending,receipt,files});
if(process.argv.includes('--dry-run')){console.log(JSON.stringify({writes:Object.keys(plan.writes),targets:plan.targets.map(x=>x.entry.slug)}));process.exit(0)}
for(const [f,data] of Object.entries(plan.writes))await fs.writeFile(f,JSON.stringify(data,null,2)+'\n');
if(Object.keys(plan.writes).length){
 execFileSync('python3',['scripts/check_blog_release.py'],{stdio:'inherit'});
 execFileSync('git',['add','--',...Object.keys(plan.writes)],{stdio:'inherit'});
 execFileSync('git',['-c','user.name=github-actions[bot]','-c','user.email=41898282+github-actions[bot]@users.noreply.github.com','commit','-m','Record first successful blog publication timestamps'],{stdio:'inherit'});
 execFileSync('git',['push','origin','HEAD:main'],{stdio:'inherit'});
}
// Retry is safe: update only these newly deployed, approved page IDs and exact Date.
if(plan.targets.length){
 if(!process.env.NOTION_API_KEY)throw new Error('Notion date sync requires the existing Notion secret');
 const notion=new Client({auth:process.env.NOTION_API_KEY});
 for(const {entry,published_at} of plan.targets){
  const page=await notion.pages.retrieve({page_id:entry.notion_page_id});const current=page.properties?.Date?.date?.start;
  if(Date.parse(current)!==Date.parse(published_at))await notion.pages.update({page_id:entry.notion_page_id,properties:{Date:{date:{start:published_at}}}});
 }
}
const sha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();if(process.env.GITHUB_OUTPUT)await fs.appendFile(process.env.GITHUB_OUTPUT,`reconcile=${plan.targets.length>0}\ncommit=${sha}\n`);
console.log(JSON.stringify({updated:Object.keys(plan.writes),reconcile:plan.targets.length>0,commit:sha}));
