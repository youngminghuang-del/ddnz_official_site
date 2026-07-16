import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import notionBlogPosts from "../data/notionBlogData.json";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { getImgUrl } from "../constants";
import SchemaMarkup from "../components/SchemaMarkup";
import SEO from "../components/SEO";

interface BlogPost {
  id: string;
  slug?: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  thumbnailUrl: string;
}

export default function InsightsHub() {
  const { language, t } = useLanguage();
  const [posts] = useState<BlogPost[]>(notionBlogPosts as BlogPost[]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading] = useState<boolean>(false);

  const seoMetrics: Record<string, { title: string; desc: string; keywords: string }> = {
    en: {
      title: 'Global Trade Insights & Logistics News | DDNZ Global',
      desc: 'Stay informed with our curated global shipping guides, cross-border trade guidelines, and international supply chain trends.',
      keywords: 'global supply chain, shipping news china, cross-border e-commerce ddp, ocean freight guides, air cargo metrics'
    },
    zh: {
      title: '国际跨境贸易与供应链前沿资讯 | 华正邦泰国际货运',
      desc: '华正邦泰国际货运为您深度剖析最新一站式国际海运拼箱政策、跨境电商包税规则、全球空运极速干线趋势及海外仓配实战指南。',
      keywords: '国际货代资讯, 跨境物流指南, 外贸出口干货, 国际供应链前哨, 跨境电商干货库, 华正邦泰国际货运, 华正邦泰'
    },
    ru: {
      title: 'Блоги и аналитика ВЭД, логистика из Китая | DDNZ Global',
      desc: 'Актуальные инструкции, гайды по таможенному оформлению, морские тарифы и последние изменения рынка логистики из КНР.',
      keywords: 'новости логистики из китая, вэд китай рф, таможенная очистка грузов, ставки фрахта, карго шэньчжэнь'
    },
    fr: {
      title: 'Insights Logistique Globale et Transit Chine | DDNZ Global',
      desc: 'Suivez l\'actualité du fret international, de la douane import/export, et des innovations supply chain.',
      keywords: 'actus transit chine europe, réglementation amazon fba, douane importations france, tarifs expédition maritime'
    }
  };

  const currentSEO = seoMetrics[language] || seoMetrics['en'];

  useEffect(() => {
    // Tracking event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "insights_hub_view", {
        event_category: "Engagement",
        event_label: "Insights Hub View",
      });
    }

    window.scrollTo(0, 0);
  }, []);

  // Compute unique categories dynamically from database pages
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

  // Filter posts based on selected category
  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col justify-between">
      <SEO title={currentSEO.title} description={currentSEO.desc} keywords={currentSEO.keywords} />
      <SchemaMarkup type="Organization" data={{}} />
      <div>
        <Navbar />

        {/* Page Header */}
        <section 
          className="relative pt-40 pb-24 px-4 sm:px-6 lg:px-8 bg-cover bg-center overflow-hidden border-b border-purple-100"
          style={{ backgroundImage: `url(${getImgUrl('INSIGHTS_BANNER')})` }}
        >
          {/* Subtle overlay to preserve clean high contrast display text and read-legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-[#4B27B1]/85 to-slate-900/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#4B27B1]/15 backdrop-blur-[3px]" />

          <div className="relative max-w-7xl mx-auto text-center z-10">
            <span className="inline-block px-3.5 py-1.5 bg-[#FF8A00]/25 text-[#FF8A00] text-xs font-black uppercase tracking-widest rounded-full mb-4 border border-[#FF8A00]/30 backdrop-blur-md">
              {t('insights.hubLabel')}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 drop-shadow-sm font-sans">
              {t('insights.hubTitle')}
            </h1>
            <p className="max-w-2xl mx-auto text-white/90 text-base md:text-lg leading-relaxed font-sans drop-shadow">
              {t('insights.hubSubtitle')}
            </p>
          </div>
        </section>

        {/* Filters and Blog list */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Tag Filter Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#4B27B1] text-white shadow-md shadow-purple-200 scale-105"
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
              <div className="w-12 h-12 border-4 border-[#4B27B1] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500 font-bold">Synchronizing items with Notion Engine...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white hover:bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 hover:border-[#4B27B1]/20 transition-all duration-300 flex flex-col group h-full"
                  >
                    <Link to={`/blog/${post.slug || post.id}`} className="block h-56 overflow-hidden relative bg-slate-100">
                      <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm shadow px-3 py-1.5 rounded-xl flex items-center gap-1.5 z-10 text-[10px] font-black text-[#4B27B1] uppercase tracking-wider">
                        <Tag className="w-3 h-3 text-[#FF8A00]" />
                        <span>{post.category}</span>
                      </div>
                    </Link>

                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Date Line */}
                        <div className="flex items-center text-slate-400 font-mono text-[11px] mb-3 uppercase tracking-wider font-bold">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-purple-300" />
                          {post.date}
                        </div>

                        {/* Title Link */}
                        <h3 className="text-xl font-extrabold text-[#4B27B1] leading-tight mb-4 group-hover:text-[#FF8A00] transition-colors line-clamp-2">
                          <Link to={`/blog/${post.slug || post.id}`}>{post.title}</Link>
                        </h3>

                        {/* Paragraph Shortened Summary */}
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                          {post.summary}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        <Link
                          to={`/blog/${post.slug || post.id}`}
                          className="inline-flex items-center text-[#4B27B1] hover:text-[#381d86] font-extrabold text-sm group/btn"
                        >
                          <span>{t('insights.deep_dive_read')}</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1.5 transition-transform" />
                        </Link>
                        
                        <div className="flex items-center gap-1 text-slate-300 text-xs font-mono font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{t('insights.read_time')}</span>
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
