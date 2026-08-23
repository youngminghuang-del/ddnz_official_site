import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
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
  const [isLoading] = useState<boolean>(false);

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

  const currentSEO = seoMetrics[language] || seoMetrics['en'];

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
    all: language === 'es'
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
  const loadingLabel: Record<string, string> = {
    en: 'Synchronizing items with Notion Engine...',
    zh: '正在同步 Notion 内容…',
    ru: 'Синхронизация материалов из Notion…',
    fr: 'Synchronisation des contenus avec Notion…',
    es: 'Sincronizando artículos con Notion...',
    ar: 'جارٍ مزامنة المقالات مع Notion…',
    pt: 'A sincronizar conteúdos com o Notion…',
    tr: 'İçerikler Notion ile eşitleniyor…',
  };
  const languageFilteredPosts = selectedLanguage === 'all'
    ? posts
    : posts.filter((post) => normalizeArticleLocale(post.language) === selectedLanguage);
  const categories = ["All", ...Array.from(new Set(languageFilteredPosts.map((p) => p.category)))];

  // Filter posts based on selected category
  const filteredPosts =
    selectedCategory === "All"
      ? languageFilteredPosts
      : languageFilteredPosts.filter((p) => p.category === selectedCategory);

  return (
    <div className="ddnz-home flex min-h-screen flex-col justify-between bg-[#fbfaf7] font-sans text-slate-900">
      <SEO title={currentSEO.title} description={currentSEO.desc} keywords={currentSEO.keywords} />
      <div>
        <SourcingHomepageNav />

        {/* Page Header */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-[#fffdf9] px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(118,60,156,.12),transparent_34rem),radial-gradient(circle_at_88%_78%,rgba(201,79,47,.09),transparent_30rem)]" aria-hidden="true" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <DdnzEyebrow>{t('insights.hubLabel')}</DdnzEyebrow>
            <h1 className="mt-5 max-w-[16ch] text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[1.03] tracking-[-0.05em] text-[var(--ddnz-ink)]">
              {t('insights.hubTitle')}
            </h1>
            <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-slate-600 md:text-lg">
              {t('insights.hubSubtitle')}
            </p>
          </div>
        </section>

        {/* Filters and Blog list */}
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          {/* Language-first discovery makes the active content library visible
              while still helping visitors find a language they can read. */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {availableLanguages.map((lang) => {
              const isActive = selectedLanguage === lang;
              return (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setSelectedCategory('All');
                  }}
                  aria-pressed={isActive}
                  className={`min-h-11 rounded-full px-4 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] ${
                    isActive
                      ? 'bg-[var(--ddnz-ink)] text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {languageLabels[lang] || lang}
                </button>
              );
            })}
          </div>

          {/* Topic filter */}
          <div className="mb-10 flex flex-wrap items-center gap-2 md:gap-3">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={isActive}
                  className={`min-h-11 rounded-full px-5 py-2.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] ${
                    isActive
                      ? "bg-[var(--ddnz-purple-strong)] text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {cat === "All" ? t('insights.showAll') : cat}
                </button>
              );
            })}
          </div>

          {/* Loader */}
          {isLoading && posts.length === 0 ? (
            <div className="py-24 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[var(--ddnz-purple-strong)] border-t-transparent" />
              <p className="text-slate-500 font-bold">{loadingLabel[language] || loadingLabel.en}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.24, delay: Math.min(index, 5) * 0.025, ease: 'easeOut' }}
                    className="ddnz-card group flex h-full flex-col overflow-hidden transition-[border-color,box-shadow] duration-200 hover:border-[var(--ddnz-purple)]/30 hover:shadow-[var(--ddnz-shadow-soft)]"
                  >
                    <Link to={getPostPath(post)} className="block h-56 overflow-hidden relative bg-slate-100">
                      <img
                        src={post.listingThumbnailUrl || post.thumbnailUrl}
                        srcSet={post.listingThumbnailSrcSet}
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
                        alt={post.title}
                        width="960"
                        height="540"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={index === 0 ? "high" : "auto"}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[var(--ddnz-purple-strong)] shadow backdrop-blur-sm">
                        <Tag className="h-3 w-3 text-[var(--ddnz-coral)]" />
                        <span>{post.contentType || post.category}</span>
                      </div>
                      <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg z-10 text-[10px] font-black text-white tracking-wider">
                        {languageLabels[normalizeArticleLocale(post.language)] || normalizeArticleLocale(post.language).toUpperCase()}
                      </div>
                    </Link>

                    <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                      <div>
                        {/* Date Line */}
                        <div className="flex items-center text-slate-400 font-mono text-[11px] mb-3 uppercase tracking-wider font-bold">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-purple-300" />
                          {post.date}
                          {post.audienceMarket && <span className="ml-2">· {post.audienceMarket}</span>}
                        </div>

                        {/* Title Link */}
                        <h3 className="mb-4 line-clamp-2 text-xl font-extrabold leading-tight text-[var(--ddnz-ink)] transition-colors group-hover:text-[var(--ddnz-purple-strong)]">
                          <Link to={getPostPath(post)}>{post.title}</Link>
                        </h3>

                        {/* Paragraph Shortened Summary */}
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                          {post.summary}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        <Link
                          to={getPostPath(post)}
                          className="group/btn inline-flex items-center text-sm font-extrabold text-[var(--ddnz-purple-strong)] hover:text-[var(--ddnz-coral-strong)]"
                        >
                          <span>{t('insights.deep_dive_read')}</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1.5 transition-transform" />
                        </Link>
                        
                        <div className="flex items-center gap-1 text-slate-300 text-xs font-mono font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.readMinutes || 5} min</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Empty state conditional */}
          {!isLoading && filteredPosts.length === 0 && (
            <div className="py-24 text-center bg-white rounded-3xl border border-slate-200">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">{t('insights.no_articles')}</h3>
              <p className="text-slate-500 text-sm">
                {t('insights.no_articles_desc')}{" "}
                {selectedCategory !== "All" && `(${selectedCategory})`}
              </p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
