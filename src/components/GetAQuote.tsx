import { useState, useEffect, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, 
  ArrowRight, 
  ArrowLeft, 
  Ship, 
  Plane, 
  Truck, 
  Package, 
  Boxes,
  Globe, 
  Scale, 
  CheckCircle2, 
  Check, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../lib/utils';
import { readAttribution } from '../lib/attribution';

// Multi-language translation map for the interactive funnel
const funnelTranslations: Record<string, Record<string, string>> = {
  zh: {
    step1Title: '选择运输方式',
    step1Desc: '不同的运输方式决定了时效与成本，我们将为您定制最优路由',
    step2Title: '选择始发地与目的地',
    step2Desc: '填写始发地与目的地，便于我们初步判断可行的运输与清关安排',
    step3Title: '预估货物重量与体积',
    step3Desc: '拖动滑块或一键选择常见货量预设，实时反馈规格测算',
    step4Title: '留下联系方式获取精确报价',
    step4Desc: '只需填写姓名，并留下邮箱或电话 / WhatsApp 其中一种联系方式',
    
    origin: '始发港/城市',
    originPlaceholder: '输入或选择始发港/城市，如：广州、深圳、上海...',
    popularOrigins: '热门始发地',
    destination: '目的港/国家',
    destinationPlaceholder: '输入目的国，如：美国、俄罗斯、哈萨克斯坦...',
    popularDests: '热门目的地',
    
    weight: '预估重量 (KG)',
    volume: '预估体积 (CBM)',
    presetLabel: '快速货量预设',
    presetSmall: '样品 / 快递包裹 (<100kg)',
    presetMedium: '拼箱 / 托盘拼装 (100-1500kg)',
    presetLarge: '整柜 / 跨国大货 (>1500kg)',
    
    back: '上一步',
    next: '下一步',
    submitQuote: '获取专属精确报价',
    
    summaryTitle: '您的询盘配置摘要',
    summaryMode: '运输方式',
    summaryRoute: '运输航线',
    summaryCargo: '预估规格',
    
    phonePlaceholder: '电话 / 微信 / WhatsApp（与邮箱二选一）',
    namePlaceholder: '您的姓名 / 公司名称 (必填)',
    emailPlaceholder: '企业邮箱（与电话二选一）',
    notesPlaceholder: '选填：提供品名、特殊包装、时效要求等，报价更精准...',
    contactHint: '邮箱或电话 / WhatsApp 填写一项即可',
    contactRequired: '请至少填写邮箱或电话 / WhatsApp 中的一项',
    optionalDetails: '补充货物信息（选填）',
    
    seaDesc: '高性价比，适合大宗散货/整箱重载运输',
    airDesc: '极致时效，适合高附加值、紧急空运直飞',
    landDesc: '卡班直达，中亚五国与俄罗斯高性价比专线',
    wareDesc: '仓储、验货、包装与集运等出口前支持服务',
    
    mode: '运输方式',
    industry: '所属行业 / 货物品类',
    cargoDesc: '货物详情描述',
    submitting: '正在提交询盘...',
    successHeading: '提交成功！',
    successText: '我们已收到您的估价申请，将通过您提交的联系方式确认路线、货物与服务要求。',
    sendAnother: '发起新的询价'
  },
  en: {
    step1Title: 'Select Transport Mode',
    step1Desc: 'Choose your transport channel; we provide optimal routing and pricing',
    step2Title: 'Origin & Destination',
    step2Desc: 'Transit and customs clearance starting from our Guangzhou HQ',
    step3Title: 'Estimated Weight & Volume',
    step3Desc: 'Drag the sliders or select a quick preset for responsive measurements',
    step4Title: 'Get Your Personalized Quote',
    step4Desc: 'Enter your name and either an email or phone / WhatsApp contact',
    
    origin: 'Origin Port / City',
    originPlaceholder: 'Enter or select origin port, e.g., Guangzhou, Shenzhen...',
    popularOrigins: 'Popular Origins',
    destination: 'Destination Port / Country',
    destinationPlaceholder: 'Enter country, e.g., United States, Germany, Russia...',
    popularDests: 'Popular Destinations',
    
    weight: 'Estimated Weight (KG)',
    volume: 'Estimated Volume (CBM)',
    presetLabel: 'Quick Cargo Presets',
    presetSmall: 'Sample / Courier Packet (<100kg)',
    presetMedium: 'LCL / Palletized Cargo (100-1500kg)',
    presetLarge: 'FCL / Commercial Shipment (>1500kg)',
    
    back: 'Back',
    next: 'Next Step',
    submitQuote: 'Get Precise Quote & Routing',
    
    summaryTitle: 'Your Inquiry Summary',
    summaryMode: 'Transport Mode',
    summaryRoute: 'Route Details',
    summaryCargo: 'Cargo Size',
    
    phonePlaceholder: 'Phone / WhatsApp / WeChat (email alternative)',
    namePlaceholder: 'Your Name / Company (Required)',
    emailPlaceholder: 'Corporate Email (phone alternative)',
    notesPlaceholder: 'Optional: Product type, battery contents, packing needs, etc.',
    contactHint: 'Provide either an email or phone / WhatsApp contact',
    contactRequired: 'Please provide either an email or phone / WhatsApp contact',
    optionalDetails: 'Add cargo details (optional)',
    
    seaDesc: 'Cost-effective, best for bulk LCL & FCL logistics',
    airDesc: 'Max speed, perfect for high-value & urgent goods',
    landDesc: 'Direct road freight, ideal for Central Asia & Russia',
    wareDesc: 'Custom plywood crating, storage, and cross-docking',
    
    mode: 'Transport Mode',
    industry: 'Industry / Product Category',
    cargoDesc: 'Cargo Details & Requirements',
    submitting: 'Submitting Inquiry...',
    successHeading: 'Successfully Submitted!',
    successText: 'Your request has been received. Our team will use your submitted contact details to confirm routing, cargo, and service requirements.',
    sendAnother: 'Send another inquiry'
  },
  ru: {
    step1Title: 'Выберите способ доставки',
    step1Desc: 'Оптимальные логистические каналы и индивидуальные маршруты',
    step2Title: 'Пункт отправления и назначения',
    step2Desc: 'Прямой транзит и таможенное оформление из Гуанчжоу',
    step3Title: 'Вес и объем груза',
    step3Desc: 'Используйте ползунки или пресеты для точной оценки',
    step4Title: 'Получить индивидуальный расчет',
    step4Desc: 'Укажите имя и один способ связи: e-mail или телефон / мессенджер',
    
    origin: 'Пункт отправления',
    originPlaceholder: 'Введите или выберите пункт отправления, например, Гуанчжоу...',
    popularOrigins: 'Популярные пункты',
    destination: 'Пункт назначения / Страна',
    destinationPlaceholder: 'Введите страну, например, Россия, Узбекистан...',
    popularDests: 'Популярные направления',
    
    weight: 'Оценочный вес (кг)',
    volume: 'Оценочный объем (куб. м)',
    presetLabel: 'Быстрые шаблоны груза',
    presetSmall: 'Образец / Посылка (<100 кг)',
    presetMedium: 'Сборный груз (LCL) (100-1500 кг)',
    presetLarge: 'Полный контейнер (FCL) (>1500 кг)',
    
    back: 'Назад',
    next: 'Далее',
    submitQuote: 'Получить расчет стоимости',
    
    summaryTitle: 'Сводка вашего запроса',
    summaryMode: 'Режим доставки',
    summaryRoute: 'Детали маршрута',
    summaryCargo: 'Параметры груза',
    
    phonePlaceholder: 'Телефон / WhatsApp / Telegram (или e-mail)',
    namePlaceholder: 'Ваше имя / Компания (Обязательно)',
    emailPlaceholder: 'Рабочий e-mail (или телефон)',
    notesPlaceholder: 'Дополнительно: Характер груза, сроки, особые условия...',
    contactHint: 'Достаточно указать e-mail или телефон / мессенджер',
    contactRequired: 'Укажите e-mail или телефон / мессенджер',
    optionalDetails: 'Добавить сведения о грузе (необязательно)',
    
    seaDesc: 'Экономичная доставка сборных и полных контейнеров',
    airDesc: 'Максимальная скорость для ценных и срочных грузов',
    landDesc: 'Прямые автоперевозки в Центральную Азию и Россию',
    wareDesc: 'Хранение, консолидация, прочная фанерная обрешетка',
    
    mode: 'Режим доставки',
    industry: 'Отрасль / Категория',
    cargoDesc: 'Детали и требования к грузу',
    submitting: 'Отправка запроса...',
    successHeading: 'Запрос успешно отправлен!',
    successText: 'Ваш запрос получен. Старший специалист по логистике ответит на ваш рабочий e-mail в течение 24 часов.',
    sendAnother: 'Отправить еще один запрос'
  },
  fr: {
    step1Title: 'Choisir le mode de transport',
    step1Desc: 'Canaux logistiques optimaux et itinéraires sur mesure',
    step2Title: 'Origine & Destination',
    step2Desc: 'Transit direct et dédouanement depuis notre siège de Guangzhou',
    step3Title: 'Poids & Volume du Cargo',
    step3Desc: 'Ajustez les curseurs ou choisissez un modèle prédéfini',
    step4Title: 'Obtenir votre devis personnalisé',
    step4Desc: 'Indiquez votre nom et un moyen de contact : e-mail ou téléphone / WhatsApp',
    
    origin: 'Port d\'origine / Ville',
    originPlaceholder: 'Saisissez ou sélectionnez l\'origine, ex: Guangzhou, Shenzhen...',
    popularOrigins: 'Origines Populaires',
    destination: 'Port de destination / Pays',
    destinationPlaceholder: 'Entrez le pays, ex: France, États-Unis, Allemagne...',
    popularDests: 'Destinations Populaires',
    
    weight: 'Poids estimé (KG)',
    volume: 'Volume estimé (CBM)',
    presetLabel: 'Préréglages de cargaison',
    presetSmall: 'Échantillon / Colis Express (<100kg)',
    presetMedium: 'Groupage (LCL) / Palettes (100-1500kg)',
    presetLarge: 'Conteneur Complet (FCL) (>1500kg)',
    
    back: 'Retour',
    next: 'Étape suivante',
    submitQuote: 'Obtenir mon devis gratuit',
    
    summaryTitle: 'Résumé de votre demande',
    summaryMode: 'Mode de transport',
    summaryRoute: 'Détails de l\'itinéraire',
    summaryCargo: 'Taille du cargo',
    
    phonePlaceholder: 'Téléphone / WhatsApp / WeChat (ou e-mail)',
    namePlaceholder: 'Votre nom / Entreprise (Requis)',
    emailPlaceholder: 'E-mail professionnel (ou téléphone)',
    notesPlaceholder: 'Optionnel : Nature de marchandise, emballage, urgence...',
    contactHint: 'Un e-mail ou un téléphone / WhatsApp suffit',
    contactRequired: 'Veuillez indiquer un e-mail ou un téléphone / WhatsApp',
    optionalDetails: 'Ajouter les détails du fret (facultatif)',
    
    seaDesc: 'Économique, idéal pour groupages et conteneurs pleins',
    airDesc: 'Vitesse maximale, idéal pour haute valeur ou urgences',
    landDesc: 'Transport routier direct, idéal pour l\'Asie Centrale & l\'Europe',
    wareDesc: 'Emballage caisse bois sur mesure, stockage & tri',
    
    mode: 'Mode de transport',
    industry: 'Secteur d\'activité / Catégorie',
    cargoDesc: 'Détails du cargo et exigences',
    submitting: 'Envoi en cours...',
    successHeading: 'Soumis avec succès !',
    successText: 'Votre demande a bien été reçue. Un spécialiste logistique principal vous répondra par e-mail sous 24 heures.',
    sendAnother: 'Envoyer une autre demande'
  },
  es: {
    step1Title: 'Elija el modo de transporte', step1Desc: 'Seleccione el canal; prepararemos la mejor ruta y tarifa',
    step2Title: 'Origen y destino', step2Desc: 'Tránsito y despacho aduanero desde nuestra sede de Guangzhou',
    step3Title: 'Peso y volumen estimados', step3Desc: 'Use los controles o elija una carga predefinida para calcular medidas',
    step4Title: 'Obtenga su cotización personalizada', step4Desc: 'Indique su nombre y un medio de contacto: correo o teléfono / WhatsApp',
    origin: 'Puerto / ciudad de origen', originPlaceholder: 'Escriba o seleccione el origen, p. ej., Guangzhou, Shenzhen...', popularOrigins: 'Orígenes frecuentes',
    destination: 'Puerto / país de destino', destinationPlaceholder: 'Escriba el país, p. ej., México, Brasil, España...', popularDests: 'Destinos frecuentes',
    weight: 'Peso estimado (KG)', volume: 'Volumen estimado (CBM)', presetLabel: 'Cargas predefinidas',
    presetSmall: 'Muestra / paquete exprés (<100 kg)', presetMedium: 'Carga LCL / paletizada (100-1500 kg)', presetLarge: 'Contenedor FCL / envío comercial (>1500 kg)',
    back: 'Atrás', next: 'Siguiente paso', submitQuote: 'Obtener cotización y ruta',
    summaryTitle: 'Resumen de su solicitud', summaryMode: 'Modo de transporte', summaryRoute: 'Detalles de la ruta', summaryCargo: 'Tamaño de la carga',
    phonePlaceholder: 'Teléfono / WhatsApp (o correo)', namePlaceholder: 'Nombre / empresa (obligatorio)', emailPlaceholder: 'Correo corporativo (o teléfono)', notesPlaceholder: 'Opcional: producto, baterías, embalaje u otros requisitos.',
    contactHint: 'Basta con indicar correo o teléfono / WhatsApp', contactRequired: 'Indique un correo o teléfono / WhatsApp', optionalDetails: 'Añadir detalles de la carga (opcional)',
    seaDesc: 'Económico para carga LCL y FCL', airDesc: 'Máxima velocidad para carga urgente y de alto valor', landDesc: 'Transporte terrestre directo para Asia Central y Rusia', wareDesc: 'Embalaje de madera, almacenamiento y cross-docking',
    mode: 'Modo de transporte', industry: 'Industria / categoría de producto', cargoDesc: 'Detalles y requisitos de la carga', submitting: 'Enviando solicitud...', successHeading: '¡Solicitud enviada!', successText: 'Hemos recibido su solicitud. Un especialista responderá a su correo corporativo en 24 horas.', sendAnother: 'Enviar otra solicitud'
  },
  ar: {
    step1Title: 'اختر وسيلة النقل', step1Desc: 'اختر قناة النقل وسنقدم أفضل مسار وتسعير',
    step2Title: 'المنشأ والوجهة', step2Desc: 'عبور وتخليص جمركي من مقرنا في قوانغتشو',
    step3Title: 'الوزن والحجم التقديريان', step3Desc: 'استخدم أشرطة التمرير أو اختر حمولة مسبقة لتقدير القياسات',
    step4Title: 'احصل على عرض سعر مخصص', step4Desc: 'أدخل الاسم ووسيلة تواصل واحدة: البريد أو الهاتف / واتساب',
    origin: 'ميناء / مدينة المنشأ', originPlaceholder: 'أدخل أو اختر المنشأ، مثل قوانغتشو أو شنتشن...', popularOrigins: 'منافذ منشأ شائعة',
    destination: 'ميناء / دولة الوجهة', destinationPlaceholder: 'أدخل الدولة، مثل السعودية أو الإمارات أو المكسيك...', popularDests: 'وجهات شائعة',
    weight: 'الوزن التقديري (كجم)', volume: 'الحجم التقديري (CBM)', presetLabel: 'حمولات سريعة الإعداد',
    presetSmall: 'عينة / طرد سريع (أقل من 100 كجم)', presetMedium: 'شحنة مجمعة LCL / منصات (100-1500 كجم)', presetLarge: 'حاوية كاملة FCL / شحنة تجارية (أكثر من 1500 كجم)',
    back: 'رجوع', next: 'الخطوة التالية', submitQuote: 'احصل على عرض سعر ومسار',
    summaryTitle: 'ملخص طلبكم', summaryMode: 'وسيلة النقل', summaryRoute: 'تفاصيل المسار', summaryCargo: 'حجم الشحنة',
    phonePlaceholder: 'الهاتف / واتساب (أو البريد)', namePlaceholder: 'الاسم / الشركة (مطلوب)', emailPlaceholder: 'البريد الإلكتروني للشركة (أو الهاتف)', notesPlaceholder: 'اختياري: نوع المنتج أو البطاريات أو التغليف أو المتطلبات الخاصة.',
    contactHint: 'يكفي إدخال البريد أو الهاتف / واتساب', contactRequired: 'يرجى إدخال البريد أو الهاتف / واتساب', optionalDetails: 'إضافة تفاصيل الشحنة (اختياري)',
    seaDesc: 'اقتصادي للشحنات المجمعة والحاويات الكاملة', airDesc: 'أسرع خيار للبضائع العاجلة وعالية القيمة', landDesc: 'نقل بري مباشر لآسيا الوسطى وروسيا', wareDesc: 'تغليف خشبي وتخزين وتجميع وشحن متقاطع',
    mode: 'وسيلة النقل', industry: 'القطاع / فئة المنتج', cargoDesc: 'تفاصيل ومتطلبات الشحنة', submitting: 'جارٍ إرسال الطلب...', successHeading: 'تم إرسال الطلب بنجاح!', successText: 'تم استلام طلبكم. سيرد عليكم أحد خبراء اللوجستيات عبر البريد خلال 24 ساعة.', sendAnother: 'إرسال طلب آخر'
  },
  pt: {
    step1Title: 'Escolha o modo de transporte', step1Desc: 'Selecione o canal; prepararemos a rota e o preço adequados',
    step2Title: 'Origem e destino', step2Desc: 'Informe origem e destino para avaliarmos transporte e desembaraço',
    step3Title: 'Peso e volume estimados', step3Desc: 'Use os controles ou escolha uma carga predefinida',
    step4Title: 'Receba sua cotação personalizada', step4Desc: 'Informe seu nome e um contato por e-mail ou telefone / WhatsApp',
    origin: 'Porto / cidade de origem', originPlaceholder: 'Digite ou selecione a origem, por exemplo Guangzhou ou Shenzhen...', popularOrigins: 'Origens frequentes',
    destination: 'Porto / país de destino', destinationPlaceholder: 'Digite o país de destino...', popularDests: 'Destinos frequentes',
    weight: 'Peso estimado (KG)', volume: 'Volume estimado (CBM)', presetLabel: 'Cargas predefinidas',
    presetSmall: 'Amostra / pacote expresso (<100 kg)', presetMedium: 'Carga LCL / paletizada (100–1500 kg)', presetLarge: 'Contêiner FCL / carga comercial (>1500 kg)',
    back: 'Voltar', next: 'Próxima etapa', submitQuote: 'Receber cotação e rota',
    summaryTitle: 'Resumo da solicitação', summaryMode: 'Modo de transporte', summaryRoute: 'Detalhes da rota', summaryCargo: 'Dimensão da carga',
    phonePlaceholder: 'Telefone / WhatsApp (alternativa ao e-mail)', namePlaceholder: 'Nome / empresa (obrigatório)', emailPlaceholder: 'E-mail corporativo (alternativa ao telefone)', notesPlaceholder: 'Opcional: produto, bateria, embalagem e outros requisitos.',
    contactHint: 'Informe e-mail ou telefone / WhatsApp', contactRequired: 'Informe e-mail ou telefone / WhatsApp', optionalDetails: 'Adicionar detalhes da carga (opcional)',
    seaDesc: 'Econômico para cargas LCL e FCL', airDesc: 'Máxima velocidade para cargas urgentes e de alto valor', landDesc: 'Transporte rodoviário direto para Ásia Central e Rússia', wareDesc: 'Caixaria, armazenagem, consolidação e cross-docking',
    mode: 'Modo de transporte', industry: 'Setor / categoria de produto', cargoDesc: 'Detalhes e requisitos da carga', submitting: 'Enviando solicitação...', successHeading: 'Solicitação enviada!', successText: 'Recebemos sua solicitação. Nossa equipe confirmará rota, carga e serviço usando o contato informado.', sendAnother: 'Enviar outra solicitação'
  },
  tr: {
    step1Title: 'Taşıma şeklini seçin', step1Desc: 'Taşıma kanalını seçin; uygun rota ve fiyatı hazırlayalım',
    step2Title: 'Çıkış ve varış', step2Desc: 'Taşıma ve gümrük planını değerlendirmek için çıkış ve varışı girin',
    step3Title: 'Tahmini ağırlık ve hacim', step3Desc: 'Kaydırıcıları kullanın veya hızlı yük seçeneği belirleyin',
    step4Title: 'Kişiselleştirilmiş teklif alın', step4Desc: 'Adınızı ve e-posta ya da telefon / WhatsApp iletişimini girin',
    origin: 'Çıkış limanı / şehir', originPlaceholder: 'Guangzhou veya Shenzhen gibi bir çıkış noktası girin...', popularOrigins: 'Sık kullanılan çıkışlar',
    destination: 'Varış limanı / ülke', destinationPlaceholder: 'Varış ülkesini girin...', popularDests: 'Sık kullanılan varışlar',
    weight: 'Tahmini ağırlık (KG)', volume: 'Tahmini hacim (CBM)', presetLabel: 'Hızlı yük seçenekleri',
    presetSmall: 'Numune / ekspres paket (<100 kg)', presetMedium: 'LCL / paletli yük (100–1500 kg)', presetLarge: 'FCL / ticari sevkiyat (>1500 kg)',
    back: 'Geri', next: 'Sonraki adım', submitQuote: 'Teklif ve rota al',
    summaryTitle: 'Talep özeti', summaryMode: 'Taşıma şekli', summaryRoute: 'Rota bilgileri', summaryCargo: 'Yük boyutu',
    phonePlaceholder: 'Telefon / WhatsApp (e-posta alternatifi)', namePlaceholder: 'Ad / şirket (zorunlu)', emailPlaceholder: 'Kurumsal e-posta (telefon alternatifi)', notesPlaceholder: 'İsteğe bağlı: ürün, batarya, paketleme ve diğer gereksinimler.',
    contactHint: 'E-posta veya telefon / WhatsApp girin', contactRequired: 'E-posta veya telefon / WhatsApp girmeniz gerekir', optionalDetails: 'Yük bilgisi ekle (isteğe bağlı)',
    seaDesc: 'LCL ve FCL yükler için ekonomik', airDesc: 'Acil ve yüksek değerli yükler için en hızlı seçenek', landDesc: 'Orta Asya ve Rusya için doğrudan karayolu', wareDesc: 'Sandıklama, depolama, konsolidasyon ve cross-docking',
    mode: 'Taşıma şekli', industry: 'Sektör / ürün kategorisi', cargoDesc: 'Yük ayrıntıları ve gereksinimler', submitting: 'Talep gönderiliyor...', successHeading: 'Talep gönderildi!', successText: 'Talebinizi aldık. Ekibimiz verdiğiniz iletişim üzerinden rota, yük ve hizmet gereksinimlerini doğrulayacaktır.', sendAnother: 'Yeni talep gönder'
  }
};

const popularDestinationOptions = [
  { code: 'US', nameZh: '美国', nameEn: 'USA', flag: '🇺🇸' },
  { code: 'RU', nameZh: '俄罗斯', nameEn: 'Russia', flag: '🇷🇺' },
  { code: 'DE', nameZh: '德国', nameEn: 'Germany', flag: '🇩🇪' },
  { code: 'FR', nameZh: '法国', nameEn: 'France', flag: '🇫🇷' },
  { code: 'UZ', nameZh: '乌兹别克斯坦', nameEn: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'KZ', nameZh: '哈萨克斯坦', nameEn: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'SA', nameZh: '沙特阿拉伯', nameEn: 'Saudi Arabia', flag: '🇸🇦' }
];

const popularOriginOptions = [
  { code: 'GZ', nameZh: '广州', nameEn: 'Guangzhou', flag: '🇨🇳' },
  { code: 'SZ', nameZh: '深圳', nameEn: 'Shenzhen', flag: '🇨🇳' },
  { code: 'NB', nameZh: '宁波', nameEn: 'Ningbo', flag: '🇨🇳' },
  { code: 'SH', nameZh: '上海', nameEn: 'Shanghai', flag: '🇨🇳' },
  { code: 'QD', nameZh: '青岛', nameEn: 'Qingdao', flag: '🇨🇳' },
  { code: 'YW', nameZh: '义乌', nameEn: 'Yiwu', flag: '🇨🇳' }
];

interface GetAQuoteProps {
  presetDestination?: string;
  presetService?: 'Sea' | 'Land' | 'Air' | 'Warehouse';
}

export default function GetAQuote({ presetDestination, presetService }: GetAQuoteProps = {}) {
  const [state, handleSubmit] = useForm("mdabvqbd");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { language, t } = useLanguage();
  const location = useLocation();
  const isQuotePage = location.pathname.includes('get-a-quote');
  const attributionParams = new URLSearchParams(location.search);
  const attribution = readAttribution(location.search);
  const leadGoal = attributionParams.get('leadGoal') || 'Freight Export';
  const attributedCategory = attributionParams.get('industry') || '';
  const attributedSubcategory = attributionParams.get('subcategory') || '';
  const leadSource = attributionParams.get('source') || attribution.source || attribution.utm_source || (isQuotePage ? 'quote_page' : 'embedded_quote_form');
  const sourceArticle = attributionParams.get('article') || attribution.article || '';
  const utmSource = attribution.utm_source || '';
  const utmMedium = attribution.utm_medium || '';
  const utmCampaign = attribution.utm_campaign || '';
  const utmContent = attribution.utm_content || '';
  
  // Funnel Step State: 1 to 4
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const lifecycleRef = useRef({ started: false, submitted: false, lastStep: 1, service: 'Sea' });
  const successTrackedRef = useRef(false);
  const formErrorTrackedRef = useRef<unknown>(null);
  
  // Core Funnel Data
  const [selectedService, setSelectedService] = useState<'Sea' | 'Land' | 'Air' | 'Warehouse'>('Sea');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isParamFilled, setIsParamFilled] = useState(false);

  // Sync props to state if provided
  useEffect(() => {
    if (presetDestination) {
      setDestination(presetDestination);
      setIsParamFilled(true);
    }
  }, [presetDestination]);

  useEffect(() => {
    if (presetService) {
      setSelectedService(presetService);
    }
  }, [presetService]);
  
  // Auto-set localized default origin on mount or language change if not already custom filled
  useEffect(() => {
    if (!origin) {
      setOrigin(language === 'zh' ? '广州' : 'Guangzhou');
    }
  }, [language]);

  // Scan URL parameters for auto-fill on initial render
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const destParam = params.get('dest') || params.get('country');
    if (destParam) {
      if (destParam === 'Saudi-Arabia' || destParam === 'Saudi_Arabia' || destParam === 'saudi-arabia' || destParam === 'Middle-East') {
        const saudiText = language === 'zh' ? '沙特阿拉伯' : 'Saudi Arabia';
        setDestination(saudiText);
        setIsParamFilled(true);
      } else if (destParam === 'UAE' || destParam === 'uae') {
        const uaeText = language === 'zh' ? '阿联酋' : 'United Arab Emirates';
        setDestination(uaeText);
        setIsParamFilled(true);
      } else if (destParam === 'Kuwait' || destParam === 'kuwait') {
        const kuwaitText = language === 'zh' ? '科威特' : 'Kuwait';
        setDestination(kuwaitText);
        setIsParamFilled(true);
      } else if (destParam === 'kazakhstan' || destParam === 'Kazakhstan') {
        const kzText = language === 'zh' ? '哈萨克斯坦' : 'Kazakhstan';
        setDestination(kzText);
        setIsParamFilled(true);
      } else if (destParam === 'uzbekistan' || destParam === 'Uzbekistan') {
        const uzText = language === 'zh' ? '乌兹别克斯坦' : 'Uzbekistan';
        setDestination(uzText);
        setIsParamFilled(true);
      } else if (destParam === 'nigeria' || destParam === 'Nigeria') {
        const ngText = language === 'zh' ? '尼日利亚' : 'Nigeria';
        setDestination(ngText);
        setIsParamFilled(true);
      } else if (destParam === 'ghana' || destParam === 'Ghana') {
        const ghText = language === 'zh' ? '加纳' : 'Ghana';
        setDestination(ghText);
        setIsParamFilled(true);
      } else if (destParam === 'mexico' || destParam === 'Mexico') {
        const mxText = language === 'zh' ? '墨西哥' : 'Mexico';
        setDestination(mxText);
        setIsParamFilled(true);
      } else if (destParam === 'brazil' || destParam === 'Brazil') {
        const brText = language === 'zh' ? '巴西' : 'Brazil';
        setDestination(brText);
        setIsParamFilled(true);
      } else if (destParam === 'argentina' || destParam === 'Argentina') {
        const arText = language === 'zh' ? '阿根廷' : 'Argentina';
        setDestination(arText);
        setIsParamFilled(true);
      }
    }
  }, [language]);
  const [weight, setWeight] = useState(350);
  const [volume, setVolume] = useState(2.5);
  const [presetActive, setPresetActive] = useState<'small' | 'medium' | 'large' | null>('medium');
  
  // Step 4 Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [product, setProduct] = useState('Other');
  const [notes, setNotes] = useState('');
  const [contactError, setContactError] = useState(false);

  useEffect(() => {
    if (attributedCategory) {
      setProduct(attributedCategory);
    }
  }, [attributedCategory]);

  // Get localized strings for funnel
  const ft = (key: string): string => {
    const lang = funnelTranslations[language] ? language : 'en';
    return funnelTranslations[lang]?.[key] || funnelTranslations['en']?.[key] || key;
  };
  const headlineCopy: Record<string, { before: string; accent: string; after: string }> = {
    en: { before: 'Request a', accent: 'China Export', after: 'Estimate' },
    zh: { before: '获取', accent: '中国出口物流', after: '初步方案' },
    ru: { before: 'Расчет', accent: 'логистики', after: 'из Китая' },
    fr: { before: 'Estimation', accent: 'logistique', after: 'depuis la Chine' },
    es: { before: 'Solicite una', accent: 'estimación de exportación', after: 'desde China' },
    ar: { before: 'اطلب', accent: 'تقديراً للتصدير', after: 'من الصين' },
    pt: { before: 'Solicite uma', accent: 'estimativa de exportação', after: 'a partir da China' },
    tr: { before: 'Çin ihracatı için', accent: 'ön maliyet', after: 'hesabı alın' },
  };
  const quoteHeadline = headlineCopy[language] || headlineCopy.en;
  const destinationPrefillCopy: Record<string, string> = {
    en: 'Destination automatically selected and highlighted based on your route',
    zh: '根据您浏览的航线已为您自动预选和高亮目的地',
    ru: 'Пункт назначения автоматически выбран и выделен на основе вашего маршрута',
    fr: 'Destination présélectionnée et mise en évidence en fonction de votre itinéraire',
    es: 'Destino preseleccionado y destacado según la ruta consultada',
    ar: 'تم اختيار الوجهة وإبرازها تلقائياً بناءً على المسار الذي شاهدته',
    pt: 'Destino pré-selecionado e destacado conforme a rota consultada',
    tr: 'Görüntülediğiniz rotaya göre varış noktası otomatik seçildi ve vurgulandı',
  };

  const markQuoteStarted = (service = selectedService) => {
    if (lifecycleRef.current.started) return;
    lifecycleRef.current.started = true;
    lifecycleRef.current.service = service;
    trackEvent('quote_form_start', {
      form_location: isQuotePage ? 'quote_page' : 'embedded_quote_form',
      service,
      lead_goal: leadGoal,
      product_category: product,
      lead_source: leadSource,
      utm_source: utmSource,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
    });
  };

  const handleQuoteSubmit = (event: FormEvent<HTMLFormElement>) => {
    markQuoteStarted();
    if (!email.trim() && !phone.trim()) {
      event.preventDefault();
      setContactError(true);
      trackEvent('quote_form_error', {
        form_location: isQuotePage ? 'quote_page' : 'embedded_quote_form',
        service: selectedService,
        error_type: 'contact_missing',
      });
      return;
    }

    setContactError(false);
    trackEvent('quote_form_submit_attempt', {
      form_location: isQuotePage ? 'quote_page' : 'embedded_quote_form',
      service: selectedService,
      lead_goal: leadGoal,
      product_category: product,
      lead_source: leadSource,
    });
    handleSubmit(event);
  };

  useEffect(() => {
    lifecycleRef.current.lastStep = step;
    lifecycleRef.current.service = selectedService;
  }, [step, selectedService]);

  useEffect(() => () => {
    const lifecycle = lifecycleRef.current;
    if (lifecycle.started && !lifecycle.submitted) {
      trackEvent('quote_form_abandon', {
        form_location: isQuotePage ? 'quote_page' : 'embedded_quote_form',
        service: lifecycle.service,
        last_step: lifecycle.lastStep,
      });
    }
  }, []);

  // Tracking and local success state
  useEffect(() => {
    if (state.succeeded && !successTrackedRef.current) {
      successTrackedRef.current = true;
      lifecycleRef.current.submitted = true;
      trackEvent('quote_form_submit', {
        event_category: 'conversion',
        form_location: isQuotePage ? 'quote_page' : 'embedded_quote_form',
        service: selectedService,
        lead_goal: leadGoal,
        product_category: product,
        lead_source: leadSource,
        utm_source: utmSource,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
      });
      trackEvent('rfq_submit_success', {
        event_category: 'conversion',
        form_location: isQuotePage ? 'quote_page' : 'embedded_quote_form',
        service: selectedService,
        lead_goal: leadGoal,
        product_category: product,
        lead_source: leadSource,
        utm_source: utmSource,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
      });
      setIsSubmitted(true);
    }
  }, [state.succeeded, selectedService, isQuotePage, leadGoal, product, leadSource, utmSource, utmCampaign, utmContent]);

  useEffect(() => {
    if (!state.errors || formErrorTrackedRef.current === state.errors) return;
    formErrorTrackedRef.current = state.errors;
    trackEvent('quote_form_error', {
      form_location: isQuotePage ? 'quote_page' : 'embedded_quote_form',
      service: selectedService,
      error_type: 'formspree_submission_error',
    });
  }, [state.errors, isQuotePage, selectedService]);

  // Navigate forward with sliding transition
  const nextStep = () => {
    if (step < 4) {
      markQuoteStarted();
      setDirection(1);
      setStep(step + 1);
    }
  };

  // Navigate backward
  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  // Set preset cargo dimensions
  const handlePresetSelect = (preset: 'small' | 'medium' | 'large') => {
    setPresetActive(preset);
    if (preset === 'small') {
      setWeight(45);
      setVolume(0.3);
    } else if (preset === 'medium') {
      setWeight(480);
      setVolume(3.2);
    } else if (preset === 'large') {
      setWeight(12500);
      setVolume(68);
    }
  };

  const handleServiceSelect = (service: 'Sea' | 'Land' | 'Air' | 'Warehouse') => {
    markQuoteStarted(service);
    setSelectedService(service);
    // Tactile delay before auto-advancing to step 2 for unmatched friction-free UX!
    setTimeout(() => {
      setDirection(1);
      setStep(2);
    }, 450);
  };

  const handleCountrySelect = (countryName: string) => {
    setDestination(countryName);
    setIsParamFilled(false);
  };

  const resetFunnel = () => {
    setStep(1);
    setDestination('');
    setOrigin('');
    setWeight(350);
    setVolume(2.5);
    setPresetActive('medium');
    setName('');
    setEmail('');
    setPhone('');
    setProduct(attributedCategory || 'Other');
    setNotes('');
    setIsSubmitted(false);
    successTrackedRef.current = false;
    formErrorTrackedRef.current = null;
    lifecycleRef.current = { started: false, submitted: false, lastStep: 1, service: 'Sea' };
  };

  // Framer-motion transition configurations for steps
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }
    })
  };

  return (
    <section id="get-a-quote" className="scroll-mt-24 py-16 md:py-28 bg-[#fafafc] font-sans relative overflow-hidden">
      {/* Background ambient mesh gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-sky-100 text-sky-800 font-extrabold tracking-wider text-xs uppercase px-4 py-2 rounded-full mb-4 border border-sky-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--hb-amber)]" />
            {t('get_a_quote.estimatorTitle')}
          </motion.div>
          {isQuotePage ? (
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight text-center mb-4 leading-[1.15]"
            >
              {quoteHeadline.before} <span className="bg-gradient-to-r from-[#0b4f8a] to-[#d97706] bg-clip-text text-transparent">{quoteHeadline.accent}</span> {quoteHeadline.after}
            </motion.h1>
          ) : (
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight text-center mb-4 leading-[1.15]"
            >
              {quoteHeadline.before} <span className="bg-gradient-to-r from-[#0b4f8a] to-[#d97706] bg-clip-text text-transparent">{quoteHeadline.accent}</span> {quoteHeadline.after}
            </motion.h2>
          )}
          <div className="h-1 w-12 bg-[#d97706] mx-auto rounded-full mb-6" />
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
            {ft('step1Desc')}
          </p>
          <div className="flex items-center justify-center gap-2 text-[var(--hb-amber)] font-bold text-xs bg-amber-50/70 w-fit mx-auto px-4 py-2 rounded-full border border-amber-100/60 shadow-sm">
            <Info className="w-3.5 h-3.5 shrink-0" />
            {t('hero.alibaba_cta')}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Funnel Box */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col hover:shadow-2xl transition-all duration-300 relative overflow-hidden min-h-[580px] lg:min-h-[550px]">
            {/* Visual top accent gradient strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0b1f3a] via-[#0b4f8a] to-[#d97706]" />
            
            {!isSubmitted ? (
              <>
                {/* Visual Step Progress indicator */}
                <div className="px-5 pt-8 pb-4 sm:px-10 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-400 tracking-wider uppercase">
                      Inquiry Funnel
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="text-xs font-extrabold text-[#0b4f8a]">
                      Step {step} of 4
                    </span>
                  </div>
                  
                  {/* Step dots with line connector */}
                  <div className="flex items-center justify-center gap-1 sm:gap-3 w-full sm:w-auto">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center">
                        <button
                          type="button"
                          disabled={item > step}
                          onClick={() => {
                            setDirection(item > step ? 1 : -1);
                            setStep(item);
                          }}
                          aria-label={`Step ${item} of 4`}
                          aria-current={step === item ? 'step' : undefined}
                          className={`w-10 h-10 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-black transition-all disabled:cursor-not-allowed ${
                            step === item
                              ? 'bg-[#0b4f8a] text-white shadow-md shadow-sky-500/20 scale-110 ring-4 ring-sky-100'
                              : step > item
                              ? 'bg-[var(--hb-amber)] text-white'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {step > item ? <Check className="w-3.5 h-3.5 stroke-[3.5]" /> : item}
                        </button>
                        {item < 4 && (
                          <div className={`w-5 sm:w-10 h-1 mx-1 sm:mx-1.5 rounded-full transition-all duration-300 ${
                            step > item ? 'bg-[var(--hb-amber)]' : 'bg-slate-100'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main animated multi-step container */}
                <div className="p-6 sm:p-10 flex-1 flex flex-col justify-between overflow-hidden">
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="flex-1 flex flex-col"
                    >
                      {/* STEP 1: Select Shipping Mode */}
                      {step === 1 && (
                        <div className="flex-1 flex flex-col">
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-50 text-[#0b4f8a]">1</span>
                            {ft('step1Title')}
                          </h3>
                          <p className="text-sm text-slate-500 mb-8 font-medium">
                            {ft('step1Desc')}
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { 
                                id: 'Sea', 
                                label: t('get_a_quote.modeSea') || 'Sea Freight', 
                                desc: ft('seaDesc'), 
                                icon: <Ship className="w-6 h-6" />
                              },
                              { 
                                id: 'Air', 
                                label: t('get_a_quote.modeAir') || 'Air Freight', 
                                desc: ft('airDesc'), 
                                icon: <Plane className="w-6 h-6" />
                              },
                              { 
                                id: 'Land', 
                                label: t('get_a_quote.modeLand') || 'Land Freight', 
                                desc: ft('landDesc'), 
                                icon: <Truck className="w-6 h-6" />
                              },
                              { 
                                id: 'Warehouse', 
                                label: t('nav.services_warehouse') || 'Warehouse & Fulfillment', 
                                desc: ft('wareDesc'), 
                                icon: <Package className="w-6 h-6" />
                              }
                            ].map((item) => {
                              const isActive = selectedService === item.id;
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => handleServiceSelect(item.id as any)}
                                  className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 flex items-start gap-4 cursor-pointer relative overflow-hidden group ${
                                    isActive 
                                      ? 'border-[var(--hb-blue)] bg-sky-50/70 text-[var(--hb-blue)] ring-2 ring-offset-2 ring-sky-200 font-bold scale-[1.01] shadow-lg'
                                      : 'border-slate-200 bg-slate-50/40 text-slate-700 hover:border-[var(--hb-blue)]/45 hover:bg-sky-50/40 hover:scale-[1.01]'
                                  }`}
                                >
                                  <div className={`p-3 rounded-xl transition-all duration-300 ${
                                    isActive ? 'bg-white shadow-sm' : 'bg-white border border-slate-100'
                                  }`}>
                                    {item.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-extrabold text-slate-900 group-hover:text-[#0b4f8a] transition-colors flex items-center justify-between">
                                      <span>{item.label}</span>
                                      {isActive && (
                                        <motion.span 
                                          layoutId="activeTick" 
                                          className="w-5 h-5 rounded-full bg-[#0b4f8a] text-white flex items-center justify-center"
                                        >
                                          <Check className="w-3 h-3 stroke-[3]" />
                                        </motion.span>
                                      )}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                                      {item.desc}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* STEP 2: Route Selection */}
                      {step === 2 && (
                        <div className="flex-1 flex flex-col">
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-50 text-[#0b4f8a]">2</span>
                            {ft('step2Title')}
                          </h3>
                          <p className="text-sm text-slate-500 mb-6 font-medium">
                            {ft('step2Desc')}
                          </p>

                          <div className="space-y-5">
                            {/* Origin (Selectable and Custom Typeable) */}
                            <div>
                              <label htmlFor="funnel-origin" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                {ft('origin')} *
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                                  <MapPin className="w-5 h-5 text-slate-400" />
                                </span>
                                <input
                                  id="funnel-origin"
                                  type="text"
                                  value={origin}
                                  onChange={(e) => setOrigin(e.target.value)}
                                  required
                                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0b4f8a] focus:ring-2 focus:ring-sky-100 outline-none transition-all placeholder-slate-400 font-bold text-base"
                                  placeholder={ft('originPlaceholder')}
                                />
                              </div>
                            </div>

                            {/* Popular Origin Tags */}
                            <div>
                              <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                {ft('popularOrigins')}
                              </span>
                              <div className="flex flex-wrap gap-2.5">
                                {popularOriginOptions.map((o) => {
                                  const oName = language === 'zh' ? o.nameZh : o.nameEn;
                                  const isSelected = origin === oName;
                                  return (
                                    <button
                                      key={o.code}
                                      type="button"
                                      onClick={() => setOrigin(oName)}
                                      className={`px-4 py-2 min-h-11 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                        isSelected
                                          ? 'border-[#0b4f8a] bg-sky-50 text-[#0b4f8a] ring-2 ring-sky-100'
                                          : 'border-slate-200 bg-white hover:border-[#0b4f8a] text-slate-700 hover:bg-slate-50'
                                      }`}
                                    >
                                      <span className="text-sm">{o.flag}</span>
                                      <span>{oName}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Destination */}
                            <div>
                              <label htmlFor="funnel-destination" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                {ft('destination')} *
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                                  <Globe className="w-5 h-5" />
                                </span>
                                <input
                                  id="funnel-destination"
                                  type="text"
                                  value={destination}
                                  onChange={(e) => {
                                    setDestination(e.target.value);
                                    setIsParamFilled(false);
                                  }}
                                  required
                                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border outline-none transition-all placeholder-slate-400 font-bold text-sm ${
                                    isParamFilled
                                      ? 'border-[var(--hb-amber)] ring-2 ring-[var(--hb-amber)]/25 bg-amber-50/10 shadow-sm'
                                      : 'border-slate-200 focus:border-[#0b4f8a] focus:ring-2 focus:ring-sky-100 bg-white'
                                  }`}
                                  placeholder={ft('destinationPlaceholder')}
                                />
                                {isParamFilled && (
                                  <p className="text-[11px] font-bold text-[var(--hb-amber)] mt-1.5 flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>
                                      {destinationPrefillCopy[language] || destinationPrefillCopy.en}
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Popular Country Tags */}
                            <div>
                              <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                {ft('popularDests')}
                              </span>
                              <div className="flex flex-wrap gap-2.5">
                                {popularDestinationOptions.map((c) => {
                                  const cName = language === 'zh' ? c.nameZh : c.nameEn;
                                  const isSelected = destination === cName;
                                  return (
                                    <button
                                      key={c.code}
                                      type="button"
                                      onClick={() => handleCountrySelect(cName)}
                                      className={`px-4 py-2 min-h-11 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                        isSelected
                                          ? 'border-[#0b4f8a] bg-sky-50 text-[#0b4f8a] ring-2 ring-sky-100'
                                          : 'border-slate-200 bg-white hover:border-[#0b4f8a] text-slate-700 hover:bg-slate-50'
                                      }`}
                                    >
                                      <span className="text-sm">{c.flag}</span>
                                      <span>{cName}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STEP 3: Weight and Volume Sliders */}
                      {step === 3 && (
                        <div className="flex-1 flex flex-col">
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-50 text-[#0b4f8a]">3</span>
                            {ft('step3Title')}
                          </h3>
                          <p className="text-sm text-slate-500 mb-6 font-medium">
                            {ft('step3Desc')}
                          </p>

                          {/* Quick Presets */}
                          <div className="mb-6">
                            <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                              {ft('presetLabel')}
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {[
                                { id: 'small', label: ft('presetSmall'), icon: Package },
                                { id: 'medium', label: ft('presetMedium'), icon: Boxes },
                                { id: 'large', label: ft('presetLarge'), icon: Truck }
                              ].map((preset) => {
                                const isActive = presetActive === preset.id;
                                const PresetIcon = preset.icon;
                                return (
                                  <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => handlePresetSelect(preset.id as any)}
                                    className={`py-3 px-4 rounded-xl border text-left transition-all duration-300 flex items-center gap-2.5 ${
                                      isActive
                                        ? 'border-[var(--hb-amber)] bg-amber-50/50 text-[var(--hb-amber)] font-bold ring-2 ring-amber-100'
                                        : 'border-slate-200 bg-white hover:border-[var(--hb-amber)]/50 text-slate-700 hover:bg-slate-50'
                                    }`}
                                  >
                                    <PresetIcon className="w-5 h-5 text-[#0b4f8a]" aria-hidden="true" />
                                    <span className="text-xs font-bold leading-tight">{preset.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Interactive Sliders */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-100">
                            {/* Weight Slider */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <Scale className="w-3.5 h-3.5 text-[#0b4f8a]" />
                                  {ft('weight')}
                                </span>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => {
                                      setWeight(Math.max(0, parseInt(e.target.value) || 0));
                                      setPresetActive(null);
                                    }}
                                    className="w-20 text-right px-2 py-1 rounded border border-slate-200 text-base font-black text-slate-800 focus:border-[#0b4f8a] focus:ring-1 focus:ring-[#0b4f8a] outline-none"
                                  />
                                  <span className="text-xs font-bold text-slate-500">KG</span>
                                </div>
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="25000"
                                step={weight > 1000 ? 250 : weight > 100 ? 25 : 5}
                                value={weight}
                                onChange={(e) => {
                                  setWeight(parseInt(e.target.value));
                                  setPresetActive(null);
                                }}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0b4f8a]"
                              />
                              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                <span>10 KG</span>
                                <span>5,000 KG</span>
                                <span>15,000 KG</span>
                                <span>25,000+ KG</span>
                              </div>
                            </div>

                            {/* Volume Slider */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <Package className="w-3.5 h-3.5 text-[var(--hb-amber)]" />
                                  {ft('volume')}
                                </span>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    value={volume}
                                    step="0.1"
                                    onChange={(e) => {
                                      setVolume(Math.max(0, parseFloat(e.target.value) || 0));
                                      setPresetActive(null);
                                    }}
                                    className="w-20 text-right px-2 py-1 rounded border border-slate-200 text-base font-black text-slate-800 focus:border-[#0b4f8a] focus:ring-1 focus:ring-[#0b4f8a] outline-none"
                                  />
                                  <span className="text-xs font-bold text-slate-500">CBM</span>
                                </div>
                              </div>
                              <input
                                type="range"
                                min="0.1"
                                max="100"
                                step="0.1"
                                value={volume}
                                onChange={(e) => {
                                  setVolume(parseFloat(e.target.value));
                                  setPresetActive(null);
                                }}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--hb-amber)]"
                              />
                              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                <span>0.1 CBM</span>
                                <span>25 CBM</span>
                                <span>50 CBM</span>
                                <span>100+ CBM</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STEP 4: Personal Contact Form */}
                      {step === 4 && (
                        <div className="flex-1 flex flex-col">
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-50 text-[#0b4f8a]">4</span>
                            {ft('step4Title')}
                          </h3>
                          <p className="text-sm text-slate-500 mb-6 font-medium">
                            {ft('step4Desc')}
                          </p>

                          {/* Dynamic Configuration Summary Box */}
                          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                {ft('summaryTitle')}
                              </span>
                              <div className="flex flex-wrap items-center gap-2 text-slate-700 text-xs font-extrabold">
                                <span className="bg-white border border-sky-100 px-2.5 py-1 rounded-lg text-[#0b4f8a] flex items-center gap-1 shadow-sm">
                                  {selectedService === 'Sea' ? <Ship className="w-3.5 h-3.5" aria-hidden="true" /> : selectedService === 'Air' ? <Plane className="w-3.5 h-3.5" aria-hidden="true" /> : selectedService === 'Land' ? <Truck className="w-3.5 h-3.5" aria-hidden="true" /> : <Package className="w-3.5 h-3.5" aria-hidden="true" />} {selectedService}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                  <MapPin className="w-3.5 h-3.5 text-sky-700" aria-hidden="true" /> {origin || 'Guangzhou'}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                  <Globe className="w-3.5 h-3.5 text-sky-700" aria-hidden="true" /> {destination || 'Global Dest.'}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm text-amber-700">
                                  <Scale className="w-3.5 h-3.5" aria-hidden="true" /> {weight} KG / {volume} CBM
                                </span>
                              </div>
                            </div>
                            
                            {/* Fast route speed indicator tag */}
                            <div className="text-right text-[10px] text-slate-500 bg-white/80 border border-slate-100 rounded-xl px-3 py-1.5 self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end gap-1.5 shadow-sm">
                              <span className="font-extrabold text-[var(--hb-amber)] uppercase tracking-wide flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-[var(--hb-amber)]" /> Route review
                              </span>
                              <span className="font-bold text-slate-600">
                                Quote details confirmed by scope
                              </span>
                            </div>
                          </div>

                          <form id="quote-form" onSubmit={handleQuoteSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
                            {/* Hidden inputs to feed Formspree the multi-step details */}
                            <input type="hidden" name="Inquiry_Type" value="Interactive Funnel (Lead Rate Optimizer)" />
                            <input type="hidden" name="Selected_Service" value={selectedService} />
                            <input type="hidden" name="Origin" value={origin} />
                            <input type="hidden" name="Destination" value={destination} />
                            <input type="hidden" name="Estimated_Weight_KG" value={`${weight} KG`} />
                            <input type="hidden" name="Estimated_Volume_CBM" value={`${volume} CBM`} />
                            <input type="hidden" name="Lead_Goal" value={leadGoal} />
                            <input type="hidden" name="Product_Category" value={product} />
                            <input type="hidden" name="Product_Subcategory" value={attributedSubcategory} />
                            <input type="hidden" name="Lead_Source" value={leadSource} />
                            <input type="hidden" name="Source_Article_Slug" value={sourceArticle} />
                            <input type="hidden" name="UTM_Source" value={utmSource} />
                            <input type="hidden" name="UTM_Medium" value={utmMedium} />
                            <input type="hidden" name="UTM_Campaign" value={utmCampaign} />
                            <input type="hidden" name="UTM_Content" value={utmContent} />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Contact Name */}
                              <div>
                                <label htmlFor="quote-contact-name" className="sr-only">{ft('namePlaceholder')}</label>
                                <input
                                  id="quote-contact-name"
                                  type="text"
                                  name="name"
                                  required
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0b4f8a] focus:ring-2 focus:ring-sky-100 outline-none transition-all placeholder-slate-400 font-bold text-base"
                                  placeholder={ft('namePlaceholder')}
                                />
                                <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-xs mt-1" />
                              </div>

                              {/* Contact Email */}
                              <div>
                                <label htmlFor="quote-contact-email" className="sr-only">{ft('emailPlaceholder')}</label>
                                <input
                                  id="quote-contact-email"
                                  type="email"
                                  name="email"
                                  value={email}
                                  onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (e.target.value.trim()) setContactError(false);
                                  }}
                                  aria-describedby="quote-contact-guidance"
                                  aria-invalid={contactError}
                                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all placeholder-slate-400 font-bold text-base ${
                                    contactError
                                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                      : 'border-slate-200 focus:border-[#0b4f8a] focus:ring-sky-100'
                                  }`}
                                  placeholder={ft('emailPlaceholder')}
                                />
                                <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1" />
                              </div>

                              {/* Phone / WeChat / WhatsApp */}
                              <div>
                                <label htmlFor="quote-contact-phone" className="sr-only">{ft('phonePlaceholder')}</label>
                                <input
                                  id="quote-contact-phone"
                                  type="text"
                                  name="phone"
                                  value={phone}
                                  onChange={(e) => {
                                    setPhone(e.target.value);
                                    if (e.target.value.trim()) setContactError(false);
                                  }}
                                  aria-describedby="quote-contact-guidance"
                                  aria-invalid={contactError}
                                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all placeholder-slate-400 font-bold text-base ${
                                    contactError
                                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                      : 'border-slate-200 focus:border-[#0b4f8a] focus:ring-sky-100'
                                  }`}
                                  placeholder={ft('phonePlaceholder')}
                                />
                                <ValidationError prefix="Phone" field="phone" errors={state.errors} className="text-red-500 text-xs mt-1" />
                              </div>

                            </div>

                            <div id="quote-contact-guidance" className="-mt-1 text-xs font-semibold">
                              {contactError ? (
                                <p role="alert" className="text-red-600">{ft('contactRequired')}</p>
                              ) : (
                                <p className="text-slate-500">{ft('contactHint')}</p>
                              )}
                            </div>

                            <details className="group rounded-xl border border-slate-200 bg-slate-50/70 open:bg-white">
                              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-extrabold text-slate-700 flex items-center justify-between gap-3">
                                {ft('optionalDetails')}
                                <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-90" aria-hidden="true" />
                              </summary>
                              <div className="grid grid-cols-1 gap-4 border-t border-slate-200 p-4">
                                <div>
                                  <label htmlFor="quote-industry" className="sr-only">{t('get_a_quote.industry') || 'Industry category'}</label>
                                  <select
                                    id="quote-industry"
                                    name="industry"
                                    value={product}
                                    onChange={(e) => setProduct(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0b4f8a] focus:ring-2 focus:ring-sky-100 outline-none bg-white font-bold text-base transition-all"
                                  >
                                    <option value="Commercial Kitchen Equipment">Commercial Kitchen Equipment</option>
                                    <option value="Outdoor Products">Outdoor Products</option>
                                    <option value="Commercial Furniture">{t('get_a_quote.indFurn') || 'Commercial Furniture'}</option>
                                    <option value="New Energy / ESS">{t('get_a_quote.indNev') || 'New Energy / ESS'}</option>
                                    <option value="Project Cargo / Heavy Lift">{t('get_a_quote.indProject') || 'Project Cargo / Heavy Lift'}</option>
                                    <option value="Other">{t('get_a_quote.indOther') || 'Other / General'}</option>
                                  </select>
                                </div>

                                <div>
                                  <label htmlFor="quote-cargo-notes" className="sr-only">{ft('notesPlaceholder')}</label>
                                  <textarea
                                    id="quote-cargo-notes"
                                    name="message"
                                    rows={2}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0b4f8a] focus:ring-2 focus:ring-sky-100 outline-none resize-none transition-all placeholder-slate-400 font-bold text-base"
                                    placeholder={ft('notesPlaceholder')}
                                  />
                                </div>
                              </div>
                            </details>

                            {/* Live Submission Button */}
                            <div className="pt-2">
                              <button
                                type="submit"
                                disabled={state.submitting}
                                className={`w-full text-white font-extrabold py-4 rounded-xl transition-all flex items-center justify-center shadow-lg hover:-translate-y-0.5 cursor-pointer ${
                                  state.submitting 
                                    ? 'bg-slate-500 cursor-not-allowed' 
                                    : 'bg-[#d97706] hover:bg-[#b45309] hover:shadow-xl shadow-amber-500/10'
                                }`}
                              >
                                {state.submitting ? (
                                  <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                    {ft('submitting')}
                                  </>
                                ) : (
                                  <>
                                    {ft('submitQuote')} <ArrowRight className="w-5 h-5 ml-2" />
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Footer for Wizard (Steps 2, 3) */}
                  {step > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-5 py-2.5 min-h-11 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-2 font-bold text-xs cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" /> {ft('back')}
                      </button>
                      
                      {step < 4 && (
                        <button
                          type="button"
                          disabled={step === 2 && !destination}
                          onClick={nextStep}
                          className={`px-6 py-2.5 min-h-11 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            step === 2 && !destination
                              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                              : 'bg-[#0b4f8a] text-white hover:bg-[#082f55] shadow-sm hover:shadow-md'
                          }`}
                        >
                          {ft('next')} <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Submission Success View */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center bg-[#10283d] p-8 sm:p-12 text-white"
              >
                <div className="w-20 h-20 bg-[var(--hb-amber)] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-amber-900/20 ring-8 ring-white/10">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
                  {ft('successHeading')}
                </h3>
                
                <p className="text-slate-200 text-base md:text-lg max-w-lg leading-relaxed mb-8 font-medium">
                  {ft('successText')}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button 
                    onClick={resetFunnel}
                    className="text-[#0b4f8a] bg-white hover:bg-slate-50 px-8 py-3.5 rounded-xl text-sm font-black transition-all hover:scale-[1.02] shadow-md cursor-pointer"
                  >
                    {ft('sendAnother')}
                  </button>
                  <a 
                    href="mailto:partnership@ddnzglobal.com"
                    className="text-white bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3.5 rounded-xl text-sm font-black transition-all cursor-pointer"
                  >
                    partnership@ddnzglobal.com
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
