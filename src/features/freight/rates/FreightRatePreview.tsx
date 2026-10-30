import {useEffect,useId,useState,type ReactNode} from 'react';
import {quoteLinkProps} from '../../../lib/quoteLinkPolicy.mjs';
import {trackEvent} from '../../../lib/utils';
import {sampleCountries,sampleRegions,countryNames,regionCountries,portNames,originNames,previewAllowed,filteredRates,routeExamples,inquiryNotes} from './model.mjs';

type Fee={name:string;values:(number|null)[];ticket:number|null;currency:string;other:string};
type Rate={id:string;country:string;port:string;origin:string;carrier:string;service:string;days:number;route:string;validity:string;cutoff:string;prices:Record<string,number|null>;fees:Fee[];notes:string;schedule:string;flags:string[]};
type Coverage={country:string;port:string;status:string;count:number};
type Payload={asOf:string;rows:Rate[];coverage:Coverage[]};
let cachedPayload:Promise<Payload>|undefined;
const enabled=import.meta.env?.VITE_FREIGHT_RATE_PREVIEW==='1';
const money=(value:number|null)=>value==null?'待询价':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
const feeNames:Record<string,string>={'THC':'码头操作费','SEAL CHARGE':'封条费','EQUIPMENT INTERCHANGE RECEIPT':'设备交接费','DOC FEE':'文件费','TELEX RELEASE FEE':'电放费','INTERNATIONAL SHIP AND PORT FACILITY SECURITY':'港口安保费','AMS FEE':'AMS申报费','DHC':'DHC（范围待确认）'};
function quoteProps(row:Rate,container:string,context:string) {
 const params=new URLSearchParams({leadGoal:'Freight Export',source:sampleRegions.includes(context)?`freight_region_${context}`:row.country==='ghana'?'ghana_country':'international_country',destinationText:`${countryNames[row.country]} · ${portNames[row.port]||row.port}`,notes:inquiryNotes(row,container)});
 return quoteLinkProps(`/zh-cn/get-a-quote/?${params}`);
}
function FeeDetails({row,container}:{row:Rate;container:string}) {
 const index=['20GP','40GP','40HQ'].indexOf(container);
 return <div className="frp-details">
  <div><h4>这条班次还有哪些费用？</h4><p>主运费与下列费用分开核对。人民币、美元各按原币种列示；按票收费不按柜数重复计算。</p>
   {row.fees.length?<div className="frp-fees">{row.fees.map((f,i)=><div key={i}><span>{feeNames[f.name]||f.name}</span><strong>{f.ticket!=null?`${f.ticket.toLocaleString('en-US')} ${f.currency} / 票`:f.values[index]!=null?`${f.values[index]!.toLocaleString('en-US')} ${f.currency} / ${container}`:f.other||'此柜型待询价'}</strong></div>)}</div>:<p className="frp-warning">本条未列杂费，请向 HB 补询。</p>}
   <p className="frp-footnote">是否同时收取文件费与电放费、是否另有目的港费用，需按实际放货方式和报价范围确认。</p>
  </div>
  <div><h4>清关、税费与派送到门</h4><p>本次采集只覆盖 FCL 运价。进口清关、关税与当地税费、查验、仓储、提柜及送到收货地址的费用，不能据此视为已经包含。</p><p>需要含税清关到门服务，请提供品名、HS 编码、包装、货值和收货地址，由 HB 确认可承接范围及责任。</p>
   <details className="frp-source"><summary>查看免柜、限重及船期原文</summary><p>采集于 2026-10-30；有效期适用年份待确认。</p><p>{row.cutoff.replace(/^cutting\/ETD[：:]\s*/,'截关 / 开船：').replace(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/g,d=>({Mon:'周一',Tue:'周二',Wed:'周三',Thu:'周四',Fri:'周五',Sat:'周六',Sun:'周日'}[d]!))}</p><pre>{row.schedule||'源站未列具体船名航次。'}</pre><pre>{row.notes}</pre></details>
   {!!row.flags.length&&<p className="frp-warning">需核对：{row.flags.join('；')}。原文条件保留，申请值不作为承诺。</p>}
  </div>
 </div>;
}
function Rates({payload,context}:{payload:Payload;context:string}) {
 const region=sampleRegions.includes(context);const allCountries=region?regionCountries[context]:[context];
 const [country,setCountry]=useState('all');const [port,setPort]=useState<string>(({ghana:'TEMA',uae:'JEBEL ALI',brazil:'SANTOS',bangladesh:'CHATTOGRAM',peru:'CALLAO'} as Record<string,string>)[context]||'all');const [origin,setOrigin]=useState('NANSHA');const [container,setContainer]=useState('40HQ');const [more,setMore]=useState(false);
 const uid=useId().replace(/:/g,'');
 const countries=country==='all'?allCountries:[country];
 const available=payload.coverage.filter(c=>countries.includes(c.country));
 const rows=filteredRates(payload.rows,{countries,port,origin});
 const shown=region?routeExamples(rows):rows;const initial=region?5:3;const display=more?shown:shown.slice(0,initial);
 const setFilter=(setter:(v:string)=>void,value:string)=>{setter(value);setMore(false);};
 const empty=available.find(x=>x.port===port);
 const contextHeading=region?'先选目的港，再比较具体班次。':`到${countryNames[context]}，按柜型比较运价与航程。`;
 return <section id="freight-rates" className="frp" aria-labelledby={`${uid}-heading`} data-freight-rate-preview={context}>
  <div className="frp-wrap">
   <div className="frp-heading"><div><p className="frp-kicker">FCL / 整柜海运</p><h2 id={`${uid}-heading`}>{contextHeading}</h2><p className="frp-intro">{region?'区域页展示具体路线样例；不同港口、柜型和附加费应逐项比较。':'从广州起运，区分南沙、黄埔等实际装运港。先看海上航程，再核对到港后的费用与交付安排。'}</p></div><div className="frp-date"><span>采集日期</span><strong>{payload.asOf}</strong><small>班次与舱位另行确认</small></div></div>
   <div className="frp-review"><strong>内部预览 · 尚未核定对客售价</strong><span>以下为平台采集参考，不是 DDNZ / HB 的有效报价。有效期按原文保留，适用年份待核。</span></div>
   <div className="frp-controls">
    {region&&<label>目的国家<select value={country} onChange={e=>{setCountry(e.target.value);setPort('all');setMore(false);}}><option value="all">区域内全部国家</option>{allCountries.map(c=><option key={c} value={c}>{countryNames[c]}</option>)}</select></label>}
    <label>目的港<select value={port} onChange={e=>setFilter(setPort,e.target.value)}><option value="all">全部目的港</option>{available.map(c=><option key={c.port} value={c.port}>{portNames[c.port]||c.port}{c.count===0?' · 待询价':''}</option>)}</select></label>
    <label>实际起运港<select value={origin} onChange={e=>setFilter(setOrigin,e.target.value)}><option value="all">全部起运港</option>{[...new Set(payload.rows.filter(r=>allCountries.includes(r.country)).map(r=>r.origin))].map(o=><option key={o} value={o}>{originNames[o]||o}</option>)}</select></label>
    <label>柜型<select value={container} onChange={e=>setContainer(e.target.value)}>{['20GP','40GP','40HQ'].map(t=><option key={t}>{t}</option>)}</select></label>
   </div>
   <div className="frp-table-note"><p>{region?'每条均为明确起运港与目的港的路线样例，非区域最低价。':'按采集顺序展示，非低价或时效排名。'} 费用单位：USD / {container}。</p><span>{shown.length} 条{region?'路线样例':'采集记录'}</span></div>
   {display.length?<div className="frp-list"><div className="frp-column-head" aria-hidden="true"><span>路线 / 船公司</span><span>航程 / 中转</span><span>{container} 主运费参考</span><span>有效期原文</span><span>费用与询价</span></div>{display.map(row=><article className="frp-row" key={row.id}>
    <div className="frp-main"><div><span className="frp-mobile-label">路线 / 船公司</span><h3>{originNames[row.origin]||row.origin} → {portNames[row.port]||row.port}</h3><p>{row.carrier} <span>· {row.service}</span></p><small>{countryNames[row.country]} · {row.port}</small></div>
     <div><span className="frp-mobile-label">航程 / 中转</span><strong className="frp-days">{row.days} <small>天</small></strong><p>{row.route.startsWith('Direct')?'直航':`中转 · ${row.route.replace(/^Transfer\s*/,'')}`}</p></div>
     <div><span className="frp-mobile-label">{container} 主运费参考</span><strong className="frp-money">{money(row.prices[container])}</strong><small>杂费见下方明细</small></div>
     <div><span className="frp-mobile-label">有效期原文</span><strong className="frp-validity">{row.validity.replace(/^Valid[：:]\s*/,'').replace('~',' — ')}</strong><small>适用年份待核</small></div>
     <div className="frp-row-action"><a {...quoteProps(row,container,context)} onClick={()=>trackEvent('lead_table_cta_click',{page_type:'freight_rate_preview',country:row.country,model:row.id})}>按此路线询价 ↗</a></div>
    </div><details className="frp-expand"><summary>费用明细与运输条件 <span>附加费用 · 免柜与限重 · 到门范围</span></summary><FeeDetails row={row} container={container}/></details>
   </article>)}</div>:<div className="frp-empty"><h3>{empty?.status==='港名待确认'?'目的港名称还需确认':'这组条件暂无采集报价'}</h3><p>{empty?.status==='港名待确认'?'尚未将近似名称当作同一港口。请提交实际入港点及收货地址，由 HB 确认路线。':'本次查询没有可展示记录，不代表停航或免费。可更换起运港，或由 HB 按货物和出运日期另询。'}</p></div>}
   {shown.length>initial&&<button type="button" className="frp-more" onClick={()=>setMore(!more)} aria-expanded={more}>{more?'收起更多班次':`查看其余 ${shown.length-initial} 条${region?'路线样例':'记录'}`} <span aria-hidden="true">{more?'−':'+'}</span></button>}
   <div className="frp-bottom"><p><strong>需要拼箱、空运或含税清关到门？</strong><span>由 HB 按货物、出运日期与收货地址单独询价。DDNZ 负责制造与出口业务衔接，国际运输由 HB 执行。</span></p><a {...quoteLinkProps(`/zh-cn/get-a-quote/?${new URLSearchParams({leadGoal:'Freight Export',source:region?`freight_region_${context}`:'international_country',destinationText:[country==='all'?(region?'':countryNames[context]):countryNames[country],port==='all'?'':portNames[port]||port].filter(Boolean).join(' · '),notes:`请按货物与收货地址评估运输方案，并分别确认主运费、杂费、清关、税费与到门派送范围。${port==='all'?'':`目的港：${port}；当前比较柜型：${container}。`}${rows.length?'':'本次采集无可展示报价，请另行核对港名、路线及价格。'}`})}`)}>提交货物与交付要求 ↗</a></div>
  </div>
 </section>;
}
export default function FreightRatePreview({context,locale,children}:{context:string;locale:string;children?:ReactNode}) {
 const [payload,setPayload]=useState<Payload|null>(null);
 const allowed=typeof window!=='undefined'&&previewAllowed(enabled,window.location.hostname,locale,context);
 useEffect(()=>{
  if(!allowed)return;let live=true;
  cachedPayload??=fetch('/__internal/freight-preview.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('No local rate snapshot');return r.json();}).catch(e=>{cachedPayload=undefined;throw e;});
  cachedPayload.then(d=>{if(live)setPayload(d);}).catch(()=>{});return()=>{live=false;};
 },[allowed]);
 useEffect(()=>{if(payload&&window.location.hash==='#freight-rates')document.getElementById('freight-rates')?.scrollIntoView({block:'start'});},[payload]);
 if(!allowed||!payload)return <>{children}</>;
 return <><Rates key={context} payload={payload} context={context}/>{children&&<details className="frp-existing"><summary>其他运输方式与到港后的交付安排</summary>{children}</details>}</>;
}
