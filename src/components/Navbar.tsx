import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { cn, trackEvent } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';

const navKeys = [
  { key: 'who_we_are', href: '/#who-we-are' },
  { key: 'what_we_do', href: '/#what-we-do' },
  { key: 'why_ddnz', href: '/#why-ddnz' },
  { key: 'services', isDropdown: true },
  { key: 'insights', href: '/insights' },
  { key: 'get_a_quote', href: '/#get-a-quote' },
];

const serviceItems = [
  { key: 'services_sea', href: '/services/sea-freight' },
  { key: 'services_air', href: '/services/air-freight' },
  { key: 'services_fba', href: '/services/amazon-fba' },
  { key: 'services_warehouse', href: '/services/warehouse-services' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo + Text */}
          <div className="flex-shrink-0">
            <Link to={getLocalizedPath('/')} className="flex items-center gap-3 group">
              <img 
                src="https://raw.githubusercontent.com/youngminghuang-del/ddnz_photo_assets/main/website_logo_ddnzglobal_512x512.png" 
                alt="DDNZ Global Logo" 
                loading="lazy"
                className="h-8 md:h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <span className={cn(
                "text-xl sm:text-2xl font-black tracking-tight transition-all font-sans",
                scrolled ? "text-slate-900" : "text-white"
              )}>
                DDNZ Global
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-5 lg:space-x-7 ml-auto">
            {navKeys.map((item) => {
              if (item.isDropdown) {
                return (
                  <div key={item.key} className="relative group/nav py-2">
                    <button
                      className={cn(
                        "text-xs lg:text-sm tracking-widest font-extrabold transition-all whitespace-nowrap flex items-center gap-1",
                        scrolled ? "text-slate-700 hover:text-[#4B27B1]" : "text-white/90 hover:text-white"
                      )}
                    >
                      <span>{t(`nav.${item.key}`)}</span>
                      <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover/nav:rotate-180" strokeWidth={2.5} />
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

              const isQuote = item.key === 'get_a_quote';
              return (
                <a
                  key={item.key}
                  href={getLocalizedPath(item.href || '')}
                  className={cn(
                    "text-xs lg:text-sm tracking-widest font-extrabold transition-all whitespace-nowrap",
                    isQuote 
                      ? "bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] text-white px-5 py-2 rounded-full hover:shadow-lg ml-2 hover:scale-[1.03] transition-transform duration-150" 
                      : (scrolled ? "text-slate-700 hover:text-[#4B27B1]" : "text-white/90 hover:text-white")
                  )}
                >
                  {t(`nav.${item.key}`)}
                </a>
              );
            })}

            {/* Language Switcher */}
            <div className="relative ml-2">
              <button 
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className={cn(
                  "flex items-center gap-1.5 text-xs lg:text-sm font-extrabold transition-colors py-2 px-1",
                  scrolled ? "text-slate-700 hover:text-[#4B27B1]" : "text-white/90 hover:text-white"
                )}
              >
                <Globe className="w-3.5 h-3.5" />
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
                  "flex items-center gap-1 text-xs font-black transition-colors px-2 py-1 rounded bg-black/10 border border-white/10",
                  scrolled ? "text-slate-700 bg-slate-100 border-slate-200" : "text-white/90"
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                {currentLangLabel}
            </button>

            <button onClick={() => setIsOpen(!isOpen)} className={cn("p-1 focus:outline-none", scrolled ? "text-slate-900" : "text-white")}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
