import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  Globe2,
  LockKeyhole,
  MessageCircle,
  PackageSearch,
  SearchCheck,
  ShieldCheck,
  Smartphone,
  Speaker,
  Utensils,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';
import { buildAttributedWhatsAppUrl, readAttribution } from '../lib/attribution';
import { trackEvent } from '../lib/utils';
import { DdnzEyebrow } from './DdnzUi';

type InquiryMode = 'sourcing' | 'existing';

type InquiryCopy = {
  badgeSourcing: string;
  badgeExisting: string;
  headlineSourcing: string;
  headlineExisting: string;
  introSourcing: string;
  introExisting: string;
  trustOrigin: string;
  trustReply: string;
  trustPrivacy: string;
  stepLabel: string;
  scopeStep: string;
  readinessStep: string;
  contactStep: string;
  scopeTitleSourcing: string;
  scopeTitleExisting: string;
  scopeDescSourcing: string;
  scopeDescExisting: string;
  category: string;
  destination: string;
  destinationPlaceholder: string;
  productSourcing: string;
  productExisting: string;
  productPlaceholderSourcing: string;
  productPlaceholderExisting: string;
  servicesTitleSourcing: string;
  servicesTitleExisting: string;
  servicesHint: string;
  readinessTitleSourcing: string;
  readinessTitleExisting: string;
  timeline: string;
  timelinePlaceholder: string;
  timelineFast: string;
  timelineQuarter: string;
  timelinePlanning: string;
  timelineFlexible: string;
  contactTitle: string;
  contactDesc: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  notes: string;
  notesPlaceholder: string;
  contactHint: string;
  responseNote: string;
  back: string;
  continue: string;
  submitSourcing: string;
  submitExisting: string;
  submitting: string;
  scopeError: string;
  servicesError: string;
  contactError: string;
  emailError: string;
  successTitle: string;
  successText: string;
  successNext: string;
  whatsapp: string;
};

const EN_COPY: InquiryCopy = {
  badgeSourcing: 'DDNZ product sourcing brief',
  badgeExisting: 'DDNZ inspection & consolidation brief',
  headlineSourcing: 'Tell us what you need sourced from China',
  headlineExisting: 'Bring your supplier orders under one accountable China team',
  introSourcing: 'Share the product, destination and order target. We will review supplier fit, specifications and the right export path before we reply.',
  introExisting: 'Tell us what has already been ordered and where it stands. We will define the inspection, follow-up, consolidation and export scope.',
  trustOrigin: 'Guangzhou origin-control team',
  trustReply: 'Scope review within 1 business day',
  trustPrivacy: 'Your information stays private',
  stepLabel: 'Step', scopeStep: 'Product scope', readinessStep: 'Order readiness', contactStep: 'Contact',
  scopeTitleSourcing: 'What should we source?', scopeTitleExisting: 'What has already been ordered?',
  scopeDescSourcing: 'A short product description is enough to start. Add exact specifications if you already have them.',
  scopeDescExisting: 'Describe the goods or paste a short order summary. Supplier documents can be shared after we reply.',
  category: 'Product category', destination: 'Destination market', destinationPlaceholder: 'Country or main market',
  productSourcing: 'Product or specification', productExisting: 'Existing order summary',
  productPlaceholderSourcing: 'Example: 6-burner commercial range, 220–240V, stainless steel, initial order 20 units',
  productPlaceholderExisting: 'Example: three speaker suppliers, production nearly complete, inspection needed before collection',
  servicesTitleSourcing: 'What support should the China team provide?', servicesTitleExisting: 'Which services do you need?',
  servicesHint: 'Select all that apply.',
  readinessTitleSourcing: 'Expected order size', readinessTitleExisting: 'Current order status',
  timeline: 'Target timing', timelinePlaceholder: 'Choose a timing', timelineFast: 'Within 30 days', timelineQuarter: '1–3 months', timelinePlanning: 'Planning / comparing', timelineFlexible: 'Not sure yet',
  contactTitle: 'Where should we send the scope review?', contactDesc: 'Add your name and one contact method. We will confirm the missing commercial or technical details after reviewing the brief.',
  name: 'Name / company', namePlaceholder: 'Your name or company', email: 'Business email', emailPlaceholder: 'name@company.com', phone: 'Phone / WhatsApp', phonePlaceholder: '+country code and number',
  notes: 'Anything else? (optional)', notesPlaceholder: 'Compliance, sample, packaging, target price or deadline notes',
  contactHint: 'Email or phone / WhatsApp—one is enough.', responseNote: 'No spam. A China-based team member will review the scope before contacting you.',
  back: 'Back', continue: 'Continue', submitSourcing: 'Send my sourcing brief', submitExisting: 'Send inspection & consolidation brief', submitting: 'Sending brief…',
  scopeError: 'Please select a category, add a product or order description, and enter the destination market.', servicesError: 'Please select at least one service and one order-readiness option.',
  contactError: 'Please enter your name and either an email or phone / WhatsApp number.', emailError: 'Please enter a valid email address.',
  successTitle: 'Brief received', successText: 'Your request has been routed to the DDNZ China team. We will review the scope before asking for any missing specifications or documents.',
  successNext: 'For an urgent order, you can continue on WhatsApp with the same brief.', whatsapp: 'Continue on WhatsApp',
};

const LOCALIZED_COPY: Record<Language, Partial<InquiryCopy>> = {
  en: {},
  zh: {
    badgeSourcing: 'DDNZ 产品采购需求', badgeExisting: 'DDNZ 验货与集货需求',
    headlineSourcing: '告诉我们您需要从中国采购什么', headlineExisting: '让一个中国团队统一跟进您的供应商订单',
    introSourcing: '提交产品、目的市场和订单目标，我们会先核对供应商适配度、规格与出口路径，再与您联系。',
    introExisting: '告诉我们已经采购了什么以及当前进度，我们会梳理验货、跟单、集货与出口范围。',
    trustOrigin: '广州源头控制团队', trustReply: '1 个工作日内完成需求初审', trustPrivacy: '资料仅用于本次询盘',
    stepLabel: '步骤', scopeStep: '产品范围', readinessStep: '订单准备度', contactStep: '联系方式',
    scopeTitleSourcing: '您要采购什么？', scopeTitleExisting: '您已经采购了什么？',
    scopeDescSourcing: '简要产品描述即可开始；如已有明确规格，可一并填写。', scopeDescExisting: '简述货物或订单情况，供应商文件可在我们回复后再发送。',
    category: '产品品类', destination: '目标市场', destinationPlaceholder: '国家或主要市场', productSourcing: '产品或规格', productExisting: '现有订单概况',
    productPlaceholderSourcing: '例如：六头商用炉，220–240V，不锈钢，首单 20 台', productPlaceholderExisting: '例如：3 家音响供应商，接近完工，需要验货后集货',
    servicesTitleSourcing: '中国团队需要提供哪些支持？', servicesTitleExisting: '您需要哪些服务？', servicesHint: '可多选。',
    readinessTitleSourcing: '预计订单规模', readinessTitleExisting: '当前订单状态', timeline: '目标时间', timelinePlaceholder: '请选择时间',
    timelineFast: '30 天内', timelineQuarter: '1–3 个月', timelinePlanning: '正在规划/比价', timelineFlexible: '暂不确定',
    contactTitle: '我们通过什么方式回复？', contactDesc: '填写姓名和一种联系方式即可；完成需求初审后，我们再确认缺少的商务或技术信息。',
    name: '姓名 / 公司', namePlaceholder: '您的姓名或公司名称', email: '企业邮箱', emailPlaceholder: 'name@company.com', phone: '电话 / WhatsApp', phonePlaceholder: '+国家代码和号码',
    notes: '其他说明（选填）', notesPlaceholder: '合规、样品、包装、目标价格或交期要求', contactHint: '邮箱或电话 / WhatsApp 填写一项即可。',
    responseNote: '不会发送垃圾信息；由中国团队先审核需求再联系。', back: '上一步', continue: '继续', submitSourcing: '发送采购需求', submitExisting: '发送验货与集货需求', submitting: '正在发送…',
    scopeError: '请选择品类、填写产品或订单描述，并输入目标市场。', servicesError: '请至少选择一项服务和一个订单准备度选项。',
    contactError: '请填写姓名，并至少提供邮箱或电话 / WhatsApp。', emailError: '请输入有效的邮箱地址。',
    successTitle: '需求已收到', successText: '您的需求已转给 DDNZ 中国团队。我们会先审核范围，再联系您补充必要规格或文件。', successNext: '如订单紧急，可在 WhatsApp 继续发送同一需求。', whatsapp: '前往 WhatsApp',
  },
  ru: {
    badgeSourcing: 'Заявка DDNZ на закупку', badgeExisting: 'Заявка DDNZ на инспекцию и консолидацию',
    headlineSourcing: 'Расскажите, какой товар нужно найти в Китае', headlineExisting: 'Передайте контроль заказов одной команде в Китае',
    introSourcing: 'Укажите товар, рынок и объем заказа. Мы проверим поставщиков, спецификацию и экспортный маршрут.',
    introExisting: 'Опишите размещенные заказы и их статус. Мы определим объем инспекции, контроля, консолидации и экспорта.',
    trustOrigin: 'Команда контроля в Гуанчжоу', trustReply: 'Проверка заявки за 1 рабочий день', trustPrivacy: 'Ваши данные конфиденциальны',
    stepLabel: 'Шаг', scopeStep: 'Товар', readinessStep: 'Готовность', contactStep: 'Контакт',
    scopeTitleSourcing: 'Что нужно закупить?', scopeTitleExisting: 'Что уже заказано?', scopeDescSourcing: 'Краткого описания достаточно; добавьте спецификацию, если она готова.', scopeDescExisting: 'Кратко опишите товар или заказ. Документы можно отправить после ответа.',
    category: 'Категория товара', destination: 'Рынок назначения', destinationPlaceholder: 'Страна или рынок', productSourcing: 'Товар или спецификация', productExisting: 'Описание заказов',
    servicesTitleSourcing: 'Какая помощь нужна в Китае?', servicesTitleExisting: 'Какие услуги нужны?', servicesHint: 'Можно выбрать несколько.', readinessTitleSourcing: 'Ожидаемый объем заказа', readinessTitleExisting: 'Текущий статус заказа',
    timeline: 'Желаемый срок', timelinePlaceholder: 'Выберите срок', timelineFast: 'До 30 дней', timelineQuarter: '1–3 месяца', timelinePlanning: 'Планирование / сравнение', timelineFlexible: 'Пока не знаю',
    contactTitle: 'Куда отправить результат проверки?', contactDesc: 'Укажите имя и один способ связи. Остальные детали уточним после проверки заявки.',
    name: 'Имя / компания', namePlaceholder: 'Имя или компания', email: 'Рабочий e-mail', phone: 'Телефон / WhatsApp', notes: 'Дополнительно (необязательно)', contactHint: 'Достаточно e-mail или телефона / WhatsApp.',
    back: 'Назад', continue: 'Продолжить', submitSourcing: 'Отправить заявку на закупку', submitExisting: 'Отправить заявку на инспекцию', submitting: 'Отправка…',
    scopeError: 'Выберите категорию, опишите товар или заказ и укажите рынок.', servicesError: 'Выберите хотя бы одну услугу и статус готовности.', contactError: 'Укажите имя и e-mail или телефон / WhatsApp.', emailError: 'Введите корректный e-mail.',
    successTitle: 'Заявка получена', successText: 'Заявка передана команде DDNZ в Китае. Мы проверим объем работ и запросим недостающие данные.', successNext: 'По срочному заказу можно продолжить в WhatsApp.', whatsapp: 'Продолжить в WhatsApp',
  },
  fr: {
    badgeSourcing: 'Brief sourcing DDNZ', badgeExisting: 'Brief inspection & consolidation DDNZ',
    headlineSourcing: 'Dites-nous quel produit vous recherchez en Chine', headlineExisting: 'Confiez le suivi de vos commandes à une seule équipe en Chine',
    introSourcing: 'Indiquez le produit, le marché et l’objectif de commande. Nous vérifierons les fournisseurs, les spécifications et le parcours export.',
    introExisting: 'Décrivez les commandes déjà placées et leur avancement. Nous définirons le périmètre de contrôle, inspection, consolidation et export.',
    trustOrigin: 'Équipe de contrôle à Guangzhou', trustReply: 'Analyse sous 1 jour ouvré', trustPrivacy: 'Informations confidentielles',
    stepLabel: 'Étape', scopeStep: 'Produit', readinessStep: 'Préparation', contactStep: 'Contact',
    scopeTitleSourcing: 'Que devons-nous rechercher ?', scopeTitleExisting: 'Qu’avez-vous déjà commandé ?', scopeDescSourcing: 'Une brève description suffit ; ajoutez les spécifications si elles sont prêtes.', scopeDescExisting: 'Résumez le produit ou la commande. Les documents pourront être envoyés après notre réponse.',
    category: 'Catégorie produit', destination: 'Marché de destination', destinationPlaceholder: 'Pays ou marché principal', productSourcing: 'Produit ou spécification', productExisting: 'Résumé des commandes',
    servicesTitleSourcing: 'Quel soutien souhaitez-vous en Chine ?', servicesTitleExisting: 'Quels services souhaitez-vous ?', servicesHint: 'Plusieurs choix possibles.', readinessTitleSourcing: 'Volume de commande prévu', readinessTitleExisting: 'État actuel de la commande',
    timeline: 'Délai cible', timelinePlaceholder: 'Choisir un délai', timelineFast: 'Sous 30 jours', timelineQuarter: '1–3 mois', timelinePlanning: 'Planification / comparaison', timelineFlexible: 'Pas encore défini',
    contactTitle: 'Où envoyer notre analyse ?', contactDesc: 'Indiquez votre nom et un moyen de contact. Nous confirmerons ensuite les détails manquants.',
    name: 'Nom / société', namePlaceholder: 'Votre nom ou société', email: 'E-mail professionnel', phone: 'Téléphone / WhatsApp', notes: 'Autres précisions (facultatif)', contactHint: 'Un e-mail ou un téléphone / WhatsApp suffit.',
    back: 'Retour', continue: 'Continuer', submitSourcing: 'Envoyer mon brief sourcing', submitExisting: 'Envoyer le brief inspection', submitting: 'Envoi…',
    scopeError: 'Choisissez une catégorie, décrivez le produit ou la commande et indiquez le marché.', servicesError: 'Choisissez au moins un service et un niveau de préparation.', contactError: 'Indiquez votre nom et un e-mail ou téléphone / WhatsApp.', emailError: 'Saisissez une adresse e-mail valide.',
    successTitle: 'Brief reçu', successText: 'Votre demande a été transmise à l’équipe DDNZ en Chine. Nous vérifierons le périmètre avant de demander les éléments manquants.', successNext: 'Pour une demande urgente, poursuivez sur WhatsApp.', whatsapp: 'Continuer sur WhatsApp',
  },
  es: {
    badgeSourcing: 'Solicitud de compras DDNZ', badgeExisting: 'Solicitud de inspección y consolidación DDNZ',
    headlineSourcing: 'Cuéntenos qué producto necesita comprar en China', headlineExisting: 'Centralice sus pedidos con un solo equipo responsable en China',
    introSourcing: 'Indique el producto, mercado y objetivo del pedido. Revisaremos proveedores, especificaciones y la ruta de exportación.',
    introExisting: 'Describa los pedidos ya realizados y su estado. Definiremos inspección, seguimiento, consolidación y exportación.',
    trustOrigin: 'Equipo de control en Guangzhou', trustReply: 'Revisión en 1 día laborable', trustPrivacy: 'Información confidencial',
    stepLabel: 'Paso', scopeStep: 'Producto', readinessStep: 'Preparación', contactStep: 'Contacto',
    scopeTitleSourcing: '¿Qué debemos buscar?', scopeTitleExisting: '¿Qué ha pedido ya?', scopeDescSourcing: 'Basta una descripción breve; añada especificaciones si ya las tiene.', scopeDescExisting: 'Resuma el producto o pedido. Podrá enviar documentos después de nuestra respuesta.',
    category: 'Categoría de producto', destination: 'Mercado de destino', destinationPlaceholder: 'País o mercado principal', productSourcing: 'Producto o especificación', productExisting: 'Resumen de pedidos',
    servicesTitleSourcing: '¿Qué apoyo necesita en China?', servicesTitleExisting: '¿Qué servicios necesita?', servicesHint: 'Seleccione todos los necesarios.', readinessTitleSourcing: 'Volumen previsto', readinessTitleExisting: 'Estado actual del pedido',
    timeline: 'Plazo objetivo', timelinePlaceholder: 'Seleccione un plazo', timelineFast: 'En 30 días', timelineQuarter: '1–3 meses', timelinePlanning: 'Planificación / comparación', timelineFlexible: 'Aún no lo sé',
    contactTitle: '¿Dónde enviamos la revisión?', contactDesc: 'Indique su nombre y un medio de contacto. Confirmaremos después los datos que falten.',
    name: 'Nombre / empresa', namePlaceholder: 'Su nombre o empresa', email: 'Correo corporativo', phone: 'Teléfono / WhatsApp', notes: 'Otros detalles (opcional)', contactHint: 'Basta correo o teléfono / WhatsApp.',
    back: 'Atrás', continue: 'Continuar', submitSourcing: 'Enviar solicitud de compra', submitExisting: 'Enviar solicitud de inspección', submitting: 'Enviando…',
    scopeError: 'Seleccione categoría, describa el producto o pedido e indique el mercado.', servicesError: 'Seleccione al menos un servicio y una opción de preparación.', contactError: 'Indique nombre y correo o teléfono / WhatsApp.', emailError: 'Introduzca un correo válido.',
    successTitle: 'Solicitud recibida', successText: 'La solicitud se ha enviado al equipo DDNZ en China. Revisaremos el alcance antes de pedir los datos que falten.', successNext: 'Si es urgente, continúe por WhatsApp.', whatsapp: 'Continuar por WhatsApp',
  },
  ar: {
    badgeSourcing: 'موجز التوريد من DDNZ', badgeExisting: 'موجز الفحص والتجميع من DDNZ',
    headlineSourcing: 'أخبرنا بالمنتج الذي تريد شراءه من الصين', headlineExisting: 'اجمع متابعة طلبات الموردين لدى فريق واحد في الصين',
    introSourcing: 'أدخل المنتج والسوق وحجم الطلب. سنراجع الموردين والمواصفات ومسار التصدير قبل التواصل معكم.',
    introExisting: 'صف الطلبات التي تم تقديمها وحالتها. سنحدد نطاق الفحص والمتابعة والتجميع والتصدير.',
    trustOrigin: 'فريق مراقبة في قوانغتشو', trustReply: 'مراجعة خلال يوم عمل', trustPrivacy: 'معلوماتكم سرية',
    stepLabel: 'الخطوة', scopeStep: 'المنتج', readinessStep: 'جاهزية الطلب', contactStep: 'التواصل',
    scopeTitleSourcing: 'ما المنتج المطلوب؟', scopeTitleExisting: 'ما الذي تم طلبه؟', scopeDescSourcing: 'يكفي وصف مختصر، ويمكن إضافة المواصفات إن كانت جاهزة.', scopeDescExisting: 'لخص المنتج أو الطلب، ويمكن إرسال المستندات بعد ردنا.',
    category: 'فئة المنتج', destination: 'سوق الوجهة', destinationPlaceholder: 'الدولة أو السوق الرئيسي', productSourcing: 'المنتج أو المواصفات', productExisting: 'ملخص الطلبات',
    servicesTitleSourcing: 'ما الدعم المطلوب في الصين؟', servicesTitleExisting: 'ما الخدمات المطلوبة؟', servicesHint: 'يمكن اختيار أكثر من خدمة.', readinessTitleSourcing: 'حجم الطلب المتوقع', readinessTitleExisting: 'حالة الطلب الحالية',
    timeline: 'الوقت المستهدف', timelinePlaceholder: 'اختر الوقت', timelineFast: 'خلال 30 يوماً', timelineQuarter: '1–3 أشهر', timelinePlanning: 'تخطيط / مقارنة', timelineFlexible: 'غير محدد بعد',
    contactTitle: 'كيف نرسل نتيجة المراجعة؟', contactDesc: 'أدخل الاسم ووسيلة تواصل واحدة. سنؤكد التفاصيل الناقصة بعد مراجعة الموجز.',
    name: 'الاسم / الشركة', namePlaceholder: 'الاسم أو الشركة', email: 'البريد المهني', phone: 'الهاتف / واتساب', notes: 'تفاصيل إضافية (اختياري)', contactHint: 'يكفي البريد أو الهاتف / واتساب.',
    back: 'رجوع', continue: 'متابعة', submitSourcing: 'إرسال موجز التوريد', submitExisting: 'إرسال موجز الفحص', submitting: 'جارٍ الإرسال…',
    scopeError: 'اختر الفئة، وصف المنتج أو الطلب، وأدخل السوق.', servicesError: 'اختر خدمة واحدة على الأقل وحالة جاهزية.', contactError: 'أدخل الاسم والبريد أو الهاتف / واتساب.', emailError: 'أدخل بريداً إلكترونياً صحيحاً.',
    successTitle: 'تم استلام الموجز', successText: 'تم تحويل الطلب إلى فريق DDNZ في الصين. سنراجع النطاق قبل طلب المعلومات الناقصة.', successNext: 'للطلب العاجل يمكن المتابعة عبر واتساب.', whatsapp: 'المتابعة عبر واتساب',
  },
};

const CATEGORY_LABELS: Record<Language, Record<string, string>> = {
  en: { kitchen: 'Commercial kitchen', audio: 'Audio & speakers', mobile: 'Mobile accessories', other: 'Other products' },
  zh: { kitchen: '商用餐厨', audio: '音响设备', mobile: '手机配件', other: '其他产品' },
  ru: { kitchen: 'Проф. кухни', audio: 'Аудио и колонки', mobile: 'Мобильные аксессуары', other: 'Другие товары' },
  fr: { kitchen: 'Cuisine professionnelle', audio: 'Audio et enceintes', mobile: 'Accessoires mobiles', other: 'Autres produits' },
  es: { kitchen: 'Cocina comercial', audio: 'Audio y altavoces', mobile: 'Accesorios móviles', other: 'Otros productos' },
  ar: { kitchen: 'معدات المطابخ', audio: 'الصوت ومكبرات الصوت', mobile: 'ملحقات الهاتف', other: 'منتجات أخرى' },
};

const SERVICE_LABELS: Record<Language, { sourcing: Array<[string, string]>; existing: Array<[string, string]> }> = {
  en: { sourcing: [['Supplier shortlist', 'Search and initial factory screening'], ['Samples & specs', 'Sample coordination and specification checks'], ['Price comparison', 'Comparable quotations and commercial review'], ['Full sourcing + export', 'Supplier coordination through consolidated delivery']], existing: [['Supplier follow-up', 'Production and readiness coordination'], ['On-site inspection', 'QC checklist, photos and report'], ['Order consolidation', 'Collect orders from multiple suppliers'], ['Export & freight', 'Documents, booking and destination delivery']] },
  zh: { sourcing: [['供应商筛选', '搜索并初步核验工厂'], ['样品与规格', '样品协调和规格检查'], ['价格比较', '统一口径报价与商务核对'], ['采购＋出口全流程', '从供应商协调到集货交付']], existing: [['供应商跟单', '生产进度与完工协调'], ['现场验货', '质量清单、照片和报告'], ['订单集货', '统一收集多家供应商货物'], ['出口与货运', '单证、订舱和目的地交付']] },
  ru: { sourcing: [['Подбор поставщиков', 'Поиск и первичная проверка фабрик'], ['Образцы и спецификации', 'Координация образцов и проверка параметров'], ['Сравнение цен', 'Сопоставимые предложения и условия'], ['Закупка и экспорт', 'От поставщика до сборной доставки']], existing: [['Контроль поставщика', 'Производство и готовность'], ['Инспекция на месте', 'Чек-лист, фото и отчет'], ['Консолидация', 'Сбор заказов у разных поставщиков'], ['Экспорт и доставка', 'Документы, бронирование и перевозка']] },
  fr: { sourcing: [['Sélection fournisseurs', 'Recherche et présélection des usines'], ['Échantillons & specs', 'Coordination et contrôle des spécifications'], ['Comparaison des prix', 'Offres comparables et revue commerciale'], ['Sourcing + export', 'Coordination jusqu’à la livraison groupée']], existing: [['Suivi fournisseur', 'Production et préparation'], ['Inspection sur site', 'Checklist QC, photos et rapport'], ['Consolidation', 'Collecte auprès de plusieurs fournisseurs'], ['Export & fret', 'Documents, réservation et livraison']] },
  es: { sourcing: [['Selección de proveedores', 'Búsqueda y evaluación inicial'], ['Muestras y especificaciones', 'Coordinación y comprobación'], ['Comparación de precios', 'Cotizaciones comparables y revisión'], ['Compra + exportación', 'Coordinación hasta la entrega consolidada']], existing: [['Seguimiento de proveedor', 'Producción y preparación'], ['Inspección en origen', 'Checklist, fotos e informe'], ['Consolidación', 'Recogida de varios proveedores'], ['Exportación y transporte', 'Documentos, reserva y entrega']] },
  ar: { sourcing: [['قائمة الموردين', 'البحث والفحص الأولي للمصانع'], ['العينات والمواصفات', 'تنسيق العينات وفحص المواصفات'], ['مقارنة الأسعار', 'عروض قابلة للمقارنة ومراجعة تجارية'], ['التوريد والتصدير', 'التنسيق حتى التسليم المجمع']], existing: [['متابعة المورد', 'الإنتاج والجاهزية'], ['فحص في الموقع', 'قائمة جودة وصور وتقرير'], ['تجميع الطلبات', 'جمع البضائع من عدة موردين'], ['التصدير والشحن', 'المستندات والحجز والتسليم']] },
};

const READINESS_LABELS: Record<Language, { sourcing: string[]; existing: string[] }> = {
  en: { sourcing: ['Sample / trial order', 'Small mixed order', 'Bulk / container order', 'Need quantity advice'], existing: ['Not ordered yet', 'In production', 'Ready for inspection', 'Ready for collection'] },
  zh: { sourcing: ['样品 / 试单', '小批量混合订单', '大货 / 整柜订单', '需要数量建议'], existing: ['尚未下单', '生产中', '可安排验货', '可安排提货'] },
  ru: { sourcing: ['Образец / пробный заказ', 'Небольшой смешанный заказ', 'Опт / контейнер', 'Нужна рекомендация'], existing: ['Еще не заказано', 'В производстве', 'Готово к инспекции', 'Готово к забору'] },
  fr: { sourcing: ['Échantillon / essai', 'Petite commande mixte', 'Commande en gros / conteneur', 'Conseil sur la quantité'], existing: ['Pas encore commandé', 'En production', 'Prêt pour inspection', 'Prêt à collecter'] },
  es: { sourcing: ['Muestra / pedido de prueba', 'Pedido mixto pequeño', 'Pedido a granel / contenedor', 'Necesito orientación'], existing: ['Aún no pedido', 'En producción', 'Listo para inspección', 'Listo para recogida'] },
  ar: { sourcing: ['عينة / طلب تجريبي', 'طلب مختلط صغير', 'طلب بالجملة / حاوية', 'أحتاج نصيحة للكمية'], existing: ['لم يتم الطلب بعد', 'قيد الإنتاج', 'جاهز للفحص', 'جاهز للاستلام'] },
};

const CATEGORY_OPTIONS: Array<{ value: string; key: string; Icon: LucideIcon }> = [
  { value: 'Commercial Kitchen Equipment', key: 'kitchen', Icon: Utensils },
  { value: 'Audio & Speakers', key: 'audio', Icon: Speaker },
  { value: 'Mobile Accessories', key: 'mobile', Icon: Smartphone },
  { value: 'Other', key: 'other', Icon: Boxes },
];

export default function TradeSupportInquiry() {
  const { language } = useLanguage();
  const location = useLocation();
  const [formState, formspreeSubmit] = useForm('mdabvqbd');
  const copy = { ...EN_COPY, ...LOCALIZED_COPY[language] };
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const leadGoal = params.get('leadGoal') || 'Product Sourcing';
  const mode: InquiryMode = leadGoal.toLowerCase().includes('inspection') ? 'existing' : 'sourcing';
  const initialCategory = params.get('industry') || 'Commercial Kitchen Equipment';
  const initialDestination = params.get('dest') || params.get('country') || '';
  const attributedSubcategory = params.get('subcategory') || '';
  const attribution = readAttribution(location.search);
  const leadSource = params.get('source') || attribution.source || attribution.utm_source || 'quote_page';

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(initialCategory);
  const [destination, setDestination] = useState(initialDestination);
  const [productDetails, setProductDetails] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [readiness, setReadiness] = useState('');
  const [timeline, setTimeline] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const lifecycleRef = useRef({ started: false, submitted: false, step: 1, mode });
  const successTrackedRef = useRef(false);
  const formErrorTrackedRef = useRef<unknown>(null);

  useEffect(() => {
    setStep(1);
    setCategory(initialCategory);
    setDestination(initialDestination);
    setProductDetails('');
    setServices([]);
    setReadiness('');
    setTimeline('');
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setError('');
    setSubmitted(false);
    successTrackedRef.current = false;
    formErrorTrackedRef.current = null;
    lifecycleRef.current.started = false;
    lifecycleRef.current.submitted = false;
    lifecycleRef.current.mode = mode;
    lifecycleRef.current.step = 1;
  }, [location.search]);

  useEffect(() => {
    lifecycleRef.current.step = step;
    if (step > 1) window.setTimeout(() => headingRef.current?.focus(), 80);
  }, [step]);

  useEffect(() => () => {
    const lifecycle = lifecycleRef.current;
    if (lifecycle.started && !lifecycle.submitted) {
      trackEvent('quote_form_abandon', {
        form_location: 'trade_support_quote_page',
        intent: lifecycle.mode,
        last_step: lifecycle.step,
      });
    }
  }, []);

  useEffect(() => {
    if (formState.succeeded && !successTrackedRef.current) {
      successTrackedRef.current = true;
      lifecycleRef.current.submitted = true;
      trackEvent('quote_form_submit', {
        event_category: 'conversion',
        form_location: 'trade_support_quote_page',
        intent: mode,
        lead_goal: leadGoal,
        product_category: category,
        service_count: services.length,
        lead_source: leadSource,
      });
      trackEvent('rfq_submit_success', {
        event_category: 'conversion',
        form_location: 'trade_support_quote_page',
        intent: mode,
        lead_goal: leadGoal,
        product_category: category,
        service_count: services.length,
        lead_source: leadSource,
      });
      setSubmitted(true);
    }
  }, [formState.succeeded, mode, leadGoal, category, services.length, leadSource]);

  useEffect(() => {
    if (!formState.errors || formErrorTrackedRef.current === formState.errors) return;
    formErrorTrackedRef.current = formState.errors;
    trackEvent('quote_form_error', {
      form_location: 'trade_support_quote_page',
      intent: mode,
      step: 3,
      error_type: 'formspree_submission_error',
    });
  }, [formState.errors, mode]);

  const markStarted = () => {
    if (lifecycleRef.current.started) return;
    lifecycleRef.current.started = true;
    trackEvent('quote_form_start', {
      form_location: 'trade_support_quote_page',
      intent: mode,
      lead_goal: leadGoal,
      product_category: category,
      lead_source: leadSource,
    });
  };

  const serviceOptions = SERVICE_LABELS[language][mode];
  const readinessOptions = READINESS_LABELS[language][mode];
  const categoryOptions = CATEGORY_OPTIONS.some((option) => option.value === category)
    ? CATEGORY_OPTIONS
    : [{ value: category, key: 'other', Icon: Boxes }, ...CATEGORY_OPTIONS];
  const whatsappUrl = buildAttributedWhatsAppUrl(
    `Hi DDNZ Global, I submitted a ${mode === 'sourcing' ? 'product sourcing' : 'supplier inspection and consolidation'} brief. Category: ${category}. Destination: ${destination || 'not confirmed'}.`,
    attribution,
  );

  const toggleService = (value: string) => {
    markStarted();
    setError('');
    setServices((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const nextStep = () => {
    markStarted();
    if (step === 1) {
      if (!category || !destination.trim() || productDetails.trim().length < 3) {
        setError(copy.scopeError);
        trackEvent('quote_form_error', { form_location: 'trade_support_quote_page', intent: mode, step: 1, error_type: 'scope_incomplete' });
        if (!destination.trim()) destinationRef.current?.focus();
        else detailsRef.current?.focus();
        return;
      }
    }
    if (step === 2 && (!services.length || !readiness)) {
      setError(copy.servicesError);
      trackEvent('quote_form_error', { form_location: 'trade_support_quote_page', intent: mode, step: 2, error_type: 'service_or_readiness_missing' });
      headingRef.current?.focus();
      return;
    }
    trackEvent('quote_form_step_complete', {
      form_location: 'trade_support_quote_page', intent: mode, step, service_count: services.length,
    });
    setError('');
    setStep((current) => Math.min(3, current + 1));
  };

  const previousStep = () => {
    setError('');
    setStep((current) => Math.max(1, current - 1));
  };

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    markStarted();
    const emailIsValid = !email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!name.trim() || (!email.trim() && !phone.trim())) {
      event.preventDefault();
      setError(copy.contactError);
      trackEvent('quote_form_error', { form_location: 'trade_support_quote_page', intent: mode, step: 3, error_type: 'contact_missing' });
      nameRef.current?.focus();
      return;
    }
    if (!emailIsValid) {
      event.preventDefault();
      setError(copy.emailError);
      trackEvent('quote_form_error', { form_location: 'trade_support_quote_page', intent: mode, step: 3, error_type: 'email_invalid' });
      emailRef.current?.focus();
      return;
    }
    setError('');
    trackEvent('quote_form_submit_attempt', {
      form_location: 'trade_support_quote_page', intent: mode, lead_goal: leadGoal, product_category: category, service_count: services.length,
    });
    formspreeSubmit(event);
  };

  const stepLabels = [copy.scopeStep, copy.readinessStep, copy.contactStep];

  return (
    <section className="relative overflow-hidden bg-[#fffdf9] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16" dir={language === 'ar' ? 'rtl' : undefined}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_7%_12%,rgba(118,60,156,.08),transparent_28rem),radial-gradient(circle_at_92%_88%,rgba(201,79,47,.07),transparent_24rem)]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-12">
        <aside className="lg:sticky lg:top-28">
          <DdnzEyebrow icon={mode === 'sourcing' ? PackageSearch : ClipboardCheck}>{mode === 'sourcing' ? copy.badgeSourcing : copy.badgeExisting}</DdnzEyebrow>
          <h1 className="mt-5 max-w-[13ch] text-[clamp(2.25rem,4.4vw,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.05em] text-[var(--ddnz-ink)]">
            {mode === 'sourcing' ? copy.headlineSourcing : copy.headlineExisting}
          </h1>
          <p className="mt-5 max-w-[54ch] text-base font-medium leading-7 text-slate-600 sm:text-lg">
            {mode === 'sourcing' ? copy.introSourcing : copy.introExisting}
          </p>
          <div className="mt-7 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-3 lg:grid-cols-1">
            <p className="flex items-center gap-3"><Globe2 className="h-5 w-5 shrink-0 text-[var(--ddnz-purple)]" aria-hidden="true" />{copy.trustOrigin}</p>
            <p className="flex items-center gap-3"><Clock3 className="h-5 w-5 shrink-0 text-[var(--ddnz-purple)]" aria-hidden="true" />{copy.trustReply}</p>
            <p className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-[var(--ddnz-purple)]" aria-hidden="true" />{copy.trustPrivacy}</p>
          </div>
        </aside>

        <div className="overflow-hidden rounded-2xl border border-[var(--ddnz-line)] bg-white shadow-[var(--ddnz-shadow-soft)]">
          {!submitted ? (
            <form onSubmit={submitForm} noValidate>
              <div className="border-b border-slate-200 px-5 py-5 sm:px-8">
                <div className="flex items-center justify-between gap-4 text-xs font-bold text-slate-500">
                  <span>{copy.stepLabel} {step} / 3</span>
                  <span className="max-w-[56%] truncate text-[var(--ddnz-purple-strong)]">{category}{destination ? ` · ${destination}` : ''}</span>
                </div>
                <ol className="mt-4 grid grid-cols-3 gap-2" aria-label={`${copy.stepLabel} ${step} / 3`}>
                  {stepLabels.map((label, index) => {
                    const number = index + 1;
                    const complete = number < step;
                    const active = number === step;
                    return (
                      <li key={label}>
                        <button type="button" disabled={number > step} onClick={() => setStep(number)} className="min-h-11 w-full rounded-lg px-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] focus-visible:ring-offset-2 disabled:cursor-not-allowed" aria-current={active ? 'step' : undefined}>
                          <span className={`block h-1.5 rounded-full ${complete ? 'bg-[var(--ddnz-coral)]' : active ? 'bg-[var(--ddnz-purple)]' : 'bg-slate-200'}`} />
                          <span className={`mt-2 block text-[11px] font-bold sm:text-xs ${active ? 'text-[var(--ddnz-ink)]' : 'text-slate-500'}`}>{label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="px-5 py-6 sm:px-8 sm:py-8">
                {step === 1 ? (
                  <div>
                    <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold tracking-[-0.03em] text-[var(--ddnz-ink)] outline-none">
                      {mode === 'sourcing' ? copy.scopeTitleSourcing : copy.scopeTitleExisting}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{mode === 'sourcing' ? copy.scopeDescSourcing : copy.scopeDescExisting}</p>

                    <fieldset className="mt-6">
                      <legend className="text-sm font-bold text-[var(--ddnz-ink)]">{copy.category}</legend>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {categoryOptions.map(({ value, key, Icon }, index) => {
                          const selected = category === value;
                          return (
                            <button key={`${value}-${index}`} type="button" aria-pressed={selected} onClick={() => { markStarted(); setCategory(value); setError(''); }} className={`min-h-[72px] rounded-xl border p-3 text-left text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] ${selected ? 'border-[var(--ddnz-purple)] bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                              <Icon className="mb-2 h-5 w-5" aria-hidden="true" />{value === initialCategory && !CATEGORY_OPTIONS.some((item) => item.value === value) ? value : CATEGORY_LABELS[language][key]}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    <div className="mt-5">
                      <label htmlFor="trade-destination" className="text-sm font-bold text-[var(--ddnz-ink)]">{copy.destination}</label>
                      <input ref={destinationRef} id="trade-destination" name="Destination" type="text" value={destination} onChange={(event) => { markStarted(); setDestination(event.target.value); setError(''); }} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none transition focus:border-[var(--ddnz-purple)] focus:ring-2 focus:ring-[var(--ddnz-purple)]/15" placeholder={copy.destinationPlaceholder} autoComplete="country-name" />
                    </div>

                    <div className="mt-5">
                      <label htmlFor="trade-product-details" className="text-sm font-bold text-[var(--ddnz-ink)]">{mode === 'sourcing' ? copy.productSourcing : copy.productExisting}</label>
                      <textarea ref={detailsRef} id="trade-product-details" name="Product_or_Order_Details" rows={4} value={productDetails} onChange={(event) => { markStarted(); setProductDetails(event.target.value); setError(''); }} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-[var(--ddnz-purple)] focus:ring-2 focus:ring-[var(--ddnz-purple)]/15" placeholder={mode === 'sourcing' ? copy.productPlaceholderSourcing : copy.productPlaceholderExisting} />
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div>
                    <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold tracking-[-0.03em] text-[var(--ddnz-ink)] outline-none">
                      {mode === 'sourcing' ? copy.servicesTitleSourcing : copy.servicesTitleExisting}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">{copy.servicesHint}</p>
                    <fieldset className="mt-5 grid gap-3 sm:grid-cols-2">
                      <legend className="sr-only">{mode === 'sourcing' ? copy.servicesTitleSourcing : copy.servicesTitleExisting}</legend>
                      {serviceOptions.map(([label, description], index) => {
                        const selected = services.includes(label);
                        const Icon = [SearchCheck, FileCheck2, ClipboardCheck, Boxes][index];
                        return (
                          <button key={label} type="button" aria-pressed={selected} onClick={() => toggleService(label)} className={`min-h-[92px] rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] ${selected ? 'border-[var(--ddnz-purple)] bg-[var(--ddnz-purple-soft)]' : 'border-slate-200 hover:border-slate-300'}`}>
                            <span className="flex items-start gap-3">
                              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${selected ? 'text-[var(--ddnz-purple)]' : 'text-slate-500'}`} aria-hidden="true" />
                              <span className="min-w-0"><span className="flex items-center gap-2 text-sm font-extrabold text-[var(--ddnz-ink)]">{label}{selected ? <Check className="h-4 w-4 text-[var(--ddnz-purple)]" aria-hidden="true" /> : null}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{description}</span></span>
                            </span>
                          </button>
                        );
                      })}
                    </fieldset>

                    <fieldset className="mt-6">
                      <legend className="text-sm font-bold text-[var(--ddnz-ink)]">{mode === 'sourcing' ? copy.readinessTitleSourcing : copy.readinessTitleExisting}</legend>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {readinessOptions.map((option) => <button key={option} type="button" aria-pressed={readiness === option} onClick={() => { markStarted(); setReadiness(option); setError(''); }} className={`min-h-11 rounded-full border px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] ${readiness === option ? 'border-[var(--ddnz-purple)] bg-[var(--ddnz-purple)] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>{option}</button>)}
                      </div>
                    </fieldset>

                    <div className="mt-6">
                      <label htmlFor="trade-timeline" className="text-sm font-bold text-[var(--ddnz-ink)]">{copy.timeline}</label>
                      <select id="trade-timeline" name="Target_Timing" value={timeline} onChange={(event) => { markStarted(); setTimeline(event.target.value); }} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base outline-none focus:border-[var(--ddnz-purple)] focus:ring-2 focus:ring-[var(--ddnz-purple)]/15">
                        <option value="">{copy.timelinePlaceholder}</option><option>{copy.timelineFast}</option><option>{copy.timelineQuarter}</option><option>{copy.timelinePlanning}</option><option>{copy.timelineFlexible}</option>
                      </select>
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div>
                    <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold tracking-[-0.03em] text-[var(--ddnz-ink)] outline-none">{copy.contactTitle}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{copy.contactDesc}</p>
                    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold leading-5 text-slate-700">
                      <p>{category} · {destination}</p><p>{services.join(' · ')} · {readiness}{timeline ? ` · ${timeline}` : ''}</p>
                    </div>

                    <input type="hidden" name="Inquiry_Type" value={mode === 'sourcing' ? 'Product Sourcing Brief' : 'Supplier Inspection & Consolidation Brief'} />
                    <input type="hidden" name="Lead_Goal" value={leadGoal} />
                    <input type="hidden" name="Product_Category" value={category} />
                    <input type="hidden" name="Product_Subcategory" value={attributedSubcategory} />
                    <input type="hidden" name="Destination" value={destination} />
                    <input type="hidden" name="Product_or_Order_Details" value={productDetails} />
                    <input type="hidden" name="Requested_Services" value={services.join(', ')} />
                    <input type="hidden" name="Order_Readiness" value={readiness} />
                    <input type="hidden" name="Target_Timing" value={timeline} />
                    <input type="hidden" name="Lead_Source" value={leadSource} />
                    <input type="hidden" name="UTM_Source" value={attribution.utm_source || ''} />
                    <input type="hidden" name="UTM_Medium" value={attribution.utm_medium || ''} />
                    <input type="hidden" name="UTM_Campaign" value={attribution.utm_campaign || ''} />

                    <div className="mt-5 grid gap-4">
                      <div><label htmlFor="trade-name" className="text-sm font-bold text-[var(--ddnz-ink)]">{copy.name}</label><input ref={nameRef} id="trade-name" name="name" type="text" value={name} onChange={(event) => { markStarted(); setName(event.target.value); setError(''); }} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-[var(--ddnz-purple)] focus:ring-2 focus:ring-[var(--ddnz-purple)]/15" placeholder={copy.namePlaceholder} autoComplete="name" /></div>
                      <div><label htmlFor="trade-email" className="text-sm font-bold text-[var(--ddnz-ink)]">{copy.email}</label><input ref={emailRef} id="trade-email" name="email" type="email" value={email} onChange={(event) => { markStarted(); setEmail(event.target.value); setError(''); }} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-[var(--ddnz-purple)] focus:ring-2 focus:ring-[var(--ddnz-purple)]/15" placeholder={copy.emailPlaceholder} autoComplete="email" inputMode="email" /><ValidationError prefix="Email" field="email" errors={formState.errors} className="mt-1 text-xs text-red-600" /></div>
                      <div><label htmlFor="trade-phone" className="text-sm font-bold text-[var(--ddnz-ink)]">{copy.phone}</label><input id="trade-phone" name="phone" type="tel" value={phone} onChange={(event) => { markStarted(); setPhone(event.target.value); setError(''); }} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-[var(--ddnz-purple)] focus:ring-2 focus:ring-[var(--ddnz-purple)]/15" placeholder={copy.phonePlaceholder} autoComplete="tel" inputMode="tel" /></div>
                      <p className="-mt-1 text-xs font-semibold text-slate-500">{copy.contactHint}</p>
                      <div><label htmlFor="trade-notes" className="text-sm font-bold text-[var(--ddnz-ink)]">{copy.notes}</label><textarea id="trade-notes" name="message" rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-[var(--ddnz-purple)] focus:ring-2 focus:ring-[var(--ddnz-purple)]/15" placeholder={copy.notesPlaceholder} /></div>
                    </div>
                    <ValidationError errors={formState.errors} className="mt-3 text-sm text-red-600" />
                  </div>
                ) : null}

                <div aria-live="polite" className="mt-5 min-h-5">{error ? <p role="alert" className="text-sm font-bold text-red-600">{error}</p> : null}</div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                {step > 1 ? <button type="button" onClick={previousStep} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)]"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{copy.back}</button> : <span />}
                {step < 3 ? <button type="button" onClick={nextStep} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--ddnz-action)] px-6 text-sm font-extrabold text-white hover:bg-[var(--ddnz-coral-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] focus-visible:ring-offset-2">{copy.continue}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button> : <button type="submit" disabled={formState.submitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--ddnz-action)] px-6 text-sm font-extrabold text-white hover:bg-[var(--ddnz-coral-strong)] disabled:cursor-wait disabled:bg-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] focus-visible:ring-offset-2">{formState.submitting ? copy.submitting : mode === 'sourcing' ? copy.submitSourcing : copy.submitExisting}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>}
              </div>
              {step === 3 ? <p className="flex items-center justify-center gap-2 px-5 pb-5 text-center text-xs text-slate-500"><LockKeyhole className="h-4 w-4" aria-hidden="true" />{copy.responseNote}</p> : null}
            </form>
          ) : (
            <div className="flex min-h-[560px] flex-col items-center justify-center px-6 py-12 text-center sm:px-12">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple)]"><CheckCircle2 className="h-10 w-10" aria-hidden="true" /></span>
              <h2 className="mt-6 text-3xl font-extrabold text-[var(--ddnz-ink)]">{copy.successTitle}</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">{copy.successText}</p>
              <p className="mt-3 text-sm font-semibold text-slate-500">{copy.successNext}</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" data-analytics-tracked="true" onClick={() => trackEvent('whatsapp_click', { cta_location: 'trade_support_success', intent: mode })} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#159a4a] px-6 text-sm font-extrabold text-white hover:bg-[#117d3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159a4a] focus-visible:ring-offset-2"><MessageCircle className="h-5 w-5" aria-hidden="true" />{copy.whatsapp}</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
