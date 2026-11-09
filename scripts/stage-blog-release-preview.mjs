// Local/PR preview only. Production still requires strict live Notion Published status.
import fs from 'node:fs/promises';
const read=async f=>JSON.parse(await fs.readFile(f,'utf8'));
const {releases}=await read('src/data/blog-release-manifest.json');const data=await read('src/data/notionBlogData.json');
for(const e of releases){
 const r=await read(e.release_file),g=await read(e.schema_file),a=g['@graph'].find(n=>n['@type']==='BlogPosting');
 const fields={date:r.articleDate,lastEdited:r.articleDate,content:r.content,toc:r.toc,wordCount:r.wordCount,readMinutes:r.readMinutes,reviewer:r.reviewer,thumbnailUrl:e.cover};
 let post=data.find(p=>p.id===e.notion_page_id);
 if(post)Object.assign(post,fields);
 else data.unshift({id:e.notion_page_id,slug:e.slug,status:'Published',title:a.headline,summary:a.description,language:e.language,category:'Project Logistics',leadGoal:'Freight Export',productCategory:'Not Applicable',qualityScore:88,lastVerified:r.approvedAt,primaryCTA:'Freight Quote',evidenceCount:1,topicCount:1,auditCount:1,reviewMode:'human',governed:true,...(r.governance || {}),...fields});
}
await fs.writeFile('src/data/notionBlogData.json',JSON.stringify(data,null,2)+'\n');
