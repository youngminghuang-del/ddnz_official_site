export const EURASIA_COUNTRIES = [
  'russia',
  'kazakhstan',
  'uzbekistan',
  'kyrgyzstan',
  'tajikistan',
  'turkmenistan',
] as const;

export type EurasiaCountry = typeof EURASIA_COUNTRIES[number];
export type EurasiaLocale = 'en' | 'zh' | 'ru' | 'fr' | 'es' | 'ar';

type LocalizedText = Record<EurasiaLocale, string>;
type CustomsRegime = 'russia' | 'eaeu' | 'national';

type CorridorProfile = {
  name: LocalizedText;
  destinations: LocalizedText;
  gateway: LocalizedText;
  transitDays: LocalizedText;
  airDays: LocalizedText;
  customsRegime: CustomsRegime;
  recommendedModes: Array<'rail' | 'road' | 'multimodal' | 'air'>;
};

const localized = (en: string, zh: string, ru: string, fr: string, es: string, ar: string): LocalizedText => ({
  en, zh, ru, fr, es, ar,
});

export const EURASIA_CORRIDORS: Record<EurasiaCountry, CorridorProfile> = {
  russia: {
    name: localized('Russia', '俄罗斯', 'Россия', 'Russie', 'Rusia', 'روسيا'),
    destinations: localized('Moscow, Yekaterinburg and regional terminals', '莫斯科、叶卡捷琳堡及俄罗斯区域站点', 'Москва, Екатеринбург и региональные терминалы', 'Moscou, Iekaterinbourg et terminaux régionaux', 'Moscú, Ekaterimburgo y terminales regionales', 'موسكو ويكاترينبورغ والمحطات الإقليمية'),
    gateway: localized('Manzhouli / Zabaikalsk or a confirmed alternative corridor', '满洲里 / 后贝加尔斯克，或订舱确认的替代通道', 'Маньчжурия / Забайкальск или подтвержденный альтернативный коридор', 'Manzhouli / Zabaïkalsk ou corridor alternatif confirmé', 'Manzhouli / Zabaikalsk o corredor alternativo confirmado', 'مانتشولي / زابايكالسك أو ممر بديل مؤكد'),
    transitDays: localized('12 - 25 days', '12 - 25 天', '12 - 25 дней', '12 - 25 jours', '12 - 25 días', '12 - 25 يوماً'),
    airDays: localized('4 - 9 days', '4 - 9 天', '4 - 9 дней', '4 - 9 jours', '4 - 9 días', '4 - 9 أيام'),
    customsRegime: 'russia',
    recommendedModes: ['rail', 'road', 'air'],
  },
  kazakhstan: {
    name: localized('Kazakhstan', '哈萨克斯坦', 'Казахстан', 'Kazakhstan', 'Kazajistán', 'كازاخستان'),
    destinations: localized('Almaty, Astana and regional terminals', '阿拉木图、阿斯塔纳及哈萨克斯坦区域站点', 'Алматы, Астана и региональные терминалы', 'Almaty, Astana et terminaux régionaux', 'Almaty, Astaná y terminales regionales', 'ألماتي وأستانا والمحطات الإقليمية'),
    gateway: localized('Khorgos / Alashankou', '霍尔果斯 / 阿拉山口', 'Хоргос / Алашанькоу', 'Khorgos / Alashankou', 'Khorgos / Alashankou', 'خورغوس / ألاشانكو'),
    transitDays: localized('15 - 25 days', '15 - 25 天', '15 - 25 дней', '15 - 25 jours', '15 - 25 días', '15 - 25 يوماً'),
    airDays: localized('3 - 7 days', '3 - 7 天', '3 - 7 дней', '3 - 7 jours', '3 - 7 días', '3 - 7 أيام'),
    customsRegime: 'eaeu',
    recommendedModes: ['rail', 'road', 'air'],
  },
  uzbekistan: {
    name: localized('Uzbekistan', '乌兹别克斯坦', 'Узбекистан', 'Ouzbékistan', 'Uzbekistán', 'أوزبكستان'),
    destinations: localized('Tashkent and industrial regions', '塔什干及乌兹别克斯坦工业区', 'Ташкент и промышленные регионы', 'Tachkent et régions industrielles', 'Taskent y regiones industriales', 'طشقند والمناطق الصناعية'),
    gateway: localized('Khorgos / Alashankou with onward transit', '霍尔果斯 / 阿拉山口，经中转进入乌兹别克斯坦', 'Хоргос / Алашанькоу с дальнейшим транзитом', 'Khorgos / Alashankou avec transit ultérieur', 'Khorgos / Alashankou con tránsito posterior', 'خورغوس / ألاشانكو مع عبور لاحق'),
    transitDays: localized('18 - 28 days', '18 - 28 天', '18 - 28 дней', '18 - 28 jours', '18 - 28 días', '18 - 28 يوماً'),
    airDays: localized('4 - 8 days', '4 - 8 天', '4 - 8 дней', '4 - 8 jours', '4 - 8 días', '4 - 8 أيام'),
    customsRegime: 'national',
    recommendedModes: ['road', 'rail', 'air'],
  },
  kyrgyzstan: {
    name: localized('Kyrgyzstan', '吉尔吉斯斯坦', 'Кыргызстан', 'Kirghizistan', 'Kirguistán', 'قيرغيزستان'),
    destinations: localized('Bishkek, Osh and regional delivery points', '比什凯克、奥什及吉尔吉斯斯坦区域交付点', 'Бишкек, Ош и региональные пункты доставки', 'Bichkek, Och et points de livraison régionaux', 'Biskek, Osh y puntos de entrega regionales', 'بيشكيك وأوش ونقاط التسليم الإقليمية'),
    gateway: localized('Irkeshtam / Torugart or transit via Kazakhstan', '伊尔克什坦 / 吐尔尕特，或经哈萨克斯坦中转', 'Иркештам / Торугарт или транзит через Казахстан', 'Irkechtam / Torougart ou transit via le Kazakhstan', 'Irkeshtam / Torugart o tránsito por Kazajistán', 'إركشتام / توروجارت أو العبور عبر كازاخستان'),
    transitDays: localized('16 - 26 days', '16 - 26 天', '16 - 26 дней', '16 - 26 jours', '16 - 26 días', '16 - 26 يوماً'),
    airDays: localized('4 - 9 days', '4 - 9 天', '4 - 9 дней', '4 - 9 jours', '4 - 9 días', '4 - 9 أيام'),
    customsRegime: 'eaeu',
    recommendedModes: ['road', 'multimodal', 'air'],
  },
  tajikistan: {
    name: localized('Tajikistan', '塔吉克斯坦', 'Таджикистан', 'Tadjikistan', 'Tayikistán', 'طاجيكستان'),
    destinations: localized('Dushanbe, Khujand and regional delivery points', '杜尚别、苦盏及塔吉克斯坦区域交付点', 'Душанбе, Худжанд и региональные пункты доставки', 'Douchanbé, Khodjent et points de livraison régionaux', 'Dusambé, Juyand y puntos de entrega regionales', 'دوشنبه وخجند ونقاط التسليم الإقليمية'),
    gateway: localized('Confirmed transit via Kazakhstan, Kyrgyzstan or Uzbekistan', '经哈萨克斯坦、吉尔吉斯斯坦或乌兹别克斯坦的确认中转线路', 'Подтвержденный транзит через Казахстан, Кыргызстан или Узбекистан', 'Transit confirmé via le Kazakhstan, le Kirghizistan ou l’Ouzbékistan', 'Tránsito confirmado por Kazajistán, Kirguistán o Uzbekistán', 'عبور مؤكد عبر كازاخستان أو قيرغيزستان أو أوزبكستان'),
    transitDays: localized('20 - 32 days', '20 - 32 天', '20 - 32 дней', '20 - 32 jours', '20 - 32 días', '20 - 32 يوماً'),
    airDays: localized('5 - 10 days', '5 - 10 天', '5 - 10 дней', '5 - 10 jours', '5 - 10 días', '5 - 10 أيام'),
    customsRegime: 'national',
    recommendedModes: ['road', 'multimodal', 'air'],
  },
  turkmenistan: {
    name: localized('Turkmenistan', '土库曼斯坦', 'Туркменистан', 'Turkménistan', 'Turkmenistán', 'تركمانستان'),
    destinations: localized('Ashgabat, Turkmenabat and confirmed delivery points', '阿什哈巴德、土库曼纳巴德及确认的交付点', 'Ашхабад, Туркменабат и подтвержденные пункты доставки', 'Achgabat, Türkmenabat et points de livraison confirmés', 'Asjabad, Turkmenabat y puntos de entrega confirmados', 'عشق آباد وتركمان آباد ونقاط التسليم المؤكدة'),
    gateway: localized('Rail or road transit through a confirmed Central Asian corridor', '经确认的中亚通道进行铁路或公路中转', 'Железнодорожный или автомобильный транзит по подтвержденному коридору Центральной Азии', 'Transit ferroviaire ou routier par un corridor d’Asie centrale confirmé', 'Tránsito ferroviario o por carretera mediante un corredor confirmado de Asia Central', 'عبور بالسكك الحديدية أو الطرق عبر ممر مؤكد في آسيا الوسطى'),
    transitDays: localized('20 - 35 days', '20 - 35 天', '20 - 35 дней', '20 - 35 jours', '20 - 35 días', '20 - 35 يوماً'),
    airDays: localized('5 - 10 days', '5 - 10 天', '5 - 10 дней', '5 - 10 jours', '5 - 10 días', '5 - 10 أيام'),
    customsRegime: 'national',
    recommendedModes: ['rail', 'multimodal', 'air'],
  },
};

export const EURASIA_UI = {
  en: {
    regionTag: 'CHINA TO RUSSIA AND CENTRAL ASIA',
    selectDestination: 'Choose destination',
    routeBasis: 'Route basis',
    entryGateway: 'Entry and transit gateway',
    destinationScope: 'Destination scope',
    customsFrame: 'Customs and control frame',
    planningWindow: 'Planning window',
    quoteConfirmed: 'Indicative only. Confirm the route, space, cargo acceptance and border conditions with the quotation.',
    modesTitle: 'Compare the workable transport paths',
    modesIntro: 'The fastest headline is not always the strongest shipment plan. Compare cargo fit, border handling and document risk together.',
    bestFor: 'Best suited for',
    operatingPoint: 'Operating point',
    riskControl: 'Control before dispatch',
    requestMode: 'Request this route',
    routeDetail: 'Route detail',
    destinationMatrix: 'Six destinations, six operating plans',
    destinationMatrixIntro: 'Each country keeps its own gateway, customs framework and last-mile scope. Select a destination to open its working brief.',
    complianceTitle: 'What must be confirmed before booking',
    preAudit: 'Add to route review',
    eaeu: 'EAEU customs and technical-regulation review',
    national: 'National import, transit and destination document review',
    russia: 'EAEU review plus sanctions, export-control and counterparty screening',
    routeEvidence: 'Planning basis',
    routeEvidenceBody: 'Country membership and corridor context are checked against current official sources. Shipment acceptance remains quote-specific.',
    sourceEaeu: 'EAEU membership',
    sourceTir: 'UNECE TIR corridor framework',
    sourceRussia: 'Russia export-control screening',
  },
  zh: {
    regionTag: '中国至俄罗斯与中亚五国', selectDestination: '选择目的国', routeBasis: '路线依据', entryGateway: '入境及中转口岸', destinationScope: '目的地范围', customsFrame: '清关与管制框架', planningWindow: '规划时效', quoteConfirmed: '仅供前期规划。最终路线、舱位、货物接受条件和口岸运行情况以书面报价为准。', modesTitle: '比较真正可执行的运输路径', modesIntro: '最短的宣传时效不一定是最稳妥的方案。应同时比较货物适配、口岸操作与单证风险。', bestFor: '适用货物', operatingPoint: '操作重点', riskControl: '出运前控制', requestMode: '询问该路线', routeDetail: '路线详情', destinationMatrix: '六个目的地，六套操作方案', destinationMatrixIntro: '每个国家保留独立的口岸、清关体系和末端交付边界。选择目的国即可查看对应工作方案。', complianceTitle: '订舱前必须确认的事项', preAudit: '加入路线预审', eaeu: 'EAEU 海关与技术法规资料核对', national: '目的国进口、过境与交付文件核对', russia: 'EAEU 资料核对，以及制裁、出口管制与交易方筛查', routeEvidence: '规划依据', routeEvidenceBody: '国家成员身份与走廊背景根据当前官方资料核对。具体货物能否承运仍以询价确认结果为准。', sourceEaeu: 'EAEU 成员信息', sourceTir: 'UNECE TIR 运输框架', sourceRussia: '俄罗斯出口管制筛查',
  },
  ru: {
    regionTag: 'ДОСТАВКА ИЗ КИТАЯ В РОССИЮ И ЦЕНТРАЛЬНУЮ АЗИЮ', selectDestination: 'Выберите страну', routeBasis: 'Основа маршрута', entryGateway: 'Пограничный и транзитный узел', destinationScope: 'Зона доставки', customsFrame: 'Таможенный и контрольный режим', planningWindow: 'Плановый срок', quoteConfirmed: 'Срок указан для планирования. Маршрут, место, прием груза и условия на границе подтверждаются в письменной котировке.', modesTitle: 'Сравните доступные транспортные решения', modesIntro: 'Самый короткий рекламный срок не всегда означает надежный план. Сравнивайте груз, границу и документы вместе.', bestFor: 'Подходит для', operatingPoint: 'Операционный акцент', riskControl: 'Контроль до отправки', requestMode: 'Запросить маршрут', routeDetail: 'Детали маршрута', destinationMatrix: 'Шесть направлений, шесть рабочих планов', destinationMatrixIntro: 'У каждой страны свой коридор, таможенная система и объем доставки. Выберите страну, чтобы открыть рабочий план.', complianceTitle: 'Что подтвердить до бронирования', preAudit: 'Добавить в проверку', eaeu: 'Проверка таможенных и технических требований ЕАЭС', national: 'Проверка национальных импортных, транзитных и доставочных документов', russia: 'Проверка ЕАЭС, санкций, экспортного контроля и контрагентов', routeEvidence: 'Основание планирования', routeEvidenceBody: 'Членство стран и контекст коридоров сверены с актуальными официальными источниками. Прием конкретного груза подтверждается отдельно.', sourceEaeu: 'Членство в ЕАЭС', sourceTir: 'Система коридоров UNECE TIR', sourceRussia: 'Экспортный контроль для России',
  },
  fr: {
    regionTag: 'CHINE VERS RUSSIE ET ASIE CENTRALE', selectDestination: 'Choisir la destination', routeBasis: 'Base de l’itinéraire', entryGateway: 'Passage frontalier et transit', destinationScope: 'Périmètre à destination', customsFrame: 'Cadre douanier et de contrôle', planningWindow: 'Délai de planification', quoteConfirmed: 'Indication de planification uniquement. Itinéraire, capacité, acceptation et conditions frontalières sont confirmés dans l’offre.', modesTitle: 'Comparer les solutions de transport possibles', modesIntro: 'Le délai publicitaire le plus court n’est pas toujours le plan le plus fiable. Comparez fret, frontière et documents ensemble.', bestFor: 'Adapté à', operatingPoint: 'Point opérationnel', riskControl: 'Contrôle avant départ', requestMode: 'Demander cet itinéraire', routeDetail: 'Détail de l’itinéraire', destinationMatrix: 'Six destinations, six plans opérationnels', destinationMatrixIntro: 'Chaque pays conserve son passage, son cadre douanier et son périmètre de livraison. Sélectionnez une destination pour ouvrir son dossier.', complianceTitle: 'À confirmer avant réservation', preAudit: 'Ajouter à la revue', eaeu: 'Contrôle douanier et technique de l’UEE', national: 'Contrôle national des documents d’importation, de transit et de livraison', russia: 'Contrôle UEE, sanctions, exportations et contreparties', routeEvidence: 'Base de planification', routeEvidenceBody: 'L’adhésion des pays et le contexte des corridors sont vérifiés sur des sources officielles actuelles. L’acceptation du fret reste propre au devis.', sourceEaeu: 'Adhésion à l’UEE', sourceTir: 'Cadre de corridor TIR de l’UNECE', sourceRussia: 'Contrôle des exportations vers la Russie',
  },
  es: {
    regionTag: 'CHINA HACIA RUSIA Y ASIA CENTRAL', selectDestination: 'Elegir destino', routeBasis: 'Base de ruta', entryGateway: 'Paso fronterizo y tránsito', destinationScope: 'Alcance en destino', customsFrame: 'Marco aduanero y de control', planningWindow: 'Plazo de planificación', quoteConfirmed: 'Dato orientativo. Ruta, espacio, aceptación y condiciones fronterizas se confirman en la cotización.', modesTitle: 'Compare las rutas de transporte viables', modesIntro: 'El plazo publicitario más corto no siempre es el plan más fiable. Compare carga, frontera y documentos en conjunto.', bestFor: 'Adecuado para', operatingPoint: 'Punto operativo', riskControl: 'Control antes de salida', requestMode: 'Solicitar esta ruta', routeDetail: 'Detalle de ruta', destinationMatrix: 'Seis destinos, seis planes operativos', destinationMatrixIntro: 'Cada país conserva su paso, marco aduanero y alcance de entrega. Seleccione un destino para abrir su ficha.', complianceTitle: 'Qué confirmar antes de reservar', preAudit: 'Añadir a la revisión', eaeu: 'Revisión aduanera y técnica de la UEE', national: 'Revisión nacional de importación, tránsito y entrega', russia: 'Revisión UEE, sanciones, control de exportación y contraparte', routeEvidence: 'Base de planificación', routeEvidenceBody: 'La membresía y el contexto de los corredores se verifican con fuentes oficiales actuales. La aceptación de carga se confirma por cotización.', sourceEaeu: 'Membresía de la UEE', sourceTir: 'Marco de corredores TIR de UNECE', sourceRussia: 'Control de exportaciones a Rusia',
  },
  ar: {
    regionTag: 'من الصين إلى روسيا وآسيا الوسطى', selectDestination: 'اختيار الوجهة', routeBasis: 'أساس المسار', entryGateway: 'بوابة الحدود والعبور', destinationScope: 'نطاق الوجهة', customsFrame: 'إطار الجمارك والرقابة', planningWindow: 'المدة التخطيطية', quoteConfirmed: 'مدة إرشادية فقط. يتم تأكيد المسار والسعة وقبول البضائع وظروف الحدود في العرض المكتوب.', modesTitle: 'مقارنة مسارات النقل القابلة للتنفيذ', modesIntro: 'أقصر مدة معلنة ليست دائماً الخطة الأكثر موثوقية. قارن البضائع والحدود والمستندات معاً.', bestFor: 'مناسب لـ', operatingPoint: 'نقطة التشغيل', riskControl: 'التحكم قبل الإرسال', requestMode: 'طلب هذا المسار', routeDetail: 'تفاصيل المسار', destinationMatrix: 'ست وجهات وست خطط تشغيل', destinationMatrixIntro: 'لكل دولة بوابتها وإطارها الجمركي ونطاق تسليمها. اختر الوجهة لفتح ملف العمل.', complianceTitle: 'ما يجب تأكيده قبل الحجز', preAudit: 'إضافة إلى المراجعة', eaeu: 'مراجعة الجمارك واللوائح الفنية للاتحاد الاقتصادي الأوراسي', national: 'مراجعة مستندات الاستيراد والعبور والتسليم الوطنية', russia: 'مراجعة الاتحاد والعقوبات وضوابط التصدير والأطراف', routeEvidence: 'أساس التخطيط', routeEvidenceBody: 'تمت مراجعة العضوية وسياق الممرات بالرجوع إلى مصادر رسمية حالية. قبول الشحنة يبقى مرتبطاً بالعرض.', sourceEaeu: 'عضوية الاتحاد الاقتصادي الأوراسي', sourceTir: 'إطار ممرات TIR لدى UNECE', sourceRussia: 'ضوابط التصدير إلى روسيا',
  },
} as const;

export const EURASIA_DELAY_DIAGNOSTIC: Record<EurasiaLocale, {
  title: string;
  intro: string;
  scope: string;
  faster: string;
  slower: string;
  items: Array<{ title: string; body: string; check: string }>;
  questionsTitle: string;
  questions: string[];
  closing: string;
  sourceCarec: string;
  sourceKazakhstanCustoms: string;
  sourceUzbekistanCustoms: string;
}> = {
  en: {
    title: 'Why can two shipments to Almaty arrive a week apart?',
    intro: 'The route name is only the headline. Train plan, border handling, documents, importer readiness and seasonal capacity determine the working schedule.',
    scope: 'Rail and cross-border corridor diagnostic',
    faster: 'Planned service. Border handover ready.',
    slower: 'Loose wagon or exception. Queue still open.',
    items: [
      { title: 'Gauge-transfer queue', body: 'China uses 1,435 mm track while Kazakhstan and much of the region use 1,520 mm. Containers or cargo units must transfer at the border, and wagon availability affects the queue.', check: 'Confirm the border station, transfer method and current capacity.' },
      { title: 'Block train or loose wagon', body: 'A scheduled block train has a planned departure. Loose wagons may wait for marshalling and an available onward train.', check: 'Ask for the service type and the confirmed departure basis.' },
      { title: 'Document exception', body: 'Commodity description, HS code, invoice, packing list and permits must describe the same shipment. Corrections after arrival add handling time.', check: 'Pre-check the complete document set before factory pickup.' },
      { title: 'Importer and consignee readiness', body: 'The destination party must be able to act in the agreed import role and provide the declarations, permits or conformity documents required for that product.', check: 'Confirm the declarant and importer responsibilities in writing.' },
      { title: 'Season and operating conditions', body: 'Peak volumes, holidays, weather and road conditions can reduce border, terminal and onward-trucking capacity.', check: 'Build a buffer and define an alternative gateway where workable.' },
    ],
    questionsTitle: 'Ask these three questions before accepting a transit claim',
    questions: ['Is the timing a historical average or a written service commitment?', 'Does arrival mean border, destination terminal or final delivery point?', 'If the planned gateway is congested, is an alternative route already approved?'],
    closing: 'The strongest control happens before dispatch. A prepared file turns transport time into waiting for movement, not waiting for missing decisions.',
    sourceCarec: 'CAREC border performance data', sourceKazakhstanCustoms: 'Kazakhstan customs service', sourceUzbekistanCustoms: 'Uzbekistan customs services',
  },
  zh: {
    title: '同样发阿拉木图，为什么能差一周甚至更久？',
    intro: '线路名称只是表面。班列计划、口岸换装、单证、进口方准备度与季节运力，才决定实际进度。',
    scope: '铁路及跨境通道延误诊断',
    faster: '固定计划，口岸交接已准备',
    slower: '零散车皮或异常件，仍在排队',
    items: [
      { title: '口岸换装排队', body: '中国铁路轨距为 1435 mm，哈萨克斯坦及区域内多国使用 1520 mm。集装箱或货物单元需要在口岸换装，车板与作业能力会直接影响排队时间。', check: '确认具体口岸、换装方式和当前作业能力。' },
      { title: '固定班列还是零散车皮', body: '固定班列有计划班次；零散车皮可能需要等待编组和后续车次。两者报价相近，时间基础却不同。', check: '询价时确认服务类型和已落实的发车依据。' },
      { title: '单证异常', body: '品名、HS 编码、发票、箱单与许可文件需要对应同一票货。货到口岸后再改单，会增加处理时间。', check: '工厂提货前完成整套资料预审。' },
      { title: '进口方与收货人准备度', body: '目的国主体需要承担约定的进口角色，并具备该产品所需的申报、许可或符合性资料。', check: '书面确认申报方、进口方和各自责任。' },
      { title: '季节与运行条件', body: '旺季货量、节假日、天气和道路状况会降低口岸、场站及后段卡车的处理能力。', check: '预留合理缓冲，并在可行时预先确认备选口岸。' },
    ],
    questionsTitle: '不要只问几天能到，先问这三个问题',
    questions: ['这个时效是历史平均，还是可写进书面方案的服务承诺？', '所谓到达，是到口岸、到目的站，还是到最终交付点？', '计划口岸拥堵时，是否已经审核过备选路线？'],
    closing: '中亚线路真正的控制点在发货前。前期资料与责任确认到位，运输中的等待才主要是货物在移动，而不是等待补决定。',
    sourceCarec: 'CAREC 口岸绩效数据', sourceKazakhstanCustoms: '哈萨克斯坦海关服务', sourceUzbekistanCustoms: '乌兹别克斯坦海关服务',
  },
  ru: {
    title: 'Почему две отправки в Алматы могут прибыть с разницей в неделю?',
    intro: 'Название маршрута не определяет срок. На график влияют план поезда, перегрузка на границе, документы, готовность импортера и сезонная пропускная способность.',
    scope: 'Диагностика железнодорожного и пограничного маршрута',
    faster: 'Плановый сервис. Передача на границе готова.',
    slower: 'Одиночный вагон или исключение. Очередь не закрыта.',
    items: [
      { title: 'Очередь на смену колеи', body: 'В Китае колея 1 435 мм, а в Казахстане и значительной части региона 1 520 мм. Контейнеры перегружаются на границе, а наличие вагонов влияет на очередь.', check: 'Подтвердите станцию, способ перегрузки и текущую пропускную способность.' },
      { title: 'Контейнерный поезд или одиночный вагон', body: 'У контейнерного поезда есть план отправления. Одиночный вагон может ждать формирования состава и следующего рейса.', check: 'Уточните тип сервиса и подтвержденное основание отправления.' },
      { title: 'Исключение в документах', body: 'Описание, код ТН ВЭД, инвойс, упаковочный лист и разрешения должны относиться к одной партии. Исправления после прибытия требуют времени.', check: 'Проверьте полный пакет до вывоза с завода.' },
      { title: 'Готовность импортера и получателя', body: 'Сторона назначения должна выполнять согласованную роль и иметь декларации, разрешения или документы соответствия для товара.', check: 'Зафиксируйте декларанта, импортера и ответственность письменно.' },
      { title: 'Сезон и условия работы', body: 'Пики объема, праздники, погода и дороги снижают пропускную способность границы, терминала и автодоставки.', check: 'Заложите резерв и согласуйте альтернативный переход, если он применим.' },
    ],
    questionsTitle: 'Три вопроса до принятия обещанного срока',
    questions: ['Это историческое среднее или письменное обязательство по сервису?', 'Прибытие означает границу, терминал назначения или конечный пункт?', 'Есть ли согласованный запасной маршрут при перегрузке перехода?'],
    closing: 'Основной контроль выполняется до отправки. Подготовленный пакет сокращает ожидание решений во время перевозки.',
    sourceCarec: 'Данные CAREC по погранпереходам', sourceKazakhstanCustoms: 'Таможенная служба Казахстана', sourceUzbekistanCustoms: 'Таможенные сервисы Узбекистана',
  },
  fr: {
    title: 'Pourquoi deux envois vers Almaty peuvent-ils arriver à une semaine d’intervalle ?',
    intro: 'Le nom de l’itinéraire ne suffit pas. Le plan ferroviaire, le passage frontalier, les documents, la préparation de l’importateur et la capacité saisonnière déterminent le délai réel.',
    scope: 'Diagnostic ferroviaire et transfrontalier',
    faster: 'Service planifié. Relais frontalier prêt.',
    slower: 'Wagon isolé ou anomalie. File toujours ouverte.',
    items: [
      { title: 'File de transbordement', body: 'La Chine utilise une voie de 1 435 mm, contre 1 520 mm au Kazakhstan et dans une grande partie de la région. Les unités doivent être transférées à la frontière.', check: 'Confirmer la gare, la méthode de transfert et la capacité actuelle.' },
      { title: 'Train bloc ou wagon isolé', body: 'Un train bloc suit un départ planifié. Un wagon isolé peut attendre la formation du convoi et une place disponible.', check: 'Demander le type de service et la base de départ confirmée.' },
      { title: 'Anomalie documentaire', body: 'Description, code SH, facture, colisage et autorisations doivent correspondre au même envoi. Une correction à l’arrivée ajoute du temps.', check: 'Vérifier le dossier complet avant l’enlèvement usine.' },
      { title: 'Préparation de l’importateur', body: 'La partie à destination doit pouvoir tenir le rôle convenu et fournir les déclarations, permis ou documents de conformité requis.', check: 'Confirmer par écrit le déclarant, l’importateur et les responsabilités.' },
      { title: 'Saison et conditions', body: 'Pics de volume, jours fériés, météo et état des routes réduisent la capacité à la frontière, au terminal et sur le dernier trajet.', check: 'Prévoir une marge et valider un passage alternatif si possible.' },
    ],
    questionsTitle: 'Trois questions avant d’accepter un délai',
    questions: ['Est-ce une moyenne historique ou un engagement écrit ?', 'L’arrivée signifie-t-elle frontière, terminal ou point final ?', 'Un itinéraire alternatif est-il déjà approuvé en cas de congestion ?'],
    closing: 'Le contrôle le plus efficace a lieu avant le départ. Un dossier prêt évite d’attendre des décisions pendant le transport.',
    sourceCarec: 'Données frontalières CAREC', sourceKazakhstanCustoms: 'Douanes du Kazakhstan', sourceUzbekistanCustoms: 'Services douaniers d’Ouzbékistan',
  },
  es: {
    title: '¿Por qué dos envíos a Almaty pueden llegar con una semana de diferencia?',
    intro: 'El nombre de la ruta no define el plazo. El plan ferroviario, el transbordo, los documentos, la preparación del importador y la capacidad estacional determinan el calendario real.',
    scope: 'Diagnóstico ferroviario y transfronterizo',
    faster: 'Servicio programado. Relevo fronterizo listo.',
    slower: 'Vagón suelto o incidencia. Cola aún abierta.',
    items: [
      { title: 'Cola de cambio de ancho', body: 'China usa vía de 1.435 mm, mientras Kazajistán y gran parte de la región usan 1.520 mm. Las unidades se transfieren en frontera y la disponibilidad de vagones afecta la espera.', check: 'Confirmar estación, método de transferencia y capacidad actual.' },
      { title: 'Tren bloque o vagón suelto', body: 'Un tren bloque tiene una salida planificada. Un vagón suelto puede esperar formación y espacio en el siguiente tren.', check: 'Preguntar el tipo de servicio y la base de salida confirmada.' },
      { title: 'Incidencia documental', body: 'Descripción, código HS, factura, lista de empaque y permisos deben corresponder al mismo envío. Corregirlos al llegar añade tiempo.', check: 'Revisar el expediente completo antes de retirar de fábrica.' },
      { title: 'Preparación del importador', body: 'La parte en destino debe poder asumir el rol acordado y aportar declaraciones, permisos o conformidad del producto.', check: 'Confirmar por escrito declarante, importador y responsabilidades.' },
      { title: 'Temporada y condiciones', body: 'Picos de volumen, festivos, clima y carreteras reducen la capacidad de frontera, terminal y transporte posterior.', check: 'Añadir margen y aprobar una puerta alternativa cuando sea viable.' },
    ],
    questionsTitle: 'Tres preguntas antes de aceptar un plazo',
    questions: ['¿Es una media histórica o un compromiso escrito?', '¿Llegada significa frontera, terminal de destino o punto final?', '¿Existe una ruta alternativa aprobada si el paso se congestiona?'],
    closing: 'El control más eficaz ocurre antes de la salida. Un expediente listo evita esperar decisiones durante el trayecto.',
    sourceCarec: 'Datos fronterizos CAREC', sourceKazakhstanCustoms: 'Aduanas de Kazajistán', sourceUzbekistanCustoms: 'Servicios aduaneros de Uzbekistán',
  },
  ar: {
    title: 'لماذا قد تصل شحنتان إلى ألماتي بفارق أسبوع؟',
    intro: 'اسم المسار لا يحدد المدة. خطة القطار والمناولة الحدودية والمستندات وجاهزية المستورد والطاقة الموسمية هي التي تحدد الجدول الفعلي.',
    scope: 'تشخيص مسار السكك الحديدية والحدود',
    faster: 'خدمة مجدولة. التسليم الحدودي جاهز.',
    slower: 'عربة منفردة أو استثناء. الانتظار مستمر.',
    items: [
      { title: 'انتظار تغيير عرض السكة', body: 'تستخدم الصين سكة 1,435 مم بينما تستخدم كازاخستان ومعظم المنطقة 1,520 مم. تنقل الوحدات عند الحدود ويؤثر توفر العربات في مدة الانتظار.', check: 'أكد المحطة وطريقة النقل والطاقة التشغيلية الحالية.' },
      { title: 'قطار منتظم أو عربة منفردة', body: 'للقطار المنتظم موعد مخطط، بينما قد تنتظر العربة المنفردة التشكيل والمكان المتاح في القطار التالي.', check: 'اسأل عن نوع الخدمة وأساس موعد الانطلاق المؤكد.' },
      { title: 'استثناء في المستندات', body: 'يجب أن يتطابق الوصف ورمز HS والفاتورة وقائمة التعبئة والتصاريح مع الشحنة نفسها. التصحيح بعد الوصول يضيف وقتاً.', check: 'راجع الملف كاملاً قبل الاستلام من المصنع.' },
      { title: 'جاهزية المستورد والمستلم', body: 'يجب أن يستطيع طرف الوجهة أداء الدور المتفق عليه وتوفير الإقرارات أو التصاريح أو مستندات المطابقة المطلوبة.', check: 'أكد المصرح والمستورد والمسؤوليات كتابياً.' },
      { title: 'الموسم وظروف التشغيل', body: 'ذروة الأحجام والعطلات والطقس والطرق قد تقلل طاقة الحدود والمحطة والنقل اللاحق.', check: 'أضف هامشاً واعتمد بوابة بديلة عندما يكون ذلك ممكناً.' },
    ],
    questionsTitle: 'ثلاثة أسئلة قبل قبول مدة النقل',
    questions: ['هل المدة متوسط تاريخي أم التزام مكتوب؟', 'هل الوصول يعني الحدود أم محطة الوجهة أم نقطة التسليم النهائية؟', 'هل يوجد مسار بديل معتمد عند ازدحام البوابة؟'],
    closing: 'أفضل تحكم يتم قبل الإرسال. الملف الجاهز يمنع انتظار القرارات أثناء حركة البضائع.',
    sourceCarec: 'بيانات CAREC للحدود', sourceKazakhstanCustoms: 'جمارك كازاخستان', sourceUzbekistanCustoms: 'خدمات جمارك أوزبكستان',
  },
};

export const EURASIA_CASE_IMAGES = [
  { src: '/images/operations/central-asia-wheel-hub-case-forklift.webp', key: 'forklift' },
  { src: '/images/operations/central-asia-wheel-hub-case-truck.webp', key: 'truck' },
  { src: '/images/operations/central-asia-wheel-hub-case-product.webp', key: 'product' },
  { src: '/images/operations/central-asia-wheel-hub-case-pallet.webp', key: 'pallet' },
  { src: '/images/operations/central-asia-wheel-hub-case-check.webp', key: 'check' },
] as const;

export const EURASIA_WHEEL_HUB_DESTINATION = localized(
  'Kazakhstan + Uzbekistan',
  '哈萨克斯坦 + 乌兹别克斯坦',
  'Казахстан + Узбекистан',
  'Kazakhstan + Ouzbékistan',
  'Kazajistán + Uzbekistán',
  'كازاخستان + أوزبكستان',
);

export const EURASIA_WHEEL_HUB_CASE: Record<EurasiaLocale, {
  title: string;
  intro: string;
  evidenceNote: string;
  metrics: Array<{ value: string; label: string }>;
  serviceTitle: string;
  steps: string[];
  excluded: string;
  cta: string;
  captions: Record<(typeof EURASIA_CASE_IMAGES)[number]['key'], string>;
}> = {
  en: { title: 'Recent wheel-hub shipment to Kazakhstan and Uzbekistan', intro: 'A heavy, compact pallet planned around destination customs clearance and customer pickup from a local warehouse.', evidenceNote: 'Project evidence shown here records product condition, pallet build, manual checks and origin loading.', metrics: [{ value: '≈54', label: 'wheel hubs per pallet' }, { value: '≈32 kg', label: 'per unit' }, { value: '≈1,900 kg', label: 'gross per pallet' }, { value: '1.2 × 1.2 × 1.4 m', label: 'pallet dimensions' }, { value: '≈2.02 m³', label: 'pallet volume' }], serviceTitle: 'Agreed operating scope', steps: ['China pickup and export coordination', 'International transport to Kazakhstan or Uzbekistan', 'Destination customs clearance', 'Arrival at the local warehouse', 'Notify the customer for self-pickup'], excluded: 'Excluded from this scope: delivery from the warehouse to the customer address.', cta: 'Plan a similar heavy-cargo shipment', captions: { forklift: 'Forklift loading the secured pallet at origin', truck: 'Consolidated truck loading in progress', product: 'Machined wheel-hub assembly before packing', pallet: 'Compact pallet build for dense metal cargo', check: 'Manual packing and stability check' } },
  zh: { title: '近期轮毂项目，发往哈萨克斯坦与乌兹别克斯坦', intro: '针对高密度重货设计托盘方案，服务范围覆盖目的国清关，并由客户在当地仓库自提。', evidenceNote: '以下实拍记录货物状态、托盘配载、人工复核与中国端装车过程。', metrics: [{ value: '约 54 个', label: '每托轮毂数量' }, { value: '约 32 kg', label: '单个重量' }, { value: '约 1,900 kg', label: '每托毛重' }, { value: '1.2 × 1.2 × 1.4 m', label: '每托尺寸' }, { value: '约 2.02 m³', label: '每托体积' }], serviceTitle: '本项目约定服务边界', steps: ['中国境内提货及出口协调', '运输至哈萨克斯坦或乌兹别克斯坦', '目的国清关', '货到当地仓库', '通知客户到仓自提'], excluded: '本次服务不包含从仓库派送至客户地址。', cta: '规划类似重货运输', captions: { forklift: '叉车将加固托盘装入车辆', truck: '整车及拼载货物装车现场', product: '包装前的机加工轮毂总成', pallet: '高密度金属件的紧凑托盘配载', check: '人工检查包装与托盘稳定性' } },
  ru: { title: 'Недавняя отправка ступиц в Казахстан и Узбекистан', intro: 'Тяжелая компактная палета с таможенным оформлением в стране назначения и самовывозом с местного склада.', evidenceNote: 'Фотографии фиксируют состояние товара, формирование палеты, ручную проверку и погрузку в Китае.', metrics: [{ value: 'около 54', label: 'ступиц на палете' }, { value: 'около 32 кг', label: 'вес единицы' }, { value: 'около 1 900 кг', label: 'брутто палеты' }, { value: '1,2 × 1,2 × 1,4 м', label: 'размер палеты' }, { value: 'около 2,02 м³', label: 'объем палеты' }], serviceTitle: 'Согласованный объем работ', steps: ['Забор и экспортная координация в Китае', 'Перевозка в Казахстан или Узбекистан', 'Таможенное оформление в стране назначения', 'Прибытие на местный склад', 'Уведомление клиента о самовывозе'], excluded: 'В объем не входит доставка со склада по адресу клиента.', cta: 'Спланировать перевозку тяжелого груза', captions: { forklift: 'Погрузка закрепленной палеты погрузчиком', truck: 'Погрузка сборного автомобиля', product: 'Механически обработанная ступица до упаковки', pallet: 'Компактная палета для плотного металлического груза', check: 'Ручная проверка упаковки и устойчивости' } },
  fr: { title: 'Expédition récente de moyeux vers le Kazakhstan et l’Ouzbékistan', intro: 'Une palette lourde et compacte avec dédouanement à destination et enlèvement par le client au dépôt local.', evidenceNote: 'Les photos montrent l’état du produit, la palette, le contrôle manuel et le chargement en Chine.', metrics: [{ value: 'environ 54', label: 'moyeux par palette' }, { value: 'environ 32 kg', label: 'par pièce' }, { value: 'environ 1 900 kg', label: 'poids brut' }, { value: '1,2 × 1,2 × 1,4 m', label: 'dimensions' }, { value: 'environ 2,02 m³', label: 'volume' }], serviceTitle: 'Périmètre convenu', steps: ['Enlèvement et coordination export en Chine', 'Transport vers le Kazakhstan ou l’Ouzbékistan', 'Dédouanement à destination', 'Arrivée au dépôt local', 'Avis au client pour enlèvement'], excluded: 'Hors périmètre : livraison du dépôt à l’adresse du client.', cta: 'Planifier un fret lourd similaire', captions: { forklift: 'Chargement de la palette sécurisée au départ', truck: 'Chargement du camion de groupage', product: 'Moyeu usiné avant emballage', pallet: 'Palette compacte pour pièces métalliques denses', check: 'Contrôle manuel de l’emballage et de la stabilité' } },
  es: { title: 'Envío reciente de cubos de rueda a Kazajistán y Uzbekistán', intro: 'Un palé pesado y compacto con despacho en destino y recogida del cliente en el almacén local.', evidenceNote: 'Las fotos documentan el producto, la formación del palé, la revisión manual y la carga en China.', metrics: [{ value: 'aprox. 54', label: 'cubos por palé' }, { value: 'aprox. 32 kg', label: 'por unidad' }, { value: 'aprox. 1.900 kg', label: 'peso bruto' }, { value: '1,2 × 1,2 × 1,4 m', label: 'dimensiones' }, { value: 'aprox. 2,02 m³', label: 'volumen' }], serviceTitle: 'Alcance operativo acordado', steps: ['Recogida y coordinación de exportación en China', 'Transporte a Kazajistán o Uzbekistán', 'Despacho aduanero en destino', 'Llegada al almacén local', 'Aviso al cliente para recogida'], excluded: 'No incluye entrega desde el almacén a la dirección del cliente.', cta: 'Planificar una carga pesada similar', captions: { forklift: 'Carga con carretilla del palé asegurado', truck: 'Carga del camión consolidado', product: 'Conjunto mecanizado antes del embalaje', pallet: 'Palé compacto para carga metálica densa', check: 'Revisión manual de embalaje y estabilidad' } },
  ar: { title: 'شحنة حديثة من محاور العجلات إلى كازاخستان وأوزبكستان', intro: 'منصة ثقيلة ومدمجة مع التخليص في الوجهة واستلام العميل من المستودع المحلي.', evidenceNote: 'توثق الصور حالة المنتج وبناء المنصة والفحص اليدوي والتحميل في الصين.', metrics: [{ value: 'نحو 54', label: 'قطعة في المنصة' }, { value: 'نحو 32 كجم', label: 'للقطعة' }, { value: 'نحو 1,900 كجم', label: 'الوزن الإجمالي' }, { value: '1.2 × 1.2 × 1.4 م', label: 'الأبعاد' }, { value: 'نحو 2.02 م³', label: 'الحجم' }], serviceTitle: 'نطاق العمل المتفق عليه', steps: ['الاستلام وتنسيق التصدير في الصين', 'النقل إلى كازاخستان أو أوزبكستان', 'التخليص الجمركي في الوجهة', 'الوصول إلى المستودع المحلي', 'إشعار العميل للاستلام الذاتي'], excluded: 'لا يشمل النطاق التوصيل من المستودع إلى عنوان العميل.', cta: 'تخطيط شحنة ثقيلة مماثلة', captions: { forklift: 'تحميل المنصة المثبتة بالرافعة', truck: 'تحميل الشاحنة المجمعة', product: 'قطعة مشغلة قبل التعبئة', pallet: 'منصة مدمجة لقطع معدنية كثيفة', check: 'فحص يدوي للتعبئة والثبات' } },
};

export const UZBEKISTAN_ROAD_CASE_IMAGES = [
  { src: '/images/operations/central-asia-uzbekistan-road-loading-overview.webp', key: 'overview' },
  { src: '/images/operations/central-asia-uzbekistan-road-loading-detail.webp', key: 'detail' },
] as const;

type UzbekistanRoadCaseCopy = {
  routeLabel: string;
  route: [string, string, string];
  title: string;
  intro: string;
  evidenceNote: string;
  processTitle: string;
  steps: string[];
  controlTitle: string;
  controlBody: string;
  cta: string;
  captions: Record<(typeof UZBEKISTAN_ROAD_CASE_IMAGES)[number]['key'], string>;
};

export const UZBEKISTAN_ROAD_CASE: Record<EurasiaLocale, UzbekistanRoadCaseCopy> = {
  en: {
    routeLabel: 'Recorded route for this shipment',
    route: ['Jiaozhou loading', 'Horgos gateway', 'Tashkent destination'],
    title: 'Road freight to Tashkent starts with a load that cannot move',
    intro: 'This shipment was loaded in Jiaozhou for road transport via Horgos to Tashkent. The origin team checked the cartons, used timber members as layered blocking and prepared webbing restraints before release.',
    evidenceNote: 'These photographs record the China loading stage only. Border handling, customs release and destination receipt require the records for this shipment.',
    processTitle: 'Five loading controls recorded on site',
    steps: ['Count cartons and check packaging condition', 'Load in sequence against usable trailer space', 'Install timber blocking between cargo layers', 'Apply and check the restraint straps', 'Complete the site check before dispatch'],
    controlTitle: 'A smooth trip is usually prepared before the wheels turn',
    controlBody: 'There was no last-minute vehicle substitution, packing rework or size mismatch during origin loading. That outcome came from closing the cargo count, packing condition, usable dimensions and restraint plan before dispatch.',
    cta: 'Plan a Tashkent road shipment',
    captions: { overview: 'Curtain-side trailer loading overview with carton rows and timber blocking', detail: 'Carton condition and loading sequence recorded inside the trailer' },
  },
  zh: {
    routeLabel: '本票记录路线',
    route: ['胶州装车', '霍尔果斯口岸', '塔什干目的地'],
    title: '发往塔什干的全程汽运，先把货固定在车厢里',
    intro: '本票在胶州装车，经霍尔果斯口岸，以公路运输方式发往乌兹别克斯坦塔什干。中国端装车前核对纸箱状态，码放后使用木方分层阻挡，并按计划完成绑带固定。',
    evidenceNote: '以下照片仅记录中国端装车阶段。口岸操作、清关放行和目的地签收仍应以本票运输文件及节点记录为准。',
    processTitle: '现场记录的五个装车控制点',
    steps: ['核对货物数量与包装状态', '按照车厢有效空间依次码放', '使用木方进行分层阻挡', '完成绑带固定并复核', '现场确认后安排发车'],
    controlTitle: '顺利不是途中解决了多少问题，而是发车前关掉了多少变量',
    controlBody: '本票中国端装车未发生临时换车、包装返工或装载尺寸不符。装进去只是第一步，长距离跨境汽运还需要提前确认货物防移动、阻挡和固定方案。',
    cta: '规划塔什干汽运方案',
    captions: { overview: '侧帘车装载全景，纸箱分层码放并设置木方阻挡', detail: '车厢内部纸箱状态与装载顺序记录' },
  },
  ru: {
    routeLabel: 'Маршрут этой отправки',
    route: ['Погрузка в Цзяочжоу', 'Переход Хоргос', 'Назначение Ташкент'],
    title: 'Автоперевозка в Ташкент начинается с груза, который не смещается',
    intro: 'Партию погрузили в Цзяочжоу для автоперевозки через Хоргос в Ташкент. В Китае проверили коробки, установили послойные деревянные упоры и подготовили стяжные ремни.',
    evidenceNote: 'Фотографии относятся только к этапу погрузки в Китае. Пограничные операции, выпуск и получение подтверждаются документами этой отправки.',
    processTitle: 'Пять контрольных точек погрузки',
    steps: ['Сверить количество и состояние коробок', 'Разместить груз по полезному пространству кузова', 'Установить деревянные упоры между слоями', 'Закрепить и проверить стяжные ремни', 'Завершить осмотр перед отправкой'],
    controlTitle: 'Надёжный рейс готовят до начала движения',
    controlBody: 'При погрузке не потребовались срочная замена машины, переупаковка или исправление несоответствия размеров. Количество, упаковку, размеры и схему крепления закрыли до выпуска.',
    cta: 'Спланировать автоперевозку в Ташкент',
    captions: { overview: 'Общий вид погрузки в шторный полуприцеп с рядами коробок и деревянными упорами', detail: 'Состояние коробок и порядок размещения внутри полуприцепа' },
  },
  fr: {
    routeLabel: 'Itinéraire enregistré pour cet envoi',
    route: ['Chargement à Jiaozhou', 'Passage de Horgos', 'Destination Tachkent'],
    title: 'Le transport routier vers Tachkent commence par un chargement immobilisé',
    intro: 'Cet envoi a été chargé à Jiaozhou pour un transport routier via Horgos jusqu’à Tachkent. L’équipe a contrôlé les cartons, posé des calages bois entre les couches et préparé les sangles.',
    evidenceNote: 'Ces photos documentent uniquement le chargement en Chine. Le passage frontalier, la mainlevée et la réception exigent les documents propres à cet envoi.',
    processTitle: 'Cinq contrôles de chargement relevés sur site',
    steps: ['Compter les cartons et vérifier leur état', 'Charger selon l’espace utile de la remorque', 'Poser des calages bois entre les couches', 'Mettre en place et contrôler les sangles', 'Valider sur site avant le départ'],
    controlTitle: 'Un trajet fluide se prépare avant le premier kilomètre',
    controlBody: 'Aucun changement de véhicule, reconditionnement ou écart de dimensions de dernière minute n’a été nécessaire au chargement. Quantités, emballages, dimensions et arrimage avaient été vérifiés.',
    cta: 'Planifier un transport routier vers Tachkent',
    captions: { overview: 'Vue générale du chargement de la semi-remorque avec cartons et calages bois', detail: 'État des cartons et ordre de chargement à l’intérieur de la remorque' },
  },
  es: {
    routeLabel: 'Ruta registrada para este envío',
    route: ['Carga en Jiaozhou', 'Paso de Horgos', 'Destino Taskent'],
    title: 'El transporte por carretera a Taskent empieza con una carga inmovilizada',
    intro: 'Este envío se cargó en Jiaozhou para viajar por carretera vía Horgos hasta Taskent. En origen se revisaron las cajas, se colocaron bloqueos de madera por capas y se prepararon las cinchas.',
    evidenceNote: 'Las fotos solo documentan la carga en China. El paso fronterizo, el levante y la recepción deben acreditarse con los registros de este envío.',
    processTitle: 'Cinco controles de carga registrados en sitio',
    steps: ['Contar la mercancía y revisar el embalaje', 'Cargar según el espacio útil del remolque', 'Colocar bloqueos de madera entre capas', 'Aplicar y revisar las cinchas', 'Confirmar en sitio antes de la salida'],
    controlTitle: 'Un trayecto fluido se prepara antes de mover el camión',
    controlBody: 'Durante la carga no hubo sustitución urgente de vehículo, retrabajo de embalaje ni dimensiones incompatibles. Cantidades, embalaje, espacio útil y sujeción se cerraron antes de la salida.',
    cta: 'Planificar transporte por carretera a Taskent',
    captions: { overview: 'Vista general de carga en remolque de cortina con cajas y bloqueos de madera', detail: 'Estado de las cajas y secuencia de carga dentro del remolque' },
  },
  ar: {
    routeLabel: 'المسار المسجل لهذه الشحنة',
    route: ['التحميل في جياوتشو', 'معبر خورغوس', 'الوجهة طشقند'],
    title: 'النقل البري إلى طشقند يبدأ بحمولة لا تتحرك',
    intro: 'حملت هذه الشحنة في جياوتشو للنقل البري عبر خورغوس إلى طشقند. راجع فريق المنشأ الصناديق ووضع حواجز خشبية بين الطبقات وجهز أحزمة التثبيت.',
    evidenceNote: 'توثق الصور مرحلة التحميل في الصين فقط. تتطلب إجراءات الحدود والإفراج والاستلام سجلات هذه الشحنة.',
    processTitle: 'خمس نقاط تحكم موثقة في موقع التحميل',
    steps: ['مطابقة العدد وفحص حالة الصناديق', 'التحميل حسب المساحة الفعلية للمقطورة', 'وضع حواجز خشبية بين الطبقات', 'تركيب أحزمة التثبيت وفحصها', 'إتمام الفحص الموقعي قبل الانطلاق'],
    controlTitle: 'الرحلة المنتظمة تبدأ قبل تحرك الشاحنة',
    controlBody: 'لم تتطلب عملية التحميل استبدال مركبة طارئا أو إعادة تعبئة أو معالجة اختلاف في الأبعاد. تم تأكيد العدد والتعبئة والمساحة وخطة التثبيت قبل الإرسال.',
    cta: 'تخطيط نقل بري إلى طشقند',
    captions: { overview: 'مشهد عام لتحميل مقطورة جانبية مع صفوف الصناديق والحواجز الخشبية', detail: 'حالة الصناديق وتسلسل التحميل داخل المقطورة' },
  },
};

export const EURASIA_CHEMICAL_CASE_IMAGES = [
  { src: '/images/operations/central-asia-chemical-case-package.webp', key: 'package' },
  { src: '/images/operations/central-asia-chemical-case-yard.webp', key: 'yard' },
  { src: '/images/operations/central-asia-chemical-case-load-start.webp', key: 'loadStart' },
  { src: '/images/operations/central-asia-chemical-case-load-mid.webp', key: 'loadMid' },
  { src: '/images/operations/central-asia-chemical-case-load-progress.webp', key: 'loadProgress' },
  { src: '/images/operations/central-asia-chemical-case-load-full.webp', key: 'loadFull' },
  { src: '/images/operations/central-asia-chemical-case-secured.webp', key: 'secured' },
] as const;

type ChemicalCaseCopy = {
  destination: string;
  title: string;
  titleLines: [string, string];
  intro: string;
  evidenceNote: string;
  checkpointTitle: string;
  checkpointBody: string;
  checklistTitle: string;
  checkpoints: string[];
  sequenceTitle: string;
  cta: string;
  captions: Record<(typeof EURASIA_CHEMICAL_CASE_IMAGES)[number]['key'], string>;
};

export const EURASIA_CHEMICAL_CASE: Record<EurasiaLocale, ChemicalCaseCopy> = {
  en: {
    destination: 'Kazakhstan | origin loading record',
    title: 'Regulated liquid chemical loading, documented step by step',
    titleLines: ['Regulated liquid chemical loading,', 'documented step by step'],
    intro: 'Seven site photographs show palletized drums, visible hazard labels, staged container loading and the final secured load before dispatch.',
    evidenceNote: 'The photographs are origin evidence only. Product identity, classification, route acceptance, customs release and final delivery require shipment-level records.',
    checkpointTitle: 'Cargo identity comes before the route',
    checkpointBody: 'Before accepting a dangerous-goods booking, the SDS, proper shipping name, UN number, hazard class, packing group, package marks and transport document must describe the same goods. Photographs alone do not establish classification.',
    checklistTitle: 'Five controls before cargo release',
    checkpoints: ['Verify the current SDS and exact product identity', 'Match the proper shipping name, UN number, class and packing group', 'Confirm approved packaging, marks and labels', 'Align invoice, packing list, declaration and transport document', 'Obtain carrier, border and destination acceptance in writing'],
    sequenceTitle: 'Origin evidence sequence',
    cta: 'Request a controlled-cargo route review',
    captions: { package: 'Steel drums grouped on pallets with protective board, wrap and strapping', yard: 'Packed drums staged beside other labelled liquid containers', loadStart: 'First pallet rows positioned inside the lined container', loadMid: 'Loading progresses in paired pallet rows', loadProgress: 'Additional pallet rows placed deeper into the container', loadFull: 'Container filled with labelled drums on timber pallets', secured: 'Final timber barrier and cross-strapping before dispatch' },
  },
  zh: {
    destination: '哈萨克斯坦｜中国端装载记录',
    title: '受管制液体化学品装载，按步骤留存证据',
    titleLines: ['受管制液体化学品装载，', '按步骤留存证据'],
    intro: '七张现场实拍完整记录钢桶托盘、危险标签、分阶段装柜，以及发运前的最终封挡与加固状态。',
    evidenceNote: '照片仅证明中国端包装与装载过程。品名、分类、路线承运、清关放行和最终交付仍需以本票资料为准。',
    checkpointTitle: '先核对货物身份，再谈运输路线',
    checkpointBody: '危险货物订舱前，SDS、正确运输名称、UN 编号、危险类别、包装等级、包装标记及运输单证必须对应同一票货物。不能仅凭照片判断货物分类。',
    checklistTitle: '货物放行前的五项控制',
    checkpoints: ['核验当前有效的 SDS 与准确品名', '核对正确运输名称、UN 编号、类别与包装等级', '确认合规包装、包装标记及危险标签', '统一发票、装箱单、申报资料及运输单证', '书面确认承运人、口岸及目的国接货条件'],
    sequenceTitle: '中国端证据链',
    cta: '申请受控货物路线预审',
    captions: { package: '钢桶按托盘成组，使用护板、缠绕膜与打包带加固', yard: '已包装钢桶与其他带标识液体容器分区待装', loadStart: '首批托盘按双排放入带内衬的集装箱', loadMid: '托盘按成对排布继续装入箱内', loadProgress: '后续托盘逐步向箱门方向完成装载', loadFull: '带标签钢桶按木托盘完成整箱配载', secured: '发运前使用木质封挡和交叉绑带完成最终加固' },
  },
  ru: {
    destination: 'Казахстан | фиксация погрузки в Китае',
    title: 'Погрузка регулируемой жидкой химии с поэтапной фиксацией',
    titleLines: ['Погрузка регулируемой жидкой химии', 'с поэтапной фиксацией'],
    intro: 'Семь фотографий показывают бочки на палетах, маркировку опасности, этапы загрузки контейнера и финальное крепление перед отправкой.',
    evidenceNote: 'Фотографии подтверждают только упаковку и погрузку в Китае. Идентификация, классификация, прием маршрутом, таможенный выпуск и доставка требуют документов по конкретной партии.',
    checkpointTitle: 'Сначала идентификация груза, затем маршрут',
    checkpointBody: 'До бронирования опасного груза SDS, надлежащее отгрузочное наименование, номер ООН, класс, группа упаковки, маркировка и транспортный документ должны относиться к одному товару. Одних фотографий для классификации недостаточно.',
    checklistTitle: 'Пять проверок до выпуска груза',
    checkpoints: ['Проверить актуальный SDS и точное наименование', 'Сверить наименование, номер ООН, класс и группу упаковки', 'Подтвердить тару, маркировку и знаки опасности', 'Согласовать инвойс, упаковочный лист, декларацию и транспортный документ', 'Письменно подтвердить прием перевозчиком, границей и стороной назначения'],
    sequenceTitle: 'Цепочка доказательств в Китае',
    cta: 'Запросить проверку маршрута для контролируемого груза',
    captions: { package: 'Стальные бочки на палете с защитным картоном, пленкой и лентами', yard: 'Упакованные бочки ожидают погрузки рядом с маркированными емкостями', loadStart: 'Первые ряды палет размещены в контейнере с защитной обшивкой', loadMid: 'Погрузка продолжается парными рядами палет', loadProgress: 'Следующие ряды палет размещены в глубине контейнера', loadFull: 'Контейнер заполнен маркированными бочками на деревянных палетах', secured: 'Финальный деревянный барьер и перекрестные стяжки перед отправкой' },
  },
  fr: {
    destination: 'Kazakhstan | preuve de chargement en Chine',
    title: 'Chargement de produits chimiques liquides réglementés, documenté étape par étape',
    titleLines: ['Chargement de produits chimiques liquides réglementés,', 'documenté étape par étape'],
    intro: 'Sept photos montrent les fûts palettisés, les étiquettes de danger, le chargement progressif et l’arrimage final avant départ.',
    evidenceNote: 'Les photos prouvent uniquement l’emballage et le chargement au départ. L’identité, la classification, l’acceptation de la route, la mainlevée et la livraison exigent les documents de l’expédition.',
    checkpointTitle: 'Identifier la marchandise avant de choisir la route',
    checkpointBody: 'Avant toute réservation de marchandises dangereuses, la FDS, la désignation officielle, le numéro ONU, la classe, le groupe d’emballage, les marques et le document de transport doivent décrire le même produit. Une photo ne suffit pas à classifier.',
    checklistTitle: 'Cinq contrôles avant libération',
    checkpoints: ['Vérifier la FDS en vigueur et l’identité exacte du produit', 'Aligner désignation, numéro ONU, classe et groupe d’emballage', 'Confirmer emballages, marques et étiquettes conformes', 'Aligner facture, liste de colisage, déclaration et document de transport', 'Obtenir l’acceptation écrite du transporteur, de la frontière et de la destination'],
    sequenceTitle: 'Chaîne de preuves au départ',
    cta: 'Demander une revue de route pour marchandise contrôlée',
    captions: { package: 'Fûts regroupés sur palette avec carton, film et feuillards', yard: 'Fûts emballés en attente près d’autres conteneurs liquides étiquetés', loadStart: 'Premières rangées de palettes placées dans le conteneur protégé', loadMid: 'Chargement poursuivi par rangées de deux palettes', loadProgress: 'Nouvelles rangées avancées dans le conteneur', loadFull: 'Conteneur rempli de fûts étiquetés sur palettes bois', secured: 'Barrière bois et sangles croisées finales avant départ' },
  },
  es: {
    destination: 'Kazajistán | registro de carga en China',
    title: 'Carga de químicos líquidos regulados, documentada paso a paso',
    titleLines: ['Carga de químicos líquidos regulados,', 'documentada paso a paso'],
    intro: 'Siete fotografías muestran bidones paletizados, etiquetas de peligro, carga progresiva y sujeción final antes de la salida.',
    evidenceNote: 'Las fotos solo acreditan embalaje y carga en origen. Identidad, clasificación, aceptación de ruta, levante aduanero y entrega requieren documentos del envío.',
    checkpointTitle: 'Primero la identidad de la carga, después la ruta',
    checkpointBody: 'Antes de reservar mercancía peligrosa, la SDS, denominación oficial, número ONU, clase, grupo de embalaje, marcas y documento de transporte deben describir el mismo producto. Las fotos no determinan la clasificación.',
    checklistTitle: 'Cinco controles antes de liberar la carga',
    checkpoints: ['Verificar SDS vigente e identidad exacta del producto', 'Alinear denominación, número ONU, clase y grupo de embalaje', 'Confirmar embalajes, marcas y etiquetas aprobados', 'Alinear factura, lista de empaque, declaración y documento de transporte', 'Obtener aceptación escrita de transportista, frontera y destino'],
    sequenceTitle: 'Cadena de pruebas en origen',
    cta: 'Solicitar revisión de ruta para carga controlada',
    captions: { package: 'Bidones agrupados en palé con cartón, película y flejes', yard: 'Bidones embalados junto a otros contenedores líquidos etiquetados', loadStart: 'Primeras filas de palés dentro del contenedor protegido', loadMid: 'Carga progresiva en filas de dos palés', loadProgress: 'Filas adicionales colocadas hacia el interior', loadFull: 'Contenedor lleno con bidones etiquetados sobre palés de madera', secured: 'Barrera de madera y cinchas cruzadas antes de la salida' },
  },
  ar: {
    destination: 'كازاخستان | سجل التحميل في الصين',
    title: 'تحميل مادة كيميائية سائلة خاضعة للرقابة مع توثيق كل مرحلة',
    titleLines: ['تحميل مادة كيميائية سائلة خاضعة للرقابة', 'مع توثيق كل مرحلة'],
    intro: 'توضح سبع صور البراميل على المنصات وملصقات الخطر ومراحل تحميل الحاوية والتثبيت النهائي قبل الإرسال.',
    evidenceNote: 'تثبت الصور التعبئة والتحميل في الصين فقط. تتطلب هوية المنتج وتصنيفه وقبول المسار والإفراج الجمركي والتسليم مستندات خاصة بالشحنة.',
    checkpointTitle: 'تأكيد هوية الشحنة قبل اختيار المسار',
    checkpointBody: 'قبل حجز البضائع الخطرة يجب أن تصف صحيفة بيانات السلامة واسم الشحن الصحيح ورقم الأمم المتحدة والفئة ومجموعة التعبئة والعلامات ومستند النقل المنتج نفسه. الصور وحدها لا تثبت التصنيف.',
    checklistTitle: 'خمس مراجعات قبل الإفراج عن الشحنة',
    checkpoints: ['مراجعة صحيفة بيانات السلامة السارية وهوية المنتج', 'مطابقة اسم الشحن ورقم الأمم المتحدة والفئة ومجموعة التعبئة', 'تأكيد العبوة والعلامات وملصقات الخطر المعتمدة', 'مطابقة الفاتورة وقائمة التعبئة والإقرار ومستند النقل', 'الحصول على قبول مكتوب من الناقل والحدود والوجهة'],
    sequenceTitle: 'سلسلة أدلة التحميل في الصين',
    cta: 'طلب مراجعة مسار لبضائع خاضعة للرقابة',
    captions: { package: 'براميل فولاذية على منصة مع كرتون واق وفيلم وأحزمة', yard: 'براميل معبأة بجوار حاويات سوائل تحمل ملصقات', loadStart: 'وضع الصفوف الأولى من المنصات داخل الحاوية المبطنة', loadMid: 'استمرار التحميل في صفوف مزدوجة', loadProgress: 'إضافة صفوف جديدة في عمق الحاوية', loadFull: 'حاوية محملة ببراميل معنونة على منصات خشبية', secured: 'حاجز خشبي وأحزمة متقاطعة قبل الإرسال' },
  },
};

const SUPPLEMENTAL_COPY = {
  en: {
    headline: (country: string) => `Freight from China to ${country}`,
    subheadline: (destinations: string) => `Plan rail, road, multimodal and air freight to ${destinations} with written border and delivery scope.`,
    solutionsTitle: 'Build the route before cargo release',
    solutionsSubtitle: 'Confirm the corridor, document set and delivery boundary before the shipment leaves the supplier.',
    documentTitle: 'Document and consignee alignment',
    documentDesc: (customs: string) => `Match product descriptions, values, consignee data and ${customs.toLowerCase()} before booking.`,
    corridorTitle: 'Corridor and border confirmation',
    corridorDesc: (gateway: string) => `Confirm the planned gateway, operating handoffs and change-control process for ${gateway}.`,
    deliveryTitle: 'Destination handoff scope',
    deliveryDesc: (destinations: string) => `Define customs responsibility, unloading, local delivery and the final handoff for ${destinations}.`,
    modes: [
      ['Rail freight', 'Heavy, containerized and schedule-tolerant cargo.', 'Confirm departure, gauge transfer and destination terminal.', 'Space, border operations and route changes can move the schedule.'],
      ['Cross-border trucking', 'Consolidated commercial cargo and flexible door delivery.', 'Confirm vehicle, axle load, border handoff and unloading plan.', 'Waiting time and road controls must be priced and allocated in writing.'],
      ['Rail-road multimodal', 'Destinations requiring an onward transit or regional handoff.', 'Confirm every transit country, document owner and final-mile provider.', 'A route change can affect transit documents, insurance and delivery timing.'],
      ['Air freight', 'Urgent spares, samples and higher-value cargo.', 'Confirm flight acceptance and destination release requirements.', 'Batteries, liquids, powders and controlled items need prior acceptance.'],
    ],
    faqs: [
      ['Is the displayed transit time guaranteed?', 'No. It is a planning window. The written quotation must name the route, cargo acceptance, departure basis, border handoffs and delivery scope.'],
      ['What information is needed for a route review?', 'Provide supplier locations, cargo-ready date, product and HS proposal, packages, weight, volume, controlled-goods details, consignee and final delivery point.'],
      ['Can DDP or DDU be arranged?', 'Feasibility depends on the product, importer, corridor and current controls. Duties, taxes, exclusions and the importer of record must be confirmed in writing.'],
    ],
  },
  zh: {
    headline: (country: string) => `中国到${country}货运`, subheadline: (destinations: string) => `围绕${destinations}规划铁路、公路、多式联运与空运，并书面确认口岸和交付边界。`, solutionsTitle: '先确定路线，再放行货物', solutionsSubtitle: '货物离开供应商前，应确认运输通道、单证资料与目的地交付责任。', documentTitle: '单证与收货人信息一致', documentDesc: (customs: string) => `订舱前核对品名、货值、收货人信息及${customs}。`, corridorTitle: '通道与口岸确认', corridorDesc: (gateway: string) => `针对${gateway}确认计划口岸、操作交接和路线变更机制。`, deliveryTitle: '目的地交付边界', deliveryDesc: (destinations: string) => `明确${destinations}的清关责任、卸货设备、本地派送和最终交接点。`, modes: [['铁路运输','适合重货、集装箱货物及可按班期规划的货物。','确认班期、换轨换装和目的地铁路站点。','舱位、口岸操作及路线变化可能影响时效。'],['跨境公路卡航','适合集拼商业货物及灵活的门到门交付。','确认车辆、轴重、口岸交接和卸货方案。','等待时间和道路检查成本应在报价中明确。'],['铁公多式联运','适合需要继续中转或区域交接的目的地。','确认每个过境国家、单证责任方和末端承运方。','路线变化可能影响过境文件、保险和交付时间。'],['空运','适合紧急备件、样品和高货值货物。','确认航班接货条件和目的地提货资料。','电池、液体、粉末及受控产品需预先确认。']], faqs: [['页面时效是否保证？','不保证。页面展示的是规划区间，书面报价需明确路线、货物接受条件、班期依据、口岸交接和交付范围。'],['路线预审需要哪些资料？','请提供供应商地址、备货日期、产品与 HS 编码建议、件数、重量、体积、受控货物信息、收货人与最终交付点。'],['能否提供 DDP 或 DDU？','是否可行取决于产品、进口方、运输通道与当前管制。税费、除外项目和进口主体需书面确认。']],
  },
  ru: {
    headline: (country: string) => `Китай - ${country}: грузоперевозки`, subheadline: (destinations: string) => `Железнодорожные, автомобильные, мультимодальные и авиамаршруты. Направления: ${destinations}. Границы и доставка фиксируются письменно.`, solutionsTitle: 'Сначала маршрут, затем выпуск груза', solutionsSubtitle: 'До вывоза от поставщика подтвердите коридор, пакет документов и границы доставки.', documentTitle: 'Единые данные получателя и груза', documentDesc: (customs: string) => `До бронирования сверяем описание, стоимость, получателя и требования: ${customs.toLowerCase()}.`, corridorTitle: 'Подтверждение коридора и границы', corridorDesc: (gateway: string) => `Для маршрута ${gateway} фиксируем переходы, ответственных и порядок изменения маршрута.`, deliveryTitle: 'Границы доставки', deliveryDesc: (destinations: string) => `Направления: ${destinations}. Письменно определяем таможню, выгрузку, местную доставку и финальную передачу.`, modes: [['Железнодорожная перевозка','Тяжелые, контейнерные и плановые партии.','Подтвердите отправление, перегрузку и терминал назначения.','Место, граница и изменение маршрута могут повлиять на график.'],['Международная автоперевозка','Сборные коммерческие партии и гибкая доставка до двери.','Подтвердите автомобиль, осевые нагрузки, границу и выгрузку.','Ожидание и дорожный контроль фиксируются в котировке.'],['Железнодорожно-автомобильная схема','Направления с транзитом и региональной передачей.','Подтвердите страны транзита, владельца документов и последнюю милю.','Смена маршрута влияет на транзитные документы, страхование и срок.'],['Авиадоставка','Срочные запчасти, образцы и дорогие товары.','Подтвердите прием авиалинией и выдачу в аэропорту назначения.','Батареи, жидкости, порошки и контролируемые товары согласуются заранее.']], faqs: [['Гарантирован ли указанный срок?','Нет. Это диапазон для планирования. В котировке фиксируются маршрут, прием груза, отправление, пограничные операции и доставка.'],['Какие данные нужны для проверки маршрута?','Нужны адреса поставщиков, дата готовности, товар и код ТН ВЭД, места, вес, объем, сведения о контролируемом грузе, получатель и адрес доставки.'],['Возможна ли доставка DDP или DDU?','Возможность зависит от товара, импортера, коридора и текущих ограничений. Пошлины, налоги, исключения и импортер фиксируются письменно.']],
  },
  fr: {
    headline: (country: string) => `Fret de Chine vers ${country}`, subheadline: (destinations: string) => `Planifiez le rail, la route, le multimodal et l'aérien vers ${destinations}, avec un périmètre frontalier et de livraison écrit.`, solutionsTitle: 'Définir l’itinéraire avant la sortie du fret', solutionsSubtitle: 'Confirmez le corridor, les documents et la limite de livraison avant l’enlèvement chez le fournisseur.', documentTitle: 'Alignement des documents et du destinataire', documentDesc: (customs: string) => `Vérifiez la désignation, la valeur, le destinataire et les exigences suivantes avant réservation : ${customs.toLowerCase()}.`, corridorTitle: 'Confirmation du corridor et de la frontière', corridorDesc: (gateway: string) => `Confirmez le passage prévu, les relais opérationnels et la procédure de changement pour ${gateway}.`, deliveryTitle: 'Périmètre de remise à destination', deliveryDesc: (destinations: string) => `Définissez le dédouanement, le déchargement, la livraison locale et la remise finale pour ${destinations}.`, modes: [['Fret ferroviaire','Fret lourd, conteneurisé et compatible avec un calendrier planifié.','Confirmer le départ, le transbordement et le terminal de destination.','La capacité, la frontière et les changements d’itinéraire peuvent modifier le délai.'],['Transport routier transfrontalier','Fret commercial groupé et livraison porte à porte flexible.','Confirmer le véhicule, la charge par essieu, la remise frontalière et le déchargement.','Les attentes et contrôles routiers doivent être chiffrés et attribués par écrit.'],['Multimodal rail-route','Destinations nécessitant un transit ou une remise régionale.','Confirmer chaque pays de transit, le responsable documentaire et le dernier kilomètre.','Un changement de route peut affecter le transit, l’assurance et le délai.'],['Fret aérien','Pièces urgentes, échantillons et marchandises de valeur.','Confirmer l’acceptation du vol et les exigences de mainlevée à destination.','Les batteries, liquides, poudres et produits contrôlés exigent un accord préalable.']], faqs: [['Le délai affiché est-il garanti ?','Non. Il s’agit d’une fenêtre de planification. L’offre écrite doit préciser l’itinéraire, l’acceptation du fret, la base de départ, les relais frontaliers et la livraison.'],['Quelles informations fournir pour la revue ?','Indiquez les adresses fournisseurs, la date de disponibilité, le produit et le code SH proposé, les colis, le poids, le volume, les produits contrôlés, le destinataire et le point final.'],['Une livraison DDP ou DDU est-elle possible ?','Cela dépend du produit, de l’importateur, du corridor et des contrôles en vigueur. Droits, taxes, exclusions et importateur officiel doivent être confirmés par écrit.']],
  },
  es: {
    headline: (country: string) => `Transporte de China a ${country}`, subheadline: (destinations: string) => `Planifique ferrocarril, carretera, transporte multimodal y aéreo a ${destinations}, con límites fronterizos y de entrega por escrito.`, solutionsTitle: 'Defina la ruta antes de liberar la carga', solutionsSubtitle: 'Confirme corredor, documentos y alcance de entrega antes de retirar la carga del proveedor.', documentTitle: 'Alineación de documentos y consignatario', documentDesc: (customs: string) => `Antes de reservar, revise descripción, valor, consignatario y estos requisitos: ${customs.toLowerCase()}.`, corridorTitle: 'Confirmación de corredor y frontera', corridorDesc: (gateway: string) => `Confirme el paso previsto, los relevos operativos y el proceso de cambio para ${gateway}.`, deliveryTitle: 'Alcance de entrega en destino', deliveryDesc: (destinations: string) => `Defina despacho, descarga, entrega local y punto final para ${destinations}.`, modes: [['Transporte ferroviario','Carga pesada, en contenedor y compatible con un calendario planificado.','Confirmar salida, transbordo y terminal de destino.','El espacio, la frontera y los cambios de ruta pueden alterar el plazo.'],['Camión transfronterizo','Carga comercial consolidada y entrega flexible puerta a puerta.','Confirmar vehículo, carga por eje, relevo fronterizo y descarga.','La espera y los controles de carretera deben cotizarse y asignarse por escrito.'],['Multimodal ferrocarril-carretera','Destinos que requieren tránsito posterior o relevo regional.','Confirmar cada país de tránsito, responsable documental y última milla.','Un cambio de ruta puede afectar tránsito, seguro y plazo de entrega.'],['Transporte aéreo','Repuestos urgentes, muestras y mercancía de mayor valor.','Confirmar aceptación del vuelo y requisitos de liberación en destino.','Baterías, líquidos, polvos y artículos controlados requieren aceptación previa.']], faqs: [['¿El plazo mostrado está garantizado?','No. Es una ventana de planificación. La cotización escrita debe indicar ruta, aceptación, base de salida, relevos fronterizos y alcance de entrega.'],['¿Qué datos requiere la revisión de ruta?','Indique direcciones de proveedores, fecha de disponibilidad, producto y código HS propuesto, bultos, peso, volumen, mercancía controlada, consignatario y punto final.'],['¿Se puede organizar DDP o DDU?','Depende del producto, importador, corredor y controles vigentes. Aranceles, impuestos, exclusiones e importador registrado deben confirmarse por escrito.']],
  },
  ar: {
    headline: (country: string) => `الشحن من الصين إلى ${country}`, subheadline: (destinations: string) => `خطط للنقل بالسكك الحديدية والطرق والنقل متعدد الوسائط والجوي إلى ${destinations} مع تحديد مكتوب لنطاق الحدود والتسليم.`, solutionsTitle: 'ثبّت المسار قبل خروج البضائع', solutionsSubtitle: 'أكد الممر والمستندات وحدود التسليم قبل استلام الشحنة من المورد.', documentTitle: 'مطابقة المستندات وبيانات المستلم', documentDesc: (customs: string) => `راجع وصف المنتج والقيمة وبيانات المستلم والمتطلبات التالية قبل الحجز: ${customs}.`, corridorTitle: 'تأكيد الممر والحدود', corridorDesc: (gateway: string) => `أكد البوابة المخططة ونقاط التسليم التشغيلي وآلية تغيير المسار عبر ${gateway}.`, deliveryTitle: 'نطاق التسليم في الوجهة', deliveryDesc: (destinations: string) => `حدد مسؤولية التخليص والتفريغ والتوصيل المحلي والتسليم النهائي في ${destinations}.`, modes: [['الشحن بالسكك الحديدية','للبضائع الثقيلة والمحمولة بالحاويات والقابلة للتخطيط.','تأكيد موعد الانطلاق وإعادة التحميل ومحطة الوجهة.','قد تؤثر السعة والحدود وتغييرات المسار في المدة.'],['النقل البري عبر الحدود','للبضائع التجارية المجمعة والتوصيل المرن حتى الباب.','تأكيد المركبة وحمولة المحاور والتسليم الحدودي وخطة التفريغ.','يجب تسعير وقت الانتظار وفحوص الطرق وتوزيع المسؤولية كتابياً.'],['نقل متعدد الوسائط','للوجهات التي تحتاج عبوراً إضافياً أو تسليماً إقليمياً.','تأكيد دول العبور ومسؤول المستندات ومقدم خدمة الميل الأخير.','قد يؤثر تغيير المسار في مستندات العبور والتأمين وموعد التسليم.'],['الشحن الجوي','لقطع الغيار العاجلة والعينات والبضائع الأعلى قيمة.','تأكيد قبول الرحلة ومتطلبات الإفراج في الوجهة.','تحتاج البطاريات والسوائل والمساحيق والمواد الخاضعة للرقابة إلى قبول مسبق.']], faqs: [['هل مدة النقل المعروضة مضمونة؟','لا. هي نافذة للتخطيط. يجب أن يحدد العرض المكتوب المسار وقبول البضائع وأساس الانطلاق ونقاط الحدود ونطاق التسليم.'],['ما المعلومات المطلوبة لمراجعة المسار؟','قدم عناوين الموردين وتاريخ الجاهزية والمنتج ورمز HS المقترح والطرود والوزن والحجم والمواد الخاضعة للرقابة والمستلم ونقطة التسليم النهائية.'],['هل يمكن ترتيب DDP أو DDU؟','تعتمد الإمكانية على المنتج والمستورد والممر والضوابط الحالية. يجب تأكيد الرسوم والضرائب والاستثناءات والمستورد المسجل كتابياً.']],
  },
} as const;

export function localizedCountryName(country: EurasiaCountry, locale: EurasiaLocale) {
  return EURASIA_CORRIDORS[country].name[locale];
}

export function localizedCorridorProfile(country: EurasiaCountry, locale: EurasiaLocale) {
  const profile = EURASIA_CORRIDORS[country];
  return {
    ...profile,
    name: profile.name[locale],
    destinations: profile.destinations[locale],
    gateway: profile.gateway[locale],
    transitDays: profile.transitDays[locale],
    airDays: profile.airDays[locale],
    customs: EURASIA_UI[locale][profile.customsRegime],
  };
}

export function buildSupplementalCorridorSpec(country: EurasiaCountry, locale: EurasiaLocale) {
  const profile = localizedCorridorProfile(country, locale);
  const copy = SUPPLEMENTAL_COPY[locale];
  const ui = EURASIA_UI[locale];
  const modeDays = [profile.transitDays, profile.transitDays, profile.transitDays, profile.airDays];
  return {
    seoTitle: copy.headline(profile.name) + ' | DDNZ Global',
    seoDesc: copy.subheadline(profile.destinations),
    headline: copy.headline(profile.name),
    subheadline: copy.subheadline(profile.destinations),
    transitWindow: ui.planningWindow,
    transitDays: profile.transitDays,
    complianceRowTitle: ui.customsFrame,
    complianceRowVal: ui.quoteConfirmed,
    solutionsTitle: copy.solutionsTitle,
    solutionsSubtitle: copy.solutionsSubtitle,
    solutions: [
      { title: copy.documentTitle, desc: copy.documentDesc(profile.customs), icon: 'FileText' },
      { title: copy.corridorTitle, desc: copy.corridorDesc(profile.gateway), icon: 'Scale' },
      { title: copy.deliveryTitle, desc: copy.deliveryDesc(profile.destinations), icon: 'ShieldCheck' },
    ],
    multimodalTable: copy.modes.map(([mode, suitability, sellingPoint, warning], index) => ({
      mode,
      days: modeDays[index],
      suitability,
      sellingPoint,
      warning,
    })),
    faqs: copy.faqs.map(([q, a]) => ({ q, a })),
  };
}
