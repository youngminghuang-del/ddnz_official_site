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
      specTitle: "沙特 SABER 认证合规保障体系",
      specSub: "对受管制产品，进口商通常需要通过 SABER 完成适用的产品或装运合规程序；具体要求应按 HS 编码、产品类别与当前规则确认。",
      tab1Title: "Product Certificate (PC) 产品证书",
      tab1Header: "SABER PC 证书 - 针对具体品类长期备案",
      tab1Desc: "适用范围、所需测试报告、有效期和处理周期会随产品类别及当前 SABER 规则而变化。请由进口商或合格机构确认该产品是否需要 PC 及后续装运文件。",
      tab2Title: "Shipment Certificate (SC) 批次证书",
      tab2Header: "SABER SC 证书 - 针对单批次出货清关",
      tab2Desc: "如适用，装运文件通常需要与商业发票、装箱单及产品合规资料保持一致。请在订舱前确认进口商、产品和装运批次所需文件。",
      redlinesTitle: "沙特海关 5 大清关红线（SABER 审单重点）",
      redlines: [
        { id: "①", title: "SABER 装运文件", desc: "如产品适用 SABER，请在订舱前由进口商或合格机构确认 PC、SC 及装运文件的适用性和完成节点，并预留目的港操作时间。" },
        { id: "②", title: "原产地与产品标识", desc: "原产地、标签和包装要求会因货物类别而异。应按适用法规和进口商要求，在出运前核对标识方式与商业文件的一致性。" },
        { id: "③", title: "阿拉伯语信息与说明书", desc: "部分消费品和受监管产品可能需要阿拉伯语或双语标签、警示或说明书。请按产品类别及现行目的地要求提前确认。" },
        { id: "④", title: "SFDA 受监管产品", desc: "食品、化妆品、医疗器械及相关受监管产品可能涉及 SFDA 程序。请由进口商在订舱前确认产品准入和文件要求。" },
        { id: "⑤", title: "SASO 能效与产品规则", desc: "制冷、空调、照明等产品可能适用能效或产品合规要求。请按 HS 编码、产品规格和最新目的地规则进行核对。" }
      ],
      guideTitle: "沙特专线物流实战操作守则",
      guideSub: "高能避坑指南，沙特专线全链路控制要点，保障货款与货物安全。",
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
      specTitle: "Saudi Arabia SABER Compliance Protection",
      specSub: "For regulated products, importers may need to complete the applicable product or shipment conformity process through SABER. Requirements should be confirmed by HS code, product category and the current rule set.",
      tab1Title: "Product Certificate (PC)",
      tab1Header: "SABER PC - Long-term Product Registration",
      tab1Desc: "Scope, test reports, validity and processing time vary by product category and the current SABER rules. Confirm with the importer or a qualified provider whether a PC and subsequent shipment documents apply.",
      tab2Title: "Shipment Certificate (SC)",
      tab2Header: "SABER SC - Single Batch Clearance Certificate",
      tab2Desc: "Where applicable, shipment documentation should align with the commercial invoice, packing list and product-conformity records. Confirm the documentation needed for the importer, product and shipment before booking.",
      redlinesTitle: "Saudi Customs 5 Major Redlines (SABER Priority)",
      redlines: [
        { id: "①", title: "SABER Shipment Documents", desc: "Where SABER applies, confirm with the importer or qualified provider which PC, SC and shipment documents are required, and complete the review before booking." },
        { id: "②", title: "Origin & Product Marking", desc: "Origin, label and packaging requirements vary by product category. Verify the required marking method and its consistency with commercial documents before shipment." },
        { id: "③", title: "Arabic Information & Manuals", desc: "Some consumer and regulated products may require Arabic or bilingual labels, warnings or instructions. Confirm against the product category and current destination requirements." },
        { id: "④", title: "SFDA-Regulated Products", desc: "Food, cosmetics, medical devices and related regulated products may involve SFDA procedures. The importer should confirm product admission and documentation before booking." },
        { id: "⑤", title: "SASO Energy & Product Rules", desc: "Refrigeration, air conditioning and lighting products may be subject to energy-efficiency or product-conformity requirements. Check by HS code, product specification and current destination rule." }
      ],
      guideTitle: "Saudi Arabia Logistics Practical Guide",
      guideSub: "Frictionless delivery protocols for reliable freight transit and clearance matching.",
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
    ru: {
      specTitle: "Система соответствия SABER в Саудовской Аравии",
      specSub: "Согласно директивам таможни и стандартов Саудовской Аравии (SASO), все подконтрольные товары должны быть зарегистрированы в системе SABER до прибытия, иначе импорт будет заблокирован!",
      tab1Title: "Product Certificate (PC)",
      tab1Header: "SABER PC - Долгосрочная регистрация продукта",
      tab1Desc: "Регистрация продукта действительна в течение 1 года для конкретной категории. Оформляется на основе протоколов испытаний за 2-4 рабочих дня. Наличие активного сертификата PC является обязательным условием для оформления SC.",
      tab2Title: "Shipment Certificate (SC)",
      tab2Header: "SABER SC - Сертификат на разовую партию груза",
      tab2Desc: "Требуется для каждой отдельной поставки. Оформляется на портале SABER после проверки инвойса, упаковочного листа и активного сертификата PC.",
      redlinesTitle: "5 критических требований таможни Саудовской Аравии",
      redlines: [
        { id: "①", title: "Сроки оформления SC", desc: "Сертификат SC должен быть активирован до прибытия судна в порт. В противном случае грозят крупные штрафы за демередж." },
        { id: "②", title: "Постоянная гравировка происхождения", desc: "На каждом изделии и коробке должна быть выгравирована или напечатана надпись 'Made in China'. Бумажные наклейки запрещены." },
        { id: "③", title: "Инструкции на арабском языке", desc: "Предупреждающие этикетки и инструкции по эксплуатации должны содержать текст на арабском или арабском/английском языках." },
        { id: "④", title: "Регистрация в SFDA", desc: "Косметика, продукты питания и медицинские товары контролируются SFDA. Требуется предварительная регистрация перед отправкой." },
        { id: "⑤", title: "Энергоэффективность SASO", desc: "Кондиционеры, холодильники и освещение должны иметь сертификаты энергоэффективности SASO. Лампы накаливания запрещены к ввозу." }
      ],
      guideTitle: "Практическое руководство по логистике в Саудовской Аравии",
      guideSub: "Инструкции для обеспечения бесперебойной доставки и комплаенса.",
      guideCards: [
        {
          title: "Проверка документов и бронирование",
          desc: "В коносаменте должен быть указан реальный налоговый номер получателя в Саудовской Аравии. Данные в инвойсе должны на 100% совпадать со сведениями в SABER."
        },
        {
          title: "Происхождение и фумигация древесины",
          desc: "Маркировка происхождения должна строго соответствовать 'Made in China'. Любая деревянная упаковка должна иметь штамп фумигации IPPC."
        },
        {
          title: "Сроки доставки и праздники",
          desc: "Транзит из Китая в Джидду занимает 18-25 дней. Сделайте 'четыре фотографии' при погрузке для фиксации состояния груза. Планируйте отправку за месяц до Ид."
        }
      ]
    },
    fr: {
      specTitle: "Protection de conformité SABER Arabie Saoudite",
      specSub: "Selon les directives de la douane saoudienne (SASO), tous les produits contrôlés exportés en Arabie Saoudite doivent être enregistrés sur le portail SABER sous peine de refus d'entrée !",
      tab1Title: "Product Certificate (PC)",
      tab1Header: "SABER PC - Enregistrement de produit à long terme",
      tab1Desc: "Enregistrement de produit valable 1 an par catégorie. Basé sur des rapports d'essais en laboratoire, délivré en 2-4 jours ouvrables. Le PC actif est la condition préalable absolue pour le Shipment Certificate (SC).",
      tab2Title: "Shipment Certificate (SC)",
      tab2Header: "SABER SC - Certificat d'expédition par lot unique",
      tab2Desc: "Requis pour chaque envoi. Délivré sur le portail SABER après validation de la facture d'expédition, de la liste de colisage et du PC actif.",
      redlinesTitle: "Douanes saoudiennes : 5 lignes rouges majeures",
      redlines: [
        { id: "①", title: "Délai SABER SC", desc: "Le SC doit être émis avant l'amarrage du navire. Sinon, la cargaison déclenchera de lourdes amendes de stockage et de retard au port." },
        { id: "②", title: "Gravure d'origine permanente", desc: "Chaque article et boîte doit porter la mention permanente 'Made in China' gravée. Les autocollants adhésifs sont interdits et passibles d'amende." },
        { id: "③", title: "Manuels et étiquettes en arabe", desc: "Les avertissements et les manuels doivent inclure du texte en arabe ou bilingue arabe/anglais sous peine de rejet immédiat." },
        { id: "④", title: "Enregistrement SFDA obligatoire", desc: "Les cosmétiques, les aliments et les produits médicaux sont contrôlés par la SFDA. Un enregistrement préalable est obligatoire." },
        { id: "⑤", title: "Étiquettes d'énergie SASO", desc: "La climatisation, la réfrigération et l'éclairage doivent détenir des étiquettes d'énergie SASO. Les lampes à incandescence sont interdites." }
      ],
      guideTitle: "Guide pratique logistique Arabie Saoudite",
      guideSub: "Protocoles d'expédition et de dédouanement rigoureux pour un transit fiable.",
      guideCards: [
        {
          title: "Vérification des documents",
          desc: "Les connaissements doivent mentionner le numéro de registre commercial réel du destinataire saoudien. Les valeurs doivent correspondre à 100% à l'enregistrement SABER."
        },
        {
          title: "Made in China & Fumigation du bois",
          desc: "L'origine déclarée doit être strictement 'Made in China'. Les emballages en bois doivent porter les tampons de fumigation IPPC sous peine de destruction immédiate."
        },
        {
          title: "Transit et planification des vacances",
          desc: "Le transit de Chine vers Djeddah est de 18-25 jours. Prenez 'quatre photos' au chargement pour éviter les litiges. Planifiez les envois 1 mois avant l'Aïd."
        }
      ]
    }
  },
  'UAE': {
    zh: {
      specTitle: "阿联酋大宗货物与新能源项目物流通途",
      specSub: "阿联酋（迪拜/杰贝阿里）作为中东首要自由贸易港，对于跨境电商（FBA/FBM）、大宗建材及新能源车辆/锂电池货品具有极高的通关效率，但也实施了严苛的产地和安全合规审查。",
      tab1Title: "Special Project & Bulk Cargo 大宗工程货物流",
      tab1Header: "特殊项目与大宗建材物流 - 针对工程建材与特种柜",
      tab1Desc: "针对大型建筑工程、钢材、新能源汽车、锂电池及机械设备出口。提供框架柜、开顶柜等特种柜订舱与加固，以及到杰贝阿里港的专业双清门到门、卸货与吊装一站式服务。",
      tab2Title: "Free Zone (JAFZA) Logistics 自由贸易区保税物流",
      tab2Header: "迪拜杰贝阿里自贸区 (JAFZA) - 免税清关转口保税",
      tab2Desc: "针对免税自贸区入仓及国际转口贸易客户。货物进入 JAFZA 自由贸易区保税仓库，可免征进口关税和增值税，提供保税仓储、贴签分拣及面向GCC海合会国家的再出口拼箱物流。",
      redlinesTitle: "阿联酋口岸 5 大严控红线（避坑要点）",
      redlines: [
        { id: "①", title: "原产地与产品标识", desc: "进口产品的标识、原产地信息及文件要求应按产品类别、进口商和现行规则确认，并与商业文件保持一致。" },
        { id: "②", title: "新能源与危险品（DG）申报", desc: "锂电池、含电池设备及其他受限货物应按承运人、航空/海运法规和目的地要求进行危险品或敏感货预审；所需测试和安全文件因货物而异。" },
        { id: "③", title: "本地陆运载重规划", desc: "末端陆运需要按集装箱、车辆、路线和当地法规核对重量与尺寸。超限货或项目货应在订舱前确认运输方案。" },
        { id: "④", title: "电商仓入仓要求", desc: "Amazon FBA、Noon 及其他目的仓库的托盘、标签、外箱和预约要求各不相同。请按实际入仓仓库的最新版规范准备。" },
        { id: "⑤", title: "HS 编码与申报一致性", desc: "商业发票、装箱单、HS 编码和货物描述应真实、完整且相互一致。品牌货和受监管货物应在出运前做资料核对。" }
      ],
      guideTitle: "阿联酋操作守则与本地配送指南",
      guideSub: "打通中东首要自由贸易港，让您的跨境出海链路高效顺畅。",
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
      specTitle: "UAE Bulk Cargo & New Energy Project Logistics Channel",
      specSub: "UAE routes via Dubai and Jebel Ali can support e-commerce, construction materials and new-energy cargo, subject to product, marking, battery-safety and destination requirements.",
      tab1Title: "Special Project & Bulk Cargo",
      tab1Header: "Project & Bulk Materials - Flat Rack & Open Top Solutions",
      tab1Desc: "Tailored for heavy machinery, structural steel, EVs, lithium batteries, and construction. Providing specialized equipment (Flat Rack, Open Top) shipping, secure rigging, and complete Jebel Ali port clearance.",
      tab2Title: "Free Zone (JAFZA) Logistics",
      tab2Header: "Jebel Ali Free Zone (JAFZA) - Duty-Free Bonded Transshipment",
      tab2Desc: "Optimized for transshipment and tax-free storage. Ship directly to JAFZA bonded warehouses to defer import tariffs and VAT, enabling cost-effective labeling, inventory split, and re-export to other GCC countries.",
      redlinesTitle: "UAE Ports 5 Critical Compliance Redlines (Crucial Points)",
      redlines: [
        { id: "①", title: "Origin & Product Marking", desc: "Product marking, origin information and document requirements should be confirmed by product category, importer and current rules, and kept consistent with commercial documents." },
        { id: "②", title: "New Energy & Dangerous Goods (DG)", desc: "Lithium batteries, battery-containing equipment and other restricted cargo need carrier, transport-regulation and destination pre-review. Required tests and safety documents vary by cargo." },
        { id: "③", title: "Local Trucking Weight Planning", desc: "Final-mile trucking should be planned against the container, vehicle, route and local requirements. Confirm a solution before booking for over-dimensional or project cargo." },
        { id: "④", title: "E-commerce Warehouse Requirements", desc: "Pallet, label, carton and appointment requirements differ by Amazon FBA, Noon and other destination warehouses. Prepare against the latest requirements of the receiving facility." },
        { id: "⑤", title: "HS Code & Declaration Consistency", desc: "Keep the commercial invoice, packing list, HS code and cargo description accurate and consistent. Brand and regulated cargo should be reviewed before shipment." }
      ],
      guideTitle: "UAE Operational Codes & Last-Mile Delivery",
      guideSub: "Accelerate your local business operations inside the Gulf's core commerce entry portal.",
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
    ru: {
      specTitle: "Логистический коридор ОАЭ для крупногабаритных и энергетических проектов",
      specSub: "ОАЭ (Дубай / Джебель-Али) является главным торговым хабом Ближнего Востока. Он предлагает быструю очистку e-commerce, строительных материалов и электромобилей, но строго контролирует маркировки и аккумуляторы.",
      tab1Title: "Special Project & Bulk Cargo",
      tab1Header: "Проектные грузы и спецтехника - Flat Rack и Open Top",
      tab1Desc: "Решения для тяжелого оборудования, стали, электромобилей, литиевых батарей и стройматериалов. Предоставление спецконтейнеров (Flat Rack, Open Top) и такелажных работ в порту Джебель-Али.",
      tab2Title: "Free Zone (JAFZA) Logistics",
      tab2Header: "Свободная зона Джебель-Али (JAFZA) - Беспошлинный транзит",
      tab2Desc: "Для транзитных грузов и беспошлинного хранения. Доставка напрямую на склады JAFZA без уплаты пошлин и НДС для переупаковки и реэкспорта в страны Персидского залива.",
      redlinesTitle: "5 критических требований таможни ОАЭ (Ключевые моменты)",
      redlines: [
        { id: "①", title: "Физическая проверка маркировок", desc: "Таможня Дубая регулярно досматривает грузы. Маркировка 'Made in China' должна быть нанесена нестираемым способом. Наклейки вызывают штрафы." },
        { id: "②", title: "Декларирование аккумуляторов и опасных грузов", desc: "Литиевые батареи, электротранспорт и солнечные панели требуют предоставления паспорта безопасности MSDS и отчетов UN38.3." },
        { id: "③", title: "Весовой контроль на дорогах", desc: "Дорожная полиция ОАЭ жестко штрафует за перегруз осей грузовиков. Нарушения ведут к разгрузке контейнера на посту и штрафам." },
        { id: "④", title: "Требования к паллетированию для маркетплейсов", desc: "Грузы для складов Amazon FBA и Noon должны быть строго паллетированы и обернуты пленкой по стандартам площадок, иначе грозит возврат." },
        { id: "⑤", title: "ИИ-анализ таможенных деклараций", desc: "Таможня Дубая использует ИИ для сверки кодов ТН ВЭД и стоимости. Занижение инвойсов ведет к задержкам и внесению в черный список." }
      ],
      guideTitle: "Правила операций и доставки в ОАЭ",
      guideSub: "Ускорьте свой бизнес на главном торговом перекрестке Ближнего Востока.",
      guideCards: [
        {
          title: "Оформление за 24 часа",
          desc: "Очистка в ОАЭ обычно занимает менее суток. Коносамент должен указывать реального получателя. В отсутствие импортной лицензии мы предоставим DDP D&D."
        },
        {
          title: "Закрепление проектных и опасных грузов",
          desc: "Крупногабаритные изделия и аккумуляторы должны крепиться в контейнерах сертифицированными стропами и брусьями по международным стандартам IMDG."
        },
        {
          title: "Дистрибуция в ОАЭ и сезонные особенности",
          desc: "Доставка из Китая в Дубай занимает 15-22 дня. Наш флот доставляет грузы в Абу-Даби, Дубай, Шарджу. Учитывайте задержки во время крупных выставок и Рамадана."
        }
      ]
    },
    fr: {
      specTitle: "Logistique de projets et de vrac Émirats Arabes Unis",
      specSub: "En tant que plaque tournante du commerce, les Émirats Arabes Unis (Dubaï/Jebel Ali) offrent un dédouanement extrêmement rapide pour le commerce électronique, mais imposent des contrôles stricts sur l'origine et les batteries.",
      tab1Title: "Special Project & Bulk Cargo",
      tab1Header: "Projets spéciaux et vrac - Solutions Flat Rack et Open Top",
      tab1Desc: "Conçu pour les machines lourdes, l'acier de construction, les véhicules électriques, les batteries au lithium et la construction. Expédition en Flat Rack/Open Top et manutention portuaire à Jebel Ali.",
      tab2Title: "Free Zone (JAFZA) Logistics",
      tab2Header: "Zone franche Jebel Ali (JAFZA) - Transit sous douane hors taxes",
      tab2Desc: "Optimisé pour le transbordement et le stockage hors taxes. Expédition directe vers les entrepôts JAFZA pour différer les droits de douane et la TVA, idéal pour la réexportation.",
      redlinesTitle: "Douanes des Émirats : 5 lignes rouges de conformité",
      redlines: [
        { id: "①", title: "Contrôle physique du marquage d'origine", desc: "La douane de Dubaï vérifie fréquemment le marquage permanent 'Made in China'. Les autocollants en papier simples déclenchent souvent des amendes." },
        { id: "②", title: "Batteries au lithium et marchandises dangereuses", desc: "Les batteries et les modules solaires sont classés comme dangereux. Vous devez présenter la fiche MSDS et les rapports UN38.3 en anglais." },
        { id: "③", title: "Limites de charge par essieu sur route", desc: "L'autorité des transports contrôle strictement le poids des camions. Tout dépassement entraîne des amendes massives et l'immobilisation." },
        { id: "④", title: "Exigences de palettes e-commerce", desc: "Les envois vers Amazon FBA ou Noon EAU doivent être professionnellement palettisés selon les normes d'emballage strictes, sous peine de refus." },
        { id: "⑤", title: "Analyse automatisée des tarifs douaniers", desc: "La douane utilise l'IA pour détecter les codes HS erronés ou les valeurs sous-déclarées, plaçant les récidivistes sur une liste noire." }
      ],
      guideTitle: "Opérations et livraison du dernier kilomètre aux Émirats",
      guideSub: "Améliorez l'efficacité de vos flux à l'entrée du commerce régional.",
      guideCards: [
        {
          title: "Dédouanement en 24 Heures",
          desc: "Les dédouanements se résolvent généralement en moins de 24 heures. Si vous n'avez pas de licence d'importation, utilisez notre procuration DDP."
        },
        {
          title: "Serrage de cargaison de projet",
          desc: "Les machines lourdes doivent être solidement arrimées avec des sangles en polyester et des cales en bois selon les normes maritimes IMDG."
        },
        {
          title: "Distribution et ralentissements de saison",
          desc: "Le transit de Chine vers Dubaï prend 15-22 jours. DDNZ livre par camion à Abu Dhabi, Dubaï et Sharjah. Anticipez les ralentissements pendant le Ramadan."
        }
      ]
    }
  },
  'Kuwait': {
    zh: {
      specTitle: "科威特 KUCAS/TABEK 合规与出运规划",
      specSub: "科威特受监管产品可通过 KUCAS/TABEK 体系办理适用的技术评估、检验或放行程序。是否适用及所需资料应按 HS 编码、产品类别与现行规则由进口商确认。",
      tab1Title: "TER 技术评估报告 (Product Registration)",
      tab1Header: "技术评估证书 - 用于后续同类产品申报",
      tab1Desc: "科威特公共工业管理局可依据进口商已取得的符合性证书签发技术评估证书，供同一产品后续海关申报使用。所需资料、适用范围和有效性请按当前产品规则确认。",
      tab2Title: "TIR 技术检验报告 (Batch Clearance)",
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
          desc: "Use the page’s normal transit range for planning and allow buffer time for peak seasons, schedule changes, inspection, public holidays and destination delivery. Loading photos, seals and packing records help with cargo-condition traceability."
        }
      ]
    },
    ru: {
      specTitle: "Соответствие KUCAS/TABEK и планирование доставки в Кувейт",
      specSub: "Для регулируемых товаров система KUCAS/TABEK может использоваться для технической оценки, инспекции или процедуры выпуска. Импортёр должен подтвердить применимость и документы по коду ТН ВЭД, категории товара и действующим правилам.",
      tab1Title: "TER Техническая оценка (Product Registration)",
      tab1Header: "Техническая оценка — для последующих деклараций того же товара",
      tab1Desc: "Public Authority for Industry может выдать сертификат технической оценки на основании уже полученного импортёром сертификата соответствия для последующих таможенных деклараций того же товара. Подтвердите документы, сферу действия и срок по текущим правилам продукта.",
      tab2Title: "TIR Техническая инспекция (Batch Clearance)",
      tab2Header: "Технический отчёт об инспекции и заявка на выпуск",
      tab2Desc: "Если применяется процедура выпуска на базе TIR, импортёр обычно подаёт данные декларации, сведения TIR, информацию о товаре и предусмотренные обязательства, затем отслеживает заявку в платформе. Требования к инспекции, тестам и маркировке зависят от товара и применимого регулирования.",
      redlinesTitle: "Пять проверок перед отправкой в Кувейт",
      redlines: [
        { id: "①", title: "Проверьте, регулируется ли товар", desc: "По коду ТН ВЭД, категории и актуальным правилам KUCAS/TABEK подтвердите, нужен ли сертификат соответствия, техническая оценка, инспекция или иной документ ведомства." },
        { id: "②", title: "Согласуйте документы и декларации", desc: "Коммерческий инвойс, упаковочный лист, коносамент, сведения о товаре и данные импортёра должны быть согласованы между собой и с применимыми документами соответствия." },
        { id: "③", title: "Этикетки, инструкции и технические характеристики", desc: "Для электротоваров, игрушек, строительных материалов и водосберегающей продукции могут действовать отдельные правила. Импортёр должен подтвердить требования к языку, вилке, напряжению, энергоэтикетке и инструкции." },
        { id: "④", title: "Происхождение и ограниченные товары", desc: "Для импорта в Кувейт требуется ясная информация о стране происхождения. До бронирования подтвердите разрешения и приём груза перевозчиком для запрещённых, ограниченных, опасных и брендовых товаров." },
        { id: "⑤", title: "Упаковка, вес и операции в пункте назначения", desc: "Уточните требования к деревянной упаковке, весу контейнера, упаковке опасных грузов и внутренней перевозке для конкретного груза, перевозчика и операции в пункте назначения." }
      ],
      guideTitle: "Практическое руководство по логистике в Кувейте",
      guideSub: "Инструкции по минимизации рисков при работе с местными регламентами и ограничениями по весу.",
      guideCards: [
        {
          title: "Ограничения по весу и точность декларирования",
          desc: "В Кувейте строго контролируют вес контейнеров на дорогах! Лимит для 20-футового контейнера — 22 тонны, для 40-футового — 26 тонн. Данные декларации должны на 100% совпадать с KUCAS."
        },
        {
          title: "PAC получателя и фумигация дерева",
          desc: "В коносаменте должен быть указан гражданский ID номер получателя PAC. Любая деревянная упаковка должна сопровождаться официальным сертификатом фумигации IPPC."
        },
        {
          title: "Сроки транзита и праздничные дни",
          desc: "Доставка морем занимает 18-28 дней. Сделайте четыре фотографии при погрузке для фиксации состояния груза. Планируйте логистику заранее из-за каникул во время Ид."
        }
      ]
    },
    fr: {
      specTitle: "Conformité KUCAS/TABEK et planification des expéditions vers le Koweït",
      specSub: "Pour les produits réglementés, le système KUCAS/TABEK peut être utilisé pour l’évaluation technique, l’inspection ou la procédure de libération applicable. L’importateur doit confirmer l’applicabilité et les documents par code HS, catégorie de produit et règles en vigueur.",
      tab1Title: "TER Évaluation Technique (Product Registration)",
      tab1Header: "Évaluation technique — pour les déclarations ultérieures du même produit",
      tab1Desc: "La Public Authority for Industry peut délivrer un certificat d’évaluation technique à partir d’un certificat de conformité déjà obtenu par l’importateur, pour les déclarations douanières ultérieures du même produit. Confirmez les documents, le périmètre et la validité selon les règles actuelles du produit.",
      tab2Title: "TIR Inspection Technique (Batch Clearance)",
      tab2Header: "Rapport d’inspection technique et demande de libération",
      tab2Desc: "Lorsqu’une procédure de libération liée au TIR s’applique, l’importateur soumet généralement les données de déclaration, les détails TIR, les informations produit et les engagements prescrits, puis suit la demande sur la plateforme. L’inspection, les essais et l’étiquetage dépendent du produit et de la règle applicable.",
      redlinesTitle: "Cinq vérifications avant expédition vers le Koweït",
      redlines: [
        { id: "①", title: "Vérifier si le produit est réglementé", desc: "Utilisez le code HS, la catégorie de produit et les règles KUCAS/TABEK actuelles pour confirmer si un certificat de conformité, une évaluation technique, une inspection ou un autre document est nécessaire." },
        { id: "②", title: "Harmoniser documents et déclarations", desc: "La facture commerciale, la liste de colisage, le connaissement, les informations produit et les données de l’importateur doivent rester cohérents entre eux et avec les documents de conformité applicables." },
        { id: "③", title: "Étiquettes, manuels et spécifications techniques", desc: "Les produits électriques, jouets, matériaux de construction et produits économes en eau peuvent relever de règles spécifiques. L’importateur doit confirmer la langue, la prise, la tension, l’étiquette énergétique ou le manuel requis." },
        { id: "④", title: "Origine et marchandises restreintes", desc: "Les importations au Koweït doivent afficher une information claire sur l’origine. Confirmez les autorisations et l’acceptation du transporteur avant réservation pour les marchandises interdites, restreintes, dangereuses ou de marque." },
        { id: "⑤", title: "Emballage, poids et opérations de destination", desc: "Confirmez l’emballage en bois, le poids du conteneur, l’emballage des marchandises dangereuses et les contraintes de transport intérieur selon la cargaison, le transporteur et l’opération de destination." }
      ],
      guideTitle: "Guide pratique de logistique au Koweït",
      guideSub: "Manuel de mitigation des risques pour naviguer dans les opérations locales, les limites de poids et les réseaux de livraison portuaire.",
      guideCards: [
        {
          title: "Enlèvements et déclarations (anti-pénalité)",
          desc: "La douane du Koweït applique strictement les limites de poids des conteneurs ! Les conteneurs de 20 pieds sont limités à 22 tonnes, et ceux de 40 pieds à 26 tonnes. Déclarez les noms, valeurs et spécifications avec une exactitude de 100 % pour correspondre à votre certificat KUCAS."
        },
        {
          title: "PAC du destinataire et fumigation du bois",
          desc: "Les connaissements doivent mentionner le destinataire réel au Koweït et son numéro PAC obligatoire (Public Authority for Civil Information). Pour les emballages en bois, des certificats de fumigation IPPC officiels doivent être présentés."
        },
        {
          title: "Preuve de perte de voyage et ralentissements des fêtes",
          desc: "Le transit moyen est de 18 à 28 jours. Mettez en œuvre la « vérification en quatre photos » (vide, à moitié chargé, entièrement chargé et serrure de porte scellée) à l'origine comme assurance contre les réclamations pour dommages excessifs aux conteneurs. Planifiez en fonction des ralentissements de l'Aïd."
        }
      ]
    }
  }
};
