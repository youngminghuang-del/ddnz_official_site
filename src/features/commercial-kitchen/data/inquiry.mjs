export const FORMSPREE_ENDPOINT='https://formspree.io/f/mdabvqbd';
export const WHATSAPP_URL='https://wa.me/85261077362';
export const INQUIRY_EVENT='ddnz:inquiry';

const max=(value,length)=>String(value??'').replace(/[\u0000-\u001f\u007f]+/g,' ').replace(/\s+/g,' ').trim().slice(0,length);
const amount=value=>Number.isFinite(Number(value))&&Number(value)>0?Number(value):null;
const quantity=value=>Number.isInteger(Number(value))&&Number(value)>0?Math.min(9999,Number(value)):0;
const money=(value,currency)=>`${currency} ${Number(value).toLocaleString('en',{minimumFractionDigits:2,maximumFractionDigits:2})}`;

export function isProductionHost(hostname){return ['ddnzglobal.com','www.ddnzglobal.com'].includes(String(hostname??'').toLowerCase());}
export function currentHostname(){return typeof window==='undefined'?'':window.location.hostname;}
export function validEmail(value){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value??'').trim())&&String(value).trim().length<=254;}

export function validateInquiryContact({name,email}={}){
 const errors={};
 if(!max(name,100))errors.name='Enter your name.';
 if(!validEmail(email))errors.email='Enter a valid email address.';
 return errors;
}

function selectedRows(products,list){
 return (Array.isArray(products)?products:[]).flatMap(product=>{
  const units=quantity(list?.[product.id]);
  return units?[{product,units}]:[];
 });
}

function priceLines(product,units,target){
 const lines=[];
 const quote=product.quote;
 if(quote?.status==='indicative'&&amount(quote.price)&&max(quote.currency,8)&&Number.isInteger(quote.minUnits)){
  if(units>=quote.minUnits)lines.push(`Indicative reference: ${money(quote.price,quote.currency)} / unit (based on ${quote.minUnits} ${quote.minUnits===1?'unit':'units'}; subject to quotation).`);
  else lines.push(`Quantity is below the ${quote.minUnits}-unit indicative reference; please quote this quantity.`);
 }
 if(target&&target.priceBasis!=='reference'&&amount(target.price)&&max(target.currency,8))lines.push(`Buyer target: ${money(target.price,max(target.currency,8))} / unit (buyer target; subject to quotation).`);
 return lines;
}

export function buildInquiryMessage({products=[],list={},form={}}={}){
 const rows=selectedRows(products,list);
 const country=max(form.country,80)||'To confirm';
 const port=max(form.port,100)||'To confirm';
 const business=max(form.type,100)||'To confirm';
 const notes=max(form.notes,420);
 const total=rows.reduce((sum,row)=>sum+row.units,0);
 const lines=[
  'DDNZ commercial kitchen enquiry',
 `Destination: ${country}${port==='To confirm'?'':` (${port})`}`,
  `Buyer type: ${business}`,
  `Products: ${rows.length} model${rows.length===1?'':'s'} / ${total} unit${total===1?'':'s'}`,
  '',
 'Requested models:'
 ];
 const company=max(form.company,140);
 const preferredContact=max(form.contact,160);
 if(company)lines.splice(3,0,`Company: ${company}`);
 if(preferredContact)lines.splice(company?4:3,0,`Preferred contact: ${preferredContact}`);
 for(const {product,units} of rows){
  lines.push(`- ${max(product.model,80)||'Model'} × ${units}`);
  for(const line of priceLines(product,units,form.buyingTargets?.[product.id]))lines.push(`  ${line}`);
 }
 if(!rows.length)lines.push('- No valid models selected; please describe the equipment needed.');
 if(notes)lines.push('',`Buyer notes: ${notes}`);
 lines.push('','Please confirm configuration, availability, MOQ, lead time and quotation terms. Prices above are references or buyer targets only; no order is placed.');
 return lines.join('\n').slice(0,4200);
}

export function buildInquiryPayload({products=[],list={},form={},name='',email=''}={}){
 const message=buildInquiryMessage({products,list,form});
 const rows=selectedRows(products,list);
 const total=rows.reduce((sum,row)=>sum+row.units,0);
 return {
  name:max(name,100),
  email:max(email,254),
  subject:`Commercial kitchen enquiry — ${rows.length} model${rows.length===1?'':'s'} / ${total} unit${total===1?'':'s'}`,
  message
 };
}

export function buildDraftLinks(payload){
 const subject=encodeURIComponent(payload.subject);
 const body=encodeURIComponent(payload.message);
 return {
  whatsapp:`${WHATSAPP_URL}?text=${body}`,
  email:`mailto:manager@ddnzglobal.com?subject=${subject}&body=${body}`
 };
}

export function formspreeBody(payload){
 return new URLSearchParams({name:payload.name,email:payload.email,_subject:payload.subject,message:payload.message});
}

export async function submitInquiry(payload,{hostname=currentHostname(),fetchImpl=globalThis.fetch}={}){
 if(!isProductionHost(hostname))return {mode:'preview',networked:false};
 if(typeof fetchImpl!=='function')throw new Error('Sending is unavailable in this browser. Please try again or use the email draft.');
 const response=await fetchImpl(FORMSPREE_ENDPOINT,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/x-www-form-urlencoded'},body:formspreeBody(payload)});
 let data={};
 try{data=await response.json();}catch{}
 if(!response.ok||data.ok===false)throw new Error('We could not submit your enquiry. Please retry or use the email draft.');
 return {mode:'production',networked:true};
}

export function createInquirySubmitter(send=submitInquiry){
 let pending=false;
 return {
  get pending(){return pending;},
  async submit(payload,options){
   if(pending)return {mode:'blocked',networked:false};
   pending=true;
   try{return await send(payload,options);}finally{pending=false;}
  }
 };
}

export function emitInquiryEvent(action,{productCount=0,unitCount=0,mode='preview'}={},target=typeof window==='undefined'?null:window){
 if(!target?.dispatchEvent||typeof CustomEvent==='undefined')return;
 target.dispatchEvent(new CustomEvent(INQUIRY_EVENT,{detail:{action,mode,productCount,unitCount}}));
}
