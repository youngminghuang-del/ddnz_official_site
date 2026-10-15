import {useId} from 'react';
import type {GulfLocale} from './gulfLocale';
import type {UsedGoodsCountry} from './UsedGoodsContent';
import mapData from './usedGoodsPortMaps.json';
const translations={
 en:{title:'Ports for destination planning',note:'Major ports for reference. Confirm the actual receiving port before booking.',map:'Open port on Google Maps',official:'Port authority',source:'Map source'},
 zh:{title:'目的港规划参考',note:'主要港口位置参考，实际接货港口在订舱前确认。',map:'在 Google 地图查看港口',official:'港口官方资料',source:'地图来源'},
 es:{title:'Puertos para planificar el destino',note:'Puertos principales de referencia. Confirme el puerto de recepción antes de reservar.',map:'Ver puerto en Google Maps',official:'Autoridad portuaria',source:'Fuente del mapa'},
 fr:{title:'Ports pour préparer la destination',note:'Principaux ports à titre de référence. Confirmez le port de réception avant réservation.',map:'Voir le port sur Google Maps',official:'Autorité portuaire',source:'Source de la carte'},
 pt:{title:'Portos para planejar o destino',note:'Principais portos de referência. Confirme o porto de recebimento antes da reserva.',map:'Ver porto no Google Maps',official:'Autoridade portuária',source:'Fonte do mapa'},
 tr:{title:'Varış planlaması için limanlar',note:'Başlıca limanlar referans olarak gösterilir. Gerçek varış limanını rezervasyondan önce doğrulayın.',map:'Limanı Google Maps’te açın',official:'Liman idaresi',source:'Harita kaynağı'},
 ru:{title:'Порты для планирования доставки',note:'Основные порты для справки. Подтвердите фактический порт приёма до бронирования.',map:'Открыть порт в Google Maps',official:'Портовая администрация',source:'Источник карты'},
 ar:{title:'موانئ لتخطيط الوجهة',note:'الموانئ الرئيسية مرجع للتخطيط. أكد ميناء الاستلام الفعلي قبل الحجز.',map:'عرض الميناء على خرائط Google',official:'هيئة الميناء',source:'مصدر الخريطة'},
};
export default function UsedGoodsPortMap({country,locale}:{country:UsedGoodsCountry;locale:GulfLocale}){
 const id=useId(),d=mapData[country],t=translations[locale];
 return <section className="used-port-map" data-destination-map aria-labelledby={`${id}-heading`}>
 <header><h3 id={`${id}-heading`}>{t.title}</h3><p>{t.note}</p></header>
 <figure><svg viewBox="0 0 640 440" role="img" aria-labelledby={`${id}-title ${id}-desc`} direction="ltr"><title id={`${id}-title`}>{t.title}</title><desc id={`${id}-desc`}>{d.ports.map(p=>p.name).join(' · ')}. {t.note}</desc><defs><clipPath id={`${id}-clip`}><rect width="640" height="440" rx="14"/></clipPath></defs><g clipPath={`url(#${id}-clip)`}><rect width="640" height="440" fill="#eaf2f6"/>{d.paths.map(p=><path key={p.id} d={p.d} fill={p.active?'#e8d9f0':'#d7e1e5'} stroke={p.active?'#9d76b4':'#fff'} strokeWidth={p.active?1.5:1}/>)}{d.ports.map((p,i)=><g key={p.name}><path d={`M${p.x},${p.y} L${p.labelX},${p.labelY}`} stroke="#723a91" strokeWidth="1.5" fill="none"/><circle cx={p.x} cy={p.y} r="5" fill="#b94024" stroke="#fff" strokeWidth="2"/><rect x={p.labelX-14} y={p.labelY-18} width={p.labelWidth} height="36" rx="18" fill="#fff" stroke="#b79dc9"/><circle cx={p.labelX+4} cy={p.labelY} r="12" fill="#71319d"/><text x={p.labelX+4} y={p.labelY+5} textAnchor="middle" fill="white" fontSize="15" fontWeight="700">{i+1}</text><text x={p.labelX+24} y={p.labelY+6} fill="#17324b" fontSize="17" fontWeight="600">{p.name}</text></g>)}</g></svg><figcaption><a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">{t.source}: Natural Earth ↗</a></figcaption></figure>
 <div className="used-port-cards">{d.ports.map((p,i)=><article key={p.name}><h4><span aria-hidden="true">{i+1}</span><bdi>{p.name}</bdi></h4><div><a href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`} target="_blank" rel="noreferrer">{t.map} ↗</a><a href={p.url} target="_blank" rel="noreferrer">{t.official} ↗</a></div></article>)}</div>
 </section>;
}
