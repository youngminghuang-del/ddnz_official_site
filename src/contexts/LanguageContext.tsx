import React, { createContext, useState, useContext, useEffect } from 'react';
import { Language, translations } from '../i18n/translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('language') as Language;
      if (saved && (saved === 'en' || saved === 'zh' || saved === 'ru' || saved === 'fr')) {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      } else {
        document.documentElement.lang = 'en';
      }
    } catch (e) {
      console.warn('LocalStorage not accessible', e);
      document.documentElement.lang = 'en';
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (e) {
      console.warn('LocalStorage not accessible', e);
    }
    document.documentElement.lang = lang;
  };

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

    let result = getVal(translations[language], keys);
    
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
