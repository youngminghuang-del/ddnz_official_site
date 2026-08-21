import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { getImgUrl } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../lib/utils';

export default function WhatWeDo() {
  const { t, language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, clientWidth } = scrollRef.current;
        const index = Math.round(scrollLeft / clientWidth);
        setActiveIndex(index);
      }
    };

    const currentScrollRef = scrollRef.current;
    if (currentScrollRef) {
      currentScrollRef.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  const businessSectors = [
    {
      id: 'sea-freight',
      title: t('services.sea.title'),
      highlights: t('services.sea.highlights') as string[] || [],
      desc: t('services.sea.desc'),
      img: getImgUrl('EV_01'),
      trackEventName: 'service_view_sea',
      linkTarget: '/services/sea-freight'
    },
    {
      id: 'air-freight',
      title: t('services.air.title'),
      highlights: t('services.air.highlights') as string[] || [],
      desc: t('services.air.desc'),
      img: getImgUrl('AIR_FREIGHT'),
      trackEventName: 'service_view_air',
      linkTarget: '/services/air-freight'
    },
    {
      id: 'amazon-fba',
      title: t('services.fba.title'),
      highlights: t('services.fba.highlights') as string[] || [],
      desc: t('services.fba.desc'),
      img: getImgUrl('FACILITY_TEAM'),
      trackEventName: 'service_view_fba',
      linkTarget: '/services/amazon-fba'
    },
    {
      id: 'warehouse-services',
      title: t('services.warehouse.title'),
      highlights: t('services.warehouse.highlights') as string[] || [],
      desc: t('services.warehouse.desc'),
      img: getImgUrl('WAREHOUSE_SCALE'),
      trackEventName: 'service_view_warehouse',
      linkTarget: '/services/warehouse-services'
    }
  ];

  const handleServiceClick = (eventName: string, id: string) => {
    trackEvent(eventName, { 'service_type': id });
  };

  const highlightTerms = (text: string) => {
    if (!text) return '';
    // Keywords for highlighting in different languages
    const dictionary: Record<string, string[]> = {
      en: ["Sea Freight", "Air Freight", "Amazon FBA", "Warehouse", "DDP/DAP", "3PL", "Time-Critical", "Customs Brokerage", "FCL & LCL"],
      zh: ["海运货运", "空运物流", "亚马逊 FBA", "第三方物流", "双清到门", "3PL", "时效", "报关", "集运"],
      ru: ["Морские перевозки", "Авиаперевозки", "Амазон FBA", "Складские услуги", "DDP/DAP", "3PL-складирования"],
      fr: ["Solutions de Fret Maritime", "Solutions de Fret Aérien", "Logistique Amazon FBA", "Entreposage & Distribution", "DDP/DAP", "3PL"]
    };
    
    const terms = dictionary[language] || dictionary['en'];
    
    let highlightedText = text;
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="font-extrabold text-amber-400">$1</span>');
    });
    
    return highlightedText;
  };

  const getExploreText = () => {
    switch (language) {
      case 'zh':
        return '了解更多详情';
      case 'ru':
        return 'Подробнее об услуге';
      case 'fr':
        return 'En savoir plus';
      case 'es':
        return 'Ver servicio';
      case 'ar':
        return 'استكشف الخدمة';
      default:
        return 'Explore Service';
    }
  };

  const languagePrefix =
    language === 'zh' ? '/zh-cn' :
    language === 'en' ? '' :
    `/${language}`;
  const localizePath = (path: string) => `${languagePrefix}${path}`;

  return (
    <section id="what-we-do" className="scroll-mt-24 py-10 md:py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-4xl md:mb-16">
          <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--hb-amber)]">
            {t('nav.what_we_do')}
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-[var(--hb-navy)] md:text-5xl">
            {t('services.title')}
          </h2>
          <div className="mt-4 h-1 w-12 rounded-full bg-[var(--hb-amber)]" aria-hidden="true" />
          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-slate-600 md:text-lg">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Interactive Vertical-Strip Showcase/Slider */}
        <div className="relative w-full h-[520px] md:h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 bg-slate-900 group/showcase">
          {/* 1. Dynamic Background Image Layers with Cross-Fade */}
          {businessSectors.map((sector, idx) => (
            <div
              key={`bg-${sector.id}`}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                activeIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
              style={{
                backgroundImage: `url(${sector.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay with radial gradient for professional vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30" />
            </div>
          ))}

          {/* 2. Interactive Columns Overlay (Desktop & Tablet: sm and up) */}
          <div className="hidden sm:flex relative z-10 h-full w-full">
            {businessSectors.map((sector, idx) => {
              const isActive = activeIndex === idx;
              return (
                <article
                  key={sector.id}
                  className={`flex-1 h-full flex flex-col justify-end p-6 md:p-8 border-r border-white/10 last:border-r-0 transition-all duration-700 relative overflow-hidden ${
                    isActive ? 'bg-black/10' : 'bg-black/55 hover:bg-black/40'
                  }`}
                >
                  <div className="relative z-10 flex flex-col text-left h-full justify-end">
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        setActiveIndex(idx);
                        handleServiceClick(sector.trackEventName, sector.id);
                      }}
                      className="rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#facc15] focus-visible:ring-offset-4 focus-visible:ring-offset-black/70"
                    >
                      <span className="block border border-white/40 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm w-fit mb-3 bg-black/20 backdrop-blur-[2px] leading-none">
                        {sector.highlights[0] || 'SERVICE'}
                      </span>
                      <span className={`block text-base md:text-xl lg:text-2xl font-black tracking-tight leading-tight transition-colors duration-500 ${
                        isActive ? 'text-[#facc15]' : 'text-white'
                      }`}>
                        {sector.title}
                      </span>
                    </button>

                    {/* Expanding details for the active card */}
                    <div className={`transition-all duration-700 ease-in-out overflow-hidden ${
                      isActive ? 'max-h-[280px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                    }`}>
                      <p className="text-white/85 text-xs md:text-sm leading-relaxed mb-4 font-medium"
                         dangerouslySetInnerHTML={{ __html: highlightTerms(sector.desc) }}
                      />
                      
                      {/* highlights */}
                      <div className="space-y-2 mb-5">
                        {sector.highlights.slice(1).map((hl, i) => (
                          <div key={i} className="flex items-center gap-2 text-white/90 text-xs font-semibold">
                            <Check className="w-3.5 h-3.5 text-[#facc15] shrink-0" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <Link 
                        to={localizePath(sector.linkTarget)}
                        onClick={() => handleServiceClick(sector.trackEventName, sector.id)}
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-[#facc15] font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md backdrop-blur-sm self-start"
                      >
                        <span>{getExploreText()}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* 3. Mobile Single-Slide Content Overlay (under sm screen sizes) */}
          <div className="flex sm:hidden relative z-10 h-full w-full flex-col justify-end p-6 text-left">
            <div className="border border-white/40 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm w-fit mb-3 bg-black/20 backdrop-blur-[2px] leading-none">
              {businessSectors[activeIndex].highlights[0] || 'SERVICE'}
            </div>
            
            <h3 className="text-xl font-black text-[#facc15] tracking-tight leading-tight mb-3">
              {businessSectors[activeIndex].title}
            </h3>
            
            <p className="text-white/85 text-xs leading-relaxed mb-4 font-medium"
               dangerouslySetInnerHTML={{ __html: highlightTerms(businessSectors[activeIndex].desc) }}
            />

            <div className="space-y-1.5 mb-5">
              {businessSectors[activeIndex].highlights.slice(1).map((hl, i) => (
                <div key={i} className="flex items-center gap-2 text-white/90 text-xs font-bold">
                  <Check className="w-3.5 h-3.5 text-[#facc15] shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>

            <Link 
              to={localizePath(businessSectors[activeIndex].linkTarget)}
              onClick={() => handleServiceClick(businessSectors[activeIndex].trackEventName, businessSectors[activeIndex].id)}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-black text-xs px-4 py-3 rounded-xl backdrop-blur-sm w-fit"
            >
              <span>{getExploreText()}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 4. Left and Right Controls */}
          <button
            type="button"
            aria-label="Show previous logistics service"
            onClick={(e) => {
              e.stopPropagation();
              const nextIndex = activeIndex === 0 ? businessSectors.length - 1 : activeIndex - 1;
              setActiveIndex(nextIndex);
              handleServiceClick(businessSectors[nextIndex].trackEventName, businessSectors[nextIndex].id);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Show next logistics service"
            onClick={(e) => {
              e.stopPropagation();
              const nextIndex = activeIndex === businessSectors.length - 1 ? 0 : activeIndex + 1;
              setActiveIndex(nextIndex);
              handleServiceClick(businessSectors[nextIndex].trackEventName, businessSectors[nextIndex].id);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
          >
            <ArrowRight className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
          </button>


        </div>

        {/* 6. Dot Navigation Indicator */}
        <div className="flex justify-center items-center gap-1 mt-6" role="group" aria-label={t('services.title')}>
          {businessSectors.map((sector, idx) => (
            <button 
              key={idx}
              type="button"
              aria-label={`${idx + 1}: ${sector.title}`}
              aria-current={activeIndex === idx ? 'true' : undefined}
              onClick={() => {
                setActiveIndex(idx);
                handleServiceClick(businessSectors[idx].trackEventName, businessSectors[idx].id);
              }}
              className="grid h-11 w-11 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A00] focus-visible:ring-offset-2"
            >
              <span aria-hidden="true" className={`h-2 transition-[width,background-color] duration-300 rounded-full ${
                activeIndex === idx ? 'w-8 bg-[#FF8A00]' : 'w-2 bg-slate-300'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
