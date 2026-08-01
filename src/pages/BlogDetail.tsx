import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react';
import notionBlogPosts from '../data/notionBlogData.json';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import SchemaMarkup from '../components/SchemaMarkup';
import SEO from '../components/SEO';
import { trackEvent } from '../lib/analytics';
import type { BlogPost } from '../types/content';

function normalizeNotionLinks(content: string) {
  return content.replace(
    /https:\/\/(?:www\.)?google\.com\/search\?q=([^"'&\s]+)/g,
    (url, encodedPath: string) => {
      try {
        const path = decodeURIComponent(encodedPath);
        const isInternalRoute =
          /^(?:\/services\/|\/shipping-from-china-to-|\/insights(?:\/|$)|\/sourcing\/|\/get-a-quote)/.test(path);
        return isInternalRoute ? `https://www.ddnzglobal.com${path}` : url;
      } catch {
        return url;
      }
    },
  );
}

function buildPrimaryCta(post: BlogPost) {
  const isProductSourcing =
    post.leadGoal === 'Product Sourcing' ||
    post.primaryCTA === 'Commercial Kitchen Sourcing' ||
    post.primaryCTA === 'Outdoor Products Sourcing' ||
    (Boolean(post.productCategory) && post.productCategory !== 'Not Applicable');
  const params = new URLSearchParams({
    source: 'article',
    article: post.slug || post.id,
    leadGoal: post.leadGoal || (isProductSourcing ? 'Product Sourcing' : 'Freight Export'),
  });
  if (post.productCategory && post.productCategory !== 'Not Applicable') {
    params.set('industry', post.productCategory);
  }
  if (post.productSubcategory) params.set('subcategory', post.productSubcategory);

  if (post.primaryCTA === 'Commercial Kitchen Sourcing') {
    return {
      label: 'Plan a commercial kitchen sourcing project',
      href: `/sourcing/commercial-kitchen-equipment-from-china?${params.toString()}`,
    };
  }
  if (post.primaryCTA === 'Outdoor Products Sourcing') {
    return {
      label: 'Plan an outdoor product sourcing project',
      href: `/sourcing/outdoor-products-from-china?${params.toString()}`,
    };
  }
  return {
    label: 'Request a China export freight plan',
    href: `/get-a-quote?${params.toString()}`,
  };
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const progressSent = useRef(new Set<number>());
  const { language } = useLanguage();
  const ui =
    language === 'es'
      ? { loading: 'Cargando contenido de Notion...', missing: 'Artículo no encontrado', back: 'Volver al inicio' }
      : language === 'ar'
        ? { loading: 'جارٍ تحميل محتوى Notion...', missing: 'المقال غير موجود', back: 'العودة إلى الصفحة الرئيسية' }
        : { loading: 'Loading verified article...', missing: 'Post Not Found', back: 'Back to Home' };

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    const found = (notionBlogPosts as BlogPost[]).find((item) => item.slug === slug || item.id === slug);
    setPost(found || null);
    setIsLoading(false);
    progressSent.current.clear();
    window.scrollTo(0, 0);

    if (found) {
      trackEvent('blog_view', {
        page_title: found.title,
        page_id: found.id,
        page_slug: found.slug || found.id,
        lead_goal: found.leadGoal,
        product_category: found.productCategory,
      });
    }
  }, [slug]);

  useEffect(() => {
    if (!post) return;

    const onScroll = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (documentHeight <= 0) return;
      const progress = Math.min(100, Math.round((window.scrollY / documentHeight) * 100));
      [25, 50, 75, 100].forEach((threshold) => {
        if (progress >= threshold && !progressSent.current.has(threshold)) {
          progressSent.current.add(threshold);
          trackEvent('article_read_progress', {
            article_slug: post.slug || post.id,
            progress_percent: threshold,
            lead_goal: post.leadGoal,
            product_category: post.productCategory,
          });
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [post]);

  const primaryCta = useMemo(() => (post ? buildPrimaryCta(post) : null), [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0b4f8a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">{ui.loading}</p>
        </div>
      </div>
    );
  }

  if (!post || !primaryCta) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">{ui.missing}</h1>
        <Link to="/" className="text-[#0b4f8a] font-bold flex items-center hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" /> {ui.back}
        </Link>
      </div>
    );
  }

  const suffix = ' | DDNZ Global';
  const maxPrefix = 60 - suffix.length;
  const seoTitle =
    post.title.length > maxPrefix
      ? `${post.title.slice(0, Math.max(20, maxPrefix - 3)).replace(/\s+\S*$/, '')}...${suffix}`
      : `${post.title}${suffix}`;
  const rawDesc = post.summary || post.title;
  const seoDesc = rawDesc.length > 155 ? `${rawDesc.slice(0, 152).trim()}...` : rawDesc;
  const postLanguage = post.language || 'en';
  const postPrefix = postLanguage === 'en' ? '' : `/${postLanguage}`;
  const postPath = `${postPrefix}/blog/${post.slug || post.id}`;
  const showToc = (post.wordCount || 0) > 1200 && Boolean(post.toc?.length);
  const reviewerText = post.governed
    ? post.reviewer?.length
      ? post.reviewer.join(', ')
      : post.reviewMode === 'delegated-automation'
        ? 'DDNZ automated research and editorial audit'
        : 'DDNZ editorial desk'
    : 'Legacy editorial record';
  const verifiedDate = post.lastVerified || post.lastEdited?.slice(0, 10) || post.date;
  const verificationLabel = post.governed ? 'Verified' : 'Updated';

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={`${post.primaryQuery || post.category}, China sourcing, China freight forwarder, DDNZ Global`}
        canonicalPath={postPath}
        alternateUrls={[{ hrefLang: postLanguage, href: `https://www.ddnzglobal.com${postPath}` }]}
        image={post.thumbnailUrl}
        type="article"
        publishedTime={post.date}
        modifiedTime={post.lastEdited || verifiedDate}
      />
      <SchemaMarkup
        type="BlogPosting"
        data={{
          headline: post.title,
          description: post.summary,
          image: post.thumbnailUrl,
          datePublished: post.date,
          dateModified: post.lastEdited || verifiedDate,
          url: `https://www.ddnzglobal.com${postPath}`,
          governed: Boolean(post.governed),
        }}
      />
      <Navbar />

      <header className="relative pt-32 pb-24 md:pt-40 md:pb-36 bg-[#07182d] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_80%_15%,#0b4f8a_0,transparent_38%),radial-gradient(circle_at_15%_80%,#d97706_0,transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0b_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0b_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm text-slate-300 mb-7">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/insights" className="hover:text-white">Insights</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-400 font-bold truncate">{post.contentType || post.category}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="bg-amber-400/15 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {post.contentType || post.category}
            </span>
            {post.audienceMarket && (
              <span className="bg-white/8 text-slate-200 border border-white/15 px-3 py-1 rounded-full text-xs font-semibold">
                {post.audienceMarket}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight text-balance">{post.title}</h1>
          {post.summary && <p className="mt-6 max-w-3xl text-lg text-slate-200 leading-relaxed">{post.summary}</p>}
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-400" />Published {post.date}</span>
            <span className="inline-flex items-center gap-2"><Clock3 className="w-4 h-4 text-amber-400" />{post.readMinutes || 5} min read</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-400" />{verificationLabel} {verifiedDate}</span>
          </div>
        </div>
      </header>

      <main className="pb-16 md:pb-24">
        <article className="max-w-4xl mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <figure className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-2xl ring-1 ring-slate-200 bg-slate-100 -mt-16 md:-mt-24 z-20">
              <img src={post.thumbnailUrl} alt={`${post.title} cover`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </figure>

            <section className="grid sm:grid-cols-3 gap-3 mb-9" aria-label="Article verification">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <UserRoundCheck className="w-5 h-5 text-[#0b4f8a] mb-2" />
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Reviewed by</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{reviewerText}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <CheckCircle2 className="w-5 h-5 text-[#0b4f8a] mb-2" />
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Evidence records</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{post.governed ? `${post.evidenceCount || 0} linked` : 'Legacy record'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <ShieldCheck className="w-5 h-5 text-[#0b4f8a] mb-2" />
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500">{post.governed ? 'Last verified' : 'Last updated'}</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{verifiedDate}</p>
              </div>
            </section>

            {showToc && (
              <nav aria-label="Table of contents" className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0b4f8a] mb-4">On this page</p>
                <ol className="space-y-2">
                  {post.toc?.map((item) => (
                    <li key={item.id} className={item.level === 3 ? 'pl-5' : ''}>
                      <a className="text-sm font-semibold text-slate-700 hover:text-amber-700" href={`#${item.id}`}>{item.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div
              className="prose prose-slate lg:prose-lg max-w-none blog-content post-content"
              dangerouslySetInnerHTML={{ __html: normalizeNotionLinks(post.content) }}
            />

            <section id="article-primary-cta" className="mt-14 rounded-3xl bg-[#07182d] p-7 md:p-10 text-white overflow-hidden relative">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />
              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">Next operational step</p>
                <h2 className="mt-3 text-2xl md:text-3xl font-black max-w-2xl">
                  Turn this guidance into a scoped China sourcing or export plan.
                </h2>
                <p className="mt-4 text-slate-300 max-w-2xl">
                  Share the destination market, product scope, quantities, inspection needs, and export requirements. DDNZ will respond against the stated scope rather than with a generic promise.
                </p>
                <Link
                  to={primaryCta.href}
                  data-analytics-tracked="true"
                  onClick={() =>
                    trackEvent('article_cta_click', {
                      article_slug: post.slug || post.id,
                      cta_type: post.primaryCTA || 'Freight Quote',
                      lead_goal: post.leadGoal,
                      product_category: post.productCategory,
                    })
                  }
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3.5 font-extrabold text-white hover:bg-amber-700 transition-colors"
                >
                  {primaryCta.label}<ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <Link to="/insights" className="inline-flex items-center gap-3 text-slate-900 font-bold hover:text-[#0b4f8a]">
                <span className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center"><ArrowLeft className="w-5 h-5" /></span>
                Back to Insights Hub
              </Link>
            </div>
          </motion.div>
        </article>
      </main>

      <Footer />

      <style>{`
        .blog-content { color: #334155; font-size: 1.075rem; line-height: 1.82; }
        .blog-content h2, .blog-content h3, .blog-content h4 { scroll-margin-top: 7rem; color: #0b1f3a; font-weight: 850; line-height: 1.3; }
        .blog-content h2 { margin: 2.8rem 0 1.1rem; border-left: 5px solid #d97706; padding-left: .9rem; font-size: 1.9rem; }
        .blog-content h3 { margin: 2.2rem 0 1rem; font-size: 1.5rem; }
        .blog-content h4 { margin: 1.8rem 0 .8rem; font-size: 1.25rem; }
        .blog-content p, .blog-content ul, .blog-content ol { margin-bottom: 1.45rem; }
        .blog-content ul, .blog-content ol { padding-left: 1.6rem; }
        .blog-content ul { list-style: disc; }
        .blog-content ol { list-style: decimal; }
        .blog-content li { margin-bottom: .55rem; }
        .blog-content a { color: #b45309; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
        .blog-content blockquote { margin: 2rem 0; border-left: 4px solid #0b4f8a; background: #eff6ff; padding: 1.25rem 1.5rem; border-radius: 0 .8rem .8rem 0; }
        .article-callout { display: flex; gap: .9rem; margin: 2rem 0; padding: 1.25rem; border: 1px solid #fde68a; border-radius: 1rem; background: #fffbeb; }
        .article-figure { margin: 2.2rem 0; }
        .article-figure img { width: 100%; height: auto; border-radius: 1rem; border: 1px solid #e2e8f0; }
        .article-figure figcaption { margin-top: .65rem; color: #64748b; font-size: .875rem; line-height: 1.5; }
        .article-table-wrap { overflow-x: auto; margin: 2rem 0; border: 1px solid #e2e8f0; border-radius: .9rem; }
        .blog-content table { width: 100%; min-width: 620px; border-collapse: collapse; background: white; }
        .blog-content th { background: #0b1f3a; color: white; text-align: left; font-size: .82rem; text-transform: uppercase; letter-spacing: .04em; }
        .blog-content th, .blog-content td { padding: .9rem 1rem; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
        .blog-content pre { overflow-x: auto; border-radius: .8rem; background: #0f172a; color: #f8fafc; padding: 1.2rem; }
        .blog-content details { margin: 1.5rem 0; border: 1px solid #e2e8f0; border-radius: .8rem; padding: 1rem; }
        .blog-content summary { cursor: pointer; font-weight: 800; color: #0b1f3a; }
        @media (max-width: 768px) { .blog-content h2 { font-size: 1.5rem; } .blog-content h3 { font-size: 1.28rem; } }
      `}</style>
    </div>
  );
}
