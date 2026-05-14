import { useState, useRef, useEffect } from 'react';
import { Check, MessageCircle } from 'lucide-react';
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
      id: 'rail',
      title: t('services.rail.title'),
      highlights: t('services.rail.highlights') as string[],
      desc: t('services.rail.desc'),
      img: getImgUrl('RAILWAY'),
      whatsapp: 'https://wa.me/85261077362?text=Hi, I\'m interested in Railway Freight.',
      trackEventName: 'service_view_rail'
    },
    {
      id: 'warehousing',
      title: t('services.warehousing.title'),
      highlights: t('services.warehousing.highlights') as string[],
      desc: t('services.warehousing.desc'),
      img: getImgUrl('WAREHOUSE_SCALE'),
      whatsapp: 'https://wa.me/85261077362?text=Hi, I\'m interested in Warehouse and Distribution services.',
      trackEventName: 'service_view_warehousing'
    },
    {
      id: 'freight',
      title: t('services.freight.title'),
      highlights: t('services.freight.highlights') as string[],
      desc: t('services.freight.desc'),
      img: getImgUrl('AIR_FREIGHT'),
      whatsapp: 'https://wa.me/85261077362?text=Hi, I\'m interested in Global Freight services.',
      trackEventName: 'service_view_freight'
    },
    {
      id: 'trust',
      title: t('services.trust.title'),
      highlights: t('services.trust.highlights') as string[],
      desc: t('services.trust.desc'),
      img: getImgUrl('FACILITY_SORT'),
      whatsapp: 'https://wa.me/85261077362?text=Hi, I need help with Alibaba Sourcing and Inspection.',
      trackEventName: 'service_view_sourcing'
    }
  ];

  const handleServiceClick = (eventName: string, id: string) => {
    trackEvent(eventName, { 'service_type': id });
  };

  const highlightTerms = (text: string) => {
    // Keywords for highlighting in different languages
    const dictionary: Record<string, string[]> = {
      en: ["Asset-based", "Door-to-door", "Supply chain visibility", "quality checks", "strategic", "integrated", "trust gap", "verification", "inspection", "all-in rates"],
      fr: ["basé sur des actifs", "porte-à-porte", "visibilité de la chaîne", "contrôles de qualité", "stratégique", "intégrées", "fossé de la confiance", "vérification", "inspection", "tarifs tout compris"],
      ru: ["активы", "от двери до двери", "прослеживаемость", "контроль качества", "стратегический", "интегрированные", "дефицит доверия", "инспекция", "проверка", "цена «всё включено»"]
    };
    
    const terms = dictionary[language] || dictionary['en'];
    
    let highlightedText = text;
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="font-bold text-slate-700">$1</span>');
    });
    
    return highlightedText;
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
              <div 
                key={sector.id} 
                onClick={() => handleServiceClick(sector.trackEventName, sector.id)}
                className="group cursor-pointer relative bg-white rounded-2xl shadow-sm lg:shadow-xl border border-slate-100 transition-all duration-500 flex flex-col overflow-hidden lg:hover:-translate-y-3 min-h-[660px] md:min-h-[700px] snap-center min-w-[85vw] md:min-w-[45vw] lg:min-w-0"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={sector.img} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" alt={sector.title} loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1 relative">
                  <div className="flex items-center min-h-[80px] md:min-h-[100px] mb-4 md:mb-6 group/title text-left">
                    <div className="w-[1.5px] md:w-[2px] h-full self-stretch bg-gradient-to-b from-[#4B27B1] to-[#FF8A00] mr-4 md:mr-5 rounded-full" />
                    <h3 className="text-lg md:text-[22px] font-black text-[#4B27B1] tracking-tight group-hover:text-[#FF8A00] transition-colors duration-300 leading-tight">
                      {sector.title}
                    </h3>
                  </div>
                  
                  {/* Highlights List */}
                  <ul className="mb-6 space-y-3 min-h-[140px] md:min-h-[160px]">
                    {sector.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start text-slate-700 font-semibold group/item">
                        <Check className="w-4 h-4 mr-3 text-[#FF8A00] shrink-0 mt-[3px] transition-transform group-hover/item:scale-110" />
                        <span className="text-[13px] md:text-[14px] leading-snug">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex-1 mb-8 overflow-hidden">
                    <div 
                      className="text-slate-500 text-sm leading-relaxed text-left min-h-[100px] md:min-h-[120px]"
                      dangerouslySetInnerHTML={{ __html: highlightTerms(sector.desc) }}
                    />
                  </div>

                  <div className="mt-auto">
                    <a 
                      href={sector.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full py-3 px-6 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition-all shadow-md active:scale-95 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        trackEvent('whatsapp_click', { 'service_type': sector.id });
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Let's Talk
                    </a>
                  </div>
                  
                  {/* Bottom Decorative Border - Hidden on Mobile */}
                  <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] transition-all duration-500 group-hover:w-full md:block hidden" />
                </div>
              </div>
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
