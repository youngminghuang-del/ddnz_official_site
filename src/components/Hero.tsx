import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { getImgUrl } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../lib/utils';

export default function Hero() {
  const { t } = useLanguage();

  const handleWhatsAppClick = () => {
    trackEvent('contact_whatsapp_click', { 'location': 'hero_section' });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900 font-sans">
      <div className="absolute inset-0 z-0">
        <img
          src={getImgUrl('HERO_BG')}
          alt="DDNZ Global - Logistics Hub"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-wider uppercase leading-tight mb-6">
            {t('hero.title1')} <br className="hidden md:block" />
            <span className="text-white">{t('hero.title2')}</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-slate-100 max-w-3xl mx-auto font-medium mb-10">
            {t('hero.subtitle')}
          </p>
          
          <a
            href="https://wa.me/85261077362?text=Hi%20DDNZ%20Global,%20I%27m%20interested%20in%20your%20logistics%20services.%20Can%20we%20talk?"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="inline-flex items-center px-10 py-4 text-lg font-bold rounded-full text-white bg-[#25D366] hover:bg-[#20bd5a] hover:shadow-xl transition-all transform hover:-translate-y-1 mb-6"
          >
            <MessageCircle className="w-6 h-6 mr-3" />
            {t('hero.chat')}
          </a>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-slate-100/90 text-sm md:text-base font-semibold tracking-wide"
          >
            {t('hero.alibaba_cta')}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

