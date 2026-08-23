import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, trackEvent } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';

const navKeys = [
  { key: 'who_we_are', href: '/#who-we-are' },
  { key: 'what_we_do', href: '/#what-we-do' },
  { key: 'why_ddnz', href: '/#why-ddnz' },
  { key: 'services', isDropdown: true },
  { key: 'product_sourcing', isSourcingMenu: true },
  { key: 'shipping_by_region', isMegaMenu: true },
  { key: 'insights', href: '/insights' },
  { key: 'get_a_quote', href: '/#get-a-quote' },
];

const serviceItems = [
  { key: 'services_sea', href: '/services/sea-freight' },
  { key: 'services_air', href: '/services/air-freight' },
  { key: 'services_fba', href: '/services/amazon-fba' },
  { key: 'services_warehouse', href: '/services/warehouse-services' },
];

const sourcingMenuLabels: Record<Language, string> = {
  en: 'PRODUCT SOURCING',
  zh: '产品采购',
  ru: 'ПОИСК ТОВАРОВ',
  fr: 'ACHATS PRODUITS',
  es: 'COMPRA DE PRODUCTOS',
  ar: 'توريد المنتجات',
  pt: 'SOURCING DE PRODUTOS',
  tr: 'ÜRÜN TEDARİĞİ',
};

const sourcingItems = [
  {
    href: '/sourcing/commercial-kitchen-equipment-from-china',
    labels: {
      en: 'Commercial Kitchen Equipment',
      zh: '商用餐厨设备',
      ru: 'Профессиональное кухонное оборудование',
      fr: 'Équipement de cuisine professionnelle',
      es: 'Equipos de cocina comercial',
      ar: 'معدات المطابخ التجارية',
      pt: 'Equipamentos para cozinha profissional',
      tr: 'Endüstriyel mutfak ekipmanları',
    },
  },
  {
    href: '/sourcing/audio-speakers-from-china',
    labels: {
      en: 'Audio & Speakers',
      zh: '音响设备',
      ru: 'Аудио и колонки',
      fr: 'Audio et enceintes',
      es: 'Audio y altavoces',
      ar: 'الصوت ومكبرات الصوت',
      pt: 'Áudio e caixas de som',
      tr: 'Ses ve hoparlör',
    },
  },
  {
    href: '/sourcing/mobile-accessories-from-china',
    labels: {
      en: 'Mobile Accessories',
      zh: '手机配件',
      ru: 'Мобильные аксессуары',
      fr: 'Accessoires mobiles',
      es: 'Accesorios móviles',
      ar: 'ملحقات الهاتف',
      pt: 'Acessórios para celular',
      tr: 'Mobil aksesuarlar',
    },
  },
  {
    href: '/sourcing/outdoor-products-from-china',
    labels: {
      en: 'Outdoor Products',
      zh: '户外用品',
      ru: 'Товары для отдыха на открытом воздухе',
      fr: 'Produits de plein air',
      es: 'Productos para exteriores',
      ar: 'المنتجات الخارجية',
      pt: 'Produtos outdoor',
      tr: 'Outdoor ürünler',
    },
  },
];

const regionColumns = [
  {
    key: 'region_middle_east',
    countries: [
      { en: 'Saudi Arabia', zh: '沙特阿拉伯', ru: 'Саудовская Аравия', fr: 'Arabie Saoudite', es: 'Arabia Saudí', ar: 'السعودية' },
      { en: 'UAE', zh: '阿联酋', ru: 'ОАЭ', fr: 'Émirats Arabes Unis', es: 'Emiratos Árabes Unidos', ar: 'الإمارات' },
      { en: 'Kuwait', zh: '科威特', ru: 'Кувейт', fr: 'Koweït', es: 'Kuwait', ar: 'الكويت' },
      { en: 'Qatar', zh: '卡塔尔', ru: 'Катар', fr: 'Qatar', es: 'Catar', ar: 'قطر' },
      { en: 'Oman', zh: '阿曼', ru: 'Оман', fr: 'Oman', es: 'Omán', ar: 'عُمان' },
      { en: 'Bahrain', zh: '巴林', ru: 'Бахрейн', fr: 'Bahreïn', es: 'Baréin', ar: 'البحرين' },
    ]
  },
  {
    key: 'region_central_asia',
    countries: [
      { en: 'Kazakhstan', zh: '哈萨克斯坦', ru: 'Казахстан', fr: 'Kazakhstan', es: 'Kazajistán', ar: 'كازاخستان' },
      { en: 'Uzbekistan', zh: '乌兹别克斯坦', ru: 'Узбекистан', fr: 'Ouzbékistan', es: 'Uzbekistán', ar: 'أوزبكستان' },
    ]
  },
  {
    key: 'region_west_africa',
    countries: [
      { en: 'Nigeria', zh: '尼日利亚', ru: 'Нигерия', fr: 'Nigéria', es: 'Nigeria', ar: 'نيجيريا' },
      { en: 'Ghana', zh: '加纳', ru: 'Гана', fr: 'Ghana', es: 'Ghana', ar: 'غانا' },
    ]
  },
  {
    key: 'region_latin_america',
    countries: [
      { en: 'Brazil', zh: '巴西', ru: 'Бразилия', fr: 'Brésil', es: 'Brasil', ar: 'البرازيل' },
      { en: 'Mexico', zh: '墨西哥', ru: 'Мексика', fr: 'Mexique', es: 'México', ar: 'المكسيك' },
      { en: 'Argentina', zh: '阿根廷', ru: 'Аргентина', fr: 'Argentine', es: 'Argentina', ar: 'الأرجنتين' },
      { en: 'Chile', zh: '智利', ru: 'Чили', fr: 'Chili', es: 'Chile', ar: 'تشيلي' },
      { en: 'Peru', zh: '秘鲁', ru: 'Перу', fr: 'Pérou', es: 'Perú', ar: 'بيرو' },
    ]
  }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showMobileRegions, setShowMobileRegions] = useState(false);
  const [showSourcingMenu, setShowSourcingMenu] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowLanguageDropdown(false);
      setShowSourcingMenu(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  // Helper to resolve localized URL path
  const getLocalizedPath = (path: string) => {
    if (path.startsWith('/sourcing/')) return path;
    if (path.startsWith('/#')) {
      const hash = path.slice(1);
      if (language === 'zh') return `/zh-cn${hash}`;
      if (language === 'ru') return `/ru${hash}`;
      if (language === 'fr') return `/fr${hash}`;
      if (language === 'es') return `/es${hash}`;
      if (language === 'ar') return `/ar${hash}`;
      if (language === 'pt') return `/pt${hash}`;
      if (language === 'tr') return `/tr${hash}`;
      return path;
    }
    if (language === 'zh') return `/zh-cn${path === '/' ? '' : path}`;
    if (language === 'ru') return `/ru${path === '/' ? '' : path}`;
    if (language === 'fr') return `/fr${path === '/' ? '' : path}`;
    if (language === 'es') return `/es${path === '/' ? '' : path}`;
    if (language === 'ar') return `/ar${path === '/' ? '' : path}`;
    if (language === 'pt') return `/pt${path === '/' ? '' : path}`;
    if (language === 'tr') return `/tr${path === '/' ? '' : path}`;
    return path;
  };

  const handleLanguageChange = (lang: Language) => {
    trackEvent('language_change', { selected_language: lang });
    setLanguage(lang);
    setShowLanguageDropdown(false);

    // Rewrite URL prefix dynamically based on target language
    let currentPath = location.pathname;
    
    // Remove current prefixes if present
    if (currentPath.startsWith('/zh-cn')) {
      currentPath = currentPath.slice(6);
    } else if (currentPath.startsWith('/ru')) {
      currentPath = currentPath.slice(3);
    } else if (currentPath.startsWith('/fr')) {
      currentPath = currentPath.slice(3);
    } else if (currentPath.startsWith('/es')) {
      currentPath = currentPath.slice(3);
    } else if (currentPath.startsWith('/ar')) {
      currentPath = currentPath.slice(3);
    } else if (currentPath.startsWith('/pt')) {
      currentPath = currentPath.slice(3);
    } else if (currentPath.startsWith('/tr')) {
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
    } else if (lang === 'es') {
      targetPath = `/es${currentPath === '/' ? '' : currentPath}`;
    } else if (lang === 'ar') {
      targetPath = `/ar${currentPath === '/' ? '' : currentPath}`;
    } else if (lang === 'pt') {
      targetPath = `/pt${currentPath === '/' ? '' : currentPath}`;
    } else if (lang === 'tr') {
      targetPath = `/tr${currentPath === '/' ? '' : currentPath}`;
    } else {
      targetPath = currentPath;
    }

    const searchAndHash = location.search + location.hash;
    navigate(targetPath + searchAndHash);
  };

  const currentLangLabel = 
    language === 'en' ? 'EN' : 
    language === 'zh' ? 'ZH' : 
    language === 'ru' ? 'RU' :
    language === 'fr' ? 'FR' :
    language === 'es' ? 'ES' :
    language === 'ar' ? 'AR' :
    language === 'pt' ? 'PT' : 'TR';

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-350',
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-gradient-to-b from-black/85 to-transparent py-5'
    )}>
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10 xl:px-14">
        <div className="flex items-center justify-between gap-2 md:gap-4 xl:gap-8">
          
          {/* Logo + Text */}
          <div className="flex-shrink-0">
            <Link to={getLocalizedPath('/')} className="flex items-center gap-3 sm:gap-4 group">
              <img 
                src="/images/brand/heaven-born-wing-logo-v1.png"
                alt="Heaven Born International Freight Co., Ltd logo"
                width="420"
                height="295"
                loading="lazy"
                className="h-10 sm:h-12 md:h-13 lg:h-14 xl:h-16 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div 
                id="navbar-brand-name"
                className="flex flex-col select-none"
              >
                {language === 'zh' ? (
                  <>
                    <span className={cn(
                      "text-sm sm:text-base md:text-[15px] lg:text-xl xl:text-2xl font-black tracking-tight leading-none transition-all font-sans",
                      scrolled ? "text-slate-900" : "text-white"
                    )}>
                      华正邦泰
                    </span>
                    <span className={cn(
                      "text-[8px] sm:text-[9px] md:text-[8px] lg:text-[10px] xl:text-xs tracking-[0.16em] lg:tracking-[0.25em] font-bold uppercase transition-all font-sans mt-0.5",
                      scrolled ? "text-slate-500" : "text-white/80"
                    )}>
                      国际货运
                    </span>
                  </>
                ) : (
                  <>
                    <span className={cn(
                      "text-base sm:text-lg md:text-[17px] lg:text-2xl xl:text-3xl font-black tracking-tight leading-none transition-all font-sans",
                      scrolled ? "text-slate-900" : "text-white"
                    )}>
                      Heaven Born
                    </span>
                    <span className={cn(
                      "text-[8px] sm:text-[9.5px] md:text-[9px] lg:text-[11px] xl:text-[13px] tracking-[0.03em] lg:tracking-[0.08em] xl:tracking-[0.1em] font-black uppercase transition-all font-sans mt-1 whitespace-nowrap",
                      scrolled ? "text-[#0B4F8A] font-bold" : "text-white/90"
                    )}>
                      International Freight
                    </span>
                  </>
                )}
              </div>
            </Link>
          </div>
          
          <div className="hidden min-[1360px]:flex items-center space-x-2 lg:space-x-4 xl:space-x-6 ml-auto pl-2 md:pl-4">
            {navKeys.map((item) => {
              if (item.isDropdown) {
                return (
                  <div key={item.key} className="relative group/nav py-2">
                    <button
                      className={cn(
                        "text-[10px] lg:text-xs xl:text-sm tracking-wider xl:tracking-widest font-black transition-all whitespace-nowrap flex items-center gap-0.5 lg:gap-1",
                        scrolled ? "text-slate-700 hover:text-[#0B4F8A]" : "text-white/90 hover:text-white"
                      )}
                    >
                      <span>{t(`nav.${item.key}`)}</span>
                      <ChevronDown className="w-3 h-3 md:w-3.5 md:h-3.5 transition-transform duration-300 group-hover/nav:rotate-180" strokeWidth={2.5} />
                    </button>
                    
                    {/* Hover Dropdown Menu */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-56 hidden group-hover/nav:block z-50">
                      <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 flex flex-col">
                        {serviceItems.map((sub) => (
                          <Link
                            key={sub.key}
                            to={getLocalizedPath(sub.href)}
                            className="px-5 py-2.5 text-[11px] lg:text-xs tracking-widest uppercase font-black text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] transition-colors"
                          >
                            {t(`nav.${sub.key}`)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              if (item.isSourcingMenu) {
                return (
                  <div key={item.key} className="relative group/sourcing py-2">
                    <button
                      type="button"
                      aria-expanded={showSourcingMenu}
                      onClick={() => setShowSourcingMenu((open) => !open)}
                      className={cn(
                        "text-[10px] lg:text-xs xl:text-sm tracking-wider xl:tracking-widest font-black transition-all whitespace-nowrap flex items-center gap-0.5 lg:gap-1",
                        scrolled ? "text-slate-700 hover:text-[#0B4F8A]" : "text-white/90 hover:text-white"
                      )}
                    >
                      <span>{sourcingMenuLabels[language]}</span>
                      <ChevronDown className="w-3 h-3 md:w-3.5 md:h-3.5 transition-transform duration-300 group-hover/sourcing:rotate-180" strokeWidth={2.5} />
                    </button>
                    <div className={cn(
                      "absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-2 group-hover/sourcing:block",
                      showSourcingMenu ? "block" : "hidden",
                    )}>
                      <div className="border border-slate-100 bg-white py-2.5 shadow-2xl">
                        <div className="border-b border-slate-100 px-5 pb-2 pt-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
                          Source from China
                        </div>
                        {sourcingItems.map((sub) => (
                          <Link
                            key={sub.href}
                            to={getLocalizedPath(sub.href)}
                            onClick={() => setShowSourcingMenu(false)}
                            className="block px-5 py-3 text-xs font-black text-slate-700 transition-colors hover:bg-sky-50 hover:text-[#0B4F8A]"
                          >
                            {sub.labels[language]}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              if (item.isMegaMenu) {
                return (
                  <div 
                    key={item.key} 
                    className="relative py-2"
                    onMouseEnter={() => setShowMegaMenu(true)}
                    onMouseLeave={() => setShowMegaMenu(false)}
                    onFocus={() => setShowMegaMenu(true)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setShowMegaMenu(false);
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={showMegaMenu}
                      aria-haspopup="menu"
                      onClick={() => setShowMegaMenu((open) => !open)}
                      className={cn(
                        "text-[10px] lg:text-xs xl:text-sm tracking-wider xl:tracking-widest font-black transition-all whitespace-nowrap flex items-center gap-0.5 lg:gap-1 cursor-pointer",
                        scrolled ? "text-slate-700 hover:text-[#0B4F8A]" : "text-white/90 hover:text-white"
                      )}
                    >
                      <span>{t(`nav.${item.key}`)}</span>
                      <ChevronDown className={cn(
                        "w-3 h-3 md:w-3.5 md:h-3.5 transition-transform duration-300",
                        showMegaMenu ? "rotate-180" : ""
                      )} strokeWidth={2.5} />
                    </button>
                    
                    {/* Mega Menu Dropdown */}
                    <AnimatePresence>
                      {showMegaMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[550px] lg:w-[650px] xl:w-[750px] z-50"
                        >
                          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                            {/* Shipping-blue navigation with an orange conversion accent */}
                            <div className="h-1.5 bg-gradient-to-r from-[#0B1F3A] via-[#0B4F8A] to-[#F59E0B]" />
                            
                            <div className="p-6 md:p-8 grid grid-cols-4 gap-4 md:gap-6">
                              {regionColumns.map((col) => (
                                <div key={col.key} className="flex flex-col space-y-3">
                                  <h4 className="text-[11px] lg:text-xs tracking-wider font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0B1F3A] to-[#EA6A12] uppercase border-b border-slate-100 pb-1.5 whitespace-nowrap">
                                    {t(`nav.${col.key}`)}
                                  </h4>
                                  <div className="flex flex-col space-y-2">
                                    {col.countries.map((country, idx) => {
                                      const label = country[language as keyof typeof country] || country.en;
                                      const countrySlug = country.en.toLowerCase().replace(/\s+/g, '-');
                                      
                                      return (
                                        <Link
                                          key={idx}
                                          to={getLocalizedPath(`/shipping-from-china-to-${countrySlug}`)}
                                          onClick={() => {
                                            setShowMegaMenu(false);
                                            trackEvent('region_link_click', { country: country.en, specialized: true });
                                          }}
                                          className="text-[11px] lg:text-xs font-bold text-slate-600 hover:text-[#0B4F8A] transition-colors flex items-center gap-1 group/item"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] group-hover/item:bg-[#0B4F8A] transition-colors" />
                                          <span className="group-hover/item:translate-x-1 transition-transform duration-200 whitespace-nowrap">
                                            {label}
                                          </span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Mega menu footer banner */}
                            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-[10px] lg:text-xs">
                              <span className="font-medium text-slate-500">
                                {language === 'zh' ? '中国出口物流规划与操作支持' :
                                 language === 'ru' ? 'Логистическое планирование и экспортная поддержка из Китая' :
                                 language === 'fr' ? 'Planification logistique et accompagnement export depuis la Chine' :
                                 'China-origin logistics planning and export support'}
                              </span>
                              <a 
                                href={getLocalizedPath('/#get-a-quote')}
                                onClick={() => setShowMegaMenu(false)}
                                className="font-extrabold text-[#0B4F8A] hover:text-[#EA6A12] transition-colors flex items-center gap-0.5"
                              >
                                {language === 'zh' ? '立即询价' :
                                 language === 'ru' ? 'Запросить ставку' :
                                 language === 'fr' ? 'Demander un devis' :
                                 'Request a quote'}
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const isQuote = item.key === 'get_a_quote';
              return (
                <Link
                  key={item.key}
                  to={getLocalizedPath(item.href || '')}
                  className={cn(
                    "text-[10px] lg:text-xs xl:text-sm tracking-wider xl:tracking-widest font-black transition-all whitespace-nowrap",
                    isQuote 
                      ? "bg-gradient-to-r from-[#0B4F8A] to-[#EA6A12] text-white px-2.5 py-1.5 lg:px-4 lg:py-2 xl:px-5 xl:py-2.5 rounded-full hover:shadow-lg ml-1 md:ml-1.5 xl:ml-3 hover:scale-[1.03] transition-transform duration-150"
                      : (scrolled ? "text-slate-700 hover:text-[#0B4F8A]" : "text-white/90 hover:text-white")
                  )}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              );
            })}

            {/* Language Switcher */}
            <div className="relative ml-1 lg:ml-2">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                type="button"
                aria-label="Select language"
                aria-expanded={showLanguageDropdown}
                aria-haspopup="menu"
                className={cn(
                   "flex items-center gap-1 text-[10px] lg:text-xs xl:text-sm font-black transition-colors py-2 px-1",
                  scrolled ? "text-slate-700 hover:text-[#0B4F8A]" : "text-white/90 hover:text-white"
                )}
              >
                <Globe className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span>{currentLangLabel}</span>
              </button>
              
              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 py-2 w-36 bg-white rounded-xl shadow-xl border border-slate-100 flex flex-col z-50">
                  <button onClick={() => handleLanguageChange('en')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">English (EN)</button>
                  <button onClick={() => handleLanguageChange('zh')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">中文 (ZH)</button>
                  <button onClick={() => handleLanguageChange('ru')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">Русский (RU)</button>
                  <button onClick={() => handleLanguageChange('fr')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">Français (FR)</button>
                  <button onClick={() => handleLanguageChange('es')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">Español (ES)</button>
                  <button onClick={() => handleLanguageChange('ar')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">العربية (AR)</button>
                  <button onClick={() => handleLanguageChange('pt')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">Português (PT)</button>
                  <button onClick={() => handleLanguageChange('tr')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">Türkçe (TR)</button>
                </div>
              )}
            </div>
          </div>

          <div className="min-[1360px]:hidden flex items-center gap-4">
            {/* Mobile Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                type="button"
                aria-label="Select language"
                aria-expanded={showLanguageDropdown}
                aria-haspopup="menu"
                className={cn(
                  "flex items-center gap-1.5 text-xs font-black transition-colors px-2.5 py-1.5 rounded-full bg-black/10 border border-white/10",
                  scrolled ? "text-slate-700 bg-slate-100 border-slate-200" : "text-white/90"
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                {currentLangLabel}
              </button>
              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 py-2 w-36 bg-white rounded-xl shadow-xl border border-slate-100 flex flex-col z-50">
                  <button onClick={() => handleLanguageChange('en')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">English (EN)</button>
                  <button onClick={() => handleLanguageChange('zh')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">中文 (ZH)</button>
                  <button onClick={() => handleLanguageChange('ru')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">Русский (RU)</button>
                  <button onClick={() => handleLanguageChange('fr')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">Français (FR)</button>
                  <button onClick={() => handleLanguageChange('es')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">Español (ES)</button>
                  <button onClick={() => handleLanguageChange('ar')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">العربية (AR)</button>
                  <button onClick={() => handleLanguageChange('pt')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">Português (PT)</button>
                  <button onClick={() => handleLanguageChange('tr')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] font-bold">Türkçe (TR)</button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-menu"
              className={cn("grid min-h-11 min-w-11 place-items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#763c9c] focus-visible:ring-offset-2", scrolled ? "text-slate-900" : "text-white")}
            >
              {isOpen ? <X className="h-6.5 w-6.5" /> : <Menu className="h-6.5 w-6.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-navigation-menu" className="min-[1360px]:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl overflow-y-auto max-h-[85vh]">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navKeys.map((item) => {
              if (item.isDropdown) {
                return (
                  <div key={item.key} className="space-y-1 block py-1 border-b border-slate-100/60 pb-3">
                    <span className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t(`nav.${item.key}`)}
                    </span>
                    <div className="pl-4 border-l-2 border-sky-100 ml-4 space-y-1.5">
                      {serviceItems.map((sub) => (
                        <Link
                          key={sub.key}
                          to={getLocalizedPath(sub.href)}
                          onClick={closeMenu}
                          className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-sky-50 hover:text-[#0B4F8A] rounded-lg transition-colors"
                        >
                          {t(`nav.${sub.key}`)}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              if (item.isSourcingMenu) {
                return (
                  <div key={item.key} className="block space-y-1 border-b border-slate-100/60 py-1 pb-3">
                    <span className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      {sourcingMenuLabels[language]}
                    </span>
                    <div className="ml-4 space-y-1.5 border-l-2 border-amber-400 pl-4">
                      {sourcingItems.map((sub) => (
                        <Link
                          key={sub.href}
                          to={getLocalizedPath(sub.href)}
                          onClick={closeMenu}
                          className="block px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-amber-50 hover:text-[#0B4F8A]"
                        >
                          {sub.labels[language]}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              if (item.isMegaMenu) {
                return (
                  <div key={item.key} className="space-y-1 block py-1 border-b border-slate-100/60 pb-3">
                    <button 
                      type="button"
                      onClick={() => setShowMobileRegions(!showMobileRegions)}
                      aria-expanded={showMobileRegions}
                      aria-controls="mobile-region-navigation"
                      className="w-full flex min-h-11 items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#763c9c] focus-visible:ring-inset"
                    >
                      <span>{t(`nav.${item.key}`)}</span>
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", showMobileRegions ? "rotate-180" : "")} />
                    </button>
                    {showMobileRegions && (
                      <div id="mobile-region-navigation" className="pl-4 border-l-2 border-[#FF8A00] ml-4 mt-1.5 space-y-4">
                        {regionColumns.map((col) => (
                          <div key={col.key} className="space-y-1.5">
                            <h5 className="text-[11px] font-black text-[#0B4F8A] uppercase tracking-wide">
                              {t(`nav.${col.key}`)}
                            </h5>
                            <div className="grid grid-cols-2 gap-2">
                              {col.countries.map((country, idx) => {
                                const label = country[language as keyof typeof country] || country.en;
                                const countrySlug = country.en.toLowerCase().replace(/\s+/g, '-');
                                
                                return (
                                  <Link
                                    key={idx}
                                    to={getLocalizedPath(`/shipping-from-china-to-${countrySlug}`)}
                                    onClick={closeMenu}
                                    className="block py-1.5 text-xs font-semibold text-slate-600 hover:text-[#0B4F8A]"
                                  >
                                    <MapPin className="w-3.5 h-3.5 inline-block mr-1 text-amber-600" aria-hidden="true" />
                                    {label}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const isQuote = item.key === 'get_a_quote';
              return (
                <Link
                  key={item.key}
                  to={getLocalizedPath(item.href || '')}
                  onClick={closeMenu}
                  className={cn(
                    "block px-4 py-2.5 text-sm font-bold transition-colors",
                    isQuote
                      ? "bg-gradient-to-r from-[#0B4F8A] to-[#EA6A12] text-white text-center rounded-lg mt-4 shadow-md"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#0B4F8A]"
                  )}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
