import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import ScrollToTop from '../components/ScrollToTop';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import GetAQuote from '../components/GetAQuote';
import MarketSourcingHandoff from '../components/MarketSourcingHandoff';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, AlertTriangle, Ship, Package, ShieldCheck, 
  Search, ArrowRight, CheckCircle2, MessageSquare, ShieldAlert,
  Globe, Clock, HelpCircle, Truck
} from 'lucide-react';
import { COUNTRY_SPEC_DATA } from '../data/countrySpecData';
import { buildShippingCountryPath, getShippingCountrySlug } from '../utils/shippingCountryRoutes';

// Multi-language strings for this Middle East Route page
const PAGE_LANG_DATA: Record<string, Record<string, any>> = {
  en: {
    seoTitle: "China to Middle East Freight Forwarding Guide | DDNZ Global",
    seoDesc: "Freight planning from China to Middle East markets, including sea, air, consolidation and export-document coordination. DDP availability depends on the destination and cargo profile.",
    heroHeadline: "Shipping from China to Middle East markets",
    heroSubheadline: "Plan sea or air freight around current route conditions, cargo requirements and destination-side operating scope.",
    heroCta: "Get Free Route & Tariff Analysis",
    
    alertTag: "Operational Update",
    alertTitle: "The Red Sea Shift: From Maritime Risks to Port Bottlenecks",
    alertContent: "On affected Cape-routing sailings, the ocean leg can add roughly 10–14 days. Seasonal demand, carrier rotations, port congestion and destination procedures can also shift the final delivery window.",
    
    matrixTitle: "All-in-One Transit Time & Reference Matrix",
    matrixSubtitle: "Realistic transit durations mapped from China hubs to Middle East regional destinations.",
    colTargetCountries: "Target Countries",
    colAirFreight: "Air Freight (Door-to-Door)",
    colOceanFcl: "Ocean Freight FCL (Door-to-Door)",
    colOceanLcl: "Ocean Freight LCL (Door-to-Door)",
    colPortToPort: "Port-to-Port Sea Voyage (Ref)",
    colSolutions: "Tailored Solutions Header",
    matrixFootnote: "Planning ranges are based on typical routings. Allow extra time for peak seasons, vessel rotations, port congestion, customs inspection, public holidays and route disruptions; the booked carrier schedule is controlling.",

    cardsHeading: "Heaven Born Middle East Advantage",
    cardsSubheading: "Tailored supply chain solutions built for SME traders, e-commerce sellers, and enterprise importers.",
    
    card1Title: "Alibaba/1688 Consolidation Management",
    card1Desc: "Coordinate receiving, inspection and consolidation for cargo from multiple suppliers before export preparation.",
    card1Cta: "View Consolidation Rates",
    card2Title: "Your Eyes & Ears in China: Pre-Shipment Inspection",
    card2Desc: "Coordinate quantity, visible-condition and packing checks before cargo is released for shipment.",
    card2Cta: "Request Inspection Details",
    card3Title: "Local Customs & Compliance Backup",
    card3Desc: "Support document preparation and HS-code review, then coordinate destination clearance partners where the service scope permits.",
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
    formSub: "Submit your cargo details and our route team will confirm the information needed for a tailored quotation.",
    formLabelName: "Your Name",
    formLabelEmail: "Email Address",
    formLabelPhone: "WhatsApp / Phone",
    formLabelGoods: "Type of Goods / Volume",
    formLabelDest: "Destination",
    formCta: "Calculate My Shipping Tariff",
    formSuccess: "Thank you. Our route team will review the cargo details and contact you using the information provided.",
    chinaToMiddleEastSpecialist: "CHINA–MIDDLE EAST SPECIALIST",
    experienceBadge: "Established in 1997 · China-origin logistics support",
    transitWindowTitle: "Middle East Transit Windows",
    seaDdpText: "Sea Freight DDP (Door to Door)",
    airDdpText: "Air Freight DDP (Door to Door)",
    seaDaysText: "Typical planning range",
    airDaysText: "Typical planning range",
    transitIncludeText: "General planning ranges only. Add buffer time for peak seasons, carrier schedule changes, port congestion, customs inspection, public holidays and route disruptions.",
    compliantFilingText: "Compliance Review Support",
    professionalVerificationText: "Professional Verification",
    saudiFocus: "Saudi Arabia Focus",
    uaeFocus: "UAE Focus",
    kuwaitFocus: "Kuwait Focus",
    country_Saudi_Arabia: "Saudi Arabia",
    country_UAE: "UAE",
    country_Kuwait: "Kuwait",
    country_Qatar: "Qatar",
    country_Oman: "Oman",
    country_Bahrain: "Bahrain",
    insightPortfolio: "Heaven Born Logistics Insight"
  },
  zh: {
    seoTitle: "中国至中东（沙特/阿联酋/科威特）海运空运与清关服务 | 华正邦泰国际货运",
    seoDesc: "面向贸易商与电商卖家的中国至中东货运方案，提供海空运、集货、SABER 合规文件协调及目的地清关支持。",
    heroHeadline: "从中国到中东市场的海空运与集货规划",
    heroSubheadline: "根据当前航线、货物资料和目的国操作范围，协调海运、空运、集货及出口文件准备。",
    heroCta: "获取免费航线及运价分析",
    
    alertTag: "红海动态运营通报",
    alertTitle: "中东大实话：红海绕行进入深水区，痛点已变成‘港口挤压’",
    alertContent: "受好望角绕行影响的船期，海运段通常可能增加约 10–14 天。旺季、船公司轮换、港口拥堵、目的港操作和查验，也会影响最终派送周期。",
    
    matrixTitle: "中东海空时效与服务对照矩阵",
    matrixSubtitle: "为您展示真实的中国起运至中东各主要目的国的DDP时效及港到港航程参考。",
    colTargetCountries: "目的国家/地区",
    colAirFreight: "空运 DDP 双清门到门",
    colOceanFcl: "海运整箱 FCL DDP 门到门",
    colOceanLcl: "海运拼箱 LCL DDP 门到门",
    colPortToPort: "起运港至目的港海运航程",
    colSolutions: "定制化物流解决方案",
    matrixFootnote: "时效备注：以下为常规航线的计划参考区间。旺季、船公司班期调整、港口拥堵、查验、节假日及航线变化均可能延长周期；以实际订舱后的承运人船期为准。",

    cardsHeading: "华正邦泰中东专线优势",
    cardsSubheading: "专为跨境中小企业、外贸商家和工厂打造，解决各种杂乱需求及目的港壁垒。",
    
    card1Title: "阿里巴巴/1688 货物集货与拼箱",
    card1Desc: "协调接收、核对并合并来自多个 1688 及阿里巴巴供应商的货物，并按确认范围安排重新包装与出运准备。",
    card1Cta: "了解集拼收费标准",
    card2Title: "中国本土装运前检验 (出货前本土实地品控验货)",
    card2Desc: "作为您在中国的眼睛和耳朵，我们在装箱前对货物进行外观质检、数量核对和包装加固确认，把质量纠纷解决在国门之内。",
    card2Cta: "了解验货服务",
    card3Title: "目的港口岸清关与合规支持 (合规双清与特殊资质协助)",
    card3Desc: "协助整理沙特 SABER 资料、核对商品 HS 编码，并与目的地合作清关代理协调 DDP 服务的适用范围。",
    card3Cta: "预审海关HS编码",
    
    faqHeading: "中东段出货合规排查及常见问题",
    faqSubheading: "建议每一位发货卖家收藏！提前排查合规红线，确保跨境大货顺利通关放行。",
    
    faqs: [
      {
        id: "faq-1",
        title: "商业快递与商业清关的适用条件",
        desc: "品牌货别随便走快递，当地清关极其严。大货如没有在目的地具备清关能力的收件人托底，半路临时用快递冲关极易导致清关失败并强制退回，发货前必须提前确认清关能力。"
      },
      {
        id: "faq-2",
        title: "强制性原产地标记及外箱贴签硬性要求",
        desc: "请在出运前根据目的国要求确认原产地标记与外箱标签；缺少必要标记可能带来额外处理或延误。"
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
    formSub: "请填写货物信息，我们的中东项目组将确认路线、服务范围和报价所需资料。",
    formLabelName: "您的姓名",
    formLabelEmail: "电子邮箱",
    formLabelPhone: "联系电话 / 微信 / WhatsApp",
    formLabelGoods: "货物类型 / 件数 / 重量体积",
    formLabelDest: "目的国",
    formCta: "提交询价",
    formSuccess: "提交成功。我们的路线团队将核对货物信息和所需资料，并通过您留下的联系方式回复。",
    chinaToMiddleEastSpecialist: "中国–中东货运专家",
    experienceBadge: "29年中国至中东跨境物流经验",
    transitWindowTitle: "中东专线预计时效",
    seaDdpText: "海运门到门 (双清DDP)",
    airDdpText: "空运双清包税 (DDP)",
    seaDaysText: "常规计划参考",
    airDaysText: "常规计划参考",
    transitIncludeText: "以下为常规计划参考区间。建议为旺季、船期调整、港口拥堵、查验、节假日及航线变化预留缓冲时间。",
    compliantFilingText: "合规文件审核支持",
    professionalVerificationText: "高效专业审核核发",
    saudiFocus: "沙特专区",
    uaeFocus: "阿联酋专区",
    kuwaitFocus: "科威特专区",
    country_Saudi_Arabia: "沙特",
    country_UAE: "阿联酋",
    country_Kuwait: "科威特",
    country_Qatar: "卡塔尔",
    country_Oman: "阿曼",
    country_Bahrain: "巴林",
    insightPortfolio: "华正邦泰物流洞察"
  },
  ru: {
    seoTitle: "Доставка грузов из Китая на Ближний Восток (ОАЭ, Саудовская Аравия) | DDNZ Global",
    seoDesc: "Надежные грузоперевозки из Китая в Саудовскую Аравию, ОАЭ и Кувейт. Оптимизация маршрутов и полное таможенное оформление с сертификатами SABER.",
    heroHeadline: "Надежные логистические сети из Китая на Ближний Восток",
    heroSubheadline: "Обход портовых заторов в Красном море с оптимизацией транзита. Полная поддержка по таможенным правилам и SABER.",
    heroCta: "Получить бесплатный расчет тарифа",
    
    alertTag: "Оперативная информация",
    alertTitle: "Сдвиг в Красном море: от морских рисков к заторам в портах",
    alertContent: "Из-за перенаправления судов через мыс Доброй Надежды морская логистика сталкивается с дополнительной нагрузкой. Мы помогаем заранее планировать бронирование, документы и бюджет с учетом ситуации в портах назначения.",
    
    matrixTitle: "Единая матрица транзитных сроков и маршрутов",
    matrixSubtitle: "Реалистичные сроки доставки DDP от складов в Китае до ключевых регионов Ближнего Востока.",
    colTargetCountries: "Целевые страны",
    colAirFreight: "Авиадоставка DDP (Дверь-Дверь)",
    colOceanFcl: "Морской контейнер FCL DDP (Дверь-Дверь)",
    colOceanLcl: "Морская сборная LCL DDP (Дверь-Дверь)",
    colPortToPort: "Морской рейс порт-порт (Справочно)",
    colSolutions: "Индивидуальные решения",
    matrixFootnote: "Диапазоны приведены для обычных маршрутов и планирования. Закладывайте дополнительное время на пиковый сезон, изменения расписаний перевозчиков, перегруженность портов, досмотр, праздники и изменения маршрута; приоритет имеет расписание подтверждённого бронирования.",

    cardsHeading: "Поддержка Heaven Born на Ближнем Востоке",
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
        desc: "В связи с геополитическими рисками ставки могут меняться. Подтверждайте бронирование и срок действия ставки с командой Heaven Born перед отправкой."
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
    formSub: "Предоставьте детали груза, и наша команда уточнит данные, необходимые для расчета.",
    formLabelName: "Ваше имя",
    formLabelEmail: "Электронная почта",
    formLabelPhone: "Телефон / WhatsApp",
    formLabelGoods: "Тип груза / Объем и вес",
    formLabelDest: "Страна назначения",
    formCta: "Рассчитать стоимость доставки",
    formSuccess: "Спасибо! Наш региональный менеджер уже рассчитывает ваш маршрут и свяжется с вами по телефону/WhatsApp в ближайшее время.",
    chinaToMiddleEastSpecialist: "СПЕЦИАЛИСТ ПО НАПРАВЛЕНИЮ КИТАЙ–БЛИЖНИЙ ВОСТОК",
    experienceBadge: "Опыт организации перевозок Китай–Ближний Восток",
    transitWindowTitle: "Ориентировочные сроки доставки на Ближний Восток",
    seaDdpText: "Морской фрахт DDP (от двери до двери)",
    airDdpText: "Авиафрахт DDP (от двери до двери)",
    seaDaysText: "Обычный диапазон планирования",
    airDaysText: "Обычный диапазон планирования",
    transitIncludeText: "Это диапазоны для планирования. Оставляйте запас на высокий сезон, изменение расписания, перегрузку портов, досмотр, праздники и изменения маршрута.",
    compliantFilingText: "Поддержка проверки документов",
    professionalVerificationText: "Профессиональная верификация",
    saudiFocus: "Саудовская Аравия",
    uaeFocus: "ОАЭ",
    kuwaitFocus: "Кувейт",
    country_Saudi_Arabia: "Саудовская Аравия",
    country_UAE: "ОАЭ",
    country_Kuwait: "Кувейт",
    insightPortfolio: "Аналитика Heaven Born по международной логистике"
  },
  fr: {
    seoTitle: "Fret maritime et aérien de Chine vers le Moyen-Orient | DDNZ Global",
    seoDesc: "Expéditions sécurisées de Chine vers l'Arabie Saoudite, les EAU et le Koweït. Solutions logistiques optimisées face aux blocages portuaires.",
    heroHeadline: "Réseaux logistiques fiables de Chine vers le Moyen-Orient",
    heroSubheadline: "Naviguer à travers les tensions en mer Rouge grâce à des routes maritimes sécurisées. Gestion des dossiers SABER & dédouanement local.",
    heroCta: "Obtenir une étude de route gratuite",
    
    alertTag: "Rapport opérationnel",
    alertTitle: "Le virage de la mer Rouge : des risques maritimes aux goulots d'étranglement portuaires",
    alertContent: "Avec le déroutement de certains navires par le cap de Bonne-Espérance, la logistique maritime subit une charge supplémentaire. Nous aidons à planifier les réservations, les documents et le budget en tenant compte des conditions dans les ports de destination.",
    
    matrixTitle: "Matrice de référence globale des temps de transport",
    matrixSubtitle: "Durées de transit réalistes cartographiées depuis les hubs chinois vers le Moyen-Orient.",
    colTargetCountries: "Pays de destination",
    colAirFreight: "Fret aérien DDP (Porte-à-Porte)",
    colOceanFcl: "Fret maritime FCL DDP (Porte-à-Porte)",
    colOceanLcl: "Fret maritime LCL DDP (Porte-à-Porte)",
    colPortToPort: "Voyage maritime Port-à-Port (Réf)",
    colSolutions: "Solutions sur mesure",
    matrixFootnote: "Ces fourchettes correspondent aux itinéraires habituels et servent à la planification. Prévoyez une marge en haute saison, lors des changements de rotation, de congestion portuaire, d’inspections, de jours fériés ou de modifications d’itinéraire ; l’horaire de la réservation confirmée prévaut.",

    cardsHeading: "L’accompagnement Heaven Born au Moyen-Orient",
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
        desc: "En raison de l'instabilité régionale, les tarifs peuvent évoluer. Confirmez la réservation et la validité du devis avec Heaven Born avant l’expédition."
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
    formSub: "Fournissez les détails de votre cargaison afin que notre équipe confirme les éléments nécessaires au devis.",
    formLabelName: "Votre Nom",
    formLabelEmail: "Adresse Email",
    formLabelPhone: "WhatsApp / Téléphone",
    formLabelGoods: "Type de marchandises / Volume",
    formLabelDest: "Pays de destination",
    formCta: "Calculer mon tarif de livraison",
    formSuccess: "Merci ! Notre expert logistique Moyen-Orient analyse votre dossier et vous contactera par WhatsApp/Email sous peu.",
    chinaToMiddleEastSpecialist: "SPÉCIALISTE CHINE–MOYEN-ORIENT",
    experienceBadge: "Expérience de coordination Chine–Moyen-Orient",
    transitWindowTitle: "Délais indicatifs vers le Moyen-Orient",
    seaDdpText: "Fret maritime DDP (porte-à-porte)",
    airDdpText: "Fret aérien DDP (porte-à-porte)",
    seaDaysText: "Fourchette habituelle de planification",
    airDaysText: "Fourchette habituelle de planification",
    transitIncludeText: "Ces fourchettes servent à la planification. Prévoyez une marge pour la haute saison, les changements d’horaires, la congestion portuaire, les inspections, les jours fériés et les modifications d’itinéraire.",
    compliantFilingText: "Accompagnement pour la vérification des documents",
    professionalVerificationText: "Vérification professionnelle",
    saudiFocus: "Focus Arabie Saoudite",
    uaeFocus: "Focus EAU",
    kuwaitFocus: "Focus Koweït",
    country_Saudi_Arabia: "Arabie Saoudite",
    country_UAE: "EAU",
    country_Kuwait: "Koweït",
    insightPortfolio: "Analyses Heaven Born sur la logistique internationale"
  }
};

PAGE_LANG_DATA.es = {
  ...PAGE_LANG_DATA.en,
  seoTitle: "Flete marítimo y aéreo de China a Oriente Medio | DDNZ Global",
  seoDesc: "Envíos desde China a Arabia Saudita, EAU, Kuwait, Qatar, Omán y Baréin con planificación documental y aduanera.",
  heroHeadline: "Redes logísticas confiables de China a Oriente Medio",
  heroSubheadline: "Planificación marítima y aérea con revisión SABER, documentos de importación y coordinación de entrega local.",
  heroCta: "Obtener análisis gratuito de ruta",
  alertTag: "Actualización operativa",
  alertTitle: "Mar Rojo: planificación ante desvíos y congestión portuaria",
  alertContent: "Los desvíos y la congestión pueden modificar los itinerarios. Confirmamos espacio, ruta, documentación y margen de tiempo antes del embarque.",
  matrixTitle: "Matriz de tiempos de tránsito",
  matrixSubtitle: "Rangos habituales desde centros de China hacia Oriente Medio.",
  colTargetCountries: "País de destino",
  colAirFreight: "Flete aéreo DDP",
  colOceanFcl: "Flete marítimo FCL DDP",
  colOceanLcl: "Flete marítimo LCL DDP",
  colPortToPort: "Puerto a puerto",
  colSolutions: "Soluciones",
  matrixFootnote: "Son rangos de planificación. Añada margen por temporada alta, cambios de horario, congestión, inspecciones, festivos o desvíos.",
  cardsHeading: "Apoyo de Heaven Born en Oriente Medio",
  cardsSubheading: "Coordinación de consolidación, documentos, transporte y entrega.",
  card1Title: "Consolidación Alibaba y 1688",
  card1Desc: "Recepción, revisión y consolidación de mercancía de varios proveedores en Guangzhou.",
  card1Cta: "Consultar consolidación",
  card2Title: "Inspección antes del embarque",
  card2Desc: "Revisión visual, conteo, embalaje y supervisión de carga según el alcance acordado.",
  card2Cta: "Consultar inspección",
  card3Title: "Apoyo aduanero y SABER",
  card3Desc: "Coordinación de documentos, códigos HS y requisitos de destino con el importador.",
  card3Cta: "Consultar documentación",
  faqHeading: "Control logístico y preguntas frecuentes de Oriente Medio",
  faqSubheading: "Puntos esenciales para preparar el despacho y la entrega.",
  formTitle: "Solicitud de cotización para Oriente Medio",
  formSub: "Envíe los datos de la carga para confirmar ruta y precio.",
  formLabelName: "Nombre",
  formLabelEmail: "Correo electrónico",
  formLabelPhone: "WhatsApp / Teléfono",
  formLabelGoods: "Mercancía / Peso / Volumen",
  formLabelDest: "Destino",
  formCta: "Calcular tarifa",
  formSuccess: "Gracias. Nuestro equipo revisará los datos y se pondrá en contacto.",
  chinaToMiddleEastSpecialist: "ESPECIALISTA CHINA–ORIENTE MEDIO",
  experienceBadge: "Coordinación desde China desde 1997",
  transitWindowTitle: "Tiempos estimados hacia Oriente Medio",
  seaDdpText: "Flete marítimo DDP",
  airDdpText: "Flete aéreo DDP",
  seaDaysText: "Rango habitual",
  airDaysText: "Rango habitual",
  transitIncludeText: "Añada margen por temporada alta, cambios de horario, congestión, inspecciones, festivos y desvíos.",
  compliantFilingText: "Revisión documental",
  professionalVerificationText: "Verificación profesional",
  saudiFocus: "Arabia Saudita",
  uaeFocus: "EAU",
  kuwaitFocus: "Kuwait",
  country_Saudi_Arabia: "Arabia Saudita",
  country_UAE: "EAU",
  country_Kuwait: "Kuwait",
  insightPortfolio: "Análisis logístico de Heaven Born",
};

PAGE_LANG_DATA.ar = {
  ...PAGE_LANG_DATA.en,
  seoTitle: "الشحن البحري والجوي من الصين إلى الشرق الأوسط | DDNZ Global",
  seoDesc: "الشحن من الصين إلى السعودية والإمارات والكويت وقطر وعُمان والبحرين مع تخطيط المستندات والجمارك.",
  heroHeadline: "شبكات شحن موثوقة من الصين إلى الشرق الأوسط",
  heroSubheadline: "تخطيط بحري وجوي مع مراجعة SABER ومستندات الاستيراد وتنسيق التسليم المحلي.",
  heroCta: "الحصول على تحليل مجاني للمسار",
  alertTag: "تحديث تشغيلي",
  alertTitle: "البحر الأحمر: التخطيط للتحويلات وازدحام الموانئ",
  alertContent: "قد تؤثر التحويلات والازدحامات على الجداول. نؤكد المساحة والمسار والمستندات والمدة الاحتياطية قبل الشحن.",
  matrixTitle: "جدول المدد التقديرية",
  matrixSubtitle: "نطاقات معتادة من مراكز الصين إلى الشرق الأوسط.",
  colTargetCountries: "بلد الوجهة",
  colAirFreight: "الشحن الجوي DDP",
  colOceanFcl: "الشحن البحري FCL DDP",
  colOceanLcl: "الشحن البحري LCL DDP",
  colPortToPort: "من ميناء إلى ميناء",
  colSolutions: "الحلول",
  matrixFootnote: "هذه نطاقات للتخطيط. أضف هامشاً لموسم الذروة وتغييرات الجداول والازدحام والتفتيش والعطلات والتحويلات.",
  cardsHeading: "دعم Heaven Born في الشرق الأوسط",
  cardsSubheading: "تنسيق التجميع والمستندات والنقل والتسليم.",
  card1Title: "تجميع مشتريات Alibaba و1688",
  card1Desc: "استلام وفحص وتجميع بضائع الموردين في مركزنا في قوانغتشو.",
  card1Cta: "الاستفسار عن التجميع",
  card2Title: "الفحص قبل الشحن",
  card2Desc: "فحص بصري وعدّ وتغليف وإشراف على التحميل حسب النطاق المتفق عليه.",
  card2Cta: "الاستفسار عن الفحص",
  card3Title: "دعم الجمارك وSABER",
  card3Desc: "تنسيق المستندات ورموز HS ومتطلبات الوجهة مع المستورد.",
  card3Cta: "الاستفسار عن المستندات",
  faqHeading: "التخليص والأسئلة الشائعة للشرق الأوسط",
  faqSubheading: "نقاط أساسية لإعداد التخليص والتسليم.",
  formTitle: "طلب عرض شحن إلى الشرق الأوسط",
  formSub: "أرسل بيانات البضائع لتأكيد المسار والسعر.",
  formLabelName: "الاسم",
  formLabelEmail: "البريد الإلكتروني",
  formLabelPhone: "واتساب / الهاتف",
  formLabelGoods: "البضائع / الوزن / الحجم",
  formLabelDest: "الوجهة",
  formCta: "حساب التعرفة",
  formSuccess: "شكراً. سيراجع فريقنا البيانات ويتواصل معك.",
  chinaToMiddleEastSpecialist: "متخصص الشحن بين الصين والشرق الأوسط",
  experienceBadge: "تنسيق من الصين منذ 1997",
  transitWindowTitle: "المدة التقديرية إلى الشرق الأوسط",
  seaDdpText: "الشحن البحري DDP",
  airDdpText: "الشحن الجوي DDP",
  seaDaysText: "النطاق المعتاد",
  airDaysText: "النطاق المعتاد",
  transitIncludeText: "أضف هامشاً لموسم الذروة وتغييرات الجداول والازدحام والتفتيش والعطلات والتحويلات.",
  compliantFilingText: "مراجعة المستندات",
  professionalVerificationText: "تحقق مهني",
  saudiFocus: "السعودية",
  uaeFocus: "الإمارات",
  kuwaitFocus: "الكويت",
  country_Saudi_Arabia: "السعودية",
  country_UAE: "الإمارات",
  country_Kuwait: "الكويت",
  insightPortfolio: "تحليلات Heaven Born اللوجستية",
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

const middleEastMatrixCountries = {
  es: ['Arabia Saudita', 'EAU', 'Kuwait'],
  ar: ['السعودية', 'الإمارات', 'الكويت'],
} as const;

MATRIX_ROWS.forEach((row, index) => {
  Object.assign(row.country, {
    es: middleEastMatrixCountries.es[index],
    ar: middleEastMatrixCountries.ar[index],
  });
  Object.assign(row.air, { es: row.air.en.replace('Days', 'días'), ar: row.air.en.replace('Days', 'يوماً') });
  Object.assign(row.fcl, { es: row.fcl.en.replace('Days', 'días'), ar: row.fcl.en.replace('Days', 'يوماً') });
  Object.assign(row.lcl, { es: row.lcl.en.replace('Days', 'días'), ar: row.lcl.en.replace('Days', 'يوماً') });
  Object.assign(row.portToPort, { es: row.portToPort.en.replace('Days', 'días'), ar: row.portToPort.en.replace('Days', 'يوماً') });
  Object.assign(row.solutions, {
    es: 'Planificación de ruta, documentos y entrega',
    ar: 'تخطيط المسار والمستندات والتسليم',
  });
});

const COUNTRY_CONTENT: Record<
  string,
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
      subheadline: "China-to-Saudi sea and air freight with 25–32 day ocean and 5–12 day air planning windows, plus SABER document pre-review and destination clearance coordination.",
      card3Title: "SABER Compliance & Customs Clearance",
      card3Desc: "SABER document pre-review, HS-code checks and destination clearance coordination for qualifying commercial shipments; brand, DG and regulated cargo are reviewed before booking.",
      faqs: [
        {
          id: "sa-1",
          title: "Express courier vs commercial customs clearance",
          desc: "Branded, high-value or commercial-volume cargo should be reviewed for importer, document and carrier-acceptance requirements before booking instead of assuming a standard courier route will apply."
        },
        {
          id: "sa-2",
          title: "Country-of-origin marking and labels",
          desc: "Confirm the applicable country-of-origin marking, product labels, manuals and packing information with the importer before shipment. Regulated products may require additional documentation."
        },
        {
          id: "sa-3",
          title: "Saudi SABER document preparation",
          desc: "SABER requirements depend on the product and current conformity route. Confirm the HS code, product scope and required documents before cargo handover."
        }
      ]
    },
    zh: {
      headline: "安全、合规、稳健的中国到沙特阿拉伯海运/空运双清门到门专线",
      subheadline: "中国至沙特海运 DDP 常规 25–32 天、空运 5–12 天；提供 SABER 文件预审、HS 编码核对与目的地清关衔接。",
      card3Title: "沙特 SABER 合规申报与代办",
      card3Desc: "面向符合条件的商业普货，提供 SABER 文件预审、HS 编码核对与目的地清关衔接；品牌货、危险品及受监管产品先做资料预审。",
      faqs: [
        {
          id: "sa-1",
          title: "商业快递清关与大宗商业双清清关的红线对比",
          desc: "高价值货、品牌货和大宗货建议采用商业清关路径。订舱前完成进口商、文件和承运条件预审，可减少到港补件与临时改方案的风险。"
        },
        {
          id: "sa-2",
          title: "外箱及产品雕刻‘Made in China’原产地硬性要求",
          desc: "我们会在出运前核对适用的原产地标记、标签、说明书与包装资料；受监管产品按进口规则补充对应文件。"
        },
        {
          id: "sa-3",
          title: "海运及空运直航吉达/利雅得时效锁定",
          desc: "海运 DDP 常规计划 25–32 天，空运 5–12 天。斋月、旺季、查验或航线调整可能延长，因此我们会在报价前同步确认可用班期与服务范围。"
        }
      ]
    },
    ru: {
      headline: "Надежная доставка грузов из Китая в Саудовскую Аравию",
      subheadline: "Плановый срок морского DDP — 25–32 дня, авиационного — 5–12 дней; предварительная проверка документов SABER и координация оформления в пункте назначения.",
      card3Title: "Таможенный комплаенс SABER",
      card3Desc: "Предварительная проверка документов SABER и кодов ТН ВЭД, а также координация оформления для подходящих коммерческих отправок.",
      faqs: [
        {
          id: "sa-1",
          title: "Экспресс-доставка против коммерческого оформления",
          desc: "Отправка брендовых товаров курьерскими службами без заранее согласованного брокерского оформления может привести к возврату. Heaven Born помогает проверить подходящую схему коммерческого оформления."
        },
        {
          id: "sa-2",
          title: "Обязательная маркировка (MADE IN CHINA)",
          desc: "Все импортируемые в Саудовскую Аравию товары должны иметь четкую и нестираемую маркировку страны происхождения."
        },
        {
          id: "sa-3",
          title: "Регистрация в системе SABER",
          desc: "Для многих категорий товаров требуется оформление сертификатов SABER. Heaven Born помогает проверить требования и координировать подготовку документов."
        }
      ]
    },
    fr: {
      headline: "Réseaux logistiques de Chine vers l'Arabie Saoudite",
      subheadline: "Fenêtre de planification de 25–32 jours par mer et 5–12 jours par air, avec pré-vérification SABER et coordination du dédouanement à destination.",
      card3Title: "Douanes et certification SABER",
      card3Desc: "Pré-vérification des documents SABER et des codes HS, avec coordination du dédouanement pour les expéditions commerciales éligibles.",
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
      subheadline: "China-to-Dubai/Jebel Ali sea and air planning with 18–24 day ocean and 4–8 day air windows, plus free-zone and destination delivery coordination.",
      card3Title: "Dubai Free Zone & Last Mile Logistics",
      card3Desc: "Jebel Ali free-zone delivery, local warehousing coordination and destination trucking options for qualifying commercial shipments.",
      faqs: [
        {
          id: "ae-1",
          title: "Dubai Free Trade Hubs & Customs Clearance",
          desc: "Dubai clearance and free-zone handling depend on the product, importer, document set and destination procedure. Confirm the current requirements and delivery scope before booking."
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
      subheadline: "中国至迪拜/杰贝阿里海运常规 18–24 天、空运 4–8 天，覆盖自贸区入仓、仓储衔接与目的地派送规划。",
      card3Title: "迪拜自贸区与最后一公里派送",
      card3Desc: "依托中国端自营集货能力，提供 JAFZA 入仓衔接、仓储履约与目的地派送方案；新能源、品牌货和受监管产品先做资料预审。",
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
          desc: "大货进口可根据货物与目的地条件评估 Heaven Born 的海空 DDP 服务范围，并提前确认可能涉及的机场、清关与仓储费用。"
        }
      ]
    },
    ru: {
      headline: "Специализированная доставка из Китая в ОАЭ (Дубай/Джебель-Али)",
      subheadline: "Плановый срок морской доставки — 18–24 дня, авиационной — 4–8 дней; координация свободной зоны, склада и местной доставки.",
      card3Title: "Доставка в СЭЗ Дубая и дистрибуция",
      card3Desc: "Ввод в свободную зону Джебель-Али, складская координация и варианты местной доставки для подходящих коммерческих отправок.",
      faqs: [
        {
          id: "ae-1",
          title: "Преимущества таможни Дубая и электронная коммерция",
          desc: "Сроки оформления и работы в свободной зоне Дубая зависят от товара, импортёра, документов и процедуры назначения. Подтвердите требования и объём услуг до бронирования."
        },
        {
          id: "ae-2",
          title: "Маркировка страны происхождения",
          desc: "Таможня ОАЭ требует обязательного наличия маркировки страны происхождения на каждой коробке. Рекомендуется паллетирование для сохранности грузов."
        },
        {
          id: "ae-3",
          title: "Собственные каналы DDP без посредников",
          desc: "Heaven Born уточняет известные аэропортовые и терминальные расходы в соответствии с подтвержденным маршрутом и объемом услуг."
        }
      ]
    },
    fr: {
      headline: "Fret et logistique de Chine vers les EAU (Dubaï/Jebel Ali)",
      subheadline: "Fenêtre de planification de 18–24 jours par mer et 4–8 jours par air, avec coordination zone franche, entrepôt et livraison locale.",
      card3Title: "Logistique Zone Franche de Dubaï",
      card3Desc: "Entrée en zone franche Jebel Ali, coordination d’entreposage et options de livraison locale pour les expéditions commerciales éligibles.",
      faqs: [
        {
          id: "ae-1",
          title: "Plaques tournantes du commerce libre à Dubaï et dédouanement",
          desc: "Le dédouanement et les opérations en zone franche à Dubaï dépendent du produit, de l’importateur, des documents et de la procédure de destination. Confirmez les exigences et le périmètre avant réservation."
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
      headline: "Freight Forwarding from China to Kuwait | KUCAS & Customs Documentation Support",
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
          desc: "Inspection, labeling, voltage and plug requirements depend on the product and applicable Kuwaiti technical rules. Confirm the current requirements with the importer before shipment."
        },
        {
          id: "kw-3",
          title: "Permanent Origin & Wood Fumigation",
          desc: "Confirm country-of-origin marking and wood-packing requirements for the product, carrier and destination procedure before shipment."
        }
      ]
    },
    zh: {
      headline: "中国至科威特海运与空运：KUCAS 文件支持与目的地交付协调",
      subheadline: "海运常规计划 28–35 天、空运 6–12 天；针对受管制货物提供 KUCAS/TABEK 文件核对，并协调目的地清关与派送。",
      card3Title: "科威特 KUCAS 认证与末端派送",
      card3Desc: "为符合条件的商业货物核对 KUCAS/TABEK 文件、协调目的地清关及当地派送选项。",
      faqs: [
        {
          id: "kw-1",
          title: "科威特 KUCAS 认证与清关合规要求",
          desc: "科威特对受管制进口产品实施 KUCAS 合规流程。是否需要 TER、TIR 或其他文件，应按货物类别、HS 编码及最新要求在订舱前确认。"
        },
        {
          id: "kw-2",
          title: "产品标签与检验要求核对",
          desc: "电子、电器及其他受管制产品的标签、规格、检验或测试要求会随产品而异。请在出货前按适用规范核对，而非按单一通用标准判断。"
        },
        {
          id: "kw-3",
          title: "原产地标识与木质包装",
          desc: "根据货物和包装情况核对原产地标识及木质包装文件。木质包装通常需要符合目的地检疫和承运要求，具体以适用规定为准。"
        }
      ]
    },
    ru: {
      headline: "Доставка из Китая в Кувейт | Поддержка по документам KUCAS",
      subheadline: "Плановый срок морской доставки — 28–35 дней, авиационной — 6–12 дней; проверка документов KUCAS/TABEK и координация доставки в пункте назначения.",
      card3Title: "Соответствие KUCAS и доставка до двери",
      card3Desc: "Проверка документов KUCAS/TABEK, координация оформления и варианты локальной доставки для подходящих коммерческих отправок.",
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
      subheadline: "Planification habituelle de 28–35 jours par mer et 6–12 jours par air, avec vérification documentaire KUCAS/TABEK et coordination du dédouanement à destination.",
      card3Title: "Conformité KUCAS et logistique du dernier kilomètre",
      card3Desc: "Vérification des documents KUCAS/TABEK, coordination du dédouanement et options de livraison locale pour les expéditions commerciales admissibles.",
      faqs: [
        {
          id: "kw-1",
          title: "Certification KUCAS et dédouanement",
          desc: "Les produits soumis au contrôle d’importation au Koweït peuvent relever du processus KUCAS. La nécessité d’un TER, d’un TIR ou d’autres documents doit être confirmée avant réservation selon le produit, le code HS et les exigences en vigueur."
        },
        {
          id: "kw-2",
          title: "Vérification des étiquettes et des exigences d’inspection",
          desc: "Les exigences d’étiquetage, de spécification et de test des produits électriques ou réglementés varient selon la catégorie. Elles doivent être vérifiées par rapport à la norme applicable avant expédition."
        },
        {
          id: "kw-3",
          title: "Marquage d’origine et emballage en bois",
          desc: "Vérifiez le marquage d’origine et les documents liés à l’emballage en bois selon la marchandise et l’emballage utilisés. Les emballages en bois doivent généralement satisfaire aux exigences sanitaires et du transporteur applicables."
        }
      ]
    }
  }
};

COUNTRY_CONTENT['Saudi-Arabia'].es = {
  headline: 'Envíos de China a Arabia Saudí con planificación DDP',
  subheadline: 'Planificación habitual de 25–32 días por mar y 5–12 días por aire, con pre-revisión de documentos SABER y coordinación de despacho en destino.',
  card3Title: 'SABER y coordinación de despacho',
  card3Desc: 'Pre-revisamos documentación SABER y códigos HS, y coordinamos el despacho en destino para envíos comerciales que cumplan las condiciones aplicables.',
  faqs: [
    { id: 'sa-es-1', title: 'Carga comercial y despacho', desc: 'Para carga de marca, alto valor o gran volumen, revisamos antes de reservar al importador, documentos y condiciones de aceptación del transportista.' },
    { id: 'sa-es-2', title: 'Etiquetas y documentos', desc: 'Revisamos marcado de origen, etiquetas, manuales y embalaje aplicables antes de la salida.' },
    { id: 'sa-es-3', title: 'Plazos de planificación', desc: 'El DDP marítimo suele planificarse en 25–32 días y el aéreo en 5–12 días; temporada alta, inspecciones y cambios de ruta pueden ampliar el plazo.' }
  ]
};
COUNTRY_CONTENT['Saudi-Arabia'].ar = {
  headline: 'الشحن من الصين إلى السعودية مع تخطيط DDP',
  subheadline: 'تخطيط بحري معتاد خلال 25–32 يوماً وجوي خلال 5–12 يوماً، مع مراجعة مستندات SABER وتنسيق التخليص في الوجهة.',
  card3Title: 'SABER وتنسيق التخليص',
  card3Desc: 'نراجع مستندات SABER ورموز HS وننسق التخليص في الوجهة للشحنات التجارية المؤهلة.',
  faqs: [
    { id: 'sa-ar-1', title: 'الشحن التجاري والتخليص', desc: 'للبضائع ذات العلامات التجارية أو القيمة العالية أو الأحجام الكبيرة، نراجع المستورد والمستندات وشروط قبول الناقل قبل الحجز.' },
    { id: 'sa-ar-2', title: 'الملصقات والمستندات', desc: 'نراجع متطلبات بلد المنشأ والملصقات والكتيبات والتعبئة قبل المغادرة.' },
    { id: 'sa-ar-3', title: 'أوقات التخطيط', desc: 'التخطيط البحري DDP عادة 25–32 يوماً والجوي 5–12 يوماً؛ وقد تمدد المواسم والفحص وتغيرات المسار المدة.' }
  ]
};
COUNTRY_CONTENT.UAE.es = {
  headline: 'Envíos de China a Dubái y Jebel Ali',
  subheadline: 'Planificación marítima habitual de 18–24 días y aérea de 4–8 días, con coordinación para zona franca, almacén y entrega local.',
  card3Title: 'Zona franca y entrega local en Dubái',
  card3Desc: 'Coordinamos la entrada en JAFZA, opciones de almacenamiento y entrega final para envíos comerciales elegibles.',
  faqs: [
    { id: 'ae-es-1', title: 'Zona franca y despacho', desc: 'Los requisitos de zona franca y despacho dependen del producto, importador y documentos. Confirmamos el alcance antes de reservar.' },
    { id: 'ae-es-2', title: 'Marcado y embalaje', desc: 'Revisamos los requisitos aplicables de origen, etiquetado, paletización y embalaje antes de la salida.' },
    { id: 'ae-es-3', title: 'Planificación de entrega', desc: 'La planificación marítima habitual es de 18–24 días y la aérea de 4–8 días; se añade margen para temporada alta y operaciones de destino.' }
  ]
};
COUNTRY_CONTENT.UAE.ar = {
  headline: 'الشحن من الصين إلى دبي وجبل علي',
  subheadline: 'تخطيط بحري معتاد خلال 18–24 يوماً وجوي خلال 4–8 أيام، مع تنسيق المنطقة الحرة والتخزين والتسليم المحلي.',
  card3Title: 'المنطقة الحرة والتسليم المحلي في دبي',
  card3Desc: 'ننسق دخول JAFZA وخيارات التخزين والتسليم النهائي للشحنات التجارية المؤهلة.',
  faqs: [
    { id: 'ae-ar-1', title: 'المنطقة الحرة والتخليص', desc: 'تعتمد المتطلبات على المنتج والمستورد والمستندات. نؤكد نطاق الخدمة قبل الحجز.' },
    { id: 'ae-ar-2', title: 'المنشأ والتعبئة', desc: 'نراجع متطلبات بلد المنشأ والملصقات والطبليات والتعبئة قبل المغادرة.' },
    { id: 'ae-ar-3', title: 'تخطيط التسليم', desc: 'التخطيط البحري المعتاد 18–24 يوماً والجوي 4–8 أيام، مع هامش للمواسم وعمليات الوجهة.' }
  ]
};
COUNTRY_CONTENT.Kuwait.es = {
  headline: 'Envíos de China a Kuwait con revisión KUCAS/TABEK',
  subheadline: 'Planificación marítima habitual de 28–35 días y aérea de 6–12 días, con revisión documental y coordinación de entrega en destino.',
  card3Title: 'Documentos KUCAS/TABEK y entrega local',
  card3Desc: 'Revisamos documentos, requisitos del producto y alcance de despacho antes de reservar para cargas comerciales elegibles.',
  faqs: [
    { id: 'kw-es-1', title: 'Productos regulados', desc: 'La aplicación de KUCAS/TABEK depende del producto y de la norma vigente; confirmamos la documentación antes del envío.' },
    { id: 'kw-es-2', title: 'Etiquetado y embalaje', desc: 'Los requisitos de inspección, etiquetado, voltaje, enchufe y embalaje dependen del producto y deben confirmarse con el importador.' },
    { id: 'kw-es-3', title: 'Planificación del tránsito', desc: 'El tránsito marítimo habitual es de 28–35 días y el aéreo de 6–12 días; reserve margen para inspección, festivos y entrega local.' }
  ]
};
COUNTRY_CONTENT.Kuwait.ar = {
  headline: 'الشحن من الصين إلى الكويت مع مراجعة KUCAS/TABEK',
  subheadline: 'تخطيط بحري معتاد خلال 28–35 يوماً وجوي خلال 6–12 يوماً، مع مراجعة المستندات وتنسيق التسليم في الوجهة.',
  card3Title: 'مستندات KUCAS/TABEK والتسليم المحلي',
  card3Desc: 'نراجع المستندات ومتطلبات المنتج ونطاق التخليص قبل الحجز للشحنات التجارية المؤهلة.',
  faqs: [
    { id: 'kw-ar-1', title: 'المنتجات الخاضعة للرقابة', desc: 'يعتمد تطبيق KUCAS/TABEK على المنتج والقاعدة الحالية؛ نؤكد المستندات قبل الشحن.' },
    { id: 'kw-ar-2', title: 'الوسم والتعبئة', desc: 'تعتمد متطلبات الفحص والملصقات والجهد الكهربائي والقابس والتعبئة على المنتج ويجب تأكيدها مع المستورد.' },
    { id: 'kw-ar-3', title: 'تخطيط العبور', desc: 'التخطيط البحري المعتاد 28–35 يوماً والجوي 6–12 يوماً؛ خصص وقتاً للفحص والعطلات والتسليم المحلي.' }
  ]
};

const createGccCountryContent = (
  name: string,
  nameZh: string,
  nameAr: string,
  nameEs: string,
  nameFr: string,
  nameRu: string,
) => ({
  en: {
    headline: `Shipping from China to ${name} | Freight and Document Planning`,
    subheadline: `Plan sea and air freight from China to ${name} around cargo information, import-document requirements, and destination-side operating scope.`,
    card3Title: `${name} Import-Document and Destination Coordination`,
    card3Desc: 'Review product information, commercial documents, and the confirmed destination service scope before the shipment moves.',
    faqs: [
      { id: 'gcc-1', title: `What should be reviewed before shipping to ${name}?`, desc: 'Review consignee information, product descriptions, quantities, values, and any product-specific requirements with the importer before dispatch.' },
      { id: 'gcc-2', title: 'How should destination clearance be planned?', desc: 'Confirm the current importer, document, and destination-handling requirements with qualified local advisers before booking.' },
      { id: 'gcc-3', title: 'Can DDP service be arranged?', desc: 'DDP availability depends on the product, importer, and destination conditions. Confirm the written scope, taxes, and exclusions before booking.' }
    ]
  },
  zh: {
    headline: `中国到${nameZh}海运与空运：文件与目的地操作协调支持`,
    subheadline: `提供中国始发至${nameZh}的海运、空运与集货规划，并在确认的服务范围内协调货物资料、进口文件与目的地操作。`,
    card3Title: `${nameZh}进口文件与目的地操作协调`,
    card3Desc: '请在出运前核对产品资料、商业文件和已确认的目的地服务范围。',
    faqs: [
      { id: 'gcc-1', title: `发往${nameZh}前应核对哪些信息？`, desc: '建议与进口商在出运前核对收货人资料、品名、数量、货值及可能适用的产品要求。' },
      { id: 'gcc-2', title: '如何规划目的地清关？', desc: '请在订舱前由进口商和目的地合格专业机构确认当前进口、文件和目的港操作要求。' },
      { id: 'gcc-3', title: '是否可以安排 DDP？', desc: 'DDP 是否可行取决于产品、进口商和目的地条件；请在订舱前书面确认服务范围、税费和除外事项。' }
    ]
  },
  ar: {
    headline: `الشحن من الصين إلى ${nameAr} | تخطيط الشحن والمستندات`,
    subheadline: `تخطيط الشحن البحري والجوي من الصين إلى ${nameAr} وفقاً لبيانات البضائع ومتطلبات الاستيراد ونطاق العمليات في الوجهة.`,
    card3Title: `تنسيق مستندات الاستيراد والوجهة في ${nameAr}`,
    card3Desc: 'راجع معلومات المنتج والمستندات التجارية ونطاق الخدمة المؤكد في الوجهة قبل الشحن.',
    faqs: [
      { id: 'gcc-1', title: `ما الذي يجب مراجعته قبل الشحن إلى ${nameAr}؟`, desc: 'راجع بيانات المستلم ووصف المنتجات والكميات والقيم وأي متطلبات خاصة بالمنتج مع المستورد قبل الإرسال.' },
      { id: 'gcc-2', title: 'كيف يتم التخطيط للتخليص في الوجهة؟', desc: 'أكد متطلبات المستورد والمستندات وعمليات الوجهة الحالية مع جهات محلية مؤهلة قبل الحجز.' },
      { id: 'gcc-3', title: 'هل يمكن ترتيب خدمة DDP؟', desc: 'تعتمد إمكانية DDP على المنتج والمستورد وظروف الوجهة. أكد النطاق والضرائب والاستثناءات كتابياً قبل الحجز.' }
    ]
  },
  es: {
    headline: `Envíos desde China a ${nameEs} | Planificación de carga y documentos`,
    subheadline: `Planificación marítima y aérea desde China a ${nameEs} según los datos de la carga, requisitos de importación y alcance operativo en destino.`,
    card3Title: `Coordinación de documentos y destino en ${nameEs}`,
    card3Desc: 'Revise la información del producto, los documentos comerciales y el alcance confirmado en destino antes del embarque.',
    faqs: [
      { id: 'gcc-1', title: `¿Qué debe revisarse antes de enviar a ${nameEs}?`, desc: 'Revise consignatario, descripción, cantidades, valores y requisitos específicos con el importador antes del envío.' },
      { id: 'gcc-2', title: '¿Cómo debe planificarse el despacho en destino?', desc: 'Confirme los requisitos actuales del importador, documentos y manejo en destino antes de reservar.' },
      { id: 'gcc-3', title: '¿Puede organizarse un servicio DDP?', desc: 'La disponibilidad depende del producto, el importador y las condiciones de destino. Confirme alcance, impuestos y exclusiones por escrito.' }
    ]
  },
  fr: {
    headline: `Fret maritime et aérien de Chine vers ${nameFr}`,
    subheadline: `Planification du fret depuis la Chine vers ${nameFr} selon les données de la marchandise, les documents d’importation et le périmètre opérationnel à destination.`,
    card3Title: `Coordination des documents et de la destination en ${nameFr}`,
    card3Desc: 'Vérifiez les informations produit, les documents commerciaux et le périmètre confirmé à destination avant l’expédition.',
    faqs: [
      { id: 'gcc-fr-1', title: `Que faut-il vérifier avant une expédition vers ${nameFr} ?`, desc: 'Vérifiez le destinataire, la description, les quantités, les valeurs et les exigences produit avec l’importateur avant l’envoi.' },
      { id: 'gcc-fr-2', title: 'Comment planifier le dédouanement à destination ?', desc: 'Confirmez les exigences actuelles de l’importateur, des documents et des opérations locales avant la réservation.' },
      { id: 'gcc-fr-3', title: 'Un service DDP peut-il être organisé ?', desc: 'La disponibilité dépend du produit, de l’importateur et des conditions locales. Confirmez par écrit le périmètre, les taxes et les exclusions.' }
    ]
  },
  ru: {
    headline: `Доставка грузов из Китая в ${nameRu}`,
    subheadline: `Планирование морской и авиационной перевозки из Китая в ${nameRu} с учетом данных о грузе, импортных документов и согласованного объема услуг в пункте назначения.`,
    card3Title: `Координация документов и операций в пункте назначения`,
    card3Desc: 'До отправки проверьте сведения о товаре, коммерческие документы и согласованный объем услуг в пункте назначения.',
    faqs: [
      { id: 'gcc-ru-1', title: `Что проверить перед отправкой в ${nameRu}?`, desc: 'Сверьте данные получателя, описание, количество, стоимость и требования к товару с импортером до отправки.' },
      { id: 'gcc-ru-2', title: 'Как планировать оформление в пункте назначения?', desc: 'До бронирования подтвердите актуальные требования к импортеру, документам и местным операциям.' },
      { id: 'gcc-ru-3', title: 'Можно ли организовать услугу DDP?', desc: 'Доступность зависит от товара, импортера и местных условий. Письменно согласуйте объем услуг, налоги и исключения.' }
    ]
  }
});

COUNTRY_CONTENT.Qatar = createGccCountryContent('Qatar', '卡塔尔', 'قطر', 'Qatar', 'Qatar', 'Катар');
COUNTRY_CONTENT.Oman = createGccCountryContent('Oman', '阿曼', 'عُمان', 'Omán', 'Oman', 'Оман');
COUNTRY_CONTENT.Bahrain = createGccCountryContent('Bahrain', '巴林', 'البحرين', 'Baréin', 'Bahreïn', 'Бахрейн');

const createGccSpec = (
  name: string,
  nameZh: string,
  nameAr: string,
  nameEs: string,
  nameFr: string,
  nameRu: string,
) => ({
  en: {
    specTitle: `${name} Shipment Planning Checklist`, specSub: 'Confirm product information, commercial documents, and destination requirements before booking.',
    tab1Title: 'Product and document review', tab1Header: 'Pre-shipment information review', tab1Desc: 'Review product descriptions, quantities, values, importer information, and any applicable product documents before cargo is released.',
    tab2Title: 'Destination service scope', tab2Header: 'Clearance and delivery coordination', tab2Desc: 'Confirm the agreed clearance, tax, delivery, and unloading responsibilities before booking.',
    redlinesTitle: 'Pre-shipment planning checks', redlines: [
      { id: '01', title: 'Document consistency', desc: 'Keep product, quantity, consignee, and value information consistent across commercial and transport documents.' },
      { id: '02', title: 'Product requirements', desc: 'Confirm any applicable permits, certificates, or destination product requirements with the importer before dispatch.' },
      { id: '03', title: 'Delivery scope', desc: 'Confirm the destination handling, clearance, delivery, and unloading scope in writing.' }
    ],
    guideTitle: `${name} route-planning notes`, guideSub: 'Practical checks for cargo, documents, and destination operations.', guideCards: [
      { title: 'Before booking', desc: 'Confirm cargo readiness, carrier acceptance, and the document set.' },
      { title: 'Before departure', desc: 'Review final commercial documents with the importer and destination party.' },
      { title: 'At destination', desc: 'Confirm the local handling and delivery plan against the agreed service scope.' }
    ]
  },
  zh: {
    specTitle: `${nameZh}出运前操作核对清单`, specSub: '请在订舱前确认产品资料、商业文件和目的地要求。',
    tab1Title: '产品与文件核对', tab1Header: '起运前资料核对', tab1Desc: '在货物放行前核对品名、数量、货值、进口商资料及可能适用的产品文件。',
    tab2Title: '目的地服务范围', tab2Header: '清关与派送协调', tab2Desc: '请在订舱前确认已约定的清关、税费、派送及卸货责任。',
    redlinesTitle: '出运前关键核对项', redlines: [
      { id: '01', title: '文件一致性', desc: '确保商业和运输文件中的品名、数量、收货人和货值信息一致。' },
      { id: '02', title: '产品要求', desc: '请在起运前与进口商确认可能适用的许可、证书或目的地产品要求。' },
      { id: '03', title: '派送范围', desc: '请书面确认目的地操作、清关、派送和卸货范围。' }
    ],
    guideTitle: `${nameZh}路线规划说明`, guideSub: '围绕货物、文件和目的地操作的实用核对。', guideCards: [
      { title: '订舱前', desc: '确认货物准备情况、承运条件和文件清单。' },
      { title: '起运前', desc: '与进口商和目的地合作方核对最终商业文件。' },
      { title: '到港后', desc: '根据约定服务范围确认当地操作和派送计划。' }
    ]
  },
  ar: {
    specTitle: `قائمة التحقق قبل الشحن إلى ${nameAr}`, specSub: 'أكد معلومات المنتج والمستندات التجارية ومتطلبات الوجهة قبل الحجز.',
    tab1Title: 'مراجعة المنتج والمستندات', tab1Header: 'مراجعة المعلومات قبل الشحن', tab1Desc: 'راجع وصف المنتج والكميات والقيم ومعلومات المستورد وأي مستندات مطلوبة قبل إطلاق البضائع.',
    tab2Title: 'نطاق الخدمة في الوجهة', tab2Header: 'تنسيق التخليص والتسليم', tab2Desc: 'أكد مسؤوليات التخليص والضرائب والتسليم والتفريغ قبل الحجز.',
    redlinesTitle: 'فحوصات التخطيط قبل الشحن', redlines: [
      { id: '01', title: 'اتساق المستندات', desc: 'حافظ على اتساق معلومات المنتج والكمية والمستلم والقيمة عبر المستندات التجارية والنقل.' },
      { id: '02', title: 'متطلبات المنتج', desc: 'أكد أي تصاريح أو شهادات أو متطلبات للمنتج في الوجهة مع المستورد قبل الإرسال.' },
      { id: '03', title: 'نطاق التسليم', desc: 'أكد كتابةً نطاق العمليات والتخليص والتسليم والتفريغ في الوجهة.' }
    ],
    guideTitle: `ملاحظات تخطيط المسار إلى ${nameAr}`, guideSub: 'فحوصات عملية للبضائع والمستندات وعمليات الوجهة.', guideCards: [
      { title: 'قبل الحجز', desc: 'أكد جاهزية البضائع وقبول الناقل ومجموعة المستندات.' },
      { title: 'قبل المغادرة', desc: 'راجع المستندات التجارية النهائية مع المستورد والجهة في الوجهة.' },
      { title: 'في الوجهة', desc: 'أكد خطة العمليات والتسليم المحلية وفق نطاق الخدمة المتفق عليه.' }
    ]
  },
  es: {
    specTitle: `Lista de control para envíos a ${nameEs}`, specSub: 'Confirme información del producto, documentos comerciales y requisitos de destino antes de reservar.',
    tab1Title: 'Revisión de producto y documentos', tab1Header: 'Revisión previa al embarque', tab1Desc: 'Revise descripción, cantidades, valores, datos del importador y documentos aplicables antes de liberar la carga.',
    tab2Title: 'Alcance del servicio en destino', tab2Header: 'Coordinación de despacho y entrega', tab2Desc: 'Confirme responsabilidades de despacho, impuestos, entrega y descarga antes de reservar.',
    redlinesTitle: 'Revisiones previas al embarque', redlines: [
      { id: '01', title: 'Coherencia documental', desc: 'Mantenga coherentes producto, cantidad, consignatario y valor en documentos comerciales y de transporte.' },
      { id: '02', title: 'Requisitos del producto', desc: 'Confirme permisos, certificados o requisitos de destino con el importador antes del envío.' },
      { id: '03', title: 'Alcance de entrega', desc: 'Confirme por escrito manejo, despacho, entrega y descarga en destino.' }
    ],
    guideTitle: `Notas de planificación de ruta a ${nameEs}`, guideSub: 'Revisiones prácticas de carga, documentos y operaciones en destino.', guideCards: [
      { title: 'Antes de reservar', desc: 'Confirme preparación de la carga, aceptación del transportista y documentos.' },
      { title: 'Antes de la salida', desc: 'Revise los documentos comerciales finales con el importador.' },
      { title: 'En destino', desc: 'Confirme manejo y entrega local según el alcance acordado.' }
    ]
  },
  fr: {
    specTitle: `Liste de contrôle avant expédition vers ${nameFr}`, specSub: 'Confirmez les informations produit, les documents commerciaux et les exigences de destination avant la réservation.',
    tab1Title: 'Vérification du produit et des documents', tab1Header: 'Revue des informations avant expédition', tab1Desc: 'Vérifiez la description, les quantités, les valeurs, les données de l’importateur et les documents applicables avant la remise de la marchandise.',
    tab2Title: 'Périmètre du service à destination', tab2Header: 'Coordination du dédouanement et de la livraison', tab2Desc: 'Confirmez les responsabilités relatives au dédouanement, aux taxes, à la livraison et au déchargement avant la réservation.',
    redlinesTitle: 'Contrôles essentiels avant expédition', redlines: [
      { id: '01', title: 'Cohérence documentaire', desc: 'Gardez cohérentes les données produit, quantité, destinataire et valeur dans les documents commerciaux et de transport.' },
      { id: '02', title: 'Exigences produit', desc: 'Confirmez avec l’importateur les permis, certificats ou exigences produit applicables avant l’envoi.' },
      { id: '03', title: 'Périmètre de livraison', desc: 'Confirmez par écrit les opérations, le dédouanement, la livraison et le déchargement à destination.' }
    ],
    guideTitle: `Notes de planification de route vers ${nameFr}`, guideSub: 'Contrôles pratiques pour la marchandise, les documents et les opérations à destination.', guideCards: [
      { title: 'Avant la réservation', desc: 'Confirmez la disponibilité de la marchandise, l’acceptation du transporteur et les documents.' },
      { title: 'Avant le départ', desc: 'Vérifiez les documents commerciaux définitifs avec l’importateur.' },
      { title: 'À destination', desc: 'Confirmez les opérations locales et la livraison selon le périmètre convenu.' }
    ]
  },
  ru: {
    specTitle: `Контрольный список для отправки в ${nameRu}`, specSub: 'До бронирования подтвердите сведения о товаре, коммерческие документы и требования пункта назначения.',
    tab1Title: 'Проверка товара и документов', tab1Header: 'Проверка информации до отправки', tab1Desc: 'До передачи груза проверьте описание, количество, стоимость, данные импортера и применимые документы.',
    tab2Title: 'Объем услуг в пункте назначения', tab2Header: 'Координация оформления и доставки', tab2Desc: 'До бронирования согласуйте ответственность за оформление, налоги, доставку и разгрузку.',
    redlinesTitle: 'Ключевые проверки до отправки', redlines: [
      { id: '01', title: 'Согласованность документов', desc: 'Сведения о товаре, количестве, получателе и стоимости должны совпадать в коммерческих и транспортных документах.' },
      { id: '02', title: 'Требования к товару', desc: 'До отправки подтвердите с импортером применимые разрешения, сертификаты и требования пункта назначения.' },
      { id: '03', title: 'Объем доставки', desc: 'Письменно согласуйте местные операции, оформление, доставку и разгрузку.' }
    ],
    guideTitle: `Примечания по маршруту в ${nameRu}`, guideSub: 'Практические проверки груза, документов и операций в пункте назначения.', guideCards: [
      { title: 'До бронирования', desc: 'Подтвердите готовность груза, приемку перевозчиком и комплект документов.' },
      { title: 'До отправления', desc: 'Сверьте окончательные коммерческие документы с импортером.' },
      { title: 'В пункте назначения', desc: 'Подтвердите местные операции и доставку в рамках согласованной услуги.' }
    ]
  }
});

const GCC_SPEC_DATA: Record<string, Record<string, any>> = {
  Qatar: createGccSpec('Qatar', '卡塔尔', 'قطر', 'Qatar', 'Qatar', 'Катар'),
  Oman: createGccSpec('Oman', '阿曼', 'عُمان', 'Omán', 'Oman', 'Оман'),
  Bahrain: createGccSpec('Bahrain', '巴林', 'البحرين', 'Baréin', 'Bahreïn', 'Бахрейн')
};

PAGE_LANG_DATA.ar = {
  ...PAGE_LANG_DATA.en,
  seoTitle: 'الشحن من الصين إلى الشرق الأوسط | DDNZ Global',
  seoDesc: 'شحن بحري وجوي من الصين إلى السعودية والإمارات والكويت مع دعم التخليص والامتثال.',
  heroHeadline: 'شبكات شحن موثوقة من الصين إلى مراكز الشرق الأوسط',
  heroSubheadline: 'مسارات محسنة وشحن من الباب إلى الباب للتجار والمستوردين، مع رؤية واضحة للتكلفة والامتثال.',
  heroCta: 'احصل على تحليل مجاني للمسار والتعرفة',
  alertTag: 'تحديث تشغيلي', alertTitle: 'تغيرات البحر الأحمر: من مخاطر البحر إلى اختناقات الموانئ',
  alertContent: 'مع إعادة توجيه السفن عبر رأس الرجاء الصالح، قد تطول الرحلات وتزداد ضغوط موانئ الوجهة. تساعد شبكتنا المحلية وخيارات البحر والبر على تأمين مسارات مرنة ومساحة مستقرة.',
  matrixTitle: 'مصفوفة أوقات العبور والخدمات', matrixSubtitle: 'مدد عبور واقعية من مراكز الصين إلى وجهات الشرق الأوسط.',
  colTargetCountries: 'الدول المستهدفة', colAirFreight: 'شحن جوي من الباب إلى الباب', colOceanFcl: 'شحن بحري FCL من الباب إلى الباب', colOceanLcl: 'شحن بحري LCL من الباب إلى الباب', colPortToPort: 'رحلة بحرية من ميناء إلى ميناء', colSolutions: 'حلول مخصصة',
  matrixFootnote: 'هذه النطاقات مخصصة للتخطيط عبر المسارات المعتادة. أضف وقتاً احتياطياً لمواسم الذروة وتغيّر الجداول وازدحام الموانئ والفحص والعطلات وتغيرات المسار؛ ويُعتد بجدول الحجز المؤكد.',
  cardsHeading: 'ميزة Heaven Born في الشرق الأوسط', cardsSubheading: 'حلول سلسلة توريد مصممة للتجار والشركات والمستوردين.',
  card1Title: 'إدارة تجميع مشتريات Alibaba و1688', card1Desc: 'نستلم ونفحص ونجمع بضائع عدة موردين في مستودعنا في قوانغتشو لتخفيض التكلفة الإجمالية للشحن.', card1Cta: 'اطلب تفاصيل التجميع',
  card2Title: 'فحص ما قبل الشحن في الصين', card2Desc: 'فحص الجودة والكمية والتغليف قبل إغلاق الحاوية؛ نكون عيونكم وآذانكم في الصين.', card2Cta: 'اطلب تفاصيل الفحص',
  card3Title: 'دعم الجمارك والامتثال المحلي', card3Desc: 'دعم شهادات SABER ومراجعة رموز HS والتنسيق مع الوسطاء الجمركيين لتسليم DDP سلس.', card3Cta: 'استشارة رمز HS',
  faqHeading: 'قائمة شحن الشرق الأوسط والأسئلة الشائعة', faqSubheading: 'فحوصات امتثال استباقية للحفاظ على حركة بضائعكم عبر ممرات الجمارك في الشرق الأوسط.',
  formTitle: 'استفسار فوري عن الشحن إلى الشرق الأوسط', formSub: 'أرسل تفاصيل شحنتكم وسيعد خبراؤنا عرضاً مخصصاً خلال ساعتين.', formLabelName: 'الاسم', formLabelEmail: 'البريد الإلكتروني', formLabelPhone: 'واتساب / هاتف', formLabelGoods: 'نوع البضائع / الحجم', formLabelDest: 'الوجهة', formCta: 'احسب تعرفة الشحن', formSuccess: 'شكراً لكم! يعمل خبيرنا الإقليمي على مساركم وسيتواصل معكم قريباً.',
  chinaToMiddleEastSpecialist: 'متخصص الصين إلى الشرق الأوسط', experienceBadge: '29+ عاماً من الخبرة · تخليص مباشر في الخليج', transitWindowTitle: 'أوقات العبور إلى الشرق الأوسط', seaDdpText: 'شحن بحري DDP من الباب إلى الباب', airDdpText: 'شحن جوي DDP من الباب إلى الباب', transitIncludeText: 'هذه نطاقات عامة للتخطيط. أضف وقتاً احتياطياً لمواسم الذروة وتغيّر الجداول وازدحام الموانئ والفحص والعطلات وتغيرات المسار.', compliantFilingText: 'إجراءات متوافقة بالكامل', professionalVerificationText: 'تحقق احترافي', saudiFocus: 'التركيز على السعودية', uaeFocus: 'التركيز على الإمارات', kuwaitFocus: 'التركيز على الكويت', country_Saudi_Arabia: 'السعودية', country_UAE: 'الإمارات', country_Kuwait: 'الكويت', insightPortfolio: 'مكتبة رؤى Heaven Born اللوجستية',
};

PAGE_LANG_DATA.ar.country_Qatar = 'قطر';
PAGE_LANG_DATA.ar.country_Oman = 'عُمان';
PAGE_LANG_DATA.ar.country_Bahrain = 'البحرين';
PAGE_LANG_DATA.fr.country_Qatar = 'Qatar';
PAGE_LANG_DATA.fr.country_Oman = 'Oman';
PAGE_LANG_DATA.fr.country_Bahrain = 'Bahreïn';
PAGE_LANG_DATA.ru.country_Qatar = 'Катар';
PAGE_LANG_DATA.ru.country_Oman = 'Оман';
PAGE_LANG_DATA.ru.country_Bahrain = 'Бахрейн';

export default function MiddleEastRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  type MiddleEastCountry = 'Saudi-Arabia' | 'UAE' | 'Kuwait' | 'Qatar' | 'Oman' | 'Bahrain';
  const countryBySlug: Record<string, MiddleEastCountry> = {
    'saudi-arabia': 'Saudi-Arabia',
    uae: 'UAE',
    kuwait: 'Kuwait',
    qatar: 'Qatar',
    oman: 'Oman',
    bahrain: 'Bahrain',
  };
  const slugByCountry: Record<MiddleEastCountry, string> = {
    'Saudi-Arabia': 'saudi-arabia',
    UAE: 'uae',
    Kuwait: 'kuwait',
    Qatar: 'qatar',
    Oman: 'oman',
    Bahrain: 'bahrain',
  };
  const getCountryFromLocation = (): MiddleEastCountry => {
    const slug = getShippingCountrySlug(
      location.pathname,
      location.search,
      Object.keys(countryBySlug),
      'saudi-arabia',
    );
    return countryBySlug[slug] || 'Saudi-Arabia';
  };

  const [selectedCountry, setSelectedCountry] = useState<MiddleEastCountry>(getCountryFromLocation);
  const [isLocked, setIsLocked] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [specActiveTab, setSpecActiveTab] = useState<'tab1' | 'tab2'>('tab1');

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, selectedCountry]);

  const handleCountryTabChange = (country: MiddleEastCountry) => {
    setSelectedCountry(country);
    navigate(buildShippingCountryPath(location.pathname, slugByCountry[country]));
  };

  const activeLang = language === 'zh' ? 'zh' : language === 'ru' ? 'ru' : language === 'fr' ? 'fr' : language === 'es' ? 'es' : language === 'ar' ? 'ar' : 'en';

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
        title: language === 'zh' ? 'SABER 合规资料核对' : 'SABER conformity document review',
        val: language === 'zh' ? '订舱前核对' : 'Before booking'
      };
    } else if (selectedCountry === 'UAE') {
      return {
        title: language === 'zh' ? '进口文件与自贸区服务范围核对' : 'Import documents and free-zone scope review',
        val: language === 'zh' ? '订舱前核对' : 'Before booking'
      };
    } else if (selectedCountry === 'Kuwait') {
      return {
        title: language === 'zh' ? 'KUCAS/TABEK 文件核对' : 'KUCAS/TABEK document review',
        val: language === 'zh' ? '订舱前核对' : 'Before booking'
      };
    }
    return {
      title: language === 'zh' ? '进口文件与服务范围核对' : 'Import Document & Scope Review',
      val: language === 'zh' ? '订舱前确认' : 'Before Booking'
    };
  };

  const getTransitEstimate = (mode: 'sea' | 'air') => {
    const ranges: Record<typeof selectedCountry, { sea: string; air: string }> = {
      'Saudi-Arabia': { sea: '25–32', air: '5–12' },
      UAE: { sea: '18–24', air: '4–8' },
      Kuwait: { sea: '28–35', air: '6–12' },
      Qatar: { sea: '22–30', air: '5–10' },
      Oman: { sea: '22–30', air: '5–10' },
      Bahrain: { sea: '24–32', air: '5–10' }
    };
    const value = ranges[selectedCountry][mode];

    if (language === 'zh') return `${value} 天`;
    if (language === 'ru') return `${value} дней`;
    if (language === 'fr') return `${value} jours`;
    if (language === 'ar') return `${value} أيام`;
    return `${value} Days`;
  };

  const t = (key: string) => {
    const data = PAGE_LANG_DATA[activeLang] || PAGE_LANG_DATA['en'];
    return data[key] || '';
  };

  const countryLabelKey: Record<MiddleEastCountry, string> = {
    'Saudi-Arabia': 'country_Saudi_Arabia',
    UAE: 'country_UAE',
    Kuwait: 'country_Kuwait',
    Qatar: 'country_Qatar',
    Oman: 'country_Oman',
    Bahrain: 'country_Bahrain',
  };
  const selectedCountryLabel = t(countryLabelKey[selectedCountry]);
  const selectedCountrySlug = getShippingCountrySlug(
    location.pathname,
    location.search,
    Object.keys(countryBySlug),
    '',
  );
  const hasDedicatedCountryRoute = Boolean(selectedCountrySlug);
  const countrySeo = (() => {
    if (!hasDedicatedCountryRoute) {
      return { title: t('seoTitle'), description: t('seoDesc') };
    }

    const titles: Record<string, string> = {
      en: `Shipping from China to ${selectedCountryLabel} | Freight Forwarding | DDNZ Global`,
      zh: `中国到${selectedCountryLabel}海运、空运与清关服务 | 华正邦泰国际货运`,
      es: `Envíos de China a ${selectedCountryLabel} | DDNZ Global`,
      ar: `الشحن من الصين إلى ${selectedCountryLabel} | DDNZ Global`,
      fr: `Fret de Chine vers ${selectedCountryLabel} | DDNZ Global`,
      ru: `Доставка из Китая в ${selectedCountryLabel} | DDNZ Global`,
    };
    const descriptions: Record<string, string> = {
      en: `Sea and air freight planning from China to ${selectedCountryLabel}, with cargo, import-document, customs and destination-delivery coordination.`,
      zh: `提供中国至${selectedCountryLabel}的海运、空运、集货、进口文件核对及目的地清关派送协调。`,
      es: `Planificación de transporte marítimo y aéreo de China a ${selectedCountryLabel}, con revisión documental, aduanas y coordinación de entrega.`,
      ar: `تخطيط الشحن البحري والجوي من الصين إلى ${selectedCountryLabel} مع مراجعة المستندات والجمارك وتنسيق التسليم.`,
      fr: `Planification du fret maritime et aérien de Chine vers ${selectedCountryLabel}, avec vérification documentaire, douanes et coordination de la livraison.`,
      ru: `Морские и авиационные перевозки из Китая в ${selectedCountryLabel} с проверкой документов, координацией таможенного оформления и доставки.`,
    };

    return {
      title: titles[activeLang] || titles.en,
      description: descriptions[activeLang] || descriptions.en,
    };
  })();

  return (
    <div className="ddnz-home min-h-screen hb-region-shell font-sans overflow-x-hidden">
      <SEO title={countrySeo.title} description={countrySeo.description} />
      <SchemaMarkup
        type="Service"
        data={{
          name: countrySeo.title,
          serviceType: `Freight forwarding from China to ${selectedCountryLabel}`,
          areaServed: { '@type': 'Country', name: selectedCountryLabel },
          description: countrySeo.description,
          url: `https://www.ddnzglobal.com${location.pathname}`
        }}
      />
      <SourcingHomepageNav showFreightExecutor />

      <main>
        
        {/* Section 1: Hero Segment */}
        <section className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
          {/* Visual shipping backdrop layer */}
          <div className="absolute inset-0 z-0 opacity-15">
            <img 
              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2000"
              alt="Middle East Container Terminal" 
              width="2000"
              height="1125"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071A33] via-[#071A33]/80 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d97706]/10 text-[#d97706] text-xs font-black tracking-widest uppercase self-start">
                    <span>{t('chinaToMiddleEastSpecialist')}</span>
                  </div>
                  
                  {/* Dynamic Country Selector Tabs */}
                  {!isLocked && (
                    <div className="flex flex-wrap gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.08] max-w-fit">
                      {(['Saudi-Arabia', 'UAE', 'Kuwait', 'Qatar', 'Oman', 'Bahrain'] as const).map((country) => {
                        const isActive = selectedCountry === country;
                        const label = country === 'Saudi-Arabia' 
                          ? t('country_Saudi_Arabia') 
                          : country === 'UAE' 
                            ? t('country_UAE')
                            : country === 'Kuwait'
                              ? t('country_Kuwait')
                              : country === 'Qatar'
                                ? t('country_Qatar')
                                : country === 'Oman'
                                  ? t('country_Oman')
                                  : t('country_Bahrain');
                        return (
                          <button
                            key={country}
                            type="button"
                            onClick={() => handleCountryTabChange(country)}
                            className={`min-h-11 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                              isActive
                                ? 'bg-[#d97706] text-white shadow-md shadow-[#d97706]/15'
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
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#d97706]">
                    {getCountryContent('headline')}
                  </span>
                </h1>
                
                <div className="space-y-4">
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                    {getCountryContent('subheadline')}
                  </p>
                  
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      {language === 'zh' ? 'SABER / 中东合规核验' : 'SABER & Customs Compliant'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d97706]/10 border border-[#d97706]/20 text-xs font-bold text-[#d97706]">
                      <Ship className="w-3.5 h-3.5" aria-hidden="true" />
                      {language === 'zh' ? '自主装箱与直航排舱' : 'Direct LCL/FCL Allocations'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
                      <Truck className="w-3.5 h-3.5" aria-hidden="true" />
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
                    className="px-6 py-3.5 bg-gradient-to-r from-[#d97706] to-[#ff9f24] hover:from-[#e07a00] hover:to-[#ff8a00] text-white font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300 flex items-center gap-2"
                  >
                    <span>{t('heroCta')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-white/10 max-w-lg">
                  <Globe className="w-4 h-4 text-sky-300 shrink-0" aria-hidden="true" />
                  <p className="text-xs text-slate-300 font-medium">
                    {t('experienceBadge')}
                  </p>
                </div>
              </div>

              {/* Mini Quick Fact Widget */}
              <div className="lg:col-span-5 bg-white/[0.03] backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/[0.08] shadow-2xl">
                <h3 className="text-lg font-black tracking-wide text-[#d97706] uppercase mb-4">
                  {t('transitWindowTitle')}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <span className="text-sm font-bold text-slate-300">
                      {t('seaDdpText')}
                    </span>
                    <span className="text-sm font-extrabold text-[#d97706]">
                      {getTransitEstimate('sea')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <span className="text-sm font-bold text-slate-300">
                      {t('airDdpText')}
                    </span>
                    <span className="text-sm font-extrabold text-[#d97706]">
                      {getTransitEstimate('air')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <span className="text-sm font-bold text-slate-300">
                      {getComplianceRow().title}
                    </span>
                    <span className="text-sm font-extrabold text-[#d97706]">
                      {getComplianceRow().val}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-white/[0.02] rounded-xl border border-white/[0.08] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#d97706] flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300 leading-normal font-medium">
                    {t('transitIncludeText')}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <MarketSourcingHandoff destination={selectedCountryLabel} />

        {/* Section 2: Red Sea Operational Reality Update (Market Insight Box) */}
        <section className="py-12 bg-[#081E39] border-y border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white/[0.02] rounded-2xl border-l-8 border-[#d97706] p-6 md:p-8 shadow-md border border-white/[0.08]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#d97706]/10 text-[#d97706]">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] tracking-widest font-black uppercase text-[#d97706]">
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
                <Globe className="w-3.5 h-3.5 text-sky-300" aria-hidden="true" />
                <span>{t('insightPortfolio')}</span>
                <span>2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: All-in-One Transit Time & Reference Matrix */}
        <section className="py-16 md:py-24 border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#d97706]/10 text-[#d97706] text-xs font-bold tracking-wider uppercase mb-3">
                {t('colSolutions')}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-4">
                {t('matrixTitle')}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-sky-400 to-[#d97706] mx-auto rounded-full mb-6" />
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
                      const countryLabel = (row.country as Record<string, string>)[activeLang] || row.country.en;
                      const airText = (row.air as Record<string, string>)[activeLang] || row.air.en;
                      const fclText = (row.fcl as Record<string, string>)[activeLang] || row.fcl.en;
                      const lclText = (row.lcl as Record<string, string>)[activeLang] || row.lcl.en;
                      const portToPortText = (row.portToPort as Record<string, string>)[activeLang] || row.portToPort.en;
                      const solutionsText = (row.solutions as Record<string, string>)[activeLang] || row.solutions.en;

                      return (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors duration-150 group">
                          <td className="px-6 py-5 font-black text-white text-sm sm:text-base">
                            <div className="flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]" />
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
              <div className="w-10 h-1 bg-gradient-to-r from-sky-400 to-[#d97706] mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-sm sm:text-base font-semibold leading-relaxed">
                {t('cardsSubheading')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8 hover:border-[#d97706]/50 hover:shadow-[0_0_30px_rgba(11,28,44,0.22)] hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#d97706]/10 text-[#d97706] flex items-center justify-center mb-6 p-3">
                    <Ship className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-3">
                    {t('card1Title')}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    {t('card1Desc')}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs font-bold text-[#d97706]">
                  <span>{t('card1Cta')}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8 hover:border-[#d97706]/50 hover:shadow-[0_0_30px_rgba(11,28,44,0.22)] hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#d97706]/10 text-[#d97706] flex items-center justify-center mb-6 p-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-3">
                    {t('card2Title')}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    {t('card2Desc')}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs font-bold text-[#d97706]">
                  <span>{t('card2Cta')}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8 hover:border-[#d97706]/50 hover:shadow-[0_0_30px_rgba(11,28,44,0.22)] hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#d97706]/10 text-[#d97706] flex items-center justify-center mb-6 p-3">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-3">
                    {getCountryContent('card3Title')}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    {getCountryContent('card3Desc')}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs font-bold text-[#d97706]">
                  <span>{t('card3Cta')}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Country-Specific Compliance & Operation Section */}
        {(() => {
          const countrySpecs = COUNTRY_SPEC_DATA as Record<string, Record<string, any>>;
          const spec = countrySpecs[selectedCountry]?.[activeLang] || GCC_SPEC_DATA[selectedCountry]?.[activeLang] || countrySpecs[selectedCountry]?.['en'] || GCC_SPEC_DATA[selectedCountry]?.['en'];
          if (!spec) return null;
          return (
            <section className="py-16 border-t border-b border-white/[0.05]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span className="px-3 py-1 bg-white/[0.05] text-[#d97706] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                    {selectedCountry === 'Saudi-Arabia' ? t('saudiFocus') : selectedCountry === 'UAE' ? t('uaeFocus') : selectedCountry === 'Kuwait' ? t('kuwaitFocus') : getCountryContent('headline')}
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                    {spec.specTitle}
                  </h2>
                  <div className="w-10 h-1 bg-gradient-to-r from-sky-400 to-[#d97706] mx-auto rounded-full mb-6" />
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
                          className={`min-h-11 flex-1 px-2 pb-3 text-xs sm:text-sm font-black text-center border-b-2 transition-all ${specActiveTab === 'tab1' ? 'border-[#d97706] text-[#d97706]' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
                        >
                          {spec.tab1Title}
                        </button>
                        <button
                          onClick={() => setSpecActiveTab('tab2')}
                          className={`min-h-11 flex-1 px-2 pb-3 text-xs sm:text-sm font-black text-center border-b-2 transition-all ${specActiveTab === 'tab2' ? 'border-[#d97706] text-[#d97706]' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
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
                            <div className="flex items-center gap-2 text-[#d97706] font-bold text-sm">
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
                      <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#d97706]" />{t('compliantFilingText')}</span>
                      <span>{t('professionalVerificationText')}</span>
                    </div>
                  </div>

                  {/* Right part: Redlines (cols 5) */}
                  <div className="lg:col-span-5 bg-[#0b1c2c] rounded-2xl p-6 md:p-8 border border-amber-400/20 shadow-sm">
                    <div className="flex items-center gap-2 text-amber-300 font-black mb-6 text-sm sm:text-base">
                      <ShieldAlert className="w-6 h-6 text-amber-300 flex-shrink-0" />
                      <h3>{spec.redlinesTitle}</h3>
                    </div>

                    <div className="space-y-4">
                      {spec.redlines.map((item: any) => (
                        <div key={item.id} className="flex gap-3 items-start text-xs sm:text-sm">
                          <span className="text-amber-300 font-black text-sm flex-shrink-0 mt-0.5">{item.id}</span>
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
                        <div key={idx} className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 hover:border-[#d97706]/50 hover:shadow-[0_0_30px_rgba(11,28,44,0.22)] hover:bg-white/[0.05] transition-all duration-300">
                          <div className="w-10 h-10 rounded-lg bg-[#d97706]/10 text-[#d97706] flex items-center justify-center mb-4 p-2 font-black">
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
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#d97706]/10 text-[#d97706] text-xs font-bold tracking-wider uppercase mb-3">
                FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                {t('faqHeading')}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-sky-400 to-[#d97706] mx-auto rounded-full mb-6" />
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
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b] focus-visible:ring-inset"
                    >
                      <span className="text-sm md:text-base font-black text-white pr-4">
                        {faq.title}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-[#d97706] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
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
                presetDestination={selectedCountryLabel}
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
