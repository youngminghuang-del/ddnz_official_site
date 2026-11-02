import {threeMarketExtra} from './threeMarketExtra';
import type {EcuadorLocale} from './ecuadorCopy';
const base={zh:{title:'两家工厂设备集货至厄瓜多尔',intro:'先核对逐厂装箱、出口主体与原产地资料，再评估港口及交付方案。',link:'查看厄瓜多尔准备指南'},en:{title:'Two-factory equipment orders for Ecuador',intro:'Reconcile packing, exporter and origin records before assessing the port and delivery plan.',link:'View Ecuador preparation guide'},es:{title:'Equipos de dos fábricas para Ecuador',intro:'Revise embalajes, exportador y origen antes de evaluar puerto y entrega.',link:'Ver la guía de preparación para Ecuador'}};
export default function EcuadorRegionEntry({locale,prefix}:{locale:string;prefix:string}){
 const c=locale in base?base[locale as keyof typeof base]:threeMarketExtra[locale as keyof typeof threeMarketExtra]?.region;
 if(!c)return null;
 return <section className="freight-wrap freight-section" dir={locale==='ar'?'rtl':'ltr'} data-ecuador-region-entry><h2>{c.title}</h2><p>{c.intro}</p><a href={`${prefix}/shipping-from-china-to-ecuador/`} className="freight-cta">{c.link} <span aria-hidden="true">{locale==='ar'?'↖':'↗'}</span></a></section>;
}
