import {bearProducts,bearCopy} from '../mobile-sourcing/bear-glass.mjs';
import {privacyOFold} from '../mobile-sourcing/privacy-o-fold.mjs';
import { privacyCopy } from '../mobile-sourcing/privacy28.mjs';
import { localizedProduct, localizedPhonePath } from './localization.mjs';
import { EN } from './locales/en.mjs';

// Use the same public model names and destinations in the React and static entries.
export function filmHeroConfig(locale = 'en') {
  const lang = locale === 'zh-cn' ? 'zh' : locale;
  const name = id => lang === 'en' ? EN.product.names[id] : localizedProduct(lang, id).name;
  const compare = lang === 'en' ? '/screen-protectors/compare/' : localizedPhonePath(lang, 'compare');
  const target = id => compare + (lang === 'en' ? '#film-product-' : '#phone-product-') + id;
  return {
    src: bearProducts[0].image,
    alt: bearProducts[0].name[lang],
    language: lang,
    items: [
      {src:bearProducts[1].image,label:bearCopy[lang][14],href:'#bear-glass'},
      { src: privacyOFold.image, label: privacyOFold.name[lang], href: '#privacy-o-fold' },
      { src: '/screen-protector-media/assets/titan-kit.jpg', label: name('titan-hd'), href: target('titan-hd') },
    ],
  };
}

const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
// The English screen-protector controller renders HTML rather than React.
export function renderEnglishFilmHeroMedia() {
  const c = filmHeroConfig();
  return `<div class="catalogue-hero-media"><div class="catalogue-hero-stage"><img src="${c.src}" alt="${escape(c.alt)}" width="1200" height="900" fetchpriority="high"></div><div class="catalogue-hero-rail"><p class="catalogue-hero-rail-title">Explore models &amp; details<span aria-hidden="true">↘</span></p><div class="catalogue-hero-tiles">${c.items.map(item => `<a href="${escape(item.href)}" aria-label="View model · ${escape(item.label)}"><img src="${item.src}" alt="" width="240" height="160" loading="lazy"><span><bdi>${escape(item.label)}</bdi><span aria-hidden="true">↗</span></span></a>`).join('')}</div></div></div>`;
}
