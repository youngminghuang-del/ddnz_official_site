import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import notionBlogPosts from "../data/notionBlogData.json";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  thumbnailUrl: string;
}

export default function InsightsHub() {
  const [posts] = useState<BlogPost[]>(notionBlogPosts as BlogPost[]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading] = useState<boolean>(false);

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
      <div>
        <Navbar />

        {/* Page Header */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#4B27B1]/5 border-b border-purple-100">
          <div className="max-w-7xl mx-auto text-center">
            <span className="inline-block px-3.5 py-1 bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              DDNZ GLOBAL INSIGHTS
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-[#4B27B1] tracking-tight mb-6">
              Industry Insights & News
            </h1>
            <p className="max-w-2xl mx-auto text-slate-600 text-base md:text-lg leading-relaxed">
              Unlock local guidelines, shipping timelines, regulatory changes, and first-hand supply chain intelligence direct from Asian hub authorities.
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
                  {cat === "All" ? "🏷️ Show All Categories" : cat}
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
                    <Link to={`/blog/${post.id}`} className="block h-56 overflow-hidden relative bg-slate-100">
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
                          <Link to={`/blog/${post.id}`}>{post.title}</Link>
                        </h3>

                        {/* Paragraph Shortened Summary */}
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                          {post.summary}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        <Link
                          to={`/blog/${post.id}`}
                          className="inline-flex items-center text-[#4B27B1] hover:text-[#381d86] font-extrabold text-sm group/btn"
                        >
                          <span>Deep Dive Read</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1.5 transition-transform" />
                        </Link>
                        
                        <div className="flex items-center gap-1 text-slate-300 text-xs font-mono font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>4 Min</span>
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
              <h3 className="text-lg font-bold text-slate-700 mb-1">No articles found</h3>
              <p className="text-slate-500 text-sm">No items matching "{selectedCategory}" are published yet.</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
