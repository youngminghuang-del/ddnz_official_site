export const sampleCountries = ['ghana','nigeria','saudi-arabia','uae','kuwait','qatar','oman','bahrain','india','pakistan','bangladesh','mexico','brazil','argentina','peru','chile'];
export const sampleRegions = ['middle-east','west-africa','latin-america'];
export const countryNames = {ghana:'加纳',nigeria:'尼日利亚',uae:'阿联酋',brazil:'巴西',bangladesh:'孟加拉',peru:'秘鲁',mexico:'墨西哥',argentina:'阿根廷',chile:'智利'};
Object.assign(countryNames,{'saudi-arabia':'沙特',kuwait:'科威特',qatar:'卡塔尔',oman:'阿曼',bahrain:'巴林',india:'印度',pakistan:'巴基斯坦'});
export const regionCountries = {'middle-east':['saudi-arabia','uae','kuwait','qatar','oman','bahrain'],'west-africa':['ghana','nigeria'],'latin-america':['mexico','brazil','argentina','peru','chile']};
export const portNames = {TEMA:'特马',TAKORADI:'塔科拉迪',APAPA:'阿帕帕',TINCAN:'廷坎','JEBEL ALI':'杰贝阿里',KHALIFA:'哈利法',SANTOS:'桑托斯',CHATTOGRAM:'吉大港',MONGLA:'蒙格拉',CALLAO:'卡亚俄',CHANCAY:'钱凯','MANZANILLO,MEXICO':'曼萨尼约','LAZARO CARDENAS':'拉萨罗卡德纳斯','BUENOS AIRES':'布宜诺斯艾利斯','SAN ANTONIO,CL':'圣安东尼奥','VALPARAISO,CL':'瓦尔帕莱索'};
Object.assign(portNames,{JEDDAH:'吉达',SHUWAIKH:'舒韦赫',HAMAD:'哈马德',SOHAR:'苏哈尔',BAHRAIN:'巴林（码头待确认）','NHAVA SHEVA':'那瓦舍瓦',KARACHI:'卡拉奇',PARANAGUA:'Paranaguá',ITAJAI:'Itajaí',NAVEGANTES:'Navegantes',SUAPE:'Suape','RIO DE JANEIRO':'Rio de Janeiro'});
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
 return enabled===true && ['127.0.0.1','localhost'].includes(hostname) && ['zh','en','es','fr','ru','ar','pt','tr'].includes(locale) && [...sampleCountries,...sampleRegions].includes(context);
}
// Firm, bookable offers require approval and complete validity dates.
// The separate customer feed is explicitly a quarterly reference, never an offer.
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
