import {freightLocalizations} from './locales/index.mjs';
export const deliveryFields={en:{terms:'Requested delivery arrangement',postcode:'Destination postcode',address:'Delivery address / city',value:'Cargo value',currency:'Value currency',hs:'HS code (if known)',importer:'Importer arrangements',taxEvidence:'Tax-payment evidence',unloading:'Unloading arrangements'},zh:{terms:'拟评估交付方式',postcode:'目的地邮编',address:'收货地址 / 城市',value:'货值',currency:'货值币种',hs:'HS编码（如已知）',importer:'进口主体安排',taxEvidence:'缴税凭证要求',unloading:'卸货安排'}};
export function emptyDeliveryAssessment(){return Object.fromEntries(Object.keys(deliveryFields.en).map(k=>[k,'']));}
export const deliveryOptions={terms:[['DDP','DDP'],['DAP','DAP'],['Compare options','比较方案']],currency:[['USD','USD'],['CNY','CNY'],['Other (specify in notes)','其他（请在备注注明）']],importer:[['Buyer can arrange importer','买方可安排进口主体'],['Seller can arrange importer','卖方可安排进口主体'],['Need help assessing importer','需协助评估进口主体']],taxEvidence:[['Required','需要'],['Not requested','暂未要求']],unloading:[['Consignee can unload','收货方可卸货'],['Need unloading arrangements assessed','需评估卸货安排']]};
export function deliveryAssessmentSummary(value,locale='en'){
 const lang=deliveryFields[locale]?locale:'en';const local=freightLocalizations[lang]?.form;const unknown=local?.unknown||(lang==='zh'?'待确认':'To be confirmed');
 const lines=Object.entries(deliveryFields[lang]).map(([k,label])=>`${label}: ${localizedDeliveryValue(k,String(value?.[k]||'').trim().slice(0,800),lang)||unknown}`);
 return [local?.header||(lang==='zh'?'到门方案评估（客户需求，非已确认服务范围）':'Door-delivery assessment (customer requirements, not confirmed service scope)'),...lines].join('\n');
}
export function deliveryMessage(notes,brief){return brief?[notes,brief].filter(Boolean).join('\n\n'):notes;}

const optionGroups=['terms','currency','importer','taxEvidence','unloading'];
for(const [locale,data]of Object.entries(freightLocalizations))deliveryFields[locale]=Object.fromEntries(Object.keys(deliveryFields.en).map((key,i)=>[key,data.form.fields[i]]));
export function localizedDeliveryValue(key,value,locale){const local=freightLocalizations[locale]?.form;if(!local||!deliveryOptions[key])return value;const index=deliveryOptions[key].findIndex(o=>o.includes(value));return index<0?value:local.options[optionGroups.indexOf(key)][index];}
export function deliveryChoiceLabel(key,index,locale){return freightLocalizations[locale]?.form.options[optionGroups.indexOf(key)][index]||deliveryOptions[key][index][locale==='zh'?1:0];}
