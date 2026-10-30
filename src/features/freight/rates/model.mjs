export const sampleCountries = ['ghana','uae','brazil','bangladesh','peru'];
export const sampleRegions = ['west-africa','latin-america'];
export const countryNames = {ghana:'加纳',nigeria:'尼日利亚',uae:'阿联酋',brazil:'巴西',bangladesh:'孟加拉',peru:'秘鲁',mexico:'墨西哥',argentina:'阿根廷',chile:'智利'};
export const regionCountries = {'west-africa':['ghana','nigeria'],'latin-america':['mexico','brazil','argentina','peru','chile']};
export const portNames = {TEMA:'特马',TAKORADI:'塔科拉迪',APAPA:'阿帕帕',TINCAN:'廷坎','JEBEL ALI':'杰贝阿里',KHALIFA:'哈利法',SANTOS:'桑托斯',CHATTOGRAM:'吉大港',MONGLA:'蒙格拉',CALLAO:'卡亚俄',CHANCAY:'钱凯','MANZANILLO,MEXICO':'曼萨尼约','LAZARO CARDENAS':'拉萨罗卡德纳斯','BUENOS AIRES':'布宜诺斯艾利斯','SAN ANTONIO,CL':'圣安东尼奥','VALPARAISO,CL':'瓦尔帕莱索'};
export const originNames = {NANSHA:'南沙',HUANGPU:'黄埔',SHEKOU:'蛇口',YANTIAN:'盐田'};
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
// Region rows are concrete route examples, never a regional minimum price.
export function routeExamples(rows) {
 const seen=new Set();return rows.filter(r=>{const k=[r.country,r.port,r.origin].join('|');if(seen.has(k))return false;seen.add(k);return true;});
}
export function inquiryNotes(row,container) {
 return `FCL路线需求：${originNames[row.origin]||row.origin} → ${portNames[row.port]||row.port}（${row.port}）；${container}。\n参考采集记录：${row.id}；${row.carrier} / ${row.service}。\n此记录为待核采集参考，非有效报价。请确认实际可订船期、有效期、主运费、起运港和目的港杂费，以及清关/税费/派送范围。`;
}
