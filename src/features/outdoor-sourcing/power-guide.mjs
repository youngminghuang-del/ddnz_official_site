import { L, copy, getProduct } from './catalog.mjs';
import { numberInput, quantityInput } from './buying.mjs';
export const powerModels=[
 {id:'sanhe-st',acHours:3,pvMax:null,acInput:null,peak:500},
 {id:'sanhe-bg',acHours:3,pvMax:null,acInput:null,peak:500},
 {id:'tieding-51',acHours:null,pvMax:null,acInput:100.8},
 {id:'ecoflow-classic',acHours:1.5,pvMax:500,acInput:1400},
 {id:'ecoflow-max',acHours:1.2,pvMax:1000,acInput:2200},
 {id:'eboom-lxyt24',acHours:null,pvMax:500,acInput:null},
].map(p=>({...getProduct(p.id),...p}));
export const powerModel=id=>powerModels.find(p=>p.id===id)||powerModels[0];
export const devices=[
 {id:'light',watts:10,name:L('LED light','Luz LED','إضاءة LED')},
 {id:'phone',watts:15,name:L('Phone charger','Cargador de teléfono','شاحن هاتف')},
 {id:'router',watts:12,name:L('Router','Router','جهاز توجيه')},
 {id:'laptop',watts:60,name:L('Laptop','Portátil','حاسوب محمول')},
 {id:'projector',watts:100,name:L('Projector','Proyector','جهاز عرض')},
 {id:'fridge',watts:60,surge:true,name:L('Small refrigerator','Nevera pequeña','ثلاجة صغيرة')},
 {id:'kettle',watts:1500,name:L('Electric kettle','Hervidor eléctrico','غلاية كهربائية')},
 {id:'custom',watts:100,name:L('Your other appliance','Otro aparato','جهازك الآخر')},
];
export const presets=[
 {id:'camp',hours:4,ids:['light','phone'],name:L('An evening outdoors','Una tarde al aire libre','أمسية في الهواء الطلق'),note:L('Lighting and phone charging. Add a refrigerator to see how the energy budget changes.','Iluminación y carga de teléfono. Añada una nevera para ver cómo cambia la energía necesaria.','إضاءة وشحن هاتف. أضف ثلاجة لترى تغير الطاقة المطلوبة.')},
 {id:'work',hours:4,ids:['router','laptop'],name:L('A mobile workday','Trabajo móvil','يوم عمل متنقل'),note:L('Connectivity and a laptop. Check the adapter rating or measure real consumption.','Conexión y portátil. Revise la potencia del adaptador o mida el consumo real.','اتصال وحاسوب محمول. تحقق من قدرة المحول أو قِس الاستهلاك الفعلي.')},
 {id:'stall',hours:6,ids:['light','projector'],name:L('An event or small stall','Evento o pequeño puesto','فعالية أو كشك صغير'),note:L('A simple display and lighting setup. Add refrigeration or heating loads separately.','Un equipo sencillo de proyección e iluminación. Añada refrigeración o calor por separado.','تجهيز بسيط للعرض والإضاءة. أضف أحمال التبريد أو التسخين منفصلة.')},
];
export function loadPreset(id='camp'){const p=presets.find(x=>x.id===id)||presets[0];return {hours:String(p.hours),rows:devices.map(d=>({id:d.id,on:p.ids.includes(d.id),watts:String(d.watts),count:'1'}))};}
export function analysePlan(model,rows,hours,efficiency){
 const h=numberInput(hours),e=numberInput(efficiency),selected=rows.filter(r=>r.on);
 if(!model?.wh||!model?.watts||h===null||h<=0||h>168||e===null||e<50||e>95||!selected.length)return {status:'incomplete'};
 let watts=0,starting=false;
 for(const row of selected){const d=devices.find(x=>x.id===row.id),w=numberInput(row.watts),n=quantityInput(row.count);if(!d||w===null||w<=0||w>10000||n===null||n>100)return {status:'incomplete'};watts+=w*n;starting ||= !!d.surge;}
 const usable=model.wh*e/100,energy=watts*h;
 return {status:'complete',watts,usable,energy,hours:usable/watts,targetHours:h,powerRatio:watts/model.watts,energyRatio:energy/usable,overload:watts>model.watts,shortfall:energy>usable,starting};
}
export function capacityPercent(wh,maximum=3500){return Number.isFinite(wh)&&wh>=0&&maximum>0?Math.min(100,wh/maximum*100):0;}
export function chargeFloor(model,inputWatts,realization){const w=numberInput(inputWatts),r=numberInput(realization);return model?.pvMax&&w!==null&&w>0&&w<=10000&&r!==null&&r>=10&&r<=100?model.wh/(Math.min(w,model.pvMax||w)*r/100):null;}
export const POWER_HANDOFF_KEYS=['powerModel','powerLoad','powerHours','powerPlan'];
export function guideHandoff(model,result,locale='en',base='/sourcing/outdoor-products-from-china/',draft){
 if(result.status!=='complete')return null;
 if(draft){
  const verified=analysePlan(model,draft.plan?.rows||[],draft.plan?.hours,draft.eff);
  if(verified.status!=='complete')return null;
  const detail={v:2,m:model.id,h:verified.targetHours,e:numberInput(draft.eff),r:draft.plan.rows.filter(r=>r.on).map(r=>[r.id,numberInput(r.watts),quantityInput(r.count)])};
  return base+'?'+new URLSearchParams({powerPlan:JSON.stringify(detail)})+'#buying-brief';
 }
 const params=new URLSearchParams({powerModel:model.id,powerLoad:String(result.watts),powerHours:String(result.targetHours)});
 return base+'?'+params+'#buying-brief';
}
export function readGuideHandoff(search,locale='en'){
 const q=new URLSearchParams(search);
 if(q.has('powerPlan')){
  try{
   const raw=q.get('powerPlan');if(raw.length>2400)return null;
   const d=JSON.parse(raw),m=powerModels.find(p=>p.id===d.m),seen=new Set();
   if(d.v!==2||!m||!Array.isArray(d.r)||!d.r.length||d.r.length>devices.length)return null;
   const rows=[];
   for(const row of d.r){if(!Array.isArray(row)||row.length!==3||seen.has(row[0])||!devices.some(x=>x.id===row[0]))return null;seen.add(row[0]);rows.push({id:row[0],on:true,watts:row[1],count:row[2]});}
   const result=analysePlan(m,rows,d.h,d.e);if(result.status!=='complete')return null;
   const tr=(en,es,ar)=>copy(L(en,es,ar),locale);
   const lines=[tr(`Power plan: ${m.model}`,`Plan energético: ${m.model}`,`خطة الطاقة: ${m.model}`),...rows.map(r=>`${copy(devices.find(x=>x.id===r.id).name,locale)}: ${numberInput(r.watts)}W × ${quantityInput(r.count)} = ${numberInput(r.watts)*quantityInput(r.count)}W`),tr(`Simultaneous AC load: ${result.watts}W; target: ${result.targetHours}h; usable-energy assumption: ${numberInput(d.e)}%.`,`Carga CA simultánea: ${result.watts}W; objetivo: ${result.targetHours}h; energía utilizable supuesta: ${numberInput(d.e)}%.`,`حمل AC متزامن: ${result.watts}W؛ مدة مطلوبة: ${result.targetHours}h؛ افتراض الطاقة القابلة للاستخدام: ${numberInput(d.e)}%.`)];
   if(result.overload)lines.push(tr(`Rated output shortfall: ${result.watts-m.watts}W.`,`Déficit de potencia nominal: ${result.watts-m.watts}W.`,`عجز القدرة الاسمية: ${result.watts-m.watts}W.`));
   if(result.shortfall){const gap=Math.ceil((result.energy-result.usable)*10)/10;lines.push(tr(`Usable-energy shortfall: ${gap}Wh.`,`Déficit de energía utilizable: ${gap}Wh.`,`عجز الطاقة القابلة للاستخدام: ${gap}Wh.`));}
   lines.push(tr('Please verify starting demand, voltage, ports and measured sample results.','Verificar arranque, tensión, puertos y resultados de la muestra medida.','يرجى التحقق من بدء التشغيل والجهد والمنافذ ونتائج العينة المقاسة.'));
   return {id:m.id,note:lines.join('\n')};
  }catch{return null;}
 }
 const m=powerModels.find(p=>p.id===q.get('powerModel')),w=numberInput(q.get('powerLoad')),h=numberInput(q.get('powerHours'));
 if(!m||w===null||w<=0||w>8000000||h===null||h<=0||h>168)return null;
 return {id:m.id,note:copy(L(`Power plan: ${m.model}; simultaneous AC load ${w}W; target ${h}h. Please verify starting demand, sockets and the measured sample.`,`Plan: ${m.model}; carga CA simultánea ${w}W; objetivo ${h}h. Verificar arranque, tomas y muestra medida.`,`خطة الطاقة: ${m.model}؛ حمل AC متزامن ${w}W؛ مدة مطلوبة ${h}h. يرجى التحقق من بدء التشغيل والمقابس والعينة المقاسة.`),locale)};
}
