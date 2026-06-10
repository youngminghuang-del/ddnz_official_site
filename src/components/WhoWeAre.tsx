import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
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
      highlightedText = highlightedText.replace(regex, '<span class="font-bold text-slate-700">$1</span>');
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
          <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100/80 hover:shadow-md transition-shadow">
            <div className="text-3xl md:text-5xl font-black text-[#4B27B1] mb-2 tracking-tight">29+</div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-600 uppercase tracking-widest leading-none">{t('who_we_are.stats.years')}</div>
          </div>
          <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100/80 hover:shadow-md transition-shadow">
            <div className="text-3xl md:text-5xl font-black text-[#4B27B1] mb-2 tracking-tight">700+</div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-600 uppercase tracking-widest leading-none">{t('who_we_are.stats.clients')}</div>
          </div>
          <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100/80 hover:shadow-md transition-shadow">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#4B27B1] mb-2 tracking-tight whitespace-nowrap">37,000+</div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-600 uppercase tracking-widest leading-none">{t('who_we_are.stats.shipments')}</div>
          </div>
          <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100/80 hover:shadow-md transition-shadow">
            <div className="text-3xl md:text-5xl font-black text-[#4B27B1] mb-2 tracking-tight">960</div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-600 uppercase tracking-widest leading-none">{t('who_we_are.stats.projects')}</div>
          </div>
        </div>

        {/* Standardized Card Container - Slider on Mobile, 4-Col Grid on Desktop */}
        <div 
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-hide pb-6 -mx-4 px-4 gap-4 lg:gap-8 lg:mx-0 lg:px-0"
        >
          {aboutCards.map((card) => {
            return (
              <Link 
                to={card.linkTarget}
                key={card.id} 
                className="group cursor-pointer relative bg-white rounded-2xl shadow-sm lg:shadow-xl border border-slate-100 transition-all duration-500 flex flex-col overflow-hidden lg:hover:-translate-y-3 min-h-[510px] md:min-h-[540px] lg:min-h-[560px] snap-center min-w-[85vw] md:min-w-[45vw] lg:min-w-0"
              >
                {/* Image aspect ratio identical to services */}
                <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={card.img} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" alt={card.title} loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1 relative">
                  {/* Symmetrical Left Gradient Header */}
                  <div className="flex items-center min-h-[50px] md:min-h-[60px] mb-4 md:mb-5 group/title text-left">
                    <div className="w-[1.5px] md:w-[2px] h-full self-stretch bg-gradient-to-b from-[#4B27B1] to-[#FF8A00] mr-4 md:mr-5 rounded-full" />
                    <h3 className="text-lg md:text-xl font-black text-[#4B27B1] tracking-tight group-hover:text-[#FF8A00] transition-colors duration-300 leading-tight">
                      {card.title}
                    </h3>
                  </div>
                  
                  {/* 3 Core Bullet Points - Identical Height and Spacing */}
                  <ul className="mb-6 space-y-3 min-h-[100px] md:min-h-[110px]">
                    {card.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start text-slate-700 font-semibold group/item">
                        <Check className="w-4 h-4 mr-3 text-[#FF8A00] shrink-0 mt-[3px] transition-transform group-hover/item:scale-110" />
                        <span className="text-[13px] md:text-[14px] leading-snug">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Concise Summary Paragraph - Locked Max-height */}
                  <div className="mb-4 overflow-hidden">
                    <div 
                      className="text-slate-500 text-sm leading-relaxed text-left min-h-[60px] md:min-h-[70px]"
                      dangerouslySetInnerHTML={{ __html: highlightTerms(card.desc) }}
                    />
                  </div>

                  <div className="flex-1" />
                  
                  {/* Micro gradient action line */}
                  <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] transition-all duration-500 group-hover:w-full md:block hidden" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Page Progress Indicators */}
        <div className="flex justify-center items-center gap-1.5 mt-2 lg:hidden">
          {aboutCards.map((_, idx) => (
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
