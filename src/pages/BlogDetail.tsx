import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import notionBlogPosts from '../data/notionBlogData.json';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  thumbnailUrl: string;
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);

    // Look up in build-time notion blog posts (which holds full HTML content)
    const found = notionBlogPosts.find((p) => p.id === id);
    if (found) {
      setPost(found as BlogPost);

      // Update meta description with the post's summary
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', found.summary || "DDNZ Global Logistics Insight content");

      // Tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'blog_view', {
          'page_title': found.title,
          'page_id': id
        });
      }
    } else {
      console.warn(`Post with ID ${id} not found in Notion static data.`);
    }

    setIsLoading(false);
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#4B27B1] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Fetching secure Notion content...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Post Not Found</h1>
        <Link to="/" className="text-[#4B27B1] font-bold flex items-center hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-50 border-b border-slate-100 pt-24 md:pt-32 pb-6">
        <div className="max-w-4xl mx-auto px-4 md:px-6 flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500">
          <Link to="/" className="hover:text-[#4B27B1] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/insights" className="hover:text-[#4B27B1] transition-colors">Insights</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#4B27B1] truncate max-w-[200px] md:max-w-none font-bold">{post.title}</span>
        </div>
      </div>

      <main className="py-12 md:py-20">
        <article className="max-w-4xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-purple-100 text-[#4B27B1] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {post.category}
              </span>
              <div className="flex items-center text-slate-500 text-sm">
                <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                {post.date}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-[#4B27B1] leading-tight mb-8">
              {post.title}
            </h1>

            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-xl ring-1 ring-slate-200 bg-slate-100">
              <img 
                src={post.thumbnailUrl} 
                alt={post.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Main Content Area */}
            <div className="prose prose-slate lg:prose-xl max-w-none 
              prose-headings:text-[#4B27B1] prose-headings:font-black 
              prose-strong:text-slate-900 prose-a:text-[#FF8A00]
              prose-img:rounded-2xl prose-table:border-collapse prose-table:border prose-table:border-slate-200">
              <div 
                dangerouslySetInnerHTML={{ __html: post.content }} 
                className="blog-content font-sans text-slate-700 leading-relaxed"
              />
            </div>

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
