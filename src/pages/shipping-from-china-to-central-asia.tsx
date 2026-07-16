import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import ScrollToTop from '../components/ScrollToTop';
import SEO from '../components/SEO';
import GetAQuote from '../components/GetAQuote';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, AlertTriangle, Ship, Package, ShieldCheck, 
  Search, ArrowRight, CheckCircle2, MessageSquare, ShieldAlert,
  Globe, Clock, HelpCircle, Truck, FileText, Scale, ArrowUpRight
} from 'lucide-react';
import { trackEvent } from '../lib/utils';

// Multi-language strings for Central Asia countries
const CENTRAL_ASIA_DATA = {
  kazakhstan: {
    en: {
      seoTitle: "Secured Freight Forwarding to Kazakhstan | EAEU Compliance | DDNZ",
      seoDesc: "Cross-border block train & highway trucking from China to Almaty, Kazakhstan. Managing EAEU customs clearance, TR CU 027/2012, and broad gauge 1520mm rail transfers since 1999.",
      headline: "Secured Freight Forwarding from China to Kazakhstan | Multimodal Transit & EAEU Compliance",
      subheadline: "Direct block train and reliable cross-border truck freight. Overcoming 1520mm broad gauge border transfer bottlenecks (Horgos/Alashankou) with dedicated on-site teams. 100% compliant DDP/DDU logistics.",
      transitWindow: "⏱️ Kazakhstan Transit Windows",
      transitDays: "15 - 25 Days",
      complianceRowTitle: "EAEU TR CU Certification Auditing",
      complianceRowVal: "2 - 3 Days",
      solutionsTitle: "Kazakhstan SCM Compliance Solutions",
      solutionsSubtitle: "Tailored supply chain pathways built to resolve EAEU entry tariffs, gauge transformations, and document alignment.",
      solutions: [
        {
          title: "EAEU Customs Compliance & TR CU Rules",
          desc: "As a member of the Eurasian Economic Union (EAEU), Kazakhstan shares a unified customs tariff system. For controlled products like plastic pipes (TR CU 027/2012), DDNZ assists cargo owners in securing Declaration of Conformity and aligning TN VED codes in advance, avoiding an 8% extra tariff penalty from HS code misalignment.",
          icon: "ShieldCheck"
        },
        {
          title: "1520mm Broad Gauge Rail Transfer",
          desc: "China's standard gauge is 1435mm, while Central Asia uses the 1520mm broad gauge. Cargo must be transferred at border ports (Horgos/Alashankou). DDNZ has dedicated on-site teams to guarantee container reloading efficiency, maintaining a stable door-to-door transit time of 15-25 days.",
          icon: "Scale"
        },
        {
          title: "Pure 'Double Document' Strategy",
          desc: "We enforce a double-document strategy where English files accompany the cargo and Chinese documents are kept for records. Consignee details on the Bill of Lading must align 100% with clearance documents to prevent high demurrage/storage fees ($120/day) caused by spelling mistakes.",
          icon: "FileText"
        },
        {
          title: "MFN Mapped Profit Protection",
          desc: "Anti-intuitive warning! There is no Free Trade Agreement (FTA) tariff discount between China and the EAEU. Origin certificates only verify provenance; DDNZ calculates profits strictly according to the Most Favored Nation (MFN) tariff rates (TN VED).",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "✈️ Air Freight (Express)",
          days: "3 - 7 Days",
          suitability: "Ideal for high-value cargo, samples & time-critical electronics.",
          sellingPoint: "Fastest custom clearance path with direct flights to Almaty (ALA) airport.",
          warning: "Strict lithium battery, liquid, and powder checks are enforced."
        },
        {
          mode: "🚚 Cross-Border Trucking (Semi-Trailer Swap Mode)",
          days: "5 - 12 Days",
          suitability: "Highly recommended for consolidated batches around 5 tons; extremely flexible compared to whole rail containers.",
          sellingPoint: "Utilizes the advanced 'semi-trailer swap' mode. We only change tractor heads at the domestic port, the trailer exits the destination directly. Zero intermediate unboxing ensures perfect safety for fragile & premium goods.",
          warning: "Strict roadside highway inspections on axle loads. Direct routing eliminates handling damage."
        },
        {
          mode: "🚂 Rail Freight (Block Train / Bulk Rail)",
          days: "6 - 20 Days",
          suitability: "Best for heavy bulk machinery, building materials, and full-container-loads (FCL).",
          sellingPoint: "Regular scheduled block train pathways directly connecting Chinese hubs (Lianyungang, Xi'an) to Almaty (6-14 days) and Nur-Sultan/Astana (~20 days). Cost-effective for massive volume SCM.",
          warning: "China uses 1435mm standard gauge, Kazakhstan uses 1520mm broad gauge. Containers must reload at borders (e.g., Horgos). Reloading takes 1-3 days; DDNZ has an on-site team overseeing the transfer to mitigate congestion."
        },
        {
          mode: "📦 E-commerce Packet & EMS",
          days: "5 - 18 Days",
          suitability: "Tailored for small cross-border parcels and light consumer shipments.",
          sellingPoint: "Specialized direct packet routes average 5-7 days. Ideal for marketplace sellers.",
          warning: "Postal EMS takes 15-18 days with strict physical bans on liquids, powders, and loose batteries."
        }
      ],
      faqs: [
        {
          q: "What is the EAEU customs clearance challenge in Kazakhstan?",
          a: "Since Kazakhstan is part of the EAEU, goods must comply with unified Eurasian standards (like TR CU). HS codes (TN VED) must match precisely. DDNZ conducts pre-shipment audits on classification and certificates to prevent seizures and heavy fines at Almaty customs."
        },
        {
          q: "How does the 1520mm broad gauge rail transfer affect my transit time?",
          a: "All rail shipments from China must be transferred from standard standard gauge to Russian broad gauge at the Alashankou or Horgos border. During peak seasons, this reloading process can cause severe bottlenecks. DDNZ maintains local agents at the borders to expedite the mechanical transfer, keeping the rail voyage within 15-25 days."
        },
        {
          q: "Do Chinese Certificate of Origin (CO) qualify for tariff discounts?",
          a: "No. Kazakhstan (and other EAEU nations) do not have a free trade agreement with China that grants tariff exemptions. CO certificates only verify origin; duties are calculated based on the Most Favored Nation (MFN) tariff schedule. DDNZ maps these exact rates beforehand so your landing costs are 100% predictable."
        }
      ]
    },
    zh: {
      seoTitle: "中国至哈萨克斯坦(阿拉木图)跨境卡航与铁路班列DDP | 大递诺展 DDNZ Global",
      seoDesc: "自营中国到哈萨克斯坦阿拉木图海铁联运与跨境卡航专线。死磕 EAEU 欧亚联盟清关合规，1520mm 宽轨口岸快速换装，提供塑料管材等 TR CU 认证与 TN VED 预审托底。",
      headline: "中国到哈萨克斯坦（阿拉木图/阿斯塔纳）多式联运：空运/公路卡航/中欧班列全通道时效与 EAEU 通关保障",
      subheadline: "直达中亚最大物流枢纽。DDNZ 自营霍尔果斯/阿拉山口口岸操作团队，保障 EAEU 成员国（哈萨克斯坦）进口合规申报与 1520mm 宽轨换装效率，全程时效 15-25 天稳定送达。",
      transitWindow: "⏱️ 哈萨克斯坦专线预计时效",
      transitDays: "15 - 25 天",
      complianceRowTitle: "EAEU 欧亚联盟商检及 TR CU 预审",
      complianceRowVal: "2 - 3 工作日",
      solutionsTitle: "哈萨克斯坦专线合规解决方案",
      solutionsSubtitle: "针对中亚特殊路权与地缘通关红线，由二十余年本土货代老庄死磕细节，打通宽轨换装与关税壁垒。",
      solutions: [
        {
          title: "EAEU 共享通关铁律",
          desc: "哈国作为欧亚经济联盟成员国，共享一套海关关税体系。针对塑料管材（TR CU 027/2012）等管制目录产品，DDNZ 协助货主提前锁定符合性声明与 TN VED 编码体系，规避海关编码错位导致的 8% 额外关税惩罚。",
          icon: "ShieldCheck"
        },
        {
          title: "1520mm 宽轨换轨时效拆解",
          desc: "中国标准轨1435mm，边境口岸（霍尔果斯/阿拉山口）必须换装。DDNZ 团队驻点操作，保障整箱换装效率，全程时效稳定在 15-25 天，绝不让货在阿拉木图待销毁区或海关仓库望洋兴叹。",
          icon: "Scale"
        },
        {
          title: "纯正单证防线",
          desc: "强制实行“英文随货走、中文留底”的双套单证策略，提单收货人信息与清关文件 100% 字节对齐，阻断因拼写错误导致的高额仓储费（120美金/天）。",
          icon: "FileText"
        },
        {
          title: "关税盲区提示",
          desc: "反直觉警告！中国与 EAEU 之间无自贸协定优惠，原产地证仅证明产地，DDNZ严格按最惠国税率（TN VED）为您精准核算利润。",
          icon: "Search"
        }
      ],
      multimodalTable: [
        {
          mode: "✈️ 空运服务 (Air Freight Express)",
          days: "3 - 7 天",
          suitability: "适合高货值、样品、紧急电子配件及高精密仪器等时效敏感型货物。",
          sellingPoint: "直飞阿拉木图 (ALA) 机场，拥有独立海关通关绿色通道，最快时效清关保障。",
          warning: "受民航局严苛安检限制，纯锂电池、大容量液体、精细粉末等货物需提前做磁检鉴定。"
        },
        {
          mode: "🚚 跨境公路卡航 (卡航专线 - 甩挂模式)",
          days: "5 - 12 天",
          suitability: "对5吨左右的小批量货量极为友好。时效灵活，比按集装箱计费的铁路班列更具性价比与操作弹性。",
          sellingPoint: "核心技术卖点：采用先进的‘甩挂运输’模式。在国内口岸仅更换牵引车头，挂车直接出境，全程不开箱、不掏箱。极大提升易碎品、高品质包装货物在途安全度。",
          warning: "中亚交警对公路卡车轴重限制极严。由 DDNZ 规划精准的“装车配载图”合规装载，彻底免去卡航在途被警察开具天价超重罚单的隐性雷区。"
        },
        {
          mode: "🚂 中欧班列 / 铁路大宗 (Rail Freight)",
          days: "6 - 20 天",
          suitability: "适合重型机械、大宗原材料、建材、及全箱货（FCL）。",
          sellingPoint: "连云港/乌鲁木齐至阿拉木图（6-14天），华南至努尔苏丹/阿斯塔纳（~20天）。平均整箱货时效15-20天，是海铁多式联运最具性价比的中流砥柱。",
          warning: "由于中国标准轨 (1435mm) 与哈国宽轨 (1520mm) 轨距不同，货物必须在霍尔果斯等边境口岸执行“边境物理换装”，换轨吊装耗时 1-3 天。DDNZ 驻点口岸团队现场监控换装，防范恶劣天气滞港。"
        },
        {
          mode: "📦 电商小包与邮政 EMS (E-commerce Packet)",
          days: "5 - 18 天",
          suitability: "适用于小体积跨境电商件、个人散货包裹及轻量消费品。",
          sellingPoint: "自营电商小包专线平均 5-7 天送达；低货值产品可做集中申报以减免部分进口关税。",
          warning: "邮政 EMS 普邮时效在 15-18 天左右，且严禁携带液体、粉末、非原装锂电池。"
        }
      ],
      faqs: [
        {
          q: "哈萨克斯坦的 EAEU 清关有什么难点？",
          a: "由于哈萨克斯坦是欧亚经济联盟（EAEU）成员国，其关税政策与俄罗斯、白俄罗斯高度绑定。清关的核心在于商检证书（如 TR CU 认证）的完备性与 TN VED（哈国海关编码）的精准归类。DDNZ 拥有专业的商检审单团队，确保单证与货物 100% 字节对齐，规避高额罚款或扣关风险。"
        },
        {
          q: "1520mm 宽轨换装是如何影响货运时效的？",
          a: "中国铁路使用 1435mm 标准轨，而哈国和中亚使用 1520mm 宽轨。因此班列到达边境口岸（阿拉山口/霍尔果斯）时必须进行物理“换装”（即用吊车将集装箱换到宽轨列车上）。在货运旺季，换装口岸常因拥堵导致货物延滞。DDNZ 驻扎口岸的操作团队可实时协调吊装排期，保障换装不压车，时效锁定在 15-25 天。"
        },
        {
          q: "提供中国原产地证（CO）可以享受哈萨克斯坦关税减免吗？",
          a: "不行。中国与哈萨克斯坦（及整个 EAEU）目前没有签署双边自贸协定（FTA）。原产地证（CO）只能证明货物产自中国，但无法用于直接减免关税，海关会严格按最惠国税率（MFN）征税。DDNZ 航线专家会在出货前根据 TN VED 编码为您测算最真实的到岸税费，绝不含糊。"
        }
      ]
    }
  },
  uzbekistan: {
    en: {
      seoTitle: "Multimodal Rail & Direct Trucking to Uzbekistan | DDNZ Global",
      seoDesc: "Direct highway trucking & multimodal rail to Tashkent, Uzbekistan. Complete GOST-UZ conformity, online pre-declarations, and CIF 'tax-on-tax' optimization since 1999.",
      headline: "Direct Multimodal Rail & Trucking to Uzbekistan | 100% Digital Pre-Declaration Support",
      subheadline: "Direct intermodal pathways to Tashkent and key industrial grids. Solving GOST-UZ certifications, complying with the 1-hour pre-declaration redline, and optimizing CIF valuation structures to bypass tax traps.",
      transitWindow: "⏱️ Uzbekistan Transit Windows",
      transitDays: "18 - 28 Days",
      complianceRowTitle: "GOST-UZ Conformity Auditing",
      complianceRowVal: "3 - 5 Days",
      solutionsTitle: "Uzbekistan Specialized SCM Methods",
      solutionsSubtitle: "Navigating double-landlocked routing, complex VAT nesting, and strict digital declarations with expert precision.",
      solutions: [
        {
          title: "1-Hour Digital Pre-Declaration Redline",
          desc: "Uzbekistan Customs has fully upgraded to digital pre-declaration. Road/rail shipments must complete electronic document uploads at least 1 hour before arrival at the customs border, and air freight requires 2 hours. DDNZ's digital operations ensure zero delay, avoiding demurrage black holes.",
          icon: "ShieldCheck"
        },
        {
          title: "CIF Tax Nesting & Cube Optimization",
          desc: "Uzbekistan enforces taxation based on the CIF value (goods value + freight + insurance). It deducts a 12% customs duty first, and then calculates a 12% VAT based on '(CIF + Duty)'. Freight is taxed repeatedly, leading to total taxes up to 28% of the goods' value. DDNZ optimizes volume (Cube Optimization) to lower international freight costs and maximize your net profit.",
          icon: "Scale"
        },
        {
          title: "GOST-UZ & HS Code Alignment",
          desc: "Machinery, electronics, and chemical products strictly require GOST-UZ conformity certification. Cargo arriving without a certificate goes straight to destruction zones. If HS codes differ by even a single digit between origin and destination, immediate rejection and return are highly likely.",
          icon: "FileText"
        }
      ],
      multimodalTable: [
        {
          mode: "✈️ Air Freight (Express)",
          days: "4 - 8 Days",
          suitability: "Best for high-priority industrial spares, critical machinery, and premium medical supplies.",
          sellingPoint: "Direct routes from China to Tashkent (TAS) airport. Pre-clearing ensures minimal warehouse detention.",
          warning: "Taxed on full CIF value (goods + freight); minimize volumetric weight to limit excessive duty/VAT."
        },
        {
          mode: "🚚 Cross-Border Trucking (DDP Semi-Trailer Swap)",
          days: "6 - 14 Days",
          suitability: "Highly efficient for heavy equipment, valuable auto components, and time-sensitive factory cargo.",
          sellingPoint: "Direct 'trailer swap' transit via Xinjiang land ports. Tailored door-to-door delivery with certified DDP solutions. Zero cargo transfers after border crossing.",
          warning: "The 1-hour pre-declaration digital mandate requires complete documentation ready before the vehicle touches the border."
        },
        {
          mode: "🚂 Rail / Multimodal Freight (Block Train / Sea-Rail)",
          days: "14 - 28 Days",
          suitability: "Optimized for high-volume raw materials, minerals, and massive industrial production lines.",
          sellingPoint: "Scheduled rail transit from China hubs (Lianyungang, Xi'an) to Tashkent in 14-22 days, or intermodal sea-rail via Lianyungang port in 20-28 days. Stable, highly economical bulk rates.",
          warning: "Uzbekistan is double-landlocked. Subject to physical gauge changeover delays and CIF 'tax-on-tax' structures. DDNZ offers Cube Optimization to shrink overall freight costs."
        },
        {
          mode: "📦 E-commerce Packet & EMS",
          days: "7 - 22 Days",
          suitability: "Suited for retail items, consumer electronics, and lightweight individual packages.",
          sellingPoint: "Direct express packet lines to Tashkent in 7-10 days, bypassing standard custom lines.",
          warning: "Standard EMS postal option averages 18-22 days. Liquid, battery, and powder products are strictly restricted."
        }
      ],
      faqs: [
        {
          q: "What is the 1-hour digital pre-declaration rule in Uzbekistan?",
          a: "Under current Uzbek customs regulations, carriers must electronically declare and upload full shipping manifest data at least 1 hour before the cargo arrives at the highway or railway land border (or 2 hours for air). Failure to meet this window blocks the border crossing and triggers massive wait times. DDNZ handles this pre-filing digitally at the departure hub to ensure swift, non-stop entry."
        },
        {
          q: "How does the Uzbek 'CIF tax-on-tax' formula work, and how can we mitigate it?",
          a: "Uzbekistan calculates customs duty and VAT on the CIF (Cost, Insurance, Freight) value. Crucially, the 12% VAT is charged on the sum of '(CIF value + calculated customs duty)'. Because international freight is double-taxed, high shipping costs drastically inflate your tax burden. DDNZ solves this by offering cargo densification and volume optimization (Cube Optimization) at our Guangzhou warehouse to keep the ocean/rail freight component as low as possible, thereby directly shrinking your tax payout."
        },
        {
          q: "Is GOST-UZ certification mandatory for all shipments?",
          a: "No, but it is strictly mandatory for industrial equipment, household electronics, toys, and chemical products. Attempting to clear these items in Tashkent without a pre-filed GOST-UZ certificate will result in immediate cargo seizure and placing the goods in a secure customs destruction zone. DDNZ coordinates with certified Uzbek testing bodies to secure conformities before the container leaves China."
        }
      ]
    },
    zh: {
      seoTitle: "中国到乌兹别克斯坦卡航与多式联运DDP | 大递诺展 DDNZ Global",
      seoDesc: "直达乌兹别克斯坦塔什干卡航与公路/铁路多式联运专线。解决 GOST-UZ 强制性认证、CIF 叠加关税计算、到关前 1 小时线上申报等硬核货代难点。",
      headline: "中国到乌兹别克斯坦海铁联运/全公路卡航：直击乌国 GOST-UZ 认证与线上申报新规",
      subheadline: "直达塔什干与核心工业区。自营口岸卡上班车与中亚班列，全面支持到关前线上预申报，协办 GOST-UZ 认证，并提供海运/陆运全链路双清（DDP）物流托管。",
      transitWindow: "⏱️ 乌兹别克斯坦专线预计时效",
      transitDays: "18 - 28 天",
      complianceRowTitle: "乌兹别克斯坦 GOST-UZ 认证协办",
      complianceRowVal: "3 - 5 工作日",
      solutionsTitle: "乌兹别克斯坦专线特货通关方案",
      solutionsSubtitle: "针对双重内陆国（乌兹别克斯坦）极其高昂的‘重税’与商检红线，DDNZ 为您规避税费陷阱、保障到港通关时效。",
      solutions: [
        {
          title: "到关前线上申报（1小时红线）",
          desc: "乌国海关已全面升级线上申报。公路/铁路运输必须在到关前至少1小时前完成全套文件电子数据上传，空运须提前2小时。DDNZ 数字化操作链确保零延时，彻底杜绝滞港费高过运费的黑洞。",
          icon: "ShieldCheck"
        },
        {
          title: "CIF 叠加“税中税”算法规避",
          desc: "乌国强制按 CIF 价（货值+运费+保险）收税。先扣12%关税，再按“（CIF+关税）× 12%”扣增值税。运费被反复征税，税费占比高达货值 28%！DDNZ 协助做极致体积优化（Cube Optimization），从源头压低国际段运费，直接挽救您的净利润。",
          icon: "Scale"
        },
        {
          title: "GOST-UZ 认证与单证错位风控",
          desc: "机械/电子/化工类产品强制要求 GOST-UZ 认证，无证到港直接进入待销毁区。两边 HS 编码错一位大概率面临直接退运。",
          icon: "FileText"
        }
      ],
      multimodalTable: [
        {
          mode: "✈️ 空运服务 (Air Freight Express)",
          days: "4 - 8 天",
          suitability: "最适合紧急工业零配件、关键生产线替换件及高附加值医疗器械。",
          sellingPoint: "国内直飞塔什干 (TAS) 机场，协助提前申报审单，确保货物落地快速清关提货。",
          warning: "税款按照 CIF（货值+运费）计算，运费部分也将被计税，请务必优化体积重量以控制成本。"
        },
        {
          mode: "🚚 跨境公路卡航 (卡航双清专线 - 甩挂模式)",
          days: "6 - 14 天",
          suitability: "适合重型非标设备、高货值汽车零部件及有刚性交期要求的工厂普货。",
          sellingPoint: "经由新疆陆路口岸实施‘甩挂’快速过境，提供纯自营门到门 DDP 闭环专线，境外不转车不卸货，安全直达工厂。",
          warning: "海关实行‘到关前1小时预申报’红线政策，必须在车辆抵达边境前完成数据上传，严查申报拼写。"
        },
        {
          mode: "🚂 铁路大宗 / 多式联运 (Rail & Multimodal)",
          days: "14 - 28 天",
          suitability: "超大规模原材料、大型基建矿山物资、以及长周期大吨位整箱（FCL）货物。",
          sellingPoint: "中哈乌联运，中国枢纽站（西安/连运港）直达塔什干 14-22 天；连云港海铁联运至中亚 20-28 天。大宗陆运性价比极佳。",
          warning: "作为双重内陆国，铁路车皮由于口岸换装容易排队，且乌国按‘CIF 叠加关税再征增值税’。DDNZ 通过自营装车方案进行 Cube Volume 优化，能有效降低计税运费。"
        },
        {
          mode: "📦 电商小包与邮政 EMS (E-commerce Packet)",
          days: "7 - 22 天",
          suitability: "适合网购小商品、零售样版、个人自用轻便货物等。",
          sellingPoint: "塔什干绿色通道小包专线最快 7-10 天派送到门。电商小包按克计费，方便快捷。",
          warning: "普通 EMS 邮政包裹约 18-22 天，受国际邮联公约限制，严禁夹带易燃液体、粉末和裸露电池。"
        }
      ],
      faqs: [
        {
          q: "乌兹别克斯坦的‘1小时线上预申报’红线是指什么？",
          a: "乌兹别克斯坦海关规定，所有通过铁路或公路入境的货物，必须在货物抵达边境前至少1小时（空运提前2小时）在线录入完整的电子舱单与报关信息。如果在车队或班列到关时未完成申报，海关会处以巨额滞留罚款。DDNZ 采用全数字单证链，在货物国内起运时即开始预录入，保障 100% 顺利越境。"
        },
        {
          q: "什么是乌国的‘CIF税中税’陷阱？如何规避？",
          a: "乌国进口税的计算公式十分独特：先按 CIF 货值扣除约 12% 的关税，然后将‘(CIF 货值 + 关税) × 12%’计算增值税。这意味着国际运费不仅被计入了关税，还被重复计入了增值税！这导致运费越高，税负呈指数级增长。DDNZ 通过国内自营仓进行‘极致装载（Cube Optimization）’，降低空载率，帮您极力压低国际段的单吨运费，从而大幅减少终端口岸的应纳税额。"
        },
        {
          q: "所有机械产品都需要 GOST-UZ 认证吗？",
          a: "是的，乌兹别克斯坦对机械设备、电子仪器、化工纺织以及食品等目录内的产品强制实行 GOST-UZ 符合性认证。无证货物到港不仅无法报关，还会直接面临扣留并没收进入待销毁区的风险。DDNZ 在国内就可代办协助出具 GOST-UZ，让货物合规通关。"
        }
      ]
    }
  }
};

const UNIVERSAL_REDLINES = {
  en: {
    title: "Central Asia Operational Redlines & Avoid-Pitfall Guide",
    subtitle: "Absolute core guidelines to prevent surprise cargo charges, port abandonment, or road seizures in double-landlocked territories.",
    items: [
      {
        id: "01",
        title: "Say No to Gray Customs, Lock Contracts",
        desc: "Say no to '30% below market price' grey customs clearing schemes. Lock currency as USD or RMB in contracts, preventing destination agents from exploiting local currency (Som/Tenge) fluctuations or surprise fees."
      },
      {
        id: "02",
        title: "Horgos Demurrage & Axle Weight Limits",
        desc: "Explicitly lock border truck demurrage standards in logistics contracts. To counter extremely strict police inspection of axle load limits in Central Asia, DDNZ provides precise loading cargo blueprints before dispatch, strictly controlling container weight to avoid astronomical roadside fines."
      },
      {
        id: "03",
        title: "True Door-to-Door DDP/DDU Solutions",
        desc: "Precisely define the delivery boundaries. Refuse fake door-to-door schemes where trucks park outside the city limits, forcing clients to rent their own forklifts and local transport."
      }
    ]
  },
  zh: {
    title: "中亚跨境货代避坑指南与操作红线",
    subtitle: "由二十年口岸庄家死磕梳理，拒绝运费黑洞与境外天价罚单，保障双清安全通关。",
    items: [
      {
        id: "01",
        title: "拒绝灰关，锁定结算合同",
        desc: "坚决不碰“比市场价低30%”的灰关裸奔报价。合同内一律锁定美元或人民币结算，严禁目的港清关行按当地索姆变相收割。"
      },
      {
        id: "02",
        title: "新疆口岸压车费与境外轴限限重雷区",
        desc: "卡航合同内明文锁定口岸压车费标准。针对中亚境外路政极严的“轴限/隐形限重”检查，出货前由 DDNZ 官方提供精准的“装车配载图”，严控20尺/40尺柜重，杜绝境外天价罚款。"
      },
      {
        id: "03",
        title: "派送真到门（门到门 DDP/DDU 铁律）",
        desc: "明确界定目的港派送边界，拒绝公路卡航车停在市区外、让客户自己找吊车叉车卸货的“假到门”骗局。DDNZ 保障全程直达库房或厂区。"
      }
    ]
  }
};

const PAGE_LANG_DATA: Record<string, Record<string, any>> = {
  en: {
    heroTag: "📍 CHINA ➔ CENTRAL ASIA SCM SPECIALIST",
    heroCta: "Get Free Route & Tariff Analysis",
    insureText: "⭐ 29+ Years Expertise · Silk Road Rail & Road Expert",
    insightTag: "Border Operational Notice",
    insightTitle: "Horgos & Alashankou Gauge Reloading: Standard to Russian Broad Gauge",
    insightContent: "Central Asia utilizes a 1520mm broad gauge railway system, while China relies on a 1435mm standard gauge. This physical infrastructure difference requires all block trains to reload containers onto Russian flatcars at border ports (primarily Horgos & Alashankou). During seasonal congestions, containers can get stuck for weeks. DDNZ maintains on-site operations directly at the border to lock priority reloading allocations and secure trucking backups (cross-border trucking) for our SME clients.",
    faqHeading: "Central Asia Clearance Checklist & FAQ",
    faqSubheading: "Proactive compliance checks to keep your cargo moving securely through Kazakhstan & Uzbekistan customs entry corridors.",
    formTitle: "Instant Central Asia Shipping Inquiry",
    formSub: "Submit your cargo details below. Our route experts will generate a custom rate card within 2 hours.",
    formLabelName: "Your Name",
    formLabelEmail: "Email Address",
    formLabelPhone: "WhatsApp / Phone",
    formLabelGoods: "Type of Goods / Volume",
    formLabelDest: "Destination",
    formCta: "Calculate My Shipping Tariff",
    formSuccess: "Thank you! Our Central Asia logistics manager has received your details and will contact you via WhatsApp/Email shortly."
  },
  zh: {
    heroTag: "📍 中国 ➔ 中亚五国跨境物流老庄",
    heroCta: "获取免费航线及税费分析",
    insureText: "⭐ 29年跨境货代经验 · 丝绸之路卡航与班列老庄",
    insightTag: "口岸边境换轨通报",
    insightTitle: "硬核科普：1435mm 标准轨 ➔ 1520mm 宽轨物理大换装",
    insightContent: "由于中亚五国与俄罗斯均采用 1520mm 宽轨，而中国境内使用的是 1435mm 标准轨，因此班列运行到新疆口岸（霍尔果斯/阿拉山口）时必须进行物理‘换轨换装’（通过口岸吊装龙门吊将集装箱整体吊换至哈方的宽轨列车上）。在货运旺季，口岸换装常因拥堵导致集装箱滞留。DDNZ 口岸操作团队常驻新疆霍尔果斯，保障换轨优先吊装，时效远优于同行。",
    faqHeading: "中亚清关合规与常见问题",
    faqSubheading: "提前排查中哈、中乌陆路和铁路口岸通关红线，确保大货安全顺利通关。",
    formTitle: "中亚物流专线专属询价",
    formSub: "请填写下方货物信息，我们的中亚航线经理将在2小时内为您制定最省钱的运输排舱方案。",
    formLabelName: "您的姓名",
    formLabelEmail: "电子邮箱",
    formLabelPhone: "联系电话 / 微信 / WhatsApp",
    formLabelGoods: "货物类型 / 件数 / 重量体积",
    formLabelDest: "目的国",
    formCta: "提交询价，锁定专属运价",
    formSuccess: "提交成功！我们的中亚项目经理已收到您的信息，我们将立即通过电话/微信/Email联系您。"
  }
};

export default function ShippingCentralAsia() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const [selectedCountry, setSelectedCountry] = useState<'kazakhstan' | 'uzbekistan'>('kazakhstan');
  const [isLocked, setIsLocked] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTransportMode, setActiveTransportMode] = useState<number>(0);

  // Sync state with query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const countryParam = params.get('country') || params.get('dest');
    const lockParam = params.get('lock') === 'true' || params.get('locked') === 'true' || params.get('lockCountry') === 'true';
    setIsLocked(lockParam);

    if (countryParam) {
      if (countryParam.toLowerCase() === 'uzbekistan') {
        setSelectedCountry('uzbekistan');
      } else {
        setSelectedCountry('kazakhstan');
      }
    }
  }, [location.search]);

  // Reset active transport mode when country changes to avoid index out of bounds
  useEffect(() => {
    setActiveTransportMode(0);
  }, [selectedCountry]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('page_view', { path: '/shipping-from-china-to-central-asia', country: selectedCountry });
  }, [location.pathname, selectedCountry]);

  const handleCountryTabChange = (country: 'kazakhstan' | 'uzbekistan') => {
    setSelectedCountry(country);
    navigate(`?country=${country}`, { replace: true });
  };

  const activeLang = language === 'zh' ? 'zh' : 'en';
  
  const spec = CENTRAL_ASIA_DATA[selectedCountry][activeLang];
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
      case 'Scale': return <Scale className="w-5 h-5 text-[#FF8A00] shrink-0" />;
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
    destination: 'Kazakhstan'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      destination: selectedCountry === 'kazakhstan' 
        ? (language === 'zh' ? '哈萨克斯坦' : 'Kazakhstan') 
        : (language === 'zh' ? '乌兹别克斯坦' : 'Uzbekistan')
    }));
  }, [selectedCountry, language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    trackEvent('central_asia_quote_submit', { ...formData, selectedCountry });

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

  const redlines = UNIVERSAL_REDLINES[activeLang];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A051B] to-[#120A2A] text-white font-sans overflow-x-hidden">
      <SEO title={spec.seoTitle} description={spec.seoDesc} />
      
      <Navbar />

      <main className="pt-20 md:pt-24">
        
        {/* Section 1: Hero Segment */}
        <section className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
          {/* Visual shipping backdrop layer */}
          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000" 
              alt="Central Asia Railway Port"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Dark Purple Gradient Cover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A051B] via-[#0A051B]/80 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 md:py-24">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 pb-16">
              
              {/* 左侧文案区：占据 7 列 */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-black tracking-widest uppercase self-start">
                    <span>{t('heroTag')}</span>
                  </div>
                  
                  {/* Dynamic Country Selector Tabs */}
                  {!isLocked && (
                    <div className="flex flex-wrap gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.08] max-w-fit">
                      {(['kazakhstan', 'uzbekistan'] as const).map((country) => {
                        const isActive = selectedCountry === country;
                        const label = country === 'kazakhstan' 
                          ? (language === 'zh' ? '🇰🇿 哈萨克斯坦' : '🇰🇿 Kazakhstan') 
                          : (language === 'zh' ? '🇺🇿 乌兹别克斯坦' : '🇺🇿 Uzbekistan');
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
                    {spec.headline}
                  </span>
                </h1>
                
                <div className="space-y-4">
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                    {spec.subheadline}
                  </p>
                  
                  {/* Premium Micro-Badges / Key SCM Highlights */}
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {language === 'zh' ? '100% 官方合规申报' : '100% Compliant Filing'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF8A00]/10 border border-[#FF8A00]/20 text-xs font-bold text-[#FF8A00]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]"></span>
                      {language === 'zh' ? '自营口岸换装团队' : 'On-Site Port Offices'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
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
                    className="px-6 py-3.5 bg-gradient-to-r from-[#FF8A00] to-[#ff9f24] hover:from-[#e07a00] hover:to-[#ff8a00] text-white font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300 flex items-center gap-2"
                  >
                    <span>{t('heroCta')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-6 pt-6 border-t border-white/[0.08] max-w-lg">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#4B27B1] border-2 border-[#0A051B] flex items-center justify-center text-[10px] font-bold text-white">KZ</div>
                    <div className="w-8 h-8 rounded-full bg-[#FF8A00] border-2 border-[#0A051B] flex items-center justify-center text-[10px] font-bold text-white">UZ</div>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    {t('insureText')}
                  </p>
                </div>
              </div>

              {/* 右侧硬核时效侧边栏：占据 5 列 */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-lg font-black tracking-wide text-[#FF8A00] uppercase mb-2">
                  Central Asia Express Transit Windows
                </h3>
                
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-5 rounded-2xl flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-black text-white">Almaty Block Train (Horgos Border)</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Direct Broad Gauge 1520mm Rail</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-sm font-extrabold text-[#FF8A00] whitespace-nowrap">⏱️ 12 - 15 Days</span>
                  </div>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-5 rounded-2xl flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-black text-white">Tashkent Cross-Border Trucking</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Rapid Highway Transit via Alashankou</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-sm font-extrabold text-[#FF8A00] whitespace-nowrap">⏱️ 15 - 18 Days</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 2: Border Operational Reality Update (Market Insight Box) */}
        <section className="py-12 bg-[#0E0726] border-y border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white/[0.02] rounded-2xl border-l-8 border-[#FF8A00] p-6 md:p-8 shadow-md border border-white/[0.08]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#FF8A00]/10 text-[#FF8A00]">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] tracking-widest font-black uppercase text-[#FF8A00]">
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
                <span>⭐ DDNZ Global Logistics Insight Portfolio</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]" />
                <span>2026</span>
              </div>
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
                {language === 'zh' ? '中亚多式联运全通道时效数据表' : 'Central Asia Multimodal Lead-Time Matrix'}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-6" />
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
                        className="px-5 py-2.5 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] hover:opacity-90 text-white text-xs font-black tracking-widest uppercase rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-500/10 active:scale-95 transition-all self-start sm:self-center"
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
              <span className="px-3 py-1 bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                {selectedCountry === 'kazakhstan' ? (language === 'zh' ? '哈萨克斯坦合规' : 'Kazakhstan Compliance') : (language === 'zh' ? '乌兹别克斯坦合规' : 'Uzbekistan Compliance')}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-4">
                {spec.solutionsTitle}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-sm sm:text-base font-medium">
                {spec.solutionsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {spec.solutions.map((item, idx) => (
                <div key={idx} className="bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.04] flex flex-col justify-between group">
                  <div>
                    <div className="bg-[#FF8A00]/10 p-3 rounded-xl inline-block mb-4">
                      {getIcon(item.icon)}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      {item.desc}
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

        {/* Section 4: Universal Avoid-Pitfall / Operation Redlines (Persistent Bottom Section) */}
        <section className="py-16 md:py-24 border-b border-white/[0.05] bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="px-3 py-1 bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                {language === 'zh' ? '避坑指南' : 'SCM Redlines'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                {redlines.title}
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-6" />
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
                  <div className="flex items-center gap-2 text-[#FF8A00] font-black mb-4 text-sm sm:text-base">
                    <ShieldAlert className="w-6 h-6 text-[#FF8A00] flex-shrink-0" />
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
              <div className="w-10 h-1 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-6" />
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
        <section id="central-asia-quote-form" className="py-16 md:py-24 border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/[0.03] backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/[0.08] dark-form-container">
              <GetAQuote
                presetDestination={
                  selectedCountry === 'kazakhstan'
                    ? (language === 'zh' ? '哈萨克斯坦' : 'Kazakhstan')
                    : (language === 'zh' ? '乌兹别克斯坦' : 'Uzbekistan')
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
