import {referencePrice,sampleCountries} from '../src/features/freight/rates/model.mjs';

const feeNames=new Set(['AMS FEE','BOOKING FEE','CONGESTION FEE','DDC CHARGE','DHC','DOC FEE','DOCUMENTS FEE','ELECTRONIC DATA INTERCHARGE','ELECTRONIC PACKING LIST CHARGE','ENS','EQUIPMENT INTERCHANGE RECEIPT','INTERNATIONAL SHIP AND PORT FACILITY SECURITY','SEAL CHARGE','TANK FEE','TELEX RELEASE FEE','THC','VGM FEE']);
const text=value=>typeof value==='string'&&value.length<=160&&!/[<>\r\n]/.test(value)?value:null;
const price=value=>value==null?null:typeof value==='number'&&Number.isFinite(value)&&value>=0?referencePrice(value):null;

// Run only in the publishing workspace. Never copy or spread a supplier row.
// Prices are customer reference prices on export; the browser must not add margin.
export function exportCustomerFreight(source){
 if(!Array.isArray(source?.rows)||!Array.isArray(source?.coverage))throw Error('Invalid internal snapshot');
 const rows=source.rows.map((r,index)=>{
  if(!sampleCountries.includes(r.country)||!['origin','port','carrier','service','route','cutoff'].every(k=>text(r[k])!==null))throw Error('Invalid route at '+index);
  const prices=Object.fromEntries(['20GP','40GP','40HQ'].map(k=>[k,r.prices[k]>0?price(r.prices[k]):null]));
  return {id:`FCL26Q4-${String(index+1).padStart(4,'0')}`,country:r.country,origin:r.origin,port:r.port,carrier:r.carrier,service:r.service,
   prices,days:!r.flags.includes('航程显示不一致')&&Number.isInteger(r.days)&&r.days>0?r.days:null,route:r.route,cutoff:r.cutoff,
   fees:r.fees.map(f=>{if(!feeNames.has(f.name)||!['USD','RMB'].includes(f.currency)||!Array.isArray(f.values)||f.values.length!==3)throw Error('Invalid fee');return {name:f.name,values:f.values.map(price),ticket:price(f.ticket),currency:f.currency};}),
   conditionalFreeTime:r.flags.includes('免柜期有条件')};
 });
 const ports=new Map();
 for(const c of source.coverage){if(!sampleCountries.includes(c.country)||!text(c.port))throw Error('Invalid coverage');ports.set(c.country+'|'+c.port,{country:c.country,port:c.port,portUnconfirmed:c.status==='港名待确认'});}
 for(const r of rows)if(!ports.has(r.country+'|'+r.port))ports.set(r.country+'|'+r.port,{country:r.country,port:r.port,portUnconfirmed:false});
 const coverage=[...ports.values()].map(c=>({...c,count:rows.filter(r=>r.country===c.country&&r.port===c.port).length}));
 return {schemaVersion:1,kind:'customer-fcl-reference',period:'2026-Q4',currency:'USD',referenceOnly:true,rows,coverage};
}
