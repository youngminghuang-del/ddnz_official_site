import { bindPrivacyWorksheet } from '../lib/privacyWorksheet.mjs';
import { normalizeQuoteHtml } from '../lib/quoteLinkPolicy.mjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ArticleReadingContent from '../features/article-reading/ArticleReadingContent';
import { articleUi, normalizeNotionLinks, buildPrimaryCta } from '../features/article-reading/model';
import notionBlogPosts from '../data/notionBlogData.json';
import { mobileArticleDiscovery } from '../data/mobileArticleDiscovery.mjs';
import { kitchenArticleDiscovery } from '../data/kitchenArticleDiscovery.mjs';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import SchemaMarkup from '../components/SchemaMarkup';
import SEO from '../components/SEO';
import { trackEvent } from '../lib/analytics';
import {
  articleLocalePrefix,
  articleRoutePath,
  canonicalSitePath,
  findArticleByRoute,
  getArticleHreflangSet,
} from '../lib/notionArticleRouting';
import type { BlogPost } from '../types/content';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const progressSent = useRef(new Set<number>());
  const { language: navigationLanguage } = useLanguage();
  const location = useLocation();
  const language = location.pathname.startsWith('/id/blog/') ? 'id' : navigationLanguage;
  // Indonesian is authored for articles; the rest of the site retains its existing navigation.
  const prefix = language === 'id' ? '' : articleLocalePrefix(language);
  const ui = articleUi[language];

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    const found = findArticleByRoute(notionBlogPosts as BlogPost[], language, slug);
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
  }, [language, slug]);

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

  // Keep the HTML prop stable across hash-navigation/context renders so native
  // form nodes, input values and their listeners are not replaced.
  const articleHtml = useMemo(() => ({
    __html: normalizeQuoteHtml(normalizeNotionLinks(post?.content || '')),
  }), [post?.content]);

  useEffect(() => {
    if (!isLoading && post?.slug === 'top-10-privacy-screen-protector-manufacturers-china') return bindPrivacyWorksheet();
  }, [post, isLoading]);

  const primaryCta = useMemo(() => (post ? buildPrimaryCta(post, prefix, ui) : null), [post, prefix, ui]);

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
        <Link to={canonicalSitePath(prefix || '/')} className="text-[#0b4f8a] font-bold flex items-center hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0 rtl:rotate-180" /> {ui.back}
        </Link>
      </div>
    );
  }

  const suffix = ' | DDNZ Global';
  const rawTitle = post.title.trim();
  const maxTitleLen = 65;
  const titleLead = rawTitle.split(/[:：]/, 1)[0].trim();
  const maxPrefix = maxTitleLen - suffix.length - 1;
  const prefixCandidate = rawTitle.slice(0, maxPrefix);
  const prefixSpace = prefixCandidate.lastIndexOf(' ');
  const completePrefix = prefixSpace > maxPrefix * 0.72
    ? prefixCandidate.slice(0, prefixSpace)
    : prefixCandidate;
  const articleDiscovery = kitchenArticleDiscovery[post.slug || ''] || mobileArticleDiscovery[post.slug || ''];
  const seoTitle = articleDiscovery?.title || (post.slug === 'cheap-speakers-china-african-trader-verification'
    ? 'Cheap China Speakers: African Trader Verification | DDNZ Global'
    : rawTitle.length + suffix.length <= maxTitleLen
      ? `${rawTitle}${suffix}`
      : titleLead.length >= 24 && titleLead.length + suffix.length <= maxTitleLen
        ? `${titleLead}${suffix}`
        : `${completePrefix.trim()}…${suffix}`);
  const rawDesc = post.summary || post.title;
  const descCandidate = rawDesc.slice(0, 154);
  const descSpace = descCandidate.lastIndexOf(' ');
  const seoDesc = articleDiscovery?.description || (rawDesc.length > 155
    ? `${(descSpace > 112 ? descCandidate.slice(0, descSpace) : descCandidate).trim()}…`
    : rawDesc);
  const postPath = articleRoutePath(post);
  const articleHreflang = getArticleHreflangSet(post, notionBlogPosts as BlogPost[]);
  const verifiedDate = post.lastVerified || post.lastEdited?.slice(0, 10) || post.date;

  return (
    <div className="ddnz-home article-reading-page min-h-screen font-sans">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={`${post.primaryQuery || post.category}, China sourcing, China freight forwarder, DDNZ Global`}
        contentLanguage={language}
        canonicalPath={postPath}
        alternateUrls={articleHreflang.alternates}
        image={post.thumbnailUrl}
        type="article"
        publishedTime={post.date}
        modifiedTime={post.lastEdited || verifiedDate}
      />
      <SchemaMarkup
        type="BlogPosting"
        data={{
          headline: post.title,
          inLanguage: language,
          description: post.summary,
          image: post.thumbnailUrl,
          datePublished: post.date,
          dateModified: post.lastEdited || verifiedDate,
          url: `https://www.ddnzglobal.com${postPath}`,
          governed: Boolean(post.governed),
        }}
      />
      <SourcingHomepageNav />

      <ArticleReadingContent
        post={post}
        language={language}
        articleHtml={articleHtml}
        primaryCta={primaryCta}
        discovery={articleDiscovery}
        onDiscovery={(href) => trackEvent('article_equipment_click', { article_slug: post.slug, link_path: href })}
        onCta={() => trackEvent('article_cta_click', {
          article_slug: post.slug || post.id,
          cta_type: post.primaryCTA || 'Freight Quote',
          lead_goal: post.leadGoal,
          product_category: post.productCategory,
        })}
      />

      <Footer />


    </div>
  );
}
