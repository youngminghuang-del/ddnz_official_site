export const privacyArticleSlug = 'top-10-privacy-screen-protector-manufacturers-china';
export const privacyArticleSeo = {
  title: 'Top 10 Privacy Screen Protector Makers in China | DDNZ',
  description: 'Compare 10 Chinese privacy screen protector manufacturers for wholesale and OEM orders. Check model fit, viewing angles and packaging before sampling.',
};

export function addPrivacyComparisonLink(slug: string | undefined, html: string) {
  if (slug !== privacyArticleSlug || html.includes('href="/screen-protectors/compare/"')) return html;
  const nextSection = '<h2 id="wholesale-and-oem-questions">';
  const comparisonLink = '<p>Ready to compare buying terms? <a class="inline-block" href="/screen-protectors/compare/">Compare screen protector prices, packaging and minimum orders</a>.</p>';
  return html.replace(nextSection, comparisonLink + nextSection);
}
