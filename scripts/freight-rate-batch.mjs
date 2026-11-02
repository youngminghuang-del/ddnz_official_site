import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {exportCustomerFreight} from './customer-freight-export.mjs';
import {validateCustomerFreight} from '../src/features/freight/rates/public-feed.mjs';

export const sha256=text=>createHash('sha256').update(text).digest('hex');
const fail=message=>{throw Error(message);};

// This function prepares a candidate only. It never publishes or reads credentials.
// Supplier source keys, remarks and costs stay outside the customer payload.
export function buildFreightRateBatch({source,baselineText,idMap={version:1,ids:{}},expectedBaseHash}){
 if(!expectedBaseHash||sha256(baselineText)!==expectedBaseHash)fail('Baseline changed; review the latest public snapshot');
 const baseline=validateCustomerFreight(JSON.parse(baselineText),'2026-11-02T00:00:00Z');
 if(source?.kind!=='internal-freight-cost-snapshot'||source?.currency!=='USD'||source?.period!=='2026-Q4'||source?.reviewStatus!=='reviewed')fail('A reviewed internal cost snapshot is required; never reprice customer data');
 const collected=Date.parse(source.collectedAt);
 if(!Number.isFinite(collected)||collected<Date.parse('2026-10-01')||collected>=Date.parse('2027-01-01'))fail('Collection date is outside the configured reference quarter');
 const scope=source.reviewedCountries;
 if(!Array.isArray(scope)||!scope.length||new Set(scope).size!==scope.length||!Array.isArray(source.rows))fail('Explicit reviewed-country scope is required');
 if(source.rows.some(r=>!scope.includes(r.country)))fail('Source row is outside the reviewed scope');
 for(const country of scope)if(!source.rows.some(r=>r.country===country)&&!source.emptyCountries?.includes(country))fail('Missing country data; explicitly confirm an empty result before withdrawal');
 if(idMap.version!==1||!idMap.ids||typeof idMap.ids!=='object')fail('Invalid internal ID map');
 const keys=source.rows.map(r=>r.sourceKey);
 if(keys.some(k=>typeof k!=='string'||!k.trim())||new Set(keys).size!==keys.length)fail('Unique stable source keys are required');
 const validAmount=value=>value===null||typeof value==='number'&&Number.isFinite(value)&&value>=0;
 for(const row of source.rows){
  if(!row.prices||!['20GP','40GP','40HQ'].every(k=>validAmount(row.prices[k]))||!Array.isArray(row.fees))fail('Invalid source price');
  for(const fee of row.fees)if(!Array.isArray(fee.values)||!fee.values.every(validAmount)||!validAmount(fee.ticket))fail('Invalid source fee');
 }
 const ids={...idMap.ids},allocated=new Set(Object.values(ids));
 if(allocated.size!==Object.values(ids).length)fail('Duplicate IDs in the internal map');
 const preserved=baseline.rows.filter(r=>!scope.includes(r.country));
 let next=Math.max(0,...baseline.rows.map(r=>Number(r.id.slice(-4))),...Object.values(ids).map(id=>Number(String(id).slice(-4))))+1;
 const exported=exportCustomerFreight(source);
 const used=new Set(preserved.map(r=>r.id));
 exported.rows.forEach((row,i)=>{
  const key=keys[i];
  if(!ids[key])ids[key]=`FCL26Q4-${String(next++).padStart(4,'0')}`;
  const id=ids[key],before=baseline.rows.find(r=>r.id===id);
  if(!/^FCL26Q4-\d{4}$/.test(id)||used.has(id)||(before&&before.country!==row.country))fail('ID collision; reconcile the internal map');
  used.add(id);row.id=id;
 });
 // Keep existing display order and byte identity for a no-op refresh, even when
 // the reviewed country sits between other destinations in the snapshot.
 const replacementRows=new Map(exported.rows.map(row=>[row.id,row]));
 const rows=baseline.rows.flatMap(row=>!scope.includes(row.country)?[row]:replacementRows.has(row.id)?[replacementRows.get(row.id)]:[]);
 const priorIds=new Set(baseline.rows.map(row=>row.id));
 rows.push(...exported.rows.filter(row=>!priorIds.has(row.id)));
 const coverageKey=row=>row.country+'|'+row.port;
 const replacementCoverage=new Map(exported.coverage.map(row=>[coverageKey(row),row]));
 const coverage=baseline.coverage.flatMap(row=>!scope.includes(row.country)?[row]:replacementCoverage.has(coverageKey(row))?[replacementCoverage.get(coverageKey(row))]:[]);
 const priorCoverage=new Set(baseline.coverage.map(coverageKey));
 coverage.push(...exported.coverage.filter(row=>!priorCoverage.has(coverageKey(row))));
 const candidate={...baseline,rows,coverage};
 validateCustomerFreight(candidate,'2026-11-02T00:00:00Z');
 const prior=new Map(baseline.rows.map(r=>[r.id,r])),current=new Map(candidate.rows.map(r=>[r.id,r]));
 const added=candidate.rows.filter(r=>!prior.has(r.id)).map(r=>r.id);
 const removed=baseline.rows.filter(r=>!current.has(r.id)).map(r=>r.id);
 const changed=candidate.rows.filter(r=>prior.has(r.id)&&JSON.stringify(r)!==JSON.stringify(prior.get(r.id))).map(r=>({id:r.id,fields:Object.keys(r).filter(k=>JSON.stringify(r[k])!==JSON.stringify(prior.get(r.id)[k]))}));
 const exceptions=source.rows.flatMap((r,i)=>(r.flags||[]).map(flag=>({id:exported.rows[i].id,flag})));
 const text=JSON.stringify(candidate);
 return {candidate,idMap:{version:1,ids},report:{mode:'candidate-only',period:source.period,baselineSha256:expectedBaseHash,candidateSha256:sha256(text),reviewedCountries:scope,previousRows:baseline.rows.length,candidateRows:candidate.rows.length,added,removed,changed,exceptions,costFieldsExported:false,pricingPolicy:'10% gross margin, cost / 0.9, rounded upward to cents; applied once on export'}};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),arg=name=>args[args.indexOf(name)+1];
 for(const name of ['--source','--baseline','--candidate','--report','--ids-output','--expected-sha'])if(!args.includes(name)||!arg(name))fail(`Missing ${name}`);
 if(path.resolve(arg('--baseline'))===path.resolve(arg('--candidate')))fail('Candidate must not overwrite its baseline');
 for(const name of ['--report','--ids-output'])if(/(?:^|[/\\])(?:public|dist)(?:[/\\]|$)/.test(path.resolve(arg(name))))fail('Internal review files must stay outside public/dist');
 const result=buildFreightRateBatch({source:JSON.parse(fs.readFileSync(arg('--source'),'utf8')),baselineText:fs.readFileSync(arg('--baseline'),'utf8'),idMap:args.includes('--ids')?JSON.parse(fs.readFileSync(arg('--ids'),'utf8')):undefined,expectedBaseHash:arg('--expected-sha')});
 for(const [flag,data] of [['--candidate',result.candidate],['--report',result.report],['--ids-output',result.idMap]]){fs.mkdirSync(path.dirname(arg(flag)),{recursive:true});fs.writeFileSync(arg(flag),JSON.stringify(data));}
 console.log(JSON.stringify({candidateRows:result.candidate.rows.length,added:result.report.added.length,removed:result.report.removed.length,changed:result.report.changed.length,published:false}));
}
