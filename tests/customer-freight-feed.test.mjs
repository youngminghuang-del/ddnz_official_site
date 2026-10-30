import test from 'node:test';import assert from 'node:assert/strict';
import {exportCustomerFreight} from '../scripts/customer-freight-export.mjs';
import {validateCustomerFreight,customerRatesAllowed} from '../src/features/freight/rates/public-feed.mjs';
const source=()=>({asOf:'private capture',coverage:[{country:'ghana',port:'TEMA',status:'已采完整',count:1}],rows:[{id:'PRIVATE-ID',country:'ghana',origin:'NANSHA',port:'TEMA',carrier:'EXAMPLE CARRIER',service:'TEST',days:12,route:'Transfer EXAMPLE HUB',cutoff:'cutting/ETD: Mon/Tue',prices:{'20GP':90,'40GP':null,'40HQ':123.45},fees:[{name:'THC',currency:'RMB',values:[9,18,27],ticket:null,other:'SECRET unparsed amount'},{name:'DOC FEE',currency:'RMB',values:[null,null,null],ticket:45,other:''}],notes:'PRIVATE NOTES 123USD',schedule:'PRIVATE VESSEL',validity:'11-01~11-14',flags:['免柜期有条件'],publicPriceApproved:false,validFromISO:null,validThroughISO:null}]});
test('export converts principal and each fee once; preserves currency, ticket and null semantics',()=>{
 const d=exportCustomerFreight(source());assert.equal(d.rows[0].prices['20GP'],100);assert.equal(d.rows[0].prices['40HQ'],137.17);assert.equal(d.rows[0].prices['40GP'],null);assert.deepEqual(d.rows[0].fees[0].values,[10,20,30]);assert.equal(d.rows[0].fees[1].ticket,50);assert.equal(d.rows[0].fees[1].currency,'RMB');assert.equal(d.referenceOnly,true);assert.equal(d.rows[0].conditionalFreeTime,true);
 const json=JSON.stringify(d);for(const s of ['PRIVATE','SECRET','asOf','validity','publicPriceApproved','validFromISO','validThroughISO','notes','schedule','other'])assert.ok(!json.includes(s),s);
 assert.equal(validateCustomerFreight(d,'2026-10-30T00:00:00Z'),d);
});
test('public feed fails closed on raw snapshots, unexpected nested fields, NaN, duplicate IDs and incorrect coverage',()=>{
 assert.throws(()=>validateCustomerFreight(source(),'2026-10-30'));
 for(const mutate of [d=>d.rows[0].notes='private',d=>d.rows[0].fees[0].other='cost',d=>d.rows[0].prices['20GP']=NaN,d=>d.rows.push(d.rows[0]),d=>d.coverage[0].count=0]){const d=exportCustomerFreight(source());mutate(d);assert.throws(()=>validateCustomerFreight(d,'2026-10-30'));}
});
test('quarter is reference context, not a supplier validity extension; expired feeds disappear',()=>{
 const d=exportCustomerFreight(source());for(const date of ['2026-09-30T23:59:59Z','2027-01-01T00:00:00Z','invalid'])assert.throws(()=>validateCustomerFreight(d,date));assert.equal(validateCustomerFreight(d,'2026-12-31T23:59:59Z').period,'2026-Q4');
});
test('zero main rates do not imply free transport; fee currency is never guessed',()=>{
 const s=source();s.rows[0].prices['20GP']=0;assert.equal(exportCustomerFreight(s).rows[0].prices['20GP'],null);s.rows[0].fees[0].currency='';assert.throws(()=>exportCustomerFreight(s));
});
test('conflicting supplier transit times remain unconfirmed in the public reference',()=>{const s=source();s.rows[0].flags.push('航程显示不一致');const d=exportCustomerFreight(s);assert.equal(d.rows[0].days,null);assert.equal(validateCustomerFreight(d,'2026-10-30').rows[0].days,null);});
test('all eight public locales retain sea-only scope',()=>{for(const l of ['en','zh','es','fr','ru','ar','pt','tr'])assert.equal(customerRatesAllowed(l,'ghana'),true);assert.equal(customerRatesAllowed('ar','russia'),false);assert.equal(customerRatesAllowed('en','central-asia'),false);assert.equal(customerRatesAllowed('id','ghana'),false);});
