import { motion } from 'framer-motion';
import { getImgUrl } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export default function WhoWeAre() {
  const { t } = useLanguage();

  const aboutCards = [
    {
      id: 'heritage',
      title: t('who_we_are.heritage.title'),
      description: t('who_we_are.heritage.desc'),
      keywords: 'SINCE 1997 • 29Y TRUST • GLOBAL',
      label: 'Heritage',
      image: getImgUrl('JOURNEY_1999'),
    },
    {
      id: 'nev-experts',
      title: t('who_we_are.nev.title'),
      description: t('who_we_are.nev.desc'),
      keywords: 'DG LICENSED • BATTERY • EV',
      label: 'NEV Experts',
      image: getImgUrl('ESS_STORAGE'),
    },
    {
      id: 'infrastructure',
      title: t('who_we_are.infra.title'),
      description: t('who_we_are.infra.desc'),
      keywords: 'OWNED ASSETS • HUB • SECURE',
      label: 'Infrastructure',
      image: getImgUrl('JOURNEY_2004'),
    },
    {
      id: 'resilience',
      title: t('who_we_are.resilience.title'),
      description: t('who_we_are.resilience.desc'),
      keywords: 'RELIABLE • A-CLASS • 24/7',
      label: 'Resilience',
      image: getImgUrl('JOURNEY_2019'),
    },
  ];

  return (
    <section id="who-we-are" className="py-10 md:py-24 bg-purple-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <div className="text-[#FF8A00] font-bold tracking-widest text-xs uppercase mb-2">{t('who_we_are.label')}</div>
          <h2 className="text-2xl md:text-5xl font-extrabold text-slate-900 mb-2">
            {t('who_we_are.title')}
          </h2>
          <div className="h-1.5 w-12 md:w-20 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-8" />
          <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
            {t('who_we_are.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 text-center">
          <div className="bg-white p-3 lg:p-8 rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
            <div className="text-3xl lg:text-5xl font-black text-[#4B27B1] mb-1 md:mb-2 tracking-tight">29+</div>
            <div className="text-[10px] md:text-sm font-semibold text-slate-600 uppercase tracking-widest leading-none">{t('who_we_are.stats.years')}</div>
          </div>
          <div className="bg-white p-3 lg:p-8 rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
            <div className="text-3xl lg:text-5xl font-black text-[#4B27B1] mb-1 md:mb-2 tracking-tight">1.5k</div>
            <div className="text-[10px] md:text-sm font-semibold text-slate-600 uppercase tracking-widest leading-none">{t('who_we_are.stats.clients')}</div>
          </div>
          <div className="bg-white p-3 lg:p-8 rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
            <div className="text-3xl lg:text-5xl font-black text-[#4B27B1] mb-1 md:mb-2 tracking-tight">1M+</div>
            <div className="text-[10px] md:text-sm font-semibold text-slate-600 uppercase tracking-widest leading-none">{t('who_we_are.stats.shipments')}</div>
          </div>
          <div className="bg-white p-3 lg:p-8 rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
            <div className="text-3xl lg:text-5xl font-black text-[#4B27B1] mb-1 md:mb-2 tracking-tight">960</div>
            <div className="text-[10px] md:text-sm font-semibold text-slate-600 uppercase tracking-widest leading-none">{t('who_we_are.stats.projects')}</div>
          </div>
        </div>
        <div className="bg-white px-6 py-4 text-center rounded-xl shadow-sm border border-purple-100 mb-12 md:mb-20">
          <p className="text-slate-600 text-sm md:text-base italic font-medium">{t('who_we_are.stats.desc')}</p>
        </div>

        <div className="bg-slate-50 p-4 lg:p-12 rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10">
            {aboutCards.map((card, index) => {
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm lg:shadow-lg lg:hover:shadow-2xl transition-all duration-300 lg:hover:-translate-y-2 flex flex-row md:flex-col items-center md:items-stretch h-auto md:h-full p-3 lg:p-0"
                >
                  {/* Thumbnail / Image Section */}
                  <div className="w-20 h-20 md:w-full md:h-auto md:aspect-[16/10] shrink-0 overflow-hidden relative rounded-xl md:rounded-none">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    {/* Watermark Logo - PC Only */}
                    <div className="hidden md:block absolute top-4 right-4 opacity-20 pointer-events-none">
                      <img 
                        src="https://raw.githubusercontent.com/youngminghuang-del/ddnz_photo_assets/main/website_logo_ddnzglobal_512x512.png" 
                        alt="" 
                        className="w-8 h-8 object-contain gray-scale brightness-0"
                      />
                    </div>
                  </div>
                  
                  {/* Text Content Section */}
                  <div className="pl-4 md:p-8 flex-1 flex flex-col justify-center">
                    {/* Tiny Mobile Label */}
                    <div className="block md:hidden text-[#FF8A00] text-[9px] uppercase tracking-[0.2em] mb-1 font-bold">
                      {card.label}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-base lg:text-xl font-bold lg:font-extrabold text-slate-900 group-hover:text-[#4B27B1] transition-colors mb-1 md:mb-4 tracking-tight">
                      {card.title}
                    </h3>
                    
                    {/* Short Description - Mobile (2 lines) */}
                    <p className="block md:hidden text-[11px] text-slate-500 leading-tight line-clamp-2">
                      {card.description}
                    </p>
                    
                    {/* Full Description - PC */}
                    <p className="hidden md:block text-slate-600 text-md leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
