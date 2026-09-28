import fs from 'node:fs';
import path from 'node:path';
import { normalizeQuoteHtml } from '../src/lib/quoteLinkPolicy.mjs';
const root=path.resolve(process.argv[2]||'dist');let checked=0,changed=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html')){checked++;const original=fs.readFileSync(p,'utf8'),next=normalizeQuoteHtml(original);if(next!==original){fs.writeFileSync(p,next);changed++;}}}}
walk(root);console.log(JSON.stringify({check:'query-free quote link output',html_files_checked:checked,html_files_changed:changed}));
