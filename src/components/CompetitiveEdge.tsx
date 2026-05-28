import React from 'react';
import { ShieldCheck, History, UserPlus, Gauge, Globe, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getImgUrl } from '../constants';

const CompetitiveEdge: React.FC = () => {
  const { t } = useLanguage();

  const edges = [
    {
      icon: ShieldCheck,
      title: t('why_ddnz.edge.e1.title'),
      text: t('why_ddnz.edge.e1.desc')
    },
    {
      icon: History,
      title: t('why_ddnz.edge.e2.title'),
      text: t('why_ddnz.edge.e2.desc')
    },
    {
      icon: UserPlus,
      title: t('why_ddnz.edge.e3.title'),
      text: t('why_ddnz.edge.e3.desc')
    },
    {
      icon: Gauge,
      title: t('why_ddnz.edge.e4.title'),
      text: t('why_ddnz.edge.e4.desc')
    },
    {
      icon: Globe,
      title: t('why_ddnz.edge.e5.title'),
      text: t('why_ddnz.edge.e5.desc')
    },
    {
      icon: DollarSign,
      title: t('why_ddnz.edge.e6.title'),
      text: t('why_ddnz.edge.e6.desc')
    }
  ];

  return (
    <section id="why-ddnz" className="py-10 md:py-24 bg-purple-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-20">
          <div className="text-[#FF8A00] font-bold tracking-widest text-xs uppercase mb-3">{t('why_ddnz.label')}</div>
          <h2 className="text-2xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-[-0.02em]">
            {t('why_ddnz.title')}
          </h2>
          <div className="h-1.5 w-12 md:w-20 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-8" />
          <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {t('why_ddnz.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 text-center">
          {edges.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-white p-4 lg:p-10 rounded-2xl shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center"
              >
                <div className="mb-3 md:mb-6 w-12 lg:w-20 h-12 lg:h-20 rounded-full bg-[#4B27B1] flex items-center justify-center shrink-0">
                  <Icon className="w-6 lg:w-10 h-6 lg:h-10 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-base lg:text-[26px] font-black tracking-tight leading-tight text-[#4B27B1] hover:text-[#FF8A00] transition-colors duration-300 mb-2 md:mb-4">{item.title}</h3>
                <p className="text-slate-600 font-medium text-[12px] md:text-lg leading-tight md:leading-relaxed">{item.text}</p>
              </div>
            );
          })}
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
