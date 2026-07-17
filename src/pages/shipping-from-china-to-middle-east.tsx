import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import ScrollToTop from '../components/ScrollToTop';
import SEO from '../components/SEO';
import GetAQuote from '../components/GetAQuote';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, AlertTriangle, Ship, Package, ShieldCheck, 
  Search, ArrowRight, CheckCircle2, MessageSquare, ShieldAlert,
  Globe, Clock, HelpCircle
} from 'lucide-react';
import { trackEvent } from '../lib/utils';
import { COUNTRY_SPEC_DATA } from '../data/countrySpecData';

// Multi-language strings for this Middle East Route page
const PAGE_LANG_DATA: Record<string, Record<string, any>> = {
  en: {
    seoTitle: "China to Middle East Freight Forwarding Guide | DDNZ",
    seoDesc: "Secure door-to-door (DDP) cargo shipping from China to Middle East hubs. Navigating port congestion & SABER customs compliance with 20+ years of reliable forwarding network.",
    heroHeadline: "Reliable Shipping Networks from China to Middle East Hubs.",
    heroSubheadline: "Navigating Red Sea infrastructure shifts with optimized transit paths. Complete door-to-door (DDP) logistics for global SMEs with absolute transparency.",
    heroCta: "Get Free Route & Tariff Analysis",
    
    alertTag: "Operational Update",
    alertTitle: "The Red Sea Shift: From Maritime Risks to Port Bottlenecks",
    alertContent: "With vessels rerouting via the Cape of Good Hope (adding 10-14 days), ocean logistics faces network squeezing. The battle has shifted to destination port processing grids (e.g., Jeddah, Jebel Ali). Leveraging over 20 years of trusted local networks and intermodal sea-land connections, DDNZ locks flexible routes and stable spatial allocations for global SMEs.",
    
    matrixTitle: "All-in-One Transit Time & Reference Matrix",
    matrixSubtitle: "Realistic transit durations mapped from China hubs to Middle East regional destinations.",
    colTargetCountries: "Target Countries",
    colAirFreight: "Air Freight (Door-to-Door)",
    colOceanFcl: "Ocean Freight FCL (Door-to-Door)",
    colOceanLcl: "Ocean Freight LCL (Door-to-Door)",
    colPortToPort: "Port-to-Port Sea Voyage (Ref)",
    colSolutions: "Tailored Solutions Header",
    matrixFootnote: "Note: Actual door-to-door transit times depend closely on origin-port terminal consolidation speed, local customs brokerage clearance efficiency, and extreme geostrategic routing modifications.",

    cardsHeading: "DDNZ Middle East Advantage",
    cardsSubheading: "Tailored supply chain solutions built for SME traders, e-commerce sellers, and enterprise importers.",
    
    card1Title: "Alibaba/1688 Consolidation Management",
    card1Desc: "Receive, inspect, and consolidate goods from multiple suppliers at our self-operated Guangzhou warehouse to slash overall shipping costs.",
    card1Cta: "View Consolidation Rates",
    card2Title: "Your Eyes & Ears in China: Pre-Shipment Inspection",
    card2Desc: "Quality checks, counting, and package verification before container sealing. We act as your on-the-ground QC eyes and ears in China.",
    card2Cta: "Request Inspection Details",
    card3Title: "Local Customs & Compliance Backup",
    card3Desc: "SABER certificate filing, HS code pre-audit, and direct coordination with in-house customs brokers to ensure seamless, tax-paid delivery (DDP).",
    card3Cta: "HS Code Consultation",
    
    faqHeading: "Middle East Shipping Checklist & FAQ",
    faqSubheading: "Proactive compliance checks to keep your cargo moving securely through Middle East customs entry corridors.",
    
    faqs: [
      {
        id: "faq-1",
        title: "Carrier Verification vs. Express Clearance Redlines",
        desc: "Why big branding shipments face high return risks if sent via standard courier express without a commercial customs broker."
      },
      {
        id: "faq-2",
        title: "Mandatory Sourcing Markings (MADE IN CHINA)",
        desc: "All imported cargo packages must distinctly show clear country-of-origin labels before dispatch."
      },
      {
        id: "faq-3",
        title: "Freight Rate Validity Cycles",
        desc: "Securing spot rate periods ahead of constant geopolitical fluctuations in Persian Gulf regions."
      },
      {
        id: "faq-4",
        title: "Advanced Pre-Shipment Manifest Screening",
        desc: "Submitting deep inventory itemization lists early to prevent custom holds over sensitive commodities."
      },
      {
        id: "faq-5",
        title: "Sticking to Consistent Transport Modes",
        desc: "Avoiding sudden modifications between Sea and Air freight to protect pricing and transit timeline predictability."
      }
    ],

    formTitle: "Instant Middle East Shipping Inquiry",
    formSub: "Submit your cargo details below. Our route experts will generate a custom rate card within 2 hours.",
    formLabelName: "Your Name",
    formLabelEmail: "Email Address",
    formLabelPhone: "WhatsApp / Phone",
    formLabelGoods: "Type of Goods / Volume",
    formLabelDest: "Destination",
    formCta: "Calculate My Shipping Tariff",
    formSuccess: "Thank you! Our regional logistic specialist is mapping your route and will contact you via WhatsApp/Email shortly.",
    chinaToMiddleEastSpecialist: "📍 CHINA ➔ MIDDLE EAST SPECIALIST",
    experienceBadge: "⭐ 29+ Years Expertise · Direct Persian Gulf Brokerage",
    transitWindowTitle: "⏱️ Middle East Transit Windows",
    seaDdpText: "Sea Freight DDP (Door to Door)",
    airDdpText: "Air Freight DDP (Door to Door)",
    seaDaysText: "28 - 35 Days",
    airDaysText: "5 - 12 Days",
    transitIncludeText: "Includes: Space booking, export declarations, GCC customs clearance, SABER/SFDA support & local truck delivery.",
    compliantFilingText: "100% Compliant Filing Process",
    professionalVerificationText: "Professional Verification",
    saudiFocus: "🇸🇦 Saudi Focus",
    uaeFocus: "🇦🇪 UAE Focus",
    kuwaitFocus: "🇰🇼 Kuwait Focus",
    country_Saudi_Arabia: "🇸🇦 Saudi",
    country_UAE: "🇦🇪 UAE",
    country_Kuwait: "🇰🇼 Kuwait",
    insightPortfolio: "⭐ DDNZ Global Logistics Insight Portfolio"
  },
  zh: {
    seoTitle: "中国至中东(沙特/阿联酋/科威特)海运空运双清门到门专线 | 大递诺展 DDNZ Global",
    seoDesc: "专为中小贸易商与电商卖家打造的中国至中东货代方案。真实还原中东海空门到门全链路时效，锁定地缘变局下的舱位网络，提供SABER合规审单与广州自营集拼仓托底。",
    heroHeadline: "深耕二十余年：中国至中东海空双清门到门专线",
    heroSubheadline: "为您托底红海局势下的港口变数。提供多供应商多品类集拼、严苛的清关合规审单（SABER），全程轨迹追踪，保障利润不受隐藏费用蚕食。",
    heroCta: "获取免费航线及运价分析",
    
    alertTag: "红海动态运营通报",
    alertTitle: "中东大实话：红海绕行进入深水区，痛点已变成‘港口挤压’",
    alertContent: "目前中东大部分船只绕行好望角，航程普遍增加 10-14 天。关键是波斯湾大量船舶集中到中转港，直靠变中转+陆运，导致网络被挤压。DDNZ 凭二十多年的经营积累，不吹嘘一手包船，而是凭借丰富可靠的海外代理与清关多式联运网络，帮中小卖家死磕舱位稳定性、锁定变动运价，规避隐藏安全链路风险。",
    
    matrixTitle: "中东海空时效与服务对照矩阵",
    matrixSubtitle: "为您展示真实的中国起运至中东各主要目的国的DDP时效及港到港航程参考。",
    colTargetCountries: "目的国家/地区",
    colAirFreight: "空运 DDP 双清门到门",
    colOceanFcl: "海运整箱 FCL DDP 门到门",
    colOceanLcl: "海运拼箱 LCL DDP 门到门",
    colPortToPort: "起运港至目的港海运航程",
    colSolutions: "定制化物流解决方案",
    matrixFootnote: "时效备注：上述门到门周期涵盖了国内集中备货、拼箱分拨、目的地清关和最后一公里派送。清关与末端配送速度是决定性因素，如遇不可抗力地缘调整，可能存在3-5天顺延。",

    cardsHeading: "DDNZ 中东专线核心优势",
    cardsSubheading: "专为跨境中小企业、外贸商家和工厂打造，解决各种杂乱需求及目的港壁垒。",
    
    card1Title: "阿里巴巴/1688自营广州集拼仓 (散货拼箱集运)",
    card1Desc: "接收、检验并合并来自多个1688及阿里供应商 of 货物，入库扫码，重新打包加固，极大降低单票海运及清关费用。",
    card1Cta: "了解集拼收费标准",
    card2Title: "中国本土装运前检验 (出货前本土实地品控验货)",
    card2Desc: "作为您在中国的眼睛和耳朵，我们在装箱前对货物进行外观质检、数量核对和包装加固确认，把质量纠纷解决在国门之内。",
    card2Cta: "申请免费品控服务",
    card3Title: "目的港口岸清关与合规支持 (合规双清与特殊资质协助)",
    card3Desc: "提供沙特SABER证书代办、商品海关编码HS预审，直接对接中东目的港自营清关行，保障双清门到门（DDP）合规且不卡关。",
    card3Cta: "预审海关HS编码",
    
    faqHeading: "中东段出货合规排查及常见问题",
    faqSubheading: "建议每一位发货卖家收藏！提前排查合规红线，确保跨境大货顺利通关放行。",
    
    faqs: [
      {
        id: "faq-1",
        title: "商业快递清关红线与自营双清托底保障",
        desc: "品牌货别随便走快递，当地清关极其严。大货如没有在目的地具备清关能力的收件人托底，半路临时用快递冲关极易导致清关失败并强制退回，发货前必须提前确认清关能力。"
      },
      {
        id: "faq-2",
        title: "强制性原产地标记及外箱贴签硬性要求",
        desc: "产品建议100%标注 MADE IN CHINA 标签。大货如果没有原产地标签，往往到了发货甚至目的港环节才被查出问题，重新处理的处理费与延误成本极高，十分麻烦。"
      },
      {
        id: "faq-3",
        title: "中东海运空运运价有效周期及波动风险",
        desc: "近期中东局势变化大，运价频繁变动。发货前必须跟我们团队提前确认运价以及该运价能维持多久，避免等货备好了价格突然暴涨，吃掉或缩减您的外贸利润。"
      },
      {
        id: "faq-4",
        title: "装船起运前舱单数据与货品合规预审",
        desc: "提前确认清关问题！建议发货前把货物明细表发给我们核对。中东物流清关对部分产品审查严格，若因为单个敏感产品没审出而导致整批货卡关，会波及整箱费用。"
      },
      {
        id: "faq-5",
        title: "保持预定货运通道与运输方式的稳定性",
        desc: "不要临时改发货方式。从海运临时拍脑袋换空运，或频繁改换物流渠道，很容易因为资料重新录入系统和排舱，导致价格 and 时效双重不稳定。"
      }
    ],

    formTitle: "中东物流专线专属询价",
    formSub: "请填写下方货物信息，我们的中东项目组将在2小时内为您制定最省钱的运输排舱方案。",
    formLabelName: "您的姓名",
    formLabelEmail: "电子邮箱",
    formLabelPhone: "联系电话 / 微信 / WhatsApp",
    formLabelGoods: "货物类型 / 件数 / 重量体积",
    formLabelDest: "目的国",
    formCta: "提交询价，锁定专属运价",
    formSuccess: "提交成功！我们的中东航线经理已收到您的信息，我们将立即通过电话/微信/Email联系您。",
    chinaToMiddleEastSpecialist: "📍 中国 ➔ 中东货运庄家",
    experienceBadge: "⭐ 29年跨境货代经验 · 中东自营清关庄家",
    transitWindowTitle: "⏱️ 中东专线预计时效",
    seaDdpText: "海运门到门 (双清DDP)",
    airDdpText: "空运双清包税 (DDP)",
    seaDaysText: "28 - 35 天",
    airDaysText: "5 - 12 天",
    transitIncludeText: "包含：订舱、起运港单证、中东主港清关、商检（Saber/SFDA协助）及目的港最后一公里派送。",
    compliantFilingText: "100% 合规申报流程",
    professionalVerificationText: "高效专业审核核发",
    saudiFocus: "🇸🇦 沙特专区",
    uaeFocus: "🇦🇪 阿联酋专区",
    kuwaitFocus: "🇰🇼 科威特专区",
    country_Saudi_Arabia: "🇸🇦 沙特",
    country_UAE: "🇦🇪 阿联酋",
    country_Kuwait: "🇰🇼 科威特",
    insightPortfolio: "⭐ 大递诺展中东物流研究院报告"
  },
  ru: {
    seoTitle: "Доставка грузов из Китая на Ближний Восток (ОАЭ, Саудовская Аравия) | DDNZ Global",
    seoDesc: "Надежные грузоперевозки из Китая в Саудовскую Аравию, ОАЭ и Кувейт. Оптимизация маршрутов и полное таможенное оформление с сертификатами SABER.",
    heroHeadline: "Надежные логистические сети из Китая на Ближний Восток",
    heroSubheadline: "Обход портовых заторов в Красном море с оптимизацией транзита. Полная поддержка по таможенным правилам и SABER.",
    heroCta: "Получить бесплатный расчет тарифа",
    
    alertTag: "Оперативная информация",
    alertTitle: "Сдвиг в Красном море: от морских рисков к заторам в портах",
    alertContent: "В связи с перенаправлением судов через мыс Доброй Надежды (добавилось 10–14 дней) морская логистика сталкивается с сетевым сжатием. Основная борьба переместилась на инфраструктуру портов назначения (например, Джидда, Джебель-Али). Используя более чем 20-летний опыт работы на Ближнем Востоке и мультимодальные транспортные сети, DDNZ гарантирует надежность бронирования мест и стабильные ставки для малого и среднего бизнеса.",
    
    matrixTitle: "Единая матрица транзитных сроков и маршрутов",
    matrixSubtitle: "Реалистичные сроки доставки DDP от складов в Китае до ключевых регионов Ближнего Востока.",
    colTargetCountries: "Целевые страны",
    colAirFreight: "Авиадоставка DDP (Дверь-Дверь)",
    colOceanFcl: "Морской контейнер FCL DDP (Дверь-Дверь)",
    colOceanLcl: "Морская сборная LCL DDP (Дверь-Дверь)",
    colPortToPort: "Морской рейс порт-порт (Справочно)",
    colSolutions: "Индивидуальные решения",
    matrixFootnote: "Примечание: Фактические сроки доставки «от двери до двери» зависят от скорости консолидации на складе отправления, эффективности таможенной очистки на месте и возможных геополитических корректировок маршрутов.",

    cardsHeading: "Преимущества DDNZ на Ближнем Востоке",
    cardsSubheading: "Индивидуальные цепочки поставок для малого и среднего бизнеса, e-commerce и оптовых импортеров.",
    
    card1Title: "Консолидация товаров (Alibaba / 1688)",
    card1Desc: "Прием, инспекция качества и бережная консолидация грузов от множества фабрик на нашем складе в Гуанчжоу для минимизации стоимости.",
    card1Cta: "Посмотреть тарифы консолидации",
    card2Title: "Ваши глаза и уши в Китае: инспекция перед отправкой",
    card2Desc: "Тщательный контроль качества, пересчет количества и фотоотчет перед запечаткой контейнера. Устраняем риски брака до отправки.",
    card2Cta: "Запросить детали инспекции",
    card3Title: "Полный таможенный комплаенс и поддержка",
    card3Desc: "Оформление сертификатов SABER, предпроверка кодов ТН ВЭД и оперативная стыковка с местными брокерами в портах назначения.",
    card3Cta: "Консультация по ТН ВЭД",
    
    faqHeading: "Чек-лист по доставке и частые вопросы",
    faqSubheading: "Ключевые рекомендации для беспрепятственного прохождения таможни Ближнего Востока.",
    
    faqs: [
      {
        id: "faq-1",
        title: "Экспресс-доставка против брокерского оформления",
        desc: "Почему брендовые товары несут высокий риск возврата при отправке курьерскими службами без привлечения сертифицированного коммерческого брокера."
      },
      {
        id: "faq-2",
        title: "Обязательная маркировка (MADE IN CHINA)",
        desc: "Все грузовые места должны иметь четко напечатанный лейбл страны происхождения. Отсутствие маркировки грозит крупными штрафами."
      },
      {
        id: "faq-3",
        title: "Циклы действия и фиксация ставок",
        desc: "В связи с геополитическими рисками ставки волатильны. Предварительное бронирование через команду DDNZ позволяет зафиксировать выгодную цену."
      },
      {
        id: "faq-4",
        title: "Предварительная проверка упаковочных листов",
        desc: "Ранняя отправка инвойсов и манифестов позволяет заранее выявить товары, требующие дополнительных лицензий в Саудовской Аравии."
      },
      {
        id: "faq-5",
        title: "Сохранение стабильности каналов отправки",
        desc: "Избегайте спонтанных переключений между морем и авиа на последних этапах. Это влечет долгий перевыпуск документов и простои."
      }
    ],

    formTitle: "Запрос тарифа на Ближний Восток",
    formSub: "Предоставьте детали вашего груза. Наши специалисты свяжутся с вами в течение 2 часов для расчета стоимости.",
    formLabelName: "Ваше имя",
    formLabelEmail: "Электронная почта",
    formLabelPhone: "Телефон / WhatsApp",
    formLabelGoods: "Тип груза / Объем и вес",
    formLabelDest: "Страна назначения",
    formCta: "Рассчитать стоимость доставки",
    formSuccess: "Спасибо! Наш региональный менеджер уже рассчитывает ваш маршрут и свяжется с вами по телефону/WhatsApp в ближайшее время.",
    chinaToMiddleEastSpecialist: "📍 Китай ➔ Специалист по Ближнему Востоку",
    experienceBadge: "⭐ 29+ лет опыта · Прямой брокер в Персидском заливе",
    transitWindowTitle: "⏱️ Транзитные окна Ближнего Востока",
    seaDdpText: "Морской фрахт DDP (от двери до двери)",
    airDdpText: "Авиафрахт DDP (от двери до двери)",
    seaDaysText: "28 - 35 дней",
    airDaysText: "5 - 12 дней",
    transitIncludeText: "Включает: бронирование места, экспортные декларации, таможенную очистку GCC, поддержку SABER/SFDA и местную автодоставку.",
    compliantFilingText: "100% соответствующая подача документов",
    professionalVerificationText: "Профессиональная верификация",
    saudiFocus: "🇸🇦 Саудовская Аравия",
    uaeFocus: "🇦🇪 ОАЭ",
    kuwaitFocus: "🇰🇼 Кувейт",
    country_Saudi_Arabia: "🇸🇦 Саудия",
    country_UAE: "🇦🇪 ОАЭ",
    country_Kuwait: "🇰🇼 Кувейт",
    insightPortfolio: "⭐ Портфель аналитики DDNZ Global Logistics"
  },
  fr: {
    seoTitle: "Fret maritime et aérien de Chine vers le Moyen-Orient | DDNZ Global",
    seoDesc: "Expéditions sécurisées de Chine vers l'Arabie Saoudite, les EAU et le Koweït. Solutions logistiques optimisées face aux blocages portuaires.",
    heroHeadline: "Réseaux logistiques fiables de Chine vers le Moyen-Orient",
    heroSubheadline: "Naviguer à travers les tensions en mer Rouge grâce à des routes maritimes sécurisées. Gestion des dossiers SABER & dédouanement local.",
    heroCta: "Obtenir une étude de route gratuite",
    
    alertTag: "Rapport opérationnel",
    alertTitle: "Le virage de la mer Rouge : des risques maritimes aux goulots d'étranglement portuaires",
    alertContent: "Avec la réorientation des navires via le cap de Bonne-Espérance (ajoutant 10 à 14 jours), la logistique maritime fait face à une compression du réseau. La bataille s'est déplacée vers les réseaux de traitement des ports de destination (ex. Djeddah, Jebel Ali). Grâce à plus de 20 ans de réseaux locaux de confiance et de liaisons intermodales terre-mer, DDNZ garantit des itinéraires flexibles et des allocations d'espace stables pour les PME mondiales.",
    
    matrixTitle: "Matrice de référence globale des temps de transport",
    matrixSubtitle: "Durées de transit réalistes cartographiées depuis les hubs chinois vers le Moyen-Orient.",
    colTargetCountries: "Pays de destination",
    colAirFreight: "Fret aérien DDP (Porte-à-Porte)",
    colOceanFcl: "Fret maritime FCL DDP (Porte-à-Porte)",
    colOceanLcl: "Fret maritime LCL DDP (Porte-à-Porte)",
    colPortToPort: "Voyage maritime Port-à-Port (Réf)",
    colSolutions: "Solutions sur mesure",
    matrixFootnote: "Note: Les temps de transit réels de porte à porte dépendent étroitement de la vitesse de consolidation au port d'origine, de l'efficacité du courtage douanier local et des modifications géostratégiques exceptionnelles.",

    cardsHeading: "L'avantage DDNZ Moyen-Orient",
    cardsSubheading: "Des flux logistiques simplifiés pour les e-commerçants, importateurs et PME de tous secteurs.",
    
    card1Title: "Consolidation Alibaba & 1688",
    card1Desc: "Centralisation, contrôle qualité et groupage de vos marchandises de plusieurs fournisseurs dans notre hub de Guangzhou pour économiser.",
    card1Cta: "Voir les tarifs de consolidation",
    card2Title: "Vos yeux et vos oreilles en Chine: inspection pré-expédition",
    card2Desc: "Inspection visuelle de conformité, comptage et sécurisation des colis avant scellement pour éviter les litiges de fabrication.",
    card2Cta: "Demander les détails de l'inspection",
    card3Title: "Accompagnement Douanes et SABER",
    card3Desc: "Assistance au dépôt SABER, pré-audit des codes douaniers HS et relais avec nos agences de dédouanement locales en Arabie Saoudite.",
    card3Cta: "Consultation du code HS",
    
    faqHeading: "Check-list logistique Moyen-Orient & FAQ",
    faqSubheading: "Précautions essentielles pour sécuriser votre dédouanement à destination.",
    
    faqs: [
      {
        id: "faq-1",
        title: "Expédition Express vs Dédouanement Commercial",
        desc: "Pourquoi les cargaisons de marque courent des risques élevés de retour si elles sont envoyées via messagerie standard sans courtier en douane commercial."
      },
      {
        id: "faq-2",
        title: "Marquage d'origine obligatoire (MADE IN CHINA)",
        desc: "Tous les colis importés doivent afficher de manière permanente le label d'origine sous peine d'amende et de blocage prolongé."
      },
      {
        id: "faq-3",
        title: "Cycles de validité des tarifs de fret",
        desc: "En raison de l'instabilité régionale, les tarifs fluctuent vite. Validez régulièrement vos devis avec DDNZ pour geler vos coûts."
      },
      {
        id: "faq-4",
        title: "Audit de la liste de colisage (Manifeste)",
        desc: "La pré-vérification des documents évite de bloquer tout un conteneur pour un seul produit jugé sensible par les douanes locales."
      },
      {
        id: "faq-5",
        title: "Stabilité des plans de transport",
        desc: "Changer d'avis entre maritime et aérien à la dernière minute engendre des frais de traitement administratifs élevés."
      }
    ],

    formTitle: "Demande de cotation Moyen-Orient",
    formSub: "Fournissez vos détails de cargaison. Nos conseillers régionaux vous feront un retour sous 2 heures.",
    formLabelName: "Votre Nom",
    formLabelEmail: "Adresse Email",
    formLabelPhone: "WhatsApp / Téléphone",
    formLabelGoods: "Type de marchandises / Volume",
    formLabelDest: "Pays de destination",
    formCta: "Calculer mon tarif de livraison",
    formSuccess: "Merci ! Notre expert logistique Moyen-Orient analyse votre dossier et vous contactera par WhatsApp/Email sous peu.",
    chinaToMiddleEastSpecialist: "📍 SPÉCIALISTE CHINE ➔ MOYEN-ORIENT",
    experienceBadge: "⭐ 29+ ans d'expertise · Courtage direct dans le golfe Persique",
    transitWindowTitle: "⏱️ Fenêtres de transit Moyen-Orient",
    seaDdpText: "Fret maritime DDP (porte-à-porte)",
    airDdpText: "Fret aérien DDP (porte-à-porte)",
    seaDaysText: "28 - 35 jours",
    airDaysText: "5 - 12 jours",
    transitIncludeText: "Inclus: réservation d'espace, déclarations d'exportation, dédouanement GCC, assistance SABER/SFDA et livraison locale par camion.",
    compliantFilingText: "Processus de dépôt 100% conforme",
    professionalVerificationText: "Vérification professionnelle",
    saudiFocus: "🇸🇦 Focus Arabie Saoudite",
    uaeFocus: "🇦🇪 Focus EAU",
    kuwaitFocus: "🇰🇼 Focus Koweït",
    country_Saudi_Arabia: "🇸🇦 Arabie S.",
    country_UAE: "🇦🇪 EAU",
    country_Kuwait: "🇰🇼 Koweït",
    insightPortfolio: "⭐ Portefeuille de perspectives logistiques mondiales DDNZ"
  }
};

const MATRIX_ROWS = [
  {
    country: {
      en: "Saudi Arabia",
      zh: "沙特阿拉伯 (Jeddah/Riyadh)",
      ru: "Саудовская Аравия (Джидда/Эр-Рияд)",
      fr: "Arabie Saoudite (Djeddah/Riyad)"
    },
    air: {
      en: "5 - 12 Days\nDDP Door-to-Door",
      zh: "5 - 12 天\n双清 DDP 派送到门",
      ru: "5 - 12 дней\nDDP до двери",
      fr: "5 - 12 Jours\nDDP Porte-à-Porte"
    },
    fcl: {
      en: "25 - 32 Days",
      zh: "25 - 32 天",
      ru: "25 - 32 дней",
      fr: "25 - 32 Jours"
    },
    lcl: {
      en: "28 - 35 Days",
      zh: "28 - 35 天",
      ru: "28 - 35 дней",
      fr: "28 - 35 Jours"
    },
    portToPort: {
      en: "18 - 25 Days",
      zh: "18 - 25 天",
      ru: "18 - 25 дней",
      fr: "18 - 25 Jours"
    },
    solutions: {
      en: "SABER Registration Support, Duty-Paid Commercial Clearance",
      zh: "沙特 SABER 证书协助、自营关税实报实销双清",
      ru: "Поддержка SABER, DDP с уплатой пошлин",
      fr: "Enregistrement SABER, dédouanement commercial DDP"
    }
  },
  {
    country: {
      en: "United Arab Emirates",
      zh: "阿联酋 (Dubai/Jebel Ali)",
      ru: "ОАЭ (Дубай/Джебель-Али)",
      fr: "Émirats Arabes Unis (Dubaï/Jebel Ali)"
    },
    air: {
      en: "4 - 8 Days\nDDP Door-to-Door",
      zh: "4 - 8 天\n双清 DDP 包税到门",
      ru: "4 - 8 дней\nDDP до двери",
      fr: "4 - 8 Jours\nDDP Porte-à-Porte"
    },
    fcl: {
      en: "18 - 24 Days",
      zh: "18 - 24 天",
      ru: "18 - 24 дней",
      fr: "18 - 24 Jours"
    },
    lcl: {
      en: "20 - 28 Days",
      zh: "20 - 28 天",
      ru: "20 - 28 дней",
      fr: "20 - 28 Jours"
    },
    portToPort: {
      en: "12 - 16 Days",
      zh: "12 - 16 天",
      ru: "12 - 16 дней",
      fr: "12 - 16 Jours"
    },
    solutions: {
      en: "Dubai Freezone JAFZA Direct Entry, E-Commerce Fulfillment",
      zh: "杰贝阿里自由区 JAFZA 直派、自营海外仓电商一件代发",
      ru: "Свободная зона СЭЗ JAFZA, Склады e-commerce",
      fr: "Zone Franche JAFZA Direct, Logistique E-Commerce"
    }
  },
  {
    country: {
      en: "Kuwait",
      zh: "科威特 (Shuaiba/Kuwait City)",
      ru: "Кувейт (Шуайба/Эль-Кувейт)",
      fr: "Koweït (Shuaiba/Koweït City)"
    },
    air: {
      en: "6 - 12 Days\nDDP Door-to-Door",
      zh: "6 - 12 天\n双清 DDP 派送到门",
      ru: "6 - 12 дней\nDDP до двери",
      fr: "6 - 12 Jours\nDDP Porte-à-Porte"
    },
    fcl: {
      en: "28 - 35 Days",
      zh: "28 - 35 天",
      ru: "28 - 35 дней",
      fr: "28 - 35 Jours"
    },
    lcl: {
      en: "32 - 40 Days",
      zh: "32 - 40 天",
      ru: "32 - 40 дней",
      fr: "32 - 40 Jours"
    },
    portToPort: {
      en: "20 - 28 Days",
      zh: "20 - 28 天",
      ru: "20 - 28 дней",
      fr: "20 - 28 Jours"
    },
    solutions: {
      en: "KUCAS / TIR Audit Assistance, British Standard Packing Support",
      zh: "科威特 KUCAS / TIR 认证商检协助、英标外箱整改",
      ru: "Сопровождение KUCAS / TIR, Подготовка英标упаковок",
      fr: "Assistance KUCAS / TIR, Contrôle normes britanniques"
    }
  }
];

const COUNTRY_CONTENT: Record<
  'Saudi-Arabia' | 'UAE' | 'Kuwait',
  Record<string, {
    headline: string;
    subheadline: string;
    card3Title: string;
    card3Desc: string;
    faqs: Array<{ id: string; title: string; desc: string }>;
  }>
> = {
  'Saudi-Arabia': {
    en: {
      headline: "Reliable Shipping Networks from China to Saudi Arabia",
      subheadline: "Navigating Red Sea infrastructure shifts with optimized transit paths. Complete door-to-door (DDP) logistics for global SMEs with absolute transparency.",
      card3Title: "SABER Compliance & Customs Clearance",
      card3Desc: "SABER certificate filing, HS code pre-audit, and direct coordination with in-house customs brokers to ensure seamless, tax-paid delivery (DDP).",
      faqs: [
        {
          id: "sa-1",
          title: "Expédition Express vs Dédouanement Commercial",
          desc: "Les cargaisons de marque courent des risques élevés de retour si elles sont envoyées via messagerie standard sans courtier en douane commercial."
        },
        {
          id: "sa-2",
          title: "Marquage d'origine obligatoire (MADE IN CHINA)",
          desc: "Tous les colis importés doivent afficher de manière permanente le label d'origine sous peine d'amende et de blocage prolongé."
        },
        {
          id: "sa-3",
          title: "Certification SABER Arabie Saoudite",
          desc: "Nous vous assistons dans l'enregistrement de vos produits sur la plateforme SABER pour assurer un dédouanement fluide."
        }
      ]
    },
    zh: {
      headline: "安全、合规、稳健的中国到沙特阿拉伯海运/空运双清门到门专线",
      subheadline: "攻克沙特 SABER 系统清关和强制原产地认证雷区。提供广州自营拼箱仓库集散，保障货值安全和海关顺利放行。",
      card3Title: "沙特 SABER 合规申报与代办",
      card3Desc: "提供产品注册 PC 证书代办、单批次 SC 证书申报核发，以及中国出口全税合规双清（DDP）托底，保证货物顺利送达沙特买家仓库。",
      faqs: [
        {
          id: "sa-1",
          title: "商业快递清关与大宗商业双清清关的红线对比",
          desc: "提示：高价值大宗或品牌货走商业快递到沙特极易面临目的港卡关和高额仓储费。使用大递诺展自营 DDP 双清，能合理申报，规避扣关风险。"
        },
        {
          id: "sa-2",
          title: "外箱及产品雕刻‘Made in China’原产地硬性要求",
          desc: "沙特海关政策严苛，规定所有进口货物的最小外包装以及产品机身上，必须打上永久性的 Made in China 标记（丝印或雕刻，禁止贴签），违者将被海关处以巨额罚款并强令退运。"
        },
        {
          id: "sa-3",
          title: "海运及空运直航吉达/利雅得时效锁定",
          desc: "凭借我们二十年的中东货代经验，海运在25-32天左右派送上门，空运最快5-12天。提供实报实销、无任何目的港隐形收费的双清托底服务。"
        }
      ]
    },
    ru: {
      headline: "Надежная доставка грузов из Китая в Саудовскую Аравию",
      subheadline: "Маршруты в обход рисков Красного моря. Полная логистика «от двери до двери» (DDP) с таможенным оформлением SABER для малого и среднего бизнеса.",
      card3Title: "Таможенный комплаенс SABER",
      card3Desc: "Регистрация в системе SABER, предварительный аудит кодов ТН ВЭД и оперативная координация с местными брокерами в Саудовской Аравии.",
      faqs: [
        {
          id: "sa-1",
          title: "Экспресс-доставка против коммерческого оформления",
          desc: "Отправка брендовых товаров курьерскими экспресс-службами без брокера несет риск возврата. DDNZ предлагает надежную схему коммерческой очистки."
        },
        {
          id: "sa-2",
          title: "Обязательная маркировка (MADE IN CHINA)",
          desc: "Все импортируемые в Саудовскую Аравию товары должны иметь четкую и нестираемую маркировку страны происхождения."
        },
        {
          id: "sa-3",
          title: "Регистрация в системе SABER",
          desc: "Многие категории товаров требуют оформления сертификатов SABER. DDNZ помогает пройти комплаенс и получить документы за 1-2 рабочих дня."
        }
      ]
    },
    fr: {
      headline: "Réseaux logistiques de Chine vers l'Arabie Saoudite",
      subheadline: "Naviguer à travers les tensions en mer Rouge grâce à des routes maritimes sécurisées et une gestion rigoureuse des dossiers douaniers SABER.",
      card3Title: "Douanes et certification SABER",
      card3Desc: "Assistance au dépôt de documents sur la plateforme SABER, pré-audit des codes HS et relais rapide avec nos déclarants agréés en douane.",
      faqs: [
        {
          id: "sa-1",
          title: "Expédition Express vs Dédouanement Commercial",
          desc: "Les cargaisons de marque courent des risques élevés de retour si elles sont envoyées via messagerie standard sans courtier en douane commercial."
        },
        {
          id: "sa-2",
          title: "Marquage d'origine obligatoire (MADE IN CHINA)",
          desc: "Tous les colis importés doivent afficher de manière permanente le label d'origine sous peine d'amende et de blocage prolongé."
        },
        {
          id: "sa-3",
          title: "Certification SABER Arabie Saoudite",
          desc: "Nous vous assistons dans l'enregistrement de vos produits sur la plateforme SABER pour assurer un dédouanement fluide."
        }
      ]
    }
  },
  'UAE': {
    en: {
      headline: "Specialized SCM & Freight Forwarding from China to UAE (Dubai/Jebel Ali)",
      subheadline: "Direct sea and air consolidation channels from Guangzhou to Dubai/Jebel Ali. Secure customs clearance and efficient door-to-door distribution.",
      card3Title: "Dubai Free Zone & Last Mile Logistics",
      card3Desc: "Direct delivery to Jebel Ali Free Zone and local warehousing. Hassle-free custom declarations and local courier/trucking fulfillment.",
      faqs: [
        {
          id: "ae-1",
          title: "Dubai Free Trade Hubs & Customs Clearance",
          desc: "Note: Dubai, as the largest free trade hub in the Middle East, boasts extremely fast customs clearance (typically within 24 hours). However, shippers must prioritize destination fulfillment optimization for high-return e-commerce parcels."
        },
        {
          id: "ae-2",
          title: "Outer Packaging & Sourcing Markings",
          desc: "UAE customs mandates imported goods outer boxes to clearly show origin labels (e.g., MADE IN CHINA). For e-commerce cargos, palletization and anti-damage reinforcements are highly recommended."
        },
        {
          id: "ae-3",
          title: "Avoiding Unreasonable Courier Surcharges",
          desc: "Commercial customs clearance via direct DDP line protects you from high destination airport storage fees compared to standard courier channels."
        }
      ]
    },
    zh: {
      headline: "中国始发至阿联酋（迪拜/杰贝阿里）大宗货与新能源项目物流专家",
      subheadline: "开通广州至迪拜自营海运空运拼箱专线，覆盖杰贝阿里、沙迦等主要枢纽，解决新能源、大宗高价值货物清关与仓储难题。",
      card3Title: "迪拜自营双清与最后一公里派送",
      card3Desc: "自营广州集拼仓库，无缝入驻迪拜自贸区（JAFZA），提供高效、零附加费的海空运DDP清关，及仓储履约分拨派送服务。",
      faqs: [
        {
          id: "ae-1",
          title: "迪拜自由贸易枢纽港极速清关与电商痛点",
          desc: "提示：迪拜作为中东最大自由贸易枢纽港，清关效率极高（通常24小时内），但务必注意高退货率电商件的目的地仓储履约优化。"
        },
        {
          id: "ae-2",
          title: "外箱及产品原产地标签强制性要求",
          desc: "阿联酋海关要求进口货物外箱及最小包装必须标识清晰的产地（如MADE IN CHINA），缺少标识可能导致海关扣关或高额二次贴签罚款。"
        },
        {
          id: "ae-3",
          title: "自营双清通道与规避快递机场拆单费",
          desc: "大货进口使用DDNZ阿联酋自营海空双清DDP专线，能有效规避传统快递渠道在迪拜机场产生的大额拆单费及高昂的目的地仓储附加费。"
        }
      ]
    },
    ru: {
      headline: "Специализированная доставка из Китая в ОАЭ (Дубай/Джебель-Али)",
      subheadline: "Прямые каналы консолидации из Гуанчжоу в Дубай/Джебель-Али. Надежная таможенная очистка и эффективная доставка «от двери до двери».",
      card3Title: "Доставка в СЭЗ Дубая и дистрибуция",
      card3Desc: "Прямая отправка в свободную экономическую зону Джебель-Али. Профессиональное оформление импорта и быстрая разгрузка на складах.",
      faqs: [
        {
          id: "ae-1",
          title: "Преимущества таможни Дубая и электронная коммерция",
          desc: "Примечание: Дубай, будучи крупнейшим свободным торговым хабом Ближнего Востока, обеспечивает сверхбыстрое оформление (до 24 часов). Однако важно оптимизировать возвратную логистику для e-commerce."
        },
        {
          id: "ae-2",
          title: "Маркировка страны происхождения",
          desc: "Таможня ОАЭ требует обязательного наличия маркировки страны происхождения на каждой коробке. Рекомендуется паллетирование для сохранности грузов."
        },
        {
          id: "ae-3",
          title: "Собственные каналы DDP без посредников",
          desc: "Тарифная сетка DDNZ полностью прозрачна. Поможем избежать скрытых аэродромных и терминальных сборов при импорте из Китая."
        }
      ]
    },
    fr: {
      headline: "Fret et logistique de Chine vers les EAU (Dubaï/Jebel Ali)",
      subheadline: "Canaux directs de consolidation de Guangzhou vers Dubaï/Jebel Ali. Dédouanement sécurisé et distribution porte-à-porte efficace.",
      card3Title: "Logistique Zone Franche de Dubaï",
      card3Desc: "Livraison directe à la zone franche de Jebel Ali et stockage local. Déclarations douanières simplifiées et service de distribution locale par camion ou messagerie.",
      faqs: [
        {
          id: "ae-1",
          title: "Plaques tournantes du commerce libre à Dubaï et dédouanement",
          desc: "Remarque : Dubaï, en tant que plus grand centre de commerce libre du Moyen-Orient, bénéficie d'un dédouanement extrêmement rapide (généralement en 24 heures). Cependant, les expéditeurs doivent optimiser la logistique finale pour les colis e-commerce."
        },
        {
          id: "ae-2",
          title: "Emballage extérieur et marquage d'origine",
          desc: "La douane des Émirats Arabes Unis exige que les cartons extérieurs indiquent clairement le pays d'origine (ex. MADE IN CHINA). Pour l'e-commerce, la palettisation est fortement recommandée."
        },
        {
          id: "ae-3",
          title: "Éviter les frais de transporteur excessifs",
          desc: "Le dédouanement commercial direct par notre ligne DDP vous évite les frais élevés de stockage à l'aéroport de destination par rapport aux courriers standards."
        }
      ]
    }
  },
  'Kuwait': {
    en: {
      headline: "Risk-Free Freight Forwarding from China to Kuwait | 100% KUCAS & Customs Compliance",
      subheadline: "Direct sea and air consolidation channels from Shenzhen/Guangzhou to Kuwait. Secure custom declarations and KUCAS certification filing.",
      card3Title: "KUCAS Compliance & Last Mile Logistics",
      card3Desc: "Hassle-free custom declarations, physical inspections coordination, and local trucking delivery across Kuwait.",
      faqs: [
        {
          id: "kw-1",
          title: "KUCAS Certification & Custom Clearances",
          desc: "Under Kuwait's import control program, controlled goods must obtain KUCAS TER and TIR certificates. Failure to comply leads to returns or cargo destruction."
        },
        {
          id: "kw-2",
          title: "Physical Inspection & Voltage Markings",
          desc: "Before shipping, physical inspection is required. Voltage must be labeled as 230V-240V/50Hz, and British standard plugs are strictly required."
        },
        {
          id: "kw-3",
          title: "Permanent Origin & Wood Fumigation",
          desc: "'Made in China' must be permanently engraved or embossed. Paper stickers are banned. Official IPPC fumigation certificates are required for wood packing."
        }
      ]
    },
    zh: {
      headline: "中国到科威特高合规海运/空运：直击 KUCAS 认证与严苛海运清关痛点，拒绝钱货两空",
      subheadline: "针对外贸人最怕的‘文件卡脖子、地缘断链、文化踩雷’，DDNZ 团队提供双清保障方案。",
      card3Title: "科威特 KUCAS 认证与末端派送",
      card3Desc: "提供一站式海空运双清包税，协助完成 KUCAS 认证、单批次 TIR 证书验货核发，以及科威特全境陆运送货上门。",
      faqs: [
        {
          id: "kw-1",
          title: "科威特 KUCAS 认证与清关合规要求",
          desc: "科威特对于进口管制货物强制要求出具 KUCAS 证书（TER 长期备案与 TIR 单批次清关证书），无证到港将面临被退运或就地销毁风险。"
        },
        {
          id: "kw-2",
          title: "线下物理检验与电压插头红线",
          desc: "出货前必须安排线下物理检验。电子设备工作电压必须标注 230V-240V/50Hz，且必须配备英标三脚插头，否则拒绝入境。"
        },
        {
          id: "kw-3",
          title: "永久性原产地标识与木质熏蒸",
          desc: "货物及外包装必须有永久性“Made in China”雕刻或丝印，严禁贴纸。木质包装必须持有官方 IPPC 熏蒸证书，否则直接扣留。"
        }
      ]
    },
    ru: {
      headline: "Безопасная доставка из Китая в Кувейт | 100% соответствие KUCAS",
      subheadline: "Прямые каналы морской и авиационной доставки из Китая в Кувейт. Полная таможенная очистка и оформление сертификатов KUCAS.",
      card3Title: "Соответствие KUCAS и доставка до двери",
      card3Desc: "Сопровождение физического досмотра, декларирование и локальная доставка грузовым транспортом по всему Кувейту.",
      faqs: [
        {
          id: "kw-1",
          title: "Сертификация KUCAS и таможенное оформление",
          desc: "Подконтрольные товары, импортируемые в Кувейт, должны иметь сертификаты KUCAS TER и TIR, иначе груз может быть возвращен или уничтожен."
        },
        {
          id: "kw-2",
          title: "Физический досмотр и требования к напряжению",
          desc: "Перед отправкой обязателен физический осмотр. Напряжение должно быть указано как 230V-240V/50Hz, требуются вилки британского стандарта."
        },
        {
          id: "kw-3",
          title: "Маркировка происхождения и фумигации",
          desc: "Маркировка «Made in China» должна быть выгравирована или нанесена краской на товаре и упаковке. Требуется официальный фитосанитарный сертификат на деревянную упаковку."
        }
      ]
    },
    fr: {
      headline: "Transport de fret sécurisé de Chine vers le Koweït | Conformité KUCAS",
      subheadline: "Canaux directs de fret maritime et aérien de Chine vers le Koweït. Dédouanement sécurisé et certification KUCAS.",
      card3Title: "Conformité KUCAS et logistique du dernier kilomètre",
      card3Desc: "Déclarations en douane simplifiées, coordination des inspections physiques et livraison locale par camion à travers le Koweït.",
      faqs: [
        {
          id: "kw-1",
          title: "Certification KUCAS et dédouanement",
          desc: "Dans le cadre du programme de contrôle des importations du Koweït, les produits contrôlés doivent obtenir les certificats KUCAS TER et TIR. Le non-respect entraîne un retour ou la destruction des marchandises."
        },
        {
          id: "kw-2",
          title: "Inspection physique et exigences de tension",
          desc: "Avant l'expédition, une inspection physique est requise. La tension doit être étiquetée 230V-240V/50Hz et les fiches standard britanniques sont strictement requises."
        },
        {
          id: "kw-3",
          title: "Marquage d'origine permanent et fumigation du bois",
          desc: "« Made in China » doit être gravé ou gaufré de manière permanente. Les étiquettes en papier sont interdites. Des certificats officiels de fumigation IPPC sont requis pour les emballages en bois."
        }
      ]
    }
  }
};

export default function MiddleEastRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [selectedCountry, setSelectedCountry] = useState<'Saudi-Arabia' | 'UAE' | 'Kuwait'>('Saudi-Arabia');
  const [isLocked, setIsLocked] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [specActiveTab, setSpecActiveTab] = useState<'tab1' | 'tab2'>('tab1');

  // Sync state with query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const countryParam = params.get('country') || params.get('dest');
    const lockParam = params.get('lock') === 'true' || params.get('locked') === 'true' || params.get('lockCountry') === 'true';
    setIsLocked(lockParam);

    if (countryParam) {
      if (countryParam.toLowerCase() === 'uae') {
        setSelectedCountry('UAE');
      } else if (countryParam.toLowerCase() === 'kuwait') {
        setSelectedCountry('Kuwait');
      } else {
        setSelectedCountry('Saudi-Arabia');
      }
    }
  }, [location.search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('page_view', { path: '/shipping-from-china-to-middle-east', country: selectedCountry });
  }, [location.pathname, selectedCountry]);

  const handleCountryTabChange = (country: 'Saudi-Arabia' | 'UAE' | 'Kuwait') => {
    setSelectedCountry(country);
    navigate(`?country=${country}`, { replace: true });
  };

  const activeLang = language === 'zh' ? 'zh' : language === 'ru' ? 'ru' : language === 'fr' ? 'fr' : 'en';

  const getCountryContent = (key: string) => {
    const countryData = COUNTRY_CONTENT[selectedCountry];
    if (!countryData) return '';
    const langData = countryData[activeLang] || countryData['en'];
    return langData?.[key] || '';
  };

  const getFaqs = () => {
    const countryData = COUNTRY_CONTENT[selectedCountry];
    if (!countryData) return [];
    const langData = countryData[activeLang] || countryData['en'];
    return langData?.faqs || [];
  };

  const getComplianceRow = () => {
    if (selectedCountry === 'Saudi-Arabia') {
      return {
        title: language === 'zh' ? 'SABER 证书预审核发' : 'SABER Conformity Clearance',
        val: language === 'zh' ? '2 - 3 工作日' : '2 - 3 Days'
      };
    } else if (selectedCountry === 'UAE') {
      return {
        title: language === 'zh' ? '迪拜自贸区通关核发' : 'Dubai Free Zone Clearance',
        val: language === 'zh' ? '1 - 2 工作日' : '1 - 2 Days'
      };
    } else {
      return {
        title: language === 'zh' ? 'KUCAS 单批次证书核发' : 'KUCAS TIR Certification',
        val: language === 'zh' ? '3 - 5 工作日' : '3 - 5 Days'
      };
    }
  };

  const getDynamicSeaDays = () => {
    if (selectedCountry === 'Saudi-Arabia') {
      if (language === 'zh') return '18 - 25 天';
      if (language === 'ru') return '18 - 25 дней';
      if (language === 'fr') return '18 - 25 jours';
      return '18 - 25 Days';
    } else if (selectedCountry === 'UAE') {
      if (language === 'zh') return '15 - 22 天';
      if (language === 'ru') return '15 - 22 дней';
      if (language === 'fr') return '15 - 22 jours';
      return '15 - 22 Days';
    } else {
      if (language === 'zh') return '18 - 28 天';
      if (language === 'ru') return '18 - 28 дней';
      if (language === 'fr') return '18 - 28 jours';
      return '18 - 28 Days';
    }
  };

  const t = (key: string) => {
    const data = PAGE_LANG_DATA[activeLang] || PAGE_LANG_DATA['en'];
    return data[key] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A051B] to-[#120A2A] text-white font-sans overflow-x-hidden">
      <SEO title={t('seoTitle')} description={t('seoDesc')} />
      
      <Navbar />

      <main className="pt-20 md:pt-24">
        
        {/* Section 1: Hero Segment */}
        <section className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
          {/* Visual shipping backdrop layer */}
          <div className="absolute inset-0 z-0 opacity-15">
            <img 
              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2000"
              alt="Middle East Container Terminal" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Dark Purple Gradient Cover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A051B] via-[#0A051B]/80 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-black tracking-widest uppercase self-start">
                    <span>{t('chinaToMiddleEastSpecialist')}</span>
                  </div>
                  
                  {/* Dynamic Country Selector Tabs */}
                  {!isLocked && (
                    <div className="flex flex-wrap gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.08] max-w-fit">
                      {(['Saudi-Arabia', 'UAE', 'Kuwait'] as const).map((country) => {
                        const isActive = selectedCountry === country;
                        const label = country === 'Saudi-Arabia' 
                          ? t('country_Saudi_Arabia') 
                          : country === 'UAE' 
                            ? t('country_UAE')
                            : t('country_Kuwait');
                        return (
                          <button
                            key={country}
                            type="button"
                            onClick={() => handleCountryTabChange(country)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                              isActive
                                ? 'bg-[#FF8A00] text-white shadow-md shadow-[#FF8A00]/15'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#FF8A00]">
                    {getCountryContent('headline')}
                  </span>
                </h1>
                
                <div className="space-y-4">
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                    {getCountryContent('subheadline')}
                  </p>
                  
                  {/* Premium Micro-Badges / Key SCM Highlights */}
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {language === 'zh' ? 'SABER / 中东合规核验' : 'SABER & Customs Compliant'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF8A00]/10 border border-[#FF8A00]/20 text-xs font-bold text-[#FF8A00]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]"></span>
                      {language === 'zh' ? '自主装箱与直航排舱' : 'Direct LCL/FCL Allocations'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      {language === 'zh' ? '中东一站式 DDP 双清' : 'One-Stop Middle East DDP'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      const formElem = document.getElementById('middle-east-quote-form');
                      if (formElem) {
                        formElem.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="px-6 py-3.5 bg-gradient-to-r from-[#FF8A00] to-[#ff9f24] hover:from-[#e07a00] hover:to-[#ff8a00] text-white font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300 flex items-center gap-2"
                  >
                    <span>{t('heroCta')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-6 pt-6 border-t border-white/10 max-w-lg">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#4B27B1] border-2 border-[#0A051B] flex items-center justify-center text-[10px] font-bold">SA</div>
                    <div className="w-8 h-8 rounded-full bg-[#FF8A00] border-2 border-[#0A051B] flex items-center justify-center text-[10px] font-bold">AE</div>
                    <div className="w-8 h-8 rounded-full bg-[#8552D2] border-2 border-[#0A051B] flex items-center justify-center text-[10px] font-bold">KW</div>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    {t('experienceBadge')}
                  </p>
                </div>
              </div>

              {/* Mini Quick Fact Widget */}
              <div className="lg:col-span-5 bg-white/[0.03] backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/[0.08] shadow-2xl">
                <h3 className="text-lg font-black tracking-wide text-[#FF8A00] uppercase mb-4">
                  {t('transitWindowTitle')}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <span className="text-sm font-bold text-slate-300">
                      {t('seaDdpText')}
                    </span>
                    <span className="text-sm font-extrabold text-[#FF8A00]">
                      {getDynamicSeaDays()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <span className="text-sm font-bold text-slate-300">
                      {t('airDdpText')}
                    </span>
                    <span className="text-sm font-extrabold text-[#FF8A00]">
                      {t('airDaysText')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <span className="text-sm font-bold text-slate-300">
                      {getComplianceRow().title}
                    </span>
                    <span className="text-sm font-extrabold text-[#FF8A00]">
                      {getComplianceRow().val}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-white/[0.02] rounded-xl border border-white/[0.08] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FF8A00] flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300 leading-normal font-medium">
                    {t('transitIncludeText')}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 2: Red Sea Operational Reality Update (Market Insight Box) */}
        <section className="py-12 bg-[#0E0726] border-y border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white/[0.02] rounded-2xl border-l-8 border-[#FF8A00] p-6 md:p-8 shadow-md border border-white/[0.08]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#FF8A00]/10 text-[#FF8A00]">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] tracking-widest font-black uppercase text-[#FF8A00]">
                    {t('alertTag')}
                  </span>
                  <h2 className="text-lg md:text-xl font-black text-white leading-tight">
                    {t('alertTitle')}
                  </h2>
                </div>
              </div>
              
              <p className="text-sm text-slate-300 leading-relaxed font-semibold mb-2">
                {t('alertContent')}
              </p>
              
              <div className="mt-4 flex items-center gap-2 text-xs font-black text-slate-400">
                <span>{t('insightPortfolio')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]" />
                <span>2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: All-in-One Transit Time & Reference Matrix */}
        <section className="py-16 md:py-24 border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-bold tracking-wider uppercase mb-3">
                {t('colSolutions')}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-4">
                {t('matrixTitle')}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-sm sm:text-base font-medium">
                {t('matrixSubtitle')}
              </p>
            </div>

            <div className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-xs font-bold uppercase tracking-wider text-slate-500 bg-transparent">
                      <th className="px-6 py-4.5">{t('colTargetCountries')}</th>
                      <th className="px-6 py-4.5">{t('colAirFreight')}</th>
                      <th className="px-6 py-4.5">{t('colOceanFcl')}</th>
                      <th className="px-6 py-4.5">{t('colOceanLcl')}</th>
                      <th className="px-6 py-4.5">{t('colPortToPort')}</th>
                      <th className="px-6 py-4.5 text-right">{t('colSolutions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {MATRIX_ROWS.filter((row, idx) => {
                      if (selectedCountry === 'Saudi-Arabia') return idx === 0;
                      if (selectedCountry === 'UAE') return idx === 1;
                      if (selectedCountry === 'Kuwait') return idx === 2;
                      return true;
                    }).map((row, idx) => {
                      const countryLabel = row.country[activeLang as 'en' | 'zh' | 'ru' | 'fr'] || row.country.en;
                      const airText = row.air[activeLang as 'en' | 'zh' | 'ru' | 'fr'] || row.air.en;
                      const fclText = row.fcl[activeLang as 'en' | 'zh' | 'ru' | 'fr'] || row.fcl.en;
                      const lclText = row.lcl[activeLang as 'en' | 'zh' | 'ru' | 'fr'] || row.lcl.en;
                      const portToPortText = row.portToPort[activeLang as 'en' | 'zh' | 'ru' | 'fr'] || row.portToPort.en;
                      const solutionsText = row.solutions[activeLang as 'en' | 'zh' | 'ru' | 'fr'] || row.solutions.en;

                      return (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors duration-150 group">
                          <td className="px-6 py-5 font-black text-white text-sm sm:text-base">
                            <div className="flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#FF8A00]" />
                              {countryLabel}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-slate-300 whitespace-pre-line font-bold">
                            {airText}
                          </td>
                          <td className="px-6 py-5 text-sm text-slate-300 font-semibold">
                            {fclText}
                          </td>
                          <td className="px-6 py-5 text-sm text-slate-300 font-semibold">
                            {lclText}
                          </td>
                          <td className="px-6 py-5 text-sm text-slate-400 font-semibold font-mono">
                            {portToPortText}
                          </td>
                          <td className="px-6 py-5 text-sm text-slate-300 font-semibold text-right max-w-xs truncate">
                            {solutionsText}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-white/[0.01] border-t border-white/[0.05]">
                <p className="text-[10px] text-slate-400 font-semibold">
                  {t('matrixFootnote')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: SME Advantage Tri-Cards */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                {t('cardsHeading')}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-sm sm:text-base font-semibold leading-relaxed">
                {t('cardsSubheading')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8 hover:border-[#FF8A00]/50 hover:shadow-[0_0_30px_rgba(75,39,177,0.15)] hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 text-[#FF8A00] flex items-center justify-center mb-6 p-3">
                    <Ship className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-3">
                    {t('card1Title')}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    {t('card1Desc')}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs font-bold text-[#FF8A00]">
                  <span>{t('card1Cta')}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8 hover:border-[#FF8A00]/50 hover:shadow-[0_0_30px_rgba(75,39,177,0.15)] hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 text-[#FF8A00] flex items-center justify-center mb-6 p-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-3">
                    {t('card2Title')}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    {t('card2Desc')}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs font-bold text-[#FF8A00]">
                  <span>{t('card2Cta')}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8 hover:border-[#FF8A00]/50 hover:shadow-[0_0_30px_rgba(75,39,177,0.15)] hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 text-[#FF8A00] flex items-center justify-center mb-6 p-3">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-3">
                    {getCountryContent('card3Title')}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    {getCountryContent('card3Desc')}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs font-bold text-[#FF8A00]">
                  <span>{t('card3Cta')}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Country-Specific Compliance & Operation Section */}
        {(() => {
          const spec = COUNTRY_SPEC_DATA[selectedCountry]?.[activeLang] || COUNTRY_SPEC_DATA[selectedCountry]?.['en'];
          if (!spec) return null;
          return (
            <section className="py-16 border-t border-b border-white/[0.05]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span className="px-3 py-1 bg-white/[0.05] text-[#FF8A00] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                    {selectedCountry === 'Saudi-Arabia' ? t('saudiFocus') : selectedCountry === 'UAE' ? t('uaeFocus') : t('kuwaitFocus')}
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                    {spec.specTitle}
                  </h2>
                  <div className="w-10 h-1 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-6" />
                  <p className="text-slate-400 text-sm sm:text-base font-semibold leading-relaxed">
                    {spec.specSub}
                  </p>
                </div>

                {/* Grid for Compliance Guide & Redlines */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                  
                  {/* Left part: Compliance Tabs / Accordion (cols 7) */}
                  <div className="lg:col-span-7 bg-white/[0.03] rounded-2xl p-6 md:p-8 border border-white/[0.08] shadow-sm flex flex-col justify-between">
                    <div>
                      {/* Tabs buttons */}
                      <div className="flex border-b border-white/[0.08] pb-4 mb-6 gap-4">
                        <button
                          onClick={() => setSpecActiveTab('tab1')}
                          className={`flex-1 pb-3 text-xs sm:text-sm font-black text-center border-b-2 transition-all ${specActiveTab === 'tab1' ? 'border-[#FF8A00] text-[#FF8A00]' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
                        >
                          {spec.tab1Title}
                        </button>
                        <button
                          onClick={() => setSpecActiveTab('tab2')}
                          className={`flex-1 pb-3 text-xs sm:text-sm font-black text-center border-b-2 transition-all ${specActiveTab === 'tab2' ? 'border-[#FF8A00] text-[#FF8A00]' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
                        >
                          {spec.tab2Title}
                        </button>
                      </div>

                      {/* Tab Content */}
                      <AnimatePresence mode="wait">
                        {specActiveTab === 'tab1' ? (
                          <motion.div
                            key="tab1-panel"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center gap-2 text-[#FF8A00] font-bold text-sm">
                              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                              <span>{spec.tab1Header}</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed font-medium">
                              {spec.tab1Desc}
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="tab2-panel"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                              <Search className="w-5 h-5 flex-shrink-0" />
                              <span>{spec.tab2Header}</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed font-medium">
                              {spec.tab2Desc}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-black text-slate-400">
                      <span>✓ {t('compliantFilingText')}</span>
                      <span>{t('professionalVerificationText')}</span>
                    </div>
                  </div>

                  {/* Right part: Redlines (cols 5) */}
                  <div className="lg:col-span-5 bg-[#2B0E1E] rounded-2xl p-6 md:p-8 border border-red-500/10 shadow-sm">
                    <div className="flex items-center gap-2 text-red-400 font-black mb-6 text-sm sm:text-base">
                      <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse flex-shrink-0" />
                      <h3>{spec.redlinesTitle}</h3>
                    </div>

                    <div className="space-y-4">
                      {spec.redlines.map((item: any) => (
                        <div key={item.id} className="flex gap-3 items-start text-xs sm:text-sm">
                          <span className="text-red-400 font-black text-sm flex-shrink-0 mt-0.5">{item.id}</span>
                          <div>
                            <span className="font-black text-white block mb-0.5">{item.title}</span>
                            <span className="text-slate-400 font-medium leading-relaxed block">{item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Operations Guide Sub-section */}
                <div className="mt-16 pt-16 border-t border-white/[0.08]">
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                      {spec.guideTitle}
                    </h3>
                    <p className="text-slate-400 text-sm font-semibold">
                      {spec.guideSub}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {spec.guideCards.map((card: any, idx: number) => {
                      return (
                        <div key={idx} className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 hover:border-[#FF8A00]/50 hover:shadow-[0_0_30px_rgba(75,39,177,0.15)] hover:bg-white/[0.05] transition-all duration-300">
                          <div className="w-10 h-10 rounded-lg bg-[#FF8A00]/10 text-[#FF8A00] flex items-center justify-center mb-4 p-2 font-black">
                            {idx === 0 ? <AlertTriangle className="w-5 h-5" /> : idx === 1 ? <Package className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                          </div>
                          <h4 className="text-base font-black text-white mb-2">{card.title}</h4>
                          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">{card.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </section>
          );
        })()}

        {/* Section 5: Middle East Shipping Checklist & FAQ (Accordion Module) */}
        <section className="py-16 md:py-24 border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-bold tracking-wider uppercase mb-3">
                FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                {t('faqHeading')}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-sm font-medium">
                {t('faqSubheading')}
              </p>
            </div>

            <div className="space-y-4">
              {getFaqs().map((faq: any) => {
                const isOpen = activeFaq === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    className="bg-white/[0.03] backdrop-blur-md rounded-xl border border-white/[0.08] overflow-hidden shadow-sm hover:border-slate-500 transition-colors duration-200"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                    >
                      <span className="text-sm md:text-base font-black text-white pr-4">
                        {faq.title}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-[#FF8A00] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
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
                            {faq.desc}
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

        {/* Formspree-ready Styled Lead Capture Container */}
        <section id="middle-east-quote-form" className="py-16 md:py-24 border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/[0.03] backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/[0.08] dark-form-container">
              <GetAQuote
                presetDestination={
                  selectedCountry === 'Saudi-Arabia' ? 'Saudi Arabia' : selectedCountry === 'UAE' ? 'UAE' : 'Kuwait'
                }
                presetService="Sea"
              />
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
    </div>
  );
}
