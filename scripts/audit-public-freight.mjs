import fs from 'node:fs';import path from 'node:path';
import {validateCustomerFreight} from '../src/features/freight/rates/public-feed.mjs';
const dir=process.argv[2]||'dist';
const data=JSON.parse(fs.readFileSync(path.join(dir,'api/freight-rates/q4-2026.json'),'utf8'));
// Structural release audit. Runtime separately enforces the actual quarter.
validateCustomerFreight(data,'2026-10-30T00:00:00Z');
function scan(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())scan(f);else{
 if(/^\.env|freight-preview\.json|preview-payload\.json/.test(e.name))throw Error('Internal data in deployment: '+f);
 if(/\.(js|html)$/.test(f)&&/\/__internal\/freight-preview\.json|VITE_FREIGHT_RATE_PREVIEW/.test(fs.readFileSync(f,'utf8')))throw Error('Internal freight client in deployment: '+f);
 }}}
scan(dir);console.log(JSON.stringify({customerRows:data.rows.length,referencePeriod:data.period,privateFields:false,internalEndpoint:false}));
