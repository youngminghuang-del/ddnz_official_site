import { normalizeArticleLocale } from './notionArticleRouting';

type HomepageArticle = { date: string; language?: string; status?: string };
const publicationTime = (date: string) => {
  const timestamp = Date.parse(date);
  return Number.isFinite(timestamp) ? timestamp : 0;
};

/** Publication date leads; the visitor's language only breaks equal-date ties. */
export function latestHomepagePosts<T extends HomepageArticle>(posts: readonly T[], language: string, limit = 6): T[] {
  const locale = normalizeArticleLocale(language);
  return posts
    .filter(post => !post.status || post.status.trim().toLowerCase() === 'published')
    .sort((a, b) => publicationTime(b.date) - publicationTime(a.date)
      || Number(normalizeArticleLocale(b.language) === locale) - Number(normalizeArticleLocale(a.language) === locale))
    .slice(0, limit);
}
