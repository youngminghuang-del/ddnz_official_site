export const alibabaArticleSlug = 'top-10-screen-protector-manufacturers-alibaba';
export const alibabaArticleDescription = 'Compare 10 Alibaba suppliers for wholesale screen protectors. Check minimum orders by phone model, what each pack includes and how well samples fit.';

export function addAlibabaBuyingGuidance(slug: string | undefined, html: string) {
  if (slug !== alibabaArticleSlug) return html;

  const shortlistHeading = '<h2 id="the-shortlist">';
  const comparisonPath = '/screen-protectors/compare/';
  const comparisonLink = `<p><a href="${comparisonPath}">Compare wholesale screen protectors by material, MOQ and packaging</a>.</p>`;
  if (!html.includes(`href="${comparisonPath}"`)) {
    html = html.replace(shortlistHeading, comparisonLink + shortlistHeading);
  }

  if (html.includes('id="custom-screen-protector-rfq"')) return html;

  const enquiryHeading = '<h2 id="start-with-three-enquiries">';
  const questionsHeading = '<h2 id="questions-buyers-ask">';
  if (!html.includes(enquiryHeading) || !html.includes(questionsHeading)) return html;

  const checklist = '<h3 id="custom-screen-protector-rfq">What to include in a custom screen protector RFQ</h3><p>Send the same brief to each supplier so you can compare quotes on the same basis.</p><ul><li>List the exact device models, material and finish you need.</li><li>Specify the quantity per model and ask for the minimum order per model.</li><li>Describe the retail packaging, logo and accessories required.</li><li>Agree on sample acceptance checks for fit, touch response and appearance before placing a bulk order.</li></ul>';
  const privacyLink = '<p>For a privacy finish, <a class="inline-block" href="/blog/top-10-privacy-screen-protector-manufacturers-china/">compare privacy screen protector manufacturers and sample checks</a>.</p>';
  return html.replace(enquiryHeading, checklist + enquiryHeading).replace(questionsHeading, privacyLink + questionsHeading);
}
