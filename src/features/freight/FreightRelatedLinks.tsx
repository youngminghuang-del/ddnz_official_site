import { freightPrefix } from './regions';

const groups: Record<string, Record<string, string>> = {
 'latin-america': {mexico:'MX',brazil:'BR',argentina:'AR',peru:'PE',chile:'CL'},
 'west-africa': {nigeria:'NG',ghana:'GH'},
 'middle-east': {'saudi-arabia':'SA',uae:'AE',kuwait:'KW',qatar:'QA',oman:'OM',bahrain:'BH'},
 'central-asia': {kazakhstan:'KZ',uzbekistan:'UZ',kyrgyzstan:'KG',tajikistan:'TJ',turkmenistan:'TM',russia:'RU'},
 'south-asia': {india:'IN',pakistan:'PK',bangladesh:'BD'},
};
// South Asia has country pages, but no published regional overview route.
const regions = ['latin-america','west-africa','middle-east','central-asia'];
const labels: Record<string, string[]> = {
 en:['Continue planning your shipment','Related destinations','Regional overviews','Freight services','Latin America','West Africa','Middle East','Central Asia','Sea freight from China','LCL shipping from China','Back to the regional overview'],
 zh:['继续规划您的货运线路','同地区国家线路','地区货运总览','货运服务','拉丁美洲','西非','中东','中亚','中国出发海运','中国出发拼箱','返回地区总览'],
 es:['Continúe planificando su envío','Destinos relacionados','Guías regionales','Servicios de transporte','América Latina','África Occidental','Oriente Medio','Asia Central','Transporte marítimo desde China','Envíos LCL desde China','Volver a la guía regional'],
 pt:['Continue a planear o seu envio','Destinos relacionados','Guias regionais','Serviços de transporte','América Latina','África Ocidental','Médio Oriente','Ásia Central','Transporte marítimo da China','Envios LCL da China','Voltar ao guia regional'],
 fr:['Poursuivez la préparation de votre expédition','Destinations associées','Guides régionaux','Services de transport','Amérique latine','Afrique de l’Ouest','Moyen-Orient','Asie centrale','Fret maritime depuis la Chine','Groupage maritime depuis la Chine','Retour au guide régional'],
 ru:['Продолжите планирование перевозки','Другие направления региона','Обзоры регионов','Грузоперевозки','Латинская Америка','Западная Африка','Ближний Восток','Центральная Азия','Морские перевозки из Китая','Сборные морские грузы из Китая','Вернуться к обзору региона'],
 ar:['تابع التخطيط لشحنتك','وجهات ذات صلة','أدلة المناطق','خدمات الشحن','أمريكا اللاتينية','غرب أفريقيا','الشرق الأوسط','آسيا الوسطى','الشحن البحري من الصين','شحن الحاويات الجزئي من الصين','العودة إلى دليل المنطقة'],
 tr:['Sevkiyatınızı planlamaya devam edin','İlgili varış noktaları','Bölgesel rehberler','Nakliye hizmetleri','Latin Amerika','Batı Afrika','Orta Doğu','Orta Asya','Çin’den deniz taşımacılığı','Çin’den parsiyel deniz taşımacılığı','Bölgesel rehbere dön'],
};

export default function FreightRelatedLinks({country,region,locale}: {country?:string;region?:string;locale:string}) {
 const lang = locale==='zh-cn'?'zh':locale;
 const c = labels[lang] || labels.en;
 const prefix = freightPrefix(lang as Parameters<typeof freightPrefix>[0]);
 const parent = country ? Object.keys(groups).find(key=>country in groups[key]) : region;
 if (!parent) return null;
 const names = new Intl.DisplayNames([lang==='zh'?'zh-CN':lang], {type:'region'});
 const href = (slug:string)=>`${prefix}/shipping-from-china-to-${slug}/`;
 return <section id="freight-related-routes" className="freight-related-links" lang={lang==='zh'?'zh-CN':lang} dir={lang==='ar'?'rtl':'ltr'} data-related-country={country} data-related-region={region} aria-labelledby="freight-related-heading">
  <div className="freight-related-inner"><p className="freight-related-kicker">DDNZ · FREIGHT</p><h2 id="freight-related-heading">{c[0]}</h2>
  {country && regions.includes(parent) && <a className="freight-related-parent" href={href(parent)}>{c[10]} · {c[4+regions.indexOf(parent)]} <span aria-hidden="true">↗</span></a>}
  <div className="freight-related-grid">
   {country && <nav aria-label={c[1]}><h3>{c[1]}</h3>{Object.entries(groups[parent]).filter(([slug])=>slug!==country).map(([slug,iso])=><a key={slug} href={href(slug)}>{names.of(iso)} <span aria-hidden="true">↗</span></a>)}</nav>}
   <nav aria-label={c[2]}><h3>{c[2]}</h3>{regions.filter(slug=>slug!==parent).map(slug=><a key={slug} href={href(slug)}>{c[4+regions.indexOf(slug)]} <span aria-hidden="true">↗</span></a>)}</nav>
   <nav aria-label={c[3]}><h3>{c[3]}</h3><a href={`${prefix}/services/sea-freight/`}>{c[8]} <span aria-hidden="true">↗</span></a><a href={`${prefix}/services/lcl-shipping-from-china/`}>{c[9]} <span aria-hidden="true">↗</span></a></nav>
  </div></div>
 </section>;
}
