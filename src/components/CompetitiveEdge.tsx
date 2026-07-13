import React from 'react';
import { Award, Warehouse, ClipboardCheck, Coins, ShieldCheck, Clock, ArrowRight, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getImgUrl } from '../constants';

const CompetitiveEdge: React.FC = () => {
  const { t } = useLanguage();

  const scrollToQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('get-a-quote');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const leftFeatures = [
    {
      id: 'f1',
      icon: Award,
      title: t('why_ddnz.f1.title'),
      desc: t('why_ddnz.f1.desc'),
      cta: t('why_ddnz.f1.cta')
    },
    {
      id: 'f2',
      icon: Warehouse,
      title: t('why_ddnz.f2.title'),
      desc: t('why_ddnz.f2.desc'),
      cta: t('why_ddnz.f2.cta')
    },
    {
      id: 'f3',
      icon: ClipboardCheck,
      title: t('why_ddnz.f3.title'),
      desc: t('why_ddnz.f3.desc'),
      cta: t('why_ddnz.f3.cta')
    }
  ];

  const rightFeatures = [
    {
      id: 'f4',
      icon: Coins,
      title: t('why_ddnz.f4.title'),
      desc: t('why_ddnz.f4.desc'),
      cta: t('why_ddnz.f4.cta')
    },
    {
      id: 'f5',
      icon: ShieldCheck,
      title: t('why_ddnz.f5.title'),
      desc: t('why_ddnz.f5.desc'),
      cta: t('why_ddnz.f5.cta')
    },
    {
      id: 'f6',
      icon: Clock,
      title: t('why_ddnz.f6.title'),
      desc: t('why_ddnz.f6.desc'),
      cta: t('why_ddnz.f6.cta')
    }
  ];

  const renderTitle = () => {
    const title = t('why_ddnz.title');
    const highlightTerms = ["Fortune 500", "500强"];
    for (const term of highlightTerms) {
      if (title.includes(term)) {
        const parts = title.split(term);
        return (
          <>
            {parts[0]}
            <span className="text-[#FF8A00] font-black">{term}</span>
            {parts[1]}
          </>
        );
      }
    }
    return title;
  };

  return (
    <section id="why-ddnz" className="py-16 md:py-28 bg-purple-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-24">
          <div className="text-[#FF8A00] font-bold tracking-widest text-xs uppercase mb-3">{t('why_ddnz.label')}</div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-[-0.02em] leading-tight">
            {renderTitle()}
          </h2>
          <div className="h-1.5 w-12 md:w-20 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-6" />
          <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {t('why_ddnz.subtitle')}
          </p>
        </div>

        {/* 3-Column layout: Left Features, Center Circular Ship Graphic, Right Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="space-y-10">
            {leftFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex flex-col group">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#FF8A00] shrink-0 shadow-sm transition-all duration-300 group-hover:bg-[#FF8A00] group-hover:text-white group-hover:border-transparent">
                      <Icon className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-snug group-hover:text-[#4B27B1] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed pl-1 md:pl-0 font-medium">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Center Circular Ship Graphic */}
          <div className="flex flex-col items-center justify-center relative py-6 lg:py-12">
            {/* Outer decorative rings */}
            <div className="absolute w-[320px] h-[320px] rounded-full border-2 border-dashed border-[#4B27B1]/10 animate-[spin_120s_linear_infinite] hidden lg:block" />
            <div className="absolute w-[290px] h-[290px] rounded-full border border-dashed border-[#FF8A00]/20 animate-[spin_60s_linear_infinite_reverse] hidden lg:block" />
            
            {/* Main Circle Image Container */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-8 border-white shadow-2xl flex items-center justify-center bg-slate-100 group">
              <img 
                src={getImgUrl('HERO_BG')} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt="Container Cargo Ship" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4B27B1]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            {/* Elegant high-contrast text badges */}
            <div className="absolute -top-3 -right-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white backdrop-blur-md px-4 py-2 rounded-xl border border-[#FF8A00]/40 shadow-lg shadow-amber-500/10 text-[11px] md:text-xs font-bold tracking-wide flex items-center gap-2 transform hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="w-4 h-4 text-[#FF8A00]" />
              <span>Safe Transit</span>
              <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse" />
            </div>
            <div className="absolute -bottom-3 -left-2 bg-gradient-to-r from-[#4B27B1] to-[#3a1d91] text-white backdrop-blur-md px-4 py-2 rounded-xl border border-purple-400/30 shadow-lg shadow-purple-500/20 text-[11px] md:text-xs font-bold tracking-wide flex items-center gap-2 transform hover:scale-105 transition-transform duration-300">
              <Globe className="w-4 h-4 text-[#FF8A00]" />
              <span>Globally Connected</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-10">
            {rightFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex flex-col group">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#FF8A00] shrink-0 shadow-sm transition-all duration-300 group-hover:bg-[#FF8A00] group-hover:text-white group-hover:border-transparent">
                      <Icon className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-snug group-hover:text-[#4B27B1] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed pl-1 md:pl-0 font-medium">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Single Conversion Booster Link to Funnel */}
        <div className="mt-16 flex justify-center">
          <a
            href="#get-a-quote"
            onClick={scrollToQuote}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#FF8A00] to-[#e67c00] hover:from-[#4B27B1] hover:to-[#3c1e94] text-white font-extrabold text-base md:text-lg shadow-xl shadow-amber-500/20 hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.03] group"
          >
            <span>{t('nav.get_a_quote')}</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* --- INCORPORATED FACILITIES SUB-SECTION --- */}
        <div className="mt-16 sm:mt-24 pt-12 sm:pt-20 border-t border-purple-100">
          <div className="text-center mb-10 md:mb-16">
            <div className="text-[#FF8A00] font-bold tracking-widest text-xs uppercase mb-3">
              {t('facilities.label')}
            </div>
            <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {t('facilities.title')}
            </h3>
            <p className="text-slate-500 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              {t('facilities.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {[
              {
                title: t('facilities.guangzhou.title'),
                tag: t('facilities.guangzhou.tag'),
                desc: t('facilities.guangzhou.desc'),
                img: getImgUrl('FACILITY_SCALE'),
              },
              {
                title: t('facilities.systems.title'),
                tag: t('facilities.systems.tag'),
                desc: t('facilities.systems.desc'),
                img: getImgUrl('FACILITY_SORT'),
              }
            ].map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden relative bg-slate-100">
                  <div className="absolute inset-0 bg-[#4B27B1]/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    loading="lazy" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-start">
                  <span className="inline-block w-fit px-3 py-1 bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-bold rounded-full mb-4 border border-[#FF8A00]/20">
                    {item.tag}
                  </span>
                  <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-3 group-hover:text-[#4B27B1] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CompetitiveEdge;
