import fs from 'node:fs/promises';
import path from 'node:path';
import {buildManifest} from './url-change-manifest.mjs';
const dist=process.argv[2]||'dist',output=process.argv[3]||'artifacts/url-manifest.json';
const m=await buildManifest(dist);await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,JSON.stringify(m,null,2)+'\n');console.log(`Content fingerprint manifest: ${Object.keys(m.urls).length} canonical URLs`);
