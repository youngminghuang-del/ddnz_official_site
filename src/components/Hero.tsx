import { motion } from 'framer-motion';
import { BadgeCheck, ClipboardCheck, MessageCircle, ArrowRight, Ship, Plane, PackageCheck, Warehouse } from 'lucide-react';
import { getImgUrl } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../lib/utils';

export default function Hero() {
  const { t } = useLanguage();

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', { cta_location: 'hero_section' });
  };

  const handlePrimaryCtaClick = () => {
    trackEvent('quote_click', { cta_location: 'hero_section' });
  };

  return (
    <section className="relative min-h-[680px] min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#071A33] font-sans">
      <div className="absolute inset-0 z-0">
        <img
          src={getImgUrl('HERO_BG')}
          alt="China Freight Forwarder - Heaven Born Global Logistics Hub Since 1997"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        {/* Asymmetric Gradient Mask Overlay & Ambient Darkening */}
        <div className="absolute inset-0 bg-[#071A33]/55 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071A33]/95 via-[#0B2A4A]/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,136,229,0.15)_0%,transparent_80%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center"
        >
          {/* Dual Pill Badges Header */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6 max-w-3xl">
            {/* Badge 1: Top-Tier China Freight Forwarder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-blue-950/45 text-blue-100 border border-blue-300/30 px-4 py-2 rounded-full text-sm font-bold tracking-wide inline-flex items-center gap-2"
            >
              <BadgeCheck className="w-4 h-4 shrink-0 text-sky-300" aria-hidden="true" />
              {t('hero.badge_forwarder') || 'Top-Tier China Freight Forwarder'}
            </motion.div>

            {/* Badge 2: Alibaba Glow Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-amber-500/10 text-amber-200 border border-amber-400/30 px-4 py-2 rounded-full text-sm font-bold tracking-wide inline-flex items-center gap-2"
            >
              <ClipboardCheck className="w-4 h-4 shrink-0 text-amber-300" aria-hidden="true" />
              {t('hero.alibaba_badge') || 'Sourcing from Alibaba? We Inspect & Consolidate'}
            </motion.div>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-4 max-w-4xl break-words [overflow-wrap:anywhere]">
            {t('hero.title1') || 'Your Premier China Freight Forwarder'} <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-blue-300 to-amber-300 font-extrabold">
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
              data-analytics-tracked="true"
              onClick={handlePrimaryCtaClick}
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base font-bold rounded-full text-white bg-gradient-to-r from-[#EA6A12] to-[#F59E0B] hover:opacity-95 hover:shadow-xl hover:shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 duration-200 cursor-pointer"
            >
              {t('hero.primary_cta') || 'Calculate Freight & Get Quote'}
              <ArrowRight className="w-4 h-4 ml-2 animate-pulse" />
            </a>

            {/* WhatsApp Chat Button */}
            <a
              href="https://wa.me/85261077362?text=Hi%20DDNZ%20Global,%20I%27m%20interested%20in%20your%20logistics%20services.%20Can%20we%20talk?"
              data-analytics-tracked="true"
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
            {[
              { icon: Ship, label: t('hero.services.sea') || 'Sea Freight (FCL/LCL)' },
              { icon: Plane, label: t('hero.services.air') || 'Air Freight' },
              { icon: PackageCheck, label: t('hero.services.fba') || 'Amazon FBA Shipping' },
              { icon: Warehouse, label: t('hero.services.warehouse') || 'China Warehouse Services' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="inline-flex items-center gap-2 bg-white/5 border border-white/15 hover:border-[#F59E0B]/50 rounded-lg px-4 py-2 text-sm text-slate-100 font-semibold transition-all duration-300">
                <Icon className="w-4 h-4 shrink-0 text-sky-300" aria-hidden="true" />
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
