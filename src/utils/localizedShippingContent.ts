export type ShippingCopyLocale = 'ru' | 'fr' | 'es' | 'ar';

type ShippingContentInput = {
  locale: ShippingCopyLocale;
  country: string;
  destination: string;
  region: string;
  transitDays: string;
  compliance: string;
};

const copy = {
  ru: {
    seoTitle: (country: string) => `Доставка из Китая: ${country} | DDNZ Global`,
    seoDesc: (country: string, destination: string) => `Морские, авиационные и мультимодальные перевозки из Китая в ${country} через ${destination} с проверкой документов и координацией доставки.`,
    headline: (country: string) => `Доставка грузов из Китая — ${country}`,
    subheadline: (destination: string, compliance: string) => `Планирование FCL, LCL, авиационных и мультимодальных перевозок через ${destination}, включая проверку требований ${compliance} до отправки.`,
    transitWindow: (country: string) => `Ориентировочные сроки доставки в ${country}`,
    complianceRowTitle: 'Проверка импортных и коммерческих документов',
    complianceRowVal: 'До бронирования',
    solutionsTitle: (country: string) => `Логистические решения: ${country}`,
    solutionsSubtitle: 'Маршрут, документы и условия доставки согласовываются до передачи груза перевозчику.',
    solutions: [
      ['Проверка документов', 'Сверяем данные получателя, описание товара, количество и стоимость в коносаменте, счёте, упаковочном листе и документах назначения.', 'FileText'],
      ['Классификация и соответствие', (compliance: string) => `До погрузки уточняем код товара, требования ${compliance}, разрешения и документы импортёра.`, 'ShieldCheck'],
      ['Планирование пункта назначения', (destination: string) => `Согласовываем расписание, обработку в ${destination}, местную доставку и границы ответственности сторон.`, 'Clock'],
    ],
    modes: [
      ['Морская перевозка FCL / LCL', 'Подходит для коммерческих партий, оборудования, материалов и сборных грузов.', 'Маршрут выбирается по расписанию линии, объёму груза и плану доставки.', 'До выхода судна подтвердите коммерческие документы и требования назначения.'],
      ['Авиаперевозка', 'Подходит для образцов, запчастей, дорогостоящих и срочных грузов.', 'Прямой или транзитный рейс выбирается с учётом допуска груза и работы аэропорта назначения.', 'Батареи, жидкости, порошки и опасные грузы требуют предварительного согласования.'],
      ['Автомобильная / мультимодальная перевозка', 'Подходит для маршрутов с сухопутным плечом и доставки до двери.', 'Комбинация транспорта согласовывается по срокам, стоимости и условиям на границе.', 'Нужно заранее проверить вес, размеры, перегрузку и местные ограничения.'],
    ],
    faqs: [
      ['Какие документы необходимо проверить до отправки?', 'Проверьте коносамент или авианакладную, коммерческий счёт, упаковочный лист, данные получателя, описание товара и специальные документы вместе с импортёром.'],
      ['Как выбрать маршрут и пункт прибытия?', (destination: string) => `Выбор зависит от расписания, типа груза, местонахождения получателя и условий обработки в ${destination}. Маршрут подтверждается до бронирования.`],
      ['Можно ли организовать доставку DDP или DDU?', 'Возможность зависит от товара, импортёра и местных правил. До бронирования письменно фиксируются налоги, исключения и точный объём услуги.'],
    ],
    redlineTitle: 'Контрольный список перед отправкой',
    redlineSubtitle: 'Проверьте груз, документы, упаковку и границы услуги до бронирования.',
    redlines: [
      ['01', 'Единые данные во всех документах', 'Наименование, количество, стоимость, вес и получатель должны совпадать во всех коммерческих и транспортных документах.'],
      ['02', 'Упаковка и маркировка', 'Упаковка, маркировка и способ погрузки должны соответствовать товару, маршруту и требованиям перевозчика.'],
      ['03', 'Письменные границы услуги', 'Зафиксируйте, включены ли пошлины, налоги, хранение, досмотр, местная доставка и сторонние расходы.'],
    ],
  },
  fr: {
    seoTitle: (country: string) => `Expédition de Chine vers ${country} | DDNZ Global`,
    seoDesc: (country: string, destination: string) => `Fret maritime, aérien et multimodal de Chine vers ${country} via ${destination}, avec contrôle documentaire et coordination de la livraison.`,
    headline: (country: string) => `Transport de marchandises de Chine vers ${country}`,
    subheadline: (destination: string, compliance: string) => `Planification FCL, LCL, aérienne et multimodale via ${destination}, avec vérification des exigences ${compliance} avant expédition.`,
    transitWindow: (country: string) => `Délais indicatifs vers ${country}`,
    complianceRowTitle: 'Contrôle des documents commerciaux et d’importation',
    complianceRowVal: 'Avant réservation',
    solutionsTitle: (country: string) => `Solutions logistiques pour ${country}`,
    solutionsSubtitle: 'L’itinéraire, les documents et le périmètre de livraison sont confirmés avant la remise au transporteur.',
    solutions: [
      ['Cohérence documentaire', 'Nous vérifions le destinataire, la description, les quantités et les valeurs sur le connaissement, la facture, la liste de colisage et les documents de destination.', 'FileText'],
      ['Classement et conformité', (compliance: string) => `Le classement produit, les exigences ${compliance}, les permis et les documents de l’importateur sont contrôlés avant chargement.`, 'ShieldCheck'],
      ['Planification à destination', (destination: string) => `Nous coordonnons l’horaire, la manutention à ${destination}, la livraison locale et les responsabilités de chaque partie.`, 'Clock'],
    ],
    modes: [
      ['Fret maritime FCL / LCL', 'Adapté aux stocks commerciaux, équipements, matériaux et expéditions groupées.', 'L’itinéraire est choisi selon les départs disponibles, le volume et le plan de livraison.', 'Confirmez les documents commerciaux et les exigences de destination avant le départ.'],
      ['Fret aérien', 'Adapté aux échantillons, pièces, marchandises de valeur et urgences.', 'Un vol direct ou avec correspondance est choisi selon l’acceptation du fret et les opérations à destination.', 'Batteries, liquides, poudres et marchandises dangereuses exigent une validation préalable.'],
      ['Transport routier / multimodal', 'Adapté aux itinéraires terrestres et aux livraisons porte à porte.', 'La combinaison modale est définie selon le délai, le coût et les conditions frontalières.', 'Le poids, les dimensions, les transbordements et les restrictions locales doivent être vérifiés.'],
    ],
    faqs: [
      ['Quels documents vérifier avant l’expédition ?', 'Vérifiez le connaissement ou la LTA, la facture, la liste de colisage, le destinataire, la description du produit et les documents spécifiques avec l’importateur.'],
      ['Comment choisir l’itinéraire et le point d’arrivée ?', (destination: string) => `Le choix dépend de l’horaire, du fret, de la localisation du destinataire et des opérations à ${destination}. L’itinéraire est confirmé avant réservation.`],
      ['Une solution DDP ou DDU est-elle possible ?', 'La faisabilité dépend du produit, de l’importateur et des règles locales. Les taxes, exclusions et responsabilités doivent être confirmées par écrit.'],
    ],
    redlineTitle: 'Liste de contrôle avant expédition',
    redlineSubtitle: 'Vérifiez le fret, les documents, l’emballage et le périmètre de service avant réservation.',
    redlines: [
      ['01', 'Données cohérentes sur tous les documents', 'Description, quantité, valeur, poids et destinataire doivent être identiques sur les documents commerciaux et de transport.'],
      ['02', 'Emballage et marquage adaptés', 'L’emballage, le marquage et le chargement doivent correspondre au produit, à l’itinéraire et aux exigences du transporteur.'],
      ['03', 'Périmètre de service écrit', 'Confirmez si droits, taxes, stockage, inspection, livraison locale et frais de tiers sont inclus.'],
    ],
  },
  es: {
    seoTitle: (country: string) => `Envíos de China a ${country} | DDNZ Global`,
    seoDesc: (country: string, destination: string) => `Flete marítimo, aéreo y multimodal desde China a ${country} vía ${destination}, con revisión documental y coordinación de entrega.`,
    headline: (country: string) => `Envíos de carga desde China a ${country}`,
    subheadline: (destination: string, compliance: string) => `Planificación FCL, LCL, aérea y multimodal vía ${destination}, con revisión de requisitos ${compliance} antes del embarque.`,
    transitWindow: (country: string) => `Tiempos estimados hacia ${country}`,
    complianceRowTitle: 'Revisión de documentos comerciales y de importación',
    complianceRowVal: 'Antes de reservar',
    solutionsTitle: (country: string) => `Soluciones logísticas para ${country}`,
    solutionsSubtitle: 'La ruta, los documentos y el alcance de entrega se confirman antes de entregar la carga al transportista.',
    solutions: [
      ['Coherencia documental', 'Revisamos consignatario, descripción, cantidades y valores en conocimiento de embarque, factura, lista de empaque y documentos de destino.', 'FileText'],
      ['Clasificación y cumplimiento', (compliance: string) => `Antes de cargar verificamos la clasificación, los requisitos ${compliance}, permisos y documentos del importador.`, 'ShieldCheck'],
      ['Planificación en destino', (destination: string) => `Coordinamos horarios, manejo en ${destination}, entrega local y responsabilidades de cada parte.`, 'Clock'],
    ],
    modes: [
      ['Flete marítimo FCL / LCL', 'Adecuado para inventario comercial, equipos, materiales y carga consolidada.', 'La ruta se elige según salidas disponibles, volumen y plan de entrega.', 'Confirme documentos comerciales y requisitos de destino antes de la salida.'],
      ['Flete aéreo', 'Adecuado para muestras, repuestos, carga de alto valor y envíos urgentes.', 'Se selecciona vuelo directo o con conexión según aceptación de carga y operaciones de destino.', 'Baterías, líquidos, polvos y mercancías peligrosas requieren aprobación previa.'],
      ['Transporte terrestre / multimodal', 'Adecuado para rutas con tramo terrestre y entregas puerta a puerta.', 'La combinación modal se define según plazo, coste y condiciones fronterizas.', 'Deben revisarse peso, dimensiones, transbordos y restricciones locales.'],
    ],
    faqs: [
      ['¿Qué documentos deben revisarse antes del envío?', 'Revise conocimiento o guía aérea, factura, lista de empaque, consignatario, descripción del producto y documentos especiales con el importador.'],
      ['¿Cómo se eligen la ruta y el punto de llegada?', (destination: string) => `La elección depende del horario, la carga, la ubicación del consignatario y las operaciones en ${destination}. La ruta se confirma antes de reservar.`],
      ['¿Puede organizarse un servicio DDP o DDU?', 'La viabilidad depende del producto, el importador y las reglas locales. Impuestos, exclusiones y responsabilidades deben confirmarse por escrito.'],
    ],
    redlineTitle: 'Lista de control previa al embarque',
    redlineSubtitle: 'Verifique carga, documentos, embalaje y alcance del servicio antes de reservar.',
    redlines: [
      ['01', 'Datos coherentes en todos los documentos', 'Descripción, cantidad, valor, peso y consignatario deben coincidir en documentos comerciales y de transporte.'],
      ['02', 'Embalaje y marcado adecuados', 'El embalaje, marcado y método de carga deben corresponder al producto, la ruta y los requisitos del transportista.'],
      ['03', 'Alcance del servicio por escrito', 'Confirme si se incluyen aranceles, impuestos, almacenaje, inspección, entrega local y costes de terceros.'],
    ],
  },
  ar: {
    seoTitle: (country: string) => `الشحن من الصين إلى ${country} | DDNZ Global`,
    seoDesc: (country: string, destination: string) => `شحن بحري وجوي ومتعدد الوسائط من الصين إلى ${country} عبر ${destination} مع مراجعة المستندات وتنسيق التسليم.`,
    headline: (country: string) => `شحن البضائع من الصين إلى ${country}`,
    subheadline: (destination: string, compliance: string) => `تخطيط FCL وLCL والشحن الجوي والمتعدد الوسائط عبر ${destination} مع مراجعة متطلبات ${compliance} قبل الشحن.`,
    transitWindow: (country: string) => `المدة التقديرية إلى ${country}`,
    complianceRowTitle: 'مراجعة مستندات التجارة والاستيراد',
    complianceRowVal: 'قبل الحجز',
    solutionsTitle: (country: string) => `حلول لوجستية إلى ${country}`,
    solutionsSubtitle: 'يتم تأكيد المسار والمستندات ونطاق التسليم قبل تسليم البضائع إلى الناقل.',
    solutions: [
      ['تطابق المستندات', 'نراجع بيانات المستلم ووصف المنتج والكميات والقيم في بوليصة الشحن والفاتورة وقائمة التعبئة ومستندات الوجهة.', 'FileText'],
      ['التصنيف والامتثال', (compliance: string) => `نراجع تصنيف المنتج ومتطلبات ${compliance} والتصاريح ومستندات المستورد قبل التحميل.`, 'ShieldCheck'],
      ['التخطيط في الوجهة', (destination: string) => `ننسق الجدول والمناولة في ${destination} والتسليم المحلي ومسؤوليات كل طرف.`, 'Clock'],
    ],
    modes: [
      ['الشحن البحري FCL / LCL', 'مناسب للمخزون التجاري والمعدات والمواد والشحنات المجمعة.', 'يُختار المسار حسب الرحلات المتاحة وحجم الشحنة وخطة التسليم.', 'يجب تأكيد المستندات التجارية ومتطلبات الوجهة قبل الإبحار.'],
      ['الشحن الجوي', 'مناسب للعينات وقطع الغيار والبضائع عالية القيمة والعاجلة.', 'يُختار المسار المباشر أو العابر حسب قبول البضائع وعمليات مطار الوجهة.', 'تتطلب البطاريات والسوائل والمساحيق والبضائع الخطرة موافقة مسبقة.'],
      ['النقل البري / متعدد الوسائط', 'مناسب للمسارات التي تشمل نقلاً برياً وللتسليم من الباب إلى الباب.', 'يتم تحديد وسائل النقل وفق الوقت والتكلفة وظروف الحدود.', 'يجب مراجعة الوزن والأبعاد وإعادة التحميل والقيود المحلية مسبقاً.'],
    ],
    faqs: [
      ['ما المستندات التي يجب مراجعتها قبل الشحن؟', 'راجع بوليصة الشحن أو الشحن الجوي والفاتورة وقائمة التعبئة وبيانات المستلم ووصف المنتج والمستندات الخاصة مع المستورد.'],
      ['كيف يتم اختيار المسار ونقطة الوصول؟', (destination: string) => `يعتمد الاختيار على الجدول ونوع البضائع وموقع المستلم والعمليات في ${destination}. يتم تأكيد المسار قبل الحجز.`],
      ['هل يمكن ترتيب خدمة DDP أو DDU؟', 'تعتمد الإمكانية على المنتج والمستورد والقواعد المحلية. يجب تأكيد الضرائب والاستثناءات والمسؤوليات كتابياً قبل الحجز.'],
    ],
    redlineTitle: 'قائمة التحقق قبل الشحن',
    redlineSubtitle: 'راجع البضائع والمستندات والتغليف ونطاق الخدمة قبل الحجز.',
    redlines: [
      ['01', 'تطابق البيانات في جميع المستندات', 'يجب أن يتطابق الوصف والكمية والقيمة والوزن وبيانات المستلم في المستندات التجارية ومستندات النقل.'],
      ['02', 'التغليف ووضع العلامات', 'يجب أن يناسب التغليف والعلامات وطريقة التحميل المنتج والمسار ومتطلبات الناقل.'],
      ['03', 'نطاق خدمة مكتوب', 'أكد ما إذا كانت الرسوم والضرائب والتخزين والفحص والتسليم المحلي وتكاليف الأطراف الأخرى مشمولة.'],
    ],
  },
} as const;

function resolve(value: string | ((argument: string) => string), argument: string) {
  return typeof value === 'function' ? value(argument) : value;
}

export function createLocalizedShippingContent(input: ShippingContentInput) {
  const t = copy[input.locale];
  return {
    seoTitle: t.seoTitle(input.country),
    seoDesc: t.seoDesc(input.country, input.destination),
    headline: t.headline(input.country),
    subheadline: t.subheadline(input.destination, input.compliance),
    transitWindow: t.transitWindow(input.country),
    transitDays: input.transitDays,
    complianceRowTitle: t.complianceRowTitle,
    complianceRowVal: t.complianceRowVal,
    solutionsTitle: t.solutionsTitle(input.country),
    solutionsSubtitle: t.solutionsSubtitle,
    solutions: t.solutions.map(([title, description, icon], index) => ({
      title,
      desc: resolve(description, index === 1 ? input.compliance : input.destination),
      icon,
    })),
    multimodalTable: t.modes.map(([mode, suitability, sellingPoint, warning], index) => ({
      mode,
      days: index === 0 ? input.transitDays : index === 1 ? '5 - 14' : input.transitDays,
      suitability,
      sellingPoint,
      warning,
    })),
    faqs: t.faqs.map(([question, answer], index) => ({
      q: question,
      a: resolve(answer, index === 1 ? input.destination : input.compliance),
    })),
  };
}

export function createLocalizedShippingRedlines(locale: ShippingCopyLocale) {
  const t = copy[locale];
  return {
    title: t.redlineTitle,
    subtitle: t.redlineSubtitle,
    items: t.redlines.map(([id, title, desc]) => ({ id, title, desc })),
  };
}
