import React from 'react';

type Item = { src: string; label: string; href: string };
const copy: Record<string, [string, string]> = {
 en: ['Explore models & details', 'View model'], zh: ['查看型号与产品细节', '查看型号'],
 es: ['Explorar modelos y detalles', 'Ver modelo'], fr: ['Modèles et détails', 'Voir le modèle'],
 pt: ['Modelos e detalhes', 'Ver modelo'], ru: ['Модели и детали', 'Смотреть модель'],
 tr: ['Modeller ve ayrıntılar', 'Modeli inceleyin'], ar: ['استكشف الموديلات والتفاصيل', 'عرض الموديل']
};
export default function CatalogueHeroMedia({src, alt, items=[], language='en', scene=false, label, onNavigate}: {src:string; alt:string; items?:Item[]; language?:string; scene?:boolean; label?:string; onNavigate?:()=>void}) {
 const [heading, action] = copy[language==='zh-cn'?'zh':language] || copy.en;
 return <div className={'catalogue-hero-media'+(scene?' catalogue-hero-scene':'')}>
  <div className="catalogue-hero-stage"><img src={src} alt={alt} width="1200" height="900" fetchPriority="high"/>{label&&<span className="catalogue-hero-model"><bdi>{label}</bdi></span>}</div>
  {items.length>0&&<div className="catalogue-hero-rail"><p className="catalogue-hero-rail-title">{heading}<span aria-hidden="true">↘</span></p>
   <div className="catalogue-hero-tiles">{items.map(item=><a key={item.src+item.href+item.label} href={item.href} onClick={onNavigate} aria-label={`${action} · ${item.label}`}>
    <img src={item.src} alt="" width="240" height="160" loading="lazy"/>
    <span><bdi>{item.label}</bdi><span aria-hidden="true">↗</span></span>
   </a>)}</div>
  </div>}
 </div>;
}
export const heroRanges = {
 power: {src:'/images/portable-power-catalogue/h1-main.webp', label:'PP-H01', items:[['c1-main','PP-C01'],['bp120b-1','PP-H02'],['bp360h-1','PP-W01']].map(([image,label])=>({src:`/images/portable-power-catalogue/${image}.webp`,label,href:'#'+label.toLowerCase()}))},
 scooter: {src:'/images/electric-mobility/p1-hero.webp',label:'SC-A01',items:[['p1-hero','SC-A01'],['extra-a3-main','SC-A03'],['extra-a4-main','SC-A04']].map(([image,label])=>({src:`/images/electric-mobility/${image}.webp`,label,href:'#'+label.toLowerCase()}))},
 bicycle: {src:'/images/electric-bicycles/b1-hero.webp',label:'EB-L01',items:[['b1-hero','EB-L01'],['b3-hero','EB-T01'],['b4-hero','EB-F01']].map(([image,label])=>({src:`/images/electric-bicycles/${image}.webp`,label,href:'#'+label.toLowerCase()}))},
 tricycle: {src:'/images/electric-tricycles/wide-main.webp',label:'ET-F02',items:[['wide-main','ET-F02'],['cargo-main','ET-C01'],['box-main','ET-C02']].map(([image,label])=>({src:`/images/electric-tricycles/${image}.webp`,label,href:'#'+label.toLowerCase()}))},
 utility: {src:'/images/electric-utility-vehicles/delivery-main.webp',label:'FW-D01',items:[['delivery-main','FW-D01'],['comfort-main','FW-S01'],['bench-main','FW-S02']].map(([image,label])=>({src:`/images/electric-utility-vehicles/${image}.webp`,label,href:'#'+label.toLowerCase()}))}
};

export const kitchenHeroLabels = {"en": ["Ice machines", "Cooking equipment", "Juicers"], "zh": ["制冰机", "商用炉具", "商用榨汁机"], "es": ["Máquinas de hielo", "Equipos de cocción", "Exprimidores"], "fr": ["Machines à glaçons", "Matériel de cuisson", "Extracteurs de jus"], "pt": ["Máquinas de gelo", "Equipamentos de cocção", "Espremedores"], "ru": ["Льдогенераторы", "Тепловое оборудование", "Соковыжималки"], "tr": ["Buz makineleri", "Pişirme ekipmanları", "Meyve sıkacakları"], "ar": ["آلات صنع الثلج", "معدات الطهي", "العصارات"]};
