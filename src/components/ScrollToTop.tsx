import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();
  const label = {
    en: 'Scroll to top', zh: '返回顶部', ru: 'Наверх', fr: 'Retour en haut', es: 'Volver arriba', ar: 'العودة إلى الأعلى',
  }[language];

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-32 md:bottom-28 right-6 z-40"
        >
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center w-12 h-12 bg-slate-800/80 backdrop-blur-sm text-white rounded-full shadow-xl hover:bg-violet-600 hover:shadow-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            aria-label={label}
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
