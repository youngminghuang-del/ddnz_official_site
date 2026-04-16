import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, X, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import blogPosts from '../data/blogPosts.json';

type BlogPost = {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  thumbnailUrl: string;
};

export default function Insights() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Optional: Update Meta tags for SEO when component mounts
  useEffect(() => {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    const currentMeta = metaDescription.getAttribute('content');
    metaDescription.setAttribute('content', 'International Logistics, Shipping from China, Freight Forwarding Case Studies. Get the latest insights from DDNZ Global.');

    return () => {
      // Revert if needed, but for simple app, keeping it is fine.
      if (currentMeta) {
        metaDescription?.setAttribute('content', currentMeta);
      }
    };
  }, []);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section id="insights" className="py-24 bg-white font-sans border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight uppercase">Logistics Insights & Global Trade Updates</h2>
          <div className="mt-4 w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
          <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto">
            Stay informed with the latest trends and real-world case studies in global freight forwarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-slate-50 flex flex-col rounded-2xl overflow-hidden shadow-lg border border-slate-100 group cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handlePostClick(post)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.thumbnailUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-slate-500 text-xs font-bold mb-3 uppercase tracking-wider">
                  <Calendar className="w-4 h-4 mr-2" />
                  {post.date}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3">
                  {post.summary}
                </p>
                <div className="flex items-center text-blue-600 font-bold text-sm mt-auto">
                  Read More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 bg-slate-900/10 hover:bg-slate-900/20 rounded-full text-slate-900 backdrop-blur-sm transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="overflow-y-auto w-full h-full p-6 sm:p-10 hide-scrollbar">
                <div className="mb-8">
                  <div className="flex items-center text-blue-600 text-sm font-bold mb-4 uppercase tracking-wider">
                    <Calendar className="w-4 h-4 mr-2" />
                    {selectedPost.date}
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                    {selectedPost.title}
                  </h2>
                  <img 
                    src={selectedPost.thumbnailUrl} 
                    alt={selectedPost.title} 
                    className="w-full h-auto rounded-xl object-cover mb-8"
                    style={{ maxHeight: '400px' }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="prose prose-slate prose-blue max-w-none text-slate-700">
                    <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
                  </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Need personalized advice?</h4>
                    <p className="text-sm text-slate-600 mt-1">Our experts are ready to analyze your specific logistics needs.</p>
                  </div>
                  <a
                    href={`https://wa.me/85261077362?text=${encodeURIComponent(`Hi DDNZ Global, I just read your insight article "${selectedPost.title}" and would like to learn more.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5" /> Contact Expert for Consultation
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
