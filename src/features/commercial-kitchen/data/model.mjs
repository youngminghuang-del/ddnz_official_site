import {convertPrice,fx} from './fx.mjs';
export const quantity = value => Number.isFinite(Number(value)) ? Math.max(0,Math.min(9999,Math.floor(Number(value)))) : 0;
export function cleanList(raw,products){return Object.fromEntries(products.filter(p=>quantity(raw?.[p.id])>0).map(p=>[p.id,quantity(raw[p.id])]))}
export function addItems(list,items,products){const next={...list};for(const [id,n]of Object.entries(items))next[id]=quantity((next[id]||0)+n);return cleanList(next,products)}
export const buyingIntents = {
 trial: {label:'Trial order',description:'Try a new line with your customers. Ask about sample options, minimum quantities and spare parts.'},
 restock: {label:'Restock',description:'Plan your next batch. Ask for quantity pricing, consistent specifications and lead time.'},
 expand: {label:'Expand my range',description:'Add complementary equipment to your range. Ask about mixed orders, packaging and branding.'}
};
export const quoteCurrencies=['USD','CNY','AED','SAR','SGD','MYR','IDR','THB','VND','PHP','MXN','BRL','CLP','COP','PEN','QAR','OMR','KWD','BHD','EUR'];
export function createPriceDraft(product,currency=product?.quote?.currency||'USD'){
 const q=product?.quote;
 const converted=q&&convertPrice(q.price,q.currency,currency);
 return q?{price:(converted??q.price).toFixed(2),currency:converted===null?q.currency:currency,units:String(q.minUnits),priceBasis:'reference'}:{price:'',currency,units:'1',priceBasis:'target'};
}
export function calculateMargin({purchase,selling,landed,units}){
 const amounts=[purchase,selling,landed];
 if(amounts.some(v=>v===null||v===undefined||String(v).trim()===''||!Number.isFinite(Number(v))||Number(v)<0||Number(v)>999999999))return null;
 const count=Number(units);
 if(!Number.isInteger(count)||count<1||count>9999||Number(selling)<=0)return null;
 const [buyCents,saleCents,extraCents]=amounts.map(v=>Math.round(Number(v)*100));
 if(saleCents===0)return null;
 const costCents=buyCents+extraCents,profitCents=saleCents-costCents;
 return {purchase:buyCents/100,selling:saleCents/100,landed:extraCents/100,units:count,unitCost:costCents/100,unitProfit:profitCents/100,marginPct:profitCents/saleCents*100,orderProfit:profitCents*count/100,orderCost:costCents*count/100,orderRevenue:saleCents*count/100};
}
export function validateBuyingTarget(products,draft){
 const units=Number(draft.units),blank=String(draft.price??'').trim()==='',price=blank?null:Number(draft.price);
 if(!products.some(p=>p.id===draft.productId)||!Object.hasOwn(buyingIntents,draft.intent)||!quoteCurrencies.includes(draft.currency)||!Number.isInteger(units)||units<1||units>9999||(!blank&&(!Number.isFinite(price)||price<=0||price>999999999)))return null;
 const quote=products.find(p=>p.id===draft.productId)?.quote;
 const reference=draft.priceBasis==='reference';
 if(reference&&(!quote||price!==convertPrice(quote.price,quote.currency,draft.currency)||units<quote.minUnits))return null;
 const margin=calculateMargin({purchase:price,selling:draft.selling,landed:draft.landed,units});
 return {productId:draft.productId,intent:draft.intent,units,price,currency:draft.currency,...(reference?{priceBasis:'reference',...(draft.currency!==quote.currency?{fxDate:fx.date}:{})}:{}),...(margin?{economics:{selling:margin.selling,landed:margin.landed}}:{})};
}
export function makeBrief(products,list,form){const selected=products.filter(p=>quantity(list[p.id])>0);return ['DDNZ GLOBAL — COMMERCIAL KITCHEN SOURCING BRIEF',`Prepared: ${new Date().toISOString().slice(0,10)}`,`Destination: ${form.country||'To confirm'}`,`City / port: ${form.port||'To confirm'}`,`Buyer type: ${form.type}`,`Business: ${form.company||'Not provided'}`,`Contact: ${form.contact||'Not provided'}`,'','PRODUCTS',...selected.map((p,i)=>`${i+1}. ${p.model} — ${p.name} | ${list[p.id]} ${list[p.id]===1?'unit':'units'} | ${p.metric}`),'',...selected.filter(p=>form.buyingTargets?.[p.id]).flatMap(p=>{const saved=form.buyingTargets[p.id],belowReference=saved.priceBasis==='reference'&&list[p.id]<p.quote?.minUnits,t=belowReference?{...saved,price:null,economics:undefined}:saved;return [`BUYING GOAL — ${p.model}`,`Purpose: ${buyingIntents[t.intent]?.label||'To confirm'}`,t.price===null?'Target price: open — please quote':t.priceBasis==='reference'?`Indicative buying price: ${t.currency} ${t.price.toFixed(2)} / unit (subject to quotation; freight and tax extra)${p.quote?.configurationNote?` — ${p.quote.configurationNote}`:''}`:`Target buying price: ${t.currency} ${t.price} / unit (buyer target; subject to quotation)`,...(belowReference?[`The displayed price reference is based on ${p.quote.minUnits} units; please quote this smaller quantity.`]:[]),...(t.economics?marginBriefLines(t,list[p.id]):[]),'']}),`Notes: ${form.notes||'None'}`,'','REQUESTED QUOTATION DETAILS','DDNZ unit prices and quantity tiers; MOQ; available configurations; sample terms; spare parts; packing dimensions; lead time; and freight options.','Confirm voltage, frequency, phase and plug for the destination during quotation.','Retail benchmark prices are references only. No order is placed by generating this brief.'].join('\n')}

function marginBriefLines(target,units){
 const m=calculateMargin({purchase:target.price,selling:target.economics.selling,landed:target.economics.landed,units});
 if(!m)return [];
 const money=n=>`${target.currency} ${n.toFixed(2)}`;
 return ['BUYER ESTIMATE — NOT A QUOTATION',`Expected selling price (excluding sales tax): ${money(m.selling)} / unit`,`Freight and import costs: ${money(m.landed)} / unit`,`Estimated gross profit: ${money(m.unitProfit)} / unit; ${m.marginPct.toFixed(1)}% gross margin`,`Estimated gross profit for ${m.units} units: ${money(m.orderProfit)}`,`Estimated landed order cost: ${money(m.orderCost)}`,'Before operating costs and income tax.',...(target.fxDate?[`Buying reference converted using indicative exchange rates dated ${target.fxDate}; final currency and price subject to quotation.`]:[])];
}
