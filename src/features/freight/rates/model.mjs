export const sampleCountries = ['ghana','uae','brazil','bangladesh','peru'];
export const sampleRegions = ['west-africa','latin-america'];
export const countryNames = {ghana:'加纳',nigeria:'尼日利亚',uae:'阿联酋',brazil:'巴西',bangladesh:'孟加拉',peru:'秘鲁',mexico:'墨西哥',argentina:'阿根廷',chile:'智利'};
export const regionCountries = {'west-africa':['ghana','nigeria'],'latin-america':['mexico','brazil','argentina','peru','chile']};
export const portNames = {TEMA:'特马',TAKORADI:'塔科拉迪',APAPA:'阿帕帕',TINCAN:'廷坎','JEBEL ALI':'杰贝阿里',KHALIFA:'哈利法',SANTOS:'桑托斯',CHATTOGRAM:'吉大港',MONGLA:'蒙格拉',CALLAO:'卡亚俄',CHANCAY:'钱凯','MANZANILLO,MEXICO':'曼萨尼约','LAZARO CARDENAS':'拉萨罗卡德纳斯','BUENOS AIRES':'布宜诺斯艾利斯','SAN ANTONIO,CL':'圣安东尼奥','VALPARAISO,CL':'瓦尔帕莱索'};
Object.assign(portNames,{PARANAGUA:'Paranaguá',ITAJAI:'Itajaí',NAVEGANTES:'Navegantes',SUAPE:'Suape','RIO DE JANEIRO':'Rio de Janeiro'});
export const originNames = {NANSHA:'南沙',HUANGPU:'黄埔',SHEKOU:'蛇口',YANTIAN:'深圳·盐田',NINGBO:'宁波',SHANGHAI:'上海'};
export const additionalOrigins=['YANTIAN','NINGBO','SHANGHAI'];
// 10% gross margin is revenue less cost, divided by revenue, not a 10% markup.
// Round up to cents so rounding does not reduce the agreed target margin.
export function referencePrice(cost) {
 if(cost==null || !Number.isFinite(cost) || cost<0)return null;
 if(cost===0)return 0;
 return Math.ceil(cost*100/0.9-1e-8)/100;
}
export function customerConditions(text) {
 // Source conditions remain verbatim internally. Conditional carrier charges
 // require a quote rather than exposing raw cost amounts in customer copy.
 return text
  .replace(/(?:USD|RMB|CNY|\$)\s*[\d,.]+(?:\s*\/\s*(?:(?:USD|RMB|CNY|\$)\s*)?[\d,.]+(?![\dA-Za-z'’′]))*|[\d,.]+\s*(?:USD|RMB|CNY)/gi,'（费用另询）')
  .replace(/[+＋]\s*[\d,.]+(?:\s*\/\s*[\d,.]+)+(?![\dA-Za-z'’′])/g,'（费用另询）');
}
export function previewAllowed(enabled,hostname,locale,context) {
 return enabled===true && ['127.0.0.1','localhost'].includes(hostname) && locale==='zh' && [...sampleCountries,...sampleRegions].includes(context);
}
// A capture date is not a validity year. No source row can become a public rate
// until an explicit price approval and complete validity dates are provided.
export function publicRateEligible(row,now) {
 if(row.publicPriceApproved!==true || !row.validFromISO || !row.validThroughISO) return false;
 const a=Date.parse(row.validFromISO),b=Date.parse(row.validThroughISO),n=Date.parse(now);
 return Number.isFinite(a)&&Number.isFinite(b)&&Number.isFinite(n)&&a<=n&&n<=b;
}
export function filteredRates(rows,{countries,port='all',origin='all'}) {
 return rows.filter(r=>countries.includes(r.country)&&(port==='all'||r.port===port)&&(origin==='all'||r.origin===origin));
}
export function routeDescription(row) {
 if(row.route.startsWith('Direct'))return '直航';
 const transit=row.route.replace(/^Transfer\s*/,'').trim();
 return !transit||transit.toUpperCase()===row.port.toUpperCase()?'中转安排待确认':`中转 · ${transit}`;
}
// Region rows are concrete route examples, never a regional minimum price.
export function routeExamples(rows) {
 const seen=new Set();return rows.filter(r=>{const k=[r.country,r.port,r.origin].join('|');if(seen.has(k))return false;seen.add(k);return true;});
}
export function inquiryNotes(row,container) {
 return `2026年Q4 FCL参考路线：${originNames[row.origin]||row.origin} → ${portNames[row.port]||row.port}（${row.port}）；${container}。\n参考记录：${row.id}；${row.carrier} / ${row.service}。\n季度参考值不是锁价报价。请按实际出运日期确认可订船期、报价有效期、主运费、起运港和目的港杂费，以及清关/税费/派送范围。`;
}
