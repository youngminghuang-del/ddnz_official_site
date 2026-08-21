import { ArrowRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import notionBlogPosts from '../data/notionBlogData.json';
import { articleRoutePath, normalizeArticleLocale } from '../lib/notionArticleRouting';
import type { BlogPost } from '../types/content';

type InterfaceCopy = {
  title: string;
  subtitle: string;
  latest: string;
  read: string;
  viewAll: string;
};

const copy: Record<string, InterfaceCopy> = {
  en: {
    title: 'Trade knowledge, kept current',
    subtitle: 'Recent guidance on freight, sourcing, compliance and changing international markets.',
    latest: 'Latest analysis',
    read: 'Read article',
    viewAll: 'View all insights',
  },
  zh: {
    title: '持续更新的全球贸易知识',
    subtitle: '关注货运、采购、合规与国际市场变化，为进口决策提供可执行的信息。',
    latest: '最新分析',
    read: '阅读文章',
    viewAll: '查看全部行业洞察',
  },
  ru: {
    title: 'Актуальные знания о торговле',
    subtitle: 'Свежие материалы о перевозках, закупках, соответствии требованиям и международных рынках.',
    latest: 'Новый материал',
    read: 'Читать',
    viewAll: 'Все материалы',
  },
  fr: {
    title: 'Une expertise commerciale actualisée',
    subtitle: 'Conseils récents sur le fret, les achats, la conformité et l’évolution des marchés internationaux.',
    latest: 'Analyse récente',
    read: 'Lire l’article',
    viewAll: 'Voir toutes les analyses',
  },
  es: {
    title: 'Conocimiento comercial actualizado',
    subtitle: 'Análisis recientes sobre transporte, compras, cumplimiento y cambios en los mercados internacionales.',
    latest: 'Análisis reciente',
    read: 'Leer artículo',
    viewAll: 'Ver todos los análisis',
  },
  ar: {
    title: 'معرفة تجارية محدثة',
    subtitle: 'إرشادات حديثة حول الشحن والتوريد والامتثال وتغيرات الأسواق الدولية.',
    latest: 'أحدث تحليل',
    read: 'اقرأ المقال',
    viewAll: 'عرض جميع التحليلات',
  },
};

const languageNames: Record<string, string> = {
  en: 'English',
  'zh-cn': '中文',
  ru: 'Русский',
  fr: 'Français',
  es: 'Español',
  ar: 'العربية',
};

const prefixByLanguage: Record<string, string> = {
  zh: '/zh-cn',
  ru: '/ru',
  fr: '/fr',
  es: '/es',
  ar: '/ar',
};

export default function Insights() {
  const { language } = useLanguage();
  const content = copy[language] || copy.en;
  const prefix = prefixByLanguage[language] || '';
  const posts = notionBlogPosts as BlogPost[];

  const currentArticleLocale = normalizeArticleLocale(language);
  const preferredPosts = posts.filter((post) => normalizeArticleLocale(post.language) === currentArticleLocale);
  const otherPosts = posts.filter((post) => normalizeArticleLocale(post.language) !== currentArticleLocale);
  const displayPosts = [...preferredPosts.slice(0, 3), ...otherPosts].slice(0, 6);
  const [featuredPost, ...secondaryPosts] = displayPosts;

  const blogPath = (post: BlogPost) => articleRoutePath(post);

  if (!featuredPost) return null;

  return (
    <section id="insights" className="scroll-mt-24 border-t border-slate-200 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-black leading-tight tracking-[-0.035em] text-[#0B1F3A] md:text-5xl">
            {content.title}
          </h2>
          <div className="mt-4 h-1 w-12 rounded-full bg-[var(--hb-amber)]" aria-hidden="true" />
          <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-slate-600 md:text-lg">
            {content.subtitle}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-[#F5F8FC] lg:col-span-7">
            <Link to={blogPath(featuredPost)} className="block aspect-[16/9] overflow-hidden bg-slate-100">
              <img
                src={featuredPost.listingThumbnailUrl || featuredPost.thumbnailUrl}
                srcSet={featuredPost.listingThumbnailSrcSet}
                sizes="(min-width: 1024px) 58vw, 100vw"
                alt={featuredPost.title}
                width="960"
                height="540"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.025]"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </Link>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-slate-500">
                <span className="text-[#D85F0B]">{content.latest}</span>
                <span>{languageNames[normalizeArticleLocale(featuredPost.language)] || normalizeArticleLocale(featuredPost.language)}</span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  {featuredPost.date}
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-black leading-tight tracking-[-0.025em] text-[#0B1F3A] md:text-3xl">
                <Link to={blogPath(featuredPost)}>{featuredPost.title}</Link>
              </h3>
              <p className="mt-4 line-clamp-3 text-sm font-medium leading-6 text-slate-600 md:text-base md:leading-7">
                {featuredPost.summary}
              </p>
              <Link
                to={blogPath(featuredPost)}
                className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#0B4F8A] transition-colors hover:text-[#D85F0B]"
              >
                {content.read}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </article>

          <div className="lg:col-span-5">
            {secondaryPosts.map((post) => (
              <article key={post.id} className="grid grid-cols-[108px_1fr] gap-4 border-b border-slate-200 py-5 first:pt-0 last:border-b-0 sm:grid-cols-[140px_1fr]">
                <Link to={blogPath(post)} className="block aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={post.listingThumbnailUrl || post.thumbnailUrl}
                    srcSet={post.listingThumbnailSrcSet}
                    sizes="140px"
                    alt={post.title}
                    width="480"
                    height="270"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </Link>
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold text-slate-500">
                    <span className="text-[#D85F0B]">{languageNames[normalizeArticleLocale(post.language)] || normalizeArticleLocale(post.language)}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="mt-2 line-clamp-3 text-base font-black leading-snug text-[#0B1F3A] sm:text-lg">
                    <Link to={blogPath(post)}>{post.title}</Link>
                  </h3>
                </div>
              </article>
            ))}

            <Link
              to={`${prefix}/insights`}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0B4F8A] px-6 py-3 text-sm font-black text-white transition-colors hover:bg-[#083E6D] active:scale-[0.98]"
            >
              {content.viewAll}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
