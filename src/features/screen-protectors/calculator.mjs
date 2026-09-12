// Owner inputs updated 2026-09-11. Titan HD CNY4.30, privacy CNY5.10; packing and freight unchanged.
// No live freight, customs, availability, FX, or inventory API is used.
export const PRODUCTS = Object.freeze({
  'og28': {name:'OG28 防窥膜', price:2.5, unitsPerCarton:960, kgPerUnit:27/960, cartonCm:[60,46,33], tareKg:1.5, minQty:100, minOrderQty:1000, addQty:1000, approximate:false, image:'og28-privacy.jpg', label:'防窥 · 四款中产品单价最低', note:'OG28合计1,000片起订，每个手机型号至少100片。10片装一大盒，96大盒装一箱。', packingNote:'膜与包装27kg，加外箱1.5kg，满箱毛重28.5kg。'},
  '001': {name:'001 防窥膜', price:6, unitsPerCarton:400, kgPerUnit:16.5/400, cartonCm:[50,32,47.5], tareKg:0, fullGrossKg:16.5, weightMode:'carton', minQty:500, addQty:500, approximate:false, image:'001-privacy.jpg', label:'防窥 · 独立零售包装', note:'独立包装防窥膜，400片装一箱，每个手机型号500片起订。', packingNote:'满箱毛重16.5kg，已含外箱。'},
  'titan-hd': {name:'Titan 高清无尘仓', price:4.3, unitsPerCarton:200, kgPerUnit:.07, cartonCm:[42,35,42], tareKg:0, minQty:500, addQty:500, approximate:false, image:'titan-hd.jpg', label:'高清 · 无尘仓安装器', note:'高清膜配无尘仓安装器，每箱200片。', packingNote:'70g/片，满箱按14kg计算，不另加箱重。'},
  'titan-privacy': {name:'Titan 防窥无尘仓', price:5.1, unitsPerCarton:200, kgPerUnit:.07, cartonCm:[42,35,42], tareKg:0, minQty:500, addQty:500, approximate:false, image:'titan-privacy.jpg', label:'防窥 · 无尘仓安装器', note:'防窥膜配无尘仓安装器，每箱200片。', packingNote:'70g/片，满箱按14kg计算，不另加箱重。'}
});
export const BASIS = Object.freeze({date:'2026-09-11', maxQty:1000000, maxRows:100, divisor:5000, usdCny:6.6, seaUsdPerCbm:550, seaMinimumCbm:1, airCnyPerKg:130, seaDays:60, airDays:15});
export function cartonFacts(p){const cubicCm=p.cartonCm.reduce((a,b)=>a*b,1);return {cbm:cubicCm/1000000,dimensionalKg:cubicCm/BASIS.divisor,fullKg:p.fullGrossKg??(p.unitsPerCarton*p.kgPerUnit+p.tareKg)};}
export function preset(total=10000) {
  if(total===1000) return [{product:'001',model:'',qty:500},{product:'titan-hd',model:'',qty:500}];
  const quantities=total===5000?[2000,1500,1500]:[4000,3000,3000];
  // Keep the existing three-product presets; adding a product must not rewrite drafts.
  return ['001','titan-hd','titan-privacy'].map((product,i)=>({product,model:'',qty:quantities[i]}));
}
export function numeric(value) {
  if(value===null||value===undefined||String(value).trim()==='') return null;
  const n=Number(value); return Number.isFinite(n)?n:null;
}
export function calculate(rows, packing='product', charging='shipment') {
  const errors=[];
  if(!Array.isArray(rows)||!rows.length) return {valid:false,errors:['请至少添加一行产品。']};
  if(rows.length>BASIS.maxRows) errors.push('一份方案最多支持100行。');
  if(!['product','model'].includes(packing)||!['shipment','carton'].includes(charging)) errors.push('请选择有效的装箱与计费口径。');
  const normalized=rows.map((r,i)=>{
    const qty=numeric(r.qty), model=String(r.model??'').trim();
    if(!Object.hasOwn(PRODUCTS,r.product)) errors.push(`第${i+1}行：请选择有效产品。`);
    const min=PRODUCTS[r.product]?.minQty??1;
    if(qty===null||!Number.isSafeInteger(qty)||qty<min||qty>BASIS.maxQty) errors.push(`第${i+1}行：数量须为${min}至1,000,000的整数。${min===500?'500是最低量，不要求500的倍数。':r.product==='og28'?'OG28每个手机型号至少100片。':''}`);
    if(model.length>80) errors.push(`第${i+1}行：机型名称请控制在80字以内。`);
    return {product:r.product,model,qty};
  });
  const seen=new Set();
  for(const r of normalized) if(r.model){
    const key=r.product+'|'+r.model.replace(/\s+/g,' ').toLowerCase();
    if(seen.has(key)) errors.push(`${PRODUCTS[r.product]?.name??'产品'}／${r.model}重复，请合并为一行后核算。`);
    seen.add(key);
  }
  const qty=normalized.reduce((sum,r)=>sum+(r.qty??0),0);
  if(qty>BASIS.maxQty) errors.push('一份方案最多支持1,000,000片。');
  for(const [id,p] of Object.entries(PRODUCTS)){
    if(!p.minOrderQty)continue;
    const productRows=normalized.filter(r=>r.product===id);
    if(!productRows.length||!productRows.every(r=>Number.isSafeInteger(r.qty)&&r.qty>0))continue;
    const productQty=productRows.reduce((sum,r)=>sum+r.qty,0);
    if(productQty<p.minOrderQty)errors.push(`${p.name}合计至少${p.minOrderQty.toLocaleString('zh-CN')}片，当前${productQty.toLocaleString('zh-CN')}片，还差${(p.minOrderQty-productQty).toLocaleString('zh-CN')}片。可分配给不同手机型号，每型号至少${p.minQty}片。`);
  }
  if(errors.length) return {valid:false,errors};
  const grouped=new Map();
  normalized.forEach((r,i)=>{
    const key=packing==='product'?r.product:String(i);
    if(!grouped.has(key)) grouped.set(key,{product:r.product,qty:0,models:[]});
    const g=grouped.get(key); g.qty+=r.qty; g.models.push(r.model||'机型待填写');
  });
  const groups=[...grouped.values()].map(g=>{
    const p=PRODUCTS[g.product], full=Math.floor(g.qty/p.unitsPerCarton), tail=g.qty%p.unitsPerCarton;
    const box=cartonFacts(p), cartons=full+(tail?1:0), contentsKg=p.weightMode==='carton'?cartons*box.fullKg:g.qty*p.kgPerUnit, tareKg=cartons*p.tareKg;
    const actualKg=contentsKg+tareKg, dimensionalKg=cartons*box.dimensionalKg;
    const tailKg=p.weightMode==='carton'?box.fullKg:tail*p.kgPerUnit+p.tareKg;
    const cartonChargeKg=full*Math.max(box.fullKg,box.dimensionalKg)+(tail?Math.max(tailKg,box.dimensionalKg):0);
    return {...g,full,tail,cartons,contentsKg,tareKg,actualKg,dimensionalKg,cartonChargeKg,cbm:cartons*box.cbm,goods:g.qty*p.price};
  });
  const sum=key=>groups.reduce((n,g)=>n+g[key],0);
  const goods=sum('goods'), cartons=sum('cartons'), actualKg=sum('actualKg'), dimensionalKg=sum('dimensionalKg'), cbm=sum('cbm');
  const shipmentChargeKg=Math.max(actualKg,dimensionalKg), cartonChargeKg=sum('cartonChargeKg');
  const chargeKg=charging==='carton'?cartonChargeKg:shipmentChargeKg;
  const seaBillableCbm=Math.max(cbm,BASIS.seaMinimumCbm), seaFee=seaBillableCbm*BASIS.seaUsdPerCbm*BASIS.usdCny, airFee=chargeKg*BASIS.airCnyPerKg;
  const warnings=[];
  if(groups.some(g=>g.product==='001'&&g.tail))warnings.push('001不足整箱暂按16.5kg/箱估算，出货前按实际称重核价。');
  if(groups.some(g=>g.product==='og28'&&g.tail))warnings.push('OG28尾箱按片数折算包装重量，另加1.5kg外箱；出货前确认实际装箱和重量。');
  return {valid:true,errors:[],warnings,rows:normalized,packing,charging,qty,groups,goods,cartons,cbm,actualKg,dimensionalKg,chargeKg,shipmentChargeKg,cartonChargeKg,seaBillableCbm,missingModels:normalized.filter(r=>!r.model).length,unknownMoqRows:normalized.filter(r=>PRODUCTS[r.product].minQty===null).length,
    sea:{fee:seaFee,total:goods+seaFee,unit:(goods+seaFee)/qty,days:BASIS.seaDays},air:{fee:airFee,total:goods+airFee,unit:(goods+airFee)/qty,days:BASIS.airDays}};
}
export function economics(result, route, values) {
  if(!result.valid||!['sea','air'].includes(route)) return null;
  const price=numeric(values.price), monthly=numeric(values.monthly), feeRate=numeric(values.feeRate);
  const priceOK=price!==null&&price>=0&&price<=100000;
  const monthlyOK=monthly!==null&&Number.isInteger(monthly)&&monthly>=0&&monthly<=1000000;
  const feeOK=feeRate!==null&&feeRate>=0&&feeRate<=100;
  const revenue=priceOK?price*result.qty:null;
  const spread=revenue===null?null:revenue-result[route].total;
  return {revenue,spread,contribution:spread!==null&&feeOK?spread-revenue*feeRate/100:null,months:monthlyOK&&monthly>0?result.qty/monthly:null,
    priceOK,monthlyOK,feeOK,monthlyZero:monthlyOK&&monthly===0};
}
