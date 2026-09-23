import { phoneCopy, localizedPhonePath, phoneAlternates, LOCALIZED_SCREEN_PROTECTOR_ROUTES } from './localization.mjs';
import { escapeHtml } from './browsing.mjs';
export { LOCALIZED_SCREEN_PROTECTOR_ROUTES };

export function localizedScreenProtectorMetadata(locale, page = 'home', { preview = false } = {}) {
  const copy = phoneCopy(locale);
  const path = localizedPhonePath(locale, page);
  const canonical = `https://www.ddnzglobal.com${path}`;
  const trail = [{ name: copy.home, item: `https://www.ddnzglobal.com/${locale==='zh' || locale==='zh-cn'?'zh-cn':locale}/` }, { name: copy.section, item: `https://www.ddnzglobal.com${localizedPhonePath(locale)}` }];
  if (page === 'compare') trail.push({ name: copy.compare, item: canonical });
  return {
    ...copy.seo[page], locale, language: locale, dir: copy.direction, page, path, canonical, type: 'website',
    image: 'https://www.ddnzglobal.com/screen-protector-media/assets/001-kit-photo.jpg', imageAlt: copy.imageAlt,
    robots: preview ? 'noindex, nofollow, noarchive' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    indexable: !preview, alternateUrls: phoneAlternates(path),
    schema: { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: trail.map((item, i) => ({ '@type': 'ListItem', position: i + 1, ...item })) },
  };
}

function metadataEntries(meta) {
  return {
    named: { title: meta.title, description: meta.description, robots: meta.robots, 'twitter:card': 'summary_large_image', 'twitter:title': meta.title, 'twitter:description': meta.description, 'twitter:image': meta.image, 'twitter:image:alt': meta.imageAlt, 'twitter:url': meta.canonical },
    properties: { 'og:type': 'website', 'og:title': meta.title, 'og:description': meta.description, 'og:url': meta.canonical, 'og:image': meta.image, 'og:image:alt': meta.imageAlt, 'og:site_name': 'DDNZ Global', 'og:locale': ({zh:'zh_CN','zh-cn':'zh_CN',ar:'ar_AR',es:'es_ES',ru:'ru_RU',fr:'fr_FR',pt:'pt_BR',tr:'tr_TR'})[meta.locale] },
  };
}
export function renderLocalizedScreenProtectorHead(locale, page = 'home', options = {}) {
  const meta = localizedScreenProtectorMetadata(locale, page, options), entries = metadataEntries(meta);
  return `<title>${escapeHtml(meta.title)}</title>\n<link rel="canonical" href="${escapeHtml(meta.canonical)}">\n`
    + meta.alternateUrls.map(item => `<link rel="alternate" hreflang="${item.hrefLang}" href="${escapeHtml(item.href)}">`).join('\n') + '\n'
    + Object.entries(entries.named).map(([name, content]) => `<meta name="${name}" content="${escapeHtml(content)}">`).join('\n') + '\n'
    + Object.entries(entries.properties).map(([property, content]) => `<meta property="${property}" content="${escapeHtml(content)}">`).join('\n')
    + `\n<script type="application/ld+json" data-screen-protector-schema>${JSON.stringify(meta.schema).replaceAll('<', '\\u003c')}</script>`;
}
export function applyLocalizedScreenProtectorSEO(document, locale, page, options = {}) {
  const meta = localizedScreenProtectorMetadata(locale, page, options), entries = metadataEntries(meta);
  document.title = meta.title;
  document.documentElement.lang = locale;
  document.documentElement.dir = meta.dir;
  for (const [attribute, values] of [['name', entries.named], ['property', entries.properties]]) {
    for (const [key, value] of Object.entries(values)) {
      document.head.querySelectorAll(`meta[${attribute}="${key}"]`).forEach(node => node.remove());
      const node = document.createElement('meta'); node.setAttribute(attribute, key); node.content = value; document.head.appendChild(node);
    }
  }
  document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang], meta[name="keywords"], meta[property^="article:"], script[data-screen-protector-schema], #schema-jsonld-static-page, #schema-jsonld-static-home, #schema-jsonld-static-blog').forEach(node => node.remove());
  const canonical = document.createElement('link'); canonical.rel = 'canonical'; canonical.href = meta.canonical; document.head.appendChild(canonical);
  for (const alternate of meta.alternateUrls) {
    const node = document.createElement('link'); node.rel = 'alternate'; node.hreflang = alternate.hrefLang; node.href = alternate.href; document.head.appendChild(node);
  }
  const schema = document.createElement('script'); schema.type = 'application/ld+json'; schema.setAttribute('data-screen-protector-schema', ''); schema.textContent = JSON.stringify(meta.schema); document.head.appendChild(schema);
}
