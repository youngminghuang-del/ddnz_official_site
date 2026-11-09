import fs from 'node:fs/promises';
const catalog=JSON.parse(await fs.readFile('src/data/blog-release-manifest.json','utf8')),schemas={};
for(const e of catalog.releases)schemas[e.canonical]=JSON.parse(await fs.readFile(e.schema_file,'utf8'));
await fs.writeFile('src/data/blogReleaseSchemas.json',JSON.stringify(schemas,null,2)+'\n');
