import { ClipboardCheck, PackageCheck, Ship } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';
import { buildQuoteHref } from '../lib/quoteLinks';
import { DdnzPrimaryLink } from './DdnzUi';

type MarketHandoffCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  roles: Array<{ label: string; title: string; body: string }>;
  evidence: string;
  processLink: string;
  cta: string;
};

const copy: Record<Language, MarketHandoffCopy> = {
  en: {
    eyebrow: 'Sourcing-to-market handoff',
    title: 'A destination route starts before cargo reaches the port.',
    intro: 'Market delivery is only reliable when the released product, cartons, documents and cargo data still match the buying brief. This checkpoint connects DDNZ origin control with Heaven Born freight execution.',
    roles: [
      { label: 'DDNZ · Product release', title: 'Order evidence is closed first', body: 'Approved model, quantity, packing, labels and open exceptions are recorded before the goods move forward.' },
      { label: 'DDNZ · Export handoff', title: 'Cargo and documents are reconciled', body: 'Supplier deliveries, carton data and shipment documents are matched to the approved order scope.' },
      { label: 'Heaven Born · Freight execution', title: 'The confirmed route is then executed', body: 'Booking, loading and international freight are handled by Heaven Born when included in the confirmed scope.' },
    ],
    evidence: 'Authorized field material · loading preparation at China origin',
    processLink: 'See the complete six-checkpoint workflow',
    cta: 'Scope a China-to-market shipment',
  },
  zh: {
    eyebrow: '采购到目的市场的责任交接',
    title: '目的国线路在货物到港之前就已经开始。',
    intro: '只有放行产品、纸箱、单证与货物数据仍与采购需求一致，目的国交付才可控。本节点把 DDNZ 的中国源头管控与 Heaven Born 的货运执行连接起来。',
    roles: [
      { label: 'DDNZ · 产品放行', title: '先关闭订单证据', body: '货物进入下一环节前，记录已确认型号、数量、包装、标签与未关闭异常。' },
      { label: 'DDNZ · 出口交接', title: '核对货物与单证', body: '把供应商送货、箱数数据及出货单证与已确认订单范围逐项匹配。' },
      { label: 'Heaven Born · 货运执行', title: '再执行已确认线路', body: '如已纳入确认服务范围，由 Heaven Born 执行订舱、装载与国际运输。' },
    ],
    evidence: '已授权现场素材 · 中国源头装货准备',
    processLink: '查看完整六节点流程',
    cta: '提交中国到目的市场需求',
  },
  ru: {
    eyebrow: 'Передача от закупки к рынку',
    title: 'Маршрут на рынок начинается до прибытия груза в порт.',
    intro: 'Доставка надежна, когда выпущенный товар, коробки, документы и данные груза соответствуют закупочному заданию. Этот этап связывает контроль DDNZ в Китае с перевозкой Heaven Born.',
    roles: [
      { label: 'DDNZ · Выпуск товара', title: 'Сначала закрываются доказательства заказа', body: 'До движения груза фиксируются утвержденная модель, количество, упаковка, маркировка и открытые исключения.' },
      { label: 'DDNZ · Экспортная передача', title: 'Груз и документы сверяются', body: 'Поставки, данные коробок и отгрузочные документы сопоставляются с утвержденным объемом заказа.' },
      { label: 'Heaven Born · Перевозка', title: 'Затем исполняется подтвержденный маршрут', body: 'Heaven Born выполняет бронирование, погрузку и международную перевозку, если они входят в согласованный объем.' },
    ],
    evidence: 'Разрешенные полевые материалы · подготовка погрузки в Китае',
    processLink: 'Посмотреть полный процесс из шести этапов',
    cta: 'Определить маршрут из Китая',
  },
  fr: {
    eyebrow: 'Transmission du sourcing au marché',
    title: 'Un itinéraire de destination commence avant l’arrivée au port.',
    intro: 'La livraison reste maîtrisée lorsque produit libéré, cartons, documents et données cargo correspondent toujours au brief. Ce point relie le contrôle origine DDNZ à l’exécution fret Heaven Born.',
    roles: [
      { label: 'DDNZ · Libération produit', title: 'Les preuves de commande sont clôturées', body: 'Modèle, quantité, emballage, étiquettes et exceptions ouvertes sont consignés avant l’étape suivante.' },
      { label: 'DDNZ · Transmission export', title: 'Cargo et documents sont rapprochés', body: 'Livraisons fournisseurs, données cartons et documents sont comparés au périmètre approuvé.' },
      { label: 'Heaven Born · Exécution fret', title: 'L’itinéraire confirmé est ensuite exécuté', body: 'Heaven Born gère réservation, chargement et fret international lorsqu’ils sont inclus au périmètre.' },
    ],
    evidence: 'Matériel terrain autorisé · préparation du chargement en Chine',
    processLink: 'Voir le processus complet en six étapes',
    cta: 'Cadrer une expédition depuis la Chine',
  },
  es: {
    eyebrow: 'Entrega de compra a mercado',
    title: 'La ruta de destino comienza antes de que la carga llegue al puerto.',
    intro: 'La entrega es controlable cuando producto liberado, cajas, documentos y datos de carga siguen coincidiendo con el brief. Este punto conecta el control de origen DDNZ con el transporte de Heaven Born.',
    roles: [
      { label: 'DDNZ · Liberación de producto', title: 'Primero se cierra la evidencia del pedido', body: 'Antes de avanzar se registran modelo, cantidad, embalaje, etiquetas y excepciones abiertas.' },
      { label: 'DDNZ · Entrega de exportación', title: 'Se concilian carga y documentos', body: 'Entregas, datos de cajas y documentos se cotejan con el alcance aprobado del pedido.' },
      { label: 'Heaven Born · Ejecución del transporte', title: 'Después se ejecuta la ruta confirmada', body: 'Heaven Born gestiona reserva, carga y transporte internacional cuando forman parte del alcance.' },
    ],
    evidence: 'Material de campo autorizado · preparación de carga en China',
    processLink: 'Ver el proceso completo de seis puntos',
    cta: 'Definir un envío desde China',
  },
  ar: {
    eyebrow: 'التسليم من التوريد إلى السوق',
    title: 'يبدأ مسار سوق الوجهة قبل وصول البضاعة إلى الميناء.',
    intro: 'تبقى عملية التسليم قابلة للضبط عندما يطابق المنتج المفرج عنه والطرود والمستندات وبيانات البضاعة موجز الشراء. تربط هذه النقطة رقابة DDNZ في الصين بتنفيذ Heaven Born للشحن.',
    roles: [
      { label: 'DDNZ · إفراج المنتج', title: 'تُغلق أدلة الطلب أولاً', body: 'يُسجل الموديل والكمية والتعبئة والملصقات والاستثناءات المفتوحة قبل انتقال البضاعة.' },
      { label: 'DDNZ · تسليم التصدير', title: 'تُطابق البضاعة والمستندات', body: 'تُطابق تسليمات الموردين وبيانات الطرود ومستندات الشحنة مع نطاق الطلب المعتمد.' },
      { label: 'Heaven Born · تنفيذ الشحن', title: 'ثم يُنفذ المسار المؤكد', body: 'تنفذ Heaven Born الحجز والتحميل والشحن الدولي عند إدراجها في النطاق المؤكد.' },
    ],
    evidence: 'مواد ميدانية مصرح بها · تجهيز التحميل في منشأ الصين',
    processLink: 'عرض المسار الكامل من ست نقاط',
    cta: 'حدد نطاق شحنة من الصين',
  },
};

const prefix: Record<Language, string> = { en: '', zh: '/zh-cn', ru: '/ru', fr: '/fr', es: '/es', ar: '/ar' };
const icons = [ClipboardCheck, PackageCheck, Ship];

export default function MarketSourcingHandoff({ destination }: { destination?: string }) {
  const { language } = useLanguage();
  const content = copy[language];
  const quoteHref = buildQuoteHref({
    intent: 'Freight Export',
    language,
    source: 'market_sourcing_handoff',
    destination,
  });

  return (
    <section className="border-y border-slate-200 bg-[#fbfaf7] py-16 text-[var(--ddnz-ink)] sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.78fr_1.22fr] lg:items-start lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-coral-strong)]">{content.eyebrow}</p>
          <h2 className="mt-4 max-w-[15ch] text-3xl font-black leading-[1.06] tracking-[-0.04em] sm:text-4xl">{content.title}</h2>
          <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-slate-600 sm:text-base">{content.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <DdnzPrimaryLink to={quoteHref}>{content.cta}</DdnzPrimaryLink>
            <Link
              to={`${prefix[language]}/how-we-work`}
              className="inline-flex min-h-11 items-center px-1 text-sm font-black text-[var(--ddnz-purple-strong)] underline decoration-transparent underline-offset-4 transition hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ddnz-purple)]"
            >
              {content.processLink} <span aria-hidden="true" className="ml-2 rtl:ml-0 rtl:mr-2">→</span>
            </Link>
          </div>
        </div>

        <div>
          <ol className="grid overflow-hidden border border-slate-200 bg-slate-200 md:grid-cols-3">
            {content.roles.map((role, index) => {
              const Icon = icons[index];
              return (
                <li key={role.label} className="bg-white p-6">
                  <div className="flex items-center justify-between gap-4">
                    <Icon className="h-6 w-6 text-[var(--ddnz-purple-strong)]" aria-hidden="true" />
                    <span className="font-mono text-xs font-black text-[var(--ddnz-coral-strong)]">0{index + 1}</span>
                  </div>
                  <p className="mt-7 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--ddnz-purple-strong)]">{role.label}</p>
                  <h3 className="mt-2 text-lg font-black leading-6 text-slate-900">{role.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{role.body}</p>
                </li>
              );
            })}
          </ol>

          <figure className="mt-4 grid overflow-hidden border border-slate-200 bg-[var(--ddnz-ink)] text-white sm:grid-cols-[220px_1fr] sm:items-center">
            <img
              src="/media/process/export-loading-poster.webp"
              alt="Wooden-crated cargo being moved by pallet jack during China loading preparation"
              width="720"
              height="1280"
              loading="lazy"
              className="h-52 w-full object-cover sm:h-44"
            />
            <figcaption className="p-5 text-xs font-bold leading-5 text-slate-200 sm:p-6">{content.evidence}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
