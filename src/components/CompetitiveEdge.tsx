import React from 'react';
import { Award, Warehouse, ClipboardCheck, Coins, ShieldCheck, Clock, ArrowRight, PackageCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getImgUrl } from '../constants';
import { Link } from 'react-router-dom';
import { buildQuoteHref } from '../lib/quoteLinks';

const CompetitiveEdge: React.FC = () => {
  const { t, language } = useLanguage();
  const freightQuoteHref = buildQuoteHref({ intent: 'Freight Export', language, source: 'homepage_competitive_edge' });

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
  const features = [...leftFeatures, ...rightFeatures];

  return (
    <section id="why-ddnz" className="scroll-mt-24 py-16 md:py-28 bg-[var(--hb-surface)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-6xl md:mb-14">
          <h2 className="text-3xl font-black leading-tight tracking-[-0.035em] text-[var(--hb-navy)] md:text-[clamp(2rem,4vw,3rem)]">
            {t('why_ddnz.title')}
          </h2>
          <div className="mt-4 h-1 w-12 rounded-full bg-[var(--hb-amber)]" aria-hidden="true" />
          <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-slate-600 md:text-lg">
            {t('why_ddnz.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <figure className="overflow-hidden rounded-2xl bg-slate-200 lg:col-span-5">
            <div className="aspect-[16/9] h-full min-h-[280px] lg:aspect-auto">
              <img 
                src={getImgUrl('HERO_BG')} 
                className="h-full w-full object-cover"
                alt="Container terminal supporting Heaven Born international freight operations"
                width="1080"
                height="1440"
                loading="lazy"
              />
            </div>
          </figure>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
              {features.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.id} className="border-t border-slate-300 pt-5">
                  <div className="flex items-start gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E8F1F8] text-[var(--hb-blue)]">
                      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                    </div>
                    <h3 className="pt-1 text-lg font-black leading-snug tracking-[-0.015em] text-[var(--hb-navy)]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                    {item.desc}
                  </p>
                </article>
              );
            })}
            </div>

            <Link
              to={freightQuoteHref}
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[var(--hb-amber)] px-7 py-3.5 text-base font-extrabold text-white transition-colors hover:bg-[var(--hb-amber-strong)] active:scale-[0.98]"
            >
              <span>{t('nav.get_a_quote')}</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Physical operations: real facilities shown with a clear primary and secondary hierarchy */}
        <div id="facilities" className="scroll-mt-28 mt-16 border-t border-slate-200 pt-14 sm:mt-24 sm:pt-20">
          <div className="max-w-3xl">
            <h3 className="text-3xl font-black leading-tight tracking-[-0.035em] text-[var(--hb-navy)] md:text-5xl">
              {t('facilities.title')}
            </h3>
            <div className="mt-4 h-1 w-12 rounded-full bg-[var(--hb-amber)]" aria-hidden="true" />
            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-slate-600 md:text-lg">
              {t('facilities.subtitle')}
            </p>
          </div>

          <div className="mt-9 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-stretch">
            <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(11,79,138,0.08)] lg:col-span-7">
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                <img
                  src={getImgUrl('FACILITY_SCALE')}
                  alt={t('facilities.guangzhou.title')}
                  width="1536"
                  height="1024"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                />
              </div>
              <div className="p-6 sm:p-8 md:p-10">
                <div className="flex items-center gap-3 text-[#D85F0B]">
                  <Warehouse className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden="true" />
                  <p className="text-xs font-black uppercase tracking-[0.12em]">{t('facilities.guangzhou.tag')}</p>
                </div>
                <h4 className="mt-5 text-2xl font-black leading-[1.15] tracking-[-0.025em] text-[var(--hb-navy)] md:text-[1.75rem] lg:text-3xl">
                  {t('facilities.guangzhou.title')}
                </h4>
                <p className="mt-4 max-w-[58ch] text-sm font-medium leading-6 text-slate-600 md:text-base md:leading-7">
                  {t('facilities.guangzhou.desc')}
                </p>
              </div>
            </article>

            <article className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-[#EEF4F9] lg:col-span-5 lg:flex-col">
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 lg:aspect-auto lg:min-h-[280px] lg:flex-1">
                <img
                  src={getImgUrl('FACILITY_SORT')}
                  alt={t('facilities.systems.title')}
                  width="1536"
                  height="1024"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                />
              </div>
              <div className="border-t border-slate-200 p-6 sm:p-8">
                <div className="flex items-center gap-3 text-[#D85F0B]">
                  <PackageCheck className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden="true" />
                  <p className="text-xs font-black uppercase tracking-[0.12em]">{t('facilities.systems.tag')}</p>
                </div>
                <h4 className="mt-5 text-xl font-black leading-tight tracking-[-0.02em] text-[var(--hb-navy)] md:text-2xl">
                  {t('facilities.systems.title')}
                </h4>
                <p className="mt-4 text-sm font-medium leading-6 text-slate-600 md:text-base md:leading-7">
                  {t('facilities.systems.desc')}
                </p>
              </div>
            </article>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CompetitiveEdge;
