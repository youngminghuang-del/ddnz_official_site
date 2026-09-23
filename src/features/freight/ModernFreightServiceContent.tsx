import ptCopy from './locales/modern-pt.json';
import trCopy from './locales/modern-tr.json';
import type { Language } from '../../i18n/translations';
import { freightLanguagePrefix } from './freightLanguages';

export const modernizedFreightServicePaths = [
  'services/air-freight',
  'services/amazon-fba',
  'services/warehouse-services',
] as const;

export type ModernFreightServicePath = typeof modernizedFreightServicePaths[number];
type ModernServiceLocale = Language;

type ServiceCopy = {
  title: string;
  tag: string;
  intro: string;
  decisionTitle: string;
  decisions: string[][];
  checks: string[];
  brief: string[];
  close: string;
};

type SharedCopy = {
  primary: string;
  secondary: string;
  chapters: string[];
  planKicker: string;
  planIntro: string;
  evidenceKicker: string;
  evidenceTitle: string;
  evidenceIntro: string;
  evidenceNote: string;
  controlsKicker: string;
  controlsTitle: string;
  quoteChecks: string;
  sendUs: string;
  processKicker: string;
  processTitle: string;
  steps: string[][];
  closeKicker: string;
  signature: string;
  fieldRecord: string;
};

const shared: Record<ModernServiceLocale, SharedCopy> = {
  pt: ptCopy.shared as SharedCopy,
  tr: trCopy.shared as SharedCopy,
  en: {
    primary: 'Plan this service', secondary: 'See origin records',
    chapters: ['Service choice', 'Origin evidence', 'Quote controls', 'Handover'],
    planKicker: '01 / SERVICE DECISION', planIntro: 'Choose the operating scope before comparing a headline rate. The cargo, handover point and destination responsibility change the plan.',
    evidenceKicker: '02 / CHINA-ORIGIN RECORDS', evidenceTitle: 'The work before the international leg.', evidenceIntro: 'These records show China-side receiving, checking and loading controls. They are not presented as airline, Amazon or destination-delivery proof.', evidenceNote: 'Origin-operation evidence · Shipment-specific records are supplied within the confirmed service scope.',
    controlsKicker: '03 / QUOTE CONTROLS', controlsTitle: 'A useful quote starts with the right inputs.', quoteChecks: 'What the quotation should confirm', sendUs: 'What to send us',
    processKicker: '04 / OPERATING HANDOVER', processTitle: 'Four accountable handovers.',
    steps: [['Brief', 'Record the cargo, suppliers, destination and requested service scope.'], ['Check', 'Review packaging, labels, quantities and any declared special handling.'], ['Confirm', 'Confirm the operating plan, exclusions, documents and charge basis in the quotation.'], ['Release', 'Record dispatch details and hand the shipment to the agreed next operator.']],
    closeKicker: 'START WITH THE ACTUAL CARGO', signature: 'DDNZ coordinates sourcing and export handover · International freight executed by Heaven Born', fieldRecord: 'ORIGIN OPERATIONS',
  },
  zh: {
    primary: '规划这项服务', secondary: '查看始发端记录',
    chapters: ['服务选择', '始发端证据', '报价核对', '操作交接'],
    planKicker: '01 / 服务决策', planIntro: '先确认操作范围，再比较表面运价。货物情况、交接地点和目的地责任都会改变实际方案。',
    evidenceKicker: '02 / 中国始发端记录', evidenceTitle: '国际运输开始前，现场做了什么。', evidenceIntro: '以下素材记录中国端的收货、核对与装载动作，不作为航空公司、亚马逊仓或目的地交付证明。', evidenceNote: '始发端操作证据 · 每票货的专属记录按最终确认的服务范围提供。',
    controlsKicker: '03 / 报价控制', controlsTitle: '有用的报价，从正确资料开始。', quoteChecks: '报价中应确认的事项', sendUs: '请提供给我们的资料',
    processKicker: '04 / 操作交接', processTitle: '四个清楚的责任交接点。',
    steps: [['需求', '记录货物、供应商、目的地和希望包含的服务范围。'], ['核对', '检查包装、标签、数量以及已申报的特殊操作要求。'], ['确认', '在报价中确认操作方案、排除项、文件和计费口径。'], ['放行', '记录出库信息，并将货物交给已确认的下一环节执行方。']],
    closeKicker: '从真实货物信息开始', signature: 'DDNZ 协调采购与出口交接 · 国际货运由华正邦泰执行', fieldRecord: '始发端操作',
  },
  ru: {
    primary: 'Спланировать услугу', secondary: 'Записи операций',
    chapters: ['Выбор услуги', 'Операции в Китае', 'Проверка расчёта', 'Передача'],
    planKicker: '01 / ВЫБОР УСЛУГИ', planIntro: 'Сначала определите объём работ, затем сравнивайте ставку. Груз, точка передачи и ответственность в стране назначения меняют весь план.',
    evidenceKicker: '02 / ОПЕРАЦИИ В КИТАЕ', evidenceTitle: 'Работа до международного плеча.', evidenceIntro: 'Материалы показывают приёмку, проверку и погрузку в Китае. Это не доказательство авиаперевозки, приёмки Amazon или доставки в стране назначения.', evidenceNote: 'Доказательства операций в Китае · Записи по конкретной партии предоставляются в согласованном объёме услуги.',
    controlsKicker: '03 / КОНТРОЛЬ РАСЧЁТА', controlsTitle: 'Точный расчёт начинается с правильных данных.', quoteChecks: 'Что должен подтвердить расчёт', sendUs: 'Что прислать нам',
    processKicker: '04 / ПЕРЕДАЧА ГРУЗА', processTitle: 'Четыре ответственные передачи.',
    steps: [['Заявка', 'Зафиксировать груз, поставщиков, пункт назначения и требуемый объём услуги.'], ['Проверка', 'Проверить упаковку, маркировку, количество и заявленные особые условия.'], ['Подтверждение', 'Указать в расчёте план, исключения, документы и основу начислений.'], ['Выпуск', 'Зафиксировать отправку и передать груз согласованному следующему оператору.']],
    closeKicker: 'НАЧНИТЕ С ФАКТИЧЕСКИХ ДАННЫХ ГРУЗА', signature: 'DDNZ координирует закупку и экспортную передачу · Перевозку выполняет Heaven Born', fieldRecord: 'ОПЕРАЦИИ В КИТАЕ',
  },
  fr: {
    primary: 'Planifier ce service', secondary: 'Voir les opérations',
    chapters: ['Choix du service', 'Preuves en Chine', 'Contrôle du devis', 'Transmission'],
    planKicker: '01 / CHOIX DU SERVICE', planIntro: 'Définissez le périmètre opérationnel avant de comparer un tarif. La marchandise, le point de remise et les responsabilités à destination modifient le plan.',
    evidenceKicker: '02 / OPÉRATIONS EN CHINE', evidenceTitle: 'Le travail avant le transport international.', evidenceIntro: 'Ces images montrent la réception, le contrôle et le chargement en Chine. Elles ne prouvent ni un vol, ni une réception Amazon, ni une livraison à destination.', evidenceNote: 'Preuves d’opérations en Chine · Les dossiers propres à l’expédition sont fournis selon le périmètre confirmé.',
    controlsKicker: '03 / CONTRÔLE DU DEVIS', controlsTitle: 'Un devis utile commence par les bonnes données.', quoteChecks: 'Ce que le devis doit confirmer', sendUs: 'Ce qu’il faut nous envoyer',
    processKicker: '04 / TRANSMISSION OPÉRATIONNELLE', processTitle: 'Quatre transmissions responsables.',
    steps: [['Brief', 'Consigner la marchandise, les fournisseurs, la destination et le périmètre demandé.'], ['Contrôle', 'Vérifier emballage, étiquettes, quantités et manutentions particulières déclarées.'], ['Confirmation', 'Confirmer plan, exclusions, documents et base tarifaire dans le devis.'], ['Libération', 'Enregistrer l’expédition et remettre la marchandise à l’opérateur suivant convenu.']],
    closeKicker: 'COMMENÇONS PAR LA MARCHANDISE RÉELLE', signature: 'DDNZ coordonne les achats et la remise export · Fret international exécuté par Heaven Born', fieldRecord: 'OPÉRATIONS EN CHINE',
  },
  es: {
    primary: 'Planificar el servicio', secondary: 'Ver operaciones',
    chapters: ['Elección del servicio', 'Pruebas en China', 'Control de cotización', 'Entrega operativa'],
    planKicker: '01 / DECISIÓN DE SERVICIO', planIntro: 'Defina el alcance operativo antes de comparar una tarifa. La carga, el punto de entrega y las responsabilidades en destino cambian el plan.',
    evidenceKicker: '02 / OPERACIONES EN CHINA', evidenceTitle: 'El trabajo previo al tramo internacional.', evidenceIntro: 'Estas imágenes muestran recepción, revisión y carga en China. No se presentan como prueba de vuelo, recepción de Amazon o entrega en destino.', evidenceNote: 'Pruebas de operaciones en origen · Los registros específicos se entregan según el alcance confirmado.',
    controlsKicker: '03 / CONTROL DE COTIZACIÓN', controlsTitle: 'Una cotización útil empieza con los datos correctos.', quoteChecks: 'Qué debe confirmar la cotización', sendUs: 'Qué debe enviarnos',
    processKicker: '04 / ENTREGA OPERATIVA', processTitle: 'Cuatro entregas con responsable.',
    steps: [['Solicitud', 'Registrar carga, proveedores, destino y alcance solicitado.'], ['Revisión', 'Comprobar embalaje, etiquetas, cantidades y manipulación especial declarada.'], ['Confirmación', 'Confirmar plan, exclusiones, documentos y base de cobro en la cotización.'], ['Salida', 'Registrar el despacho y entregar la carga al siguiente operador acordado.']],
    closeKicker: 'EMPECEMOS POR LA CARGA REAL', signature: 'DDNZ coordina compras y entrega de exportación · Heaven Born ejecuta el transporte internacional', fieldRecord: 'OPERACIONES EN ORIGEN',
  },
  ar: {
    primary: 'خطط لهذه الخدمة', secondary: 'شاهد عمليات المنشأ',
    chapters: ['اختيار الخدمة', 'أدلة المنشأ', 'ضوابط العرض', 'التسليم التشغيلي'],
    planKicker: '01 / قرار الخدمة', planIntro: 'حدد نطاق التشغيل قبل مقارنة السعر. نوع البضاعة ونقطة التسليم ومسؤوليات الوجهة تغيّر الخطة الفعلية.',
    evidenceKicker: '02 / عمليات المنشأ في الصين', evidenceTitle: 'العمل الذي يسبق مرحلة النقل الدولي.', evidenceIntro: 'توضح هذه الصور الاستلام والفحص والتحميل في الصين، ولا تُعرض كدليل على رحلة جوية أو استلام Amazon أو التسليم في الوجهة.', evidenceNote: 'أدلة عمليات المنشأ · تُقدّم سجلات الشحنة المحددة ضمن نطاق الخدمة المؤكد.',
    controlsKicker: '03 / ضوابط عرض السعر', controlsTitle: 'عرض السعر المفيد يبدأ بالبيانات الصحيحة.', quoteChecks: 'ما الذي يجب أن يؤكده العرض', sendUs: 'ما الذي ترسله إلينا',
    processKicker: '04 / التسليم التشغيلي', processTitle: 'أربع نقاط تسليم بمسؤولية واضحة.',
    steps: [['الموجز', 'تسجيل البضاعة والموردين والوجهة ونطاق الخدمة المطلوب.'], ['الفحص', 'مراجعة التغليف والملصقات والكميات وأي مناولة خاصة معلنة.'], ['التأكيد', 'تأكيد الخطة والاستثناءات والمستندات وأساس الرسوم في العرض.'], ['الإفراج', 'تسجيل تفاصيل الإرسال وتسليم البضاعة إلى المشغل التالي المتفق عليه.']],
    closeKicker: 'ابدأ ببيانات البضاعة الفعلية', signature: 'تنسق DDNZ المشتريات وتسليم التصدير · تنفذ Heaven Born الشحن الدولي', fieldRecord: 'عمليات المنشأ',
  },
};

const serviceCopy: Record<ModernFreightServicePath, Record<ModernServiceLocale, ServiceCopy>> = {
  'services/air-freight': {
    pt: ptCopy['services/air-freight'] as ServiceCopy,
    tr: trCopy['services/air-freight'] as ServiceCopy,
    en: { title: 'Air freight from China.', tag: 'Urgent cargo, with the acceptance checked first.', intro: 'Choose express, standard or economy air only after chargeable weight, carrier acceptance and destination handover are clear.', decisionTitle: 'Speed is one variable. Acceptance is the gate.', decisions: [['Express / priority', 'For time-critical replenishment after flight and cargo acceptance are confirmed.'], ['Standard air', 'Balance schedule and cost around a confirmed departure window.'], ['Economy consolidation', 'Use consolidated air when the cargo can wait for the planned build-up.']], checks: ['Origin airport and available routing', 'Actual and volumetric chargeable weight', 'Carrier acceptance and packing requirements', 'Arrival, clearance and final-delivery responsibility'], brief: ['Commodity and HS code if known', 'Piece count, dimensions and gross weight', 'Supplier city and cargo-ready date', 'Destination airport or full delivery address'], close: 'Put the cargo facts before the flight promise.' },
    zh: { title: '中国空运服务。', tag: '紧急货，也要先把承运条件核对清楚。', intro: '特快、标准或经济空运，都应在计费重、航司收货条件和目的地交接范围明确后再选择。', decisionTitle: '速度只是变量，能否承运才是门槛。', decisions: [['特快 / 优先舱位', '适合紧急补货，先确认航班及货物承运条件。'], ['标准空运', '围绕已确认的出港窗口平衡时效与成本。'], ['经济空运集拼', '适合可接受集货与拼板时间的非紧急货物。']], checks: ['始发机场与可用路线', '实际重量与体积计费重', '航司承运及包装要求', '到港、清关与末端派送责任'], brief: ['品名及已知 HS 编码', '件数、单件尺寸与总毛重', '供应商城市与货好时间', '目的机场或完整交付地址'], close: '先把货物说清楚，再谈最快航班。' },
    ru: { title: 'Авиаперевозки из Китая.', tag: 'Срочный груз — только после проверки допуска.', intro: 'Экспресс, стандарт или эконом выбираются после расчёта оплачиваемого веса, допуска перевозчика и передачи в пункте назначения.', decisionTitle: 'Скорость — переменная. Допуск — обязательное условие.', decisions: [['Экспресс / приоритет', 'Для срочного пополнения после подтверждения рейса и допуска груза.'], ['Стандартное авиа', 'Баланс срока и стоимости в подтверждённом окне отправки.'], ['Эконом-консолидация', 'Для груза, допускающего ожидание сборки авиационной партии.']], checks: ['Аэропорт отправления и доступный маршрут', 'Фактический и объёмный оплачиваемый вес', 'Допуск перевозчика и требования к упаковке', 'Прибытие, таможня и ответственность за доставку'], brief: ['Наименование и код ТН ВЭД, если известен', 'Количество мест, размеры и вес брутто', 'Город поставщика и дата готовности', 'Аэропорт или полный адрес доставки'], close: 'Сначала факты о грузе, затем обещание рейса.' },
    fr: { title: 'Fret aérien depuis la Chine.', tag: 'L’urgence commence par l’acceptation du fret.', intro: 'Express, standard ou économique : le choix vient après le poids taxable, l’acceptation du transporteur et la remise à destination.', decisionTitle: 'La vitesse varie. L’acceptation reste la condition.', decisions: [['Express / prioritaire', 'Pour un réassort urgent après confirmation du vol et de l’acceptation.'], ['Fret aérien standard', 'Équilibrer délai et coût autour d’une fenêtre de départ confirmée.'], ['Groupage économique', 'Pour les marchandises pouvant attendre la constitution du lot aérien.']], checks: ['Aéroport d’origine et itinéraire disponible', 'Poids réel et poids volumétrique taxable', 'Acceptation transporteur et exigences d’emballage', 'Arrivée, douane et responsabilité de livraison'], brief: ['Produit et code SH si connu', 'Nombre de colis, dimensions et poids brut', 'Ville fournisseur et date de disponibilité', 'Aéroport ou adresse complète de livraison'], close: 'Les faits sur le fret avant la promesse de vol.' },
    es: { title: 'Carga aérea desde China.', tag: 'La urgencia empieza por confirmar la aceptación.', intro: 'Exprés, estándar o económica: la opción se decide después de confirmar peso facturable, aceptación y entrega en destino.', decisionTitle: 'La velocidad varía. La aceptación es el requisito.', decisions: [['Exprés / prioridad', 'Para reposición urgente tras confirmar vuelo y aceptación de la carga.'], ['Carga aérea estándar', 'Equilibrio entre plazo y costo con una salida confirmada.'], ['Consolidación económica', 'Para carga que puede esperar la formación del lote aéreo.']], checks: ['Aeropuerto de origen y ruta disponible', 'Peso real y volumétrico facturable', 'Aceptación y requisitos de embalaje', 'Llegada, aduana y responsabilidad de entrega'], brief: ['Producto y código HS si se conoce', 'Bultos, dimensiones y peso bruto', 'Ciudad del proveedor y fecha de carga', 'Aeropuerto o dirección completa de entrega'], close: 'Primero los datos de la carga; después, el vuelo.' },
    ar: { title: 'الشحن الجوي من الصين.', tag: 'الشحنة العاجلة تبدأ أولاً بتأكيد القبول.', intro: 'يُختار السريع أو القياسي أو الاقتصادي بعد تحديد الوزن المحاسبي وقبول الناقل وتسليم الوجهة.', decisionTitle: 'السرعة متغيرة، أما القبول فهو شرط.', decisions: [['سريع / أولوية', 'للتجديد العاجل بعد تأكيد الرحلة وقبول البضاعة.'], ['شحن جوي قياسي', 'موازنة الوقت والتكلفة وفق نافذة مغادرة مؤكدة.'], ['تجميع اقتصادي', 'للبضاعة التي يمكنها انتظار تجميع الحمولة الجوية.']], checks: ['مطار المنشأ والمسار المتاح', 'الوزن الفعلي والحجمي المحاسبي', 'قبول الناقل ومتطلبات التغليف', 'الوصول والتخليص ومسؤولية التسليم'], brief: ['وصف البضاعة ورمز HS إن توفر', 'عدد الطرود والأبعاد والوزن الإجمالي', 'مدينة المورد وموعد جاهزية البضاعة', 'مطار الوجهة أو عنوان التسليم الكامل'], close: 'بيانات البضاعة أولاً، ثم وعد الرحلة.' },
  },
  'services/amazon-fba': {
    pt: ptCopy['services/amazon-fba'] as ServiceCopy,
    tr: trCopy['services/amazon-fba'] as ServiceCopy,
    en: { title: 'Amazon FBA logistics from China.', tag: 'Prep, transport and appointment—one controlled handover.', intro: 'Build the plan around the shipment ID, carton rules, importer setup and receiving appointment instead of treating FBA as an ordinary door delivery.', decisionTitle: 'Choose where DDNZ enters the workflow.', decisions: [['Prep only', 'Receive, count, label and prepare cartons against the supplied FBA plan.'], ['Sea + final delivery', 'Plan economical replenishment with destination clearance and appointment scope confirmed.'], ['Air + final delivery', 'Protect urgent stock only after chargeable weight and receiving rules are checked.']], checks: ['FNSKU, carton and pallet requirements', 'Importer, tax and customs responsibility', 'Shipment plan and destination warehouse code', 'Appointment, last-mile method and delivery evidence'], brief: ['Marketplace and destination warehouse code', 'SKU list, carton count and shipment plan', 'Label files and preparation instructions', 'Cargo-ready date and requested arrival window'], close: 'Plan the receiving rules before the replenishment route.' },
    zh: { title: '中国至 Amazon FBA 物流。', tag: '贴标、运输、预约入仓，一次交接管清楚。', intro: '围绕 Shipment ID、外箱规则、进口安排与送仓预约规划，不把 FBA 当成普通到门运输。', decisionTitle: '先决定 DDNZ 从哪个环节接手。', decisions: [['仅 FBA Prep', '按客户提供的 FBA 计划收货、点数、贴标和整理外箱。'], ['海运 + 末端送仓', '适合经济补货，先确认目的地清关及预约送仓范围。'], ['空运 + 末端送仓', '适合紧急补货，先核对计费重和仓库收货规则。']], checks: ['FNSKU、外箱及托盘要求', '进口主体、税务与清关责任', 'Shipment plan 与目的仓代码', '预约、末端派送方式与签收证据'], brief: ['Amazon 站点与目的仓代码', 'SKU 清单、箱数和 Shipment plan', '标签文件与 Prep 操作说明', '货好时间与希望入仓窗口'], close: '先确认收货规则，再决定补货路线。' },
    ru: { title: 'Логистика Amazon FBA из Китая.', tag: 'Prep, перевозка и запись — одна контролируемая передача.', intro: 'План строится вокруг Shipment ID, правил коробок, импортёра и записи на приёмку, а не как обычная доставка до двери.', decisionTitle: 'Выберите, где DDNZ входит в процесс.', decisions: [['Только FBA Prep', 'Приёмка, пересчёт, маркировка и подготовка коробок по плану FBA.'], ['Море + доставка', 'Экономичное пополнение с подтверждённой таможней и записью на складе.'], ['Авиа + доставка', 'Срочное пополнение после проверки веса и правил приёмки.']], checks: ['Требования FNSKU, коробок и паллет', 'Импортёр, налоги и ответственность за таможню', 'Shipment plan и код склада назначения', 'Запись, последняя миля и подтверждение доставки'], brief: ['Маркетплейс и код склада назначения', 'SKU, количество коробок и Shipment plan', 'Файлы этикеток и инструкции Prep', 'Дата готовности и желаемое окно приёмки'], close: 'Сначала правила приёмки, затем маршрут пополнения.' },
    fr: { title: 'Logistique Amazon FBA depuis la Chine.', tag: 'Prep, transport et rendez-vous sous un même contrôle.', intro: 'Le plan repose sur le Shipment ID, les règles cartons, l’importateur et le rendez-vous, pas sur une simple livraison porte-à-porte.', decisionTitle: 'Choisissez où DDNZ intervient.', decisions: [['Prep uniquement', 'Réception, comptage, étiquetage et préparation selon le plan FBA fourni.'], ['Mer + livraison finale', 'Réassort économique avec douane et rendez-vous confirmés.'], ['Air + livraison finale', 'Réassort urgent après contrôle du poids taxable et des règles de réception.']], checks: ['Exigences FNSKU, cartons et palettes', 'Importateur, fiscalité et responsabilité douanière', 'Shipment plan et code du centre destinataire', 'Rendez-vous, dernier kilomètre et preuve de livraison'], brief: ['Marketplace et code du centre', 'Liste SKU, cartons et Shipment plan', 'Fichiers d’étiquettes et instructions Prep', 'Date de disponibilité et fenêtre souhaitée'], close: 'Les règles de réception avant la route de réassort.' },
    es: { title: 'Logística Amazon FBA desde China.', tag: 'Preparación, transporte y cita en una entrega controlada.', intro: 'El plan parte del Shipment ID, reglas de cajas, importador y cita de recepción; no de una entrega a domicilio genérica.', decisionTitle: 'Elija dónde entra DDNZ en el proceso.', decisions: [['Solo preparación FBA', 'Recepción, conteo, etiquetado y preparación según el plan FBA.'], ['Mar + entrega final', 'Reposición económica con despacho y cita de almacén confirmados.'], ['Aire + entrega final', 'Reposición urgente tras revisar peso facturable y reglas de recepción.']], checks: ['Requisitos FNSKU, cajas y palés', 'Importador, impuestos y responsabilidad aduanera', 'Shipment plan y código del almacén', 'Cita, última milla y prueba de entrega'], brief: ['Marketplace y código del almacén', 'SKU, número de cajas y Shipment plan', 'Archivos de etiquetas e instrucciones Prep', 'Fecha de carga y ventana de recepción'], close: 'Primero las reglas de recepción; después, la ruta.' },
    ar: { title: 'لوجستيات Amazon FBA من الصين.', tag: 'التجهيز والنقل والموعد ضمن تسليم واحد مضبوط.', intro: 'تُبنى الخطة على Shipment ID وقواعد الكراتين والمستورد وموعد الاستلام، لا كأنها توصيل عادي إلى الباب.', decisionTitle: 'اختر أين تبدأ مسؤولية DDNZ.', decisions: [['تجهيز FBA فقط', 'استلام وعدّ ووسم وتجهيز الكراتين وفق خطة FBA المقدمة.'], ['بحري + تسليم نهائي', 'تجديد اقتصادي بعد تأكيد التخليص وموعد المستودع.'], ['جوي + تسليم نهائي', 'تجديد عاجل بعد فحص الوزن المحاسبي وقواعد الاستلام.']], checks: ['متطلبات FNSKU والكراتين والمنصات', 'المستورد والضرائب ومسؤولية الجمارك', 'Shipment plan ورمز مستودع الوجهة', 'الموعد وآخر ميل ودليل التسليم'], brief: ['السوق ورمز مستودع الوجهة', 'قائمة SKU وعدد الكراتين وShipment plan', 'ملفات الملصقات وتعليمات Prep', 'موعد الجاهزية ونافذة الاستلام المطلوبة'], close: 'قواعد الاستلام أولاً، ثم مسار التجديد.' },
  },
  'services/warehouse-services': {
    pt: ptCopy['services/warehouse-services'] as ServiceCopy,
    tr: trCopy['services/warehouse-services'] as ServiceCopy,
    en: { title: 'Warehouse and consolidation in China.', tag: 'One origin-control point for several suppliers.', intro: 'Receive, identify, check and prepare supplier batches before export—without losing track of what arrived, what changed or what was released.', decisionTitle: 'Use the warehouse as a control point, not a waiting room.', decisions: [['Receiving control', 'Record carton count, supplier reference and visible packing condition on arrival.'], ['Multi-supplier consolidation', 'Keep batches identified until the complete shipment is reconciled.'], ['Export preparation', 'Coordinate repacking, marks, inspection handover and loading against the release plan.']], checks: ['Inbound count and visible condition', 'Supplier-batch identification and exceptions', 'Approved repacking, labels and inspection scope', 'Released quantity, loading record and dispatch handover'], brief: ['Supplier list and pickup or delivery locations', 'Packing lists, carton or pallet counts', 'Cargo-ready dates for each supplier', 'Inspection, repacking and outbound requirements'], close: 'Turn several supplier handovers into one export record.' },
    zh: { title: '中国仓储与集货服务。', tag: '多家供应商，一个始发端控制点。', intro: '出口前完成收货、分批标识、核对与准备，清楚记录到货、变更和最终放行数量。', decisionTitle: '把仓库当作控制点，而不是等货的房间。', decisions: [['入仓核对', '到货时记录件数、供应商批次及外包装可见状态。'], ['多供应商集货', '在整票货核对完成前，保持各供应商批次可识别。'], ['出口前准备', '按照放行计划协调换箱、唛头、验货交接与装载。']], checks: ['入仓数量与外包装可见状态', '供应商批次标识与异常记录', '已批准的换箱、标签与验货范围', '放行数量、装载记录与出库交接'], brief: ['供应商清单及提货/送货地点', '箱单、纸箱或托盘数量', '每家供应商的货好时间', '验货、换箱和后续运输要求'], close: '把多家供应商交货，整理成一份出口记录。' },
    ru: { title: 'Склад и консолидация в Китае.', tag: 'Одна точка контроля для нескольких поставщиков.', intro: 'Принять, идентифицировать, проверить и подготовить партии до экспорта, сохранив учёт поступлений, изменений и выпуска.', decisionTitle: 'Склад — это контрольная точка, а не зал ожидания.', decisions: [['Входной контроль', 'Зафиксировать коробки, поставщика и видимое состояние упаковки.'], ['Консолидация поставщиков', 'Сохранять идентификацию партий до полной сверки отправки.'], ['Экспортная подготовка', 'Согласовать переупаковку, маркировку, инспекцию и погрузку с планом выпуска.']], checks: ['Количество и видимое состояние при приёмке', 'Идентификация партий и исключения', 'Согласованные упаковка, маркировка и инспекция', 'Выпущенное количество, погрузка и передача'], brief: ['Список поставщиков и адреса забора/доставки', 'Упаковочные листы и количество мест', 'Дата готовности каждого поставщика', 'Инспекция, переупаковка и дальнейшая отправка'], close: 'Объедините передачи поставщиков в одну экспортную запись.' },
    fr: { title: 'Entrepôt et consolidation en Chine.', tag: 'Un point de contrôle pour plusieurs fournisseurs.', intro: 'Recevoir, identifier, contrôler et préparer les lots avant export sans perdre la trace des arrivées, modifications et quantités libérées.', decisionTitle: 'L’entrepôt est un point de contrôle, pas une salle d’attente.', decisions: [['Contrôle à réception', 'Consigner les colis, le fournisseur et l’état visible de l’emballage.'], ['Consolidation fournisseurs', 'Maintenir l’identification des lots jusqu’au rapprochement complet.'], ['Préparation export', 'Coordonner reconditionnement, marques, inspection et chargement avec le plan de sortie.']], checks: ['Quantité reçue et état visible', 'Identification des lots et exceptions', 'Reconditionnement, étiquettes et inspection approuvés', 'Quantité libérée, chargement et remise'], brief: ['Fournisseurs et lieux d’enlèvement ou de livraison', 'Listes de colisage et nombre de colis/palettes', 'Date de disponibilité de chaque fournisseur', 'Inspection, reconditionnement et transport suivant'], close: 'Transformer plusieurs remises fournisseurs en un dossier export.' },
    es: { title: 'Almacén y consolidación en China.', tag: 'Un punto de control para varios proveedores.', intro: 'Recibir, identificar, revisar y preparar lotes antes de exportar, manteniendo registro de llegadas, cambios y cantidades liberadas.', decisionTitle: 'El almacén es un punto de control, no una sala de espera.', decisions: [['Control de recepción', 'Registrar cajas, proveedor y estado visible del embalaje.'], ['Consolidación de proveedores', 'Mantener los lotes identificados hasta conciliar el envío completo.'], ['Preparación de exportación', 'Coordinar reembalaje, marcas, inspección y carga con el plan de salida.']], checks: ['Cantidad recibida y estado visible', 'Identificación de lotes y excepciones', 'Reembalaje, etiquetas e inspección aprobados', 'Cantidad liberada, carga y entrega de salida'], brief: ['Proveedores y lugares de recogida o entrega', 'Packing lists y número de cajas o palés', 'Fecha de carga de cada proveedor', 'Inspección, reembalaje y transporte posterior'], close: 'Convierta varias entregas de proveedores en un registro de exportación.' },
    ar: { title: 'التخزين والتجميع في الصين.', tag: 'نقطة تحكم واحدة لعدة موردين.', intro: 'استلام الدفعات وتعريفها وفحصها وتجهيزها قبل التصدير مع حفظ سجل ما وصل وما تغيّر وما تم الإفراج عنه.', decisionTitle: 'المستودع نقطة تحكم وليس غرفة انتظار.', decisions: [['ضبط الاستلام', 'تسجيل عدد الكراتين ومرجع المورد والحالة الظاهرة للتغليف.'], ['تجميع الموردين', 'إبقاء الدفعات محددة حتى مطابقة الشحنة كاملة.'], ['تجهيز التصدير', 'تنسيق إعادة التعبئة والعلامات والفحص والتحميل وفق خطة الإفراج.']], checks: ['الكمية المستلمة وحالة التغليف الظاهرة', 'تعريف دفعات الموردين وتسجيل الاستثناءات', 'إعادة التعبئة والوسم والفحص المعتمد', 'الكمية المفرج عنها وسجل التحميل والتسليم'], brief: ['قائمة الموردين ومواقع الاستلام أو التسليم', 'قوائم التعبئة وعدد الكراتين أو المنصات', 'موعد جاهزية كل مورد', 'متطلبات الفحص وإعادة التعبئة والنقل اللاحق'], close: 'حوّل تسليمات الموردين إلى سجل تصدير واحد.' },
  },
};

type ServiceMediaCopy = { hero: string; evidence: string[] };

const serviceMediaCopy: Record<ModernFreightServicePath, Record<ModernServiceLocale, ServiceMediaCopy>> = {
  'services/air-freight': {
    pt: ptCopy['services/air-freight'].media as ServiceMediaCopy,
    tr: trCopy['services/air-freight'].media as ServiceMediaCopy,
    en: { hero: 'Cargo receiving before air-freight review', evidence: ['Cargo identity and packing review', 'Carton mark and shipment-data check', 'Restraint before origin dispatch'] },
    zh: { hero: '空运评估前的货物接收', evidence: ['货物身份与包装核对', '外箱标识与出运数据核对', '始发端发运前的加固'] },
    ru: { hero: 'Приёмка груза до расчёта авиаперевозки', evidence: ['Проверка груза и упаковки', 'Проверка маркировки и данных отправки', 'Крепление до отправки из Китая'] },
    fr: { hero: 'Réception avant l’étude du fret aérien', evidence: ['Contrôle de la marchandise et de l’emballage', 'Contrôle des marques et données d’expédition', 'Arrimage avant le départ de Chine'] },
    es: { hero: 'Recepción antes de evaluar la carga aérea', evidence: ['Revisión de identidad y embalaje', 'Control de marcas y datos del envío', 'Sujeción antes de la salida de origen'] },
    ar: { hero: 'استلام البضاعة قبل مراجعة الشحن الجوي', evidence: ['فحص هوية البضاعة والتغليف', 'مراجعة علامات الكراتين وبيانات الشحنة', 'تثبيت الحمولة قبل المغادرة من المنشأ'] },
  },
  'services/amazon-fba': {
    pt: ptCopy['services/amazon-fba'].media as ServiceMediaCopy,
    tr: trCopy['services/amazon-fba'].media as ServiceMediaCopy,
    en: { hero: 'Barcode and carton-mark review in China', evidence: ['Carton count at receiving', 'Visible-condition and preparation review', 'Export packing and protection'] },
    zh: { hero: '中国端条码与外箱标识核对', evidence: ['入仓时清点纸箱数量', '外观状态与 Prep 要求核对', '出口包装与防护处理'] },
    ru: { hero: 'Проверка штрихкодов и маркировки в Китае', evidence: ['Пересчёт коробок при приёмке', 'Проверка состояния и подготовки', 'Экспортная упаковка и защита'] },
    fr: { hero: 'Contrôle des codes-barres et cartons en Chine', evidence: ['Comptage des cartons à réception', 'Contrôle visuel et préparation', 'Emballage export et protection'] },
    es: { hero: 'Control de códigos y marcas de caja en China', evidence: ['Conteo de cajas en recepción', 'Revisión visual y de preparación', 'Embalaje y protección para exportación'] },
    ar: { hero: 'مراجعة الباركود وعلامات الكراتين في الصين', evidence: ['عدّ الكراتين عند الاستلام', 'فحص الحالة الظاهرة ومتطلبات التجهيز', 'تغليف التصدير والحماية'] },
  },
  'services/warehouse-services': {
    pt: ptCopy['services/warehouse-services'].media as ServiceMediaCopy,
    tr: trCopy['services/warehouse-services'].media as ServiceMediaCopy,
    en: { hero: 'Pallet-batch inspection before consolidation', evidence: ['Inbound count and visible condition', 'Supplier-batch identity check', 'Dispatch and loading handover'] },
    zh: { hero: '集货前的托盘批次核对', evidence: ['入仓数量与外包装状态', '供应商批次身份核对', '出库与装载交接'] },
    ru: { hero: 'Проверка паллетной партии перед консолидацией', evidence: ['Количество и состояние при приёмке', 'Проверка партии поставщика', 'Передача на выпуск и погрузку'] },
    fr: { hero: 'Contrôle d’un lot sur palette avant consolidation', evidence: ['Quantité et état à réception', 'Identification du lot fournisseur', 'Remise pour sortie et chargement'] },
    es: { hero: 'Revisión del lote paletizado antes de consolidar', evidence: ['Cantidad y estado en recepción', 'Identificación del lote del proveedor', 'Entrega para salida y carga'] },
    ar: { hero: 'فحص دفعة المنصة قبل التجميع', evidence: ['العدد والحالة الظاهرة عند الاستلام', 'التحقق من هوية دفعة المورد', 'تسليم الخروج والتحميل'] },
  },
};

const serviceMedia: Record<ModernFreightServicePath, { hero: string; evidence: string[] }> = {
  'services/air-freight': {
    hero: '/images/operations/pexels-wuhan-warehouse-receiving-ddnz-vest-v1.webp',
    evidence: ['/images/cargo-inspection-origin-operations.webp', '/images/operations/warehouse-barcode-scan-candid-v1.webp', '/images/operations/carton-cargo-net-restraint-anonymized.webp'],
  },
  'services/amazon-fba': {
    hero: '/images/operations/warehouse-barcode-scan-candid-v1.webp',
    evidence: ['/images/operations/warehouse-receiving-count-candid-v1.webp', '/images/operations/warehouse-quality-inspection-candid-v1.webp', '/images/operations/equipment-crate-blocking-anonymized.webp'],
  },
  'services/warehouse-services': {
    hero: '/images/operations/warehouse-wheel-hub-pallet-inspection-client-case.webp',
    evidence: ['/images/operations/warehouse-receiving-count-candid-v1.webp', '/images/operations/warehouse-barcode-scan-candid-v1.webp', '/images/operations/container-loading-forklift-wide-v1.webp'],
  },
};

export function modernFreightServiceMetadata(path: ModernFreightServicePath, language: Language) {
  const locale = language as ModernServiceLocale;
  const copy = serviceCopy[path][locale];
  return { title: `${copy.title.replace(/\.$/, '')} | DDNZ Global`, desc: copy.intro, keywords: '' };
}

export default function ModernFreightServiceContent({ path, language }: { path: ModernFreightServicePath; language: Language }) {
  const locale = language as ModernServiceLocale;
  const c = serviceCopy[path][locale];
  const s = shared[locale];
  const media = serviceMedia[path];
  const mediaCopy = serviceMediaCopy[path][locale];
  const prefix = freightLanguagePrefix(language);
  const slug = path.split('/').at(-1) || 'freight-service';
  const quote = `${prefix}/get-a-quote/?leadGoal=Freight+Export&source=${slug.replaceAll('-', '_')}`;

  return <main id="main-content" className="freight-editorial freight-next freight-service-modern" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
    <header className="freight-cover freight-service-cover">
      <div className="freight-cover-copy">
        <p className="freight-kicker">DDNZ / HEAVEN BORN · {c.title}</p>
        <h1>{c.title}<br /><em>{c.tag}</em></h1>
        <p>{c.intro}</p>
        <div className="freight-cover-actions"><a className="freight-cta" href={quote}>{s.primary} ↗</a><a href="#service-evidence">{s.secondary} <span aria-hidden="true">↓</span></a></div>
        <div className="freight-cover-signature"><span>{s.signature}</span></div>
      </div>
      <figure className="freight-cover-image"><img src={media.hero} alt={mediaCopy.hero} fetchPriority="high" /><figcaption><span>{s.fieldRecord} / 01</span>{mediaCopy.hero}</figcaption></figure>
    </header>

    <nav className="freight-chapters" aria-label={s.chapters.join(', ')}>
      {['service-plan', 'service-evidence', 'quote-controls', 'operating-handover'].map((id, index) => <a key={id} href={`#${id}`}>0{index + 1} / {s.chapters[index]}</a>)}
    </nav>

    <section className="freight-wrap freight-section" id="service-plan">
      <div className="freight-section-heading"><p className="freight-kicker">{s.planKicker}</p><h2>{c.decisionTitle}</h2><p>{s.planIntro}</p></div>
      <div className="freight-service-ledger">
        {c.decisions.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}
      </div>
    </section>

    <section className="freight-dark" id="service-evidence"><div className="freight-wrap freight-section">
      <div className="freight-section-heading"><p className="freight-kicker">{s.evidenceKicker}</p><h2>{s.evidenceTitle}</h2><p>{s.evidenceIntro}</p></div>
      <div className="freight-photo-story freight-service-evidence">
        {media.evidence.map((src, index) => <figure key={src}><img src={src} alt={mediaCopy.evidence[index]} loading="lazy" /><figcaption><span>{s.fieldRecord} / 0{index + 2}</span><strong>{mediaCopy.evidence[index]}</strong></figcaption></figure>)}
      </div>
      <p className="freight-footnote freight-service-proof-note">{s.evidenceNote}</p>
    </div></section>

    <section className="freight-wrap freight-section" id="quote-controls">
      <div className="freight-section-heading"><p className="freight-kicker">{s.controlsKicker}</p><h2>{s.controlsTitle}</h2><p>{c.intro}</p></div>
      <div className="freight-control-board">
        <article><h3>{s.quoteChecks}</h3><ol>{c.checks.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></article>
        <article><h3>{s.sendUs}</h3><ol>{c.brief.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></article>
      </div>
    </section>

    <section className="freight-destination-band" id="operating-handover"><div className="freight-wrap freight-section">
      <p className="freight-kicker">{s.processKicker}</p><h2>{s.processTitle}</h2>
      <div className="freight-service-process">{s.steps.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
    </div></section>

    <section className="freight-wrap freight-section freight-close" id="rfq-form-section"><p className="freight-kicker">{s.closeKicker}</p><h2>{c.close}</h2><p>{c.intro}</p><a className="freight-cta" href={quote}>{s.primary} ↗</a><small>{s.signature}</small></section>
  </main>;
}
