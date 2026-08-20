import fs from 'fs';
import path from 'path';
import { getLocalizedHomeFaqs, type HomeFaqLanguage } from '../src/data/homeFaqData';

// Define the static page configurations mapping language routes to SEO meta headers
interface SEOItem {
  title: string;
  desc: string;
  keywords: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  headline?: string;
  governed?: boolean;
}

const seoDataMatrix: Record<string, Record<string, SEOItem>> = {
  // 1. Home ("")
  '': {
    en: {
      title: 'DDNZ Global | China Sourcing, Quality Control & Export Delivery',
      desc: 'Source commercial kitchen equipment, audio, mobile accessories and outdoor products from China with supplier verification, QC, consolidation and export delivery.',
      keywords: 'China sourcing agent, China procurement company, supplier inspection China, cargo consolidation China, commercial kitchen equipment sourcing, speaker sourcing China, mobile accessories sourcing, outdoor products sourcing China',
      image: '/images/operations/pexels-jakarta-warehouse-loading-ddnz-vest-v2.webp',
    },
    'zh-cn': {
      title: 'DDNZ Global 大递诺展 | 中国采购、验货、集货与出口交付',
      desc: '为中东、非洲和中南美进口商提供商用餐厨设备、音响、手机配件和户外用品的一站式中国采购、验货、集货与出口服务。',
      keywords: '中国采购代理, 广州采购公司, 供应商验货, 集货出口, 商用餐厨设备采购, 音响采购, 手机配件采购, 户外用品采购',
      image: '/images/operations/pexels-jakarta-warehouse-loading-ddnz-vest-v2.webp',
    },
    ru: {
      title: 'DDNZ Global | Закупки, контроль качества и экспорт из Китая',
      desc: 'Поиск поставщиков, инспекция, консолидация и экспорт кухонного оборудования, аудио, мобильных аксессуаров и товаров для активного отдыха из Китая.',
      keywords: 'закупки в Китае, поиск поставщиков Китай, инспекция товара, консолидация грузов, товары для активного отдыха из Китая',
      image: '/images/operations/pexels-jakarta-warehouse-loading-ddnz-vest-v2.webp',
    },
    fr: {
      title: 'DDNZ Global | Achats, contrôle qualité et export depuis la Chine',
      desc: 'Sourcing, inspection, consolidation et export d’équipements de cuisine, audio, accessoires mobiles et produits de plein air depuis la Chine.',
      keywords: 'agent sourcing Chine, inspection fournisseur Chine, consolidation marchandises Chine, sourcing produits de plein air Chine',
      image: '/images/operations/pexels-jakarta-warehouse-loading-ddnz-vest-v2.webp',
    },
    es: {
      title: 'DDNZ Global | Compras, control de calidad y exportación desde China',
      desc: 'Búsqueda, inspección, consolidación y exportación desde China de cocina comercial, audio, accesorios móviles y productos para actividades al aire libre.',
      keywords: 'agente de compras China, inspección de proveedores, consolidación de carga China, productos para actividades al aire libre China',
      image: '/images/operations/pexels-jakarta-warehouse-loading-ddnz-vest-v2.webp',
    },
    ar: {
      title: 'DDNZ Global | التوريد وفحص الجودة والتصدير من الصين',
      desc: 'توريد وفحص وتجميع وتصدير معدات المطابخ والصوت وملحقات الهاتف ومستلزمات الأنشطة الخارجية من الصين.',
      keywords: 'وكيل توريد الصين, فحص الموردين, تجميع البضائع من الصين, توريد مستلزمات الأنشطة الخارجية',
      image: '/images/operations/pexels-jakarta-warehouse-loading-ddnz-vest-v2.webp',
    }
  },
  'how-we-work': {
    en: {
      title: 'How China Sourcing Works | DDNZ Global',
      desc: 'Follow six accountable checkpoints from buyer brief and supplier comparison to specification approval, QC evidence, consolidation and export handoff.',
      keywords: 'China sourcing process, supplier comparison China, quality control workflow, cargo consolidation China, export handoff',
      image: '/media/process/brief-spec-discussion-poster.webp',
    },
    'zh-cn': {
      title: '中国采购服务流程 | DDNZ Global 大递诺展',
      desc: '了解从采购需求、供应商比价、样品规格确认到验货证据、集货与出口交接的六个责任节点。',
      keywords: '中国采购流程, 供应商比价, 样品确认, 验货证据, 集货出口',
      image: '/media/process/brief-spec-discussion-poster.webp',
    },
    ru: {
      title: 'Как работает закупка в Китае | DDNZ Global',
      desc: 'Шесть контрольных этапов: бриф, сравнение поставщиков, образцы, производство, инспекция, консолидация и экспортная передача.',
      keywords: 'процесс закупки в Китае, проверка поставщика, контроль качества, консолидация груза',
      image: '/media/process/brief-spec-discussion-poster.webp',
    },
    fr: {
      title: 'Processus de sourcing en Chine | DDNZ Global',
      desc: 'Six points de contrôle : brief, comparaison fournisseurs, échantillons, production, preuves QC, consolidation et transmission export.',
      keywords: 'processus sourcing Chine, comparaison fournisseurs, contrôle qualité, consolidation export',
      image: '/media/process/brief-spec-discussion-poster.webp',
    },
    es: {
      title: 'Cómo funciona la compra en China | DDNZ Global',
      desc: 'Seis puntos de control: solicitud, comparación de proveedores, muestras, producción, evidencia de calidad, consolidación y entrega a exportación.',
      keywords: 'proceso de compras China, comparación proveedores, control de calidad, consolidación exportación',
      image: '/media/process/brief-spec-discussion-poster.webp',
    },
    ar: {
      title: 'كيف تعمل عملية التوريد من الصين | DDNZ Global',
      desc: 'ست نقاط مسؤولية من موجز الشراء ومقارنة الموردين إلى اعتماد المواصفات وأدلة الجودة والتجميع وتسليم التصدير.',
      keywords: 'عملية التوريد من الصين, مقارنة الموردين, فحص الجودة, تجميع الشحنات, تسليم التصدير',
      image: '/media/process/brief-spec-discussion-poster.webp',
    },
  },
  // 2. Insights ("insights")
  'insights': {
    en: {
      title: 'China Sourcing & Export Insights | DDNZ Global',
      desc: 'Practical DDNZ Global guides on China sourcing, supplier verification, quality control, consolidation, export and international freight.',
      keywords: 'global supply chain, shipping news china, cross-border e-commerce ddp, ocean freight guides, air cargo metrics'
    },
    'zh-cn': {
      title: '中国采购、验货与出口洞察 | DDNZ Global',
      desc: 'DDNZ Global 为国际进口商提供中国采购、供应商核验、质量控制、集货出口与国际货运的实用指南。',
      keywords: '中国采购资讯, 供应商核验, 中国验货, 集货出口, 国际供应链, DDNZ Global'
    },
    ru: {
      title: 'Аналитика закупок и экспорта из Китая | DDNZ Global',
      desc: 'Практические материалы DDNZ Global о поставщиках, инспекциях, консолидации, экспорте и международной логистике из Китая.',
      keywords: 'новости логистики из китая, вэд китай рф, таможенная очистка грузов, ставки фрахта, карго шэньчжэнь'
    },
    fr: {
      title: 'Conseils sourcing et export depuis la Chine | DDNZ Global',
      desc: "Guides pratiques DDNZ Global sur les fournisseurs, l’inspection, la consolidation, l’export et le fret international depuis la Chine.",
      keywords: 'actus transit chine europe, réglementation amazon fba, douane importations france, tarifs expédition maritime'
    },
    es: {
      title: 'Guías de compras y exportación desde China | DDNZ Global',
      desc: 'Guías prácticas de DDNZ Global sobre proveedores, inspección, consolidación, exportación y transporte internacional desde China.',
      keywords: 'logística china, flete marítimo, carga aérea, comercio internacional, cadena de suministro'
    },
    ar: {
      title: 'أدلة التوريد والتصدير من الصين | DDNZ Global',
      desc: 'أدلة عملية من DDNZ Global حول الموردين والفحص والتجميع والتصدير والشحن الدولي من الصين.',
      keywords: 'الشحن من الصين، الشحن البحري، الشحن الجوي، التجارة الدولية، سلسلة التوريد'
    }
  },
  // 3. Services - Sea Freight ("services/sea-freight")
  'services/sea-freight': {
    en: {
      title: 'China Sea Freight | Cheap LCL Container Shipping Agent',
      desc: 'Optimize your cargo with cheap sea freight from china, LCL consolidation container china. Top-rated door to door ocean freight shipping agent.',
      keywords: 'cheap sea freight from china, LCL consolidation container china, door to door ocean freight shipping agent'
    },
    'zh-cn': {
      title: '中国海运货代公司 | 便宜海运集装箱拼箱门到门',
      desc: '华正邦泰提供低成本海运拼箱、多港口集装箱货运与一站式海运双清包税门到门服务。',
      keywords: 'cheap sea freight from china, LCL consolidation container china, door to door ocean freight shipping agent'
    },
    ru: {
      title: 'Морские перевозки из Китая | Надежная LCL доставка',
      desc: 'Морской фрахт. Мы осуществляем cheap sea freight from china, LCL consolidation container china, door to door ocean freight shipping agent под ключ.',
      keywords: 'cheap sea freight from china, LCL consolidation container china, door to door ocean freight shipping agent'
    },
    fr: {
      title: 'Fret maritime de Chine | Transitaire LCL Consolidation',
      desc: 'Logistique de cheap sea freight from china, LCL consolidation container china. Courtage de door to door ocean freight shipping agent certifié.',
      keywords: 'cheap sea freight from china, LCL consolidation container china, door to door ocean freight shipping agent'
    },
    es: {
      title: 'Flete marítimo desde China | Heaven Born',
      desc: 'Servicios FCL y LCL desde China con consolidación, despacho de exportación y opciones coordinadas de entrega puerta a puerta.',
      keywords: 'flete marítimo china, envío FCL LCL, agente de carga china, consolidación de contenedores'
    },
    ar: {
      title: 'الشحن البحري من الصين | Heaven Born',
      desc: 'خدمات FCL وLCL من الصين مع التجميع وإجراءات التصدير وخيارات منسقة للتسليم من الباب إلى الباب.',
      keywords: 'الشحن البحري من الصين، شحن FCL LCL، وكيل شحن الصين، تجميع الحاويات'
    }
  },
  // 4. Services - Air Freight ("services/air-freight")
  'services/air-freight': {
    en: {
      title: 'Air Freight China | Express Air Shipping Agent Shenzhen',
      desc: 'Need time-critical air cargo from China? Get the best express air freight rates from an international air shipping agent in Shenzhen.',
      keywords: 'time-critical air cargo china, international air shipping agent shenzhen, express air freight rate to US'
    },
    'zh-cn': {
      title: '深圳精密空运货代 | 跨境高时效航空货运报价',
      desc: '提供高时效航空货运服务。华正邦泰与 DDNZ 供应链为您提供专业深圳/广州空运出口、空海联运及跨境快线双清包税到门服务。',
      keywords: 'time-critical air cargo china, international air shipping agent shenzhen, express air freight rate to US'
    },
    ru: {
      title: 'Авиаперевозки из Китая | Экспресс отправка Шэньчжэнь',
      desc: 'Авиадоставка под ключ: time-critical air cargo china, надежный international air shipping agent shenzhen и выгодный express air freight rate to US.',
      keywords: 'time-critical air cargo china, international air shipping agent shenzhen, express air freight rate to US'
    },
    fr: {
      title: 'Fret Aérien Chine | Agence de Transit Express Shenzhen',
      desc: 'Expéditions de time-critical air cargo china. Tarifs express via international air shipping agent shenzhen et bon express air freight rate to US.',
      keywords: 'time-critical air cargo china, international air shipping agent shenzhen, express air freight rate to US'
    },
    es: {
      title: 'Carga aérea desde China | Heaven Born',
      desc: 'Carga aérea urgente y económica desde China con recogida, revisión de exportación, planificación de ruta y seguimiento coordinado.',
      keywords: 'carga aérea china, flete aéreo urgente, agente de carga china, transporte aéreo internacional'
    },
    ar: {
      title: 'الشحن الجوي من الصين | Heaven Born',
      desc: 'شحن جوي سريع واقتصادي من الصين مع الاستلام ومراجعة التصدير وتخطيط المسار والمتابعة المنسقة.',
      keywords: 'الشحن الجوي من الصين، شحن جوي سريع، وكيل شحن الصين، الشحن الدولي'
    }
  },
  // 5. Services - Amazon FBA ("services/amazon-fba")
  'services/amazon-fba': {
    en: {
      title: 'Amazon FBA Prep China | Professional FNSKU Labeling',
      desc: 'Professional FBA prep services and FNSKU labeling company in China. Secure, direct delivery to Amazon warehouses with all customs cleared.',
      keywords: 'professional FBA prep services china, FNSKU labeling company china, direct delivery to amazon warehouse'
    },
    'zh-cn': {
      title: '出口亚马逊FBA仓配 | 双清包税贴标拼箱DDP',
      desc: '提供专业亚马逊 FBA 贴标、质检与仓配服务。自营广州集拼仓直配全球 FBA 仓库，双清包税一站式极速入仓。',
      keywords: 'professional FBA prep services china, FNSKU labeling company china, direct delivery to amazon warehouse'
    },
    ru: {
      title: 'Доставка на склады Amazon FBA из КНР | Prep услуги',
      desc: 'Надежный professional FBA prep services china и FNSKU labeling company china. Прямая direct delivery to amazon warehouse с таможенной очисткой.',
      keywords: 'professional FBA prep services china, FNSKU labeling company china, direct delivery to amazon warehouse'
    },
    fr: {
      title: 'Logistique Amazon FBA Chine | Service d\'Étiquetage',
      desc: "Prestations professional FBA prep services china & FNSKU labeling company china. Service direct delivery to amazon warehouse de porte à porte.",
      keywords: 'professional FBA prep services china, FNSKU labeling company china, direct delivery to amazon warehouse'
    },
    es: {
      title: 'Logística Amazon FBA desde China | Heaven Born',
      desc: 'Preparación FBA, etiquetado FNSKU, consolidación y entrega coordinada desde China a centros logísticos de Amazon.',
      keywords: 'amazon fba china, preparación fba, etiquetado fnsku, envío a amazon'
    },
    ar: {
      title: 'لوجستيات Amazon FBA من الصين | Heaven Born',
      desc: 'تجهيز FBA ووسم FNSKU وتجميع البضائع والتسليم المنسق من الصين إلى مراكز Amazon.',
      keywords: 'Amazon FBA الصين، تجهيز FBA، وسم FNSKU، الشحن إلى Amazon'
    }
  },
  // 6. Services - Warehouse ("services/warehouse-services")
  'services/warehouse-services': {
    en: {
      title: 'Secure Warehouse Storage China | Cheap Cross Docking',
      desc: 'Secure warehouse storage and cheap cross docking in China. Expert e-commerce order fulfillment in our self-operated Guangzhou warehouse.',
      keywords: 'secure warehouse storage china, e-commerce order fulfillment warehouse, cheap cross docking service'
    },
    'zh-cn': {
      title: '广州自营出口储运集运仓 | 廉价跨境仓储一件代发',
      desc: '拥有18年自营广州集运大仓，提供安全跨境仓储、廉价跨港分拨、一件代发及专业包装打托加固等一站式综合仓储物流支持。',
      keywords: 'secure warehouse storage china, e-commerce order fulfillment warehouse, cheap cross docking service'
    },
    ru: {
      title: 'Услуги склада и консолидации в Гуанчжоу | Кросс-докинг',
      desc: 'Собственный склад в Гуанчжоу: secure warehouse storage china, e-commerce order fulfillment warehouse и надежный cheap cross docking service услуг.',
      keywords: 'secure warehouse storage china, e-commerce order fulfillment warehouse, cheap cross docking service'
    },
    fr: {
      title: 'Stockage de marchandises en Chine | Transit Express',
      desc: 'Espace secure warehouse storage china & e-commerce order fulfillment warehouse. Opération de cheap cross docking service rapide à Guangzhou.',
      keywords: 'secure warehouse storage china, e-commerce order fulfillment warehouse, cheap cross docking service'
    },
    es: {
      title: 'Almacén y consolidación en China | Heaven Born',
      desc: 'Almacenamiento, recepción, inspección, consolidación y preparación de exportación coordinados en Guangzhou.',
      keywords: 'almacén china, consolidación de carga, logística guangzhou, preparación de exportación'
    },
    ar: {
      title: 'التخزين والتجميع في الصين | Heaven Born',
      desc: 'التخزين والاستلام والفحص وتجميع البضائع وتجهيز التصدير بتنسيق من فريق غوانغتشو.',
      keywords: 'مستودع الصين، تجميع الشحنات، لوجستيات غوانغتشو، تجهيز التصدير'
    }
  },
  // 7. Middle East ("shipping-from-china-to-middle-east")
  'shipping-from-china-to-middle-east': {
    en: {
      title: 'Freight from China to the Middle East | Heaven Born',
      desc: 'Secure door-to-door (DDP) cargo shipping from China to Middle East hubs. Navigating port congestion & SABER customs compliance since 1999.',
      keywords: 'middle east shipping, saudi arabia freight, uae shipping, kuwait cargo DDP'
    },
    'zh-cn': {
      title: '中国至中东海运空运与双清到门 | 华正邦泰国际货运',
      desc: '专为中小贸易商打造的中国至中东货代方案。还原中东海空双清全时效，提供 SABER 合规审单与广州自营集拼仓一票到门托底。',
      keywords: '中东双清专线, 沙特海运DDP, 阿联酋空运专线, 中东包税货代, SABER合规'
    },
    ru: {
      title: 'Доставка грузов из Китая на Ближний Восток | Heaven Born',
      desc: 'Надежные грузоперевозки из Китая в Саудовскую Аравию, ОАЭ и Кувейт. Оптимизация маршрутов и полное таможенное оформление с сертификатами SABER.',
      keywords: 'доставка на ближний восток, саудовская аравия карго, доставка оаэ, saber сертификат'
    },
    fr: {
      title: 'Fret de Chine vers le Moyen-Orient | Heaven Born',
      desc: "Expéditions sécurisées de Chine vers l'Arabie Saoudite, les EAU et le Koweït. Solutions logistiques optimisées face aux blocages portuaires.",
      keywords: 'fret moyen orient, transport arabie saoudite, logistique emirats, certification saber'
    },
    es: {
      title: 'Flete de China a Oriente Medio | Heaven Born',
      desc: 'Planificación marítima y aérea de China a Arabia Saudita, EAU, Kuwait, Catar, Omán y Baréin con revisión documental previa al embarque.',
      keywords: 'flete oriente medio, transporte arabia saudita, logística emiratos, revisión SABER'
    },
    ar: {
      title: 'الشحن من الصين إلى الشرق الأوسط | Heaven Born',
      desc: 'تخطيط الشحن البحري والجوي من الصين إلى السعودية والإمارات والكويت وقطر وعُمان والبحرين مع مراجعة المستندات قبل الشحن.',
      keywords: 'الشحن إلى الشرق الأوسط، الشحن إلى السعودية، لوجستيات الإمارات، مراجعة SABER'
    }
  },
  // 8. Central Asia ("shipping-from-china-to-central-asia")
  'shipping-from-china-to-central-asia': {
    en: {
      title: 'Secured Freight Forwarding to Kazakhstan & Uzbekistan | DDNZ',
      desc: 'Professional road and rail container transportation from China to Kazakhstan, Uzbekistan, and Central Asia. Complete EAEU customs clearance.',
      keywords: 'central asia freight, shipping to kazakhstan, rail freight to tashkent, almaty truck cargo'
    },
    'zh-cn': {
      title: '中国至中东欧及中亚五国(哈萨克斯坦/乌兹别克斯坦)多式联运 | 华正邦泰 DDNZ Global',
      desc: '华正邦泰联合 DDNZ 供应链为您提供中国至哈萨克斯坦、乌兹别克斯坦等中亚国家的跨境卡航与多式联运。自营广州集拼仓、高效口岸清关保障。',
      keywords: '中亚多式联运, 哈萨克斯坦卡航, 乌兹别克斯坦铁路班列, 中亚货代, 跨境卡航'
    },
    ru: {
      title: 'Доставка из Китая под ключ | Карго и логистика в Казахстан и Узбекистан — DDNZ',
      desc: 'Надежная доставка из Китая под ключ от DDNZ Global. Собственный склад в Гуанчжоу, бесплатная консолидация, автодоставка и контейнерные перевозки сборных грузов.',
      keywords: 'доставка из китая под ключ, карго казахстан, логистика узбекистан, автодоставка из гуанчжоу, сборные грузы'
    },
    fr: {
      title: "Logistique Chine vers l'Asie Centrale | Kazakhstan & Ouzbékistan | DDNZ",
      desc: "Service de transport routier et ferroviaire direct depuis la Chine vers le Kazakhstan et l'Ouzbékistan. Gestion douanière et conformité EAC.",
      keywords: 'fret asie centrale, transport kazakhstan, rail ouzbekistan, douane eaeu'
    },
    es: {
      title: 'Transporte de China a Asia Central | Heaven Born',
      desc: 'Planificación ferroviaria, por carretera y multimodal de China a Kazajistán y Uzbekistán con revisión documental para los corredores de Asia Central.',
      keywords: 'flete asia central, transporte kazajistán, ferrocarril uzbekistán, aduana eaeu'
    },
    ar: {
      title: 'الشحن من الصين إلى آسيا الوسطى | Heaven Born',
      desc: 'تخطيط النقل بالسكك الحديدية والطرق والوسائط المتعددة من الصين إلى كازاخستان وأوزبكستان مع مراجعة مستندات الممرات.',
      keywords: 'الشحن إلى آسيا الوسطى، النقل إلى كازاخستان، قطار أوزبكستان، جمارك EAEU'
    }
  },
  // 9. West Africa ("shipping-from-china-to-west-africa")
  'shipping-from-china-to-west-africa': {
    en: {
      title: 'West Africa Freight Specialist | Compliant Logistics Solutions | DDNZ',
      desc: 'Your trusted gateway to West African shipping (Nigeria, Ghana, etc.). Direct container consolidation and professional pre-clearance.',
      keywords: 'west africa freight, shipping to nigeria, ghana cargo, lagos ocean cargo'
    },
    'zh-cn': {
      title: '中国到西非(尼日利亚/加纳)海运整柜拼箱双清DDP | 西非老庄 | 华正邦泰 DDNZ Global',
      desc: '二十余年专注中国至西非（尼日利亚、加纳等国）专业海空专线。提供自营拼箱、SONCAP核验备案、免费中国集拼仓、拒绝对港二次收加。',
      keywords: '西非双清专线, 尼日利亚海运DDP, 加纳空运专线, 西非老货代, 广州集拼仓'
    },
    ru: {
      title: 'Доставка из Китая в Западную Африку (Нигерия, Гана) | DDNZ',
      desc: 'Профессиональная доставка грузов из Китая в Нигерию и Гану. Собственные склады консолидации, оформление сертификатов SONCAP и надежный морской фрахт.',
      keywords: 'доставка в африку, карго нигерия, доставка гана, сертификация soncap'
    },
    fr: {
      title: "Transitaire en Chine | Groupage Maritime & FCL vers l'Afrique de l'Ouest — DDNZ",
      desc: "Besoin d'un transitaire en Chine fiable ? DDNZ Global propose des services de groupage maritime, inspection de conteneur и dédouanement fret maritime.",
      keywords: "transitaire chine, groupage maritime afrique de l'ouest, inspection conteneur, dedouanement fret maritime"
    },
    es: {
      title: 'Flete de China a África Occidental | Heaven Born',
      desc: 'Planificación marítima y aérea de China a Nigeria, Ghana y África Occidental con consolidación y revisión de documentos antes del embarque.',
      keywords: 'flete áfrica occidental, envío nigeria, carga ghana, transporte desde china'
    },
    ar: {
      title: 'الشحن من الصين إلى غرب أفريقيا | Heaven Born',
      desc: 'تخطيط الشحن البحري والجوي من الصين إلى نيجيريا وغانا وغرب أفريقيا مع التجميع ومراجعة المستندات قبل الشحن.',
      keywords: 'الشحن إلى غرب أفريقيا، الشحن إلى نيجيريا، شحن غانا، النقل من الصين'
    }
  },
  // 10. Latin America ("shipping-from-china-to-latin-america")
  'shipping-from-china-to-latin-america': {
    en: {
      title: 'Latin America Freight Specialist | Compliant Logistics Solutions | DDNZ',
      desc: 'Your trusted gateway to Latin American shipping (Mexico, Brazil, Argentina). 100% guaranteed DDP, free consolidation and strict pre-audits.',
      keywords: 'latin america freight, mexico shipping DDP, brazil customs CNPJ, argentina escrow logistics'
    },
    'zh-cn': {
      title: '中国到拉美(墨西哥/巴西/阿根廷)海运整柜拼箱双清DDP | 拉美庄家 | 华正邦泰 DDNZ Global',
      desc: '专注中国至拉丁美洲（墨西哥、巴西、阿根廷）货运专线。提供自营拼箱、NOM/CNPJ核验、外汇保障，拒绝对港二次加价。',
      keywords: '拉美专线货代, 墨西哥海运DDP, 巴西包税DDP, 阿根廷外汇托收, 拉美老庄'
    },
    ru: {
      title: 'Доставка из Китая в Латинскую Америку (Мексика, Бразилия, Аргентина) | DDNZ',
      desc: 'Логистика под ключ в страны Латинской Америки. Помощь с NOM в Мексике, CNPJ в Бразилии, а также финансовое сопровождение для Аргентины.',
      keywords: 'доставка в латинскую америку, карго мексика, доставка бразилия, таможня латам'
    },
    fr: {
      title: "Fret de Chine vers l'Amérique Latine (Mexique, Brésil) | DDNZ",
      desc: "Solutions logistiques complètes et conformes vers le Mexique, le Brésil et l'Argentine. Dédouanement certifié et audits d'usines.",
      keywords: 'fret amerique latine, douane mexique, CNPJ bresil, logistique argentine'
    },
    es: {
      title: 'Flete de China a Latinoamérica | Heaven Born',
      desc: 'Planificación marítima y aérea de China a México, Brasil, Argentina, Perú y Chile con consolidación y revisión documental previa al embarque.',
      keywords: 'flete latinoamérica, envío méxico, carga brasil, logística argentina, transporte desde china'
    },
    ar: {
      title: 'الشحن من الصين إلى أمريكا اللاتينية | Heaven Born',
      desc: 'تخطيط الشحن البحري والجوي من الصين إلى المكسيك والبرازيل والأرجنتين وبيرو وتشيلي مع التجميع ومراجعة المستندات.',
      keywords: 'الشحن إلى أمريكا اللاتينية، الشحن إلى المكسيك، شحن البرازيل، النقل من الصين'
    }
  },
  // 11. Quote ("get-a-quote")
  'get-a-quote': {
    en: {
      title: 'Request China Sourcing, Inspection or Freight Support | DDNZ',
      desc: 'Send your product, supplier, destination or cargo details for a scoped review of sourcing, inspection, consolidation or international freight from China.',
      keywords: 'China sourcing request, supplier inspection quote, cargo consolidation China, freight quote China'
    },
    'zh-cn': {
      title: '提交中国采购、验货、集货或货运需求 | DDNZ Global',
      desc: '提交产品、供应商、目的地或货物资料，获取中国采购、供应商核验、质量检查、集货出口或国际货运的范围评估。',
      keywords: '中国采购询盘, 中国验货报价, 集货出口, 中国国际货运报价'
    },
    ru: {
      title: 'Запрос на закупку, инспекцию или доставку из Китая | DDNZ',
      desc: 'Отправьте данные о товаре, поставщике, направлении или грузе для оценки закупки, инспекции, консолидации или международной перевозки из Китая.',
      keywords: 'запрос на закупку Китай, инспекция товара, консолидация груза, расчет доставки из Китая'
    },
    fr: {
      title: 'Demande sourcing, inspection ou fret depuis la Chine | DDNZ',
      desc: 'Transmettez le produit, le fournisseur, la destination ou le fret pour cadrer le sourcing, l’inspection, la consolidation ou le transport international.',
      keywords: 'demande sourcing Chine, devis inspection Chine, consolidation marchandises, devis fret Chine'
    },
    es: {
      title: 'Solicite una cotización de compras y transporte desde China | DDNZ',
      desc: 'Envíe los datos del producto, proveedor, destino o carga para recibir una revisión de compras, inspección, consolidación o transporte desde China.',
      keywords: 'cotización compras China, solicitud inspección China, cotización flete China, consolidación de carga'
    },
    ar: {
      title: 'اطلب عرض توريد أو شحن من الصين | DDNZ Global',
      desc: 'أرسل بيانات المنتج أو المورد أو الوجهة أو الشحنة لمراجعة التوريد أو الفحص أو التجميع أو الشحن من الصين.',
      keywords: 'عرض توريد من الصين, طلب فحص الصين, عرض شحن الصين, تجميع الشحنات'
    }
  },
  'sourcing/commercial-kitchen-equipment-from-china': {
    en: {
      title: 'Commercial Kitchen Equipment Sourcing from China | DDNZ',
      desc: 'Source commercial kitchen equipment from China with model-level supplier checks, inspection evidence, consolidation and export coordination.',
      keywords: 'commercial kitchen equipment from China, restaurant equipment sourcing China, commercial refrigerator supplier China, kitchen equipment inspection',
      image: '/images/product-showcase/kitchen/kitchen-operating-sanitized.webp'
    }
  },
  'sourcing/audio-speakers-from-china': {
    en: {
      title: 'Audio & Speaker Sourcing from China | DDNZ',
      desc: 'Source portable, party and professional speakers from China with configuration comparison, battery and function checks, inspection, consolidation and export support.',
      keywords: 'speaker sourcing China, portable speaker supplier China, party speaker wholesale China, audio equipment inspection, private label speakers China',
      image: '/images/product-showcase/audio/vintage-range-hero-v1.webp'
    }
  },
  'sourcing/mobile-accessories-from-china': {
    en: {
      title: 'Mobile Accessories Sourcing from China | DDNZ',
      desc: 'Source chargers, cables, power banks, earbuds, cases and mobile accessories from China with SKU comparison, sample checks, packaging control and consolidation.',
      keywords: 'mobile accessories sourcing China, phone accessories wholesale China, charger cable supplier China, power bank sourcing, private label phone accessories',
      image: '/images/product-showcase/mobile/family-phone-cases-v1.webp'
    }
  },
  'sourcing/outdoor-products-from-china': {
    en: {
      title: 'Outdoor Products Sourcing from China | DDNZ',
      desc: 'Source grills, coolers, portable refrigerators and outdoor kitchens from China with supplier checks, inspection and export coordination.',
      keywords: 'outdoor products sourcing China, BBQ grill supplier China, insulated cooler manufacturer China, portable refrigerator sourcing, outdoor kitchen China',
      image: '/images/product-showcase/outdoor/range-atlas-hero-v1.webp'
    }
  },
  'products': {
    en: {
      title: 'Product Sourcing Categories in China | DDNZ Global',
      desc: 'Explore commercial kitchen, refrigeration, audio, mobile accessories and outdoor product sourcing with supplier comparison, QC and export handoff.',
      keywords: 'China product sourcing, commercial kitchen sourcing, speaker sourcing China, mobile accessories sourcing, outdoor products sourcing',
      image: '/images/product-showcase/index/audio-speakers-category.webp'
    }
  },
  'sourcing-services': {
    en: {
      title: 'China Sourcing Services for Retailers & Importers | DDNZ',
      desc: 'Manage flexible mixed-SKU sourcing with comparable offers, recorded approvals, production follow-up, quality control and export handoff.',
      keywords: 'China sourcing services, sourcing agent China, mixed SKU sourcing, supplier verification, production follow up China',
      image: '/images/product-showcase/kitchen/kitchen-factory-inspection-sanitized.webp'
    }
  },
  'refrigeration-equipment': {
    en: {
      title: 'Commercial Refrigeration Equipment Sourcing | DDNZ',
      desc: 'Source commercial refrigerators, prep counters, display cabinets and ice makers from China with climate, model, performance and pack-out controls.',
      keywords: 'commercial refrigeration equipment China, refrigerator sourcing China, ice maker supplier China, refrigeration quality control',
      image: '/images/product-showcase/refrigeration/upright-dg860l4-sanitized.webp'
    }
  },
  'sourcing-services/supplier-search': {
    en: { title: 'China Supplier Search & Comparison | DDNZ Global', desc: 'Build a comparable China supplier shortlist from one market-defined buying brief, with quotation normalization and evidence gaps recorded.', keywords: 'China supplier search, sourcing agent China, supplier comparison, supplier shortlist', image: '/images/operations/pexels-warehouse-workers-aisle-ddnz-vest-v1.webp' },
    'zh-cn': { title: '中国供应商搜索与比价 | DDNZ Global', desc: '根据统一采购需求搜索中国供应商、规范报价口径，并记录证据缺口与后续核验建议。', keywords: '中国供应商搜索, 中国采购代理, 供应商比价, 工厂筛选', image: '/images/operations/pexels-warehouse-workers-aisle-ddnz-vest-v1.webp' },
    ru: { title: 'Поиск и сравнение поставщиков в Китае | DDNZ', desc: 'Сформируйте сопоставимый шорт-лист поставщиков из Китая по единому закупочному заданию.', keywords: 'поиск поставщиков Китай, агент по закупкам, сравнение поставщиков', image: '/images/operations/pexels-warehouse-workers-aisle-ddnz-vest-v1.webp' },
    fr: { title: 'Recherche et comparaison fournisseurs en Chine | DDNZ', desc: 'Créez une présélection comparable de fournisseurs chinois à partir d’un brief d’achat commun.', keywords: 'recherche fournisseur Chine, agent sourcing Chine, comparaison fournisseurs', image: '/images/operations/pexels-warehouse-workers-aisle-ddnz-vest-v1.webp' },
    es: { title: 'Búsqueda y comparación de proveedores en China | DDNZ', desc: 'Cree una lista comparable de proveedores chinos a partir de un único brief de compra.', keywords: 'buscar proveedores China, agente compras China, comparar proveedores', image: '/images/operations/pexels-warehouse-workers-aisle-ddnz-vest-v1.webp' },
    ar: { title: 'البحث عن الموردين ومقارنتهم في الصين | DDNZ', desc: 'أنشئ قائمة قابلة للمقارنة من الموردين في الصين انطلاقاً من موجز شراء واحد.', keywords: 'البحث عن موردين الصين, وكيل توريد الصين, مقارنة الموردين', image: '/images/operations/pexels-warehouse-workers-aisle-ddnz-vest-v1.webp' },
  },
  'sourcing-services/inspection-quality-control': {
    en: { title: 'China Inspection & Quality Control | DDNZ Global', desc: 'Coordinate China product inspection against an agreed model, checklist and quantity, with traceable photo, function, label and packing evidence.', keywords: 'product inspection China, quality control China, pre shipment inspection, supplier QC', image: '/images/operations/warehouse-quality-inspection-candid-v1.webp' },
    'zh-cn': { title: '中国验货与质量控制 | DDNZ Global', desc: '依据约定型号、数量和验货清单协调中国现场检查，提供可追溯的照片、功能、标签与包装证据。', keywords: '中国验货, 中国质量控制, 出货前验货, 供应商质检', image: '/images/operations/warehouse-quality-inspection-candid-v1.webp' },
    ru: { title: 'Инспекция и контроль качества в Китае | DDNZ', desc: 'Организуйте инспекцию товара в Китае по согласованной модели, количеству и чек-листу.', keywords: 'инспекция товара Китай, контроль качества, предотгрузочная инспекция', image: '/images/operations/warehouse-quality-inspection-candid-v1.webp' },
    fr: { title: 'Inspection et contrôle qualité en Chine | DDNZ', desc: 'Coordonnez l’inspection en Chine selon le modèle, la quantité et la checklist convenus.', keywords: 'inspection produit Chine, contrôle qualité Chine, inspection avant expédition', image: '/images/operations/warehouse-quality-inspection-candid-v1.webp' },
    es: { title: 'Inspección y control de calidad en China | DDNZ', desc: 'Coordine la inspección en China según el modelo, la cantidad y la lista acordados.', keywords: 'inspección producto China, control calidad China, inspección preembarque', image: '/images/operations/warehouse-quality-inspection-candid-v1.webp' },
    ar: { title: 'الفحص ومراقبة الجودة في الصين | DDNZ', desc: 'نسق فحص المنتجات في الصين وفق النموذج والكمية وقائمة الفحص المتفق عليها.', keywords: 'فحص المنتجات الصين, مراقبة الجودة الصين, فحص ما قبل الشحن', image: '/images/operations/warehouse-quality-inspection-candid-v1.webp' },
  },
  'sourcing-services/consolidation-export': {
    en: { title: 'China Order Consolidation & Export | DDNZ Global', desc: 'Coordinate supplier readiness, receiving, carton and document reconciliation, consolidation and a controlled international freight handoff from China.', keywords: 'order consolidation China, cargo consolidation China, export coordination China, multi supplier shipping', image: '/images/operations/container-loading-forklift-wide-v1.webp' },
    'zh-cn': { title: '中国集货与出口交付 | DDNZ Global', desc: '协调供应商完工、收货、箱数与单证核对、多供应商集货及可控的国际货运交接。', keywords: '中国集货, 多供应商集运, 出口交付, 广州集货仓', image: '/images/operations/container-loading-forklift-wide-v1.webp' },
    ru: { title: 'Консолидация заказов и экспорт из Китая | DDNZ', desc: 'Координация готовности поставщиков, приемки, сверки коробок и документов и экспортной передачи.', keywords: 'консолидация заказов Китай, сборные грузы, экспорт из Китая', image: '/images/operations/container-loading-forklift-wide-v1.webp' },
    fr: { title: 'Consolidation de commandes et export Chine | DDNZ', desc: 'Coordonnez disponibilité fournisseurs, réception, rapprochement cartons et documents et transmission export.', keywords: 'consolidation commandes Chine, groupage Chine, coordination export', image: '/images/operations/container-loading-forklift-wide-v1.webp' },
    es: { title: 'Consolidación de pedidos y exportación desde China | DDNZ', desc: 'Coordine preparación de proveedores, recepción, conciliación de cajas y documentos y entrega de exportación.', keywords: 'consolidación pedidos China, carga consolidada China, coordinación exportación', image: '/images/operations/container-loading-forklift-wide-v1.webp' },
    ar: { title: 'تجميع الطلبات والتصدير من الصين | DDNZ', desc: 'نسق جاهزية الموردين والاستلام ومطابقة الطرود والمستندات وتسليم التصدير من الصين.', keywords: 'تجميع الطلبات الصين, تجميع الشحنات, تنسيق التصدير', image: '/images/operations/container-loading-forklift-wide-v1.webp' },
  }
};

const countryNames: Record<string, Record<string, string>> = {
  'saudi-arabia': { en: 'Saudi Arabia', 'zh-cn': '沙特阿拉伯', ru: 'Саудовскую Аравию', fr: "l’Arabie saoudite", es: 'Arabia Saudita', ar: 'السعودية' },
  uae: { en: 'the UAE', 'zh-cn': '阿联酋', ru: 'ОАЭ', fr: 'les Émirats arabes unis', es: 'Emiratos Árabes Unidos', ar: 'الإمارات' },
  kuwait: { en: 'Kuwait', 'zh-cn': '科威特', ru: 'Кувейт', fr: 'le Koweït', es: 'Kuwait', ar: 'الكويت' },
  qatar: { en: 'Qatar', 'zh-cn': '卡塔尔', ru: 'Катар', fr: 'le Qatar', es: 'Catar', ar: 'قطر' },
  oman: { en: 'Oman', 'zh-cn': '阿曼', ru: 'Оман', fr: 'Oman', es: 'Omán', ar: 'عُمان' },
  bahrain: { en: 'Bahrain', 'zh-cn': '巴林', ru: 'Бахрейн', fr: 'Bahreïn', es: 'Baréin', ar: 'البحرين' },
  kazakhstan: { en: 'Kazakhstan', 'zh-cn': '哈萨克斯坦', ru: 'Казахстан', fr: 'le Kazakhstan', es: 'Kazajistán', ar: 'كازاخستان' },
  uzbekistan: { en: 'Uzbekistan', 'zh-cn': '乌兹别克斯坦', ru: 'Узбекистан', fr: "l’Ouzbékistan", es: 'Uzbekistán', ar: 'أوزبكستان' },
  nigeria: { en: 'Nigeria', 'zh-cn': '尼日利亚', ru: 'Нигерию', fr: 'le Nigeria', es: 'Nigeria', ar: 'نيجيريا' },
  ghana: { en: 'Ghana', 'zh-cn': '加纳', ru: 'Гану', fr: 'le Ghana', es: 'Ghana', ar: 'غانا' },
  mexico: { en: 'Mexico', 'zh-cn': '墨西哥', ru: 'Мексику', fr: 'le Mexique', es: 'México', ar: 'المكسيك' },
  brazil: { en: 'Brazil', 'zh-cn': '巴西', ru: 'Бразилию', fr: 'le Brésil', es: 'Brasil', ar: 'البرازيل' },
  argentina: { en: 'Argentina', 'zh-cn': '阿根廷', ru: 'Аргентину', fr: "l’Argentine", es: 'Argentina', ar: 'الأرجنتين' },
  peru: { en: 'Peru', 'zh-cn': '秘鲁', ru: 'Перу', fr: 'le Pérou', es: 'Perú', ar: 'بيرو' },
  chile: { en: 'Chile', 'zh-cn': '智利', ru: 'Чили', fr: 'le Chili', es: 'Chile', ar: 'تشيلي' },
};

const countryRouteSlugs = Object.keys(countryNames);

function buildCountrySeo(countrySlug: string, lang: string): SEOItem {
  const country = countryNames[countrySlug]?.[lang] || countryNames[countrySlug]?.en || countrySlug;
  const templates: Record<string, SEOItem> = {
    en: {
      title: `Shipping from China to ${country} | Heaven Born`,
      desc: `Plan sea, air and multimodal freight from China to ${country}, with consolidation, export documentation and destination coordination.`,
      keywords: `shipping from China to ${country}, freight forwarder ${country}, China export logistics, sea freight, air freight`,
    },
    'zh-cn': {
      title: `中国至${country}国际货运 | 华正邦泰`,
      desc: `提供中国至${country}的海运、空运及多式联运方案，并协调集货、出口文件与目的地交接。`,
      keywords: `中国至${country}货运, ${country}海运, ${country}空运, 国际货运代理, 华正邦泰`,
    },
    ru: {
      title: `Доставка из Китая в ${country} | Heaven Born`,
      desc: `Морские, авиационные и мультимодальные перевозки из Китая в ${country}: консолидация, экспортные документы и координация доставки.`,
      keywords: `доставка из Китая в ${country}, грузоперевозки, морской фрахт, авиаперевозки, Heaven Born`,
    },
    fr: {
      title: `Expédition de Chine vers ${country} | Heaven Born`,
      desc: `Fret maritime, aérien et multimodal de Chine vers ${country}, avec consolidation, documents export et coordination à destination.`,
      keywords: `expédition Chine ${country}, transitaire Chine, fret maritime, fret aérien, Heaven Born`,
    },
    es: {
      title: `Envíos de China a ${country} | Heaven Born`,
      desc: `Transporte marítimo, aéreo y multimodal de China a ${country}, con consolidación, documentos de exportación y coordinación en destino.`,
      keywords: `envíos de China a ${country}, transitario China, flete marítimo, carga aérea, Heaven Born`,
    },
    ar: {
      title: `الشحن من الصين إلى ${country} | Heaven Born`,
      desc: `حلول الشحن البحري والجوي ومتعدد الوسائط من الصين إلى ${country}، مع التجميع ووثائق التصدير والتنسيق في الوجهة.`,
      keywords: `الشحن من الصين إلى ${country}, وكيل شحن الصين, شحن بحري, شحن جوي, Heaven Born`,
    },
  };

  return templates[lang] || templates.en;
}

const distDir = path.resolve(process.cwd(), 'dist');
const sourceHtmlPath = path.join(distDir, 'index.html');

// Helper to replace or inject tags securely in the HTML string
function injectSeoMeta(htmlContent: string, lang: string, relPath: string, seo: SEOItem): string {
  let output = htmlContent;

  // 1. Update <html lang="..."> attribute
  const htmlLangMap: Record<string, string> = {
    'en': 'en',
    'zh-cn': 'zh-CN',
    'ru': 'ru',
    'fr': 'fr',
    'es': 'es',
    'ar': 'ar'
  };
  const targetLang = htmlLangMap[lang] || 'en';
  output = output.replace(/<html lang="[^"]*"/i, `<html lang="${targetLang}"`);
  output = output.replace(/<html([^>]*)\sdir="[^"]*"/i, '<html$1');
  if (lang === 'ar') {
    output = output.replace(/<html([^>]*)>/i, '<html$1 dir="rtl">');
  }

  // 2. Replace or Inject <title> tag
  const titleRegex = /<title>([\s\S]*?)<\/title>/gi;
  if (titleRegex.test(output)) {
    output = output.replace(titleRegex, `<title>${seo.title}</title>`);
  } else {
    output = output.replace(/<\/head>/i, `  <title>${seo.title}</title>\n</head>`);
  }

  // Helper to replace or append specific meta tags in head
  const setMetaTag = (htmlStr: string, name: string, content: string): string => {
    const escapedContent = content.replace(/"/g, '&quot;');
    const metaRegex = new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
    if (metaRegex.test(htmlStr)) {
      return htmlStr.replace(metaRegex, `<meta name="${name}" content="${escapedContent}" />`);
    } else {
      return htmlStr.replace(/<\/head>/i, `  <meta name="${name}" content="${escapedContent}" />\n</head>`);
    }
  };

  // Helper to replace or append specific open graph/twitter tags
  const setOgMetaTag = (htmlStr: string, property: string, content: string): string => {
    const escapedContent = content.replace(/"/g, '&quot;');
    const propertyAttr = property.startsWith('og:') || property.startsWith('article:') ? 'property' : 'name';
    const ogRegex = new RegExp(`<meta\\s+${propertyAttr}="${property}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
    if (ogRegex.test(htmlStr)) {
      return htmlStr.replace(ogRegex, `<meta ${propertyAttr}="${property}" content="${escapedContent}" />`);
    } else {
      return htmlStr.replace(/<\/head>/i, `  <meta ${propertyAttr}="${property}" content="${escapedContent}" />\n</head>`);
    }
  };

  // Keep descriptions concise without cutting a word in half. Search engines
  // can rewrite snippets, but a complete 150-ish character summary is a useful
  // default for both classic results and answer engines.
  const optimizeDesc = (descStr: string, langCode: string) => {
    const cleanDesc = descStr.trim();
    const maxLength = langCode === 'zh' || langCode === 'zh-cn' ? 78 : 155;
    if (cleanDesc.length <= maxLength) return cleanDesc;
    const candidate = cleanDesc.slice(0, maxLength - 1);
    const lastSpace = candidate.lastIndexOf(' ');
    const completeText = lastSpace > maxLength * 0.72 ? candidate.slice(0, lastSpace) : candidate;
    return `${completeText.trim()}…`;
  };

  const optimizedDesc = optimizeDesc(seo.desc, lang);

  output = setMetaTag(output, 'title', seo.title);
  output = setMetaTag(output, 'description', optimizedDesc);
  output = setMetaTag(output, 'keywords', seo.keywords);
  output = setMetaTag(output, 'robots', 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');

  output = setOgMetaTag(output, 'og:type', relPath.startsWith('blog/') ? 'article' : 'website');
  output = setOgMetaTag(output, 'og:title', seo.title);
  output = setOgMetaTag(output, 'og:description', optimizedDesc);
  output = setOgMetaTag(output, 'twitter:title', seo.title);
  output = setOgMetaTag(output, 'twitter:description', optimizedDesc);
  if (seo.image) {
    const absoluteImage = seo.image.startsWith('http')
      ? seo.image
      : `https://www.ddnzglobal.com${seo.image.startsWith('/') ? seo.image : `/${seo.image}`}`;
    output = setOgMetaTag(output, 'og:image', absoluteImage);
    output = setOgMetaTag(output, 'twitter:image', absoluteImage);
  }
  if (seo.datePublished) output = setOgMetaTag(output, 'article:published_time', seo.datePublished);
  if (seo.dateModified) output = setOgMetaTag(output, 'article:modified_time', seo.dateModified);

  // 3. Set Canonical Link
  const getLanguageUrl = (langCode: string) => {
    const baseUrl = 'https://www.ddnzglobal.com';
    if (!relPath) {
      return langCode === 'en' ? `${baseUrl}/` : `${baseUrl}/${langCode}`;
    }
    return langCode === 'en' ? `${baseUrl}/${relPath}` : `${baseUrl}/${langCode}/${relPath}`;
  };

  const canonicalUrl = getLanguageUrl(lang);
  output = setOgMetaTag(output, 'og:url', canonicalUrl);
  output = setOgMetaTag(output, 'twitter:url', canonicalUrl);
  const canonRegex = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i;
  if (canonRegex.test(output)) {
    output = output.replace(canonRegex, `<link rel="canonical" href="${canonicalUrl}" />`);
  } else {
    output = output.replace(/<\/head>/i, `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  }

  // 4. Set exact page-specific hreflang alternates (replacing any existing ones or rewriting them)
  // Service pages have full UI translations. Blog posts only declare their
  // source language until a genuine Translation Group links them together.
  const isEnglishShowcase = relPath === 'products' || relPath === 'sourcing-services' || relPath === 'refrigeration-equipment';
  const alternateLanguages = relPath.startsWith('blog/') || relPath.startsWith('sourcing/') || isEnglishShowcase
    ? [lang]
    : ['en', 'zh-cn', 'ru', 'fr', 'es', 'ar'];
  const defaultUrl = getLanguageUrl(alternateLanguages.includes('en') ? 'en' : lang);
  const newHreflangTags = `
    <!-- Language alternates -->
    <link rel="alternate" hreflang="x-default" href="${defaultUrl}" />
${alternateLanguages.map((code) => `    <link rel="alternate" hreflang="${code}" href="${getLanguageUrl(code)}" />`).join('\n')}
  `;

  // First, strip out any existing hreflang alternate links to avoid duplication
  output = output.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?>/gi, '');
  output = output.replace(/<link\s+rel="alternate"\s+hrefLang="[^"]*"\s+href="[^"]*"\s*\/?>/gi, '');

  // Inject the new page-specific ones before </head>
  output = output.replace(/<\/head>/i, `${newHreflangTags}</head>`);

  // 5. Add crawlable route-level structured data to the static HTML. React
  // enhances this after hydration, but search engines should not need to run
  // JavaScript to understand the page type, service area, or hierarchy.
  const isSourcingServicePage = relPath === 'how-we-work' || relPath.startsWith('sourcing/') || relPath.startsWith('sourcing-services/') || isEnglishShowcase;
  const isServicePage = relPath.startsWith('services/') || isSourcingServicePage;
  const isShippingPage = relPath.startsWith('shipping-from-china-to-');
  if (isServicePage || isShippingPage) {
    const countrySlug = relPath.replace(/^shipping-from-china-to-/, '');
    const specificCountryName = countryNames[countrySlug]?.en;
    const destinationName = specificCountryName
      || (relPath === 'shipping-from-china-to-middle-east' ? 'Middle East'
        : relPath === 'shipping-from-china-to-central-asia' ? 'Central Asia'
          : relPath === 'shipping-from-china-to-west-africa' ? 'West Africa'
            : relPath === 'shipping-from-china-to-latin-america' ? 'Latin America'
              : 'Global');
    const sectionName = isServicePage ? 'Services' : 'Shipping by Region';
    const middleEastCountries = ['saudi-arabia', 'uae', 'kuwait', 'qatar', 'oman', 'bahrain'];
    const centralAsiaCountries = ['kazakhstan', 'uzbekistan'];
    const westAfricaCountries = ['nigeria', 'ghana'];
    const latinAmericaCountries = ['mexico', 'brazil', 'argentina', 'peru', 'chile'];
    const regionPath = middleEastCountries.includes(countrySlug)
      ? 'shipping-from-china-to-middle-east'
      : centralAsiaCountries.includes(countrySlug)
        ? 'shipping-from-china-to-central-asia'
        : westAfricaCountries.includes(countrySlug)
          ? 'shipping-from-china-to-west-africa'
          : latinAmericaCountries.includes(countrySlug)
            ? 'shipping-from-china-to-latin-america'
            : null;
    const regionName = regionPath?.endsWith('middle-east')
      ? 'Middle East'
      : regionPath?.endsWith('central-asia')
        ? 'Central Asia'
        : regionPath?.endsWith('west-africa')
          ? 'West Africa'
          : regionPath?.endsWith('latin-america')
            ? 'Latin America'
            : sectionName;
    const regionUrl = regionPath
      ? (lang === 'en'
        ? `https://www.ddnzglobal.com/${regionPath}`
        : `https://www.ddnzglobal.com/${lang}/${regionPath}`)
      : canonicalUrl;
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: lang === 'zh-cn' ? '首页' : 'Home',
        item: 'https://www.ddnzglobal.com/'
      },
      ...(regionPath
        ? [{
            '@type': 'ListItem',
            position: 2,
            name: lang === 'zh-cn' ? '按区域运输' : regionName,
            item: regionUrl
          }]
        : []),
      {
        '@type': 'ListItem',
        position: regionPath ? 3 : 2,
        name: seo.title,
        item: canonicalUrl
      }
    ];
    const sourcingCategoryByPath: Record<string, { industry: string; serviceType: string }> = {
      'sourcing/commercial-kitchen-equipment-from-china': {
        industry: 'Commercial Kitchen Equipment',
        serviceType: 'Commercial kitchen equipment sourcing and export coordination from China',
      },
      'sourcing/audio-speakers-from-china': {
        industry: 'Audio & Speakers',
        serviceType: 'Audio and speaker sourcing and export coordination from China',
      },
      'sourcing/mobile-accessories-from-china': {
        industry: 'Mobile Accessories',
        serviceType: 'Mobile accessories sourcing and export coordination from China',
      },
      'sourcing/outdoor-products-from-china': {
        industry: 'Outdoor Products',
        serviceType: 'Outdoor product sourcing and export coordination from China',
      },
      'refrigeration-equipment': {
        industry: 'Commercial Refrigeration Equipment',
        serviceType: 'Commercial refrigeration equipment sourcing and export coordination from China',
      },
    };
    const sourcingCategory = sourcingCategoryByPath[relPath];
    const sourcingServiceOfferByPath: Record<string, { serviceType: string; intent: string; source: string }> = {
      'how-we-work': { serviceType: 'China sourcing, quality-control and export-handoff workflow', intent: 'Product+Sourcing', source: 'how_we_work' },
      'products': { serviceType: 'China product sourcing category selection and project scoping', intent: 'Product+Sourcing', source: 'products_index' },
      'sourcing-services': { serviceType: 'China supplier sourcing, approval control and export handoff', intent: 'Product+Sourcing', source: 'sourcing_services' },
      'sourcing-services/supplier-search': { serviceType: 'China supplier search and quotation comparison', intent: 'Product+Sourcing', source: 'supplier_search_service' },
      'sourcing-services/inspection-quality-control': { serviceType: 'China product inspection and quality control', intent: 'Supplier+Inspection+%26+Consolidation', source: 'quality_control_service' },
      'sourcing-services/consolidation-export': { serviceType: 'China order consolidation and export coordination', intent: 'Supplier+Inspection+%26+Consolidation', source: 'consolidation_export_service' },
    };
    const sourcingService = sourcingServiceOfferByPath[relPath];
    const hasVisibleBreadcrumb = relPath === 'how-we-work' || relPath.startsWith('sourcing-services/');
    const localizedHomeUrl = lang === 'en'
      ? 'https://www.ddnzglobal.com/'
      : `https://www.ddnzglobal.com/${lang}`;
    const sourcingOfferUrl = sourcingCategory
      ? `https://www.ddnzglobal.com${lang === 'en' ? '' : `/${lang}`}/get-a-quote?leadGoal=Product+Sourcing&industry=${encodeURIComponent(sourcingCategory.industry).replaceAll('%20', '+')}&source=sourcing_landing`
      : sourcingService
        ? `https://www.ddnzglobal.com${lang === 'en' ? '' : `/${lang}`}/get-a-quote?leadGoal=${sourcingService.intent}&source=${sourcingService.source}`
        : `https://www.ddnzglobal.com${lang === 'en' ? '' : `/${lang}`}/get-a-quote?leadGoal=Freight+Only&source=structured_data`;
    const sourcingServiceType = sourcingCategory?.serviceType || sourcingService?.serviceType || seo.title;
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: seo.title,
          description: optimizedDesc,
          inLanguage: targetLang
        },
        ...(hasVisibleBreadcrumb ? [{
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          itemListElement: breadcrumbItems.map((item, index) => index === 0
            ? { ...item, item: localizedHomeUrl }
            : item)
        }] : []),
        {
          '@type': 'Service',
          '@id': `${canonicalUrl}#service`,
          name: seo.title,
          serviceType: isShippingPage
            ? `Freight forwarding from China to ${destinationName}`
            : sourcingServiceType,
          description: optimizedDesc,
          provider: {
            '@type': isSourcingServicePage ? 'Organization' : 'LocalBusiness',
            name: isSourcingServicePage
              ? 'DDNZ Global Trade Co., Ltd'
              : lang === 'zh-cn'
                ? '华正邦泰国际货运代理有限公司'
                : 'Heaven Born International Freight Co., Ltd',
            url: 'https://www.ddnzglobal.com/'
          },
          areaServed: isShippingPage
            ? { '@type': specificCountryName ? 'Country' : 'Place', name: destinationName }
            : 'Global',
          offers: {
            '@type': 'Offer',
            url: sourcingOfferUrl,
            priceCurrency: 'USD',
            description: isSourcingServicePage
              ? 'Request a market-defined product sourcing, inspection, consolidation and export coordination plan.'
              : 'Request a route-specific freight quotation based on cargo details and current capacity.'
          }
        }
      ]
    };
    const schemaJson = JSON.stringify(structuredData).replace(/</g, '\\u003c');
    output = output.replace(
      /<\/head>/i,
      `  <script id="schema-jsonld-static-page" type="application/ld+json">${schemaJson}</script>\n</head>`
    );
  }

  if (relPath === 'insights') {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': canonicalUrl,
      url: canonicalUrl,
      name: seo.title,
      description: optimizedDesc,
      inLanguage: targetLang,
      keywords: seo.keywords,
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://www.ddnzglobal.com/#website',
        url: 'https://www.ddnzglobal.com/',
        name: 'DDNZ Global',
      },
      publisher: {
        '@type': 'Organization',
        '@id': 'https://www.ddnzglobal.com/#organization',
        name: lang === 'zh-cn' ? '大递诺展贸易有限公司' : 'DDNZ Global Trade Co., Ltd',
        url: 'https://www.ddnzglobal.com/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.ddnzglobal.com/images/brand/ddnz-global-mark-v1.png',
        },
      },
    };
    const schemaJson = JSON.stringify(structuredData).replace(/</g, '\\u003c');
    output = output.replace(
      /<\/head>/i,
      `  <script id="schema-jsonld-static-page" type="application/ld+json">${schemaJson}</script>\n</head>`
    );
  }

  if (relPath === 'get-a-quote') {
    const localizedServiceNames: Record<string, string> = {
      en: 'China sourcing, inspection, consolidation and freight enquiry',
      'zh-cn': '中国采购、验货、集货与国际货运询盘',
      ru: 'Запрос на закупку, инспекцию, консолидацию и доставку из Китая',
      fr: 'Demande de sourcing, inspection, consolidation et transport depuis la Chine',
      es: 'Solicitud de compras, inspección, consolidación y transporte desde China',
      ar: 'طلب التوريد والفحص والتجميع والشحن من الصين',
    };
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ContactPage',
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: seo.title,
          description: optimizedDesc,
          inLanguage: targetLang,
          isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://www.ddnzglobal.com/#website',
          },
          mainEntity: { '@id': `${canonicalUrl}#service` },
        },
        {
          '@type': 'Service',
          '@id': `${canonicalUrl}#service`,
          name: localizedServiceNames[lang] || localizedServiceNames.en,
          description: optimizedDesc,
          provider: {
            '@type': 'Organization',
            '@id': 'https://www.ddnzglobal.com/#organization',
            name: lang === 'zh-cn' ? '大递诺展贸易有限公司' : 'DDNZ Global Trade Co., Ltd',
            url: 'https://www.ddnzglobal.com/',
          },
          areaServed: [
            { '@type': 'Place', name: 'Middle East' },
            { '@type': 'Place', name: 'West Africa' },
            { '@type': 'Place', name: 'Latin America' },
          ],
          offers: {
            '@type': 'Offer',
            url: canonicalUrl,
            description: optimizedDesc,
          },
        },
      ],
    };
    const schemaJson = JSON.stringify(structuredData).replace(/</g, '\\u003c');
    output = output.replace(
      /<\/head>/i,
      `  <script id="schema-jsonld-static-page" type="application/ld+json">${schemaJson}</script>\n</head>`
    );
  }

  if (!relPath) {
    const faqLanguage = (lang === 'zh-cn' ? 'zh' : lang) as HomeFaqLanguage;
    const homepageSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://www.ddnzglobal.com/#website',
          url: 'https://www.ddnzglobal.com/',
          name: 'DDNZ Global',
          inLanguage: targetLang,
          publisher: { '@id': 'https://www.ddnzglobal.com/#organization' },
        },
        {
          '@type': 'Organization',
          '@id': 'https://www.ddnzglobal.com/#organization',
          name: lang === 'zh-cn' ? '大递诺展贸易有限公司' : 'DDNZ Global Trade Co., Ltd',
          alternateName: ['DDNZ Global', '大递诺展'],
          url: 'https://www.ddnzglobal.com/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.ddnzglobal.com/images/brand/ddnz-global-mark-v1.png',
          },
          description: optimizedDesc,
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'partnership@ddnzglobal.com',
            contactType: 'customer service',
            areaServed: 'Global',
            availableLanguage: ['English', 'Chinese', 'Russian', 'French', 'Spanish', 'Arabic'],
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${canonicalUrl}#faq`,
          url: canonicalUrl,
          inLanguage: targetLang,
          mainEntity: getLocalizedHomeFaqs(faqLanguage).map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ],
    };
    output = output.replace(
      /<\/head>/i,
      `  <script id="schema-jsonld-static-home" type="application/ld+json">${JSON.stringify(homepageSchema).replace(/</g, '\\u003c')}</script>\n</head>`,
    );
  }

  if (relPath.startsWith('blog/')) {
    const rawImage = seo.image || 'https://www.ddnzglobal.com/images/brand/ddnz-global-mark-v1.png';
    const absoluteImage = rawImage.startsWith('http')
      ? rawImage
      : `https://www.ddnzglobal.com${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`;
    const blogSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: seo.headline || seo.title.replace(/ \| DDNZ Global$/, ''),
      description: optimizedDesc,
      image: absoluteImage,
      datePublished: seo.datePublished || '',
      dateModified: seo.dateModified || seo.datePublished || '',
      inLanguage: targetLang,
      author: {
        '@type': 'Organization',
        name: seo.governed ? 'DDNZ Global Professional Team' : 'DDNZ Global Editorial Archive',
        url: 'https://www.ddnzglobal.com/'
      },
      publisher: {
        '@type': 'Organization',
        '@id': 'https://www.ddnzglobal.com/#organization',
        name: lang === 'zh-cn' ? '大递诺展贸易有限公司' : 'DDNZ Global Trade Co., Ltd',
        url: 'https://www.ddnzglobal.com/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.ddnzglobal.com/images/brand/ddnz-global-mark-v1.png'
        }
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl }
    };
    output = output.replace(
      /<\/head>/i,
      `  <script id="schema-jsonld-static-blog" type="application/ld+json">${JSON.stringify(blogSchema).replace(/</g, '\\u003c')}</script>\n</head>`
    );
  }

  return output;
}

const escapeStaticText = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const sourcingStaticContent: Record<string, {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  definition: string;
  products: string[];
  controls: string;
  workflow: string[];
  request: string;
  quoteHref: string;
}> = {
  'products': {
    eyebrow: 'Product Sourcing · Category Overview',
    title: 'Choose a China sourcing category, then compare the variables that affect the order.',
    intro: 'DDNZ connects category selection with supplier comparison, approval evidence, production follow-up, quality control and export handoff.',
    image: '/images/product-showcase/index/audio-speakers-category.webp',
    imageAlt: 'Audio and speaker products presented as one of the DDNZ China sourcing categories',
    definition: 'The current representative categories cover commercial kitchen and refrigeration equipment, audio and speakers, mobile accessories and outdoor products.',
    products: [
      'Commercial kitchen equipment and operations-led kitchen planning.',
      'Commercial refrigeration, display cabinets, prep counters and ice makers.',
      'Portable, party and specialty speakers with exact-model controls.',
      'Mobile accessories across cases, charging, power and cables.',
      'Outdoor coolers, portable cold, power and camp systems.',
    ],
    controls: 'Each category page defines the model, configuration, destination and evidence that must remain comparable before an order is released.',
    workflow: ['Choose a category.', 'Define destination and buying stage.', 'Compare complete configurations.', 'Approve samples and specifications.', 'Inspect, reconcile and hand off for export.'],
    request: 'Send the destination, product list or reference photos, estimated quantities, buying stage and target timing.',
    quoteHref: '/get-a-quote?leadGoal=Product+Sourcing&source=products_index',
  },
  'sourcing-services': {
    eyebrow: 'China Sourcing Services',
    title: 'Buy closer to China supply while keeping control of what happens next.',
    intro: 'DDNZ supports flexible mixed-SKU retail orders and managed sourcing projects with recorded comparison, approval, production and release checkpoints.',
    image: '/images/product-showcase/kitchen/kitchen-factory-inspection-sanitized.webp',
    imageAlt: 'China-side factory inspection and equipment review supporting a managed sourcing project',
    definition: 'The service is designed for importers and retailers that need more control than an online listing or an unrecorded supplier introduction can provide.',
    products: [
      'Flexible mixed-SKU and smaller retail replenishment orders.',
      'Supplier discovery, qualification and like-for-like quotation comparison.',
      'Sample and specification approval records.',
      'Production follow-up, inspection and exception management.',
      'Pack-out, consolidation and export handoff coordination.',
    ],
    controls: 'Low online prices are not treated as comparable until configuration, quality, quantity, terms and delivery are verified. Approvals remain tied to the order and release evidence is returned to the buyer.',
    workflow: ['Define the buying brief.', 'Compare qualified offers.', 'Approve the exact basis.', 'Follow production milestones.', 'Inspect and release the approved cargo.'],
    request: 'Send the product references, destination, target quantities, buying stage and the points that currently feel uncertain or uncontrolled.',
    quoteHref: '/get-a-quote?leadGoal=Product+Sourcing&source=sourcing_services',
  },
  'refrigeration-equipment': {
    eyebrow: 'Product Sourcing · Commercial Refrigeration',
    title: 'Source commercial refrigeration by model, climate and operating requirement.',
    intro: 'DDNZ compares commercial refrigerators, prep counters, display cabinets and ice makers against the destination climate, service environment and approved configuration.',
    image: '/images/product-showcase/refrigeration/upright-dg860l4-sanitized.webp',
    imageAlt: 'Sanitized upright commercial refrigerator for China sourcing comparison',
    definition: 'A comparable refrigeration quotation should identify the model, dimensions, usable volume, ambient class, refrigerant, voltage, temperature range, component access and packing.',
    products: ['Upright refrigerators and freezers.', 'Prep counters and under-counter refrigeration.', 'Display cabinets and merchandising refrigeration.', 'Ice makers and category-specific accessories.'],
    controls: 'Climate, pull-down or holding performance, electrical standard, refrigerant, labels, accessories and pack-out remain tied to the approved model.',
    workflow: ['Define use and destination climate.', 'Normalize model specifications.', 'Approve configuration and evidence.', 'Inspect function, identity and packing.', 'Release for export handoff.'],
    request: 'Send the destination, product type, required temperature range, dimensions or reference models, quantity and timing.',
    quoteHref: '/get-a-quote?leadGoal=Product+Sourcing&industry=Commercial+Refrigeration&source=refrigeration_equipment_product',
  },
  'sourcing/commercial-kitchen-equipment-from-china': {
    eyebrow: 'Product Sourcing · Commercial Kitchen Equipment',
    title: 'Source commercial kitchen equipment from China with a market-defined control plan.',
    intro:
      'For importers, distributors, restaurant groups, hotel projects and food-service contractors that need more than a supplier list. DDNZ coordinates the buying brief, supplier comparison, inspection evidence, consolidation and export handoff against the destination market.',
    image: '/images/product-showcase/kitchen/kitchen-operating-sanitized.webp',
    imageAlt:
      'Commercial kitchen project with stainless cooking, preparation, washing and refrigeration zones',
    definition:
      'The category covers commercial cooking, refrigeration, food preparation, meat processing, bar and beverage systems, stainless equipment and coordinated kitchen packages.',
    products: [
      'Commercial cooking: griddles, fryers, ranges, ovens, grills and heated holding equipment.',
      'Commercial refrigeration: freezers, chillers, counters, display cabinets and cold-room components.',
      'Food preparation: meat grinders, slicers, mixers and processing machinery.',
      'Bar, beverage and stainless systems, including counters, sinks, tables, shelving and extraction.',
      'Multi-supplier receiving, packing review, consolidation and export coordination from China.',
    ],
    controls:
      'A usable quotation identifies the exact model, materials, capacity, dimensions, utilities and included accessories. Evidence is checked against the manufacturer, model, destination market and validity. Before release, the inspection record should connect the approved specification to the data plate, function checks, finish, accessories, packing method and measured shipping dimensions.',
    workflow: [
      'Define the destination, intended commercial use, product list, quantities, budget and timing.',
      'Normalize supplier quotations before comparing price or lead time.',
      'Verify supplier identity, technical documents and claim-specific evidence.',
      'Inspect the agreed model, quantity, labels, function, accessories and packing.',
      'Consolidate approved goods and prepare the export handoff.',
    ],
    request:
      'Send the destination country, product list or reference models, estimated quantities, target timing and the services required. The first response will identify missing specifications, the evidence that can be checked and the buyer or local-compliance decisions still required.',
    quoteHref:
      '/get-a-quote?leadGoal=Product+Sourcing&industry=Commercial+Kitchen+Equipment&source=sourcing_landing',
  },
  'sourcing/audio-speakers-from-china': {
    eyebrow: 'Product Sourcing · Audio & Speakers',
    title: 'Source audio and speaker products from China with every sellable configuration defined.',
    intro:
      'For importers, distributors, electronics wholesalers, event suppliers and private-label brands. DDNZ compares complete configurations and coordinates samples, inspection evidence, consolidation and export handoff.',
    image: '/images/product-showcase/audio/vintage-range-hero-v1.webp',
    imageAlt: 'Portable and party speaker range prepared for China sourcing comparison',
    definition:
      'The category covers portable and party speakers, professional and installed audio, microphones, headphones, amplifiers, plus the batteries, adapters, accessories, packaging and branding that determine the real sellable unit.',
    products: [
      'Portable Bluetooth, TWS and battery-powered speakers for retail and promotional channels.',
      'Party speakers with defined drivers, lighting, microphones, battery and trolley configuration.',
      'Professional and installed audio, amplifiers, mixers, microphones and headphones.',
      'Wireless, charging, battery, adapter, cable and accessory configurations.',
      'Private-label artwork, retail packaging, inspection and consolidated export coordination.',
    ],
    controls:
      'Supplier quotations are normalized across cabinet, drivers, functions, battery, microphones, accessories, branding and packing. The exact sample is then tied to function checks, installed battery identity, transport evidence where applicable, approved artwork, labels and final pack-out.',
    workflow: [
      'Define the destination, sales channel, configuration, quantity, target price and timing.',
      'Compare complete sellable units rather than similar product photographs.',
      'Verify supplier identity, model files, battery and wireless evidence.',
      'Inspect functions, included accessories, labels, artwork and packing.',
      'Consolidate approved SKUs and prepare the export handoff.',
    ],
    request:
      'Send the destination, reference models or photos, required functions, battery and microphone configuration, quantity, packaging or branding needs and target timing.',
    quoteHref:
      '/get-a-quote?leadGoal=Product+Sourcing&industry=Audio+%26+Speakers&source=sourcing_landing',
  },
  'sourcing/mobile-accessories-from-china': {
    eyebrow: 'Product Sourcing · Mobile Accessories',
    title: 'Build a mobile-accessories range in China with SKU, compatibility, power and packaging under control.',
    intro:
      'For importers, electronics distributors, retail chains, e-commerce sellers and private-label brands managing fast-changing assortments. DDNZ structures the SKU list, normalizes supplier offers, verifies samples and coordinates consolidation and export.',
    image: '/images/product-showcase/mobile/family-phone-cases-v1.webp',
    imageAlt: 'Mobile accessories assortment including charging, protection and mounting products',
    definition:
      'The category includes chargers, cables, power banks, earbuds, cases, screen protection, mounts, wearables and mixed accessory assortments where compatibility, performance, labeling and retail packaging determine sellability.',
    products: [
      'Wall, car and travel chargers with plug, ports, protocol and rated output defined.',
      'USB-C and other cable formats with connector, length, material and power claims aligned.',
      'Power banks with capacity, cell, ports, charging behavior and transport documents.',
      'Earbuds, wearables, cases, screen protectors, holders and vehicle mounts.',
      'Mixed-SKU barcode, artwork, color/model matrix, inspection and consolidation control.',
    ],
    controls:
      'Each SKU is tied to its device compatibility, connector, protocol, rated data, materials, dimensions, included parts, color and pack. Agreed checks can cover charging, capacity, temperature, fit, pairing or durability, while the final inspection reconciles barcode, artwork, quantity and master-carton marks.',
    workflow: [
      'Define devices, compatibility, SKU matrix, quantity, sales channel and timing.',
      'Normalize supplier offers across specifications, materials and included parts.',
      'Approve samples and verify performance or market-bound evidence.',
      'Inspect SKU, color, artwork, barcode, quantity and pack-out.',
      'Reconcile mixed suppliers and prepare the consolidated export handoff.',
    ],
    request:
      'Send the destination, device or compatibility list, target SKUs, quantities, reference photos, performance claims, packaging or branding needs and target timing.',
    quoteHref:
      '/get-a-quote?leadGoal=Product+Sourcing&industry=Mobile+Accessories&source=sourcing_landing',
  },
  'sourcing/outdoor-products-from-china': {
    eyebrow: 'Product Sourcing · Outdoor Products',
    title: 'Build an outdoor product range in China without narrowing the category too early.',
    intro:
      'For importers, distributors, hospitality projects and outdoor brands sourcing a current or expanding assortment. DDNZ coordinates the buying brief, supplier comparison, market-specific specifications, inspection evidence, consolidation and export handoff.',
    image: '/images/product-showcase/outdoor/range-atlas-hero-v1.webp',
    imageAlt: 'Portable outdoor refrigerator beside a camper in a lakeside setting',
    definition:
      'The top-level category is intentionally extensible: outdoor grills, insulated coolers, outdoor and portable refrigerators, outdoor kitchens, accessories and future outdoor product lines.',
    products: [
      'Outdoor grills in gas, charcoal and portable formats with market-specific fuel and label requirements.',
      'Hard and soft insulated coolers, transport boxes and related accessories.',
      'Vehicle, outdoor and portable refrigerators with defined voltage, power source and climate conditions.',
      'Outdoor kitchen modules, cabinets, counters, sinks, refrigeration and coordinated cooking units.',
      'Covers, stands, batteries, adapters and other model-specific accessories.',
    ],
    controls:
      'The buying brief should define the destination climate, outdoor exposure, transport mode, duty cycle, power or fuel source and intended user. Performance claims need a stated method, such as temperature retention, cooling pull-down, current draw, corrosion or fuel-system checks. Model identity, warnings, manuals, packing and any battery or refrigerant declarations remain tied to the destination market.',
    workflow: [
      'Define the use environment, product list, quantities, budget and timing.',
      'Compare like-for-like models and included accessories.',
      'Verify supplier identity, technical claims and market-bound evidence.',
      'Inspect performance, labels, accessories and packing under an agreed method.',
      'Plan mixed-SKU consolidation and the export handoff.',
    ],
    request:
      'Send the destination country, intended use, product list or reference photos, quantities, target timing and required services. The first response will identify the tests, technical files, packing details and buyer decisions needed before supplier or shipment release.',
    quoteHref:
      '/get-a-quote?leadGoal=Product+Sourcing&industry=Outdoor+Products&source=sourcing_landing',
  },
};

const howWeWorkStaticCopy: Record<string, { eyebrow: string; title: string; steps: string[]; cta: string }> = {
  en: {
    eyebrow: 'How DDNZ works',
    title: 'One brief. Six accountable checkpoints from supplier search to export handoff.',
    steps: ['Define the buying brief', 'Search and normalize supplier offers', 'Approve samples and specifications', 'Follow production against the approved basis', 'Collect QC evidence at the agreed scope', 'Reconcile cargo and export handoff'],
    cta: 'Start a sourcing brief',
  },
  'zh-cn': {
    eyebrow: 'DDNZ 如何工作',
    title: '一份采购需求，六个责任节点，从供应商搜索到出口交接。',
    steps: ['定义采购需求', '搜索供应商并统一报价口径', '确认样品与规格', '依据确认口径跟进生产', '按约定范围收集验货证据', '核对货物并完成出口交接'],
    cta: '提交采购需求',
  },
  ru: {
    eyebrow: 'Как работает DDNZ',
    title: 'Один бриф. Шесть ответственных этапов — от поставщика до экспортной передачи.',
    steps: ['Определить закупочный бриф', 'Найти и сопоставить предложения', 'Утвердить образец и спецификацию', 'Проследить производство', 'Собрать доказательства QC', 'Сверить груз и передать в экспорт'],
    cta: 'Начать закупочный бриф',
  },
  fr: {
    eyebrow: 'Comment travaille DDNZ',
    title: 'Un brief. Six points de contrôle, de la recherche fournisseur à la transmission export.',
    steps: ['Définir le brief d’achat', 'Rechercher et normaliser les offres', 'Approuver échantillon et spécifications', 'Suivre la production', 'Collecter les preuves QC', 'Rapprocher et transmettre à l’export'],
    cta: 'Démarrer un brief sourcing',
  },
  es: {
    eyebrow: 'Cómo trabaja DDNZ',
    title: 'Un brief. Seis puntos responsables desde la búsqueda del proveedor hasta la entrega de exportación.',
    steps: ['Definir el brief de compra', 'Buscar y normalizar ofertas', 'Aprobar muestras y especificaciones', 'Seguir la producción', 'Recoger evidencia de calidad', 'Conciliar carga y entrega de exportación'],
    cta: 'Iniciar solicitud de compra',
  },
  ar: {
    eyebrow: 'كيف تعمل DDNZ',
    title: 'موجز واحد وست نقاط مسؤولية من البحث عن المورد إلى تسليم التصدير.',
    steps: ['تحديد موجز الشراء', 'البحث وتوحيد عروض الموردين', 'اعتماد العينة والمواصفات', 'متابعة الإنتاج', 'جمع أدلة مراقبة الجودة', 'مطابقة البضاعة وتسليم التصدير'],
    cta: 'ابدأ موجز التوريد',
  },
};

function injectStaticRouteContent(
  htmlContent: string,
  lang: string,
  relPath: string,
  post?: Record<string, any>,
) {
  let staticBody = '';

  if (relPath.startsWith('blog/') && post) {
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    const summary = post.summary
      ? `<p class="mt-5 text-lg leading-8 text-slate-700">${escapeStaticText(post.summary)}</p>`
      : '';
    const cover = post.thumbnailUrl
      ? `<figure class="mt-8"><img src="${escapeStaticText(post.thumbnailUrl)}" alt="${escapeStaticText(post.title)}" width="1200" height="675" /></figure>`
      : '';
    staticBody = `
      <main class="mx-auto max-w-4xl px-4 py-16 sm:px-6" dir="${direction}" data-static-fallback="article">
        <article>
          <p class="text-xs font-black uppercase tracking-wider text-amber-700">DDNZ Global Insights</p>
          <h1 class="mt-4 text-4xl font-black leading-tight text-slate-950">${escapeStaticText(post.title)}</h1>
          ${summary}
          ${cover}
          <div class="article-body mt-10">${post.content || ''}</div>
        </article>
      </main>`;
  } else if (relPath === 'how-we-work') {
    const processCopy = howWeWorkStaticCopy[lang] || howWeWorkStaticCopy.en;
    const processSeo = seoDataMatrix['how-we-work'][lang] || seoDataMatrix['how-we-work'].en;
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    const quotePrefix = lang === 'en' ? '' : `/${lang}`;
    staticBody = `
      <main class="mx-auto max-w-5xl px-4 py-16 sm:px-6" dir="${direction}" data-static-fallback="how-we-work">
        <p class="text-xs font-black uppercase tracking-wider text-purple-800">${escapeStaticText(processCopy.eyebrow)}</p>
        <h1 class="mt-4 text-4xl font-black leading-tight text-slate-950">${escapeStaticText(processCopy.title)}</h1>
        <p class="mt-5 text-lg leading-8 text-slate-700">${escapeStaticText(processSeo.desc)}</p>
        <figure class="mt-8">
          <img src="/media/process/brief-spec-discussion-poster.webp" alt="${escapeStaticText(processCopy.eyebrow)}" width="720" height="1280" />
        </figure>
        <section class="mt-10">
          <h2 class="text-2xl font-black text-slate-950">${escapeStaticText(processCopy.eyebrow)}</h2>
          <ol class="mt-4 list-decimal space-y-2 pl-6">${processCopy.steps.map((item) => `<li>${escapeStaticText(item)}</li>`).join('')}</ol>
        </section>
        <p class="mt-8"><a href="${quotePrefix}/get-a-quote?leadGoal=Product+Sourcing&amp;source=how_we_work">${escapeStaticText(processCopy.cta)}</a></p>
      </main>`;
  } else {
    const sourcing = sourcingStaticContent[relPath];
    if (sourcing && lang === 'en') {
      staticBody = `
        <main class="mx-auto max-w-5xl px-4 py-16 sm:px-6" data-static-fallback="sourcing">
          <p class="text-xs font-black uppercase tracking-wider text-amber-700">${escapeStaticText(sourcing.eyebrow)}</p>
          <h1 class="mt-4 text-4xl font-black leading-tight text-slate-950">${escapeStaticText(sourcing.title)}</h1>
          <p class="mt-5 text-lg leading-8 text-slate-700">${escapeStaticText(sourcing.intro)}</p>
          <figure class="mt-8">
            <img src="${escapeStaticText(sourcing.image)}" alt="${escapeStaticText(sourcing.imageAlt)}" width="1200" height="675" />
          </figure>
          <p class="mt-8 leading-7 text-slate-700">${escapeStaticText(sourcing.definition)}</p>
          <section class="mt-10">
            <h2 class="text-2xl font-black text-slate-950">Product scope</h2>
            <ul class="mt-4 list-disc space-y-2 pl-6">${sourcing.products
              .map((item) => `<li>${escapeStaticText(item)}</li>`)
              .join('')}</ul>
          </section>
          <section class="mt-10">
            <h2 class="text-2xl font-black text-slate-950">Evidence-based control plan</h2>
            <p class="mt-4 leading-7 text-slate-700">${escapeStaticText(sourcing.controls)}</p>
          </section>
          <section class="mt-10">
            <h2 class="text-2xl font-black text-slate-950">Working sequence</h2>
            <ol class="mt-4 list-decimal space-y-2 pl-6">${sourcing.workflow
              .map((item) => `<li>${escapeStaticText(item)}</li>`)
              .join('')}</ol>
          </section>
          <section class="mt-10">
            <h2 class="text-2xl font-black text-slate-950">Start with a scoped request</h2>
            <p class="mt-4 leading-7 text-slate-700">${escapeStaticText(sourcing.request)}</p>
            <p class="mt-6"><a href="${escapeStaticText(sourcing.quoteHref)}">Submit the sourcing brief</a></p>
          </section>
        </main>`;
    }
  }

  if (!staticBody) return htmlContent;
  return htmlContent.replace('<div id="root"></div>', `<div id="root">${staticBody}</div>`);
}

function run() {
  console.log('🚀 Starting Multilingual SEO static pages compile-time pre-renderer...');

  if (!fs.existsSync(sourceHtmlPath)) {
    console.error(`❌ Source HTML not found at: ${sourceHtmlPath}. Please run "npm run build" first.`);
    process.exit(1);
  }

  // Read base built HTML
  const originalHtml = fs.readFileSync(sourceHtmlPath, 'utf-8');

  // Today's date for sitemaps
  const today = new Date().toISOString().slice(0, 10);

  const basePaths = [
    { path: '', priority: '1.0', changefreq: 'weekly', lastmod: today, languages: ['en', 'zh-cn', 'ru', 'fr', 'es', 'ar'] },
    { path: 'how-we-work', priority: '0.9', changefreq: 'monthly', lastmod: today, languages: ['en', 'zh-cn', 'ru', 'fr', 'es', 'ar'] },
    { path: 'insights', priority: '0.8', changefreq: 'weekly', lastmod: today, languages: ['en', 'zh-cn', 'ru', 'fr', 'es', 'ar'] },
    { path: 'services/sea-freight', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'services/air-freight', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'services/amazon-fba', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'services/warehouse-services', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'shipping-from-china-to-middle-east', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'shipping-from-china-to-central-asia', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'shipping-from-china-to-west-africa', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'shipping-from-china-to-latin-america', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'get-a-quote', priority: '0.8', changefreq: 'monthly', lastmod: today },
    { path: 'products', priority: '0.9', changefreq: 'monthly', lastmod: today, languages: ['en'] },
    { path: 'sourcing-services', priority: '0.9', changefreq: 'monthly', lastmod: today, languages: ['en'] },
    { path: 'refrigeration-equipment', priority: '0.9', changefreq: 'monthly', lastmod: today, languages: ['en'] },
    { path: 'sourcing/commercial-kitchen-equipment-from-china', priority: '0.9', changefreq: 'monthly', lastmod: today, languages: ['en'] },
    { path: 'sourcing/audio-speakers-from-china', priority: '0.9', changefreq: 'monthly', lastmod: today, languages: ['en'] },
    { path: 'sourcing/mobile-accessories-from-china', priority: '0.9', changefreq: 'monthly', lastmod: today, languages: ['en'] },
    { path: 'sourcing/outdoor-products-from-china', priority: '0.9', changefreq: 'monthly', lastmod: today, languages: ['en'] },
    { path: 'sourcing-services/supplier-search', priority: '0.9', changefreq: 'monthly', lastmod: today },
    { path: 'sourcing-services/inspection-quality-control', priority: '0.9', changefreq: 'monthly', lastmod: today },
    { path: 'sourcing-services/consolidation-export', priority: '0.9', changefreq: 'monthly', lastmod: today }
  ];
  const countryPaths = countryRouteSlugs.map((country) => ({
    path: `shipping-from-china-to-${country}`,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: today,
  }));

  // Try to load blog posts
  let blogPosts: any[] = [];
  const notionBlogPath = path.resolve(process.cwd(), 'src/data/notionBlogData.json');
  const fallbackBlogPath = path.resolve(process.cwd(), 'src/data/blogData.json');

  if (fs.existsSync(notionBlogPath)) {
    try {
      blogPosts = JSON.parse(fs.readFileSync(notionBlogPath, 'utf-8'));
    } catch (e) {
      console.warn('⚠️ Failed to parse notionBlogData.json:', e);
    }
  } else if (fs.existsSync(fallbackBlogPath)) {
    try {
      blogPosts = JSON.parse(fs.readFileSync(fallbackBlogPath, 'utf-8'));
    } catch (e) {
      console.warn('⚠️ Failed to parse blogData.json:', e);
    }
  }

  const allPaths: Array<{ path: string; priority: string; changefreq: string; lastmod: string; languages?: string[] }> = [...basePaths, ...countryPaths];
  blogPosts.forEach((post) => {
    if (post && (post.slug || post.id)) {
      allPaths.push({
        path: `blog/${post.slug || post.id}`,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: post.date || today,
        languages: [post.language || 'en']
      });
    }
  });

  const languages = ['en', 'zh-cn', 'ru', 'fr', 'es', 'ar'] as const;

  // Now, pre-render EVERY path for EVERY language!
  allPaths.forEach((entry) => {
    (entry.languages || languages).forEach((lang) => {
      // Find or build the SEO metadata
      let seo: SEOItem | undefined = seoDataMatrix[entry.path]?.[lang];
      let routePost: Record<string, any> | undefined;
      const countrySlug = entry.path.replace(/^shipping-from-china-to-/, '');
      if (!seo && countryNames[countrySlug]) {
        seo = buildCountrySeo(countrySlug, lang);
      }

      // If it's a blog post, build it dynamically
      if (entry.path.startsWith('blog/')) {
        const postSlugOrId = entry.path.replace('blog/', '');
        const post = blogPosts.find((p) => p.slug === postSlugOrId || p.id === postSlugOrId);
        if (post) {
          routePost = post;
          const cat = post.category ? post.category.toLowerCase() : 'global logistics';
          
          let computedTitle = '';
          if (post.slug === 'Actionable-insights-for-Eastern-Europe') {
            computedTitle = 'China Sourcing Alert: July Rate Hikes & Customs Guide';
          } else if (post.slug === 'high-compliance-new-energy-logistics') {
            computedTitle = 'New Energy & DG Logistics from China | DDNZ Global Insights';
          } else if (post.slug === 'cheap-speakers-china-african-trader-verification') {
            computedTitle = 'Cheap China Speakers: African Trader Verification | DDNZ Global';
          } else {
            const rawTitle = post.title.trim();
            const suffix = " | DDNZ Global";
            const maxTitleLen = 65;
            const titleLead = rawTitle.split(/[:：]/, 1)[0].trim();
            if (rawTitle.length + suffix.length <= maxTitleLen) {
              computedTitle = rawTitle + suffix;
            } else if (
              titleLead.length >= 24 &&
              titleLead.length + suffix.length <= maxTitleLen
            ) {
              // Preserve a complete, descriptive lead instead of publishing a
              // search title that ends in an ambiguous mechanical ellipsis.
              computedTitle = titleLead + suffix;
            } else {
              const maxPrefixLen = maxTitleLen - suffix.length - 1;
              const candidate = rawTitle.slice(0, maxPrefixLen);
              const lastSpace = candidate.lastIndexOf(' ');
              const completePrefix = lastSpace > maxPrefixLen * 0.72
                ? candidate.slice(0, lastSpace)
                : candidate;
              computedTitle = completePrefix.trim() + '…' + suffix;
            }
          }

          const rawDesc = post.summary || post.title || '';
          const descCandidate = rawDesc.slice(0, 154);
          const descSpace = descCandidate.lastIndexOf(' ');
          const computedDesc = rawDesc.length > 155
            ? `${(descSpace > 112 ? descCandidate.slice(0, descSpace) : descCandidate).trim()}…`
            : rawDesc;

          seo = {
            title: computedTitle,
            desc: computedDesc,
            keywords: `${post.primaryQuery || cat}, China sourcing, China freight forwarder, DDNZ Global`,
            image: post.thumbnailUrl,
            datePublished: post.date,
            dateModified: post.lastEdited || post.lastVerified || post.date,
            headline: post.title,
            governed: Boolean(post.governed)
          };
        }
      }

      // If not found (fallback on some paths where we don't have direct translation yet),
      // we fall back to 'en'
      if (!seo) {
        seo = seoDataMatrix[entry.path]?.['en'];
      }

      // If still not found, use root default
      if (!seo) {
        seo = seoDataMatrix['']['en'];
      }

      // Determine where the index.html should be saved
      let targetDir: string;
      if (lang === 'en') {
        if (entry.path === '') {
          targetDir = distDir;
        } else {
          targetDir = path.join(distDir, entry.path);
        }
      } else {
        if (entry.path === '') {
          targetDir = path.join(distDir, lang);
        } else {
          targetDir = path.join(distDir, lang, entry.path);
        }
      }

      // Ensure directory exists
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const localizedHtml = injectSeoMeta(originalHtml, lang, entry.path, seo);
      const crawlableHtml = injectStaticRouteContent(localizedHtml, lang, entry.path, routePost);
      const targetFilePath = path.join(targetDir, 'index.html');
      fs.writeFileSync(targetFilePath, crawlableHtml, 'utf-8');
    });
  });

  console.log(`✅ Pre-rendered static pages for all ${allPaths.length} routes across ${languages.length} languages!`);

  // --- 3. Generate GitHub Pages fallback 404.html for SPA router redirection support ---
  // To keep canonical and default fallback metadata tidy, we use the root index.html
  const path404 = path.join(distDir, '404.html');
  const fallbackSeo = seoDataMatrix['']['en'];
  const fallbackHtml = injectSeoMeta(originalHtml, 'en', '', fallbackSeo);
  fs.writeFileSync(path404, fallbackHtml, 'utf-8');
  console.log('✅ Generated GitHub Pages route fallback at: dist/404.html');

  // --- 4. Generate Dynamic sitemap.xml and robots.txt ---
  console.log('🌐 Generating dynamic sitemap.xml and robots.txt...');

  const formatUrl = (lang: string, relPath: string): string => {
    const baseUrl = 'https://www.ddnzglobal.com';
    if (!relPath) {
      return lang === 'en' ? `${baseUrl}/` : `${baseUrl}/${lang}`;
    }
    return lang === 'en' ? `${baseUrl}/${relPath}` : `${baseUrl}/${lang}/${relPath}`;
  };

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n';

  allPaths.forEach((entry) => {
    (entry.languages || languages).forEach((lang) => {
      const loc = formatUrl(lang, entry.path);
      const alternateLanguages = entry.path.startsWith('blog/') ? [lang] : (entry.languages || languages);

      // Determine priority: localized subpages can have slightly lower priority or same
      const priorityVal = lang === 'en' ? entry.priority : (parseFloat(entry.priority) - 0.1).toFixed(1);

      xml += '  <url>\n';
      xml += `    <loc>${loc}</loc>\n`;
      const defaultUrl = formatUrl(alternateLanguages.includes('en') ? 'en' : lang, entry.path);
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}" />\n`;
      alternateLanguages.forEach((code) => {
        xml += `    <xhtml:link rel="alternate" hreflang="${code}" href="${formatUrl(code, entry.path)}" />\n`;
      });
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${priorityVal}</priority>\n`;
      xml += '  </url>\n';
    });
  });

  xml += '\n</urlset>\n';

  // Write to both public/ and dist/
  const publicDir = path.resolve(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf-8');
  const urlCount = allPaths.reduce((total, entry) => total + (entry.languages || languages).length, 0);
  console.log(`✅ Dynamically generated sitemap.xml (with ${urlCount} URLs) at public/sitemap.xml and dist/sitemap.xml`);

  // Generate optimized robots.txt
  const robotsTxt = `# Search and answer-engine crawlers are intentionally allowed.
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: *
Allow: /

# Sitemap Location
Sitemap: https://www.ddnzglobal.com/sitemap.xml
`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf-8');
  console.log('✅ Generated optimized robots.txt at public/robots.txt and dist/robots.txt');

  const redirectDataPath = path.resolve(process.cwd(), 'src/data/notionRedirects.json');
  if (fs.existsSync(redirectDataPath)) {
    const redirects = JSON.parse(fs.readFileSync(redirectDataPath, 'utf-8')) as Array<{ from: string; to: string }>;
    redirects.forEach((redirect) => {
      const sourceDir = path.join(distDir, redirect.from.replace(/^\/+/, ''));
      fs.mkdirSync(sourceDir, { recursive: true });
      const targetUrl = `https://www.ddnzglobal.com${redirect.to}`;
      const redirectHtml = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex,follow"><link rel="canonical" href="${targetUrl}"><meta http-equiv="refresh" content="0;url=${targetUrl}"><script>location.replace(${JSON.stringify(targetUrl)})</script><title>Article moved</title></head><body><p>This article has moved to <a href="${targetUrl}">${targetUrl}</a>.</p></body></html>`;
      fs.writeFileSync(path.join(sourceDir, 'index.html'), redirectHtml, 'utf-8');
    });
    console.log(`✅ Generated ${redirects.length} canonical article redirect page(s).`);
  }

  console.log('🎉 Multilingual SEO static generation complete!');
}

run();
