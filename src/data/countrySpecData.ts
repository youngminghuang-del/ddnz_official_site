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
      specSub: "根据沙特海关与标准局（SASO）强制性法令，所有受控货物出口沙特必须在 SABER 系统上完成合规录入，否则一律禁止入境并就地退运！",
      tab1Title: "Product Certificate (PC) 产品证书",
      tab1Header: "SABER PC 证书 - 针对具体品类长期备案",
      tab1Desc: "针对具体品类及型号进行注册备案。基于合规的第三方检测报告及产品测试申请，通常在 2-4 工作日签发，有效期 1 年。PC 证书是申请单批次 SC 证书的绝对前置前提。",
      tab2Title: "Shipment Certificate (SC) 批次证书",
      tab2Header: "SABER SC 证书 - 针对单批次出货清关",
      tab2Desc: "每批次货物出运前必须单独申请。申请人必须提供装箱单、商业发票及有效 PC 证书。在起运港直接对接，并在 SABER 平台上支付政府规费，核发单批次 SC 清关证书。",
      redlinesTitle: "沙特海关 5 大清关红线（SABER 审单重点）",
      redlines: [
        { id: "①", title: "SABER证书时效", desc: "货物到港前必须激活 SC 证书。未在到港前完成 SC 录入，将面临数十万元的高额滞港费和退运处罚。" },
        { id: "②", title: "原产地标记刻印", desc: "沙特海关强制要求，所有商品及内外包装盒上必须永久刻印“Made in China”字样。使用贴纸直接扣关、罚款并强制退港。" },
        { id: "③", title: "说明书与安全标语", desc: "电子设备及日用消费品的外包装、警示标签以及说明书，必须配备阿拉伯语或阿/英双语。无阿拉伯语直接拒收。" },
        { id: "④", title: "SFDA 注册合规", desc: "化妆品、食品、医疗器械和部分保健品，属于沙特药监局（SFDA）强管控，出口前必须取得官方系统准入许可，无备案直接销毁。" },
        { id: "⑤", title: "SASO 能效与禁运", desc: "空调、冰箱、照明等受控产品必须加贴 SASO 能效标识，白炽灯等高能耗灯泡属于绝对禁运品类。" }
      ],
      guideTitle: "沙特专线物流实战操作守则",
      guideSub: "高能避坑指南，沙特专线全链路控制要点，保障货款与货物安全。",
      guideCards: [
        {
          title: "订舱审单与清关资料",
          desc: "沙特提单必须包含沙特收货人的真实税号及营业执照，申报发票和装箱单必须 100% 对应 SABER 信息。严禁仿牌、虚报瞒报或过度低报。"
        },
        {
          title: "原产地与木包装熏蒸",
          desc: "提单和发票中的原产地必须完全吻合（Made in China）。凡是木包装、木卡板必须具备 IPPC 盖章熏蒸证明，无章或熏蒸单缺失将直接在海关销毁。"
        },
        {
          title: "物流防损与节日提前规划",
          desc: "从深圳/广州出发到吉达海运约 18-25 天。装柜需四拍留证（空箱、半箱、满箱、封条），应对沙特港口搬运货损。每年开斋节、宰牲节期间沙特海关放假，务必提前一个月安排预订舱位。"
        }
      ]
    },
    en: {
      specTitle: "Saudi Arabia SABER Compliance Protection",
      specSub: "Under the Saudi SASO directives, all controlled products exported to Saudi Arabia must be fully registered in the SABER portal, otherwise customs will deny entry!",
      tab1Title: "Product Certificate (PC)",
      tab1Header: "SABER PC - Long-term Product Registration",
      tab1Desc: "Product registration valid for 1 year per category. Based on qualified laboratory test reports, issued in 2-4 working days. Active PC is the absolute prerequisite for the single batch Shipment Certificate (SC).",
      tab2Title: "Shipment Certificate (SC)",
      tab2Header: "SABER SC - Single Batch Clearance Certificate",
      tab2Desc: "Required for every shipment. Issued on the SABER portal after validating shipping invoice, packing list, and active PC certificate. Seamless clearance at departure port.",
      redlinesTitle: "Saudi Customs 5 Major Redlines (SABER Priority)",
      redlines: [
        { id: "①", title: "SABER SC Expiry", desc: "SC must be issued before the vessel docks. If not ready, the consignment will trigger heavy port demurrage fees and forced returns." },
        { id: "②", title: "Permanent Origin Engraving", desc: "Every item and box must permanently engrave 'Made in China'. Removable adhesive stickers are completely banned and fined." },
        { id: "③", title: "Arabic Manuals & Signs", desc: "Warning labels and technical instructions must include Arabic or Arabic/English bilingual text. Monolingual English faces high rejection rates." },
        { id: "④", title: "SFDA System Registration", desc: "Cosmetics, foodstuffs, and medical products are heavily monitored by the SFDA. Advance system listing is mandatory or goods are destroyed." },
        { id: "⑤", title: "SASO Energy Labels", desc: "Refrigeration, air conditioning, and lighting items must hold SASO energy certificates. Incandescent tungsten lamps are strictly banned." }
      ],
      guideTitle: "Saudi Arabia Logistics Practical Guide",
      guideSub: "Frictionless delivery protocols for reliable freight transit and clearance matching.",
      guideCards: [
        {
          title: "Booking & Documentation Validation",
          desc: "Bills of Lading must state the real Saudi consignee Commercial Register number. Invoice values and names must match your SABER filing with 100% precision."
        },
        {
          title: "Made in China & Wood Fumigation",
          desc: "Declared origin must be strictly unified as 'Made in China'. Solid wooden packaging/pallets must bear IPPC fumigation stamps; otherwise, cargo faces on-the-spot destruction."
        },
        {
          title: "Transit Delay & Holiday Schedules",
          desc: "Transit time from China to Jeddah is 18-25 days. Capture 'four-point photographs' (empty, half-loaded, full, and lock sealed) to counter damage claims. Plan shipments 1 month ahead of Eid."
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
        { id: "①", title: "原产地物理标记验证", desc: "迪拜海关会进行常态化开箱查验，所有商品必须永久雕刻或刻印“Made in China”。若发现贴纸，将强制扣关直至补交数额高昂的保证金。" },
        { id: "②", title: "新能源与危险品（DG）申报", desc: "锂电池、平衡车、新能源汽车出口阿联酋属于敏感危品，必须提供英文 MSDS 及 UN38.3 报告提前申报，严禁瞒报夹带。" },
        { id: "③", title: "陆运轴重超限禁令", desc: "阿联酋联邦公路局对集装箱卡车实行严格的轴重限额检查，超重将被开具数千迪拉姆的巨额罚单，并强制在关口卸货转运。" },
        { id: "④", title: "电商货物托盘合规", desc: "派送到迪拜 Amazon FBA、Noon 仓库的产品必须以标准托盘（Pallet）进行包装，高度及收缩膜规格不符将被直接拒收退回。" },
        { id: "⑤", title: "HS 编码伪报处罚", desc: "阿联酋海关引入AI审单系统，对假冒名牌、低申报、伪报 HS 编码以偷逃税款的行径一律录入信誉黑名单，并处以货值数倍罚款。" }
      ],
      guideTitle: "阿联酋操作守则与本地配送指南",
      guideSub: "打通中东首要自由贸易港，让您的跨境出海链路高效顺畅。",
      guideCards: [
        {
          title: "极速清关与单证提柜",
          desc: "迪拜海关通关通常可在24小时内完成。提货单（D/O）必须准确显示真实收货人。若收货人无自营进出口权，DDNZ可提供可靠的本地进口商双清代抬头报关。"
        },
        {
          title: "海运特种加固与危险品舱位",
          desc: "针对出口阿联酋的新新能源电池或超大工程设备，装柜必须进行专业的拉带和木方加固，并向船公司申请危险品舱位，防止运输震荡损坏。"
        },
        {
          title: "最后一公里派送与节假日避坑",
          desc: "中国至迪拜海运约 15-22 天。最后一公里支持自营卡车派送，覆盖阿布扎比、迪拜、沙迦。特别注意：每年迪拜各种会展期间展会物流堵塞，以及斋月期间本地工作效率减半，需做好舱位和派送时效预留。"
        }
      ]
    },
    en: {
      specTitle: "UAE Bulk Cargo & New Energy Project Logistics Channel",
      specSub: "As the premier Middle Eastern trade hub, UAE (Dubai/Jebel Ali) delivers ultra-fast customs clearance for e-commerce, construction materials, and new energy cargo under strict marking & battery safety audits.",
      tab1Title: "Special Project & Bulk Cargo",
      tab1Header: "Project & Bulk Materials - Flat Rack & Open Top Solutions",
      tab1Desc: "Tailored for heavy machinery, structural steel, EVs, lithium batteries, and construction. Providing specialized equipment (Flat Rack, Open Top) shipping, secure rigging, and complete Jebel Ali port clearance.",
      tab2Title: "Free Zone (JAFZA) Logistics",
      tab2Header: "Jebel Ali Free Zone (JAFZA) - Duty-Free Bonded Transshipment",
      tab2Desc: "Optimized for transshipment and tax-free storage. Ship directly to JAFZA bonded warehouses to defer import tariffs and VAT, enabling cost-effective labeling, inventory split, and re-export to other GCC countries.",
      redlinesTitle: "UAE Ports 5 Critical Compliance Redlines (Crucial Points)",
      redlines: [
        { id: "①", title: "Physical Country of Origin Audits", desc: "Dubai customs inspects shipments frequently. Items must have molded or permanent 'Made in China' markers. Simple paper stickers often trigger custom fines." },
        { id: "②", title: "New Energy & Dangerous Goods (DG)", desc: "Lithium batteries, EV chargers, and solar modules are flagged as hazardous. Shippers must present bilingual MSDS and UN38.3 test summaries in advance." },
        { id: "③", title: "Axle Weight Trucking Regulations", desc: "UAE Federal Transport Authority strictly regulates local road weight caps. Exceeding truck load limits triggers massive penalties and impoundments." },
        { id: "④", title: "E-Commerce Pallet Requirements", desc: "Shipments to Amazon FBA or Noon UAE hubs must be professionally palletized under strict height, label, and wrapping rules, or they are rejected." },
        { id: "⑤", title: "AI Custom Tariffs Checking", desc: "Dubai custom's AI scanner automatically detects misclassified HS codes or heavily undervalued items, putting chronic offenders on blacklists." }
      ],
      guideTitle: "UAE Operational Codes & Last-Mile Delivery",
      guideSub: "Accelerate your local business operations inside the Gulf's core commerce entry portal.",
      guideCards: [
        {
          title: "24-Hour Customs Clearances",
          desc: "UAE clearances typically resolve inside 24 hours. Delivery Orders (D/O) must state the correct consignee. If lacking import licenses, use DDNZ's double clearance DDP proxy."
        },
        {
          title: "DG Rigging & Flat Rack Reinforcement",
          desc: "Oversized machineries and batteries must be strictly lashed with heavy-duty polyester straps and wood blocks inside container bays, following international IMDG standards."
        },
        {
          title: "GCC Distribution & Seasonal Holidays",
          desc: "China to Dubai transit is 15-22 days. DDNZ provides inland trucking across Abu Dhabi, Dubai, and Sharjah. Anticipate logistics congestion during key Dubai exhibitions and Ramadan slowdowns."
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
      specTitle: "科威特 KUCAS (TER/TIR) 认证合规全攻略",
      specSub: "科威特进口管制计划强制要求，未获得 KUCAS 认证的受控货物到港将面临退运或就地销毁！",
      tab1Title: "TER 技术评估报告 (Product Registration)",
      tab1Header: "TER 技术评估报告 - 适合长期高频出口客户",
      tab1Desc: "适合年出货 ≥ 2 次的高频客户。基于 CNAS/ISO17025 认可实验室测试报告，3-5 个工作日快速注册，有效期 1-2 年。后续出货在起运港免于重复测试，仅需申请单批次通关证，极大地节省合规成本和时间。",
      tab2Title: "TIR 技术检验报告 (Batch Clearance)",
      tab2Header: "TIR 技术检验报告 - 单批次清关必备证书",
      tab2Desc: "单批次清关必备。申请人必须提供装箱单、形式发票、有效第三方检测报告、CoC申请表。最关键的是：货物在起运港装柜前，必须安排线下物理检验（Inspection），现场核对产品标签、电压、插头等实物细节，无误后方可签发通关证。",
      redlinesTitle: "科威特验货 5 大死穴（红字高亮提示）",
      redlines: [
        { id: "①", title: "电压硬性标准", desc: "设备工作电压必须标注 230V-240V/50Hz。若标牌或外包装仅标注 220V，则直接禁止入境或被海关退运。" },
        { id: "②", title: "英标插头限制", desc: "所有电器类产品必须配备符合 BS1363 标准的英式三脚插头，传统双扁插头或两圆插头一律不予通关。" },
        { id: "③", title: "阿拉伯语或双语标签说明书", desc: "所有进口电器的外包装标示、警示语以及说明书，必须包含阿拉伯语。无阿拉伯语标识将被海关拒绝入境。" },
        { id: "④", title: "永久性原产地标识", desc: "产品及包装上必须采用雕刻、压印、丝网印刷等永久性方式标明“Made in China”。使用普通不干胶贴纸将被海关没收、退运并罚款。" },
        { id: "⑤", title: "能效与特殊禁运", desc: "普通白炽钨丝灯泡及部分高能耗卤素光源属于科威特环保局绝对禁运产品，到港将被直接查封并就地销毁。" }
      ],
      guideTitle: "科威特专线物流实战风控守则",
      guideSub: "针对科威特严苛关税、重载公路管控以及特殊报关资质的避坑指南。",
      guideCards: [
        {
          title: "箱重限制与精确申报",
          desc: "科威特陆运对集装箱限重极为严苛！20尺柜限重22吨，40尺柜限重26吨，超重面临高额罚款和滞港提货困难。申报品名、金额、规格必须与 KUCAS 证书 100% 一致，严禁瞒报。"
        },
        {
          title: "收货人资质与木包装熏蒸",
          desc: "提单上收货人必须具备合法的科威特营业执照和税号，并提供强制性的 PAC 个人/企业民事身份登记号。凡是带木质包装的货物必须随附官方 IPPC 熏蒸证书，无熏蒸标识无法清关。"
        },
        {
          title: "海运周期与留证防损",
          desc: "中国至科威特舒威赫/舒艾巴港海运约 18-28 天。提货时本地搬运粗暴，装柜需“四拍留证”作为货损索赔依据。科威特属极热地区，夏季高温需注意电子元器件的防热保护。"
        }
      ]
    },
    en: {
      specTitle: "Kuwait KUCAS (TER/TIR) Compliance Strategy",
      specSub: "Under Kuwait's import control program, controlled goods must obtain KUCAS TER and TIR certificates. Failure to comply leads to immediate forced returns or cargo destruction!",
      tab1Title: "TER Technical Evaluation (Product Registration)",
      tab1Header: "TER Report - For Long-term High-frequency Exporters",
      tab1Desc: "Perfect for clients shipping ≥ 2 times per year. Based on CNAS/ISO17025 accredited laboratory test reports, registration takes 3-5 working days and is valid for 1-2 years. Subsequent shipments are exempted from repetitive origin-port testing, saving immense compliance costs and time.",
      tab2Title: "TIR Technical Inspection (Batch Clearance)",
      tab2Header: "TIR Report - Essential for Single Batch Customs Clearance",
      tab2Desc: "Mandatory for single-batch custom clearance. Applicants must provide packing list, proforma invoice, valid third-party test report, and CoC application form. Crucially, physical pre-shipment inspection is mandatory to verify product markings, voltage, and plugs before container sealing.",
      redlinesTitle: "Kuwait Physical Inspection: 5 Redlines (Strict Enforcement)",
      redlines: [
        { id: "①", title: "Voltage Requirements", desc: "Working voltage must be clearly labeled as 230V-240V/50Hz. Labeling only 220V will trigger direct rejection by port authorities." },
        { id: "②", title: "British Standard Plug", desc: "All electrical items must be equipped with a BS1363 British standard (3-pin) plug. Traditional 2-pin flat plugs are strictly rejected." },
        { id: "③", title: "Bilingual Manuals & Labels", desc: "Outer labels, warning signs, and instruction manuals must include Arabic or Arabic/English. Systemic rejection for lacking Arabic text." },
        { id: "④", title: "Permanent Origin Engraving", desc: "The 'Made in China' mark must be permanently engraved, embossed, or silk-screened on both the product and its packaging. Adhesive paper labels are strictly prohibited." },
        { id: "⑤", title: "Energy & Import Bans", desc: "Tungsten incandescent bulbs and certain halogen light sources are strictly banned and will be confiscated immediately upon port arrival." }
      ],
      guideTitle: "Kuwait Practical Logistics Handbook",
      guideSub: "Risk mitigation manual for navigating local operations, weight limits, and port delivery networks.",
      guideCards: [
        {
          title: "Pickups & Declarations (Anti-Penalty)",
          desc: "Kuwait customs strictly enforces container weight limits! 20ft containers are limited to 22 tons, and 40ft containers to 26 tons. Declare names, values, and specs with 100% accuracy to match your KUCAS certificate."
        },
        {
          title: "Consignee PAC & Wood Fumigation",
          desc: "Bills of lading must mention the actual consignee in Kuwait and their mandatory PAC (Public Authority for Civil Information) number. For wooden packings, official IPPC fumigation certificates must be presented."
        },
        {
          title: "Voyage Loss Proof & Holiday Slowdowns",
          desc: "Average transit is 18-28 days. Implement the 'four-photo verification' (empty, half-loaded, fully-loaded, and lock door sealed) at origin as insurance against excessive container damage claims. Plan around Eid slowdowns."
        }
      ]
    },
    ru: {
      specTitle: "Полное руководство по сертификации KUCAS (TER/TIR) в Кувейте",
      specSub: "В соответствии с требованиями Кувейта по контролю импорта, все подконтрольные товары должны иметь сертификаты KUCAS TER или TIR, иначе импорт будет запрещен с последующим уничтожением!",
      tab1Title: "TER Техническая оценка (Product Registration)",
      tab1Header: "Отчет TER - Для долгосрочных и регулярных поставок",
      tab1Desc: "Идеально подходит для экспортеров с частотой отгрузок ≥ 2 раз в год. Оформляется за 3-5 рабочих дней на основе протоколов ISO17025 и действует 1-2 года. Избавляет от повторных испытаний в порту отправления.",
      tab2Title: "TIR Техническая инспекция (Batch Clearance)",
      tab2Header: "Отчет TIR - Обязателен для очистки разовой партии",
      tab2Desc: "Обязательный документ для разовой партии груза. Требуются упаковочный лист, инвойс, протокол испытаний сторонней лаборатории и заявка CoC. Перед погрузкой проводится физическая инспекция.",
      redlinesTitle: "Физический досмотр в Кувейте: 5 критических запретов",
      redlines: [
        { id: "①", title: "Требования к напряжению", desc: "Рабочее напряжение должно быть четко указано как 230V-240V/50Hz. Указание только 220V ведет к немедленному возврату груза." },
        { id: "②", title: "Британский стандарт вилок", desc: "Все электроприборы должны иметь трехконтактную вилку британского стандарта BS1363. Обычные двухконтактные плоские вилки запрещены." },
        { id: "③", title: "Двуязычные инструкции и предупреждения", desc: "Этикетки, предупреждающие знаки и руководства должны содержать текст на арабском или арабском/английском языках." },
        { id: "④", title: "Постоянное нанесение маркировки происхождения", desc: "Надпись 'Made in China' должна быть выгравирована, выштампована или напечатана методом шелкографии. Бумажные наклейки запрещены." },
        { id: "⑤", title: "Запрещенные товары и энергопотребление", desc: "Лампы накаливания и некоторые галогенные лампы строго запрещены к импорту Министерством охраны окружающей среды Кувейта." }
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
      specTitle: "Stratégie de conformité KUCAS (TER/TIR) Koweït",
      specSub: "Dans le cadre du programme de contrôle des importations du Koweït, les marchandises contrôlées doivent obtenir les certificats KUCAS TER et TIR sous peine de renvoi forcé ou de destruction !",
      tab1Title: "TER Évaluation Technique (Product Registration)",
      tab1Header: "Rapport TER - Pour les expéditeurs réguliers à long terme",
      tab1Desc: "Parfait pour les clients expédiant ≥ 2 fois par an. Sur la base des rapports d'essais de laboratoires accrédités CNAS/ISO17025, l'enregistrement prend 3 à 5 jours ouvrables et est valide pendant 1 à 2 ans. Les expéditions ultérieures sont exemptées d'essais répétitifs au port d'origine, ce qui permet d'économiser d'immenses coûts de conformité.",
      tab2Title: "TIR Inspection Technique (Batch Clearance)",
      tab2Header: "Rapport TIR - Essentiel pour le dédouanement par lot",
      tab2Desc: "Obligatoire pour le dédouanement d'un lot unique. Les demandeurs doivent fournir la liste de colisage, la facture proforma, un rapport d'essai tiers valide et le formulaire de demande CoC. Crucialement, une inspection physique avant expédition est obligatoire pour vérifier les marquages des produits.",
      redlinesTitle: "Inspection physique au Koweït : 5 lignes rouges (application stricte)",
      redlines: [
        { id: "①", title: "Exigences de tension", desc: "La tension de fonctionnement doit être clairement indiquée comme étant de 230V-240V/50Hz. Indiquer seulement 220V entraînera un rejet direct par les autorités portuaires." },
        { id: "②", title: "Fiche standard britannique", desc: "Tous les articles électriques doivent être équipés d'une fiche britannique standard BS1363 (3 broches). Les fiches plates traditionnelles à 2 broches sont strictement rejetées." },
        { id: "③", title: "Manuels et étiquettes bilingues", desc: "Les étiquettes extérieures, les panneaux d'avertissement et les manuels d'instructions doivent inclure l'arabe ou l'arabe/anglais. Rejet systématique en cas d'absence de texte en arabe." },
        { id: "④", title: "Gravure d'origine permanente", desc: "La mention 'Made in China' doit être gravée, gaufrée ou sérigraphiée de manière permanente sur le produit et son emballage. Les étiquettes adhésives sont strictement interdites et pénalisées." },
        { id: "⑤", title: "Énergie et interdictions d'importation", desc: "Les ampoules à incandescence au tungstène et certaines sources lumineuses halogènes sont strictement interdites et seront saisies dès l'arrivée au port." }
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
