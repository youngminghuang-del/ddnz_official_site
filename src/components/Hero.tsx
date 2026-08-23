import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageCircle, ArrowRight, Ship } from 'lucide-react';
import { getImgUrl } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';
import { trackEvent } from '../lib/utils';
import { buildAttributedWhatsAppUrl, readAttribution } from '../lib/attribution';

type HeroRouteCopy = {
  origin: string;
  latinAmerica: string;
  middleEast: string;
  westAfrica: string;
  centralAsia: string;
  latinCountries: string;
  middleEastCountries: string;
  westAfricaCountries: string;
  centralAsiaCountries: string;
  viewRoutes: string;
};

const HERO_ROUTE_COPY: Record<Language, HeroRouteCopy> = {
  en: {
    origin: 'China origin',
    latinAmerica: 'Latin America',
    middleEast: 'Middle East',
    westAfrica: 'West Africa',
    centralAsia: 'Central Asia',
    latinCountries: 'Mexico / Brazil / Peru / Chile',
    middleEastCountries: 'Saudi Arabia / UAE / Qatar / Oman / Bahrain',
    westAfricaCountries: 'Nigeria / Ghana / Côte d’Ivoire / Senegal',
    centralAsiaCountries: 'Kazakhstan / Uzbekistan / Kyrgyzstan / Tajikistan',
    viewRoutes: 'View routes',
  },
  zh: {
    origin: '中国始发',
    latinAmerica: '拉丁美洲',
    middleEast: '中东',
    westAfrica: '西非',
    centralAsia: '中亚',
    latinCountries: '墨西哥 / 巴西 / 秘鲁 / 智利',
    middleEastCountries: '沙特 / 阿联酋 / 卡塔尔 / 阿曼 / 巴林',
    westAfricaCountries: '尼日利亚 / 加纳 / 科特迪瓦 / 塞内加尔',
    centralAsiaCountries: '哈萨克斯坦 / 乌兹别克斯坦 / 吉尔吉斯斯坦 / 塔吉克斯坦',
    viewRoutes: '查看路线',
  },
  ru: {
    origin: 'Из Китая',
    latinAmerica: 'Латинская Америка',
    middleEast: 'Ближний Восток',
    westAfrica: 'Западная Африка',
    centralAsia: 'Центральная Азия',
    latinCountries: 'Мексика / Бразилия / Перу / Чили',
    middleEastCountries: 'Саудовская Аравия / ОАЭ / Катар / Оман / Бахрейн',
    westAfricaCountries: 'Нигерия / Гана / Кот-д’Ивуар / Сенегал',
    centralAsiaCountries: 'Казахстан / Узбекистан / Кыргызстан / Таджикистан',
    viewRoutes: 'Маршруты',
  },
  fr: {
    origin: 'Départ Chine',
    latinAmerica: 'Amérique latine',
    middleEast: 'Moyen-Orient',
    westAfrica: 'Afrique de l’Ouest',
    centralAsia: 'Asie centrale',
    latinCountries: 'Mexique / Brésil / Pérou / Chili',
    middleEastCountries: 'Arabie saoudite / EAU / Qatar / Oman / Bahreïn',
    westAfricaCountries: 'Nigeria / Ghana / Côte d’Ivoire / Sénégal',
    centralAsiaCountries: 'Kazakhstan / Ouzbékistan / Kirghizistan / Tadjikistan',
    viewRoutes: 'Voir les routes',
  },
  es: {
    origin: 'Origen China',
    latinAmerica: 'América Latina',
    middleEast: 'Oriente Medio',
    westAfrica: 'África Occidental',
    centralAsia: 'Asia Central',
    latinCountries: 'México / Brasil / Perú / Chile',
    middleEastCountries: 'Arabia Saudita / EAU / Catar / Omán / Baréin',
    westAfricaCountries: 'Nigeria / Ghana / Costa de Marfil / Senegal',
    centralAsiaCountries: 'Kazajistán / Uzbekistán / Kirguistán / Tayikistán',
    viewRoutes: 'Ver rutas',
  },
  ar: {
    origin: 'من الصين',
    latinAmerica: 'أمريكا اللاتينية',
    middleEast: 'الشرق الأوسط',
    westAfrica: 'غرب أفريقيا',
    centralAsia: 'آسيا الوسطى',
    latinCountries: 'المكسيك / البرازيل / بيرو / تشيلي',
    middleEastCountries: 'السعودية / الإمارات / قطر / عُمان / البحرين',
    westAfricaCountries: 'نيجيريا / غانا / ساحل العاج / السنغال',
    centralAsiaCountries: 'كازاخستان / أوزبكستان / قيرغيزستان / طاجيكستان',
    viewRoutes: 'عرض المسارات',
  },
  pt: {
    origin: 'Origem China', latinAmerica: 'América Latina', middleEast: 'Oriente Médio', westAfrica: 'África Ocidental', centralAsia: 'Ásia Central',
    latinCountries: 'México / Brasil / Peru / Chile', middleEastCountries: 'Arábia Saudita / EAU / Catar / Omã / Bahrein', westAfricaCountries: 'Nigéria / Gana / Costa do Marfim / Senegal', centralAsiaCountries: 'Cazaquistão / Uzbequistão / Quirguistão / Tajiquistão', viewRoutes: 'Ver rotas',
  },
  tr: {
    origin: 'Çin çıkışı', latinAmerica: 'Latin Amerika', middleEast: 'Orta Doğu', westAfrica: 'Batı Afrika', centralAsia: 'Orta Asya',
    latinCountries: 'Meksika / Brezilya / Peru / Şili', middleEastCountries: 'Suudi Arabistan / BAE / Katar / Umman / Bahreyn', westAfricaCountries: 'Nijerya / Gana / Fildişi Sahili / Senegal', centralAsiaCountries: 'Kazakistan / Özbekistan / Kırgızistan / Tacikistan', viewRoutes: 'Rotaları görüntüle',
  },
};

export default function Hero() {
  const { t, language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [activeRouteKey, setActiveRouteKey] = useState('latin-america');
  const attribution = readAttribution();
  const routeCopy = HERO_ROUTE_COPY[language];
  const localePrefix = language === 'en' ? '' : language === 'zh' ? '/zh-cn' : `/${language}`;
  const heroRoutes = [
    {
      key: 'latin-america',
      label: routeCopy.latinAmerica,
      countries: routeCopy.latinCountries,
      href: `${localePrefix}/shipping-from-china-to-latin-america?country=mexico`,
    },
    {
      key: 'middle-east',
      label: routeCopy.middleEast,
      countries: routeCopy.middleEastCountries,
      href: `${localePrefix}/shipping-from-china-to-middle-east?country=saudi-arabia`,
    },
    {
      key: 'west-africa',
      label: routeCopy.westAfrica,
      countries: routeCopy.westAfricaCountries,
      href: `${localePrefix}/shipping-from-china-to-west-africa?country=nigeria`,
    },
    {
      key: 'central-asia',
      label: routeCopy.centralAsia,
      countries: routeCopy.centralAsiaCountries,
      href: `${localePrefix}/shipping-from-china-to-central-asia?country=kazakhstan`,
    },
  ];
  const whatsAppUrl = buildAttributedWhatsAppUrl(
    'Hi DDNZ / Heaven Born, I’m interested in sourcing or logistics support from China. Can we talk?',
    attribution,
  );

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', {
      cta_location: 'hero_section',
      utm_source: attribution.utm_source,
      utm_campaign: attribution.utm_campaign,
      utm_content: attribution.utm_content,
    });
  };

  const handlePrimaryCtaClick = () => {
    trackEvent('quote_click', { cta_location: 'hero_section' });
  };

  return (
    <section className="relative min-h-[720px] min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#071A33] pb-6 pt-24 font-sans sm:pb-8 sm:pt-28 lg:pb-10 lg:pt-32">
      <div className="absolute inset-0 z-0">
        <img
          src={getImgUrl('HERO_BG')}
          alt="China Freight Forwarder - Heaven Born Global Logistics Hub Since 1997"
          className="w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
          width={1080}
          height={1440}
        />
        {/* Asymmetric Gradient Mask Overlay & Ambient Darkening */}
        <div className="absolute inset-0 bg-[#071A33]/55 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071A33]/95 via-[#0B2A4A]/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,136,229,0.15)_0%,transparent_80%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center"
        >
          {/* Primary Headline */}
          <h1
            className={
              language === 'zh'
                ? 'w-[min(96vw,1200px)] text-[clamp(1rem,5.85vw,4rem)] font-extrabold text-white tracking-[-0.025em] leading-[1.16] mb-4'
                : 'max-w-5xl text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] mb-4'
            }
          >
            <span className={language === 'zh' ? 'block whitespace-nowrap' : 'block'}>
              {t('hero.title1') || 'Your Premier China Freight Forwarder'}
            </span>
            <span className={`block mt-1.5 bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-blue-300 to-amber-300 font-extrabold ${language === 'zh' ? 'whitespace-nowrap' : ''}`}>
              {t('hero.title2') || 'For Global Logistics Solutions.'}
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 mt-4 font-normal">
            {t('hero.subtitle')}
          </p>
          
          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10">
            {/* Primary Action Button */}
            <a
              href="#get-a-quote"
              data-analytics-tracked="true"
              onClick={handlePrimaryCtaClick}
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base font-bold rounded-full text-white bg-gradient-to-r from-[#EA6A12] to-[#F59E0B] hover:opacity-95 hover:shadow-xl hover:shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 duration-200 cursor-pointer"
            >
              {t('hero.primary_cta') || 'Calculate Freight & Get Quote'}
              <ArrowRight className="w-4 h-4 ml-2 animate-pulse" />
            </a>

            {/* WhatsApp Chat Button */}
            <a
              href={whatsAppUrl}
              data-analytics-tracked="true"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base font-bold rounded-full text-white bg-[#25D366] hover:bg-[#20bd5a] hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 duration-200"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t('hero.chat') || 'Chat on WhatsApp'}
            </a>
          </div>

          {/* Priority trade-lane route axis */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-5xl mx-auto overflow-x-auto overscroll-x-contain px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Priority shipping routes from China"
          >
            <div className="relative min-w-[720px] sm:min-w-0 px-3 pt-1" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <div className="absolute left-[3.8rem] right-[3.6rem] top-[1.12rem] h-px bg-gradient-to-r from-sky-300/80 via-sky-300/60 to-white/30" aria-hidden="true" />
              <div
                className="relative grid grid-cols-[6.5rem_repeat(4,minmax(8.25rem,1fr))] sm:grid-cols-[7rem_repeat(4,minmax(0,1fr))] gap-0 items-start"
                onMouseLeave={() => setActiveRouteKey('latin-america')}
              >
                <div className="flex flex-col items-center text-center">
                  <span className="relative z-10 grid h-9 w-9 place-items-center rounded-full border border-sky-300/60 bg-[#0A2747] shadow-[0_0_0_5px_rgba(7,26,51,0.85)]">
                    <Ship className="h-4 w-4 text-sky-200" aria-hidden="true" />
                  </span>
                  <span className="mt-2 text-xs font-extrabold tracking-[0.12em] text-sky-100 uppercase">{routeCopy.origin}</span>
                </div>

                {heroRoutes.map((route) => {
                  const isActive = activeRouteKey === route.key;

                  return (
                    <motion.a
                      key={route.key}
                      href={route.href}
                      onMouseEnter={() => setActiveRouteKey(route.key)}
                      onFocus={() => setActiveRouteKey(route.key)}
                      onBlur={() => setActiveRouteKey('latin-america')}
                      onClick={() => trackEvent('hero_route_click', { region: route.key, cta_location: 'hero_route_line' })}
                      whileHover={reduceMotion ? undefined : { y: -3 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                      className="group relative flex min-w-0 flex-col items-center text-center outline-none focus-visible:ring-2 focus-visible:ring-amber-300/80 focus-visible:ring-offset-4 focus-visible:ring-offset-[#071A33] rounded-xl"
                      aria-label={`${routeCopy.viewRoutes}: ${route.label}`}
                      aria-current={isActive ? 'location' : undefined}
                    >
                      <span className="relative z-10 grid h-9 w-9 place-items-center" aria-hidden="true">
                        {isActive ? (
                          <motion.span
                            layoutId={reduceMotion ? undefined : 'hero-active-route-node'}
                            className="relative h-8 w-8 rounded-full border-[5px] border-[#F59E0B] bg-white shadow-[0_0_0_5px_rgba(7,26,51,0.85),0_0_22px_rgba(245,158,11,0.42)]"
                            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                          >
                            <motion.span
                              className="absolute -inset-[6px] rounded-full border border-amber-300/70"
                              animate={reduceMotion ? { opacity: 0.45 } : { opacity: [0.65, 0], scale: [1, 1.75] }}
                              transition={reduceMotion ? { duration: 0 } : { duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                            />
                          </motion.span>
                        ) : (
                          <span className="h-4 w-4 rounded-full border-2 border-sky-100 bg-[#071A33] shadow-[0_0_0_5px_rgba(7,26,51,0.85)] transition-colors duration-200 group-hover:border-amber-300 group-hover:bg-amber-300" />
                        )}
                      </span>

                      <motion.span
                        animate={reduceMotion ? undefined : { scale: isActive ? 1.05 : 1 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                        className={`mt-2 text-sm font-extrabold transition-colors ${isActive ? 'text-amber-300' : 'text-slate-100 group-hover:text-amber-200'}`}
                      >
                        {route.label}
                      </motion.span>

                      <motion.span
                        aria-hidden={!isActive}
                        animate={reduceMotion ? undefined : { opacity: isActive ? 1 : 0, y: isActive ? 0 : 6 }}
                        className={`mt-1 flex min-h-[2.75rem] flex-col items-center ${isActive ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
                      >
                        <span className="text-[11px] font-medium leading-4 text-slate-300">{route.countries}</span>
                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-sky-200 group-hover:text-white">
                          {routeCopy.viewRoutes}
                          <ArrowRight className="h-3 w-3" aria-hidden="true" />
                        </span>
                      </motion.span>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
