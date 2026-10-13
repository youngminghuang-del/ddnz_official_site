import formHtml from '../src/data/privacyWorksheetForm.json';
export const privacyArticleSlug = 'top-10-privacy-screen-protector-manufacturers-china';
export function preparePrivacyArticle(slug: string, html: string) {
  if (slug !== privacyArticleSlug) return html;
  return html.replace('<p>DDNZ_PRIVACY_WORKSHEET</p>', formHtml)
    .replace(/<h2 id="[^"]+">(\d+)\. /g, '<h2 id="supplier-$1">$1. ');
}
