import { ROUTES, CATEGORY_PATH } from './routes.mjs';
import { EN } from './locales/en.mjs';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const pageHref = page => ROUTES[page] + '/';

// One hierarchy for the visible page, static fallback and BreadcrumbList.
export function screenProtectorBreadcrumbs(page, { homeHref = '/', homeLabel = 'Home', homeLanguage = 'en' } = {}) {
  if (!Object.hasOwn(ROUTES, page)) throw new Error(`Unknown screen protector page: ${page}`);
  const trail = [{ name: homeLabel, href: homeHref, language: homeLanguage }, { name: 'Mobile accessories', href: CATEGORY_PATH + '/' }];
  trail.push({ name: EN.pages.home, href: pageHref('home') });
  if (['prices', 'curves'].includes(page)) trail.push({ name: EN.pages.guides, href: pageHref('guides') });
  if (page !== 'home') trail.push({ name: EN.pages[page], href: pageHref(page) });
  return trail;
}

export function renderScreenProtectorBreadcrumbs(page, options) {
  const trail = screenProtectorBreadcrumbs(page, options);
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${trail.map((item, index) => `<li>${index === trail.length - 1 ? `<span aria-current="page">${escapeHtml(item.name)}</span>` : `<a href="${escapeHtml(item.href)}"${item.language ? ` lang="${escapeHtml(item.language)}" dir="auto"` : ''}>${escapeHtml(item.name)}</a>`}</li>`).join('')}</ol></nav>`;
}

const compare = ['products', 'Compare products and prices', 'Check clear and privacy options, packaging, model minimums and carton specifications.'];
const prices = ['prices', 'See why prices differ', 'Align materials, adhesive, installation tools and delivery scope before comparing quotes.'];
const guides = ['guides', 'Build your specification checklist', 'Review the buying guides and add the checks that matter to your sourcing brief.'];
const curves = ['curves', 'Check 2.5D vs 3D glass', 'Check the glass profile, case clearance and sample fit on your exact phone models.'];
const videos = ['videos', 'Watch factory process videos', 'See the production stages and what to confirm for your chosen product.'];
const calculator = ['calculator', 'Estimate landed cost: Istanbul reference', 'Enter your model mix and compare sea and air delivery to Istanbul. Other destinations need a separate quote.'];
const quote = ['quote', 'Review your sourcing brief', 'Check your models, quantities, Istanbul reference shipment and specifications before continuing to the enquiry form.'];

export const SCREEN_PROTECTOR_NEXT_STEPS = Object.freeze({
  home: [compare, videos, calculator],
  products: [prices, curves, calculator, quote],
  guides: [compare, videos, quote],
  prices: [compare, curves, calculator, quote],
  curves: [compare, videos, quote],
  videos: [curves, guides, compare],
  calculator: [compare, prices, quote],
  quote: [calculator, compare, guides],
});

export function renderScreenProtectorNextSteps(page) {
  return `<section class="sourcing-next-steps" aria-labelledby="next-steps-${page}"><h2 id="next-steps-${page}">${page === 'quote' ? 'Review the details behind your request' : 'Continue your screen protector sourcing'}</h2><ul>${SCREEN_PROTECTOR_NEXT_STEPS[page].map(([target, label, description]) => `<li><a href="${pageHref(target)}">${escapeHtml(label)} <span aria-hidden="true">→</span></a><p>${escapeHtml(description)}</p></li>`).join('')}</ul><p class="category-return">Building a wider product range? <a href="${CATEGORY_PATH}/">Explore mobile accessories sourcing from China</a>.</p></section>`;
}

// Leave new tabs, named targets, downloads and modified clicks to the browser.
export function isPlainAnchorClick(event, anchor) {
  return Boolean(anchor) && !event.defaultPrevented && event.button === 0
    && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
    && (!anchor.target || anchor.target.toLowerCase() === '_self') && !anchor.hasAttribute('download');
}
