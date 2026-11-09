import { CENTRAL_ASIA_DATA } from '../features/freight/centralAsiaCountryData';
import { resolveEurasiaIntro } from '../features/freight/eurasiaPageIntro';
import CentralAsiaRouteOptions from '../features/freight/CentralAsiaRouteOptions';
import { centralAsiaCountryHero } from '../features/freight/centralAsiaCountryHero';
import '../features/freight/central-asia-country-preview.css';
import FreightBreadcrumbs from '../features/freight/FreightBreadcrumbs';
import RussiaOverlayHero from '../features/freight/RussiaOverlayHero';
import CountryRegionalReference from '../features/freight/CountryRegionalReference';
import FreightRelatedLinks from '../features/freight/FreightRelatedLinks';
import '../features/freight/freight.css';
import RoutePlanningDepth, { routePlanningUi } from '../features/freight/RoutePlanningDepth';
import freightFactLabels from '../features/freight/freightFactLabels.json';
import CountryCargoPlanning from '../features/freight/CountryCargoPlanning';
import { useState, useEffect, type CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import GetAQuote from '../components/GetAQuote';
import MarketSourcingHandoff from '../components/MarketSourcingHandoff';
import FreightRouteMap from '../components/FreightRouteMap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, AlertTriangle, Package, ShieldCheck,
  Search, ArrowRight, CheckCircle2, ShieldAlert,
  Globe, HelpCircle, Truck, FileText, Scale, ArrowUpRight, Timer, Target, Lightbulb, TrainFront, Route, Plane
} from 'lucide-react';
import { trackEvent } from '../lib/utils';
import { buildShippingCountryPath, getShippingCountrySlug } from '../utils/shippingCountryRoutes';
import { createLocalizedShippingRedlines } from '../utils/localizedShippingContent';
import {
  buildSupplementalCorridorSpec,
  EURASIA_CASE_IMAGES,
  EURASIA_CHEMICAL_CASE,
  EURASIA_CHEMICAL_CASE_IMAGES,
  EURASIA_CORRIDORS,
  EURASIA_COUNTRIES,
  EURASIA_DELAY_DIAGNOSTIC,
  EURASIA_UI,
  EURASIA_WHEEL_HUB_CASE,
  EURASIA_WHEEL_HUB_DESTINATION,
  UZBEKISTAN_ROAD_CASE,
  UZBEKISTAN_ROAD_CASE_IMAGES,
  type EurasiaCountry,
  type EurasiaLocale,
  localizedCorridorProfile,
  localizedCountryName,
} from '../features/freight/eurasiaCorridors';

// Multi-language strings for Central Asia countries


const UNIVERSAL_REDLINES = {
  en: {
    title: "Russia and Central Asia Shipment Planning Checklist",
    subtitle: "Confirm the commercial, loading, corridor and destination-delivery scope before dispatching Eurasia cargo.",
    items: [
      {
        id: "01",
        title: "Confirm Customs and Settlement Scope",
        desc: "Define the responsibilities for transport, customs handling, taxes, and settlement in the quotation and contract. The importer should confirm applicable destination requirements."
      },
      {
        id: "02",
        title: "Border Waiting and Axle-Weight Review",
        desc: "Confirm how border waiting, vehicle axle limits, and loading data are handled. Review weights and loading plans against the vehicle, cargo, and route before dispatch."
      },
      {
        id: "03",
        title: "Define Door-to-Door Delivery Boundaries",
        desc: "Confirm whether the service includes the unloading point, handling equipment, local delivery, and destination customs responsibilities."
      }
    ]
  },
  zh: {
    title: "俄罗斯与中亚出运操作核对清单",
    subtitle: "在出运前确认结算、装载、运输通道和目的地交付边界，有助于规划更清晰的跨境运输安排。",
    items: [
      {
        id: "01",
        title: "确认清关与结算服务范围",
        desc: "在报价和合同中明确运输、清关、税费与结算的责任边界，并由进口方确认目的地适用要求。"
      },
      {
        id: "02",
        title: "口岸等待与轴重配载核对",
        desc: "确认口岸等待、车辆轴重和配载资料的处理方式；装车前应结合车辆、货物和路线复核重量安排。"
      },
      {
        id: "03",
        title: "明确门到门交付边界",
        desc: "确认目的地卸货点、装卸设备、当地配送和清关责任是否包含在服务范围中。"
      }
    ]
  },
  ru: {
    title: "Руководство по предотвращению рисков в Центральной Азии",
    subtitle: "Ключевые рекомендации для предотвращения непредвиденных расходов, задержек и штрафов на дорогах в двойных сухопутных странах.",
    items: [
      {
        id: "01",
        title: "Откажитесь от серых схем растаможки, зафиксируйте контракт",
        desc: "Скажите нет серым схемам таможенного оформления, которые предлагают цену на 30% ниже рыночной. Фиксируйте валюту контракта в долларах США или юанях, чтобы предотвратить манипуляции с курсами местных валют (тенге/сум) и скрытые комиссии."
      },
      {
        id: "02",
        title: "Наш собственный склад в Гуанчжоу (18 лет в собственности)",
        desc: "Идеальный хаб для сборных грузов из Китая. Мы бесплатно принимаем товары от ваших поставщиков с Alibaba и 1688, проводим инспекцию качества, надежно упаковываем и формируем контейнеры под ключ."
      },
      {
        id: "03",
        title: "Условия доставки уточняются",
        desc: "Четко определите границы доставки. Откажитесь от ложных схем доставки, когда грузовики останавливаются за пределами городской черты, заставляя клиентов самостоятельно арендовать автопогрузчики и местный транспорт."
      }
    ]
  }
};

const CENTRAL_ASIA_LOCALIZED = CENTRAL_ASIA_DATA as Record<string, any>;
for (const locale of ['fr', 'es', 'ar'] as const) {
  CENTRAL_ASIA_LOCALIZED.kazakhstan[locale] = buildSupplementalCorridorSpec('kazakhstan', locale);
  CENTRAL_ASIA_LOCALIZED.uzbekistan[locale] = buildSupplementalCorridorSpec('uzbekistan', locale);
  (UNIVERSAL_REDLINES as Record<string, any>)[locale] = createLocalizedShippingRedlines(locale);
}
(UNIVERSAL_REDLINES as Record<string, any>).ru = createLocalizedShippingRedlines('ru');

for (const country of ['russia', 'kyrgyzstan', 'tajikistan', 'turkmenistan'] as const) {
  CENTRAL_ASIA_LOCALIZED[country] = {};
  for (const locale of ['en', 'zh', 'ru', 'fr', 'es', 'ar'] as const) {
    CENTRAL_ASIA_LOCALIZED[country][locale] = buildSupplementalCorridorSpec(country, locale);
  }
}

const PAGE_LANG_DATA: Record<string, Record<string, any>> = {
  en: {
    heroTag: "CHINA TO RUSSIA AND CENTRAL ASIA",
    heroCta: "Get Route & Tariff Guidance",
    insureText: "Established in 1997 · China-origin logistics support",
    insightTag: "Border Operational Notice",
    insightTitle: "Horgos & Alashankou Gauge Reloading: Standard to Russian Broad Gauge",
    insightContent: "Central Asia uses a 1520mm broad-gauge railway system, while China uses 1435mm standard gauge. Containers transfer at border ports such as Horgos and Alashankou. Seasonal congestion can affect the schedule, so rail and trucking alternatives should be assessed against the cargo plan.",
    faqHeading: "Russia and Central Asia Route Checklist & FAQ",
    faqSubheading: "Shipment-level document, corridor and delivery checks for Russia and five Central Asian destinations.",
    formTitle: "Russia and Central Asia Shipping Inquiry",
    formSub: "Submit your cargo details. Our route team will confirm the information needed to prepare a tailored quotation.",
    formLabelName: "Your Name",
    formLabelEmail: "Email Address",
    formLabelPhone: "WhatsApp / Phone",
    formLabelGoods: "Type of Goods / Volume",
    formLabelDest: "Destination",
    formCta: "Calculate My Shipping Tariff",
    formSuccess: "Thank you. Our Eurasia route team will review the cargo details and contact you using the information provided."
  },
  zh: {
    heroTag: "中国至俄罗斯与中亚五国",
    heroCta: "获取航线与税费规划建议",
    insureText: "中国始发物流协调支持",
    insightTag: "口岸边境换轨通报",
    insightTitle: "硬核科普：1435mm 标准轨 ➔ 1520mm 宽轨物理大换装",
    insightContent: "由于中亚五国与俄罗斯普遍采用 1520mm 宽轨，而中国境内使用 1435mm 标准轨，部分铁路通道需要在边境站换装。口岸作业、旺季拥堵和后续编组都可能影响时效，因此铁路与公路备选路线应结合具体货物评估。",
    faqHeading: "俄罗斯与中亚线路审核及常见问题",
    faqSubheading: "按具体货物核对俄罗斯及中亚五国的单证、运输通道和交付边界。",
    formTitle: "俄罗斯与中亚物流询价",
    formSub: "请填写货物信息；我们将根据路线、货物和服务范围准备相应的询价建议。",
    formLabelName: "您的姓名",
    formLabelEmail: "电子邮箱",
    formLabelPhone: "联系电话 / 微信 / WhatsApp",
    formLabelGoods: "货物类型 / 件数 / 重量体积",
    formLabelDest: "目的国",
    formCta: "提交询价",
    formSuccess: "提交成功。我们的欧亚线路团队将核对货物信息，并通过您提供的联系方式回复。"
  },
  ru: {
    heroTag: "КИТАЙ - РОССИЯ И ЦЕНТРАЛЬНАЯ АЗИЯ",
    heroCta: "Получить маршрут и тарифный ориентир",
    insureText: "Координация логистики с отправлением из Китая",
    insightTag: "Пограничное уведомление по операциям",
    insightTitle: "Смена колеи в Хоргосе и Алашанькоу: со стандартной на широкую русскую колею",
    insightContent: "В Центральной Азии используется широкая колея 1520 мм, а в Китае стандартная 1435 мм. Из-за этой разницы контейнеры перегружаются на пограничных станциях, включая Хоргос и Алашанькоу. Сезонная загрузка и работа границы учитываются при выборе железнодорожного или автомобильного маршрута.",
    faqHeading: "Проверка маршрута и FAQ по России и Центральной Азии",
    faqSubheading: "Проверяем документы, коридор и границы доставки для России и пяти стран Центральной Азии.",
    formTitle: "Запрос тарифа в Россию и Центральную Азию",
    formSub: "Заполните данные о грузе. Команда маршрута уточнит информацию, необходимую для подготовки котировки.",
    formLabelName: "Ваше имя",
    formLabelEmail: "Электронная почта",
    formLabelPhone: "WhatsApp / Телефон / Telegram",
    formLabelGoods: "Тип груза / Объем / Вес",
    formLabelDest: "Пункт назначения",
    formCta: "Рассчитать мой тариф на доставку",
    formSuccess: "Спасибо. Наша команда по России и Центральной Азии проверит данные и свяжется с вами."
  }
};

Object.assign(PAGE_LANG_DATA, {
  fr: {
    ...PAGE_LANG_DATA.en,
    heroTag: "SPÉCIALISTE CHINE-ASIE CENTRALE",
    heroCta: "Obtenir une analyse d’itinéraire et de tarif",
    insureText: "Coordination logistique au départ de Chine depuis 1997",
    insightTag: "Alerte opérations frontalières",
    insightTitle: "Khorgos et Alashankou : passage de la voie standard à la voie large",
    insightContent: "La Chine utilise une voie de 1435 mm et l’Asie centrale une voie de 1520 mm. Le transbordement aux postes frontaliers doit être intégré au calendrier, notamment en haute saison.",
    faqHeading: "Revue de route et FAQ Russie-Asie centrale",
    faqSubheading: "Contrôles des documents, du corridor et de la livraison pour la Russie et cinq pays d’Asie centrale.",
    formTitle: "Demande de cotation Russie-Asie centrale",
    formSub: "Transmettez les caractéristiques du fret afin de confirmer l’itinéraire et les éléments nécessaires au devis.",
    formLabelName: "Nom",
    formLabelEmail: "E-mail",
    formLabelPhone: "WhatsApp / Téléphone",
    formLabelGoods: "Type de marchandise / Volume / Poids",
    formLabelDest: "Destination",
    formCta: "Calculer mon tarif",
    formSuccess: "Merci. Notre équipe Russie-Asie centrale examinera les informations et vous contactera.",
  },
  es: {
    ...PAGE_LANG_DATA.en,
    heroTag: "ESPECIALISTA CHINA-ASIA CENTRAL",
    heroCta: "Obtener análisis de ruta y tarifa",
    insureText: "Coordinación logística desde China desde 1997",
    insightTag: "Aviso de operación fronteriza",
    insightTitle: "Khorgos y Alashankou: cambio de vía estándar a vía ancha",
    insightContent: "China utiliza vía de 1435 mm y Asia Central vía de 1520 mm. El transbordo fronterizo debe incluirse en el calendario, especialmente en temporada alta.",
    faqHeading: "Revisión de ruta y preguntas frecuentes de Rusia y Asia Central",
    faqSubheading: "Controles de documentos, corredor y entrega para Rusia y los cinco países de Asia Central.",
    formTitle: "Solicitud de cotización para Rusia y Asia Central",
    formSub: "Envíe los datos de la carga para confirmar la ruta y la información necesaria para cotizar.",
    formLabelName: "Nombre",
    formLabelEmail: "Correo electrónico",
    formLabelPhone: "WhatsApp / Teléfono",
    formLabelGoods: "Tipo de mercancía / Volumen / Peso",
    formLabelDest: "Destino",
    formCta: "Calcular mi tarifa",
    formSuccess: "Gracias. Nuestro equipo de Rusia y Asia Central revisará los datos y se pondrá en contacto.",
  },
  ar: {
    ...PAGE_LANG_DATA.en,
    heroTag: "متخصص الشحن بين الصين وروسيا وآسيا الوسطى",
    heroCta: "الحصول على تحليل المسار والتعرفة",
    insureText: "تنسيق لوجستي من الصين منذ 1997",
    insightTag: "تنبيه العمليات الحدودية",
    insightTitle: "خورغوس وألاشانكو: الانتقال من السكة القياسية إلى السكة العريضة",
    insightContent: "تستخدم الصين سكة بعرض 1435 مم بينما تستخدم آسيا الوسطى 1520 مم. يجب احتساب إعادة التحميل على الحدود ضمن الجدول، خصوصاً في موسم الذروة.",
    faqHeading: "مراجعة المسار والأسئلة الشائعة لروسيا وآسيا الوسطى",
    faqSubheading: "مراجعة المستندات والممر ونطاق التسليم لروسيا ودول آسيا الوسطى الخمس.",
    formTitle: "طلب عرض شحن إلى روسيا وآسيا الوسطى",
    formSub: "أرسل بيانات البضائع لتأكيد المسار والمعلومات المطلوبة للتسعير.",
    formLabelName: "الاسم",
    formLabelEmail: "البريد الإلكتروني",
    formLabelPhone: "واتساب / الهاتف",
    formLabelGoods: "نوع البضائع / الحجم / الوزن",
    formLabelDest: "الوجهة",
    formCta: "حساب التعرفة",
    formSuccess: "شكراً. سيراجع فريق روسيا وآسيا الوسطى البيانات ويتواصل معك.",
  },
});

export default function ShippingCentralAsia() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const activeLang = (language === 'zh' ? 'zh' : language === 'ru' ? 'ru' : language === 'fr' ? 'fr' : language === 'es' ? 'es' : language === 'ar' ? 'ar' : 'en') as EurasiaLocale;
  const countryLabel = (country: EurasiaCountry) => localizedCountryName(country, activeLang);

  const getCountryFromLocation = () => getShippingCountrySlug(
    location.pathname,
    location.search,
    EURASIA_COUNTRIES,
    'kazakhstan',
  ) as EurasiaCountry;

  const [selectedCountry, setSelectedCountry] = useState<EurasiaCountry>(getCountryFromLocation);
  const [isLocked, setIsLocked] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTransportMode, setActiveTransportMode] = useState<number>(0);

  // Keep legacy query URLs working while preferring clean, indexable country paths.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lockParam = params.get('lock') === 'true' || params.get('locked') === 'true' || params.get('lockCountry') === 'true';
    setIsLocked(lockParam);

    const nextCountry = getCountryFromLocation();
    if (nextCountry !== selectedCountry) {
      setSelectedCountry(nextCountry);
    }
  }, [location.pathname, location.search, selectedCountry]);

  // Reset active transport mode when country changes to avoid index out of bounds
  useEffect(() => {
    setActiveTransportMode(0);
  }, [selectedCountry]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, selectedCountry]);

  const handleCountryTabChange = (country: EurasiaCountry) => {
    setSelectedCountry(country);
    navigate(buildShippingCountryPath(location.pathname, country));
  };

  const getCountrySpec = (country: EurasiaCountry) =>
    CENTRAL_ASIA_LOCALIZED[country][activeLang] || CENTRAL_ASIA_LOCALIZED[country].en;
  const routeDepthPreview = selectedCountry === 'uzbekistan';
  const spec = getCountrySpec(selectedCountry);
  const hero = centralAsiaCountryHero(selectedCountry, language);
  const pageIntro = resolveEurasiaIntro(selectedCountry, language)!;
  // Verified origin records are decoration here; the case sections explain their scope.
  const originPhoto = selectedCountry === 'kazakhstan'
    ? '/images/operations/central-asia-wheel-hub-case-forklift.webp'
    : selectedCountry === 'uzbekistan'
      ? '/images/operations/central-asia-uzbekistan-road-loading-overview.webp'
      : null;
  const isKyrgyzstanEn = selectedCountry === 'kyrgyzstan' && language === 'en';
  const isTajikistanRu = selectedCountry === 'tajikistan' && language === 'ru';
  const isKazakhstanRu = selectedCountry === 'kazakhstan' && language === 'ru';
  const isRussiaRu = selectedCountry === 'russia' && language === 'ru';
  const corridor = localizedCorridorProfile(selectedCountry, activeLang);
  const corridorUi = EURASIA_UI[activeLang];
  const delayDiagnostic = EURASIA_DELAY_DIAGNOSTIC[activeLang];
  const caseStudy = EURASIA_WHEEL_HUB_CASE[activeLang];
  const chemicalCase = EURASIA_CHEMICAL_CASE[activeLang];
  const uzbekistanRoadCase = UZBEKISTAN_ROAD_CASE[activeLang];
  const t = (key: string) => {
    if (key === 'insureText') return (freightFactLabels[activeLang as keyof typeof freightFactLabels] || freightFactLabels.en).originCoordination;
    const data = PAGE_LANG_DATA[activeLang] || PAGE_LANG_DATA.en;
    return data[key] || '';
  };

  const getLocalizedPath = (path: string) => {
    if (language === 'en') return path;
    const langPrefix = language === 'zh' ? 'zh-cn' : language;
    return `/${langPrefix}${path === '/' ? '' : path}`;
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-[#c94f2f] shrink-0" />;
      case 'Scale': return <Scale className="w-5 h-5 text-[#c94f2f] shrink-0" />;
      case 'FileText': return <FileText className="w-5 h-5 text-[#c94f2f] shrink-0" />;
      case 'Search': return <Search className="w-5 h-5 text-[#c94f2f] shrink-0" />;
      default: return <Package className="w-5 h-5 text-[#c94f2f] shrink-0" />;
    }
  };

  const transportIcons = [TrainFront, Truck, Route, Plane];

  // Form submission state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goods: '',
    destination: 'Kazakhstan'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      destination: countryLabel(selectedCountry)
    }));
  }, [selectedCountry, language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    trackEvent('quote_form_submit_attempt', {
      form_location: 'central_asia_country_page',
      country: selectedCountry,
      service: 'land_freight',
    });

    // Simulate reliable submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        goods: '',
        destination: countryLabel(selectedCountry)
      });
    }, 1200);
  };

  const redlines = UNIVERSAL_REDLINES[activeLang] || UNIVERSAL_REDLINES.en;

  return (
    <div className={`ddnz-home min-h-screen hb-region-shell font-sans overflow-x-hidden country-editorial country-editorial--legacy`}>
      <SEO title={spec.seoTitle} description={spec.seoDesc} />
      <SchemaMarkup
        type="Service"
        data={{
          name: spec.seoTitle,
          serviceType: `Freight forwarding from China to ${countryLabel(selectedCountry)}`,
          areaServed: { '@type': 'Country', name: countryLabel(selectedCountry) },
          description: spec.seoDesc,
          url: `https://www.ddnzglobal.com${location.pathname}`
        }}
      />
      <SourcingHomepageNav showFreightExecutor />

      <main>

        {selectedCountry === 'russia' && language === 'zh' ? <RussiaOverlayHero breadcrumb={<FreightBreadcrumbs path="/shipping-from-china-to-russia/" locale={language} className="russia-overlay-hero__breadcrumb" />} title={pageIntro.headline} intro={pageIntro.subheadline} onQuote={() => document.getElementById('central-asia-quote-form')?.scrollIntoView({behavior:'smooth'})}>
          {!isLocked && <nav aria-label={corridorUi.selectDestination}><span>{corridorUi.selectDestination}</span><div>{EURASIA_COUNTRIES.map(country => <button key={country} type="button" aria-current={country === selectedCountry ? 'page' : undefined} onClick={()=>handleCountryTabChange(country)}>{countryLabel(country)}</button>)}</div></nav>}
          <h2>{corridorUi.routeBasis} · {corridor.name}</h2>
          <dl><div><dt>{corridorUi.entryGateway}</dt><dd>{corridor.gateway}</dd></div><div><dt>{corridorUi.destinationScope}</dt><dd>{corridor.destinations}</dd></div><div><dt>{corridorUi.customsFrame}</dt><dd>{corridor.customs}</dd></div></dl>
          <p className="russia-overlay-facts__note">{corridorUi.quoteConfirmed}</p>
        </RussiaOverlayHero> : <>
        <section className={`eurasia-country-intro relative flex items-center overflow-hidden border-b border-white/[0.08] ${hero ? 'central-asia-country-hero' : ''}`}>
          {originPhoto && <div
            className="eurasia-country-intro__media"
            aria-hidden="true"
            style={{ '--eurasia-origin-photo': `url("${originPhoto}")` } as CSSProperties}
          />}

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            {!isLocked && (
              <nav aria-label={corridorUi.selectDestination} className="mb-9 border-y border-white/[0.12] py-3">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-[#f2a47f]">{corridorUi.selectDestination}</span>
                <div className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {EURASIA_COUNTRIES.map((country) => {
                    const isActive = selectedCountry === country;
                    return (
                      <button
                        key={country}
                        type="button"
                        onClick={() => handleCountryTabChange(country)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`min-h-11 shrink-0 px-4 py-2 text-xs font-extrabold transition-colors ${isActive ? 'bg-[#c94f2f] text-white' : 'bg-[#071a33]/72 text-slate-200 hover:bg-white/10 hover:text-white'}`}
                      >
                        {countryLabel(country)}
                      </button>
                    );
                  })}
                </div>
              </nav>
            )}

            <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,.88fr)]">
              <div className="max-w-3xl text-left">
                <FreightBreadcrumbs
                  path={`/shipping-from-china-to-${selectedCountry}/`}
                  locale={language}
                  className="mb-4 text-sm leading-relaxed text-slate-300 [&_a]:underline [&_a:hover]:text-white"
                />
                <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-[#f2a47f]">{isTajikistanRu ? 'Доставка грузов из Китая в Таджикистан' : corridorUi.regionTag}</p>
                <h1 className="max-w-[16ch] text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                  {pageIntro.headline}
                </h1>
                <p className="mt-6 max-w-[60ch] text-base font-medium leading-relaxed text-slate-200 sm:text-lg">
                  {pageIntro.subheadline}
                </p>
                {isRussiaRu && <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-slate-200">
                  Для расчёта доставки до двери укажите описание груза, вес, объём и адрес получателя. Heaven Born проверит, возможны ли условия DDP или DAP для вашего груза, и уточнит, что входит в стоимость.
                </p>}
                {isKyrgyzstanEn && <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-slate-200">
                  For an estimate, share your origin city in China, destination in Kyrgyzstan, cargo type, gross weight and volume. Ask us to confirm whether DDP is available for your shipment.
                </p>}
                {isTajikistanRu && <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-slate-200">
                  Для предварительной оценки укажите город отправления в Китае, город назначения в Таджикистане, тип груза, вес и объём.
                </p>}
                {isKazakhstanRu && <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-slate-200">
                  Для предварительной оценки укажите город отправления в Китае, город назначения в Казахстане, тип груза, вес и объём.
                </p>}
                <button
                  type="button"
                  onClick={() => {
                    const quote = document.getElementById('central-asia-quote-form');
                    if (hero) quote?.focus({ preventScroll: true });
                    quote?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-8 inline-flex min-h-12 items-center gap-2 bg-[#c94f2f] px-6 py-3 text-sm font-black text-white transition hover:bg-[#b94625] active:translate-y-px"
                >
                  <span>{isKazakhstanRu ? 'Запросить маршрут и оценку стоимости' : t('heroCta')}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <aside className="border border-white/[0.14] bg-[#071a33]/88 p-6 shadow-[0_24px_80px_rgba(2,12,27,.35)] backdrop-blur-md sm:p-7" aria-label={corridorUi.routeBasis}>
                <div className="flex items-start justify-between gap-5 border-b border-white/[0.12] pb-5">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#f2a47f]">{corridorUi.routeBasis}</span>
                    <h2 className="mt-2 text-2xl font-black text-white">{corridor.name}</h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-sm font-bold text-white"><Timer className="h-4 w-4 text-[#f2a47f]" aria-hidden="true" />{routeDepthPreview ? routePlanningUi(activeLang)[2] : corridor.transitDays}</span>
                </div>
                <dl className="divide-y divide-white/[0.1]">
                  <div className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:gap-5"><dt className="text-xs font-bold text-slate-400">{corridorUi.entryGateway}</dt><dd className="text-sm font-semibold leading-relaxed text-white">{corridor.gateway}</dd></div>
                  <div className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:gap-5"><dt className="text-xs font-bold text-slate-400">{corridorUi.destinationScope}</dt><dd className="text-sm font-semibold leading-relaxed text-white">{corridor.destinations}</dd></div>
                  <div className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:gap-5"><dt className="text-xs font-bold text-slate-400">{corridorUi.customsFrame}</dt><dd className="text-sm font-semibold leading-relaxed text-white">{corridor.customs}</dd></div>
                </dl>
                <p className="border-t border-white/[0.12] pt-4 text-[11px] leading-relaxed text-slate-400">{corridorUi.quoteConfirmed}</p>
              </aside>
            </div>
          </div>
        </section>

        </>}

        <CentralAsiaRouteOptions locale={language} destination={selectedCountry} />
        {<RoutePlanningDepth country={selectedCountry} locale={activeLang}/>}
        <MarketSourcingHandoff compact destination={countryLabel(selectedCountry)} />

        {selectedCountry === 'uzbekistan' && <FreightRouteMap variant="uzbekistan" />}
        <CountryRegionalReference locale={activeLang} region="central-asia" />

        <section className="mx-auto max-w-7xl border-b border-slate-200 px-4 py-8 sm:px-6 lg:px-8">
          <details><summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-xl font-bold">{corridorUi.modesTitle}<span aria-hidden="true">▾</span></summary>
            <div className="mt-5 grid gap-5 md:grid-cols-2">{spec.multimodalTable?.map((row:any) => <article key={row.mode} className="border-t border-slate-300 py-4">
              <h3 className="font-bold">{row.mode}</h3><p className="mt-3 leading-7">{row.suitability}</p><p className="mt-2 leading-7">{row.sellingPoint}</p><p className="mt-2 leading-7">{row.warning}</p>
              <button type="button" className="mt-3 min-h-11 font-bold underline" onClick={()=>{document.getElementById('central-asia-quote-form')?.scrollIntoView({behavior:'smooth'});trackEvent('lead_table_cta_click',{mode:row.mode,selectedCountry});}}>{corridorUi.requestMode} ↗</button>
            </article>)}</div>
          </details>
        </section>

        {selectedCountry === 'uzbekistan' && (
          <section id="uzbekistan-road-loading-case" className="scroll-mt-24 border-b border-[#cfd6dc] bg-[#f3f1eb] py-16 text-[#10243f] md:py-24" aria-labelledby="uzbekistan-road-case-title">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b95732]">{uzbekistanRoadCase.routeLabel}</p>
                <h2 id="uzbekistan-road-case-title" className="mt-4 max-w-3xl text-3xl font-black leading-[1.05] tracking-[-0.045em] md:text-5xl">{uzbekistanRoadCase.title}</h2>
                <p className="mt-5 max-w-[68ch] text-base font-semibold leading-7 text-slate-700">{uzbekistanRoadCase.intro}</p>
                <p className="mt-3 max-w-[72ch] text-xs font-medium leading-6 text-slate-500">{uzbekistanRoadCase.evidenceNote}</p>
              </div>

              <ol className="mt-10 grid border-y border-[#bac4cc] md:grid-cols-3">
                {uzbekistanRoadCase.route.map((node, index) => (
                  <li key={node} className={`relative flex items-center gap-4 py-5 md:px-6 ${index > 0 ? 'border-t border-[#bac4cc] md:border-l md:border-t-0' : ''}`}>
                    <span className="font-mono text-xs font-black text-[#b95732]">0{index + 1}</span>
                    <span className="text-sm font-black">{node}</span>
                    {index < 2 && <ArrowRight className="absolute right-4 hidden h-4 w-4 text-[#b95732] md:block rtl:left-4 rtl:right-auto rtl:rotate-180" aria-hidden="true" />}
                  </li>
                ))}
              </ol>

              <div className="mt-10 grid gap-4 md:grid-cols-12">
                {UZBEKISTAN_ROAD_CASE_IMAGES.map((image, index) => (
                  <figure key={image.src} className={`${index === 0 ? 'md:col-span-8' : 'md:col-span-4'} flex flex-col border border-[#c7cfd5] bg-white`}>
                    <img
                      src={image.src}
                      alt={uzbekistanRoadCase.captions[image.key]}
                      width="1290"
                      height={index === 0 ? '952' : '1519'}
                      loading="lazy"
                      decoding="async"
                      className="h-[380px] w-full flex-1 object-cover md:h-[560px]"
                    />
                    <figcaption className="grid min-h-[74px] grid-cols-[34px_1fr] gap-3 border-t border-[#c7cfd5] px-4 py-4">
                      <span className="font-mono text-[10px] font-black text-[#b95732]">0{index + 1}</span>
                      <span className="text-xs font-semibold leading-5 text-slate-600">{uzbekistanRoadCase.captions[image.key]}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>

              <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,.62fr)_minmax(0,1.38fr)] lg:items-start">
                <div>
                  <Truck className="h-7 w-7 text-[#b95732]" aria-hidden="true" />
                  <h3 className="mt-5 text-2xl font-black leading-tight md:text-3xl">{uzbekistanRoadCase.processTitle}</h3>
                </div>
                <ol className="border-y border-[#bac4cc]">
                  {uzbekistanRoadCase.steps.map((step, index) => (
                    <li key={step} className="grid grid-cols-[42px_1fr] gap-4 border-b border-[#d2d8dd] py-4 last:border-b-0">
                      <span className="font-mono text-xs font-black text-[#b95732]">0{index + 1}</span>
                      <span className="text-sm font-bold leading-6 text-slate-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-12 grid bg-[#10243f] text-white lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,.65fr)] lg:items-center">
                <div className="p-6 md:p-8 lg:p-10">
                  <h3 className="max-w-3xl text-2xl font-black leading-tight md:text-3xl">{uzbekistanRoadCase.controlTitle}</h3>
                  <p className="mt-4 max-w-[72ch] text-sm font-semibold leading-7 text-slate-300">{uzbekistanRoadCase.controlBody}</p>
                </div>
                <div className="border-t border-white/[0.12] p-6 lg:border-l lg:border-t-0 lg:p-10 rtl:lg:border-l-0 rtl:lg:border-r">
                  <button type="button" onClick={() => document.getElementById('central-asia-quote-form')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#c94f2f] px-5 py-3 text-sm font-black text-white transition-colors hover:bg-[#b94625] active:scale-[0.98]">
                    {uzbekistanRoadCase.cta}<ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {(selectedCountry === 'kazakhstan' || selectedCountry === 'uzbekistan') && (
        <section className="border-b border-white/[0.08] bg-[#06172e] py-16 md:py-24" aria-labelledby="eurasia-case-title">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,.78fr)_minmax(0,1.22fr)] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f2a47f]">{EURASIA_WHEEL_HUB_DESTINATION[activeLang]}</p>
                <h2 id="eurasia-case-title" className="mt-4 text-3xl font-black leading-[1.06] tracking-[-0.045em] text-white md:text-5xl">{caseStudy.title}</h2>
              </div>
              <div>
                <p className="max-w-[64ch] text-base font-semibold leading-relaxed text-slate-200">{caseStudy.intro}</p>
                <p className="mt-3 max-w-[68ch] text-xs leading-relaxed text-slate-500">{caseStudy.evidenceNote}</p>
              </div>
            </div>

            <dl className="mt-12 grid border-y border-white/[0.14] sm:grid-cols-2 lg:grid-cols-5">
              {caseStudy.metrics.map((metric, index) => (
                <div key={metric.label} className={`py-6 sm:px-5 ${index > 0 ? 'border-t border-white/[0.12] sm:border-l sm:border-t-0' : ''}`}>
                  <dd className="font-mono text-lg font-black text-white md:text-xl">{metric.value}</dd>
                  <dt className="mt-2 text-xs font-bold leading-relaxed text-slate-400">{metric.label}</dt>
                </div>
              ))}
            </dl>

            <div className="mt-10 grid gap-4 md:grid-cols-12">
              {EURASIA_CASE_IMAGES.map((item, index) => (
                <figure key={item.src} className={`${index === 0 ? 'md:col-span-7 md:row-span-2' : index === 1 || index === 2 ? 'md:col-span-5' : 'md:col-span-6'} border border-white/[0.1] bg-white/[0.025]`}>
                  <img
                    src={item.src}
                    alt={caseStudy.captions[item.key]}
                    width="1400"
                    height="1867"
                    loading="lazy"
                    className={`w-full object-cover ${index === 0 ? 'h-[520px] md:h-[704px]' : 'h-[330px]'}`}
                  />
                  <figcaption className="border-t border-white/[0.1] px-4 py-3 text-xs font-semibold leading-relaxed text-slate-400">{caseStudy.captions[item.key]}</figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-10 grid border border-white/[0.12] bg-[#081E39] lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)]">
              <div className="border-b border-white/[0.12] p-6 md:p-8 lg:border-b-0 lg:border-r">
                <h3 className="text-xl font-black text-white">{caseStudy.serviceTitle}</h3>
                <p className="mt-5 border-l-2 border-[#c94f2f] pl-4 text-sm font-bold leading-relaxed text-[#f2a47f]">{caseStudy.excluded}</p>
                <button type="button" onClick={() => document.getElementById('central-asia-quote-form')?.scrollIntoView({ behavior: 'smooth' })} className="mt-8 inline-flex min-h-12 items-center gap-2 bg-[#c94f2f] px-5 py-3 text-sm font-black text-white transition-colors hover:bg-[#b94625]">
                  {caseStudy.cta}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <ol className="divide-y divide-white/[0.1] p-6 md:p-8">
                {caseStudy.steps.map((step, index) => (
                  <li key={step} className="grid grid-cols-[44px_1fr] items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <span className="font-mono text-xs font-black text-[#f2a47f]">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-sm font-bold text-slate-200">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
        )}

        {selectedCountry === 'kazakhstan' && (
        <section id="chemical-loading-case" className="border-b border-white/[0.08] bg-[#031225] py-16 md:py-24" aria-labelledby="chemical-case-title">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f2a47f]">{chemicalCase.destination}</p>
                <h2 id="chemical-case-title" aria-label={chemicalCase.title} className="mt-4 text-3xl font-black leading-[1.06] tracking-[-0.045em] text-white md:text-[2.25rem]">
                  {chemicalCase.titleLines.map((line) => <span key={line} className="block">{line}</span>)}
                </h2>
              </div>
              <div>
                <p className="max-w-[64ch] text-base font-semibold leading-relaxed text-slate-200">{chemicalCase.intro}</p>
                <p className="mt-3 max-w-[68ch] text-xs leading-relaxed text-slate-500">{chemicalCase.evidenceNote}</p>
              </div>
            </div>

            <div className="mt-12 grid border border-[#c94f2f]/60 bg-[#0a1c32] lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)]">
              <div className="flex items-start gap-4 border-b border-[#c94f2f]/35 p-6 lg:border-b-0 lg:border-r lg:p-8">
                <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-[#f2a47f]" aria-hidden="true" />
                <h3 className="text-xl font-black leading-tight text-white">{chemicalCase.checkpointTitle}</h3>
              </div>
              <p className="p-6 text-sm font-semibold leading-7 text-slate-300 lg:p-8">{chemicalCase.checkpointBody}</p>
            </div>

            <div className="mt-12 flex items-end justify-between gap-6 border-b border-white/[0.14] pb-5">
              <h3 className="text-xl font-black text-white md:text-2xl">{chemicalCase.sequenceTitle}</h3>
              <span className="font-mono text-xs font-black text-[#f2a47f]">01 / 07</span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-12">
              {EURASIA_CHEMICAL_CASE_IMAGES.map((item, index) => {
                const spanClass = index === 0 ? 'md:col-span-5' : index === 1 ? 'md:col-span-7' : index === 6 ? 'md:col-span-7' : 'md:col-span-5';
                const heightClass = index === 1 ? 'h-[360px] md:h-[420px]' : index === 6 ? 'h-[460px]' : 'h-[420px]';
                return (
                  <figure key={item.src} className={`${spanClass} border border-white/[0.1] bg-white/[0.025]`}>
                    <img
                      src={item.src}
                      alt={chemicalCase.captions[item.key]}
                      width="1600"
                      height="1800"
                      loading="lazy"
                      className={`w-full object-cover ${heightClass}`}
                    />
                    <figcaption className="grid grid-cols-[34px_1fr] gap-3 border-t border-white/[0.1] px-4 py-4">
                      <span className="font-mono text-[10px] font-black text-[#f2a47f]">{String(index + 1).padStart(2, '0')}</span>
                      <span className="text-xs font-semibold leading-relaxed text-slate-400">{chemicalCase.captions[item.key]}</span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>

            <div className="mt-12 grid border-y border-white/[0.14] lg:grid-cols-[minmax(0,.65fr)_minmax(0,1.35fr)]">
              <div className="border-b border-white/[0.12] py-8 lg:border-b-0 lg:border-r lg:pr-8">
                <FileText className="h-6 w-6 text-[#f2a47f]" aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-black text-white">{chemicalCase.checklistTitle}</h3>
                <button type="button" onClick={() => document.getElementById('central-asia-quote-form')?.scrollIntoView({ behavior: 'smooth' })} className="mt-7 inline-flex min-h-12 items-center gap-2 bg-[#c94f2f] px-5 py-3 text-sm font-black text-white transition-colors hover:bg-[#b94625]">
                  {chemicalCase.cta}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <ol className="divide-y divide-white/[0.1] py-4 lg:pl-8">
                {chemicalCase.checkpoints.map((checkpoint, index) => (
                  <li key={checkpoint} className="grid grid-cols-[38px_1fr] items-start gap-4 py-5">
                    <span className="font-mono text-xs font-black text-[#f2a47f]">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-sm font-bold leading-relaxed text-slate-200">{checkpoint}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
        )}

        {/* Section 3: Compliance & Solutions Grid */}
        <section className="py-16 md:py-24 border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white md:text-4xl">{activeLang === 'en' ? `Documents and shipment checks for ${countryLabel(selectedCountry)}` : spec.solutionsTitle}</h2>
              <p className="mt-4 max-w-[65ch] text-sm font-medium leading-relaxed text-slate-400 md:text-base">{spec.solutionsSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              {spec.solutions.map((item, idx) => (
                <article key={idx} className={`border border-white/[0.1] bg-white/[0.025] p-6 transition-colors hover:border-white/[0.18] hover:bg-white/[0.045] md:p-8 ${spec.solutions.length === 3 && idx === 2 ? 'lg:col-span-12' : idx % 4 === 0 || idx % 4 === 3 ? 'lg:col-span-7' : 'lg:col-span-5'}`}>
                  <div>
                    <div className="mb-4 inline-block bg-[#c94f2f]/10 p-3">
                      {getIcon(item.icon)}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Central Asia Shipping Checklist & FAQ */}
        <section className="py-16 md:py-24 border-b border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                {t('faqHeading')}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-sky-400 to-[#c94f2f] mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-sm font-medium">
                {t('faqSubheading')}
              </p>
            </div>

            <div className="space-y-4">
              {spec.faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white/[0.01] border border-white/[0.06] rounded-xl mb-4 px-6 py-4 overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f08c65] focus-visible:ring-offset-4 focus-visible:ring-offset-[#071a33]"
                    >
                      <span className="text-sm md:text-base font-black text-white pr-4">
                        {faq.q}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-[#c94f2f] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="px-6 pb-5 text-sm text-slate-400 border-t border-white/[0.08] pt-3 leading-relaxed font-medium">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Lead Capture Container */}
        <section id="central-asia-quote-form" tabIndex={hero ? -1 : undefined} className="py-16 md:py-24 border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/[0.03] backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/[0.08] dark-form-container">
              <GetAQuote
                presetDestination={
                  countryLabel(selectedCountry)
                }
                presetService="Land"
              />
            </div>
          </div>
        </section>

      <CountryCargoPlanning country={selectedCountry} countryName={countryLabel(selectedCountry)} />
      <FreightRelatedLinks country={selectedCountry} locale={activeLang}/></main>

      <Footer />

      <ScrollToTop />
    </div>
  );
}
