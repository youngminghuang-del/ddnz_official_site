export const ARTICLE_SITE_URL = 'https://www.ddnzglobal.com';
export const ARTICLE_LOCALES = ['en', 'zh-cn', 'ru', 'fr', 'es', 'ar'] as const;

export type ArticleLocale = (typeof ARTICLE_LOCALES)[number];

export type NotionArticleRoute = {
  id: string;
  slug?: string;
  language?: string;
  translationGroup?: string;
  status?: string;
};

export type ArticleHreflangSet = {
  alternates: Array<{ hrefLang: ArticleLocale; href: string }>;
  xDefaultUrl: string;
};

export function normalizeArticleLocale(language?: string): ArticleLocale {
  const normalized = (language || 'en').trim().toLowerCase().replaceAll('_', '-');
  if (normalized === 'zh' || normalized.startsWith('zh-')) return 'zh-cn';
  for (const locale of ARTICLE_LOCALES) {
    if (normalized === locale || normalized.startsWith(`${locale}-`)) return locale;
  }
  return 'en';
}

export function articleLocalePrefix(language?: string) {
  const locale = normalizeArticleLocale(language);
  return locale === 'en' ? '' : `/${locale}`;
}

export function localizedSitePath(language: string | undefined, relativePath = '') {
  const cleanPath = relativePath.replace(/^\/+|\/+$/g, '');
  const prefix = articleLocalePrefix(language);
  return cleanPath ? `${prefix}/${cleanPath}` : prefix || '/';
}

export function localizedSiteUrl(language: string | undefined, relativePath = '') {
  return `${ARTICLE_SITE_URL}${localizedSitePath(language, relativePath)}`;
}

export function articleRoutePath(article: NotionArticleRoute) {
  return localizedSitePath(article.language, `blog/${article.slug || article.id}`);
}

export function articleAbsoluteUrl(article: NotionArticleRoute) {
  return `${ARTICLE_SITE_URL}${articleRoutePath(article)}`;
}

export function articleLanguageSwitchPath<T extends NotionArticleRoute>(
  article: T,
  articles: T[],
  targetLanguage: string | undefined,
) {
  const targetLocale = normalizeArticleLocale(targetLanguage);
  const translation = getArticleHreflangSet(article, articles).alternates.find(
    (alternate) => alternate.hrefLang === targetLocale,
  );
  return translation
    ? new URL(translation.href).pathname
    : localizedSitePath(targetLanguage, 'insights');
}

export function findArticleByRoute<T extends NotionArticleRoute>(
  articles: T[],
  routeLanguage: string | undefined,
  slugOrId: string,
) {
  const routeLocale = normalizeArticleLocale(routeLanguage);
  return articles.find(
    (article) =>
      isPublishedArticle(article) &&
      normalizeArticleLocale(article.language) === routeLocale &&
      (article.slug === slugOrId || article.id === slugOrId),
  );
}

function isPublishedArticle(article: NotionArticleRoute) {
  return !article.status || article.status.trim().toLowerCase() === 'published';
}

function normalizeTranslationGroup(group?: string) {
  return group?.trim().toLowerCase() || '';
}

export function getArticleHreflangSet<T extends NotionArticleRoute>(
  article: T,
  articles: T[],
): ArticleHreflangSet {
  const selfAlternate = {
    hrefLang: normalizeArticleLocale(article.language),
    href: articleAbsoluteUrl(article),
  };
  const translationGroup = normalizeTranslationGroup(article.translationGroup);
  if (!translationGroup) {
    return { alternates: [selfAlternate], xDefaultUrl: selfAlternate.href };
  }

  const variantsByLocale = new Map<ArticleLocale, T>();
  [article, ...articles].forEach((candidate) => {
    if (
      isPublishedArticle(candidate) &&
      normalizeTranslationGroup(candidate.translationGroup) === translationGroup
    ) {
      const locale = normalizeArticleLocale(candidate.language);
      if (!variantsByLocale.has(locale)) variantsByLocale.set(locale, candidate);
    }
  });

  // A label on one article is not evidence of a translation. Keep the page
  // self-only until at least two distinct Published locales share the group.
  if (variantsByLocale.size < 2) {
    return { alternates: [selfAlternate], xDefaultUrl: selfAlternate.href };
  }

  const alternates = ARTICLE_LOCALES.flatMap((locale) => {
    const variant = variantsByLocale.get(locale);
    return variant ? [{ hrefLang: locale, href: articleAbsoluteUrl(variant) }] : [];
  });
  const defaultAlternate = alternates.find((alternate) => alternate.hrefLang === 'en') || alternates[0];

  return { alternates, xDefaultUrl: defaultAlternate.href };
}
