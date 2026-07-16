import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, trackEvent } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';

const navKeys = [
  { key: 'who_we_are', href: '/#who-we-are' },
  { key: 'what_we_do', href: '/#what-we-do' },
  { key: 'why_ddnz', href: '/#why-ddnz' },
  { key: 'services', isDropdown: true },
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

const regionColumns = [
  {
    key: 'region_middle_east',
    countries: [
      { en: 'Saudi Arabia', zh: '沙特阿拉伯', ru: 'Саудовская Аравия', fr: 'Arabie Saoudite' },
      { en: 'UAE', zh: '阿联酋', ru: 'ОАЭ', fr: 'Émirats Arabes Unis' },
      { en: 'Kuwait', zh: '科威特', ru: 'Кувейт', fr: 'Koweït' },
    ]
  },
  {
    key: 'region_central_asia',
    countries: [
      { en: 'Kazakhstan', zh: '哈萨克斯坦', ru: 'Казахстан', fr: 'Kazakhstan' },
      { en: 'Uzbekistan', zh: '乌兹别克斯坦', ru: 'Узбекистан', fr: 'Ouzbékistan' },
    ]
  },
  {
    key: 'region_west_africa',
    countries: [
      { en: 'Nigeria', zh: '尼日利亚', ru: 'Нигерия', fr: 'Nigéria' },
      { en: 'Ghana', zh: '加纳', ru: 'Гана', fr: 'Ghana' },
    ]
  },
  {
    key: 'region_latin_america',
    countries: [
      { en: 'Brazil', zh: '巴西', ru: 'Бразилия', fr: 'Brésil' },
      { en: 'Mexico', zh: '墨西哥', ru: 'Мексика', fr: 'Mexique' },
      { en: 'Argentina', zh: '阿根廷', ru: 'Аргентина', fr: 'Argentine' },
      { en: 'Chile', zh: '智利', ru: 'Чили', fr: 'Chili' },
      { en: 'Peru', zh: '秘鲁', ru: 'Перу', fr: 'Pérou' },
    ]
  }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showMobileRegions, setShowMobileRegions] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowLanguageDropdown(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  // Helper to resolve localized URL path
  const getLocalizedPath = (path: string) => {
    if (path.startsWith('/#')) {
      if (language === 'zh') return `/zh-cn/${path.slice(1)}`;
      if (language === 'ru') return `/ru/${path.slice(1)}`;
      if (language === 'fr') return `/fr/${path.slice(1)}`;
      return path;
    }
    if (language === 'zh') return `/zh-cn${path === '/' ? '' : path}`;
    if (language === 'ru') return `/ru${path === '/' ? '' : path}`;
    if (language === 'fr') return `/fr${path === '/' ? '' : path}`;
    return path;
  };

  const handleLanguageChange = (lang: Language) => {
    trackEvent('language_select', { 'language': lang });
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

  const currentLangLabel = 
    language === 'en' ? 'EN' : 
    language === 'zh' ? 'ZH' : 
    language === 'ru' ? 'RU' : 'FR';

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
                src="https://raw.githubusercontent.com/youngminghuang-del/ddnz_photo_assets/main/heaven_born_logo_wing_transparent.png" 
                alt="Heaven Born International Freight Logo" 
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
                      国际物流
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
                      scrolled ? "text-purple-600 font-bold" : "text-white/90"
                    )}>
                      International Freight
                    </span>
                  </>
                )}
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4 xl:space-x-6 ml-auto pl-2 md:pl-4">
            {navKeys.map((item) => {
              if (item.isDropdown) {
                return (
                  <div key={item.key} className="relative group/nav py-2">
                    <button
                      className={cn(
                        "text-[10px] lg:text-xs xl:text-sm tracking-wider xl:tracking-widest font-black transition-all whitespace-nowrap flex items-center gap-0.5 lg:gap-1",
                        scrolled ? "text-slate-700 hover:text-[#4B27B1]" : "text-white/90 hover:text-white"
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
                            className="px-5 py-2.5 text-[11px] lg:text-xs tracking-widest uppercase font-black text-slate-700 hover:bg-purple-50 hover:text-[#4B27B1] transition-colors"
                          >
                            {t(`nav.${sub.key}`)}
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
                  >
                    <button
                      className={cn(
                        "text-[10px] lg:text-xs xl:text-sm tracking-wider xl:tracking-widest font-black transition-all whitespace-nowrap flex items-center gap-0.5 lg:gap-1 cursor-pointer",
                        scrolled ? "text-slate-700 hover:text-[#4B27B1]" : "text-white/90 hover:text-white"
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
                            {/* Accent top bar using purple-orange theme gradient */}
                            <div className="h-1.5 bg-gradient-to-r from-[#4B27B1] via-[#8552D2] to-[#FF8A00]" />
                            
                            <div className="p-6 md:p-8 grid grid-cols-4 gap-4 md:gap-6">
                              {regionColumns.map((col) => (
                                <div key={col.key} className="flex flex-col space-y-3">
                                  <h4 className="text-[11px] lg:text-xs tracking-wider font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] uppercase border-b border-slate-100 pb-1.5 whitespace-nowrap">
                                    {t(`nav.${col.key}`)}
                                  </h4>
                                  <div className="flex flex-col space-y-2">
                                    {col.countries.map((country, idx) => {
                                      const label = country[language as 'en' | 'zh' | 'ru' | 'fr'] || country.en;
                                      const isMiddleEast = col.key === 'region_middle_east';
                                      const isCentralAsia = col.key === 'region_central_asia';
                                      const isWestAfrica = col.key === 'region_west_africa';
                                      const isLatinAmerica = col.key === 'region_latin_america';
                                      
                                      return isMiddleEast ? (
                                        <Link
                                          key={idx}
                                          to={getLocalizedPath(`/shipping-from-china-to-middle-east?country=${country.en === 'Saudi Arabia' ? 'saudi-arabia' : country.en.toLowerCase()}`)}
                                          onClick={() => {
                                            setShowMegaMenu(false);
                                            trackEvent('region_link_click', { country: country.en, specialized: true });
                                          }}
                                          className="text-[11px] lg:text-xs font-bold text-slate-600 hover:text-[#4B27B1] transition-colors flex items-center gap-1 group/item"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] group-hover/item:bg-[#4B27B1] transition-colors" />
                                          <span className="group-hover/item:translate-x-1 transition-transform duration-200 whitespace-nowrap">
                                            {label}
                                          </span>
                                        </Link>
                                      ) : isCentralAsia ? (
                                        <Link
                                          key={idx}
                                          to={getLocalizedPath(`/shipping-from-china-to-central-asia?country=${country.en.toLowerCase()}`)}
                                          onClick={() => {
                                            setShowMegaMenu(false);
                                            trackEvent('region_link_click', { country: country.en, specialized: true });
                                          }}
                                          className="text-[11px] lg:text-xs font-bold text-slate-600 hover:text-[#4B27B1] transition-colors flex items-center gap-1 group/item"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] group-hover/item:bg-[#4B27B1] transition-colors" />
                                          <span className="group-hover/item:translate-x-1 transition-transform duration-200 whitespace-nowrap">
                                            {label}
                                          </span>
                                        </Link>
                                      ) : isWestAfrica ? (
                                        <Link
                                          key={idx}
                                          to={getLocalizedPath(`/shipping-from-china-to-west-africa?country=${country.en.toLowerCase()}`)}
                                          onClick={() => {
                                            setShowMegaMenu(false);
                                            trackEvent('region_link_click', { country: country.en, specialized: true });
                                          }}
                                          className="text-[11px] lg:text-xs font-bold text-slate-600 hover:text-[#4B27B1] transition-colors flex items-center gap-1 group/item"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] group-hover/item:bg-[#4B27B1] transition-colors" />
                                          <span className="group-hover/item:translate-x-1 transition-transform duration-200 whitespace-nowrap">
                                            {label}
                                          </span>
                                        </Link>
                                      ) : isLatinAmerica ? (
                                        <Link
                                          key={idx}
                                          to={getLocalizedPath(`/shipping-from-china-to-latin-america?country=${country.en.toLowerCase()}`)}
                                          onClick={() => {
                                            setShowMegaMenu(false);
                                            trackEvent('region_link_click', { country: country.en, specialized: true });
                                          }}
                                          className="text-[11px] lg:text-xs font-bold text-slate-600 hover:text-[#4B27B1] transition-colors flex items-center gap-1 group/item"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] group-hover/item:bg-[#4B27B1] transition-colors" />
                                          <span className="group-hover/item:translate-x-1 transition-transform duration-200 whitespace-nowrap">
                                            {label}
                                          </span>
                                        </Link>
                                      ) : (
                                        <a
                                          key={idx}
                                          href={getLocalizedPath('/#get-a-quote')}
                                          onClick={() => {
                                            setShowMegaMenu(false);
                                            trackEvent('region_link_click', { country: country.en });
                                          }}
                                          className="text-[11px] lg:text-xs font-bold text-slate-600 hover:text-[#4B27B1] transition-colors flex items-center gap-1 group/item"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]/70 group-hover/item:bg-[#4B27B1] transition-colors" />
                                          <span className="group-hover/item:translate-x-1 transition-transform duration-200 whitespace-nowrap">
                                            {label}
                                          </span>
                                        </a>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Mega menu footer banner */}
                            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-[10px] lg:text-xs">
                              <span className="font-medium text-slate-500">
                                {language === 'zh' ? '⭐ 29年跨境物流专线安全保障' : 
                                 language === 'ru' ? '⭐ 29 лет безопасных грузоперевозок' :
                                 language === 'fr' ? '⭐ 29 ans de sécurité logistique' :
                                 '⭐ 29 Years of Secure Regional Freight forwarding'}
                              </span>
                              <a 
                                href={getLocalizedPath('/#get-a-quote')}
                                onClick={() => setShowMegaMenu(false)}
                                className="font-extrabold text-[#4B27B1] hover:text-[#FF8A00] transition-colors flex items-center gap-0.5"
                              >
                                {language === 'zh' ? '立即询价 ➔' : 
                                 language === 'ru' ? 'Запросить ставку ➔' :
                                 language === 'fr' ? 'Demander un devis ➔' :
                                 'Inquire Now ➔'}
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
                <a
                  key={item.key}
                  href={getLocalizedPath(item.href || '')}
                  className={cn(
                    "text-[10px] lg:text-xs xl:text-sm tracking-wider xl:tracking-widest font-black transition-all whitespace-nowrap",
                    isQuote 
                      ? "bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] text-white px-2.5 py-1.5 lg:px-4 lg:py-2 xl:px-5 xl:py-2.5 rounded-full hover:shadow-lg ml-1 md:ml-1.5 xl:ml-3 hover:scale-[1.03] transition-transform duration-150" 
                      : (scrolled ? "text-slate-700 hover:text-[#4B27B1]" : "text-white/90 hover:text-white")
                  )}
                >
                  {t(`nav.${item.key}`)}
                </a>
              );
            })}

            {/* Language Switcher */}
            <div className="relative ml-1 lg:ml-2">
              <button 
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className={cn(
                   "flex items-center gap-1 text-[10px] lg:text-xs xl:text-sm font-black transition-colors py-2 px-1",
                  scrolled ? "text-slate-700 hover:text-[#4B27B1]" : "text-white/90 hover:text-white"
                )}
              >
                <Globe className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span>{currentLangLabel}</span>
              </button>
              
              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 py-2 w-36 bg-white rounded-xl shadow-xl border border-slate-100 flex flex-col z-50">
                  <button onClick={() => handleLanguageChange('en')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-purple-50 hover:text-[#4B27B1] font-bold">English (EN)</button>
                  <button onClick={() => handleLanguageChange('zh')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-purple-50 hover:text-[#4B27B1] font-bold">中文 (ZH)</button>
                  <button onClick={() => handleLanguageChange('ru')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-purple-50 hover:text-[#4B27B1] font-bold">Русский (RU)</button>
                  <button onClick={() => handleLanguageChange('fr')} className="px-4 py-2 text-xs text-left text-slate-700 hover:bg-purple-50 hover:text-[#4B27B1] font-bold">Français (FR)</button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            {/* Mobile Language Switcher (Circular Toggle) */}
            <button 
                onClick={() => handleLanguageChange(language === 'en' ? 'zh' : language === 'zh' ? 'ru' : language === 'ru' ? 'fr' : 'en')}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-black transition-colors px-2.5 py-1.5 rounded-full bg-black/10 border border-white/10",
                  scrolled ? "text-slate-700 bg-slate-100 border-slate-200" : "text-white/90"
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                {currentLangLabel}
            </button>

            <button onClick={() => setIsOpen(!isOpen)} className={cn("p-1 focus:outline-none", scrolled ? "text-slate-900" : "text-white")}>
              {isOpen ? <X className="h-6.5 w-6.5" /> : <Menu className="h-6.5 w-6.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl overflow-y-auto max-h-[85vh]">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navKeys.map((item) => {
              if (item.isDropdown) {
                return (
                  <div key={item.key} className="space-y-1 block py-1 border-b border-slate-100/60 pb-3">
                    <span className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t(`nav.${item.key}`)}
                    </span>
                    <div className="pl-4 border-l-2 border-purple-100 ml-4 space-y-1.5">
                      {serviceItems.map((sub) => (
                        <Link
                          key={sub.key}
                          to={getLocalizedPath(sub.href)}
                          onClick={closeMenu}
                          className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-purple-50 hover:text-[#4B27B1] rounded-lg transition-colors"
                        >
                          {t(`nav.${sub.key}`)}
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
                      onClick={() => setShowMobileRegions(!showMobileRegions)}
                      className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 focus:outline-none"
                    >
                      <span>{t(`nav.${item.key}`)}</span>
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", showMobileRegions ? "rotate-180" : "")} />
                    </button>
                    {showMobileRegions && (
                      <div className="pl-4 border-l-2 border-[#FF8A00] ml-4 mt-1.5 space-y-4">
                        {regionColumns.map((col) => (
                          <div key={col.key} className="space-y-1.5">
                            <h5 className="text-[11px] font-black text-[#4B27B1] uppercase tracking-wide">
                              {t(`nav.${col.key}`)}
                            </h5>
                            <div className="grid grid-cols-2 gap-2">
                              {col.countries.map((country, idx) => {
                                const label = country[language as 'en' | 'zh' | 'ru' | 'fr'] || country.en;
                                const isMiddleEast = col.key === 'region_middle_east';
                                const isCentralAsia = col.key === 'region_central_asia';
                                const isWestAfrica = col.key === 'region_west_africa';
                                const isLatinAmerica = col.key === 'region_latin_america';
                                
                                return isMiddleEast ? (
                                  <Link
                                    key={idx}
                                    to={getLocalizedPath(`/shipping-from-china-to-middle-east?country=${country.en === 'Saudi Arabia' ? 'saudi-arabia' : country.en.toLowerCase()}`)}
                                    onClick={closeMenu}
                                    className="block py-1.5 text-xs font-semibold text-slate-600 hover:text-[#4B27B1]"
                                  >
                                    📍 {label}
                                  </Link>
                                ) : isCentralAsia ? (
                                  <Link
                                    key={idx}
                                    to={getLocalizedPath(`/shipping-from-china-to-central-asia?country=${country.en.toLowerCase()}`)}
                                    onClick={closeMenu}
                                    className="block py-1.5 text-xs font-semibold text-slate-600 hover:text-[#4B27B1]"
                                  >
                                    📍 {label}
                                  </Link>
                                ) : isWestAfrica ? (
                                  <Link
                                    key={idx}
                                    to={getLocalizedPath(`/shipping-from-china-to-west-africa?country=${country.en.toLowerCase()}`)}
                                    onClick={closeMenu}
                                    className="block py-1.5 text-xs font-semibold text-slate-600 hover:text-[#4B27B1]"
                                  >
                                    📍 {label}
                                  </Link>
                                ) : isLatinAmerica ? (
                                  <Link
                                    key={idx}
                                    to={getLocalizedPath(`/shipping-from-china-to-latin-america?country=${country.en.toLowerCase()}`)}
                                    onClick={closeMenu}
                                    className="block py-1.5 text-xs font-semibold text-slate-600 hover:text-[#4B27B1]"
                                  >
                                    📍 {label}
                                  </Link>
                                ) : (
                                  <a
                                    key={idx}
                                    href={getLocalizedPath('/#get-a-quote')}
                                    onClick={closeMenu}
                                    className="block py-1.5 text-xs font-semibold text-slate-600 hover:text-[#4B27B1]"
                                  >
                                    📍 {label}
                                  </a>
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
                <a
                  key={item.key}
                  href={getLocalizedPath(item.href || '')}
                  onClick={closeMenu}
                  className={cn(
                    "block px-4 py-2.5 text-sm font-bold transition-colors",
                    isQuote
                      ? "bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] text-white text-center rounded-lg mt-4 shadow-md"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#4B27B1]"
                  )}
                >
                  {t(`nav.${item.key}`)}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
