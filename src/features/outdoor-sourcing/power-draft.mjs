import {powerModels,devices,presets,loadPreset,analysePlan} from './power-guide.mjs';

export const POWER_DRAFT_KEY='ddnz:power-plan:v1';
const numericText=(value,fallback)=>typeof value==='string'||typeof value==='number'?String(value).slice(0,16):fallback;
export function emptyPowerDraft(){return {version:1,modelId:'sanhe-st',sceneId:'camp',scenario:'camp',plan:loadPreset(),eff:'85',port:'ac',panel:'100',yieldPct:'70'};}
export function normalizePowerDraft(input){
 if(!input||input.version!==1||!Array.isArray(input.plan?.rows))return null;
 const d=emptyPowerDraft();
 d.modelId=powerModels.some(m=>m.id===input.modelId)?input.modelId:d.modelId;
 d.sceneId=presets.some(p=>p.id===input.sceneId)?input.sceneId:d.sceneId;
 d.plan.hours=numericText(input.plan.hours,d.plan.hours);
 d.plan.rows=d.plan.rows.map(row=>{const saved=input.plan.rows.find(r=>r?.id===row.id);return saved?{id:row.id,on:saved.on===true,watts:numericText(saved.watts,row.watts),count:numericText(saved.count,row.count)}:row;});
 d.eff=numericText(input.eff,d.eff);d.panel=numericText(input.panel,d.panel);d.yieldPct=numericText(input.yieldPct,d.yieldPct);
 d.port=['ac','dc','usb'].includes(input.port)?input.port:'ac';
 const preset=presets.find(p=>p.id===input.scenario);
 d.scenario=preset&&JSON.stringify(loadPreset(preset.id))===JSON.stringify(d.plan)?preset.id:'';
 return d;
}
export function readPowerDraft(storage){try{return normalizePowerDraft(JSON.parse(storage.getItem(POWER_DRAFT_KEY)));}catch{return null;}}
export function savePowerDraft(storage,input){try{const d=normalizePowerDraft(input);if(!d)return false;storage.setItem(POWER_DRAFT_KEY,JSON.stringify(d));return true;}catch{return false;}}
export function comparePowerModels(rows,hours,eff){return powerModels.flatMap(model=>{const result=analysePlan(model,rows,hours,eff);return result.status==='complete'?[{model,result,fits:!result.overload&&!result.shortfall,powerGap:Math.max(0,result.watts-model.watts),energyGap:Math.max(0,result.energy-result.usable)}]:[];});}

const actions=['scene_select','hotspot_open','device_toggle','model_select','compare_select','result_view','brief_open','draft_reset'];
export function powerGuideEvent(locale,action,details={}){
 if(!['en','zh','es','ar','ru','fr','pt','tr'].includes(locale)||!actions.includes(action))return null;
 const params={content_group:'portable_power_guide',content_language:locale,journey_action:action};
 if(powerModels.some(m=>m.id===details.modelId))params.product_id=details.modelId;
 if(presets.some(p=>p.id===details.sceneId))params.scene_id=details.sceneId;
 if(details.deviceId==='power'||devices.some(d=>d.id===details.deviceId))params.device_id=details.deviceId;
 return {event:'portable_power_journey',params};
}
