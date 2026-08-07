import fs from 'fs';
import path from 'path';

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
      title: 'Heaven Born | China Freight Forwarding & Logistics',
      desc: 'Heaven Born International Freight provides freight forwarding from China, with trade support delivered by DDNZ Global Trade Co., Ltd.',
      keywords: 'Heaven Born International Freight, DDNZ Global Trade, China Cargo Agent, Guangzhou Freight Forwarder, Sea Freight From China, Air Cargo, Amazon FBA Logistics, China Sourcing Agent',
    },
    'zh-cn': {
      title: '华正邦泰国际货运 | 广州出口货代、国际海运与空运',
      desc: '华正邦泰国际货运代理有限公司提供中国出口货运服务，大递诺展贸易有限公司协同提供验厂、验货、代出口与报关等贸易支持。',
      keywords: '广州货代, 广州出口货运代理, 华正邦泰国际货运, 国际海运, 国际空运, 亚马逊FBA, 中国采购代理, 国际货运代理',
    },
    ru: {
      title: 'Heaven Born International Freight | Международная доставка грузов из Китая',
      desc: 'Оптимизируйте поставки из Китая с Heaven Born и DDNZ. Профессиональный поиск поставщиков, морские/авиаперевозки и сборные грузы из Гуанчжоу.',
      keywords: 'Heaven Born International Freight, DDNZ Global Trade, Доставка грузов из Китая, Карго Гуанчжоу, Морской фрахт Китай, Авиаперевозки из Китая, Экспортный логистический брокер',
    },
    fr: {
      title: 'Heaven Born International Freight | Transitaire de Fret en Chine',
      desc: "Optimisez votre chaîne d'approvisionnement en Chine avec Heaven Born & DDNZ. Approvisionnement, fret maritime/aérien et logistique à Guangzhou.",
      keywords: 'Heaven Born International Freight, DDNZ Global Trade, Transitaire maritime Chine, Fret aérien direct, Commissionnaire de transport Guangzhou, Logistique Chine Europe',
    },
    es: {
      title: 'Heaven Born | Agente de carga y logística desde China',
      desc: 'Heaven Born International Freight ofrece logística desde China, con apoyo comercial de DDNZ Global Trade Co., Ltd.',
      keywords: 'agente de carga china, flete marítimo china, carga aérea china, logística amazon fba, consolidación guangzhou',
    },
    ar: {
      title: 'Heaven Born | وكيل شحن ولوجستيات من الصين',
      desc: 'تقدم Heaven Born International Freight خدمات الشحن من الصين، مع دعم تجاري من DDNZ Global Trade Co., Ltd.',
      keywords: 'وكيل شحن الصين، الشحن البحري من الصين، الشحن الجوي من الصين، لوجستيات أمازون، تجميع قوانغتشو',
    }
  },
  // 2. Insights ("insights")
  'insights': {
    en: {
      title: 'Global Trade Insights & Logistics News | Heaven Born',
      desc: 'Stay informed with our curated global shipping guides, cross-border trade guidelines, and international supply chain trends.',
      keywords: 'global supply chain, shipping news china, cross-border e-commerce ddp, ocean freight guides, air cargo metrics'
    },
    'zh-cn': {
      title: '国际跨境贸易与供应链前沿资讯 | 华正邦泰国际货运',
      desc: '华正邦泰国际货运为您深度剖析最新一站式国际海运拼箱政策、跨境电商包税规则、全球空运极速干线趋势及海外仓配实战指南。',
      keywords: '国际货代资讯, 跨境物流指南, 外贸出口干货, 国际供应链前哨, 跨境电商干货库, 华正邦泰国际货运, 华正邦泰'
    },
    ru: {
      title: 'Блоги и аналитика ВЭД, логистика из Китая | Heaven Born',
      desc: 'Актуальные инструкции, гайды по таможенному оформлению, морские тарифы и последние изменения рынка логистики из КНР.',
      keywords: 'новости логистики из китая, вэд китай рф, таможенная очистка грузов, ставки фрахта, карго шэньчжэнь'
    },
    fr: {
      title: 'Insights Logistique Globale et Transit Chine | Heaven Born',
      desc: "Suivez l'actualité du fret international, de la douane import/export, et des innovations supply chain.",
      keywords: 'actus transit chine europe, réglementation amazon fba, douane importations france, tarifs expédition maritime'
    },
    es: {
      title: 'Análisis de logística global y carga desde China | Heaven Born',
      desc: 'Guías de envío desde China, comercio transfronterizo y tendencias de la cadena de suministro internacional.',
      keywords: 'logística china, flete marítimo, carga aérea, comercio internacional, cadena de suministro'
    },
    ar: {
      title: 'رؤى اللوجستيات العالمية والشحن من الصين | Heaven Born',
      desc: 'أدلة الشحن من الصين وتحديثات التجارة العابرة للحدود واتجاهات سلسلة التوريد العالمية.',
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
    }
  },
  // 11. Quote ("get-a-quote")
  'get-a-quote': {
    en: {
      title: 'Get a Freight Quote & Route Plan | Heaven Born',
      desc: 'Request a custom freight quote for your sea freight, air cargo, or warehousing needs. Quick response from our senior global trade experts.',
      keywords: 'custom shipping quote, freight request china, cargo rates, logistics quote'
    },
    'zh-cn': {
      title: '获取专属国际货运报价与航线方案 | 华正邦泰国际货运',
      desc: '立即提交您的货运需求。无论是集装箱海运、高特空中货运还是广州仓储，我们的资深航线经理都将在第一时间内为您定制专属的省心报价方案。',
      keywords: '货运报价, 国际海运估价, 货代报价咨询, 华正邦泰国际货运'
    },
    ru: {
      title: 'Получить расчет стоимости доставки и логистики | Heaven Born',
      desc: 'Запросите индивидуальный расчет стоимости морских, авиационных перевозок или складских услуг из Китая. Быстрый ответ от экспертов.',
      keywords: 'расчет доставки из китая, стоимость карго, тарифы фрахта, индивидуальный запрос логистики'
    },
    fr: {
      title: 'Obtenir un devis personnalisé de logistique et SCM | Heaven Born',
      desc: "Demandez un devis de transport maritime, aérien ou d'entreposage depuis la Chine. Réponse rapide de nos experts en logistique internationale.",
      keywords: 'devis fret maritime, tarif transport aerien, estimation logistique chine'
    }
  },
  'sourcing/commercial-kitchen-equipment-from-china': {
    en: {
      title: 'Commercial Kitchen Equipment Sourcing from China | DDNZ',
      desc: 'Source commercial kitchen equipment from China with model-level supplier checks, inspection evidence, consolidation and export coordination.',
      keywords: 'commercial kitchen equipment from China, restaurant equipment sourcing China, commercial refrigerator supplier China, kitchen equipment inspection',
      image: '/images/sourcing/commercial-kitchen-project-hero.webp'
    }
  },
  'sourcing/outdoor-products-from-china': {
    en: {
      title: 'Outdoor Products Sourcing from China | DDNZ',
      desc: 'Source grills, coolers, portable refrigerators and outdoor kitchens from China with supplier checks, inspection and export coordination.',
      keywords: 'outdoor products sourcing China, BBQ grill supplier China, insulated cooler manufacturer China, portable refrigerator sourcing, outdoor kitchen China',
      image: '/images/sourcing/outdoor-car-refrigerator-catalog.webp'
    }
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
  const alternateLanguages = relPath.startsWith('blog/') || relPath.startsWith('sourcing/')
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
  const isServicePage = relPath.startsWith('services/') || relPath.startsWith('sourcing/');
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
    const sourcingOfferUrl = relPath === 'sourcing/commercial-kitchen-equipment-from-china'
      ? 'https://www.ddnzglobal.com/get-a-quote?leadGoal=Product+Sourcing&industry=Commercial+Kitchen+Equipment&source=sourcing_landing'
      : relPath === 'sourcing/outdoor-products-from-china'
        ? 'https://www.ddnzglobal.com/get-a-quote?leadGoal=Product+Sourcing&industry=Outdoor+Products&source=sourcing_landing'
        : 'https://www.ddnzglobal.com/get-a-quote/';
    const sourcingServiceType = relPath === 'sourcing/commercial-kitchen-equipment-from-china'
      ? 'Commercial kitchen equipment sourcing and export coordination from China'
      : relPath === 'sourcing/outdoor-products-from-china'
        ? 'Outdoor product sourcing and export coordination from China'
        : seo.title;
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
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          itemListElement: breadcrumbItems
        },
        {
          '@type': 'Service',
          '@id': `${canonicalUrl}#service`,
          name: seo.title,
          serviceType: isShippingPage
            ? `Freight forwarding from China to ${destinationName}`
            : sourcingServiceType,
          description: optimizedDesc,
          provider: {
            '@type': 'Organization',
            name: lang === 'zh-cn'
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
            description: relPath.startsWith('sourcing/')
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

  if (relPath.startsWith('blog/')) {
    const rawImage = seo.image || 'https://raw.githubusercontent.com/youngminghuang-del/ddnz_photo_assets/main/website_logo_ddnzglobal_512x512.png';
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
        name: 'Heaven Born International Freight Co., Ltd',
        url: 'https://www.ddnzglobal.com/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://raw.githubusercontent.com/youngminghuang-del/ddnz_photo_assets/main/website_logo_ddnzglobal_512x512.png'
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
  'sourcing/commercial-kitchen-equipment-from-china': {
    eyebrow: 'Product Sourcing · Commercial Kitchen Equipment',
    title: 'Source commercial kitchen equipment from China with a market-defined control plan.',
    intro:
      'For importers, distributors, restaurant groups, hotel projects and food-service contractors that need more than a supplier list. DDNZ coordinates the buying brief, supplier comparison, inspection evidence, consolidation and export handoff against the destination market.',
    image: '/images/sourcing/commercial-kitchen-project-hero.webp',
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
  'sourcing/outdoor-products-from-china': {
    eyebrow: 'Product Sourcing · Outdoor Products',
    title: 'Build an outdoor product range in China without narrowing the category too early.',
    intro:
      'For importers, distributors, hospitality projects and outdoor brands sourcing a current or expanding assortment. DDNZ coordinates the buying brief, supplier comparison, market-specific specifications, inspection evidence, consolidation and export handoff.',
    image: '/images/sourcing/outdoor-car-refrigerator-catalog.webp',
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
    { path: 'sourcing/commercial-kitchen-equipment-from-china', priority: '0.9', changefreq: 'monthly', lastmod: today, languages: ['en'] },
    { path: 'sourcing/outdoor-products-from-china', priority: '0.9', changefreq: 'monthly', lastmod: today, languages: ['en'] }
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
