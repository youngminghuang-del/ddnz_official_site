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
  Globe, Clock, HelpCircle, Plane, FileText, Scale, ArrowUpRight
} from 'lucide-react';
import { trackEvent } from '../lib/utils';

// Multi-language strings for West Africa countries
const WEST_AFRICA_DATA = {
  nigeria: {
    en: {
      seoTitle: "China to Nigeria Freight Forwarding Guide | DDNZ",
      seoDesc: "Direct LCL/FCL ocean & air freight from China to Lagos (Apapa/Tin Can). Complete Form M, PAAR, and SC SONCAP certificate management since 1999.",
      headline: "Secured Sea & Air Freight to Nigeria (Lagos) | 100% Compliant SONCAP & Form M Handling",
      subheadline: "Direct container consolidation from Guangzhou self-operated hub to Lagos Apapa and Tin Can ports. Tackle SONCAP compliance and Form M barriers with our local on-site clearing team.",
      transitWindow: "⏱️ Nigeria Transit Windows",
      transitDays: "35 - 45 Days",
      complianceRowTitle: "Form M & PAAR Pre-Audit Validation",
      complianceRowVal: "2 - 4 Days",
      solutionsTitle: "Nigeria SCM Compliance Solutions",
      solutionsSubtitle: "Tailored logistics paths designed to overcome customs valuations, certification hurdles, and port congestions.",
      solutions: [
        {
          title: "Three-Step SONCAP Certification Rule",
          desc: "Never ship FCL blindly without verification! DDNZ document experts help you secure your Product Certificate (PC), register your Form M and PAAR with the Central Bank of Nigeria (CBN) locally, and finally acquire the shipment-specific SONCAP Certificate (SC) before loading to prevent mandatory container re-export.",
          icon: "ShieldCheck"
        },
        {
          title: "Mandatory Pre-Shipment ECTN/CTN",
          desc: "Nigeria customs strictly mandates the Electronic Cargo Tracking Note (ECTN/CTN). It must be issued and printed on the Ocean Bill of Lading in China prior to vessel departure. Late applications at destination are absolutely forbidden and face heavy customs penalties.",
          icon: "FileText"
        },
        {
          title: "Under-Declaration Risk Containment",
          desc: "Lagos custom authorities are actively cracking down on under-declared invoice valuations. Finding undervalued cargo results in heavy penalties of 2x to 3x the duty difference plus cargo seizure. DDNZ provides authentic valuation analysis and customs price verification.",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "🚢 Ocean Freight (LCL/FCL)",
          days: "35 - 45 Days",
          suitability: "Best for commercial inventory, manufacturing equipment, and heavy volume machinery.",
          sellingPoint: "POL: Guangzhou, Nansha, or Shenzhen to POD: Lagos Apapa / Tin Can Island. Regular direct sailings.",
          warning: "Lagos Port congestion is severe. Vessel berthing wait times can stretch to weeks. DDNZ's on-site customs broker handles document pre-validation to expedite terminal release."
        },
        {
          mode: "✈️ Air Freight Express",
          days: "5 - 12 Working Days",
          suitability: "Ideal for high-value consumer electronics, auto parts, fashion garments, and urgent samples.",
          sellingPoint: "Direct air freight connections via Dubai/Middle East or European air cargo hubs to Lagos (LOS) Airport.",
          warning: "General air cargo clears in 5-12 days; sensitive shipments (built-in lithium batteries, electronics, phones, cosmetics) must travel via specialized channels taking 11-16 days."
        }
      ],
      faqs: [
        {
          q: "What is the relation between Form M, PAAR, and SONCAP in Nigeria?",
          a: "They form the complete legal clearance chain: first, obtain the Product Certificate (PC) for your goods. Second, the Nigerian importer opens Form M and applies for the Pre-Arrival Assessment Report (PAAR) locally. Finally, the exporter obtains the SONCAP Certificate (SC) for the shipment. Without these, cargo cannot clear Lagos customs legally."
        },
        {
          q: "When must the CTN (Cargo Tracking Note) be applied for?",
          a: "The CTN MUST be applied for and registered in China BEFORE loading. It is illegal to apply at Lagos, and trying to do so results in extreme custom delays, massive demurrage fees, and official administrative fines."
        },
        {
          q: "How does DDNZ handle Lagos port congestion and high demurrage?",
          a: "Lagos port congestion is highly variable. DDNZ offers 14-21 days of free container storage (demurrage) directly negotiated with carriers. Furthermore, our dedicated port office coordinates customs pre-clearance to ensure immediate container pickup upon arrival."
        }
      ]
    },
    zh: {
      seoTitle: "中国到尼日利亚(拉各斯 Lagos)海运整柜拼箱与空运DDP | SONCAP认证 | 华正邦泰 DDNZ Global",
      seoDesc: "专业中国到尼日利亚拉各斯(Apapa/Tin Can)海运空运物流双清专线。提供全流程 SONCAP 证书办理、Form M 申报、PAAR 预审等一站式尼日利亚进口合规托底方案。",
      headline: "中国到尼日利亚（拉各斯 Lagos）专业海运/空运：攻克复杂 SONCAP 认证与 Form M 通关壁垒",
      subheadline: "自营广州集拼枢纽仓直航拉各斯 Apapa & Tin Can 港口。专业单证团队协助买家理顺清关合规链条，自营目的港清关行保障清关放行时效。",
      transitWindow: "⏱️ 尼日利亚专线预计时效",
      transitDays: "35 - 45 天",
      complianceRowTitle: "Form M 与 PAAR 舱单数据预审",
      complianceRowVal: "2 - 4 工作日",
      solutionsTitle: "尼日利亚专线合规解决方案",
      solutionsSubtitle: "深谙西非特有口岸规则，资深单证团队层层把关，确保重货、散货、敏感货合规通关无忧。",
      solutions: [
        {
          title: "三步法 SONCAP 铁律风控",
          desc: "拒绝整柜退运！DDNZ 数字化单证团队协助买家理顺清关链条：先办 PC 证书（产品注册） → 进口商本地申请 Form M 与 PAAR 报告 → 出货前申办每批货必备的 SC 清关证书。",
          icon: "ShieldCheck"
        },
        {
          title: "装船前强制 ECTN/CTN",
          desc: "必须在物理装船起运前，在中国办妥 ECTN/CTN 货物跟踪单，并将号码标注在提单上！货物到港后绝无补办可能，一旦漏报将面临目的港海关天价罚金与无尽期卡关。",
          icon: "FileText"
        },
        {
          title: "严打低报货值估价预审",
          desc: "尼日利亚海关对进口申报货值审查极严。一旦查出申报货值与系统参考价不符，将面临少缴税额 2-3 倍的毁灭性惩罚罚款甚至没收货物。DDNZ 提供专业的真实估价(TN VED)核算及海关底价对齐服务。",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "🚢 经典海运整箱/拼箱 (LCL/FCL)",
          days: "35 - 45 天",
          suitability: "适合商业库存、大型工业机械、建筑材料及大宗散货。",
          sellingPoint: "POL: 广州、南沙、深圳直航 POD: 拉各斯阿帕帕 Apapa / 丁坎 Tin Can。定期直达排舱，舱位充足。",
          warning: "拉各斯作为西非最繁忙港口，常态化拥堵严重，船舶靠泊等待可能长达数周。DDNZ 强力提供 14-21 天超长目的港免箱期，驻港清关组提前对齐资料，确保开箱提货周期缩至最短。"
        },
        {
          mode: "✈️ 空运双清专线 (Air)",
          days: "5 - 12 工作日",
          suitability: "适合高价值电子产品、手机配件、化妆品样品及加急商业大货。",
          sellingPoint: "中国始发，直飞或通过中东迪拜、欧洲枢纽中转直达拉各斯机场（LOS）。",
          warning: "普通日用品 5-12 天急速放行；带电产品、手机、化妆品等敏感货强制走敏感专线，时效约为 11-16 天。"
        }
      ],
      faqs: [
        {
          q: "尼日利亚清关的 Form M、PAAR 和 SONCAP 是什么关系？",
          a: "这是完整的清关合规链条：第一步，出口商协助在国内申请产品 PC 证书；第二步，尼日利亚进口商凭 PC 证书在当地银行系统开立 Form M 并申请 PAAR 进口批件；第三步，货物装箱前，国内申请针对单批次货物的 SC 清关证书。三者缺一不可，直接影响拉各斯放行。"
        },
        {
          q: "ECTN/CTN 货物跟踪单必须在什么时候申请？",
          a: "ECTN/CTN 必须在货物于中国港口装船前完成在线申报。到港后无法补办，没有登记该单据的提单，船东拒绝签发进口提货单，且海关会直接下达巨额处罚单。"
        },
        {
          q: "DDNZ 针对拉各斯常态化塞港有什么对应的保障方案？",
          a: "我们在西非航线上长期与主流船东（如 MSK, CMA, COSCO）保持战略级协议，默认争取 14-21 天的超长目的港集装箱免箱期。同时，自营目的港单证员会在货船到港前 7 天完成舱单预清关录入，避开拥堵时段。"
        }
      ]
    },
    fr: {
      seoTitle: "Transitaire en Chine | Groupage Maritime & FCL vers l'Afrique de l'Ouest — DDNZ",
      seoDesc: "Besoin d'un transitaire en Chine fiable ? DDNZ Global propose des services de groupage maritime, inspection de conteneur и dédouanement fret maritime.",
      headline: "Groupage Maritime и FCL depuis la Chine",
      subheadline: "Logistique spécialisée et transport sécurisé vers l'Afrique de l'Ouest (Lagos, Tema, Abidjan) et l'Europe. Votre partenaire SCM de confiance depuis 1997.",
      transitWindow: "⏱️ Délais de transit pour le Nigeria",
      transitDays: "35 - 45 Jours",
      complianceRowTitle: "Validation Form M & PAAR",
      complianceRowVal: "2 - 4 Jours",
      solutionsTitle: "Solutions de conformité SCM Nigeria",
      solutionsSubtitle: "Canaux logistiques sur mesure pour surmonter les évaluations douanières, les barrières de certification et les congestions portuaires.",
      solutions: [
        {
          title: "Processus de certification SONCAP",
          desc: "N'expédiez pas à l'aveugle sans vérification. Nos experts vous aident à sécuriser votre Product Certificate (PC), à enregistrer votre Form M et votre rapport PAAR avec la Banque Centrale du Nigeria (CBN), puis à acquérir le SONCAP Certificate (SC).",
          icon: "ShieldCheck"
        },
        {
          title: "Note d'information ECTN/CTN obligatoire",
          desc: "La douane du Nigeria exige la note de suivi de cargaison ECTN/CTN. Elle doit être émise et mentionnée sur le connaissement maritime en Chine avant le départ. Les demandes tardives à destination sont interdites.",
          icon: "FileText"
        },
        {
          title: "Sécurisation contre la sous-évaluation",
          desc: "Les douanes de Lagos luttent contre la sous-évaluation des factures. Tout écart entraîne des amendes de 2 à 3 fois la différence de droits de douane. DDNZ fournit des analyses d'évaluation certifiées.",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "🚢 Fret Maritime (LCL/FCL)",
          days: "35 - 45 Jours",
          suitability: "Idéal pour les stocks commerciaux, les équipements industriels et les frets lourds.",
          sellingPoint: "POL : Guangzhou, Nansha, ou Shenzhen vers Lagos Apapa / Tin Can Island. Départs réguliers.",
          warning: "La congestion à Lagos est importante. DDNZ offre de 14 à 21 jours de franchise (免箱期) pour faciliter un dédouanement rapide."
        },
        {
          mode: "✈️ Fret Aérien Express",
          days: "5 - 12 Jours Ouvrables",
          suitability: "Idéal pour l'électronique haut de gamme, les pièces détachées auto et les échantillons urgents.",
          sellingPoint: "Connexions de fret aérien directes vers l'aéroport de Lagos (LOS).",
          warning: "Le fret général prend de 5 à 12 jours; les produits à batterie lithium, téléphones et cosmétiques nécessitent un canal spécial de 11 à 16 jours."
        }
      ],
      faqs: [
        {
          q: "Quelle est la relation entre Form M, PAAR et SONCAP ?",
          a: "Ce sont les maillons de la chaîne de conformité légale : d'abord le PC, puis le Form M et le PAAR enregistrés localement, et enfin le certificat SC pour le chargement. Sans eux, le dédouanement est impossible."
        },
        {
          q: "Quand faut-il demander le CTN ?",
          a: "Le CTN doit être enregistré en Chine AVANT le chargement. Il est illégal de le faire à Lagos et cela entraîne d'importantes amendes douanières."
        },
        {
          q: "Comment DDNZ gère-t-il la congestion à Lagos ?",
          a: "Nous négocions directement avec les transporteurs pour obtenir de 14 à 21 jours de franchise de conteneur. Nos équipes pré-enregistrent les dossiers 7 jours avant l'arrivée."
        }
      ]
    }
  },
  ghana: {
    en: {
      seoTitle: "China to Ghana Freight Forwarding Guide | DDNZ",
      seoDesc: "Direct LCL consolidation and FCL ocean container service from China to Tema, Ghana. Expert handling of CoC certification and pre-shipment CTN binding.",
      headline: "Reliable Shipping to Ghana (Tema/Accra) | Streamlined CoC Product Certification & LCL Cargo Consolidation",
      subheadline: "Consolidating your SME e-commerce and retail goods into weekly direct LCL containers from Guangzhou to Tema Port. Fast customs clearance with strict compliance mapping.",
      transitWindow: "⏱️ Ghana Transit Windows",
      transitDays: "35 - 50 Days",
      complianceRowTitle: "Ghana CoC Certification Filing",
      complianceRowVal: "1 - 3 Days",
      solutionsTitle: "Ghana SCM Compliance Solutions",
      solutionsSubtitle: "Robust trade-flow processes aligned to Ghana Customs (GRA) standards and GSA quality regulations.",
      solutions: [
        {
          title: "Strict GSA CoC Quality Certification",
          desc: "Ghana Standards Authority (GSA) enforces mandatory conformity assessment (EasyPASS) for regulated directory imports. Cargo must acquire a Certificate of Conformity (CoC) before loading in China; otherwise, it faces a 30% local penalty surcharge and mandatory testing upon landing.",
          icon: "ShieldCheck"
        },
        {
          title: "Pre-Shipment Cargo Tracking Note (CTN)",
          desc: "Ghana Revenue Authority (GRA) mandates a registered Cargo Tracking Note (CTN) for all import consignments. All CTN documents must match the commercial invoice and packaging list details with 100% character-by-character accuracy.",
          icon: "FileText"
        },
        {
          title: "Rigid Currency Declaration Policies",
          desc: "Ghana customs forbids changing invoice values at the destination port. Furthermore, all customs clearance valuations must be officially declared in USD or EUR only to prevent local currency tax calculation errors.",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "🚢 Ocean Freight (Sea)",
          days: "35 - 50 Days",
          suitability: "Optimized for raw materials, industrial machinery, and wholesale consumer goods.",
          sellingPoint: "Weekly direct container logistics from Guangzhou/Shenzhen hubs to Tema Port.",
          warning: "Tema port has recently faced container handling bottlenecks. We strongly recommend adding 1-2 weeks of buffer transit window into your SCM plan."
        },
        {
          mode: "✈️ Air Freight (Air)",
          days: "6 - 8 Working Days",
          suitability: "Perfect for high-margin retail shipments, electronics, and spare parts.",
          sellingPoint: "Direct air freight connections to Accra Kotoka International Airport (ACC). Highly reliable schedules.",
          warning: "Strict customs screening is applied for high-value merchandise. Original commercial invoices matching the actual packing list are mandatory."
        }
      ],
      faqs: [
        {
          q: "Does Ghana require a CoC (Certificate of Conformity) for all imports?",
          a: "It is mandatory for products in the GSA regulated directory (e.g., electronics, cosmetics, toys, building materials). Importing these without a pre-shipped CoC leads to a 30% fine on the CIF value and cargo quarantine for local lab testing."
        },
        {
          q: "What currencies are allowed for Ghana customs declarations?",
          a: "GRA regulations require all commercial invoices and custom declaration data to be declared in USD or EUR only. Declaring in GHS (Ghanaian Cedi) directly is not accepted for standard sea import dossiers."
        },
        {
          q: "What is Tema port's status regarding congestion?",
          a: "Tema is generally smoother than Lagos, but seasonal agricultural export surges or customs IT updates can create temporary 5-10 day cargo release delays. DDNZ advises packing 7 days in advance."
        }
      ]
    },
    zh: {
      seoTitle: "中国到加纳(特马 Tema)海运整柜拼箱与空运DDP | CoC认证 | 华正邦泰 DDNZ Global",
      seoDesc: "提供中国到加纳特马(Tema)/阿克拉(Accra)优质空海运物流服务。直航特马，专业代理加纳 GSA CoC 质量证书与装船前 CTN 单据绑定，自营散货拼箱集运更省钱。",
      headline: "中国到加纳（特马 Tema / 阿克拉 Accra）海运拼箱与直航整柜：自营自发与 CoC 合规清关保障方案",
      subheadline: "每周定期直拼特马港，攻克加纳特有 CTN 跟踪单绑定与 CoC 质量合格证合规障碍，全流程透明计费，消除西非目的港诈骗乱收费黑幕。",
      transitWindow: "⏱️ 加纳专线预计时效",
      transitDays: "35 - 50 天",
      complianceRowTitle: "加纳 GSA CoC 证书申报周期",
      complianceRowVal: "1 - 3 工作日",
      solutionsTitle: "加纳专线合规解决方案",
      solutionsSubtitle: "二十九年口岸物流老庄，直击加纳进口清关核心风险，单据100%字符对齐，消灭卡关隐患。",
      solutions: [
        {
          title: "加纳 GSA 强制 CoC 认证",
          desc: "加纳标准局（GSA）对受管制商品目录实行强制性合格评定（EasyPASS）。货物必须在中国装船起运前申请 CoC 产品合格证书，否则货到特马港后将被强制扣仓抽样送检，并处以货值（CIF）30% 的巨额罚金。",
          icon: "ShieldCheck"
        },
        {
          title: "装箱绑定 CTN 货物跟踪单",
          desc: "加纳税务局（GRA）强制进口货物在装船前绑定 CTN 电子货物跟踪单。CTN 上的货物描述、货值、件重尺数据必须与商业发票、装箱单、提单 100% 字节对齐，不准有一个数字的字符偏差。",
          icon: "FileText"
        },
        {
          title: "严格的申报货值与币种限制",
          desc: "加纳口岸海关绝不接受到港后修改发票申报金额。此外，所有出口至加纳的商业发票，其计价币种一律只能使用美元（USD）或欧元（EUR），不接受加纳塞地或人民币直接申报，避免清关计税出现汇率纠纷。",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "🚢 直航海运整箱/拼箱 (Sea)",
          days: "35 - 50 天",
          suitability: "适合批发商品、建筑建材、日用百货及重型工业原材料。",
          sellingPoint: "自营拼箱，每周固定班期直航特马（Tema）港口。自主装柜放行。",
          warning: "近期 Tema 特马港口存在塞港风险，港口装卸出现排队现象。DDNZ 强力建议广大货主在备货期中额外多预留 1-2 周的弹性缓冲时间。"
        },
        {
          mode: "✈️ 空运双清专线 (Air)",
          days: "6 - 8 工作日",
          suitability: "适合快速消费品、高溢价数码产品、零配件及加急补货样品。",
          sellingPoint: "中国始发直飞，或通过迪拜、欧洲全货机直达阿克拉（Accra）机场。航班稳定。",
          warning: "阿克拉机场海关对高货值商品查验严格。原始随货商业发票必须与实物 100% 保持吻合，严禁虚报货品品名。"
        }
      ],
      faqs: [
        {
          q: "所有出口到加纳的产品都需要做 CoC (Certificate of Conformity) 认证吗？",
          a: "只有加纳标准局（GSA）列明的受管制商品目录（如电器、化妆品、建材、玩具、二手服饰等）才需要强制做 CoC。DDNZ 的单证专员可免费帮您检索您的 HS 编码是否在受管制目录中。"
        },
        {
          q: "加纳进口发票对于币种有什么死要求？",
          a: "加纳海关 GRA 系统规定，清关所提交的原始发票和装箱单，其交易结算货币一律只能为美元（USD）或欧元（EUR）。其余小币种或未授权币种会面临海关退档重申。"
        },
        {
          q: "特马港 Tema 最近通关和赛港情况如何？",
          a: "相比于拉各斯，特马港口秩序更好，但常在季度交替、海外节日以及加纳关税政策调整期出现 5-10 天的阶段性塞港。DDNZ 提供自营拖车配合，保障第一时间拖离港口进入我们加纳本地拆箱仓。"
        }
      ]
    },
    fr: {
      seoTitle: "Transitaire en Chine | Groupage Maritime & FCL vers l'Afrique de l'Ouest — DDNZ",
      seoDesc: "Besoin d'un transitaire en Chine fiable ? DDNZ Global propose des services de groupage maritime, inspection de conteneur и dédouanement fret maritime.",
      headline: "Groupage Maritime и FCL depuis la Chine",
      subheadline: "Logistique spécialisée et transport sécurisé vers l'Afrique de l'Ouest (Lagos, Tema, Abidjan) et l'Europe. Votre partenaire SCM de confiance depuis 1997.",
      transitWindow: "⏱️ Délais de transit pour le Ghana",
      transitDays: "35 - 50 Jours",
      complianceRowTitle: "Dépôt de certification CoC Ghana",
      complianceRowVal: "1 - 3 Jours",
      solutionsTitle: "Solutions de conformité logistique Ghana",
      solutionsSubtitle: "Navigation sans effort parmi les exigences douanières, les contrôles de qualité obligatoires et les processus CoC.",
      solutions: [
        {
          title: "Exigence de certification CoC",
          desc: "Le gouvernement du Ghana impose un certificat de conformité (CoC) pour sécuriser le marché contre les produits de mauvaise qualité. Nous aidons à l'évaluation, aux tests et à l'obtention du certificat avant le départ.",
          icon: "ShieldCheck"
        },
        {
          title: "Note de suivi électronique CTN du Ghana",
          desc: "Toutes les importations doivent comporter un numéro de suivi CTN sur le connaissement (B/L). Notre équipe gère ce dépôt numérique à Guangzhou pour éviter les blocages de fret à Tema.",
          icon: "FileText"
        },
        {
          title: "Transparence absolue des coûts de destination",
          desc: "Le Ghana a des frais de port et des taxes fluctuants. Nous protégeons les importateurs en garantissant des tarifs logistiques DDP forfaitaires, transparents et sans frais cachés.",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "🚢 Groupage LCL & FCL de Chine vers Tema",
          days: "35 - 50 Jours",
          suitability: "Idéal pour les envois réguliers de marchandises, les palettes de vente au détail et le fret volumineux.",
          sellingPoint: "Ligne de consolidation directe hebdomadaire de Guangzhou à Tema Port. Dédouanement efficace.",
          warning: "Assurez-vous que l'étiquetage correspond à 100% au certificat CoC pour éviter l'ouverture forcée des conteneurs."
        },
        {
          mode: "✈️ Fret Aérien Direct vers Accra (ACC)",
          days: "4 - 10 Jours Ouvrables",
          suitability: "Idéal pour les pièces de rechange d'usine, l'électronique fine et les lancements de produits.",
          sellingPoint: "Vols directs ou de transit rapide vers l'aéroport d'Accra, dédouanement accéléré.",
          warning: "Le fret aérien est soumis à un contrôle strict des marchandises réglementées; l'obtention de permis spécifiques peut être nécessaire."
        }
      ],
      faqs: [
        {
          q: "Pourquoi le CoC is obligatoire pour expédier vers Tema ?",
          a: "La GSA (Ghana Standards Authority) l'impose pour des raisons de conformité et de sécurité. Les marchandises non certifiées reçoivent d'importantes amendes et des inspections de douane intrusives."
        },
        {
          q: "Comment fonctionne le CTN ghanéen ?",
          a: "Le Cargo Tracking Note doit être lié à la facture commerciale et au B/L. Nous le finalisons numériquement à Guangzhou sous 48 heures."
        },
        {
          q: "Est-il possible d'expédier sous le régime DDP (rendu droits acquittés) ?",
          a: "Oui, DDNZ propose des solutions DDP fiables couvrant l'ensemble du processus de douane et des taxes ghanéennes."
        }
      ]
    }
  }
};

const PAGE_LANG_DATA = {
  en: {
    seoTitle: "China to West Africa Freight Forwarding Guide | DDNZ",
    seoDesc: "Your trusted gateway to West Africa shipping (Nigeria, Ghana, and French West Africa). 100% guaranteed Compliant DDP, free consolidation warehouse, and strict cargo pre-auditing.",
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
    formSuccessSub: "Our senior trade lane manager for West Africa will contact you within 24 hours.",
    formAnother: "Submit Another Quote Request",
    complianceBadge: "COMPLIANCE NOTICE",
    timeBadge: "TIMELINE FORECAST",
    actionQuote: "Generate Dynamic Route Quote",
    actionConsult: "Consult Compliance Specialist",
    guideHeader: "DDNZ West Africa Gate: 18-Year SCM Hardcore Blueprint",
    guideSub: "Realizing secure logistics across West Africa and overcoming customs bottlenecks."
  },
  zh: {
    seoTitle: "中国到西非(尼日利亚/加纳)海运整柜拼箱双清DDP | 西非老庄 | 华正邦泰 DDNZ Global",
    seoDesc: "二十余年专注中国至西非（尼日利亚、加纳、法语西非区）专业货运专线。提供霍尔果斯/广州双口岸集货，独家SONCAP证书代办、ECTN跟踪单申报，拒绝对港二次加价，一票到底。",
    tabNigeria: "尼日利亚（拉各斯 Lagos）专区",
    tabGhana: "加纳（特马 Tema）专区",
    faqHeading: "西非航线通关合规常见问答",
    faqSubheading: "加纳和尼日利亚口岸政策多变，DDNZ 提炼真实货主核心痛点，出货前帮您彻底避坑。",
    formTitle: "立即获取西非双清方案及报价",
    formSub: "由 DDNZ 运营十八年以上的西非大区专线经理亲自为您进行路由和精算方案设计。",
    formName: "您的姓名 / 企业名称 (必填)",
    formEmail: "您的企业邮箱 (必填)",
    formPhone: "联系电话 / 微信 / WhatsApp (必填)",
    formGoods: "货物详情描述 (如品名、箱数、总重量/立方数、有无电池等)",
    formSubmit: "立即索取专属 DDP 精算报价",
    formSuccess: "西非专线询价提交成功！",
    formSuccessSub: "西非大区专线经理正在精算成本，将在 24 小时内向您的邮箱或电话提供详细报价单。",
    formAnother: "发起新的西非询价",
    complianceBadge: "合规风控红线",
    timeBadge: "时效安全测算",
    actionQuote: "获取本条航线精确预算",
    actionConsult: "在线对接货代大庄家",
    guideHeader: "DDNZ 西非通用保命指南：18年大区老庄家硬实力方案",
    guideSub: "从中国自营集拼仓到西非口岸清关，完美击碎目的港天价隐藏收费黑幕与异国维权灾难。"
  },
  fr: {
    seoTitle: "Spécialiste du fret en Afrique de l'Ouest | DDNZ",
    seoDesc: "Votre passerelle de confiance pour l'expédition en Afrique de l'Ouest (Nigeria, Ghana, Afrique de l'Ouest francophone). Logistique DDP conforme garantie à 100%.",
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
    formSuccessSub: "Notre gestionnaire de ligne commerciale pour l'Afrique de l'Ouest vous contactera sous 24 heures.",
    formAnother: "Soumettre une nouvelle demande",
    complianceBadge: "AVIS DE CONFORMITÉ",
    timeBadge: "PRÉVISIONS DE DÉLAI",
    actionQuote: "Générer un devis d'itinéraire",
    actionConsult: "Consulter un spécialiste de la conformité",
    guideHeader: "Guide de survie DDNZ Afrique de l'Ouest : Solutions d'expert depuis 18 ans",
    guideSub: "Sécurisation de la logistique à travers l'Afrique de l'Ouest et élimination des goulets d'étranglement douaniers."
  }
};

const UNIVERSAL_REDLINES = {
  en: {
    title: "Avoid-Pitfall SCM Gate: Critical Operation Warnings",
    subtitle: "West African shipping requires deep localized execution. If you do not follow these standard operating protocols, you will face lost cargo and unrecoverable port fines.",
    items: [
      {
        id: "01",
        title: "Guangzhou Self-Operated 1688 Consolidation Warehouse",
        desc: "Overseas SME buyers often procure miscellaneous retail products from dozens of scattered 1688 or Alibaba suppliers. DDNZ offers free, safe storage at our self-operated Guangzhou main warehouse (never sub-leased). We provide digital vendor management, barcode entry scans, packaging reinforcement, and advanced Cube Optimization (体积精算) to eliminate air pockets, packaging foam, and cargo waste."
      },
      {
        id: "02",
        title: "Your Eyes & Ears: On-Site Chinese Pre-Shipment Inspection",
        desc: "We provide complete quality assurance inside Chinese factories before cargo loading. We conduct visual quality check-ups, product verification, loading counts, and wood crating reinforcement. This completely eliminates the threat of receiving damaged, counter-feit, or missing goods upon opening containers thousands of miles away in Africa."
      },
      {
        id: "03",
        title: "Bait-and-Switch Demolished: Zero Hidden Fees Promise",
        desc: "We strongly condemn deceptive shipping agents who charge $50 in China but extort $2000 at African destinations! DDNZ implements a strictly transparent, contract-bound all-in rate (DDP/DDU) locked in USD or RMB. We absorb destination fluctuation costs and customs IT system downtimes. No hidden surcharges."
      },
      {
        id: "04",
        title: "French-Speaking West Africa Network (Abidjan & Dakar)",
        desc: "Beyond English hubs, DDNZ manages direct routes to French-speaking West Africa: Abidjan (Côte d'Ivoire) in 40-50 days, Dakar (Senegal) in 50-60 days, and seamless multimodal rail/road trucking transits to inland countries like Mali. Our bilingual document team prepares impeccable French-language clearance dossiers and secures BESC/BIETC certificates."
      }
    ]
  },
  zh: {
    title: "西非通用保命指南：货主核心避坑红线",
    subtitle: "西非物流专线水极深，目的港关卡重重。不遵守以下操作规范，大货到港后可能面临无尽的勒索甚至被海关查封充公。",
    items: [
      {
        id: "01",
        title: "放大自营广州集拼仓核心枢纽优势",
        desc: "海外中小采购商往往从不同的 1688、淘宝或阿里巴巴供应商零散采购散货。DDNZ 广州自营总仓（自有非租用）提供免费全网订单集拼、多供应商 Vendor 集中理货、极致体积优化计算（Cube Optimization）。我们重新包装加固，打托盘拼箱（LCL），彻底打碎高昂的物流多重计费泡沫，保障每一立方都实打实不装空气。"
      },
      {
        id: "02",
        title: "中国供应链本土品控验货（防范货不对板）",
        desc: "我们在货物打包、装柜前，派遣品控专员实地进行 Pre-shipment 装运前质检和实地验厂。检查外观质量、清点数量、测试功能、监督装箱加固。杜绝大货漂洋过海跨越万里到了拉各斯或特马，开箱才发现是“假冒伪劣”、“垃圾货”的异国远程维权灾难。"
      },
      {
        id: "03",
        title: "一票到底包税：坚决粉碎目的港敲诈黑幕",
        desc: "全网痛斥那些“中国收 50 美金，目的港强收 2000 美金”的无良二道贩子货代！DDNZ 极力主张一站式双清包税一口价（DDP/DDU），合同内用美元或人民币一票锁定。绝不因为西非口岸海关系统瘫痪、当地货币极速贬值或者官员索贿，转嫁成本要求买家补差价扣货。"
      },
      {
        id: "04",
        title: "法语西非区（科特迪瓦阿比让、塞内加尔达喀尔）扩容",
        desc: "除英语系国家外，DDNZ 在法语西非大区同样拥有强悍清关路权：科特迪瓦阿比让（40-50天）、塞内加尔达喀尔（50-60天），以及通过港口向内陆国家（马里 Mali、布基纳法索）进行公路多式联运。单证团队提供纯正法语/双语清关单据预审，并办妥 BESC 跟踪单。"
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

export default function ShippingWestAfrica() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Parse country query parameter, default to 'nigeria'
  const getCountryFromQuery = () => {
    const params = new URLSearchParams(location.search);
    const countryParam = params.get('country') || params.get('dest');
    if (countryParam && countryParam.toLowerCase() === 'ghana') return 'ghana';
    return 'nigeria';
  };

  const [selectedCountry, setSelectedCountry] = useState<'nigeria' | 'ghana'>(getCountryFromQuery());
  const [isLocked, setIsLocked] = useState(false);
  const [activeTransportMode, setActiveTransportMode] = useState<number>(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lockParam = params.get('lock') === 'true' || params.get('locked') === 'true' || params.get('lockCountry') === 'true';
    setIsLocked(lockParam);

    const currentQueryCountry = getCountryFromQuery();
    if (currentQueryCountry !== selectedCountry) {
      setSelectedCountry(currentQueryCountry);
    }
  }, [location.search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('page_view', { path: '/shipping-from-china-to-west-africa', country: selectedCountry });
  }, [location.pathname, selectedCountry]);

  const handleCountryTabChange = (country: 'nigeria' | 'ghana') => {
    setSelectedCountry(country);
    navigate(`?country=${country}`, { replace: true });
    setActiveTransportMode(0);
    setActiveFaq(null);
  };

  const activeLang = language === 'zh' ? 'zh' : (language === 'fr' ? 'fr' : 'en');
  
  const spec = WEST_AFRICA_DATA[selectedCountry][activeLang];
  const t = (key: string) => {
    const data = PAGE_LANG_DATA[activeLang];
    return data[key] || '';
  };

  const getLocalizedPath = (path: string) => {
    if (language === 'en') return path;
    const langPrefix = language === 'zh' ? 'zh-cn' : language;
    return `/${langPrefix}${path === '/' ? '' : path}`;
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-[#FF8A00] shrink-0" />;
      case 'FileText': return <FileText className="w-5 h-5 text-[#FF8A00] shrink-0" />;
      case 'Search': return <Search className="w-5 h-5 text-[#FF8A00] shrink-0" />;
      default: return <Package className="w-5 h-5 text-[#FF8A00] shrink-0" />;
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
    trackEvent('west_africa_quote_submit', { ...formData, selectedCountry });

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
    <div className="min-h-screen bg-gradient-to-b from-[#0A051B] to-[#120A2A] text-white font-sans overflow-x-hidden">
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
          {/* Dark Purple Gradient Cover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A051B] via-[#0A051B]/80 to-transparent" />
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
                        ? 'bg-[#FF8A00] text-white shadow-lg scale-105'
                        : 'bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    🇳🇬 {t('tabNigeria')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCountryTabChange('ghana')}
                    className={`px-5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${
                      selectedCountry === 'ghana'
                        ? 'bg-[#FF8A00] text-white shadow-lg scale-105'
                        : 'bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    🇬🇭 {t('tabGhana')}
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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FF8A00]/10 border border-[#FF8A00]/30 text-[#FF8A00] text-xs font-black tracking-widest uppercase">
                  🌍 DDNZ WEST AFRICA LINER
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#FF8A00]">
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
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {language === 'zh' ? 'SONCAP / CoC 合规护航' : 'SONCAP / CoC Certified'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF8A00]/10 border border-[#FF8A00]/20 text-xs font-bold text-[#FF8A00]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]"></span>
                      {language === 'zh' ? '自营目的港单证与清关' : 'On-Site Customs Broker'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
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
                    className="text-xs font-black text-white hover:text-[#FF8A00] transition-colors flex items-center justify-center gap-1.5 cursor-pointer w-full h-full min-h-[44px]"
                  >
                    <span>{language === 'zh' ? '立即询价' : 'Inquire Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF8A00]" />
                  </button>
                </div>
              </div>
            </div>

            {/* 右侧硬核时效侧边栏：占据 5 列 */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-lg font-black tracking-wide text-[#FF8A00] uppercase mb-2">
                {language === 'zh' ? '西非专线真实货运时效' : (language === 'fr' ? 'Délais de Transit en Afrique de l\'Ouest' : 'West Africa Hub Transit Windows')}
              </h3>
              
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-5 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-white">{language === 'zh' ? '拉各斯海运双清 (Apapa / Tin Can)' : 'Lagos (Apapa / Tin Can) Ocean'}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{language === 'zh' ? '广州集拼仓直发整箱/拼箱' : (language === 'fr' ? 'Consolidation directe depuis le hub de Guangzhou' : 'Guangzhou Hub Direct Consolidation')}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="text-sm font-extrabold text-[#FF8A00] whitespace-nowrap">⏱️ {WEST_AFRICA_DATA.nigeria[activeLang].transitDays}</span>
                </div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-5 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-white">{language === 'zh' ? '阿克拉海运双清 (Accra / Tema)' : 'Accra / Tema Premium Freight'}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{language === 'zh' ? '全程双清、SABER与证书核准托底' : (language === 'fr' ? 'Dédouanement complet Form M & SONCAP' : 'Full Form M & SONCAP Pre-Clearance')}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="text-sm font-extrabold text-[#FF8A00] whitespace-nowrap">⏱️ {WEST_AFRICA_DATA.ghana[activeLang].transitDays}</span>
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
              <span className="px-3 py-1 bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                🛡️ Compliance Vault
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-4">
                {spec.solutionsTitle}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-sm sm:text-base font-medium">
                {spec.solutionsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {spec.solutions.map((sol: any, idx: number) => (
                <div key={idx} className="bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.04] flex flex-col justify-between group">
                  <div>
                    <div className="bg-[#FF8A00]/10 p-3 rounded-xl inline-block mb-4">
                      {getIcon(sol.icon)}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">
                      {sol.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                      {sol.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center gap-2 text-xs font-bold text-[#FF8A00]">
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
              <span className="px-3 py-1 bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                📊 {language === 'zh' ? '核心时效透视' : 'SCM Lead-Time Matrix'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-4">
                {language === 'zh' ? '西非多式联运全通道时效数据表' : 'West Africa Multimodal Lead-Time Matrix'}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-6" />
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
                          ? 'bg-gradient-to-r from-[#4B27B1] to-[#FF8A00]/40 text-white border-transparent shadow-xl translate-x-1' 
                          : 'bg-white/[0.02] text-slate-300 border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{row.mode.split(' ')[0]}</span>
                        <div>
                          <h4 className="text-sm font-black tracking-tight text-white">
                            {row.mode.replace(/^\S+\s+/, '')}
                          </h4>
                          <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-purple-200' : 'text-slate-500'}`}>
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
                      {spec.multimodalTable[activeTransportMode].mode.split(' ')[0]}
                    </div>

                    <div className="relative z-10 space-y-6">
                      <div>
                        <span className="px-2.5 py-1 bg-[#FF8A00]/10 text-[#FF8A00] text-[10px] font-black uppercase tracking-wider rounded-lg">
                          {language === 'zh' ? '深度解析' : 'SCM Detail Panel'}
                        </span>
                        <h3 className="text-xl md:text-2xl font-black text-white mt-2">
                          {spec.multimodalTable[activeTransportMode].mode}
                        </h3>
                        <p className="text-[#FF8A00] text-sm font-black mt-1">
                          ⏱️ {language === 'zh' ? '货主到门时效' : 'Door-to-Door Window'}: <span className="font-mono text-base font-bold text-white">{spec.multimodalTable[activeTransportMode].days}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div>
                          <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                            🎯 {language === 'zh' ? '最适用货品 / 场景' : 'Best Suited For'}
                          </h5>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                            {spec.multimodalTable[activeTransportMode].suitability}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-[#FF8A00] uppercase tracking-widest mb-1.5">
                            💡 {language === 'zh' ? 'DDNZ 专线技术卖点' : 'DDNZ Unique SCM Features'}
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
                            ⚠️ {language === 'zh' ? '风险提示 & 操作合规' : 'Operation Pre-Warnings'}
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
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] hover:opacity-90 text-white text-xs font-black tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap shrink-0 self-end"
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
              <span className="px-3 py-1 bg-[#FF8A00]/10 border border-[#FF8A00]/20 text-[#FF8A00] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                ⚡ {language === 'zh' ? '通用避坑指南' : 'SCM Redlines'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4">
                {redlines.title}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-6" />
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
                  <div className="flex items-center gap-2.5 text-[#FF8A00] font-black mb-4 text-sm sm:text-base">
                    <ShieldAlert className="w-5.5 h-5.5 text-[#FF8A00] flex-shrink-0" />
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
              <div className="w-10 h-1 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-6" />
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
