import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Info, 
  ArrowRight, 
  ArrowLeft, 
  Ship, 
  Plane, 
  Truck, 
  Package, 
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
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../lib/utils';

// Multi-language translation map for the interactive funnel
const funnelTranslations: Record<string, Record<string, string>> = {
  zh: {
    step1Title: '选择运输方式',
    step1Desc: '不同的运输方式决定了时效与成本，我们将为您定制最优路由',
    step2Title: '选择始发地与目的地',
    step2Desc: '自营广州总部辐射全球，自建多国海外双清渠道',
    step3Title: '预估货物重量与体积',
    step3Desc: '拖动滑块或一键选择常见货量预设，实时反馈规格测算',
    step4Title: '留下联系方式获取精确报价',
    step4Desc: '华正邦泰资深物流专家将在 24 小时内为您精算多套最优报价方案',
    
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
    
    phonePlaceholder: '您的电话 / 微信 / WhatsApp (必填)',
    namePlaceholder: '您的姓名 / 公司名称 (必填)',
    emailPlaceholder: '您的企业邮箱 (必填)',
    notesPlaceholder: '选填：提供品名、特殊包装、时效要求等，报价更精准...',
    
    seaDesc: '高性价比，适合大宗散货/整箱重载运输',
    airDesc: '极致时效，适合高附加值、紧急空运直飞',
    landDesc: '卡班直达，中亚五国与俄罗斯高性价比专线',
    wareDesc: '自营万级平米仓，专业木箱打包装箱、贴标分流',
    
    mode: '运输方式',
    industry: '所属行业 / 货物品类',
    cargoDesc: '货物详情描述',
    submitting: '正在提交询盘...',
    successHeading: '提交成功！',
    successText: '我们已收到您的估价申请。专职资深物流专家将在 24 小时内（通常更短）与您联系。',
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
    step4Desc: 'Our senior specialists will build your custom logistics plan within 24h',
    
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
    
    phonePlaceholder: 'Phone / WhatsApp / WeChat (Required)',
    namePlaceholder: 'Your Name / Company (Required)',
    emailPlaceholder: 'Corporate Email (Required)',
    notesPlaceholder: 'Optional: Product type, battery contents, packing needs, etc.',
    
    seaDesc: 'Cost-effective, best for bulk LCL & FCL logistics',
    airDesc: 'Max speed, perfect for high-value & urgent goods',
    landDesc: 'Direct road freight, ideal for Central Asia & Russia',
    wareDesc: 'Custom plywood crating, storage, and cross-docking',
    
    mode: 'Transport Mode',
    industry: 'Industry / Product Category',
    cargoDesc: 'Cargo Details & Requirements',
    submitting: 'Submitting Inquiry...',
    successHeading: 'Successfully Submitted!',
    successText: 'Your request has been received. A senior logistics specialist will reply to your corporate email within 24 hours.',
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
    step4Desc: 'Наши эксперты составят коммерческое предложение за 24 часа',
    
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
    
    phonePlaceholder: 'Телефон / WhatsApp / Telegram (Обязательно)',
    namePlaceholder: 'Ваше имя / Компания (Обязательно)',
    emailPlaceholder: 'Рабочий Email (Обязательно)',
    notesPlaceholder: 'Дополнительно: Характер груза, сроки, особые условия...',
    
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
    step4Desc: 'Nos experts concevront votre plan logistique sous 24h',
    
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
    
    phonePlaceholder: 'Téléphone / WhatsApp / WeChat (Requis)',
    namePlaceholder: 'Votre nom / Entreprise (Requis)',
    emailPlaceholder: 'E-mail professionnel (Requis)',
    notesPlaceholder: 'Optionnel : Nature de marchandise, emballage, urgence...',
    
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

export default function GetAQuote() {
  const [state, handleSubmit] = useForm("mdabvqbd");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { language, t } = useLanguage();
  
  // Funnel Step State: 1 to 4
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  
  // Core Funnel Data
  const [selectedService, setSelectedService] = useState<'Sea' | 'Land' | 'Air' | 'Warehouse'>('Sea');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  
  // Auto-set localized default origin on mount or language change if not already custom filled
  useEffect(() => {
    if (!origin) {
      setOrigin(language === 'zh' ? '广州' : 'Guangzhou');
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

  // Get localized strings for funnel
  const ft = (key: string): string => {
    const lang = funnelTranslations[language] ? language : 'en';
    return funnelTranslations[lang]?.[key] || funnelTranslations['en']?.[key] || key;
  };

  // Tracking and local success state
  useEffect(() => {
    if (state.succeeded) {
      trackEvent('rfq_submit_success', { 'event_category': 'conversion' });
      trackEvent('submit_quote_form', { 'method': 'Email', 'service': selectedService, 'dest': destination });
      setIsSubmitted(true);
    }
  }, [state.succeeded, selectedService, destination]);

  // Navigate forward with sliding transition
  const nextStep = () => {
    if (step < 4) {
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
    setSelectedService(service);
    // Tactile delay before auto-advancing to step 2 for unmatched friction-free UX!
    setTimeout(() => {
      setDirection(1);
      setStep(2);
    }, 450);
  };

  const handleCountrySelect = (countryName: string) => {
    setDestination(countryName);
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
    setProduct('Other');
    setNotes('');
    setIsSubmitted(false);
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
    <section id="get-a-quote" className="py-16 md:py-28 bg-[#fafafc] font-sans relative overflow-hidden">
      {/* Background ambient mesh gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#4B27B1]/10 text-[#4B27B1] font-extrabold tracking-wider text-xs uppercase px-4 py-2 rounded-full mb-4 border border-purple-200/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF8A00]" />
            {ft('estimatorTitle')}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight text-center mb-4 leading-[1.15]"
          >
            {language === 'zh' ? (
              <>
                极速定制 <span className="bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] bg-clip-text text-transparent">专属智能航线</span> 与询价方案
              </>
            ) : language === 'ru' ? (
              <>
                Умный расчет <span className="bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] bg-clip-text text-transparent">логистики</span> в 3 клика
              </>
            ) : language === 'fr' ? (
              <>
                Calculateur <span className="bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] bg-clip-text text-transparent">de Logistique</span> Intelligent
              </>
            ) : (
              <>
                Get Your <span className="bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] bg-clip-text text-transparent">Custom Logistics</span> Estimate
              </>
            )}
          </motion.h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-[#4B27B1] via-pink-500 to-[#FF8A00] mx-auto rounded-full mb-6" />
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
            {ft('step1Desc')}
          </p>
          <div className="flex items-center justify-center gap-2 text-[#FF8A00] font-bold text-xs bg-orange-50/70 w-fit mx-auto px-4 py-2 rounded-full border border-orange-100/50 shadow-sm">
            <Info className="w-3.5 h-3.5 shrink-0" />
            {t('hero.alibaba_cta')}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Funnel Box */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col hover:shadow-2xl transition-all duration-300 relative overflow-hidden min-h-[580px] lg:min-h-[550px]">
            {/* Visual top accent gradient strip */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#4B27B1] via-pink-500 to-[#FF8A00]" />
            
            {!isSubmitted ? (
              <>
                {/* Visual Step Progress indicator */}
                <div className="px-6 pt-8 pb-4 sm:px-10 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-400 tracking-wider uppercase">
                      Inquiry Funnel
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="text-xs font-extrabold text-[#4B27B1]">
                      Step {step} of 4
                    </span>
                  </div>
                  
                  {/* Step dots with line connector */}
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center">
                        <button
                          type="button"
                          disabled={item > step && !destination && item !== 4}
                          onClick={() => {
                            setDirection(item > step ? 1 : -1);
                            setStep(item);
                          }}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                            step === item
                              ? 'bg-[#4B27B1] text-white shadow-md shadow-purple-500/20 scale-110 ring-4 ring-purple-100'
                              : step > item
                              ? 'bg-[#FF8A00] text-white'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {step > item ? <Check className="w-3.5 h-3.5 stroke-[3.5]" /> : item}
                        </button>
                        {item < 4 && (
                          <div className={`w-6 sm:w-10 h-1 mx-1.5 rounded-full transition-all duration-300 ${
                            step > item ? 'bg-[#FF8A00]' : 'bg-slate-100'
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
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 text-[#4B27B1]">1</span>
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
                                icon: <Ship className="w-6 h-6" />,
                                color: 'hover:border-blue-500 hover:bg-blue-50/20 text-blue-600 bg-blue-50/40 border-blue-100',
                                activeColor: 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-blue-500/10'
                              },
                              { 
                                id: 'Air', 
                                label: t('get_a_quote.modeAir') || 'Air Freight', 
                                desc: ft('airDesc'), 
                                icon: <Plane className="w-6 h-6" />,
                                color: 'hover:border-indigo-500 hover:bg-indigo-50/20 text-indigo-600 bg-indigo-50/40 border-indigo-100',
                                activeColor: 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-indigo-500/10'
                              },
                              { 
                                id: 'Land', 
                                label: t('get_a_quote.modeLand') || 'Land Freight', 
                                desc: ft('landDesc'), 
                                icon: <Truck className="w-6 h-6" />,
                                color: 'hover:border-emerald-500 hover:bg-emerald-50/20 text-emerald-600 bg-emerald-50/40 border-emerald-100',
                                activeColor: 'border-emerald-600 bg-emerald-50/50 text-emerald-700 shadow-emerald-500/10'
                              },
                              { 
                                id: 'Warehouse', 
                                label: t('nav.services_warehouse') || 'Warehouse & Fulfillment', 
                                desc: ft('wareDesc'), 
                                icon: <Package className="w-6 h-6" />,
                                color: 'hover:border-orange-500 hover:bg-orange-50/20 text-orange-600 bg-orange-50/40 border-orange-100',
                                activeColor: 'border-orange-600 bg-orange-50/50 text-orange-700 shadow-orange-500/10'
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
                                      ? `${item.activeColor} ring-2 ring-offset-2 ring-[#4B27B1]/10 font-bold scale-[1.01] shadow-lg` 
                                      : `${item.color} border-slate-100 bg-slate-50/40 text-slate-700 hover:scale-[1.01]`
                                  }`}
                                >
                                  <div className={`p-3 rounded-xl transition-all duration-300 ${
                                    isActive ? 'bg-white shadow-sm' : 'bg-white border border-slate-100'
                                  }`}>
                                    {item.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-extrabold text-slate-900 group-hover:text-[#4B27B1] transition-colors flex items-center justify-between">
                                      <span>{item.label}</span>
                                      {isActive && (
                                        <motion.span 
                                          layoutId="activeTick" 
                                          className="w-5 h-5 rounded-full bg-[#4B27B1] text-white flex items-center justify-center"
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
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 text-[#4B27B1]">2</span>
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
                                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#4B27B1] focus:ring-2 focus:ring-[#4B27B1]/10 outline-none transition-all placeholder-slate-400 font-bold text-sm"
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
                                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                        isSelected
                                          ? 'border-[#4B27B1] bg-purple-50 text-[#4B27B1] ring-2 ring-purple-100'
                                          : 'border-slate-200 bg-white hover:border-[#4B27B1] text-slate-700 hover:bg-slate-50'
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
                                  onChange={(e) => setDestination(e.target.value)}
                                  required
                                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#4B27B1] focus:ring-2 focus:ring-[#4B27B1]/10 outline-none transition-all placeholder-slate-400 font-bold text-sm"
                                  placeholder={ft('destinationPlaceholder')}
                                />
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
                                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                        isSelected
                                          ? 'border-[#4B27B1] bg-purple-50 text-[#4B27B1] ring-2 ring-purple-100'
                                          : 'border-slate-200 bg-white hover:border-[#4B27B1] text-slate-700 hover:bg-slate-50'
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
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 text-[#4B27B1]">3</span>
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
                                { id: 'small', label: ft('presetSmall'), icon: '📦' },
                                { id: 'medium', label: ft('presetMedium'), icon: '🧱' },
                                { id: 'large', label: ft('presetLarge'), icon: '🚛' }
                              ].map((preset) => {
                                const isActive = presetActive === preset.id;
                                return (
                                  <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => handlePresetSelect(preset.id as any)}
                                    className={`py-3 px-4 rounded-xl border text-left transition-all duration-300 flex items-center gap-2.5 ${
                                      isActive
                                        ? 'border-[#FF8A00] bg-orange-50/50 text-[#FF8A00] font-bold ring-2 ring-orange-100'
                                        : 'border-slate-200 bg-white hover:border-[#FF8A00]/50 text-slate-700 hover:bg-slate-50'
                                    }`}
                                  >
                                    <span className="text-lg">{preset.icon}</span>
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
                                  <Scale className="w-3.5 h-3.5 text-[#4B27B1]" />
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
                                    className="w-20 text-right px-2 py-1 rounded border border-slate-200 text-sm font-black text-slate-800 focus:border-[#4B27B1] focus:ring-1 focus:ring-[#4B27B1] outline-none"
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
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4B27B1]"
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
                                  <Package className="w-3.5 h-3.5 text-[#FF8A00]" />
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
                                    className="w-20 text-right px-2 py-1 rounded border border-slate-200 text-sm font-black text-slate-800 focus:border-[#4B27B1] focus:ring-1 focus:ring-[#4B27B1] outline-none"
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
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FF8A00]"
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
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 text-[#4B27B1]">4</span>
                            {ft('step4Title')}
                          </h3>
                          <p className="text-sm text-slate-500 mb-6 font-medium">
                            {ft('step4Desc')}
                          </p>

                          {/* Dynamic Configuration Summary Box */}
                          <div className="bg-gradient-to-r from-purple-50 to-orange-50/50 rounded-2xl border border-purple-100/60 p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                {ft('summaryTitle')}
                              </span>
                              <div className="flex flex-wrap items-center gap-2 text-slate-700 text-xs font-extrabold">
                                <span className="bg-white border border-purple-100 px-2.5 py-1 rounded-lg text-[#4B27B1] flex items-center gap-1 shadow-sm">
                                  {selectedService === 'Sea' ? '🚢' : selectedService === 'Air' ? '✈️' : selectedService === 'Land' ? '🚛' : '📦'} {selectedService}
                                </span>
                                <span className="text-slate-300">➔</span>
                                <span className="bg-white border border-purple-100 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                  📍 {origin || 'Guangzhou'}
                                </span>
                                <span className="text-slate-300">➔</span>
                                <span className="bg-white border border-purple-100 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                  🌎 {destination || 'Global Dest.'}
                                </span>
                                <span className="text-slate-300">➔</span>
                                <span className="bg-white border border-purple-100 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm text-amber-700">
                                  ⚖️ {weight} KG / {volume} CBM
                                </span>
                              </div>
                            </div>
                            
                            {/* Fast route speed indicator tag */}
                            <div className="text-right text-[10px] text-slate-500 bg-white/80 border border-slate-100 rounded-xl px-3 py-1.5 self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end gap-1.5 shadow-sm">
                              <span className="font-extrabold text-[#FF8A00] uppercase tracking-wide flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-[#FF8A00] animate-pulse" /> Custom Router
                              </span>
                              <span className="font-bold text-slate-600">
                                VIP Priority Response
                              </span>
                            </div>
                          </div>

                          <form id="quote-form" onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
                            {/* Hidden inputs to feed Formspree the multi-step details */}
                            <input type="hidden" name="Inquiry_Type" value="Interactive Funnel (Lead Rate Optimizer)" />
                            <input type="hidden" name="Selected_Service" value={selectedService} />
                            <input type="hidden" name="Origin" value={origin} />
                            <input type="hidden" name="Destination" value={destination} />
                            <input type="hidden" name="Estimated_Weight_KG" value={`${weight} KG`} />
                            <input type="hidden" name="Estimated_Volume_CBM" value={`${volume} CBM`} />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Contact Name */}
                              <div>
                                <input
                                  type="text"
                                  name="name"
                                  required
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#4B27B1] focus:ring-2 focus:ring-[#4B27B1]/10 outline-none transition-all placeholder-slate-400 font-bold text-sm"
                                  placeholder={ft('namePlaceholder')}
                                />
                                <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-xs mt-1" />
                              </div>

                              {/* Contact Email */}
                              <div>
                                <input
                                  type="email"
                                  name="email"
                                  required
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#4B27B1] focus:ring-2 focus:ring-[#4B27B1]/10 outline-none transition-all placeholder-slate-400 font-bold text-sm"
                                  placeholder={ft('emailPlaceholder')}
                                />
                                <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1" />
                              </div>

                              {/* Phone / WeChat / WhatsApp */}
                              <div>
                                <input
                                  type="text"
                                  name="phone"
                                  required
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#4B27B1] focus:ring-2 focus:ring-[#4B27B1]/10 outline-none transition-all placeholder-slate-400 font-bold text-sm"
                                  placeholder={ft('phonePlaceholder')}
                                />
                                <ValidationError prefix="Phone" field="phone" errors={state.errors} className="text-red-500 text-xs mt-1" />
                              </div>

                              {/* Industry Category */}
                              <div>
                                <select
                                  name="industry"
                                  required
                                  value={product}
                                  onChange={(e) => setProduct(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#4B27B1] focus:ring-2 focus:ring-[#4B27B1]/10 outline-none bg-white font-bold text-sm transition-all"
                                >
                                  <option value="Commercial Furniture">{t('get_a_quote.indFurn') || 'Commercial Furniture'}</option>
                                  <option value="New Energy / ESS">{t('get_a_quote.indNev') || 'New Energy / ESS'}</option>
                                  <option value="Project Cargo / Heavy Lift">{t('get_a_quote.indProject') || 'Project Cargo / Heavy Lift'}</option>
                                  <option value="Other">{t('get_a_quote.indOther') || 'Other / General'}</option>
                                </select>
                              </div>
                            </div>

                            {/* Additional Cargo Notes */}
                            <div>
                              <textarea
                                name="message"
                                rows={2}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#4B27B1] focus:ring-2 focus:ring-[#4B27B1]/10 outline-none resize-none transition-all placeholder-slate-400 font-bold text-sm"
                                placeholder={ft('notesPlaceholder')}
                              />
                            </div>

                            {/* Live Submission Button */}
                            <div className="pt-2">
                              <button
                                type="submit"
                                disabled={state.submitting}
                                className={`w-full text-white font-extrabold py-4 rounded-xl transition-all flex items-center justify-center shadow-lg hover:-translate-y-0.5 cursor-pointer ${
                                  state.submitting 
                                    ? 'bg-slate-500 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-[#4B27B1] via-pink-600 to-[#FF8A00] hover:shadow-xl shadow-purple-500/10'
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
                        className="px-5 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-2 font-bold text-xs cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" /> {ft('back')}
                      </button>
                      
                      {step < 4 && (
                        <button
                          type="button"
                          disabled={step === 2 && !destination}
                          onClick={nextStep}
                          className={`px-6 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            step === 2 && !destination
                              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                              : 'bg-[#4B27B1] text-white hover:bg-purple-800 shadow-sm hover:shadow-md'
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
                className="flex-1 flex flex-col items-center justify-center text-center bg-[#4B27B1] p-8 sm:p-12 text-white"
              >
                <div className="w-20 h-20 bg-[#FF8A00] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30 ring-8 ring-white/10">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
                  {ft('successHeading')}
                </h3>
                
                <p className="text-purple-100 text-base md:text-lg max-w-lg leading-relaxed mb-8 font-medium">
                  {ft('successText')}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button 
                    onClick={resetFunnel}
                    className="text-[#4B27B1] bg-white hover:bg-slate-50 px-8 py-3.5 rounded-xl text-sm font-black transition-all hover:scale-[1.02] shadow-md cursor-pointer"
                  >
                    {ft('sendAnother')}
                  </button>
                  <a 
                    href="mailto:partnership@ddnzglobal.com"
                    className="text-white bg-purple-800/60 hover:bg-purple-800 border border-purple-500/50 px-8 py-3.5 rounded-xl text-sm font-black transition-all cursor-pointer"
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
