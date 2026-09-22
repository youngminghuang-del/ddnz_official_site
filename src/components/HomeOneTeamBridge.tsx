import { ArrowRight, Boxes, SearchCheck, ShieldCheck, Ship, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';

type BuyerPath = { title: string; body: string; cta: string };
type BridgeCopy = {
  title: string;
  intro: string;
  paths: [BuyerPath, BuyerPath, BuyerPath];
  responsibilityTitle: string;
  ddnzRole: string;
  freightRole: string;
  freightLinks: string;
  serviceLabels: string[];
};

const PREFIX: Record<Language, string> = { en: '', zh: '/zh-cn', ru: '/ru', fr: '/fr', es: '/es', ar: '/ar', pt: '/pt', tr: '/tr' };

const COPY: Record<Language, BridgeCopy> = {
  en: {
    title: 'Choose the China support you need.',
    intro: 'Start with sourcing, consolidate orders already placed, or move cargo that is ready to ship.',
    paths: [
      { title: 'Import from China', body: 'Supplier development, quotation alignment, inspection, procurement coordination and export preparation.', cta: 'Plan an import' },
      { title: 'Consolidate orders in China', body: 'Receive from multiple suppliers, check cargo, palletize, then prepare FCL or LCL loading.', cta: 'Plan consolidation' },
      { title: 'Ship from China', body: 'FCL, LCL, dangerous goods, air freight and destination coordination under a confirmed freight scope.', cta: 'Explore freight' },
    ],
    responsibilityTitle: 'Two responsible companies, one documented handoff',
    ddnzRole: 'DDNZ Global Trade Co., Ltd. coordinates sourcing, supplier follow-up, inspection records and export preparation.',
    freightRole: 'Heaven Born International Freight Co., Ltd. executes the international freight included in the confirmed scope.',
    freightLinks: 'Direct freight routes',
    serviceLabels: ['FCL', 'LCL', 'Dangerous goods', 'Air freight', 'FBA', 'Warehouse', 'Central Asia'],
  },
  zh: {
    title: '按您当前的进口任务进入。',
    intro: '可从采购开发开始，也可承接已下单货物的集货，或直接安排已备妥货物出运。',
    paths: [
      { title: '从中国进口', body: '供应商开发、报价统一、验货、采购协调与出口前准备。', cta: '规划进口采购' },
      { title: '在中国合并订单', body: '多供应商收货、货物核对、打托，并准备整柜或拼箱装载。', cta: '规划集货出口' },
      { title: '从中国发货', body: '按确认范围衔接整柜、拼箱、危险品、空运与目的地服务。', cta: '查看货运方案' },
    ],
    responsibilityTitle: '两个责任主体，一次有记录的交接',
    ddnzRole: '大递诺展国际贸易有限公司负责采购、供应商跟进、验货记录和出口前准备。',
    freightRole: '华正邦泰国际货运代理有限公司负责经确认服务范围内的国际货运执行。',
    freightLinks: '货运直达入口',
    serviceLabels: ['整柜 FCL', '拼箱 LCL', '危险品', '空运', 'FBA', '仓储', '中亚运输'],
  },
  ru: {
    title: 'Выберите нужный этап работы в Китае.',
    intro: 'Начните с закупки, объедините уже размещённые заказы или отправьте готовый груз.',
    paths: [
      { title: 'Импорт из Китая', body: 'Поиск и развитие поставщиков, сверка предложений, инспекция, координация закупки и подготовка к экспорту.', cta: 'Спланировать импорт' },
      { title: 'Консолидация заказов в Китае', body: 'Приём от нескольких поставщиков, проверка груза, паллетирование и подготовка FCL или LCL.', cta: 'Спланировать консолидацию' },
      { title: 'Отправка из Китая', body: 'FCL, LCL, опасные грузы, авиаперевозка и координация в пункте назначения.', cta: 'Смотреть перевозки' },
    ],
    responsibilityTitle: 'Две ответственные компании, одна документированная передача',
    ddnzRole: 'DDNZ Global Trade Co., Ltd. координирует закупки, поставщиков, записи инспекций и экспортную подготовку.',
    freightRole: 'Heaven Born International Freight Co., Ltd. выполняет международную перевозку в подтверждённом объёме.',
    freightLinks: 'Прямые маршруты',
    serviceLabels: ['FCL', 'LCL', 'Опасные грузы', 'Авиаперевозка', 'FBA', 'Склад', 'Центральная Азия'],
  },
  fr: {
    title: 'Choisissez le soutien dont vous avez besoin en Chine.',
    intro: 'Commencez par le sourcing, consolidez des commandes déjà placées ou expédiez une marchandise prête.',
    paths: [
      { title: 'Importer depuis la Chine', body: 'Développement fournisseurs, alignement des offres, inspection, coordination des achats et préparation export.', cta: 'Planifier un import' },
      { title: 'Consolider les commandes en Chine', body: 'Réception multi-fournisseurs, contrôle, palettisation et préparation du chargement FCL ou LCL.', cta: 'Planifier la consolidation' },
      { title: 'Expédier depuis la Chine', body: 'FCL, LCL, marchandises dangereuses, fret aérien et coordination à destination.', cta: 'Voir le fret' },
    ],
    responsibilityTitle: 'Deux sociétés responsables, une remise documentée',
    ddnzRole: 'DDNZ Global Trade Co., Ltd. coordonne le sourcing, le suivi fournisseurs, les contrôles et la préparation export.',
    freightRole: 'Heaven Born International Freight Co., Ltd. exécute le fret international compris dans le périmètre confirmé.',
    freightLinks: 'Accès direct au fret',
    serviceLabels: ['FCL', 'LCL', 'Dangereux', 'Aérien', 'FBA', 'Entreposage', 'Asie centrale'],
  },
  es: {
    title: 'Elija el apoyo que necesita en China.',
    intro: 'Empiece con compras, consolide pedidos ya realizados o mueva carga lista para embarcar.',
    paths: [
      { title: 'Importar desde China', body: 'Desarrollo de proveedores, comparación de ofertas, inspección, coordinación de compras y preparación de exportación.', cta: 'Planificar importación' },
      { title: 'Consolidar pedidos en China', body: 'Recepción de varios proveedores, revisión, paletización y preparación de carga FCL o LCL.', cta: 'Planificar consolidación' },
      { title: 'Enviar desde China', body: 'FCL, LCL, mercancías peligrosas, transporte aéreo y coordinación en destino.', cta: 'Ver transporte' },
    ],
    responsibilityTitle: 'Dos empresas responsables, una entrega documentada',
    ddnzRole: 'DDNZ Global Trade Co., Ltd. coordina compras, proveedores, registros de inspección y preparación de exportación.',
    freightRole: 'Heaven Born International Freight Co., Ltd. ejecuta el transporte internacional incluido en el alcance confirmado.',
    freightLinks: 'Accesos directos de transporte',
    serviceLabels: ['FCL', 'LCL', 'Peligrosas', 'Aéreo', 'FBA', 'Almacén', 'Asia Central'],
  },
  ar: {
    title: 'اختر الدعم الذي تحتاج إليه في الصين.',
    intro: 'ابدأ بالتوريد، أو اجمع الطلبات القائمة، أو انقل البضائع الجاهزة للشحن.',
    paths: [
      { title: 'الاستيراد من الصين', body: 'تطوير الموردين، توحيد عروض الأسعار، الفحص، تنسيق المشتريات والاستعداد للتصدير.', cta: 'خطط للاستيراد' },
      { title: 'تجميع الطلبات في الصين', body: 'الاستلام من عدة موردين، فحص البضائع، التجهيز على منصات وتحضير تحميل FCL أو LCL.', cta: 'خطط للتجميع' },
      { title: 'الشحن من الصين', body: 'FCL وLCL والبضائع الخطرة والشحن الجوي والتنسيق في الوجهة.', cta: 'استكشف الشحن' },
    ],
    responsibilityTitle: 'شركتان مسؤولتان وتسليم واحد موثق',
    ddnzRole: 'تنسق DDNZ Global Trade Co., Ltd. التوريد ومتابعة الموردين وسجلات الفحص والاستعداد للتصدير.',
    freightRole: 'تنفذ Heaven Born International Freight Co., Ltd. الشحن الدولي المشمول في النطاق المؤكد.',
    freightLinks: 'روابط الشحن المباشرة',
    serviceLabels: ['FCL', 'LCL', 'بضائع خطرة', 'شحن جوي', 'FBA', 'تخزين', 'آسيا الوسطى'],
  },
  pt: {
    title: 'Escolha o apoio de que precisa na China.',
    intro: 'Comece pelo sourcing, consolide pedidos já feitos ou mova carga pronta para embarque.',
    paths: [
      { title: 'Importar da China', body: 'Desenvolvimento de fornecedores, alinhamento de propostas, inspeção, coordenação de compras e preparação para exportação.', cta: 'Planejar importação' },
      { title: 'Consolidar pedidos na China', body: 'Recebimento de vários fornecedores, conferência, paletização e preparação FCL ou LCL.', cta: 'Planejar consolidação' },
      { title: 'Enviar da China', body: 'FCL, LCL, cargas perigosas, frete aéreo e coordenação no destino.', cta: 'Ver frete' },
    ],
    responsibilityTitle: 'Duas empresas responsáveis, uma entrega documentada',
    ddnzRole: 'A DDNZ Global Trade Co., Ltd. coordena sourcing, fornecedores, registros de inspeção e preparação para exportação.',
    freightRole: 'A Heaven Born International Freight Co., Ltd. executa o frete internacional incluído no escopo confirmado.',
    freightLinks: 'Acessos diretos de frete',
    serviceLabels: ['FCL', 'LCL', 'Perigosos', 'Aéreo', 'FBA', 'Armazém', 'Ásia Central'],
  },
  tr: {
    title: 'Çin’de ihtiyacınız olan desteği seçin.',
    intro: 'Tedarikle başlayın, mevcut siparişleri birleştirin veya sevke hazır yükü taşıyın.',
    paths: [
      { title: 'Çin’den ithalat', body: 'Tedarikçi geliştirme, teklif eşleştirme, denetim, satın alma koordinasyonu ve ihracat hazırlığı.', cta: 'İthalatı planlayın' },
      { title: 'Siparişleri Çin’de birleştirme', body: 'Birden fazla tedarikçiden teslim alma, yük kontrolü, paletleme ve FCL veya LCL hazırlığı.', cta: 'Konsolidasyonu planlayın' },
      { title: 'Çin’den sevkiyat', body: 'FCL, LCL, tehlikeli yük, hava kargo ve varış koordinasyonu.', cta: 'Taşımayı inceleyin' },
    ],
    responsibilityTitle: 'İki sorumlu şirket, belgeli tek devir',
    ddnzRole: 'DDNZ Global Trade Co., Ltd. tedarik, tedarikçi takibi, denetim kayıtları ve ihracat hazırlığını koordine eder.',
    freightRole: 'Heaven Born International Freight Co., Ltd. onaylanan kapsamdaki uluslararası taşımayı yürütür.',
    freightLinks: 'Doğrudan taşıma bağlantıları',
    serviceLabels: ['FCL', 'LCL', 'Tehlikeli yük', 'Hava kargo', 'FBA', 'Depolama', 'Orta Asya'],
  },
};

const pathConfig: Array<{ icon: LucideIcon; className: string; path: string }> = [
  { icon: SearchCheck, className: 'home-buyer-path--import', path: '/sourcing-services/supplier-search/' },
  { icon: Boxes, className: 'home-buyer-path--consolidate', path: '/sourcing-services/consolidation-export/' },
  { icon: Ship, className: 'home-buyer-path--ship', path: '/services/sea-freight/' },
];

const freightPaths = ['/services/sea-freight/', '/services/lcl-shipping-from-china/', '/services/dangerous-goods-shipping-from-china/', '/services/air-freight/', '/services/amazon-fba/', '/services/warehouse-services/', '/shipping-from-china-to-central-asia/'];

export default function HomeOneTeamBridge() {
  const { language } = useLanguage();
  const copy = COPY[language];
  const prefix = PREFIX[language];

  return (
    <section id="buyer-paths" className="home-one-team" aria-labelledby="buyer-paths-title" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="home-one-team-inner">
        <div className="home-one-team-heading">
          <h2 id="buyer-paths-title">{copy.title}</h2>
          <p className="home-one-team-intro">{copy.intro}</p>
        </div>

        <div className="home-buyer-paths">
          {copy.paths.map((pathCopy, index) => {
            const config = pathConfig[index];
            const Icon = config.icon;
            return (
              <article key={pathCopy.title} className={`home-buyer-path ${config.className}`}>
                <Icon aria-hidden="true" />
                <h3>{pathCopy.title}</h3>
                <p>{pathCopy.body}</p>
                <Link to={`${prefix}${config.path}`} className="home-one-team-link">{pathCopy.cta}<ArrowRight aria-hidden="true" /></Link>
              </article>
            );
          })}
        </div>

        <div className="home-responsibility" aria-labelledby="responsibility-title">
          <div className="home-responsibility-heading">
            <ShieldCheck aria-hidden="true" />
            <h3 id="responsibility-title">{copy.responsibilityTitle}</h3>
          </div>
          <div className="home-responsibility-roles">
            <p><strong>DDNZ GLOBAL</strong><span>{copy.ddnzRole}</span></p>
            <p><strong>HEAVEN BORN</strong><span>{copy.freightRole}</span></p>
          </div>
        </div>

        <nav className="home-one-team-services" aria-label={copy.freightLinks}>
          <span>{copy.freightLinks}</span>
          {copy.serviceLabels.map((label, index) => <Link key={label} to={`${prefix}${freightPaths[index]}`}>{label}<ArrowRight aria-hidden="true" /></Link>)}
        </nav>
      </div>
    </section>
  );
}
