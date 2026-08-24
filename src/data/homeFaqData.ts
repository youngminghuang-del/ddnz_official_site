export type HomeFaqLanguage = 'zh' | 'en' | 'ru' | 'fr' | 'es' | 'ar' | 'pt' | 'tr';

type BaseHomeFaqLanguage = Exclude<HomeFaqLanguage, 'pt' | 'tr'>;

export type HomeFaqCategory = 'sourcing' | 'shipping' | 'products' | 'quality' | 'compliance';

export type HomeFaqIcon =
  | 'verify'
  | 'consolidate'
  | 'terms'
  | 'cost'
  | 'kitchen'
  | 'mobile'
  | 'audio'
  | 'inspection'
  | 'compliance';

type LocalizedFaqText = Record<BaseHomeFaqLanguage, string>;

type HomeFaqTarget =
  | { kind: 'path'; path: string }
  | {
      kind: 'quote';
      intent: 'Product Sourcing' | 'Supplier Inspection & Consolidation' | 'Freight Export';
      industry?: string;
    };

export interface HomeFaqItem {
  id: number;
  category: HomeFaqCategory;
  icon: HomeFaqIcon;
  question: LocalizedFaqText;
  answer: LocalizedFaqText;
  cta: LocalizedFaqText;
  target: HomeFaqTarget;
}

export const HOME_FAQ_ITEMS: HomeFaqItem[] = [
  {
    id: 1,
    category: 'sourcing',
    icon: 'verify',
    question: {
      en: 'How do I find and verify a reliable China supplier before paying a deposit?',
      zh: '支付订金前，如何寻找并核验可靠的中国供应商？',
      ru: 'Как найти и проверить надежного поставщика в Китае до внесения депозита?',
      fr: 'Comment trouver et vérifier un fournisseur chinois fiable avant de verser un acompte ?',
      es: '¿Cómo encuentro y verifico un proveedor chino fiable antes de pagar un anticipo?',
      ar: 'كيف أجد موردا موثوقا في الصين وأتحقق منه قبل دفع العربون؟',
    },
    answer: {
      en: 'Verify the legal company name, business licence, factory address and product scope, then compare a live video or on-site audit with the quotation. Approve a sample and record specifications before the deposit. DDNZ also reviews delivery, quality, service and cost evidence before a supplier enters the shortlist.',
      zh: '先核对企业法定名称、营业执照、工厂地址及经营产品，再用实时视频或现场审核与报价资料交叉验证。支付订金前应确认样品并固化规格。DDNZ 还会根据交付、质量、服务和成本证据评分，合格后才进入候选名单。',
      ru: 'Проверьте юридическое название, лицензию, адрес фабрики и ассортимент, затем сопоставьте коммерческое предложение с видеоаудитом или выездной проверкой. До депозита утвердите образец и спецификацию. DDNZ также оценивает подтвержденные данные по срокам, качеству, сервису и стоимости.',
      fr: 'Vérifiez la raison sociale, la licence, l’adresse de l’usine et son périmètre de production, puis confrontez le devis à une visite vidéo en direct ou à un audit. Validez l’échantillon et la spécification avant l’acompte. DDNZ examine aussi les preuves de livraison, qualité, service et coût avant présélection.',
      es: 'Verifique la razón social, licencia, dirección de fábrica y gama de productos; después contraste la cotización con una videovisita en directo o una auditoría. Apruebe una muestra y fije las especificaciones antes del anticipo. DDNZ también evalúa pruebas de entrega, calidad, servicio y coste antes de preseleccionar.',
      ar: 'تحقق من الاسم القانوني والرخصة وعنوان المصنع ونطاق المنتجات، ثم طابق عرض السعر مع جولة فيديو مباشرة أو تدقيق ميداني. اعتمد عينة ومواصفات مكتوبة قبل العربون. كما تراجع DDNZ أدلة التسليم والجودة والخدمة والتكلفة قبل إدراج المورد في القائمة المختصرة.',
    },
    cta: {
      en: 'See the supplier verification process',
      zh: '查看供应商核验流程',
      ru: 'Посмотреть процесс проверки',
      fr: 'Voir le processus de vérification',
      es: 'Ver el proceso de verificación',
      ar: 'اطلع على عملية التحقق',
    },
    target: { kind: 'path', path: '/how-we-work#step-2' },
  },
  {
    id: 2,
    category: 'sourcing',
    icon: 'consolidate',
    question: {
      en: 'Can DDNZ combine orders from multiple Chinese factories into one export shipment?',
      zh: 'DDNZ 能否把多家中国工厂的订单合并为一票出口？',
      ru: 'Может ли DDNZ объединить заказы нескольких китайских фабрик в одну экспортную отправку?',
      fr: 'DDNZ peut-elle regrouper les commandes de plusieurs usines chinoises dans une seule expédition ?',
      es: '¿Puede DDNZ consolidar pedidos de varias fábricas chinas en un solo envío de exportación?',
      ar: 'هل تستطيع DDNZ جمع طلبات عدة مصانع صينية في شحنة تصدير واحدة؟',
    },
    answer: {
      en: 'Yes, when the products and documents can travel together. We align factory ready dates, receive and count cartons, check labels and pack-out, preserve QC evidence, and compare LCL with FCL before the export handoff. Batteries, liquids or other regulated cargo may need separate packing, declarations or transport arrangements.',
      zh: '可以，前提是产品属性与单证允许同票运输。我们协调各工厂备货时间，收货点数，核对标签与装箱，保留质检证据，并在出口交接前比较 LCL 与 FCL。电池、液体或其他受监管货物可能需要单独包装、申报或运输。',
      ru: 'Да, если товары и документы допускают совместную перевозку. Мы согласуем готовность фабрик, принимаем и пересчитываем коробки, проверяем маркировку и упаковку, сохраняем QC-доказательства и сравниваем LCL с FCL. Батареи, жидкости и регулируемые грузы могут потребовать отдельного оформления.',
      fr: 'Oui, lorsque les produits et documents sont compatibles avec un transport commun. Nous synchronisons les dates, comptons les cartons, contrôlons étiquettes et emballage, conservons les preuves QC et comparons LCL et FCL. Les batteries, liquides ou marchandises réglementées peuvent exiger un traitement séparé.',
      es: 'Sí, cuando los productos y documentos permiten viajar juntos. Coordinamos fechas de fábrica, recepción y conteo, etiquetas, empaque y evidencia QC, y comparamos LCL con FCL antes de la entrega a exportación. Baterías, líquidos u otras cargas reguladas pueden requerir manejo separado.',
      ar: 'نعم إذا سمحت طبيعة المنتجات والمستندات بشحنها معا. ننسق مواعيد المصانع ونستلم الكراتين ونعدها ونراجع الملصقات والتعبئة وأدلة الجودة، ثم نقارن LCL وFCL. قد تحتاج البطاريات أو السوائل أو البضائع المنظمة إلى ترتيبات منفصلة.',
    },
    cta: {
      en: 'See consolidation and export handoff',
      zh: '查看集货与出口交接',
      ru: 'Посмотреть консолидацию и экспорт',
      fr: 'Voir la consolidation et l’export',
      es: 'Ver consolidación y entrega a exportación',
      ar: 'اطلع على التجميع وتسليم التصدير',
    },
    target: { kind: 'path', path: '/how-we-work#step-6' },
  },
  {
    id: 3,
    category: 'shipping',
    icon: 'terms',
    question: {
      en: 'CIF vs DDP from China: which is better for a first commercial order?',
      zh: '中国出口 CIF 与 DDP，首次商业订单该怎么选？',
      ru: 'CIF или DDP из Китая: что лучше для первого коммерческого заказа?',
      fr: 'CIF ou DDP depuis la Chine : lequel choisir pour une première commande commerciale ?',
      es: 'CIF o DDP desde China: ¿qué conviene para un primer pedido comercial?',
      ar: 'CIF أم DDP من الصين: أيهما أنسب لأول طلبية تجارية؟',
    },
    answer: {
      en: 'Neither term is automatically safer. Under CIF, the seller arranges freight and basic insurance to the named port, while the buyer normally manages import clearance and destination costs. DDP can simplify delivery only when the importer-of-record arrangement is lawful and transparent. Compare responsibility, customs evidence and total landed cost—not the headline freight price.',
      zh: '两种条款都不是天然更安全。CIF 通常由卖方安排至指定港口的运费和基本保险，买方负责进口清关及目的港费用；DDP 只有在进口商身份与清关安排合法、透明时才真正省事。应比较责任边界、清关凭证和总到岸成本，而不是只看运费。',
      ru: 'Ни один термин не является автоматически безопаснее. При CIF продавец организует фрахт и базовую страховку до указанного порта, а покупатель обычно отвечает за импорт и местные расходы. DDP упрощает доставку только при законной и прозрачной схеме импортера. Сравнивайте обязанности, документы и полную стоимость.',
      fr: 'Aucun terme n’est automatiquement plus sûr. En CIF, le vendeur organise le fret et l’assurance de base jusqu’au port nommé, tandis que l’acheteur gère généralement l’importation et les frais à destination. Le DDP n’est simple que si l’importateur officiel est légal et transparent. Comparez responsabilités, justificatifs douaniers et coût rendu total.',
      es: 'Ningún término es automáticamente más seguro. En CIF, el vendedor organiza flete y seguro básico hasta el puerto indicado, mientras el comprador suele gestionar importación y gastos en destino. DDP solo simplifica si el importador de registro es legal y transparente. Compare responsabilidades, documentos aduaneros y coste total puesto en destino.',
      ar: 'لا يوجد شرط أكثر أمانا تلقائيا. في CIF يرتب البائع الشحن والتأمين الأساسي إلى الميناء المحدد، بينما يدير المشتري التخليص ورسوم الوجهة عادة. يسهّل DDP التسليم فقط عندما يكون ترتيب المستورد القانوني واضحا ومشروعا. قارن المسؤوليات وأدلة الجمارك والتكلفة النهائية الكاملة.',
    },
    cta: {
      en: 'Compare options for my shipment',
      zh: '比较我的运输方案',
      ru: 'Сравнить варианты моей отправки',
      fr: 'Comparer les options de mon expédition',
      es: 'Comparar opciones para mi envío',
      ar: 'قارن خيارات شحنتي',
    },
    target: { kind: 'quote', intent: 'Freight Export' },
  },
  {
    id: 4,
    category: 'shipping',
    icon: 'terms',
    question: {
      en: 'What should a compliant DDP quote show about the importer of record, duties and customs documents?',
      zh: '合规的 DDP 报价应如何说明进口商、税费和清关文件？',
      ru: 'Что должно быть указано в корректном предложении DDP об импортере, пошлинах и таможенных документах?',
      fr: 'Que doit préciser une offre DDP conforme sur l’importateur officiel, les droits et les documents douaniers ?',
      es: '¿Qué debe indicar una oferta DDP conforme sobre el importador, los impuestos y los documentos aduaneros?',
      ar: 'ما الذي يجب أن يوضحه عرض DDP المتوافق بشأن المستورد والرسوم ومستندات الجمارك؟',
    },
    answer: {
      en: 'Ask for the legal importer-of-record name and registration, HS code and declared value, who pays duty and tax, which customs or tax documents you receive, and the exact delivery scope. A customs broker or forwarder is not automatically the importer. Avoid an opaque “tax included” route if your business needs declarations, VAT evidence or a formal inventory trail.',
      zh: '应明确法定进口商名称与注册资质、HS 编码和申报价值、关税与税款由谁支付、买方能获得哪些清关或完税文件，以及交付范围。报关行或货代并不自动等于进口商。如果企业需要报关单、增值税凭证或正规库存链路，应避免不透明的“包税”渠道。',
      ru: 'Запросите юридическое имя и регистрацию импортера, код HS и заявленную стоимость, плательщика пошлин и налогов, перечень выдаваемых документов и точную зону доставки. Брокер или экспедитор не становится импортером автоматически. Избегайте непрозрачного «все налоги включены», если нужны декларации, НДС или официальный учет.',
      fr: 'Demandez le nom légal et l’immatriculation de l’importateur officiel, le code SH et la valeur déclarée, le payeur des droits et taxes, les justificatifs remis et le périmètre de livraison. Un courtier ou transitaire n’est pas automatiquement l’importateur. Évitez le « taxes incluses » opaque si vous avez besoin de déclarations, TVA ou traçabilité comptable.',
      es: 'Solicite el nombre legal y registro del importador, código HS y valor declarado, quién paga derechos e impuestos, qué documentos aduaneros o fiscales recibirá y el alcance exacto de entrega. Un agente aduanal o transitario no es automáticamente el importador. Evite rutas opacas “impuestos incluidos” si necesita declaraciones, IVA o trazabilidad formal.',
      ar: 'اطلب الاسم القانوني وتسجيل المستورد ورمز HS والقيمة المصرح بها ومن يدفع الرسوم والضرائب وما المستندات التي ستحصل عليها ونطاق التسليم. وسيط الجمارك أو وكيل الشحن ليس بالضرورة المستورد. تجنب مسار «الضريبة مشمولة» غير الواضح إذا كنت تحتاج إقرارات أو إثبات ضريبة أو سجلا نظاميا للمخزون.',
    },
    cta: {
      en: 'Request a transparent DDP review',
      zh: '申请透明的 DDP 审核',
      ru: 'Запросить прозрачную проверку DDP',
      fr: 'Demander une analyse DDP transparente',
      es: 'Solicitar una revisión DDP transparente',
      ar: 'اطلب مراجعة DDP شفافة',
    },
    target: { kind: 'quote', intent: 'Freight Export' },
  },
  {
    id: 5,
    category: 'shipping',
    icon: 'cost',
    question: {
      en: 'Which costs are usually excluded from a CIF quote, and how do I calculate landed cost?',
      zh: 'CIF 报价通常不含哪些费用？如何计算总到岸成本？',
      ru: 'Какие расходы обычно не входят в CIF и как рассчитать полную стоимость доставки?',
      fr: 'Quels frais sont généralement exclus d’un devis CIF et comment calculer le coût rendu ?',
      es: '¿Qué gastos suelen quedar fuera de una cotización CIF y cómo calculo el coste puesto en destino?',
      ar: 'ما التكاليف التي لا يشملها عرض CIF عادة وكيف أحسب التكلفة النهائية؟',
    },
    answer: {
      en: 'CIF normally stops at the named destination port. Budget for terminal and handling charges, customs brokerage, duty and tax, storage or demurrage, container return, inland delivery, bank fees and any inspection or certification work. Build landed cost from a line-item quote using the correct HS code, shipment size, destination port and free-time assumptions.',
      zh: 'CIF 通常只覆盖至指定目的港。还需预算码头与操作费、报关代理费、关税与税款、仓储或滞期费、还柜费、内陆配送、银行费，以及可能的检验或认证费用。应基于正确 HS 编码、货量、目的港和免用期假设，按费用明细计算总到岸成本。',
      ru: 'CIF обычно заканчивается в указанном порту назначения. Учтите терминальные сборы, брокера, пошлины и налоги, хранение или простой, возврат контейнера, внутреннюю доставку, банковские расходы и сертификацию. Рассчитывайте полную стоимость по детализации с верным кодом HS, объемом, портом и бесплатным периодом.',
      fr: 'Le CIF s’arrête normalement au port de destination nommé. Prévoyez manutention portuaire, courtage, droits et taxes, stockage ou surestaries, retour du conteneur, livraison intérieure, frais bancaires et éventuelle certification. Calculez le coût rendu ligne par ligne avec le bon code SH, le volume, le port et les hypothèses de franchise.',
      es: 'CIF normalmente termina en el puerto de destino indicado. Presupueste terminal y manipulación, agente aduanal, derechos e impuestos, almacenaje o demoras, devolución del contenedor, transporte interior, costes bancarios y certificación. Calcule el coste total por partidas con código HS, volumen, puerto y días libres correctos.',
      ar: 'يتوقف CIF عادة عند ميناء الوجهة المحدد. احسب رسوم المحطة والمناولة والتخليص والرسوم والضرائب والتخزين أو التأخير وإرجاع الحاوية والنقل الداخلي والرسوم المصرفية وأي فحص أو اعتماد. ابن التكلفة النهائية من عرض مفصل باستخدام رمز HS والحجم والميناء وفترة السماح الصحيحة.',
    },
    cta: {
      en: 'Build my landed-cost plan',
      zh: '制定我的到岸成本方案',
      ru: 'Рассчитать полную стоимость',
      fr: 'Construire mon coût rendu',
      es: 'Preparar mi cálculo de coste total',
      ar: 'أعد خطة التكلفة النهائية',
    },
    target: { kind: 'quote', intent: 'Freight Export' },
  },
  {
    id: 6,
    category: 'products',
    icon: 'kitchen',
    question: {
      en: 'What should I verify before buying a commercial ice machine or stainless-steel refrigerator from China?',
      zh: '从中国采购商用制冰机或不锈钢冰箱前应核验什么？',
      ru: 'Что проверить перед закупкой коммерческого льдогенератора или холодильника из нержавеющей стали в Китае?',
      fr: 'Que vérifier avant d’acheter en Chine une machine à glaçons ou un réfrigérateur professionnel inox ?',
      es: '¿Qué debo verificar antes de comprar en China una máquina de hielo o un refrigerador comercial de acero inoxidable?',
      ar: 'ما الذي يجب التحقق منه قبل شراء ماكينة ثلج أو ثلاجة تجارية من الستانلس ستيل من الصين؟',
    },
    answer: {
      en: 'Compare output at your actual ambient and inlet-water temperatures—not catalogue kg/day alone. Confirm climate class, voltage and frequency, refrigerant, stainless-steel grade, compressor and controller models, cleaning needs, spare parts, packaging and any destination certification. For hot markets, request test conditions and evidence showing how capacity changes as temperature rises.',
      zh: '不要只比较目录中的 kg/day，应按实际环境温度与进水温度比较产能。同时确认气候等级、电压频率、制冷剂、不锈钢等级、压缩机与控制器型号、清洁要求、备件、包装和目的国认证。高温市场还应索要测试条件及温度升高后的产能变化证据。',
      ru: 'Сравнивайте производительность при реальной температуре воздуха и воды, а не только кг/сутки из каталога. Уточните климатический класс, напряжение, частоту, хладагент, марку стали, компрессор, контроллер, очистку, запчасти, упаковку и местную сертификацию. Для жаркого климата запросите условия испытаний и падение мощности.',
      fr: 'Comparez la production aux températures réelles de l’air et de l’eau, pas seulement les kg/jour du catalogue. Confirmez classe climatique, tension, fréquence, fluide, nuance d’inox, compresseur, contrôleur, nettoyage, pièces, emballage et conformité locale. Pour les marchés chauds, exigez les conditions d’essai et la baisse de capacité.',
      es: 'Compare la producción con la temperatura ambiente y del agua reales, no solo los kg/día del catálogo. Confirme clase climática, voltaje, frecuencia, refrigerante, grado de acero, compresor, controlador, limpieza, repuestos, empaque y conformidad local. Para climas cálidos, pida condiciones de prueba y pérdida de capacidad.',
      ar: 'قارن الإنتاج عند درجة حرارة الجو وماء الدخول الفعلية، وليس رقم كجم/اليوم في الكتالوج فقط. أكد الفئة المناخية والجهد والتردد وغاز التبريد ونوع الستانلس والضاغط ووحدة التحكم والتنظيف وقطع الغيار والتعبئة واعتماد الوجهة. للأسواق الحارة اطلب ظروف الاختبار وتغير السعة مع الحرارة.',
    },
    cta: {
      en: 'Review commercial kitchen sourcing',
      zh: '查看商用餐厨采购方案',
      ru: 'Посмотреть закупки кухонного оборудования',
      fr: 'Voir le sourcing cuisine professionnelle',
      es: 'Ver compras de equipamiento comercial',
      ar: 'راجع توريد معدات المطابخ التجارية',
    },
    target: { kind: 'path', path: '/sourcing/commercial-kitchen-equipment-from-china' },
  },
  {
    id: 7,
    category: 'products',
    icon: 'mobile',
    question: {
      en: 'Can I order mixed phone cases, screen protectors, chargers and power banks with a lower MOQ?',
      zh: '手机壳、钢化膜、充电器和充电宝能否混款降低 MOQ？',
      ru: 'Можно ли смешать чехлы, защитные стекла, зарядные устройства и пауэрбанки при меньшем MOQ?',
      fr: 'Puis-je mélanger coques, protections d’écran, chargeurs et batteries externes avec un MOQ réduit ?',
      es: '¿Puedo mezclar fundas, protectores, cargadores y power banks con un MOQ menor?',
      ar: 'هل يمكنني خلط أغطية الهواتف وواقيات الشاشة والشواحن والبطاريات المتنقلة بحد أدنى أقل؟',
    },
    answer: {
      en: 'Often yes, if the supplier accepts mixed SKUs or DDNZ consolidates compatible factories. Define MOQ per model and colour, supported phone models, carton mix, branding, labels, sample approval and defect criteria before ordering. Power banks cannot always share the same transport plan because lithium batteries require additional documents, packing and carrier acceptance.',
      zh: '通常可以，前提是供应商接受混合 SKU，或由 DDNZ 集合可兼容的工厂。下单前应明确每型号与颜色 MOQ、适配机型、混箱方式、品牌标签、样品确认及缺陷标准。充电宝含锂电池，可能因单证、包装和承运要求而需要不同运输方案。',
      ru: 'Часто да, если поставщик принимает смешанные SKU или DDNZ консолидирует совместимые фабрики. Заранее зафиксируйте MOQ по модели и цвету, совместимость, микс коробов, брендирование, образец и критерии брака. Пауэрбанки могут потребовать отдельной перевозки из-за литиевых батарей.',
      fr: 'Souvent oui, si le fournisseur accepte les SKU mixtes ou si DDNZ regroupe des usines compatibles. Fixez MOQ par modèle et couleur, compatibilité, assortiment carton, marque, étiquettes, échantillon et défauts. Les batteries externes peuvent nécessiter un transport séparé en raison des documents et règles lithium.',
      es: 'A menudo sí, si el proveedor acepta SKU mixtos o DDNZ consolida fábricas compatibles. Defina MOQ por modelo y color, compatibilidad, mezcla por caja, marca, etiquetas, muestra y criterios de defecto. Los power banks pueden necesitar otro plan de transporte por los requisitos de baterías de litio.',
      ar: 'غالبا نعم إذا قبل المورد خلط رموز المنتجات أو جمعت DDNZ مصانع متوافقة. حدد الحد الأدنى لكل موديل ولون والطرازات والتعبئة المختلطة والعلامة والملصقات والعينة ومعايير العيوب. قد تحتاج البطاريات المتنقلة إلى نقل منفصل بسبب متطلبات الليثيوم.',
    },
    cta: {
      en: 'Review mobile accessories sourcing',
      zh: '查看手机配件采购方案',
      ru: 'Посмотреть закупки аксессуаров',
      fr: 'Voir le sourcing accessoires mobiles',
      es: 'Ver compras de accesorios móviles',
      ar: 'راجع توريد ملحقات الهواتف',
    },
    target: { kind: 'path', path: '/sourcing/mobile-accessories-from-china' },
  },
  {
    id: 8,
    category: 'compliance',
    icon: 'compliance',
    question: {
      en: 'What documents are needed to ship power banks and chargers from China?',
      zh: '从中国出口充电宝和充电器通常需要哪些文件？',
      ru: 'Какие документы нужны для отправки пауэрбанков и зарядных устройств из Китая?',
      fr: 'Quels documents faut-il pour expédier des batteries externes et chargeurs depuis la Chine ?',
      es: '¿Qué documentos se necesitan para enviar power banks y cargadores desde China?',
      ar: 'ما المستندات المطلوبة لشحن البطاريات المتنقلة والشواحن من الصين؟',
    },
    answer: {
      en: 'Requirements depend on transport mode, battery design, carrier and destination. Power banks commonly need a UN38.3 test summary, SDS/MSDS, battery declaration and compliant packing evidence; the carrier may request more. Chargers need verified plug type, voltage, output and destination conformity documents. Confirm document acceptability before choosing the supplier or booking cargo.',
      zh: '要求取决于运输方式、电池设计、承运人和目的国。充电宝通常需要 UN38.3 测试摘要、SDS/MSDS、电池申报及合规包装证明，承运人还可能追加资料。充电器需核对插头、电压、输出和目的国合规文件。应在选供应商或订舱前确认文件可接受性。',
      ru: 'Требования зависят от вида транспорта, конструкции батареи, перевозчика и страны. Для пауэрбанков обычно нужны UN38.3, SDS/MSDS, декларация батареи и подтверждение упаковки; перевозчик может запросить больше. Для зарядных устройств проверьте вилку, напряжение, выход и документы соответствия до выбора поставщика.',
      fr: 'Les exigences dépendent du mode, de la batterie, du transporteur et du pays. Les batteries externes demandent souvent résumé UN38.3, SDS/MSDS, déclaration batterie et preuve d’emballage conforme; le transporteur peut exiger davantage. Pour les chargeurs, vérifiez prise, tension, puissance et documents de conformité avant de choisir le fournisseur.',
      es: 'Los requisitos dependen del modo, diseño de batería, transportista y destino. Los power banks suelen requerir resumen UN38.3, SDS/MSDS, declaración de batería y prueba de empaque conforme; el transportista puede pedir más. Para cargadores, verifique enchufe, voltaje, salida y documentos de conformidad antes de elegir proveedor.',
      ar: 'تعتمد المتطلبات على وسيلة النقل وتصميم البطارية والناقل والوجهة. تحتاج البطاريات المتنقلة عادة إلى ملخص UN38.3 وSDS/MSDS وإقرار البطارية ودليل التعبئة المتوافقة، وقد يطلب الناقل المزيد. للشواحن تحقق من القابس والجهد والخرج ووثائق المطابقة قبل اختيار المورد أو الحجز.',
    },
    cta: {
      en: 'Plan a compliant mobile shipment',
      zh: '规划合规的手机配件运输',
      ru: 'Спланировать соответствующую отправку',
      fr: 'Planifier une expédition conforme',
      es: 'Planificar un envío conforme',
      ar: 'خطط لشحنة ملحقات متوافقة',
    },
    target: { kind: 'path', path: '/sourcing/mobile-accessories-from-china' },
  },
  {
    id: 9,
    category: 'products',
    icon: 'audio',
    question: {
      en: 'How do I verify speaker wattage, battery runtime and components before an audio order?',
      zh: '采购音响前，如何核验功率、续航和核心部件？',
      ru: 'Как проверить мощность, время работы батареи и компоненты акустики до заказа?',
      fr: 'Comment vérifier puissance, autonomie et composants d’une enceinte avant commande ?',
      es: '¿Cómo verifico potencia, autonomía y componentes de un altavoz antes de pedir?',
      ar: 'كيف أتحقق من قدرة السماعة وعمر البطارية ومكوناتها قبل الطلب؟',
    },
    answer: {
      en: 'Ask for a model-level specification that separates continuous or RMS power from peak marketing claims. Record driver, amplifier, battery cell and controller references, then test a sample for runtime, charging, heat, sound and included accessories. The approved sample and test method should govern production, alongside destination plug, voltage, radio and safety requirements.',
      zh: '应索要型号级规格书，区分连续功率或 RMS 与峰值宣传数据，并记录喇叭单元、功放、电芯和控制器型号。随后测试样品的续航、充电、发热、声音和配件。量产应以确认样及测试方法为准，并核对目的国插头、电压、无线和安全要求。',
      ru: 'Запросите спецификацию модели, отделяющую постоянную/RMS-мощность от пиковой рекламы. Зафиксируйте динамик, усилитель, элементы батареи и контроллер, затем испытайте образец по времени работы, зарядке, нагреву, звуку и комплекту. Образец и метод теста должны управлять производством и местным соответствием.',
      fr: 'Exigez une fiche modèle distinguant puissance continue/RMS et pic marketing. Enregistrez haut-parleur, amplificateur, cellule et contrôleur, puis testez autonomie, charge, chauffe, son et accessoires. L’échantillon approuvé et la méthode d’essai doivent encadrer la production, avec les exigences locales de prise, tension, radio et sécurité.',
      es: 'Pida una ficha por modelo que distinga potencia continua/RMS de picos publicitarios. Registre altavoz, amplificador, celda y controlador; pruebe autonomía, carga, temperatura, sonido y accesorios. La muestra aprobada y el método de ensayo deben gobernar producción y requisitos locales de enchufe, voltaje, radio y seguridad.',
      ar: 'اطلب مواصفة لكل موديل تفصل القدرة المستمرة أو RMS عن أرقام الذروة التسويقية. سجل وحدة الصوت والمضخم وخلايا البطارية ووحدة التحكم، ثم اختبر العينة للمدة والشحن والحرارة والصوت والملحقات. يجب أن تحكم العينة وطريقة الاختبار الإنتاج ومتطلبات القابس والجهد والراديو والسلامة.',
    },
    cta: {
      en: 'Review audio and speaker sourcing',
      zh: '查看音响采购方案',
      ru: 'Посмотреть закупки аудиотехники',
      fr: 'Voir le sourcing audio et enceintes',
      es: 'Ver compras de audio y altavoces',
      ar: 'راجع توريد الصوتيات والسماعات',
    },
    target: { kind: 'path', path: '/sourcing/audio-speakers-from-china' },
  },
  {
    id: 10,
    category: 'quality',
    icon: 'inspection',
    question: {
      en: 'How does DDNZ control samples, specifications and pre-shipment quality?',
      zh: 'DDNZ 如何管理样品、规格和出货前质量？',
      ru: 'Как DDNZ контролирует образцы, спецификации и качество перед отправкой?',
      fr: 'Comment DDNZ contrôle-t-elle échantillons, spécifications et qualité avant expédition ?',
      es: '¿Cómo controla DDNZ muestras, especificaciones y calidad antes del embarque?',
      ar: 'كيف تدير DDNZ العينات والمواصفات والجودة قبل الشحن؟',
    },
    answer: {
      en: 'We convert the approved sample and buyer requirements into a version-controlled specification and inspection checklist. Checks are selected by product risk and may include production follow-up, quantity and pack-out review, functional tests and pre-shipment sampling. Photos, videos or reports support a release decision; inspection does not replace required product certification.',
      zh: '我们把确认样与买方要求转化为版本受控的规格书和验货清单，并按产品风险选择生产跟进、数量与装箱核对、功能测试及出货前抽检。照片、视频或报告用于支持放行决策；验货本身不能替代目的国要求的产品认证。',
      ru: 'Мы превращаем утвержденный образец и требования покупателя в версионную спецификацию и чек-лист. По риску выбираются контроль производства, количества и упаковки, функциональные тесты и выборочная проверка перед отправкой. Фото, видео и отчеты поддерживают решение о выпуске; инспекция не заменяет сертификацию.',
      fr: 'Nous transformons l’échantillon approuvé et les exigences en spécification versionnée et checklist. Selon le risque : suivi de production, quantités et emballage, tests fonctionnels et échantillonnage avant expédition. Photos, vidéos ou rapports fondent la décision de libération; l’inspection ne remplace pas la certification obligatoire.',
      es: 'Convertimos la muestra aprobada y los requisitos en una especificación versionada y lista de inspección. Según el riesgo: seguimiento de producción, cantidad y empaque, pruebas funcionales y muestreo preembarque. Fotos, vídeos o informes sustentan la liberación; la inspección no sustituye la certificación exigida.',
      ar: 'نحوّل العينة المعتمدة ومتطلبات المشتري إلى مواصفة مضبوطة الإصدار وقائمة فحص. وبحسب المخاطر نتابع الإنتاج والكمية والتعبئة والاختبارات الوظيفية وأخذ العينات قبل الشحن. تدعم الصور والفيديو والتقارير قرار الإفراج، ولا يحل الفحص محل اعتماد المنتج المطلوب.',
    },
    cta: {
      en: 'See the QC evidence gate',
      zh: '查看质检证据放行节点',
      ru: 'Посмотреть этап QC-доказательств',
      fr: 'Voir le jalon de preuves QC',
      es: 'Ver el control de evidencia QC',
      ar: 'اطلع على بوابة أدلة الجودة',
    },
    target: { kind: 'path', path: '/how-we-work#step-5' },
  },
  {
    id: 11,
    category: 'compliance',
    icon: 'compliance',
    question: {
      en: 'Which product certifications do I need for the Middle East, Africa or Latin America?',
      zh: '出口中东、非洲或拉美需要哪些产品认证？',
      ru: 'Какая сертификация нужна для Ближнего Востока, Африки или Латинской Америки?',
      fr: 'Quelles certifications produit faut-il pour le Moyen-Orient, l’Afrique ou l’Amérique latine ?',
      es: '¿Qué certificaciones de producto necesito para Oriente Medio, África o América Latina?',
      ar: 'ما شهادات المنتجات المطلوبة للشرق الأوسط أو أفريقيا أو أمريكا اللاتينية؟',
    },
    answer: {
      en: 'It depends on the destination country, product, voltage, HS classification and end use. Requirements such as NOM, Inmetro, RETIQ, SEC, SABER/IECEE, SONCAP or NRCS may apply to particular products or markets. Do not assume CE or FCC is universally sufficient. Confirm the exact model with the importer, customs broker and competent authority before production.',
      zh: '认证取决于目的国、产品、电压、HS 归类和用途。NOM、Inmetro、RETIQ、SEC、SABER/IECEE、SONCAP 或 NRCS 等要求可能只适用于特定产品或市场，不能假设 CE 或 FCC 到处通用。量产前应由进口商、报关代理及主管机构按具体型号确认。',
      ru: 'Требования зависят от страны, продукта, напряжения, кода HS и назначения. Для отдельных рынков могут применяться NOM, Inmetro, RETIQ, SEC, SABER/IECEE, SONCAP или NRCS. Не считайте CE/FCC универсальными. Подтвердите конкретную модель с импортером, брокером и компетентным органом до производства.',
      fr: 'Cela dépend du pays, du produit, de la tension, du code SH et de l’usage. NOM, Inmetro, RETIQ, SEC, SABER/IECEE, SONCAP ou NRCS peuvent s’appliquer à certains produits. Ne supposez pas CE ou FCC universels. Faites confirmer le modèle exact par l’importateur, le courtier et l’autorité compétente avant production.',
      es: 'Depende del país, producto, voltaje, clasificación HS y uso. NOM, Inmetro, RETIQ, SEC, SABER/IECEE, SONCAP o NRCS pueden aplicar a productos o mercados concretos. No suponga que CE o FCC bastan en todas partes. Confirme el modelo con importador, agente aduanal y autoridad competente antes de producir.',
      ar: 'يعتمد ذلك على بلد الوجهة والمنتج والجهد وتصنيف HS والاستخدام. قد تنطبق NOM أو Inmetro أو RETIQ أو SEC أو SABER/IECEE أو SONCAP أو NRCS على أسواق أو منتجات محددة. لا تفترض أن CE أو FCC كافيتان دائما. أكد الموديل مع المستورد والوسيط والجهة المختصة قبل الإنتاج.',
    },
    cta: {
      en: 'Review compliance for my market',
      zh: '核对我的市场合规要求',
      ru: 'Проверить требования моего рынка',
      fr: 'Vérifier la conformité de mon marché',
      es: 'Revisar conformidad para mi mercado',
      ar: 'راجع امتثال سوقي',
    },
    target: { kind: 'quote', intent: 'Product Sourcing' },
  },
];

type SupplementalFaqLanguage = Extract<HomeFaqLanguage, 'pt' | 'tr'>;
type SupplementalFaqCopy = Record<'question' | 'answer' | 'cta', Record<SupplementalFaqLanguage, string>>;

const supplementalFaqCopy: Record<number, SupplementalFaqCopy> = {
  1: {
    question: { pt: 'Como encontrar e verificar um fornecedor confiável na China antes de pagar o sinal?', tr: 'Kapora ödemeden önce güvenilir bir Çin tedarikçisini nasıl bulup doğrularım?' },
    answer: { pt: 'Verifique razão social, licença, endereço da fábrica e escopo de produtos; depois confronte a cotação com uma visita por vídeo ao vivo ou auditoria local. Aprove a amostra e registre as especificações antes do sinal. A DDNZ também analisa evidências de entrega, qualidade, serviço e custo antes da pré-seleção.', tr: 'Yasal unvanı, işletme ruhsatını, fabrika adresini ve ürün kapsamını doğrulayın; ardından teklifi canlı video veya saha denetimiyle karşılaştırın. Kaporadan önce numuneyi onaylayıp şartnameyi kaydedin. DDNZ ayrıca kısa liste öncesinde teslimat, kalite, hizmet ve maliyet kanıtlarını inceler.' },
    cta: { pt: 'Ver o processo de verificação', tr: 'Tedarikçi doğrulama sürecini gör' },
  },
  2: {
    question: { pt: 'A DDNZ pode combinar pedidos de várias fábricas chinesas em uma única exportação?', tr: 'DDNZ birden fazla Çin fabrikasından gelen siparişleri tek ihracat sevkiyatında birleştirebilir mi?' },
    answer: { pt: 'Sim, quando produtos e documentos podem viajar juntos. Alinhamos datas de prontidão, recebemos e contamos caixas, verificamos etiquetas e embalagem, preservamos evidências de QC e comparamos LCL e FCL antes da entrega para exportação. Baterias, líquidos e outras cargas regulamentadas podem exigir tratamento separado.', tr: 'Ürünler ve belgeler birlikte taşınabiliyorsa evet. Fabrika hazır tarihlerini eşleştirir, kolileri teslim alıp sayar, etiket ve paketlemeyi kontrol eder, QC kanıtını korur ve ihracat tesliminden önce LCL ile FCL’yi karşılaştırırız. Batarya, sıvı ve düzenlemeye tabi yükler ayrı işlem gerektirebilir.' },
    cta: { pt: 'Ver consolidação e entrega para exportação', tr: 'Konsolidasyon ve ihracat teslimini gör' },
  },
  3: {
    question: { pt: 'CIF ou DDP da China: qual é melhor para um primeiro pedido comercial?', tr: 'Çin’den CIF mi DDP mi: ilk ticari sipariş için hangisi daha iyi?' },
    answer: { pt: 'Nenhum termo é automaticamente mais seguro. No CIF, o vendedor organiza frete e seguro básico até o porto indicado; o comprador normalmente cuida da importação e dos custos no destino. O DDP só simplifica quando o importador oficial é legal e transparente. Compare responsabilidades, provas aduaneiras e custo total posto.', tr: 'Hiçbiri otomatik olarak daha güvenli değildir. CIF’te satıcı navlun ve temel sigortayı belirtilen limana kadar düzenler; ithalat ve varış masrafları genelde alıcıdadır. DDP ancak kayıtlı ithalatçı düzeni yasal ve şeffafsa kolaylık sağlar. Başlık fiyatı değil, sorumluluk, gümrük kanıtı ve toplam maliyeti karşılaştırın.' },
    cta: { pt: 'Comparar opções para minha carga', tr: 'Sevkiyat seçeneklerimi karşılaştır' },
  },
  4: {
    question: { pt: 'O que uma cotação DDP transparente deve informar sobre importador, impostos e documentos?', tr: 'Şeffaf bir DDP teklifi kayıtlı ithalatçı, vergiler ve gümrük belgeleri hakkında ne göstermeli?' },
    answer: { pt: 'Peça o nome legal e o registro do importador oficial, código HS e valor declarado, quem paga impostos, quais documentos aduaneiros ou fiscais serão entregues e o escopo exato. Despachante ou agente de carga não é automaticamente o importador. Evite rotas opacas com “impostos incluídos” se precisar de declarações, IVA ou trilha formal de estoque.', tr: 'Kayıtlı ithalatçının yasal adı ve kaydı, HS kodu ve beyan değeri, vergi ödeyen taraf, teslim edilecek gümrük/vergi belgeleri ve kesin teslim kapsamını isteyin. Gümrük müşaviri veya taşıma acentesi otomatik olarak ithalatçı değildir. Beyan, KDV kanıtı veya resmi stok izi gerekiyorsa belirsiz “vergiler dahil” rotalardan kaçının.' },
    cta: { pt: 'Solicitar revisão DDP transparente', tr: 'Şeffaf DDP incelemesi talep et' },
  },
  5: {
    question: { pt: 'Quais custos costumam ficar fora do CIF e como calculo o custo posto?', tr: 'CIF teklifine genellikle hangi masraflar dahil değildir ve toplam maliyet nasıl hesaplanır?' },
    answer: { pt: 'O CIF normalmente termina no porto de destino. Considere terminal, manuseio, despacho, impostos, armazenagem ou demurrage, devolução do contêiner, entrega interna, tarifas bancárias e inspeção ou certificação. Calcule por itens com o código HS, volume, porto e dias livres corretos.', tr: 'CIF genellikle varış limanında sona erer. Terminal ve elleçleme, gümrük müşavirliği, vergi, depolama veya demuraj, konteyner iadesi, iç taşıma, banka ve denetim/sertifika giderlerini ekleyin. Doğru HS kodu, yük hacmi, liman ve serbest süreyle kalem bazında hesaplayın.' },
    cta: { pt: 'Montar meu plano de custo posto', tr: 'Toplam maliyet planımı oluştur' },
  },
  6: {
    question: { pt: 'O que verificar antes de comprar máquina de gelo ou refrigerador inox comercial da China?', tr: 'Çin’den ticari buz makinesi veya paslanmaz çelik buzdolabı almadan önce neyi doğrulamalıyım?' },
    answer: { pt: 'Compare a produção na temperatura ambiente e de água reais, não apenas kg/dia do catálogo. Confirme classe climática, tensão, frequência, refrigerante, inox, compressor, controlador, limpeza, peças, embalagem e certificação no destino. Para mercados quentes, peça condições de teste e evidências de perda de capacidade com o aumento da temperatura.', tr: 'Katalog kg/gün değeri yerine gerçek ortam ve giriş suyu sıcaklığındaki üretimi karşılaştırın. İklim sınıfı, voltaj, frekans, soğutucu, paslanmaz çelik kalitesi, kompresör, kontrolcü, temizlik, yedek parça, paketleme ve hedef ülke belgesini doğrulayın. Sıcak pazarlar için test koşulu ve sıcaklık arttıkça kapasite değişimi kanıtı isteyin.' },
    cta: { pt: 'Revisar sourcing de cozinha comercial', tr: 'Ticari mutfak tedarikini incele' },
  },
  7: {
    question: { pt: 'Posso pedir capas, películas, carregadores e power banks mistos com MOQ menor?', tr: 'Karışık telefon kılıfı, ekran koruyucu, şarj cihazı ve powerbank’i daha düşük MOQ ile sipariş edebilir miyim?' },
    answer: { pt: 'Muitas vezes sim, se o fornecedor aceitar SKUs mistos ou se a DDNZ consolidar fábricas compatíveis. Defina MOQ por modelo e cor, aparelhos compatíveis, mistura por caixa, marca, etiquetas, amostra e critérios de defeito. Power banks podem exigir documentos, embalagem e transportador separados por causa da bateria de lítio.', tr: 'Tedarikçi karışık SKU kabul ederse veya DDNZ uyumlu fabrikaları birleştirirse çoğu zaman evet. Model ve renk bazında MOQ, telefon modelleri, koli karışımı, marka, etiket, numune ve kusur kriterini tanımlayın. Lityum batarya nedeniyle powerbank’ler ayrı belge, paket ve taşıyıcı gerektirebilir.' },
    cta: { pt: 'Revisar sourcing de acessórios móveis', tr: 'Mobil aksesuar tedarikini incele' },
  },
  8: {
    question: { pt: 'Quais documentos são necessários para enviar power banks e carregadores da China?', tr: 'Çin’den powerbank ve şarj cihazı göndermek için hangi belgeler gerekir?' },
    answer: { pt: 'Depende do modal, desenho da bateria, transportador e destino. Power banks normalmente exigem resumo UN38.3, SDS/MSDS, declaração de bateria e evidência de embalagem; o transportador pode pedir mais. Para carregadores, confirme plugue, tensão, saída e documentos de conformidade. Valide a aceitação antes de escolher fornecedor ou reservar a carga.', tr: 'Taşıma modu, batarya tasarımı, taşıyıcı ve hedef ülkeye bağlıdır. Powerbank için genellikle UN38.3 test özeti, SDS/MSDS, batarya beyanı ve uygun paket kanıtı gerekir; taşıyıcı ek belge isteyebilir. Şarj cihazında fiş, voltaj, çıkış ve hedef ülke uygunluk belgelerini doğrulayın. Tedarikçi seçimi veya rezervasyondan önce belge kabulünü teyit edin.' },
    cta: { pt: 'Planejar um envio móvel em conformidade', tr: 'Uyumlu mobil ürün sevkiyatı planla' },
  },
  9: {
    question: { pt: 'Como verificar potência, autonomia da bateria e componentes antes de um pedido de áudio?', tr: 'Ses ürünü siparişinden önce watt, batarya çalışma süresi ve bileşenleri nasıl doğrularım?' },
    answer: { pt: 'Peça especificação por modelo que separe potência contínua/RMS de pico publicitário. Registre driver, amplificador, célula e controlador; teste autonomia, carga, calor, som e acessórios. A amostra e o método aprovados devem reger a produção, junto com plugue, tensão, rádio e segurança do destino.', tr: 'Sürekli/RMS gücü pazarlama tepe değerinden ayıran model bazlı şartname isteyin. Sürücü, amplifikatör, batarya hücresi ve kontrolcü referansını kaydedin; çalışma süresi, şarj, ısı, ses ve aksesuarları test edin. Onaylı numune ve test yöntemi üretimi, hedef ülke fiş, voltaj, radyo ve güvenlik gerekleriyle birlikte yönetmelidir.' },
    cta: { pt: 'Revisar sourcing de áudio e caixas de som', tr: 'Ses ve hoparlör tedarikini incele' },
  },
  10: {
    question: { pt: 'Como a DDNZ controla amostras, especificações e qualidade antes do embarque?', tr: 'DDNZ numune, şartname ve sevkiyat öncesi kaliteyi nasıl kontrol eder?' },
    answer: { pt: 'Transformamos amostra aprovada e requisitos do comprador em especificação versionada e checklist. Conforme o risco, acompanhamos produção, quantidade, embalagem, testes funcionais e amostragem pré-embarque. Fotos, vídeos ou relatórios apoiam a decisão de liberação; inspeção não substitui certificação obrigatória.', tr: 'Onaylı numune ve alıcı şartlarını sürüm kontrollü şartname ve kontrol listesine dönüştürürüz. Ürün riskine göre üretim takibi, adet/paket kontrolü, fonksiyon testi ve sevkiyat öncesi örnekleme yapılır. Fotoğraf, video veya rapor serbest bırakma kararını destekler; denetim zorunlu sertifikanın yerini tutmaz.' },
    cta: { pt: 'Ver o portão de evidências de QC', tr: 'QC kanıt kapısını gör' },
  },
  11: {
    question: { pt: 'Quais certificações de produto são necessárias no Oriente Médio, África ou América Latina?', tr: 'Orta Doğu, Afrika veya Latin Amerika için hangi ürün sertifikaları gerekir?' },
    answer: { pt: 'Depende do país, produto, tensão, classificação HS e uso. NOM, Inmetro, RETIQ, SEC, SABER/IECEE, SONCAP ou NRCS podem valer em mercados específicos. Não presuma que CE ou FCC basta. Confirme o modelo exato com importador, despachante e autoridade competente antes da produção.', tr: 'Hedef ülke, ürün, voltaj, HS sınıfı ve kullanıma bağlıdır. NOM, Inmetro, RETIQ, SEC, SABER/IECEE, SONCAP veya NRCS belirli pazar ve ürünlerde geçerli olabilir. CE veya FCC’nin her yerde yeterli olduğunu varsaymayın. Üretimden önce kesin modeli ithalatçı, gümrük müşaviri ve yetkili kurumla doğrulayın.' },
    cta: { pt: 'Revisar conformidade para meu mercado', tr: 'Pazarım için uyumluluğu incele' },
  },
};

export function getLocalizedHomeFaqText(
  item: HomeFaqItem,
  field: 'question' | 'answer' | 'cta',
  language: HomeFaqLanguage,
) {
  if (language === 'pt' || language === 'tr') {
    return supplementalFaqCopy[item.id]?.[field][language] || item[field].en;
  }
  return item[field][language];
}

export function getLocalizedHomeFaqs(language: HomeFaqLanguage) {
  return HOME_FAQ_ITEMS.map((item) => ({
    question: getLocalizedHomeFaqText(item, 'question', language),
    answer: getLocalizedHomeFaqText(item, 'answer', language),
  }));
}
