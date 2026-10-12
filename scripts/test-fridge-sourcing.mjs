import assert from 'node:assert/strict';
import {fridgeProducts,fridgeUnitPrice,validFridgeLine,validFridgeQuantity,normalizeFridgeDraft,fridgeLoad,buildFridgeBrief} from '../src/features/outdoor-sourcing/fridge-catalog.mjs';
import {quoteLinkProps,sanitizeQuoteContext} from '../src/lib/quoteLinkPolicy.mjs';
assert.equal(new Set(fridgeProducts.map(p=>p.id)).size,10);
for(const value of ['0','-1','1.5','1e3','', '100001'])assert.equal(validFridgeQuantity(value),false,`reject ${value}`);
for(const value of ['1','20','100000'])assert.equal(validFridgeQuantity(value),true);
const draft=normalizeFridgeDraft({destination:'Kenya',rows:[{id:'gf45',quantity:'10',notes:'neutral carton'},{id:'tf36d',quantity:'5'},{id:'gf45',quantity:'999'},{id:'unknown',quantity:'200'}]});
assert.equal(draft.rows.length,2,'Stored duplicates and unknown models are not quoted');
const load=fridgeLoad(draft.rows);
assert.equal(load.units,15);
assert.equal(load.pendingUnits,5,'Unconfirmed packing must stay out of calculated freight basis');
assert.equal(load.knownGross,280);
assert.ok(Math.abs(load.knownCbm-(.710*.470*.530*10))<1e-10);
const brief=buildFridgeBrief(draft);
assert.ok(brief.includes('GF45 | 45 L | Zone layout specified with order | 10 units'));
assert.ok(brief.includes('TF36D | 34.5 L'));
assert.ok(brief.includes('25 L + 9.5 L'));
assert.ok(brief.includes('Consolidation does not waive factory minimums'));
const link=quoteLinkProps('/get-a-quote/?'+new URLSearchParams({source:'portable_fridge_sourcing',industry:'Other',leadGoal:'Product Sourcing',overviewBrief:brief,dest:'Kenya'}));
assert.equal(link.href,'/get-a-quote/','Buyer details stay out of the navigation URL');
const context=JSON.parse(link['data-quote-context']);
assert.equal(context.overviewBrief,brief);
assert.equal(context.source,'portable_fridge_sourcing');
assert.equal(context.industry,'Other');
assert.equal(sanitizeQuoteContext({source:'portable_fridge_sourcing'}).source,'portable_fridge_sourcing');
console.log('Fridge sourcing: 10-configuration integrity, quantity validation, partial packing totals, saved-draft cleanup and quote handoff passed.');

const aluminium=normalizeFridgeDraft({destination:'UAE',rows:[{id:'al34',quantity:'10',notes:'Green; private-label nameplate; market stall'}]});
const aluLoad=fridgeLoad(aluminium.rows);
assert.equal(aluLoad.knownGross,170,'Shipping uses 17 kg gross, not 14 kg net');
assert.ok(Math.abs(aluLoad.knownCbm-.732*.402*.485*10)<1e-10);
const aluBrief=buildFridgeBrief(aluminium);
assert.ok(aluBrief.includes('DDNZ sourcing reference AL34 | 34 L'));
assert.ok(!aluBrief.includes('Colku AL34'));
assert.ok(aluBrief.includes('Green; private-label nameplate; market stall'));
assert.equal(fridgeProducts.find(p=>p.id==='al34').weight,14);
console.log('AL34 supplier separation, packing totals and customization handoff passed.');

for(const [quantity,price] of [[299,null],[300,889],[500,889],[501,859],[1000,859]])assert.equal(fridgeUnitPrice('uog30',quantity),price);
assert.equal(validFridgeLine({id:'uog30',quantity:'299'}),false);
assert.equal(validFridgeLine({id:'uog30',quantity:'300'}),true);
assert.equal(fridgeUnitPrice('uog30','1e3'),null);
const uog=buildFridgeBrief(normalizeFridgeDraft({destination:'UAE',rows:[{id:'uog30',quantity:'501'}]}));
assert.ok(uog.includes('CNY 859/unit; line CNY 430359'));
assert.ok(!uog.includes('null L'));
console.log('UOG-30: 299/300/500/501 boundaries, final CNY prices and brief totals passed.');

for(const id of ["al34","al34-vip"]){assert.equal(validFridgeLine({id,quantity:"299"}),false);assert.equal(validFridgeLine({id,quantity:"300"}),true);}
assert.equal(fridgeUnitPrice("al34",300),2230);assert.equal(fridgeUnitPrice("al34-vip",300),2330);
