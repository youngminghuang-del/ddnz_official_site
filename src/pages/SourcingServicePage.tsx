import { Link, useLocation } from 'react-router-dom';
import {
  BadgeCheck,
  Boxes,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  FileSearch,
  PackageCheck,
  SearchCheck,
  ShieldCheck,
} from 'lucide-react';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import { DdnzEyebrow, DdnzPrimaryLink, DdnzSecondaryLink } from '../components/DdnzUi';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';
import { buildQuoteHref } from '../lib/quoteLinks';
import type { QuoteIntent } from '../lib/quoteLinks';
import { trackEvent } from '../lib/utils';

export type SourcingServiceKind = 'supplier-search' | 'inspection-quality-control' | 'consolidation-export';

type ServiceCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  useTitle: string;
  useCases: string[];
  outputTitle: string;
  outputs: string[];
  sequenceTitle: string;
  sequence: Array<{ title: string; body: string }>;
  boundaryTitle: string;
  boundary: string;
  cta: string;
};

type SharedCopy = {
  services: string;
  home: string;
  fieldEvidence: string;
  fullProcess: string;
  proofLabel: string;
  proofTitle: string;
  proofBody: string;
  finalTitle: string;
  finalBody: string;
};

const sharedCopy: Record<Language, SharedCopy> = {
  en: {
    services: 'Sourcing services', home: 'Home', fieldEvidence: 'Authorized field material · China origin', fullProcess: 'View the full six-checkpoint workflow', proofLabel: 'Accountable handoff',
    proofTitle: 'Every decision stays tied to a record.',
    proofBody: 'DDNZ records the agreed scope, supplier or order status, evidence received, open risks and the next responsible party before goods move forward.',
    finalTitle: 'Start with what you already know.',
    finalBody: 'Send the product, supplier or order status, destination market and timing. The first review will identify the missing information and the right control path.',
  },
  zh: {
    services: '采购服务', home: '首页', fieldEvidence: '已授权现场素材 · 中国源头', fullProcess: '查看完整六节点流程', proofLabel: '责任交接', proofTitle: '每项决定都对应一份记录。',
    proofBody: '货物进入下一环节前，DDNZ 会记录已确认的范围、供应商或订单状态、已取得证据、待解决风险及下一责任方。',
    finalTitle: '从您已经掌握的信息开始。', finalBody: '提交产品、供应商或订单状态、目的市场和时间要求。首次审核会明确缺失信息与合适的控制路径。',
  },
  ru: {
    services: 'Услуги по закупкам', home: 'Главная', fieldEvidence: 'Разрешенные полевые материалы · Китай', fullProcess: 'Посмотреть полный процесс из шести этапов', proofLabel: 'Ответственная передача', proofTitle: 'Каждое решение связано с записью.',
    proofBody: 'До следующего этапа DDNZ фиксирует согласованный объем, статус поставщика или заказа, полученные доказательства, открытые риски и ответственную сторону.',
    finalTitle: 'Начните с уже известной информации.', finalBody: 'Укажите товар, поставщика или статус заказа, рынок назначения и сроки. Первая проверка определит недостающие данные и маршрут контроля.',
  },
  fr: {
    services: 'Services de sourcing', home: 'Accueil', fieldEvidence: 'Matériel terrain autorisé · origine Chine', fullProcess: 'Voir le processus complet en six étapes', proofLabel: 'Transmission responsable', proofTitle: 'Chaque décision reste liée à une preuve.',
    proofBody: 'Avant l’étape suivante, DDNZ consigne le périmètre convenu, le statut du fournisseur ou de la commande, les preuves reçues, les risques ouverts et le prochain responsable.',
    finalTitle: 'Commencez avec les informations disponibles.', finalBody: 'Envoyez le produit, le fournisseur ou le statut de commande, le marché cible et le calendrier. La première revue précisera les informations manquantes.',
  },
  es: {
    services: 'Servicios de compra', home: 'Inicio', fieldEvidence: 'Material de campo autorizado · origen China', fullProcess: 'Ver el proceso completo de seis puntos', proofLabel: 'Entrega responsable', proofTitle: 'Cada decisión queda vinculada a un registro.',
    proofBody: 'Antes de avanzar, DDNZ registra el alcance acordado, el estado del proveedor o pedido, las pruebas recibidas, los riesgos abiertos y el siguiente responsable.',
    finalTitle: 'Empiece con la información que ya tiene.', finalBody: 'Envíe el producto, proveedor o estado del pedido, mercado de destino y plazo. La primera revisión identificará la información pendiente.',
  },
  ar: {
    services: 'خدمات التوريد', home: 'الرئيسية', fieldEvidence: 'مواد ميدانية مصرح بها · منشأ الصين', fullProcess: 'عرض المسار الكامل من ست نقاط', proofLabel: 'تسليم مسؤول', proofTitle: 'يبقى كل قرار مرتبطاً بسجل واضح.',
    proofBody: 'قبل انتقال البضائع للمرحلة التالية، تسجل DDNZ النطاق المتفق عليه وحالة المورد أو الطلب والأدلة المستلمة والمخاطر المفتوحة والطرف المسؤول التالي.',
    finalTitle: 'ابدأ بالمعلومات المتوفرة لديك.', finalBody: 'أرسل المنتج أو حالة المورد أو الطلب والسوق المستهدف والموعد. تحدد المراجعة الأولى المعلومات الناقصة ومسار الرقابة المناسب.',
  },
};

const serviceCopy: Record<SourcingServiceKind, Record<Language, ServiceCopy>> = {
  'supplier-search': {
    en: {
      eyebrow: 'Supplier search & comparison', title: 'Shortlist China suppliers against one comparable buying brief.',
      intro: 'DDNZ turns product references and market requirements into a structured brief, searches suitable manufacturers and normalizes quotations before a buyer chooses whom to sample or audit.',
      useTitle: 'Use this service when', useCases: ['You have a product photo or target model but no verified factory.', 'Supplier quotations use different specifications or inclusions.', 'You need a shortlist before samples, audit or negotiation.'],
      outputTitle: 'What you receive', outputs: ['A clarified product and market brief.', 'A comparable supplier and quotation matrix.', 'Open questions, evidence gaps and recommended next checks.'],
      sequenceTitle: 'From brief to shortlist', sequence: [
        { title: 'Define', body: 'Confirm use, destination, specification, quantity, budget and timing.' },
        { title: 'Search', body: 'Identify candidate manufacturers and check basic business identity and product fit.' },
        { title: 'Normalize', body: 'Align models, materials, accessories, terms and pack-out before comparing price.' },
        { title: 'Recommend', body: 'Present the shortlist, evidence gaps and sample or audit priorities.' },
      ],
      boundaryTitle: 'What the shortlist does not claim', boundary: 'A shortlist is an initial commercial and supplier-fit review. It does not replace a factory audit, sample approval, model-level compliance review or pre-shipment inspection.',
      cta: 'Start a supplier-search brief',
    },
    zh: {
      eyebrow: '供应商搜索与比价', title: '用统一采购需求筛选并比较中国供应商。',
      intro: 'DDNZ 将产品参考与目的市场要求整理成结构化采购需求，搜索适合的制造商，并统一报价口径，帮助买家决定后续打样、验厂或谈判对象。',
      useTitle: '适合以下情况', useCases: ['只有产品图片或目标型号，尚无已核验工厂。', '不同供应商报价的规格或包含项不一致。', '在打样、验厂或谈判前需要形成候选名单。'],
      outputTitle: '您将获得', outputs: ['明确的产品与市场采购需求。', '可横向比较的供应商与报价矩阵。', '待确认问题、证据缺口及下一步检查建议。'],
      sequenceTitle: '从需求到候选名单', sequence: [{ title: '定义', body: '确认用途、目的地、规格、数量、预算和时间。' }, { title: '搜索', body: '寻找候选制造商并初步核对企业身份与产品匹配度。' }, { title: '统一', body: '在比价前统一型号、材料、配件、条款和包装口径。' }, { title: '建议', body: '提交候选名单、证据缺口及打样或验厂优先级。' }],
      boundaryTitle: '候选名单不代表什么', boundary: '候选名单属于初步商务与供应商匹配审核，不能替代验厂、样品确认、具体型号合规审核或出货前验货。', cta: '提交供应商搜索需求',
    },
    ru: {
      eyebrow: 'Поиск и сравнение поставщиков', title: 'Сравните поставщиков из Китая по единому закупочному заданию.', intro: 'DDNZ формирует структурированный бриф, ищет подходящих производителей и приводит предложения к сопоставимому виду до выбора образцов или аудита.',
      useTitle: 'Когда услуга полезна', useCases: ['Есть фото или целевая модель, но нет проверенной фабрики.', 'Предложения поставщиков отличаются по комплектации.', 'Нужен шорт-лист перед образцами, аудитом или переговорами.'], outputTitle: 'Что вы получите', outputs: ['Уточненный продуктовый и рыночный бриф.', 'Сопоставимую матрицу поставщиков и предложений.', 'Открытые вопросы и рекомендуемые проверки.'], sequenceTitle: 'От брифа к шорт-листу', sequence: [{ title: 'Определить', body: 'Согласовать применение, рынок, спецификацию, объем, бюджет и сроки.' }, { title: 'Найти', body: 'Подобрать производителей и проверить базовую идентификацию.' }, { title: 'Сопоставить', body: 'Выровнять модели, материалы, аксессуары, условия и упаковку.' }, { title: 'Рекомендовать', body: 'Представить шорт-лист и приоритеты образцов или аудита.' }], boundaryTitle: 'Границы шорт-листа', boundary: 'Шорт-лист не заменяет аудит фабрики, утверждение образца, проверку соответствия модели или предотгрузочную инспекцию.', cta: 'Начать поиск поставщика',
    },
    fr: {
      eyebrow: 'Recherche et comparaison fournisseurs', title: 'Comparez les fournisseurs chinois sur un brief d’achat commun.', intro: 'DDNZ transforme vos références et exigences marché en brief structuré, recherche des fabricants adaptés et normalise les offres avant les échantillons ou l’audit.',
      useTitle: 'À utiliser lorsque', useCases: ['Vous avez une photo ou un modèle cible, sans usine vérifiée.', 'Les offres fournisseurs ne couvrent pas les mêmes spécifications.', 'Une présélection est nécessaire avant échantillon ou audit.'], outputTitle: 'Livrables', outputs: ['Brief produit et marché clarifié.', 'Matrice comparable fournisseurs et offres.', 'Questions ouvertes et contrôles recommandés.'], sequenceTitle: 'Du brief à la présélection', sequence: [{ title: 'Définir', body: 'Confirmer usage, destination, spécifications, volume, budget et délai.' }, { title: 'Rechercher', body: 'Identifier les fabricants et vérifier leur identité de base.' }, { title: 'Normaliser', body: 'Aligner modèles, matières, accessoires, conditions et emballage.' }, { title: 'Recommander', body: 'Présenter la sélection et les priorités d’échantillon ou d’audit.' }], boundaryTitle: 'Limites de la présélection', boundary: 'La présélection ne remplace pas un audit usine, la validation d’échantillon, la conformité du modèle ou l’inspection avant expédition.', cta: 'Démarrer la recherche fournisseur',
    },
    es: {
      eyebrow: 'Búsqueda y comparación de proveedores', title: 'Compare proveedores chinos con un único brief de compra.', intro: 'DDNZ convierte referencias y requisitos de mercado en un brief estructurado, busca fabricantes adecuados y normaliza las cotizaciones antes de elegir muestras o auditorías.',
      useTitle: 'Utilice este servicio cuando', useCases: ['Tiene una foto o modelo objetivo, pero no una fábrica verificada.', 'Las cotizaciones incluyen especificaciones diferentes.', 'Necesita una lista corta antes de muestras, auditoría o negociación.'], outputTitle: 'Qué recibe', outputs: ['Brief de producto y mercado aclarado.', 'Matriz comparable de proveedores y cotizaciones.', 'Preguntas abiertas y próximos controles recomendados.'], sequenceTitle: 'Del brief a la lista corta', sequence: [{ title: 'Definir', body: 'Confirmar uso, destino, especificaciones, cantidad, presupuesto y plazo.' }, { title: 'Buscar', body: 'Identificar fabricantes y revisar su identidad comercial básica.' }, { title: 'Normalizar', body: 'Alinear modelos, materiales, accesorios, condiciones y embalaje.' }, { title: 'Recomendar', body: 'Presentar la lista y prioridades de muestra o auditoría.' }], boundaryTitle: 'Límites de la lista corta', boundary: 'La lista corta no sustituye una auditoría de fábrica, aprobación de muestras, revisión de conformidad o inspección previa al envío.', cta: 'Iniciar búsqueda de proveedores',
    },
    ar: {
      eyebrow: 'البحث عن الموردين والمقارنة', title: 'قارن موردي الصين وفق موجز شراء واحد قابل للمقارنة.', intro: 'تحول DDNZ مراجع المنتج ومتطلبات السوق إلى موجز منظم، وتبحث عن مصنعين مناسبين وتوحد عروض الأسعار قبل اختيار العينات أو التدقيق.',
      useTitle: 'استخدم الخدمة عندما', useCases: ['لديك صورة أو نموذج مستهدف دون مصنع تم التحقق منه.', 'عروض الموردين تختلف في المواصفات أو الملحقات.', 'تحتاج قائمة مختصرة قبل العينات أو التدقيق أو التفاوض.'], outputTitle: 'ما الذي تستلمه', outputs: ['موجز واضح للمنتج والسوق.', 'مصفوفة قابلة للمقارنة للموردين والعروض.', 'الأسئلة المفتوحة والفحوص التالية المقترحة.'], sequenceTitle: 'من الموجز إلى القائمة', sequence: [{ title: 'التعريف', body: 'تأكيد الاستخدام والوجهة والمواصفات والكمية والميزانية والموعد.' }, { title: 'البحث', body: 'تحديد المصنعين والتحقق الأساسي من الهوية وملاءمة المنتج.' }, { title: 'التوحيد', body: 'مواءمة النماذج والمواد والملحقات والشروط والتعبئة.' }, { title: 'التوصية', body: 'عرض القائمة وأولويات العينات أو التدقيق.' }], boundaryTitle: 'حدود القائمة المختصرة', boundary: 'لا تحل القائمة محل تدقيق المصنع أو اعتماد العينة أو مراجعة امتثال النموذج أو فحص ما قبل الشحن.', cta: 'ابدأ طلب البحث عن مورد',
    },
  },
  'inspection-quality-control': {
    en: {
      eyebrow: 'Inspection & quality control', title: 'Inspect the agreed product—not a generic factory sample.',
      intro: 'DDNZ converts approved specifications into an inspection checklist, coordinates on-site checks and returns traceable photo, quantity, function and packing evidence before release.',
      useTitle: 'Use this service when', useCases: ['Production is ready or approaching completion.', 'You need evidence tied to an approved model or sample.', 'Labels, accessories, functions or packing must be checked before release.'],
      outputTitle: 'What you receive', outputs: ['A scope-specific inspection checklist.', 'Photos and findings tied to the inspected model and quantity.', 'A release, rework or buyer-decision summary with open risks.'],
      sequenceTitle: 'From approval to evidence', sequence: [{ title: 'Freeze scope', body: 'Confirm model, approved sample, quantities, specifications and acceptance points.' }, { title: 'Prepare', body: 'Build the checklist and confirm readiness, location and available test conditions.' }, { title: 'Inspect', body: 'Check agreed quantity, identity, appearance, function, accessories, labels and packing.' }, { title: 'Report', body: 'Return findings, photos, exceptions and the decision still required.' }],
      boundaryTitle: 'Inspection has a defined scope', boundary: 'Inspection records what was observed under the agreed checklist and available conditions. It is not a laboratory certification, regulatory approval or guarantee of every unit unless separately specified.', cta: 'Start an inspection brief',
    },
    zh: {
      eyebrow: '验货与质量控制', title: '检查约定产品，而不是工厂随意提供的样品。', intro: 'DDNZ 将已确认规格转化为验货清单，协调现场检查，并在放货前提供可追溯的照片、数量、功能和包装证据。',
      useTitle: '适合以下情况', useCases: ['生产已完成或接近完成。', '需要与已确认型号或样品对应的证据。', '放货前必须检查标签、配件、功能或包装。'], outputTitle: '您将获得', outputs: ['针对本次订单的验货清单。', '与受检型号和数量对应的照片与发现。', '放货、返工或买家决策摘要及待处理风险。'], sequenceTitle: '从确认到证据', sequence: [{ title: '锁定范围', body: '确认型号、样品、数量、规格和验收点。' }, { title: '准备', body: '制定清单并确认完工状态、地点和可用测试条件。' }, { title: '检查', body: '核对数量、身份、外观、功能、配件、标签和包装。' }, { title: '报告', body: '提交发现、照片、异常及仍需决定的事项。' }], boundaryTitle: '验货具有明确范围', boundary: '验货记录约定清单及现场条件下观察到的情况，不等于实验室认证、法规批准或对每件产品的保证，除非另有明确约定。', cta: '提交验货需求',
    },
    ru: {
      eyebrow: 'Инспекция и контроль качества', title: 'Проверяйте согласованный товар, а не случайный образец фабрики.', intro: 'DDNZ превращает утвержденные требования в чек-лист, организует инспекцию и предоставляет фото, количество, функции и упаковку до выпуска товара.',
      useTitle: 'Когда услуга полезна', useCases: ['Производство завершено или близко к завершению.', 'Нужны доказательства по утвержденной модели или образцу.', 'До выпуска нужно проверить маркировку, аксессуары, функции или упаковку.'], outputTitle: 'Что вы получите', outputs: ['Чек-лист под конкретный заказ.', 'Фото и результаты по модели и количеству.', 'Резюме для выпуска, доработки или решения покупателя.'], sequenceTitle: 'От утверждения к доказательствам', sequence: [{ title: 'Зафиксировать', body: 'Подтвердить модель, образец, количество и критерии.' }, { title: 'Подготовить', body: 'Составить чек-лист и подтвердить готовность и условия проверки.' }, { title: 'Проверить', body: 'Проверить количество, идентичность, функции, аксессуары и упаковку.' }, { title: 'Отчитаться', body: 'Передать результаты, фото, отклонения и открытые решения.' }], boundaryTitle: 'Определенный объем инспекции', boundary: 'Инспекция фиксирует наблюдения по согласованному чек-листу. Это не лабораторная сертификация, разрешение регулятора или гарантия каждой единицы.', cta: 'Начать заявку на инспекцию',
    },
    fr: {
      eyebrow: 'Inspection et contrôle qualité', title: 'Inspectez le produit convenu, pas un échantillon générique.', intro: 'DDNZ transforme les spécifications approuvées en checklist, coordonne les contrôles sur site et fournit des preuves traçables avant libération.',
      useTitle: 'À utiliser lorsque', useCases: ['La production est terminée ou presque.', 'Les preuves doivent correspondre au modèle approuvé.', 'Étiquettes, accessoires, fonctions ou emballage doivent être contrôlés.'], outputTitle: 'Livrables', outputs: ['Checklist propre à la commande.', 'Photos et constats liés au modèle et à la quantité.', 'Synthèse de libération, reprise ou décision acheteur.'], sequenceTitle: 'De l’approbation aux preuves', sequence: [{ title: 'Figer', body: 'Confirmer modèle, échantillon, quantités et critères.' }, { title: 'Préparer', body: 'Créer la checklist et confirmer disponibilité et conditions de test.' }, { title: 'Inspecter', body: 'Contrôler identité, aspect, fonction, accessoires, étiquettes et emballage.' }, { title: 'Rapporter', body: 'Transmettre constats, photos, écarts et décisions ouvertes.' }], boundaryTitle: 'Un périmètre défini', boundary: 'L’inspection consigne les observations selon la checklist et les conditions disponibles. Elle ne constitue pas une certification laboratoire ou réglementaire.', cta: 'Démarrer un brief inspection',
    },
    es: {
      eyebrow: 'Inspección y control de calidad', title: 'Inspeccione el producto acordado, no una muestra genérica.', intro: 'DDNZ convierte las especificaciones aprobadas en una lista de inspección, coordina controles in situ y entrega pruebas trazables antes de liberar la mercancía.',
      useTitle: 'Utilice este servicio cuando', useCases: ['La producción está terminada o casi terminada.', 'Necesita evidencia ligada al modelo aprobado.', 'Debe revisar etiquetas, accesorios, funciones o embalaje.'], outputTitle: 'Qué recibe', outputs: ['Lista de inspección específica.', 'Fotos y hallazgos ligados al modelo y cantidad.', 'Resumen de liberación, retrabajo o decisión del comprador.'], sequenceTitle: 'De la aprobación a la evidencia', sequence: [{ title: 'Fijar', body: 'Confirmar modelo, muestra, cantidades y criterios.' }, { title: 'Preparar', body: 'Crear la lista y confirmar disponibilidad y condiciones de prueba.' }, { title: 'Inspeccionar', body: 'Revisar identidad, aspecto, función, accesorios, etiquetas y embalaje.' }, { title: 'Informar', body: 'Entregar hallazgos, fotos, excepciones y decisiones abiertas.' }], boundaryTitle: 'Alcance definido', boundary: 'La inspección registra lo observado según la lista y las condiciones disponibles. No es certificación de laboratorio, aprobación normativa ni garantía de cada unidad.', cta: 'Iniciar solicitud de inspección',
    },
    ar: {
      eyebrow: 'الفحص ومراقبة الجودة', title: 'افحص المنتج المتفق عليه، وليس عينة عامة من المصنع.', intro: 'تحول DDNZ المواصفات المعتمدة إلى قائمة فحص وتنسق الفحص الميداني وتقدم أدلة قابلة للتتبع قبل الإفراج عن البضائع.',
      useTitle: 'استخدم الخدمة عندما', useCases: ['اكتمل الإنتاج أو اقترب من الاكتمال.', 'تحتاج أدلة مرتبطة بالنموذج أو العينة المعتمدة.', 'يجب فحص الملصقات أو الملحقات أو الوظائف أو التعبئة.'], outputTitle: 'ما الذي تستلمه', outputs: ['قائمة فحص خاصة بالطلب.', 'صور ونتائج مرتبطة بالنموذج والكمية.', 'ملخص للإفراج أو إعادة العمل أو قرار المشتري.'], sequenceTitle: 'من الاعتماد إلى الدليل', sequence: [{ title: 'تثبيت النطاق', body: 'تأكيد النموذج والعينة والكميات والمعايير.' }, { title: 'التحضير', body: 'إعداد القائمة وتأكيد الجاهزية وظروف الاختبار.' }, { title: 'الفحص', body: 'فحص الهوية والمظهر والوظيفة والملحقات والملصقات والتعبئة.' }, { title: 'التقرير', body: 'تقديم النتائج والصور والاستثناءات والقرارات المفتوحة.' }], boundaryTitle: 'نطاق فحص محدد', boundary: 'يسجل الفحص ما تمت ملاحظته وفق القائمة والظروف المتاحة، ولا يعد شهادة مختبر أو موافقة تنظيمية أو ضماناً لكل وحدة.', cta: 'ابدأ طلب الفحص',
    },
  },
  'consolidation-export': {
    en: {
      eyebrow: 'Consolidation & export', title: 'Bring approved orders together for one controlled export handoff.',
      intro: 'DDNZ coordinates supplier readiness, receiving, count and packing checks, shipment reconciliation and the handoff to Heaven Born for international freight execution when engaged.',
      useTitle: 'Use this service when', useCases: ['Orders from several suppliers need one shipment.', 'Cartons, quantities and documents must be reconciled before booking.', 'You need one China-origin team to coordinate export readiness.'],
      outputTitle: 'What you receive', outputs: ['A supplier readiness and receiving status record.', 'A consolidated carton, quantity and document reconciliation.', 'A defined freight handoff with open exceptions visible.'],
      sequenceTitle: 'From supplier release to export', sequence: [{ title: 'Plan', body: 'Confirm suppliers, order status, cargo data, destination and required release checks.' }, { title: 'Receive', body: 'Coordinate delivery, count cartons and record visible condition or exceptions.' }, { title: 'Reconcile', body: 'Match orders, packing lists, carton marks, quantities and shipment documents.' }, { title: 'Handoff', body: 'Release the approved cargo scope for booking, loading and export execution.' }],
      boundaryTitle: 'Two accountable roles', boundary: 'DDNZ Global coordinates sourcing, supplier follow-up, receiving and trade-support records. Heaven Born International Freight executes international freight when included in the confirmed scope.', cta: 'Start a consolidation brief',
    },
    zh: {
      eyebrow: '集货与出口交付', title: '把已确认订单合并为一次可控的出口交接。', intro: 'DDNZ 协调供应商完工、收货、数量与包装检查、出货核对；如委托国际货运，则交接给 Heaven Born 执行。',
      useTitle: '适合以下情况', useCases: ['多家供应商订单需要合并出运。', '订舱前必须核对纸箱、数量和单证。', '需要一个中国源头团队统一协调出口准备。'], outputTitle: '您将获得', outputs: ['供应商完工与收货状态记录。', '合并后的箱数、数量及单证核对。', '异常事项清晰可见的货运交接记录。'], sequenceTitle: '从供应商放货到出口', sequence: [{ title: '计划', body: '确认供应商、订单状态、货物数据、目的地和放货检查。' }, { title: '收货', body: '协调送仓、清点箱数并记录外观状态或异常。' }, { title: '核对', body: '匹配订单、装箱单、箱唛、数量与出货单证。' }, { title: '交接', body: '将已确认货物范围交付订舱、装载和出口执行。' }], boundaryTitle: '两个清晰责任主体', boundary: 'DDNZ Global 负责采购、供应商跟进、收货与贸易支持记录；确认范围包含国际货运时，由 Heaven Born International Freight 执行。', cta: '提交集货出口需求',
    },
    ru: {
      eyebrow: 'Консолидация и экспорт', title: 'Объедините утвержденные заказы для контролируемой экспортной передачи.', intro: 'DDNZ координирует готовность поставщиков, приемку, проверку количества и упаковки, сверку отправки и передачу Heaven Born для международной перевозки.',
      useTitle: 'Когда услуга полезна', useCases: ['Заказы нескольких поставщиков нужно объединить.', 'Перед бронированием нужно сверить коробки, количество и документы.', 'Нужна единая команда в Китае для экспортной готовности.'], outputTitle: 'Что вы получите', outputs: ['Статус готовности поставщиков и приемки.', 'Сверку коробок, количества и документов.', 'Определенную передачу перевозчику с открытыми исключениями.'], sequenceTitle: 'От выпуска поставщика к экспорту', sequence: [{ title: 'План', body: 'Подтвердить поставщиков, статус заказов, груз и проверки.' }, { title: 'Приемка', body: 'Координировать доставку, подсчитать коробки и отметить состояние.' }, { title: 'Сверка', body: 'Сопоставить заказы, упаковочные листы, маркировку и документы.' }, { title: 'Передача', body: 'Передать утвержденный груз на бронирование, погрузку и экспорт.' }], boundaryTitle: 'Две ответственные роли', boundary: 'DDNZ Global координирует закупки, поставщиков, приемку и торговые записи. Heaven Born выполняет международную перевозку, если она включена в объем.', cta: 'Начать заявку на консолидацию',
    },
    fr: {
      eyebrow: 'Consolidation et export', title: 'Regroupez les commandes approuvées pour une transmission export contrôlée.', intro: 'DDNZ coordonne la disponibilité fournisseurs, la réception, le comptage, l’emballage, le rapprochement et la transmission à Heaven Born lorsque le fret est inclus.',
      useTitle: 'À utiliser lorsque', useCases: ['Plusieurs commandes fournisseurs doivent être regroupées.', 'Cartons, quantités et documents doivent être rapprochés.', 'Une équipe en Chine doit coordonner la préparation export.'], outputTitle: 'Livrables', outputs: ['Statut de disponibilité et réception.', 'Rapprochement cartons, quantités et documents.', 'Transmission fret définie avec exceptions visibles.'], sequenceTitle: 'De la libération fournisseur à l’export', sequence: [{ title: 'Planifier', body: 'Confirmer fournisseurs, commandes, données cargo et contrôles.' }, { title: 'Recevoir', body: 'Coordonner la livraison, compter et consigner l’état visible.' }, { title: 'Rapprocher', body: 'Comparer commandes, listes, marquages, quantités et documents.' }, { title: 'Transmettre', body: 'Libérer le périmètre approuvé pour réservation, chargement et export.' }], boundaryTitle: 'Deux rôles responsables', boundary: 'DDNZ Global coordonne sourcing, suivi fournisseur, réception et dossiers commerciaux. Heaven Born exécute le fret international lorsqu’il est inclus.', cta: 'Démarrer un brief consolidation',
    },
    es: {
      eyebrow: 'Consolidación y exportación', title: 'Reúna pedidos aprobados para una entrega de exportación controlada.', intro: 'DDNZ coordina preparación de proveedores, recepción, recuento, embalaje, conciliación y entrega a Heaven Born cuando se contrata el transporte internacional.',
      useTitle: 'Utilice este servicio cuando', useCases: ['Los pedidos de varios proveedores deben enviarse juntos.', 'Hay que conciliar cajas, cantidades y documentos.', 'Necesita un equipo en China para coordinar la preparación de exportación.'], outputTitle: 'Qué recibe', outputs: ['Registro de preparación y recepción.', 'Conciliación de cajas, cantidades y documentos.', 'Entrega al transporte con excepciones visibles.'], sequenceTitle: 'De la liberación al envío', sequence: [{ title: 'Planificar', body: 'Confirmar proveedores, pedidos, carga y controles.' }, { title: 'Recibir', body: 'Coordinar la entrega, contar cajas y registrar su estado.' }, { title: 'Conciliar', body: 'Cotejar pedidos, listas, marcas, cantidades y documentos.' }, { title: 'Entregar', body: 'Liberar la carga aprobada para reserva, carga y exportación.' }], boundaryTitle: 'Dos funciones responsables', boundary: 'DDNZ Global coordina compras, proveedores, recepción y registros comerciales. Heaven Born ejecuta el transporte internacional cuando está incluido.', cta: 'Iniciar solicitud de consolidación',
    },
    ar: {
      eyebrow: 'التجميع والتصدير', title: 'اجمع الطلبات المعتمدة في تسليم تصدير واحد مضبوط.', intro: 'تنسق DDNZ جاهزية الموردين والاستلام وعدّ الطرود وفحص التعبئة ومطابقة الشحنة والتسليم إلى Heaven Born عند تضمين الشحن الدولي.',
      useTitle: 'استخدم الخدمة عندما', useCases: ['يجب جمع طلبات عدة موردين في شحنة واحدة.', 'يجب مطابقة الطرود والكميات والمستندات قبل الحجز.', 'تحتاج فريقاً واحداً في الصين لتنسيق جاهزية التصدير.'], outputTitle: 'ما الذي تستلمه', outputs: ['سجل جاهزية الموردين والاستلام.', 'مطابقة موحدة للطرود والكميات والمستندات.', 'تسليم محدد للشحن مع إظهار الاستثناءات.'], sequenceTitle: 'من إفراج المورد إلى التصدير', sequence: [{ title: 'التخطيط', body: 'تأكيد الموردين وحالة الطلب وبيانات البضاعة والفحوص.' }, { title: 'الاستلام', body: 'تنسيق التسليم وعدّ الطرود وتسجيل الحالة الظاهرة.' }, { title: 'المطابقة', body: 'مطابقة الطلبات وقوائم التعبئة والعلامات والكميات والمستندات.' }, { title: 'التسليم', body: 'إطلاق نطاق البضاعة المعتمد للحجز والتحميل والتصدير.' }], boundaryTitle: 'دوران بمسؤولية واضحة', boundary: 'تنسق DDNZ Global الشراء ومتابعة الموردين والاستلام وسجلات الدعم التجاري، وتنفذ Heaven Born الشحن الدولي عند إدراجه في النطاق.', cta: 'ابدأ طلب التجميع',
    },
  },
};

const serviceConfig: Record<SourcingServiceKind, {
  image: string;
  imageAlt: string;
  icon: typeof SearchCheck;
  intent: QuoteIntent;
  quoteSource: string;
  canonicalSlug: string;
}> = {
  'supplier-search': {
    image: '/media/process/supplier-visit-speaker.webp',
    imageAlt: 'Buyer and supplier representatives reviewing speaker products during a China showroom visit',
    icon: SearchCheck,
    intent: 'Product Sourcing',
    quoteSource: 'supplier_search_service',
    canonicalSlug: 'supplier-search',
  },
  'inspection-quality-control': {
    image: '/media/process/packaging-inspection.webp',
    imageAlt: 'Opened speaker package showing product, manual, accessories and protective packing during a visible pack-out check',
    icon: ClipboardCheck,
    intent: 'Supplier Inspection & Consolidation',
    quoteSource: 'quality_control_service',
    canonicalSlug: 'inspection-quality-control',
  },
  'consolidation-export': {
    image: '/media/process/export-loading-poster.webp',
    imageAlt: 'Wooden-crated cargo being moved by pallet jack during China loading preparation',
    icon: Boxes,
    intent: 'Supplier Inspection & Consolidation',
    quoteSource: 'consolidation_export_service',
    canonicalSlug: 'consolidation-export',
  },
};

const localePrefix: Record<Language, string> = { en: '', zh: '/zh-cn', ru: '/ru', fr: '/fr', es: '/es', ar: '/ar' };
const sequenceIcons = [FileSearch, Factory, Camera, PackageCheck];

export default function SourcingServicePage({ kind }: { kind: SourcingServiceKind }) {
  const { language } = useLanguage();
  const location = useLocation();
  const copy = serviceCopy[kind][language];
  const shared = sharedCopy[language];
  const config = serviceConfig[kind];
  const ServiceIcon = config.icon;
  const quoteHref = buildQuoteHref({ intent: config.intent, language, source: config.quoteSource });
  const canonicalPath = `${localePrefix[language]}/sourcing-services/${config.canonicalSlug}`;
  const processPath = `${localePrefix[language]}/how-we-work`;

  const title = language === 'zh'
    ? `${copy.eyebrow} | DDNZ Global`
    : language === 'ru'
      ? `${copy.eyebrow} в Китае | DDNZ Global`
      : language === 'fr'
        ? `${copy.eyebrow} en Chine | DDNZ Global`
        : language === 'es'
          ? `${copy.eyebrow} en China | DDNZ Global`
          : language === 'ar'
            ? `${copy.eyebrow} في الصين | DDNZ Global`
            : `${copy.eyebrow} from China | DDNZ Global`;
  const description = copy.intro;

  return (
    <div className="ddnz-home min-h-screen overflow-x-hidden bg-[#fbfaf7] text-[var(--ddnz-ink)]" dir={language === 'ar' ? 'rtl' : undefined}>
      <SEO
        title={title}
        description={description}
        keywords={`${copy.eyebrow}, China sourcing service, supplier control China, DDNZ Global`}
        canonicalPath={canonicalPath}
        image={config.image}
      />
      <SchemaMarkup type="Service" data={{
        name: copy.eyebrow,
        serviceType: copy.eyebrow,
        description,
        areaServed: 'Global',
        offerUrl: `https://www.ddnzglobal.com${quoteHref}`,
        offerDescription: copy.cta,
        url: `https://www.ddnzglobal.com${canonicalPath}`,
        providerName: 'DDNZ Global Trade Co., Ltd',
      }} />
      <SchemaMarkup type="BreadcrumbList" data={{ items: [
        { name: shared.home, url: `https://www.ddnzglobal.com${localePrefix[language] || '/'}` },
        { name: copy.eyebrow, url: `https://www.ddnzglobal.com${canonicalPath}` },
      ] }} />

      <SourcingHomepageNav />

      <main>
        <header className="relative overflow-hidden bg-[var(--ddnz-ink)] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(118,60,156,.34),transparent_35rem),radial-gradient(circle_at_92%_88%,rgba(201,79,47,.24),transparent_28rem)]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.75fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-300">
                <Link to={localePrefix[language] || '/'} className="hover:text-white">{shared.home}</Link>
                <span aria-hidden="true">/</span><span>{shared.services}</span>
              </nav>
              <div className="mt-8"><DdnzEyebrow icon={ServiceIcon} dark>{copy.eyebrow}</DdnzEyebrow></div>
              <h1 className="mt-5 max-w-[18ch] text-[clamp(2.5rem,5.5vw,4.75rem)] font-black leading-[1.02] tracking-[-0.055em] text-balance">{copy.title}</h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-200 sm:text-lg">{copy.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <DdnzPrimaryLink
                  to={quoteHref}
                  onClick={() => trackEvent('quote_click', { cta_location: `${config.quoteSource}_hero`, lead_goal: config.intent })}
                  tracking
                >
                  {copy.cta}
                </DdnzPrimaryLink>
                <DdnzSecondaryLink to="#service-scope" className="border-white/30 text-white hover:bg-white/10">{copy.outputTitle}</DdnzSecondaryLink>
              </div>
            </div>

            <figure className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-[0_24px_70px_rgba(0,0,0,.35)]">
              <div className="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5]">
                <img src={config.image} alt={config.imageAlt} width="1200" height="1200" fetchPriority="high" className="h-full w-full object-cover" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#09182a] via-[#09182a]/78 to-transparent px-5 pb-5 pt-20 text-xs font-semibold leading-5 text-slate-200">
                {shared.fieldEvidence} · {copy.eyebrow}
              </figcaption>
            </figure>
          </div>
        </header>

        <section id="service-scope" className="scroll-mt-24 border-b border-slate-200 bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-purple-strong)]">01 · {copy.useTitle}</p>
              <h2 className="mt-4 max-w-lg text-3xl font-black tracking-[-0.035em] sm:text-4xl">{copy.useTitle}</h2>
              <ul className="mt-7 space-y-5">
                {copy.useCases.map((item) => <li key={item} className="flex gap-3 text-sm font-semibold leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ddnz-purple)]" aria-hidden="true" />{item}</li>)}
              </ul>
            </div>
            <div className="border-t-4 border-[var(--ddnz-coral)] bg-[#fff8f4] p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-coral-strong)]">02 · {copy.outputTitle}</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.035em]">{copy.outputTitle}</h2>
              <ul className="mt-7 divide-y divide-[#edd8cf]">
                {copy.outputs.map((item, index) => <li key={item} className="flex gap-4 py-4 text-sm font-bold leading-6 text-slate-800"><span className="font-mono text-xs text-[var(--ddnz-coral-strong)]">0{index + 1}</span>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-[#eef2f6] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-purple-strong)]">03 · Process</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-[-0.035em] sm:text-4xl">{copy.sequenceTitle}</h2>
            <ol className="mt-10 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-4">
              {copy.sequence.map((item, index) => {
                const Icon = sequenceIcons[index] || ShieldCheck;
                return <li key={item.title} className="bg-white p-6 sm:p-7">
                  <div className="flex items-center justify-between"><Icon className="h-6 w-6 text-[var(--ddnz-purple)]" aria-hidden="true" /><span className="font-mono text-xs font-black text-slate-400">0{index + 1}</span></div>
                  <h3 className="mt-8 text-lg font-black">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
                </li>;
              })}
            </ol>
            <Link
              to={processPath}
              className="mt-6 inline-flex min-h-11 items-center text-sm font-black text-[var(--ddnz-purple-strong)] underline decoration-transparent underline-offset-4 transition hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ddnz-purple)]"
            >
              {shared.fullProcess} <span aria-hidden="true" className="ml-2 rtl:ml-0 rtl:mr-2">→</span>
            </Link>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.78fr_1.22fr] lg:items-center lg:px-8">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]"><BadgeCheck className="h-6 w-6" aria-hidden="true" /></span>
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-purple-strong)]">{shared.proofLabel}</p><h2 className="mt-2 text-2xl font-black tracking-tight">{shared.proofTitle}</h2></div>
            </div>
            <p className="border-l border-slate-300 pl-6 text-base leading-8 text-slate-600 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6">{shared.proofBody}</p>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-[var(--ddnz-purple-soft)] py-14">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <ShieldCheck className="mx-auto h-8 w-8 text-[var(--ddnz-purple-strong)]" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-black sm:text-3xl">{copy.boundaryTitle}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-700">{copy.boundary}</p>
          </div>
        </section>

        <section className="bg-[var(--ddnz-ink)] py-16 text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div><h2 className="text-3xl font-black tracking-[-0.035em]">{shared.finalTitle}</h2><p className="mt-3 max-w-3xl leading-7 text-slate-300">{shared.finalBody}</p></div>
            <DdnzPrimaryLink
              to={quoteHref}
              onClick={() => trackEvent('quote_click', { cta_location: `${config.quoteSource}_final`, lead_goal: config.intent, path: location.pathname })}
              className="shrink-0 focus-visible:outline-white"
              tracking
            >
              {copy.cta}
            </DdnzPrimaryLink>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
