import { ui, pages } from '../features/mobile-sourcing/locales.mjs';
import { copyFor } from '../features/mobile-sourcing/catalog.mjs';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../lib/analytics';
import type { Language } from '../i18n/translations';
import { outdoorCategoryNavigation, outdoorOverviewNavigation } from '../config/outdoorCategoryNavigation';
import { navigationPath } from '../lib/productLanguageRouting';

const copy: Record<Language, string[]> = {
  en: ['Explore before you order', 'Compare products, understand the price and bring a clearer brief to your supplier.', 'Commercial kitchen equipment', 'Compare equipment, indicative prices and margin for your market.', 'Screen protectors', 'Compare glass, packaging and minimum orders. See what changes the quote.', 'Compare equipment', 'Plan your margin', 'Compare screen protectors', 'Why prices differ', 'Product details in English'],
  zh: ['先看清产品，再决定采购', '比较产品、了解价格差异，带着明确需求询价。', '商用餐厨设备', '比较设备、参考价格和目标市场的利润空间。', '手机保护膜', '比较玻璃、包装和起订量，了解报价差异。', '比较设备', '测算利润', '比较手机膜', '为什么价格不同', '产品资料为英文'],
  ar: ['استكشف قبل أن تطلب', 'قارن المنتجات وافهم الأسعار وحدد طلبك للمورد بوضوح.', 'معدات المطابخ التجارية', 'قارن المعدات والأسعار الاسترشادية وهامش الربح لسوقك.', 'واقيات الشاشة', 'قارن الزجاج والتغليف والحد الأدنى للطلب وافهم اختلاف الأسعار.', 'قارن المعدات', 'احسب هامش الربح', 'قارن واقيات الشاشة', 'لماذا تختلف الأسعار', 'تفاصيل المنتجات بالإنجليزية'],
  es: ['Explore antes de comprar', 'Compare productos, entienda los precios y prepare una solicitud clara.', 'Equipos de cocina comercial', 'Compare equipos, precios orientativos y margen para su mercado.', 'Protectores de pantalla', 'Compare vidrio, embalaje y pedidos mínimos. Entienda las diferencias de precio.', 'Comparar equipos', 'Calcular el margen', 'Comparar protectores', 'Por qué varían los precios', 'Detalles del producto en inglés'],
  fr: ['Explorez avant de commander', 'Comparez les produits, comprenez les prix et préparez une demande précise.', 'Équipements de cuisine professionnelle', 'Comparez équipements, prix indicatifs et marge pour votre marché.', 'Protections d’écran', 'Comparez verre, emballage et quantités minimales. Comprenez les écarts de prix.', 'Comparer les équipements', 'Estimer la marge', 'Comparer les protections', 'Pourquoi les prix varient', 'Fiches produits en anglais'],
  ru: ['Изучите перед заказом', 'Сравните товары и цены, чтобы подготовить понятный запрос поставщику.', 'Оборудование для профессиональной кухни', 'Сравните оборудование, ориентировочные цены и маржу для вашего рынка.', 'Защитные стёкла', 'Сравните стекло, упаковку и минимальные партии. Узнайте причины разницы в цене.', 'Сравнить оборудование', 'Рассчитать маржу', 'Сравнить стёкла', 'Почему цены отличаются', 'Информация о товарах на английском'],
  pt: ['Explore antes de comprar', 'Compare produtos, entenda os preços e prepare um pedido claro.', 'Equipamentos de cozinha comercial', 'Compare equipamentos, preços indicativos e margem para o seu mercado.', 'Películas de proteção', 'Compare vidro, embalagem e pedidos mínimos. Entenda as diferenças de preço.', 'Comparar equipamentos', 'Calcular a margem', 'Comparar películas', 'Por que os preços variam', 'Detalhes dos produtos em inglês'],
  tr: ['Siparişten önce inceleyin', 'Ürünleri ve fiyatları karşılaştırarak tedarikçinize net bir talep iletin.', 'Endüstriyel mutfak ekipmanları', 'Ekipmanları, gösterge fiyatları ve pazarınıza uygun kâr marjını karşılaştırın.', 'Ekran koruyucular', 'Camı, ambalajı ve minimum siparişleri karşılaştırın. Fiyat farklarını anlayın.', 'Ekipmanları karşılaştırın', 'Kâr marjını hesaplayın', 'Ekran koruyucuları karşılaştırın', 'Fiyatlar neden farklı', 'Ürün bilgileri İngilizcedir'],
};

export default function ProductDiscoveryLinks({ source = 'home' }: { source?: 'home' | 'products' | 'insights' }) {
  const { language } = useLanguage();
  const t = copy[language];
  const kitchen = navigationPath('/sourcing/commercial-kitchen-equipment-from-china/', language);
  const mobileLocale=['en','es','ar'].includes(language)?language:'en';
  const outdoor = outdoorOverviewNavigation(language);
  const powerGuide = outdoorCategoryNavigation(language)[3];
  const outdoorDescription = language === 'zh' ? '比较户外电源、太阳能板与车载冰箱，了解容量、续航和充电方式。' : { en: 'Compare power stations, solar panels and vehicle fridges. Explore capacity, runtime and charging in the visual guide.', es: 'Compare estaciones, paneles solares y neveras. Explore capacidad, autonomía y carga en la guía visual.', ar: 'قارن محطات الطاقة والألواح الشمسية وثلاجات المركبات. استكشف السعة ومدة التشغيل والشحن في الدليل المرئي.' }[mobileLocale];
  const paths = [
    {name:language === 'zh' ? '手机配件' : copyFor(ui.hub,mobileLocale),description:language === 'zh' ? '按机型、颜色与材质搭配手机壳款式。比较采购成本，确认样品后再安排批量订单。' : copyFor(pages.cases.intro,mobileLocale),image:'/mobile-sourcing-media/case-colorways-ddnz-v1.webp',group:'mobile_accessories',links:[['/phone-cases',language === 'zh' ? '手机壳' : copyFor(ui.cases,mobileLocale)],['/phone-straps-charms',language === 'zh' ? '挂绳与挂饰' : copyFor(ui.straps,mobileLocale)]].map(([to,label])=>[navigationPath(to,language),label])},
    { name: t[2], description: t[3], image: '/commercial-kitchen-media/kitchen-hero.webp', group: 'commercial_kitchen', links: [[kitchen + '#commercial-kitchen-equipment', t[6]], [kitchen + '#commercial-kitchen-benchmarks', t[7]]] },
    { name: outdoor.label, description: outdoorDescription, image: '/outdoor-sourcing-media/outdoor-camp.webp', group: 'outdoor_products', links: [outdoor, powerGuide].map(item => [navigationPath(item.to, language), item.label]) },
    { name: t[4], description: t[5], image: '/screen-protector-media/assets/001-kit-photo.jpg', group: 'screen_protectors', links: [[navigationPath('/screen-protectors/compare/', language), t[8]], [['es','ar'].includes(language) ? navigationPath('/screen-protectors/', language) : '/screen-protectors/guides/price-differences/', ['es','ar'].includes(language) ? t[4] : t[9]]] },
  ];
  return <section lang={language === 'zh' ? 'zh-CN' : language} dir={language === 'ar' ? 'rtl' : 'ltr'} aria-label={t[0]} className="mx-auto my-10 max-w-7xl px-5 sm:px-8">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-bold tracking-tight text-[#13243b]">{t[0]}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t[1]}</p></div>{!['en','es','ar'].includes(language) && <span className="text-xs text-slate-500">{t[10]}</span>}</div>
    <div className="grid gap-5 md:grid-cols-2">{paths.map(item => <article key={item.group} className="grid min-w-0 grid-cols-[92px_1fr] gap-5 border border-slate-200 bg-white p-5 sm:grid-cols-[120px_1fr] sm:p-6">
      <img src={item.image} width="240" height="240" alt={item.name} loading="lazy" className="aspect-square w-full object-cover" />
      <div className="min-w-0"><h3 className="text-lg font-bold text-[#13243b]">{item.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p><div className="mt-3 flex flex-wrap gap-x-5">{item.links.map(([to,label]) => <Link key={to} to={to} onClick={() => trackEvent('sourcing_guide_click', { source_location: source, content_group: item.group, link_path: to })} className="inline-flex min-h-11 items-center text-sm font-semibold text-[#763c9c] underline underline-offset-4">{label}<span aria-hidden="true" className="ms-2">↗</span></Link>)}</div></div>
    </article>)}</div>
  </section>;
}
