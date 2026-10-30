import {sampleCountries,sampleRegions} from './model.mjs';
export const customerFreightEndpoint='/api/freight-rates/q4-2026.json';
const locales=['en','zh','es','fr','ru','ar','pt','tr'];
export function customerRatesAllowed(locale,context){return locales.includes(locale)&&[...sampleCountries,...sampleRegions].includes(context);}
const exact=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).sort().join('|')===[...keys].sort().join('|');
const amount=x=>x===null||typeof x==='number'&&Number.isFinite(x)&&x>=0;
// Reject unexpected private fields, incomplete payloads and expired periods.
export function validateCustomerFreight(d,now=new Date()){
 if(!exact(d,['schemaVersion','kind','period','currency','referenceOnly','rows','coverage'])||d.schemaVersion!==1||d.kind!=='customer-fcl-reference'||d.period!=='2026-Q4'||d.currency!=='USD'||d.referenceOnly!==true||!Array.isArray(d.rows)||!Array.isArray(d.coverage))throw Error('Invalid customer freight feed');
 const date=new Date(now);if(!Number.isFinite(+date)||date<new Date('2026-10-01T00:00:00Z')||date>=new Date('2027-01-01T00:00:00Z'))throw Error('Reference period inactive');
 const ids=new Set();
 for(const r of d.rows){
  if(!exact(r,['id','country','origin','port','carrier','service','prices','days','route','cutoff','fees','conditionalFreeTime'])||!/^FCL26Q4-\d{4}$/.test(r.id)||ids.has(r.id)||!sampleCountries.includes(r.country)||!['origin','port','carrier','service','route','cutoff'].every(k=>typeof r[k]==='string'&&r[k].length<=160)||!exact(r.prices,['20GP','40GP','40HQ'])||!Object.values(r.prices).every(amount)||!(r.days===null||Number.isInteger(r.days)&&r.days>0)||typeof r.conditionalFreeTime!=='boolean'||!Array.isArray(r.fees))throw Error('Invalid customer route');
  ids.add(r.id);
  for(const f of r.fees)if(!exact(f,['name','values','ticket','currency'])||typeof f.name!=='string'||!['RMB','USD'].includes(f.currency)||!Array.isArray(f.values)||f.values.length!==3||!f.values.every(amount)||!amount(f.ticket))throw Error('Invalid customer fee');
 }
 for(const c of d.coverage)if(!exact(c,['country','port','portUnconfirmed','count'])||!sampleCountries.includes(c.country)||typeof c.port!=='string'||typeof c.portUnconfirmed!=='boolean'||c.count!==d.rows.filter(r=>r.country===c.country&&r.port===c.port).length)throw Error('Invalid customer coverage');
 return d;
}
