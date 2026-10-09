import { navigationPath } from '../lib/productLanguageRouting';
import { ArrowRight } from 'lucide-react';
import { companyCopy } from '../features/company-identity/copy';
import { aboutCopy } from '../features/company-identity/aboutCopy';
import './home-company-bridge.css';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';

type BridgeCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  sourcing: string;
  sourcingBody: string;
  freight: string;
  freightBody: string;
  handoff: string;
  steps: string[];
  proof: string;
  proofBody: string;
  sourcingCta: string;
  freightCta: string;
  serviceLabels: string[];
};


const COPY: Record<Language, BridgeCopy> = {
  en: { eyebrow: 'ONE TEAM · FROM SOURCE TO DESTINATION', title: 'Sourcing in China and freight execution, connected.', intro: 'DDNZ handles the commercial and supplier-side work. Heaven Born coordinates the international freight execution. You get one clear handoff from purchase brief to export delivery.', sourcing: 'DDNZ Global · sourcing & export coordination', sourcingBody: 'Supplier search, quotation alignment, inspection evidence, consolidation and export-ready documentation.', freight: 'Heaven Born · international freight execution', freightBody: 'FCL, LCL, dangerous goods and destination coordination with team experience dating back to 1997.', handoff: 'Six accountable handoffs', steps: ['Brief', 'Supplier match', 'QC evidence', 'Consolidate & load', 'HB freight execution', 'Destination handoff'], proof: 'The evidence travels with the cargo.', proofBody: 'A useful shipment record is not just a tracking number: it is the supplier decision, packing condition, loading plan and handoff evidence in one chain.', sourcingCta: 'Start a sourcing brief', freightCta: 'Explore freight services', serviceLabels: ['FCL', 'LCL', 'Dangerous goods', 'Air freight', 'FBA', 'Warehouse', 'Central Asia'] },
  zh: { eyebrow: '一站式方案 · 从采购源头到目的地', title: 'DDNZ 采购与 HB 货运，接成一条责任链。', intro: 'DDNZ 负责采购、供应商和出口前交接；华正邦泰负责国际货运执行。您只需提交一份需求，团队会把采购、验货、集货、装柜和运输衔接起来。', sourcing: 'DDNZ Global · 采购与出口协调', sourcingBody: '供应商搜索、报价口径、验货证据、集货以及出口资料准备。', freight: 'Heaven Born · 国际货运执行', freightBody: '整柜、拼箱、危险品与目的地衔接，团队货运从业经历始于 1997 年。', handoff: '六个责任交接点', steps: ['需求简报', '供应商确认', '验货与资料', '集货装柜', 'HB 国际运输', '目的地衔接'], proof: '让证据和货物一起走。', proofBody: '一票货不只有轨迹号，还应有供应商决策、包装状态、装柜方案和交接记录，形成一条可复核的链路。', sourcingCta: '提交采购需求', freightCta: '查看货运服务', serviceLabels: ['整柜 FCL', '拼箱 LCL', '危险品', '空运', 'FBA', '仓储', '中亚运输'] },
  ru: { eyebrow: 'ОДНА КОМАНДА · ОТ ИСТОЧНИКА ДО ПОЛУЧАТЕЛЯ', title: 'Закупки в Китае и перевозка — в одной цепочке.', intro: 'DDNZ ведёт поставщиков и экспортную подготовку. Heaven Born координирует международные перевозки; опыт команды ведёт отсчёт с 1997 года.', sourcing: 'DDNZ Global · закупки и экспортная координация', sourcingBody: 'Поиск поставщиков, сверка условий, инспекция, консолидация и документы.', freight: 'Heaven Born · международная перевозка', freightBody: 'FCL, LCL, опасные грузы и передача на месте назначения.', handoff: 'Шесть точек ответственности', steps: ['Заявка', 'Поставщик', 'Контроль качества', 'Консолидация', 'Перевозка HB', 'Передача'], proof: 'Доказательства идут вместе с грузом.', proofBody: 'Решения по поставщику, упаковка, план погрузки и передача формируют единую проверяемую запись.', sourcingCta: 'Оставить заявку', freightCta: 'Смотреть перевозки', serviceLabels: ['FCL', 'LCL', 'Опасные грузы', 'Авиаперевозка', 'FBA', 'Склад', 'Центральная Азия'] },
  fr: { eyebrow: 'UNE ÉQUIPE · DE LA SOURCE À LA DESTINATION', title: 'Sourcing en Chine et transport, enfin reliés.', intro: 'DDNZ coordonne fournisseurs et préparation export. Heaven Born coordonne le transport international, avec une expérience d’équipe remontant à 1997.', sourcing: 'DDNZ Global · sourcing et coordination export', sourcingBody: 'Recherche fournisseurs, alignement des offres, contrôle, consolidation et documents.', freight: 'Heaven Born · exécution du fret international', freightBody: 'FCL, LCL, marchandises dangereuses et relais à destination.', handoff: 'Six relais responsables', steps: ['Brief', 'Fournisseur', 'Contrôle qualité', 'Consolidation', 'Fret HB', 'Destination'], proof: 'Les preuves voyagent avec la marchandise.', proofBody: 'Choix fournisseur, état du colis, plan de chargement et remise restent dans une même chaîne.', sourcingCta: 'Démarrer un brief', freightCta: 'Voir les services fret', serviceLabels: ['FCL', 'LCL', 'Dangereux', 'Aérien', 'FBA', 'Entreposage', 'Asie centrale'] },
  es: { eyebrow: 'UN EQUIPO · DEL ORIGEN AL DESTINO', title: 'Compras en China y transporte, conectados.', intro: 'DDNZ coordina proveedores y preparación de exportación. Heaven Born coordina el transporte internacional; la experiencia del equipo se remonta a 1997.', sourcing: 'DDNZ Global · compras y coordinación de exportación', sourcingBody: 'Búsqueda de proveedores, cotización, inspección, consolidación y documentación.', freight: 'Heaven Born · ejecución del transporte internacional', freightBody: 'FCL, LCL, mercancías peligrosas y coordinación en destino.', handoff: 'Seis puntos de responsabilidad', steps: ['Solicitud', 'Proveedor', 'Control de calidad', 'Consolidación', 'Transporte HB', 'Destino'], proof: 'La evidencia viaja con la carga.', proofBody: 'La decisión de compra, el embalaje, la carga y la entrega forman una cadena verificable.', sourcingCta: 'Iniciar solicitud', freightCta: 'Ver servicios de transporte', serviceLabels: ['FCL', 'LCL', 'Peligrosas', 'Aéreo', 'FBA', 'Almacén', 'Asia Central'] },
  ar: { eyebrow: 'فريق واحد · من المصدر إلى الوجهة', title: 'التوريد من الصين والشحن الدولي في سلسلة واحدة.', intro: 'تنسق DDNZ الموردين وتجهيز التصدير، بينما تنسّق Heaven Born الشحن الدولي بخبرة فريق تعود إلى عام 1997.', sourcing: 'DDNZ Global · التوريد وتنسيق التصدير', sourcingBody: 'البحث عن الموردين، توحيد عروض الأسعار، الفحص، التجميع والوثائق.', freight: 'Heaven Born · تنفيذ الشحن الدولي', freightBody: 'حاويات كاملة، شحن جزئي، بضائع خطرة وتنسيق الوجهة.', handoff: 'ست نقاط مسؤولية', steps: ['الطلب', 'المورد', 'دليل الجودة', 'التجميع والتحميل', 'شحن HB', 'تسليم الوجهة'], proof: 'تسافر الأدلة مع الشحنة.', proofBody: 'قرار المورد وحالة التغليف وخطة التحميل والتسليم تشكل سلسلة واحدة قابلة للمراجعة.', sourcingCta: 'ابدأ طلب التوريد', freightCta: 'استكشف خدمات الشحن', serviceLabels: ['FCL', 'LCL', 'بضائع خطرة', 'شحن جوي', 'FBA', 'تخزين', 'آسيا الوسطى'] },
  pt: { eyebrow: 'UMA EQUIPE · DA ORIGEM AO DESTINO', title: 'Sourcing na China e frete, ligados.', intro: 'A DDNZ coordena fornecedores e a preparação para exportação. A Heaven Born coordena o frete internacional, com experiência da equipe desde 1997.', sourcing: 'DDNZ Global · sourcing e coordenação de exportação', sourcingBody: 'Busca de fornecedores, alinhamento de cotações, inspeção, consolidação e documentos.', freight: 'Heaven Born · execução do frete internacional', freightBody: 'FCL, LCL, cargas perigosas e coordenação no destino.', handoff: 'Seis pontos de responsabilidade', steps: ['Brief', 'Fornecedor', 'Evidência de qualidade', 'Consolidação', 'Frete HB', 'Destino'], proof: 'A evidência acompanha a carga.', proofBody: 'Fornecedor, embalagem, carregamento e entrega ficam registrados em uma única cadeia.', sourcingCta: 'Iniciar solicitação', freightCta: 'Ver serviços de frete', serviceLabels: ['FCL', 'LCL', 'Perigosos', 'Aéreo', 'FBA', 'Armazém', 'Ásia Central'] },
  tr: { eyebrow: 'TEK EKİP · KAYNAKTAN VARIŞA', title: 'Çin tedariki ve nakliye tek zincirde.', intro: 'DDNZ tedarikçileri ve ihracat hazırlığını koordine eder. Heaven Born, ekibinin 1997’ye uzanan deneyimiyle uluslararası taşımayı koordine eder.', sourcing: 'DDNZ Global · tedarik ve ihracat koordinasyonu', sourcingBody: 'Tedarikçi arama, teklif eşleştirme, denetim, konsolidasyon ve belgeler.', freight: 'Heaven Born · uluslararası nakliye yürütümü', freightBody: 'FCL, LCL, tehlikeli yükler ve varış koordinasyonu.', handoff: 'Altı sorumluluk noktası', steps: ['Talep', 'Tedarikçi', 'Kalite kanıtı', 'Konsolidasyon', 'HB nakliye', 'Varış'], proof: 'Kanıt yükle birlikte ilerler.', proofBody: 'Tedarikçi kararı, ambalaj, yükleme planı ve teslim tek bir doğrulanabilir zincirdedir.', sourcingCta: 'Tedarik talebi oluştur', freightCta: 'Nakliye hizmetlerini incele', serviceLabels: ['FCL', 'LCL', 'Tehlikeli yük', 'Hava kargo', 'FBA', 'Depolama', 'Orta Asya'] },
};


const compactCopy: Record<Language, {title: string; steps: string[]; process: string}> = {
 en: {title:'Two specialist teams. Connected from sourcing to shipping.',steps:['Confirm the purchase','Inspect & consolidate','International freight'],process:'See how we work'},
 zh: {title:'两个专业团队，衔接采购与国际运输。',steps:['采购确认','验货与集货','国际运输'],process:'查看服务流程'},
 ar: {title:'فريقان متخصصان يربطان التوريد بالشحن الدولي.',steps:['تأكيد الشراء','الفحص وتجميع البضائع','الشحن الدولي'],process:'تعرّف على خطوات العمل'},
 ru: {title:'Две профильные команды — от закупки до международной перевозки.',steps:['Согласование закупки','Проверка и консолидация','Международная перевозка'],process:'Как мы работаем'},
 fr: {title:'Deux équipes spécialisées, des achats au transport international.',steps:['Confirmer les achats','Contrôler et consolider','Transport international'],process:'Notre méthode de travail'},
 es: {title:'Dos equipos especializados, de las compras al transporte internacional.',steps:['Confirmar la compra','Inspeccionar y consolidar','Transporte internacional'],process:'Cómo trabajamos'},
 pt: {title:'Duas equipes especializadas, da compra ao transporte internacional.',steps:['Confirmar a compra','Inspecionar e consolidar','Transporte internacional'],process:'Como trabalhamos'},
 tr: {title:'Tedarikten uluslararası taşımaya, iki uzman ekip.',steps:['Satın alma onayı','Denetim ve konsolidasyon','Uluslararası taşıma'],process:'Nasıl çalışıyoruz'},
};
export default function HomeOneTeamBridge() {
 const {language} = useLanguage();
 const copy = COPY[language], compact = compactCopy[language];
 const dateFormat = new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : language, {year:'numeric',month:'long',timeZone:'UTC'});
 const brands = [
  {name:'DDNZ Global',logo:'/images/brand/ddnz-global-mark-v1.png',date:'2008-09',body:copy.sourcingBody},
  {name:'HB · Heaven Born',logo:'/images/brand/heaven-born-wing-logo-v1.png',date:'2005-09',body:copy.freightBody},
 ];
 return <section id="one-team" className="home-company-bridge" aria-labelledby="one-team-title" dir={language === 'ar' ? 'rtl' : 'ltr'}>
  <div className="home-company-inner">
   <header className="home-company-heading"><div><p className="home-company-eyebrow">DDNZ GLOBAL × HEAVEN BORN</p><h2 id="one-team-title">{compact.title}</h2><p>{language === 'zh' ? 'DDNZ 协调中国采购与出口准备，HB 承接国际货运，让产品要求、验货记录和出运安排顺畅衔接。' : copy.intro}</p></div>
    <figure className="home-company-photo"><img src="/images/company/office/entrance-1600.webp" srcSet="/images/company/office/entrance-800.webp 800w, /images/company/office/entrance-1600.webp 1600w" sizes="(max-width: 700px) 90vw, 32vw" alt="DDNZ Global · Heaven Born" width="1600" height="877" loading="lazy" decoding="async"/></figure>
   </header>
   <div id="company-identity" className="home-company-brands">{brands.map(brand=><article key={brand.name}><div className="home-company-brand"><img src={brand.logo} alt="" width="56" height="48" loading="lazy"/><div><h3>{brand.name}</h3><p>{companyCopy[language].registered} · <time dateTime={brand.date}>{dateFormat.format(new Date(brand.date+'-01T00:00:00Z'))}</time></p></div></div><p>{brand.body}</p></article>)}</div>
   <div className="home-company-process"><ol>{compact.steps.map((step,index)=><li key={step}><span aria-hidden="true">0{index+1}</span>{step}</li>)}</ol><Link to={navigationPath('/how-we-work/',language)}>{compact.process}<ArrowRight aria-hidden="true"/></Link></div>
   <div className="home-company-actions"><Link className="home-company-primary" to={navigationPath('/get-a-quote/',language)}>{copy.sourcingCta}<ArrowRight aria-hidden="true"/></Link><Link to={navigationPath('/services/sea-freight/',language)}>{copy.freightCta}<ArrowRight aria-hidden="true"/></Link><Link to={navigationPath('/about/',language)}>{aboutCopy[language].nav}<ArrowRight aria-hidden="true"/></Link></div>
  </div>
 </section>;
}
