import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Factory,
  FileCheck2,
  FileOutput,
  PackageCheck,
  Pause,
  Play,
  SearchCheck,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react';
import Footer from '../components/Footer';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import { DdnzEyebrow, DdnzPrimaryLink, DdnzSecondaryLink } from '../components/DdnzUi';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';
import { buildQuoteHref } from '../lib/quoteLinks';
import { trackEvent } from '../lib/utils';

type ProcessStepCopy = {
  title: string;
  body: string;
  output: string;
  gate: string;
  mediaAlt: string;
  mediaLabel: string;
};

type ProcessCopy = {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  play: string;
  pause: string;
  fieldEvidence: string;
  trust: string[];
  workflowLabel: string;
  workflowTitle: string;
  workflowIntro: string;
  outputLabel: string;
  gateLabel: string;
  steps: ProcessStepCopy[];
  categoryLabel: string;
  categoryTitle: string;
  categoryBody: string;
  categoryItems: Array<{ title: string; body: string }>;
  boundaryLabel: string;
  boundaryTitle: string;
  boundaries: string[];
  finalTitle: string;
  finalBody: string;
  home: string;
};

type EvidenceCopy = {
  label: string;
  supplierTitle: string;
  supplierBody: string;
  criteriaCaption: string;
  methodCaption: string;
  openSheet: string;
  supplierNote: string;
  loadingTitle: string;
  loadingBody: string;
  loadingPrimary: string;
  loadingPreparation: string;
  loadingCheck: string;
  loadingNote: string;
};

const copyByLanguage: Record<Language, ProcessCopy> = {
  en: {
    seoTitle: 'How China Sourcing Works | DDNZ Global',
    seoDescription: 'See the six accountable DDNZ checkpoints from buyer brief and supplier comparison to specification checks, QC evidence, consolidation and export handoff.',
    eyebrow: 'How DDNZ works',
    title: 'One brief. Six accountable checkpoints from supplier search to export handoff.',
    intro: 'An order does not move forward simply because a supplier says it is ready. Each stage has a defined input, a responsible action, a recorded output and a release decision.',
    primaryCta: 'Start a sourcing brief',
    secondaryCta: 'Review the six checkpoints',
    play: 'Play field clip', pause: 'Pause field clip', fieldEvidence: 'Real field material · China origin',
    trust: ['One accountable China-origin team', 'Evidence recorded before release', 'Sourcing and freight roles kept clear'],
    workflowLabel: 'The control path', workflowTitle: 'A process built around decisions, not status updates.',
    workflowIntro: 'The exact checks change by product and destination. The responsibility pattern stays consistent: define, compare, approve, follow, verify and reconcile.',
    outputLabel: 'Recorded output', gateLabel: 'Release gate',
    steps: [
      { title: 'Define the buying brief', body: 'Clarify product use, destination market, reference model, specification, quantity, budget and timing. Missing information stays visible instead of being guessed.', output: 'Agreed brief, comparison basis and open questions.', gate: 'The buyer confirms what suppliers will be compared against.', mediaAlt: 'Buyer and China supplier team discussing an audio product in a working showroom', mediaLabel: 'Buyer and product discussion' },
      { title: 'Search and normalize supplier offers', body: 'Identify candidate manufacturers, check basic identity and product fit, then align models, materials, included parts, terms and pack-out before comparing price.', output: 'Comparable supplier matrix with evidence gaps and next checks.', gate: 'The buyer selects sample, audit or negotiation priorities.', mediaAlt: 'Buyer and supplier representatives reviewing speaker products during a China showroom visit', mediaLabel: 'Supplier and product-fit review' },
      { title: 'Approve samples and specifications', body: 'Tie the chosen sample to the model, configuration, components, artwork, accessories and measurable requirements that will govern production and inspection.', output: 'Approved sample or specification record with unresolved items.', gate: 'The sellable configuration is confirmed before production proceeds.', mediaAlt: 'Technician opening an electronic device for a hands-on model and component check', mediaLabel: 'Hands-on model check' },
      { title: 'Follow production against the approved basis', body: 'Track the supplier’s production status and visible exceptions against the agreed model and schedule. A factory visit records progress; it does not replace a formal inspection.', output: 'Production status, observed deviations and corrective follow-up.', gate: 'Open discrepancies are resolved or accepted before final checks.', mediaAlt: 'Commercial ice-machine production line during a supplier factory walkthrough', mediaLabel: 'Commercial-kitchen production follow-up' },
      { title: 'Collect QC evidence at the agreed scope', body: 'Coordinate the defined quantity, model, function, labels, accessories and packing checks. Findings remain tied to photos, checklist items and reported exceptions.', output: 'Traceable inspection evidence and exception list.', gate: 'The buyer accepts the result or requests corrective action.', mediaAlt: 'Speaker package opened to verify the product, manual, accessories and protective packing', mediaLabel: 'Visible pack-out check' },
      { title: 'Reconcile cargo and export handoff', body: 'Match released orders, cartons, quantities, packing records and the confirmed shipping scope before cargo is handed over for booking, loading and export execution.', output: 'Consolidation record and defined freight handoff.', gate: 'Only the approved cargo scope is released to freight execution.', mediaAlt: 'Wooden-crated cargo being moved by pallet jack for loading preparation in China', mediaLabel: 'Loading preparation' },
    ],
    categoryLabel: 'Same control logic · different products', categoryTitle: 'The workflow follows the product, not a generic template.',
    categoryBody: 'Commercial kitchen equipment, audio and mobile accessories require different specifications and checks. DDNZ keeps the same ownership structure while changing the evidence plan for the product and market.',
    categoryItems: [
      { title: 'Commercial kitchen', body: 'Model, capacity, utilities, materials, accessories, data plate and packing.' },
      { title: 'Audio & speakers', body: 'Configuration, functions, battery, microphones, accessories, labels and pack-out.' },
      { title: 'Mobile accessories', body: 'SKU, compatibility, connector, output claims, artwork, barcode and mixed-carton control.' },
    ],
    boundaryLabel: 'Clear boundaries', boundaryTitle: 'What the checkpoints do—and do not—prove.',
    boundaries: ['A supplier shortlist is not a completed factory audit.', 'A production visit is not an inspection report unless the scope and results are recorded.', 'DDNZ coordinates sourcing and trade-support records; Heaven Born executes international freight when it is included in the confirmed scope.'],
    finalTitle: 'Start with the product, destination and order stage.',
    finalBody: 'Send what you already know. The first review identifies missing specifications, the right control path and the evidence needed before the order moves forward.', home: 'Home',
  },
  zh: {
    seoTitle: '中国采购服务流程 | DDNZ Global 大递诺展',
    seoDescription: '了解 DDNZ 从采购需求、供应商比价、样品规格确认到验货证据、集货与出口交接的六个责任节点。',
    eyebrow: 'DDNZ 如何工作', title: '一份采购需求，六个责任节点，从供应商搜索到出口交接。',
    intro: '供应商说“已经完成”并不代表订单可以进入下一环节。每个阶段都应有明确输入、责任动作、记录输出和放行决定。',
    primaryCta: '提交采购需求', secondaryCta: '查看六个责任节点', play: '播放现场片段', pause: '暂停现场片段', fieldEvidence: '真实现场素材 · 中国源头',
    trust: ['一个中国源头责任团队', '放行前记录证据', '采购与货运责任清晰分开'],
    workflowLabel: '控制路径', workflowTitle: '围绕决定建立流程，而不是只更新状态。', workflowIntro: '具体检查会随产品和目的市场改变，但责任逻辑保持一致：定义、比较、确认、跟进、核验和核对。',
    outputLabel: '记录输出', gateLabel: '放行条件',
    steps: [
      { title: '定义采购需求', body: '明确产品用途、目的市场、参考型号、规格、数量、预算和时间。缺失信息保持可见，不由团队擅自猜测。', output: '已确认采购需求、比较口径和待解决问题。', gate: '买家确认供应商比较依据。', mediaAlt: '买家与中国供应商团队在音响展厅沟通产品', mediaLabel: '买家与产品沟通' },
      { title: '搜索供应商并统一报价口径', body: '寻找候选制造商，初步核对企业身份和产品匹配度，并在比价前统一型号、材料、配件、条款和包装。', output: '可比较的供应商矩阵、证据缺口和后续检查。', gate: '买家确定打样、验厂或谈判优先级。', mediaAlt: '买家与供应商代表在中国音响展厅查看产品', mediaLabel: '供应商与产品匹配审核' },
      { title: '确认样品与规格', body: '把选定样品与型号、配置、组件、包装设计、配件及可测量要求绑定，作为生产和验货依据。', output: '样品或规格确认记录及未解决事项。', gate: '生产前确认最终销售配置。', mediaAlt: '技术人员拆开电子设备核对型号与内部组件', mediaLabel: '实物型号检查' },
      { title: '依据确认口径跟进生产', body: '根据确认型号和进度跟踪供应商生产状态与可见异常。到厂跟进可以记录进度，但不能替代正式验货。', output: '生产状态、观察到的偏差和整改跟进。', gate: '最终检查前解决或接受未关闭偏差。', mediaAlt: '商用制冰机生产线及供应商工厂现场', mediaLabel: '商厨设备生产跟进' },
      { title: '按约定范围收集验货证据', body: '协调数量、型号、功能、标签、配件和包装检查，并把发现与照片、清单项目和异常记录对应。', output: '可追溯的验货证据与异常清单。', gate: '买家接受结果或要求整改。', mediaAlt: '打开音响包装核对产品、说明书、配件和保护包装', mediaLabel: '可见包装与配件核对' },
      { title: '核对货物并完成出口交接', body: '在订舱、装载和出口执行前，核对已放行订单、箱数、数量、装箱记录和确认的运输范围。', output: '集货核对记录及明确货运交接。', gate: '只有已批准货物范围可以交付货运执行。', mediaAlt: '木箱货物由地牛移动并准备装载', mediaLabel: '装载准备' },
    ],
    categoryLabel: '同一责任逻辑 · 不同产品', categoryTitle: '流程跟随产品，而不是套用通用模板。', categoryBody: '商用餐厨设备、音响和手机配件需要不同规格与检查。DDNZ 保持统一责任结构，同时根据产品和市场调整证据方案。',
    categoryItems: [{ title: '商用餐厨设备', body: '型号、产能、水电气、材料、配件、铭牌与包装。' }, { title: '音响设备', body: '配置、功能、电池、麦克风、配件、标签与包装内容。' }, { title: '手机配件', body: 'SKU、兼容性、接口、功率声明、包装设计、条码与混装控制。' }],
    boundaryLabel: '清晰边界', boundaryTitle: '这些节点可以证明什么，又不能证明什么。', boundaries: ['供应商候选名单不等于已经完成验厂。', '生产现场访问不等于验货报告，除非检查范围和结果已经记录。', 'DDNZ 负责采购协调与贸易支持记录；确认范围包含国际货运时，由 Heaven Born 执行。'],
    finalTitle: '从产品、目的地和订单阶段开始。', finalBody: '提交您已经掌握的信息。首次审核会明确缺失规格、合适控制路径以及订单进入下一环节前需要的证据。', home: '首页',
  },
  ru: {
    seoTitle: 'Как работает закупка в Китае | DDNZ Global', seoDescription: 'Шесть контрольных этапов DDNZ: бриф, сравнение поставщиков, образцы, производство, инспекция, консолидация и экспортная передача.',
    eyebrow: 'Как работает DDNZ', title: 'Один бриф. Шесть ответственных этапов — от поставщика до экспортной передачи.', intro: 'Заказ не переходит дальше только потому, что поставщик сообщил о готовности. На каждом этапе есть входные данные, ответственное действие, запись и решение о выпуске.',
    primaryCta: 'Начать закупочный бриф', secondaryCta: 'Посмотреть шесть этапов', play: 'Воспроизвести видео', pause: 'Поставить на паузу', fieldEvidence: 'Реальные материалы · Китай', trust: ['Одна ответственная команда в Китае', 'Доказательства до выпуска', 'Роли закупки и фрахта разделены'],
    workflowLabel: 'Контрольный маршрут', workflowTitle: 'Процесс строится вокруг решений, а не статусов.', workflowIntro: 'Проверки меняются по товару и рынку. Логика ответственности неизменна: определить, сравнить, утвердить, проследить, проверить и сверить.', outputLabel: 'Зафиксированный результат', gateLabel: 'Условие выпуска',
    steps: [
      { title: 'Определить закупочный бриф', body: 'Уточнить применение, рынок, модель, спецификацию, объем, бюджет и сроки. Неизвестные данные остаются открытыми.', output: 'Согласованный бриф и открытые вопросы.', gate: 'Покупатель утверждает базу сравнения.', mediaAlt: 'Обсуждение аудиотовара покупателем и командой поставщика', mediaLabel: 'Обсуждение товара' },
      { title: 'Найти и сопоставить предложения', body: 'Подобрать производителей, проверить базовую идентификацию и выровнять модели, материалы, комплектацию, условия и упаковку.', output: 'Сопоставимая матрица и пробелы в доказательствах.', gate: 'Определены приоритеты образцов, аудита или переговоров.', mediaAlt: 'Посещение покупателем китайского шоурума акустики', mediaLabel: 'Проверка соответствия поставщика' },
      { title: 'Утвердить образец и спецификацию', body: 'Связать образец с моделью, конфигурацией, компонентами, макетами, аксессуарами и измеримыми требованиями.', output: 'Запись утвержденного образца или спецификации.', gate: 'Конфигурация подтверждена до производства.', mediaAlt: 'Технический осмотр компонентов электронного устройства', mediaLabel: 'Проверка модели' },
      { title: 'Проследить производство', body: 'Сверять статус и видимые отклонения с утвержденной моделью и графиком. Посещение производства не заменяет инспекцию.', output: 'Статус производства и корректирующие действия.', gate: 'Отклонения закрыты до финальной проверки.', mediaAlt: 'Производственная линия коммерческих льдогенераторов', mediaLabel: 'Контроль производства' },
      { title: 'Собрать доказательства QC', body: 'Координировать согласованные проверки модели, количества, функций, маркировки, аксессуаров и упаковки.', output: 'Прослеживаемые фото, чек-лист и исключения.', gate: 'Покупатель принимает результат или требует исправления.', mediaAlt: 'Проверка упаковки и комплектности акустики', mediaLabel: 'Проверка комплектности' },
      { title: 'Сверить груз и передать в экспорт', body: 'Сопоставить выпущенные заказы, коробки, количество, упаковочные записи и объем перевозки до бронирования и погрузки.', output: 'Запись консолидации и передача фрахту.', gate: 'В перевозку выпускается только утвержденный груз.', mediaAlt: 'Перемещение груза в деревянной упаковке перед погрузкой', mediaLabel: 'Подготовка к погрузке' },
    ],
    categoryLabel: 'Одна логика · разные товары', categoryTitle: 'Процесс следует за товаром, а не за шаблоном.', categoryBody: 'Для кухонного оборудования, аудио и мобильных аксессуаров нужны разные спецификации и проверки при единой структуре ответственности.', categoryItems: [{ title: 'Профессиональная кухня', body: 'Модель, мощность, коммуникации, материалы, табличка и упаковка.' }, { title: 'Аудио и колонки', body: 'Конфигурация, функции, батарея, микрофоны, аксессуары и упаковка.' }, { title: 'Мобильные аксессуары', body: 'SKU, совместимость, разъемы, заявленная мощность, штрихкод и смешанные коробки.' }],
    boundaryLabel: 'Четкие границы', boundaryTitle: 'Что этапы подтверждают — и чего не подтверждают.', boundaries: ['Шорт-лист поставщиков не является завершенным аудитом фабрики.', 'Посещение производства не является отчетом инспекции без зафиксированного объема и результатов.', 'DDNZ координирует закупки и записи; Heaven Born выполняет международный фрахт, если он включен.'], finalTitle: 'Начните с товара, рынка и стадии заказа.', finalBody: 'Первая проверка определит недостающие спецификации, маршрут контроля и необходимые доказательства.', home: 'Главная',
  },
  fr: {
    seoTitle: 'Processus de sourcing en Chine | DDNZ Global', seoDescription: 'Les six points de contrôle DDNZ : brief, comparaison fournisseurs, échantillons, production, preuves QC, consolidation et transmission export.',
    eyebrow: 'Comment travaille DDNZ', title: 'Un brief. Six points de contrôle, de la recherche fournisseur à la transmission export.', intro: 'Une commande n’avance pas uniquement parce qu’un fournisseur la déclare prête. Chaque étape possède une entrée, une action responsable, un résultat consigné et une décision de libération.', primaryCta: 'Démarrer un brief sourcing', secondaryCta: 'Voir les six étapes', play: 'Lire la séquence', pause: 'Mettre en pause', fieldEvidence: 'Matériel réel · origine Chine', trust: ['Une équipe responsable en Chine', 'Preuves avant libération', 'Rôles sourcing et fret séparés'],
    workflowLabel: 'Parcours de contrôle', workflowTitle: 'Un processus guidé par les décisions, pas par les statuts.', workflowIntro: 'Les contrôles varient selon le produit et le marché. La logique reste : définir, comparer, approuver, suivre, vérifier et rapprocher.', outputLabel: 'Résultat consigné', gateLabel: 'Condition de libération',
    steps: [
      { title: 'Définir le brief d’achat', body: 'Clarifier usage, marché, modèle, spécifications, quantité, budget et délai. Les informations manquantes restent visibles.', output: 'Brief convenu et questions ouvertes.', gate: 'L’acheteur confirme la base de comparaison.', mediaAlt: 'Discussion d’un produit audio entre acheteur et équipe fournisseur', mediaLabel: 'Discussion acheteur-produit' },
      { title: 'Rechercher et normaliser les offres', body: 'Identifier les fabricants, vérifier leur identité de base et aligner modèles, matières, accessoires, conditions et emballage.', output: 'Matrice comparable et preuves manquantes.', gate: 'Priorités d’échantillon, audit ou négociation choisies.', mediaAlt: 'Visite d’un showroom audio par un acheteur', mediaLabel: 'Revue fournisseur-produit' },
      { title: 'Approuver échantillon et spécifications', body: 'Relier l’échantillon au modèle, à la configuration, aux composants, aux visuels, accessoires et exigences mesurables.', output: 'Échantillon ou spécification approuvé avec points ouverts.', gate: 'Configuration vendable confirmée avant production.', mediaAlt: 'Contrôle manuel des composants d’un appareil électronique', mediaLabel: 'Contrôle du modèle' },
      { title: 'Suivre la production', body: 'Suivre le statut et les écarts visibles par rapport au modèle et au calendrier approuvés. Une visite ne remplace pas une inspection.', output: 'Statut, écarts observés et suivi correctif.', gate: 'Écarts traités avant les contrôles finaux.', mediaAlt: 'Ligne de production de machines à glaçons commerciales', mediaLabel: 'Suivi de production' },
      { title: 'Collecter les preuves QC', body: 'Coordonner les contrôles convenus du modèle, quantité, fonctions, étiquettes, accessoires et emballage.', output: 'Photos, checklist et exceptions traçables.', gate: 'Résultat accepté ou action corrective demandée.', mediaAlt: 'Vérification de l’emballage et des accessoires d’une enceinte', mediaLabel: 'Contrôle du conditionnement' },
      { title: 'Rapprocher et transmettre à l’export', body: 'Rapprocher commandes libérées, cartons, quantités, dossiers d’emballage et périmètre de transport avant réservation et chargement.', output: 'Dossier de consolidation et transmission fret.', gate: 'Seul le périmètre approuvé est remis au fret.', mediaAlt: 'Caisse en bois déplacée avant chargement', mediaLabel: 'Préparation au chargement' },
    ],
    categoryLabel: 'Même logique · produits différents', categoryTitle: 'Le flux suit le produit, pas un modèle générique.', categoryBody: 'Cuisine professionnelle, audio et accessoires mobiles exigent des contrôles différents dans une structure de responsabilité commune.', categoryItems: [{ title: 'Cuisine professionnelle', body: 'Modèle, capacité, utilités, matières, plaque et emballage.' }, { title: 'Audio et enceintes', body: 'Configuration, fonctions, batterie, microphones, accessoires et conditionnement.' }, { title: 'Accessoires mobiles', body: 'SKU, compatibilité, connecteur, puissance déclarée, visuels, code-barres et cartons mixtes.' }], boundaryLabel: 'Limites claires', boundaryTitle: 'Ce que les étapes prouvent — et ne prouvent pas.', boundaries: ['Une présélection fournisseur n’est pas un audit usine terminé.', 'Une visite de production n’est pas un rapport d’inspection sans périmètre et résultats consignés.', 'DDNZ coordonne le sourcing et les dossiers ; Heaven Born exécute le fret international lorsqu’il est inclus.'], finalTitle: 'Commencez par le produit, la destination et l’étape de commande.', finalBody: 'La première revue identifie les spécifications manquantes, le parcours de contrôle et les preuves nécessaires.', home: 'Accueil',
  },
  es: {
    seoTitle: 'Proceso de compras en China | DDNZ Global', seoDescription: 'Los seis puntos de control DDNZ: brief, comparación de proveedores, muestras, producción, pruebas QC, consolidación y entrega de exportación.',
    eyebrow: 'Cómo trabaja DDNZ', title: 'Un brief. Seis puntos responsables desde la búsqueda del proveedor hasta la entrega de exportación.', intro: 'Un pedido no avanza solo porque el proveedor diga que está listo. Cada etapa tiene entrada, acción responsable, resultado registrado y decisión de liberación.', primaryCta: 'Iniciar solicitud de compra', secondaryCta: 'Ver los seis puntos', play: 'Reproducir vídeo', pause: 'Pausar vídeo', fieldEvidence: 'Material real · origen China', trust: ['Un equipo responsable en China', 'Pruebas antes de liberar', 'Compras y transporte con funciones claras'],
    workflowLabel: 'Ruta de control', workflowTitle: 'Un proceso basado en decisiones, no en estados.', workflowIntro: 'Las comprobaciones cambian según producto y mercado. La responsabilidad mantiene la misma lógica: definir, comparar, aprobar, seguir, verificar y conciliar.', outputLabel: 'Resultado registrado', gateLabel: 'Condición de liberación',
    steps: [
      { title: 'Definir el brief de compra', body: 'Aclarar uso, mercado, modelo, especificaciones, cantidad, presupuesto y plazo. Lo desconocido permanece visible.', output: 'Brief acordado y preguntas abiertas.', gate: 'El comprador confirma la base de comparación.', mediaAlt: 'Comprador y equipo proveedor hablando de un producto de audio', mediaLabel: 'Conversación comprador-producto' },
      { title: 'Buscar y normalizar ofertas', body: 'Identificar fabricantes, revisar identidad y ajustar modelos, materiales, accesorios, condiciones y embalaje antes de comparar.', output: 'Matriz comparable y faltas de evidencia.', gate: 'Se eligen prioridades de muestra, auditoría o negociación.', mediaAlt: 'Visita de comprador a showroom de altavoces', mediaLabel: 'Revisión proveedor-producto' },
      { title: 'Aprobar muestras y especificaciones', body: 'Vincular la muestra con modelo, configuración, componentes, arte, accesorios y requisitos medibles.', output: 'Muestra o especificación aprobada y puntos abiertos.', gate: 'Configuración comercial confirmada antes de producir.', mediaAlt: 'Revisión manual de componentes de un dispositivo', mediaLabel: 'Comprobación de modelo' },
      { title: 'Seguir la producción', body: 'Registrar estado y desviaciones visibles frente al modelo y calendario aprobados. Una visita no sustituye una inspección.', output: 'Estado de producción y seguimiento correctivo.', gate: 'Desviaciones resueltas antes del control final.', mediaAlt: 'Línea de producción de máquinas de hielo comerciales', mediaLabel: 'Seguimiento de producción' },
      { title: 'Recoger evidencia de calidad', body: 'Coordinar las comprobaciones acordadas de modelo, cantidad, función, etiquetas, accesorios y embalaje.', output: 'Fotos, checklist y excepciones trazables.', gate: 'El comprador acepta o solicita corrección.', mediaAlt: 'Comprobación del producto, manual y embalaje de un altavoz', mediaLabel: 'Comprobación de embalaje' },
      { title: 'Conciliar carga y entrega de exportación', body: 'Cotejar pedidos liberados, cajas, cantidades, registros y alcance de transporte antes de reserva y carga.', output: 'Registro de consolidación y entrega al transporte.', gate: 'Solo se entrega la carga aprobada.', mediaAlt: 'Carga en caja de madera preparada para embarque', mediaLabel: 'Preparación de carga' },
    ],
    categoryLabel: 'Misma lógica · productos distintos', categoryTitle: 'El flujo sigue al producto, no a una plantilla.', categoryBody: 'Cocina comercial, audio y accesorios móviles requieren especificaciones distintas dentro de una estructura común de responsabilidad.', categoryItems: [{ title: 'Cocina comercial', body: 'Modelo, capacidad, servicios, materiales, placa y embalaje.' }, { title: 'Audio y altavoces', body: 'Configuración, funciones, batería, micrófonos, accesorios y embalaje.' }, { title: 'Accesorios móviles', body: 'SKU, compatibilidad, conector, potencia declarada, arte, código de barras y cajas mixtas.' }], boundaryLabel: 'Límites claros', boundaryTitle: 'Qué demuestran los puntos — y qué no.', boundaries: ['Una lista de proveedores no es una auditoría de fábrica terminada.', 'Una visita de producción no es un informe de inspección sin alcance y resultados registrados.', 'DDNZ coordina compras y registros; Heaven Born ejecuta el transporte internacional cuando se incluye.'], finalTitle: 'Empiece por el producto, destino y estado del pedido.', finalBody: 'La primera revisión identifica las especificaciones faltantes, la ruta de control y las pruebas necesarias.', home: 'Inicio',
  },
  ar: {
    seoTitle: 'آلية التوريد من الصين | DDNZ Global', seoDescription: 'ست نقاط مسؤولية من DDNZ: موجز الشراء ومقارنة الموردين والعينات والإنتاج وأدلة الجودة والتجميع وتسليم التصدير.',
    eyebrow: 'كيف تعمل DDNZ', title: 'موجز واحد وست نقاط مسؤولية من البحث عن المورد إلى تسليم التصدير.', intro: 'لا ينتقل الطلب لمجرد إعلان المورد جاهزيته. لكل مرحلة مدخل واضح وإجراء مسؤول ومخرج مسجل وقرار إفراج.', primaryCta: 'ابدأ موجز التوريد', secondaryCta: 'راجع النقاط الست', play: 'تشغيل المقطع', pause: 'إيقاف المقطع', fieldEvidence: 'مواد ميدانية حقيقية · منشأ الصين', trust: ['فريق واحد مسؤول في الصين', 'توثيق الأدلة قبل الإفراج', 'فصل واضح بين التوريد والشحن'],
    workflowLabel: 'مسار الرقابة', workflowTitle: 'عملية مبنية حول القرارات لا تحديثات الحالة.', workflowIntro: 'تتغير الفحوص حسب المنتج والسوق، بينما يبقى نمط المسؤولية: تحديد ومقارنة واعتماد ومتابعة وتحقق ومطابقة.', outputLabel: 'المخرج المسجل', gateLabel: 'شرط الإفراج',
    steps: [
      { title: 'تحديد موجز الشراء', body: 'توضيح الاستخدام والسوق والطراز والمواصفات والكمية والميزانية والموعد، مع إبقاء المعلومات الناقصة ظاهرة.', output: 'موجز متفق عليه وأسئلة مفتوحة.', gate: 'يؤكد المشتري أساس المقارنة.', mediaAlt: 'مناقشة منتج صوتي بين المشتري وفريق المورد', mediaLabel: 'مناقشة المشتري والمنتج' },
      { title: 'البحث وتوحيد عروض الموردين', body: 'تحديد المصنعين والتحقق الأساسي من الهوية ومواءمة الطرازات والمواد والملحقات والشروط والتعبئة.', output: 'مصفوفة قابلة للمقارنة وفجوات الأدلة.', gate: 'تحديد أولويات العينة أو التدقيق أو التفاوض.', mediaAlt: 'زيارة مشتري لمعرض مكبرات صوت في الصين', mediaLabel: 'مراجعة المورد والمنتج' },
      { title: 'اعتماد العينة والمواصفات', body: 'ربط العينة بالطراز والتكوين والمكونات والتصميم والملحقات والمتطلبات القابلة للقياس.', output: 'سجل عينة أو مواصفات معتمد.', gate: 'تأكيد التكوين قبل الإنتاج.', mediaAlt: 'فحص مكونات جهاز إلكتروني يدوياً', mediaLabel: 'فحص الطراز' },
      { title: 'متابعة الإنتاج', body: 'متابعة الحالة والانحرافات الظاهرة مقابل الطراز والجدول المعتمد. زيارة المصنع لا تستبدل التفتيش الرسمي.', output: 'حالة الإنتاج ومتابعة التصحيح.', gate: 'إغلاق الانحرافات قبل الفحص النهائي.', mediaAlt: 'خط إنتاج آلات ثلج تجارية', mediaLabel: 'متابعة الإنتاج' },
      { title: 'جمع أدلة مراقبة الجودة', body: 'تنسيق فحوص الطراز والكمية والوظائف والملصقات والملحقات والتعبئة وفق النطاق المتفق عليه.', output: 'صور وقائمة فحص واستثناءات قابلة للتتبع.', gate: 'يقبل المشتري النتيجة أو يطلب التصحيح.', mediaAlt: 'فحص منتج صوتي ودليل وملحقات داخل العبوة', mediaLabel: 'فحص محتويات العبوة' },
      { title: 'مطابقة البضاعة وتسليم التصدير', body: 'مطابقة الطلبات والطرود والكميات وسجلات التعبئة ونطاق النقل قبل الحجز والتحميل.', output: 'سجل تجميع وتسليم واضح للشحن.', gate: 'لا يسلّم للشحن إلا النطاق المعتمد.', mediaAlt: 'نقل بضاعة بصندوق خشبي استعداداً للتحميل', mediaLabel: 'التحضير للتحميل' },
    ],
    categoryLabel: 'منطق واحد · منتجات مختلفة', categoryTitle: 'يتبع المسار المنتج وليس قالباً عاماً.', categoryBody: 'تحتاج معدات المطابخ والصوت وملحقات الهاتف إلى مواصفات وفحوص مختلفة ضمن هيكل مسؤولية واحد.', categoryItems: [{ title: 'المطابخ التجارية', body: 'الطراز والسعة والخدمات والمواد ولوحة البيانات والتعبئة.' }, { title: 'الصوت ومكبرات الصوت', body: 'التكوين والوظائف والبطارية والميكروفونات والملحقات والتعبئة.' }, { title: 'ملحقات الهاتف', body: 'SKU والتوافق والموصل والطاقة المعلنة والتصميم والباركود والطرود المختلطة.' }], boundaryLabel: 'حدود واضحة', boundaryTitle: 'ما الذي تثبته النقاط وما الذي لا تثبته.', boundaries: ['القائمة المختصرة للموردين ليست تدقيق مصنع مكتمل.', 'زيارة الإنتاج ليست تقرير فحص دون نطاق ونتائج مسجلة.', 'تنسق DDNZ التوريد والسجلات، وتنفذ Heaven Born الشحن الدولي عند إدراجه.'], finalTitle: 'ابدأ بالمنتج والوجهة ومرحلة الطلب.', finalBody: 'تحدد المراجعة الأولى المواصفات الناقصة ومسار الرقابة والأدلة المطلوبة قبل تقدم الطلب.', home: 'الرئيسية',
  },
  pt: {
    seoTitle: 'Como funciona o sourcing na China | DDNZ Global', seoDescription: 'Conheça os seis pontos de controle DDNZ: brief, comparação de fornecedores, amostras, produção, inspeção, consolidação e entrega para exportação.',
    eyebrow: 'Como a DDNZ trabalha', title: 'Um brief. Seis pontos de responsabilidade, da busca à entrega para exportação.', intro: 'O pedido não avança apenas porque o fornecedor diz que está pronto. Cada fase tem entrada, ação responsável, resultado registrado e decisão de liberação.', primaryCta: 'Iniciar brief de sourcing', secondaryCta: 'Ver os seis pontos', play: 'Reproduzir vídeo', pause: 'Pausar vídeo', fieldEvidence: 'Material real · Origem China', trust: ['Uma equipe responsável na China', 'Evidências antes da liberação', 'Responsabilidades de sourcing e frete separadas'],
    workflowLabel: 'Caminho de controle', workflowTitle: 'Um processo baseado em decisões, não apenas em atualizações.', workflowIntro: 'Os controles mudam conforme produto e mercado; a lógica permanece: definir, comparar, aprovar, acompanhar, verificar e conciliar.', outputLabel: 'Resultado registrado', gateLabel: 'Condição de liberação',
    steps: [
      { title: 'Definir o brief de compra', body: 'Esclarecer uso, mercado, modelo, especificação, quantidade, orçamento e prazo, mantendo as lacunas visíveis.', output: 'Brief acordado, base de comparação e perguntas abertas.', gate: 'O comprador confirma a base para comparar fornecedores.', mediaAlt: 'Comprador e equipe na China discutindo produto de áudio', mediaLabel: 'Discussão do produto' },
      { title: 'Buscar e normalizar propostas', body: 'Identificar fabricantes, verificar identidade e alinhar modelo, material, peças, termos e embalagem antes de comparar preço.', output: 'Matriz comparável com lacunas de evidência.', gate: 'O comprador define prioridades de amostra, auditoria ou negociação.', mediaAlt: 'Comprador avaliando caixas de som em showroom na China', mediaLabel: 'Avaliação de fornecedor e produto' },
      { title: 'Aprovar amostras e especificações', body: 'Vincular a amostra ao modelo, configuração, componentes, arte, acessórios e requisitos mensuráveis.', output: 'Registro da amostra ou especificação e pendências.', gate: 'Configuração comercial confirmada antes da produção.', mediaAlt: 'Técnico verificando componentes de um dispositivo', mediaLabel: 'Verificação prática do modelo' },
      { title: 'Acompanhar a produção', body: 'Comparar o andamento e desvios visíveis ao modelo e cronograma aprovados. A visita não substitui a inspeção formal.', output: 'Situação da produção e ações corretivas.', gate: 'Desvios resolvidos antes da verificação final.', mediaAlt: 'Linha de produção de máquinas de gelo comercial', mediaLabel: 'Acompanhamento de produção' },
      { title: 'Coletar evidências de qualidade', body: 'Coordenar verificações de modelo, quantidade, função, etiquetas, acessórios e embalagem no escopo acordado.', output: 'Fotos, checklist e exceções rastreáveis.', gate: 'O comprador aceita o resultado ou pede correção.', mediaAlt: 'Verificação de produto, manual e acessórios de uma caixa de som', mediaLabel: 'Verificação da embalagem' },
      { title: 'Conciliar a carga e entregar para exportação', body: 'Comparar pedidos liberados, caixas, quantidades, registros e escopo de transporte antes da reserva e do carregamento.', output: 'Registro de consolidação e entrega definida ao frete.', gate: 'Somente a carga aprovada segue para o transporte.', mediaAlt: 'Carga em caixa de madeira sendo preparada para embarque', mediaLabel: 'Preparação de carga' },
    ],
    categoryLabel: 'Mesma lógica · produtos diferentes', categoryTitle: 'O fluxo acompanha o produto, não um modelo genérico.', categoryBody: 'Cozinha profissional, áudio e acessórios móveis exigem especificações diferentes dentro da mesma estrutura de responsabilidade.', categoryItems: [{ title: 'Cozinha profissional', body: 'Modelo, capacidade, utilidades, materiais, placa e embalagem.' }, { title: 'Áudio e caixas de som', body: 'Configuração, funções, bateria, microfones, acessórios e embalagem.' }, { title: 'Acessórios móveis', body: 'SKU, compatibilidade, conector, potência, arte, código de barras e caixas mistas.' }], boundaryLabel: 'Limites claros', boundaryTitle: 'O que os pontos comprovam—e o que não comprovam.', boundaries: ['Uma lista curta não é uma auditoria completa da fábrica.', 'Uma visita de produção não é um relatório de inspeção sem escopo e resultados registrados.', 'A DDNZ coordena o sourcing; a Heaven Born executa o frete internacional quando incluído.'], finalTitle: 'Comece pelo produto, destino e fase do pedido.', finalBody: 'A primeira análise identifica especificações ausentes, o caminho de controle e as evidências necessárias.', home: 'Início',
  },
  tr: {
    seoTitle: 'Çin’den tedarik süreci nasıl işler | DDNZ Global', seoDescription: 'DDNZ’nin altı kontrol noktasını görün: talep, tedarikçi karşılaştırması, numune, üretim, kalite kanıtı, konsolidasyon ve ihracat teslimi.',
    eyebrow: 'DDNZ nasıl çalışır', title: 'Tek talep. Tedarikçi aramadan ihracat teslimine altı sorumlu kontrol noktası.', intro: 'Sipariş yalnızca tedarikçi hazır dediği için ilerlemez. Her aşamada tanımlı girdi, sorumlu eylem, kayıtlı çıktı ve serbest bırakma kararı vardır.', primaryCta: 'Tedarik talebi oluştur', secondaryCta: 'Altı kontrol noktasını incele', play: 'Saha videosunu oynat', pause: 'Videoyu duraklat', fieldEvidence: 'Gerçek saha materyali · Çin çıkışı', trust: ['Çin’de tek sorumlu ekip', 'Serbest bırakmadan önce kayıtlı kanıt', 'Tedarik ve nakliye rolleri açıkça ayrılmıştır'],
    workflowLabel: 'Kontrol yolu', workflowTitle: 'Durum güncellemelerine değil kararlara dayalı süreç.', workflowIntro: 'Kontroller ürün ve pazara göre değişir; sorumluluk modeli sabittir: tanımla, karşılaştır, onayla, takip et, doğrula ve uzlaştır.', outputLabel: 'Kayıtlı çıktı', gateLabel: 'Serbest bırakma koşulu',
    steps: [
      { title: 'Satın alma talebini tanımla', body: 'Kullanım, pazar, model, özellik, miktar, bütçe ve zamanı netleştirin; eksikler tahmin edilmeden görünür kalır.', output: 'Onaylı talep, karşılaştırma temeli ve açık sorular.', gate: 'Alıcı, tedarikçilerin hangi temelde karşılaştırılacağını onaylar.', mediaAlt: 'Alıcı ve Çin ekibi ses ürünü hakkında görüşüyor', mediaLabel: 'Alıcı ve ürün görüşmesi' },
      { title: 'Tedarikçi tekliflerini ara ve normalize et', body: 'Üreticileri belirleyin, kimlik ve ürün uygunluğunu kontrol edin; fiyat öncesi model, malzeme, parçalar, şartlar ve ambalajı hizalayın.', output: 'Karşılaştırılabilir tedarikçi matrisi ve kanıt açıkları.', gate: 'Alıcı numune, denetim veya pazarlık önceliğini seçer.', mediaAlt: 'Alıcı Çin’de hoparlör showroomunda ürün inceliyor', mediaLabel: 'Tedarikçi ve ürün uygunluğu' },
      { title: 'Numune ve özellikleri onayla', body: 'Seçilen numuneyi model, yapılandırma, bileşen, tasarım, aksesuar ve ölçülebilir gerekliliklere bağlayın.', output: 'Onaylı numune veya özellik kaydı ve açık maddeler.', gate: 'Satılabilir yapılandırma üretimden önce onaylanır.', mediaAlt: 'Teknisyen elektronik cihaz bileşenlerini kontrol ediyor', mediaLabel: 'Uygulamalı model kontrolü' },
      { title: 'Üretimi onaylı temele göre takip et', body: 'Tedarikçi durumunu ve görünür sapmaları onaylı model ve programa göre izleyin. Ziyaret resmi denetimin yerine geçmez.', output: 'Üretim durumu ve düzeltici takip.', gate: 'Sapmalar son kontrolden önce kapatılır.', mediaAlt: 'Endüstriyel buz makinesi üretim hattı', mediaLabel: 'Üretim takibi' },
      { title: 'Kararlaştırılan kapsamda kalite kanıtı topla', body: 'Model, miktar, işlev, etiket, aksesuar ve ambalaj kontrollerini koordine edin.', output: 'İzlenebilir fotoğraflar, kontrol listesi ve istisnalar.', gate: 'Alıcı sonucu kabul eder veya düzeltme ister.', mediaAlt: 'Hoparlör ürün, kılavuz ve aksesuar kontrolü', mediaLabel: 'Ambalaj içeriği kontrolü' },
      { title: 'Yükü uzlaştır ve ihracata teslim et', body: 'Rezervasyon ve yükleme öncesi serbest siparişleri, kolileri, miktarları, kayıtları ve taşıma kapsamını eşleştirin.', output: 'Konsolidasyon kaydı ve tanımlı nakliye teslimi.', gate: 'Yalnızca onaylı yük nakliyeye bırakılır.', mediaAlt: 'Sevkiyat için hazırlanan ahşap kasalı yük', mediaLabel: 'Yükleme hazırlığı' },
    ],
    categoryLabel: 'Aynı kontrol mantığı · farklı ürünler', categoryTitle: 'Süreç genel şablonu değil ürünü izler.', categoryBody: 'Endüstriyel mutfak, ses ve mobil aksesuarlar farklı özellik ve kontroller gerektirir.', categoryItems: [{ title: 'Endüstriyel mutfak', body: 'Model, kapasite, tesisat, malzeme, bilgi plakası ve ambalaj.' }, { title: 'Ses ve hoparlör', body: 'Yapılandırma, işlevler, pil, mikrofonlar, aksesuarlar ve ambalaj.' }, { title: 'Mobil aksesuarlar', body: 'SKU, uyumluluk, konnektör, güç iddiası, tasarım, barkod ve karma koli kontrolü.' }], boundaryLabel: 'Açık sınırlar', boundaryTitle: 'Kontrol noktalarının kanıtladığı ve kanıtlamadığı şeyler.', boundaries: ['Tedarikçi kısa listesi tamamlanmış fabrika denetimi değildir.', 'Kapsam ve sonuçlar kaydedilmedikçe üretim ziyareti denetim raporu değildir.', 'DDNZ tedarik koordinasyonunu yürütür; kapsamdaysa uluslararası nakliyeyi Heaven Born uygular.'], finalTitle: 'Ürün, varış yeri ve sipariş aşamasıyla başlayın.', finalBody: 'İlk inceleme eksik özellikleri, doğru kontrol yolunu ve gerekli kanıtları belirler.', home: 'Ana sayfa',
  },
};

const evidenceCopyByLanguage: Record<Language, EvidenceCopy> = {
  en: {
    label: 'Operational evidence',
    supplierTitle: 'One scoring method, applied before a shortlist moves forward.',
    supplierBody: 'Offers are normalized first, then reviewed across delivery, quality, service and cost. Veto thresholds prevent a low price from hiding repeated delivery or quality failures.',
    criteriaCaption: 'Criteria, weights and veto thresholds',
    methodCaption: 'Quartile scoring and controlled bonus rules',
    openSheet: 'Open full method sheet',
    supplierNote: 'Publication-ready method sheets · Weights and veto gates retained',
    loadingTitle: 'Released cartons move through a visible export handoff.',
    loadingBody: 'These field records show loading and door-area checks for a mobile-accessories order. They support what happened at origin without turning a loading photo into a customs or delivery claim.',
    loadingPrimary: 'Cartons moved into the container',
    loadingPreparation: 'Container-closing preparation',
    loadingCheck: 'Door and seal-area oversight',
    loadingNote: 'Vehicle and carton identifiers redacted · People and field conditions retained',
  },
  zh: {
    label: '真实作业证据',
    supplierTitle: '同一套评分方法，决定供应商是否进入下一轮。',
    supplierBody: '先统一报价口径，再从交付、质量、服务和成本四个维度评价。硬性否决线避免低价掩盖反复延期或质量失控。',
    criteriaCaption: '指标、权重与一票否决线',
    methodCaption: '四分位评分与受控加分规则',
    openSheet: '查看完整方法页',
    supplierNote: '个人标识已移除 · 评分方法完整保留',
    loadingTitle: '已放行货物进入可核对的出口交接。',
    loadingBody: '以下现场记录来自一批手机配件装柜及柜门区域检查，仅证明中国源头发生的装载和监督动作，不延伸为报关完成或目的地交付声明。',
    loadingPrimary: '纸箱装入集装箱',
    loadingPreparation: '关柜前准备',
    loadingCheck: '柜门与封识区域监督',
    loadingNote: '车辆及纸箱识别信息已脱敏 · 人物与现场状态保留',
  },
  ru: {
    label: 'Операционные доказательства',
    supplierTitle: 'Единая методика оценки до перехода поставщика в следующий этап.',
    supplierBody: 'Предложения сначала приводятся к общей базе, затем оцениваются по срокам, качеству, взаимодействию и стоимости. Пороговые запреты не позволяют низкой цене скрыть повторные сбои.',
    criteriaCaption: 'Критерии, веса и пороговые запреты',
    methodCaption: 'Квартильная оценка и контролируемые бонусы',
    openSheet: 'Открыть методику полностью',
    supplierNote: 'Локализованные методические листы · Веса и пороги сохранены',
    loadingTitle: 'Одобренные короба проходят видимую экспортную передачу.',
    loadingBody: 'Полевые материалы показывают погрузку мобильных аксессуаров и проверку зоны дверей контейнера. Они подтверждают действия в Китае, но не заявляют о завершении таможни или доставки.',
    loadingPrimary: 'Погрузка коробов в контейнер',
    loadingPreparation: 'Подготовка к закрытию контейнера',
    loadingCheck: 'Контроль дверей и зоны пломбы',
    loadingNote: 'Номера транспорта и маркировка коробов скрыты · Люди и условия сохранены',
  },
  fr: {
    label: 'Preuves opérationnelles',
    supplierTitle: 'Une même méthode de notation avant de faire avancer un fournisseur.',
    supplierBody: 'Les offres sont d’abord normalisées, puis examinées selon la livraison, la qualité, le service et le coût. Les seuils éliminatoires empêchent qu’un prix bas masque des défaillances répétées.',
    criteriaCaption: 'Critères, pondérations et seuils éliminatoires',
    methodCaption: 'Notation par quartiles et bonus encadrés',
    openSheet: 'Ouvrir la fiche complète',
    supplierNote: 'Fiches méthodologiques localisées · Pondérations et seuils conservés',
    loadingTitle: 'Les cartons libérés passent par une remise export visible.',
    loadingBody: 'Ces documents terrain montrent le chargement d’accessoires mobiles et le contrôle de la zone des portes. Ils prouvent l’action à l’origine, sans prétendre au dédouanement ou à la livraison finale.',
    loadingPrimary: 'Chargement des cartons dans le conteneur',
    loadingPreparation: 'Préparation avant fermeture',
    loadingCheck: 'Contrôle des portes et de la zone du scellé',
    loadingNote: 'Identifiants véhicule et cartons masqués · Personnes et conditions conservées',
  },
  es: {
    label: 'Evidencia operativa',
    supplierTitle: 'Un método de puntuación antes de hacer avanzar a un proveedor.',
    supplierBody: 'Primero se normalizan las ofertas y luego se revisan entrega, calidad, servicio y coste. Los umbrales de veto impiden que un precio bajo oculte fallos repetidos.',
    criteriaCaption: 'Criterios, ponderaciones y umbrales de veto',
    methodCaption: 'Puntuación por cuartiles y bonificaciones controladas',
    openSheet: 'Abrir la ficha completa',
    supplierNote: 'Fichas metodológicas localizadas · Pesos y umbrales conservados',
    loadingTitle: 'Las cajas liberadas pasan por una entrega de exportación visible.',
    loadingBody: 'Estos registros muestran la carga de accesorios móviles y la revisión de la zona de puertas. Demuestran la acción en origen sin afirmar despacho aduanero ni entrega final.',
    loadingPrimary: 'Carga de cajas en el contenedor',
    loadingPreparation: 'Preparación antes del cierre',
    loadingCheck: 'Supervisión de puertas y zona del precinto',
    loadingNote: 'Identificadores de vehículo y cajas ocultos · Personas y condiciones conservadas',
  },
  ar: {
    label: 'أدلة التشغيل',
    supplierTitle: 'منهج تقييم واحد قبل انتقال المورد إلى المرحلة التالية.',
    supplierBody: 'توحّد العروض أولاً ثم تراجع من حيث التسليم والجودة والخدمة والتكلفة. تمنع حدود الرفض السعر المنخفض من إخفاء الإخفاقات المتكررة.',
    criteriaCaption: 'المعايير والأوزان وحدود الرفض',
    methodCaption: 'تقييم ربعي وقواعد مكافآت منضبطة',
    openSheet: 'فتح ورقة المنهج كاملة',
    supplierNote: 'أوراق منهجية مترجمة · الأوزان وحدود الرفض محفوظة',
    loadingTitle: 'تنتقل الطرود المعتمدة عبر تسليم تصدير قابل للمراجعة.',
    loadingBody: 'توضح السجلات الميدانية تحميل طلب ملحقات هاتف وفحص منطقة أبواب الحاوية. وهي تثبت العمل في المنشأ ولا تدعي اكتمال التخليص أو التسليم.',
    loadingPrimary: 'تحميل الطرود داخل الحاوية',
    loadingPreparation: 'التحضير قبل إغلاق الحاوية',
    loadingCheck: 'الإشراف على الأبواب ومنطقة الختم',
    loadingNote: 'حجبت معرفات المركبة والطرود · أبقي الأشخاص وظروف الموقع',
  },
  pt: {
    label: 'Evidência operacional', supplierTitle: 'Um método de avaliação antes de o fornecedor avançar.', supplierBody: 'As propostas são normalizadas e avaliadas por prazo, qualidade, serviço e custo. Critérios eliminatórios evitam que o menor preço esconda falhas repetidas.', criteriaCaption: 'Critérios, pesos e condições eliminatórias', methodCaption: 'Pontuação por quartis e bônus controlados', openSheet: 'Abrir método completo', supplierNote: 'Método publicado em inglês · Pesos e condições preservados', loadingTitle: 'As caixas liberadas passam por uma entrega de exportação visível.', loadingBody: 'Os registros mostram o carregamento e a área das portas em um pedido de acessórios móveis, comprovando o que ocorreu na origem sem alegar desembaraço ou entrega final.', loadingPrimary: 'Caixas carregadas no contêiner', loadingPreparation: 'Preparação para fechamento', loadingCheck: 'Supervisão das portas e do lacre', loadingNote: 'Identificadores de veículo e caixas removidos · Pessoas e condições preservadas',
  },
  tr: {
    label: 'Operasyon kanıtı', supplierTitle: 'Tedarikçi ilerlemeden önce uygulanan tek puanlama yöntemi.', supplierBody: 'Teklifler önce normalize edilir; ardından teslimat, kalite, hizmet ve maliyet açısından incelenir. Eleme eşikleri düşük fiyatın tekrarlanan sorunları gizlemesini önler.', criteriaCaption: 'Ölçütler, ağırlıklar ve eleme eşikleri', methodCaption: 'Çeyrek dilim puanlaması ve kontrollü bonus kuralları', openSheet: 'Tam yöntem sayfasını aç', supplierNote: 'Yöntem sayfası İngilizcedir · Ağırlıklar ve eşikler korunmuştur', loadingTitle: 'Serbest bırakılan koliler görünür bir ihracat tesliminden geçer.', loadingBody: 'Kayıtlar bir mobil aksesuar siparişinin yükleme ve kapı alanı kontrollerini gösterir; kaynakta olanı kanıtlar, gümrük veya son teslim iddiası oluşturmaz.', loadingPrimary: 'Koliler konteynere taşındı', loadingPreparation: 'Kapatma öncesi hazırlık', loadingCheck: 'Kapı ve mühür alanı gözetimi', loadingNote: 'Araç ve koli kimlikleri gizlendi · İnsanlar ve saha koşulları korundu',
  },
};

type ScorecardEvidenceItem = {
  src: string;
  captionKey: 'criteriaCaption' | 'methodCaption';
  width: number;
  height: number;
  aspectClass: string;
  analyticsKey: 'criteria' | 'quartile_method';
};

const scorecardEvidenceZh: ScorecardEvidenceItem[] = [
  {
    src: '/media/evidence/2026-08-14/supplier-scorecard-criteria-redacted.webp',
    captionKey: 'criteriaCaption' as const,
    width: 1080,
    height: 1444,
    aspectClass: 'aspect-[3/4]',
    analyticsKey: 'criteria',
  },
  {
    src: '/media/evidence/2026-08-14/supplier-scorecard-quartile-method-redacted.webp',
    captionKey: 'methodCaption' as const,
    width: 1080,
    height: 1444,
    aspectClass: 'aspect-[3/4]',
    analyticsKey: 'quartile_method',
  },
];

const scorecardEvidenceEn: ScorecardEvidenceItem[] = [
  {
    src: '/media/evidence/2026-08-14/supplier-scorecard-criteria-en.webp',
    captionKey: 'criteriaCaption' as const,
    width: 1024,
    height: 1536,
    aspectClass: 'aspect-[2/3]',
    analyticsKey: 'criteria',
  },
  {
    src: '/media/evidence/2026-08-14/supplier-scorecard-quartile-method-en.webp',
    captionKey: 'methodCaption' as const,
    width: 1024,
    height: 1538,
    aspectClass: 'aspect-[2/3]',
    analyticsKey: 'quartile_method',
  },
];

const localizedScorecardEvidence = (language: Exclude<Language, 'en' | 'zh'>): ScorecardEvidenceItem[] => [
  {
    src: `/media/evidence/2026-08-14/supplier-scorecard-criteria-${language}.svg`,
    captionKey: 'criteriaCaption',
    width: 1024,
    height: 1536,
    aspectClass: 'aspect-[2/3]',
    analyticsKey: 'criteria',
  },
  {
    src: `/media/evidence/2026-08-14/supplier-scorecard-quartile-method-${language}.svg`,
    captionKey: 'methodCaption',
    width: 1024,
    height: 1536,
    aspectClass: 'aspect-[2/3]',
    analyticsKey: 'quartile_method',
  },
];

const scorecardEvidenceByLanguage: Record<Language, ScorecardEvidenceItem[]> = {
  en: scorecardEvidenceEn,
  zh: scorecardEvidenceZh,
  ru: localizedScorecardEvidence('ru'),
  fr: localizedScorecardEvidence('fr'),
  es: localizedScorecardEvidence('es'),
  ar: localizedScorecardEvidence('ar'),
  pt: scorecardEvidenceEn,
  tr: scorecardEvidenceEn,
};

const loadingEvidence = [
  {
    src: '/media/evidence/2026-08-14/mobile-accessories-container-loading-04-redacted.webp',
    captionKey: 'loadingPreparation' as const,
    primary: true,
  },
  {
    src: '/media/evidence/2026-08-14/mobile-accessories-container-loading-01-redacted.webp',
    captionKey: 'loadingPrimary' as const,
    primary: false,
  },
  {
    src: '/media/evidence/2026-08-14/mobile-accessories-container-loading-05-redacted.webp',
    captionKey: 'loadingCheck' as const,
    primary: false,
  },
];

function SupplierScorecardEvidence({ copy, language }: { copy: EvidenceCopy; language: Language }) {
  const scorecardEvidence = scorecardEvidenceByLanguage[language];

  return (
    <section aria-labelledby="supplier-scorecard-evidence-title" className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-[0_22px_60px_rgba(16,36,63,.08)]">
        <div className="grid lg:grid-cols-[.72fr_1.28fr]">
          <div className="relative overflow-hidden bg-[var(--ddnz-ink)] p-6 text-white sm:p-8 lg:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--ddnz-purple),var(--ddnz-coral))]" aria-hidden="true" />
            <DdnzEyebrow icon={BadgeCheck} dark>{copy.label}</DdnzEyebrow>
            <h3 id="supplier-scorecard-evidence-title" className="mt-5 max-w-[18ch] text-2xl font-black leading-tight tracking-[-0.035em] sm:text-3xl">{copy.supplierTitle}</h3>
            <p className="mt-5 text-sm font-medium leading-7 text-slate-300 sm:text-base">{copy.supplierBody}</p>
            <p className="mt-8 border-t border-white/15 pt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#f5bea7]">{copy.supplierNote}</p>
          </div>
          <div className="grid gap-px bg-slate-200 sm:grid-cols-2">
            {scorecardEvidence.map((item) => (
              <a
                key={item.src}
                href={item.src}
                target="_blank"
                rel="noreferrer"
                className="group bg-[#fbfaf7] p-3 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ddnz-purple)] sm:p-4"
                aria-label={`${copy.openSheet}: ${copy[item.captionKey]}`}
                data-analytics-event="supplier_scorecard_opened"
                onClick={() => trackEvent('supplier_scorecard_opened', {
                  sheet_type: item.analyticsKey,
                  asset_language: language,
                  content_location: 'how_we_work_supplier_shortlist',
                  link_target: 'full_method_sheet',
                  page_path: window.location.pathname,
                })}
              >
                <figure>
                  <div className={`${item.aspectClass} overflow-hidden border border-slate-200 bg-[#f7f4ec]`}>
                    <img src={item.src} alt={copy[item.captionKey]} width={item.width} height={item.height} loading="lazy" decoding="async" className="h-full w-full object-contain" />
                  </div>
                  <figcaption className="flex min-h-16 items-center justify-between gap-4 px-1 pt-3 text-sm font-black text-[var(--ddnz-ink)]">
                    <span>{copy[item.captionKey]}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--ddnz-coral-strong)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </figcaption>
                </figure>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LoadingHandoffEvidence({ copy }: { copy: EvidenceCopy }) {
  return (
    <section aria-labelledby="loading-handoff-evidence-title" className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[1.35rem] bg-[var(--ddnz-ink)] text-white shadow-[0_24px_70px_rgba(16,36,63,.16)]">
        <div className="grid gap-6 border-b border-white/15 px-6 py-7 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end lg:px-10">
          <div><DdnzEyebrow icon={Boxes} dark>{copy.label}</DdnzEyebrow><h3 id="loading-handoff-evidence-title" className="mt-5 max-w-[19ch] text-2xl font-black leading-tight tracking-[-0.035em] sm:text-3xl">{copy.loadingTitle}</h3></div>
          <p className="max-w-2xl text-sm font-medium leading-7 text-slate-300 lg:justify-self-end sm:text-base">{copy.loadingBody}</p>
        </div>
        <div className="grid gap-px bg-white/15 lg:grid-cols-12 lg:grid-rows-2">
          {loadingEvidence.map((item) => (
            <figure key={item.src} className={`${item.primary ? 'lg:col-span-7 lg:row-span-2' : 'lg:col-span-5'} group relative min-h-72 overflow-hidden bg-[#09182a]`}>
              <img src={item.src} alt={copy[item.captionKey]} width="960" height="1704" loading="lazy" decoding="async" className={`${item.primary ? 'aspect-[4/5] lg:aspect-auto' : 'aspect-[16/10]'} h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.015]`} />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071525] via-[#071525]/74 to-transparent px-5 pb-5 pt-20 text-sm font-black">{copy[item.captionKey]}</figcaption>
            </figure>
          ))}
        </div>
        <p className="border-t border-white/15 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-[#f5bea7] sm:px-8 lg:px-10">{copy.loadingNote}</p>
      </div>
    </section>
  );
}

const localePrefix: Record<Language, string> = { en: '', zh: '/zh-cn', ru: '/ru', fr: '/fr', es: '/es', ar: '/ar', pt: '/pt', tr: '/tr' };
const stepIcons = [ClipboardList, SearchCheck, BadgeCheck, Factory, FileCheck2, Boxes];
const stepMedia = [
  { type: 'image', src: '/media/process/brief-spec-discussion-poster.webp' },
  { type: 'image', src: '/media/process/supplier-visit-speaker.webp' },
  { type: 'image', src: '/media/process/device-spec-check.webp' },
  { type: 'video', src: '/media/process/kitchen-production.mp4', poster: '/media/process/kitchen-production-poster.webp' },
  { type: 'image', src: '/media/process/packaging-inspection.webp' },
  { type: 'video', src: '/media/process/export-loading.mp4', poster: '/media/process/export-loading-poster.webp' },
] as const;

export default function HowWeWork() {
  const { language } = useLanguage();
  const location = useLocation();
  const copy = copyByLanguage[language];
  const evidenceCopy = evidenceCopyByLanguage[language];
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [heroPlaying, setHeroPlaying] = useState(false);
  const quoteHref = buildQuoteHref({ intent: 'Product Sourcing', language, source: 'how_we_work' });
  const canonicalPath = `${localePrefix[language]}/how-we-work`;

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    video.play().catch(() => setHeroPlaying(false));
  }, []);

  const toggleHeroVideo = () => {
    const video = heroVideoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setHeroPlaying(false));
    else video.pause();
  };

  return (
    <div className="ddnz-home min-h-screen overflow-x-hidden bg-[#fffdf9] text-[var(--ddnz-ink)]" dir={language === 'ar' ? 'rtl' : undefined}>
      <SEO title={copy.seoTitle} description={copy.seoDescription} keywords="China sourcing process, supplier comparison, product inspection China, consolidation export, DDNZ Global" canonicalPath={canonicalPath} image="/media/process/brief-spec-discussion-poster.webp" />
      <SchemaMarkup type="Service" data={{
        name: copy.eyebrow,
        serviceType: 'China sourcing, quality control and export coordination workflow',
        description: copy.seoDescription,
        areaServed: 'Global',
        offerUrl: `https://www.ddnzglobal.com${quoteHref}`,
        offerDescription: copy.primaryCta,
        url: `https://www.ddnzglobal.com${canonicalPath}`,
        providerName: 'DDNZ Global Trade Co., Ltd',
      }} />
      <SchemaMarkup type="BreadcrumbList" data={{ items: [
        { name: copy.home, url: `https://www.ddnzglobal.com${localePrefix[language] || '/'}` },
        { name: copy.eyebrow, url: `https://www.ddnzglobal.com${canonicalPath}` },
      ] }} />

      <SourcingHomepageNav />

      <main>
        <header className="ddnz-ribbon-surface relative overflow-hidden border-b border-slate-200">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--ddnz-purple),#a34070_52%,var(--ddnz-coral))]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.03fr_.82fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                <Link to={localePrefix[language] || '/'} className="hover:text-[var(--ddnz-purple-strong)]">{copy.home}</Link>
                <span aria-hidden="true">/</span><span>{copy.eyebrow}</span>
              </nav>
              <div className="mt-8"><DdnzEyebrow icon={FileOutput}>{copy.eyebrow}</DdnzEyebrow></div>
              <h1 className="mt-5 max-w-[17ch] text-[clamp(2.6rem,6.1vw,5.35rem)] font-black leading-[0.98] tracking-[-0.06em] text-balance">{copy.title}</h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-600 sm:text-lg">{copy.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <DdnzPrimaryLink to={quoteHref} tracking onClick={() => trackEvent('quote_click', { cta_location: 'how_we_work_hero', lead_goal: 'Product Sourcing' })}>{copy.primaryCta}</DdnzPrimaryLink>
                <DdnzSecondaryLink to="#workflow" className="border-[var(--ddnz-ink)]/35 text-[var(--ddnz-ink)] hover:bg-white">{copy.secondaryCta}</DdnzSecondaryLink>
              </div>
            </div>

            <div className="mx-auto grid w-full max-w-xl grid-cols-[1.08fr_.72fr] gap-3 sm:gap-4">
              <figure className="relative row-span-2 overflow-hidden rounded-[1.4rem] bg-[var(--ddnz-ink)] shadow-[0_24px_70px_rgba(16,36,63,.18)]">
                <video
                  ref={heroVideoRef}
                  className="h-full min-h-[30rem] w-full object-cover"
                  src="/media/process/brief-spec-discussion.mp4"
                  poster="/media/process/brief-spec-discussion-poster.webp"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onPlay={() => setHeroPlaying(true)}
                  onPause={() => setHeroPlaying(false)}
                  aria-label={copy.steps[0].mediaAlt}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#09182a] via-[#09182a]/74 to-transparent px-4 pb-4 pt-20 text-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#f5bea7]">{copy.fieldEvidence}</p>
                  <p className="mt-1 text-sm font-bold">{copy.steps[0].mediaLabel}</p>
                </div>
                <button type="button" onClick={toggleHeroVideo} className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-[#09182a]/76 text-white backdrop-blur-md transition-colors hover:bg-[#09182a] focus-visible:outline-white" aria-label={heroPlaying ? copy.pause : copy.play}>
                  {heroPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="ml-0.5 h-4 w-4" aria-hidden="true" />}
                </button>
              </figure>
              <figure className="relative overflow-hidden rounded-[1.1rem] bg-slate-100">
                <img src="/media/process/phone-case-production-poster.webp" alt={copy.categoryItems[2].title} width="720" height="1282" fetchPriority="high" className="h-full min-h-56 w-full object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#09182a]/90 to-transparent px-3 pb-3 pt-12 text-[11px] font-bold text-white">{copy.categoryItems[2].title}</figcaption>
              </figure>
              <figure className="relative overflow-hidden rounded-[1.1rem] bg-slate-100">
                <img src="/media/process/export-loading-poster.webp" alt={copy.steps[5].mediaAlt} width="720" height="1280" className="h-full min-h-56 w-full object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#09182a]/90 to-transparent px-3 pb-3 pt-12 text-[11px] font-bold text-white">{copy.steps[5].mediaLabel}</figcaption>
              </figure>
            </div>
          </div>

          <div className="relative border-t border-slate-200 bg-white/80">
            <ul className="mx-auto grid max-w-7xl divide-y divide-slate-200 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8 rtl:sm:divide-x-reverse">
              {[UserRoundCheck, FileCheck2, ShieldCheck].map((Icon, index) => (
                <li key={copy.trust[index]} className="flex min-h-20 items-center gap-3 py-4 text-sm font-bold text-slate-700 sm:px-5 first:sm:pl-0 last:sm:pr-0 rtl:first:sm:pr-0 rtl:last:sm:pl-0">
                  <Icon className="h-5 w-5 shrink-0 text-[var(--ddnz-purple)]" aria-hidden="true" />{copy.trust[index]}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <section id="workflow" className="scroll-mt-24 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
              <div><DdnzEyebrow icon={ClipboardList}>{copy.workflowLabel}</DdnzEyebrow><h2 className="mt-5 text-3xl font-black tracking-[-0.045em] sm:text-5xl">{copy.workflowTitle}</h2></div>
              <p className="max-w-2xl text-base leading-8 text-slate-600 lg:justify-self-end">{copy.workflowIntro}</p>
            </div>
            <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-6">
              {copy.steps.map((step, index) => (
                <li key={step.title} className="bg-[#fbfaf7]">
                  <a href={`#step-${index + 1}`} className="flex min-h-24 items-center gap-3 px-4 py-4 text-sm font-black leading-5 transition-colors hover:bg-[var(--ddnz-purple-soft)] hover:text-[var(--ddnz-purple-strong)]">
                    <span className="font-mono text-[11px] text-[var(--ddnz-coral-strong)]">0{index + 1}</span>{step.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <ol className="bg-[#f1f4f6]">
          {copy.steps.map((step, index) => {
            const Icon = stepIcons[index];
            const media = stepMedia[index];
            const mediaFirst = index % 2 === 0;
            return (
              <li id={`step-${index + 1}`} key={step.title} className="scroll-mt-24 border-t border-slate-200 bg-[linear-gradient(180deg,#f7f8f8_0%,#eef2f4_100%)] py-16 sm:py-20">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8">
                  <figure className={`${mediaFirst ? 'lg:col-start-1' : 'lg:col-start-8'} relative overflow-hidden rounded-[1.35rem] bg-[var(--ddnz-ink)] shadow-[0_22px_60px_rgba(16,36,63,.12)] lg:col-span-5 lg:row-start-1`}>
                    <div className="aspect-[4/5]">
                      {media.type === 'video' ? (
                        <video className="h-full w-full object-cover" src={media.src} poster={media.poster} controls playsInline preload="none" aria-label={step.mediaAlt} />
                      ) : (
                        <img src={media.src} alt={step.mediaAlt} width="1050" height="1400" loading="lazy" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <figcaption className="absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-[#09182a] via-[#09182a]/75 to-transparent px-5 pb-5 pt-20 text-white">
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#f5bea7]">{copy.fieldEvidence}</p>
                      <p className="mt-1 text-sm font-bold">{step.mediaLabel}</p>
                    </figcaption>
                  </figure>

                  <article className={`${mediaFirst ? 'lg:col-start-7' : 'lg:col-start-1'} lg:col-span-6 lg:row-start-1`}>
                    <div className="flex items-center gap-4">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-white text-[var(--ddnz-purple-strong)] shadow-sm"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                      <span className="font-mono text-sm font-black tracking-[0.18em] text-[var(--ddnz-coral-strong)]">0{index + 1}</span>
                    </div>
                    <h2 className="mt-6 max-w-[19ch] text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">{step.title}</h2>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">{step.body}</p>
                    <dl className="mt-8 divide-y divide-slate-300 border-y border-slate-300">
                      <div className="grid gap-2 py-5 sm:grid-cols-[9.5rem_1fr] sm:gap-5"><dt className="text-xs font-black uppercase tracking-[0.14em] text-[var(--ddnz-purple-strong)]">{copy.outputLabel}</dt><dd className="text-sm font-bold leading-6 text-slate-700">{step.output}</dd></div>
                      <div className="grid gap-2 py-5 sm:grid-cols-[9.5rem_1fr] sm:gap-5"><dt className="text-xs font-black uppercase tracking-[0.14em] text-[var(--ddnz-coral-strong)]">{copy.gateLabel}</dt><dd className="text-sm font-bold leading-6 text-slate-700">{step.gate}</dd></div>
                    </dl>
                  </article>
                </div>
                {index === 1 ? <SupplierScorecardEvidence copy={evidenceCopy} language={language} /> : null}
                {index === 5 ? <LoadingHandoffEvidence copy={evidenceCopy} /> : null}
              </li>
            );
          })}
        </ol>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_.85fr] lg:items-center lg:px-8">
            <figure className="relative overflow-hidden rounded-[1.5rem] bg-[var(--ddnz-ink)] shadow-[0_24px_70px_rgba(16,36,63,.16)]">
              <video className="aspect-[4/3] w-full object-cover" src="/media/process/phone-case-production.mp4" poster="/media/process/phone-case-production-poster.webp" controls playsInline preload="none" aria-label={copy.categoryItems[2].body} />
              <figcaption className="border-t border-white/10 bg-[var(--ddnz-ink)] px-5 py-4 text-sm font-bold text-white">{copy.categoryItems[2].title} · {copy.fieldEvidence}</figcaption>
            </figure>
            <div>
              <DdnzEyebrow icon={PackageCheck}>{copy.categoryLabel}</DdnzEyebrow>
              <h2 className="mt-5 text-3xl font-black tracking-[-0.045em] sm:text-5xl">{copy.categoryTitle}</h2>
              <p className="mt-6 text-base leading-8 text-slate-600">{copy.categoryBody}</p>
              <dl className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
                {copy.categoryItems.map((item) => <div key={item.title} className="py-5"><dt className="font-black text-[var(--ddnz-ink)]">{item.title}</dt><dd className="mt-2 text-sm leading-6 text-slate-600">{item.body}</dd></div>)}
              </dl>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[var(--ddnz-ink)] py-16 text-white sm:py-20">
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,var(--ddnz-purple),var(--ddnz-coral))]" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
            <div><DdnzEyebrow icon={ShieldCheck} dark>{copy.boundaryLabel}</DdnzEyebrow><h2 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl">{copy.boundaryTitle}</h2></div>
            <ul className="divide-y divide-white/15 border-y border-white/15">
              {copy.boundaries.map((item) => <li key={item} className="flex gap-3 py-5 text-sm font-semibold leading-7 text-slate-200"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#f3a181]" aria-hidden="true" />{item}</li>)}
            </ul>
          </div>
        </section>

        <section className="bg-[var(--ddnz-purple-soft)] py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div><h2 className="max-w-3xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">{copy.finalTitle}</h2><p className="mt-4 max-w-3xl leading-7 text-slate-600">{copy.finalBody}</p></div>
            <DdnzPrimaryLink to={quoteHref} tracking className="shrink-0" onClick={() => trackEvent('quote_click', { cta_location: 'how_we_work_final', lead_goal: 'Product Sourcing', path: location.pathname })}>{copy.primaryCta}</DdnzPrimaryLink>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
