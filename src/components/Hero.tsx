import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { getImgUrl } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../lib/utils';

export default function Hero() {
  const { t } = useLanguage();

  const handleWhatsAppClick = () => {
    trackEvent('contact_whatsapp_click', { 'location': 'hero_section' });
  };

  const handlePrimaryCtaClick = () => {
    trackEvent('hero_primary_cta_click', { 'location': 'hero_section' });
  };

  return (
    <section className="relative h-screen min-h-[680px] flex items-center justify-center overflow-hidden bg-slate-950 font-sans">
      <div className="absolute inset-0 z-0">
        <img
          src={getImgUrl('HERO_BG')}
          alt="China Freight Forwarder - Heaven Born Global Logistics Hub Since 1997"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        {/* Asymmetric Gradient Mask Overlay & Ambient Darkening */}
        <div className="absolute inset-0 bg-slate-950/45 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(75,39,177,0.15)_0%,transparent_80%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center"
        >
          {/* Dual Pill Badges Header */}
          <div className="flex flex-wrap items-center justify-center gap-y-2.5 mb-6 max-w-3xl">
            {/* Badge 1: Top-Tier China Freight Forwarder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-purple-950/40 text-purple-300 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide inline-flex items-center gap-1.5 mr-2"
            >
              {t('hero.badge_forwarder') || '🇨🇳 Top-Tier China Freight Forwarder'}
            </motion.div>

            {/* Badge 2: Alibaba Glow Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide inline-flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {t('hero.alibaba_badge') || '✨ Sourcing from Alibaba? We Inspect & Consolidate'}
            </motion.div>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-4 max-w-4xl break-words [overflow-wrap:anywhere]">
            {t('hero.title1') || 'Your Premier China Freight Forwarder'} <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 font-extrabold">
              {t('hero.title2') || 'For Global Logistics Solutions.'}
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 mt-4 font-normal">
            {t('hero.subtitle')}
          </p>
          
          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10">
            {/* Primary Action Button */}
            <a
              href="#get-a-quote"
              onClick={handlePrimaryCtaClick}
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base font-bold rounded-full text-white bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-95 hover:shadow-xl hover:shadow-purple-500/10 transition-all transform hover:-translate-y-0.5 active:scale-95 duration-200 cursor-pointer"
            >
              {t('hero.primary_cta') || 'Calculate Freight & Get Quote'}
              <ArrowRight className="w-4 h-4 ml-2 animate-pulse" />
            </a>

            {/* WhatsApp Chat Button */}
            <a
              href="https://wa.me/85261077362?text=Hi%20DDNZ%20Global,%20I%27m%20interested%20in%20your%20logistics%20services.%20Can%20we%20talk?"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base font-bold rounded-full text-white bg-[#25D366] hover:bg-[#20bd5a] hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 duration-200"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t('hero.chat') || 'Chat on WhatsApp'}
            </a>
          </div>

          {/* Service Badges Strip */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto px-2"
          >
            <div className="inline-flex items-center bg-white/5 border border-white/10 hover:border-[#FF8A00]/40 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-medium transition-all duration-300 mr-2 mb-2">
              {t('hero.services.sea') || '⚓ Sea Freight (FCL/LCL)'}
            </div>
            <div className="inline-flex items-center bg-white/5 border border-white/10 hover:border-[#FF8A00]/40 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-medium transition-all duration-300 mr-2 mb-2">
              {t('hero.services.air') || '✈️ Air Freight'}
            </div>
            <div className="inline-flex items-center bg-white/5 border border-white/10 hover:border-[#FF8A00]/40 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-medium transition-all duration-300 mr-2 mb-2">
              {t('hero.services.fba') || '📦 Amazon FBA Shipping'}
            </div>
            <div className="inline-flex items-center bg-white/5 border border-white/10 hover:border-[#FF8A00]/40 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-medium transition-all duration-300 mr-2 mb-2">
              {t('hero.services.warehouse') || '🏬 China Warehouse Services'}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
