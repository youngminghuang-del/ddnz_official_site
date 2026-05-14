import { Check } from 'lucide-react';
import { getImgUrl } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export default function WhatWeDo() {
  const { t, language } = useLanguage();
  
  const businessSectors = [
    {
      id: 'rail',
      title: t('services.rail.title'),
      highlights: t('services.rail.highlights') as string[],
      desc: t('services.rail.desc'),
      img: getImgUrl('RAILWAY'),
    },
    {
      id: 'warehousing',
      title: t('services.warehousing.title'),
      highlights: t('services.warehousing.highlights') as string[],
      desc: t('services.warehousing.desc'),
      img: getImgUrl('WAREHOUSE_SCALE'),
    },
    {
      id: 'freight',
      title: t('services.freight.title'),
      highlights: t('services.freight.highlights') as string[],
      desc: t('services.freight.desc'),
      img: getImgUrl('AIR_FREIGHT'),
    },
    {
      id: 'trust',
      title: t('services.trust.title'),
      highlights: t('services.trust.highlights') as string[],
      desc: t('services.trust.desc'),
      img: getImgUrl('FACILITY_SORT'),
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {businessSectors.map((sector) => {
            return (
              <div key={sector.id} className="group relative bg-white rounded-2xl shadow-xl border border-slate-100 transition-all duration-500 flex flex-col overflow-hidden hover:-translate-y-3 min-h-[600px] md:min-h-[640px]">
                <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={sector.img} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" alt={sector.title} loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1 relative">
                  <div className="flex items-center min-h-[60px] md:min-h-[100px] mb-6 md:mb-8 group/title">
                    <div className="w-[1.5px] md:w-[2px] h-full self-stretch bg-gradient-to-b from-[#4B27B1] to-[#FF8A00] mr-4 md:mr-5 rounded-full" />
                    <h3 className="text-lg md:text-[26px] font-black text-[#4B27B1] tracking-tight group-hover:text-[#FF8A00] transition-colors duration-300 leading-tight">
                      {sector.title}
                    </h3>
                  </div>
                  
                  {/* Highlights List */}
                  <ul className="mb-8 space-y-4">
                    {sector.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start text-slate-700 font-semibold group/item">
                        <Check className="w-4 h-4 mr-3 text-[#FF8A00] shrink-0 mt-[3px] transition-transform group-hover/item:scale-110" />
                        <span className="text-[14px] leading-snug">{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div 
                    className="text-slate-500 text-sm leading-relaxed text-left flex-1"
                    dangerouslySetInnerHTML={{ __html: highlightTerms(sector.desc) }}
                  />
                  
                  {/* Bottom Decorative Border - Hidden on Mobile */}
                  <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] transition-all duration-500 group-hover:w-full md:block hidden" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
