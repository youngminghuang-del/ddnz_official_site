// Apply reviewed publication dates without rewriting unrelated sitemap nodes.
export function applyContentLastmod(xml, pages) {
  for (const [route, date] of Object.entries(pages)) {
    if (!route.startsWith('/') || !/^\d{4}-\d{2}-\d{2}$/.test(date)
        || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) {
      throw new Error(`Invalid content update: ${route} ${date}`);
    }
  }
  const found = new Set();
  const result = xml.replace(/<url>[\s\S]*?<\/url>/g, node => {
    const loc = node.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) return node;
    const url = new URL(loc);
    if (url.origin !== 'https://www.ddnzglobal.com') return node;
    const date = pages[url.pathname];
    if (!date) return node;
    if (found.has(url.pathname)) throw new Error(`Duplicate sitemap route: ${url.pathname}`);
    found.add(url.pathname);
    const previous = node.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    // A later CMS publication supersedes the historical correction ledger.
    if (previous && Date.parse(previous) >= Date.parse(date)) return node;
    return previous ? node.replace(/<lastmod>[^<]+<\/lastmod>/, `<lastmod>${date}</lastmod>`)
      : node.replace('</loc>', `</loc><lastmod>${date}</lastmod>`);
  });
  for (const route of Object.keys(pages)) {
    if (!found.has(route)) throw new Error(`Content update absent from sitemap: ${route}`);
  }
  return result;
}
