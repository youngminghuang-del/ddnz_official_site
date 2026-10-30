import {customerFreightEndpoint,customerRatesAllowed,validateCustomerFreight} from './public-feed.mjs';
import {freightLocalizations,localePrefix,localizedDestination,localizedFee,localizedCutoff} from '../locales/index.mjs';
import {rateCopy,countryNamesEn,originNamesEn,routeLabelEn} from './copy.mjs';
import {useEffect,useId,useState,type ReactNode} from 'react';
import {quoteLinkProps} from '../../../lib/quoteLinkPolicy.mjs';
import {trackEvent} from '../../../lib/utils';
import {sampleCountries,sampleRegions,countryNames,regionCountries,portNames,originNames,filteredRates,routeExamples,inquiryNotes,additionalOrigins,routeDescription} from './model.mjs';

type Fee={name:string;values:(number|null)[];ticket:number|null;currency:string};
type Rate={id:string;country:string;port:string;origin:string;carrier:string;service:string;days:number|null;route:string;cutoff:string;prices:Record<string,number|null>;fees:Fee[];conditionalFreeTime:boolean};
type Coverage={country:string;port:string;portUnconfirmed:boolean;count:number|null};
type Payload={schemaVersion:number;kind:string;period:string;currency:string;referenceOnly:boolean;rows:Rate[];coverage:Coverage[]};
let cachedPayload:Promise<Payload>|undefined;
const money=(value:number|null,locale='en')=>{return value==null?'待询价':new Intl.NumberFormat(locale==='zh'?'en-US':locale,{style:'currency',currency:'USD',...(freightLocalizations[locale]?{currencyDisplay:'code' as const}:{}),maximumFractionDigits:2}).format(value).replace(/\u00a0/g,' ');};
const feeMoney=(value:number,locale='en')=>value.toLocaleString(locale==='zh'?'en-US':locale,{maximumFractionDigits:2});
const feeNamesEn:Record<string,string>={'THC':'Terminal handling charge (THC)','SEAL CHARGE':'Seal charge','EQUIPMENT INTERCHANGE RECEIPT':'Equipment interchange receipt','DOC FEE':'Document fee','TELEX RELEASE FEE':'Telex release fee','INTERNATIONAL SHIP AND PORT FACILITY SECURITY':'Port facility security','AMS FEE':'AMS filing fee','DHC':'DHC (scope to confirm)'};
const feeNames:Record<string,string>={'THC':'码头操作费','SEAL CHARGE':'封条费','EQUIPMENT INTERCHANGE RECEIPT':'设备交接费','DOC FEE':'文件费','TELEX RELEASE FEE':'电放费','INTERNATIONAL SHIP AND PORT FACILITY SECURITY':'港口安保费','AMS FEE':'AMS申报费','DHC':'DHC（范围待确认）'};
function quoteProps(row:Rate,container:string,context:string,locale:string) {
 const names=freightLocalizations[locale]?new Proxy({},{get:(_,key)=>localizedDestination(String(key),locale)}):locale==='en'?countryNamesEn:countryNames;const origins=locale!=='zh'?originNamesEn:originNames;
 const params=new URLSearchParams({leadGoal:'Freight Export',source:sampleRegions.includes(context)?`freight_region_${context}`:row.country==='ghana'?'ghana_country':'international_country',originText:origins[row.origin]||row.origin,destinationText:`${names[row.country]} · ${locale!=='zh'?row.port:portNames[row.port]||row.port}`,notes:freightLocalizations[locale]?`${rateCopy[locale].period}: ${row.origin} → ${row.port}; ${container}. ${row.id}; ${row.carrier} / ${row.service}. ${rateCopy[locale].notice} ${freightLocalizations[locale].door.prepText}`:locale==='en'?`Q4 2026 FCL reference: ${row.origin} → ${row.port}; ${container}. Record ${row.id}; ${row.carrier} / ${row.service}. Not a locked price. Please confirm actual sailings, freight, origin/destination charges, clearance, duties, taxes and final delivery for this shipment.`:inquiryNotes(row,container)});
 return quoteLinkProps(`${localePrefix(locale)}/get-a-quote/?${params}`);
}
function FeeDetails({row,container,locale}:{row:Rate;container:string;locale:string}) {
 const c=rateCopy[locale];const x=freightLocalizations[locale]?.extra;
 const index=['20GP','40GP','40HQ'].indexOf(container);
 return <div className="frp-details">
  <div><h4>{c.feeHeading}</h4><p>{c.feeIntro}</p>
   {row.fees.length?<div className="frp-fees">{row.fees.map((f,i)=><div key={i}><span>{freightLocalizations[locale]?localizedFee(f.name,locale):locale==='en'?feeNamesEn[f.name]||f.name:feeNames[f.name]||f.name}</span><strong>{f.ticket!=null?`${feeMoney(f.ticket,locale)} ${f.currency} / ${c.ticket}`:f.values[index]!=null?`${feeMoney(f.values[index]!,locale)} ${f.currency} / ${container}`:x?.otherContainer||(locale==='en'?'Request this container price':'此柜型待询价')}</strong></div>)}</div>:<p className="frp-warning">{c.missingFee}</p>}
   <p className="frp-footnote">{c.feeNote}</p>
  </div>
  <div><h4>{c.scope}</h4><p>{c.scopeNote}</p><p>{c.scopeBrief}</p>
   <details className="frp-source"><summary>{c.conditions}</summary><p>{c.conditionNote}</p><p>{x?localizedCutoff(row.cutoff,locale):locale!=='zh'?row.cutoff.replace(/^cutting\/ETD[：:]\s*/,x?.cutoff?x.cutoff+': ':'Cut-off / ETD: '):row.cutoff.replace(/^cutting\/ETD[：:]\s*/,'截关 / 开船：').replace(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/g,d=>({Mon:'周一',Tue:'周二',Wed:'周三',Thu:'周四',Fri:'周五',Sat:'周六',Sun:'周日'}[d]!))}</p><pre>{c.sailing}</pre><pre>{x?x.sourceConditions:locale==='en'?'Confirm route-specific free time, cargo weight limits, approval requirements and any surcharges with HB before booking.':'请按实际货物与出运日期向HB核对免柜期、重量限制、审批条件及附加费用。'}</pre></details>
   {row.conditionalFreeTime&&<p className="frp-warning">{c.conditional}</p>}
  </div>
 </div>;
}
function Rates({payload,context,locale}:{payload:Payload;context:string;locale:string}) {
 const c=rateCopy[locale];const en=locale==='en';const local=freightLocalizations[locale];const x=local?.extra;const names=local?new Proxy({},{get:(_,key)=>localizedDestination(String(key),locale)}):en?countryNamesEn:countryNames;const origins=locale!=='zh'?originNamesEn:originNames;const portLabel=(p:string)=>local?(p==='BAHRAIN'?`${localizedDestination('bahrain',locale)} · ${x.terminalPending}`:p):en?(p==='BAHRAIN'?'Bahrain (terminal to confirm)':p):portNames[p]||p;
 const region=sampleRegions.includes(context);const allCountries=region?regionCountries[context]:[context];
 const [country,setCountry]=useState('all');const [port,setPort]=useState<string>(({ghana:'TEMA',uae:'JEBEL ALI',brazil:'SANTOS',bangladesh:'CHATTOGRAM',peru:'CALLAO'} as Record<string,string>)[context]||'all');const [origin,setOrigin]=useState('NANSHA');const [container,setContainer]=useState('40HQ');const [more,setMore]=useState(false);
 const uid=useId().replace(/:/g,'');
 const countries=country==='all'?allCountries:[country];
 const available=payload.coverage.filter(c=>countries.includes(c.country));
 const rows=filteredRates(payload.rows,{countries,port,origin});
 const shown=region?routeExamples(rows):rows;const initial=region?5:3;const display=more?shown:shown.slice(0,initial);
 const setFilter=(setter:(v:string)=>void,value:string)=>{setter(value);setMore(false);};
 const empty=available.find(x=>x.port===port);
 const contextHeading=region?c.regionHeading:locale!=='zh'?`${names[context]}: ${c.heading}`:`到${names[context]}，${c.heading}`;
 return <section id="freight-rates" className="frp" aria-labelledby={`${uid}-heading`} data-freight-rate-preview={context} lang={locale==='zh'?'zh-CN':locale} dir={locale==='ar'?'rtl':'ltr'}>
  <div className="frp-wrap">
   <div className="frp-heading"><div><p className="frp-kicker">{c.fcl}</p><h2 id={`${uid}-heading`}>{contextHeading}</h2><p className="frp-intro">{region?c.regionIntro:c.intro}</p></div></div>
   <div className="frp-review"><strong>{c.quarter}</strong><span>{c.notice}</span></div>
   <div className="frp-controls">
    {region&&<label>{c.country}<select value={country} onChange={e=>{setCountry(e.target.value);setPort('all');setMore(false);}}><option value="all">{c.allCountries}</option>{allCountries.map(code=><option key={code} value={code}>{names[code]}</option>)}</select></label>}
    <label>{c.port}<select value={port} onChange={e=>setFilter(setPort,e.target.value)}><option value="all">{c.allPorts}</option>{available.map(item=><option key={item.port} value={item.port}>{portLabel(item.port)}{!item.count?` · ${c.ask}`:''}</option>)}</select></label>
    <label>{c.origin}<select value={origin} onChange={e=>setFilter(setOrigin,e.target.value)}><option value="all">{c.allOrigins}</option>{[...new Set([...payload.rows.filter(r=>allCountries.includes(r.country)).map(r=>r.origin),...additionalOrigins])].map(o=><option key={o} value={o}>{origins[o]||o}{payload.rows.some(r=>countries.includes(r.country)&&r.origin===o&&(port==='all'||r.port===port))?'':` · ${c.ask}`}</option>)}</select></label>
    <label>{c.container}<select value={container} onChange={e=>setContainer(e.target.value)}>{['20GP','40GP','40HQ'].map(t=><option key={t} dir="ltr">{t}</option>)}</select></label>
   </div>
   <div className="frp-table-note"><p>{region?c.regionNote:c.tableNote} {c.unit}: <bdi dir="ltr">USD / {container}</bdi>.</p><span>{local?<>{region?c.example:c.option}: {shown.length.toLocaleString(locale)}</>:<>{shown.length} {en?'':'条'}{region?c.example:c.option}</>}</span></div>
   {display.length?<div className="frp-list"><div className="frp-column-head" aria-hidden="true"><span>{c.route}</span><span>{c.journey}</span><span>{container} {c.freight}</span><span>{c.periodLabel}</span><span>{c.actions}</span></div>{display.map(row=><article className="frp-row" key={row.id}>
    <div className="frp-main"><div><span className="frp-mobile-label">{c.route}</span><h3><bdi>{origins[row.origin]||row.origin}</bdi> {locale==='ar'?'←':'→'} <bdi>{portLabel(row.port)}</bdi></h3><p>{row.carrier} <span>· {row.service}</span></p><small>{names[row.country]} · {row.port}</small></div>
     <div><span className="frp-mobile-label">{c.journey}</span><strong className="frp-days" dir="auto">{row.days==null?c.ask:<>{row.days.toLocaleString(locale==='zh'?'en':locale)} <small>{c.days}</small></>}</strong><p>{local?(row.route.startsWith('Direct')?x.direct:!row.route.replace(/^Transfer\s*/i,'').trim()||row.route.replace(/^Transfer\s*/i,'').trim().toUpperCase()===row.port.toUpperCase()?x.pendingTransit:<>{x.via} <bdi>{row.route.replace(/^Transfer\s*/i,'')}</bdi></>):en?routeLabelEn(row):routeDescription(row)}</p></div>
     <div><span className="frp-mobile-label">{container} {c.freight}</span><strong className="frp-money" dir="auto">{row.prices[container]==null?c.ask:money(row.prices[container],locale)}</strong><small>{c.feesBelow}</small></div>
     <div><span className="frp-mobile-label">{c.periodLabel}</span><strong className="frp-validity">{c.period}</strong><small>{c.actual}</small></div>
     <div className="frp-row-action"><a {...quoteProps(row,container,context,locale)} onClick={()=>trackEvent('lead_table_cta_click',{page_type:'freight_rate_preview',country:row.country,model:row.id})}>{c.quote}</a></div>
    </div><details className="frp-expand"><summary>{c.details}<span>{c.detailHint}</span></summary><FeeDetails row={row} container={container} locale={locale}/></details>
   </article>)}</div>:<div className="frp-empty"><h3>{empty?.portUnconfirmed?c.portPending:c.emptyHeading}</h3><p>{empty?.portUnconfirmed?c.portNote:c.emptyNote}</p></div>}
   {shown.length>initial&&<button type="button" className="frp-more" onClick={()=>setMore(!more)} aria-expanded={more}>{more?c.collapse:`${c.more} (${shown.length-initial})`} <span aria-hidden="true">{more?'−':'+'}</span></button>}
   <div className="frp-bottom"><p><strong>{c.bottom}</strong><span>{c.bottomNote}</span></p><a {...quoteLinkProps(`${localePrefix(locale)}/get-a-quote/?${new URLSearchParams({leadGoal:'Freight Export',source:region?`freight_region_${context}`:'international_country',originText:origin==='all'?'':origins[origin]||origin,destinationText:[country==='all'?(region?'':names[context]):names[country],port==='all'?'':portLabel(port)].filter(Boolean).join(' · '),notes:local?`${c.notice} ${freightLocalizations[locale].door.prepText} ${origin} → ${port}; ${container}.`:en?`Please assess the cargo and delivery address; confirm freight, additional charges, clearance, duties, taxes and delivery separately. Loading port: ${origin}; destination: ${port}; container: ${container}. ${rows.length?'':'No reference is listed for this selection; please confirm the route.'}`:`请按货物与收货地址评估运输方案，并分别确认主运费、杂费、清关、税费与到门派送范围。${origin==='all'?'':`起运港：${origins[origin]||origin}。`}${port==='all'?'':`目的港：${port}；当前比较柜型：${container}。`}${rows.length?'':'本表暂无该路线参考价，请另行核对港名、路线及价格。'}`})}`)}>{c.send}</a></div>
  </div>
 </section>;
}
export default function FreightRatePreview({context,locale,children}:{context:string;locale:string;children?:ReactNode}) {
 const [payload,setPayload]=useState<Payload|null>(null);
 const allowed=customerRatesAllowed(locale,context);
 useEffect(()=>{
  if(!allowed)return;let live=true;
  cachedPayload??=fetch(customerFreightEndpoint,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Customer reference unavailable');return r.json();}).then(d=>validateCustomerFreight(d)).catch(e=>{cachedPayload=undefined;throw e;});
  cachedPayload.then(d=>{if(live)setPayload(d);}).catch(()=>{});return()=>{live=false;};
 },[allowed]);
 useEffect(()=>{if(payload&&window.location.hash==='#freight-rates')document.getElementById('freight-rates')?.scrollIntoView({block:'start'});},[payload]);
 if(!allowed||!payload)return <>{children}</>;
 return <><Rates key={context+locale} payload={payload} context={context} locale={locale}/>{children&&<details className="frp-existing"><summary>{rateCopy[locale].original}</summary>{children}</details>}</>;
}
