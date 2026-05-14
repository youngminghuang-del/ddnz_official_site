import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { cn, trackEvent } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';

const navKeys = [
  { key: 'who_we_are', href: '#who-we-are' },
  { key: 'what_we_do', href: '#what-we-do' },
  { key: 'why_ddnz', href: '#why-ddnz' },
  { key: 'our_facilities', href: '#our-facilities' },
  { key: 'insights', href: '#insights' },
  { key: 'get_a_quote', href: '#get-a-quote' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowLanguageDropdown(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleLanguageChange = (lang: Language) => {
    trackEvent('language_select', { 'language': lang });
    setLanguage(lang);
    setShowLanguageDropdown(false);
  };

  const currentLangLabel = language === 'en' ? 'EN' : language === 'ru' ? 'RU' : 'FR';

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-gradient-to-b from-black/80 to-transparent py-5'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo + Text */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center gap-3 group">
              <img 
                src="https://raw.githubusercontent.com/youngminghuang-del/ddnz_photo_assets/main/website_logo_ddnzglobal_512x512.png" 
                alt="DDNZ Global Logo" 
                loading="lazy"
                className="h-7 md:h-9 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <span className={cn(
                "text-xl sm:text-2xl font-extrabold tracking-tight transition-all font-sans",
                scrolled ? "text-slate-900" : "text-white"
              )}>
                DDNZ Global
              </span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 ml-auto">
            {navKeys.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={cn(
                  "text-sm tracking-widest font-bold transition-all whitespace-nowrap",
                  item.key === 'get_a_quote' 
                    ? "bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] text-white px-6 py-2 rounded-full hover:shadow-lg ml-2" 
                    : (scrolled ? "text-slate-700 hover:text-[#4B27B1]" : "text-white/90 hover:text-white")
                )}
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}

            {/* Language Switcher */}
            <div className="relative ml-2">
              <button 
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-bold transition-colors py-2 px-1",
                  scrolled ? "text-slate-700 hover:text-[#4B27B1]" : "text-white/90 hover:text-white"
                )}
              >
                <Globe className="w-4 h-4" />
                <span>{currentLangLabel}</span>
              </button>
              
              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 py-2 w-32 bg-white rounded-lg shadow-xl border border-slate-100 flex flex-col z-50">
                  <button onClick={() => handleLanguageChange('en')} className="px-4 py-2 text-sm text-left text-slate-700 hover:bg-purple-50 hover:text-[#4B27B1] font-medium">English (EN)</button>
                  <button onClick={() => handleLanguageChange('ru')} className="px-4 py-2 text-sm text-left text-slate-700 hover:bg-purple-50 hover:text-[#4B27B1] font-medium">Русский (RU)</button>
                  <button onClick={() => handleLanguageChange('fr')} className="px-4 py-2 text-sm text-left text-slate-700 hover:bg-purple-50 hover:text-[#4B27B1] font-medium">Français (FR)</button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-6">
            {/* Mobile Language Switcher (Simple inline text) */}
            <button 
                onClick={() => handleLanguageChange(language === 'en' ? 'ru' : language === 'ru' ? 'fr' : 'en')}
                className={cn(
                  "flex items-center gap-1 text-xs font-bold transition-colors",
                  scrolled ? "text-slate-700" : "text-white/90"
                )}
              >
                <Globe className="w-4 h-4" />
                {currentLangLabel}
            </button>

            <button onClick={() => setIsOpen(!isOpen)} className={cn("p-2 -mr-2 rounded-md focus:outline-none", scrolled ? "text-slate-900" : "text-white")}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navKeys.map((item) => {
              const isQuote = item.key === 'get_a_quote';
              return (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "block px-4 py-3 text-base font-semibold transition-colors",
                    isQuote
                      ? "bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] text-white text-center rounded-lg mt-4 shadow-sm"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#4B27B1] rounded-lg"
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
