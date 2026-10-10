import zh from '../locales/planning/zh-factory.json';
import fr from '../locales/planning/fr-factory.json';
import es from '../locales/planning/es-factory.json';
import pt from '../locales/planning/pt-factory.json';
import ru from '../locales/planning/ru-factory.json';
import tr from '../locales/planning/tr-factory.json';
import React from 'react';
const copy = { zh, fr, es, pt, ru, tr,
 en: {tag:'AT THE FACTORY · PRODUCTION FOLLOW-UP',title:'Discuss the details while the order is in production.',intro:'DDNZ team members join the factory manager on the production floor to review bulk production and discuss cabinet and assembly details. These clips show cabinet equipment; they are not an ice-machine performance test.',titles:['A walkthrough of cabinet production','A closer look at cabinet details'],captions:['The factory manager and DDNZ team review cabinet equipment on the production floor.','An on-site discussion around the cabinet interior, door and upper frame.'],note:'For your order, agree the inspection points, records and acceptance criteria for the selected models before production.',cta:'Plan product checks',open:'Open video'},
 ar: {tag:'داخل المصنع · متابعة الإنتاج',title:'ناقش التفاصيل أثناء تصنيع طلبك.',intro:'يرافق فريق DDNZ مديرة المصنع في جولة لمتابعة الإنتاج ومناقشة تفاصيل الخزائن والتجميع. تعرض هذه المقاطع معدات من نوع الخزائن، وليست اختبارًا لأداء صانعات الثلج.',titles:['جولة في منطقة إنتاج الخزائن','مناقشة تفاصيل الخزانة'],captions:['تراجع مديرة المصنع وفريق DDNZ معدات الخزائن داخل منطقة الإنتاج.','نقاش ميداني حول داخل الخزانة والباب والإطار العلوي.'],note:'لطلبك، اتفق مسبقًا على نقاط الفحص والسجلات ومعايير القبول الخاصة بالطرازات المختارة.',cta:'خطّط لفحص المنتجات',open:'فتح الفيديو'},
};
const clips = ['kitchen-production-walkthrough','cabinet-detail-discussion'];
export default function FactoryProductionEvidence({locale='en'}) {
 locale=locale==='zh-cn'?'zh':locale;
 const t=copy[locale]; if(!t)return null;
 return <section id="factory-production" className="factory-production section wrap" aria-labelledby="factory-production-title">
  <div className="factory-production-copy"><p className="eyebrow">{t.tag}</p><h2 id="factory-production-title">{t.title}</h2><p>{t.intro}</p><p>{t.note}</p><a className="text-link" href={`${locale==='en'?'':locale==='zh'?'/zh-cn':'/'+locale}/sourcing-services/inspection-quality-control/`}>{t.cta} <span aria-hidden="true">↗</span></a></div>
  <div className="factory-production-clips">{clips.map((clip,i)=><figure key={clip}><video controls playsInline preload="none" poster={`/media/factory/${clip}.webp`} width="540" height="960" aria-label={t.titles[i]}><source src={`/media/factory/${clip}.mp4`} type="video/mp4"/><a href={`/media/factory/${clip}.mp4`}>{t.open}</a></video><figcaption><strong>{t.titles[i]}</strong><p>{t.captions[i]}</p></figcaption></figure>)}</div>
 </section>;
}
