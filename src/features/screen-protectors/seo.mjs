import { ROUTES, CATEGORY_PATH, pageForPath } from './routes.mjs';
import { EN, t } from './locales/en.mjs';
import { PRODUCTS, cartonFacts, money, number, referenceDate } from './model.mjs';
import { FACTORY_CLIPS, VIDEO_COPY } from './production.mjs';

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
    title: 'Screen Protectors from China: Compare & Plan | DDNZ Global',
    description: 'Compare four screen protector options, watch factory footage and plan product quantities, packaging and all-inclusive delivery to Istanbul.',
    image: media('factory-fixture-poster.jpg'),
    imageAlt: 'Glass pieces on a production fixture, filmed by the DDNZ team',
  },
  products: {
    title: 'Compare Screen Protectors, Prices & Packaging | DDNZ Global',
    description: 'Compare OG28, 001 and Titan clear or privacy screen protectors by price, installer, retail packaging, model minimums and carton specifications.',
    image: asset('001-kit-photo.jpg'),
    imageAlt: EN.guides.kit001,
  },
  guides: {
    title: 'Screen Protector Buying Guides & Checks | DDNZ Global',
    description: 'Understand screen protector quote differences, 2.5D and 3D profiles, installation and model fit. Build a practical procurement checklist.',
    image: asset('curved-glass-cover-v1.png'),
    imageAlt: EN.comparisonCoverAlt,
  },
  prices: {
    title: 'Why Screen Protector Quotes Differ | DDNZ Global',
    description: 'Compare six specification groups behind screen protector prices: glass, edges, optical finish, adhesive, packaging, quantity and delivery scope.',
    image: asset('001-kit-photo.jpg'),
    imageAlt: EN.guides.kit001,
  },
  curves: {
    title: '2.5D vs 3D Screen Protectors: Shape & Fit | DDNZ Global',
    description: 'Separate glass shape, hot bending, machining and bonding. Check screen coverage, case clearance and fit on the exact phone model.',
    image: asset('curved-glass-cover-v1.png'),
    imageAlt: EN.comparisonCoverAlt,
  },
  videos: {
    title: 'Screen Protector Factory Process Videos | DDNZ Global',
    description: 'Watch ten screen protector production stages filmed by the DDNZ team, plus installation clips, with practical questions to ask before ordering.',
    image: media('factory-cutting-poster.jpg'),
    imageAlt: FACTORY_CLIPS[0].description,
  },
  calculator: {
    title: 'Screen Protector Landed-Cost Planner: Istanbul | DDNZ Global',
    description: 'Plan screen protector quantities and cartons. Compare sea and air freight to Istanbul using gross weight, dimensional weight and delivery scope.',
    image: asset('001-kit-photo.jpg'),
    imageAlt: EN.guides.kit001,
  },
  quote: {
    title: 'Review Your Screen Protector Sourcing Brief | DDNZ Global',
    description: 'Review your selected products, phone models, quantities, delivery route and procurement checks before adding contact details to your enquiry.',
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
  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';
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
}

export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const paragraph = value => `<p>${escapeHtml(value)}</p>`;
const heading = (title, intro) => `<h1>${escapeHtml(title).replaceAll('\n', '<br>')}</h1>${paragraph(intro)}`;
const section = (title, body) => `<section><h2>${escapeHtml(title)}</h2>${body}</section>`;
const list = items => `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
const link = (page, label = EN.pages[page]) => `<a href="${screenProtectorCanonicalPath(ROUTES[page])}">${escapeHtml(label)}</a>`;
const image = (src, alt) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy">`;
const pairs = rows => rows.map(([title, body]) => section(title, paragraph(body))).join('');
const clip = c => `<figure>${image(media(c.poster + '.jpg'), c.title)}<figcaption><h3>${escapeHtml(c.title)}</h3>${paragraph(c.description)}${c.check ? paragraph(c.check) : ''}<p><a href="${media(c.file + '.mp4')}">Watch the ${c.duration}-second clip</a></p></figcaption></figure>`;
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
    + productSummary() + paragraph(EN.product.detailNote) + paragraph(EN.product.priceNote) + link('calculator');
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
  if (page === 'videos') body = heading(VIDEO_COPY.title, VIDEO_COPY.intro) + paragraph(VIDEO_COPY.scope)
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
  return `<div class="phone-film" data-static-fallback="screen-protectors"><nav aria-label="Screen protector navigation">${nav}</nav><main id="main"><p><a href="${CATEGORY_PATH}/">Mobile accessories</a> / ${escapeHtml(EN.pages[page])}</p>${body}</main></div>`;
}

export function renderScreenProtectorHead(pathname, options) {
  const m = screenProtectorMetadata(pathname, options);
  const named = { title: m.title, description: m.description, robots: m.robots, 'twitter:card': 'summary_large_image', 'twitter:title': m.title, 'twitter:description': m.description, 'twitter:image': m.image, 'twitter:image:alt': m.imageAlt, 'twitter:url': m.canonical };
  const properties = { 'og:type': m.type, 'og:title': m.title, 'og:description': m.description, 'og:url': m.canonical, 'og:image': m.image, 'og:image:alt': m.imageAlt, 'og:site_name': 'DDNZ Global', 'og:locale': 'en_US' };
  return `<title>${escapeHtml(m.title)}</title>\n<link rel="canonical" href="${m.canonical}">\n`
    + Object.entries(named).map(([name, content]) => `<meta name="${name}" content="${escapeHtml(content)}">`).join('\n') + '\n'
    + Object.entries(properties).map(([property, content]) => `<meta property="${property}" content="${escapeHtml(content)}">`).join('\n');
}

export function appendScreenProtectorSitemap(xml) {
  if (!/<urlset\b/.test(xml) || !/<\/urlset>\s*$/.test(xml) || /<sitemapindex\b/.test(xml)) throw new Error('Expected an existing URL-set sitemap; preserve and merge the correct sitemap file.');
  const existing = new Set([...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(match => match[1].replace(/\/$/, '')));
  const additions = Object.entries(ROUTES).filter(([page, path]) => page !== 'quote' && !existing.has(SITE_ORIGIN + path))
    .map(([, path]) => `  <url><loc>${SITE_ORIGIN + screenProtectorCanonicalPath(path)}</loc></url>`);
  return additions.length ? xml.replace(/<\/urlset>/, additions.join('\n') + '\n</urlset>') : xml;
}
