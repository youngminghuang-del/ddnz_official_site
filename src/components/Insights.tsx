import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import notionBlogPosts from '../data/notionBlogData.json';

export default function Insights() {
  const { t } = useLanguage();
  const [posts] = useState<any[]>(notionBlogPosts);

  useEffect(() => {
    // 埋点同步: insights_section_view
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'insights_section_view', { 
        'event_category': 'Engagement',
        'event_label': 'Insights Section View'
      });
    }

    // Load Elfsight Script
    const script = document.createElement('script');
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Use Top 3 posts for DOM SEO
  const displayPosts = posts.slice(0, 3);

  return (
    <section id="insights" className="py-16 md:py-32 bg-white font-sans border-t border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <div className="text-[#FF8A00] font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase mb-3">
            {t('insights.label')}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#4B27B1] leading-tight flex items-center justify-center gap-x-4 mb-4">
            <span className="hidden md:inline-block w-12 md:w-20 h-1 bg-[#FF8A00] rounded-full" />
            {t('insights.title')}
            <span className="inline-block w-12 md:w-20 h-1 bg-[#FF8A00] rounded-full" />
          </h2>
          <p className="text-slate-500 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed">
            {t('insights.subtitle')}
          </p>
        </div>

        {/* Native Blog Cards (SEO/GEO Critical) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {displayPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-purple-50/10 flex flex-col rounded-2xl overflow-hidden shadow-sm border border-purple-100/60 group hover:shadow-xl transition-all duration-300"
            >
              <Link to={`/blog/${post.id}`} className="block overflow-hidden h-48 relative bg-slate-100">
                <img 
                  src={post.thumbnailUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold text-[#FF8A00] uppercase tracking-widest bg-orange-50 px-2.5 py-1 rounded-md">
                    {post.category}
                  </span>
                  <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-wider font-mono">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-purple-300" />
                    {post.date}
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-3 leading-tight group-hover:text-[#4B27B1] transition-colors line-clamp-2">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h3>
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                  {post.summary}
                </p>
                <Link 
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-[#4B27B1] font-extrabold text-sm group/btn mt-auto"
                >
                  Read More 
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button to go to the Blog Hub */}
        <div className="flex justify-center mb-24">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 bg-[#4B27B1] text-white hover:bg-[#391e87] px-8 py-4 rounded-xl font-bold font-sans tracking-wide shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 group"
          >
            <span>View All Insights & News</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Social Buzz Header */}
        <div className="flex items-center gap-4 mb-10">
          <h3 className="text-xl font-bold text-[#4B27B1] font-sans border-l-4 border-[#FF8A00] pl-4">Real-time Social Feed</h3>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        {/* Elfsight LinkedIn Feed Implementation */}
        <div className="overflow-hidden bg-slate-50/50 rounded-3xl p-4 md:p-8 border border-slate-100">
          <div 
            className="elfsight-app-e6692636-31f6-4bb1-b8eb-8774bffd7093" 
            data-elfsight-app-lazy 
          />
        </div>
      </div>
    </section>
  );
}

