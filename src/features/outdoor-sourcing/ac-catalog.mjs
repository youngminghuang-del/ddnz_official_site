export const AC_PATH='/sourcing/portable-air-conditioners-from-china/';
export const acProducts=[
 {id:'sog1',model:'SOG-1',colour:'Black',watts:240,btu:2300,image:'sog1',use:'Compact compressor cooling for camping retailers, tent accessories and short-stay vehicle setups.',prices:[715,765,840,890]},
 {id:'sog2',model:'SOG-2',colour:'Khaki',watts:240,btu:1900,image:'sog2',use:'An entry-price option for outdoor equipment assortments, with a square grille and khaki finish.',prices:[685,735,810,860]},
 {id:'iog1plus',model:'IOG-1+',colour:'Silver',watts:450,btu:7000,image:'iog-family',imageNote:'IOG family housing reference; final IOG-1+ appearance confirmed with the sample.',use:'A higher cooling-capacity option for buyers comparing portable units for RV, tent and temporary-space applications.',prices:[1296,1326,1431,1460]},
];
export const acModes=[{voltage:220,mode:'Cooling only'},{voltage:110,mode:'Cooling only'},{voltage:220,mode:'Cooling & heating'},{voltage:110,mode:'Cooling & heating'}];
export const acVariants=acProducts.flatMap(p=>acModes.map((v,i)=>({...v,id:p.id+'-'+i,product:p.id,model:p.model,colour:p.colour,watts:p.watts,btu:p.btu,cny:p.prices[i],minQty:20})));
export const acVariant=id=>acVariants.find(v=>v.id===id);
export const validAcQuantity=q=>/^\d+$/.test(String(q))&&Number(q)>=20&&Number(q)<=100000;
export function acBrief(rows,destination,notes){return ['Portable air conditioner wholesale sourcing from China',`Destination: ${destination}`,...rows.map(r=>{const v=acVariant(r.id);return `${v.model} | ${v.colour} | ${v.watts} W input | ${v.btu} BTU cooling rating | AC ${v.voltage} V | ${v.mode} | ${r.quantity} units | CNY ${v.cny}/unit | Line CNY ${v.cny*Number(r.quantity)}`;}),`Requirements: ${notes||'Standard configuration'}`,'Minimum 20 units per configuration. Freight, tax, custom branding and optional accessories are quoted separately. Confirm plug, frequency, exhaust kit and destination requirements.'].join('\n');}
