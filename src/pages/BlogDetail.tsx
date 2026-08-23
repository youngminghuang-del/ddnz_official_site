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
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import SchemaMarkup from '../components/SchemaMarkup';
import SEO from '../components/SEO';
import { trackEvent } from '../lib/analytics';
import {
  articleLocalePrefix,
  articleRoutePath,
  findArticleByRoute,
  getArticleHreflangSet,
} from '../lib/notionArticleRouting';
import type { BlogPost } from '../types/content';
import type { Language } from '../i18n/translations';

type ArticleUi = {
  loading: string;
  missing: string;
  back: string;
  home: string;
  insights: string;
  published: string;
  minRead: string;
  verified: string;
  updated: string;
  reviewedBy: string;
  evidenceRecords: string;
  linked: string;
  legacyRecord: string;
  lastVerified: string;
  lastUpdated: string;
  onThisPage: string;
  nextStep: string;
  ctaTitle: string;
  ctaBody: string;
  backInsights: string;
  automatedReview: string;
  editorialDesk: string;
  legacyEditorial: string;
  commercialCta: string;
  outdoorCta: string;
  sourcingCta: string;
  freightCta: string;
};

const articleUi: Record<Language, ArticleUi> = {
  en: {
    loading: 'Loading verified article...', missing: 'Post Not Found', back: 'Back to Home', home: 'Home', insights: 'Insights', published: 'Published', minRead: 'min read', verified: 'Verified', updated: 'Updated', reviewedBy: 'Reviewed by', evidenceRecords: 'Evidence records', linked: 'linked', legacyRecord: 'Legacy record', lastVerified: 'Last verified', lastUpdated: 'Last updated', onThisPage: 'On this page', nextStep: 'Next operational step', ctaTitle: 'Turn this guidance into a scoped China sourcing or export plan.', ctaBody: 'Share the destination market, product scope, quantities, inspection needs, and export requirements. DDNZ will respond against the stated scope rather than with a generic promise.', backInsights: 'Back to Insights Hub', automatedReview: 'DDNZ automated research and editorial audit', editorialDesk: 'DDNZ editorial desk', legacyEditorial: 'Legacy editorial record', commercialCta: 'Plan a commercial kitchen sourcing project', outdoorCta: 'Plan an outdoor product sourcing project', sourcingCta: 'Start a product sourcing brief', freightCta: 'Request a China export freight plan',
  },
  zh: {
    loading: '正在加载已核验文章…', missing: '未找到文章', back: '返回首页', home: '首页', insights: '洞察', published: '发布于', minRead: '分钟阅读', verified: '已核验', updated: '已更新', reviewedBy: '审核人', evidenceRecords: '证据记录', linked: '项已关联', legacyRecord: '历史记录', lastVerified: '最近核验', lastUpdated: '最近更新', onThisPage: '本页内容', nextStep: '下一步行动', ctaTitle: '将这些信息转化为范围明确的中国采购或出口方案。', ctaBody: '请提供目的市场、产品范围、数量、验货要求和出口需求。DDNZ 将根据具体范围回复，而不是提供笼统承诺。', backInsights: '返回洞察中心', automatedReview: 'DDNZ 自动研究与编辑审计', editorialDesk: 'DDNZ 编辑团队', legacyEditorial: '历史编辑记录', commercialCta: '规划商用厨房采购项目', outdoorCta: '规划户外产品采购项目', sourcingCta: '提交产品采购简报', freightCta: '获取中国出口运输方案',
  },
  ru: {
    loading: 'Загрузка проверенной статьи…', missing: 'Статья не найдена', back: 'Вернуться на главную', home: 'Главная', insights: 'Материалы', published: 'Опубликовано', minRead: 'мин чтения', verified: 'Проверено', updated: 'Обновлено', reviewedBy: 'Проверил', evidenceRecords: 'Подтверждающие материалы', linked: 'связано', legacyRecord: 'Архивная запись', lastVerified: 'Последняя проверка', lastUpdated: 'Последнее обновление', onThisPage: 'На этой странице', nextStep: 'Следующий практический шаг', ctaTitle: 'Превратите эти рекомендации в конкретный план закупки или экспорта из Китая.', ctaBody: 'Укажите рынок назначения, ассортимент, объёмы, требования к инспекции и экспорту. DDNZ ответит по заданному объёму работ без общих обещаний.', backInsights: 'Вернуться в раздел материалов', automatedReview: 'Автоматизированная исследовательская и редакционная проверка DDNZ', editorialDesk: 'Редакция DDNZ', legacyEditorial: 'Архивная редакционная запись', commercialCta: 'Спланировать закупку оборудования для профессиональной кухни', outdoorCta: 'Спланировать закупку товаров для отдыха на природе', sourcingCta: 'Начать бриф по закупке товара', freightCta: 'Запросить план экспорта из Китая',
  },
  fr: {
    loading: 'Chargement de l’article vérifié…', missing: 'Article introuvable', back: 'Retour à l’accueil', home: 'Accueil', insights: 'Ressources', published: 'Publié le', minRead: 'min de lecture', verified: 'Vérifié', updated: 'Mis à jour', reviewedBy: 'Relu par', evidenceRecords: 'Éléments de preuve', linked: 'liés', legacyRecord: 'Dossier historique', lastVerified: 'Dernière vérification', lastUpdated: 'Dernière mise à jour', onThisPage: 'Dans cet article', nextStep: 'Prochaine étape opérationnelle', ctaTitle: 'Transformez ces informations en un plan défini d’approvisionnement ou d’export depuis la Chine.', ctaBody: 'Indiquez le marché de destination, les produits, les quantités, les besoins d’inspection et les exigences d’export. DDNZ répondra selon ce périmètre précis.', backInsights: 'Retour au centre de ressources', automatedReview: 'Audit automatisé de recherche et de rédaction DDNZ', editorialDesk: 'Rédaction DDNZ', legacyEditorial: 'Dossier éditorial historique', commercialCta: 'Planifier un projet d’approvisionnement en cuisine professionnelle', outdoorCta: 'Planifier un projet d’approvisionnement en produits outdoor', sourcingCta: 'Démarrer un brief d’approvisionnement', freightCta: 'Demander un plan d’export depuis la Chine',
  },
  es: {
    loading: 'Cargando contenido verificado…', missing: 'Artículo no encontrado', back: 'Volver al inicio', home: 'Inicio', insights: 'Recursos', published: 'Publicado', minRead: 'min de lectura', verified: 'Verificado', updated: 'Actualizado', reviewedBy: 'Revisado por', evidenceRecords: 'Registros de evidencia', linked: 'vinculados', legacyRecord: 'Registro histórico', lastVerified: 'Última verificación', lastUpdated: 'Última actualización', onThisPage: 'En esta página', nextStep: 'Siguiente paso operativo', ctaTitle: 'Convierta esta información en un plan definido de abastecimiento o exportación desde China.', ctaBody: 'Comparta el mercado de destino, el alcance del producto, las cantidades, las necesidades de inspección y los requisitos de exportación. DDNZ responderá según ese alcance.', backInsights: 'Volver al centro de recursos', automatedReview: 'Auditoría automatizada de investigación y edición de DDNZ', editorialDesk: 'Equipo editorial de DDNZ', legacyEditorial: 'Registro editorial histórico', commercialCta: 'Planificar un proyecto de abastecimiento de cocina comercial', outdoorCta: 'Planificar un proyecto de abastecimiento de productos outdoor', sourcingCta: 'Iniciar un brief de abastecimiento', freightCta: 'Solicitar un plan de exportación desde China',
  },
  ar: {
    loading: 'جارٍ تحميل المقال المتحقق منه…', missing: 'المقال غير موجود', back: 'العودة إلى الصفحة الرئيسية', home: 'الرئيسية', insights: 'المعرفة', published: 'نُشر في', minRead: 'دقائق للقراءة', verified: 'تم التحقق', updated: 'تم التحديث', reviewedBy: 'راجعه', evidenceRecords: 'سجلات الأدلة', linked: 'مرتبطة', legacyRecord: 'سجل سابق', lastVerified: 'آخر تحقق', lastUpdated: 'آخر تحديث', onThisPage: 'في هذه الصفحة', nextStep: 'الخطوة التشغيلية التالية', ctaTitle: 'حوّل هذه الإرشادات إلى خطة محددة للتوريد أو التصدير من الصين.', ctaBody: 'شارك سوق الوجهة ونطاق المنتجات والكميات ومتطلبات الفحص والتصدير. سترد DDNZ وفق النطاق المحدد بدلًا من الوعود العامة.', backInsights: 'العودة إلى مركز المعرفة', automatedReview: 'تدقيق DDNZ الآلي للبحث والتحرير', editorialDesk: 'فريق تحرير DDNZ', legacyEditorial: 'سجل تحريري سابق', commercialCta: 'خطط لمشروع توريد مطبخ تجاري', outdoorCta: 'خطط لمشروع توريد منتجات خارجية', sourcingCta: 'ابدأ موجز توريد المنتجات', freightCta: 'اطلب خطة تصدير من الصين',
  },
  pt: {
    loading: 'A carregar o artigo verificado…', missing: 'Artigo não encontrado', back: 'Voltar ao início', home: 'Início', insights: 'Conteúdos', published: 'Publicado em', minRead: 'min de leitura', verified: 'Verificado', updated: 'Atualizado', reviewedBy: 'Revisto por', evidenceRecords: 'Registos de evidência', linked: 'associados', legacyRecord: 'Registo histórico', lastVerified: 'Última verificação', lastUpdated: 'Última atualização', onThisPage: 'Nesta página', nextStep: 'Próximo passo operacional', ctaTitle: 'Transforme esta orientação num plano definido de sourcing ou exportação a partir da China.', ctaBody: 'Partilhe o mercado de destino, o âmbito dos produtos, as quantidades, as necessidades de inspeção e os requisitos de exportação. A DDNZ responderá de acordo com esse âmbito específico.', backInsights: 'Voltar ao centro de conteúdos', automatedReview: 'Auditoria automatizada de pesquisa e edição da DDNZ', editorialDesk: 'Equipa editorial da DDNZ', legacyEditorial: 'Registo editorial histórico', commercialCta: 'Planear um projeto de sourcing para cozinha profissional', outdoorCta: 'Planear um projeto de sourcing de produtos outdoor', sourcingCta: 'Iniciar um briefing de sourcing', freightCta: 'Solicitar um plano de exportação a partir da China',
  },
  tr: {
    loading: 'Doğrulanmış makale yükleniyor…', missing: 'Makale bulunamadı', back: 'Ana sayfaya dön', home: 'Ana sayfa', insights: 'İçgörüler', published: 'Yayın tarihi', minRead: 'dk okuma', verified: 'Doğrulandı', updated: 'Güncellendi', reviewedBy: 'İnceleyen', evidenceRecords: 'Kanıt kayıtları', linked: 'bağlantılı', legacyRecord: 'Geçmiş kayıt', lastVerified: 'Son doğrulama', lastUpdated: 'Son güncelleme', onThisPage: 'Bu sayfada', nextStep: 'Sonraki operasyon adımı', ctaTitle: 'Bu rehberi kapsamı belirlenmiş bir Çin tedarik veya ihracat planına dönüştürün.', ctaBody: 'Hedef pazarı, ürün kapsamını, miktarları, denetim ihtiyaçlarını ve ihracat gerekliliklerini paylaşın. DDNZ genel vaatler yerine belirttiğiniz kapsama göre yanıt verir.', backInsights: 'İçgörü merkezine dön', automatedReview: 'DDNZ otomatik araştırma ve editoryal denetimi', editorialDesk: 'DDNZ editoryal ekibi', legacyEditorial: 'Geçmiş editoryal kayıt', commercialCta: 'Ticari mutfak tedarik projesi planlayın', outdoorCta: 'Outdoor ürün tedarik projesi planlayın', sourcingCta: 'Ürün tedarik brifi başlatın', freightCta: 'Çin ihracat planı talep edin',
  },
};

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

function buildPrimaryCta(post: BlogPost, prefix: string, ui: ArticleUi) {
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
      label: ui.commercialCta,
      href: `${prefix}/sourcing/commercial-kitchen-equipment-from-china?${params.toString()}`,
    };
  }
  if (post.primaryCTA === 'Outdoor Products Sourcing') {
    return {
      label: ui.outdoorCta,
      href: `${prefix}/sourcing/outdoor-products-from-china?${params.toString()}`,
    };
  }
  return {
    label: isProductSourcing ? ui.sourcingCta : ui.freightCta,
    href: `${prefix}/get-a-quote?${params.toString()}`,
  };
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const progressSent = useRef(new Set<number>());
  const { language } = useLanguage();
  const prefix = articleLocalePrefix(language);
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
        <Link to={prefix || '/'} className="text-[#0b4f8a] font-bold flex items-center hover:underline">
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
  const seoTitle = post.slug === 'cheap-speakers-china-african-trader-verification'
    ? 'Cheap China Speakers: African Trader Verification | DDNZ Global'
    : rawTitle.length + suffix.length <= maxTitleLen
      ? `${rawTitle}${suffix}`
      : titleLead.length >= 24 && titleLead.length + suffix.length <= maxTitleLen
        ? `${titleLead}${suffix}`
        : `${completePrefix.trim()}…${suffix}`;
  const rawDesc = post.summary || post.title;
  const descCandidate = rawDesc.slice(0, 154);
  const descSpace = descCandidate.lastIndexOf(' ');
  const seoDesc = rawDesc.length > 155
    ? `${(descSpace > 112 ? descCandidate.slice(0, descSpace) : descCandidate).trim()}…`
    : rawDesc;
  const postPath = articleRoutePath(post);
  const articleHreflang = getArticleHreflangSet(post, notionBlogPosts as BlogPost[]);
  const showToc = (post.wordCount || 0) > 1200 && Boolean(post.toc?.length);
  const reviewerText = post.governed
    ? post.reviewer?.length
      ? post.reviewer.join(', ')
      : post.reviewMode === 'delegated-automation'
        ? ui.automatedReview
        : ui.editorialDesk
    : ui.legacyEditorial;
  const verifiedDate = post.lastVerified || post.lastEdited?.slice(0, 10) || post.date;
  const verificationLabel = post.governed ? ui.verified : ui.updated;

  return (
    <div className="ddnz-home min-h-screen bg-white font-sans text-slate-900">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={`${post.primaryQuery || post.category}, China sourcing, China freight forwarder, DDNZ Global`}
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
          description: post.summary,
          image: post.thumbnailUrl,
          datePublished: post.date,
          dateModified: post.lastEdited || verifiedDate,
          url: `https://www.ddnzglobal.com${postPath}`,
          governed: Boolean(post.governed),
        }}
      />
      <SourcingHomepageNav />

      <header className="relative overflow-hidden bg-[#07182d] pb-24 pt-16 text-white md:pb-36 md:pt-24">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_80%_15%,#0b4f8a_0,transparent_38%),radial-gradient(circle_at_15%_80%,#d97706_0,transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0b_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0b_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm text-slate-300 mb-7">
            <Link to={prefix || '/'} className="hover:text-white">{ui.home}</Link>
            <ChevronRight className="h-3 w-3 rtl:rotate-180" />
            <Link to={`${prefix}/insights`} className="hover:text-white">{ui.insights}</Link>
            <ChevronRight className="h-3 w-3 rtl:rotate-180" />
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
            <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-400" />{ui.published} {post.date}</span>
            <span className="inline-flex items-center gap-2"><Clock3 className="w-4 h-4 text-amber-400" />{post.readMinutes || 5} {ui.minRead}</span>
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
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500">{ui.reviewedBy}</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{reviewerText}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <CheckCircle2 className="w-5 h-5 text-[#0b4f8a] mb-2" />
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500">{ui.evidenceRecords}</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{post.governed ? `${post.evidenceCount || 0} ${ui.linked}` : ui.legacyRecord}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <ShieldCheck className="w-5 h-5 text-[#0b4f8a] mb-2" />
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500">{post.governed ? ui.lastVerified : ui.lastUpdated}</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{verifiedDate}</p>
              </div>
            </section>

            {showToc && (
              <nav aria-label="Table of contents" className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0b4f8a] mb-4">{ui.onThisPage}</p>
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
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">{ui.nextStep}</p>
                <h2 className="mt-3 text-2xl md:text-3xl font-black max-w-2xl">
                  {ui.ctaTitle}
                </h2>
                <p className="mt-4 text-slate-300 max-w-2xl">
                  {ui.ctaBody}
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
                  {primaryCta.label}<ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <Link to={`${prefix}/insights`} className="inline-flex items-center gap-3 text-slate-900 font-bold hover:text-[#0b4f8a]">
                <span className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center"><ArrowLeft className="h-5 w-5 rtl:rotate-180" /></span>
                {ui.backInsights}
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
        html[dir="rtl"] .blog-content h2 { border-left: 0; border-right: 5px solid #d97706; padding-left: 0; padding-right: .9rem; }
        html[dir="rtl"] .blog-content blockquote { border-left: 0; border-right: 4px solid #0b4f8a; border-radius: .8rem 0 0 .8rem; }
        html[dir="rtl"] .blog-content ul, html[dir="rtl"] .blog-content ol { padding-left: 0; padding-right: 1.6rem; }
        @media (max-width: 768px) { .blog-content h2 { font-size: 1.5rem; } .blog-content h3 { font-size: 1.28rem; } }
      `}</style>
    </div>
  );
}
