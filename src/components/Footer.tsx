import { useState } from 'react';
import {
  ArrowRight,
  Clock3,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  Share2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LegalModal, { LegalType } from './LegalModal';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';
import { trackEvent } from '../lib/utils';
import { buildQuoteHref } from '../lib/quoteLinks';
import { canonicalSitePath } from '../lib/notionArticleRouting';
import { PUBLIC_SOCIAL_CHANNELS, SOCIAL_CHANNELS } from '../config/socialChannels';

const socialIcons = {
  linkedin: Linkedin,
  facebook: Share2,
  instagram: Instagram,
  tiktok: Music2,
  whatsapp: MessageCircle,
};

const localePrefix: Record<Language, string> = {
  en: '',
  zh: '/zh-cn',
  ru: '/ru',
  fr: '/fr',
  es: '/es',
  ar: '/ar',
  pt: '/pt',
  tr: '/tr',
};

type FooterCopy = {
  primaryCta: string;
  brandDescriptor: string;
  categories: string;
  markets: string;
  contact: string;
  kitchen: string;
  audio: string;
  mobile: string;
  middleEast: string;
  westAfrica: string;
  latinAmerica: string;
  insights: string;
  hbLabel: string;
  hours: string;
  legalNote: string;
  socialLabel: string;
};

const footerCopy: Record<Language, FooterCopy> = {
  en: {
    primaryCta: 'Start a sourcing brief',
    brandDescriptor: 'Source, inspect and export commercial products from China with one accountable coordination team.',
    categories: 'Product sourcing',
    markets: 'Priority markets',
    contact: 'Talk to the team',
    kitchen: 'Commercial kitchen equipment',
    audio: 'Audio & speakers',
    mobile: 'Mobile accessories',
    middleEast: 'Middle East',
    westAfrica: 'West Africa',
    latinAmerica: 'Latin America',
    insights: 'Sourcing insights',
    hbLabel: 'Freight execution · Operating since 1997',
    hours: 'Mon–Fri, 09:00–18:00 (GMT+8)',
    legalNote: 'Sourcing and trade support: DDNZ Global Trade Co., Ltd. · Freight execution: Heaven Born International Freight Co., Ltd.',
    socialLabel: 'DDNZ public channels',
  },
  zh: {
    primaryCta: '提交采购需求',
    brandDescriptor: '从中国采购、验货并出口商用产品，由一个团队统一负责协调。',
    categories: '产品采购',
    markets: '重点市场',
    contact: '联系团队',
    kitchen: '商用餐厨设备',
    audio: '音响与扬声器',
    mobile: '手机配件',
    middleEast: '中东',
    westAfrica: '西非',
    latinAmerica: '中南美',
    insights: '采购洞察',
    hbLabel: '货运执行 · 始于 1997 年',
    hours: '周一至周五 09:00–18:00（GMT+8）',
    legalNote: '采购与贸易支持：DDNZ Global Trade Co., Ltd. · 货运执行：Heaven Born International Freight Co., Ltd.',
    socialLabel: 'DDNZ 官方社交渠道',
  },
  ru: {
    primaryCta: 'Начать заявку на закупку',
    brandDescriptor: 'Поиск, проверка и экспорт коммерческих товаров из Китая под ответственностью одной координационной команды.',
    categories: 'Поиск товаров',
    markets: 'Приоритетные рынки',
    contact: 'Связаться с командой',
    kitchen: 'Профессиональное кухонное оборудование',
    audio: 'Аудио и акустика',
    mobile: 'Мобильные аксессуары',
    middleEast: 'Ближний Восток',
    westAfrica: 'Западная Африка',
    latinAmerica: 'Латинская Америка',
    insights: 'Материалы о закупках',
    hbLabel: 'Перевозка · Работаем с 1997 года',
    hours: 'Пн–Пт, 09:00–18:00 (GMT+8)',
    legalNote: 'Закупки и торговая поддержка: DDNZ Global Trade Co., Ltd. · Перевозка: Heaven Born International Freight Co., Ltd.',
    socialLabel: 'Официальные каналы DDNZ',
  },
  fr: {
    primaryCta: 'Démarrer un brief sourcing',
    brandDescriptor: 'Sourcer, inspecter et exporter des produits commerciaux depuis la Chine avec une seule équipe responsable.',
    categories: 'Sourcing produits',
    markets: 'Marchés prioritaires',
    contact: 'Parler à l’équipe',
    kitchen: 'Équipement de cuisine professionnelle',
    audio: 'Audio et enceintes',
    mobile: 'Accessoires mobiles',
    middleEast: 'Moyen-Orient',
    westAfrica: 'Afrique de l’Ouest',
    latinAmerica: 'Amérique latine',
    insights: 'Conseils sourcing',
    hbLabel: 'Exécution fret · Depuis 1997',
    hours: 'Lun–Ven, 09:00–18:00 (GMT+8)',
    legalNote: 'Sourcing et appui commercial : DDNZ Global Trade Co., Ltd. · Exécution fret : Heaven Born International Freight Co., Ltd.',
    socialLabel: 'Canaux publics DDNZ',
  },
  es: {
    primaryCta: 'Iniciar solicitud de abastecimiento',
    brandDescriptor: 'Buscar, inspeccionar y exportar productos comerciales desde China con un único equipo responsable.',
    categories: 'Abastecimiento de productos',
    markets: 'Mercados prioritarios',
    contact: 'Hablar con el equipo',
    kitchen: 'Equipamiento de cocina comercial',
    audio: 'Audio y altavoces',
    mobile: 'Accesorios móviles',
    middleEast: 'Oriente Medio',
    westAfrica: 'África Occidental',
    latinAmerica: 'América Latina',
    insights: 'Guías de abastecimiento',
    hbLabel: 'Ejecución de flete · Desde 1997',
    hours: 'Lun–Vie, 09:00–18:00 (GMT+8)',
    legalNote: 'Abastecimiento y apoyo comercial: DDNZ Global Trade Co., Ltd. · Ejecución de flete: Heaven Born International Freight Co., Ltd.',
    socialLabel: 'Canales públicos de DDNZ',
  },
  ar: {
    primaryCta: 'بدء موجز التوريد',
    brandDescriptor: 'توريد المنتجات التجارية وفحصها وتصديرها من الصين مع فريق تنسيق واحد مسؤول.',
    categories: 'توريد المنتجات',
    markets: 'الأسواق ذات الأولوية',
    contact: 'تواصل مع الفريق',
    kitchen: 'معدات المطابخ التجارية',
    audio: 'الصوت ومكبرات الصوت',
    mobile: 'إكسسوارات الهواتف',
    middleEast: 'الشرق الأوسط',
    westAfrica: 'غرب أفريقيا',
    latinAmerica: 'أمريكا اللاتينية',
    insights: 'رؤى التوريد',
    hbLabel: 'تنفيذ الشحن · منذ 1997',
    hours: 'الاثنين–الجمعة، 09:00–18:00 (GMT+8)',
    legalNote: 'التوريد والدعم التجاري: DDNZ Global Trade Co., Ltd. · تنفيذ الشحن: Heaven Born International Freight Co., Ltd.',
    socialLabel: 'قنوات DDNZ العامة',
  },
  pt: {
    primaryCta: 'Iniciar solicitação de sourcing',
    brandDescriptor: 'Encontre, inspecione e exporte produtos comerciais da China com uma equipe responsável.',
    categories: 'Sourcing de produtos', markets: 'Mercados prioritários', contact: 'Fale com a equipe',
    kitchen: 'Equipamentos para cozinha profissional', audio: 'Áudio e caixas de som', mobile: 'Acessórios para celular',
    middleEast: 'Oriente Médio', westAfrica: 'África Ocidental', latinAmerica: 'América Latina', insights: 'Conteúdos de sourcing',
    hbLabel: 'Execução do transporte · Desde 1997', hours: 'Seg–Sex, 09:00–18:00 (GMT+8)',
    legalNote: 'Sourcing e apoio comercial: DDNZ Global Trade Co., Ltd. · Execução do transporte: Heaven Born International Freight Co., Ltd.',
    socialLabel: 'Canais oficiais da DDNZ',
  },
  tr: {
    primaryCta: 'Tedarik talebi oluştur',
    brandDescriptor: 'Çin’den ticari ürünleri tek bir sorumlu ekiple bulun, denetleyin ve ihraç edin.',
    categories: 'Ürün tedariği', markets: 'Öncelikli pazarlar', contact: 'Ekiple görüşün',
    kitchen: 'Endüstriyel mutfak ekipmanları', audio: 'Ses ve hoparlör', mobile: 'Mobil aksesuarlar',
    middleEast: 'Orta Doğu', westAfrica: 'Batı Afrika', latinAmerica: 'Latin Amerika', insights: 'Tedarik içerikleri',
    hbLabel: 'Nakliye uygulaması · 1997’den beri', hours: 'Pzt–Cum, 09:00–18:00 (GMT+8)',
    legalNote: 'Tedarik ve ticari destek: DDNZ Global Trade Co., Ltd. · Nakliye uygulaması: Heaven Born International Freight Co., Ltd.',
    socialLabel: 'DDNZ resmi kanalları',
  },
};

export default function Footer() {
  const [legalType, setLegalType] = useState<LegalType>(null);
  const { t, language } = useLanguage();
  const copy = footerCopy[language];
  const prefix = localePrefix[language];
  const localizedPath = (path: string) => canonicalSitePath(`${prefix}${path}`);

  const quoteHref = buildQuoteHref({
    intent: 'Product Sourcing',
    language,
    source: 'footer_primary',
  });

  const cookieLabel: Record<Language, string> = {
    en: 'Cookie settings',
    zh: 'Cookie 设置',
    ru: 'Настройки Cookie',
    fr: 'Paramètres des cookies',
    es: 'Configuración de cookies',
    ar: 'إعدادات ملفات الارتباط',
    pt: 'Configurações de cookies',
    tr: 'Çerez ayarları',
  };

  const handleContactClick = (method: string) => {
    const eventName = method === 'phone'
      ? 'phone_click'
      : method === 'email'
        ? 'email_click'
        : `${method}_click`;
    trackEvent(eventName, { cta_location: 'footer' });
  };

  const productLinks = [
    { label: copy.kitchen, to: localizedPath('/sourcing/commercial-kitchen-equipment-from-china') },
    { label: copy.audio, to: localizedPath('/sourcing/audio-speakers-from-china') },
    { label: copy.mobile, to: localizedPath('/sourcing/mobile-accessories-from-china') },
  ];

  const marketLinks = [
    { label: copy.middleEast, to: localizedPath('/shipping-from-china-to-middle-east') },
    { label: copy.westAfrica, to: localizedPath('/shipping-from-china-to-west-africa') },
    { label: copy.latinAmerica, to: localizedPath('/shipping-from-china-to-latin-america') },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[#173554] bg-[#07182E] text-slate-200">
      <div
        className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#763c9c_0%,#b66485_46%,#e47a50_100%)]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-x-8 gap-y-9 py-9 md:grid-cols-2 lg:grid-cols-12 lg:py-10">
          <h2 className="sr-only">DDNZ Global sourcing, markets and contact information</h2>

          <div className="md:col-span-2 lg:col-span-3 lg:pr-4 rtl:lg:pl-4 rtl:lg:pr-0">
            <Link
              to={localizedPath('/')}
              aria-label="DDNZ Global home"
              className="inline-flex min-h-12 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A4E6] focus-visible:ring-offset-4 focus-visible:ring-offset-[#07182E]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden">
                <img
                  src="/images/brand/ddnz-global-mark-v1.png"
                  alt=""
                  width="512"
                  height="512"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="bg-[linear-gradient(105deg,#C59AD8_0%,#D9819C_48%,#FF9A70_100%)] bg-clip-text text-[1.25rem] font-black leading-none tracking-[0.015em] text-transparent sm:text-[1.4rem]">
                  DDNZ GLOBAL
                </span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
                  China Sourcing &amp; Export
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm font-semibold leading-6 text-white">{copy.brandDescriptor}</p>
            <Link
              to={quoteHref}
              onClick={() => trackEvent('cta_click', { cta_location: 'footer', cta_type: 'sourcing_brief' })}
              className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-black text-[#FF9A70] transition-colors hover:text-[#FFC1A8] focus-visible:outline-none focus-visible:underline"
            >
              {copy.primaryCta}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>

          <nav aria-labelledby="footer-products-title" className="lg:col-span-3">
            <h3 id="footer-products-title" className="text-xs font-black uppercase tracking-[0.16em] text-[#D6A4E6]">
              {copy.categories}
            </h3>
            <ul className="mt-4 space-y-1">
              {productLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group inline-flex min-h-11 items-center py-2 text-sm font-semibold leading-5 text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white focus-visible:underline"
                  >
                    <span className="mr-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C94F2F] transition-transform group-hover:scale-125 rtl:ml-3 rtl:mr-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-markets-title" className="lg:col-span-2">
            <h3 id="footer-markets-title" className="text-xs font-black uppercase tracking-[0.16em] text-[#D6A4E6]">
              {copy.markets}
            </h3>
            <ul className="mt-4 space-y-1">
              {marketLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group inline-flex min-h-11 items-center py-2 text-sm font-semibold leading-5 text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white focus-visible:underline"
                  >
                    <ArrowRight className="mr-2 h-3.5 w-3.5 shrink-0 text-[#C381DD] transition-transform group-hover:translate-x-0.5 rtl:ml-2 rtl:mr-0 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#D6A4E6]">{copy.contact}</h3>
            <div className="mt-4 grid gap-2">
              <a
                href="mailto:partnership@ddnzglobal.com"
                data-analytics-tracked="true"
                onClick={() => handleContactClick('email')}
                className="group inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-white transition-colors hover:text-[#FFD0BE] focus-visible:outline-none focus-visible:underline"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#E48464]" aria-hidden="true" />
                <span className="break-all">partnership@ddnzglobal.com</span>
              </a>
              <a
                href="tel:+862036546132"
                data-analytics-tracked="true"
                onClick={() => handleContactClick('phone')}
                className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-white transition-colors hover:text-[#FFD0BE] focus-visible:outline-none focus-visible:underline"
              >
                <Phone className="h-4 w-4 shrink-0 text-[#E48464]" aria-hidden="true" />
                {language === 'zh' ? '020 3654 6132' : '+86 20 3654 6132'}
              </a>
              <a
                href={SOCIAL_CHANNELS.whatsapp.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-tracked="true"
                onClick={() => handleContactClick('whatsapp')}
                className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-white transition-colors hover:text-[#B8F0CD] focus-visible:outline-none focus-visible:underline"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-[#63D391]" aria-hidden="true" />
                +852 6107 7362
              </a>
            </div>

            <div className="mt-3 flex flex-wrap gap-2" aria-label={copy.socialLabel}>
              {PUBLIC_SOCIAL_CHANNELS.filter((channel) => channel.platform !== 'whatsapp').map((channel) => {
                const Icon = socialIcons[channel.platform];
                return (
                  <a
                    key={channel.platform}
                    href={channel.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics-tracked="true"
                    onClick={() => handleContactClick(channel.platform)}
                    aria-label={`${channel.label}: ${channel.handle}`}
                    title={channel.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition-colors hover:border-[#A86CC3] hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A4E6]"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <section aria-label="Freight heritage, offices and working hours" className="grid gap-5 border-y border-white/10 py-5 text-sm md:grid-cols-3 md:items-center">
          <div className="flex items-center gap-3">
            <img
              src="/images/brand/heaven-born-wing-logo-v1.png"
              alt=""
              width="420"
              height="295"
              loading="lazy"
              decoding="async"
              className="h-7 w-auto shrink-0"
            />
            <div>
              <p className="font-black text-white">Heaven Born International Freight</p>
              <p className="mt-0.5 text-xs text-[#FF8A80]">{copy.hbLabel}</p>
            </div>
          </div>
          <address className="flex items-center gap-3 text-sm not-italic text-slate-300">
            <MapPin className="h-4 w-4 shrink-0 text-[#C381DD]" aria-hidden="true" />
            <span>{t('footer.hq')} · {t('footer.hk')}</span>
          </address>
          <p className="flex items-center gap-3 text-sm font-semibold text-slate-200">
            <Clock3 className="h-4 w-4 shrink-0 text-[#C381DD]" aria-hidden="true" />
            {copy.hours}
          </p>
        </section>

        <div className="flex flex-col gap-4 py-5 text-xs text-slate-400 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="leading-5">{copy.legalNote}</p>
            <p className="mt-1 leading-5 text-slate-500">© 2026 DDNZ Global Trade Co., Ltd. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link
              to={localizedPath('/insights')}
              className="inline-flex min-h-11 items-center font-semibold text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:underline"
            >
              {copy.insights}
            </Link>
            <button
              type="button"
              onClick={() => setLegalType('privacy')}
              className="min-h-11 text-left font-semibold text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:underline rtl:text-right"
            >
              {t('footer.privacy')}
            </button>
            <button
              type="button"
              onClick={() => setLegalType('terms')}
              className="min-h-11 text-left font-semibold text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:underline rtl:text-right"
            >
              {t('footer.terms')}
            </button>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
              className="min-h-11 text-left font-semibold text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:underline rtl:text-right"
            >
              {cookieLabel[language]}
            </button>
          </div>
        </div>
      </div>

      <LegalModal type={legalType} onClose={() => setLegalType(null)} />
    </footer>
  );
}
