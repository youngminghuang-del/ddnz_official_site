import fs from 'fs';
import path from 'path';

// Define the static page configurations mapping language routes to SEO meta headers
interface SEOItem {
  title: string;
  desc: string;
  keywords: string;
}

const seoDataMatrix: Record<string, Record<string, SEOItem>> = {
  // 1. Home ("")
  '': {
    en: {
      title: 'DDNZ Global & Heaven Born International Freight | China Sourcing & Cargo Logistics',
      desc: 'Optimize your China supply chain with Heaven Born International Freight and DDNZ Supply Chain. Offering professional China sourcing, sea freight forwarding, air cargo logistics, and FBA warehouse services from Guangzhou.',
      keywords: 'Heaven Born International Freight, DDNZ Supply Chain, China Cargo Agent, Guangzhou Freight Forwarder, Sea Freight From China, Air Cargo, Amazon FBA Logistics, China Sourcing Agent',
    },
    'zh-cn': {
      title: '华正邦泰国际物流 | DDNZ 供应链 | 广州靠谱实力出口货运代理与国际海运空运',
      desc: '广州靠谱实力出口货运代理，华正邦泰国际物流联合 DDNZ 供应链为您提供专业的中国商品采购代理、广州货代、集装箱海运（拼箱/整柜）、航空高特空运、亚马逊 FBA 及全球一站式跨境物流和海外仓增值支持。',
      keywords: '广州货代, 广州靠谱货代, 实力出口货代, 华正邦泰国际物流, DDNZ供应链, 广州出口货运代理, 广州集装箱海运, 广州空运专线, 中国商品采购代理, 国际货运代理',
    },
    ru: {
      title: 'Heaven Born International Freight & DDNZ Supply Chain | Международная доставка грузов из Китая',
      desc: 'Оптимизируйте ваши поставки из Китая с Heaven Born International Freight и DDNZ Supply Chain. Профессиональный поиск надежных поставщиков, недорогие морские контейнерные перевозки, авиадоставка под ключ и сборные грузы из Гуанчжоу.',
      keywords: 'Heaven Born International Freight, DDNZ Supply Chain, Доставка грузов из Китая, Карго Гуанчжоу, Морской фрахт Китай, Авиаперевозки из Китая, Экспортный логистический брокер',
    },
    fr: {
      title: 'Heaven Born International Freight & DDNZ Supply Chain | Transitaire de Fret en Chine & Logistique',
      desc: "Optimisez votre chaîne d'approvisionnement en Chine avec Heaven Born International Freight et DDNZ Supply Chain. Services professionnels d'approvisionnement, fret maritime, fret aérien et logistique globale à Guangzhou.",
      keywords: 'Heaven Born International Freight, DDNZ Supply Chain, Transitaire maritime Chine, Fret aérien direct, Commissionnaire de transport Guangzhou, Logistique Chine Europe',
    }
  },
  // 2. Insights ("insights")
  'insights': {
    en: {
      title: 'Global Trade Insights & Logistics News | DDNZ Global',
      desc: 'Stay informed with our curated global shipping guides, cross-border trade guidelines, and international supply chain trends.',
      keywords: 'global supply chain, shipping news china, cross-border e-commerce ddp, ocean freight guides, air cargo metrics'
    },
    'zh-cn': {
      title: '国际跨境贸易与供应链前沿资讯 | 华正邦泰国际货运',
      desc: '华正邦泰国际货运为您深度剖析最新一站式国际海运拼箱政策、跨境电商包税规则、全球空运极速干线趋势及海外仓配实战指南。',
      keywords: '国际货代资讯, 跨境物流指南, 外贸出口干货, 国际供应链前哨, 跨境电商干货库, 华正邦泰国际货运, 华正邦泰'
    },
    ru: {
      title: 'Блоги и аналитика ВЭД, логистика из Китая | DDNZ Global',
      desc: 'Актуальные инструкции, гайды по таможенному оформлению, морские тарифы и последние изменения рынка логистики из КНР.',
      keywords: 'новости логистики из китая, вэд китай рф, таможенная очистка грузов, ставки фрахта, карго шэньчжэнь'
    },
    fr: {
      title: 'Insights Logistique Globale et Transit Chine | DDNZ Global',
      desc: "Suivez l'actualité du fret international, de la douane import/export, et des innovations supply chain.",
      keywords: 'actus transit chine europe, réglementation amazon fba, douane importations france, tarifs expédition maritime'
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
      desc: '华正邦泰国际货运提供便宜中国海运拼箱及整柜进出口。cheap sea freight from china, LCL consolidation container china, door to door ocean freight shipping agent 双清包税。',
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
      desc: 'Need time-critical air cargo china? Get the best express air freight rate to US from an international air shipping agent shenzhen. Rapid delivery.',
      keywords: 'time-critical air cargo china, international air shipping agent shenzhen, express air freight rate to US'
    },
    'zh-cn': {
      title: '深圳精密空运货代 | 跨境高时效航空货运报价',
      desc: '直配急特需空中货运。提供 time-critical air cargo china, international air shipping agent shenzhen, 以及最优惠的 express air freight rate to US 快线。',
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
      desc: 'Professional FBA prep services china & FNSKU labeling company china. Get secure, direct delivery to amazon warehouse with all customs cleared.',
      keywords: 'professional FBA prep services china, FNSKU labeling company china, direct delivery to amazon warehouse'
    },
    'zh-cn': {
      title: '出口亚马逊FBA仓配 | 双清包税贴标拼箱DDP',
      desc: 'professional FBA prep services china, FNSKU labeling company china, 提供快速 direct delivery to amazon warehouse 卡机一体电商一站式极速入仓。',
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
      desc: 'Secure warehouse storage china & cheap cross docking service. Expert e-commerce order fulfillment warehouse in Guangzhou. Fully integrated logistics.',
      keywords: 'secure warehouse storage china, e-commerce order fulfillment warehouse, cheap cross docking service'
    },
    'zh-cn': {
      title: '广州自营出口储运集运仓 | 廉价跨境仓储一件代发',
      desc: '拥有18年自营大仓,提供 secure warehouse storage china, e-commerce order fulfillment warehouse, 及 cheap cross docking service 专业理箱打托。',
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
      title: 'Sea & Air Freight from China to Saudi Arabia, UAE, Kuwait | DDNZ Global',
      desc: 'Secure door-to-door (DDP) cargo shipping from China to Middle East hubs. Navigating port congestion & SABER customs compliance with 20+ years of reliable forwarding network.',
      keywords: 'middle east shipping, saudi arabia freight, uae shipping, kuwait cargo DDP'
    },
    'zh-cn': {
      title: '中国至中东(沙特/阿联酋/科威特)海运空运双清门到门专线 | 大递诺展 DDNZ Global',
      desc: '专为中小贸易商与电商卖家打造的中国至中东货代方案。真实还原中东海空门到门全链路时效，锁定地缘变局下的舱位网络，提供SABER合规审单与广州自营集拼仓托底。',
      keywords: '中东双清专线, 沙特海运DDP, 阿联酋空运专线, 中东包税货代, SABER合规'
    },
    ru: {
      title: 'Доставка грузов из Китая на Ближний Восток (ОАЭ, Саудовская Аравия) | DDNZ Global',
      desc: 'Надежные грузоперевозки из Китая в Саудовскую Аравию, ОАЭ и Кувейт. Оптимизация маршрутов и полное таможенное оформление с сертификатами SABER.',
      keywords: 'доставка на ближний восток, саудовская аравия карго, доставка оаэ, saber сертификат'
    },
    fr: {
      title: 'Fret maritime et aérien de Chine vers le Moyen-Orient | DDNZ Global',
      desc: "Expéditions sécurisées de Chine vers l'Arabie Saoudite, les EAU et le Koweït. Solutions logistiques optimisées face aux blocages portuaires.",
      keywords: 'fret moyen orient, transport arabie saoudite, logistique emirats, certification saber'
    }
  },
  // 8. Central Asia ("shipping-from-china-to-central-asia")
  'shipping-from-china-to-central-asia': {
    en: {
      title: 'Secured Freight Forwarding to Kazakhstan & Uzbekistan | DDNZ',
      desc: 'Professional road and rail container transportation from China to Kazakhstan, Uzbekistan, and Central Asia. EAEU customs clearance, EAC and GOST-UZ compliance support.',
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
      desc: 'Your trusted gateway to West African shipping (Nigeria, Ghana, etc.). Direct container consolidation, rigorous factory auditing, and professional cargo pre-clearance.',
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
      desc: 'Your trusted gateway to Latin American shipping (Mexico, Brazil, Argentina). 100% guaranteed Compliant DDP, free consolidation warehouse, and strict cargo pre-auditing.',
      keywords: 'latin america freight, mexico shipping DDP, brazil customs CNPJ, argentina escrow logistics'
    },
    'zh-cn': {
      title: '中国到拉美(墨西哥/巴西/阿根廷)海运整柜拼箱双清DDP | 拉美庄家 | 华正邦泰 DDNZ Global',
      desc: '二十余年专注中国至拉丁美洲（墨西哥、巴西、阿根廷）专业货运专线。提供自营拼箱，独家NOM/CNPJ核验备案、外汇代收付保障，拒绝对港二次加价，一票到底。',
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
      title: 'Get a Custom Logistics & SCM Quote | DDNZ Global',
      desc: 'Request a custom freight quote for your sea freight, air cargo, or warehousing needs. Quick response from our senior global trade experts.',
      keywords: 'custom shipping quote, freight request china, cargo rates, logistics quote'
    },
    'zh-cn': {
      title: '获取专属货运与供应链报价方案 | 华正邦泰 DDNZ Global',
      desc: '立即提交您的货运需求。无论是集装箱海运、高特空中货运还是广州仓储，我们的资深航线经理都将在第一时间内为您定制专属的省心报价方案。',
      keywords: '货运报价, 国际海运估价, 货代报价咨询, 华正邦泰国际货运'
    },
    ru: {
      title: 'Получить расчет стоимости доставки и логистики | DDNZ Global',
      desc: 'Запросите индивидуальный расчет стоимости морских, авиационных перевозок или складских услуг из Китая. Быстрый ответ от экспертов.',
      keywords: 'расчет доставки из китая, стоимость карго, тарифы фрахта, индивидуальный запрос логистики'
    },
    fr: {
      title: 'Obtenir un devis personnalisé de logistique et SCM | DDNZ Global',
      desc: "Demandez un devis de transport maritime, aérien ou d'entreposage depuis la Chine. Réponse rapide de nos experts en logistique internationale.",
      keywords: 'devis fret maritime, tarif transport aerien, estimation logistique chine'
    }
  }
};

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
    'fr': 'fr'
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
    const propertyAttr = property.startsWith('og:') ? 'property' : 'name';
    const ogRegex = new RegExp(`<meta\\s+${propertyAttr}="${property}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
    if (ogRegex.test(htmlStr)) {
      return htmlStr.replace(ogRegex, `<meta ${propertyAttr}="${property}" content="${escapedContent}" />`);
    } else {
      return htmlStr.replace(/<\/head>/i, `  <meta ${propertyAttr}="${property}" content="${escapedContent}" />\n</head>`);
    }
  };

  output = setMetaTag(output, 'title', seo.title);
  output = setMetaTag(output, 'description', seo.desc);
  output = setMetaTag(output, 'keywords', seo.keywords);

  output = setOgMetaTag(output, 'og:title', seo.title);
  output = setOgMetaTag(output, 'og:description', seo.desc);
  output = setOgMetaTag(output, 'twitter:title', seo.title);
  output = setOgMetaTag(output, 'twitter:description', seo.desc);

  // 3. Set Canonical Link
  const getLanguageUrl = (langCode: string) => {
    const baseUrl = 'https://www.ddnzglobal.com';
    if (!relPath) {
      return langCode === 'en' ? `${baseUrl}/` : `${baseUrl}/${langCode}`;
    }
    return langCode === 'en' ? `${baseUrl}/${relPath}` : `${baseUrl}/${langCode}/${relPath}`;
  };

  const canonicalUrl = getLanguageUrl(lang);
  const canonRegex = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i;
  if (canonRegex.test(output)) {
    output = output.replace(canonRegex, `<link rel="canonical" href="${canonicalUrl}" />`);
  } else {
    output = output.replace(/<\/head>/i, `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  }

  // 4. Set exact page-specific hreflang alternates (replacing any existing ones or rewriting them)
  const enUrl = getLanguageUrl('en');
  const zhUrl = getLanguageUrl('zh-cn');
  const ruUrl = getLanguageUrl('ru');
  const frUrl = getLanguageUrl('fr');

  const newHreflangTags = `
    <!-- Multi-Language SEO hreflang Alternate Links -->
    <link rel="alternate" hreflang="x-default" href="${enUrl}" />
    <link rel="alternate" hreflang="en" href="${enUrl}" />
    <link rel="alternate" hreflang="zh-cn" href="${zhUrl}" />
    <link rel="alternate" hreflang="ru" href="${ruUrl}" />
    <link rel="alternate" hreflang="fr" href="${frUrl}" />
  `;

  // First, strip out any existing hreflang alternate links to avoid duplication
  output = output.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?>/gi, '');
  output = output.replace(/<link\s+rel="alternate"\s+hrefLang="[^"]*"\s+href="[^"]*"\s*\/?>/gi, '');

  // Inject the new page-specific ones before </head>
  output = output.replace(/<\/head>/i, `${newHreflangTags}</head>`);

  return output;
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
  const today = '2026-07-16';

  const basePaths = [
    { path: '', priority: '1.0', changefreq: 'weekly', lastmod: today },
    { path: 'insights', priority: '0.8', changefreq: 'weekly', lastmod: today },
    { path: 'services/sea-freight', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'services/air-freight', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'services/amazon-fba', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'services/warehouse-services', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'shipping-from-china-to-middle-east', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'shipping-from-china-to-central-asia', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'shipping-from-china-to-west-africa', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'shipping-from-china-to-latin-america', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: 'get-a-quote', priority: '0.8', changefreq: 'monthly', lastmod: today }
  ];

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

  const allPaths = [...basePaths];
  blogPosts.forEach((post) => {
    if (post && (post.slug || post.id)) {
      allPaths.push({
        path: `blog/${post.slug || post.id}`,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: post.date || today
      });
    }
  });

  const languages = ['en', 'zh-cn', 'ru', 'fr'] as const;

  // Now, pre-render EVERY path for EVERY language!
  allPaths.forEach((entry) => {
    languages.forEach((lang) => {
      // Find or build the SEO metadata
      let seo: SEOItem | undefined = seoDataMatrix[entry.path]?.[lang];

      // If it's a blog post, build it dynamically
      if (entry.path.startsWith('blog/')) {
        const postSlugOrId = entry.path.replace('blog/', '');
        const post = blogPosts.find((p) => p.slug === postSlugOrId || p.id === postSlugOrId);
        if (post) {
          const cat = post.category ? post.category.toLowerCase() : 'global logistics';
          
          let computedTitle = '';
          if (post.slug === 'Actionable-insights-for-Eastern-Europe') {
            computedTitle = 'China Sourcing Alert: July Rate Hikes & Customs Guide';
          } else if (post.slug === 'high-compliance-new-energy-logistics') {
            computedTitle = 'New Energy & DG Logistics from China | DDNZ Global Insights';
          } else {
            const rawTitle = post.title;
            const suffix = " | DDNZ Global";
            const maxTitleLen = 60;
            if (rawTitle.length + " | DDNZ Global Insights".length > maxTitleLen) {
              const maxPrefixLen = maxTitleLen - suffix.length - 3;
              if (maxPrefixLen > 0) {
                let truncated = rawTitle.slice(0, maxPrefixLen);
                const lastSpace = truncated.lastIndexOf(' ');
                if (lastSpace > 15) {
                  truncated = truncated.slice(0, lastSpace);
                }
                computedTitle = truncated.trim() + '...' + suffix;
              } else {
                computedTitle = rawTitle.slice(0, maxTitleLen - suffix.length) + suffix;
              }
            } else {
              computedTitle = rawTitle + suffix;
            }
          }

          const rawDesc = post.summary || post.title || '';
          const computedDesc = rawDesc.length > 155 ? rawDesc.slice(0, 152).trim() + '...' : rawDesc;

          seo = {
            title: computedTitle,
            desc: computedDesc,
            keywords: `${cat}, global logistics, china freight forwarder, cargo news, ddnz global`
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

      let localizedHtml = injectSeoMeta(originalHtml, lang, entry.path, seo);
      if (entry.path === 'blog/Actionable-insights-for-Eastern-Europe') {
        localizedHtml = localizedHtml.replace(
          /<div id="root"><\/div>/i,
          `<div id="root">
       <article style="display:none;">
         <h1>China Sourcing Alert: July Rate Hikes & Customs Guide</h1>
       </article>
     </div>`
        );
      }
      const targetFilePath = path.join(targetDir, 'index.html');
      fs.writeFileSync(targetFilePath, localizedHtml, 'utf-8');
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
    languages.forEach((lang) => {
      const loc = formatUrl(lang, entry.path);
      const enUrl = formatUrl('en', entry.path);
      const zhUrl = formatUrl('zh-cn', entry.path);
      const ruUrl = formatUrl('ru', entry.path);
      const frUrl = formatUrl('fr', entry.path);

      // Determine priority: localized subpages can have slightly lower priority or same
      const priorityVal = lang === 'en' ? entry.priority : (parseFloat(entry.priority) - 0.1).toFixed(1);

      xml += '  <url>\n';
      xml += `    <loc>${loc}</loc>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="zh-cn" href="${zhUrl}" />\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}" />\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />\n`;
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
  console.log(`✅ Dynamically generated sitemap.xml (with ${allPaths.length * 4} URLs) at public/sitemap.xml and dist/sitemap.xml`);

  // Generate optimized robots.txt
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap Location
Sitemap: https://www.ddnzglobal.com/sitemap.xml
`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf-8');
  console.log('✅ Generated optimized robots.txt at public/robots.txt and dist/robots.txt');

  console.log('🎉 Multilingual SEO static generation complete!');
}

run();
