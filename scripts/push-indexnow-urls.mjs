import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {diffManifests} from './url-change-manifest.mjs';
export async function submitChanges({current,previous,key,keyLocation,endpoint='https://api.indexnow.org/indexnow',fetchImpl=fetch,dryRun=false}) {
  const delta=diffManifests(current,previous);
  if(previous?.deployment_completed_at && (!current.deployment_completed_at || Date.parse(current.deployment_completed_at)<Date.parse(previous.deployment_completed_at))) {
    if(!current.deployment_completed_at && !dryRun) throw new Error('A verified production timestamp is required');
    return {bootstrap:false,added:[],changed:[],removed:[],urls:[],submitted:0,dryRun,stale:true};
  }
  if(dryRun||!delta.urls.length)return {...delta,submitted:0,dryRun};
  if(!/^[A-Za-z0-9_-]{8,128}$/.test(key))throw new Error('Invalid IndexNow key');
  const location=new URL(keyLocation);if(location.origin!==current.site)throw new Error('Off-site key location');
  const verification=await fetchImpl(keyLocation,{signal:AbortSignal.timeout(15000)});
  if(!verification.ok||(await verification.text()).trim()!==key)throw new Error('Deployed key could not be verified');
  for(let offset=0;offset<delta.urls.length;offset+=10000){
    const urlList=delta.urls.slice(offset,offset+10000);let accepted=false;
    for(let attempt=0;attempt<3;attempt++){
      const response=await fetchImpl(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({host:new URL(current.site).host,key,keyLocation,urlList}),signal:AbortSignal.timeout(15000)});
      if([200,202].includes(response.status)){accepted=true;break;}
      if(![429,500,502,503,504].includes(response.status)||attempt===2)throw new Error(`IndexNow HTTP ${response.status}; checkpoint not advanced`);
      await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));
    }
    if(!accepted)throw new Error('IndexNow batch not accepted');
  }
  return {...delta,submitted:delta.urls.length,dryRun:false};
}
async function main(){
  const arg=(n,d)=>{const i=process.argv.indexOf(n);return i<0?d:process.argv[i+1]};
  const input=arg('--manifest');if(!input)throw new Error('Use --manifest and optional --baseline; full-sitemap submission is disabled');
  const current=JSON.parse(await fs.readFile(input,'utf8'));const prev=arg('--baseline');const previous=prev?JSON.parse(await fs.readFile(prev,'utf8')):null;
  const keyFile=arg('--key-file','public/fc7fa522855ca37b1e4a8060f9311519.txt');
  const key=(process.env.INDEXNOW_KEY||await fs.readFile(keyFile,'utf8')).trim();
  const result=await submitChanges({current,previous,key,keyLocation:arg('--key-location',current.site+'/'+path.basename(keyFile)),dryRun:process.argv.includes('--dry-run')});
  if(result.dryRun){console.log(JSON.stringify(result));return;}
  // Write checkpoints only after all batches succeed; failed submissions retain their baseline.
  const output=arg('--checkpoint','artifacts/indexnow-checkpoint.json');await fs.mkdir(path.dirname(output),{recursive:true});
  await fs.writeFile(output,JSON.stringify(result.stale?previous:current,null,2)+'\n');await fs.writeFile(output.replace(/\.json$/,'.receipt.json'),JSON.stringify({...result,recorded_at:new Date().toISOString()},null,2)+'\n');
  console.log(JSON.stringify({bootstrap:result.bootstrap,added:result.added.length,changed:result.changed.length,submitted:result.submitted,dryRun:result.dryRun}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.message);process.exitCode=1});
