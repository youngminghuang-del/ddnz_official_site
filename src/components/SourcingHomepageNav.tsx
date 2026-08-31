import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Globe2, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';
import { appendAttribution } from '../lib/attribution';
import { trackEvent } from '../lib/utils';
import notionBlogPosts from '../data/notionBlogData.json';
import {
  articleLanguageSwitchPath,
  canonicalSitePath,
  findArticleByRoute,
} from '../lib/notionArticleRouting';
import type { BlogPost } from '../types/content';

const languageLabels: Record<Language, string> = {
  en: 'EN',
  zh: '中文',
  ru: 'RU',
  fr: 'FR',
  es: 'ES',
  ar: 'العربية',
  pt: 'PT',
  tr: 'TR',
};

const navLabels: Record<Language, {
  home: string;
  products: string;
  services: string;
  markets: string;
  process: string;
  insights: string;
  start: string;
  kitchen: string;
  refrigeration: string;
  audio: string;
  mobile: string;
  outdoor: string;
  sourcing: string;
  qc: string;
  consolidation: string;
  middleEast: string;
  africa: string;
  latinAmerica: string;
  openMenu: string;
  closeMenu: string;
}> = {
  en: { home: 'Home', products: 'Products', services: 'Sourcing Services', markets: 'Markets', process: 'Process', insights: 'Insights', start: 'Start a sourcing brief', kitchen: 'Commercial kitchen', refrigeration: 'Refrigeration equipment', audio: 'Audio & speakers', mobile: 'Mobile accessories', outdoor: 'Outdoor products', sourcing: 'Supplier search & comparison', qc: 'Inspection & quality control', consolidation: 'Consolidation & export', middleEast: 'Middle East', africa: 'West Africa', latinAmerica: 'Latin America', openMenu: 'Open menu', closeMenu: 'Close menu' },
  zh: { home: '首页', products: '产品品类', services: '采购服务', markets: '目标市场', process: '服务流程', insights: '行业洞察', start: '提交采购需求', kitchen: '商用餐厨设备', refrigeration: '商用制冷设备', audio: '音响设备', mobile: '手机配件', outdoor: '户外用品', sourcing: '供应商搜索与比价', qc: '验货与质量控制', consolidation: '集货与出口交付', middleEast: '中东', africa: '西非', latinAmerica: '中南美', openMenu: '打开菜单', closeMenu: '关闭菜单' },
  ru: { home: 'Главная', products: 'Товары', services: 'Закупки', markets: 'Рынки', process: 'Процесс', insights: 'Материалы', start: 'Оставить заявку', kitchen: 'Проф. кухни', refrigeration: 'Холодильное оборудование', audio: 'Аудио и колонки', mobile: 'Мобильные аксессуары', outdoor: 'Товары для отдыха', sourcing: 'Поиск и сравнение поставщиков', qc: 'Инспекция и контроль качества', consolidation: 'Консолидация и экспорт', middleEast: 'Ближний Восток', africa: 'Западная Африка', latinAmerica: 'Латинская Америка', openMenu: 'Открыть меню', closeMenu: 'Закрыть меню' },
  fr: { home: 'Accueil', products: 'Produits', services: 'Services achats', markets: 'Marchés', process: 'Processus', insights: 'Ressources', start: 'Démarrer un brief', kitchen: 'Cuisine professionnelle', refrigeration: 'Équipement frigorifique', audio: 'Audio et enceintes', mobile: 'Accessoires mobiles', outdoor: 'Produits de plein air', sourcing: 'Recherche et comparaison', qc: 'Inspection et contrôle qualité', consolidation: 'Consolidation et export', middleEast: 'Moyen-Orient', africa: 'Afrique de l’Ouest', latinAmerica: 'Amérique latine', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu' },
  es: { home: 'Inicio', products: 'Productos', services: 'Servicios de compra', markets: 'Mercados', process: 'Proceso', insights: 'Actualidad', start: 'Iniciar solicitud', kitchen: 'Cocina comercial', refrigeration: 'Equipos de refrigeración', audio: 'Audio y altavoces', mobile: 'Accesorios móviles', outdoor: 'Actividades al aire libre', sourcing: 'Búsqueda y comparación', qc: 'Inspección y control de calidad', consolidation: 'Consolidación y exportación', middleEast: 'Oriente Medio', africa: 'África Occidental', latinAmerica: 'América Latina', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú' },
  ar: { home: 'الرئيسية', products: 'المنتجات', services: 'خدمات التوريد', markets: 'الأسواق', process: 'العملية', insights: 'المعرفة', start: 'ابدأ طلب التوريد', kitchen: 'معدات المطابخ', refrigeration: 'معدات التبريد', audio: 'الصوت ومكبرات الصوت', mobile: 'ملحقات الهاتف', outdoor: 'مستلزمات خارجية', sourcing: 'البحث عن الموردين والمقارنة', qc: 'الفحص ومراقبة الجودة', consolidation: 'التجميع والتصدير', middleEast: 'الشرق الأوسط', africa: 'غرب أفريقيا', latinAmerica: 'أمريكا اللاتينية', openMenu: 'فتح القائمة', closeMenu: 'إغلاق القائمة' },
  pt: { home: 'Início', products: 'Produtos', services: 'Serviços de sourcing', markets: 'Mercados', process: 'Processo', insights: 'Conteúdos', start: 'Iniciar solicitação', kitchen: 'Cozinha profissional', refrigeration: 'Equipamentos de refrigeração', audio: 'Áudio e caixas de som', mobile: 'Acessórios para celular', outdoor: 'Produtos outdoor', sourcing: 'Busca e comparação de fornecedores', qc: 'Inspeção e controle de qualidade', consolidation: 'Consolidação e exportação', middleEast: 'Oriente Médio', africa: 'África Ocidental', latinAmerica: 'América Latina', openMenu: 'Abrir menu', closeMenu: 'Fechar menu' },
  tr: { home: 'Ana sayfa', products: 'Ürünler', services: 'Tedarik hizmetleri', markets: 'Pazarlar', process: 'Süreç', insights: 'İçerikler', start: 'Tedarik talebi oluştur', kitchen: 'Endüstriyel mutfak', refrigeration: 'Soğutma ekipmanları', audio: 'Ses ve hoparlör', mobile: 'Mobil aksesuarlar', outdoor: 'Outdoor ürünler', sourcing: 'Tedarikçi arama ve karşılaştırma', qc: 'Denetim ve kalite kontrol', consolidation: 'Konsolidasyon ve ihracat', middleEast: 'Orta Doğu', africa: 'Batı Afrika', latinAmerica: 'Latin Amerika', openMenu: 'Menüyü aç', closeMenu: 'Menüyü kapat' },
};

const prefixByLanguage: Record<Language, string> = {
  en: '',
  zh: '/zh-cn',
  ru: '/ru',
  fr: '/fr',
  es: '/es',
  ar: '/ar',
  pt: '/pt',
  tr: '/tr',
};

const freightExecutorLabels: Record<Language, { desktop: string; mobile: string }> = {
  en: {
    desktop: 'International freight executed by Heaven Born · Operating since 1997',
    mobile: 'Freight by Heaven Born · Since 1997',
  },
  zh: {
    desktop: '国际货运由华正邦泰执行 · 始于 1997 年',
    mobile: '华正邦泰执行货运 · 始于 1997 年',
  },
  ru: {
    desktop: 'Международные перевозки выполняет Heaven Born · Работаем с 1997 года',
    mobile: 'Перевозки Heaven Born · С 1997 года',
  },
  fr: {
    desktop: 'Fret international exécuté par Heaven Born · En activité depuis 1997',
    mobile: 'Fret par Heaven Born · Depuis 1997',
  },
  es: {
    desktop: 'Transporte internacional ejecutado por Heaven Born · Operando desde 1997',
    mobile: 'Transporte por Heaven Born · Desde 1997',
  },
  ar: {
    desktop: 'تنفيذ الشحن الدولي بواسطة Heaven Born · نعمل منذ 1997',
    mobile: 'الشحن بواسطة Heaven Born · منذ 1997',
  },
  pt: {
    desktop: 'Transporte internacional executado pela Heaven Born · Operando desde 1997',
    mobile: 'Transporte Heaven Born · Desde 1997',
  },
  tr: {
    desktop: 'Uluslararası nakliye Heaven Born tarafından yürütülür · 1997’den beri',
    mobile: 'Heaven Born nakliye · 1997’den beri',
  },
};

type DesktopDropdownId = 'products' | 'services' | 'markets' | 'language';
type MobileSectionId = 'products' | 'services' | 'markets';

function Dropdown({
  id,
  label,
  children,
  open,
  active = false,
  align = 'left',
  onToggle,
}: {
  id: DesktopDropdownId;
  label: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  active?: boolean;
  align?: 'left' | 'right';
  onToggle: (id: DesktopDropdownId) => void;
}) {
  const panelId = `desktop-${id}-menu`;

  return (
    <div className="relative">
      <button
        type="button"
        data-dropdown-trigger={id}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onToggle(id)}
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-2 text-sm font-semibold outline-none transition-colors hover:text-[var(--ddnz-purple-strong)] focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] ${active ? 'bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]' : 'text-[var(--ddnz-ink)]'}`}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open ? (
        <div
          id={panelId}
          data-desktop-dropdown-panel={id}
          className={`absolute top-full z-50 min-w-64 pt-3 ${align === 'right' ? 'right-0 rtl:left-0 rtl:right-auto' : 'left-0 rtl:left-auto rtl:right-0'}`}
        >
          <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DropdownLink({ to, children, onNavigate }: { to: string; children: React.ReactNode; onNavigate: () => void }) {
  return (
    <Link onClick={onNavigate} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-[var(--ddnz-purple-soft)] hover:text-[var(--ddnz-purple-strong)]" to={to}>
      {children}
    </Link>
  );
}

export default function SourcingHomepageNav({
  showFreightExecutor = false,
}: {
  showFreightExecutor?: boolean;
}) {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MobileSectionId | null>(null);
  const [openDropdown, setOpenDropdown] = useState<DesktopDropdownId | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const labels = navLabels[language];
  const freightExecutor = freightExecutorLabels[language];
  const prefix = prefixByLanguage[language];
  const localizedPath = (path: string) => canonicalSitePath(`${prefix}${path}`);
  const processPath = localizedPath('/how-we-work');
  const quoteHref = appendAttribution(`${localizedPath('/get-a-quote')}?leadGoal=Product%20Sourcing&source=homepage_navigation`);
  const isProductsPage = /\/products\/?$/.test(location.pathname) || location.pathname.includes('/sourcing/') || location.pathname.includes('/refrigeration-equipment');
  const isServicesPage = /\/sourcing-services\/?$/.test(location.pathname) || location.pathname.includes('/sourcing-services/');
  const isMarketsPage = location.pathname.includes('/shipping-from-china-to-');
  const isInsightsPage = /\/insights\/?$/.test(location.pathname);
  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
  const isHomeRoute = normalizedPath === (prefix || '/');
  const isProcessPage = /\/how-we-work\/?$/.test(location.pathname);
  const isHomePage = isHomeRoute;

  const closeDesktopDropdown = () => setOpenDropdown(null);
  const toggleDesktopDropdown = (id: DesktopDropdownId) => {
    setOpenDropdown((current) => current === id ? null : id);
  };

  useEffect(() => {
    closeDesktopDropdown();
    setMobileOpen(false);
    setMobileSection(null);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!openDropdown) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeDesktopDropdown();
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const activeTrigger = headerRef.current?.querySelector<HTMLButtonElement>(`[data-dropdown-trigger="${openDropdown}"]`);
      closeDesktopDropdown();
      activeTrigger?.focus();
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [openDropdown]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMobileOpen(false);
      setMobileSection(null);
      mobileTriggerRef.current?.focus();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileOpen]);

  const switchLanguage = (nextLanguage: Language) => {
    let suffix = location.pathname
      .replace(/^\/zh-cn(?=\/|$)/, '')
      .replace(/^\/(ru|fr|es|ar|pt|tr)(?=\/|$)/, '');
    if (!suffix) suffix = '/';
    const nextPrefix = prefixByLanguage[nextLanguage];
    let destination = canonicalSitePath(`${nextPrefix}${suffix === '/' ? '' : suffix}` || '/');

    const blogMatch = suffix.match(/^\/blog\/([^/]+)\/?$/);
    if (blogMatch) {
      const currentArticle = findArticleByRoute(
        notionBlogPosts as BlogPost[],
        language,
        decodeURIComponent(blogMatch[1]),
      );
      if (currentArticle) {
        destination = articleLanguageSwitchPath(
          currentArticle,
          notionBlogPosts as BlogPost[],
          nextLanguage,
        );
      }
    }

    setLanguage(nextLanguage);
    setMobileOpen(false);
    setMobileSection(null);
    closeDesktopDropdown();
    navigate(`${destination}${location.search}${blogMatch ? '' : location.hash}`);
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileSection(null);
  };
  const toggleMobileSection = (section: MobileSectionId) => {
    setMobileSection((current) => current === section ? null : section);
  };

  return (
    <header ref={headerRef} className="ddnz-home sticky top-0 z-50 border-b border-slate-200/90 bg-white/96 backdrop-blur-xl">
      <div className="mx-auto flex h-[82px] max-w-[1536px] items-center justify-between gap-3 px-5 sm:px-8 lg:px-7 xl:gap-6 xl:px-12">
        <Link
          to={localizedPath('/')}
          dir="ltr"
          onClick={() => {
            closeDesktopDropdown();
            closeMobile();
          }}
          className="group flex shrink-0 items-center gap-2.5 rounded-md py-1 pr-1 text-[var(--ddnz-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] focus-visible:ring-offset-4 rtl:pl-1 rtl:pr-0 sm:gap-3"
          aria-label={`DDNZ Global — ${labels.home}`}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center sm:h-[46px] sm:w-[46px]" aria-hidden="true">
            <img
              src="/images/brand/ddnz-global-mark-v1.png"
              alt=""
              width="256"
              height="228"
              className="block h-auto w-full object-contain transition-transform duration-200 group-hover:-translate-y-px"
            />
          </span>
          <span className="flex min-w-0 flex-col justify-center">
            <span className="whitespace-nowrap bg-[linear-gradient(100deg,#6b2f8a_0%,#8d397d_42%,#b94750_76%,#b94625_100%)] bg-clip-text text-[22px] font-extrabold leading-[0.88] tracking-[-0.025em] text-transparent xl:text-[26px]">
              DDNZ<span className="ml-[0.32em] font-semibold tracking-[0.045em]">GLOBAL</span>
            </span>
            <span className="mt-[6px] whitespace-nowrap text-[10px] font-semibold leading-none tracking-[0.075em] text-[#40536c] sm:text-[11px]">
              CHINA SOURCING <span className="text-[#b94625]">&amp;</span> EXPORT
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex xl:gap-2" aria-label="Primary navigation">
          <Link
            onClick={closeDesktopDropdown}
            aria-current={isHomePage ? 'page' : undefined}
            className={`whitespace-nowrap rounded-lg px-2 py-2 text-sm font-semibold transition-colors hover:text-[var(--ddnz-purple-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] ${isHomePage ? 'bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]' : 'text-[var(--ddnz-ink)]'}`}
            to={localizedPath('/')}
          >
            {labels.home}
          </Link>
          <Dropdown id="products" label={labels.products} open={openDropdown === 'products'} active={isProductsPage} onToggle={toggleDesktopDropdown}>
            <DropdownLink onNavigate={closeDesktopDropdown} to={localizedPath('/products')}>{labels.products}</DropdownLink>
            <DropdownLink onNavigate={closeDesktopDropdown} to={localizedPath('/sourcing/commercial-kitchen-equipment-from-china')}>{labels.kitchen}</DropdownLink>
            <DropdownLink onNavigate={closeDesktopDropdown} to={localizedPath('/refrigeration-equipment')}>{labels.refrigeration}</DropdownLink>
            <DropdownLink onNavigate={closeDesktopDropdown} to={localizedPath('/sourcing/audio-speakers-from-china')}>{labels.audio}</DropdownLink>
            <DropdownLink onNavigate={closeDesktopDropdown} to={localizedPath('/sourcing/mobile-accessories-from-china')}>{labels.mobile}</DropdownLink>
            <DropdownLink onNavigate={closeDesktopDropdown} to={localizedPath('/sourcing/outdoor-products-from-china')}>{labels.outdoor}</DropdownLink>
          </Dropdown>
          <Dropdown id="services" label={labels.services} open={openDropdown === 'services'} active={isServicesPage} onToggle={toggleDesktopDropdown}>
            <DropdownLink onNavigate={closeDesktopDropdown} to={localizedPath('/sourcing-services')}>{labels.services}</DropdownLink>
            <DropdownLink onNavigate={closeDesktopDropdown} to={localizedPath('/sourcing-services/supplier-search')}>{labels.sourcing}</DropdownLink>
            <DropdownLink onNavigate={closeDesktopDropdown} to={localizedPath('/sourcing-services/inspection-quality-control')}>{labels.qc}</DropdownLink>
            <DropdownLink onNavigate={closeDesktopDropdown} to={localizedPath('/sourcing-services/consolidation-export')}>{labels.consolidation}</DropdownLink>
          </Dropdown>
          <Dropdown id="markets" label={labels.markets} open={openDropdown === 'markets'} active={isMarketsPage} onToggle={toggleDesktopDropdown}>
            <DropdownLink onNavigate={closeDesktopDropdown} to={localizedPath('/shipping-from-china-to-middle-east')}>{labels.middleEast}</DropdownLink>
            <DropdownLink onNavigate={closeDesktopDropdown} to={localizedPath('/shipping-from-china-to-west-africa')}>{labels.africa}</DropdownLink>
            <DropdownLink onNavigate={closeDesktopDropdown} to={localizedPath('/shipping-from-china-to-latin-america')}>{labels.latinAmerica}</DropdownLink>
          </Dropdown>
          <Link
            onClick={closeDesktopDropdown}
            aria-current={isProcessPage ? 'page' : undefined}
            className={`whitespace-nowrap rounded-lg px-2 py-2 text-sm font-semibold hover:text-[var(--ddnz-purple-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] ${isProcessPage ? 'bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]' : 'text-[var(--ddnz-ink)]'}`}
            to={processPath}
          >
            {labels.process}
          </Link>
          <Link
            onClick={closeDesktopDropdown}
            aria-current={isInsightsPage ? 'page' : undefined}
            className={`whitespace-nowrap rounded-lg px-2 py-2 text-sm font-semibold hover:text-[var(--ddnz-purple-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] ${isInsightsPage ? 'bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]' : 'text-[var(--ddnz-ink)]'}`}
            to={localizedPath('/insights')}
          >
            {labels.insights}
          </Link>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-4">
          <Dropdown
            id="language"
            align="right"
            open={openDropdown === 'language'}
            onToggle={toggleDesktopDropdown}
            label={(
              <>
              <Globe2 className="h-5 w-5" aria-hidden="true" />
              {languageLabels[language]}
              </>
            )}
          >
            {(Object.keys(languageLabels) as Language[]).map((item) => (
              <button key={item} type="button" onClick={() => switchLanguage(item)} className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[var(--ddnz-purple-soft)] hover:text-[var(--ddnz-purple-strong)] rtl:text-right">
                {languageLabels[item]}
              </button>
            ))}
          </Dropdown>
          <Link
            to={quoteHref}
            data-analytics-tracked="true"
            onClick={() => {
              closeDesktopDropdown();
              trackEvent('quote_click', { cta_location: 'homepage_navigation', lead_goal: 'product_sourcing' });
            }}
            className="inline-flex min-h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-[var(--ddnz-action)] px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[var(--ddnz-coral-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] focus-visible:ring-offset-2 xl:px-5"
          >
            {labels.start}
          </Link>
        </div>

        <button ref={mobileTriggerRef} type="button" className="grid h-11 w-11 place-items-center rounded-lg text-[var(--ddnz-ink)] hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] lg:hidden" aria-label={mobileOpen ? labels.closeMenu : labels.openMenu} aria-controls="mobile-navigation" aria-expanded={mobileOpen} onClick={() => { closeDesktopDropdown(); setMobileOpen((value) => !value); }}>
          {mobileOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      {showFreightExecutor ? (
        <div
          className="relative overflow-hidden border-t border-white/10 bg-[var(--ddnz-ink)] text-white"
          aria-label={freightExecutor.desktop}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,var(--ddnz-purple),var(--ddnz-coral))]" aria-hidden="true" />
          <div className="mx-auto flex min-h-9 max-w-[1536px] items-center justify-center gap-2.5 px-5 py-1.5 text-center sm:px-8 lg:px-12">
            <span className="grid h-6 w-10 shrink-0 place-items-center rounded-[4px] bg-white/95 p-1" aria-hidden="true">
              <img
                src="/images/brand/heaven-born-wing-logo-v1.png"
                alt=""
                width="420"
                height="295"
                className="h-full w-auto"
              />
            </span>
            <span className="text-[11px] font-semibold leading-4 tracking-[0.025em] text-slate-200 sm:text-xs">
              <span className="md:hidden">{freightExecutor.mobile}</span>
              <span className="hidden md:inline">{freightExecutor.desktop}</span>
            </span>
          </div>
        </div>
      ) : null}

      {mobileOpen ? (
        <nav id="mobile-navigation" className={`${showFreightExecutor ? 'max-h-[calc(100dvh-118px)]' : 'max-h-[calc(100dvh-82px)]'} overflow-y-auto border-t border-slate-200 bg-white px-5 pb-4 pt-2 shadow-xl lg:hidden`} aria-label="Mobile navigation">
          <div className="mx-auto grid max-w-2xl gap-0.5">
            <Link onClick={closeMobile} aria-current={isHomePage ? 'page' : undefined} className={`rounded-lg px-3 py-3 font-semibold ${isHomePage ? 'bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]' : 'text-[var(--ddnz-ink)] hover:bg-[var(--ddnz-purple-soft)]'}`} to={localizedPath('/')}>{labels.home}</Link>
            <div>
              <button type="button" aria-expanded={mobileSection === 'products'} aria-controls="mobile-products-menu" onClick={() => toggleMobileSection('products')} className={`flex min-h-12 w-full items-center justify-between rounded-lg px-3 py-3 text-left font-semibold rtl:text-right ${isProductsPage ? 'bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]' : 'text-[var(--ddnz-ink)] hover:bg-[var(--ddnz-purple-soft)]'}`}>
                {labels.products}<ChevronDown className={`h-4 w-4 transition-transform ${mobileSection === 'products' ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {mobileSection === 'products' ? (
              <div id="mobile-products-menu" className="mb-1 ml-3 grid border-l-2 border-[var(--ddnz-purple)] pl-2 rtl:ml-0 rtl:mr-3 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-2">
                <Link onClick={closeMobile} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--ddnz-purple-soft)]" to={localizedPath('/products')}>{labels.products}</Link>
                <Link onClick={closeMobile} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--ddnz-purple-soft)]" to={localizedPath('/sourcing/commercial-kitchen-equipment-from-china')}>{labels.kitchen}</Link>
                <Link onClick={closeMobile} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--ddnz-purple-soft)]" to={localizedPath('/refrigeration-equipment')}>{labels.refrigeration}</Link>
                <Link onClick={closeMobile} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--ddnz-purple-soft)]" to={localizedPath('/sourcing/audio-speakers-from-china')}>{labels.audio}</Link>
                <Link onClick={closeMobile} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--ddnz-purple-soft)]" to={localizedPath('/sourcing/mobile-accessories-from-china')}>{labels.mobile}</Link>
                <Link onClick={closeMobile} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--ddnz-purple-soft)]" to={localizedPath('/sourcing/outdoor-products-from-china')}>{labels.outdoor}</Link>
              </div>
              ) : null}
            </div>
            <div>
              <button type="button" aria-expanded={mobileSection === 'services'} aria-controls="mobile-services-menu" onClick={() => toggleMobileSection('services')} className={`flex min-h-12 w-full items-center justify-between rounded-lg px-3 py-3 text-left font-semibold rtl:text-right ${isServicesPage ? 'bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]' : 'text-[var(--ddnz-ink)] hover:bg-[var(--ddnz-purple-soft)]'}`}>
                {labels.services}<ChevronDown className={`h-4 w-4 transition-transform ${mobileSection === 'services' ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {mobileSection === 'services' ? (
              <div id="mobile-services-menu" className="mb-1 ml-3 grid border-l-2 border-[var(--ddnz-purple)] pl-2 rtl:ml-0 rtl:mr-3 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-2">
                <Link onClick={closeMobile} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--ddnz-purple-soft)]" to={localizedPath('/sourcing-services')}>{labels.services}</Link>
                <Link onClick={closeMobile} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--ddnz-purple-soft)]" to={localizedPath('/sourcing-services/supplier-search')}>{labels.sourcing}</Link>
                <Link onClick={closeMobile} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--ddnz-purple-soft)]" to={localizedPath('/sourcing-services/inspection-quality-control')}>{labels.qc}</Link>
                <Link onClick={closeMobile} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--ddnz-purple-soft)]" to={localizedPath('/sourcing-services/consolidation-export')}>{labels.consolidation}</Link>
              </div>
              ) : null}
            </div>
            <div>
              <button type="button" aria-expanded={mobileSection === 'markets'} aria-controls="mobile-markets-menu" onClick={() => toggleMobileSection('markets')} className={`flex min-h-12 w-full items-center justify-between rounded-lg px-3 py-3 text-left font-semibold rtl:text-right ${isMarketsPage ? 'bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]' : 'text-[var(--ddnz-ink)] hover:bg-[var(--ddnz-purple-soft)]'}`}>
                {labels.markets}<ChevronDown className={`h-4 w-4 transition-transform ${mobileSection === 'markets' ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {mobileSection === 'markets' ? (
              <div id="mobile-markets-menu" className="mb-1 ml-3 grid border-l-2 border-[var(--ddnz-purple)] pl-2 rtl:ml-0 rtl:mr-3 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-2">
                <Link onClick={closeMobile} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--ddnz-purple-soft)]" to={localizedPath('/shipping-from-china-to-middle-east')}>{labels.middleEast}</Link>
                <Link onClick={closeMobile} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--ddnz-purple-soft)]" to={localizedPath('/shipping-from-china-to-west-africa')}>{labels.africa}</Link>
                <Link onClick={closeMobile} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--ddnz-purple-soft)]" to={localizedPath('/shipping-from-china-to-latin-america')}>{labels.latinAmerica}</Link>
              </div>
              ) : null}
            </div>
            <Link onClick={closeMobile} aria-current={isProcessPage ? 'page' : undefined} className={`rounded-lg px-3 py-3 font-semibold ${isProcessPage ? 'bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]' : 'text-[var(--ddnz-ink)] hover:bg-[var(--ddnz-purple-soft)]'}`} to={processPath}>{labels.process}</Link>
            <Link onClick={closeMobile} aria-current={isInsightsPage ? 'page' : undefined} className={`rounded-lg px-3 py-3 font-semibold ${isInsightsPage ? 'bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]' : 'text-[var(--ddnz-ink)] hover:bg-[var(--ddnz-purple-soft)]'}`} to={localizedPath('/insights')}>{labels.insights}</Link>
            <div className="mt-1 flex flex-wrap gap-2 border-t border-slate-200 pt-3">
              {(Object.keys(languageLabels) as Language[]).map((item) => (
                <button key={item} type="button" onClick={() => switchLanguage(item)} className={`min-h-11 rounded-lg border px-3 text-sm font-semibold ${item === language ? 'border-[var(--ddnz-purple)] bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]' : 'border-slate-200 text-slate-600'}`}>
                  {languageLabels[item]}
                </button>
              ))}
            </div>
            <Link onClick={closeMobile} className="mt-2 inline-flex min-h-12 items-center justify-center rounded-lg bg-[var(--ddnz-action)] px-5 font-bold text-white" to={quoteHref}>{labels.start}</Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
