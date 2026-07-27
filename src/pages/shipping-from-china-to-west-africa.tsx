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
  Globe, Clock, HelpCircle, Plane, FileText, Scale, ArrowUpRight, Truck
} from 'lucide-react';
import { trackEvent } from '../lib/utils';
import { buildShippingCountryPath, getShippingCountrySlug } from '../utils/shippingCountryRoutes';
import { createLocalizedShippingContent, createLocalizedShippingRedlines } from '../utils/localizedShippingContent';

// Multi-language strings for West Africa countries
const WEST_AFRICA_DATA = {
  nigeria: {
    en: {
      seoTitle: "China to Nigeria Freight Forwarding Guide | Heaven Born",
      seoDesc: "Sea and air freight planning from China to Lagos, including consolidation and support for Form M, PAAR and SONCAP document coordination.",
      headline: "Sea & Air Freight to Nigeria (Lagos) | SONCAP & Form M Documentation Support",
      subheadline: "Consolidation from China to Lagos Apapa and Tin Can ports, with SONCAP, Form M, and destination clearance coordination based on the confirmed service scope.",
      transitWindow: "Nigeria Transit Windows",
      transitDays: "35 - 45 Days",
      complianceRowTitle: "Form M, PAAR & SONCAP Document Review",
      complianceRowVal: "Before Booking",
      solutionsTitle: "Nigeria SCM Compliance Solutions",
      solutionsSubtitle: "Tailored logistics paths designed to overcome customs valuations, certification hurdles, and port congestions.",
      solutions: [
        {
          title: "Three-Step SONCAP Certification Rule",
          desc: "Before shipment, confirm the applicable Product Certificate (PC), Form M, PAAR, and shipment-specific SONCAP Certificate (SC) requirements with the importer and relevant service partners.",
          icon: "ShieldCheck"
        },
        {
          title: "Mandatory Pre-Shipment ECTN/CTN",
          desc: "Nigeria may require an Electronic Cargo Tracking Note (ECTN/CTN) before departure. Confirm the current issuance timing and Bill of Lading requirements before the cargo is loaded.",
          icon: "FileText"
        },
        {
          title: "Under-Declaration Risk Containment",
          desc: "Use accurate commercial values and supporting documents. We can help review the shipment data with the importer and destination clearance partner before export.",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "Ocean Freight (LCL/FCL)",
          days: "35 - 45 Days",
          suitability: "Best for commercial inventory, manufacturing equipment, and heavy volume machinery.",
          sellingPoint: "Routes from South China ports to Lagos Apapa and Tin Can Island are assessed against current sailing schedules and cargo requirements.",
          warning: "Lagos Port congestion can affect berthing and release times. Allow contingency time and confirm document readiness with the destination clearance partner."
        },
        {
          mode: "Air Freight Express",
          days: "5 - 12 Working Days",
          suitability: "Ideal for high-value consumer electronics, auto parts, fashion garments, and urgent samples.",
          sellingPoint: "Air routing is planned through available direct or connecting services to Lagos (LOS), subject to schedule and commodity acceptance.",
          warning: "General air cargo clears in 5-12 days; sensitive shipments (built-in lithium batteries, electronics, phones, cosmetics) must travel via specialized channels taking 11-16 days."
        }
      ],
      faqs: [
        {
          q: "What is the relation between Form M, PAAR, and SONCAP in Nigeria?",
          a: "Form M, PAAR and SONCAP-related documents can apply depending on the product and import transaction. Before booking, ask the importer and qualified destination advisers to confirm the current sequence, scope and documents for the shipment."
        },
        {
          q: "When must the CTN (Cargo Tracking Note) be applied for?",
          a: "Nigeria’s ECTN process and Bill of Lading data requirements should be confirmed before the Bill of Lading is finalized. Keep the commercial invoice, packing list, transport document and ECTN data consistent."
        },
        {
          q: "How should shippers plan for Lagos port congestion and demurrage?",
          a: "Lagos congestion can vary by season and terminal. Confirm the carrier's free-time terms, document requirements, and destination handling plan before departure, then include a reasonable schedule buffer."
        }
      ]
    },
    zh: {
      seoTitle: "中国到尼日利亚（拉各斯 Lagos）海运整柜拼箱与空运 DDP | SONCAP 文件支持 | 华正邦泰国际货运",
      seoDesc: "中国到尼日利亚拉各斯的海运、空运与集货规划，支持 SONCAP、Form M、PAAR 等进口文件的出运前核对。",
      headline: "中国到尼日利亚（拉各斯 Lagos）海运/空运：SONCAP 与 Form M 文件协调支持",
      subheadline: "提供中国集货、出运资料核对以及与目的地清关合作方的服务衔接，协助进口商梳理清关所需文件。",
      transitWindow: "尼日利亚专线预计时效",
      transitDays: "35 - 45 天",
      complianceRowTitle: "Form M、PAAR 与 SONCAP 文件核对",
      complianceRowVal: "订舱前核对",
      solutionsTitle: "尼日利亚专线合规解决方案",
      solutionsSubtitle: "围绕进口文件、申报货值与港口操作要求，提供出运前资料核对与目的地操作协调。",
      solutions: [
        {
          title: "三步法 SONCAP 铁律风控",
          desc: "出运前可协助进口商梳理清关链条：PC 证书（产品注册）、Form M、PAAR 与单批次 SC 清关证书的适用要求应逐项确认。",
          icon: "ShieldCheck"
        },
        {
          title: "装船前强制 ECTN/CTN",
          desc: "ECTN/CTN 货物跟踪单的申请时间与提单标注方式，应在装船前向承运人及目的地合作方确认。",
          icon: "FileText"
        },
        {
          title: "严打低报货值估价预审",
          desc: "请使用真实、可支持的商业货值和单证。我们可在出运前协助核对货物资料，并与进口商及目的地清关合作方沟通。",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "经典海运整箱/拼箱 (LCL/FCL)",
          days: "35 - 45 天",
          suitability: "适合商业库存、大型工业机械、建筑材料及大宗散货。",
          sellingPoint: "可根据当前船期、货物资料和目的港操作范围，规划从华南港口至 Apapa / Tin Can 的出运方案。",
          warning: "拉各斯港口操作可能影响靠泊和放行；建议预留缓冲时间，并在出运前与目的地清关合作方核对资料。"
        },
        {
          mode: "空运双清专线 (Air)",
          days: "5 - 12 工作日",
          suitability: "适合高价值电子产品、手机配件、化妆品样品及加急商业大货。",
          sellingPoint: "中国始发，直飞或通过中东迪拜、欧洲枢纽中转直达拉各斯机场（LOS）。",
          warning: "带电产品、手机、化妆品等货物可能需要特定承运渠道；实际时效与资料要求应在起运前确认。"
        }
      ],
      faqs: [
        {
          q: "尼日利亚清关的 Form M、PAAR 和 SONCAP 是什么关系？",
          a: "Form M、PAAR 和 SONCAP/相关合格评定文件可能适用于不同货物及进口情形。请在装运前由进口商和目的地合格专业机构确认当前要求、文件顺序及适用范围。"
        },
        {
          q: "ECTN/CTN 货物跟踪单必须在什么时候申请？",
          a: "ECTN/CTN 的适用范围和办理时间应在订舱前确认。请将其与提单、商业发票和装箱单中的货物资料逐项核对。"
        },
        {
          q: "DDNZ 针对拉各斯常态化塞港有什么对应的保障方案？",
          a: "拉各斯港口条件会随季节和码头变化。请在出运前确认船公司的免箱条款、文件要求和目的港操作计划，并在运输计划中预留合理缓冲。"
        }
      ]
    },
    fr: {
      seoTitle: "Fret de Chine vers le Nigeria | Heaven Born",
      seoDesc: "Planification maritime, aérienne et documentaire de Chine vers le Nigeria, avec vérification préalable des exigences d’importation.",
      headline: "Fret maritime et aérien de Chine vers le Nigeria",
      subheadline: "Planification habituelle de 35–45 jours par mer, avec vérification documentaire Form M, PAAR, SONCAP et ECTN/CTN selon la marchandise et les exigences applicables.",
      transitWindow: "Délais de transit habituels vers le Nigeria",
      transitDays: "35 - 45 Jours",
      complianceRowTitle: "Validation Form M & PAAR",
      complianceRowVal: "Avant réservation",
      solutionsTitle: "Solutions de conformité SCM Nigeria",
      solutionsSubtitle: "Canaux logistiques sur mesure pour surmonter les évaluations douanières, les barrières de certification et les congestions portuaires.",
      solutions: [
        {
          title: "Processus de certification SONCAP",
          desc: "Les exigences SONCAP, Form M et PAAR dépendent notamment de la marchandise, de l’importateur et du régime applicable. Nous vérifions les documents requis avant réservation avec l’importateur et les partenaires concernés.",
          icon: "ShieldCheck"
        },
        {
          title: "Vérification ECTN/CTN avant départ",
          desc: "Lorsque l’ECTN/CTN s’applique, les données doivent être cohérentes avec le connaissement, la facture commerciale et la liste de colisage. Nous confirmons son applicabilité et la procédure avant expédition.",
          icon: "FileText"
        },
        {
          title: "Sécurisation contre la sous-évaluation",
          desc: "Les incohérences entre facture, classement, quantité et valeur peuvent entraîner un examen supplémentaire. Nous aidons à rapprocher les documents commerciaux et de transport avant le départ.",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "Fret Maritime (LCL/FCL)",
          days: "35 - 45 Jours",
          suitability: "Idéal pour les stocks commerciaux, les équipements industriels et les frets lourds.",
          sellingPoint: "POL : Guangzhou, Nansha, ou Shenzhen vers Lagos Apapa / Tin Can Island. Départs réguliers.",
          warning: "Les opérations portuaires, la disponibilité du navire et le dédouanement peuvent modifier le calendrier. Confirmez les jours de franchise et les conditions du transporteur au moment de la réservation."
        },
        {
          mode: "Fret Aérien Express",
          days: "5 - 12 Jours Ouvrables",
          suitability: "Idéal pour l'électronique haut de gamme, les pièces détachées auto et les échantillons urgents.",
          sellingPoint: "Connexions de fret aérien directes vers l'aéroport de Lagos (LOS).",
          warning: "Le fret général prend de 5 à 12 jours; les produits à batterie lithium, téléphones et cosmétiques nécessitent un canal spécial de 11 à 16 jours."
        }
      ],
      faqs: [
        {
          q: "Quelle est la relation entre Form M, PAAR et SONCAP ?",
          a: "Ces documents peuvent intervenir dans le processus d’importation selon le produit et le régime applicable. Avant expédition, confirmez avec l’importateur les documents, la partie responsable et l’ordre de traitement requis."
        },
        {
          q: "Quand faut-il demander le CTN ?",
          a: "L’applicabilité et le calendrier de l’ECTN/CTN doivent être confirmés avant réservation. Les informations doivent correspondre au connaissement, à la facture commerciale et à la liste de colisage."
        },
        {
          q: "Comment DDNZ gère-t-il la congestion à Lagos ?",
          a: "Les conditions à Lagos évoluent selon le terminal, la saison et le transporteur. Avant expédition, confirmez les jours de franchise, les exigences documentaires et le plan opérationnel au port de destination."
        }
      ]
    }
  },
  ghana: {
    en: {
      seoTitle: "China to Ghana Freight Forwarding Guide | Heaven Born",
      seoDesc: "Sea and air freight planning from China to Ghana, including consolidation and CoC/CTN document coordination before export.",
      headline: "Shipping to Ghana (Tema/Accra) | CoC & CTN Documentation Support",
      subheadline: "Ocean and air freight planning from China to Tema and Accra, with consolidation, CoC, CTN, and destination clearance coordination.",
      transitWindow: "Ghana Transit Windows",
      transitDays: "35 - 50 Days",
      complianceRowTitle: "Ghana CoC & Import Document Review",
      complianceRowVal: "Before Booking",
      solutionsTitle: "Ghana SCM Compliance Solutions",
      solutionsSubtitle: "Robust trade-flow processes aligned to Ghana Customs (GRA) standards and GSA quality regulations.",
      solutions: [
        {
          title: "Strict GSA CoC Quality Certification",
          desc: "Ghana Standards Authority (GSA) may require conformity assessment (EasyPASS) for regulated product categories. Confirm whether a Certificate of Conformity (CoC) applies to the cargo before loading.",
          icon: "ShieldCheck"
        },
        {
          title: "Pre-Shipment Cargo Tracking Note (CTN)",
          desc: "Confirm the current Cargo Tracking Note (CTN) requirements and review the shipment data against the commercial invoice, packing list, and Bill of Lading before departure.",
          icon: "FileText"
        },
        {
          title: "Commercial Value & Declaration Consistency",
          desc: "Keep the commercial invoice, packing list, transport documents and customs declaration information consistent. The importer and destination clearing agent should confirm current valuation, currency and tax requirements before shipment.",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "Ocean Freight (Sea)",
          days: "35 - 50 Days",
          suitability: "Optimized for raw materials, industrial machinery, and wholesale consumer goods.",
          sellingPoint: "Sailing options from South China to Tema are confirmed against current carrier schedules and cargo requirements.",
          warning: "Tema conditions can change with demand and local operations. Include a practical schedule buffer and confirm destination handling requirements before departure."
        },
        {
          mode: "Air Freight (Air)",
          days: "6 - 8 Working Days",
          suitability: "Perfect for high-margin retail shipments, electronics, and spare parts.",
          sellingPoint: "Air routing to Accra (ACC) is assessed against available schedules, commodity acceptance and destination handling requirements.",
          warning: "Strict customs screening is applied for high-value merchandise. Original commercial invoices matching the actual packing list are mandatory."
        }
      ],
      faqs: [
        {
          q: "Does Ghana require a CoC (Certificate of Conformity) for all imports?",
          a: "GSA conducts import inspection for high-risk goods. For products within the applicable scope, importers should register and provide the required Certificate of Analysis or Certificate of Conformity; without the required evidence, clearance can be delayed pending testing or conformity assessment."
        },
        {
          q: "What currencies are allowed for Ghana customs declarations?",
          a: "Prepare commercial values consistently across the invoice, packing list and customs declaration. Confirm the current currency, valuation and tax-treatment requirements with the importer and destination clearing agent before shipment."
        },
        {
          q: "What is Tema port's status regarding congestion?",
          a: "Tema conditions can vary with seasonal demand and customs-system updates. Confirm the destination handling plan and include an appropriate buffer in your shipment schedule."
        }
      ]
    },
    zh: {
      seoTitle: "中国到加纳（特马 Tema / 阿克拉 Accra）海运整柜拼箱与空运 DDP | 华正邦泰国际货运",
      seoDesc: "中国至加纳特马、阿克拉的海运、空运与集货规划，支持 CoC、CTN 等进口文件的出运前核对。",
      headline: "中国到加纳（特马 Tema / 阿克拉 Accra）海运与空运：CoC、CTN 文件协调支持",
      subheadline: "提供中国集货、起运资料核对及与目的地清关合作方的服务衔接，协助进口商确认 CoC 与 CTN 要求。",
      transitWindow: "加纳专线预计时效",
      transitDays: "35 - 50 天",
      complianceRowTitle: "加纳 CoC 与进口文件核对",
      complianceRowVal: "订舱前核对",
      solutionsTitle: "加纳专线合规解决方案",
      solutionsSubtitle: "围绕 CoC、CTN、申报文件与目的地操作要求，提供出运前资料核对与服务协调。",
      solutions: [
        {
          title: "加纳 GSA 强制 CoC 认证",
          desc: "加纳标准局（GSA）对受监管商品目录可能要求合格评定（EasyPASS）。请在装船前确认货物是否适用 CoC 产品合格证书。",
          icon: "ShieldCheck"
        },
        {
          title: "装箱绑定 CTN 货物跟踪单",
          desc: "请在装船前确认 CTN 电子货物跟踪单的当前要求，并核对 CTN、商业发票、装箱单和提单中的货物资料。",
          icon: "FileText"
        },
        {
          title: "申报资料与计价信息核对",
          desc: "请在出运前确保商业发票、装箱单和申报资料中的货物描述、数量、货值及计价信息一致；具体申报要求应由进口商与目的地合格专业机构确认。",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "直航海运整箱/拼箱 (Sea)",
          days: "35 - 50 天",
          suitability: "适合批发商品、建筑建材、日用百货及重型工业原材料。",
          sellingPoint: "根据当前船期、货物资料和目的港操作范围，规划从华南港口至 Tema 的出运方案。",
          warning: "Tema 的港口条件可能受季节需求和当地操作变化影响。请确认目的港计划，并在运输安排中预留合理缓冲。"
        },
        {
          mode: "空运双清专线 (Air)",
          days: "6 - 8 工作日",
          suitability: "适合快速消费品、高溢价数码产品、零配件及加急补货样品。",
          sellingPoint: "可根据可用直飞或中转航班，结合货物属性和目的港操作要求规划至 Accra 的空运路线。",
          warning: "高货值商品可能面临更严格的查验；商业发票、装箱单和实物信息应保持一致，并在出运前确认。"
        }
      ],
      faqs: [
        {
          q: "所有出口到加纳的产品都需要做 CoC (Certificate of Conformity) 认证吗？",
          a: "CoC 是否适用取决于加纳标准局（GSA）的当前受监管商品目录和进口情形。请在装船前根据 HS 编码、产品资料和进口商信息确认。"
        },
        {
          q: "加纳进口发票的计价信息应如何准备？",
          a: "商业发票、装箱单和申报资料的计价信息应保持一致。进口商应在出运前与目的地合格专业机构确认适用的币种、申报和税费要求。"
        },
        {
          q: "特马港 Tema 最近通关和赛港情况如何？",
          a: "Tema 港口条件可能受季节需求和当地操作变化影响。请在订舱前确认目的港操作计划，并在运输安排中预留合理缓冲。"
        }
      ]
    },
    fr: {
      seoTitle: "Fret de Chine vers le Ghana | Heaven Born",
      seoDesc: "Planification maritime, aérienne et documentaire de Chine vers le Ghana, avec vérification des exigences d’importation avant expédition.",
      headline: "Fret maritime et aérien de Chine vers le Ghana",
      subheadline: "Planification habituelle de 35–50 jours par mer, avec vérification de l’applicabilité du CoC et des documents d’importation avant expédition.",
      transitWindow: "Délais de transit habituels vers le Ghana",
      transitDays: "35 - 50 Jours",
      complianceRowTitle: "Dépôt de certification CoC Ghana",
      complianceRowVal: "Avant réservation",
      solutionsTitle: "Solutions de conformité logistique Ghana",
      solutionsSubtitle: "Vérification des documents d’importation, du classement produit et des exigences applicables avant le départ de la cargaison.",
      solutions: [
        {
          title: "Exigence de certification CoC",
          desc: "Un CoC peut s’appliquer aux produits figurant dans le répertoire réglementé de la Ghana Standards Authority. Nous vérifions l’applicabilité avec l’importateur et les parties compétentes avant l’expédition.",
          icon: "ShieldCheck"
        },
        {
          title: "Note de suivi électronique CTN du Ghana",
          desc: "Toutes les importations doivent comporter un numéro de suivi CTN sur le connaissement (B/L). Notre équipe gère ce dépôt numérique à Guangzhou pour éviter les blocages de fret à Tema.",
          icon: "FileText"
        },
        {
          title: "Vérification des coûts et du périmètre de destination",
          desc: "Les frais portuaires, taxes et services à destination peuvent varier. Confirmez le périmètre DDP/DDU, les hypothèses et les éléments inclus avant réservation.",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "Groupage LCL & FCL de Chine vers Tema",
          days: "35 - 50 Jours",
          suitability: "Idéal pour les envois réguliers de marchandises, les palettes de vente au détail et le fret volumineux.",
          sellingPoint: "Les options de groupage et les départs disponibles sont planifiés selon les horaires des transporteurs et les exigences de destination.",
          warning: "Vérifiez que l'étiquetage, les quantités et les descriptions de produits sont cohérents avec les documents et certificats applicables."
        },
        {
          mode: "Fret Aérien Direct vers Accra (ACC)",
          days: "4 - 10 Jours Ouvrables",
          suitability: "Idéal pour les pièces de rechange d'usine, l'électronique fine et les lancements de produits.",
          sellingPoint: "Vols directs ou de transit rapide vers l'aéroport d'Accra, dédouanement accéléré.",
          warning: "Le fret aérien est soumis à un contrôle strict des marchandises réglementées; l'obtention de permis spécifiques peut être nécessaire."
        }
      ],
      faqs: [
        {
          q: "Pourquoi le CoC is obligatoire pour expédier vers Tema ?",
          a: "Le CoC peut s'appliquer aux produits figurant dans le répertoire réglementé de la GSA. Confirmez l'application actuelle avec l'importateur et un conseiller qualifié avant l'expédition."
        },
        {
          q: "Comment fonctionne le CTN ghanéen ?",
          a: "Le Cargo Tracking Note doit être cohérent avec la facture commerciale, la liste de colisage et le connaissement. Confirmez les exigences et le délai applicables avant l'embarquement."
        },
        {
          q: "Est-il possible d'expédier sous le régime DDP (rendu droits acquittés) ?",
          a: "Un service DDP peut être évalué selon le produit, l'importateur et les conditions de destination. Confirmez par écrit le périmètre, les taxes et les exclusions avant réservation."
        }
      ]
    }
  }
};

const WEST_AFRICA_LOCALIZED = WEST_AFRICA_DATA as Record<string, any>;
const westAfricaLocaleConfig = {
  ru: {
    nigeria: { country: 'Нигерия', destination: 'Лагос и Апапа', compliance: 'SONCAP, Form M и PAAR', transitDays: 'Море: 35 - 50 дней | Авиа: 5 - 12 дней' },
    ghana: { country: 'Гана', destination: 'Тема и Аккра', compliance: 'CoC, CTN и таможни Ганы', transitDays: 'Море: 40 - 55 дней | Авиа: 5 - 12 дней' },
  },
  es: {
    nigeria: { country: 'Nigeria', destination: 'Lagos y Apapa', compliance: 'SONCAP, Form M y PAAR', transitDays: 'Marítimo: 35 - 50 días | Aéreo: 5 - 12 días' },
    ghana: { country: 'Ghana', destination: 'Tema y Accra', compliance: 'CoC, CTN y aduana de Ghana', transitDays: 'Marítimo: 40 - 55 días | Aéreo: 5 - 12 días' },
  },
  ar: {
    nigeria: { country: 'نيجيريا', destination: 'لاغوس وأبابا', compliance: 'SONCAP وForm M وPAAR', transitDays: 'بحري: 35 - 50 يوماً | جوي: 5 - 12 يوماً' },
    ghana: { country: 'غانا', destination: 'تيما وأكرا', compliance: 'CoC وCTN والجمارك الغانية', transitDays: 'بحري: 40 - 55 يوماً | جوي: 5 - 12 يوماً' },
  },
} as const;

for (const locale of ['ru', 'es', 'ar'] as const) {
  WEST_AFRICA_LOCALIZED.nigeria[locale] = createLocalizedShippingContent({
    locale,
    region: 'West Africa',
    ...westAfricaLocaleConfig[locale].nigeria,
  });
  WEST_AFRICA_LOCALIZED.ghana[locale] = createLocalizedShippingContent({
    locale,
    region: 'West Africa',
    ...westAfricaLocaleConfig[locale].ghana,
  });
}

const PAGE_LANG_DATA = {
  en: {
    seoTitle: "China to West Africa Freight Forwarding Guide | Heaven Born",
    seoDesc: "Freight planning from China to West Africa, including Nigeria, Ghana, and French-speaking markets, with consolidation, document review, and DDP/DDU coordination.",
    tabNigeria: "Nigeria (Lagos - Apapa/Tin Can)",
    tabGhana: "Ghana (Tema / Accra)",
    faqHeading: "West Africa SCM Compliance FAQ",
    faqSubheading: "Proactive compliance checks to keep your cargo moving securely through West African customs corridors.",
    formTitle: "Instant West Africa Shipping Inquiry",
    formSub: "Send your cargo requirements directly to our senior West Africa trade lane managers.",
    formName: "Your Name / Company",
    formEmail: "Corporate Email Address",
    formPhone: "Mobile / WhatsApp / WeChat",
    formGoods: "Cargo Details (Item Type, Total Weight/CBM, etc.)",
    formSubmit: "Get Precise DDP Quote",
    formSuccess: "Inquiry Submitted Successfully!",
    formSuccessSub: "Our West Africa route team will use your submitted contact details to confirm the information needed for the quotation.",
    formAnother: "Submit Another Quote Request",
    complianceBadge: "COMPLIANCE NOTICE",
    timeBadge: "TIMELINE FORECAST",
    actionQuote: "Generate Dynamic Route Quote",
    actionConsult: "Consult Compliance Specialist",
    guideHeader: "Heaven Born West Africa Shipping Notes",
    guideSub: "Practical points for planning documents, consolidation, and destination operations."
  },
  zh: {
    seoTitle: "中国到西非（尼日利亚/加纳）海运整柜拼箱与 DDP 服务 | 华正邦泰国际货运",
    seoDesc: "中国至西非的海运、空运与集货服务，支持 SONCAP、ECTN 等文件的出运前核对，并协调 DDP/DDU 服务范围。",
    tabNigeria: "尼日利亚（拉各斯 Lagos）专区",
    tabGhana: "加纳（特马 Tema）专区",
    faqHeading: "西非航线通关合规常见问答",
    faqSubheading: "加纳和尼日利亚的文件与港口要求可能变化，建议在出运前结合货物与目的地逐项核对。",
    formTitle: "立即获取西非双清方案及报价",
    formSub: "提交货物信息后，我们将确认路线、文件要求和报价所需资料。",
    formName: "您的姓名 / 企业名称 (必填)",
    formEmail: "您的企业邮箱 (必填)",
    formPhone: "联系电话 / 微信 / WhatsApp (必填)",
    formGoods: "货物详情描述 (如品名、箱数、总重量/立方数、有无电池等)",
    formSubmit: "立即索取专属 DDP 精算报价",
    formSuccess: "西非专线询价提交成功！",
    formSuccessSub: "西非路线团队将通过您提交的联系方式，确认货物、目的地和服务范围。",
    formAnother: "发起新的西非询价",
    complianceBadge: "合规风控红线",
    timeBadge: "时效安全测算",
    actionQuote: "获取本条航线精确预算",
    actionConsult: "在线对接货代大庄家",
    guideHeader: "Heaven Born 西非出运注意事项",
    guideSub: "围绕集货、文件与目的地操作，帮助您在出运前完成必要确认。"
  },
  fr: {
    seoTitle: "Spécialiste du fret en Afrique de l'Ouest | Heaven Born",
    seoDesc: "Planification de fret depuis la Chine vers l’Afrique de l’Ouest, avec consolidation, vérification documentaire et coordination DDP/DDU.",
    tabNigeria: "Nigeria (Lagos - Apapa/Tin Can)",
    tabGhana: "Ghana (Tema / Accra)",
    faqHeading: "FAQ sur la conformité SCM en Afrique de l'Ouest",
    faqSubheading: "Vérifications de conformité proactives pour assurer le transit sécurisé de vos marchandises dans les couloirs douaniers.",
    formTitle: "Demande de devis d'expédition en Afrique de l'Ouest",
    formSub: "Envoyez vos exigences à nos gestionnaires de ligne de commerce senior pour l'Afrique de l'Ouest.",
    formName: "Votre Nom / Entreprise",
    formEmail: "Adresse e-mail de l'entreprise",
    formPhone: "Mobile / WhatsApp",
    formGoods: "Détails de la cargaison (Type d'article, poids/CBM total, etc.)",
    formSubmit: "Obtenir un devis DDP précis",
    formSuccess: "Demande soumise avec succès !",
    formSuccessSub: "Notre équipe vous contactera pour confirmer les informations nécessaires au devis.",
    formAnother: "Soumettre une nouvelle demande",
    complianceBadge: "AVIS DE CONFORMITÉ",
    timeBadge: "PRÉVISIONS DE DÉLAI",
    actionQuote: "Générer un devis d'itinéraire",
    actionConsult: "Consulter un spécialiste de la conformité",
    guideHeader: "Notes d’expédition Heaven Born pour l’Afrique de l’Ouest",
    guideSub: "Points pratiques pour les documents, la consolidation et les opérations à destination."
  }
};

const UNIVERSAL_REDLINES = {
  en: {
    title: "West Africa Shipping Preparation Notes",
    subtitle: "Confirm cargo data, required documents, destination handling scope, and carrier terms before departure.",
    items: [
      {
        id: "01",
        title: "Multi-supplier Consolidation Planning",
        desc: "For purchases from multiple 1688 or Alibaba suppliers, confirm receiving, inventory checks, packing requirements, and the consolidation schedule before booking freight."
      },
      {
        id: "02",
        title: "Pre-shipment Inspection Scope",
        desc: "Inspection can include agreed checks for visible condition, quantities, packaging, labels, and loading. Confirm the checklist and any sampling requirements before the visit."
      },
      {
        id: "03",
        title: "Quote Scope and Destination Charges",
        desc: "Review the quote line by line. Confirm whether destination customs, duties, storage, inspection, delivery, and possible third-party charges are included or excluded."
      },
      {
        id: "04",
        title: "French-speaking West Africa Documentation",
        desc: "For Abidjan, Dakar, and inland destinations, confirm applicable language, BESC/BIETC, and destination-document requirements before booking the route."
      }
    ]
  },
  zh: {
    title: "西非出运准备要点",
    subtitle: "出运前请核对货物资料、所需文件、目的地操作范围及承运人条款。",
    items: [
      {
        id: "01",
        title: "多供应商集货安排",
        desc: "如货物来自多个 1688、淘宝或阿里巴巴供应商，请在订舱前确认收货、库存核对、包装要求及集货排期。"
      },
      {
        id: "02",
        title: "装运前验货范围",
        desc: "验货可按约定范围检查外观、数量、包装、标签及装柜情况。请在验货前确认检查清单与抽检要求。"
      },
      {
        id: "03",
        title: "报价范围与目的地费用",
        desc: "请逐项查看报价，确认目的地清关、税费、仓储、查验、派送及可能发生的第三方费用是否包含在服务范围内。"
      },
      {
        id: "04",
        title: "法语西非文件要求",
        desc: "前往阿比让、达喀尔及内陆目的地时，请在订舱前确认法语文件、BESC/BIETC 及目的地清关资料要求。"
      }
    ]
  },
  fr: {
    title: "Guide de survie de l'Afrique de l'Ouest : Lignes rouges opérationnelles",
    subtitle: "L'expédition en Afrique de l'Ouest exige une exécution locale approfondie sous peine de confiscation de fret ou d'amendes douanières extrêmes.",
    items: [
      {
        id: "01",
        title: "Entrepôt de consolidation 1688 autogéré à Guangzhou",
        desc: "Les acheteurs PME étrangers achètent souvent des produits auprès de dizaines de fournisseurs 1688 ou Alibaba dispersés. DDNZ propose un stockage gratuit et sécurisé dans son entrepôt principal de Guangzhou. Nous fournissons une gestion numérique, un reconditionnement renforcé et une optimisation de volume avancée (Cube Optimization) pour éliminer les espaces vides et économiser sur le fret."
      },
      {
        id: "02",
        title: "Votre Gestionnaire de SCM : Inspection de conteneur & Audit d'usine",
        desc: "Nous sommes vos yeux et vos oreilles en Chine. Avant le départ du fret, notre équipe effectue une inspection de conteneur rigoureuse pour sécuriser vos achats sur Alibaba et 1688, évitant ainsi tout litige qualité à l'arrivée."
      },
      {
        id: "03",
        title: "Zéro frais caché : Engagement tarifaire fixe tout compris",
        desc: "Nous condamnons fermement les agents logistiques trompeurs qui facturent peu en Chine mais extorquent des milliers de dollars aux destinations africaines ! DDNZ applique un taux tout compris strict (DDP/DDU) verrouillé par contrat."
      },
      {
        id: "04",
        title: "Réseau Afrique de l'Ouest francophone (Abidjan & Dakar)",
        desc: "Au-delà des hubs anglophones, DDNZ gère des lignes directes vers l'Afrique de l'Ouest francophone : Abidjan (Côte d'Ivoire) en 40-50 jours, Dakar (Senegal) en 50-60 jours, avec transit multimodal vers les pays enclavés (Mali, Burkina Faso). Nos équipes bilingues gèrent parfaitement les dossiers de douane en français et les certificats obligatoires BESC/BIETC."
      }
    ]
  }
};

for (const locale of ['ru', 'es', 'ar'] as const) {
  (UNIVERSAL_REDLINES as Record<string, any>)[locale] = createLocalizedShippingRedlines(locale);
}

Object.assign(PAGE_LANG_DATA, {
  ru: {
    ...PAGE_LANG_DATA.en,
    heroTag: "КИТАЙ — ЗАПАДНАЯ АФРИКА",
    heroCta: "Получить анализ маршрута и тарифа",
    insureText: "Координация перевозок из Китая с 1997 года",
    insightTag: "Оперативная информация",
    insightTitle: "Планирование портов Лагос, Апапа и Тема",
    insightContent: "Расписание линий, портовая загруженность и требования к документам меняются. Перед погрузкой подтвердите маршрут, свободное место и документы назначения.",
    faqHeading: "Таможенный контроль и FAQ по Западной Африке",
    faqSubheading: "Практические проверки для Нигерии и Ганы.",
    formTitle: "Запрос тарифа в Западную Африку",
    formSub: "Отправьте данные груза для подтверждения маршрута и расчёта.",
    formName: "Имя / Компания",
    formEmail: "Электронная почта",
    formPhone: "WhatsApp / Телефон",
    formGoods: "Товар / Вес / Объём",
    formSubmit: "Получить расчёт",
    formSuccess: "Запрос отправлен.",
    formSuccessSub: "Наша команда проверит данные и свяжется с вами.",
    formAnother: "Отправить новый запрос",
  },
  es: {
    ...PAGE_LANG_DATA.en,
    heroTag: "CHINA — ÁFRICA OCCIDENTAL",
    heroCta: "Obtener análisis de ruta y tarifa",
    insureText: "Coordinación de carga desde China desde 1997",
    insightTag: "Actualización operativa",
    insightTitle: "Planificación para Lagos, Apapa y Tema",
    insightContent: "Los horarios, la congestión portuaria y los requisitos documentales pueden cambiar. Confirme ruta, espacio y documentos antes de cargar.",
    faqHeading: "Control aduanero y preguntas frecuentes de África Occidental",
    faqSubheading: "Revisiones prácticas para Nigeria y Ghana.",
    formTitle: "Solicitud de cotización para África Occidental",
    formSub: "Envíe los datos de la carga para confirmar ruta y precio.",
    formName: "Nombre / Empresa",
    formEmail: "Correo electrónico",
    formPhone: "WhatsApp / Teléfono",
    formGoods: "Mercancía / Peso / Volumen",
    formSubmit: "Obtener cotización",
    formSuccess: "Solicitud enviada.",
    formSuccessSub: "Nuestro equipo revisará los datos y se pondrá en contacto.",
    formAnother: "Enviar otra solicitud",
  },
  ar: {
    ...PAGE_LANG_DATA.en,
    heroTag: "الصين — غرب أفريقيا",
    heroCta: "الحصول على تحليل المسار والتعرفة",
    insureText: "تنسيق الشحن من الصين منذ 1997",
    insightTag: "تحديث تشغيلي",
    insightTitle: "التخطيط لموانئ لاغوس وأبابا وتيما",
    insightContent: "قد تتغير الجداول وازدحامات الموانئ ومتطلبات المستندات. يجب تأكيد المسار والمساحة والمستندات قبل التحميل.",
    faqHeading: "التخليص والأسئلة الشائعة لغرب أفريقيا",
    faqSubheading: "مراجعات عملية لنيجيريا وغانا.",
    formTitle: "طلب عرض شحن إلى غرب أفريقيا",
    formSub: "أرسل بيانات البضائع لتأكيد المسار والسعر.",
    formName: "الاسم / الشركة",
    formEmail: "البريد الإلكتروني",
    formPhone: "واتساب / الهاتف",
    formGoods: "البضائع / الوزن / الحجم",
    formSubmit: "الحصول على عرض",
    formSuccess: "تم إرسال الطلب.",
    formSuccessSub: "سيراجع فريقنا البيانات ويتواصل معك.",
    formAnother: "إرسال طلب آخر",
  },
});

export default function ShippingWestAfrica() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const getCountryFromLocation = () => getShippingCountrySlug(
    location.pathname,
    location.search,
    ['nigeria', 'ghana'],
    'nigeria',
  ) as 'nigeria' | 'ghana';

  const [selectedCountry, setSelectedCountry] = useState<'nigeria' | 'ghana'>(getCountryFromLocation);
  const [isLocked, setIsLocked] = useState(false);
  const [activeTransportMode, setActiveTransportMode] = useState<number>(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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

  const handleCountryTabChange = (country: 'nigeria' | 'ghana') => {
    setSelectedCountry(country);
    navigate(buildShippingCountryPath(location.pathname, country));
    setActiveTransportMode(0);
    setActiveFaq(null);
  };

  const activeLang = language === 'zh' ? 'zh' : (language === 'ru' ? 'ru' : language === 'fr' ? 'fr' : language === 'es' ? 'es' : language === 'ar' ? 'ar' : 'en');
  
  const spec = WEST_AFRICA_DATA[selectedCountry][activeLang];
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
      case 'FileText': return <FileText className="w-5 h-5 text-[#d97706] shrink-0" />;
      case 'Search': return <Search className="w-5 h-5 text-[#d97706] shrink-0" />;
      default: return <Package className="w-5 h-5 text-[#d97706] shrink-0" />;
    }
  };

  // Form submission state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goods: '',
    destination: 'Nigeria'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      destination: selectedCountry === 'nigeria' 
        ? (language === 'zh' ? '尼日利亚' : 'Nigeria') 
        : (language === 'zh' ? '加纳' : 'Ghana')
    }));
  }, [selectedCountry, language]);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    trackEvent('quote_form_submit_attempt', {
      form_location: 'west_africa_country_page',
      country: selectedCountry,
      service: 'freight_forwarding',
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
        destination: selectedCountry === 'nigeria' ? 'Nigeria' : 'Ghana'
      });
    }, 1200);
  };

  const redlines = UNIVERSAL_REDLINES[activeLang];

  return (
    <div className="min-h-screen hb-region-shell font-sans overflow-x-hidden">
      <SEO title={spec.seoTitle} description={spec.seoDesc} />
      
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-32 pb-24 md:pt-40 md:pb-36 text-white overflow-hidden">
        {/* Visual shipping backdrop layer */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=2000" 
            alt="West Africa Port Hub"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--hb-navy-deep)] via-[var(--hb-navy-deep)]/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 pb-16">
            
            {/* 左侧文案区：占据 7 列 */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Country Selector Tabs */}
              {!isLocked && (
                <div className="flex flex-wrap gap-2.5 mb-2">
                  <button
                    type="button"
                    onClick={() => handleCountryTabChange('nigeria')}
                    className={`px-5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${
                      selectedCountry === 'nigeria'
                        ? 'bg-[#d97706] text-white shadow-lg scale-105'
                        : 'bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Globe className="w-4 h-4" aria-hidden="true" /> {t('tabNigeria')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCountryTabChange('ghana')}
                    className={`px-5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${
                      selectedCountry === 'ghana'
                        ? 'bg-[#d97706] text-white shadow-lg scale-105'
                        : 'bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Globe className="w-4 h-4" aria-hidden="true" /> {t('tabGhana')}
                  </button>
                </div>
              )}

              {/* Headline Block */}
              <motion.div
                key={selectedCountry + language}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#d97706]/10 border border-[#d97706]/30 text-[#d97706] text-xs font-black tracking-widest uppercase">
                  HEAVEN BORN WEST AFRICA SHIPPING
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#d97706]">
                    {spec.headline}
                  </span>
                </h1>
                <div className="space-y-4">
                  <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed font-medium">
                    {spec.subheadline}
                  </p>
                  
                  {/* Premium Micro-Badges / Key SCM Highlights */}
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      {language === 'zh' ? 'SONCAP / CoC 文件支持' : 'SONCAP / CoC Document Support'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d97706]/10 border border-[#d97706]/20 text-xs font-bold text-[#d97706]">
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                      {language === 'zh' ? '目的地单证与清关协调' : 'Destination Clearance Coordination'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
                      <Truck className="w-3.5 h-3.5" aria-hidden="true" />
                      {language === 'zh' ? '一站式西非 DDP / DDU' : 'One-Stop West Africa DDP'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Quick SCM Meta Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/[0.08]">
                <div className="bg-white/[0.02] backdrop-blur-sm p-4 rounded-xl border border-white/[0.08]">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-black uppercase mb-1">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{t('complianceBadge')}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-200">{spec.complianceRowTitle}</div>
                  <div className="text-[10px] text-slate-400 font-bold mt-0.5">{language === 'zh' ? '预审周期' : 'Period'}: {spec.complianceRowVal}</div>
                </div>

                <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] p-4 rounded-xl flex flex-col justify-center items-center text-center">
                  <button
                    onClick={() => {
                      const formElem = document.getElementById('west-africa-quote-form');
                      if (formElem) {
                        formElem.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-xs font-black text-white hover:text-[#d97706] transition-colors flex items-center justify-center gap-1.5 cursor-pointer w-full h-full min-h-[44px]"
                  >
                    <span>{language === 'zh' ? '立即询价' : 'Inquire Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#d97706]" />
                  </button>
                </div>
              </div>
            </div>

            {/* 右侧硬核时效侧边栏：占据 5 列 */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-lg font-black tracking-wide text-[#d97706] uppercase mb-2">
                {language === 'zh' ? '西非专线真实货运时效' : (language === 'fr' ? 'Délais de Transit en Afrique de l\'Ouest' : 'West Africa Hub Transit Windows')}
              </h3>
              
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-5 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-white">{language === 'zh' ? '拉各斯海运双清 (Apapa / Tin Can)' : 'Lagos (Apapa / Tin Can) Ocean'}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{language === 'zh' ? '广州集拼仓直发整箱/拼箱' : (language === 'fr' ? 'Consolidation directe depuis le hub de Guangzhou' : 'Guangzhou Hub Direct Consolidation')}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="text-sm font-extrabold text-[#d97706] whitespace-nowrap">{WEST_AFRICA_DATA.nigeria[activeLang].transitDays}</span>
                </div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-5 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-white">{language === 'zh' ? '阿克拉海运双清 (Accra / Tema)' : 'Accra / Tema Premium Freight'}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{language === 'zh' ? '全程双清、SABER与证书核准托底' : (language === 'fr' ? 'Dédouanement complet Form M & SONCAP' : 'Full Form M & SONCAP Pre-Clearance')}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="text-sm font-extrabold text-[#d97706] whitespace-nowrap">{WEST_AFRICA_DATA.ghana[activeLang].transitDays}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10">

        {/* Section 2: Compliant Solutions Checklist (3 Columns) */}
        <section className="py-16 md:py-24 border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="px-3 py-1 bg-[#d97706]/10 text-[#d97706] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                Compliance Support
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-4">
                {spec.solutionsTitle}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-[var(--hb-blue)] to-[var(--hb-amber)] mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-sm sm:text-base font-medium">
                {spec.solutionsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {spec.solutions.map((sol: any, idx: number) => (
                <div key={idx} className="bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.04] flex flex-col justify-between group">
                  <div>
                    <div className="bg-[#d97706]/10 p-3 rounded-xl inline-block mb-4">
                      {getIcon(sol.icon)}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">
                      {sol.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                      {sol.desc}
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

        {/* Section 2.5: Interactive Lead-Generation Table (核心时效透视数据表) */}
        <section className="py-16 border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="px-3 py-1 bg-[#d97706]/10 text-[#d97706] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                {language === 'zh' ? '核心时效参考' : 'Transit Time Reference'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-4">
                {{
                  en: 'West Africa Multimodal Lead-Time Matrix',
                  zh: '西非多式联运全通道时效数据表',
                  ru: 'Сроки мультимодальных перевозок по Западной Африке',
                  fr: 'Délais du transport multimodal en Afrique de l’Ouest',
                  es: 'Tiempos del transporte multimodal en África Occidental',
                  ar: 'مدد النقل متعدد الوسائط في غرب أفريقيا',
                }[activeLang]}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-[var(--hb-blue)] to-[var(--hb-amber)] mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-sm font-semibold">
                {language === 'zh' 
                  ? '精细对齐各物理运输通道，深剖西非清关时效落差，帮助您合理配载预算。' 
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
                          ? 'bg-gradient-to-r from-[var(--hb-navy)] to-[var(--hb-blue)] text-white border-transparent shadow-xl translate-x-1'
                          : 'bg-white/[0.02] text-slate-300 border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {row.mode.toLowerCase().includes('air') || row.mode.includes('空运') || row.mode.includes('Aérien')
                          ? <Plane className="w-5 h-5 text-[#d97706]" aria-hidden="true" />
                          : <Ship className="w-5 h-5 text-[#d97706]" aria-hidden="true" />}
                        <div>
                          <h4 className="text-sm font-black tracking-tight text-white">
                            {row.mode}
                          </h4>
                          <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
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
                    {/* Subtle water-mark of active mode */}
                    <div className="absolute -top-12 -right-12 text-white/5 font-black text-9xl select-none pointer-events-none opacity-10">
                      {spec.multimodalTable[activeTransportMode].mode.slice(0, 1)}
                    </div>

                    <div className="relative z-10 space-y-6">
                      <div>
                        <span className="px-2.5 py-1 bg-[#d97706]/10 text-[#d97706] text-[10px] font-black uppercase tracking-wider rounded-lg">
                          {language === 'zh' ? '深度解析' : 'SCM Detail Panel'}
                        </span>
                        <h3 className="text-xl md:text-2xl font-black text-white mt-2">
                          {spec.multimodalTable[activeTransportMode].mode}
                        </h3>
                        <p className="text-[#d97706] text-sm font-black mt-1">
                          {language === 'zh' ? '门到门时效参考' : 'Door-to-Door Window'}: <span className="font-mono text-base font-bold text-white">{spec.multimodalTable[activeTransportMode].days}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div>
                          <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                            {language === 'zh' ? '适用货品 / 场景' : 'Best Suited For'}
                          </h5>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                            {spec.multimodalTable[activeTransportMode].suitability}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-[#d97706] uppercase tracking-widest mb-1.5">
                            {language === 'zh' ? 'Heaven Born 操作要点' : 'Heaven Born Operating Notes'}
                          </h5>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                            {spec.multimodalTable[activeTransportMode].sellingPoint}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-400/20 flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-xs font-black text-amber-200 uppercase tracking-wider mb-0.5">
                            {language === 'zh' ? '风险提示与操作合规' : 'Operation Notes'}
                          </h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            {spec.multimodalTable[activeTransportMode].warning}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                      <span className="text-xs text-slate-400 font-bold">
                        * {language === 'zh' ? '上述时效基于我司真实运输台账，受季节性换装及西非口岸偶发排队影响可能有微调。' : 'Data based on historical shipping registries, subject to seasonal West African port variance.'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const quoteForm = document.getElementById('west-africa-quote-form');
                          if (quoteForm) {
                            quoteForm.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[var(--hb-amber)] hover:bg-[var(--hb-amber-strong)] text-white text-xs font-black tracking-widest uppercase transition-colors active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap shrink-0 self-end"
                      >
                        <span>{t('actionQuote')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Section 4: Universal Avoid-Pitfall / Operation Redlines (Persistent Bottom Section) */}
        <section className="py-16 md:py-24 border-b border-white/[0.05] bg-transparent text-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="px-3 py-1 bg-[#d97706]/10 border border-[#d97706]/20 text-[#d97706] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                {language === 'zh' ? '出运注意事项' : 'Shipping Notes'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4">
                {redlines.title}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-[var(--hb-blue)] to-[var(--hb-amber)] mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-sm sm:text-base font-semibold">
                {redlines.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {redlines.items.map((item) => (
                <div key={item.id} className="bg-white/[0.02] backdrop-blur-md rounded-2xl p-8 border border-white/[0.08] shadow-lg relative overflow-hidden group hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300">
                  <div className="absolute top-0 right-0 p-4 text-white/5 font-black text-7xl select-none leading-none opacity-40 group-hover:opacity-60 transition-opacity">
                    {item.id}
                  </div>
                  <div className="flex items-center gap-2.5 text-[#d97706] font-black mb-4 text-sm sm:text-base">
                    <ShieldAlert className="w-5.5 h-5.5 text-[#d97706] flex-shrink-0" />
                    <h3>{item.title}</h3>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold relative z-10">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: West Africa Shipping Checklist & FAQ */}
        <section className="py-16 md:py-24 border-b border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                {t('faqHeading')}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-[var(--hb-blue)] to-[var(--hb-amber)] mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-sm font-semibold">
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
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left focus:outline-none"
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
        <section id="west-africa-quote-form" className="py-16 md:py-24 border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/[0.03] backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/[0.08] dark-form-container">
              <GetAQuote
                presetDestination={
                  selectedCountry === 'nigeria'
                    ? (language === 'zh' ? '尼日利亚' : 'Nigeria')
                    : (language === 'zh' ? '加纳' : 'Ghana')
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
