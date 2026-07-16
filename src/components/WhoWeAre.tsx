import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { getImgUrl } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export default function WhoWeAre() {
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

  const getAboutCards = () => {
    switch (language) {
      case 'zh':
        return [
          {
            id: 'heritage',
            title: '29载全球资源传承',
            highlights: ['始于1997年', '全球供应链', '资深贸易纽带'],
            desc: '自1997年创立起，我们从中国外贸开拓先驱蜕变并精通于全球综合物流网路。',
            img: getImgUrl('JOURNEY_1999'),
            ctaText: '了解发展历程',
            linkTarget: '/'
          },
          {
            id: 'nev-experts',
            title: '新能源与危险品专家',
            highlights: ['前瞻能源物流', '合规危险品运输', '绿色转型专家'],
            desc: '把握全球绿色物流转型契机，为储能系统与电动汽车提供定制合规安全承运。',
            img: getImgUrl('ESS_STORAGE'),
            ctaText: '探索特种承运',
            linkTarget: '/services/air-freight'
          },
          {
            id: 'infrastructure',
            title: '实体自营仓储与贸易',
            highlights: ['自营实体仓库', '香港关键网关', '多币种安全结算'],
            desc: '凭借对底层基础设施及自营仓库的控制，确保高效全球运作及财务安全。',
            img: getImgUrl('JOURNEY_2004'),
            ctaText: '查看物理基建',
            linkTarget: '/services/warehouse-services'
          },
          {
            id: 'resilience',
            title: '坚韧不拔的应急交付',
            highlights: ['供应链抗风险', '紧急货载保障', '可信赖全球网'],
            desc: '当全球主要航路遭遇突发中断，我们保障紧急物资送达，主动捍卫您的商业利益。',
            img: getImgUrl('JOURNEY_2019'),
            ctaText: '阅读客户案例',
            linkTarget: '/'
          }
        ];
      case 'ru':
        return [
          {
            id: 'heritage',
            title: '29 лет наследия',
            highlights: ['Работа с 1997', 'Глобальные цепи', 'Проверенные связи'],
            desc: 'С 1997 года мы прошли путь от первопроходцев торговли до признанных экспертов логистики.',
            img: getImgUrl('JOURNEY_1999'),
            ctaText: 'Наша история',
            linkTarget: '/'
          },
          {
            id: 'nev-experts',
            title: 'Специалисты по DG',
            highlights: ['Логистика энергии', 'Безопасный транспорт', 'Зеленый переход'],
            desc: 'Лидерство в переходе к эко-логистике с надежным сопровождением литиевых батарей и ESS.',
            img: getImgUrl('ESS_STORAGE'),
            ctaText: 'Специальные грузы',
            linkTarget: '/services/air-freight'
          },
          {
            id: 'infrastructure',
            title: 'Интегрированные поставки',
            highlights: ['Собственные склады', 'Гонконгский хаб', 'Гибкие расчеты'],
            desc: 'Благодаря прямому владению складами, мы гарантируем стабильные операции и безопасность.',
            img: getImgUrl('JOURNEY_2004'),
            ctaText: 'Наша инфраструктура',
            linkTarget: '/services/warehouse-services'
          },
          {
            id: 'resilience',
            title: 'Надежность и антикризис',
            highlights: ['Устойчивые цепи', 'Срочная поддержка', 'Мировое партнерство'],
            desc: 'Даже при сбоях мировых сетей мы находим решения, защищая ваши бизнес-интересы.',
            img: getImgUrl('JOURNEY_2019'),
            ctaText: 'Кейсы и опыт',
            linkTarget: '/'
          }
        ];
      case 'fr':
        return [
          {
            id: 'heritage',
            title: "29 ans d'héritage",
            highlights: ['Établi depuis 1997', 'Flux mondiaux', 'Liaisons éprouvées'],
            desc: 'Depuis 1997, nous sommes passés de l’ouverture des marchés à la pleine maîtrise logistique.',
            img: getImgUrl('JOURNEY_1999'),
            ctaText: 'Découvrir l’histoire',
            linkTarget: '/'
          },
          {
            id: 'nev-experts',
            title: 'Spécialiste DG & NEV',
            highlights: ['Logistique verte', 'Transport certifié', 'Transition propre'],
            desc: 'Pionniers de la transition verte adaptés aux batteries, ESS et véhicules électriques.',
            img: getImgUrl('ESS_STORAGE'),
            ctaText: 'Explorer le cargo',
            linkTarget: '/services/air-freight'
          },
          {
            id: 'infrastructure',
            title: 'Supply Chain Intégrée',
            highlights: ['Entrepôts propres', 'Passerelle HK', 'Paiement sécurisé'],
            desc: 'Le contrôle direct d’infrastructures de pointe offre continuité et transactions sécurisées.',
            img: getImgUrl('JOURNEY_2004'),
            ctaText: 'Voir les entrepôts',
            linkTarget: '/services/warehouse-services'
          },
          {
            id: 'resilience',
            title: 'Résilience & Protection',
            highlights: ['Chaîne haute', 'Fret d’urgence', 'Réseau de confiance'],
            desc: 'En période de rupture globale de fret, nous restons debout pour pérenniser votre commerce.',
            img: getImgUrl('JOURNEY_2019'),
            ctaText: 'Lire les études',
            linkTarget: '/'
          }
        ];
      default: // 'en'
        return [
          {
            id: 'heritage',
            title: '29 Years of Global Heritage',
            highlights: ['Established Since 1997', 'Global Supply Chains', 'Proven Trade Links'],
            desc: "Since 1997, we evolved from pioneering trade links during China's WTO accession to mastering worldwide logistics networks.",
            img: getImgUrl('JOURNEY_1999'),
            ctaText: 'Learn Our History',
            linkTarget: '/'
          },
          {
            id: 'nev-experts',
            title: 'DG & New Energy Specialists',
            highlights: ['Visionary Energy Logistics', 'Compliant DG Transport', 'Green Transition Experts'],
            desc: 'Leading the global green logistics transition with bespoke, compliance-driven solutions for Energy Storage Systems (ESS) and EVs.',
            img: getImgUrl('ESS_STORAGE'),
            ctaText: 'Explore Special Cargo',
            linkTarget: '/services/air-freight'
          },
          {
            id: 'infrastructure',
            title: 'Integrated Supply Chain & Trade',
            highlights: ['Self-Owned Warehouses', 'Hong Kong Gateway', 'Multi-Currency Settlement'],
            desc: 'Empowered by structural infrastructure control, we guarantee seamless global operations and secure cross-border settlements.',
            img: getImgUrl('JOURNEY_2004'),
            ctaText: 'View Infrastructure',
            linkTarget: '/services/warehouse-services'
          },
          {
            id: 'resilience',
            title: 'Unwavering Resilience & Care',
            highlights: ['Supply Chain Resilience', 'Critical Cargo Support', 'Trusted Global Network'],
            desc: 'When global networks falter, we deliver by prioritizing critical supplies and proactively protecting your business interests.',
            img: getImgUrl('JOURNEY_2019'),
            ctaText: 'Read Case Studies',
            linkTarget: '/'
          }
        ];
    }
  };

  const aboutCards = getAboutCards();

  const highlightTerms = (text: string) => {
    if (!text) return '';
    const dictionary: Record<string, string[]> = {
      en: ["Since 1997", "custom", "compliance-driven", "structural", "seamless", "critical", "proactively"],
      zh: ["自1997年创立起", "定制", "合规安全", "控制", "高效", "确保", "紧急"],
      ru: ["С 1997 года", "эко-логистике", "прямому владению", "всегда", "защищая"],
      fr: ["Depuis 1997", "contrôle direct", "matière", "toujours", "continuité"]
    };
    
    const terms = dictionary[language] || dictionary['en'];
    
    let highlightedText = text;
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="font-extrabold text-amber-400">$1</span>');
    });
    
    return highlightedText;
  };

  return (
    <section id="who-we-are" className="py-10 md:py-24 bg-white overflow-hidden font-sans border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center mb-10 md:mb-16">
          <div className="text-[#FF8A00] font-bold tracking-widest text-xs uppercase mb-3">
            {t('who_we_are.label')}
          </div>
          <h2 className="text-2xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-[-0.02em]">
            {t('who_we_are.title')}
          </h2>
          <div className="h-1.5 w-12 md:w-20 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-6 md:mb-8" />
          <p className="text-slate-500 text-sm md:text-xl max-w-3xl mx-auto leading-relaxed">
            {t('who_we_are.subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-20 text-center">
          <div className="group bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100/80 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:bg-amber-50/20 hover:border-[#FF8A00]/30 hover:shadow-[0_12px_30px_rgba(255,138,0,0.08)] cursor-default">
            <div className="text-3xl md:text-5xl font-black text-[#4B27B1] group-hover:text-[#FF8A00] mb-2 tracking-tight transition-colors duration-300">29+</div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-600 group-hover:text-amber-700 uppercase tracking-widest leading-none transition-colors duration-300">{t('who_we_are.stats.years')}</div>
          </div>
          <div className="group bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100/80 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:bg-amber-50/20 hover:border-[#FF8A00]/30 hover:shadow-[0_12px_30px_rgba(255,138,0,0.08)] cursor-default">
            <div className="text-3xl md:text-5xl font-black text-[#4B27B1] group-hover:text-[#FF8A00] mb-2 tracking-tight transition-colors duration-300">700+</div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-600 group-hover:text-amber-700 uppercase tracking-widest leading-none transition-colors duration-300">{t('who_we_are.stats.clients')}</div>
          </div>
          <div className="group bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100/80 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:bg-amber-50/20 hover:border-[#FF8A00]/30 hover:shadow-[0_12px_30px_rgba(255,138,0,0.08)] cursor-default">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#4B27B1] group-hover:text-[#FF8A00] mb-2 tracking-tight whitespace-nowrap transition-colors duration-300">37,000+</div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-600 group-hover:text-amber-700 uppercase tracking-widest leading-none transition-colors duration-300">{t('who_we_are.stats.shipments')}</div>
          </div>
          <div className="group bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100/80 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:bg-amber-50/20 hover:border-[#FF8A00]/30 hover:shadow-[0_12px_30px_rgba(255,138,0,0.08)] cursor-default">
            <div className="text-3xl md:text-5xl font-black text-[#4B27B1] group-hover:text-[#FF8A00] mb-2 tracking-tight transition-colors duration-300">960</div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-600 group-hover:text-amber-700 uppercase tracking-widest leading-none transition-colors duration-300">{t('who_we_are.stats.projects')}</div>
          </div>
        </div>

        {/* Interactive Vertical-Strip Showcase/Slider */}
        <div className="relative w-full h-[520px] md:h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 bg-slate-900 group/showcase">
          {/* 1. Dynamic Background Image Layers with Cross-Fade */}
          {aboutCards.map((card, idx) => (
            <div
              key={`bg-${card.id}`}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                activeIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
              style={{
                backgroundImage: `url(${card.img})`,
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
            {aboutCards.map((card, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={card.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex-1 h-full flex flex-col justify-end p-6 md:p-8 border-r border-white/10 last:border-r-0 cursor-pointer transition-all duration-700 relative overflow-hidden ${
                    isActive ? 'bg-black/10' : 'bg-black/55 hover:bg-black/40'
                  }`}
                >
                  <div className="relative z-10 flex flex-col text-left h-full justify-end">
                    {/* Badge */}
                    <div className="border border-white/40 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm w-fit mb-3 bg-black/20 backdrop-blur-[2px] leading-none">
                      {card.highlights[0] || 'INFO'}
                    </div>

                    {/* Title */}
                    <h3 className={`text-base md:text-xl lg:text-2xl font-black tracking-tight leading-tight transition-colors duration-500 ${
                      isActive ? 'text-[#facc15]' : 'text-white'
                    }`}>
                      {card.title}
                    </h3>

                    {/* Expanding details for the active card */}
                    <div className={`transition-all duration-700 ease-in-out overflow-hidden ${
                      isActive ? 'max-h-[280px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                    }`}>
                      <p className="text-white/85 text-xs md:text-sm leading-relaxed mb-4 font-medium"
                         dangerouslySetInnerHTML={{ __html: highlightTerms(card.desc) }}
                      />
                      
                      {/* highlights */}
                      <div className="space-y-2 mb-5">
                        {card.highlights.slice(1).map((hl, i) => (
                          <div key={i} className="flex items-center gap-2 text-white/90 text-xs font-semibold">
                            <Check className="w-3.5 h-3.5 text-[#facc15] shrink-0" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <Link 
                        to={card.linkTarget}
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-[#facc15] font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md backdrop-blur-sm self-start"
                      >
                        <span>{card.ctaText || 'Explore'}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. Mobile Single-Slide Content Overlay (under sm screen sizes) */}
          <div className="flex sm:hidden relative z-10 h-full w-full flex-col justify-end p-6 text-left">
            <div className="border border-white/40 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm w-fit mb-3 bg-black/20 backdrop-blur-[2px] leading-none">
              {aboutCards[activeIndex].highlights[0] || 'INFO'}
            </div>
            
            <h3 className="text-xl font-black text-[#facc15] tracking-tight leading-tight mb-3">
              {aboutCards[activeIndex].title}
            </h3>
            
            <p className="text-white/85 text-xs leading-relaxed mb-4 font-medium"
               dangerouslySetInnerHTML={{ __html: highlightTerms(aboutCards[activeIndex].desc) }}
            />

            <div className="space-y-1.5 mb-5">
              {aboutCards[activeIndex].highlights.slice(1).map((hl, i) => (
                <div key={i} className="flex items-center gap-2 text-white/90 text-xs font-bold">
                  <Check className="w-3.5 h-3.5 text-[#facc15] shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>

            <Link 
              to={aboutCards[activeIndex].linkTarget}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-black text-xs px-4 py-3 rounded-xl backdrop-blur-sm w-fit"
            >
              <span>{aboutCards[activeIndex].ctaText || 'Explore'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 4. Left and Right Controls */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => (prev === 0 ? aboutCards.length - 1 : prev - 1));
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => (prev === aboutCards.length - 1 ? 0 : prev + 1));
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
          >
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>


        </div>

        {/* 6. Dot Navigation Indicator */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {aboutCards.map((_, idx) => (
            <button 
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-2 transition-all duration-300 rounded-full ${
                activeIndex === idx ? 'w-8 bg-[#FF8A00]' : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
