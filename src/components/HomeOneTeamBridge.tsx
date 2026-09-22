import { ArrowRight, CheckCircle2, Container, PackageCheck, ShieldCheck } from 'lucide-react';
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

const PREFIX: Record<Language, string> = { en: '', zh: '/zh-cn', ru: '/ru', fr: '/fr', es: '/es', ar: '/ar', pt: '/pt', tr: '/tr' };

const COPY: Record<Language, BridgeCopy> = {
  en: { eyebrow: 'ONE TEAM · FROM SOURCE TO DESTINATION', title: 'Sourcing in China and freight execution, connected.', intro: 'DDNZ handles the commercial and supplier-side work. Heaven Born coordinates the international freight execution. You get one clear handoff from purchase brief to export delivery.', sourcing: 'DDNZ Global · sourcing & export coordination', sourcingBody: 'Supplier search, quotation alignment, inspection evidence, consolidation and export-ready documentation.', freight: 'Heaven Born · international freight execution', freightBody: 'FCL, LCL, dangerous goods and destination coordination with an operating history since 1997.', handoff: 'Six accountable handoffs', steps: ['Brief', 'Supplier match', 'QC evidence', 'Consolidate & load', 'HB freight execution', 'Destination handoff'], proof: 'The evidence travels with the cargo.', proofBody: 'A useful shipment record is not just a tracking number: it is the supplier decision, packing condition, loading plan and handoff evidence in one chain.', sourcingCta: 'Start a sourcing brief', freightCta: 'Explore freight services', serviceLabels: ['FCL', 'LCL', 'Dangerous goods', 'Air freight', 'FBA', 'Warehouse', 'Central Asia'] },
  zh: { eyebrow: '一站式方案 · 从采购源头到目的地', title: 'DDNZ 采购与 HB 货运，接成一条责任链。', intro: 'DDNZ 负责采购、供应商和出口前交接；华正邦泰负责国际货运执行。您只需提交一份需求，团队会把采购、验货、集货、装柜和运输衔接起来。', sourcing: 'DDNZ Global · 采购与出口协调', sourcingBody: '供应商搜索、报价口径、验货证据、集货以及出口资料准备。', freight: 'Heaven Born · 国际货运执行', freightBody: '整柜、拼箱、危险品与目的地衔接，国际货运执行始于 1997 年。', handoff: '六个责任交接点', steps: ['需求简报', '供应商确认', '验货与资料', '集货装柜', 'HB 国际运输', '目的地衔接'], proof: '让证据和货物一起走。', proofBody: '一票货不只有轨迹号，还应有供应商决策、包装状态、装柜方案和交接记录，形成一条可复核的链路。', sourcingCta: '提交采购需求', freightCta: '查看货运服务', serviceLabels: ['整柜 FCL', '拼箱 LCL', '危险品', '空运', 'FBA', '仓储', '中亚运输'] },
  ru: { eyebrow: 'ОДНА КОМАНДА · ОТ ИСТОЧНИКА ДО ПОЛУЧАТЕЛЯ', title: 'Закупки в Китае и перевозка — в одной цепочке.', intro: 'DDNZ ведёт поставщиков и экспортную подготовку. Heaven Born координирует международное выполнение перевозки с 1997 года.', sourcing: 'DDNZ Global · закупки и экспортная координация', sourcingBody: 'Поиск поставщиков, сверка условий, инспекция, консолидация и документы.', freight: 'Heaven Born · международная перевозка', freightBody: 'FCL, LCL, опасные грузы и передача на месте назначения.', handoff: 'Шесть точек ответственности', steps: ['Заявка', 'Поставщик', 'Контроль качества', 'Консолидация', 'Перевозка HB', 'Передача'], proof: 'Доказательства идут вместе с грузом.', proofBody: 'Решения по поставщику, упаковка, план погрузки и передача формируют единую проверяемую запись.', sourcingCta: 'Оставить заявку', freightCta: 'Смотреть перевозки', serviceLabels: ['FCL', 'LCL', 'Опасные грузы', 'Авиаперевозка', 'FBA', 'Склад', 'Центральная Азия'] },
  fr: { eyebrow: 'UNE ÉQUIPE · DE LA SOURCE À LA DESTINATION', title: 'Sourcing en Chine et transport, enfin reliés.', intro: 'DDNZ coordonne fournisseurs et préparation export. Heaven Born exécute le transport international depuis 1997.', sourcing: 'DDNZ Global · sourcing et coordination export', sourcingBody: 'Recherche fournisseurs, alignement des offres, contrôle, consolidation et documents.', freight: 'Heaven Born · exécution du fret international', freightBody: 'FCL, LCL, marchandises dangereuses et relais à destination.', handoff: 'Six relais responsables', steps: ['Brief', 'Fournisseur', 'Contrôle qualité', 'Consolidation', 'Fret HB', 'Destination'], proof: 'Les preuves voyagent avec la marchandise.', proofBody: 'Choix fournisseur, état du colis, plan de chargement et remise restent dans une même chaîne.', sourcingCta: 'Démarrer un brief', freightCta: 'Voir les services fret', serviceLabels: ['FCL', 'LCL', 'Dangereux', 'Aérien', 'FBA', 'Entreposage', 'Asie centrale'] },
  es: { eyebrow: 'UN EQUIPO · DEL ORIGEN AL DESTINO', title: 'Compras en China y transporte, conectados.', intro: 'DDNZ coordina proveedores y preparación de exportación. Heaven Born ejecuta el transporte internacional desde 1997.', sourcing: 'DDNZ Global · compras y coordinación de exportación', sourcingBody: 'Búsqueda de proveedores, cotización, inspección, consolidación y documentación.', freight: 'Heaven Born · ejecución del transporte internacional', freightBody: 'FCL, LCL, mercancías peligrosas y coordinación en destino.', handoff: 'Seis puntos de responsabilidad', steps: ['Solicitud', 'Proveedor', 'Control de calidad', 'Consolidación', 'Transporte HB', 'Destino'], proof: 'La evidencia viaja con la carga.', proofBody: 'La decisión de compra, el embalaje, la carga y la entrega forman una cadena verificable.', sourcingCta: 'Iniciar solicitud', freightCta: 'Ver servicios de transporte', serviceLabels: ['FCL', 'LCL', 'Peligrosas', 'Aéreo', 'FBA', 'Almacén', 'Asia Central'] },
  ar: { eyebrow: 'فريق واحد · من المصدر إلى الوجهة', title: 'التوريد من الصين والشحن الدولي في سلسلة واحدة.', intro: 'تنسق DDNZ الموردين وتجهيز التصدير، بينما تنفذ Heaven Born الشحن الدولي منذ عام 1997.', sourcing: 'DDNZ Global · التوريد وتنسيق التصدير', sourcingBody: 'البحث عن الموردين، توحيد عروض الأسعار، الفحص، التجميع والوثائق.', freight: 'Heaven Born · تنفيذ الشحن الدولي', freightBody: 'حاويات كاملة، شحن جزئي، بضائع خطرة وتنسيق الوجهة.', handoff: 'ست نقاط مسؤولية', steps: ['الطلب', 'المورد', 'دليل الجودة', 'التجميع والتحميل', 'شحن HB', 'تسليم الوجهة'], proof: 'تسافر الأدلة مع الشحنة.', proofBody: 'قرار المورد وحالة التغليف وخطة التحميل والتسليم تشكل سلسلة واحدة قابلة للمراجعة.', sourcingCta: 'ابدأ طلب التوريد', freightCta: 'استكشف خدمات الشحن', serviceLabels: ['FCL', 'LCL', 'بضائع خطرة', 'شحن جوي', 'FBA', 'تخزين', 'آسيا الوسطى'] },
  pt: { eyebrow: 'UMA EQUIPE · DA ORIGEM AO DESTINO', title: 'Sourcing na China e frete, ligados.', intro: 'A DDNZ coordena fornecedores e a preparação para exportação. A Heaven Born executa o frete internacional desde 1997.', sourcing: 'DDNZ Global · sourcing e coordenação de exportação', sourcingBody: 'Busca de fornecedores, alinhamento de cotações, inspeção, consolidação e documentos.', freight: 'Heaven Born · execução do frete internacional', freightBody: 'FCL, LCL, cargas perigosas e coordenação no destino.', handoff: 'Seis pontos de responsabilidade', steps: ['Brief', 'Fornecedor', 'Evidência de qualidade', 'Consolidação', 'Frete HB', 'Destino'], proof: 'A evidência acompanha a carga.', proofBody: 'Fornecedor, embalagem, carregamento e entrega ficam registrados em uma única cadeia.', sourcingCta: 'Iniciar solicitação', freightCta: 'Ver serviços de frete', serviceLabels: ['FCL', 'LCL', 'Perigosos', 'Aéreo', 'FBA', 'Armazém', 'Ásia Central'] },
  tr: { eyebrow: 'TEK EKİP · KAYNAKTAN VARIŞA', title: 'Çin tedariki ve nakliye tek zincirde.', intro: 'DDNZ tedarikçileri ve ihracat hazırlığını koordine eder. Heaven Born, 1997’den beri uluslararası taşımayı yürütür.', sourcing: 'DDNZ Global · tedarik ve ihracat koordinasyonu', sourcingBody: 'Tedarikçi arama, teklif eşleştirme, denetim, konsolidasyon ve belgeler.', freight: 'Heaven Born · uluslararası nakliye yürütümü', freightBody: 'FCL, LCL, tehlikeli yükler ve varış koordinasyonu.', handoff: 'Altı sorumluluk noktası', steps: ['Talep', 'Tedarikçi', 'Kalite kanıtı', 'Konsolidasyon', 'HB nakliye', 'Varış'], proof: 'Kanıt yükle birlikte ilerler.', proofBody: 'Tedarikçi kararı, ambalaj, yükleme planı ve teslim tek bir doğrulanabilir zincirdedir.', sourcingCta: 'Tedarik talebi oluştur', freightCta: 'Nakliye hizmetlerini incele', serviceLabels: ['FCL', 'LCL', 'Tehlikeli yük', 'Hava kargo', 'FBA', 'Depolama', 'Orta Asya'] },
};

export default function HomeOneTeamBridge() {
  const { language } = useLanguage();
  const copy = COPY[language];
  const prefix = PREFIX[language];
  return (
    <section id="one-team" className="home-one-team" aria-labelledby="one-team-title" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="home-one-team-inner">
        <div className="home-one-team-heading">
          <p className="home-one-team-eyebrow">{copy.eyebrow}</p>
          <h2 id="one-team-title">{copy.title}</h2>
          <p className="home-one-team-intro">{copy.intro}</p>
        </div>
        <div className="home-one-team-roles">
          <article className="home-one-team-role home-one-team-role--sourcing">
            <div className="home-one-team-role-icon"><PackageCheck aria-hidden="true" /></div>
            <p className="home-one-team-role-label">01 · DDNZ GLOBAL</p>
            <h3>{copy.sourcing}</h3>
            <p>{copy.sourcingBody}</p>
            <Link to={`${prefix}/sourcing-services/consolidation-export/`} className="home-one-team-link">{copy.sourcingCta}<ArrowRight aria-hidden="true" /></Link>
          </article>
          <article className="home-one-team-role home-one-team-role--freight">
            <div className="home-one-team-role-icon"><Container aria-hidden="true" /></div>
            <p className="home-one-team-role-label">02 · HEAVEN BORN</p>
            <h3>{copy.freight}</h3>
            <p>{copy.freightBody}</p>
            <Link to={`${prefix}/services/sea-freight/`} className="home-one-team-link">{copy.freightCta}<ArrowRight aria-hidden="true" /></Link>
          </article>
        </div>
        <div className="home-one-team-handoff">
          <div className="home-one-team-handoff-heading">
            <p className="home-one-team-eyebrow">{copy.handoff}</p>
            <div className="home-one-team-proof"><ShieldCheck aria-hidden="true" /><span>{copy.proof}</span><small>{copy.proofBody}</small></div>
          </div>
          <ol className="home-one-team-steps">
            {copy.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><CheckCircle2 aria-hidden="true" /><strong>{step}</strong></li>)}
          </ol>
        </div>
        <div className="home-one-team-services">
          {copy.serviceLabels.map((label, index) => {
            const links = [`${prefix}/services/sea-freight/`, `${prefix}/services/lcl-shipping-from-china/`, `${prefix}/services/dangerous-goods-shipping-from-china/`, `${prefix}/services/air-freight/`, `${prefix}/services/amazon-fba/`, `${prefix}/services/warehouse-services/`, `${prefix}/shipping-from-china-to-central-asia/`];
            return <Link key={label} to={links[index]}>{label}<ArrowRight aria-hidden="true" /></Link>;
          })}
        </div>
      </div>
    </section>
  );
}
