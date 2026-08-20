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
  Globe, Clock, HelpCircle, Truck, FileText, Scale, ArrowUpRight, Timer, MapPin, Target, Lightbulb, ChartNoAxesCombined
} from 'lucide-react';
import { trackEvent } from '../lib/utils';
import { buildShippingCountryPath, getShippingCountrySlug } from '../utils/shippingCountryRoutes';
import { createLocalizedShippingContent, createLocalizedShippingRedlines } from '../utils/localizedShippingContent';

// Multi-language strings for Central Asia countries
const CENTRAL_ASIA_DATA = {
  kazakhstan: {
    en: {
      seoTitle: "China to Central Asia Freight Forwarding Guide | Heaven Born",
      seoDesc: "Rail and cross-border trucking from China to Kazakhstan, with support for EAEU document preparation and broad-gauge transfer planning.",
      headline: "China to Kazakhstan Freight: Rail, Trucking & Customs Support",
      subheadline: "Direct block trains and cross-border trucking, with Heaven Born coordination for Horgos/Alashankou transfers and EAEU-ready documentation.",
      transitWindow: "Kazakhstan Transit Windows",
      transitDays: "15 - 25 Days",
      complianceRowTitle: "EAEU Conformity & TN VED Review",
      complianceRowVal: "Before Booking",
      solutionsTitle: "Kazakhstan SCM Compliance Solutions",
      solutionsSubtitle: "Tailored supply chain pathways built to resolve EAEU entry tariffs, gauge transformations, and document alignment.",
      solutions: [
        {
          title: "EAEU Customs Compliance & TR CU Rules",
          desc: "As a member of the Eurasian Economic Union (EAEU), Kazakhstan shares a unified customs tariff system. For controlled products, Heaven Born can help review the required Declaration of Conformity and TN VED classification before shipment.",
          icon: "ShieldCheck"
        },
        {
          title: "1520mm Broad Gauge Rail Transfer",
          desc: "China's standard gauge is 1435mm, while Central Asia uses the 1520mm broad gauge. Cargo is transferred at border ports such as Horgos and Alashankou; timing depends on border operations and seasonal congestion.",
          icon: "Scale"
        },
        {
          title: "Pure 'Double Document' Strategy",
          desc: "We recommend keeping shipping and clearance documents consistent. Consignee details on the Bill of Lading should be reviewed against the destination clearance documents before shipment.",
          icon: "FileText"
        },
        {
          title: "MFN Mapped Profit Protection",
          desc: "China and the EAEU do not currently offer a general FTA tariff preference. Origin certificates verify provenance; applicable duties should be checked against the current MFN schedule and destination requirements.",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "Air Freight (Express)",
          days: "3 - 7 Days",
          suitability: "Ideal for high-value cargo, samples & time-critical electronics.",
          sellingPoint: "A suitable option for time-sensitive cargo when flight schedules and destination formalities align.",
          warning: "Strict lithium battery, liquid, and powder checks are enforced."
        },
        {
          mode: "Cross-Border Trucking (Semi-Trailer Swap Mode)",
          days: "5 - 12 Days",
          suitability: "Highly recommended for consolidated batches around 5 tons; extremely flexible compared to whole rail containers.",
          sellingPoint: "Semi-trailer swap routing may reduce handling steps on suitable routes. The final plan depends on the border, cargo type, and local operating conditions.",
          warning: "Axle-load rules and roadside inspections apply. Loading and route requirements should be confirmed before dispatch."
        },
        {
          mode: "Rail Freight (Block Train / Bulk Rail)",
          days: "6 - 20 Days",
          suitability: "Best for heavy bulk machinery, building materials, and full-container-loads (FCL).",
          sellingPoint: "Rail can suit heavy or full-container cargo where the route, departure schedule and border capacity fit the shipment plan.",
          warning: "China uses 1435mm standard gauge and Kazakhstan uses 1520mm broad gauge. Containers transfer at border ports such as Horgos; timing depends on border operations."
        },
        {
          mode: "E-commerce Packet & EMS",
          days: "5 - 18 Days",
          suitability: "Tailored for small cross-border parcels and light consumer shipments.",
          sellingPoint: "A route option for small, lighter consumer shipments when the commodity is accepted by the carrier.",
          warning: "Postal EMS takes 15-18 days with strict physical bans on liquids, powders, and loose batteries."
        }
      ],
      faqs: [
        {
          q: "What is the EAEU customs clearance challenge in Kazakhstan?",
          a: "Kazakhstan applies EAEU customs and technical-regulation frameworks. Some products need a conformity declaration or certificate; confirm applicability by TN VED code, product category and current destination requirements before shipment."
        },
        {
          q: "How does the 1520mm broad gauge rail transfer affect my transit time?",
          a: "Rail cargo transfers from China’s standard gauge to the 1520mm broad gauge at border ports such as Alashankou or Horgos. Congestion can affect the schedule, so transfer time should be built into the shipment plan."
        },
        {
          q: "Do Chinese Certificate of Origin (CO) qualify for tariff discounts?",
          a: "No. Kazakhstan and other EAEU countries do not currently apply a general China FTA tariff preference. A certificate of origin verifies provenance; duties should be checked against the current MFN schedule and destination requirements."
        }
      ]
    },
    zh: {
      seoTitle: "中国至哈萨克斯坦（阿拉木图）跨境卡航与铁路班列 DDP | 华正邦泰国际货运",
      seoDesc: "中国至哈萨克斯坦的铁路、跨境卡航与多式联运服务，提供 EAEU 清关文件、TR CU 与 TN VED 资料的出运前协调支持。",
      headline: "中国到哈萨克斯坦货运：铁路、卡航与 EAEU 清关服务",
      subheadline: "直达阿拉木图与阿斯塔纳。华正邦泰国际货运协调霍尔果斯/阿拉山口口岸换装、进口申报与多式联运安排。",
      transitWindow: "哈萨克斯坦专线预计时效",
      transitDays: "15 - 25 天",
      complianceRowTitle: "EAEU 合规与 TN VED 资料核对",
      complianceRowVal: "订舱前核对",
      solutionsTitle: "哈萨克斯坦专线合规解决方案",
      solutionsSubtitle: "围绕宽轨换装、目的地文件与关税要求，提供出运前资料核对及运输节点协调。",
      solutions: [
        {
          title: "EAEU 共享通关铁律",
          desc: "哈国作为欧亚经济联盟成员国，共享一套海关关税体系。针对受监管产品，可在出运前核对符合性声明与 TN VED 编码要求。",
          icon: "ShieldCheck"
        },
        {
          title: "1520mm 宽轨换轨时效拆解",
          desc: "中国标准轨为 1435mm，边境口岸（霍尔果斯/阿拉山口）需要换装。实际时效受口岸操作与旺季拥堵影响，建议为换装预留缓冲时间。",
          icon: "Scale"
        },
        {
          title: "纯正单证防线",
          desc: "建议保留中英文资料，并在出运前核对提单收货人信息与目的地清关文件的一致性。",
          icon: "FileText"
        },
        {
          title: "关税盲区提示",
          desc: "中国与 EAEU 之间目前没有普遍适用的自贸协定优惠。原产地证主要用于证明产地，税费应以目的地当期 MFN 税则与实际申报要求为准。",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "空运服务 (Air Freight Express)",
          days: "3 - 7 天",
          suitability: "适合高货值、样品、紧急电子配件及高精密仪器等时效敏感型货物。",
          sellingPoint: "适合时效敏感货物；实际班期、目的港操作和清关资料需在出运前确认。",
          warning: "受民航局严苛安检限制，纯锂电池、大容量液体、精细粉末等货物需提前做磁检鉴定。"
        },
        {
          mode: "跨境公路卡航 (卡航专线 - 甩挂模式)",
          days: "5 - 12 天",
          suitability: "对5吨左右的小批量货量极为友好。时效灵活，比按集装箱计费的铁路班列更具性价比与操作弹性。",
          sellingPoint: "可根据口岸、货物与承运条件评估甩挂或跨境公路运输安排，并在出运前确认交接与装卸要求。",
          warning: "中亚公路运输可能涉及轴重与配载要求。请在装车前根据车辆、货物和路线核对重量与配载资料。"
        },
        {
          mode: "中欧班列 / 铁路大宗 (Rail Freight)",
          days: "6 - 20 天",
          suitability: "适合重型机械、大宗原材料、建材、及全箱货（FCL）。",
          sellingPoint: "当班期、口岸能力和目的地交付要求匹配时，铁路可作为重货和整箱货的运输选择。",
          warning: "中国标准轨为 1435mm，哈萨克斯坦为 1520mm 宽轨；边境换装和旺季口岸操作会影响实际时效，请在计划中预留缓冲。"
        },
        {
          mode: "电商小包与邮政 EMS (E-commerce Packet)",
          days: "5 - 18 天",
          suitability: "适用于小体积跨境电商件、个人散货包裹及轻量消费品。",
          sellingPoint: "可根据可用服务、货物属性和目的地要求安排电商小包或邮政服务；税费及申报方式应由进口方按当地要求确认。",
          warning: "邮政 EMS 普邮时效在 15-18 天左右，且严禁携带液体、粉末、非原装锂电池。"
        }
      ],
      faqs: [
        {
          q: "哈萨克斯坦的 EAEU 清关有什么难点？",
          a: "由于哈萨克斯坦是欧亚经济联盟（EAEU）成员国，清关资料通常需要核对符合性文件与 TN VED 编码。建议在出运前确认商品资料与目的地清关文件的一致性。"
        },
        {
          q: "1520mm 宽轨换装是如何影响货运时效的？",
          a: "中国铁路使用 1435mm 标准轨，哈萨克斯坦及中亚使用 1520mm 宽轨。班列在阿拉山口、霍尔果斯等口岸通常需要完成相应的换装或交接操作；旺季与口岸拥堵可能影响整体计划。"
        },
        {
          q: "提供中国原产地证（CO）可以享受哈萨克斯坦关税减免吗？",
          a: "中国与哈萨克斯坦及 EAEU 的适用贸易安排，应以进口商和目的地合格专业机构的当前确认为准。原产地证通常用于证明原产地；税费需结合 TN VED 编码、申报资料及当地规定确认。"
        }
      ]
    },
    ru: {
      seoTitle: "Доставка из Китая в Казахстан | Heaven Born",
      seoDesc: "Железнодорожная, автомобильная и авиационная доставка из Китая в Казахстан с предварительной проверкой документов ЕАЭС и планированием перегрузки на границе.",
      headline: "Доставка из Китая в Казахстан: железная дорога, авто и таможня",
      subheadline: "Heaven Born координирует автодоставку и контейнерные перевозки в Казахстан и Центральную Азию с подготовкой документов до отправки.",
      transitWindow: "Сроки доставки в Казахстан",
      transitDays: "15 - 25 дней",
      complianceRowTitle: "Аудит и сертификация ТР ТС ЕАЭС",
      complianceRowVal: "До бронирования",
      solutionsTitle: "Решения по комплаенсу логистики в Казахстане",
      solutionsSubtitle: "Индивидуальные цепочки поставок, созданные для решения вопросов ввозных тарифов ЕАЭС, смены колеи и проверки документов.",
      solutions: [
        {
          title: "Таможенный комплаенс ЕАЭС и правила ТР ТС",
          desc: "Казахстан применяет таможенные и технические правила ЕАЭС. Для регулируемых товаров мы предварительно проверяем применимость декларации или сертификата соответствия и классификацию ТН ВЭД до отправки.",
          icon: "ShieldCheck"
        },
        {
          title: "Перегрузка на широкую колею 1520 мм",
          desc: "Колея в Китае составляет 1435 мм, а в Казахстане — 1520 мм. Контейнеры проходят перегрузку на пограничных пунктах, включая Хоргос и Алашанькоу; мы координируем план маршрута и документы с учётом работы границы.",
          icon: "Scale"
        },
        {
          title: "Стратегия двойного документооборота",
          desc: "Проверьте соответствие данных получателя в накладной и документах для таможенного оформления до отправки, чтобы снизить риск дополнительной обработки.",
          icon: "FileText"
        },
        {
          title: "Защита прибыли на основе ТН ВЭД",
          desc: "Между Китаем и ЕАЭС нет общего соглашения о свободной торговле. Сертификат происхождения подтверждает происхождение товара; пошлины следует проверять по актуальной ставке ТН ВЭД и требованиям страны ввоза.",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "Авиадоставка (Экспресс)",
          days: "3 - 7 дней",
          suitability: "Идеально подходит для дорогостоящих грузов, образцов и электроники.",
          sellingPoint: "Самый быстрый способ таможенного оформления с прямыми рейсами в аэропорт Алматы (ALA).",
          warning: "Проводится строгая проверка литиевых батарей, жидкостей и порошков."
        },
        {
          mode: "Автоперевозки (Режим перецепки полуприцепов)",
          days: "5 - 12 дней",
          suitability: "Рекомендуется для партий около 5 тонн; высокая гибкость по сравнению с ж/д контейнерами.",
          sellingPoint: "Используется передовой режим перецепки. Мы меняем тягач на границе, полуприцеп едет дальше. Отсутствие перегрузки гарантирует безопасность хрупких грузов.",
          warning: "Строгий дорожный контроль осевых нагрузок. Прямой маршрут исключает повреждения."
        },
        {
          mode: "Железнодорожные перевозки (Контейнерные поезда)",
          days: "6 - 20 дней",
          suitability: "Подходит для тяжелого оборудования, строительных материалов и целых контейнеров (FCL).",
          sellingPoint: "Железнодорожный маршрут подходит для тяжёлых или полноконтейнерных отправок, когда график отправления и пропускная способность границы подтверждены.",
          warning: "Колея в Китае 1435 мм, в Казахстане 1520 мм. Перегрузка выполняется на пограничных станциях; сезонная загрузка и операции на границе могут влиять на график."
        },
        {
          mode: "Электронная коммерция и EMS",
          days: "5 - 18 дней",
          suitability: "Для небольших посылок e-commerce и легких потребительских товаров.",
          sellingPoint: "Специализированные экспресс-маршруты занимают в среднем 5-7 дней.",
          warning: "Обычная почта EMS идет 15-18 дней с ограничениями на жидкости и аккумуляторы."
        }
      ],
      faqs: [
        {
          q: "В чем сложность таможенного оформления ЕАЭС в Казахстане?",
          a: "Казахстан входит в ЕАЭС и применяет единые технические регламенты. Для части товаров требуется декларация или сертификат соответствия; применимость следует проверить по коду ТН ВЭД, категории товара и актуальным требованиям до отправки."
        },
        {
          q: "Как перегрузка на колею 1520 мм влияет на время доставки?",
          a: "На железнодорожном маршруте из Китая используется переход со стандартной колеи на 1520 мм на пограничных станциях. Время перегрузки необходимо учитывать в плане отправки: сезонная загрузка и работа границы могут менять график."
        },
        {
          q: "Дает ли китайский сертификат происхождения скидку на пошлины?",
          a: "Нет. У Казахстана и ЕАЭС нет соглашения о свободной торговле с Китаем. Сертификат подтверждает только страну происхождения, пошлины рассчитываются по стандартным ставкам режима наибольшего благоприятствования."
        }
      ]
    }
  },
  uzbekistan: {
    en: {
      seoTitle: "Shipping from China to Uzbekistan | Heaven Born",
      seoDesc: "Rail, multimodal and cross-border trucking from China to Uzbekistan, with support for document preparation, pre-declaration and destination operating requirements.",
      headline: "Rail, multimodal and trucking from China to Uzbekistan",
      subheadline: "Plan transport to Tashkent and industrial destinations around cargo documents, border procedures and destination-side operating scope.",
      transitWindow: "Uzbekistan Transit Windows",
      transitDays: "18 - 28 Days",
      complianceRowTitle: "GOST-UZ & HS Code Review",
      complianceRowVal: "Before Booking",
      solutionsTitle: "Uzbekistan compliance and routing planning",
      solutionsSubtitle: "Review document, valuation and route requirements before cargo moves toward a double-landlocked destination.",
      solutions: [
        {
          title: "1-Hour Digital Pre-Declaration Redline",
          desc: "Electronic pre-declaration timing and required data should be confirmed with the carrier and destination clearance party before shipment. We help prepare and review the cargo information in advance.",
          icon: "ShieldCheck"
        },
        {
          title: "CIF Tax Nesting & Cube Optimization",
          desc: "Duties and VAT can be assessed using CIF value. The applicable formula, rates and product classification should be checked against current destination requirements before shipment.",
          icon: "Scale"
        },
        {
          title: "GOST-UZ & HS Code Alignment",
          desc: "Some machinery, electronics and chemical products may require GOST-UZ conformity documentation. Check certification and HS-code alignment before cargo is released for export.",
          icon: "FileText"
        }
      ],
      multimodalTable: [
        {
          mode: "Air Freight (Express)",
          days: "4 - 8 Days",
          suitability: "Best for high-priority industrial spares, critical machinery, and premium medical supplies.",
          sellingPoint: "A suitable option for time-sensitive cargo when flight schedules and destination formalities align.",
          warning: "Taxed on full CIF value (goods + freight); minimize volumetric weight to limit excessive duty/VAT."
        },
        {
          mode: "Cross-Border Trucking (Semi-Trailer Swap)",
          days: "6 - 14 Days",
          suitability: "Highly efficient for heavy equipment, valuable auto components, and time-sensitive factory cargo.",
          sellingPoint: "Semi-trailer-swap and door-delivery options are assessed according to the border, cargo and destination operating scope.",
          warning: "Pre-declaration timing and required data should be confirmed with the carrier and destination clearance party before dispatch."
        },
        {
          mode: "Rail / Multimodal Freight (Block Train / Sea-Rail)",
          days: "14 - 28 Days",
          suitability: "Optimized for high-volume raw materials, minerals, and massive industrial production lines.",
          sellingPoint: "Rail and multimodal options may suit high-volume cargo when schedules, border capacity and final delivery requirements are confirmed.",
          warning: "Uzbekistan is double-landlocked. Border transfers, valuation rules and destination requirements can affect both timing and cost."
        },
        {
          mode: "E-commerce Packet & EMS",
          days: "7 - 22 Days",
          suitability: "Suited for retail items, consumer electronics, and lightweight individual packages.",
          sellingPoint: "An option for lighter consumer shipments when the commodity is accepted by the carrier and destination channel.",
          warning: "Standard EMS postal option averages 18-22 days. Liquid, battery, and powder products are strictly restricted."
        }
      ],
      faqs: [
        {
          q: "What is the 1-hour digital pre-declaration rule in Uzbekistan?",
          a: "Electronic pre-declaration requirements can vary by transport mode and current destination rules. Confirm the required data, filing party and timing before the cargo moves to the border or airport.",
        },
        {
          q: "How does the Uzbek 'CIF tax-on-tax' formula work, and how can we mitigate it?",
          a: "Duties and VAT may be based on CIF value. Confirm the current tariff, valuation method and HS classification with the destination clearance party before booking; packing and freight planning can then be assessed against that scope.",
        },
        {
          q: "Is GOST-UZ certification mandatory for all shipments?",
          a: "No. Some product categories may require GOST-UZ conformity documentation. Confirm whether certification is required, who provides it and how it aligns with the HS code before shipment."
        }
      ]
    },
    zh: {
      seoTitle: "中国到乌兹别克斯坦铁路、卡航与多式联运 | 华正邦泰国际货运",
      seoDesc: "从中国到乌兹别克斯坦的铁路、多式联运和跨境公路方案，提供出运资料、预申报与目的地操作要求的协调支持。",
      headline: "中国到乌兹别克斯坦的铁路、卡航与多式联运",
      subheadline: "根据货物资料、边境操作和目的地服务范围，规划到塔什干及工业区的运输方案。",
      transitWindow: "乌兹别克斯坦专线预计时效",
      transitDays: "18 - 28 天",
      complianceRowTitle: "乌兹别克斯坦 GOST-UZ 与 HS 资料核对",
      complianceRowVal: "订舱前核对",
      solutionsTitle: "乌兹别克斯坦路线与合规规划",
      solutionsSubtitle: "针对双重内陆运输、资料申报和税费核对，在出运前确认所需文件与服务范围。",
      solutions: [
        {
          title: "到关前线上申报（1小时红线）",
          desc: "电子预申报的资料、申报方与时点需在出运前与承运方及目的地清关方确认；我们可协助提前整理和核对货物资料。",
          icon: "ShieldCheck"
        },
        {
          title: "CIF 叠加“税中税”算法规避",
          desc: "税费可能以 CIF 价值为基础计算。适用公式、税率与商品归类应以目的地当期要求为准，并在出运前核对。",
          icon: "Scale"
        },
        {
          title: "GOST-UZ 认证与单证错位风控",
          desc: "部分机械、电子和化工产品可能需要 GOST-UZ 合规资料；建议在出运前核对认证范围与 HS 编码的一致性。",
          icon: "FileText"
        }
      ],
      multimodalTable: [
        {
          mode: "空运服务 (Air Freight Express)",
          days: "4 - 8 天",
          suitability: "最适合紧急工业零配件、关键生产线替换件及高附加值医疗器械。",
          sellingPoint: "适合时效敏感货物；实际班期、目的港操作和清关资料需在出运前确认。",
          warning: "税款按照 CIF（货值+运费）计算，运费部分也将被计税，请务必优化体积重量以控制成本。"
        },
        {
          mode: "跨境公路卡航 (甩挂模式)",
          days: "6 - 14 天",
          suitability: "适合重型非标设备、高货值汽车零部件及有刚性交期要求的工厂普货。",
          sellingPoint: "甩挂与门到门方案需根据口岸、货物和目的地服务范围确认。",
          warning: "预申报的时点和所需数据应在出运前与承运方及目的地清关方确认。"
        },
        {
          mode: "铁路大宗 / 多式联运 (Rail & Multimodal)",
          days: "14 - 28 天",
          suitability: "超大规模原材料、大型基建矿山物资、以及长周期大吨位整箱（FCL）货物。",
          sellingPoint: "当班期、口岸能力和末端派送要求匹配时，铁路与多式联运可作为大宗货物的运输选项。",
          warning: "双重内陆运输可能受口岸换装、目的地估价规则和当地操作条件影响。"
        },
        {
          mode: "电商小包与邮政 EMS (E-commerce Packet)",
          days: "7 - 22 天",
          suitability: "适合网购小商品、零售样版、个人自用轻便货物等。",
          sellingPoint: "适用于承运渠道接受的小体积消费品；具体时效与限制以实际产品和渠道为准。",
          warning: "普通 EMS 邮政包裹约 18-22 天，受国际邮联公约限制，严禁夹带易燃液体、粉末和裸露电池。"
        }
      ],
      faqs: [
        {
          q: "乌兹别克斯坦的‘1小时线上预申报’红线是指什么？",
          a: "电子预申报要求会随运输方式和目的地规则变化。建议在货物进场或到达边境前，确认所需数据、申报方及相应时点。"
        },
        {
          q: "什么是乌国的‘CIF税中税’陷阱？如何规避？",
          a: "税费可能以 CIF 价值为基础计算。应在订舱前向目的地清关方确认适用税率、计价方法和 HS 编码；包装与运输方案可在此基础上评估。"
        },
        {
          q: "所有机械产品都需要 GOST-UZ 认证吗？",
          a: "并非所有机械产品都需要。部分产品可能需要 GOST-UZ 合规资料；请在出运前确认认证适用范围、文件提供方及其与 HS 编码的一致性。"
        }
      ]
    },
    ru: {
      seoTitle: "Доставка из Китая в Узбекистан | Heaven Born",
      seoDesc: "Железнодорожная, мультимодальная, автомобильная и авиационная доставка из Китая в Узбекистан с подготовкой документов и планированием на границе.",
      headline: "Доставка из Китая в Узбекистан",
      subheadline: "Планируйте автодоставку, железнодорожные и мультимодальные отправки в Ташкент и промышленные регионы с проверкой документов и условий на стороне назначения.",
      transitWindow: "Сроки доставки в Узбекистан",
      transitDays: "18 - 28 дней",
      complianceRowTitle: "Содействие в сертификации GOST-UZ",
      complianceRowVal: "До бронирования",
      solutionsTitle: "Специальные решения для доставки в Узбекистан",
      solutionsSubtitle: "Проверяем документы, код ТН ВЭД, оценку стоимости и маршрут до перемещения груза в страну без морского выхода.",
      solutions: [
        {
          title: "Предварительное онлайн-декларирование (правило 1 часа)",
          desc: "Требования к предварительным электронным данным могут различаться по виду транспорта и текущим правилам назначения. До отправки подтверждаем состав данных, ответственную сторону и срок подачи.",
          icon: "ShieldCheck"
        },
        {
          title: "Оптимизация расчета пошлин по CIF",
          desc: "Для расчёта платежей важно заранее подтвердить таможенную стоимость, стоимость перевозки и страхования. Мы помогаем подготовить коммерческие документы и маршрутные данные для расчёта импортером.",
          icon: "Scale"
        },
        {
          title: "Сертификация GOST-UZ и контроль ТН ВЭД",
          desc: "Для отдельных категорий оборудования, электроники и другой регулируемой продукции могут применяться требования соответствия. Проверяем применимость по коду ТН ВЭД, товару и действующим правилам до бронирования.",
          icon: "FileText"
        }
      ],
      multimodalTable: [
        {
          mode: "Авиадоставка (Экспресс)",
          days: "4 - 8 дней",
          suitability: "Подходит для срочных промышленных запчастей, оборудования и медицинских товаров.",
          sellingPoint: "Авиаперевозка подходит для срочных отправок, когда подтверждены место на рейсе, документы и условия выдачи в аэропорту назначения.",
          warning: "Налоги рассчитываются от стоимости CIF; минимизируйте объемный вес для оптимизации пошлин."
        },
        {
          mode: "Автоперевозки (Режим перецепки полуприцепов DDP)",
          days: "6 - 14 дней",
          suitability: "Очень эффективно для тяжелого оборудования, автокомпонентов и срочных заводских грузов.",
          sellingPoint: "Прямые перевозки через сухопутные порты Синьцзяна. Доставка 'от двери до двери' с готовыми решениями DDP/DDU.",
          warning: "Потребуется полная подготовка всех документов до того, как автомобиль прибудет на границу."
        },
        {
          mode: "Железнодорожные и мультимодальные перевозки",
          days: "14 - 28 дней",
          suitability: "Оптимально для сырья, крупных партий строительных материалов и промышленного оборудования.",
          sellingPoint: "Железнодорожные и мультимодальные маршруты подходят для крупных партий, когда подтверждены график, пропускная способность границы и финальная доставка.",
          warning: "Узбекистан не имеет выхода к морю. Возможны задержки из-за смены колеи и таможенных процедур."
        },
        {
          mode: "Электронная коммерция и EMS",
          days: "7 - 22 дня",
          suitability: "Для легких потребительских товаров и индивидуальных посылок.",
          sellingPoint: "Прямые экспресс-линии в Ташкент за 7-10 дней в обход общих очередей.",
          warning: "Обычная почта EMS идет в среднем 18-22 дня с ограничениями на батареи и жидкости."
        }
      ],
      faqs: [
        {
          q: "Что представляет собой правило предварительного декларирования в Узбекистане?",
          a: "Требования к электронному предварительному декларированию зависят от вида транспорта и действующих правил. До движения груза к границе следует подтвердить необходимые данные, сторону подачи и срок передачи."
        },
        {
          q: "Как работает узбекская формула расчета пошлин от CIF?",
          a: "Пошлины и налоги зависят от таможенной стоимости, классификации товара и действующих требований. Импортеру следует заранее подтвердить метод оценки и ставку по коду ТН ВЭД; мы предоставляем перевозочные и коммерческие данные для этой проверки."
        },
        {
          q: "Обязателен ли сертификат GOST-UZ для всех отправлений?",
          a: "Требование соответствия зависит от кода ТН ВЭД, категории и действующих правил Узбекистана. До бронирования проверяем, требуется ли документ соответствия, и согласуем последующие действия с импортёром."
        }
      ]
    }
  }
};

const UNIVERSAL_REDLINES = {
  en: {
    title: "Central Asia Shipment Planning Checklist",
    subtitle: "Confirm the commercial, loading, and destination-delivery scope before dispatching cross-border cargo.",
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
    title: "中亚跨境出运操作核对清单",
    subtitle: "在出运前确认结算、装载和目的地交付边界，有助于规划更清晰的跨境运输安排。",
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
        title: "Реальные решения от двери до двери DDP/DDU",
        desc: "Четко определите границы доставки. Откажитесь от ложных схем доставки, когда грузовики останавливаются за пределами городской черты, заставляя клиентов самостоятельно арендовать автопогрузчики и местный транспорт."
      }
    ]
  }
};

const CENTRAL_ASIA_LOCALIZED = CENTRAL_ASIA_DATA as Record<string, any>;
const centralAsiaLocaleConfig = {
  fr: {
    kazakhstan: { country: 'le Kazakhstan', destination: 'Almaty et Astana via Khorgos / Alashankou', compliance: 'UEE et TN VED', transitDays: '15 - 25 jours' },
    uzbekistan: { country: "l’Ouzbékistan", destination: 'Tachkent et les zones industrielles', compliance: 'douanières ouzbèkes', transitDays: '14 - 28 jours' },
  },
  es: {
    kazakhstan: { country: 'Kazajistán', destination: 'Almaty y Astaná vía Khorgos / Alashankou', compliance: 'UEE y TN VED', transitDays: '15 - 25 días' },
    uzbekistan: { country: 'Uzbekistán', destination: 'Taskent y las zonas industriales', compliance: 'aduaneros de Uzbekistán', transitDays: '14 - 28 días' },
  },
  ar: {
    kazakhstan: { country: 'كازاخستان', destination: 'ألماتي وأستانا عبر خورغوس / ألاشانكو', compliance: 'للاتحاد الاقتصادي الأوراسي وTN VED', transitDays: '15 - 25 يوماً' },
    uzbekistan: { country: 'أوزبكستان', destination: 'طشقند والمناطق الصناعية', compliance: 'الجمارك الأوزبكية', transitDays: '14 - 28 يوماً' },
  },
} as const;

for (const locale of ['fr', 'es', 'ar'] as const) {
  CENTRAL_ASIA_LOCALIZED.kazakhstan[locale] = createLocalizedShippingContent({
    locale,
    region: 'Central Asia',
    ...centralAsiaLocaleConfig[locale].kazakhstan,
  });
  CENTRAL_ASIA_LOCALIZED.uzbekistan[locale] = createLocalizedShippingContent({
    locale,
    region: 'Central Asia',
    ...centralAsiaLocaleConfig[locale].uzbekistan,
  });
  (UNIVERSAL_REDLINES as Record<string, any>)[locale] = createLocalizedShippingRedlines(locale);
}

const PAGE_LANG_DATA: Record<string, Record<string, any>> = {
  en: {
    heroTag: "CHINA TO CENTRAL ASIA SCM SPECIALIST",
    heroCta: "Get Route & Tariff Guidance",
    insureText: "Established in 1997 · China-origin logistics support",
    insightTag: "Border Operational Notice",
    insightTitle: "Horgos & Alashankou Gauge Reloading: Standard to Russian Broad Gauge",
    insightContent: "Central Asia uses a 1520mm broad-gauge railway system, while China uses 1435mm standard gauge. Containers transfer at border ports such as Horgos and Alashankou. Seasonal congestion can affect the schedule, so rail and trucking alternatives should be assessed against the cargo plan.",
    faqHeading: "Central Asia Clearance Checklist & FAQ",
    faqSubheading: "Proactive compliance checks to keep your cargo moving securely through Kazakhstan & Uzbekistan customs entry corridors.",
    formTitle: "Instant Central Asia Shipping Inquiry",
    formSub: "Submit your cargo details. Our route team will confirm the information needed to prepare a tailored quotation.",
    formLabelName: "Your Name",
    formLabelEmail: "Email Address",
    formLabelPhone: "WhatsApp / Phone",
    formLabelGoods: "Type of Goods / Volume",
    formLabelDest: "Destination",
    formCta: "Calculate My Shipping Tariff",
    formSuccess: "Thank you. Our Central Asia route team will review the cargo details and contact you using the information provided."
  },
  zh: {
    heroTag: "中国至中亚跨境物流专家",
    heroCta: "获取航线与税费规划建议",
    insureText: "中国始发物流协调支持",
    insightTag: "口岸边境换轨通报",
    insightTitle: "硬核科普：1435mm 标准轨 ➔ 1520mm 宽轨物理大换装",
    insightContent: "由于中亚五国与俄罗斯均采用 1520mm 宽轨，而中国境内使用的是 1435mm 标准轨，因此班列运行到新疆口岸（霍尔果斯/阿拉山口）时必须进行物理‘换轨换装’（通过口岸吊装龙门吊将集装箱整体吊换至哈方的宽轨列车上）。在货运旺季，口岸换装常因拥堵导致集装箱滞留。华正邦泰国际货运团队常驻新疆霍尔果斯，协调换轨优先吊装与运输安排。",
    faqHeading: "中亚清关合规与常见问题",
    faqSubheading: "提前排查中哈、中乌陆路和铁路口岸通关红线，确保大货安全顺利通关。",
    formTitle: "中亚物流专线专属询价",
    formSub: "请填写货物信息；我们将根据路线、货物和服务范围准备相应的询价建议。",
    formLabelName: "您的姓名",
    formLabelEmail: "电子邮箱",
    formLabelPhone: "联系电话 / 微信 / WhatsApp",
    formLabelGoods: "货物类型 / 件数 / 重量体积",
    formLabelDest: "目的国",
    formCta: "提交询价",
    formSuccess: "提交成功。我们的中亚项目团队将核对货物信息，并通过您提供的联系方式回复。"
  },
  ru: {
    heroTag: "КИТАЙ - ЦЕНТРАЛЬНАЯ АЗИЯ: ЭКСПЕРТЫ SCM",
    heroCta: "Получить бесплатный анализ тарифов",
    insureText: "29+ лет опыта в логистике между Китаем и Центральной Азией",
    insightTag: "Пограничное уведомление по операциям",
    insightTitle: "Смена колеи в Хоргосе и Алашанькоу: со стандартной на широкую русскую колею",
    insightContent: "В Центральной Азии используется широкая колея 1520 мм, а в Китае — стандартная 1435 мм. Из-за этой разницы все контейнеры необходимо перегружать на пограничных станциях (Хоргос и Алашанькоу). В пиковый сезон контейнеры могут простаивать неделями. DDNZ содержит собственные команды на границе, чтобы гарантировать приоритет перегрузки для наших клиентов.",
    faqHeading: "Комплаенс-контроль и FAQ по Центральной Азии",
    faqSubheading: "Проверки соответствия для беспрепятственного прохождения таможни в Казахстане и Узбекистане.",
    formTitle: "Запрос тарифа на доставку в Центральную Азию",
    formSub: "Заполните данные о вашем грузе. Наши эксперты по маршрутам подготовят тарифный план в течение 2 часов.",
    formLabelName: "Ваше имя",
    formLabelEmail: "Электронная почта",
    formLabelPhone: "WhatsApp / Телефон / Telegram",
    formLabelGoods: "Тип груза / Объем / Вес",
    formLabelDest: "Пункт назначения",
    formCta: "Рассчитать мой тариф на доставку",
    formSuccess: "Спасибо! Наш менеджер по логистике в Центральной Азии получил ваши данные и свяжется с вами в ближайшее время."
  }
};

Object.assign(PAGE_LANG_DATA, {
  fr: {
    ...PAGE_LANG_DATA.en,
    heroTag: "SPÉCIALISTE CHINE–ASIE CENTRALE",
    heroCta: "Obtenir une analyse d’itinéraire et de tarif",
    insureText: "Coordination logistique au départ de Chine depuis 1997",
    insightTag: "Alerte opérations frontalières",
    insightTitle: "Khorgos et Alashankou : passage de la voie standard à la voie large",
    insightContent: "La Chine utilise une voie de 1435 mm et l’Asie centrale une voie de 1520 mm. Le transbordement aux postes frontaliers doit être intégré au calendrier, notamment en haute saison.",
    faqHeading: "Contrôle douanier et FAQ Asie centrale",
    faqSubheading: "Vérifications documentaires pour les corridors du Kazakhstan et de l’Ouzbékistan.",
    formTitle: "Demande de cotation Asie centrale",
    formSub: "Transmettez les caractéristiques du fret afin de confirmer l’itinéraire et les éléments nécessaires au devis.",
    formLabelName: "Nom",
    formLabelEmail: "E-mail",
    formLabelPhone: "WhatsApp / Téléphone",
    formLabelGoods: "Type de marchandise / Volume / Poids",
    formLabelDest: "Destination",
    formCta: "Calculer mon tarif",
    formSuccess: "Merci. Notre équipe Asie centrale examinera les informations et vous contactera.",
  },
  es: {
    ...PAGE_LANG_DATA.en,
    heroTag: "ESPECIALISTA CHINA–ASIA CENTRAL",
    heroCta: "Obtener análisis de ruta y tarifa",
    insureText: "Coordinación logística desde China desde 1997",
    insightTag: "Aviso de operación fronteriza",
    insightTitle: "Khorgos y Alashankou: cambio de vía estándar a vía ancha",
    insightContent: "China utiliza vía de 1435 mm y Asia Central vía de 1520 mm. El transbordo fronterizo debe incluirse en el calendario, especialmente en temporada alta.",
    faqHeading: "Control aduanero y preguntas frecuentes de Asia Central",
    faqSubheading: "Revisiones documentales para los corredores de Kazajistán y Uzbekistán.",
    formTitle: "Solicitud de cotización para Asia Central",
    formSub: "Envíe los datos de la carga para confirmar la ruta y la información necesaria para cotizar.",
    formLabelName: "Nombre",
    formLabelEmail: "Correo electrónico",
    formLabelPhone: "WhatsApp / Teléfono",
    formLabelGoods: "Tipo de mercancía / Volumen / Peso",
    formLabelDest: "Destino",
    formCta: "Calcular mi tarifa",
    formSuccess: "Gracias. Nuestro equipo de Asia Central revisará los datos y se pondrá en contacto.",
  },
  ar: {
    ...PAGE_LANG_DATA.en,
    heroTag: "متخصص الشحن بين الصين وآسيا الوسطى",
    heroCta: "الحصول على تحليل المسار والتعرفة",
    insureText: "تنسيق لوجستي من الصين منذ 1997",
    insightTag: "تنبيه العمليات الحدودية",
    insightTitle: "خورغوس وألاشانكو: الانتقال من السكة القياسية إلى السكة العريضة",
    insightContent: "تستخدم الصين سكة بعرض 1435 مم بينما تستخدم آسيا الوسطى 1520 مم. يجب احتساب إعادة التحميل على الحدود ضمن الجدول، خصوصاً في موسم الذروة.",
    faqHeading: "التخليص والأسئلة الشائعة لآسيا الوسطى",
    faqSubheading: "مراجعات المستندات لمسارات كازاخستان وأوزبكستان.",
    formTitle: "طلب عرض شحن إلى آسيا الوسطى",
    formSub: "أرسل بيانات البضائع لتأكيد المسار والمعلومات المطلوبة للتسعير.",
    formLabelName: "الاسم",
    formLabelEmail: "البريد الإلكتروني",
    formLabelPhone: "واتساب / الهاتف",
    formLabelGoods: "نوع البضائع / الحجم / الوزن",
    formLabelDest: "الوجهة",
    formCta: "حساب التعرفة",
    formSuccess: "شكراً. سيراجع فريق آسيا الوسطى البيانات ويتواصل معك.",
  },
});

export default function ShippingCentralAsia() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const countryLabel = (country: 'kazakhstan' | 'uzbekistan') => {
    const names = {
      kazakhstan: { en: 'Kazakhstan', zh: '哈萨克斯坦', ru: 'Казахстан', fr: 'Kazakhstan', es: 'Kazajistán', ar: 'كازاخستان' },
      uzbekistan: { en: 'Uzbekistan', zh: '乌兹别克斯坦', ru: 'Узбекистан', fr: 'Ouzbékistan', es: 'Uzbekistán', ar: 'أوزبكستان' }
    } as const;
    return names[country][language];
  };
  
  const getCountryFromLocation = () => getShippingCountrySlug(
    location.pathname,
    location.search,
    ['kazakhstan', 'uzbekistan'],
    'kazakhstan',
  ) as 'kazakhstan' | 'uzbekistan';

  const [selectedCountry, setSelectedCountry] = useState<'kazakhstan' | 'uzbekistan'>(getCountryFromLocation);
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

  const handleCountryTabChange = (country: 'kazakhstan' | 'uzbekistan') => {
    setSelectedCountry(country);
    navigate(buildShippingCountryPath(location.pathname, country));
  };

  const activeLang = language === 'zh' ? 'zh' : (language === 'ru' ? 'ru' : language === 'fr' ? 'fr' : language === 'es' ? 'es' : language === 'ar' ? 'ar' : 'en');
  const getCountrySpec = (country: 'kazakhstan' | 'uzbekistan') =>
    CENTRAL_ASIA_DATA[country][activeLang] || CENTRAL_ASIA_DATA[country].en;
  const spec = getCountrySpec(selectedCountry);
  const t = (key: string) => {
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
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-[#d97706] shrink-0" />;
      case 'Scale': return <Scale className="w-5 h-5 text-[#d97706] shrink-0" />;
      case 'FileText': return <FileText className="w-5 h-5 text-[#d97706] shrink-0" />;
      case 'Search': return <Search className="w-5 h-5 text-[#d97706] shrink-0" />;
      default: return <Package className="w-5 h-5 text-[#d97706] shrink-0" />;
    }
  };

  const transportIcons = [Ship, Truck, Package, Package];

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
        destination: selectedCountry === 'kazakhstan' ? 'Kazakhstan' : 'Uzbekistan'
      });
    }, 1200);
  };

  const redlines = UNIVERSAL_REDLINES[activeLang] || UNIVERSAL_REDLINES.en;

  return (
    <div className="ddnz-home min-h-screen hb-region-shell font-sans overflow-x-hidden">
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
        
        {/* Section 1: Hero Segment */}
        <section className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
          {/* Visual shipping backdrop layer */}
          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000" 
              alt="Central Asia Railway Port"
              width="2000"
              height="1125"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071A33] via-[#071A33]/80 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 md:py-24">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 pb-16">
              
              {/* 左侧文案区：占据 7 列 */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d97706]/10 text-[#d97706] text-xs font-black tracking-widest uppercase self-start">
                    <span>{t('heroTag')}</span>
                  </div>
                  
                  {/* Dynamic Country Selector Tabs */}
                  {!isLocked && (
                    <div className="flex flex-wrap gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.08] max-w-fit">
                      {(['kazakhstan', 'uzbekistan'] as const).map((country) => {
                        const isActive = selectedCountry === country;
                        const label = countryLabel(country);
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
                    {spec.headline}
                  </span>
                </h1>
                
                <div className="space-y-4">
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                    {spec.subheadline}
                  </p>
                  
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      {language === 'zh' ? '合规文件审核支持' : 'Compliance Review Support'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d97706]/10 border border-[#d97706]/20 text-xs font-bold text-[#d97706]">
                      <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                      {language === 'zh' ? '口岸操作协调' : 'Border Operations Coordination'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
                      <Truck className="w-3.5 h-3.5" aria-hidden="true" />
                      {language === 'zh' ? '一站式 DDP / DDU 双清' : 'One-Stop DDP/DDU'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      const formElem = document.getElementById('central-asia-quote-form');
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

                <div className="flex items-center gap-3 pt-6 border-t border-white/[0.08] max-w-lg">
                  <Globe className="w-4 h-4 text-sky-300 shrink-0" aria-hidden="true" />
                  <p className="text-xs text-slate-400 font-medium">
                    {t('insureText')}
                  </p>
                </div>
              </div>

              {/* 右侧硬核时效侧边栏：占据 5 列 */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-lg font-black tracking-wide text-[#d97706] uppercase mb-2">
                  {language === 'zh' ? '中亚专线真实货运时效' : (language === 'ru' ? 'Сроки доставки в Центральную Азию' : 'Central Asia Express Transit Windows')}
                </h3>
                
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-5 rounded-2xl flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-black text-white">{language === 'zh' ? '阿拉木图铁运双清专线 (霍尔果斯口岸)' : (language === 'ru' ? 'Блок-поезд в Алматы (граница Хоргос)' : 'Almaty Block Train (Horgos Border)')}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{language === 'zh' ? '1520mm 宽轨直达铁路，免二次换装' : (language === 'ru' ? 'Прямая широкая колея 1520 мм' : 'Direct Broad Gauge 1520mm Rail')}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#FFB55F] whitespace-nowrap"><Timer className="w-4 h-4" aria-hidden="true" />{getCountrySpec('kazakhstan').transitDays}</span>
                  </div>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-5 rounded-2xl flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-black text-white">{language === 'zh' ? '塔什干公路汽运双清专线 (阿拉山口口岸)' : (language === 'ru' ? 'Трансграничные автоперевозки в Ташкент' : 'Tashkent Cross-Border Trucking')}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{language === 'zh' ? '霍尔果斯/阿拉山口极速卡航直达' : (language === 'ru' ? 'Быстрый транзит по шоссе через Алашанькоу' : 'Rapid Highway Transit via Alashankou')}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#FFB55F] whitespace-nowrap"><Timer className="w-4 h-4" aria-hidden="true" />{getCountrySpec('uzbekistan').transitDays}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <MarketSourcingHandoff destination={countryLabel(selectedCountry)} />

        {/* Section 2: Border Operational Reality Update (Market Insight Box) */}
        <section className="py-12 bg-[#081E39] border-y border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white/[0.02] rounded-2xl border-l-8 border-[#d97706] p-6 md:p-8 shadow-md border border-white/[0.08]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#d97706]/10 text-[#d97706]">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] tracking-widest font-black uppercase text-[#d97706]">
                    {t('insightTag')}
                  </span>
                  <h2 className="text-lg md:text-xl font-black text-white leading-tight">
                    {t('insightTitle')}
                  </h2>
                </div>
              </div>
              
              <p className="text-sm text-slate-300 leading-relaxed font-semibold mb-2">
                {t('insightContent')}
              </p>
              
              <div className="mt-4 flex items-center gap-2 text-xs font-black text-slate-400">
                <Globe className="w-3.5 h-3.5 text-sky-300" aria-hidden="true" />
                <span>Heaven Born Logistics Insight</span>
                <span>2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2.5: Interactive Lead-Generation Table (核心时效透视数据表) */}
        <section className="py-16 border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="px-3 py-1 bg-[#d97706]/10 text-[#FFB55F] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-flex items-center gap-1.5">
                <ChartNoAxesCombined className="w-3.5 h-3.5" aria-hidden="true" />
                {{
                  en: 'SCM Lead-Time Matrix',
                  zh: '核心时效透视',
                  ru: 'Матрица сроков доставки',
                  fr: 'Matrice des délais',
                  es: 'Matriz de tiempos',
                  ar: 'مصفوفة المدد',
                }[activeLang]}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-4">
                {{
                  en: 'Central Asia Multimodal Lead-Time Matrix',
                  zh: '中亚多式联运全通道时效数据表',
                  ru: 'Сроки мультимодальных перевозок по Центральной Азии',
                  fr: 'Délais du transport multimodal en Asie centrale',
                  es: 'Tiempos del transporte multimodal en Asia Central',
                  ar: 'مدد النقل متعدد الوسائط في آسيا الوسطى',
                }[activeLang]}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-sky-400 to-[#d97706] mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-sm font-semibold">
                {language === 'zh' 
                  ? '精细对齐各物理运输通道，深剖各链路核心工艺，帮助您合理配载预算与刚性时效期。' 
                  : 'Compare transportation pathways with fine alignment on shipping windows, core technical features, and risk pre-warnings.'}
              </p>
            </div>

            {/* Interactive Grid & Detail Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: The Menu of Transport Options */}
              <div className="lg:col-span-5 space-y-3">
                {spec.multimodalTable && spec.multimodalTable.map((row: any, idx: number) => {
                  const isSelected = activeTransportMode === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveTransportMode(idx)}
                      className={`w-full p-5 rounded-2xl text-left border transition-all duration-300 flex items-center justify-between ${
                        isSelected 
                          ? 'bg-gradient-to-r from-[#0E4C78] to-[#d97706]/35 text-white border-[#d97706]/30 shadow-xl translate-x-1'
                          : 'bg-white/[0.02] text-slate-300 border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {(() => {
                          const ModeIcon = transportIcons[idx] || Package;
                          return <ModeIcon className="w-5 h-5 text-sky-300 shrink-0" aria-hidden="true" />;
                        })()}
                        <div>
                          <h4 className="text-sm font-black tracking-tight text-white">
                            {row.mode.replace(/^\S+\s+/, '')}
                          </h4>
                          <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                            {language === 'zh' ? '预计时效' : 'Transit Window'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-base font-bold text-white">
                          {row.days}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Detailed Blueprint & Diagnostic Card */}
              <div className="lg:col-span-7">
                {spec.multimodalTable && spec.multimodalTable[activeTransportMode] && (
                  <div className="bg-white/[0.02] backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/[0.08] shadow-lg relative overflow-hidden min-h-[380px] flex flex-col justify-between">
                    <div className="relative z-10 space-y-6">
                      <div>
                        <span className="px-2.5 py-1 bg-[#d97706]/10 text-[#d97706] text-[10px] font-black uppercase tracking-wider rounded-lg">
                          {language === 'zh' ? '深度解析' : 'SCM Detail Panel'}
                        </span>
                        <h3 className="text-xl md:text-2xl font-black text-white mt-2">
                          {spec.multimodalTable[activeTransportMode].mode.replace(/^\S+\s+/, '')}
                        </h3>
                        <p className="text-[#FFB55F] text-sm font-black mt-1 inline-flex items-center gap-1.5">
                          <Timer className="w-4 h-4" aria-hidden="true" />{language === 'zh' ? '货主到门时效' : 'Door-to-Door Window'}: <span className="font-mono text-base font-bold text-white">{spec.multimodalTable[activeTransportMode].days}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div>
                          <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 inline-flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-sky-300" aria-hidden="true" />{language === 'zh' ? '最适用货品 / 场景' : 'Best Suited For'}
                          </h5>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                            {spec.multimodalTable[activeTransportMode].suitability}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-[#FFB55F] uppercase tracking-widest mb-1.5 inline-flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />{language === 'zh' ? '华正邦泰专线技术要点' : 'Heaven Born Route Advantages'}
                          </h5>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                            {spec.multimodalTable[activeTransportMode].sellingPoint}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-rose-950/20 rounded-2xl border border-rose-900/30 flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-xs font-black text-rose-200 uppercase tracking-wider mb-0.5">
                            {language === 'zh' ? '风险提示 & 操作合规' : 'Operation Pre-Warnings'}
                          </h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            {spec.multimodalTable[activeTransportMode].warning}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                      <span className="text-xs text-slate-400 font-bold">
                        * {language === 'zh' ? '上述时效基于我司真实运输台账，受季节性换装及边境偶发排队影响可能有微调。' : 'Data based on historical shipping registries, subject to seasonal border queue variance.'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const targetForm = document.getElementById('central-asia-quote-form');
                          if (targetForm) {
                            targetForm.scrollIntoView({ behavior: 'smooth' });
                            trackEvent('lead_table_cta_click', { mode: spec.multimodalTable[activeTransportMode].mode, selectedCountry });
                          }
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#0E4C78] to-[#d97706] hover:opacity-90 text-white text-xs font-black tracking-widest uppercase rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-950/30 active:scale-95 transition-all self-start sm:self-center"
                      >
                        <span>{language === 'zh' ? '获取该渠道即时运价' : 'Get Cost Analysis'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Section 3: Compliance & Solutions Grid */}
        <section className="py-16 md:py-24 border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="px-3 py-1 bg-[#d97706]/10 text-[#d97706] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                {language === 'zh'
                  ? `${countryLabel(selectedCountry)}合规`
                  : language === 'ru'
                    ? `Соответствие: ${countryLabel(selectedCountry)}`
                    : language === 'fr'
                      ? `Conformité : ${countryLabel(selectedCountry)}`
                      : language === 'es'
                        ? `Conformidad: ${countryLabel(selectedCountry)}`
                        : language === 'ar'
                          ? `الامتثال: ${countryLabel(selectedCountry)}`
                          : `${countryLabel(selectedCountry)} Compliance`}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-4">
                {spec.solutionsTitle}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-sky-400 to-[#d97706] mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-sm sm:text-base font-medium">
                {spec.solutionsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {spec.solutions.map((item, idx) => (
                <div key={idx} className="bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.04] flex flex-col justify-between group">
                  <div>
                    <div className="bg-[#d97706]/10 p-3 rounded-xl inline-block mb-4">
                      {getIcon(item.icon)}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center gap-2 text-xs font-bold text-[#d97706]">
                    <span>{language === 'zh' ? '申请专项预审' : 'Request File Pre-Audit'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Universal Avoid-Pitfall / Operation Redlines (Persistent Bottom Section) */}
        <section className="py-16 md:py-24 border-b border-white/[0.05] bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="px-3 py-1 bg-[#d97706]/10 text-[#d97706] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                {language === 'zh' ? '避坑指南' : 'SCM Redlines'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                {redlines.title}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-sky-400 to-[#d97706] mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-sm sm:text-base font-medium">
                {redlines.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {redlines.items.map((item) => (
                <div key={item.id} className="bg-white/[0.02] backdrop-blur-md rounded-2xl p-8 border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 text-white/5 font-black text-6xl select-none leading-none opacity-40 group-hover:opacity-60 transition-opacity">
                    {item.id}
                  </div>
                  <div className="flex items-center gap-2 text-[#d97706] font-black mb-4 text-sm sm:text-base">
                    <ShieldAlert className="w-6 h-6 text-[#d97706] flex-shrink-0" />
                    <h3 className="text-white">{item.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium relative z-10">
                    {item.desc}
                  </p>
                </div>
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
              <div className="w-10 h-1 bg-gradient-to-r from-sky-400 to-[#d97706] mx-auto rounded-full mb-6" />
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
                      className="w-full flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b] focus-visible:ring-offset-4 focus-visible:ring-offset-[#071a33]"
                    >
                      <span className="text-sm md:text-base font-black text-white pr-4">
                        {faq.q}
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
        <section id="central-asia-quote-form" className="py-16 md:py-24 border-t border-white/[0.05]">
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

      </main>

      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
    </div>
  );
}
