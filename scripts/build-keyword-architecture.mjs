import fs from 'node:fs';
import { keywordOwners } from '../src/features/search-intent/keyword-owners.mjs';
import { foodProcessingRoutes, foodPage } from '../src/features/food-processing/pages.mjs';
import { buyerQuestions } from '../src/features/search-intent/buyer-questions.mjs';
const input=process.argv[2]||'docs/search-intent-audit-global-2026-09-23/pages.json';
const out=process.argv[3]||'docs/global-search-architecture-2026-09-23';
const pages=JSON.parse(fs.readFileSync(input,'utf8'));const definitions={...keywordOwners};
for(const route of foodProcessingRoutes){const p=foodPage(route);const topic=p.kind==='hub'?'food processing machinery':p.kind==='package'?`${p.bundle.title.toLowerCase()} equipment package`:p.category.title.toLowerCase();definitions[route+'/']=[p.kind==='hub'?'product-family':p.kind==='package'?'equipment-package':'product-category','food business buyers and equipment dealers',`${topic} from China`,[`source ${topic} from China`,`buy ${topic} from China`],[`compare ${topic} models and wholesale prices`,`packing and configuration for ${topic}`]];}
const rows=[], queries=[];
for(const p of pages){
 const base=p.path.replace(/^\/(zh-cn|es|ar|ru|fr|pt|tr)(?=\/)/,''); let definition=definitions[base];
 if(!definition && p.locale==='en' && base.startsWith('/shipping-from-china-to-')){
  const country=base.slice('/shipping-from-china-to-'.length).replace(/\/$/,'').replaceAll('-',' ');const land=['kazakhstan','uzbekistan','kyrgyzstan','tajikistan','turkmenistan','russia','central asia'].includes(country);
  definition=['freight-destination','importers with a defined destination',`shipping from China to ${country}`,[`${land?'rail and road freight':'sea freight'} from China to ${country}`,`cargo consolidation in China for ${country}`],[`shipping food processing machinery from China to ${country}`,`packing and final delivery for a China to ${country} shipment`]];definitions[base]=definition;
 }
 if(!definition){const topic=p.title.replace(/\s*[|｜]\s*(?:DDNZ|华正邦泰).*$/i,'');definition=[p.intent,p.intent==='information'?'buyers researching a specific decision':'buyers with a defined product or service need',topic,[],[]];}
 const localPrimary=p.locale==='en'?definition[2]:p.title.replace(/\s*[|｜]\s*(?:DDNZ|华正邦泰).*$/i,'');
 rows.push({url:p.path,locale:p.locale,role:definition[0],audience:definition[1],primary_topic:localPrimary,reference_owner:base,h1:p.h1,title:p.title,scope:'Existing published-content candidate; no search-volume estimate',intro_status:p.status});
 if(p.locale==='en'){
  for(const[level,values]of [['head',[definition[2]]],['mid',definition[3]],['long',definition[4]]])for(const phrase of values)queries.push({owner:base,level,phrase,evidence:'editorial query hypothesis; validate against page and GSC',monthly_volume:'unknown'});
  for(const q of buyerQuestions[base.replace(/^\/+|\/+$/g,'')]||[])queries.push({owner:base,level:'buyer-question',phrase:q.q,evidence:'authored visible answer with related service/product link',monthly_volume:'unknown'});
 }
}
const phrases=new Map();for(const q of queries){const key=q.phrase.toLowerCase();if(phrases.has(key)&&phrases.get(key)!==q.owner)throw new Error(`Conflicting owner: ${q.phrase}`);phrases.set(key,q.owner);}
fs.mkdirSync(out,{recursive:true});const csv=(values)=>{const keys=Object.keys(values[0]);return [keys,...values.map(r=>keys.map(k=>r[k]))].map(row=>row.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\n')+'\n';};
fs.writeFileSync(out+'/page-ownership.csv',csv(rows));fs.writeFileSync(out+'/query-candidates.csv',csv(queries));fs.writeFileSync(out+'/page-ownership.json',JSON.stringify(rows,null,2));
const summary={pages:rows.length,englishOwners:rows.filter(r=>r.locale==='en').length,queryCandidates:queries.length,uniquePhrases:phrases.size,buyerQuestions:Object.values(buyerQuestions).flat().length,searchVolume:'not available',rankingOrIndexedQueryIncrease:'not measured'};fs.writeFileSync(out+'/inventory.json',JSON.stringify(summary,null,2));console.log(summary);
