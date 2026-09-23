import CountryCargoPlanning from '../features/freight/CountryCargoPlanning';
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
const CENTRAL_ASIA_DATA = {
  kazakhstan: {
    en: {
      seoTitle: "China to Central Asia Freight Forwarding Guide | DDNZ Global",
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
      seoTitle: "Доставка из Китая в Казахстан | DDNZ Global",
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
          desc: "Колея в Китае составляет 1435 мм, а в Казахстане 1520 мм. Контейнеры проходят перегрузку на пограничных пунктах, включая Хоргос и Алашанькоу; мы координируем план маршрута и документы с учётом работы границы.",
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
          sellingPoint: "Подходит для срочного груза, когда подтверждены рейс, прием товара и условия выдачи в аэропорту Алматы.",
          warning: "Проводится строгая проверка литиевых батарей, жидкостей и порошков."
        },
        {
          mode: "Автоперевозки (Режим перецепки полуприцепов)",
          days: "5 - 12 дней",
          suitability: "Рекомендуется для партий около 5 тонн; высокая гибкость по сравнению с ж/д контейнерами.",
          sellingPoint: "Схема перецепки может сократить число операций на подходящих маршрутах. Итоговый план зависит от границы, груза и условий перевозчика.",
          warning: "Применяются ограничения по осевой нагрузке и дорожные проверки. Погрузку и маршрут следует подтвердить до отправки."
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
          sellingPoint: "Вариант для легких потребительских отправлений, когда товар принимается выбранным каналом.",
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
      seoTitle: "Shipping from China to Uzbekistan | DDNZ Global",
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
      seoTitle: "Доставка из Китая в Узбекистан | DDNZ Global",
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
          sellingPoint: "Перецепка и доставка до двери оцениваются по выбранной границе, грузу и фактическому объему услуги в пункте назначения.",
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
          sellingPoint: "Вариант для легких потребительских отправлений при подтвержденном приеме товара перевозчиком и каналом назначения.",
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
        title: "Реальные решения от двери до двери DDP/DDU",
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
  const spec = getCountrySpec(selectedCountry);
  const corridor = localizedCorridorProfile(selectedCountry, activeLang);
  const corridorUi = EURASIA_UI[activeLang];
  const delayDiagnostic = EURASIA_DELAY_DIAGNOSTIC[activeLang];
  const caseStudy = EURASIA_WHEEL_HUB_CASE[activeLang];
  const chemicalCase = EURASIA_CHEMICAL_CASE[activeLang];
  const uzbekistanRoadCase = UZBEKISTAN_ROAD_CASE[activeLang];
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

        <section className="relative min-h-[660px] flex items-center overflow-hidden border-b border-white/[0.08]">
          <img
            src="/images/operations/china-eurasia-rail-border-hero-v1.webp"
            alt=""
            width="1920"
            height="1080"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(39,33,47,.98)_0%,rgba(39,33,47,.91)_43%,rgba(39,33,47,.46)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#27212f] to-transparent" />

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
                <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-[#f2a47f]">{corridorUi.regionTag}</p>
                <h1 className="max-w-[16ch] text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                  {spec.headline}
                </h1>
                <p className="mt-6 max-w-[60ch] text-base font-medium leading-relaxed text-slate-200 sm:text-lg">
                  {spec.subheadline}
                </p>
                <button
                  type="button"
                  onClick={() => document.getElementById('central-asia-quote-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-8 inline-flex min-h-12 items-center gap-2 bg-[#c94f2f] px-6 py-3 text-sm font-black text-white transition hover:bg-[#b94625] active:translate-y-px"
                >
                  <span>{t('heroCta')}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <aside className="border border-white/[0.14] bg-[#071a33]/88 p-6 shadow-[0_24px_80px_rgba(2,12,27,.35)] backdrop-blur-md sm:p-7" aria-label={corridorUi.routeBasis}>
                <div className="flex items-start justify-between gap-5 border-b border-white/[0.12] pb-5">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#f2a47f]">{corridorUi.routeBasis}</span>
                    <h2 className="mt-2 text-2xl font-black text-white">{corridor.name}</h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-sm font-bold text-white"><Timer className="h-4 w-4 text-[#f2a47f]" aria-hidden="true" />{corridor.transitDays}</span>
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

        <MarketSourcingHandoff destination={countryLabel(selectedCountry)} />

        <FreightRouteMap variant={selectedCountry === 'uzbekistan' ? 'uzbekistan' : 'central-asia'} />

        <section className="border-b border-white/[0.08] bg-[#081e39]/45 py-14 md:py-20" aria-labelledby="eurasia-destinations-title">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 id="eurasia-destinations-title" className="text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">{corridorUi.destinationMatrix}</h2>
              <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-300 md:text-base">{corridorUi.destinationMatrixIntro}</p>
            </div>
            <div className="mt-10 grid border-t border-white/[0.14] md:grid-cols-2">
              {EURASIA_COUNTRIES.map((country, index) => {
                const item = localizedCorridorProfile(country, activeLang);
                const isActive = country === selectedCountry;
                return (
                  <button
                    key={country}
                    type="button"
                    onClick={() => handleCountryTabChange(country)}
                    className={`group grid min-h-32 grid-cols-[minmax(0,1fr)_auto] gap-6 border-b border-white/[0.12] px-1 py-6 text-left transition-colors md:px-6 ${index % 2 === 0 ? 'md:border-r' : ''} ${isActive ? 'bg-[#c94f2f]/12' : 'hover:bg-white/[0.035]'}`}
                  >
                    <span>
                      <span className={`block text-lg font-black ${isActive ? 'text-[#f2a47f]' : 'text-white'}`}>{item.name}</span>
                      <span className="mt-2 block text-xs leading-relaxed text-slate-400">{item.gateway}</span>
                    </span>
                    <span className="flex flex-col items-end justify-between text-right">
                      <span className="font-mono text-xs font-bold text-slate-200">{item.transitDays}</span>
                      <ArrowUpRight className={`h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${isActive ? 'text-[#f2a47f]' : 'text-slate-500'}`} aria-hidden="true" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#081E39] py-16 md:py-24" aria-labelledby="eurasia-delay-title">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,.95fr)] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f2a47f]">{delayDiagnostic.scope}</p>
                <h2 id="eurasia-delay-title" className="mt-4 text-3xl font-black leading-[1.05] tracking-[-0.045em] text-white md:text-5xl">{delayDiagnostic.title}</h2>
                <p className="mt-5 max-w-[66ch] text-sm font-medium leading-relaxed text-slate-300 md:text-base">{delayDiagnostic.intro}</p>
              </div>
              <div className="border-y border-white/[0.14] font-mono text-xs font-bold">
                <div className="grid grid-cols-[32px_1fr] gap-3 border-b border-white/[0.12] py-4 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  <span>{delayDiagnostic.faster}</span>
                </div>
                <div className="grid grid-cols-[32px_1fr] gap-3 py-4 text-[#f2a47f]">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  <span>{delayDiagnostic.slower}</span>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-white/[0.16]">
              {delayDiagnostic.items.map((item, index) => {
                const DiagnosticIcon = [Scale, TrainFront, FileText, ShieldCheck, Globe][index] || Route;
                return (
                  <article key={item.title} className="grid gap-4 border-b border-white/[0.12] py-7 md:grid-cols-[48px_minmax(200px,.65fr)_minmax(0,1.35fr)] md:gap-7">
                    <DiagnosticIcon className="h-5 w-5 text-[#f2a47f]" aria-hidden="true" />
                    <h3 className="text-base font-black text-white md:text-lg">{item.title}</h3>
                    <div>
                      <p className="text-sm font-medium leading-relaxed text-slate-300">{item.body}</p>
                      <p className="mt-3 border-l-2 border-[#c94f2f] pl-3 text-xs font-bold leading-relaxed text-slate-400">{item.check}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-12 bg-[#c94f2f] p-6 text-white md:p-8">
              <h3 className="max-w-3xl text-xl font-black tracking-[-0.025em] md:text-2xl">{delayDiagnostic.questionsTitle}</h3>
              <div className="mt-7 grid border-t border-white/35 md:grid-cols-3">
                {delayDiagnostic.questions.map((question, index) => (
                  <p key={question} className={`py-5 text-sm font-bold leading-relaxed md:px-6 ${index > 0 ? 'border-t border-white/35 md:border-l md:border-t-0' : ''}`}>{question}</p>
                ))}
              </div>
              <p className="border-t border-white/35 pt-5 text-xs font-semibold leading-relaxed text-orange-50">{delayDiagnostic.closing}</p>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] py-12" aria-labelledby="eurasia-evidence-title">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(250px,.7fr)_minmax(0,1.3fr)] lg:px-8">
            <div>
              <h2 id="eurasia-evidence-title" className="text-2xl font-black tracking-[-0.035em] text-white">{corridorUi.routeEvidence}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{corridorUi.routeEvidenceBody}</p>
            </div>
            <div className="divide-y divide-white/[0.12] border-y border-white/[0.12]">
              {[
                { label: corridorUi.sourceEaeu, href: 'https://eec.eaeunion.org/en/news/01-01-2015-1/' },
                { label: corridorUi.sourceTir, href: 'https://unece.org/es/node/350813' },
                { label: delayDiagnostic.sourceCarec, href: 'https://cpmm.carecprogram.org/2023-report/kazakhstan/' },
                { label: delayDiagnostic.sourceKazakhstanCustoms, href: 'https://www.gov.kz/services/3635?lang=en' },
                { label: delayDiagnostic.sourceUzbekistanCustoms, href: 'https://sw2.customs.uz/?lang=en_EN' },
                { label: corridorUi.sourceRussia, href: 'https://www.bis.gov/licensing/country-guidance' },
              ].map((source) => (
                <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="group flex min-h-14 items-center justify-between gap-4 py-3 text-sm font-bold text-slate-200 transition-colors hover:text-[#f2a47f]">
                  <span>{source.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-slate-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#f2a47f]" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2.5: Interactive Lead-Generation Table (核心时效透视数据表) */}
        <section className="py-16 border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white md:text-4xl">{corridorUi.modesTitle}</h2>
              <p className="mt-4 max-w-[65ch] text-sm font-medium leading-relaxed text-slate-400 md:text-base">{corridorUi.modesIntro}</p>
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
                          ? 'bg-gradient-to-r from-[#763c9c] to-[#c94f2f]/35 text-white border-[#c94f2f]/30 shadow-xl translate-x-1'
                          : 'bg-white/[0.02] text-slate-300 border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {(() => {
                          const ModeIcon = transportIcons[idx] || Package;
                          return <ModeIcon className="w-5 h-5 text-sky-300 shrink-0" aria-hidden="true" />;
                        })()}
                        <div>
                          <h4 className="text-sm font-black tracking-tight text-white">{row.mode}</h4>
                          <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>{corridorUi.planningWindow}</span>
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
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#f2a47f]">{corridorUi.routeDetail}</span>
                        <h3 className="text-xl md:text-2xl font-black text-white mt-2">
                          {spec.multimodalTable[activeTransportMode].mode}
                        </h3>
                        <p className="text-[#F2A47F] text-sm font-black mt-1 inline-flex items-center gap-1.5">
                          <Timer className="w-4 h-4" aria-hidden="true" />{corridorUi.planningWindow}: <span className="font-mono text-base font-bold text-white">{spec.multimodalTable[activeTransportMode].days}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div>
                          <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 inline-flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-sky-300" aria-hidden="true" />{corridorUi.bestFor}
                          </h5>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                            {spec.multimodalTable[activeTransportMode].suitability}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-[#F2A47F] uppercase tracking-widest mb-1.5 inline-flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />{corridorUi.operatingPoint}
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
                            {corridorUi.riskControl}
                          </h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            {spec.multimodalTable[activeTransportMode].warning}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                      <span className="text-xs text-slate-400 font-bold">
                        {corridorUi.quoteConfirmed}
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
                        className="px-5 py-2.5 bg-gradient-to-r from-[#763c9c] to-[#c94f2f] hover:opacity-90 text-white text-xs font-black tracking-widest uppercase rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-950/30 active:scale-95 transition-all self-start sm:self-center"
                      >
                        <span>{corridorUi.requestMode}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
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
              <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white md:text-4xl">{spec.solutionsTitle}</h2>
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

        {/* Section 4: Universal Avoid-Pitfall / Operation Redlines (Persistent Bottom Section) */}
        <section className="py-16 md:py-24 border-b border-white/[0.05] bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white md:text-4xl">{redlines.title}</h2>
              <p className="mt-4 max-w-[65ch] text-sm font-medium leading-relaxed text-slate-400 md:text-base">{redlines.subtitle}</p>
            </div>

            <div className="border-y border-white/[0.12]">
              {redlines.items.map((item) => (
                <article key={item.id} className="grid gap-4 border-b border-white/[0.12] py-7 last:border-b-0 md:grid-cols-[52px_minmax(220px,.7fr)_minmax(0,1.3fr)] md:items-start md:gap-7">
                  <ShieldAlert className="h-6 w-6 text-[#c94f2f]" aria-hidden="true" />
                  <h3 className="text-base font-black text-white md:text-lg">{item.title}</h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-400">{item.desc}</p>
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

      <CountryCargoPlanning country={selectedCountry} countryName={countryLabel(selectedCountry)} />
      </main>

      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
    </div>
  );
}
