import RoutePlanningDepth from './RoutePlanningDepth';
import {useId, useState} from 'react';
import {FreightChapters} from './GulfChapters';
import {gulfLanguageNames,gulfLanguagePrefix,gulfLanguageTag,type GulfLocale} from './gulfLocale';
import copy from './usedGoodsCopy.json';
import UsedGoodsPortMap from './UsedGoodsPortMap';
import {buildQuoteHref} from '../../lib/quoteLinks';

export type UsedGoodsCountry='ghana'|'india'|'bangladesh'|'pakistan';
export const usedGoodsCountries:UsedGoodsCountry[]=['ghana','india','bangladesh','pakistan'];
const names={ghana:'Ghana',india:'India',bangladesh:'Bangladesh',pakistan:'Pakistan'};
const root='/media/used-goods-20261015/';
const media={
 ghana:{video:'sorting',hero:'loading-1.jpg',heroLabel:'loading',photos:[{file:'loading-5.jpg',label:'loading'},{file:'sorting-clear.jpg',label:'sorting'}],label:'sorting'},
 india:{video:'packing',hero:'packing-clear.jpg',heroLabel:'packingVideo',photos:[{file:'loading-4.jpg',label:'loading'},{file:'packing-clear.jpg',label:'packingVideo'}],label:'packingVideo'},
 bangladesh:{video:'cargo',hero:'warehouse-clear.jpg',heroLabel:'cargoVideo',photos:[{file:'warehouse-clear.jpg',label:'cargoVideo'},{file:'cargo-clear.jpg',label:'cargoVideo'}],label:'cargoVideo'},
 pakistan:{video:'handling',hero:'loading-2.jpg',heroLabel:'loading',photos:[{file:'loading-2.jpg',label:'loading'},{file:'handling-clear.jpg',label:'handling'}],label:'handling'}
} as const;
export type UsedGoodsResource={name:string;href:string;logo?:string};
export const usedGoodsResources:Record<UsedGoodsCountry,UsedGoodsResource[]>={
 ghana:[{name:'Ghana Standards Authority',href:'https://gsa.gov.gh/import-inspection/',logo:root+'official/gsa.png'},{name:'Ghana Revenue Authority',href:'https://gra.gov.gh/customs/'}],
 india:[{name:'Indian Customs',href:'https://gujaratcustoms.gov.in/',logo:root+'official/india-customs.png'},{name:'Directorate General of Foreign Trade',href:'https://www.dgft.gov.in/CP/'}],
 bangladesh:[{name:'National Board of Revenue',href:'https://nbr.gov.bd/',logo:root+'official/bangladesh-nbr.jpeg'},{name:'CCIE',href:'https://cumilla.ccie.gov.bd/pages/notices'}],
 pakistan:[{name:'Federal Board of Revenue',href:'https://www.fbr.gov.pk/',logo:root+'official/pakistan-fbr.png'},{name:'Ministry of Commerce',href:'https://www.commerce.gov.pk/policies/'},{name:'Trade Information Portal of Pakistan',href:'https://tipp.gov.pk/'}],
};
const importNotes:Record<GulfLocale,string[]>={
 en:['Exclude prohibited used items and confirm GSA inspection and importer requirements before loading.','Confirm the applicable DGFT classification and import authorisation before booking worn clothing.','Confirm the current CCIE notice, eligible importer, permitted product categories and shipment window before loading.','Confirm PCT classification, current import policy and customs valuation with the importer before booking.'],
 zh:['排除禁止进口的二手品类，并在装载前确认GSA查验及进口方要求。','二手服装订舱前，确认适用的DGFT商品归类及进口授权。','装载前确认当前CCIE通知、合资格进口方、允许的产品类别及出运时间窗口。','订舱前与进口方确认PCT商品归类、当前进口政策及海关估价要求。'],
 es:['Excluya artículos usados prohibidos y confirme los requisitos de inspección de GSA y los requisitos del importador antes de cargar.','Confirme la clasificación aplicable según la DGFT y la autorización de importación antes de reservar el transporte de ropa usada.','Antes de cargar, consulte el aviso CCIE vigente y confirme la habilitación del importador, las categorías permitidas y el periodo autorizado de embarque.','Confirme con el importador la clasificación PCT, la política de importación vigente y los requisitos de valoración aduanera antes de reservar.'],
 fr:['Excluez les articles usagés interdits et confirmez les exigences de contrôle GSA et de l’importateur avant chargement.','Confirmez le classement applicable selon la DGFT et l’autorisation d’importation avant de réserver le transport de vêtements usagés.','Avant le chargement, consultez l’avis CCIE en vigueur et confirmez l’admissibilité de l’importateur, les catégories autorisées et la période d’expédition permise.','Confirmez avec l’importateur le classement PCT, la politique d’importation en vigueur et les exigences d’évaluation en douane avant réservation.'],
 pt:['Exclua artigos usados proibidos e confirme os requisitos de inspeção da GSA e os requisitos do importador antes de carregar.','Confirme a classificação aplicável segundo a DGFT e a autorização de importação antes de reservar o transporte de roupas usadas.','Antes do carregamento, consulte o aviso CCIE vigente e confirme a habilitação do importador, as categorias permitidas e o período autorizado para embarque.','Confirme com o importador a classificação PCT, a política de importação vigente e os requisitos de valoração aduaneira antes da reserva.'],
 tr:['İthalatı yasak ikinci el ürünleri yükten çıkarın; yükleme öncesinde GSA denetim şartlarını ve ithalatçıya ilişkin gereklilikleri doğrulayın.','Kullanılmış giysiler için taşıma rezervasyonu yapmadan önce geçerli DGFT sınıflandırmasını ve ithalat iznini doğrulayın.','Yüklemeden önce güncel CCIE duyurusunu, ithalatçının uygunluğunu, izin verilen ürün kategorilerini ve sevkiyat süresini doğrulayın.','Taşıma rezervasyonundan önce ithalatçıyla PCT sınıflandırmasını, güncel ithalat politikasını ve gümrük kıymetinin belirlenmesine ilişkin gereklilikleri doğrulayın.'],
 ru:['Исключите товары, запрещённые к ввозу в подержанном состоянии, и до загрузки уточните требования GSA к проверке груза и требования к импортёру.','До бронирования перевозки бывшей в употреблении одежды уточните применимую классификацию DGFT и необходимое разрешение на импорт.','До загрузки проверьте действующее уведомление CCIE, право импортёра на ввоз, разрешённые категории товаров и сроки отгрузки.','До бронирования перевозки согласуйте с импортёром классификацию PCT и уточните действующие правила импорта и требования к определению таможенной стоимости.'],
 ar:['استبعد السلع التي يُحظر استيرادها مستعملة، وتحقق من متطلبات فحص GSA والمتطلبات الخاصة بالمستورد قبل التحميل.','تحقق من تصنيف DGFT وترخيص الاستيراد المطبقين قبل حجز شحنة الملابس المستعملة.','تحقق من إشعار CCIE الساري وأهلية المستورد وفئات المنتجات المسموح بها والمهلة المحددة للشحن قبل التحميل.','تحقق مع المستورد من تصنيف PCT وسياسة الاستيراد السارية ومتطلبات تحديد القيمة الجمركية قبل حجز الشحنة.'],
};
const destinationForms:Partial<Record<GulfLocale,string[]>>={
 fr:['le Ghana','l’Inde','le Bangladesh','le Pakistan'],
 pt:['Gana','a Índia','Bangladesh','o Paquistão'],
 es:['Ghana','la India','Bangladés','Pakistán'],
 ru:['Гану','Индию','Бангладеш','Пакистан'],
};
function destinationName(country:UsedGoodsCountry,locale:GulfLocale){const i=usedGoodsCountries.indexOf(country);return destinationForms[locale]?.[i]??copy[locale].countries[i];}
export function usedGoodsMetadata(country:UsedGoodsCountry,locale:GulfLocale='en'){
 const d=copy[locale],i=usedGoodsCountries.indexOf(country),heading=d.heading.replace('{country}',destinationName(country,locale));
 return {title:`${heading} | DDNZ Global`,description:d.intro,heading};
}
function GoodsGallery({country,locale}:{country:UsedGoodsCountry;locale:GulfLocale}){
 const d=copy[locale],m=media[country],id=useId(),[index,setIndex]=useState(0);
 const files=m.photos,photo=files[index];
 const src=root+photo.file;
 return <div className="used-gallery market-gallery"><figure id={id}><img src={src} alt={`${d.ui[photo.label]} · ${index+1}`} loading="lazy"/><figcaption><b>{d.ui[photo.label]}</b><p>{d.ui.photoNote}</p><a href={src} target="_blank" rel="noreferrer">{d.ui.full} ↗</a></figcaption></figure>
 <div className="used-gallery-controls market-gallery-controls" role="group" aria-label={d.ui.choose}>{files.map((item,i)=><button key={item.file} type="button" aria-controls={id} aria-pressed={index===i} onClick={()=>setIndex(i)}><img src={root+item.file.replace('.jpg','-thumb.jpg')} alt="" loading="lazy"/><span>{d.ui[item.label]} {i+1}</span></button>)}</div></div>;
}
export default function UsedGoodsContent({country,locale='en',resources=usedGoodsResources[country]}:{country:UsedGoodsCountry;locale?:GulfLocale;resources?:UsedGoodsResource[]}){
 const d=copy[locale],u=d.ui,i=usedGoodsCountries.indexOf(country),m=media[country],meta=usedGoodsMetadata(country,locale);
 const quote=buildQuoteHref({language:locale,intent:'Freight Export',source:'country_cargo_planning',destination:names[country]});
 const stages=[u.sorting,u.packingVideo,u.cargoVideo,u.loading];
 return <main id="main-content" className="freight-editorial used-goods" lang={gulfLanguageTag(locale)} dir={locale==='ar'?'rtl':'ltr'} data-country-cargo-planning="true">
 <div className="used-wrap"><header className="used-hero"><div className="used-hero-copy"><p className="used-kicker">{u.china} → <bdi>{d.countries[i]}</bdi></p><h1>{meta.heading}</h1><p>{d.intro}</p><a className="used-cta" href={quote}>{u.request} ↗</a></div><figure className="used-hero-image"><img src={root+m.hero} alt={u[m.heroLabel]} fetchPriority="high"/><figcaption><span>{u.record}</span><strong>{u[m.heroLabel]}</strong></figcaption></figure></header>
 {['bangladesh','ghana'].includes(country) && <RoutePlanningDepth country={country} locale={locale}/>}
 <FreightChapters items={d.chapters.map((label,n)=>({label,id:`used-section-${n+1}`}))} ariaLabel={u.chapters} reading={`${u.reading} · `}/>
 <ol className="used-journey" aria-label={u.prepare}>{stages.map((s,n)=><li key={s}><bdi>0{n+1}</bdi><span>{s}</span></li>)}</ol>
 <section id="used-section-1" className="used-section used-preparation" tabIndex={-1} aria-labelledby="used-heading-1"><div className="used-preparation-copy"><span className="used-kicker">01 / {u.record}</span><h2 id="used-heading-1">{d.chapters[0]}</h2><p className="used-lead">{d.focus[i]}</p><p>{d.paras[0]}</p><h3>{u.categories}</h3><p>{d.paras[1]}</p></div>
 <figure className="used-video market-gallery"><video controls playsInline preload="none" poster={`${root}${m.video}-poster.jpg`} aria-label={u[m.label]}><source src={`${root}${m.video}.mp4`} type="video/mp4"/><track kind="captions" src={`${root}${m.video}.${locale}.vtt`} srcLang={gulfLanguageTag(locale)} label={gulfLanguageNames[locale]} default/></video><figcaption><strong>{u[m.label]}</strong><p>{u.silent} {u.photoNote}</p></figcaption></figure>
 </section>
 <section id="used-section-2" className="used-section" tabIndex={-1} aria-labelledby="used-heading-2"><span className="used-kicker">02 / {u.packing}</span><h2 id="used-heading-2">{d.chapters[1]}</h2><p>{d.paras[2]}</p><dl className="used-stats">{[[u.gross,'80 kg'],[u.container,'45HC'],[u.total,'28 MT'],[u.bales,'352']].map(([label,value])=><div key={label}><dt>{label}</dt><dd><bdi>{value}</bdi></dd></div>)}</dl><p className="used-note">{d.notes[0]} {d.notes[1]}</p><GoodsGallery country={country} locale={locale}/></section>
 <section id="used-section-3" className="used-section" tabIndex={-1} aria-labelledby="used-heading-3"><span className="used-kicker">03 / {u.destination}</span><h2 id="used-heading-3">{d.chapters[2]}</h2><div className="used-import-note"><h3>{u.docs}</h3><p>{importNotes[locale][i]}</p></div><p>{d.paras[3]}</p>
 <div className="used-official" data-customs-resources><h3>{u.official}</h3><div className="used-resource-grid">{resources.map(r=><article key={r.href}>{r.logo&&<img src={r.logo} alt={r.name} loading="lazy"/>}<h4><bdi>{r.name}</bdi></h4><a href={r.href} target="_blank" rel="noreferrer">{u.guidance} ↗</a></article>)}</div><p className="used-note">{d.notes[2]}</p></div>
 <UsedGoodsPortMap country={country} locale={locale}/></section>
 <section id="used-section-4" className="used-section" tabIndex={-1} aria-labelledby="used-heading-4"><span className="used-kicker">04 / {u.prepare}</span><h2 id="used-heading-4">{d.chapters[3]}</h2><p>{d.paras[4]}</p><h3>{u.faq}</h3><div className="used-faq">{d.questions.map((q,n)=><details key={q}><summary>{q}</summary><p>{d.answers[n]}</p></details>)}</div><a className="used-cta" href={quote}>{u.request} ↗</a></section>
 <nav className="used-related" aria-label={u.related}><h2>{u.related}</h2><div>{usedGoodsCountries.filter(c=>c!==country).map(c=><a key={c} href={`${gulfLanguagePrefix(locale)}/shipping-from-china-to-${c}/`}>{d.heading.replace('{country}',destinationName(c,locale))} →</a>)}</div></nav>
 </div></main>;
}
