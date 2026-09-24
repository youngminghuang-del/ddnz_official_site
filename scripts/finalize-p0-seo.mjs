import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),dist=path.join(root,'dist');
const overrides=JSON.parse(fs.readFileSync(path.join(root,'src/data/seoTitleOverrides.json'),'utf8'));
const routes=[...fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const available=new Set(routes),locales=['','zh-cn','es','ar','ru','fr','pt','tr'],names=['English','中文','Español','العربية','Русский','Français','Português','Türkçe'];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
let titles=0,navs=0;
for(const route of routes){
 const file=path.join(dist,route,'index.html');let html=fs.readFileSync(file,'utf8');
 const title=overrides[route];
 if(title){html=html.replace(/<title>[\s\S]*?<\/title>/i,`<title>${esc(title)}</title>`).replace(/(<meta\s+(?:property|name)="(?:og:title|twitter:title)"\s+content=")[^"]*("[^>]*>)/g,(_,a,b)=>a+esc(title)+b);titles++;}
 if(!html.includes('data-crawlable-languages="true"')){
  const suffix=route.replace(/^\/(zh-cn|es|ar|ru|fr|pt|tr)(?=\/)/,'');
  const links=locales.map((lang,i)=>{const desired=(lang?'/'+lang:'')+suffix;const target=available.has(desired)?desired:(lang?'/'+lang:'')+'/insights/';if(!available.has(target))throw new Error(`Language destination missing ${target}`);return `<a href="${target}" lang="${lang||'en'}" style="text-decoration:underline">${names[i]}</a>`;}).join('');
  const nav=`<nav data-crawlable-languages="true" aria-label="Languages" style="display:flex;flex-wrap:wrap;justify-content:center;gap:20px;padding:24px">${links}</nav>`;
  // Keep SSR navigation inside the React root so mounting the real footer replaces it.
  html=/<div id="root"/.test(html) && /<\/div>\s*<\/body>/.test(html) ? html.replace(/<\/div>(\s*<\/body>)/,`${nav}</div>$1`) : html.replace('</body>',nav+'</body>');navs++;
 }
 fs.writeFileSync(file,html);
}
console.log(`P0: ${titles} curated title overrides; ${navs} static language navigations added; ${routes.length} routes checked.`);
