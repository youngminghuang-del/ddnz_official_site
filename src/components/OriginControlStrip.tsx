import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';

type OriginControlCopy = {
  heading: string;
  freightTitle: string;
  freightBody: string;
  sourcingTitle: string;
  sourcingBody: string;
};

const COPY: Record<Language, OriginControlCopy> = {
  en: {
    heading: 'China-side execution before cargo departs',
    freightTitle: 'Freight forwarding from China',
    freightBody: 'Ocean, air and rail planning with export documents, booking and loading coordination.',
    sourcingTitle: 'Supplier inspection and consolidation',
    sourcingBody: 'Alibaba and multi-supplier orders received, checked, stored and combined before export.',
  },
  zh: {
    heading: '货物离开中国前，我们先把始发端管好',
    freightTitle: '中国始发国际货运',
    freightBody: '协调海运、空运与铁路运输，衔接订舱、出口单证和装运。',
    sourcingTitle: '采购验货与多供应商拼箱',
    sourcingBody: '承接阿里巴巴及多供应商货物的收货、验货、仓储、集货与拼箱。',
  },
  ru: {
    heading: 'Контроль операций в Китае до отправки груза',
    freightTitle: 'Экспедирование грузов из Китая',
    freightBody: 'Морские, авиа- и железнодорожные перевозки, экспортные документы, бронирование и погрузка.',
    sourcingTitle: 'Инспекция поставщиков и консолидация',
    sourcingBody: 'Приём, проверка, хранение и объединение заказов Alibaba и нескольких поставщиков.',
  },
  fr: {
    heading: 'Maîtriser les opérations en Chine avant le départ',
    freightTitle: 'Transit international depuis la Chine',
    freightBody: 'Planification maritime, aérienne et ferroviaire, documents export, réservation et chargement.',
    sourcingTitle: 'Inspection fournisseurs et groupage',
    sourcingBody: 'Réception, contrôle, stockage et consolidation des commandes Alibaba et multi-fournisseurs.',
  },
  es: {
    heading: 'Control en origen antes de que la carga salga de China',
    freightTitle: 'Transporte internacional desde China',
    freightBody: 'Planificación marítima, aérea y ferroviaria, documentos de exportación, reserva y carga.',
    sourcingTitle: 'Inspección de proveedores y consolidación',
    sourcingBody: 'Recepción, control, almacenaje y consolidación de pedidos de Alibaba y varios proveedores.',
  },
  ar: {
    heading: 'إدارة عمليات المنشأ في الصين قبل مغادرة الشحنة',
    freightTitle: 'شحن دولي من الصين',
    freightBody: 'تنسيق الشحن البحري والجوي والسكك الحديدية مع مستندات التصدير والحجز والتحميل.',
    sourcingTitle: 'فحص الموردين وتجميع الشحنات',
    sourcingBody: 'استلام وفحص وتخزين وتجميع طلبات علي بابا والطلبات من عدة موردين قبل التصدير.',
  },
  pt: {
    heading: 'Execução na China antes da saída da carga',
    freightTitle: 'Transporte internacional a partir da China',
    freightBody: 'Planejamento marítimo, aéreo e ferroviário com documentos, reserva e coordenação de carregamento.',
    sourcingTitle: 'Inspeção de fornecedores e consolidação',
    sourcingBody: 'Pedidos do Alibaba e de vários fornecedores recebidos, conferidos, armazenados e consolidados antes da exportação.',
  },
  tr: {
    heading: 'Yük ayrılmadan önce Çin tarafındaki uygulama',
    freightTitle: 'Çin çıkışlı uluslararası nakliye',
    freightBody: 'İhracat belgeleri, rezervasyon ve yükleme koordinasyonuyla deniz, hava ve demiryolu planlaması.',
    sourcingTitle: 'Tedarikçi denetimi ve konsolidasyon',
    sourcingBody: 'Alibaba ve çoklu tedarikçi siparişleri ihracattan önce teslim alınır, kontrol edilir, depolanır ve birleştirilir.',
  },
};

const prefixByLanguage: Record<Language, string> = {
  en: '',
  zh: '/zh-cn',
  ru: '/ru',
  fr: '/fr',
  es: '/es',
  ar: '/ar',
  pt: '/pt',
  tr: '/tr',
};

export default function OriginControlStrip() {
  const { language } = useLanguage();
  const copy = COPY[language];
  const prefix = prefixByLanguage[language];

  const capabilities = [
    {
      title: copy.freightTitle,
      body: copy.freightBody,
      href: `${prefix}/services/sea-freight`,
      brand: 'HEAVEN BORN',
    },
    {
      title: copy.sourcingTitle,
      body: copy.sourcingBody,
      href: `${prefix}/services/warehouse-services`,
      brand: 'DDNZ GLOBAL TRADE',
    },
  ];

  return (
    <section className="border-b border-slate-200 bg-[#F5F8FC]" aria-labelledby="origin-control-title">
      <h2 id="origin-control-title" className="sr-only">{copy.heading}</h2>
      <div className="mx-auto grid max-w-7xl md:grid-cols-2 md:px-8">

        {capabilities.map(({ title, body, href, brand }, index) => (
          <Link
            key={title}
            to={href}
            className={`group relative flex min-h-32 flex-col items-start gap-5 border-t border-slate-200 px-5 py-7 transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#EA6A12] sm:flex-row sm:px-8 md:border-t-0 ${index === 1 ? 'md:border-l rtl:md:border-l-0 rtl:md:border-r' : ''}`}
          >
            <span className="flex w-28 shrink-0 flex-col gap-3 pt-1" aria-hidden="true">
              <span className="h-px w-9 bg-[#EA6A12] transition-all duration-200 group-hover:w-14" />
              <span className="text-[10px] font-black tracking-[0.15em] text-[#0B4F8A]">{brand}</span>
            </span>
            <span className="min-w-0 pr-6 rtl:pl-6 rtl:pr-0">
              <span className="block text-base font-black leading-tight text-[#0B1F3A] sm:text-lg">{title}</span>
              <span className="mt-2 block max-w-[42ch] text-sm font-medium leading-6 text-slate-600">{body}</span>
            </span>
            <ArrowUpRight className="absolute right-5 top-7 h-4 w-4 text-slate-400 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#EA6A12] rtl:left-5 rtl:right-auto rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5 sm:right-8 rtl:sm:left-8 rtl:sm:right-auto" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}
