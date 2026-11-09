export const privacyArticleSlug = 'top-10-privacy-screen-protector-manufacturers-china';
export const privacyArticleSeo = {
  title: 'Top 10 Privacy Screen Protector Makers in China | DDNZ',
  description: 'Compare 10 privacy screen protector manufacturers in China. Explore DDNZ factory supply, model fit, privacy samples and packaging for wholesale orders.',
};

export function addPrivacyComparisonLink(slug: string | undefined, html: string) {
  if (slug !== privacyArticleSlug || html.includes('href="/screen-protectors/compare/"')) return html;
  const nextSection = '<h2 id="wholesale-and-oem-questions">';
  const comparisonLink = '<p>Ready to compare buying terms? <a class="inline-block" href="/screen-protectors/compare/">Compare screen protector prices, packaging and minimum orders</a>.</p>';
  return html.replace(nextSection, comparisonLink + nextSection);
}

// Keep the preview's article body, visible summary, TOC and schema description
// consistent without writing to the published Notion page.
export function positionPrivacyPost<T extends import('../types/content').BlogPost | null | undefined>(post: T): T {
  if (!post || post.slug !== privacyArticleSlug) return post;
  let content = post.content || '';
  const alreadyPositioned = content.includes('id="ddnz-factory-order"');
  const scope = '<p id="ddnz-factory-order"><strong>DDNZ is a China manufacturer and exporter with own-factory production and complementary product supply.</strong> Request a factory quote for your screen protector order, with manufacturing scope, model quantities, samples and packaging confirmed for each reference. Complementary accessories are identified separately in the quotation. HB handles the agreed freight scope.</p>';
  content = content.replace(/<p>(?:(?!<\/p>)[\s\S])*?DDNZ can build on(?:(?!<\/p>)[\s\S])*?<\/p>/, scope);
  content = content.replace('Ask DDNZ to compare suppliers for my order', 'Prepare my privacy-glass order requirements');
  const start = content.indexOf('<h2 id="what-does-a-china-sourcing-agent-add-to-this-shortlist">');
  const end = content.indexOf('<h2 id="compare-privacy-samples-on-the-same-phone">', start);
  if (start >= 0 && end > start && !alreadyPositioned) {
    const section = content.slice(start, end);
    const warehouse = section.match(/<figure[\s\S]*?<\/figure>/)?.[0] || '';
    content = content.slice(0, start) + '<h2 id="what-does-a-china-sourcing-agent-add-to-this-shortlist">Order from DDNZ: factory manufacturing and complementary supply</h2>'
      + '<p>DDNZ combines manufacturing and export delivery for wholesale buyers and own-brand orders. Start with our screen protector range; keep any complementary cases, straps or charging accessories on separate order lines. The quotation identifies factory-made references, manufacturing scope and complementary supply for the selected models.</p>'
      + '<p>Send the exact phone models, privacy finish, quantity per model, logo or packaging requirements and destination. Confirm the product and packaging minimums separately, approve the sample, and agree the checks for fit, viewing direction, appearance and pack contents before production.</p>'
      + '<figure class="article-figure"><img src="/screen-protector-media/media/factory-inspection-poster.jpg" width="1280" height="720" loading="lazy" alt="Manual handling and sorting shown in DDNZ team production footage"/><figcaption>Manual handling and sorting in existing DDNZ team footage. Confirm the actual inspection criteria and manufacturing route for your chosen product.</figcaption></figure>'
      + '<p><a href="/screen-protectors/videos/">Watch the screen protector production stages</a> · <a href="/screen-protectors/brief/">Request a DDNZ factory quote</a></p>'
      + warehouse + '<p><em>DDNZ-supplied warehouse photograph showing organized stock. Storage does not establish the manufacturing origin of every item.</em></p>'
      + '<p>DDNZ confirms the products and export packing for the order; Heaven Born executes the agreed freight scope. The ten-company shortlist above remains a separate guide to published supplier ranges.</p>' + content.slice(end);
  }
  content = content.replace(/<p>Mietubl, Anpaison, AiFeng, Dzcolors, Ouye, iPecks, Medas and Cacky have worked with HB on export freight\.(?:(?!<\/p>)[\s\S])*?<\/p>/,
    '<p>Send DDNZ the phone models, quantities, privacy finish, packaging requirements and destination for a factory quotation. Our quote distinguishes the selected factory-made products from complementary items and confirms samples, minimums and export packing. HB handles the agreed transport scope.</p>');
  content = content.replace(/<p><a href="https:\/\/wa\.me\/[^\"]+"[^>]*>Send your buying brief to DDNZ<\/a><\/p>/,
    '<p><a href="/screen-protectors/brief/">Request a DDNZ factory quote</a></p>');
  content = content.replace('Get the free privacy-glass supplier worksheet', 'Prepare your privacy-glass order worksheet')
    .replace('Ten suppliers, comparable quotation fields and sample-check notes.', 'Product specifications, model quantities, packaging and sample-check notes.')
    .replace('please%20help%20compare%20privacy%20glass%20suppliers.', 'please%20quote%20my%20privacy%20glass%20order.');
  return {...post, content, summary: privacyArticleSeo.description,
    toc: post.toc?.map(item => item.id === 'what-does-a-china-sourcing-agent-add-to-this-shortlist'
      ? {...item, text:'Order from DDNZ: manufacturing and complementary supply'} : item),
  } as T;
}
