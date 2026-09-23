import { renderImpact001 } from './impact001.mjs';
import { renderPrivacy001 } from './privacy001.mjs';
import { ROUTES, pageForPath } from './routes.mjs';
import { EN, t } from './locales/en.mjs';
import { PRODUCTS, cartonFacts, money, number, referenceDate } from './model.mjs';
import { FACTORY_CLIPS, VIDEO_COPY } from './production.mjs';
import { escapeHtml, screenProtectorBreadcrumbs, renderScreenProtectorBreadcrumbs, renderScreenProtectorNextSteps } from './browsing.mjs';
import { productAlternates } from '../../lib/productLocalization.mjs';
import { phoneAlternates } from './localization.mjs';
import buyerEnglish from '../buyer-guides/locales/en.json' with { type: 'json' };
export { escapeHtml } from './browsing.mjs';

export const SITE_ORIGIN = 'https://www.ddnzglobal.com';
export const PREVIEW_ROBOTS = 'noindex, nofollow, noarchive';
export const PUBLIC_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
export const BRIEF_ROBOTS = 'noindex, nofollow, noarchive';
// Matches the production site's directory-index canonical convention.
export const screenProtectorCanonicalPath = pathname => ROUTES[pageForPath(pathname)]
  ? ROUTES[pageForPath(pathname)] + '/' : undefined;
const asset = file => `/screen-protector-media/assets/${file}`;
const media = file => `/screen-protector-media/media/${file}`;

export const SCREEN_PROTECTOR_SEO = Object.freeze({
  home: {
    title: 'Wholesale Screen Protectors from China | DDNZ Global',
    description: 'Source wholesale screen protectors from China. Compare four options, model minimums and retail packaging, then prepare your sourcing brief.',
    image: media('factory-fixture-poster.jpg'),
    imageAlt: 'Glass pieces on a production fixture, filmed by the DDNZ team',
  },
  products: {
    title: 'Compare Wholesale Screen Protectors & Prices | DDNZ Global',
    description: 'Compare OG28, 001 and Titan wholesale screen protectors by reference price, clear or privacy finish, installer, packaging, model minimums and carton size.',
    image: asset('001-kit-photo.jpg'),
    imageAlt: EN.guides.kit001,
  },
  guides: {
    title: 'Screen Protector Specifications & Buying Guides | DDNZ',
    description: 'Check screen protector specifications before a bulk order: glass shape, adhesive, packaging, installation and model fit. Build your sourcing checklist.',
    image: asset('curved-glass-cover-v1.png'),
    imageAlt: EN.comparisonCoverAlt,
  },
  prices: {
    title: 'Screen Protector Wholesale Price Differences | DDNZ Global',
    description: 'See why wholesale screen protector prices differ. Align glass, edges, optical finish, adhesive, packaging, quantities and delivery scope when comparing quotes.',
    image: asset('001-kit-photo.jpg'),
    imageAlt: EN.guides.kit001,
  },
  curves: {
    title: '2.5D vs 3D Screen Protectors: Shape & Fit | DDNZ Global',
    description: 'Check 2.5D and curved 3D screen protector specifications: glass shape, edge processes, case clearance and sample fit on your exact phone model.',
    image: asset('curved-glass-cover-v1.png'),
    imageAlt: EN.comparisonCoverAlt,
  },
  videos: {
    title: 'Screen Protector Factory Process Videos | DDNZ Global',
    description: 'Watch ten screen protector production stages filmed by DDNZ, plus installation and screen-viewing clips. Check which stages apply to your chosen product.',
    image: media('factory-cutting-poster.jpg'),
    imageAlt: FACTORY_CLIPS[0].description,
  },
  calculator: {
    title: 'Screen Protector Landed Cost Calculator: Istanbul | DDNZ',
    description: 'Estimate screen protector landed cost using the Istanbul reference. Set model quantities and packing, then compare sea and air freight for your brief.',
    image: asset('001-kit-photo.jpg'),
    imageAlt: EN.guides.kit001,
  },
  quote: {
    title: 'Review Your Screen Protector Sourcing Brief | DDNZ Global',
    description: 'Review phone cases, screen protectors, model quantities and specification checks. Add your actual destination and contact details to the combined enquiry.',
    image: asset('001-kit-photo.jpg'),
    imageAlt: EN.guides.kit001,
  },
});

export function screenProtectorMetadata(pathname, { preview = true } = {}) {
  const page = pageForPath(pathname);
  if (!page) throw new Error(`Unknown screen protector path: ${pathname}`);
  const metadata = SCREEN_PROTECTOR_SEO[page];
  return {
    ...metadata, page, path: ROUTES[page], canonical: SITE_ORIGIN + screenProtectorCanonicalPath(pathname),
    image: SITE_ORIGIN + metadata.image, language: 'en', type: 'website',
    alternateUrls: ['guides','prices','curves','videos','calculator'].includes(page) ? [...productAlternates(ROUTES[page]), {hrefLang:'x-default',href:'https://www.ddnzglobal.com'+ROUTES[page]+'/'}] : ['home', 'products'].includes(page) ? phoneAlternates(ROUTES[page]) : [],
    robots: preview ? PREVIEW_ROBOTS : page === 'quote' ? BRIEF_ROBOTS : PUBLIC_ROBOTS,
    indexable: !preview && page !== 'quote',
  };
}

export function applyScreenProtectorSEO(document, pathname, options) {
  const meta = screenProtectorMetadata(pathname, options);
  const replace = (attribute, key, value) => {
    document.head.querySelectorAll(`meta[${attribute}="${key}"]`).forEach(node => node.remove());
    const node = document.createElement('meta');
    node.setAttribute(attribute, key);
    node.content = value;
    document.head.appendChild(node);
  };
  document.title = meta.title;
  for (const [key, value] of Object.entries({
    title: meta.title, description: meta.description, robots: meta.robots,
    'twitter:card': 'summary_large_image', 'twitter:title': meta.title,
    'twitter:description': meta.description, 'twitter:image': meta.image,
    'twitter:image:alt': meta.imageAlt, 'twitter:url': meta.canonical,
  })) replace('name', key, value);
  for (const [key, value] of Object.entries({
    'og:type': meta.type, 'og:title': meta.title, 'og:description': meta.description,
    'og:url': meta.canonical, 'og:image': meta.image, 'og:image:alt': meta.imageAlt,
    'og:site_name': 'DDNZ Global', 'og:locale': 'en_US',
  })) replace('property', key, value);
  document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang], meta[name="keywords"], meta[property^="article:"]').forEach(node => node.remove());
  const canonical = document.createElement('link');
  canonical.rel = 'canonical';
  canonical.href = meta.canonical;
  document.head.appendChild(canonical);
  for (const alternate of meta.alternateUrls) {
    const node = document.createElement('link');
    node.rel = 'alternate'; node.hreflang = alternate.hrefLang; node.href = alternate.href;
    document.head.appendChild(node);
  }
  // Replace the static phone schema on SPA navigation; remove it on the private brief.
  document.head.querySelectorAll('script[data-screen-protector-schema], #schema-jsonld-static-page, #schema-jsonld-static-home, #schema-jsonld-static-blog').forEach(node => node.remove());
  const schema = screenProtectorSchema(meta.page, options?.breadcrumbs);
  if (schema) {
    const node = document.createElement('script');
    node.type = 'application/ld+json';
    node.setAttribute('data-screen-protector-schema', '');
    node.textContent = JSON.stringify(schema);
    document.head.appendChild(node);
  }
}

export function screenProtectorSchema(page, breadcrumbs) {
  if (page === 'quote') return null;
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: screenProtectorBreadcrumbs(page, breadcrumbs).map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.name, item: SITE_ORIGIN + item.href,
    })),
  };
}

export function removeScreenProtectorSchema(document) {
  document.head.querySelectorAll('script[data-screen-protector-schema]').forEach(node => node.remove());
}

function renderEnglishPhoneBuyerLinks(page) {
  if (!['home', 'products'].includes(page)) return '';
  const entries = [['phone-stores', '/screen-protectors/wholesale-for-stores/'], ['private-label', '/screen-protectors/private-label/']];
  return `<section class="buyer-links" lang="en" dir="ltr" aria-label="${escapeHtml(buyerEnglish.entryTitle)}"><h2>${escapeHtml(buyerEnglish.entryTitle)}</h2><p>${escapeHtml(buyerEnglish.entryIntro)}</p><div class="buyer-links-grid">${entries.map(([id, href]) => {
    const copy = buyerEnglish.guides[id];
    return `<a class="buyer-link-card" href="${href}"><div><h3>${escapeHtml(copy.card)}</h3><p>${escapeHtml(copy.cardCopy)}</p><span>${escapeHtml(buyerEnglish.open)}</span></div></a>`;
  }).join('')}</div></section>`;
}
const paragraph = value => `<p>${escapeHtml(value)}</p>`;
const heading = (title, intro) => `<h1>${escapeHtml(title).replaceAll('\n', '<br>')}</h1>${paragraph(intro)}`;
const section = (title, body) => `<section><h2>${escapeHtml(title)}</h2>${body}</section>`;
const list = items => `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
const link = (page, label = EN.pages[page]) => `<a href="${screenProtectorCanonicalPath(ROUTES[page])}">${escapeHtml(label)}</a>`;
const image = (src, alt) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy">`;
const pairs = rows => rows.map(([title, body]) => section(title, paragraph(body))).join('');
const clip = c => `<figure id="${escapeHtml(c.id)}">${image(media(c.poster + '.jpg'), c.title)}<figcaption><h3>${escapeHtml(c.title)}</h3>${paragraph(c.description)}${c.check ? paragraph(c.check) : ''}<p><a href="${media(c.file + '.mp4')}">Watch ${escapeHtml(c.title)} (${c.duration} seconds)</a></p></figcaption></figure>`;
const guideLinks = () => section(EN.guides.priceTitle.replaceAll('\n', ' '), paragraph(EN.guides.priceDesc) + link('prices')) + section(EN.guides.curveTitle.replaceAll('\n', ' '), paragraph(EN.guides.curveDesc) + link('curves'));
const checks = ids => section(EN.guides.checksTitle, list(ids.map(id => EN.requests[id])));
const productSummary = () => Object.entries(PRODUCTS).map(([id, product]) => section(EN.product.names[id],
  image(asset(product.image), EN.product.names[id]) + paragraph(`${money(product.price)} / piece. ${EN.product.notes[id]}`)
  + paragraph(`${EN.product.box}: ${number(product.unitsPerCarton)}. ${EN.product.dimensions}: ${product.cartonCm.join(' × ')} cm. ${EN.product.weight}: ${number(cartonFacts(product).fullKg, 3)} kg.`)
  + paragraph(EN.product.packing[id]))).join('');

// This is visible fallback content, replaced by the existing React entry on load.
// It reads public copy and product data only, never sessionStorage or an enquiry draft.
export function renderScreenProtectorBody(page) {
  if (!Object.hasOwn(ROUTES, page)) throw new Error(`Unknown screen protector page: ${page}`);
  let body;
  if (page === 'home') body = heading(EN.home.title, EN.home.intro)
    + paragraph(EN.home.offersBody) + section(EN.home.videoLabel, paragraph(EN.home.credit) + paragraph(EN.home.transcript) + link('videos', VIDEO_COPY.watch))
    + EN.home.journey.map(([, title, description, target]) => section(title, paragraph(description) + link(target))).join('')
    + guideLinks() + section(EN.home.offersTitle, productSummary())
    + section(EN.home.planTitle, paragraph(EN.home.planBody) + link('calculator'));
  if (page === 'products') body = heading(EN.product.title, EN.product.intro) + paragraph(EN.home.offersBody)
    + productSummary() + renderPrivacy001() + paragraph(EN.product.detailNote) + paragraph(EN.product.priceNote) + link('calculator');
  if (page === 'guides') body = heading(EN.guides.title, EN.guides.intro) + guideLinks() + checks(Object.keys(EN.requests)) + link('quote');
  if (page === 'prices') body = heading(EN.guides.priceTitle, EN.guides.priceIntro)
    + section(EN.guides.factorsTitle, pairs(EN.guides.factors))
    + section(EN.guides.configuration, image(asset('001-kit-photo.jpg'), EN.guides.kit001) + image(asset('titan-kit.jpg'), EN.guides.kitTitan))
    + section(EN.guides.actions, EN.media.clips.slice(0, 2).map(clip).join(''))
    + paragraph(EN.guides.sampleAdvice) + section(EN.guides.observing, paragraph(EN.guides.observation) + clip(EN.media.clips[2]))
    + checks(['material', 'edge', 'optical', 'adhesive', 'kit', 'repeat']) + link('products') + ' · ' + link('curves');
  if (page === 'curves') body = heading(EN.guides.curveTitle, EN.guides.curveIntro)
    + section(EN.guides.shapeTitle, image(asset('curved-glass-cover-v1.png'), EN.comparisonCoverAlt)
      + pairs([[EN.guides.flatTitle, EN.guides.flatBody], [EN.guides.curvedTitle, EN.guides.curvedBody]]) + paragraph(EN.guides.diagramNote))
    + section(EN.guides.processTitle, pairs(EN.guides.processes))
    + `<section id="factory-scenes"><h2>${escapeHtml(EN.guides.factoryTitle)}</h2>${paragraph(EN.factoryCredit)}${paragraph(EN.guides.factoryIntro)}${link('videos', VIDEO_COPY.watch)}${EN.media.clips.slice(3).map(clip).join('')}</section>`
    + section(EN.guides.fitTitle, paragraph(EN.guides.fitBody)) + checks(['phone', 'case', 'touch', 'forming', 'sample']) + link('products');
  if (page === 'videos') body = renderImpact001() + heading(VIDEO_COPY.title, VIDEO_COPY.intro) + paragraph(VIDEO_COPY.scope)
    + section(VIDEO_COPY.nav, FACTORY_CLIPS.map(clip).join(''))
    + section(VIDEO_COPY.installation, paragraph(VIDEO_COPY.installIntro) + EN.media.clips.slice(0, 3).map(clip).join('')) + link('guides');
  if (page === 'calculator') body = heading(EN.calc.title, EN.calc.intro) + paragraph(t('calc.basis', { date: referenceDate }))
    + section(EN.calc.mix, paragraph(EN.home.planBody) + paragraph(EN.calc.presetNote) + link('products'))
    + section(EN.calc.pack, paragraph(EN.calc.notMix) + ['formulaCbm', 'formulaDim', 'formulaBill', 'formulaSea'].map(key => paragraph(EN.calc[key])).join(''))
    + section(EN.calc.scopeTitle, ['scope', 'timing', 'limits', 'classification'].map(key => paragraph(EN.calc[key])).join(''))
    + section(EN.calc.optional, paragraph(EN.calc.salesNote))
    + paragraph('Enable JavaScript to enter phone models, calculate your product mix and save a sourcing brief.');
  if (page === 'quote') body = heading(EN.quote.title, EN.quote.intro) + section(EN.quote.confirmTitle, list(EN.quote.confirm))
    + paragraph('Your plan stays in this browser tab. Enable JavaScript to review it. Nothing is sent until you submit the enquiry.') + link('calculator');
  const nav = ['home', 'products', 'guides', 'videos', 'calculator'].map(target => link(target)).join(' · ');
  return `<div class="phone-film" lang="en" dir="ltr" data-static-fallback="screen-protectors"><nav aria-label="Screen protector navigation">${nav}</nav><main id="main">${renderScreenProtectorBreadcrumbs(page)}${body}${renderScreenProtectorNextSteps(page)}</main></div>${renderEnglishPhoneBuyerLinks(page)}`;
}

export function renderScreenProtectorHead(pathname, options) {
  const m = screenProtectorMetadata(pathname, options);
  const named = { title: m.title, description: m.description, robots: m.robots, 'twitter:card': 'summary_large_image', 'twitter:title': m.title, 'twitter:description': m.description, 'twitter:image': m.image, 'twitter:image:alt': m.imageAlt, 'twitter:url': m.canonical };
  const properties = { 'og:type': m.type, 'og:title': m.title, 'og:description': m.description, 'og:url': m.canonical, 'og:image': m.image, 'og:image:alt': m.imageAlt, 'og:site_name': 'DDNZ Global', 'og:locale': 'en_US' };
  return `<title>${escapeHtml(m.title)}</title>\n<link rel="canonical" href="${m.canonical}">\n`
    + m.alternateUrls.map(item => `<link rel="alternate" hreflang="${item.hrefLang}" href="${escapeHtml(item.href)}">`).join('\n') + '\n'
    + Object.entries(named).map(([name, content]) => `<meta name="${name}" content="${escapeHtml(content)}">`).join('\n') + '\n'
    + Object.entries(properties).map(([property, content]) => `<meta property="${property}" content="${escapeHtml(content)}">`).join('\n')
    + (screenProtectorSchema(m.page) ? `\n<script type="application/ld+json" data-screen-protector-schema>${JSON.stringify(screenProtectorSchema(m.page)).replaceAll('<', '\\u003c')}</script>` : '');
}

export function appendScreenProtectorSitemap(xml) {
  if (!/<urlset\b/.test(xml) || !/<\/urlset>\s*$/.test(xml) || /<sitemapindex\b/.test(xml)) throw new Error('Expected an existing URL-set sitemap; preserve and merge the correct sitemap file.');
  const existing = new Set([...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(match => match[1].replace(/\/$/, '')));
  const additions = Object.entries(ROUTES).filter(([page, path]) => page !== 'quote' && !existing.has(SITE_ORIGIN + path))
    .map(([page, path]) => {
      const alternates = page!=='quote' ? phoneAlternates(path) : [];
      return `  <url><loc>${SITE_ORIGIN + screenProtectorCanonicalPath(path)}</loc>${alternates.map(item => `<xhtml:link rel="alternate" hreflang="${item.hrefLang}" href="${escapeHtml(item.href)}" />`).join('')}</url>`;
    });
  if (!additions.length) return xml;
  const withNamespace = additions.some(node => node.includes('<xhtml:link')) && !/xmlns:xhtml=/.test(xml)
    ? xml.replace(/<urlset\b/, '<urlset xmlns:xhtml="http://www.w3.org/1999/xhtml"') : xml;
  return withNamespace.replace(/<\/urlset>/, additions.join('\n') + '\n</urlset>');
}
