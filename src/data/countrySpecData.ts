import fr from './countrySpec.fr.json';
import ru from './countrySpec.ru.json';
import es from './countrySpec.es.json';
import ar from './countrySpec.ar.json';
export const COUNTRY_SPEC_DATA: Record<
  'Saudi-Arabia' | 'UAE' | 'Kuwait',
  Record<string, {
    specTitle: string;
    specSub: string;
    tab1Title: string;
    tab1Header: string;
    tab1Desc: string;
    tab2Title: string;
    tab2Header: string;
    tab2Desc: string;
    redlinesTitle: string;
    redlines: Array<{ id: string; title: string; desc: string }>;
    guideTitle: string;
    guideSub: string;
    guideCards: Array<{ title: string; desc: string }>;
  }>
> = {
  'Saudi-Arabia': {
    zh: {
      specTitle: "沙特 SABER 产品与装运文件核对",
      specSub: "对受管制产品，进口商通常需要通过 SABER 完成适用的产品或装运合规程序；具体要求应按 HS 编码、产品类别与当前规则确认。",
      tab1Title: "产品证书（PC）",
      tab1Header: "SABER PC：产品文件核对",
      tab1Desc: "适用范围、所需测试报告、有效期和处理周期会随产品类别及当前 SABER 规则而变化。请由进口商或合格机构确认该产品是否需要 PC 及后续装运文件。",
      tab2Title: "装运证书（SC）",
      tab2Header: "SABER SC：装运文件核对",
      tab2Desc: "如适用，装运文件通常需要与商业发票、装箱单及产品合规资料保持一致。请在订舱前确认进口商、产品和装运批次所需文件。",
      redlinesTitle: "发往沙特前的 5 项文件核对",
      redlines: [
        { id: "①", title: "SABER 装运文件", desc: "如产品适用 SABER，请在订舱前由进口商或合格机构确认 PC、SC 及装运文件的适用性和完成节点，并预留目的港操作时间。" },
        { id: "②", title: "原产地与产品标识", desc: "原产地、标签和包装要求会因货物类别而异。应按适用法规和进口商要求，在出运前核对标识方式与商业文件的一致性。" },
        { id: "③", title: "阿拉伯语信息与说明书", desc: "部分消费品和受监管产品可能需要阿拉伯语或双语标签、警示或说明书。请按产品类别及现行目的地要求提前确认。" },
        { id: "④", title: "SFDA 受监管产品", desc: "食品、化妆品、医疗器械及相关受监管产品可能涉及 SFDA 程序。请由进口商在订舱前确认产品准入和文件要求。" },
        { id: "⑤", title: "SASO 能效与产品规则", desc: "制冷、空调、照明等产品可能适用能效或产品合规要求。请按 HS 编码、产品规格和最新目的地规则进行核对。" }
      ],
      guideTitle: "沙特专线物流实战操作守则",
      guideSub: "订舱前核对文件、包装和交付安排，并确认各环节责任。",
      guideCards: [
        {
          title: "订舱审单与清关资料",
          desc: "确认提单、商业发票、装箱单与进口商信息及适用的 SABER 文件一致。品牌货、受监管货物及高价值货物应在订舱前完成资料预审。"
        },
        {
          title: "原产地与木包装熏蒸",
          desc: "根据货物与包装核对原产地信息和木质包装要求。木质包装通常需符合适用的检疫及承运要求，相关文件应在出运前准备齐全。"
        },
        {
          title: "物流防损与节日提前规划",
          desc: "中国至吉达的海运请参考已订舱的承运人船期。装柜可留存空箱、装载过程和封条照片；斋月、开斋节、宰牲节和旺季前应为文件、港口操作与目的地派送预留缓冲时间。"
        }
      ]
    },
    en: {
      specTitle: "Saudi Arabia: SABER product and shipment documents",
      specSub: "For regulated products, importers may need to complete the applicable product or shipment conformity process through SABER. Requirements should be confirmed by HS code, product category and the current rule set.",
      tab1Title: "Product Certificate (PC)",
      tab1Header: "SABER PC: product documentation",
      tab1Desc: "Scope, test reports, validity and processing time vary by product category and the current SABER rules. Confirm with the importer or a qualified provider whether a PC and subsequent shipment documents apply.",
      tab2Title: "Shipment Certificate (SC)",
      tab2Header: "SABER SC: shipment documentation",
      tab2Desc: "Where applicable, shipment documentation should align with the commercial invoice, packing list and product-conformity records. Confirm the documentation needed for the importer, product and shipment before booking.",
      redlinesTitle: "Five checks before shipping to Saudi Arabia",
      redlines: [
        { id: "①", title: "SABER Shipment Documents", desc: "Where SABER applies, confirm with the importer or qualified provider which PC, SC and shipment documents are required, and complete the review before booking." },
        { id: "②", title: "Origin & Product Marking", desc: "Origin, label and packaging requirements vary by product category. Verify the required marking method and its consistency with commercial documents before shipment." },
        { id: "③", title: "Arabic Information & Manuals", desc: "Some consumer and regulated products may require Arabic or bilingual labels, warnings or instructions. Confirm against the product category and current destination requirements." },
        { id: "④", title: "SFDA-Regulated Products", desc: "Food, cosmetics, medical devices and related regulated products may involve SFDA procedures. The importer should confirm product admission and documentation before booking." },
        { id: "⑤", title: "SASO Energy & Product Rules", desc: "Refrigeration, air conditioning and lighting products may be subject to energy-efficiency or product-conformity requirements. Check by HS code, product specification and current destination rule." }
      ],
      guideTitle: "Saudi Arabia Logistics Practical Guide",
      guideSub: "Confirm documents, packing and delivery responsibilities before booking.",
      guideCards: [
        {
          title: "Booking & Documentation Validation",
          desc: "Align the bill of lading, commercial invoice and packing list with importer information and any applicable SABER documents. Brand, regulated and high-value cargo should be pre-reviewed before booking."
        },
        {
          title: "Made in China & Wood Fumigation",
          desc: "Check origin information and wood-packaging requirements against the cargo and packaging used. Wood packaging generally needs to meet the applicable phytosanitary and carrier requirements before departure."
        },
        {
          title: "Transit Delay & Holiday Schedules",
          desc: "Use the booked carrier schedule for China–Jeddah sea transit. Keep photos of the empty container, loading process and seal; allow buffer time for documents, port operations and destination delivery around Ramadan, Eid and peak seasons."
        }
      ]
    },
    ru: ru['Saudi-Arabia'],
    fr: fr['Saudi-Arabia']
  },
  'UAE': {
    zh: {
      specTitle: "阿联酋特殊货物与交付准备",
      specSub: "发往迪拜或杰贝阿里，先核对产品特征、电池信息及收货地点，再确认适用的运输与交付方案。",
      tab1Title: "重货与项目货",
      tab1Header: "核对适用的运输设备",
      tab1Desc: "提供尺寸、重量、吊点及搬运限制。框架柜或开顶柜方案须由承运人审核确认。",
      tab2Title: "杰贝阿里自贸区（JAFZA）",
      tab2Header: "确认自贸区交接范围",
      tab2Desc: "提供收货主体、仓库及所需操作，逐票确认适用程序和税费处理；自贸区地址本身不构成免税保证。",
      redlinesTitle: "发往阿联酋前的 5 项核对",
      redlines: [
        { id: "①", title: "原产地与产品标识", desc: "进口产品的标识、原产地信息及文件要求应按产品类别、进口商和现行规则确认，并与商业文件保持一致。" },
        { id: "②", title: "新能源与危险品（DG）申报", desc: "锂电池、含电池设备及其他受限货物应按承运人、航空/海运法规和目的地要求进行危险品或敏感货预审；所需测试和安全文件因货物而异。" },
        { id: "③", title: "本地陆运载重规划", desc: "末端陆运需要按集装箱、车辆、路线和当地法规核对重量与尺寸。超限货或项目货应在订舱前确认运输方案。" },
        { id: "④", title: "电商仓入仓要求", desc: "Amazon FBA、Noon 及其他目的仓库的托盘、标签、外箱和预约要求各不相同。请按实际入仓仓库的最新版规范准备。" },
        { id: "⑤", title: "HS 编码与申报一致性", desc: "商业发票、装箱单、HS 编码和货物描述应真实、完整且相互一致。品牌货和受监管货物应在出运前做资料核对。" }
      ],
      guideTitle: "阿联酋操作守则与本地配送指南",
      guideSub: "逐票明确目的地操作及各环节责任。",
      guideCards: [
        {
          title: "清关资料与提货单核对",
          desc: "清关周期取决于货物、进口商、文件和目的地程序。提货单（D/O）应准确显示收货人；如需目的地清关或派送支持，请在订舱前书面确认服务范围。"
        },
        {
          title: "海运特种加固与危险品舱位",
          desc: "电池、超限设备和其他特殊货物应按承运人、包装标准及危险品规则评估加固和舱位要求；适用的文件与装载方案应在订舱前确认。"
        },
        {
          title: "最后一公里派送与节假日规划",
          desc: "中国至迪拜的海运应以已订舱船期为准；在会展、斋月和节假日附近安排派送时，应为目的港操作与末端配送预留缓冲时间。"
        }
      ]
    },
    en: {
      specTitle: "UAE special cargo and delivery planning",
      specSub: "For Dubai or Jebel Ali, review product details, any batteries and the receiving point before selecting a service.",
      tab1Title: "Special Project & Bulk Cargo",
      tab1Header: "Assess the transport equipment required",
      tab1Desc: "Provide dimensions, weight, lifting points and handling limits. Flat-rack or open-top equipment depends on carrier review and acceptance.",
      tab2Title: "Free Zone (JAFZA) Logistics",
      tab2Header: "Confirm the free-zone handover",
      tab2Desc: "Identify the consignee, warehouse and requested operations. Confirm the applicable procedures and tax treatment; a free-zone address alone does not guarantee an exemption.",
      redlinesTitle: "Five checks before shipping to the UAE",
      redlines: [
        { id: "①", title: "Origin & Product Marking", desc: "Product marking, origin information and document requirements should be confirmed by product category, importer and current rules, and kept consistent with commercial documents." },
        { id: "②", title: "New Energy & Dangerous Goods (DG)", desc: "Lithium batteries, battery-containing equipment and other restricted cargo need carrier, transport-regulation and destination pre-review. Required tests and safety documents vary by cargo." },
        { id: "③", title: "Local Trucking Weight Planning", desc: "Final-mile trucking should be planned against the container, vehicle, route and local requirements. Confirm a solution before booking for over-dimensional or project cargo." },
        { id: "④", title: "E-commerce Warehouse Requirements", desc: "Pallet, label, carton and appointment requirements differ by Amazon FBA, Noon and other destination warehouses. Prepare against the latest requirements of the receiving facility." },
        { id: "⑤", title: "HS Code & Declaration Consistency", desc: "Keep the commercial invoice, packing list, HS code and cargo description accurate and consistent. Brand and regulated cargo should be reviewed before shipment." }
      ],
      guideTitle: "UAE Operational Codes & Last-Mile Delivery",
      guideSub: "Confirm local operations and responsibilities for each shipment.",
      guideCards: [
        {
          title: "Clearance Documents & Delivery Orders",
          desc: "Clearance timing depends on the cargo, importer, documents and destination procedure. Ensure the Delivery Order (D/O) states the correct consignee and confirm the agreed clearance scope before booking."
        },
        {
          title: "DG Rigging & Flat Rack Reinforcement",
          desc: "Assess battery, oversized and other special cargo against carrier, packaging and dangerous-goods rules. Confirm the applicable documentation, lashing and stowage plan before booking."
        },
        {
          title: "GCC Distribution & Seasonal Holidays",
          desc: "Use the booked carrier schedule for China–Dubai sea transit. Allow buffer time for destination handling and local delivery around major exhibitions, Ramadan and public holidays."
        }
      ]
    },
    ru: ru['UAE'],
    fr: fr['UAE']
  },
  'Kuwait': {
    zh: {
      specTitle: "科威特 KUCAS/TABEK 合规与出运规划",
      specSub: "科威特受监管产品可通过 KUCAS/TABEK 体系办理适用的技术评估、检验或放行程序。是否适用及所需资料应按 HS 编码、产品类别与现行规则由进口商确认。",
      tab1Title: "技术评估（TER）",
      tab1Header: "技术评估证书 - 用于后续同类产品申报",
      tab1Desc: "科威特公共工业管理局可依据进口商已取得的符合性证书签发技术评估证书，供同一产品后续海关申报使用。所需资料、适用范围和有效性请按当前产品规则确认。",
      tab2Title: "技术检验（TIR）",
      tab2Header: "TIR 技术检验报告与放行申请",
      tab2Desc: "如产品适用 TIR 放行程序，进口商通常需提交海关申报信息、TIR 信息、产品信息及规定承诺，并通过平台跟踪申请。是否需要起运前检验、测试或标签核对取决于产品和适用法规。",
      redlinesTitle: "科威特出运前 5 项核对",
      redlines: [
        { id: "①", title: "确认产品是否受监管", desc: "按 HS 编码、产品类别及当前 KUCAS/TABEK 规则，确认是否需要符合性证书、技术评估、检验或其他主管部门文件。" },
        { id: "②", title: "文件与申报信息一致", desc: "商业发票、装箱单、提单、产品说明及进口商信息应相互一致，并与适用的符合性资料相符。" },
        { id: "③", title: "标签、说明与技术参数", desc: "电器、儿童用品、建材、节水产品等可能适用专项技术要求。请由进口商确认标签语言、插头、电压、能效或说明书要求。" },
        { id: "④", title: "原产地与受限货物", desc: "科威特海关要求进口货物具备清晰原产地信息；禁止或限制品、危险品及品牌货应在订舱前确认主管部门许可和承运人接收条件。" },
        { id: "⑤", title: "包装、重量与目的地操作", desc: "木质包装、集装箱重量、危险品包装和本地运输限制应按货物、承运人及目的地操作要求确认。" }
      ],
      guideTitle: "科威特出运操作清单",
      guideSub: "围绕产品合规、文件、承运人与目的地操作的实用核对。",
      guideCards: [
        {
          title: "订舱前：产品与服务范围",
          desc: "确认货物是否受监管、进口商主体、申报方式、税费责任及目的地清关/派送范围；危险品、品牌货和受限品应先确认承运人接收条件。"
        },
        {
          title: "出运前：文件与包装核对",
          desc: "与进口商核对收货人信息、商业文件、产品资料及适用的主管部门文件；木质包装和特殊包装应按目的地与承运人要求处理。"
        },
        {
          title: "在途与到港：时效和交付规划",
          desc: "将页面的常规时效作为计划参考，并为旺季、班期调整、查验、节假日和目的地派送预留缓冲时间。装柜照片、封条和装箱记录有助于货况追溯。"
        }
      ]
    },
    en: {
      specTitle: "Kuwait KUCAS/TABEK Compliance & Shipment Planning",
      specSub: "Regulated products may use the KUCAS/TABEK system for applicable technical evaluation, inspection or release procedures. The importer should confirm applicability and documentation by HS code, product category and current rules.",
      tab1Title: "TER Technical Evaluation (Product Registration)",
      tab1Header: "Technical Evaluation Certificate — for later declarations of the same product",
      tab1Desc: "The Public Authority for Industry may issue a technical evaluation certificate based on a conformity certificate already obtained by the importer, for later customs declarations of the same product. Confirm documents, scope and validity under the current product rules.",
      tab2Title: "TIR Technical Inspection (Batch Clearance)",
      tab2Header: "TIR Technical Inspection Report & release application",
      tab2Desc: "Where a TIR-based release procedure applies, the importer normally submits customs-declaration details, TIR details, product information and prescribed undertakings, then tracks the request in the platform. Pre-shipment inspection, testing and label checks depend on the product and applicable regulation.",
      redlinesTitle: "Five Kuwait pre-shipment checks",
      redlines: [
        { id: "①", title: "Confirm whether the product is regulated", desc: "Use the HS code, product category and current KUCAS/TABEK rules to confirm whether a conformity certificate, technical evaluation, inspection or another authority document is needed." },
        { id: "②", title: "Keep documents and declarations consistent", desc: "Commercial invoice, packing list, bill of lading, product information and importer details should align with each other and with applicable conformity records." },
        { id: "③", title: "Labels, manuals and technical specifications", desc: "Electrical goods, toys, construction materials and water-conservation products can have product-specific rules. Have the importer confirm language, plug, voltage, energy-label or manual requirements." },
        { id: "④", title: "Origin and restricted goods", desc: "Kuwait Customs requires clear country-of-origin information for imports. Confirm permits and carrier acceptance before booking prohibited or restricted goods, dangerous goods and branded cargo." },
        { id: "⑤", title: "Packing, weight and destination operations", desc: "Confirm wood packing, container weight, dangerous-goods packing and inland transport constraints for the cargo, carrier and destination operation." }
      ],
      guideTitle: "Kuwait Shipment Planning Checklist",
      guideSub: "Practical checks for product compliance, documentation, carrier acceptance and destination operations.",
      guideCards: [
        {
          title: "Before booking: product and service scope",
          desc: "Confirm whether cargo is regulated, the importer entity, declaration method, tax responsibility and destination clearance/delivery scope. Check carrier acceptance first for dangerous, branded or restricted goods."
        },
        {
          title: "Before departure: documents and packing",
          desc: "Review consignee details, commercial documents, product information and applicable authority documents with the importer. Prepare wood and special packing according to destination and carrier requirements."
        },
        {
          title: "In transit and arrival: timing and delivery",
          desc: "Use the itinerary confirmed for this shipment and allow time for inspection, holidays and local delivery. Keep loading photos, seal details and packing records to track cargo condition."
        }
      ]
    },
    ru: ru['Kuwait'],
    fr: fr['Kuwait']
  }
};

for (const country of ['Saudi-Arabia','UAE','Kuwait'] as const) {COUNTRY_SPEC_DATA[country].es=es[country];COUNTRY_SPEC_DATA[country].ar=ar[country];}
