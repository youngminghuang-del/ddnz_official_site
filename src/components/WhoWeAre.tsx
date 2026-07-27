import { ArrowRight, Building2, ShieldCheck, Warehouse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImgUrl } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

type StoryItem = {
  label: string;
  title: string;
  body: string;
};

type Copy = {
  kicker: string;
  title: string;
  lead: string;
  legalLabel: string;
  legalName: string;
  since: string;
  portraitCaption: string;
  story: StoryItem[];
  facilityLabel: string;
  facilityTitle: string;
  facilityBody: string;
  tradeLabel: string;
  tradeName: string;
  tradeBody: string;
  servicesCta: string;
  warehouseCta: string;
};

const COPY: Record<string, Copy> = {
  en: {
    kicker: 'Who we are',
    title: 'A China-based freight team built around real cargo.',
    lead: 'Heaven Born combines origin operations, specialist freight knowledge and practical trade support to help importers move goods from China with fewer hand-off gaps.',
    legalLabel: 'Freight company',
    legalName: 'Heaven Born International Freight Co., Ltd',
    since: 'Operating since 1997',
    portraitCaption: 'Our team grew from hands-on China export coordination into an international freight operation serving complex cargo and changing markets.',
    story: [
      {
        label: '01 / Foundation',
        title: 'Trade experience became freight discipline',
        body: 'Since 1997, our work has been shaped by the details that determine whether a shipment moves smoothly: suppliers, documents, loading, routing and destination hand-offs.',
      },
      {
        label: '02 / Specialisation',
        title: 'Dangerous goods and new-energy logistics',
        body: 'We developed focused operating knowledge for batteries, energy storage systems, electric vehicles and other cargo that requires careful compliance planning.',
      },
      {
        label: '03 / Resilience',
        title: 'A network designed to keep cargo moving',
        body: 'When capacity, routes or regulations change, our team coordinates practical alternatives through trusted carriers and local partners.',
      },
    ],
    facilityLabel: 'Physical operations',
    facilityTitle: 'Self-operated warehouse capability',
    facilityBody: 'Our own operating facilities support receiving, consolidation, loading coordination, inspection hand-offs and export preparation in China.',
    tradeLabel: 'Trade-support brand',
    tradeName: 'DDNZ Global Trade Co., Ltd',
    tradeBody: 'DDNZ Global Trade supports factory verification, inspection, export agency, customs declaration and tax-refund coordination alongside the freight team.',
    servicesCta: 'Explore freight services',
    warehouseCta: 'View warehouse services',
  },
  zh: {
    kicker: '我们是谁',
    title: '立足中国的专业国际货运团队',
    lead: '华正邦泰将中国始发端操作、专业货运能力与贸易支持结合起来，帮助进口商减少供应商、仓库、报关与目的地交接之间的断点。',
    legalLabel: '货运主体',
    legalName: '华正邦泰国际货运代理有限公司',
    since: '始于 1997 年',
    portraitCaption: '从中国出口贸易与始发端协调起步，我们逐步发展为服务复杂货物与多变市场的专业国际货运团队。',
    story: [
      {
        label: '01 / 起点',
        title: '把贸易经验沉淀为货运执行力',
        body: '自 1997 年起，我们持续处理影响出运质量的关键细节，包括供应商衔接、文件、装载、路径与目的地交接。',
      },
      {
        label: '02 / 专业化',
        title: '危险品与新能源物流能力',
        body: '围绕电池、储能系统、电动汽车及其他需要严格合规规划的货物，建立更有针对性的操作经验。',
      },
      {
        label: '03 / 韧性',
        title: '为持续交付建立可靠协作网络',
        body: '当舱位、航线或监管要求变化时，团队通过承运人与当地合作伙伴协调可执行的替代方案。',
      },
    ],
    facilityLabel: '实体操作能力',
    facilityTitle: '自营仓储能力',
    facilityBody: '依托自营实体仓储，支持中国端收货、集货、装载协调、验货衔接与出口前准备。',
    tradeLabel: '贸易支持品牌',
    tradeName: '大递诺展贸易有限公司',
    tradeBody: '大递诺展贸易有限公司与货运团队协同，为客户提供验厂、验货、代出口、报关与退税协调等贸易支持。',
    servicesCta: '查看货运服务',
    warehouseCta: '查看仓储服务',
  },
  ru: {
    kicker: 'О компании',
    title: 'Китайская команда, которая строит логистику вокруг реального груза.',
    lead: 'Heaven Born объединяет операции в Китае, специализированную экспедиторскую экспертизу и практическую торговую поддержку.',
    legalLabel: 'Экспедиторская компания',
    legalName: 'Heaven Born International Freight Co., Ltd',
    since: 'Работаем с 1997 года',
    portraitCaption: 'От координации китайского экспорта мы выросли в международную команду для сложных грузов и меняющихся рынков.',
    story: [
      { label: '01 / Основа', title: 'Торговый опыт стал операционной дисциплиной', body: 'С 1997 года мы уделяем внимание поставщикам, документам, погрузке, маршрутам и передаче груза в пункте назначения.' },
      { label: '02 / Специализация', title: 'Опасные грузы и новая энергетика', body: 'Мы развиваем практические знания для батарей, систем хранения энергии, электромобилей и других регулируемых грузов.' },
      { label: '03 / Устойчивость', title: 'Сеть, которая помогает грузу двигаться', body: 'При изменении вместимости, маршрутов или правил мы координируем рабочие альтернативы с перевозчиками и местными партнёрами.' },
    ],
    facilityLabel: 'Физические операции',
    facilityTitle: 'Собственные складские мощности',
    facilityBody: 'Наши объекты поддерживают приём, консолидацию, координацию погрузки, инспекции и подготовку к экспорту в Китае.',
    tradeLabel: 'Бренд торговой поддержки',
    tradeName: 'DDNZ Global Trade Co., Ltd',
    tradeBody: 'DDNZ Global Trade помогает с аудитом фабрики, инспекцией, экспортным агентированием, таможней и координацией возврата налогов.',
    servicesCta: 'Услуги перевозки',
    warehouseCta: 'Складские услуги',
  },
  fr: {
    kicker: 'Qui sommes-nous',
    title: 'Une équipe basée en Chine, organisée autour de la marchandise réelle.',
    lead: 'Heaven Born réunit opérations à l’origine, expertise de fret spécialisé et soutien commercial pratique pour limiter les ruptures de coordination.',
    legalLabel: 'Société de transit',
    legalName: 'Heaven Born International Freight Co., Ltd',
    since: 'En activité depuis 1997',
    portraitCaption: 'Partis de la coordination des exportations chinoises, nous sommes devenus une équipe de fret international pour les cargaisons complexes.',
    story: [
      { label: '01 / Fondation', title: 'L’expérience du commerce devenue discipline logistique', body: 'Depuis 1997, nous maîtrisons les détails qui comptent: fournisseurs, documents, chargement, itinéraires et relais à destination.' },
      { label: '02 / Spécialisation', title: 'Marchandises dangereuses et nouvelles énergies', body: 'Nous développons un savoir-faire ciblé pour batteries, systèmes de stockage, véhicules électriques et autres cargaisons réglementées.' },
      { label: '03 / Résilience', title: 'Un réseau conçu pour maintenir les flux', body: 'Lorsque les capacités, routes ou règles changent, nous coordonnons des solutions concrètes avec transporteurs et partenaires locaux.' },
    ],
    facilityLabel: 'Opérations physiques',
    facilityTitle: 'Capacité d’entreposage en propre',
    facilityBody: 'Nos installations soutiennent réception, groupage, coordination du chargement, inspections et préparation à l’export en Chine.',
    tradeLabel: 'Marque de soutien commercial',
    tradeName: 'DDNZ Global Trade Co., Ltd',
    tradeBody: 'DDNZ Global Trade accompagne audit d’usine, inspection, exportation pour compte de tiers, douane et coordination fiscale.',
    servicesCta: 'Voir les services de fret',
    warehouseCta: 'Voir l’entreposage',
  },
  es: {
    kicker: 'Quiénes somos',
    title: 'Un equipo en China que organiza la logística en torno a la carga real.',
    lead: 'Heaven Born integra operaciones de origen, experiencia en carga especializada y apoyo comercial práctico para reducir fallos entre cada etapa.',
    legalLabel: 'Empresa de transporte',
    legalName: 'Heaven Born International Freight Co., Ltd',
    since: 'Operamos desde 1997',
    portraitCaption: 'Desde la coordinación de exportaciones en China evolucionamos hasta ser un equipo internacional para cargas complejas y mercados cambiantes.',
    story: [
      { label: '01 / Origen', title: 'La experiencia comercial se convirtió en disciplina logística', body: 'Desde 1997 trabajamos los detalles que definen un envío: proveedores, documentos, carga, rutas y entrega en destino.' },
      { label: '02 / Especialización', title: 'Mercancías peligrosas y nueva energía', body: 'Desarrollamos experiencia para baterías, sistemas de almacenamiento, vehículos eléctricos y otras cargas reguladas.' },
      { label: '03 / Resiliencia', title: 'Una red diseñada para mantener la carga en movimiento', body: 'Cuando cambian la capacidad, las rutas o las normas, coordinamos alternativas viables con transportistas y socios locales.' },
    ],
    facilityLabel: 'Operaciones físicas',
    facilityTitle: 'Capacidad de almacén propio',
    facilityBody: 'Nuestras instalaciones respaldan recepción, consolidación, coordinación de carga, inspecciones y preparación de exportación en China.',
    tradeLabel: 'Marca de apoyo comercial',
    tradeName: 'DDNZ Global Trade Co., Ltd',
    tradeBody: 'DDNZ Global Trade apoya auditorías de fábrica, inspecciones, agencia de exportación, aduanas y coordinación de devolución fiscal.',
    servicesCta: 'Ver servicios de carga',
    warehouseCta: 'Ver servicios de almacén',
  },
  ar: {
    kicker: 'من نحن',
    title: 'فريق شحن في الصين يبني الحلول حول تفاصيل البضائع الفعلية',
    lead: 'تجمع Heaven Born بين عمليات المنشأ وخبرة الشحن المتخصص والدعم التجاري العملي لتقليل فجوات التنسيق بين مراحل الشحنة.',
    legalLabel: 'شركة الشحن',
    legalName: 'Heaven Born International Freight Co., Ltd',
    since: 'نعمل منذ عام 1997',
    portraitCaption: 'بدأنا بتنسيق الصادرات من الصين وتطورنا إلى فريق شحن دولي يخدم البضائع المعقدة والأسواق المتغيرة.',
    story: [
      { label: '01 / التأسيس', title: 'تحولت خبرة التجارة إلى انضباط تشغيلي', body: 'منذ عام 1997 نهتم بالتفاصيل التي تحرك الشحنة: الموردون والمستندات والتحميل والمسارات والتسليم في الوجهة.' },
      { label: '02 / التخصص', title: 'البضائع الخطرة والطاقة الجديدة', body: 'طورنا معرفة تشغيلية للبطاريات وأنظمة تخزين الطاقة والمركبات الكهربائية وغيرها من البضائع الخاضعة للتنظيم.' },
      { label: '03 / المرونة', title: 'شبكة تساعد على استمرار حركة البضائع', body: 'عند تغير السعة أو المسارات أو اللوائح، ننسق بدائل عملية مع الناقلين والشركاء المحليين.' },
    ],
    facilityLabel: 'العمليات الميدانية',
    facilityTitle: 'قدرات مستودعات مُدارة ذاتياً',
    facilityBody: 'تدعم منشآتنا الاستلام والتجميع وتنسيق التحميل والفحص والإعداد للتصدير في الصين.',
    tradeLabel: 'علامة الدعم التجاري',
    tradeName: 'DDNZ Global Trade Co., Ltd',
    tradeBody: 'تدعم DDNZ Global Trade تدقيق المصانع والفحص والتصدير بالنيابة والإقرار الجمركي وتنسيق استرداد الضرائب.',
    servicesCta: 'استكشف خدمات الشحن',
    warehouseCta: 'خدمات المستودعات',
  },
};

const prefixByLanguage: Record<string, string> = {
  zh: '/zh-cn',
  ru: '/ru',
  fr: '/fr',
  es: '/es',
  ar: '/ar',
};

export default function WhoWeAre() {
  const { language } = useLanguage();
  const content = COPY[language] || COPY.en;
  const prefix = prefixByLanguage[language] || '';

  return (
    <section id="who-we-are" className="scroll-mt-24 overflow-hidden border-b border-slate-200 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-b border-slate-200 pb-10 md:pb-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-[#EA6A12]">{content.kicker}</p>
            <h2 className={`font-black tracking-[-0.04em] text-[#0B1F3A] ${
              language === 'zh'
                ? 'max-w-[22ch] text-4xl leading-[1.12] sm:text-[2.6rem] md:text-[2.75rem] lg:text-5xl'
                : 'max-w-[15ch] text-4xl leading-[1.02] sm:text-5xl md:text-6xl'
            }`}>
              {content.title}
            </h2>
            <div className="mt-5 h-1 w-12 rounded-full bg-[var(--hb-amber)]" aria-hidden="true" />
          </div>
          <div className="flex flex-col justify-end lg:col-span-6">
            <p className="max-w-[62ch] text-base font-medium leading-7 text-slate-600 md:text-lg">{content.lead}</p>
            <div className="mt-7 flex items-start gap-4 border-l-2 border-[#F59E0B] pl-5">
              <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0B4F8A]" aria-hidden="true" />
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">{content.legalLabel}</p>
                <p className="mt-1.5 text-base font-black text-[#0B1F3A] md:text-lg">{content.legalName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[24px] bg-[#081D35] shadow-[0_24px_70px_rgba(11,31,58,0.16)] lg:grid lg:grid-cols-[1.25fr_0.75fr]">
          <figure className="relative min-h-[390px] overflow-hidden lg:min-h-[610px]">
            <img
              src={getImgUrl('JOURNEY_2019')}
              alt="Heaven Born International Freight team meeting"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06182d] via-[#06182d]/25 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 md:p-10">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-amber-300">{content.since}</p>
              <p className="max-w-[54ch] text-base font-semibold leading-7 text-white/90 md:text-lg">{content.portraitCaption}</p>
            </figcaption>
          </figure>

          <div className="px-6 py-3 sm:px-8 lg:px-10 lg:py-7">
            {content.story.map((item) => (
              <article key={item.label} className="border-b border-white/12 py-7 last:border-b-0">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-300">{item.label}</p>
                <h3 className="mt-3 text-xl font-black leading-tight tracking-[-0.02em] text-white md:text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-300">{item.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 grid overflow-hidden rounded-[24px] border border-slate-200 bg-[#F5F8FC] lg:grid-cols-[0.8fr_1fr_1fr]">
          <div className="relative min-h-56 overflow-hidden lg:min-h-[310px]">
            <img
              src={getImgUrl('JOURNEY_2004')}
              alt="Heaven Born self-operated warehouse and trade facilities"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/55 to-transparent" />
          </div>

          <div className="border-b border-slate-200 p-7 sm:p-9 lg:border-b-0 lg:border-r">
            <Warehouse className="h-7 w-7 text-[#0B4F8A]" aria-hidden="true" />
            <p className="mt-7 text-[11px] font-black uppercase tracking-[0.17em] text-[#EA6A12]">{content.facilityLabel}</p>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#0B1F3A]">{content.facilityTitle}</h3>
            <p className="mt-4 text-sm font-medium leading-6 text-slate-600">{content.facilityBody}</p>
            <Link
              to={`${prefix}/services/warehouse-services`}
              className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#0B4F8A] transition-colors hover:text-[#EA6A12]"
            >
              {content.warehouseCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="p-7 sm:p-9">
            <ShieldCheck className="h-7 w-7 text-[#0B4F8A]" aria-hidden="true" />
            <p className="mt-7 text-[11px] font-black uppercase tracking-[0.17em] text-[#EA6A12]">{content.tradeLabel}</p>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#0B1F3A]">{content.tradeName}</h3>
            <p className="mt-4 text-sm font-medium leading-6 text-slate-600">{content.tradeBody}</p>
            <Link
              to={`${prefix}/#what-we-do`}
              className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#0B4F8A] transition-colors hover:text-[#EA6A12]"
            >
              {content.servicesCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
