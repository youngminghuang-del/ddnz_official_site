import { positioning } from '../features/search-intent/positioning.mjs';
import BuyerDecisionContent from '../features/search-intent/BuyerDecisionContent';
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import notionBlogPosts from "../data/notionBlogData.json";
import SourcingHomepageNav from "../components/SourcingHomepageNav";
import Footer from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import SEO from "../components/SEO";
import type { BlogPost } from "../types/content";
import { trackEvent } from "../lib/analytics";
import { articleRoutePath, normalizeArticleLocale } from "../lib/notionArticleRouting";
import { DdnzEyebrow } from "../components/DdnzUi";

export default function InsightsHub() {
  const { language, t } = useLanguage();
  const [posts] = useState<BlogPost[]>(notionBlogPosts as BlogPost[]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [page, setPage] = useState(1);
  const resultsStart = useRef<HTMLParagraphElement>(null);
  const changePage = (next: number) => {
    setPage(next);
    resultsStart.current?.focus({ preventScroll: true });
    resultsStart.current?.scrollIntoView({ block: "start" });
  };
  const [query, setQuery] = useState("");

  const seoMetrics: Record<string, { title: string; desc: string; keywords: string }> = {
    en: {
      title: 'Global Supply Chain Insights & Cargo News | DDNZ',
      desc: 'Stay informed with our curated global shipping guides, cross-border trade guidelines, and international supply chain trends.',
      keywords: 'global supply chain, shipping news china, cross-border e-commerce ddp, ocean freight guides, air cargo metrics'
    },
    zh: {
      title: '中国采购、验货与出口洞察 | DDNZ Global',
      desc: 'DDNZ Global 为国际进口商提供中国采购、供应商核验、质量控制、集货出口与国际货运的实用指南。',
      keywords: '中国采购资讯, 供应商核验, 中国验货, 集货出口, 国际供应链, DDNZ Global'
    },
    ru: {
      title: 'Аналитика закупок и экспорта из Китая | DDNZ Global',
      desc: 'Практические материалы DDNZ Global о поставщиках, инспекциях, консолидации, экспорте и международной логистике из Китая.',
      keywords: 'новости логистики из китая, вэд китай рф, таможенная очистка грузов, ставки фрахта, карго шэньчжэнь'
    },
    fr: {
      title: 'Conseils sourcing et export depuis la Chine | DDNZ Global',
      desc: 'Guides pratiques DDNZ Global sur les fournisseurs, l’inspection, la consolidation, l’export et le fret international depuis la Chine.',
      keywords: 'actus transit chine europe, réglementation amazon fba, douane importations france, tarifs expédition maritime'
    },
    es: {
      title: 'Guías de compras y exportación desde China | DDNZ Global',
      desc: 'Guías prácticas de DDNZ Global sobre proveedores, inspección, consolidación, exportación y transporte internacional desde China.',
      keywords: 'logística china, noticias de transporte, flete marítimo china, carga aérea, comercio internacional'
    },
    ar: {
      title: 'أدلة التوريد والتصدير من الصين | DDNZ Global',
      desc: 'أدلة عملية من DDNZ Global حول الموردين والفحص والتجميع والتصدير والشحن الدولي من الصين.',
      keywords: 'الشحن من الصين، الشحن البحري، الشحن الجوي، الخدمات اللوجستية، التجارة الدولية'
    },
    pt: {
      title: 'Guias de sourcing e exportação da China | DDNZ Global',
      desc: 'Guias práticos sobre fornecedores, inspeção, consolidação, exportação e transporte internacional a partir da China.',
      keywords: 'sourcing na China, inspeção de fornecedores, consolidação, exportação da China, logística internacional'
    },
    tr: {
      title: 'Çin’den tedarik ve ihracat rehberleri | DDNZ Global',
      desc: 'Çin’de tedarikçi, denetim, konsolidasyon, ihracat ve uluslararası taşımacılık için uygulamalı rehberler.',
      keywords: 'Çin tedarik, tedarikçi denetimi, konsolidasyon, Çin ihracat, uluslararası lojistik'
    },
  };

  const currentSEO = { ...(seoMetrics[language] || seoMetrics.en), title: positioning[language].insightsTitle, desc: positioning[language].insightsDescription };

  useEffect(() => {
    trackEvent('insights_hub_view', {
      event_category: 'Engagement',
      event_label: 'Insights Hub View',
    });

    window.scrollTo(0, 0);
  }, []);

  // Compute unique categories dynamically from database pages
  const getPostPath = (post: BlogPost) => articleRoutePath(post);
  const languageLabels: Record<string, string> = {
    all: language === 'zh' ? '全部语言' : language === 'fr' ? 'Toutes les langues' : language === 'ru' ? 'Все языки' : language === 'es'
      ? 'Todos los idiomas'
      : language === 'ar'
        ? 'جميع اللغات'
        : language === 'pt'
          ? 'Todos os idiomas'
          : language === 'tr'
            ? 'Tüm diller'
            : 'All languages',
    en: 'English',
    es: 'Español',
    ar: 'العربية',
    fr: 'Français',
    'zh-cn': '中文',
    ru: 'Русский',
    pt: 'Português',
    tr: 'Türkçe',
  };
  const availableLanguages = ['all', ...Array.from(new Set(posts.map((post) => normalizeArticleLocale(post.language))))];
  const languageFilteredPosts = selectedLanguage === 'all'
    ? posts
    : posts.filter((post) => normalizeArticleLocale(post.language) === selectedLanguage);
  const categories = ["All", ...Array.from(new Set(languageFilteredPosts.map((p) => p.category)))];

  const filteredPosts = languageFilteredPosts.filter(post =>
    (selectedCategory === 'All' || post.category === selectedCategory) &&
    (post.title + ' ' + (post.summary || '')).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  );
  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / 6));
  const items = filteredPosts.slice((page - 1) * 6, page * 6);
  const featured = items.filter(post => post.listingThumbnailUrl || post.thumbnailUrl).slice(0, 3);
  const remaining = items.filter(post => !featured.includes(post));
  const controls = ({
    zh: ['搜索文章','上一页','下一页','更多文章','全部主题'], en: ['Search articles','Previous','Next','More articles','All topics'],
    es: ['Buscar artículos','Anterior','Siguiente','Más artículos','Todos los temas'], ar: ['ابحث في المقالات','السابق','التالي','مقالات أخرى','جميع المواضيع'],
    fr: ['Rechercher un article','Précédent','Suivant','Autres articles','Tous les thèmes'], ru: ['Поиск статей','Назад','Далее','Другие статьи','Все темы'],
    pt: ['Pesquisar artigos','Anterior','Seguinte','Mais artigos','Todos os temas'], tr: ['Makale ara','Önceki','Sonraki','Diğer makaleler','Tüm konular'],
  })[language] || ['Search articles','Previous','Next','More articles','All topics'];
  const metadata = (post: BlogPost) => <span className="text-xs font-medium opacity-85">
    {post.category} · {languageLabels[normalizeArticleLocale(post.language)] || post.language} · <bdi>{post.date}</bdi>
  </span>;
  const feature = (post: BlogPost, lead = false) => <Link key={post.id} to={getPostPath(post)} className="group flex min-w-0 flex-col overflow-hidden rounded-xl bg-[#302039] text-white hover:bg-[#442953] focus-visible:outline focus-visible:outline-2">
    <img src={post.listingThumbnailUrl || post.thumbnailUrl} srcSet={post.listingThumbnailSrcSet} sizes={lead ? '(min-width: 1024px) 55vw, 100vw' : '(min-width: 1024px) 38vw, 50vw'} alt="" width={960} height={540} loading={lead ? 'eager' : 'lazy'} decoding="async" referrerPolicy="no-referrer" className={lead ? 'aspect-video w-full object-cover' : 'h-24 w-full object-cover sm:h-32'} />
    <div className={lead ? 'p-5 sm:p-6' : 'p-3 sm:p-4'}>{metadata(post)}
      <h2 dir="auto" lang={normalizeArticleLocale(post.language)} className={lead ? 'mt-2 text-xl font-bold sm:text-2xl' : 'mt-1 text-sm font-bold sm:text-base'}>{post.title}</h2>
    </div>
  </Link>;

  return (
    <div className="ddnz-home flex min-h-screen flex-col justify-between bg-[#fbfaf7] font-sans text-slate-900">
      <SEO title={currentSEO.title} description={currentSEO.desc} keywords={currentSEO.keywords} />
      <div>
        <SourcingHomepageNav />

        {/* Page Header */}
        <section className="ddnz-ribbon-surface relative overflow-hidden border-b border-slate-200 px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <div className="relative z-10 mx-auto max-w-7xl">
            <DdnzEyebrow>{t('insights.hubLabel')}</DdnzEyebrow>
            <h1 className="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-black leading-[1.03] tracking-[-0.05em] text-[var(--ddnz-ink)]">
              {positioning[language].insightsHeading}
            </h1>
            <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-slate-600 md:text-lg">
              {positioning[language].insightsDescription}
            </p>
          </div>
        </section>

        {/* Filters and Blog list */}
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-[2fr_1fr_1fr]">
            <input aria-label={controls[0]} type="search" value={query} placeholder={controls[0]} onChange={event => { setQuery(event.target.value); setPage(1); }} className="col-span-2 min-h-11 min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-base sm:col-span-1" />
            <select aria-label={languageLabels.all} value={selectedLanguage} onChange={event => { setSelectedLanguage(event.target.value); setSelectedCategory('All'); setPage(1); }} className="min-h-11 min-w-0 rounded-lg border border-slate-300 bg-white px-2 text-base">
              {availableLanguages.map(lang => <option key={lang} value={lang}>{languageLabels[lang] || lang}</option>)}
            </select>
            <select aria-label={controls[4]} value={selectedCategory} onChange={event => { setSelectedCategory(event.target.value); setPage(1); }} className="min-h-11 min-w-0 rounded-lg border border-slate-300 bg-white px-2 text-base">
              {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? controls[4] : cat}</option>)}
            </select>
          </div>
          <p ref={resultsStart} tabIndex={-1} aria-live="polite" className="mb-3 scroll-mt-32 text-sm text-slate-600">{filteredPosts.length ? (page - 1) * 6 + 1 : 0}–{(page - 1) * 6 + items.length} / {filteredPosts.length}</p>
          {featured.length > 0 && <div className={featured.length > 1 ? 'grid gap-4 lg:grid-cols-[1.45fr_1fr]' : 'grid'}>
            {feature(featured[0], true)}
            {featured.length > 1 && <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">{featured.slice(1).map(post => feature(post))}</div>}
          </div>}
          {remaining.length > 0 && <section className="mt-5">
            <h2 className="mb-2 text-lg font-bold">{controls[3]}</h2>
            <ul className="divide-y divide-slate-200 border-y border-slate-200">{remaining.map(post => <li key={post.id}>
              <Link to={getPostPath(post)} className="flex items-center justify-between gap-4 px-2 py-3 hover:bg-purple-50 focus-visible:outline focus-visible:outline-2">
                <div className="min-w-0">{metadata(post)}<p dir="auto" lang={normalizeArticleLocale(post.language)} className="font-semibold">{post.title}</p></div>
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 rtl:rotate-180" />
              </Link>
            </li>)}</ul>
          </section>}
          {items.length === 0 && <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <BookOpen aria-hidden="true" className="mx-auto mb-2 h-8 w-8 text-purple-400" />
            <h2 className="font-bold">{t('insights.no_articles')}</h2>
            <p>{t('insights.no_articles_desc')}</p>
          </div>}
          {pageCount > 1 && <div className="my-5 flex items-center justify-center gap-4">
            <button type="button" disabled={page <= 1} onClick={() => changePage(page - 1)} className="min-h-11 rounded-lg border px-3 disabled:opacity-40">{controls[1]}</button>
            <bdi>{page} / {pageCount}</bdi>
            <button type="button" disabled={page >= pageCount} onClick={() => changePage(page + 1)} className="min-h-11 rounded-lg border px-3 disabled:opacity-40">{controls[2]}</button>
          </div>}
        <BuyerDecisionContent page="insights" locale={language} />
      </main>
      </div>

      <Footer />
    </div>
  );
}
