import './sourcing-service-aligned.css';
import ServiceVisual from './ServiceVisual';
import ServiceCaseDetail from './ServiceCaseDetail';
import SupplierFieldPreview from './SupplierFieldPreview';
import { Link, useLocation } from 'react-router-dom';
import {
  BadgeCheck,
  Boxes,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  FileSearch,
  PackageCheck,
  SearchCheck,
  ShieldCheck,
} from 'lucide-react';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import OperationsEvidence from '../features/freight/OperationsEvidence';
import FclSpeakerCaseZh from '../features/freight/FclSpeakerCaseZh';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import { DdnzEyebrow, DdnzPrimaryLink, DdnzSecondaryLink } from '../components/DdnzUi';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';
import { buildQuoteHref } from '../lib/quoteLinks';
import type { QuoteIntent } from '../lib/quoteLinks';
import { trackEvent } from '../lib/utils';

import { serviceCopy, type SourcingServiceKind } from '../features/sourcing-services/copy';
export type { SourcingServiceKind } from '../features/sourcing-services/copy';

type SharedCopy = {
  services: string;
  home: string;
  fieldEvidence: string;
  fullProcess: string;
  proofLabel: string;
  proofTitle: string;
  proofBody: string;
  finalTitle: string;
  finalBody: string;
};

const sharedCopy: Record<Language, SharedCopy> = {
  en: {
    services: 'Sourcing services', home: 'Home', fieldEvidence: 'Authorized field material · China origin', fullProcess: 'View the full six-checkpoint workflow', proofLabel: 'Accountable handoff',
    proofTitle: 'Every decision stays tied to a record.',
    proofBody: 'DDNZ records the agreed scope, supplier or order status, evidence received, open risks and the next responsible party before goods move forward.',
    finalTitle: 'Start with what you already know.',
    finalBody: 'Send the product, supplier or order status, destination market and timing. The first review will identify the missing information and the right control path.',
  },
  zh: {
    services: '采购服务', home: '首页', fieldEvidence: '已授权现场素材 · 中国源头', fullProcess: '查看完整六节点流程', proofLabel: '责任交接', proofTitle: '每项决定都对应一份记录。',
    proofBody: '货物进入下一环节前，DDNZ 会记录已确认的范围、供应商或订单状态、已取得证据、待解决风险及下一责任方。',
    finalTitle: '从您已经掌握的信息开始。', finalBody: '提交产品、供应商或订单状态、目的市场和时间要求。首次审核会明确缺失信息与合适的控制路径。',
  },
  ru: {
    services: 'Услуги по закупкам', home: 'Главная', fieldEvidence: 'Разрешенные полевые материалы · Китай', fullProcess: 'Посмотреть полный процесс из шести этапов', proofLabel: 'Ответственная передача', proofTitle: 'Каждое решение связано с записью.',
    proofBody: 'До следующего этапа DDNZ фиксирует согласованный объем, статус поставщика или заказа, полученные доказательства, открытые риски и ответственную сторону.',
    finalTitle: 'Начните с уже известной информации.', finalBody: 'Укажите товар, поставщика или статус заказа, рынок назначения и сроки. Первая проверка определит недостающие данные и маршрут контроля.',
  },
  fr: {
    services: 'Services de sourcing', home: 'Accueil', fieldEvidence: 'Matériel terrain autorisé · origine Chine', fullProcess: 'Voir le processus complet en six étapes', proofLabel: 'Transmission responsable', proofTitle: 'Chaque décision reste liée à une preuve.',
    proofBody: 'Avant l’étape suivante, DDNZ consigne le périmètre convenu, le statut du fournisseur ou de la commande, les preuves reçues, les risques ouverts et le prochain responsable.',
    finalTitle: 'Commencez avec les informations disponibles.', finalBody: 'Envoyez le produit, le fournisseur ou le statut de commande, le marché cible et le calendrier. La première revue précisera les informations manquantes.',
  },
  es: {
    services: 'Servicios de compra', home: 'Inicio', fieldEvidence: 'Material de campo autorizado · origen China', fullProcess: 'Ver el proceso completo de seis puntos', proofLabel: 'Entrega responsable', proofTitle: 'Cada decisión queda vinculada a un registro.',
    proofBody: 'Antes de avanzar, DDNZ registra el alcance acordado, el estado del proveedor o pedido, las pruebas recibidas, los riesgos abiertos y el siguiente responsable.',
    finalTitle: 'Empiece con la información que ya tiene.', finalBody: 'Envíe el producto, proveedor o estado del pedido, mercado de destino y plazo. La primera revisión identificará la información pendiente.',
  },
  ar: {
    services: 'خدمات التوريد', home: 'الرئيسية', fieldEvidence: 'مواد ميدانية مصرح بها · منشأ الصين', fullProcess: 'عرض المسار الكامل من ست نقاط', proofLabel: 'تسليم مسؤول', proofTitle: 'يبقى كل قرار مرتبطاً بسجل واضح.',
    proofBody: 'قبل انتقال البضائع للمرحلة التالية، تسجل DDNZ النطاق المتفق عليه وحالة المورد أو الطلب والأدلة المستلمة والمخاطر المفتوحة والطرف المسؤول التالي.',
    finalTitle: 'ابدأ بالمعلومات المتوفرة لديك.', finalBody: 'أرسل المنتج أو حالة المورد أو الطلب والسوق المستهدف والموعد. تحدد المراجعة الأولى المعلومات الناقصة ومسار الرقابة المناسب.',
  },
  pt: { services: 'Serviços de sourcing', home: 'Início', fieldEvidence: 'Material autorizado · Origem China', fullProcess: 'Ver o fluxo completo em seis pontos', proofLabel: 'Entrega responsável', proofTitle: 'Cada decisão permanece vinculada a um registro.', proofBody: 'Antes de avançar, a DDNZ registra o escopo, situação do fornecedor ou pedido, evidências, riscos abertos e o próximo responsável.', finalTitle: 'Comece com o que você já sabe.', finalBody: 'Envie o produto, situação do fornecedor ou pedido, destino e prazo. A primeira análise identificará as informações ausentes e o caminho de controle.' },
  tr: { services: 'Tedarik hizmetleri', home: 'Ana sayfa', fieldEvidence: 'Yetkili saha materyali · Çin çıkışı', fullProcess: 'Altı kontrol noktalı tam süreci görün', proofLabel: 'Sorumlu teslim', proofTitle: 'Her karar bir kayda bağlı kalır.', proofBody: 'Ürün ilerlemeden önce DDNZ; kapsamı, tedarikçi veya sipariş durumunu, kanıtları, açık riskleri ve sonraki sorumluyu kaydeder.', finalTitle: 'Bildiğiniz bilgilerle başlayın.', finalBody: 'Ürünü, tedarikçi veya sipariş durumunu, varış pazarını ve zamanı paylaşın. İlk inceleme eksik bilgileri ve doğru kontrol yolunu belirler.' },
};

const serviceConfig: Record<SourcingServiceKind, {
  image: string;
  imageAlt: string;
  icon: typeof SearchCheck;
  intent: QuoteIntent;
  quoteSource: string;
  canonicalSlug: string;
}> = {
  'supplier-search': {
    image: '/media/process/supplier-visit-speaker.webp',
    imageAlt: 'Buyer and supplier representatives reviewing speaker products during a China showroom visit',
    icon: SearchCheck,
    intent: 'Product Sourcing',
    quoteSource: 'supplier_search_service',
    canonicalSlug: 'supplier-search',
  },
  'inspection-quality-control': {
    image: '/media/process/packaging-inspection.webp',
    imageAlt: 'Opened speaker package showing product, manual, accessories and protective packing during a visible pack-out check',
    icon: ClipboardCheck,
    intent: 'Supplier Inspection & Consolidation',
    quoteSource: 'quality_control_service',
    canonicalSlug: 'inspection-quality-control',
  },
  'consolidation-export': {
    image: '/media/process/export-loading-poster.webp',
    imageAlt: 'Wooden-crated cargo being moved by pallet jack during China loading preparation',
    icon: Boxes,
    intent: 'Supplier Inspection & Consolidation',
    quoteSource: 'consolidation_export_service',
    canonicalSlug: 'consolidation-export',
  },
};

const localePrefix: Record<Language, string> = { en: '', zh: '/zh-cn', ru: '/ru', fr: '/fr', es: '/es', ar: '/ar', pt: '/pt', tr: '/tr' };
const sequenceIcons = [FileSearch, Factory, Camera, PackageCheck];
const processLabels: Record<Language, string> = { en: 'Process', zh: '流程', ru: 'Процесс', fr: 'Processus', es: 'Proceso', ar: 'العملية', pt: 'Processo', tr: 'Süreç' };
const lclLinks: Record<Language, { title: string; link: string }> = {
  en: { title: 'Cargo ready and only need LCL freight?', link: 'Explore LCL costs, packing and delivery →' },
  zh: { title: '货物已备好，只需要安排拼箱运输？', link: '查看 LCL 拼箱费用、包装与交付 →' },
  ru: { title: 'Груз готов и нужна только сборная перевозка?', link: 'Стоимость, упаковка и доставка LCL →' },
  fr: { title: 'Fret prêt et besoin uniquement d’un LCL ?', link: 'Voir coûts, emballage et livraison LCL →' },
  es: { title: '¿Carga lista y solo necesitas transporte LCL?', link: 'Ver costos, embalaje y entrega LCL →' },
  ar: { title: 'البضاعة جاهزة وتحتاج شحناً مجمعاً فقط؟', link: 'استكشف تكاليف وتعبئة وتسليم LCL ←' },
  pt: { title: 'Carga pronta e precisa apenas de frete LCL?', link: 'Ver custos, embalagem e entrega LCL →' },
  tr: { title: 'Yük hazır ve yalnızca LCL taşıma mı gerekiyor?', link: 'LCL maliyet, ambalaj ve teslimatı inceleyin →' },
};

export default function SourcingServicePage({ kind }: { kind: SourcingServiceKind }) {
  const { language } = useLanguage();
  const location = useLocation();
  const aligned = new URLSearchParams(location.search).get('review') !== 'baseline';
  const copy = serviceCopy[kind][language];
  const shared = sharedCopy[language];
  const config = serviceConfig[kind];
  const ServiceIcon = config.icon;
  const quoteHref = buildQuoteHref({ intent: config.intent, language, source: config.quoteSource });
  const canonicalPath = `${localePrefix[language]}/sourcing-services/${config.canonicalSlug}`;
  const processPath = `${localePrefix[language]}/how-we-work`;

  const title = language === 'zh'
    ? `${copy.eyebrow} | DDNZ Global`
    : language === 'ru'
      ? `${copy.eyebrow} в Китае | DDNZ Global`
      : language === 'fr'
        ? `${copy.eyebrow} en Chine | DDNZ Global`
        : language === 'es'
          ? `${copy.eyebrow} en China | DDNZ Global`
          : language === 'ar'
            ? `${copy.eyebrow} في الصين | DDNZ Global`
            : language === 'pt'
              ? `${copy.eyebrow} na China | DDNZ Global`
              : language === 'tr'
                ? `Çin’de ${copy.eyebrow.toLocaleLowerCase('tr-TR')} | DDNZ Global`
                : `${copy.eyebrow} from China | DDNZ Global`;
  const description = copy.intro;

  return (
    <div className={`ddnz-home min-h-screen overflow-x-hidden bg-[#fbfaf7] text-[var(--ddnz-ink)] ${aligned ? 'sd-aligned' : ''}`} dir={language === 'ar' ? 'rtl' : undefined}>
      <SEO
        title={title}
        description={description}
        keywords={`${copy.eyebrow}, China sourcing service, supplier control China, DDNZ Global`}
        canonicalPath={canonicalPath}
        image={config.image}
      />
      <SchemaMarkup type="Service" data={{
        name: copy.eyebrow,
        serviceType: copy.eyebrow,
        description,
        areaServed: 'Global',
        offerUrl: `https://www.ddnzglobal.com${quoteHref}`,
        offerDescription: copy.cta,
        url: `https://www.ddnzglobal.com${canonicalPath}`,
        providerName: 'DDNZ Global Trade Co., Ltd.',
      }} />
      <SchemaMarkup type="BreadcrumbList" data={{ items: [
        { name: shared.home, url: `https://www.ddnzglobal.com${localePrefix[language] || '/'}` },
        { name: copy.eyebrow, url: `https://www.ddnzglobal.com${canonicalPath}` },
      ] }} />

      <SourcingHomepageNav />

      <main>
        {import.meta.env.DEV && <div className="sd-review-bar">
          <span>独立预览 · 三个服务详情页风格统一 · 未上线</span>
          <Link to={`${location.pathname}${aligned ? '?review=baseline' : '?review=candidate'}`}>{aligned ? '对照原版' : '查看新版'}</Link>
        </div>}
        <header className="sd-hero relative overflow-hidden bg-[var(--ddnz-ink)] text-white">
          <div className="sd-hero-wash absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(118,60,156,.34),transparent_35rem),radial-gradient(circle_at_92%_88%,rgba(201,79,47,.24),transparent_28rem)]" aria-hidden="true" />
          <div className="sd-hero-inner relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.75fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-300">
                <Link to={localePrefix[language] || '/'} className="hover:text-white">{shared.home}</Link>
                <span aria-hidden="true">/</span><Link to={`${localePrefix[language]}/sourcing-services/`}>{shared.services}</Link>
              </nav>
              <div className="mt-8"><DdnzEyebrow icon={ServiceIcon} dark={!aligned}>{copy.eyebrow}</DdnzEyebrow></div>
              <h1 className="mt-5 max-w-[18ch] text-[clamp(2.5rem,5.5vw,4.75rem)] font-black leading-[1.02] tracking-[-0.055em] text-balance">{copy.title}</h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-200 sm:text-lg">{copy.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <DdnzPrimaryLink
                  to={quoteHref}
                  onClick={() => trackEvent('quote_click', { cta_location: `${config.quoteSource}_hero`, lead_goal: config.intent })}
                  tracking
                >
                  {copy.cta}
                </DdnzPrimaryLink>
                <DdnzSecondaryLink to="#service-scope" className="border-white/30 text-white hover:bg-white/10">{copy.outputTitle}</DdnzSecondaryLink>
              </div>
            </div>

            {aligned && kind === 'supplier-search' ? <SupplierFieldPreview image={config.image} alt={config.imageAlt} /> : aligned ? <ServiceVisual inspection={kind === 'inspection-quality-control'} /> : <figure className="sd-photo relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-[0_24px_70px_rgba(0,0,0,.35)]">
              <div className="sd-photo-frame aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5]">
                <img src={config.image} alt={config.imageAlt} width="1200" height="1200" fetchPriority="high" className="h-full w-full object-cover" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#09182a] via-[#09182a]/78 to-transparent px-5 pb-5 pt-20 text-xs font-semibold leading-5 text-slate-200">
                {shared.fieldEvidence} · {copy.eyebrow}
              </figcaption>
            </figure>}
          </div>
        </header>
        {aligned && <nav className="sd-service-nav" aria-label={shared.services}>
          <Link to={`${localePrefix[language]}/sourcing-services/`}>{shared.services} ↗</Link>
          {(Object.keys(serviceConfig) as SourcingServiceKind[]).map((service) => <Link key={service} aria-current={kind === service ? 'page' : undefined} to={`${localePrefix[language]}/sourcing-services/${service}/`}>{serviceCopy[service][language].eyebrow}</Link>)}
        </nav>}

        <section id="service-scope" className="scroll-mt-24 border-b border-slate-200 bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-purple-strong)]">01 · {copy.useTitle}</p>
              <h2 className="mt-4 max-w-lg text-3xl font-black tracking-[-0.035em] sm:text-4xl">{copy.useTitle}</h2>
              <ul className="mt-7 space-y-5">
                {copy.useCases.map((item) => <li key={item} className="flex gap-3 text-sm font-semibold leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ddnz-purple)]" aria-hidden="true" />{item}</li>)}
              </ul>
            </div>
            <div className="sd-output border-t-4 border-[var(--ddnz-coral)] bg-[#fff8f4] p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-coral-strong)]">02 · {copy.outputTitle}</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.035em]">{copy.outputTitle}</h2>
              <ul className="mt-7 divide-y divide-[#edd8cf]">
                {copy.outputs.map((item, index) => <li key={item} className="flex gap-4 py-4 text-sm font-bold leading-6 text-slate-800"><span className="font-mono text-xs text-[var(--ddnz-coral-strong)]">0{index + 1}</span>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {aligned && (kind === 'consolidation-export' && language === 'zh' ? <FclSpeakerCaseZh quoteHref={quoteHref} /> : <ServiceCaseDetail kind={kind} quoteHref={quoteHref} />)}

        <section className="sd-process bg-[#eef2f6] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-purple-strong)]">03 · {processLabels[language]}</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-[-0.035em] sm:text-4xl">{copy.sequenceTitle}</h2>
            <ol className="mt-10 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-4">
              {copy.sequence.map((item, index) => {
                const Icon = sequenceIcons[index] || ShieldCheck;
                return <li key={item.title} className="bg-white p-6 sm:p-7">
                  <div className="flex items-center justify-between"><Icon className="h-6 w-6 text-[var(--ddnz-purple)]" aria-hidden="true" /><span className="font-mono text-xs font-black text-slate-400">0{index + 1}</span></div>
                  <h3 className="mt-8 text-lg font-black">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
                </li>;
              })}
            </ol>
            <Link
              to={processPath}
              className="mt-6 inline-flex min-h-11 items-center text-sm font-black text-[var(--ddnz-purple-strong)] underline decoration-transparent underline-offset-4 transition hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ddnz-purple)]"
            >
              {shared.fullProcess} <span aria-hidden="true" className="ml-2 rtl:ml-0 rtl:mr-2">→</span>
            </Link>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.78fr_1.22fr] lg:items-center lg:px-8">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]"><BadgeCheck className="h-6 w-6" aria-hidden="true" /></span>
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-purple-strong)]">{shared.proofLabel}</p><h2 className="mt-2 text-2xl font-black tracking-tight">{shared.proofTitle}</h2></div>
            </div>
            <p className="border-l border-slate-300 pl-6 text-base leading-8 text-slate-600 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6">{shared.proofBody}</p>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-[var(--ddnz-purple-soft)] py-14">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <ShieldCheck className="mx-auto h-8 w-8 text-[var(--ddnz-purple-strong)]" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-black sm:text-3xl">{copy.boundaryTitle}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-700">{copy.boundary}</p>
          </div>
        </section>

        {kind === 'consolidation-export' && <section className="mx-auto max-w-7xl px-6 py-12"><h2 className="text-2xl font-bold">{lclLinks[language].title}</h2><Link className="mt-5 inline-block font-bold underline underline-offset-4" to={`${localePrefix[language]}/services/lcl-shipping-from-china/`}>{lclLinks[language].link}</Link></section>}
        <section className="sd-final bg-[var(--ddnz-ink)] py-16 text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div><h2 className="text-3xl font-black tracking-[-0.035em]">{shared.finalTitle}</h2><p className="mt-3 max-w-3xl leading-7 text-slate-300">{shared.finalBody}</p></div>
            <DdnzPrimaryLink
              to={quoteHref}
              onClick={() => trackEvent('quote_click', { cta_location: `${config.quoteSource}_final`, lead_goal: config.intent, path: location.pathname })}
              className="shrink-0 focus-visible:outline-white"
              tracking
            >
              {copy.cta}
            </DdnzPrimaryLink>
          </div>
        </section>
        {kind === 'consolidation-export' && <OperationsEvidence receiving locale={language} />}
      </main>

      <Footer />
    </div>
  );
}
