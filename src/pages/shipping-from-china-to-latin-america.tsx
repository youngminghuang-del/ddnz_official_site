import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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

const LATAM_DATA = {
  mexico: {
    en: {
      seoTitle: "Compliant Freight Forwarding to Mexico | Seamless NOM Certification & Automated RFQ Solutions",
      seoDesc: "Direct FCL/LCL sea and air freight from China to Mexico. High-quality shipping with complete NOM quality conformance, customs tariff mapping, and robust last-mile delivery.",
      headline: "Compliant Freight Forwarding to Mexico | Seamless NOM Certification & Automated RFQ Solutions",
      subheadline: "Direct container sailings and cargo consolidation from Guangzhou self-operated hubs to Manzanillo, Lazaro Cardenas, and Mexico City. Clear complex NOM quality certification and RFC fiscal hurdles with our on-site compliance brokers.",
      transitWindow: "⏱️ Mexico Transit Windows",
      transitDays: "Sea: 35-50 Days | Air: 5-12 Days",
      complianceRowTitle: "NOM Certification & Customs Filing",
      complianceRowVal: "2 - 5 Days",
      solutionsTitle: "Mexico SCM Compliance Solutions",
      solutionsSubtitle: "Direct shipping lines designed to clear customs checkpoints, tariff barriers, and local transport regulations.",
      solutions: [
        {
          title: "Rigid B/L Tax ID Character Matching",
          desc: "Mexican customs strictly mandates that the Bill of Lading (B/L) must display the exact name, address, and TAX ID (RFC/CURP) of the consignee. If there is a single character mismatch with the commercial invoice, the container will face severe custom blocks and heavy documentation fines.",
          icon: "FileText"
        },
        {
          title: "Mandatory NOM Conformity Certificate",
          desc: "Electronics, electrical tools, and lighting fixtures are subject to mandatory Norma Oficial Mexicana (NOM) product safety regulations. Importing without a pre-validated NOM certificate results in immediate cargo seizure at ports like Manzanillo. DDNZ validates and secures your certifications prior to loading.",
          icon: "ShieldCheck"
        },
        {
          title: "Manzanillo Terminal Traffic Mitigation",
          desc: "Manzanillo is Mexico's busiest Pacific gateway and suffers frequent congestion. DDNZ negotiates 14-21 days of free destination port storage and provides pre-cleared custom filing to trigger fast container release.",
          icon: "Clock"
        }
      ],
      multimodalTable: [
        {
          mode: "🚢 Sea Freight (FCL/LCL)",
          days: "35 - 50 Days (FCL) | 45 - 60 Days (LCL)",
          suitability: "Highly optimized for heavy auto components, retail commodities, structural materials, and manufacturing equipment.",
          sellingPoint: "POL: Guangzhou, Shenzhen, Shanghai to POD: Manzanillo, Lazaro Cardenas. High frequency ocean carrier booking.",
          warning: "Strict customs inspections at Pacific ports. Tax ID (RFC) must be validated before sailing. Under-declared cargo faces immediate confiscation."
        },
        {
          mode: "✈️ Air Freight (Express / Tax-Inclusive)",
          days: "5 - 7 Days (Express) | 8 - 12 Days (Tax-Inclusive)",
          suitability: "Ideal for urgent automotive tooling, electronics parts, high-value consumer stock, and medical devices.",
          sellingPoint: "Direct cargo air lift to Mexico City (MEX) or Guadalajara (GDL) airports. Efficient security handling.",
          warning: "Air cargo is strictly audited for high lithium content and brand-name authenticity. Counterfeits face immediate seizure and criminal penalties."
        }
      ],
      faqs: [
        {
          q: "What is the NOM Certificate and is it mandatory for Mexican imports?",
          a: "Yes, NOM (Norma Oficial Mexicana) is a mandatory safety certification enforced by the Mexican government for products like electronics, household appliances, and toys. Goods arriving without this certificate cannot clear Manzanillo customs and may be forced into immediate return or state ownership."
        },
        {
          q: "Why is the tax ID (RFC) so critical on Mexican B/L documents?",
          a: "The RFC is the Mexican federal tax registration number. Custom authorities use automated scanners to match B/L records, commercial invoices, and tax registers. A mismatch of a single digit halts the entire customs entry, leading to extreme demurrage fees."
        },
        {
          q: "How does DDNZ handle the severe congestion in Manzanillo Port?",
          a: "We combat port delays through pre-arrival document validation (PRE-DICTA) and container pre-clearance. We also secure extended carrier free-time agreements of 14 to 21 days for our clients' peace of mind."
        }
      ]
    },
    zh: {
      seoTitle: "中国到墨西哥海运整柜拼箱与空运专线DDP | NOM认证合规 | 华正邦泰 DDNZ Global",
      seoDesc: "自营中国到墨西哥海运、空运包税双清专线。一票到底，提供专业的 NOM 强制认证、RFC 税号对齐、墨西哥城清关等高货值安全运输方案，解决拉美通关卡卡扣扣痛点。",
      headline: "中国到墨西哥专业海运/空运：直达核心枢纽，攻克电子电器 NOM 强制认证与海关查验雷区",
      subheadline: "自营广州集拼枢纽仓直航曼萨尼约、拉萨罗及墨西哥城。专业合规团队解决墨西哥特有电子电器 NOM 认证及 RFC 税收合规瓶颈，保障大宗贸易及跨境电商平稳通关。",
      transitWindow: "⏱️ 墨西哥专线履约时效",
      transitDays: "海运: 35-50天 | 空运: 5-12工作日",
      complianceRowTitle: "NOM 认证申报与海关预先审单",
      complianceRowVal: "2 - 5 天",
      solutionsTitle: "墨西哥专线合规解决方案",
      solutionsSubtitle: "直击拉美口岸特有财税红线，提供集报关、证书预审、仓储装卸于一体的全链条保驾护航。",
      solutions: [
        {
          title: "提单税号 RFC 字节 100% 对齐",
          desc: "墨西哥海关极度死板，强制要求提单（B/L）上的收货人/通知人名称、电话和税号（RFC/CURP）必须与原始商业发票字字吻合。一旦信息差错一个数字，即面临巨额行政罚款与退运没收危机。",
          icon: "FileText"
        },
        {
          title: "电子电器 NOM 强制认证防御",
          desc: "墨西哥标准协会规定电子产品、灯具照明等货物进口前必须在始发国办妥 NOM 质量安全合格证，否则到港后会被扣押没收。DDNZ 单证组提供专业的装船前预审，严保货物品质合规安全。",
          icon: "ShieldCheck"
        },
        {
          title: "曼萨尼约港常态化塞港攻坚",
          desc: "作为墨西哥最繁忙的太平洋门户，曼萨尼约常态拥堵。DDNZ 独家与各大船东协议，提供 14-21 天超长目的港免箱期，并在到港前完成舱单数据预审以提早通关。",
          icon: "Clock"
        }
      ],
      multimodalTable: [
        {
          mode: "🚢 海运整箱/拼箱 (Sea Freight)",
          days: "FCL 整柜 35-50 天 | LCL 拼箱 45-60 天",
          suitability: "最适合大型汽配、日用百货、建筑建材、重型工业机械及高体积商品。",
          sellingPoint: "广州、南沙、深圳直航墨西哥第一大港曼萨尼约（Manzanillo）、拉萨罗（Lazaro Cardenas）。定期直达，舱位充沛。",
          warning: "太平洋港口常态化红绿灯查验极为严格。RFC 税号和原始装箱清单必须确保 100% 真实。严厉打击低报货值行为。"
        },
        {
          mode: "✈️ 空运专线/商业快递 (Air Freight)",
          days: "商业快递 5-7 工作日 | 空运双清专线 8-12 工作日",
          suitability: "适合急需的汽车模具、高端消费电子、高溢价时尚鞋包、急需零部件样品。",
          sellingPoint: "中国始发全货机，直飞或转运至墨西哥城国际机场（MEX）或瓜达拉哈拉机场（GDL），自营清关组急速清关。",
          warning: "带有高能锂电池、强磁铁的电子产品必须走专门的危险品或敏感货专线，严查假冒牌、侵权产品，杜绝违法申报。"
        }
      ],
      faqs: [
        {
          q: "什么是 NOM 认证？是不是所有出口墨西哥的电器都要做？",
          a: "NOM (Norma Oficial Mexicana) 是墨西哥的强制性国家安全标准。绝大部分进入墨西哥的电子电器、照明、玩具产品都被强制要求 NOM。未获得此认证的货物到港后将被海关查扣，无法入境。"
        },
        {
          q: "为什么发货时，墨西哥提单上的 RFC 税号这么致命？",
          a: "RFC 是墨西哥的纳税登记号。由于墨西哥海关全面采用电子信息化审单，任何单证上的字符差错会导致税款核算冲突，轻则卡关重则直接重罚。因此，出货前 DDNZ 会有专人协助对齐所有数据。"
        },
        {
          q: "DDNZ 针对曼萨尼约和墨西哥城清关怎么提效？",
          a: "我们在 Manzanillo 港口和墨西哥城设有自营或战略合作代理网络。在货物出港阶段就会提交预清关（PRE-DICTA），争取 14-21 天免箱期，缩短堆场滞港滞箱费开支。"
        }
      ]
    }
  },
  brazil: {
    en: {
      seoTitle: "Risk-Free Shipping to Brazil (Santos) | SISCOS & CNPJ Single-Window Customs Mastermind",
      seoDesc: "Direct LCL and FCL ocean container service from China to Santos, Brazil. Reliable DDP logistics to navigate 'customs hell' with expert CNPJ verification and SISCOS compliance.",
      headline: "Risk-Free Shipping to Brazil (Santos) | SISCOS & CNPJ Single-Window Customs Mastermind",
      subheadline: "Navigate Brazil's high-barrier customs corridor through our specialized direct routes from Guangzhou to Santos Port. Our on-site customs consultants offer bulletproof tax resolution and certified CNPJ verification.",
      transitWindow: "⏱️ Brazil Transit Windows",
      transitDays: "Sea: 50-80 Days | Air: 15-20 Days",
      complianceRowTitle: "CNPJ Validation & Tax Mapping",
      complianceRowVal: "3 - 7 Days",
      solutionsTitle: "Brazil SCM Compliance Solutions",
      solutionsSubtitle: "Tackling Latin America's most demanding tax and single-window validation structures.",
      solutions: [
        {
          title: "Mandatory CNPJ/CPF Tax Registration",
          desc: "Brazil customs prohibits general imports without a registered taxpayer ID (CNPJ for businesses, CPF for individuals). The exact tax ID and NCM code (Mercosur HS code) must be hard-coded on the Bill of Lading, physical outer boxes, and tax invoices to avoid instant confiscation.",
          icon: "FileText"
        },
        {
          title: "Multi-Agency Certifications Shield",
          desc: "Imports are cross-audited by key federal regulators: INMETRO for electronics and toys, ANATEL for telecom devices, ANVISA for cosmetics and health products. Shipping without pre-shipment agency verification triggers high-level penalties of 2x to 3x the tax valuation difference.",
          icon: "ShieldCheck"
        },
        {
          title: "Rigid Box Weight & Freight Disclosures",
          desc: "The cargo box tare weight (em kg) must be printed and matched down to the gram. The Bill of Lading must clearly state the exact local ocean freight cost. Brazil customs scans for structural discrepancies and penalizes cargo severely.",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "🚢 Sea Freight (DDP / FCL / LCL)",
          days: "Direct Voyage: 30-35 Days | Complete DDP: 50-80 Days",
          suitability: "Highly suitable for structural steel, solar panels, heavy electrical equipment, cosmetics packaging, and wholesale e-commerce inventories.",
          sellingPoint: "POL: Guangzhou, Nansha, Shanghai to POD: Santos. Comprehensive DDP (inclusive of high Brazilian ICMS/IPI/PIS/COFINS taxes).",
          warning: "Brazil represents 'customs hell'. Clearances can stretch to 30+ days. DDNZ's tax-inclusive DDP route handles complex import licenses (LI) on your behalf."
        },
        {
          mode: "✈️ Air Freight (Indirect Hub Consolidation)",
          days: "15 - 20 Working Days",
          suitability: "Recommended for high-value mobile components, semiconductor electronics, precision mechanical spare parts, and cosmetic prototypes.",
          sellingPoint: "Air consolidation from China with secure transshipment via US Miami (MIA) or Middle East hubs to Sao Paulo (GRU) Airport.",
          warning: "There are extremely limited direct civil air freight paths to Brazil. Cargo must transit via third-country hubs. Strict NCM (HS code) checks are performed."
        }
      ],
      faqs: [
        {
          q: "Why is Brazil customs considered the most difficult 'customs hell' in the world?",
          a: "Brazil applies a highly complex cascade tax system (IPI, ICMS, PIS, COFINS) combined with strict non-tariff barriers (LI licensing, mandatory INMETRO certifications). Minor documentation errors (such as wrong NCM or slight weight differences) trigger automatic manual physical inspections and severe financial penalties."
        },
        {
          q: "What tax IDs must be present on a Brazilian shipment?",
          a: "For business buyers, a valid CNPJ (Cadastro Nacional da Pessoa Jurídica) is mandatory. For private individuals, a CPF (Cadastro de Pessoas Físicas) is required. This ID must appear verbatim on the commercial invoice, packing list, and Bill of Lading."
        },
        {
          q: "How does DDNZ resolve the complex tax burden with DDP?",
          a: "DDNZ runs a fully-integrated Brazilian import vehicle. Our DDP pricing models compute all local taxes, federal customs duties, and local port clearance charges into a single, contract-bound flat-rate. We handle all declarations and pay the duties, delivering the goods directly to your buyer's warehouse."
        }
      ]
    },
    zh: {
      seoTitle: "中国到巴西(圣保罗/桑托斯)海运DDP与空运专线 | 双清包税包单证 | 华正邦泰 DDNZ Global",
      seoDesc: "攻克巴西地狱级清关！中国至巴西圣保罗、桑托斯自营海运双清包税DDP专线。提供CNPJ税号核验、INMETRO认证协办、大宗散货到门一票到底无隐形消费。",
      headline: "中国到巴西（桑托斯 Santos）海运/空运：击穿‘地狱级海关难度’，100% 合规税制单证双清到门",
      subheadline: "直航大西洋东海岸第一大港桑托斯（Santos），穿越巴西极具挑战性的非关税贸易壁垒。自营口岸清关团队提供最稳妥的 CNPJ 税号核验、NCM 编码纠错及海关合规申报机制。",
      transitWindow: "⏱️ 巴西专线预计时效",
      transitDays: "海运: 50-80天 | 空运: 15-20工作日",
      complianceRowTitle: "CNPJ 纳税备案核查与 NCM 申报纠错",
      complianceRowVal: "3 - 7 天",
      solutionsTitle: "巴西专线合规解决方案",
      solutionsSubtitle: "独家攻破地狱级税收与合规机制，打通巴西繁琐的非关税壁垒、LI 进口批件、三方机构核验。",
      solutions: [
        {
          title: "无税号 CNPJ/CPF 不放行铁律",
          desc: "巴西海关坚决不允许任何无税号的拼箱/整柜提货。企业买家必须提供 CNPJ 税号，个人必须提供 CPF。提单上必须完整写明税号以及拉美专用的 NCM (海关HS编码)，否则货物在桑托斯港将被直接充公拍卖。",
          icon: "FileText"
        },
        {
          title: "三方行政认证风控防线 (INMETRO/ANATEL)",
          desc: "家电、电子及玩具类产品强制要求 INMETRO 认证；通讯数码设备需 ANATEL 认证；护肤品与医疗器械需 ANVISA 认证。DDNZ 资深单证团队提供装箱前单证查验核实，严禁低报货值遭海关处以逃税额 2-3 倍的顶格重罚。",
          icon: "ShieldCheck"
        },
        {
          title: "皮重、运费精确核对核实",
          desc: "巴西提单对于箱皮重（em kg）要求必须绝对精准至个位数。提单上还必须白纸黑字写明真实的目的港海运费。巴西海关人工审单对细微重量差异容忍度为零，稍有差异将触发严厉红灯查验。",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "🚢 经典海运双清 DDP (Santos Direct)",
          days: "纯海运航程: 约 30 天 | 双清到门(DDP): 全程 50 - 80 天",
          suitability: "最适合建筑建材、太阳能光伏组件、工业原料、重型电气机械、大型批发电商百货。",
          sellingPoint: "中国（广州、南沙、上海、宁波）直航桑托斯（Santos）港口。独家推出双清包税一站式 DDP 方案，涵盖巴西繁重错综的 ICMS、IPI、PIS 等多重增值税费。",
          warning: "巴西清关极为耗时，素有“地狱海关”之称，常态化海关放行需 30-40 天。DDNZ 提供全合规代理买单、协助申请进口批件（LI），避免货滞港口的高额滞箱费。"
        },
        {
          mode: "✈️ 空运双清专线 (Air Freight)",
          days: "15 - 20 工作日",
          suitability: "适合高附加值精密仪器零配件、移动通讯元器件、化妆品研发样品及高档服装样品。",
          sellingPoint: "中国始发全货机，因无跨大西洋直飞民航，货物强制通过美国迈阿密（MIA）、纽约（JFK）或中东迪拜（DXB）进行中转衔接，直达圣保罗瓜鲁柳斯机场（GRU）。",
          warning: "空运查验率同样居高不下。随货发票必须印有收货人有效的 CNPJ 号及相对应的 NCM 码。虚假申报会被当场扣关并课以双倍重罚。"
        }
      ],
      faqs: [
        {
          q: "为什么巴西清关被公认为“世界地狱级难度”？",
          a: "巴西的税制极为严酷，采用了多级流转税叠加（IPI工业税、ICMS流转税、PIS/COFINS社会融合基金），进口商需要极其成熟的清关资质（Radar系统备案）。同时，对产品质量认证、标签、净重、运费申报的要求细致入微，哪怕一个极小的拼箱漏报都会导致整批货物受阻。"
        },
        {
          q: "什么是 NCM 编码，和国内的 HS Code 相比有什么需要注意的？",
          a: "NCM (Nomenclatura Comum do Mercosul) 是南方共同市场共同命名。它虽然基于 HS 编码，但有着巴西本地的细化延伸。巴西海关对 NCM 的适用性审查极严，错用 NCM 会被罚款多至货值的 10%。"
        },
        {
          q: "DDNZ 的巴西 DDP 海运服务能帮货主省去哪些麻烦？",
          a: "我们提供一站式一票到底的包税包清关双清服务，货主无需具备巴西本地复杂的 Radar 清关资质或自办高难度的 LI 进口批件，所有税金申报、清关派送均由我司在巴西的专业进口执照实体来全权承办。"
        }
      ]
    }
  },
  argentina: {
    en: {
      seoTitle: "End-to-End Logistics to Argentina | Escrow & Hong Kong Gateway for Strict Forex Control",
      seoDesc: "Direct ocean and air freight shipping from China to Buenos Aires, Argentina. Overcome strict local monetary exchange controls and custom barriers with DDNZ offshore escrow gateway.",
      headline: "End-to-End Logistics to Argentina | Escrow & Hong Kong Gateway for Strict Forex Control",
      subheadline: "Direct container sailings and fast air cargo connections from Guangzhou to Buenos Aires Port. Conquer Argentina's severe central bank foreign currency exchange limits and CUIT validation through our dedicated Hong Kong finance and SCM bridge.",
      transitWindow: "⏱️ Argentina Transit Windows",
      transitDays: "Sea: 35-50 Days | Air: 12-18 Days",
      complianceRowTitle: "CUIT Registration & SIRA Approval",
      complianceRowVal: "4 - 8 Days",
      solutionsTitle: "Argentina SCM Compliance Solutions",
      solutionsSubtitle: "Solving strict financial currency controls and customs single-window protocols in Argentina.",
      solutions: [
        {
          title: "Offshore Financial Bridge & Escrow",
          desc: "Argentina applies severe central bank foreign exchange controls, meaning local buyers frequently cannot convert currency to pay Chinese suppliers in USD or RMB. Leveraging DDNZ's Hong Kong off-shore financial gateway, we provide secure, fully compliant local-to-foreign currency conversion, third-party payment settlement, and escrow protection, eliminating the risk of cargo being abandoned at ports.",
          icon: "ShieldCheck"
        },
        {
          title: "SIRA / SIs Import License Approval",
          desc: "Imports to Argentina require strict SIRA authorization (Sistema de Importaciones de la República Argentina) prior to physical loading in China. SIRA codes must be matched with the NCM code. DDNZ single-window experts verify your buyer's CUIT taxpayer account status to guarantee import clearance.",
          icon: "FileText"
        },
        {
          title: "Mandatory CUIT Tax ID Characters Match",
          desc: "Argentine customs mandates that the Bill of Lading (B/L) must display 100% accurate CUIT (tax registration number) and NCM code. If a single character is misplaced on the ocean document, cargo release is blocked, leading to immediate demurrage charges.",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "🚢 Sea Freight (FCL / LCL)",
          days: "35 - 50 Days",
          suitability: "Optimized for raw industrial materials, energy components, high-density manufacturing parts, and general retail stock.",
          sellingPoint: "Weekly scheduled sailings from Guangzhou, Shenzhen, and Shanghai to Buenos Aires. Direct consolidations.",
          warning: "Frequent port congestion and union strikes in Buenos Aires. DDNZ recommends pre-arranging destination port custom declarations and adding 2 weeks of safety buffer in your supply chain planning."
        },
        {
          mode: "✈️ Air Freight (Indirect Air Bridge)",
          days: "12 - 18 Working Days",
          suitability: "Best suited for critical machinery spare parts, high-end mobile devices, pharmaceutical devices, and fast-moving retail samples.",
          sellingPoint: "Consolidation via US Miami (MIA) or European hubs to Buenos Aires Ministro Pistarini (EZE) Airport.",
          warning: "Strict cargo screening at airport custom warehouses. CUIT registry must be confirmed in advance. Non-compliant shipments face severe immediate warehouse quarantine."
        }
      ],
      faqs: [
        {
          q: "How does Argentina's strict foreign exchange control affect Chinese shippers, and how does DDNZ solve it?",
          a: "Due to hyperinflation and low reserves, Argentina's central bank severely restricts companies from transferring USD or RMB overseas to pay for imports. Local buyers may fail to pay balance payments, causing cargo to sit at the port and eventually go to auction. DDNZ uses our Hong Kong financial gateway to facilitate legal, compliant offshore payments and trade escrow, protecting Chinese shippers from payment defaults."
        },
        {
          q: "What is SIRA and why is it needed for Argentine customs?",
          a: "SIRA (Sistema de Importaciones de la República Argentina) is the mandatory import licensing system. Shippers cannot legally load cargo in China without obtaining an approved SIRA number from Argentine customs. SIRA registry confirms the buyer's credit status and currency quota."
        },
        {
          q: "What tax registry must be verified before shipping to Buenos Aires?",
          a: "The CUIT (Clave Única de Identificación Tributaria) is Argentina's mandatory tax ID. CUIT status must be completely active with customs. Shippers must print this number verbatim on the Bill of Lading and all customs documentation."
        }
      ]
    },
    zh: {
      seoTitle: "中国到阿根廷(布宜诺斯艾利斯)海运与空运专线 | 外汇代付及托收 | 华正邦泰 DDNZ Global",
      seoDesc: "独家破解阿根廷外汇换汇与清关卡脖子壁垒！提供中国到阿根廷布宜诺斯艾利斯海海空多式联运。依托香港离岸合规结算网关保障货款安全，保障 CUIT/SIRA 快速放行。",
      headline: "中国到阿根廷（布宜诺斯艾利斯）项目货运：解决外汇换汇卡脖子痛点，CUIT 单证全合规通关",
      subheadline: "海运及空运直达布宜诺斯艾利斯。依靠 DDNZ 独家香港离岸合规金融结算网关，攻克阿根廷因极其严酷的外汇管制导致买家无法按时换汇、转账付款的供应链断头危机，确保货款安全与CUIT税号清关顺畅。",
      transitWindow: "⏱️ 阿根廷专线时效保障",
      transitDays: "海运: 35-50天 | 空运: 12-18工作日",
      complianceRowTitle: "CUIT 资质校验与 SIRA 进口批件审核",
      complianceRowVal: "4 - 8 天",
      solutionsTitle: "阿根廷专线合规解决方案",
      solutionsSubtitle: "直击拉美金融与清关双重死穴，提供独家“外汇结算兜底 + 清关单证双线并行”老庄家保障机制。",
      solutions: [
        {
          title: "香港离岸合规金融网关（破解换汇卡脖子）",
          desc: "阿根廷政府实施致命的中央银行外汇管制，当地进口商极其难申请到美金/人民币支付海外货款。DDNZ 独家依托香港离岸合规本币结算网关，打通第三方合规代收托收闭环，避免货到港口却换不出外汇、最终卡港退运“钱货两空”的心理战！",
          icon: "ShieldCheck"
        },
        {
          title: "SIRA 进口批件与 CUIT 税号校验",
          desc: "出口阿根廷必须在物理装船前，通过海关系统申请获得合规的 SIRA (阿根廷进口许可) 批件。DDNZ 单证团队会在货物包装前，对目的港买家 CUIT（纳税登记号）纳税状态进行全合规校验，保障一网通行。",
          icon: "FileText"
        },
        {
          title: "提单 CUIT / NCM 编码 100% 对齐",
          desc: "阿根廷海关规定，海运提单（B/L）必须完整显现买家有效的 CUIT 税号以及拉美专用的 NCM 编码（海关HS编码）。提单数据差一个字母，到港后都会被扣仓、导致高额仓储罚款。",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "🚢 海运整箱/拼箱 (Sea Freight)",
          days: "35 - 50 天",
          suitability: "最适合工业原材料、新能源光伏、重型机械零配件、大宗日用品以及高密度商业库存。",
          sellingPoint: "每周定期直航广州、深圳、上海直通阿根廷布宜诺斯艾利斯（Buenos Aires）。自营集拼打托，全系统可视追踪。",
          warning: "布宜诺斯艾利斯港口常年存在常态化拥堵及不定期的工会罢工风险。清关放行一般需 20-30 天。DDNZ 强烈建议货主在物流周期中额外增加 2 周的保险缓冲期。"
        },
        {
          mode: "✈️ 空运双清专线/空海联运 (Air Freight)",
          days: "12 - 18 工作日",
          suitability: "急需的高端电子数码、精密机械模具、高附加值样品及高时效性时尚快消品。",
          sellingPoint: "中国始发，因阿根廷航线极为稀缺，货物往往通过美国迈阿密（MIA）或欧洲法兰克福（FRA）转运至布宜诺斯艾利斯皮斯塔里尼机场（EZE）。",
          warning: "机场海关监管仓库审核速度较慢，货物入仓前必须确认 SIRA 批件已激活，否则货物将面临无限期滞港和高昂滞报费。"
        }
      ],
      faqs: [
        {
          q: "阿根廷如此严厉的外汇管制下，中国货主面临什么最致命的风险？如何规避？",
          a: "最致命的风险是：买家交了 30% 定金，大货做好了也运到阿根廷港口了，但阿根廷中央银行不批准剩下 70% 的外汇转账，导致买家无法提货。大货在港口滞留超过法定免租期后，会被海关低价拍卖，买家可能低价买回，导致货主血本无归。DDNZ 独家推出香港离岸金融通道，打通买家在当地使用本币(披索)折算离岸美金的合规托收路径。"
        },
        {
          q: "什么是 SIRA，对中国出口企业有什么实质性制约？",
          a: "SIRA (Sistema de Importaciones de la República Argentina) 是阿根廷进口许可监控系统。中国货主发货前必须先向买家确认其 SIRA 是否已通过。没有获批的 SIRA 批件，货物到港后根本无法录入报关单。"
        },
        {
          q: "阿根廷清关还需要准备哪些核心单据？",
          a: "除了常规提单、发票、装箱单之外，针对化工品、安全元器件等受控物资，阿根廷海关往往要求做领事双认证（即在中国外交部和阿根廷驻华使馆进行签名盖章双认证）。DDNZ 的单证部可一站式代办此类双认证单据。"
        }
      ]
    }
  }
};

const PAGE_LANG_DATA = {
  en: {
    seoTitle: "Latin America Freight Specialist | Compliant Logistics Solutions | DDNZ",
    seoDesc: "Your trusted gateway to Latin American shipping (Mexico, Brazil, Argentina). 100% guaranteed Compliant DDP, free consolidation warehouse, and strict cargo pre-auditing.",
    tabMexico: "Mexico (NOM & RFC Solutions)",
    tabBrazil: "Brazil (CNPJ & Santos Gate)",
    tabArgentina: "Argentina (SIRA & Forex Escrow)",
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
    formSuccessSub: "Our senior trade lane manager for Latin America will contact you within 24 hours.",
    formAnother: "Submit Another Quote Request",
    complianceBadge: "COMPLIANCE NOTICE",
    timeBadge: "TIMELINE FORECAST",
    actionQuote: "Generate Dynamic Route Quote",
    actionConsult: "Consult Compliance Specialist",
    guideHeader: "DDNZ Latin America Gate: 18-Year SCM Hardcore Blueprint",
    guideSub: "Realizing secure logistics across Latin America and overcoming customs bottlenecks."
  },
  zh: {
    seoTitle: "中国到拉美(墨西哥/巴西/阿根廷)海运整柜拼箱双清DDP | 拉美庄家 | 华正邦泰 DDNZ Global",
    seoDesc: "二十余年专注中国至拉丁美洲（墨西哥、巴西、阿根廷）专业货运专线。提供自营拼箱，独家NOM/CNPJ核验备案、外汇代收付保障，拒绝对港二次加价，一票到底。",
    tabMexico: "墨西哥（NOM与RFC合规专区）",
    tabBrazil: "巴西（桑托斯CNPJ地狱通关专区）",
    tabArgentina: "阿根廷（SIRA与香港外汇托管专区）",
    faqHeading: "拉丁美洲航线通关合规常见问答",
    faqSubheading: "拉美各国关税及外汇政策多变，DDNZ 提炼真实货主核心痛点，出货前帮您彻底避坑。",
    formTitle: "立即获取拉美双清方案及报价",
    formSub: "由 DDNZ 运营十八年以上的拉美大区专线经理亲自为您进行路由和精算方案设计。",
    formName: "您的姓名 / 企业名称 (必填)",
    formEmail: "您的企业邮箱 (必填)",
    formPhone: "联系电话 / 微信 / WhatsApp (必填)",
    formGoods: "货物详情描述 (如品名、箱数、总重量/立方数、有无电池等)",
    formSubmit: "立即索取专属 DDP 精算报价",
    formSuccess: "拉美专线询价提交成功！",
    formSuccessSub: "拉美大区专线经理正在精算成本，将在 24 小时内向您的邮箱或电话提供详细报价单。",
    formAnother: "发起新的拉美询价",
    complianceBadge: "合规风控红线",
    timeBadge: "时效安全测算",
    actionQuote: "获取本条航线精确预算",
    actionConsult: "在线对接货代大庄家",
    guideHeader: "DDNZ 拉美通用保命指南：18年大区老庄家硬实力方案",
    guideSub: "从中国自营集拼仓到拉美各口岸，完美击碎目的港天价隐藏收费黑幕与外汇管制违约灾难。"
  }
};

const UNIVERSAL_REDLINES = {
  en: {
    title: "Avoid-Pitfall SCM Gate: Critical Operation Warnings",
    subtitle: "Latin American shipping requires deep localized execution. If you do not follow these standard operating protocols, you will face lost cargo, payment default, and unrecoverable port fines.",
    items: [
      {
        id: "01",
        title: "Sea-Air Multimodal Transit Black Technology",
        desc: "For time-sensitive rush orders, DDNZ offers exclusive sea-air multimodal logistics: ocean freight to transit hubs, then air lifted to the South American heartlands. This compresses the timeline to 25-40 days while reducing costs by 50% compared to pure air freight!"
      },
      {
        id: "02",
        title: "Guangzhou Self-Operated Hub: Eliminating Dead Volume",
        desc: "We strongly condemn carriers charging extra for volumetric weight calculations on retail items! At our self-operated Guangzhou main warehouse, our engineers apply Cube Optimization (体积精算) to eliminate packaging air-pockets, pack fragile items inside heavy plywood crates, and issue transparent contract-bound DDP rates."
      },
      {
        id: "03",
        title: "The Packaging Color Superstition: Avoid Red!",
        desc: "An essential industry insider secret! We strictly advise shippers to avoid using red stretch wrap or red carton boxes for Latin American routes. Red packaging triggers high-risk profiles in automated customs scanners in Brazil and Mexico, heavily increasing the chances of manual cargo inspection."
      },
      {
        id: "04",
        title: "On-Site Quality Pre-Shipment Check (Our Eyes & Ears)",
        desc: "We deploy quality engineers directly to supplier factories in China. We conduct functional checklist checks, count box numbers, inspect custom labelling, and check wood packaging heat treatment (ISPM 15) to guarantee pristine cargo arrival."
      }
    ]
  },
  zh: {
    title: "拉美通用保命指南：货代老法师绝密经验红线",
    subtitle: "拉丁美洲航线水极深，目的港扣关、退运风险极高。不遵守以下操作规范，大货可能面临钱货两空的绝境。",
    items: [
      {
        id: "01",
        title: "海空多式联运 (Sea-Air) 降本黑科技",
        desc: "针对时效要求高的加急大货，DDNZ 独家提供中南美“海空多式联运”：先海运到中转枢纽，再通过空运支线分拨进入拉美腹地。相比于高昂的纯空运，不仅降本高达 50%，还能将整体签收时效安全压缩到 25-40 天！"
      },
      {
        id: "02",
        title: "广州 18 年自营集拼仓：粉碎“长宽高”体积水分",
        desc: "我们坚决痛击无良货代利用（长x宽x高/6000）等变相体积计价重手段收割货主！DDNZ 广州自营总仓为散货提供免费包装瘦身和 Cube Optimization（极致体积精算压缩），将偏远附加费白纸黑字写进 DDP 合同，绝无口头承诺。"
      },
      {
        id: "03",
        title: "货品外包装避坑玄学：尽量避开红色包装",
        desc: "拉美航线老油条都知道的避坑细节！我们在打包出港时，严格建议货主避免使用红色的拉伸缠绕膜或大红色外包装箱。在巴西和墨西哥海关，红色往往是智能海关查验系统高风险等级的过滤标识，容易触发人工开箱扣压。"
      },
      {
        id: "04",
        title: "中国始发本土实地品控验货（货主的眼睛和耳朵）",
        desc: "我们在货物打包、装柜前，派遣品控专员实地进行 Pre-shipment 装运前质检。检查外观质量、清点数量、核实实物唛头与提单申报品名是否完全吻合，避免跨越太平洋后才发现货不对板。"
      }
    ]
  }
};

export default function ShippingLatinAmerica() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const getCountryFromQuery = () => {
    const params = new URLSearchParams(location.search);
    const countryParam = params.get('country') || params.get('dest');
    if (countryParam) {
      const lowerCountry = countryParam.toLowerCase();
      if (lowerCountry === 'brazil' || lowerCountry === 'brasil') return 'brazil';
      if (lowerCountry === 'argentina') return 'argentina';
    }
    return 'mexico';
  };

  const [selectedCountry, setSelectedCountry] = useState<'mexico' | 'brazil' | 'argentina'>(getCountryFromQuery());
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
    trackEvent('page_view', { path: '/shipping-from-china-to-latin-america', country: selectedCountry });
  }, [location.pathname, selectedCountry]);

  const handleCountryTabChange = (country: 'mexico' | 'brazil' | 'argentina') => {
    setSelectedCountry(country);
    navigate(`?country=${country}`, { replace: true });
    setActiveTransportMode(0);
    setActiveFaq(null);
  };

  const activeLang = language === 'zh' ? 'zh' : 'en';
  
  const spec = LATAM_DATA[selectedCountry][activeLang];
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

  const getTransitTimes = () => {
    if (selectedCountry === 'mexico') {
      return {
        sea: language === 'zh' ? '35 - 50 天' : '35 - 50 Days',
        air: language === 'zh' ? '5 - 12 工作日' : '5 - 12 Days',
        seaLabel: language === 'zh' ? '曼萨尼约 / 拉萨罗卡德纳斯海运整箱 (FCL)' : 'Manzanillo / Lázaro Cárdenas FCL',
        seaDesc: language === 'zh' ? '一级直航海运服务' : 'Tier-1 Direct Ocean Sailings',
        airLabel: language === 'zh' ? '墨西哥城 (MEX) 空运专线' : 'Mexico City (MEX) Air Express',
        airDesc: language === 'zh' ? '自主清关与最后一公里派送' : 'Direct Clearance & Last-Mile Delivery'
      };
    } else if (selectedCountry === 'brazil') {
      return {
        sea: language === 'zh' ? '50 - 80 天' : '50 - 80 Days',
        air: language === 'zh' ? '15 - 20 工作日' : '15 - 20 Days',
        seaLabel: language === 'zh' ? '桑托斯海运快线 (Santos Express)' : 'Santos Sea Express',
        seaDesc: language === 'zh' ? '避开合恩角恶劣气候的优化航线' : 'Optimized Cape Horn Avoidance Routing',
        airLabel: language === 'zh' ? '圣保罗 (GRU) 空运专线' : 'São Paulo (GRU) Air Express',
        airDesc: language === 'zh' ? '稳定排舱 DDP 门到门' : 'Stable Space Booking & DDP Door-to-Door'
      };
    } else {
      return {
        sea: language === 'zh' ? '35 - 50 天' : '35 - 50 Days',
        air: language === 'zh' ? '12 - 18 工作日' : '12 - 18 Days',
        seaLabel: language === 'zh' ? '布宜诺斯艾利斯海运快线' : 'Buenos Aires Sea Express',
        seaDesc: language === 'zh' ? '双清包税送货上门' : 'Customs Cleared Door-to-Door',
        airLabel: language === 'zh' ? '埃塞萨 (EZE) 空运专线' : 'Ezeiza (EZE) Air Express',
        airDesc: language === 'zh' ? '稳定排舱 DDP 门到门' : 'Stable Space Booking & DDP Door-to-Door'
      };
    }
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
      destination: selectedCountry === 'mexico' 
        ? (language === 'zh' ? '墨西哥' : 'Mexico') 
        : selectedCountry === 'brazil'
          ? (language === 'zh' ? '巴西' : 'Brazil')
          : (language === 'zh' ? '阿根廷' : 'Argentina')
    }));
  }, [selectedCountry, language]);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    trackEvent('latin_america_quote_submit', { ...formData, selectedCountry });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        goods: '',
        destination: selectedCountry === 'mexico' ? 'Mexico' : selectedCountry === 'brazil' ? 'Brazil' : 'Argentina'
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
            src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80&w=2000" 
            alt="Latin America Ocean Freight"
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
                    onClick={() => handleCountryTabChange('mexico')}
                    className={`px-5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${
                      selectedCountry === 'mexico'
                        ? 'bg-[#FF8A00] text-white shadow-lg scale-105'
                        : 'bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    🇲🇽 {t('tabMexico')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCountryTabChange('brazil')}
                    className={`px-5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${
                      selectedCountry === 'brazil'
                        ? 'bg-[#FF8A00] text-white shadow-lg scale-105'
                        : 'bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    🇧🇷 {t('tabBrazil')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCountryTabChange('argentina')}
                    className={`px-5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${
                      selectedCountry === 'argentina'
                        ? 'bg-[#FF8A00] text-white shadow-lg scale-105'
                        : 'bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    🇦🇷 {t('tabArgentina')}
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
                  🌎 DDNZ LATAM REGIONAL HUB
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
                      {language === 'zh' ? 'NOM 认证与通关合规' : 'NOM & Customs Compliant'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF8A00]/10 border border-[#FF8A00]/20 text-xs font-bold text-[#FF8A00]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]"></span>
                      {language === 'zh' ? '中国自营装箱拼箱仓' : 'Guangzhou Direct LCL Hub'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      {language === 'zh' ? '一站式 DDP / DDU 双清' : 'One-Stop DDP/DDU'}
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
                      const formElem = document.getElementById('latam-quote-form');
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
                {language === 'zh' ? '拉美专线真实货运时效' : 'Latin America Fast-Lane Transit Windows'}
              </h3>
              
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-5 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-white">{getTransitTimes().seaLabel}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{getTransitTimes().seaDesc}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="text-sm font-extrabold text-[#FF8A00] whitespace-nowrap">⏱️ {getTransitTimes().sea}</span>
                </div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-5 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-white">{getTransitTimes().airLabel}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{getTransitTimes().airDesc}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="text-sm font-extrabold text-[#FF8A00] whitespace-nowrap">⏱️ {getTransitTimes().air}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10">

        {/* Section: Compliant Solutions Checklist (3 Columns) */}
        <section className="py-16 md:py-24 border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="px-3 py-1 bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                🛡️ LATAM Clearance Framework
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
                    <span>{language === 'zh' ? '申请专项合规备案' : 'Request Registry Pre-Audit'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Transit Timelines Dynamic Detail Grid */}
        <section className="py-16 border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="px-3 py-1 bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                📊 {language === 'zh' ? '通道时效精细比对' : 'SCM Lead-Time Matrix'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-4">
                {language === 'zh' ? '拉美双通道精准时效对齐' : 'LATAM Transit Pathway Specifications'}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-sm font-semibold">
                {language === 'zh' 
                  ? '对比物理路由、适用场景及老庄家核心卖点，为您规避漫长延误。' 
                  : 'Compare ocean container and air cargo lanes with exact shipping timelines and direct operations rules.'}
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
                            {language === 'zh' ? '预计周期' : 'Transit Window'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-base font-bold text-white">
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
                  <div className="bg-white/[0.02] backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/[0.08] shadow-lg relative overflow-hidden min-h-[380px] flex flex-col justify-between">
                    {/* Watermark of active mode */}
                    <div className="absolute -top-12 -right-12 text-white/5 font-black text-9xl select-none pointer-events-none opacity-10">
                      {spec.multimodalTable[activeTransportMode].mode.split(' ')[0]}
                    </div>

                    <div className="relative z-10 space-y-6">
                      <div>
                        <span className="px-2.5 py-1 bg-[#FF8A00]/10 text-[#FF8A00] text-[10px] font-black uppercase tracking-wider rounded-lg">
                          {language === 'zh' ? '深度技术对齐' : 'SCM Detail Panel'}
                        </span>
                        <h3 className="text-xl md:text-2xl font-black text-white mt-2">
                          {spec.multimodalTable[activeTransportMode].mode}
                        </h3>
                        <p className="text-[#FF8A00] text-sm font-black mt-1">
                          ⏱️ {language === 'zh' ? '货主预计提货周期' : 'DDP Delivery Window'}: <span className="font-mono text-base font-bold text-white">{spec.multimodalTable[activeTransportMode].days}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div>
                          <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                            🎯 {language === 'zh' ? '最适用货品场景' : 'Best Suited For'}
                          </h5>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                            {spec.multimodalTable[activeTransportMode].suitability}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-[#FF8A00] uppercase tracking-widest mb-1.5">
                            💡 {language === 'zh' ? 'DDNZ 独家技术卖点' : 'DDNZ Unique SCM Features'}
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
                            ⚠️ {language === 'zh' ? '查验雷区 & 操作警告' : 'Operation Pre-Warnings'}
                          </h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            {spec.multimodalTable[activeTransportMode].warning}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                      <span className="text-xs text-slate-400 font-bold">
                        * {language === 'zh' ? '上述时效基于我司拉美航线真实货运凭证，清关阶段人工查验容错率极低，请严格对齐。' : 'Lanes are subject to strict regional physical and tax checks. Correct document alignment is mandatory.'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const quoteForm = document.getElementById('latam-quote-form');
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

        {/* Universal LATAM Avoid-Pitfall & SCM Insights */}
        <section className="py-16 md:py-24 border-b border-white/[0.05] bg-transparent text-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="px-3 py-1 bg-[#FF8A00]/10 border border-[#FF8A00]/20 text-[#FF8A00] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                ⚡ {language === 'zh' ? '老庄家绝密风控' : 'SCM Redlines'}
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

        {/* Latin America FAQ */}
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
                          transition={{ duration: 0.25, ease: "easeInOut" }}
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

        {/* Lead Generation RFQ Form */}
        <section id="latam-quote-form" className="py-16 md:py-24 border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/[0.03] backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/[0.08] dark-form-container">
              <GetAQuote
                presetDestination={
                  selectedCountry === 'mexico'
                    ? (language === 'zh' ? '墨西哥' : 'Mexico')
                    : selectedCountry === 'brazil'
                    ? (language === 'zh' ? '巴西' : 'Brazil')
                    : (language === 'zh' ? '阿根廷' : 'Argentina')
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
