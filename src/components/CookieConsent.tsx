import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ShieldCheck, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';

const cookieTexts = {
  en: {
    bannerTitle: "We value your privacy",
    bannerDesc: "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking \"Accept All\", you consent to our use of cookies ensuring the best logistics portal experience.",
    btnAcceptAll: "Accept All",
    btnDecline: "Decline",
    btnSettings: "Cookie Settings",
    modalTitle: "Cookies Preferences Center",
    consentBy: "Cookie Consent by Heaven Born",
    btnSave: "Save my preferences",
    activeLabel: "Active",
    inactiveLabel: "Inactive",
    alwaysActive: "Always active",
    tabs: {
      privacy: "Your privacy",
      necessary: "Strictly necessary cookies",
      functionality: "Functionality cookies",
      tracking: "Tracking cookies",
      targeting: "Targeting and advertising cookies",
      more: "More information"
    },
    content: {
      privacy: {
        title: "Your privacy is important to us",
        p1: "Cookies are very small text files that are stored on your computer when you visit a website. We use cookies for a variety of purposes and to enhance your online experience on our website (for example, to remember your account login details).",
        p2: "You can change your preferences and decline certain types of cookies to be stored on your computer while browsing our website. You can also remove any cookies already stored on your computer, but keep in mind that deleting cookies may prevent you from using parts of our website."
      },
      necessary: {
        title: "Strictly necessary cookies",
        p1: "These cookies are essential to provide you with services available through our website and to enable you to use certain features of our website.",
        p2: "Without these cookies, we cannot provide you certain services on our website."
      },
      functionality: {
        title: "Functionality cookies",
        p1: "These cookies are used to provide you with a more personalized experience on our website and to remember choices you make when you use our website.",
        p2: "For example, we may use functionality cookies to remember your language preferences or remember your login details."
      },
      tracking: {
        title: "Tracking cookies",
        p1: "These cookies are used to collect information to analyze the traffic to our website and how visitors are using our website.",
        p2: "For example, these cookies may track things such as how long you spend on the website or the pages you visit which helps us to understand how we can improve our website for you.",
        p3: "The information collected through these tracking and performance cookies do not identify any individual visitor."
      },
      targeting: {
        title: "Targeting and advertising cookies",
        p1: "These cookies are used to show advertising that is likely to be of interest to you based on your browsing habits.",
        p2: "These cookies, as served by our content and/or advertising providers, may combine information they collected from our website with other information they have independently collected relating to your web browser's activities across their network of websites.",
        p3: "If you choose to remove or disable these targeting or advertising cookies, you will still see adverts but they may not be relevant to you."
      },
      more: {
        title: "More information",
        p1: "For any queries in relation to our policy on cookies and your choices, please contact us."
      }
    }
  },
  zh: {
    bannerTitle: "我们重视您的隐私",
    bannerDesc: "我们使用 Cookie 来提升您的浏览体验、提供个性化内容并分析我们的流量。点击“全部接受”，即表示您同意我们使用 Cookie，以确保您获得最佳的物流门户体验。",
    btnAcceptAll: "全部接受",
    btnDecline: "拒绝",
    btnSettings: "Cookie 设置",
    modalTitle: "Cookie 偏好设置中心",
    consentBy: "由 Heaven Born 提供的 Cookie 同意书",
    btnSave: "保存我的偏好设置",
    activeLabel: "已激活",
    inactiveLabel: "未激活",
    alwaysActive: "始终激活",
    tabs: {
      privacy: "您的隐私",
      necessary: "绝对必要 Cookie",
      functionality: "功能性 Cookie",
      tracking: "追踪性 Cookie",
      targeting: "定向与广告 Cookie",
      more: "更多信息"
    },
    content: {
      privacy: {
        title: "您的隐私对我们至关重要",
        p1: "Cookie 是您访问网站时存储在计算机上的非常小的文本文件。我们使用 Cookie 出于多种目的，并旨在增强您的网站在线体验（例如：记住您的账户登录详细信息）。",
        p2: "您可以更改偏好并拒绝在计算机中存储某些类型的 Cookie。您也可以随时删除计算机中已有的 Cookie，但请注意，删除 Cookie 可能会影响您正常使用我们网站的部分功能。"
      },
      necessary: {
        title: "绝对必要 Cookie",
        p1: "这些 Cookie 对于向您提供网站服务以及启用某些网站功能是必不可少的。",
        p2: "如果没有这些 Cookie，我们无法为您提供这些必需的服务。"
      },
      functionality: {
        title: "功能性 Cookie",
        p1: "这些 Cookie 用于为您提供更具个性化的网站体验，并记住您在使用我们网站时所做的选择。",
        p2: "例如，我们可能使用功能性 Cookie 来记住您的语言偏好或登录状态。"
      },
      tracking: {
        title: "追踪性 Cookie",
        p1: "这些 Cookie 用于收集信息以分析网站流量及访客使用网站的情况。",
        p2: "例如，这些 Cookie 可以追踪您在网站上停留的时间或访问的页面，这有助于我们了解如何为您改进网站。",
        p3: "通过这些追踪和性能 Cookie 收集的信息不会识别任何个人访客的身份。"
      },
      targeting: {
        title: "定向与广告 Cookie",
        p1: "这些 Cookie 用于根据您的浏览习惯向您展示您可能感兴趣的广告。",
        p2: "这些 Cookie 由我们的内容和/或广告服务商提供，它们可能会将从我们网站收集的信息与它们在其他网站网络上独立收集的有关您浏览活动的其他信息相结合。",
        p3: "如果您选择删除或禁用这些定向或广告 Cookie，您仍会看到广告，但它们可能与您不相关。"
      },
      more: {
        title: "更多信息",
        p1: "如果您对我们的 Cookie 政策及您的选择有任何疑问，请随时联系我们。"
      }
    }
  },
  ru: {
    bannerTitle: "Мы ценим вашу конфиденциальность",
    bannerDesc: "Мы используем файлы cookie для улучшения вашего опыта просмотра, показа персонализированного контента и анализа нашего трафика. Нажимая «Принять все», вы соглашаетесь на использование файлов cookie для обеспечения наилучшего взаимодействия с нашим логистическим порталом.",
    btnAcceptAll: "Принять все",
    btnDecline: "Отклонить",
    btnSettings: "Настройки файлов cookie",
    modalTitle: "Центр настроек файлов cookie",
    consentBy: "Согласие на файлы cookie от Heaven Born",
    btnSave: "Сохранить мои настройки",
    activeLabel: "Активно",
    inactiveLabel: "Неактивно",
    alwaysActive: "Всегда активно",
    tabs: {
      privacy: "Ваша конфиденциальность",
      necessary: "Строго необходимые файлы cookie",
      functionality: "Функциональные файлы cookie",
      tracking: "Отслеживающие файлы cookie",
      targeting: "Рекламные файлы cookie",
      more: "Дополнительная информация"
    },
    content: {
      privacy: {
        title: "Ваша конфиденциальность важна для нас",
        p1: "Файлы cookie — это очень маленькие текстовые файлы, которые сохраняются на вашем компьютере при посещении веб-сайта. Мы используем файлы cookie для различных целей и для улучшения вашего удобства работы на нашем сайте (например, для запоминания данных вашего входа).",
        p2: "Вы можете изменить свои предпочтения и отказаться от хранения определенных типов файлов cookie на своем компьютере во время просмотра нашего сайта. Вы также можете удалить любые файлы cookie, уже сохраненные на вашем компьютере, но помните, что удаление файлов cookie может помешать вам использовать некоторые части нашего веб-сайта."
      },
      necessary: {
        title: "Строго необходимые файлы cookie",
        p1: "Эти файлы cookie необходимы для предоставления вам услуг, доступных через наш веб-сайт, и для того, чтобы вы могли использовать определенные функции нашего веб-сайта.",
        p2: "Без этих файлов cookie мы не можем предоставить вам определенные услуги."
      },
      functionality: {
        title: "Функциональные файлы cookie",
        p1: "Эти файлы cookie используются для предоставления вам более персонализированного опыта на нашем веб-сайте и для запоминания выбора, который вы делаете при использовании нашего веб-сайта.",
        p2: "Например, мы можем использовать функциональные файлы cookie, чтобы запомнить ваши языковые предпочтения или данные вашего входа."
      },
      tracking: {
        title: "Отслеживающие файлы cookie",
        p1: "Эти файлы cookie используются для сбора информации для анализа трафика на нашем веб-сайте и того, как посетители используют наш сайт.",
        p2: "Например, эти файлы cookie могут отслеживать такие параметры, как время, проведенное на сайте, или посещенные страницы, что помогает нам понять, как улучшить наш сайт для вас.",
        p3: "Информация, собранная с помощью этих файлов cookie, не идентифицирует конкретного посетителя."
      },
      targeting: {
        title: "Рекламные файлы cookie",
        p1: "Эти файлы cookie используются для показа рекламы, которая, скорее всего, будет вам интересна, на основе ваших привычек просмотра.",
        p2: "Эти файлы cookie, предоставляемые нашими поставщиками контента и/или рекламы, могут объединять информацию, собранную с нашего сайта, с другой информацией, которую они независимо собрали в отношении вашей активности.",
        p3: "Если вы решите удалить или отключить эти файлы cookie, вы все равно будете видеть рекламу, но она может быть нерелевантной."
      },
      more: {
        title: "Дополнительная информация",
        p1: "По любым вопросам относительно нашей политики в отношении файлов cookie и вашего выбора, пожалуйста, свяжитесь с нами."
      }
    }
  },
  fr: {
    bannerTitle: "Nous apprécions votre vie privée",
    bannerDesc: "Nous utilisons des cookies pour améliorer votre expérience de navigation, diffuser du contenu personnalisé et analyser notre trafic. En cliquant sur « Tout accepter », vous consentez à notre utilisation des cookies pour garantir la meilleure expérience possible sur notre portail.",
    btnAcceptAll: "Tout accepter",
    btnDecline: "Refuser",
    btnSettings: "Paramètres des cookies",
    modalTitle: "Centre de Préférences des Cookies",
    consentBy: "Consentement de cookies par Heaven Born",
    btnSave: "Enregistrer mes préférences",
    activeLabel: "Actif",
    inactiveLabel: "Inactif",
    alwaysActive: "Toujours actif",
    tabs: {
      privacy: "Votre vie privée",
      necessary: "Cookies strictement nécessaires",
      functionality: "Cookies de fonctionnalité",
      tracking: "Cookies de suivi",
      targeting: "Cookies de ciblage et publicité",
      more: "Plus d'informations"
    },
    content: {
      privacy: {
        title: "Votre vie privée est importante pour nous",
        p1: "Les cookies sont de très petits fichiers texte qui sont stockés sur votre ordinateur lorsque vous visitez un site Web. Nous utilisons des cookies à diverses fins et pour améliorer votre expérience en ligne sur notre site (par exemple, pour mémoriser les détails de connexion à votre compte).",
        p2: "Vous pouvez modifier vos préférences et refuser le stockage de certains types de cookies sur votre ordinateur lors de votre navigation. Vous pouvez également supprimer tous les cookies déjà stockés sur votre ordinateur, mais gardez à l'esprit que la suppression des cookies peut vous empêcher d'utiliser certaines parties de notre site."
      },
      necessary: {
        title: "Cookies strictement nécessaires",
        p1: "Ces cookies sont essentiels pour vous fournir les services disponibles sur notre site et pour vous permettre d'utiliser certaines de ses fonctionnalités.",
        p2: "Sans ces cookies, nous ne pouvons pas vous fournir certains services."
      },
      functionality: {
        title: "Cookies de fonctionnalité",
        p1: "Ces cookies sont utilisés pour vous offrir une expérience plus personnalisée sur notre site et pour mémoriser les choix que vous faites lorsque vous l'utilisez.",
        p2: "Par exemple, nous pouvons utiliser des cookies de fonctionnalité pour mémoriser vos préférences linguistiques ou vos identifiants."
      },
      tracking: {
        title: "Cookies de suivi",
        p1: "Ces cookies sont utilisés pour collecter des informations afin d'analyser le trafic sur notre site et la façon dont les visiteurs l'utilisent.",
        p2: "Par exemple, ces cookies peuvent suivre le temps passé ou les pages visitées, ce qui nous aide à comprendre comment améliorer notre site.",
        p3: "Les informations collectées ne permettent pas d'identifier un visiteur individuel."
      },
      targeting: {
        title: "Cookies de ciblage et de publicité",
        p1: "Ces cookies sont utilisés pour afficher des publicités susceptibles de vous intéresser en fonction de vos habitudes de navigation.",
        p2: "Ces cookies, fournis par nos partenaires, peuvent combiner des données de notre site avec d'autres informations collectées de manière indépendante.",
        p3: "Si vous les désactivez, vous verrez toujours des publicités mais elles seront moins pertinentes."
      },
      more: {
        title: "Plus d'informations",
        p1: "Pour toute question concernant notre politique de cookies et vos choix, veuillez nous contacter."
      }
    }
  }
};

const languagesList = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ru', label: 'Русский' },
  { code: 'fr', label: 'Français' }
];

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'privacy' | 'necessary' | 'functionality' | 'tracking' | 'targeting' | 'more'>('privacy');
  
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);

    // Rewrite URL prefix dynamically based on target language
    let currentPath = location.pathname;
    
    // Remove current prefixes if present
    if (currentPath.startsWith('/zh-cn')) {
      currentPath = currentPath.slice(6);
    } else if (currentPath.startsWith('/ru')) {
      currentPath = currentPath.slice(3);
    } else if (currentPath.startsWith('/fr')) {
      currentPath = currentPath.slice(3);
    }

    if (currentPath === '') currentPath = '/';

    // Construct target prefix path
    let targetPath = '';
    if (lang === 'zh') {
      targetPath = `/zh-cn${currentPath === '/' ? '' : currentPath}`;
    } else if (lang === 'ru') {
      targetPath = `/ru${currentPath === '/' ? '' : currentPath}`;
    } else if (lang === 'fr') {
      targetPath = `/fr${currentPath === '/' ? '' : currentPath}`;
    } else {
      targetPath = currentPath;
    }

    const searchAndHash = location.search + location.hash;
    navigate(targetPath + searchAndHash);
  };

  const [preferences, setPreferences] = useState({
    necessary: true,
    functionality: true,
    tracking: false,
    targeting: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    const savedPrefs = localStorage.getItem('cookiePreferences');
    
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (e) {
        console.error('Failed to parse cookie preferences');
      }
    }

    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpenSettings = () => {
      setShowPreferencesModal(true);
    };
    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => {
      window.removeEventListener('open-cookie-settings', handleOpenSettings);
    };
  }, []);

  const handleAccept = () => {
    const fullPrefs = {
      necessary: true,
      functionality: true,
      tracking: true,
      targeting: true
    };
    setPreferences(fullPrefs);
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify(fullPrefs));
    setIsVisible(false);
  };

  const handleDecline = () => {
    const declinedPrefs = {
      necessary: true,
      functionality: false,
      tracking: false,
      targeting: false
    };
    setPreferences(declinedPrefs);
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookiePreferences', JSON.stringify(declinedPrefs));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setShowPreferencesModal(false);
    setIsVisible(false);
  };

  const togglePreference = (key: 'functionality' | 'tracking' | 'targeting') => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const tLocal = cookieTexts[language as Language] || cookieTexts.en;

  const Toggle = ({ active, disabled, onChange }: { active: boolean; disabled?: boolean; onChange?: () => void }) => {
    return (
      <div className="flex items-center gap-3 mt-6">
        <button
          type="button"
          disabled={disabled}
          onClick={onChange}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4B27B1] focus:ring-offset-2 ${
            disabled ? 'bg-emerald-500 cursor-not-allowed' : active ? 'bg-[#4B27B1]' : 'bg-slate-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              disabled || active ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className={`text-sm font-bold tracking-tight ${disabled ? 'text-emerald-600' : active ? 'text-[#4B27B1]' : 'text-slate-400'}`}>
          {disabled ? tLocal.alwaysActive : active ? tLocal.activeLabel : tLocal.inactiveLabel}
        </span>
      </div>
    );
  };

  return (
    <>
      {/* Cookie Banner */}
      <AnimatePresence>
        {isVisible && !showPreferencesModal && (
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-0 left-0 right-0 z-[90] p-4 sm:p-6 pointer-events-none"
          >
            <div className="max-w-6xl mx-auto pointer-events-auto">
              <div className="bg-slate-900 border border-slate-700/50 text-slate-300 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                <div className="flex-shrink-0 bg-[#4B27B1]/20 p-3 rounded-full relative z-10 border border-[#4B27B1]/40">
                  <Cookie className="w-8 h-8 text-[#FF8A00]" />
                </div>
                
                <div className="flex-1 text-left relative z-10 pr-6 md:pr-0">
                  <h4 className="text-white font-bold text-lg mb-2">{tLocal.bannerTitle}</h4>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {tLocal.bannerDesc}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 relative z-10 mt-2 md:mt-0">
                  <button 
                    onClick={() => setShowPreferencesModal(true)}
                    className="px-5 py-2.5 text-sm font-bold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors border border-slate-700/60"
                  >
                    {tLocal.btnSettings}
                  </button>
                  <button 
                    onClick={handleDecline}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white bg-transparent hover:bg-slate-800/40 rounded-xl transition-colors"
                  >
                    {tLocal.btnDecline}
                  </button>
                  <button 
                    onClick={handleAccept}
                    className="px-6 py-2.5 text-sm font-extrabold text-white bg-[#4B27B1] hover:bg-[#3a1d91] rounded-xl shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 transition-all duration-300 whitespace-nowrap"
                  >
                    {tLocal.btnAcceptAll}
                  </button>
                </div>

                <button 
                  onClick={handleDecline}
                  className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-20 pointer-events-auto p-1"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Center Modal */}
      <AnimatePresence>
        {showPreferencesModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreferencesModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col h-[600px] md:h-[650px] z-10"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#4B27B1]" />
                  {tLocal.modalTitle}
                </h3>

                <div className="flex items-center gap-4">
                  {/* Language Selector Dropdown */}
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value as Language)}
                      className="appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4B27B1]/30 cursor-pointer shadow-sm"
                    >
                      {languagesList.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setShowPreferencesModal(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Central Content Split Panel */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left Tabs Column */}
                <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 flex-shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible md:overflow-y-auto scrollbar-none border-b md:border-b-0">
                  {[
                    { id: 'privacy', label: tLocal.tabs.privacy },
                    { id: 'necessary', label: tLocal.tabs.necessary },
                    { id: 'functionality', label: tLocal.tabs.functionality },
                    { id: 'tracking', label: tLocal.tabs.tracking },
                    { id: 'targeting', label: tLocal.tabs.targeting },
                    { id: 'more', label: tLocal.tabs.more }
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-5 py-3 md:py-4 text-left text-xs md:text-sm font-bold tracking-tight border-b md:border-b-0 md:border-l-4 transition-all duration-200 whitespace-nowrap md:whitespace-normal flex-shrink-0 ${
                          isActive
                            ? 'border-[#4B27B1] text-[#4B27B1] bg-purple-50/50 md:bg-purple-50/30'
                            : 'border-transparent text-slate-600 hover:text-[#4B27B1] hover:bg-slate-100/50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Right Tab Content Pane */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto text-left flex flex-col justify-between">
                  <div className="space-y-4">
                    {activeTab === 'privacy' && (
                      <>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{tLocal.content.privacy.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.privacy.p1}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.privacy.p2}</p>
                      </>
                    )}

                    {activeTab === 'necessary' && (
                      <>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{tLocal.content.necessary.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.necessary.p1}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.necessary.p2}</p>
                        <Toggle active={true} disabled={true} />
                      </>
                    )}

                    {activeTab === 'functionality' && (
                      <>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{tLocal.content.functionality.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.functionality.p1}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.functionality.p2}</p>
                        <Toggle
                          active={preferences.functionality}
                          onChange={() => togglePreference('functionality')}
                        />
                      </>
                    )}

                    {activeTab === 'tracking' && (
                      <>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{tLocal.content.tracking.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.tracking.p1}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.tracking.p2}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.tracking.p3}</p>
                        <Toggle
                          active={preferences.tracking}
                          onChange={() => togglePreference('tracking')}
                        />
                      </>
                    )}

                    {activeTab === 'targeting' && (
                      <>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{tLocal.content.targeting.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.targeting.p1}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.targeting.p2}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.targeting.p3}</p>
                        <Toggle
                          active={preferences.targeting}
                          onChange={() => togglePreference('targeting')}
                        />
                      </>
                    )}

                    {activeTab === 'more' && (
                      <>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{tLocal.content.more.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.more.p1}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Footer Action Bar */}
              <div className="px-6 py-4 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between bg-slate-50 gap-4">
                <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  {tLocal.consentBy}
                </div>

                <div className="flex gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleDecline}
                    className="px-5 py-2.5 text-xs md:text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {tLocal.btnDecline}
                  </button>
                  <button
                    onClick={handleAccept}
                    className="px-5 py-2.5 text-xs md:text-sm font-bold text-[#4B27B1] hover:text-white bg-purple-50 hover:bg-[#4B27B1] border border-[#4B27B1]/30 hover:border-transparent rounded-lg transition-all"
                  >
                    {tLocal.btnAcceptAll}
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-2.5 text-xs md:text-sm font-extrabold text-white bg-gradient-to-r from-[#4B27B1] to-[#3a1d91] hover:from-[#FF8A00] hover:to-[#e67c00] rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {tLocal.btnSave}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
