import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import notionBlogPosts from '../data/notionBlogData.json';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import SchemaMarkup from '../components/SchemaMarkup';
import SEO from '../components/SEO';

interface BlogPost {
  id: string;
  slug?: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  thumbnailUrl: string;
  language?: string;
  translationGroup?: string;
}

function normalizeNotionLinks(content: string) {
  return content.replace(
    /https:\/\/(?:www\.)?google\.com\/search\?q=([^"'&\s]+)/g,
    (url, encodedPath: string) => {
      try {
        const path = decodeURIComponent(encodedPath);
        const isInternalRoute = /^(?:\/services\/|\/shipping-from-china-to-|\/insights(?:\/|$))/.test(path);
        return isInternalRoute ? `https://www.ddnzglobal.com${path}` : url;
      } catch {
        return url;
      }
    },
  );
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { language } = useLanguage();
  const ui = language === 'es'
    ? { loading: 'Cargando contenido de Notion...', missing: 'Artículo no encontrado', back: 'Volver al inicio' }
    : language === 'ar'
    ? { loading: 'جارٍ تحميل محتوى Notion...', missing: 'المقال غير موجود', back: 'العودة إلى الصفحة الرئيسية' }
    : { loading: 'Fetching secure Notion content...', missing: 'Post Not Found', back: 'Back to Home' };

  useEffect(() => {
    if (!slug) return;

    setIsLoading(true);

    // Look up in build-time notion blog posts (which holds full HTML content) by slug or ID
    const found = (notionBlogPosts as any[]).find((p) => p.slug === slug || p.id === slug);
    if (found) {
      setPost(found as BlogPost);

      // Tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'blog_view', {
          'page_title': found.title,
          'page_id': found.id,
          'page_slug': found.slug || ""
         });
      }
    } else {
      console.warn(`Post with slug/id ${slug} not found in Notion static data.`);
    }

    setIsLoading(false);
    window.scrollTo(0, 0);
  }, [slug, language]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#4B27B1] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">{ui.loading}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">{ui.missing}</h1>
        <Link to="/" className="text-[#4B27B1] font-bold flex items-center hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" /> {ui.back}
        </Link>
      </div>
    );
  }

  // Global Title Automation & Safe Truncation (Max 60 chars)
  let seoTitle = '';
  if (post.slug === 'Actionable-insights-for-Eastern-Europe') {
    seoTitle = 'China Sourcing Alert: July Rate Hikes & Customs Guide';
  } else if (post.slug === 'high-compliance-new-energy-logistics') {
    seoTitle = 'New Energy & DG Logistics from China | DDNZ Global Insights';
  } else {
    const rawTitle = post.title;
    const suffix = " | DDNZ Global";
    const maxTitleLen = 60;
    if (rawTitle.length + " | DDNZ Global Insights".length > maxTitleLen) {
      const maxPrefixLen = maxTitleLen - suffix.length - 3; // Subtracting 3 for '...'
      if (maxPrefixLen > 0) {
        let truncated = rawTitle.slice(0, maxPrefixLen);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 15) {
          truncated = truncated.slice(0, lastSpace);
        }
        seoTitle = truncated.trim() + '...' + suffix;
      } else {
        seoTitle = rawTitle.slice(0, maxTitleLen - suffix.length) + suffix;
      }
    } else {
      seoTitle = rawTitle + suffix;
    }
  }

  // Global Description Automation (Max 155 chars)
  const rawDesc = post.summary || post.title || '';
  const seoDesc = rawDesc.length > 155 ? rawDesc.slice(0, 152).trim() + '...' : rawDesc;
  const postLanguage = post.language || 'en';
  const postPrefix = postLanguage === 'en' ? '' : `/${postLanguage}`;
  const postPath = `${postPrefix}/blog/${post.slug || post.id}`;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <SEO 
        title={seoTitle} 
        description={seoDesc} 
        keywords={`${post.category.toLowerCase()}, global logistics, china freight forwarder, cargo news, ddnz global`}
        canonicalPath={postPath}
        alternateUrls={[{ hrefLang: postLanguage, href: `https://www.ddnzglobal.com${postPath}` }]}
      />
      <SchemaMarkup 
        type="BlogPosting" 
        data={{
          headline: post.title,
          description: post.summary,
          image: post.thumbnailUrl,
          datePublished: post.date,
          url: `https://www.ddnzglobal.com${postPath}`
        }} 
      />
      <Navbar />
      
      {/* Breadcrumb Navigation & Hero Banner */}
      <div className="relative pt-32 pb-24 md:pt-40 md:pb-36 bg-gradient-to-br from-[#1E1145] via-[#2D1375] to-[#4B27B1] text-white overflow-hidden">
        {/* Semi-transparent background photo */}
        <img 
          className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none mix-blend-overlay" 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop" 
          alt="Insights backdrop" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-300 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link to="/insights" className="hover:text-white transition-colors">Insights</Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-orange-400 font-bold truncate max-w-[200px] md:max-w-none">{post.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <div className="flex items-center text-slate-300 text-sm">
              <Calendar className="w-4 h-4 mr-2 text-orange-400" />
              {post.date}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      <main className="pb-12 md:pb-20 relative z-10">
        <article className="max-w-4xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-2xl ring-1 ring-slate-200 bg-slate-100 -mt-16 md:-mt-24 z-20">
              <img 
                src={post.thumbnailUrl} 
                alt={post.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Main Content Area */}
            <div 
              className="prose prose-slate lg:prose-lg max-w-none blog-content post-content
                         prose-headings:font-bold prose-headings:text-[#4B27B1] 
                         prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
                         prose-strong:text-slate-900 prose-strong:font-semibold
                         prose-a:text-[#FF8A00] prose-a:no-underline hover:prose-a:underline
                         prose-ul:list-disc prose-ol:list-decimal"
              dangerouslySetInnerHTML={{ __html: normalizeNotionLinks(post.content) }}
            />

            {/* Back Button Footer */}
            <div className="mt-16 pt-8 border-t border-slate-100">
              <Link
                to="/insights"
                className="inline-flex items-center gap-3 text-slate-900 font-bold hover:text-[#4B27B1] transition-all group"
              >
                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-[#4B27B1] group-hover:bg-purple-50 transition-all">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <span>Back to Insights Hub</span>
              </Link>
            </div>
          </motion.div>
        </article>
      </main>

      <Footer />
      
      {/* Global Style for HTML content layout */}
      <style>{`
        .prose img, .post-content img, .blog-content img {
          width: 100% !important;      /* 宽度撑满容器 */
          height: auto !important;     /* 高度必须全自动等比例缩放，禁止写死固定像素！ */
          max-width: 100% !important;  /* 防止图片超出容器边界 */
          object-fit: contain !important; /* 确保图片完整显示，绝对不允许进行上下裁剪或拉伸 */
          display: block !important;
          margin: 1.5rem auto !important; /* 上下留白，居中对齐 */
        }
        .image-wrapper {
          height: auto !important; /* 允许容器随图片高度自适应撑开 */
          width: 100% !important;
        }
        .blog-content h2 { margin-top: 2.5rem; margin-bottom: 1.25rem; color: #4B27B1; font-weight: 850; font-size: 1.875rem; line-height: 1.35; border-left: 5px solid #FF8A00; padding-left: 0.75rem; }
        .blog-content h3 { margin-top: 2rem; margin-bottom: 1rem; color: #1e293b; font-weight: 800; font-size: 1.5rem; }
        .blog-content h4 { margin-top: 1.5rem; margin-bottom: 0.75rem; color: #334155; font-weight: 700; font-size: 1.25rem; }
        .blog-content p { margin-bottom: 1.5rem; line-height: 1.8; color: #334155; font-size: 1.1rem; }
        .blog-content ul { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
        .blog-content ol { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: decimal; }
        .blog-content li { margin-bottom: 0.55rem; color: #475569; font-size: 1.05rem; }
        .blog-content table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; margin-bottom: 2rem; background-color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-radius: 0.75rem; overflow: hidden; }
        .blog-content th { background-color: #f8fafc; padding: 1rem 1.25rem; text-align: left; border: 1px solid #e2e8f0; font-weight: 700; color: #4B27B1; font-size: 0.95rem; text-transform: uppercase; tracking-wider: 0.05em; }
        .blog-content td { padding: 1rem 1.25rem; border: 1px solid #e2e8f0; vertical-align: top; color: #334155; font-size: 0.95rem; }
        .blog-content pre { background-color: #1e293b; color: #f8fafc; padding: 1.25rem; border-radius: 0.75rem; overflow-x: auto; margin-bottom: 1.5rem; font-family: monospace; }
        .blog-content strong { color: #0f172a; font-weight: 700; }
        .blog-content a {
          color: #FF8A00 !important;
          font-weight: 700 !important;
          text-decoration: none !important;
          transition: all 0.15s ease-in-out !important;
          border-bottom: 1px solid rgba(255, 138, 0, 0.3) !important;
        }
        .blog-content a:hover {
          color: #FF8A00 !important;
          text-decoration: underline !important;
          border-bottom: 1px solid #FF8A00 !important;
        }
        @media (max-width: 768px) {
          .blog-content table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .blog-content h1 { font-size: 2rem; }
          .blog-content h2 { font-size: 1.5rem; margin-top: 2rem; }
          .blog-content h3 { font-size: 1.25rem; }
        }
      `}</style>
    </div>
  );
}
