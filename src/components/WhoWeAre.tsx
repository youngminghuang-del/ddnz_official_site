import { motion } from 'framer-motion';
import { getImgUrl } from '../constants';
import { History, ShieldCheck, Zap, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function WhoWeAre() {
  const { t } = useLanguage();

  const aboutCards = [
    {
      id: 'heritage',
      title: t('who_we_are.heritage.title'),
      description: t('who_we_are.heritage.desc'),
      keywords: 'SINCE 1997 • 29Y TRUST • GLOBAL',
      label: 'Established 1997',
      image: getImgUrl('JOURNEY_1999'),
      icon: <History className="w-8 h-8 md:w-12 md:h-12 text-[#4B27B1] group-hover:rotate-12 transition-transform duration-700" />
    },
    {
      id: 'nev-experts',
      title: t('who_we_are.nev.title'),
      description: t('who_we_are.nev.desc'),
      keywords: 'DG LICENSED • BATTERY • EV',
      label: 'Visionary',
      image: getImgUrl('ESS_STORAGE'),
      icon: <Target className="w-8 h-8 md:w-12 md:h-12 text-[#4B27B1] group-hover:scale-110 transition-transform" />
    },
    {
      id: 'infrastructure',
      title: t('who_we_are.infra.title'),
      description: t('who_we_are.infra.desc'),
      keywords: 'OWNED ASSETS • HUB • SECURE',
      label: 'Infrastructure',
      image: getImgUrl('JOURNEY_2004'),
      icon: <Zap className="w-8 h-8 md:w-12 md:h-12 text-[#4B27B1] group-hover:rotate-12 transition-transform" />
    },
    {
      id: 'resilience',
      title: t('who_we_are.resilience.title'),
      description: t('who_we_are.resilience.desc'),
      keywords: 'RELIABLE • A-CLASS • 24/7',
      label: 'Resilience & Trust',
      image: getImgUrl('JOURNEY_2019'),
      icon: <ShieldCheck className="w-8 h-8 md:w-12 md:h-12 text-[#4B27B1]" />
    },
  ];

  return (
    <section id="who-we-are" className="py-16 md:py-24 bg-white overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile View - Bento Grid Layout */}
        <div className="lg:hidden">
          <div className="max-w-3xl mb-12">
            <h2 className="text-[#FF8A00] font-bold tracking-[0.2em] text-[10px] uppercase mb-3">
              {t('who_we_are.label')}
            </h2>
            <h3 className="text-3xl font-black text-[#4B27B1] leading-tight flex items-center flex-wrap gap-x-4">
              {t('who_we_are.title')}
              <span className="inline-block w-12 h-1 bg-[#FF8A00] rounded-full" />
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Heritage Card - Full row on mobile */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-2 bg-[#4B27B1] rounded-3xl p-8 text-white relative overflow-hidden group flex flex-col justify-between min-h-[320px]"
            >
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-[#FF8A00] text-[9px] font-bold uppercase tracking-widest rounded-full mb-6">
                  Established 1997
                </span>
                <h4 className="text-2xl font-black leading-tight mb-4">
                  29 Years of Excellence
                </h4>
                <p className="text-purple-100/80 text-sm leading-relaxed max-w-sm">
                  {t('who_we_are.heritage.desc')}
                </p>
              </div>
              <History className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
            </motion.div>

            {/* Vision Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="col-span-1 bg-white border border-purple-100 rounded-3xl p-6 flex flex-col shadow-sm"
            >
              <span className="text-[#FF8A00] text-[9px] font-bold uppercase tracking-widest mb-4">Visionary</span>
              <Target className="w-8 h-8 text-[#4B27B1] mb-6" />
              <h4 className="text-lg font-black text-[#4B27B1] mb-3 leading-tight">{t('who_we_are.nev.title')}</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">
                {t('who_we_are.nev.desc')}
              </p>
            </motion.div>

            {/* Infrastructure Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="col-span-1 bg-white border border-purple-100 rounded-3xl p-6 flex flex-col shadow-sm"
            >
              <span className="text-[#FF8A00] text-[9px] font-bold uppercase tracking-widest mb-4">Infrastructure</span>
              <Zap className="w-8 h-8 text-[#4B27B1] mb-6" />
              <h4 className="text-lg font-black text-[#4B27B1] mb-3 leading-tight">{t('who_we_are.infra.title')}</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">
                {t('who_we_are.infra.desc')}
              </p>
            </motion.div>

            {/* Resilience Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="col-span-2 bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#FF8A00] text-[9px] font-bold uppercase tracking-widest">Resilience & Trust</span>
                <ShieldCheck className="w-4 h-4 text-[#FF8A00]" />
              </div>
              <h4 className="text-xl font-black text-[#4B27B1] mb-4">
                {t('who_we_are.resilience.title')}
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t('who_we_are.resilience.desc')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Desktop View - Original Layout */}
        <div className="hidden lg:block">
          <div className="text-center mb-16">
            <div className="text-[#FF8A00] font-bold tracking-widest text-xs uppercase mb-2">{t('who_we_are.label')}</div>
            <h2 className="text-5xl font-extrabold text-slate-900 mb-2">
              {t('who_we_are.title')}
            </h2>
            <div className="h-1.5 w-20 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-8" />
            <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed">
              {t('who_we_are.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-20 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
              <div className="text-5xl font-black text-[#4B27B1] mb-2 tracking-tight">29+</div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-widest leading-none">{t('who_we_are.stats.years')}</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
              <div className="text-5xl font-black text-[#4B27B1] mb-2 tracking-tight">1.5k</div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-widest leading-none">{t('who_we_are.stats.clients')}</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
              <div className="text-5xl font-black text-[#4B27B1] mb-2 tracking-tight">1M+</div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-widest leading-none">{t('who_we_are.stats.shipments')}</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
              <div className="text-5xl font-black text-[#4B27B1] mb-2 tracking-tight">960</div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-widest leading-none">{t('who_we_are.stats.projects')}</div>
            </div>
          </div>

          <div className="bg-slate-50 p-12 rounded-3xl">
            <div className="grid grid-cols-2 gap-10">
              {aboutCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
                      <img 
                        src="https://raw.githubusercontent.com/youngminghuang-del/ddnz_photo_assets/main/website_logo_ddnzglobal_512x512.png" 
                        alt="" 
                        className="w-8 h-8 object-contain gray-scale brightness-0"
                      />
                    </div>
                  </div>
                  <div className="p-8 flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      {card.icon}
                      <div>
                        <div className="text-[#FF8A00] text-xs font-bold uppercase tracking-widest mb-1">{card.label}</div>
                        <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#4B27B1] transition-colors tracking-tight">
                          {card.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-slate-600 text-md leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
