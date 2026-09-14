import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Language, translations } from '../i18n/translations';
import { isNavigationLanguage, resolveNavigationLanguage } from '../lib/productLanguageRouting';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    let saved: Language = 'en';
    try {
      const value = localStorage.getItem('language');
      if (isNavigationLanguage(value)) saved = value;
    } catch { /* The URL still works when storage is unavailable. */ }
    return resolveNavigationLanguage(window.location.pathname, saved, window.history.state?.usr);
  });

  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch { /* Preference persistence is optional. */ }
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch { /* Navigation remains usable without storage. */ }
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const t = (path: string): any => {
    const keys = path.split('.');
    
    const getVal = (obj: any, ks: string[]) => {
      let current = obj;
      for (const key of ks) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return undefined;
        }
      }
      return current;
    };

    let result = getVal((translations as Record<string, unknown>)[language] || translations.en, keys);
    
    if (result === undefined && language !== 'en') {
      console.warn(`Translation key missing: ${path} for lang ${language}`);
      result = getVal(translations['en'], keys);
    }
    
    if (result === undefined) {
      if (path.endsWith('.highlights')) return [];
      return path;
    }
    
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
