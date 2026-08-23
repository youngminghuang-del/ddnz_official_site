import type { Language } from '../i18n/translations';

export type HomeV2Copy = {
  accountability: {
    eyebrow: string;
    title: string;
    body: string;
    controls: string[];
    imageAlt: string;
    fieldLabel: string;
    fieldCaption: string;
  };
  process: {
    eyebrow: string;
    title: string;
    body: string;
    releaseGate: string;
    reviewStep: string;
    steps: Array<{ title: string; output: string; gate: string }>;
  };
  evidence: {
    scoreEyebrow: string;
    scoreTitle: string;
    scoreBody: string;
    scorePoints: string[];
    openScorecard: string;
    supplierImageAlt: string;
    scorecardPreviewAlt: string;
    exportEyebrow: string;
    exportTitle: string;
    exportBody: string;
    exportImageAlt: string;
    exportCheckpoints: Array<[string, string]>;
    redactionNote: string;
  };
  scorecardDialog: {
    eyebrow: string;
    title: string;
    closeLabel: string;
    imageAlt: string;
  };
  languages: {
    eyebrow: string;
    title: string;
    items: Array<{ name: string; body: string; dir?: 'ltr' | 'rtl' }>;
  };
  freight: {
    title: string;
    body: string;
    cta: string;
  };
  final: {
    eyebrow: string;
    title: string;
    body: string;
    sourcingCta: string;
    whatsappCta: string;
    freightCta: string;
    privacy: string;
    whatsappMessage: string;
  };
};

const HOME_V2_COPY_BASE = {
  en: {
    accountability: {
      eyebrow: 'Supplier visits that count',
      title: 'Build a sellable range in China—with one accountable team.',
      body: 'We align products, quality and delivery so your shelves carry the range you approved—and the evidence follows the order.',
      controls: [
        'Define the product range for the destination market',
        'Compare and shortlist suppliers against one brief',
        'Lock specifications, samples and unresolved decisions',
        'Verify production and quality with recorded evidence',
        'Consolidate and release cargo on the agreed timeline',
      ],
      imageAlt: 'Supplier and product-fit discussion during an authorized China-origin showroom visit',
      fieldLabel: 'Authorized field material · China origin',
      fieldCaption: 'Supplier and product-fit review',
    },
    process: {
      eyebrow: 'One controlled chain',
      title: 'From product brief to market-ready shipment',
      body: 'Every step has a recorded output and a release condition before the order moves forward.',
      releaseGate: 'Release gate',
      reviewStep: 'Review this step',
      steps: [
        { title: 'Supplier comparison', output: 'Shortlist with side-by-side offers.', gate: 'Approved shortlist moves forward.' },
        { title: 'Specification & sample', output: 'Specifications confirmed and samples validated.', gate: 'Sample approved for production.' },
        { title: 'QC evidence', output: 'Inspection reports and photo evidence.', gate: 'QC pass before shipment.' },
        { title: 'Consolidation & export', output: 'Packing list, documents and container plan.', gate: 'Documents verified and cargo released.' },
      ],
    },
    evidence: {
      scoreEyebrow: 'Proof behind every shortlist',
      scoreTitle: 'Comparable offers. Visible gates.',
      scoreBody: 'A numerical score never hides a delivery, quality or evidence failure.',
      scorePoints: [
        'Supplier offers normalized before price comparison',
        'Delivery, quality, service and cost weighted consistently',
        'Veto gates stop repeated delivery or quality failures',
        'A visible evidence gap stays open until it is resolved',
      ],
      openScorecard: 'See how we score suppliers',
      supplierImageAlt: 'Authorized supplier discussion during a China-origin product review',
      scorecardPreviewAlt: 'Preview of the DDNZ supplier scorecard',
      exportEyebrow: 'Export evidence, not stock photography',
      exportTitle: 'A documented China-origin handoff',
      exportBody: 'Real loading material supports what happened at origin. It does not imply facility ownership, customs clearance or destination delivery.',
      exportImageAlt: 'Redacted real container-loading evidence for a mobile-accessories shipment',
      exportCheckpoints: [
        ['Receiving & count reconciliation', 'Verify quantities and condition against the packing list.'],
        ['Packing & document check', 'Review pack-out and order-specific export documents.'],
        ['Container loading', 'Record origin loading and cargo placement.'],
        ['Seal & handoff to carrier', 'Release the documented shipment to the freight executor.'],
      ],
      redactionNote: 'Authorized and redacted field material · Customer, carton and vehicle identifiers removed',
    },
    scorecardDialog: {
      eyebrow: 'DDNZ supplier control',
      title: 'Full supplier scoring method',
      closeLabel: 'Close supplier scoring method',
      imageAlt: 'DDNZ supplier scorecard showing weighted delivery, quality, service and cost criteria with veto gates',
    },
    languages: {
      eyebrow: 'Market support',
      title: 'The languages buyers use',
      items: [
        { name: 'English', body: 'Clear communication through every step.' },
        { name: 'Spanish', body: 'Soporte claro durante cada etapa.' },
        { name: 'French', body: 'Un accompagnement clair à chaque étape.' },
        { name: 'Arabic', body: 'دعم واضح في كل مرحلة من مراحل العمل.', dir: 'rtl' },
      ],
    },
    freight: {
      title: 'International freight executed by Heaven Born',
      body: 'Operating since 1997 · Engaged after the DDNZ export-release handoff.',
      cta: 'Get a freight quote',
    },
    final: {
      eyebrow: 'One accountable China team',
      title: 'Start your sourcing brief today.',
      body: 'Tell us what you need, the destination market and the order stage. We will define the right supplier, control and export path before we reply.',
      sourcingCta: 'Start a sourcing brief',
      whatsappCta: 'Chat with our China team on WhatsApp',
      freightCta: 'Get a freight quote',
      privacy: 'Your information is secure and never shared.',
      whatsappMessage: 'Hi DDNZ Global, I would like to discuss a product sourcing brief for my market.',
    },
  },
  zh: {
    accountability: {
      eyebrow: '有结果的供应商走访',
      title: '在中国打造适销产品组合，由一个团队全程负责。',
      body: '我们统一产品、质量与交期，让您收到经过确认的产品组合，并让每项证据随订单完整留档。',
      controls: [
        '明确适合目标市场的产品组合',
        '按同一采购简报比较并筛选供应商',
        '锁定规格、样品和待决事项',
        '以可追溯证据验证生产与质量',
        '按约定时间表集货并放行出口',
      ],
      imageAlt: '在中国供应商展厅进行产品匹配与采购沟通',
      fieldLabel: '经授权的中国源头实拍素材',
      fieldCaption: '供应商与产品匹配核查',
    },
    process: {
      eyebrow: '一条受控的交付链',
      title: '从采购简报到可交付市场的货物',
      body: '每个环节都有记录结果与放行条件，满足条件后订单才进入下一步。',
      releaseGate: '放行条件',
      reviewStep: '查看该环节',
      steps: [
        { title: '供应商比选', output: '横向报价对比与供应商候选名单。', gate: '候选名单获确认后进入下一步。' },
        { title: '规格与样品', output: '确认规格并完成样品验证。', gate: '样品获批后进入生产。' },
        { title: '验货证据', output: '现场检查报告、图片与问题记录。', gate: '验货通过后安排出货。' },
        { title: '集货与出口', output: '装箱单、出口文件与装柜计划。', gate: '单证核验完成后放行货物。' },
      ],
    },
    evidence: {
      scoreEyebrow: '每份候选名单都有依据',
      scoreTitle: '报价可比，关口可见。',
      scoreBody: '数字评分不会掩盖交期、质量或证据缺口。',
      scorePoints: [
        '比价前统一供应商报价口径',
        '一致衡量交付、质量、服务与成本',
        '一票否决关口阻止重复交付或质量问题',
        '证据缺口保持开放，直至完成核实',
      ],
      openScorecard: '查看完整供应商评分方法',
      supplierImageAlt: '中国源头产品核查中的供应商沟通实拍',
      scorecardPreviewAlt: 'DDNZ 供应商评分卡预览',
      exportEyebrow: '真实出口证据，而非图库照片',
      exportTitle: '有记录的中国源头交接',
      exportBody: '真实装柜素材用于证明源头实际发生的操作，但不代表仓库所有权、目的港清关或末端配送承诺。',
      exportImageAlt: '已脱敏的手机配件真实装柜证据',
      exportCheckpoints: [
        ['收货与数量核对', '按装箱单核对数量与外观状态。'],
        ['包装与单证检查', '复核包装方案和订单对应的出口文件。'],
        ['集装箱装柜', '记录源头装柜过程与货物摆放。'],
        ['封柜并交接承运人', '将有完整记录的货物交给货运执行方。'],
      ],
      redactionNote: '经授权并已脱敏的实拍素材 · 客户、纸箱与车辆识别信息已移除',
    },
    scorecardDialog: {
      eyebrow: 'DDNZ 供应商控制',
      title: '完整供应商评分方法',
      closeLabel: '关闭供应商评分方法',
      imageAlt: 'DDNZ 供应商评分卡，包含交付、质量、服务、成本权重和一票否决条件',
    },
    languages: {
      eyebrow: '目标市场支持',
      title: '用客户熟悉的语言沟通',
      items: [
        { name: '英语', body: '每个环节都保持清晰沟通。' },
        { name: '西班牙语', body: '覆盖拉美客户的关键采购沟通。' },
        { name: '法语', body: '支持法语非洲市场的采购协调。' },
        { name: '阿拉伯语', body: '支持中东客户的重要信息确认。' },
      ],
    },
    freight: {
      title: '国际货运由华正邦泰执行',
      body: '始于 1997 年 · 在 DDNZ 完成出口放行交接后承接国际运输。',
      cta: '获取货运报价',
    },
    final: {
      eyebrow: '一个负责到底的中国团队',
      title: '现在提交您的采购简报。',
      body: '告诉我们产品、目标市场与订单阶段；回复前，我们会先判断合适的供应商、质量控制与出口路径。',
      sourcingCta: '提交采购需求',
      whatsappCta: '通过 WhatsApp 联系中国团队',
      freightCta: '获取货运报价',
      privacy: '您的资料会被安全处理，不会公开或分享。',
      whatsappMessage: '您好 DDNZ Global，我想沟通面向目标市场的中国采购需求。',
    },
  },
  ru: {
    accountability: {
      eyebrow: 'Визиты к поставщикам с результатом',
      title: 'Создайте продаваемую линейку в Китае с одной ответственной командой.',
      body: 'Мы согласуем ассортимент, качество и сроки, чтобы вы получили утверждённую линейку вместе с доказательствами по заказу.',
      controls: [
        'Определить ассортимент для целевого рынка',
        'Сравнить поставщиков по единому брифу',
        'Зафиксировать спецификации, образцы и открытые вопросы',
        'Подтвердить производство и качество документированными данными',
        'Консолидировать и выпустить груз по согласованному графику',
      ],
      imageAlt: 'Обсуждение поставщика и соответствия товара во время авторизованного визита в Китае',
      fieldLabel: 'Авторизованные материалы · Китай',
      fieldCaption: 'Проверка поставщика и соответствия товара',
    },
    process: {
      eyebrow: 'Единая контролируемая цепочка',
      title: 'От товарного брифа до готовой к рынку поставки',
      body: 'У каждого этапа есть зафиксированный результат и условие выпуска до перехода заказа дальше.',
      releaseGate: 'Условие выпуска',
      reviewStep: 'Подробнее об этапе',
      steps: [
        { title: 'Сравнение поставщиков', output: 'Короткий список и сопоставимые предложения.', gate: 'Утверждённый список переходит дальше.' },
        { title: 'Спецификация и образец', output: 'Спецификации согласованы, образцы проверены.', gate: 'Образец утверждён для производства.' },
        { title: 'Доказательства QC', output: 'Отчёты инспекции и фотоматериалы.', gate: 'Положительный QC до отгрузки.' },
        { title: 'Консолидация и экспорт', output: 'Упаковочный лист, документы и план загрузки.', gate: 'Документы проверены, груз выпущен.' },
      ],
    },
    evidence: {
      scoreEyebrow: 'Основание каждого короткого списка',
      scoreTitle: 'Сопоставимые предложения. Видимые пороги.',
      scoreBody: 'Числовой рейтинг не скрывает сбой по срокам, качеству или доказательствам.',
      scorePoints: [
        'Предложения нормализуются до сравнения цен',
        'Сроки, качество, сервис и стоимость оцениваются единообразно',
        'Стоп-критерии блокируют повторные сбои поставки или качества',
        'Пробел в доказательствах остаётся открытым до устранения',
      ],
      openScorecard: 'Открыть методику оценки поставщиков',
      supplierImageAlt: 'Авторизованное обсуждение поставщика при проверке товара в Китае',
      scorecardPreviewAlt: 'Предпросмотр оценочной карты поставщика DDNZ',
      exportEyebrow: 'Экспортные доказательства вместо стоковых фото',
      exportTitle: 'Документированная передача груза в Китае',
      exportBody: 'Реальные материалы подтверждают действия в пункте отправления, но не означают владение складом, таможенное оформление или доставку в стране назначения.',
      exportImageAlt: 'Обезличенные материалы реальной загрузки мобильных аксессуаров в контейнер',
      exportCheckpoints: [
        ['Приёмка и сверка количества', 'Проверить количество и состояние по упаковочному листу.'],
        ['Проверка упаковки и документов', 'Проверить упаковку и экспортные документы заказа.'],
        ['Загрузка контейнера', 'Зафиксировать загрузку и размещение груза в Китае.'],
        ['Пломба и передача перевозчику', 'Передать документированную отправку исполнителю перевозки.'],
      ],
      redactionNote: 'Авторизованные и обезличенные материалы · Данные клиента, коробок и автомобиля удалены',
    },
    scorecardDialog: {
      eyebrow: 'Контроль поставщиков DDNZ',
      title: 'Полная методика оценки поставщиков',
      closeLabel: 'Закрыть методику оценки поставщиков',
      imageAlt: 'Карта оценки поставщика DDNZ с весами сроков, качества, сервиса и стоимости, а также стоп-критериями',
    },
    languages: {
      eyebrow: 'Поддержка рынков',
      title: 'Языки, которыми пользуются покупатели',
      items: [
        { name: 'English', body: 'Понятная коммуникация на каждом этапе.' },
        { name: 'Español', body: 'Поддержка ключевых закупочных вопросов для Латинской Америки.' },
        { name: 'Français', body: 'Сопровождение закупок для франкоязычной Африки.' },
        { name: 'العربية', body: 'دعم واضح في كل مرحلة من مراحل العمل.', dir: 'rtl' },
      ],
    },
    freight: {
      title: 'Международные перевозки выполняет Heaven Born',
      body: 'Работаем с 1997 года · Подключение после экспортного выпуска DDNZ.',
      cta: 'Рассчитать перевозку',
    },
    final: {
      eyebrow: 'Одна ответственная команда в Китае',
      title: 'Отправьте закупочный бриф сегодня.',
      body: 'Укажите товар, рынок назначения и стадию заказа. До ответа мы определим подходящий путь по поставщику, контролю и экспорту.',
      sourcingCta: 'Оставить заявку на закупку',
      whatsappCta: 'Написать команде в Китае в WhatsApp',
      freightCta: 'Рассчитать перевозку',
      privacy: 'Ваши данные защищены и не передаются третьим лицам.',
      whatsappMessage: 'Здравствуйте, DDNZ Global. Я хочу обсудить закупку товаров в Китае для моего рынка.',
    },
  },
  fr: {
    accountability: {
      eyebrow: 'Des visites fournisseurs qui comptent',
      title: 'Construisez en Chine une gamme vendable avec une seule équipe responsable.',
      body: 'Nous alignons produits, qualité et délais pour que vous receviez la gamme approuvée, accompagnée des preuves liées à la commande.',
      controls: [
        'Définir la gamme adaptée au marché de destination',
        'Comparer et présélectionner les fournisseurs sur un brief commun',
        'Verrouiller spécifications, échantillons et décisions ouvertes',
        'Vérifier production et qualité avec des preuves enregistrées',
        'Consolider et libérer la marchandise selon le calendrier convenu',
      ],
      imageAlt: 'Échange sur le fournisseur et l’adéquation produit lors d’une visite autorisée en Chine',
      fieldLabel: 'Matériel terrain autorisé · Origine Chine',
      fieldCaption: 'Revue fournisseur et adéquation produit',
    },
    process: {
      eyebrow: 'Une chaîne entièrement contrôlée',
      title: 'Du brief produit à l’expédition prête pour le marché',
      body: 'Chaque étape produit un livrable enregistré et comporte une condition de libération avant de poursuivre.',
      releaseGate: 'Condition de libération',
      reviewStep: 'Voir cette étape',
      steps: [
        { title: 'Comparaison fournisseurs', output: 'Présélection avec offres comparables.', gate: 'La présélection approuvée avance.' },
        { title: 'Spécification et échantillon', output: 'Spécifications confirmées et échantillons validés.', gate: 'Échantillon approuvé pour production.' },
        { title: 'Preuves de contrôle qualité', output: 'Rapports d’inspection et preuves photo.', gate: 'Contrôle qualité validé avant expédition.' },
        { title: 'Consolidation et export', output: 'Liste de colisage, documents et plan de chargement.', gate: 'Documents vérifiés et marchandise libérée.' },
      ],
    },
    evidence: {
      scoreEyebrow: 'Des preuves derrière chaque présélection',
      scoreTitle: 'Offres comparables. Seuils visibles.',
      scoreBody: 'Une note chiffrée ne masque jamais un défaut de délai, de qualité ou de preuve.',
      scorePoints: [
        'Les offres sont normalisées avant comparaison des prix',
        'Délais, qualité, service et coût sont pondérés de façon constante',
        'Des critères éliminatoires bloquent les défaillances répétées',
        'Tout manque de preuve reste ouvert jusqu’à résolution',
      ],
      openScorecard: 'Voir notre méthode de notation',
      supplierImageAlt: 'Discussion fournisseur autorisée pendant une revue produit en Chine',
      scorecardPreviewAlt: 'Aperçu de la fiche de notation fournisseur DDNZ',
      exportEyebrow: 'Des preuves d’export, pas des photos de banque d’images',
      exportTitle: 'Un transfert documenté à l’origine en Chine',
      exportBody: 'Les images réelles attestent des opérations à l’origine. Elles n’impliquent ni propriété du site, ni dédouanement, ni livraison à destination.',
      exportImageAlt: 'Preuve réelle anonymisée du chargement de marchandises d’accessoires mobiles',
      exportCheckpoints: [
        ['Réception et rapprochement des quantités', 'Vérifier quantités et état selon la liste de colisage.'],
        ['Contrôle emballage et documents', 'Examiner l’emballage et les documents export de la commande.'],
        ['Chargement du conteneur', 'Enregistrer le chargement à l’origine et la disposition de la marchandise.'],
        ['Scellement et remise au transporteur', 'Remettre l’expédition documentée à l’exécutant du fret.'],
      ],
      redactionNote: 'Matériel terrain autorisé et anonymisé · Identifiants client, cartons et véhicule supprimés',
    },
    scorecardDialog: {
      eyebrow: 'Contrôle fournisseurs DDNZ',
      title: 'Méthode complète de notation des fournisseurs',
      closeLabel: 'Fermer la méthode de notation',
      imageAlt: 'Fiche DDNZ pondérant délais, qualité, service et coût avec critères éliminatoires',
    },
    languages: {
      eyebrow: 'Support marchés',
      title: 'Les langues utilisées par les acheteurs',
      items: [
        { name: 'English', body: 'Une communication claire à chaque étape.' },
        { name: 'Español', body: 'Un support clair pour les achats en Amérique latine.' },
        { name: 'Français', body: 'Un accompagnement adapté aux marchés francophones.' },
        { name: 'العربية', body: 'دعم واضح في كل مرحلة من مراحل العمل.', dir: 'rtl' },
      ],
    },
    freight: {
      title: 'Fret international exécuté par Heaven Born',
      body: 'En activité depuis 1997 · Intervention après la libération export par DDNZ.',
      cta: 'Obtenir un devis fret',
    },
    final: {
      eyebrow: 'Une seule équipe responsable en Chine',
      title: 'Lancez votre brief sourcing dès aujourd’hui.',
      body: 'Indiquez le produit, le marché de destination et l’étape de la commande. Avant de répondre, nous définirons le bon parcours fournisseur, contrôle et export.',
      sourcingCta: 'Démarrer un brief sourcing',
      whatsappCta: 'Écrire à notre équipe Chine sur WhatsApp',
      freightCta: 'Obtenir un devis fret',
      privacy: 'Vos informations restent confidentielles et ne sont jamais partagées.',
      whatsappMessage: 'Bonjour DDNZ Global, je souhaite discuter d’un besoin de sourcing en Chine pour mon marché.',
    },
  },
  es: {
    accountability: {
      eyebrow: 'Visitas a proveedores que aportan resultados',
      title: 'Cree en China una gama vendible con un solo equipo responsable.',
      body: 'Alineamos producto, calidad y entrega para que reciba la gama aprobada y las evidencias vinculadas al pedido.',
      controls: [
        'Definir la gama adecuada para el mercado de destino',
        'Comparar y preseleccionar proveedores con un mismo brief',
        'Fijar especificaciones, muestras y decisiones pendientes',
        'Verificar producción y calidad con evidencias registradas',
        'Consolidar y liberar la carga según el calendario acordado',
      ],
      imageAlt: 'Conversación sobre proveedor y adecuación del producto durante una visita autorizada en China',
      fieldLabel: 'Material de campo autorizado · Origen China',
      fieldCaption: 'Revisión de proveedor y adecuación del producto',
    },
    process: {
      eyebrow: 'Una cadena bajo control',
      title: 'Del brief de producto al envío listo para el mercado',
      body: 'Cada etapa deja un resultado registrado y exige una condición de liberación antes de avanzar.',
      releaseGate: 'Condición de liberación',
      reviewStep: 'Ver esta etapa',
      steps: [
        { title: 'Comparación de proveedores', output: 'Lista corta con ofertas comparables.', gate: 'La lista aprobada pasa a la siguiente etapa.' },
        { title: 'Especificación y muestra', output: 'Especificaciones confirmadas y muestras validadas.', gate: 'Muestra aprobada para producción.' },
        { title: 'Evidencias de calidad', output: 'Informes de inspección y evidencias fotográficas.', gate: 'Control aprobado antes del envío.' },
        { title: 'Consolidación y exportación', output: 'Packing list, documentos y plan de carga.', gate: 'Documentos verificados y carga liberada.' },
      ],
    },
    evidence: {
      scoreEyebrow: 'Evidencia detrás de cada preselección',
      scoreTitle: 'Ofertas comparables. Filtros visibles.',
      scoreBody: 'Una puntuación numérica nunca oculta un fallo de entrega, calidad o evidencia.',
      scorePoints: [
        'Las ofertas se normalizan antes de comparar precios',
        'Entrega, calidad, servicio y coste se ponderan de forma consistente',
        'Los filtros de veto frenan fallos repetidos de entrega o calidad',
        'Las brechas de evidencia siguen abiertas hasta resolverse',
      ],
      openScorecard: 'Ver cómo puntuamos a los proveedores',
      supplierImageAlt: 'Conversación autorizada con un proveedor durante una revisión de producto en China',
      scorecardPreviewAlt: 'Vista previa de la ficha de puntuación de proveedores DDNZ',
      exportEyebrow: 'Evidencia de exportación, no fotografía de stock',
      exportTitle: 'Una entrega documentada en origen China',
      exportBody: 'El material real respalda lo ocurrido en origen. No implica propiedad de instalaciones, despacho aduanero ni entrega en destino.',
      exportImageAlt: 'Evidencia real anonimizada de carga de accesorios móviles en contenedor',
      exportCheckpoints: [
        ['Recepción y conciliación de cantidades', 'Verificar cantidades y estado contra el packing list.'],
        ['Control de embalaje y documentos', 'Revisar el embalaje y los documentos de exportación del pedido.'],
        ['Carga del contenedor', 'Registrar la carga en origen y la colocación de la mercancía.'],
        ['Precinto y entrega al transportista', 'Entregar el envío documentado al ejecutor del transporte.'],
      ],
      redactionNote: 'Material de campo autorizado y anonimizado · Identificadores de cliente, cajas y vehículo eliminados',
    },
    scorecardDialog: {
      eyebrow: 'Control de proveedores DDNZ',
      title: 'Método completo de puntuación de proveedores',
      closeLabel: 'Cerrar el método de puntuación',
      imageAlt: 'Ficha DDNZ con ponderación de entrega, calidad, servicio y coste, además de filtros de veto',
    },
    languages: {
      eyebrow: 'Soporte de mercado',
      title: 'Los idiomas que utilizan los compradores',
      items: [
        { name: 'English', body: 'Comunicación clara durante todo el proceso.' },
        { name: 'Español', body: 'Soporte completo para cada etapa de compra.' },
        { name: 'Français', body: 'Acompañamiento para los mercados francófonos.' },
        { name: 'العربية', body: 'دعم واضح في كل مرحلة من مراحل العمل.', dir: 'rtl' },
      ],
    },
    freight: {
      title: 'Transporte internacional ejecutado por Heaven Born',
      body: 'Operando desde 1997 · Interviene tras la liberación de exportación de DDNZ.',
      cta: 'Cotizar transporte',
    },
    final: {
      eyebrow: 'Un equipo responsable en China',
      title: 'Inicie hoy su brief de compras.',
      body: 'Indique el producto, el mercado de destino y la etapa del pedido. Antes de responder definiremos la ruta adecuada de proveedor, control y exportación.',
      sourcingCta: 'Iniciar solicitud de compra',
      whatsappCta: 'Hablar con el equipo de China por WhatsApp',
      freightCta: 'Cotizar transporte',
      privacy: 'Sus datos permanecen seguros y nunca se comparten.',
      whatsappMessage: 'Hola DDNZ Global, quiero conversar sobre una solicitud de compra en China para mi mercado.',
    },
  },
  ar: {
    accountability: {
      eyebrow: 'زيارات موردين تحقق نتائج',
      title: 'ابنِ تشكيلة قابلة للبيع من الصين مع فريق واحد مسؤول.',
      body: 'نوحّد المنتج والجودة والتسليم لتحصل على التشكيلة التي اعتمدتها، مع أدلة مرتبطة بكل طلب.',
      controls: [
        'تحديد التشكيلة المناسبة لسوق الوجهة',
        'مقارنة الموردين واختيار القائمة المختصرة وفق موجز واحد',
        'تثبيت المواصفات والعينات والقرارات المعلّقة',
        'التحقق من الإنتاج والجودة بأدلة مسجلة',
        'تجميع البضائع والإفراج عنها وفق الجدول المتفق عليه',
      ],
      imageAlt: 'مناقشة ملاءمة المورد والمنتج خلال زيارة ميدانية معتمدة في الصين',
      fieldLabel: 'مواد ميدانية معتمدة · منشأ الصين',
      fieldCaption: 'مراجعة المورد وملاءمة المنتج',
    },
    process: {
      eyebrow: 'سلسلة واحدة خاضعة للرقابة',
      title: 'من موجز المنتج إلى شحنة جاهزة للسوق',
      body: 'لكل مرحلة نتيجة مسجلة وشرط إفراج يجب استيفاؤه قبل انتقال الطلب إلى المرحلة التالية.',
      releaseGate: 'شرط الإفراج',
      reviewStep: 'راجع هذه المرحلة',
      steps: [
        { title: 'مقارنة الموردين', output: 'قائمة مختصرة وعروض قابلة للمقارنة.', gate: 'تنتقل القائمة المعتمدة إلى المرحلة التالية.' },
        { title: 'المواصفات والعينة', output: 'تأكيد المواصفات والتحقق من العينات.', gate: 'اعتماد العينة قبل بدء الإنتاج.' },
        { title: 'أدلة مراقبة الجودة', output: 'تقارير فحص وأدلة مصورة.', gate: 'اجتياز الفحص قبل الشحن.' },
        { title: 'التجميع والتصدير', output: 'قائمة تعبئة ومستندات وخطة تحميل.', gate: 'التحقق من المستندات والإفراج عن البضاعة.' },
      ],
    },
    evidence: {
      scoreEyebrow: 'أدلة خلف كل قائمة مختصرة',
      scoreTitle: 'عروض قابلة للمقارنة وبوابات واضحة.',
      scoreBody: 'لا تخفي الدرجة الرقمية أي إخفاق في التسليم أو الجودة أو الأدلة.',
      scorePoints: [
        'توحيد عروض الموردين قبل مقارنة الأسعار',
        'تقييم التسليم والجودة والخدمة والتكلفة بطريقة ثابتة',
        'بوابات الرفض توقف تكرار إخفاقات التسليم أو الجودة',
        'يبقى نقص الأدلة مفتوحاً حتى تتم معالجته',
      ],
      openScorecard: 'اطّلع على طريقة تقييم الموردين',
      supplierImageAlt: 'مناقشة معتمدة مع مورد أثناء مراجعة منتج في الصين',
      scorecardPreviewAlt: 'معاينة بطاقة تقييم الموردين لدى DDNZ',
      exportEyebrow: 'أدلة تصدير حقيقية وليست صوراً جاهزة',
      exportTitle: 'تسليم موثق من منشأ الصين',
      exportBody: 'تثبت مواد التحميل الحقيقية ما حدث في المنشأ، ولا تعني ملكية المنشأة أو التخليص الجمركي أو التسليم في الوجهة.',
      exportImageAlt: 'أدلة تحميل حقيقية بعد إخفاء بيانات شحنة ملحقات هاتف',
      exportCheckpoints: [
        ['الاستلام ومطابقة الكميات', 'التحقق من الكميات والحالة مقابل قائمة التعبئة.'],
        ['فحص التغليف والمستندات', 'مراجعة طريقة التغليف ومستندات التصدير الخاصة بالطلب.'],
        ['تحميل الحاوية', 'توثيق التحميل في المنشأ وترتيب البضائع.'],
        ['الختم والتسليم للناقل', 'تسليم الشحنة الموثقة إلى جهة تنفيذ الشحن.'],
      ],
      redactionNote: 'مواد ميدانية معتمدة بعد إخفاء البيانات · تمت إزالة معرفات العميل والصناديق والمركبة',
    },
    scorecardDialog: {
      eyebrow: 'رقابة DDNZ على الموردين',
      title: 'المنهج الكامل لتقييم الموردين',
      closeLabel: 'إغلاق منهج تقييم الموردين',
      imageAlt: 'بطاقة DDNZ لتقييم الموردين بأوزان التسليم والجودة والخدمة والتكلفة وبوابات الرفض',
    },
    languages: {
      eyebrow: 'دعم الأسواق',
      title: 'اللغات التي يستخدمها المشترون',
      items: [
        { name: 'English', body: 'تواصل واضح خلال كل مرحلة.', dir: 'ltr' },
        { name: 'Español', body: 'دعم واضح لمراحل الشراء في أمريكا اللاتينية.', dir: 'ltr' },
        { name: 'Français', body: 'مساندة مخصصة للأسواق الناطقة بالفرنسية.', dir: 'ltr' },
        { name: 'العربية', body: 'دعم واضح في كل مرحلة من مراحل العمل.', dir: 'rtl' },
      ],
    },
    freight: {
      title: 'تنفيذ الشحن الدولي بواسطة Heaven Born',
      body: 'نعمل منذ 1997 · يبدأ التنفيذ بعد تسليم الإفراج التصديري من DDNZ.',
      cta: 'احصل على عرض شحن',
    },
    final: {
      eyebrow: 'فريق واحد مسؤول في الصين',
      title: 'ابدأ موجز التوريد اليوم.',
      body: 'أرسل المنتج وسوق الوجهة ومرحلة الطلب. سنحدد مسار المورد والرقابة والتصدير المناسب قبل الرد.',
      sourcingCta: 'ابدأ طلب التوريد',
      whatsappCta: 'تحدث مع فريق الصين عبر واتساب',
      freightCta: 'احصل على عرض شحن',
      privacy: 'معلوماتك آمنة ولا تتم مشاركتها.',
      whatsappMessage: 'مرحباً DDNZ Global، أود مناقشة طلب توريد منتجات من الصين لسوقي.',
    },
  },
} satisfies Record<Exclude<Language, 'pt' | 'tr'>, HomeV2Copy>;

export const HOME_V2_COPY: Record<Language, HomeV2Copy> = {
  ...HOME_V2_COPY_BASE,
  pt: {
    accountability: {
      eyebrow: 'Visitas a fornecedores com resultado',
      title: 'Monte uma linha vendável na China com uma equipe responsável.',
      body: 'Alinhamos produtos, qualidade e entrega para que sua operação receba o que foi aprovado, com as evidências vinculadas ao pedido.',
      controls: ['Definir a linha para o mercado de destino', 'Comparar fornecedores com o mesmo brief', 'Fixar especificações, amostras e pendências', 'Verificar produção e qualidade com evidências', 'Consolidar e liberar a carga no prazo acordado'],
      imageAlt: 'Reunião autorizada para avaliar fornecedor e adequação do produto na China',
      fieldLabel: 'Material de campo autorizado · Origem China',
      fieldCaption: 'Avaliação de fornecedor e produto',
    },
    process: {
      eyebrow: 'Uma cadeia controlada', title: 'Do brief do produto ao embarque pronto para o mercado', body: 'Cada etapa tem uma entrega registrada e uma condição de liberação antes de avançar.', releaseGate: 'Condição de liberação', reviewStep: 'Revisar esta etapa',
      steps: [
        { title: 'Comparação de fornecedores', output: 'Lista curta com propostas lado a lado.', gate: 'A lista aprovada avança.' },
        { title: 'Especificação e amostra', output: 'Especificações confirmadas e amostras validadas.', gate: 'Amostra aprovada para produção.' },
        { title: 'Evidências de qualidade', output: 'Relatórios de inspeção e fotos.', gate: 'Qualidade aprovada antes do embarque.' },
        { title: 'Consolidação e exportação', output: 'Packing list, documentos e plano de carga.', gate: 'Documentos verificados e carga liberada.' },
      ],
    },
    evidence: {
      scoreEyebrow: 'Evidências por trás da seleção', scoreTitle: 'Propostas comparáveis. Critérios visíveis.', scoreBody: 'Uma nota numérica nunca esconde falhas de prazo, qualidade ou documentação.',
      scorePoints: ['Propostas normalizadas antes da comparação de preço', 'Prazo, qualidade, serviço e custo avaliados com o mesmo método', 'Critérios eliminatórios bloqueiam falhas repetidas', 'Pendências de evidência permanecem abertas até a solução'],
      openScorecard: 'Veja como avaliamos fornecedores', supplierImageAlt: 'Discussão autorizada com fornecedor durante avaliação de produto na China', scorecardPreviewAlt: 'Prévia do scorecard de fornecedores DDNZ',
      exportEyebrow: 'Evidência de exportação, não foto genérica', exportTitle: 'Uma entrega de origem documentada', exportBody: 'Registros reais de carregamento mostram o que ocorreu na origem, sem sugerir propriedade da instalação ou execução no destino.', exportImageAlt: 'Registro real e anonimizado do carregamento de um embarque de acessórios móveis',
      exportCheckpoints: [['Recebimento e conferência', 'Comparar quantidade e condição com a packing list.'], ['Embalagem e documentos', 'Revisar acondicionamento e documentos do pedido.'], ['Carregamento do contêiner', 'Registrar o carregamento e o posicionamento da carga.'], ['Lacre e entrega ao transportador', 'Liberar o embarque documentado para o executor do transporte.']],
      redactionNote: 'Material autorizado e anonimizado · Identificadores de cliente, caixas e veículo removidos',
    },
    scorecardDialog: { eyebrow: 'Controle de fornecedores DDNZ', title: 'Método completo de avaliação', closeLabel: 'Fechar método de avaliação', imageAlt: 'Scorecard DDNZ com critérios ponderados e condições eliminatórias' },
    languages: { eyebrow: 'Atendimento aos mercados', title: 'Os idiomas usados pelos compradores', items: [{ name: 'Português', body: 'Comunicação clara em todas as etapas.' }, { name: 'English', body: 'Clear communication through every step.' }, { name: 'Español', body: 'Soporte claro durante cada etapa.' }, { name: 'Français', body: 'Un accompagnement clair à chaque étape.' }] },
    freight: { title: 'Transporte internacional executado pela Heaven Born', body: 'Operando desde 1997 · Entra após a liberação de exportação pela DDNZ.', cta: 'Solicitar cotação de frete' },
    final: { eyebrow: 'Uma equipe responsável na China', title: 'Inicie seu brief de sourcing.', body: 'Informe o produto, o mercado de destino e a fase do pedido. Definiremos o caminho de fornecedor, controle e exportação antes de responder.', sourcingCta: 'Iniciar solicitação', whatsappCta: 'Falar com a equipe na China pelo WhatsApp', freightCta: 'Solicitar cotação de frete', privacy: 'Suas informações são seguras e não são compartilhadas.', whatsappMessage: 'Olá DDNZ Global, gostaria de conversar sobre uma solicitação de sourcing para o meu mercado.' },
  },
  tr: {
    accountability: {
      eyebrow: 'Sonuç üreten tedarikçi ziyaretleri',
      title: 'Çin’de satılabilir ürün grubunu tek bir sorumlu ekiple oluşturun.',
      body: 'Onayladığınız ürün grubunun doğru kalite ve zamanda ulaşması için ürün, kalite ve teslimatı aynı kayıt zincirinde yönetiriz.',
      controls: ['Varış pazarına uygun ürün grubunu tanımlamak', 'Tedarikçileri aynı talebe göre karşılaştırmak', 'Teknik özellik, numune ve açık kararları sabitlemek', 'Üretim ve kaliteyi kayıtlı kanıtlarla doğrulamak', 'Yükü kararlaştırılan takvimde birleştirmek ve serbest bırakmak'],
      imageAlt: 'Çin’de yetkili tedarikçi ve ürün uygunluğu görüşmesi', fieldLabel: 'Yetkili saha materyali · Çin çıkışı', fieldCaption: 'Tedarikçi ve ürün uygunluğu incelemesi',
    },
    process: {
      eyebrow: 'Tek kontrollü zincir', title: 'Ürün talebinden pazara hazır sevkiyata', body: 'Sipariş ilerlemeden önce her adımın kayıtlı çıktısı ve serbest bırakma koşulu vardır.', releaseGate: 'Serbest bırakma koşulu', reviewStep: 'Bu adımı incele',
      steps: [
        { title: 'Tedarikçi karşılaştırması', output: 'Yan yana teklifler ve kısa liste.', gate: 'Onaylı kısa liste ilerler.' },
        { title: 'Teknik özellik ve numune', output: 'Özellikler onaylanır, numuneler doğrulanır.', gate: 'Üretim için numune onayı.' },
        { title: 'Kalite kanıtı', output: 'Denetim raporları ve fotoğraflar.', gate: 'Sevkiyattan önce kalite onayı.' },
        { title: 'Konsolidasyon ve ihracat', output: 'Çeki listesi, belgeler ve konteyner planı.', gate: 'Belgeler doğrulanır ve yük serbest bırakılır.' },
      ],
    },
    evidence: {
      scoreEyebrow: 'Her kısa listenin arkasındaki kanıt', scoreTitle: 'Karşılaştırılabilir teklifler. Görünür koşullar.', scoreBody: 'Sayısal puan; teslimat, kalite veya kanıt başarısızlığını gizlemez.',
      scorePoints: ['Fiyat karşılaştırmasından önce teklifler normalize edilir', 'Teslimat, kalite, hizmet ve maliyet tutarlı biçimde ağırlıklandırılır', 'Tekrarlanan teslimat veya kalite sorunları eleme koşuludur', 'Kanıt açığı çözülene kadar açık kalır'],
      openScorecard: 'Tedarikçileri nasıl puanladığımızı görün', supplierImageAlt: 'Çin’de ürün incelemesi sırasında yetkili tedarikçi görüşmesi', scorecardPreviewAlt: 'DDNZ tedarikçi puan kartı önizlemesi',
      exportEyebrow: 'Stok fotoğraf değil, ihracat kanıtı', exportTitle: 'Belgelenmiş Çin çıkış teslimi', exportBody: 'Gerçek yükleme kayıtları kaynakta ne olduğunu gösterir; tesis sahipliği veya varış teslimatı iddiası oluşturmaz.', exportImageAlt: 'Mobil aksesuar sevkiyatına ait anonimleştirilmiş gerçek konteyner yükleme kaydı',
      exportCheckpoints: [['Teslim alma ve adet kontrolü', 'Miktar ve durumu çeki listesiyle doğrulayın.'], ['Ambalaj ve belge kontrolü', 'Paketleme ve siparişe özel ihracat belgelerini inceleyin.'], ['Konteyner yükleme', 'Kaynak yüklemeyi ve yük yerleşimini kaydedin.'], ['Mühür ve taşıyıcıya teslim', 'Belgelenmiş sevkiyatı nakliye uygulayıcısına bırakın.']],
      redactionNote: 'Yetkili ve anonimleştirilmiş materyal · Müşteri, koli ve araç kimlikleri kaldırıldı',
    },
    scorecardDialog: { eyebrow: 'DDNZ tedarikçi kontrolü', title: 'Tam tedarikçi puanlama yöntemi', closeLabel: 'Puanlama yöntemini kapat', imageAlt: 'Ağırlıklı ölçütler ve eleme koşulları içeren DDNZ tedarikçi puan kartı' },
    languages: { eyebrow: 'Pazar desteği', title: 'Alıcıların kullandığı diller', items: [{ name: 'Türkçe', body: 'Her aşamada açık iletişim.' }, { name: 'English', body: 'Clear communication through every step.' }, { name: 'Русский', body: 'Понятная коммуникация на каждом этапе.' }, { name: 'العربية', body: 'دعم واضح في كل مرحلة من مراحل العمل.', dir: 'rtl' }] },
    freight: { title: 'Uluslararası nakliye Heaven Born tarafından yürütülür', body: '1997’den beri · DDNZ ihracat serbest bırakma tesliminden sonra devreye girer.', cta: 'Nakliye teklifi al' },
    final: { eyebrow: 'Çin’de tek sorumlu ekip', title: 'Tedarik talebinizi bugün başlatın.', body: 'Ürünü, varış pazarını ve sipariş aşamasını paylaşın. Yanıt vermeden önce doğru tedarikçi, kontrol ve ihracat yolunu belirleriz.', sourcingCta: 'Tedarik talebi oluştur', whatsappCta: 'Çin ekibiyle WhatsApp üzerinden görüş', freightCta: 'Nakliye teklifi al', privacy: 'Bilgileriniz güvendedir ve paylaşılmaz.', whatsappMessage: 'Merhaba DDNZ Global, pazarım için bir ürün tedarik talebini görüşmek istiyorum.' },
  },
};
