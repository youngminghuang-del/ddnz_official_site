import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
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
      highlightedText = highlightedText.replace(regex, '<span class="font-bold text-slate-700">$1</span>');
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
      default:
        return 'Explore Service';
    }
  };

  return (
    <section id="what-we-do" className="py-10 md:py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-20">
          <div className="text-[#FF8A00] font-bold tracking-widest text-xs uppercase mb-3">{t('services.label')}</div>
          <h2 className="text-2xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-[-0.02em]">
            {t('services.title')}
          </h2>
          <div className="h-1.5 w-12 md:w-20 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-8" />
          <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>

        <div 
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-hide pb-6 -mx-4 px-4 gap-4 lg:gap-8 lg:mx-0 lg:px-0"
        >
          {businessSectors.map((sector) => {
            return (
              <Link 
                to={sector.linkTarget}
                key={sector.id} 
                onClick={() => handleServiceClick(sector.trackEventName, sector.id)}
                className="group cursor-pointer relative bg-white rounded-2xl shadow-sm lg:shadow-xl border border-slate-100 transition-all duration-500 flex flex-col overflow-hidden lg:hover:-translate-y-3 min-h-[510px] md:min-h-[540px] lg:min-h-[560px] snap-center min-w-[85vw] md:min-w-[45vw] lg:min-w-0"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={sector.img} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" alt={sector.title} loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1 relative">
                  <div className="flex items-center min-h-[50px] md:min-h-[60px] mb-4 md:mb-5 group/title text-left">
                    <div className="w-[1.5px] md:w-[2px] h-full self-stretch bg-gradient-to-b from-[#4B27B1] to-[#FF8A00] mr-4 md:mr-5 rounded-full" />
                    <h3 className="text-lg md:text-xl font-black text-[#4B27B1] tracking-tight group-hover:text-[#FF8A00] transition-colors duration-300 leading-tight">
                      {sector.title}
                    </h3>
                  </div>
                  
                  {/* Highlights List */}
                  <ul className="mb-6 space-y-3 min-h-[100px] md:min-h-[110px]">
                    {sector.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start text-slate-700 font-semibold group/item">
                        <Check className="w-4 h-4 mr-3 text-[#FF8A00] shrink-0 mt-[3px] transition-transform group-hover/item:scale-110" />
                        <span className="text-[13px] md:text-[14px] leading-snug">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mb-4 overflow-hidden">
                    <div 
                      className="text-slate-500 text-sm leading-relaxed text-left min-h-[60px] md:min-h-[70px]"
                      dangerouslySetInnerHTML={{ __html: highlightTerms(sector.desc) }}
                    />
                  </div>

                  <div className="flex-1" />

                  {/* Explore CTA Button banner */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm font-extrabold text-[#4B27B1] group-hover:text-[#FF8A00] transition-colors duration-300">
                    <span>{getExploreText()}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  
                  {/* Bottom Decorative Border - Hidden on Mobile */}
                  <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] transition-all duration-500 group-hover:w-full md:block hidden" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Progress Bar */}
        <div className="flex justify-center items-center gap-1.5 mt-2 lg:hidden">
          {businessSectors.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1 transition-all duration-300 rounded-full ${
                activeIndex === idx ? 'w-6 bg-[#FF8A00]' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
