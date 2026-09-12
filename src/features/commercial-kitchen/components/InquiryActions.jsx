import React,{useMemo,useRef,useState}from 'react';
import {buildDraftLinks,buildInquiryPayload,currentHostname,emitInquiryEvent,isProductionHost,submitInquiry,validateInquiryContact} from '../data/inquiry.mjs';
import '../styles/inquiry.css';

const countSelected=(products,list)=>{
 const rows=products.filter(product=>Number.isInteger(Number(list?.[product.id]))&&Number(list[product.id])>0);
 return {productCount:rows.length,unitCount:rows.reduce((sum,product)=>sum+Number(list[product.id]),0)};
};

export default function InquiryActions({products=[],list={},form={},brief,onPrivacy}){
 const [contact,setContact]=useState({name:'',email:''});
 const [errors,setErrors]=useState({});
 const [status,setStatus]=useState('idle');
 const [message,setMessage]=useState('');
 const sending=useRef(false);
 const hostname=currentHostname();
 const production=isProductionHost(hostname);
 const payload=useMemo(()=>buildInquiryPayload({products,list,form,name:contact.name,email:contact.email}),[products,list,form,contact]);
 const links=useMemo(()=>buildDraftLinks(payload),[payload]);
 const counts=useMemo(()=>countSelected(products,list),[products,list]);

 if(!brief)return null;

 function update(field,value){
  setContact(previous=>({...previous,[field]:value}));
  setErrors(previous=>({...previous,[field]:undefined}));
  if(status!=='idle'){setStatus('idle');setMessage('');}
 }

 async function onSubmit(event){
  event.preventDefault();
  if(sending.current||status==='success'||status==='preview')return;
  const nextErrors=validateInquiryContact(contact);
  if(Object.keys(nextErrors).length){setErrors(nextErrors);setStatus('idle');return;}
  sending.current=true;setStatus('submitting');setMessage('');
  try{
   const result=await submitInquiry(payload,{hostname});
   if(result.mode==='preview'){
    setStatus('preview');
    setMessage('Preview completed in this browser only. No network request was made and DDNZ has not received this enquiry.');
    emitInquiryEvent('preview_success',{...counts,mode:'preview'});
   }else{
    setStatus('success');
    setMessage('Your enquiry was submitted to DDNZ. Our team will review your requirements before preparing a quotation.');
    emitInquiryEvent('submit_success',{...counts,mode:'production'});
   }
  }catch(error){
   setStatus('error');
   setMessage(error instanceof Error?error.message:'We could not submit your enquiry. Please retry or use the email draft.');
   emitInquiryEvent('submit_error',{...counts,mode:production?'production':'preview'});
  }finally{sending.current=false;}
 }

 return <section className="inquiry-actions" aria-labelledby="inquiry-heading">
  <div className="inquiry-actions__heading"><p className="eyebrow">06 / SEND YOUR ENQUIRY</p><h3 id="inquiry-heading">Review, then send your request.</h3><p>Your sourcing brief remains a planning document. DDNZ confirms specifications, availability and commercial terms in its quotation.</p></div>
  <details className="inquiry-actions__review" open><summary>Review the concise message</summary><pre>{payload.message}</pre></details>
  <form className="inquiry-actions__form" onSubmit={onSubmit} noValidate>
   <div className="two-fields"><label>Your name<input value={contact.name} autoComplete="name" onChange={event=>update('name',event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name?'inquiry-name-error':undefined}/>{errors.name&&<small id="inquiry-name-error" className="inquiry-actions__error">{errors.name}</small>}</label><label>Work email<input type="email" value={contact.email} autoComplete="email" onChange={event=>update('email',event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email?'inquiry-email-error':undefined}/>{errors.email&&<small id="inquiry-email-error" className="inquiry-actions__error">{errors.email}</small>}</label></div>
   <button className="button primary" type="submit" disabled={['submitting','success','preview'].includes(status)}>{status==='submitting'?'Submitting…':status==='success'?'Enquiry submitted':status==='preview'?'Preview complete':production?'Send enquiry':'Simulate enquiry'} <span aria-hidden="true">→</span></button>
   <p className="fine">{production?'Submitting sends the message above to our team. It does not place an order.':'Local preview never sends a network request. It only simulates the form result.'}</p>
  </form>
  {message&&<p className={`inquiry-actions__status is-${status}`} role={status==='error'?'alert':'status'} aria-live="polite">{message}</p>}
  {status==='error'&&<button className="text-link inquiry-actions__retry" type="button" onClick={onSubmit}>Retry submission →</button>}
  <details className="inquiry-actions__privacy"><summary>Privacy and how this form uses your details</summary><div><p>DDNZ Global’s Privacy Policy says it collects name, email, phone and company details solely to provide logistics consultancy and quotes.</p><p>It also says this data is not sold to third parties and that cargo details and contact information are handled confidentially.</p>{typeof onPrivacy==='function'&&<button type="button" className="text-link" onClick={onPrivacy}>Open the full Privacy Policy →</button>}</div></details>
  <div className="inquiry-actions__drafts"><span>Prefer to review in your own app?</span><a className="button outline" href={links.whatsapp} target="_blank" rel="noopener noreferrer" onClick={()=>emitInquiryEvent('whatsapp_draft',{...counts,mode:production?'production':'preview'})}>Draft WhatsApp ↗</a><a className="text-link" href={links.email} onClick={()=>emitInquiryEvent('email_draft',{...counts,mode:production?'production':'preview'})}>Draft email →</a></div>
 </section>;
}
