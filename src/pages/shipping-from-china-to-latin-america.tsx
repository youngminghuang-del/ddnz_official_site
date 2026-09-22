import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import CountryRegionLink from '../features/freight/CountryRegionLink';
import WhatsAppFloat from '../components/WhatsAppFloat';
import ScrollToTop from '../components/ScrollToTop';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import GetAQuote from '../components/GetAQuote';
import MarketSourcingHandoff from '../components/MarketSourcingHandoff';
import LatinAmericaFreightDepth from '../components/LatinAmericaFreightDepth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, AlertTriangle, Ship, Package, ShieldCheck, 
  Search, ArrowRight, CheckCircle2, MessageSquare, ShieldAlert,
  Globe, Clock, HelpCircle, Plane, FileText, Scale, ArrowUpRight
} from 'lucide-react';
import { trackEvent } from '../lib/utils';
import { buildShippingCountryPath, getShippingCountrySlug } from '../utils/shippingCountryRoutes';
import { createLocalizedShippingContent, createLocalizedShippingRedlines } from '../utils/localizedShippingContent';

const SHOW_MEDIA_PLANNING = import.meta.env.DEV;

function FreightMediaPlanningSlot({
  index,
  title,
  format,
  note,
  dark = false,
  compact = false,
}: {
  index: string;
  title: string;
  format: string;
  note: string;
  dark?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`border border-dashed p-5 ${dark ? 'border-white/25 bg-white/[0.025] text-white' : 'border-[#9eabb8] bg-[#f3f5f7] text-[#10243f]'}`}>
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${dark ? 'text-amber-300' : 'text-[#c94f2f]'}`}>
            素材位 {index} · 本地预览标记
          </p>
          <h3 className={`mt-2 font-black ${compact ? 'text-sm' : 'text-lg'}`}>{title}</h3>
          <p className={`mt-2 text-xs leading-6 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{note}</p>
        </div>
        <span className={`shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider ${dark ? 'text-slate-500' : 'text-slate-500'}`}>
          {format}
        </span>
      </div>
      <p className={`mt-4 border-t pt-3 text-[10px] font-bold ${dark ? 'border-white/10 text-slate-500' : 'border-[#d4dce4] text-slate-500'}`}>
        未提供素材时，正式页面自动隐藏
      </p>
    </div>
  );
}

const LATAM_DATA = {
  mexico: {
    en: {
      seoTitle: "China to Mexico Freight Forwarding Guide | DDNZ Global",
      seoDesc: "Direct FCL/LCL sea and air freight from China to Mexico. Shipping with NOM quality conformance, customs tariff mapping, and robust last-mile delivery.",
      headline: "Freight Forwarding to Mexico | NOM & RFC Documentation Support",
      subheadline: "Ocean and air freight planning from China to Manzanillo, Lazaro Cardenas, and Mexico City, with NOM, RFC, and destination clearance coordination.",
      transitWindow: "Mexico Transit Windows",
      transitDays: "Sea: 35-50 Days | Air: 5-12 Days",
      complianceRowTitle: "NOM & Import Document Review",
      complianceRowVal: "Before Booking",
      solutionsTitle: "Mexico SCM Compliance Solutions",
      solutionsSubtitle: "Direct shipping lines designed to clear customs checkpoints, tariff barriers, and local transport regulations.",
      solutions: [
        {
          title: "Rigid B/L Tax ID Character Matching",
          desc: "Review the consignee name, address, and RFC/CURP across the Bill of Lading, commercial invoice, and destination documentation before shipment.",
          icon: "FileText"
        },
        {
          title: "NOM Conformity Requirement Review",
          desc: "Electronics, electrical tools, and lighting fixtures may be subject to Norma Oficial Mexicana (NOM) requirements. Confirm the current product and importer obligations before loading.",
          icon: "ShieldCheck"
        },
        {
          title: "Manzanillo Terminal Traffic Mitigation",
          desc: "Manzanillo can experience congestion. Confirm carrier free-time terms, document readiness, and the destination handling plan before departure.",
          icon: "Clock"
        }
      ],
      multimodalTable: [
        {
          mode: "Sea Freight (FCL/LCL)",
          days: "35 - 50 Days (FCL) | 45 - 60 Days (LCL)",
          suitability: "Highly optimized for heavy auto components, retail commodities, structural materials, and manufacturing equipment.",
          sellingPoint: "POL: Guangzhou, Shenzhen, Shanghai to POD: Manzanillo, Lazaro Cardenas. High frequency ocean carrier booking.",
          warning: "Pacific-port inspections can require close review of RFC, invoice, and packing details. Use accurate declared values and confirm the document set before sailing."
        },
        {
          mode: "Air Freight (Express / Tax-Inclusive)",
          days: "5 - 7 Days (Express) | 8 - 12 Days (Tax-Inclusive)",
          suitability: "Ideal for urgent automotive tooling, electronics parts, high-value consumer stock, and medical devices.",
          sellingPoint: "Direct cargo air lift to Mexico City (MEX) or Guadalajara (GDL) airports. Efficient security handling.",
          warning: "Lithium products and branded goods may require additional review by the carrier or customs. Confirm commodity acceptance and documentation before shipping."
        }
      ],
      faqs: [
        {
          q: "What is the NOM Certificate and is it mandatory for Mexican imports?",
          a: "NOM (Norma Oficial Mexicana) can apply to specified products, including some electronics, household appliances, and toys. Confirm whether the product and importer require a current NOM certificate before loading."
        },
        {
          q: "Why is the tax ID (RFC) so critical on Mexican B/L documents?",
          a: "The RFC is the Mexican federal tax registration number. Review its consistency across the Bill of Lading, commercial invoice, packing list, and destination records before dispatch."
        },
        {
          q: "How should shippers plan for congestion at Manzanillo Port?",
          a: "Confirm the carrier's free-time terms and destination document requirements before departure. Include contingency time in the shipment plan, as terminal conditions can vary."
        }
      ]
    },
    zh: {
      seoTitle: "中国到墨西哥海运整柜拼箱与空运 DDP | NOM 文件支持 | 华正邦泰国际货运",
      seoDesc: "中国至墨西哥的海运、空运与 DDP 服务协调，支持 NOM、RFC 等进口文件的出运前核对。",
      headline: "中国到墨西哥海运/空运：NOM 与 RFC 文件协调支持",
      subheadline: "提供中国集货、起运资料核对以及与目的地清关合作方的服务衔接，协助进口商确认 NOM 与 RFC 要求。",
      transitWindow: "墨西哥专线预计时效",
      transitDays: "海运: 35-50天 | 空运: 5-12工作日",
      complianceRowTitle: "NOM 认证申报与海关预先审单",
      complianceRowVal: "2 - 5 天",
      solutionsTitle: "墨西哥出运前文件核对",
      solutionsSubtitle: "订舱前把 RFC、产品要求、提单资料和目的港操作逐项确认，减少货到港后补资料。",
      solutions: [
        {
          title: "提单与 RFC 信息核对",
          desc: "出运前请核对提单（B/L）上的收货人、通知人和税号（RFC/CURP）是否与商业发票及进口资料一致。",
          icon: "FileText"
        },
        {
          title: "电子电器 NOM 要求核对",
          desc: "电子产品、灯具等产品可能适用 NOM 要求；应在出运前确认产品和进口商的适用义务。",
          icon: "ShieldCheck"
        },
        {
          title: "曼萨尼约港操作规划",
          desc: "Manzanillo 可能出现拥堵。请在出运前确认船公司免箱条款、单证准备情况和目的港操作计划。",
          icon: "Clock"
        }
      ],
      multimodalTable: [
        {
          mode: "海运整箱/拼箱 (Sea Freight)",
          days: "FCL 整柜 35-50 天 | LCL 拼箱 45-60 天",
          suitability: "适用于大型汽配、日用百货、建筑建材、重型工业机械及高体积商品。",
          sellingPoint: "可根据船期与舱位情况，规划广州、南沙、深圳、上海至 Manzanillo、Lazaro Cardenas 的海运服务。",
          warning: "太平洋港口查验可能涉及 RFC、发票和装箱资料核对。请确保商业资料如实反映货物情况。"
        },
        {
          mode: "空运 / 商业快递 (Air Freight)",
          days: "商业快递 5-7 工作日 | 空运参考 8-12 工作日",
          suitability: "适合急需的汽车模具、消费电子、时尚商品和零部件样品。",
          sellingPoint: "可依据可用直飞或中转航班，结合货物属性和目的地操作要求规划至 MEX/GDL 的空运路线。",
          warning: "带电池、强磁或其他受限属性的货物，应在订舱前提供准确参数，确认承运人是否接受及需要哪些文件。"
        }
      ],
      faqs: [
        {
          q: "什么是 NOM 认证？是不是所有出口墨西哥的电器都要做？",
          a: "NOM（Norma Oficial Mexicana）适用于部分产品类别，包括部分电子电器、照明和玩具。应在装运前确认产品和进口商是否需要有效的 NOM 文件。"
        },
        {
          q: "为什么墨西哥提单上的 RFC 需要提前核对？",
          a: "RFC 是墨西哥的纳税登记号。建议在出运前核对其与提单、商业发票、装箱单和目的地资料的一致性。"
        },
        {
          q: "出运前如何准备曼萨尼约或墨西哥城的目的地操作？",
          a: "请在订舱前确认目的港的单证流程、免箱条款和可用操作安排。具体时效与费用取决于船公司、货物和目的地当时条件。"
        }
      ]
    }
  },
  brazil: {
    en: {
      seoTitle: "China to Brazil Freight Forwarding Guide | DDNZ Global",
      seoDesc: "Freight planning from China to Brazil, including ocean and air options plus CNPJ, NCM and import-document coordination.",
      headline: "Shipping to Brazil (Santos) | CNPJ, NCM & Customs Documentation Support",
      subheadline: "Freight planning from China to Santos with CNPJ, NCM, and destination documentation coordination based on the confirmed service scope.",
      transitWindow: "Brazil Transit Windows",
      transitDays: "Sea: 50-80 Days | Air: 15-20 Days",
      complianceRowTitle: "Importer Registration & NCM Review",
      complianceRowVal: "Before Booking",
      solutionsTitle: "Brazil SCM Compliance Solutions",
      solutionsSubtitle: "Tackling Latin America's most demanding tax and single-window validation structures.",
      solutions: [
        {
          title: "Importer Registration & Product Review",
          desc: "Confirm the importer registration, NCM classification and applicable import treatment before shipment. The relevant requirements depend on the product and current Siscomex rules.",
          icon: "FileText"
        },
        {
          title: "Multi-Agency Certifications Shield",
          desc: "Electronics, toys, telecom devices, cosmetics and health products may involve INMETRO, ANATEL or ANVISA requirements. Confirm the applicable product and importer obligations before loading.",
          icon: "ShieldCheck"
        },
        {
          title: "Rigid Box Weight & Freight Disclosures",
          desc: "Review packing, weight, freight and product information across the Bill of Lading, invoice and packing list before cargo is released.",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "Sea Freight (DDP / FCL / LCL)",
          days: "Direct Voyage: 30-35 Days | Complete DDP: 50-80 Days",
          suitability: "Highly suitable for structural steel, solar panels, heavy electrical equipment, cosmetics packaging, and wholesale e-commerce inventories.",
          sellingPoint: "Routes from China to Santos are planned around carrier schedules, cargo requirements and the confirmed destination service scope.",
          warning: "Brazilian clearance timelines can vary. Confirm applicable import licences, tax scope, and destination handling requirements before shipment."
        },
        {
          mode: "Air Freight (Indirect Hub Consolidation)",
          days: "15 - 20 Working Days",
          suitability: "Recommended for high-value mobile components, semiconductor electronics, precision mechanical spare parts, and cosmetic prototypes.",
          sellingPoint: "Plan available direct or connecting air options to São Paulo (GRU) around carrier schedules, cargo acceptance and destination requirements.",
          warning: "Confirm carrier routing, commodity acceptance, NCM classification and destination documentation before shipment."
        }
      ],
      faqs: [
        {
          q: "Why do Brazil shipments require detailed document preparation?",
          a: "Brazil can require product-specific import treatment, licensing or approvals. Use the NCM classification in Siscomex to identify the current competent authority and confirm the document set with the importer before shipment."
        },
        {
          q: "What tax IDs must be present on a Brazilian shipment?",
          a: "Confirm the importer identity and registration information that applies to the transaction, then keep the commercial and transport documents consistent. Requirements can differ by import regime and consignee profile."
        },
        {
          q: "How does DDNZ resolve the complex tax burden with DDP?",
          a: "DDP availability and included taxes, duties, clearance and delivery services depend on the destination, product and importer profile. Confirm the written service scope before booking."
        }
      ]
    },
    zh: {
      seoTitle: "中国到巴西（圣保罗/桑托斯）海运 DDP 与空运服务 | 华正邦泰国际货运",
      seoDesc: "中国至巴西圣保罗、桑托斯的海运、空运与 DDP 服务协调，支持 CNPJ、NCM 和进口文件的出运前核对。",
      headline: "中国到巴西（桑托斯 Santos）海运/空运：CNPJ、NCM 与进口文件协调支持",
      subheadline: "提供中国至桑托斯的运输规划，并在确认的服务范围内协调 CNPJ、NCM、进口许可和目的地清关资料。",
      transitWindow: "巴西专线预计时效",
      transitDays: "海运: 50-80天 | 空运: 15-20工作日",
      complianceRowTitle: "CNPJ 纳税备案核查与 NCM 申报纠错",
      complianceRowVal: "3 - 7 天",
      solutionsTitle: "巴西出运前文件核对",
      solutionsSubtitle: "围绕 CNPJ、NCM、进口许可及目的地申报要求，提供出运前资料核对与服务协调。",
      solutions: [
        {
          title: "CNPJ/CPF 与 NCM 信息核对",
          desc: "出运前请确认企业进口商的 CNPJ 或个人进口商的 CPF，并核对其与 NCM 编码在运输和进口资料中的一致性。",
          icon: "FileText"
        },
        {
          title: "产品要求核对 (INMETRO/ANATEL/ANVISA)",
          desc: "家电、电子、玩具、通信设备、美妆及医疗相关产品可能涉及 INMETRO、ANATEL 或 ANVISA 等要求。请在装运前确认产品和进口商的适用义务。",
          icon: "ShieldCheck"
        },
        {
          title: "包装、重量与运费资料核对",
          desc: "货物重量、包装、运费及品名信息应在提单、发票、装箱单和进口资料中保持一致。",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "桑托斯海运整箱 / 拼箱",
          days: "海上运输与目的地操作合计参考: 50 - 80 天",
          suitability: "适用于建筑建材、太阳能光伏组件、工业原料、重型电气机械及批量百货。",
          sellingPoint: "根据船期、货物资料和目的地服务范围，规划从中国至 Santos 的海运方案。",
          warning: "巴西清关时效会因产品、文件、进口许可和目的地操作而变化。请在出运前确认适用的 LI、税费范围及清关资料。"
        },
        {
          mode: "圣保罗空运 (Air Freight)",
          days: "15 - 20 工作日",
          suitability: "适合高附加值精密仪器零配件、移动通讯元器件、化妆品研发样品及高档服装样品。",
          sellingPoint: "可根据可用航班、货物属性与目的地操作要求，规划经适合中转点至圣保罗瓜鲁柳斯机场（GRU）的空运路线。",
          warning: "空运货物的发票、收货人 CNPJ/CPF、NCM 和产品资料应在出运前核对一致。"
        }
      ],
      faqs: [
        {
          q: "为什么巴西出运需要细致的文件准备？",
          a: "巴西进口可能涉及 NCM 分类、进口主体资料、许可、产品要求和多项税费。应由进口商及其当地服务方在装运前确认适用要求，并让提单、发票、装箱单与申报资料保持一致。"
        },
        {
          q: "什么是 NCM 编码，和国内的 HS Code 相比有什么需要注意的？",
          a: "NCM（Nomenclatura Comum do Mercosul）基于 HS 体系，并用于巴西等南共市成员的商品分类。具体编码会影响税费和监管要求，应由进口商或合格的当地专业方确认。"
        },
        {
          q: "巴西 DDP 或到门报价需要先确认什么？",
          a: "需要先确认货物、进口主体、NCM、许可、税费口径以及目的地清关和派送责任。可提供的 DDP 或到门范围以单票书面报价为准，不能用一条通用承诺覆盖所有产品。"
        }
      ]
    }
  },
  argentina: {
    en: {
      seoTitle: "China to Argentina Freight Forwarding Guide | DDNZ Global",
      seoDesc: "Ocean and air freight planning from China to Buenos Aires, with CUIT, import-document, and destination-handling coordination.",
      headline: "Logistics to Argentina | CUIT & Import Documentation Support",
      subheadline: "Ocean and air freight planning from China to Buenos Aires, with import-document and destination-handling coordination based on the confirmed service scope.",
      transitWindow: "Argentina Transit Windows",
      transitDays: "Sea: 35-50 Days | Air: 12-18 Days",
      complianceRowTitle: "CUIT & Import-Requirement Review",
      complianceRowVal: "4 - 8 Days",
      solutionsTitle: "Argentina SCM Compliance Solutions",
      solutionsSubtitle: "Supporting shipment planning around import documentation, CUIT data, and destination operating requirements.",
      solutions: [
        {
          title: "Trade-payment Requirement Review",
          desc: "Foreign-exchange and payment requirements can affect an importer's ability to complete a transaction. Confirm payment, banking, and import conditions with qualified local advisers and your trading counterpart before shipping.",
          icon: "ShieldCheck"
        },
        {
          title: "Current Import-Authorisation Review",
          desc: "Confirm the current import authorisation requirements, NCM classification, and importer CUIT status before loading. Requirements may change and should be checked with the importer and qualified destination advisers.",
          icon: "FileText"
        },
        {
          title: "Mandatory CUIT Tax ID Characters Match",
          desc: "Review the CUIT and NCM information across the Bill of Lading, invoice, packing list, and destination documentation before shipment.",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "Sea Freight (FCL / LCL)",
          days: "35 - 50 Days",
          suitability: "Optimized for raw industrial materials, energy components, high-density manufacturing parts, and general retail stock.",
          sellingPoint: "Available sailings and consolidation options are planned against carrier schedules and destination delivery requirements.",
          warning: "Port congestion and labour disruptions can affect Buenos Aires schedules. Confirm document readiness and include a contingency buffer in the shipment plan."
        },
        {
          mode: "Air Freight (Indirect Air Bridge)",
          days: "12 - 18 Working Days",
          suitability: "Best suited for critical machinery spare parts, high-end mobile devices, pharmaceutical devices, and fast-moving retail samples.",
          sellingPoint: "Consolidation via US Miami (MIA) or European hubs to Buenos Aires Ministro Pistarini (EZE) Airport.",
          warning: "Airport cargo screening can require a confirmed CUIT, product classification, and document set. Review destination requirements before dispatch."
        }
      ],
      faqs: [
        {
          q: "How can foreign-exchange requirements affect a shipment to Argentina?",
          a: "Foreign-exchange and payment conditions may affect an importer's ability to complete the transaction. Confirm the commercial terms, banking process, and local import requirements with qualified advisers before dispatching cargo."
        },
        {
          q: "Which import authorisations should be checked for Argentina?",
          a: "Procedures can change and may depend on the product and importer. Confirm the current authorisation, timing and document requirements with the importer and qualified local advisers before booking."
        },
        {
          q: "What tax registry must be verified before shipping to Buenos Aires?",
          a: "CUIT is Argentina's tax identification number. Review its consistency across the Bill of Lading, invoice, packing list, and destination documentation before shipping."
        }
      ]
    },
    zh: {
      seoTitle: "中国到阿根廷（布宜诺斯艾利斯）海运与空运服务 | 华正邦泰国际货运",
      seoDesc: "中国至阿根廷的海运、空运与集货服务，支持 CUIT、进口文件及目的地操作的出运前协调。",
      headline: "中国到阿根廷（布宜诺斯艾利斯）项目货运：CUIT 与进口文件协调支持",
      subheadline: "提供海运及空运路线规划，并在确认的服务范围内协调 CUIT、进口资料及目的地操作要求。支付与外汇事项请由交易双方及合格专业机构确认。",
      transitWindow: "阿根廷专线预计时效",
      transitDays: "海运: 35-50天 | 空运: 12-18工作日",
      complianceRowTitle: "CUIT 与当前进口要求核对",
      complianceRowVal: "4 - 8 天",
      solutionsTitle: "阿根廷出运前文件核对",
      solutionsSubtitle: "围绕 CUIT、进口许可、装运文件与目的地操作要求，提供出运前资料核对与服务协调。",
      solutions: [
        {
          title: "贸易支付条件确认",
          desc: "外汇与支付条件可能影响进口商完成交易的能力。建议在出运前由交易双方与具备资质的当地专业机构确认付款、银行和进口条件。",
          icon: "ShieldCheck"
        },
        {
          title: "当前进口许可与 CUIT 税号核对",
          desc: "请在装船前确认当前进口许可要求、NCM 编码及进口商 CUIT 状态。相关要求可能调整，应与进口商及目的地合格专业机构复核。",
          icon: "FileText"
        },
        {
          title: "提单 CUIT / NCM 信息核对",
          desc: "出运前请核对提单（B/L）、发票、装箱单与目的地文件中的 CUIT 和 NCM 信息。",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "海运整箱/拼箱 (Sea Freight)",
          days: "35 - 50 天",
          suitability: "适用于工业原材料、新能源光伏、重型机械零配件、大宗日用品及高密度商业库存。",
          sellingPoint: "可按船公司船期、集拼条件和目的地交付要求规划至布宜诺斯艾利斯的海运服务。",
          warning: "布宜诺斯艾利斯的港口拥堵或劳资事件可能影响计划。请确认单证准备情况，并在运输计划中预留合理缓冲。"
        },
        {
          mode: "空运 / 联运方案 (Air Freight)",
          days: "12 - 18 工作日",
          suitability: "急需的高端电子数码、精密机械模具、高附加值样品及高时效性时尚快消品。",
          sellingPoint: "可根据可用航班、货物属性与目的地操作要求，规划经适合中转点至布宜诺斯艾利斯皮斯塔里尼机场（EZE）的空运路线。",
          warning: "机场货物筛查可能需要确认 CUIT、产品分类和文件完整性。请在出运前与进口商及目的地合格专业机构核对要求。"
        }
      ],
      faqs: [
        {
          q: "支付与外汇条件会如何影响阿根廷出运？",
          a: "外汇与支付条件可能影响进口商完成交易。建议在货物出运前由交易双方和具备资质的当地专业机构确认付款、银行和进口要求。"
        },
        {
          q: "阿根廷当前有哪些进口许可需要提前确认？",
          a: "相关程序可能调整，也会因产品与进口主体不同而变化。请在订舱前由进口商及当地合格专业机构确认当前许可、办理时间和文件要求。"
        },
        {
          q: "阿根廷清关还需要准备哪些核心单据？",
          a: "除提单、发票和装箱单外，受监管产品可能需要额外证明或认证。请由进口商和目的地合格专业机构在出运前确认具体要求。"
        }
      ]
    }
  }
};

const LATAM_LOCALIZED = LATAM_DATA as Record<string, any>;
LATAM_LOCALIZED.peru = {
  en: {
    ...LATAM_LOCALIZED.mexico.en,
    seoTitle: 'Shipping from China to Peru | Freight Forwarding Guide | DDNZ Global',
    seoDesc: 'Ocean and air freight planning from China to Callao and Lima, with document review and destination-handling coordination.',
    headline: 'Shipping from China to Peru | Callao and Lima Freight Planning',
    subheadline: 'FCL, LCL, and air freight planning from China to Callao and Lima, with shipment-document and destination-operation coordination.',
    transitWindow: 'Peru Transit Windows', transitDays: 'Sea: 35-50 Days | Air: 7-14 Days',
    complianceRowTitle: 'Import Document Review', complianceRowVal: 'Before Booking',
    solutionsTitle: 'Peru Freight and Import-Document Planning',
    solutionsSubtitle: 'Plan cargo data, product classification, and destination handling requirements before the shipment moves.',
    solutions: [
      { title: 'Commercial Document Consistency', desc: 'Review the consignee details, product description, quantity, and values across the Bill of Lading, invoice, packing list, and destination documents.', icon: 'FileText' },
      { title: 'Product Classification Review', desc: 'Confirm the product classification and any applicable permits, certificates, or importer requirements before loading.', icon: 'ShieldCheck' },
      { title: 'Callao Destination Planning', desc: 'Confirm carrier terms, document readiness, and the destination handling plan before departure; port conditions can change.', icon: 'Clock' }
    ],
    multimodalTable: [
      { mode: 'Sea Freight (FCL / LCL)', days: '35 - 50 Days (FCL) | 45 - 60 Days (LCL)', suitability: 'Suitable for commercial inventory, machinery, building materials, and consolidated cargo.', sellingPoint: 'Plan available sailings from China ports to Callao against carrier schedules and destination delivery requirements.', warning: 'Confirm accurate commercial documents and destination requirements before sailing.' },
      { mode: 'Air Freight', days: '7 - 14 Working Days', suitability: 'Suitable for samples, parts, high-value cargo, and time-sensitive replenishment.', sellingPoint: 'Plan direct or connecting air options to Lima (LIM) according to cargo acceptance and destination operations.', warning: 'Carrier acceptance and destination documentation should be confirmed before dispatch.' }
    ],
    faqs: [
      { q: 'Which documents should be reviewed before shipping to Peru?', a: 'Review the Bill of Lading, commercial invoice, packing list, consignee information, product description, and any product-specific documents with the importer before shipment.' },
      { q: 'How should a shipper plan for Callao?', a: 'Confirm carrier terms, destination document readiness, and the handling plan before departure. Include an appropriate schedule buffer because port operations can vary.' },
      { q: 'Can DDP service be arranged for Peru?', a: 'DDP availability depends on the product, importer, and destination conditions. Confirm the written scope, taxes, and exclusions before booking.' }
    ]
  },
  zh: {
    ...LATAM_LOCALIZED.mexico.zh,
    seoTitle: '中国到秘鲁（卡亚俄 / 利马）海运与空运服务 | 华正邦泰国际货运',
    seoDesc: '中国至秘鲁 Callao、利马的海运、空运与集货规划，支持进口文件及目的地操作的出运前协调。',
    headline: '中国到秘鲁（Callao / 利马）海运与空运：进口文件与路线协调支持',
    subheadline: '提供中国始发至 Callao、利马的整柜、拼箱与空运规划，并在确认的服务范围内协调出运文件与目的地操作。',
    transitWindow: '秘鲁专线预计时效', transitDays: '海运: 35-50天 | 空运: 7-14工作日',
    complianceRowTitle: '进口文件出运前核对', complianceRowVal: '订舱前确认',
    solutionsTitle: '秘鲁货运与进口文件规划',
    solutionsSubtitle: '围绕货物资料、产品归类和目的地操作要求，在出运前完成必要核对。',
    solutions: [
      { title: '商业文件一致性核对', desc: '出运前请核对提单、商业发票、装箱单及目的地资料中的收货人、品名、数量和货值信息。', icon: 'FileText' },
      { title: '产品归类与文件要求确认', desc: '请在装船前确认产品归类、可能适用的许可或证书，以及进口商应满足的要求。', icon: 'ShieldCheck' },
      { title: 'Callao 目的港操作规划', desc: '请在出运前确认船公司条款、单证准备情况和目的港操作计划；港口条件可能变化。', icon: 'Clock' }
    ],
    multimodalTable: [
      { mode: '海运整箱/拼箱 (Sea Freight)', days: 'FCL 整柜 35-50 天 | LCL 拼箱 45-60 天', suitability: '适合商业库存、机械设备、建材和集货拼箱货物。', sellingPoint: '可根据船公司船期和目的地交付要求，规划中国港口至 Callao 的海运服务。', warning: '请在开船前确认商业资料准确性和目的地文件要求。' },
      { mode: '空运服务 (Air Freight)', days: '7-14 工作日', suitability: '适合样品、零配件、高货值货物和时效敏感补货。', sellingPoint: '可按货物承运条件和目的地操作要求，规划直飞或中转至利马（LIM）的空运服务。', warning: '请在起运前确认航空公司收货要求和目的地文件。' }
    ],
    faqs: [
      { q: '发往秘鲁前应核对哪些文件？', a: '建议与进口商在出运前核对提单、商业发票、装箱单、收货人信息、产品描述及可能适用的产品文件。' },
      { q: '如何规划 Callao 目的港操作？', a: '请在出运前确认船公司条款、目的港单证准备和操作计划，并根据港口条件预留合理缓冲。' },
      { q: '秘鲁是否可以安排 DDP？', a: 'DDP 是否可行取决于产品、进口商和目的地条件；请在订舱前书面确认服务范围、税费和除外事项。' }
    ]
  }
};
LATAM_LOCALIZED.chile = {
  en: {
    ...LATAM_LOCALIZED.peru.en,
    seoTitle: 'Shipping from China to Chile | Freight Forwarding Guide | DDNZ Global',
    seoDesc: 'Ocean and air freight planning from China to San Antonio, Valparaíso, and Santiago, with document review and destination coordination.',
    headline: 'Shipping from China to Chile | Port and Destination Planning',
    subheadline: 'FCL, LCL, and air freight planning from China to Chile, with shipment-document and destination-operation coordination.',
    transitWindow: 'Chile Transit Windows', transitDays: 'Sea: 35-50 Days | Air: 7-14 Days',
    solutionsTitle: 'Chile Freight and Import-Document Planning',
    solutionsSubtitle: 'Plan cargo data, product classification, and destination handling requirements before shipment.',
    solutions: [
      { title: 'Commercial Document Consistency', desc: 'Review consignee details, product descriptions, quantities, and values across shipping and commercial documents before dispatch.', icon: 'FileText' },
      { title: 'Product and Importer Requirement Review', desc: 'Confirm the product classification and any applicable certificates, permits, or importer requirements before loading.', icon: 'ShieldCheck' },
      { title: 'Port and Inland Delivery Planning', desc: 'Confirm carrier terms, destination handling, and inland delivery scope for the selected Chilean port or final destination.', icon: 'Clock' }
    ],
    multimodalTable: [
      { mode: 'Sea Freight (FCL / LCL)', days: '35 - 50 Days (FCL) | 45 - 60 Days (LCL)', suitability: 'Suitable for commercial inventory, equipment, consumer goods, and consolidated cargo.', sellingPoint: 'Plan available sailings from China ports to San Antonio or Valparaíso against carrier schedules and destination needs.', warning: 'Confirm accurate commercial documents and destination requirements before sailing.' },
      { mode: 'Air Freight', days: '7 - 14 Working Days', suitability: 'Suitable for samples, spare parts, high-value goods, and time-sensitive cargo.', sellingPoint: 'Plan direct or connecting air options to Santiago (SCL) according to cargo acceptance and destination operations.', warning: 'Carrier acceptance and destination documentation should be confirmed before dispatch.' }
    ],
    faqs: [
      { q: 'Which Chilean port should be used for freight from China?', a: 'The right port depends on the carrier schedule, cargo, consignee location, and destination delivery plan. Confirm the available routing before booking.' },
      { q: 'What should be reviewed before shipping to Chile?', a: 'Review the Bill of Lading, invoice, packing list, consignee details, product information, and any product-specific requirements with the importer before shipment.' },
      { q: 'Can DDP service be arranged for Chile?', a: 'DDP availability depends on the product, importer, and destination conditions. Confirm the written scope, taxes, and exclusions before booking.' }
    ]
  },
  zh: {
    ...LATAM_LOCALIZED.peru.zh,
    seoTitle: '中国到智利（圣安东尼奥 / 瓦尔帕莱索 / 圣地亚哥）海运与空运服务 | 华正邦泰国际货运',
    seoDesc: '中国至智利的海运、空运与集货规划，支持进口文件及目的地操作的出运前协调。',
    headline: '中国到智利海运与空运：港口、文件与目的地操作协调支持',
    subheadline: '提供中国始发至智利的整柜、拼箱与空运规划，并在确认的服务范围内协调出运文件、港口与目的地操作。',
    transitWindow: '智利专线预计时效', transitDays: '海运: 35-50天 | 空运: 7-14工作日',
    solutionsTitle: '智利货运与进口文件规划',
    solutionsSubtitle: '围绕货物资料、产品归类和目的地操作要求，在出运前完成必要核对。',
    solutions: [
      { title: '商业文件一致性核对', desc: '出运前请核对运输和商业文件中的收货人、品名、数量及货值信息。', icon: 'FileText' },
      { title: '产品与进口商要求确认', desc: '请在装船前确认产品归类、可能适用的证书或许可，以及进口商应满足的要求。', icon: 'ShieldCheck' },
      { title: '港口与内陆交付规划', desc: '请针对选定的智利港口或最终目的地，确认船公司条款、目的港操作与内陆配送范围。', icon: 'Clock' }
    ],
    multimodalTable: [
      { mode: '海运整箱/拼箱 (Sea Freight)', days: 'FCL 整柜 35-50 天 | LCL 拼箱 45-60 天', suitability: '适合商业库存、设备、消费品和集货拼箱货物。', sellingPoint: '可根据船公司船期与目的地需要，规划中国港口至 San Antonio 或 Valparaíso 的海运服务。', warning: '请在开船前确认商业资料准确性和目的地要求。' },
      { mode: '空运服务 (Air Freight)', days: '7-14 工作日', suitability: '适合样品、零配件、高货值货物和时效敏感货物。', sellingPoint: '可按货物承运条件和目的地操作要求，规划直飞或中转至圣地亚哥（SCL）的空运服务。', warning: '请在起运前确认航空公司收货要求和目的地文件。' }
    ],
    faqs: [
      { q: '从中国发往智利应选择哪个港口？', a: '合适的港口取决于船期、货物、收货人所在地及目的地交付计划；请在订舱前确认可用路线。' },
      { q: '发往智利前应核对哪些信息？', a: '建议与进口商在出运前核对提单、发票、装箱单、收货人资料、产品信息及可能适用的产品要求。' },
      { q: '智利是否可以安排 DDP？', a: 'DDP 是否可行取决于产品、进口商和目的地条件；请在订舱前书面确认服务范围、税费和除外事项。' }
    ]
  }
};
const latinAmericaLocaleConfig = {
  ru: {
    mexico: { country: 'Мексика', destination: 'Мансанильо, Ласаро-Карденас и Мехико', compliance: 'NOM, RFC и реестра импортёров', transitDays: 'Море: 25 - 40 дней | Авиа: 5 - 12 дней' },
    brazil: { country: 'Бразилия', destination: 'Сантус и Сан-Паулу', compliance: 'NCM, SISCOMEX и требований Бразилии', transitDays: 'Море: 35 - 50 дней | Авиа: 6 - 14 дней' },
    argentina: { country: 'Аргентина', destination: 'Буэнос-Айрес и EZE', compliance: 'таможни и импортёра Аргентины', transitDays: 'Море: 40 - 55 дней | Авиа: 7 - 14 дней' },
    peru: { country: 'Перу', destination: 'Кальяо и Лиму', compliance: 'SUNAT и разрешений на продукцию', transitDays: 'Море: 35 - 50 дней | Авиа: 7 - 14 дней' },
    chile: { country: 'Чили', destination: 'Сан-Антонио, Вальпараисо и Сантьяго', compliance: 'таможни и сертификатов Чили', transitDays: 'Море: 35 - 50 дней | Авиа: 7 - 14 дней' },
  },
  fr: {
    mexico: { country: 'le Mexique', destination: 'Manzanillo, Lázaro Cárdenas et Mexico', compliance: 'NOM, RFC et registre des importateurs', transitDays: 'Mer : 25 - 40 jours | Air : 5 - 12 jours' },
    brazil: { country: 'le Brésil', destination: 'Santos et São Paulo', compliance: 'NCM, SISCOMEX et règles brésiliennes', transitDays: 'Mer : 35 - 50 jours | Air : 6 - 14 jours' },
    argentina: { country: "l’Argentine", destination: 'Buenos Aires et EZE', compliance: "douanières et de l’importateur argentin", transitDays: 'Mer : 40 - 55 jours | Air : 7 - 14 jours' },
    peru: { country: 'le Pérou', destination: 'Callao et Lima', compliance: 'SUNAT et permis produit', transitDays: 'Mer : 35 - 50 jours | Air : 7 - 14 jours' },
    chile: { country: 'le Chili', destination: 'San Antonio, Valparaíso et Santiago', compliance: 'douanières et certificats chiliens', transitDays: 'Mer : 35 - 50 jours | Air : 7 - 14 jours' },
  },
  es: {
    mexico: { country: 'México', destination: 'Manzanillo, Lázaro Cárdenas y Ciudad de México', compliance: 'NOM, RFC y padrón de importadores', transitDays: 'Marítimo: 25 - 40 días | Aéreo: 5 - 12 días' },
    brazil: { country: 'Brasil', destination: 'Santos y São Paulo', compliance: 'NCM, SISCOMEX y requisitos brasileños', transitDays: 'Marítimo: 35 - 50 días | Aéreo: 6 - 14 días' },
    argentina: { country: 'Argentina', destination: 'Buenos Aires y EZE', compliance: 'aduaneros y del importador argentino', transitDays: 'Marítimo: 40 - 55 días | Aéreo: 7 - 14 días' },
    peru: { country: 'Perú', destination: 'Callao y Lima', compliance: 'SUNAT y permisos de producto', transitDays: 'Marítimo: 35 - 50 días | Aéreo: 7 - 14 días' },
    chile: { country: 'Chile', destination: 'San Antonio, Valparaíso y Santiago', compliance: 'aduaneros y certificados chilenos', transitDays: 'Marítimo: 35 - 50 días | Aéreo: 7 - 14 días' },
  },
  ar: {
    mexico: { country: 'المكسيك', destination: 'مانزانيلو ولازارو كارديناس ومكسيكو سيتي', compliance: 'NOM وRFC وسجل المستوردين', transitDays: 'بحري: 25 - 40 يوماً | جوي: 5 - 12 يوماً' },
    brazil: { country: 'البرازيل', destination: 'سانتوس وساو باولو', compliance: 'NCM وSISCOMEX والمتطلبات البرازيلية', transitDays: 'بحري: 35 - 50 يوماً | جوي: 6 - 14 يوماً' },
    argentina: { country: 'الأرجنتين', destination: 'بوينس آيرس وEZE', compliance: 'الجمارك ومتطلبات المستورد الأرجنتيني', transitDays: 'بحري: 40 - 55 يوماً | جوي: 7 - 14 يوماً' },
    peru: { country: 'بيرو', destination: 'كالاو وليما', compliance: 'SUNAT وتصاريح المنتجات', transitDays: 'بحري: 35 - 50 يوماً | جوي: 7 - 14 يوماً' },
    chile: { country: 'تشيلي', destination: 'سان أنطونيو وفالبارايسو وسانتياغو', compliance: 'الجمارك والشهادات التشيلية', transitDays: 'بحري: 35 - 50 يوماً | جوي: 7 - 14 يوماً' },
  },
} as const;

for (const locale of ['ru', 'fr', 'es', 'ar'] as const) {
  for (const country of ['mexico', 'brazil', 'argentina', 'peru', 'chile'] as const) {
    LATAM_LOCALIZED[country][locale] = createLocalizedShippingContent({
      locale,
      region: 'Latin America',
      ...latinAmericaLocaleConfig[locale][country],
    });
  }
}

const PAGE_LANG_DATA = {
  en: {
    seoTitle: "China to Latin America Freight Forwarding Guide | DDNZ Global",
    seoDesc: "Freight planning from China to Mexico, Brazil, and Argentina, with consolidation, document review, and DDP/DDU service coordination.",
    tabMexico: "Mexico (NOM & RFC Solutions)",
    tabBrazil: "Brazil (CNPJ & Santos Gate)",
    tabArgentina: "Argentina (CUIT & Import Documents)",
    tabPeru: "Peru (Callao & Lima)",
    tabChile: "Chile (Ports & Santiago)",
    faqHeading: "Latin America SCM Compliance FAQ",
    faqSubheading: "Proactive compliance checks to keep your cargo moving securely through Latin American customs corridors.",
    formTitle: "Instant Latin America Shipping Inquiry",
    formSub: "Send your cargo requirements directly to our senior Latin America trade lane managers.",
    formName: "Your Name / Company",
    formEmail: "Corporate Email Address",
    formPhone: "Mobile / WhatsApp / WeChat",
    formGoods: "Cargo Details (Item Type, Total Weight/CBM, etc.)",
    formSubmit: "Get Precise DDP Quote",
    formSuccess: "Inquiry Submitted Successfully!",
    formSuccessSub: "Our Latin America route team will use your submitted contact details to confirm the information needed for the quotation.",
    formAnother: "Submit Another Quote Request",
    complianceBadge: "COMPLIANCE NOTICE",
    timeBadge: "TIMELINE FORECAST",
    actionQuote: "Generate Dynamic Route Quote",
    actionConsult: "Consult Compliance Specialist",
    guideHeader: "Heaven Born Latin America Shipping Notes",
    guideSub: "Practical points for planning cargo, documents, and destination operations."
  },
  zh: {
    seoTitle: "中国到拉美（墨西哥/巴西/阿根廷）海运整柜拼箱与 DDP 服务 | 华正邦泰国际货运",
    seoDesc: "中国至墨西哥、巴西、阿根廷的海运、空运与集货服务，支持进口文件的出运前核对并协调 DDP/DDU 服务范围。",
    tabMexico: "墨西哥（NOM与RFC合规专区）",
    tabBrazil: "巴西（CNPJ 与桑托斯港文件支持）",
    tabArgentina: "阿根廷（进口文件与路线支持）",
    tabPeru: "秘鲁（Callao / 利马）",
    tabChile: "智利（港口 / 圣地亚哥）",
    faqHeading: "拉丁美洲航线通关合规常见问答",
    faqSubheading: "拉美各国的关税、进口文件与港口操作要求可能变化，建议在出运前逐项核对。",
    formTitle: "提交拉美货运询价",
    formSub: "提交货物信息后，我们将确认路线、文件要求和报价所需资料。",
    formName: "您的姓名 / 企业名称 (必填)",
    formEmail: "您的企业邮箱 (必填)",
    formPhone: "联系电话 / 微信 / WhatsApp (必填)",
    formGoods: "货物详情描述 (如品名、箱数、总重量/立方数、有无电池等)",
    formSubmit: "提交货运询价",
    formSuccess: "询价已提交",
    formSuccessSub: "团队会先核对货物、路线和目的地信息，再通过您留下的联系方式确认报价所需资料。",
    formAnother: "发起新的拉美询价",
    complianceBadge: "出运前核对",
    timeBadge: "参考时效",
    actionQuote: "获取本条路线报价",
    actionConsult: "联系路线团队",
    guideHeader: "Heaven Born 拉美出运注意事项",
    guideSub: "围绕集货、进口文件与目的地操作，帮助您在出运前完成必要确认。"
  }
};

const UNIVERSAL_REDLINES = {
  en: {
    title: "Avoid-Pitfall SCM Gate: Critical Operation Warnings",
    subtitle: "Use these planning checks to align cargo information, supplier preparation, and destination requirements before shipment.",
    items: [
      {
        id: "01",
        title: "Sea-Air and Multimodal Route Assessment",
        desc: "For time-sensitive cargo, assess sea-air or multimodal combinations against the available route, commodity, and destination operating conditions. Timelines and costs should be confirmed for the specific shipment."
      },
      {
        id: "02",
        title: "Consolidation and Packaging Planning",
        desc: "Coordinate consolidation, packaging, measurement, and loading plans using supplier and cargo information. Confirm the available scope and charges before booking."
      },
      {
        id: "03",
        title: "Clear Packaging and Cargo Marking",
        desc: "Use durable export packaging and ensure marks, quantities, and product descriptions are consistent across the cargo and commercial documents."
      },
      {
        id: "04",
        title: "On-Site Quality Pre-Shipment Check (Our Eyes & Ears)",
        desc: "Coordinate a pre-shipment check to the agreed scope, such as visible condition, quantity, labelling, and packaging review. Confirm any required wood-packaging treatment or certificates before shipping."
      }
    ]
  },
  zh: {
    title: "拉美出运前操作核对清单",
    subtitle: "出运前围绕货物资料、供应商准备和目的地要求完成必要核对，以便安排合适的运输方案。",
    items: [
      {
        id: "01",
        title: "海空与多式联运路线评估",
        desc: "对于有时效要求的货物，可根据航线、货物和目的地操作条件评估海空或多式联运组合。具体时效和费用应按单票确认。"
      },
      {
        id: "02",
        title: "集货与包装规划",
        desc: "可根据供应商、包装和体积资料协调集货、包装与装载方案；具体服务范围及收费应在询价前确认。"
      },
      {
        id: "03",
        title: "包装与货物唛头一致性",
        desc: "使用适合出口运输的包装，并确保货物唛头、数量和品名与商业文件保持一致。"
      },
      {
        id: "04",
        title: "装运前外观、数量与包装核对",
        desc: "可按约定范围安排装运前核对，例如外观、数量、标签和包装检查；木质包装处理或证书要求应在出运前确认。"
      }
    ]
  }
};

for (const locale of ['ru', 'fr', 'es', 'ar'] as const) {
  (UNIVERSAL_REDLINES as Record<string, any>)[locale] = createLocalizedShippingRedlines(locale);
}

Object.assign(PAGE_LANG_DATA, {
  ru: {
    ...PAGE_LANG_DATA.en,
    tabMexico: "Мексика",
    tabBrazil: "Бразилия",
    tabArgentina: "Аргентина",
    tabPeru: "Перу",
    tabChile: "Чили",
    faqHeading: "Таможенный контроль и FAQ по Латинской Америке",
    faqSubheading: "Проверки документов и требований назначения до отправки.",
    formTitle: "Запрос тарифа в Латинскую Америку",
    formSub: "Отправьте данные груза для подтверждения маршрута и расчёта.",
    formName: "Имя / Компания",
    formEmail: "Электронная почта",
    formPhone: "WhatsApp / Телефон",
    formGoods: "Товар / Вес / Объём",
    formSubmit: "Получить расчёт",
    formSuccess: "Запрос отправлен.",
    formSuccessSub: "Наша команда проверит данные и свяжется с вами.",
    formAnother: "Отправить новый запрос",
    complianceBadge: "КОНТРОЛЬ СООТВЕТСТВИЯ",
    timeBadge: "СРОК ДОСТАВКИ",
    actionQuote: "Получить расчёт маршрута",
    actionConsult: "Консультация по документам",
    guideHeader: "Рекомендации Heaven Born по Латинской Америке",
    guideSub: "Проверки груза, документов и операций назначения.",
  },
  fr: {
    ...PAGE_LANG_DATA.en,
    tabMexico: "Mexique",
    tabBrazil: "Brésil",
    tabArgentina: "Argentine",
    tabPeru: "Pérou",
    tabChile: "Chili",
    faqHeading: "Contrôle douanier et FAQ Amérique latine",
    faqSubheading: "Vérification des documents et exigences de destination avant expédition.",
    formTitle: "Demande de cotation Amérique latine",
    formSub: "Transmettez les caractéristiques du fret afin de confirmer l’itinéraire et le prix.",
    formName: "Nom / Société",
    formEmail: "E-mail",
    formPhone: "WhatsApp / Téléphone",
    formGoods: "Marchandise / Poids / Volume",
    formSubmit: "Obtenir une cotation",
    formSuccess: "Demande envoyée.",
    formSuccessSub: "Notre équipe examinera les informations et vous contactera.",
    formAnother: "Envoyer une autre demande",
    complianceBadge: "CONTRÔLE DE CONFORMITÉ",
    timeBadge: "DÉLAI INDICATIF",
    actionQuote: "Obtenir une estimation d’itinéraire",
    actionConsult: "Consulter un spécialiste",
    guideHeader: "Conseils Heaven Born pour l’Amérique latine",
    guideSub: "Vérifications du fret, des documents et des opérations à destination.",
  },
  es: {
    ...PAGE_LANG_DATA.en,
    tabMexico: "México",
    tabBrazil: "Brasil",
    tabArgentina: "Argentina",
    tabPeru: "Perú",
    tabChile: "Chile",
    faqHeading: "Control aduanero y preguntas frecuentes de Latinoamérica",
    faqSubheading: "Revisión de documentos y requisitos de destino antes del embarque.",
    formTitle: "Solicitud de cotización para Latinoamérica",
    formSub: "Envíe los datos de la carga para confirmar ruta y precio.",
    formName: "Nombre / Empresa",
    formEmail: "Correo electrónico",
    formPhone: "WhatsApp / Teléfono",
    formGoods: "Mercancía / Peso / Volumen",
    formSubmit: "Obtener cotización",
    formSuccess: "Solicitud enviada.",
    formSuccessSub: "Nuestro equipo revisará los datos y se pondrá en contacto.",
    formAnother: "Enviar otra solicitud",
    complianceBadge: "CONTROL DE CUMPLIMIENTO",
    timeBadge: "TIEMPO ESTIMADO",
    actionQuote: "Obtener cálculo de ruta",
    actionConsult: "Consultar a un especialista",
    guideHeader: "Consejos de Heaven Born para Latinoamérica",
    guideSub: "Revisión de carga, documentos y operaciones en destino.",
  },
  ar: {
    ...PAGE_LANG_DATA.en,
    tabMexico: "المكسيك",
    tabBrazil: "البرازيل",
    tabArgentina: "الأرجنتين",
    tabPeru: "بيرو",
    tabChile: "تشيلي",
    faqHeading: "التخليص والأسئلة الشائعة لأمريكا اللاتينية",
    faqSubheading: "مراجعة المستندات ومتطلبات الوجهة قبل الشحن.",
    formTitle: "طلب عرض شحن إلى أمريكا اللاتينية",
    formSub: "أرسل بيانات البضائع لتأكيد المسار والسعر.",
    formName: "الاسم / الشركة",
    formEmail: "البريد الإلكتروني",
    formPhone: "واتساب / الهاتف",
    formGoods: "البضائع / الوزن / الحجم",
    formSubmit: "الحصول على عرض",
    formSuccess: "تم إرسال الطلب.",
    formSuccessSub: "سيراجع فريقنا البيانات ويتواصل معك.",
    formAnother: "إرسال طلب آخر",
    complianceBadge: "مراجعة الامتثال",
    timeBadge: "المدة التقديرية",
    actionQuote: "الحصول على تقدير للمسار",
    actionConsult: "استشارة متخصص",
    guideHeader: "إرشادات Heaven Born لأمريكا اللاتينية",
    guideSub: "مراجعة البضائع والمستندات وعمليات الوجهة.",
  },
});

export default function ShippingLatinAmerica() {
  const location = useLocation();
  const { language } = useLanguage();
  const countryLabel = (country: 'mexico' | 'brazil' | 'argentina' | 'peru' | 'chile') => {
    const names = {
      mexico: { en: 'Mexico', zh: '墨西哥', ru: 'Мексика', fr: 'Mexique', es: 'México', ar: 'المكسيك' },
      brazil: { en: 'Brazil', zh: '巴西', ru: 'Бразилия', fr: 'Brésil', es: 'Brasil', ar: 'البرازيل' },
      argentina: { en: 'Argentina', zh: '阿根廷', ru: 'Аргентина', fr: 'Argentine', es: 'Argentina', ar: 'الأرجنتين' },
      peru: { en: 'Peru', zh: '秘鲁', ru: 'Перу', fr: 'Pérou', es: 'Perú', ar: 'بيرو' },
      chile: { en: 'Chile', zh: '智利', ru: 'Чили', fr: 'Chili', es: 'Chile', ar: 'تشيلي' }
    } as const;
    return names[country][language];
  };

  const getCountryFromLocation = () => getShippingCountrySlug(
    location.pathname,
    location.search,
    ['mexico', 'brazil', 'argentina', 'peru', 'chile'],
    'mexico',
  ) as 'mexico' | 'brazil' | 'argentina' | 'peru' | 'chile';

  const [selectedCountry, setSelectedCountry] = useState<'mexico' | 'brazil' | 'argentina' | 'peru' | 'chile'>(getCountryFromLocation);
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

  useEffect(() => {
    setActiveTransportMode(0);
    setActiveFaq(null);
  }, [location.pathname]);

  const activeLang = language === 'zh' ? 'zh' : language === 'ru' ? 'ru' : language === 'fr' ? 'fr' : language === 'es' ? 'es' : language === 'ar' ? 'ar' : 'en';
  
  const spec = LATAM_LOCALIZED[selectedCountry][activeLang];
  const t = (key: string) => {
    const data = PAGE_LANG_DATA[activeLang];
    return data[key] || '';
  };

  const localText = (copy: { zh: string; en: string; es?: string }) => {
    if (activeLang === 'zh') return copy.zh;
    if (activeLang === 'es') return copy.es || copy.en;
    return copy.en;
  };

  const scrollToQuote = () => {
    document.getElementById('latam-quote-form')?.scrollIntoView({ behavior: 'smooth' });
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

  const getTransitTimes = () => {
    if (selectedCountry === 'mexico') {
      return {
        sea: language === 'zh' ? '35 - 50 天' : '35 - 50 Days',
        air: language === 'zh' ? '5 - 12 工作日' : '5 - 12 Days',
        seaLabel: language === 'zh' ? '曼萨尼约 / 拉萨罗卡德纳斯海运整箱 (FCL)' : 'Manzanillo / Lázaro Cárdenas FCL',
        seaDesc: localText({ zh: '按可用船期确认直航或中转', en: 'Direct or connecting service, subject to schedule', es: 'Servicio directo o con transbordo, según salida' }),
        airLabel: language === 'zh' ? '墨西哥城 (MEX) 空运专线' : 'Mexico City (MEX) Air Express',
        airDesc: localText({ zh: '按确认的清关与派送范围安排', en: 'Clearance and delivery to the confirmed scope', es: 'Despacho y entrega según el alcance confirmado' })
      };
    } else if (selectedCountry === 'brazil') {
      return {
        sea: language === 'zh' ? '50 - 80 天' : '50 - 80 Days',
        air: language === 'zh' ? '15 - 20 工作日' : '15 - 20 Days',
        seaLabel: language === 'zh' ? '桑托斯海运快线 (Santos Express)' : 'Santos Sea Express',
        seaDesc: localText({ zh: '按可用船期与目的港操作规划', en: 'Planned around available sailings and destination handling', es: 'Planificado según salidas y operación en destino' }),
        airLabel: language === 'zh' ? '圣保罗 (GRU) 空运专线' : 'São Paulo (GRU) Air Express',
        airDesc: localText({ zh: '按货物与进口条件确认服务范围', en: 'Scope confirmed against cargo and import conditions', es: 'Alcance sujeto a carga y condiciones de importación' })
      };
    } else if (selectedCountry === 'argentina') {
      return {
        sea: language === 'zh' ? '35 - 50 天' : '35 - 50 Days',
        air: language === 'zh' ? '12 - 18 工作日' : '12 - 18 Days',
        seaLabel: language === 'zh' ? '布宜诺斯艾利斯海运快线' : 'Buenos Aires Sea Express',
        seaDesc: localText({ zh: '按书面确认范围安排清关与派送', en: 'Clearance and delivery to the written scope', es: 'Despacho y entrega según el alcance escrito' }),
        airLabel: language === 'zh' ? '埃塞萨 (EZE) 空运专线' : 'Ezeiza (EZE) Air Express',
        airDesc: localText({ zh: '按货物与进口条件确认服务范围', en: 'Scope confirmed against cargo and import conditions', es: 'Alcance sujeto a carga y condiciones de importación' })
      };
    } else if (selectedCountry === 'peru') {
      return {
        sea: language === 'zh' ? '35 - 50 天' : '35 - 50 Days',
        air: language === 'zh' ? '7 - 14 工作日' : '7 - 14 Days',
        seaLabel: language === 'zh' ? '卡亚俄（Callao）海运整箱 / 拼箱' : 'Callao FCL / LCL',
        seaDesc: language === 'zh' ? '按船期与目的地操作规划' : 'Planned against carrier schedules',
        airLabel: language === 'zh' ? '利马（LIM）空运服务' : 'Lima (LIM) Air Freight',
        airDesc: language === 'zh' ? '依据承运条件与文件要求安排' : 'Planned to cargo and document requirements'
      };
    }
    return {
      sea: language === 'zh' ? '35 - 50 天' : '35 - 50 Days',
      air: language === 'zh' ? '7 - 14 工作日' : '7 - 14 Days',
      seaLabel: language === 'zh' ? '圣安东尼奥 / 瓦尔帕莱索海运整箱 / 拼箱' : 'San Antonio / Valparaíso FCL / LCL',
      seaDesc: language === 'zh' ? '按船期与目的地操作规划' : 'Planned against carrier schedules',
      airLabel: language === 'zh' ? '圣地亚哥（SCL）空运服务' : 'Santiago (SCL) Air Freight',
      airDesc: language === 'zh' ? '依据承运条件与文件要求安排' : 'Planned to cargo and document requirements'
    };
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goods: '',
    destination: 'Mexico'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      destination: countryLabel(selectedCountry)
    }));
  }, [selectedCountry, language]);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    trackEvent('quote_form_submit_attempt', {
      form_location: 'latin_america_country_page',
      country: selectedCountry,
      service: 'freight_forwarding',
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        goods: '',
        destination: selectedCountry === 'mexico' ? 'Mexico' : selectedCountry === 'brazil' ? 'Brazil' : selectedCountry === 'argentina' ? 'Argentina' : selectedCountry === 'peru' ? 'Peru' : 'Chile'
      });
    }, 1200);
  };

  const redlines = UNIVERSAL_REDLINES[activeLang];

  return (
    <div className="ddnz-home min-h-screen overflow-x-hidden bg-[#fffdf9] font-sans text-[#10243f]">
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
      <SchemaMarkup
        type="FAQPage"
        data={{
          url: `https://www.ddnzglobal.com${location.pathname}`,
          faqs: spec.faqs.map((faq) => ({ question: faq.q, answer: faq.a })),
        }}
      />
      <SourcingHomepageNav showFreightExecutor />
      <CountryRegionLink region="latin-america" />

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-[#0b1c2c] pb-20 pt-16 text-white md:pb-28 md:pt-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'linear-gradient(to bottom right, black, transparent 72%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 pb-16">
            
            {/* 左侧文案区：占据 7 列 */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Country Selector Tabs */}
              {!isLocked && (
                <div className="mb-2 inline-flex max-w-full flex-wrap overflow-hidden rounded-xl border border-white/[0.14] bg-white/[0.03] p-1">
                  <Link
                    to={buildShippingCountryPath(location.pathname, 'mexico')}
                    className={`flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${
                      selectedCountry === 'mexico'
                        ? 'bg-white text-[#10243f]'
                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <Globe className="w-4 h-4" aria-hidden="true" /> {t('tabMexico')}
                  </Link>
                  <Link
                    to={buildShippingCountryPath(location.pathname, 'brazil')}
                    className={`flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${
                      selectedCountry === 'brazil'
                        ? 'bg-white text-[#10243f]'
                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <Globe className="w-4 h-4" aria-hidden="true" /> {t('tabBrazil')}
                  </Link>
                  <Link
                    to={buildShippingCountryPath(location.pathname, 'argentina')}
                    className={`flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${
                      selectedCountry === 'argentina'
                        ? 'bg-white text-[#10243f]'
                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <Globe className="w-4 h-4" aria-hidden="true" /> {t('tabArgentina')}
                  </Link>
                  <Link
                    to={buildShippingCountryPath(location.pathname, 'peru')}
                    className={`flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${
                      selectedCountry === 'peru'
                        ? 'bg-white text-[#10243f]'
                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <Globe className="w-4 h-4" aria-hidden="true" /> {t('tabPeru')}
                  </Link>
                  <Link
                    to={buildShippingCountryPath(location.pathname, 'chile')}
                    className={`flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${
                      selectedCountry === 'chile'
                        ? 'bg-white text-[#10243f]'
                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <Globe className="w-4 h-4" aria-hidden="true" /> {t('tabChile')}
                  </Link>
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
                <span className="inline-flex items-center gap-1.5 border-l-2 border-[#c94f2f] pl-3 text-xs font-black uppercase tracking-[0.18em] text-slate-300">
                  DDNZ × HEAVEN BORN · LATIN AMERICA FREIGHT
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-tight">
                  {spec.headline}
                </h1>
                <div className="space-y-4">
                  <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed font-medium">
                    {spec.subheadline}
                  </p>
                  
                  {/* Premium Micro-Badges / Key SCM Highlights */}
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <span className="inline-flex items-center gap-1.5 border-b border-emerald-500/30 px-1 py-1.5 text-xs font-bold text-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      {language === 'zh' ? '进口文件审核支持' : 'Import Documentation Support'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 border-b border-amber-400/30 px-1 py-1.5 text-xs font-bold text-amber-300">
                      <Package className="w-3.5 h-3.5" aria-hidden="true" />
                      {language === 'zh' ? '中国集货与拼箱协调' : 'China Consolidation Coordination'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 border-b border-sky-400/30 px-1 py-1.5 text-xs font-bold text-sky-300">
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                      {localText({ zh: 'DDP / DAP 责任边界核对', en: 'DDP / DAP scope review', es: 'Revisión del alcance DDP / DAP' })}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Quick SCM Meta Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/[0.08]">
                <div className="border-l-2 border-emerald-400 bg-white/[0.035] p-4">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-black uppercase mb-1">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{t('complianceBadge')}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-200">{spec.complianceRowTitle}</div>
                  <div className="text-[10px] text-slate-400 font-bold mt-0.5">{language === 'zh' ? '预审周期' : 'Period'}: {spec.complianceRowVal}</div>
                </div>

                <div className="flex items-center justify-start border-l-2 border-[#c94f2f] bg-white/[0.035] p-4 text-left sm:justify-center sm:text-center">
                  <button
                    onClick={scrollToQuote}
                    className="flex min-h-[44px] h-full w-full cursor-pointer items-center justify-start gap-1.5 text-xs font-black text-white transition-colors hover:text-[#f2a47f] sm:justify-center"
                  >
                    <span>{language === 'zh' ? '立即询价' : 'Inquire Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#d97706]" />
                  </button>
                </div>
              </div>
            </div>

            {/* 右侧硬核时效侧边栏：占据 5 列 */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-amber-300">
                {localText({ zh: '运输方式与参考时效', en: 'Freight modes and planning windows', es: 'Modalidades y plazos de planificación' })}
              </h3>
              
              <div className="flex items-center justify-between border-y border-white/[0.12] bg-white/[0.035] p-5">
                <div>
                  <h4 className="text-sm font-black text-white">{getTransitTimes().seaLabel}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{getTransitTimes().seaDesc}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="whitespace-nowrap font-mono text-sm font-extrabold text-amber-300">{getTransitTimes().sea}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-white/[0.12] bg-white/[0.035] p-5">
                <div>
                  <h4 className="text-sm font-black text-white">{getTransitTimes().airLabel}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{getTransitTimes().airDesc}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="whitespace-nowrap font-mono text-sm font-extrabold text-amber-300">{getTransitTimes().air}</span>
                </div>
              </div>

              {SHOW_MEDIA_PLANNING && (
                <FreightMediaPlanningSlot
                  index="01"
                  title="首屏线路与操作短片"
                  format="16:9 · 8–20 秒"
                  note="建议使用订舱、装柜、仓库或船舶靠港的连续镜头；不要使用通用素材库视频。"
                  dark
                  compact
                />
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10">

        <MarketSourcingHandoff destination={countryLabel(selectedCountry)} />

        <LatinAmericaFreightDepth
          country={selectedCountry}
          language={activeLang}
          onQuote={scrollToQuote}
        />


        {/* Section: Compliant Solutions Checklist (3 Columns) */}
        <section className="border-b border-[#dce3ea] bg-[#fffdf9] py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <span className="mb-3 inline-block border-l-2 border-[#c94f2f] pl-3 text-xs font-black uppercase tracking-widest text-[#c94f2f]">
                Import Documentation Support
              </span>
              <h2 className="mb-4 text-2xl font-black leading-tight tracking-tight text-[#10243f] sm:text-3xl md:text-4xl">
                {spec.solutionsTitle}
              </h2>
              <p className="text-sm font-medium leading-7 text-slate-600 sm:text-base">
                {spec.solutionsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 border-l border-t border-[#dce3ea] md:grid-cols-3">
              {spec.solutions.map((sol: any, idx: number) => (
                <div key={idx} className="group flex flex-col justify-between border-b border-r border-[#dce3ea] bg-white p-6 transition-colors hover:bg-[#f8f5ef] md:p-8">
                  <div>
                    <div className="mb-4 inline-block border-b-2 border-[#c94f2f] pb-2 text-[#c94f2f]">
                      {getIcon(sol.icon)}
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-[#10243f]">
                      {sol.title}
                    </h3>
                    <p className="text-xs font-medium leading-relaxed text-slate-600 sm:text-sm">
                      {sol.desc}
                    </p>
                  </div>
                  <details className="mt-6 border-t border-[#dce3ea] pt-4">
                    <summary className="cursor-pointer text-sm font-bold text-[#c94f2f] focus-visible:outline focus-visible:outline-2">{localText({ zh: '查看需要准备的资料', en: 'See what to prepare', es: 'Ver qué preparar' })}</summary>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{[
                      localText({ zh: '准备进口方名称、登记资料与清关联系人，附产品用途及已有商品编码，交由进口方核对。', en: 'Prepare the importer name, registration details and clearance contact, plus product use and any existing commodity code for the importer to review.', es: 'Prepara nombre, registro y contacto de despacho del importador, uso del producto y código disponible para su revisión.' }),
                      localText({ zh: '准备产品型号、技术参数、标签照片及已有检测或认证文件，按具体产品确认适用要求。', en: 'Prepare model numbers, specifications, label photos and existing test or certification documents for a product-specific review.', es: 'Prepara modelos, especificaciones, fotos de etiquetas y documentos de ensayo o certificación disponibles.' }),
                      localText({ zh: '准备商业发票、装箱单及包装后的件数、尺寸、毛重，逐项核对品名和收发货信息。', en: 'Prepare the commercial invoice, packing list and final package counts, dimensions and gross weights; reconcile descriptions and shipper/consignee details.', es: 'Prepara factura, lista de empaque, bultos, medidas y pesos brutos finales; coteja descripciones y datos del remitente y destinatario.' }),
                    ][idx]}</p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Transit Timelines Dynamic Detail Grid */}
        <section className="border-b border-[#dce3ea] bg-[#f3f5f7] py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <span className="mb-3 inline-block border-l-2 border-[#c94f2f] pl-3 text-xs font-black uppercase tracking-widest text-[#c94f2f]">
                {language === 'zh' ? '通道时效参考' : 'Transit Time Reference'}
              </span>
              <h2 className="mb-4 text-2xl font-black leading-tight tracking-tight text-[#10243f] sm:text-3xl md:text-4xl">
                {{
                  en: 'Choose between ocean and air freight',
                  zh: '海运与空运怎么选',
                  ru: 'Параметры маршрутов в Латинскую Америку',
                  fr: 'Paramètres des itinéraires vers l’Amérique latine',
                  es: 'Cómo elegir entre transporte marítimo y aéreo',
                  ar: 'مواصفات مسارات أمريكا اللاتينية',
                }[activeLang]}
              </h2>
              <p className="text-sm font-semibold leading-7 text-slate-600">
                {localText({
                  zh: '根据货量、时效、货值和目的地操作要求比较运输方式。',
                  en: 'Compare modes by shipment size, urgency, cargo value and destination requirements.',
                  es: 'Compara las modalidades según volumen, urgencia, valor y requisitos en destino.',
                })}
              </p>
            </div>

            {/* Interactive Grid & Detail Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Transport Options */}
              <div className="lg:col-span-5 space-y-3">
                {spec.multimodalTable && spec.multimodalTable.map((row: any, idx: number) => {
                  const isSelected = activeTransportMode === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveTransportMode(idx)}
                      className={`flex w-full items-center justify-between border p-5 text-left transition-colors ${
                        isSelected 
                          ? 'border-[#10243f] bg-[#10243f] text-white'
                          : 'border-[#d4dce4] bg-white text-[#10243f] hover:border-[#91a0af]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {row.mode.toLowerCase().includes('air') || row.mode.includes('空运') || row.mode.includes('Aérien')
                          ? <Plane className="w-5 h-5 text-[#d97706]" aria-hidden="true" />
                          : <Ship className="w-5 h-5 text-[#d97706]" aria-hidden="true" />}
                        <div>
                          <h4 className={`text-sm font-black tracking-tight ${isSelected ? 'text-white' : 'text-[#10243f]'}`}>
                            {row.mode}
                          </h4>
                          <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                            {language === 'zh' ? '预计周期' : 'Transit Window'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono text-base font-bold ${isSelected ? 'text-white' : 'text-[#10243f]'}`}>
                          {row.days.split('|')[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Detailed Blueprint & Diagnostic Card */}
              <div className="lg:col-span-7">
                {spec.multimodalTable && spec.multimodalTable[activeTransportMode] && (
                  <div className="relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-2xl border border-[#d4dce4] bg-white p-6 md:p-8">
                    {/* Watermark of active mode */}
                    <div className="pointer-events-none absolute -right-12 -top-12 select-none text-9xl font-black text-[#10243f]/[0.04]">
                      {spec.multimodalTable[activeTransportMode].mode.slice(0, 1)}
                    </div>

                    <div className="relative z-10 space-y-6">
                      <div>
                        <span className="border-l-2 border-[#c94f2f] pl-2.5 text-[10px] font-black uppercase tracking-wider text-[#c94f2f]">
                          {localText({ zh: '运输方式说明', en: 'Mode details', es: 'Detalle de la modalidad' })}
                        </span>
                        <h3 className="mt-2 text-xl font-black text-[#10243f] md:text-2xl">
                          {spec.multimodalTable[activeTransportMode].mode}
                        </h3>
                        <p className="mt-1 text-sm font-black text-[#c94f2f]">
                          {language === 'zh' ? '预计运输周期' : 'Estimated Transit Window'}: <span className="font-mono text-base font-bold text-[#10243f]">{spec.multimodalTable[activeTransportMode].days}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div>
                          <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                            {language === 'zh' ? '适用货品场景' : 'Best Suited For'}
                          </h5>
                          <p className="text-xs font-semibold leading-relaxed text-slate-600">
                            {spec.multimodalTable[activeTransportMode].suitability}
                          </p>
                        </div>
                        <div>
                          <h5 className="mb-1.5 text-xs font-black uppercase tracking-widest text-[#c94f2f]">
                            {language === 'zh' ? 'Heaven Born 操作要点' : 'Heaven Born Operating Notes'}
                          </h5>
                          <p className="text-xs font-semibold leading-relaxed text-slate-600">
                            {spec.multimodalTable[activeTransportMode].sellingPoint}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 border-l-2 border-amber-500 bg-amber-50 p-4">
                        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                        <div>
                          <h5 className="mb-0.5 text-xs font-black uppercase tracking-wider text-amber-800">
                            {language === 'zh' ? '查验与操作注意事项' : 'Operation Notes'}
                          </h5>
                          <p className="text-[11px] font-medium leading-relaxed text-slate-600">
                            {spec.multimodalTable[activeTransportMode].warning}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 flex flex-col justify-between gap-4 border-t border-[#dce3ea] pt-6 sm:flex-row sm:items-center">
                      <span className="text-xs font-bold text-slate-500">
                        * {localText({
                          zh: '时效为规划区间，最终以货好日期、承运人舱位、航线及目的地操作为准。',
                          en: 'Planning ranges depend on cargo-ready date, carrier space, routing and destination handling.',
                          es: 'Los plazos dependen de la fecha de carga lista, el espacio, la ruta y la operación en destino.',
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={scrollToQuote}
                        className="flex shrink-0 items-center justify-center gap-1.5 self-end whitespace-nowrap rounded-xl bg-[#c94f2f] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-[#a84028] active:scale-[0.98]"
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

        {SHOW_MEDIA_PLANNING && (
          <section className="border-b border-[#dce3ea] bg-[#fffdf9] py-12" aria-label="Destination proof media planning preview">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <FreightMediaPlanningSlot
                index="04"
                title="目的港或末端交付记录"
                format="16:9 视频 / 横向照片"
                note="优先补充港口提柜、当地仓库、车辆交接或签收现场；若暂时没有自有素材，这一段不会出现在正式页面。"
              />
            </div>
          </section>
        )}

        {/* Universal LATAM Avoid-Pitfall & SCM Insights */}
        <section className="relative border-b border-[#dce3ea] bg-[#fffdf9] py-16 text-[#10243f] md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-12 max-w-3xl">
              <span className="mb-3 inline-block border-l-2 border-[#c94f2f] pl-3 text-xs font-black uppercase tracking-widest text-[#c94f2f]">
                {language === 'zh' ? '出运注意事项' : 'Shipping Notes'}
              </span>
              <h2 className="mb-4 text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
                {redlines.title}
              </h2>
              <p className="text-sm font-semibold leading-7 text-slate-600 sm:text-base">
                {redlines.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 border-l border-t border-[#dce3ea] md:grid-cols-2">
              {redlines.items.map((item) => (
                <div key={item.id} className="group relative overflow-hidden border-b border-r border-[#dce3ea] bg-white p-8 transition-colors hover:bg-[#f8f5ef]">
                  <div className="absolute right-0 top-0 select-none p-4 text-7xl font-black leading-none text-[#10243f]/[0.04]">
                    {item.id}
                  </div>
                  <div className="mb-4 flex items-center gap-2.5 text-sm font-black text-[#c94f2f] sm:text-base">
                    <ShieldAlert className="w-5.5 h-5.5 flex-shrink-0 text-[#c94f2f]" />
                    <h3>{item.title}</h3>
                  </div>
                  <p className="relative z-10 text-xs font-semibold leading-relaxed text-slate-600 sm:text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latin America FAQ */}
        <section className="border-b border-[#dce3ea] bg-[#f3f5f7] py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="mb-4 text-2xl font-black leading-tight text-[#10243f] sm:text-3xl md:text-4xl">
                {t('faqHeading')}
              </h2>
              <p className="text-sm font-semibold text-slate-600">
                {t('faqSubheading')}
              </p>
            </div>

            <div className="border-t border-[#cbd4dd]">
              {spec.faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className="overflow-hidden border-b border-[#cbd4dd] bg-transparent px-1 py-5"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c94f2f] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f3f5f7]"
                    >
                      <span className="pr-4 text-sm font-black text-[#10243f] md:text-base">
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
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="pt-4 text-sm font-medium leading-relaxed text-slate-600">
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

        {/* Lead Generation RFQ Form */}
        <section id="latam-quote-form" className="bg-[#0b1c2c] py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-white/[0.1] bg-white/[0.035] p-8 dark-form-container md:p-12">
              <GetAQuote
                presetDestination={countryLabel(selectedCountry)}
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
