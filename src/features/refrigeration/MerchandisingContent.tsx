import {buildQuoteHref} from '../../lib/quoteLinks';
import {quoteLinkProps} from '../../lib/quoteLinkPolicy.mjs';
import {compactCoolers, merchandisingPages} from './merchandisingModels.mjs';
import {bakeryDisplayPath, ingredientRailPath} from './merchandisingRoutes.mjs';

import {localizedProductPath} from '../../lib/productLocalization.mjs';
import copy from './merchandising-copy.json';

export type MerchandisingLocale = keyof typeof copy;
type CopyKey = keyof typeof copy.en;

export function merchandisingMetadata(path: keyof typeof merchandisingPages, locale: MerchandisingLocale) {
  const page = merchandisingPages[path];
  const t = copy[locale];
  return { title: t[page.heading] + ' | DDNZ Global', description: t[page.description], image: page.hero };
}
const kitchen = '/sourcing/commercial-kitchen-equipment-from-china/';
const bakeryProject = '/sourcing/restaurant-kitchen-packages-from-china/bakery-pastry/';
const refrigeration = '/refrigeration-equipment/';
const linkStyle = 'inline-flex min-h-11 items-center font-semibold text-purple-800 underline underline-offset-4';
const buttonStyle = 'ddnz-control ddnz-action inline-flex min-h-11 items-center px-4 py-2.5 font-bold text-white';
const merchandisingMedia = '/images/product-showcase/refrigeration/merchandising/';
const pictureStyle = 'aspect-[4/3] w-full bg-white object-contain p-3';

type Selection = {
  code: string;
  label: CopyKey;
  size: string;
  picture: string;
  watts: number;
  packing?: string;
  check?: CopyKey;
};

function quoteHref(locale: MerchandisingLocale, category: string, model?: {code:string;label:string;check?:string}) {
  return buildQuoteHref({
    intent:'Product Sourcing', language:locale, source:'refrigeration_model_catalogue',
    industry:'Commercial Kitchen Equipment',
    subcategory:model ? [model.code, category, model.label, model.check].filter(Boolean).join(' · ') : category,
  });
}

function ModelCard({model, category, temperature, locale}: {model:Selection;category:string;temperature:string;locale:MerchandisingLocale}) {
  const t = copy[locale];
  const label = t[model.label].replace('{width}', model.size.split(' × ')[0]);
  const check = model.check ? t[model.check] : undefined;
  return <article id={model.code.toLowerCase()} className="ddnz-control flex scroll-mt-32 flex-col overflow-hidden border border-slate-200 bg-white">
    <figure>
      <img className={pictureStyle} src={model.picture} alt={label + " · " + t.series} width="640" height="480" loading="lazy" />
      <figcaption className="px-5 text-xs text-slate-600">{t.series}</figcaption>
    </figure>
    <div className="flex flex-1 flex-col items-start gap-4 p-5">
      <div><p className="text-sm font-semibold text-purple-800"><bdi>{model.code}</bdi></p><h3 className="mt-1 text-xl font-bold">{label}</h3></div>
      <dl className="grid w-full gap-3 border-y border-slate-200 py-3 text-sm">
        <div><dt className="text-slate-600">{t.dimensions}</dt><dd className="font-semibold">{model.size.includes('{depth}') ? <bdi dir="ltr">{model.size.replace('{depth}', t.depthPending)}</bdi> : <bdi>{model.size}</bdi>}</dd></div>
        <div><dt className="text-slate-600">{t.rated}</dt><dd className="font-semibold"><bdi>{temperature} · {model.watts} W</bdi></dd></div>
      </dl>
      {model.packing && <details className="w-full text-sm"><summary className="cursor-pointer font-semibold text-purple-800">{t.packing}</summary><p className="mt-2"><bdi>{model.packing}</bdi></p></details>}
      {check && <p className="text-sm leading-6 text-slate-700">{check}</p>}
      <a aria-label={`${t.quoteModel} · ${model.code}`} className={linkStyle + ' mt-auto'} {...quoteLinkProps(quoteHref(locale, category, {code:model.code, label, check}))}>{t.quoteModel} <span aria-hidden="true">{locale === 'ar' ? '↖' : '↗'}</span></a>
    </div>
  </article>;
}

export function MerchandisingContent({path, locale = 'en'}:{path:keyof typeof merchandisingPages;locale?:MerchandisingLocale}) {
  const t = copy[locale];
  const page = merchandisingPages[path];
  const bakery = path === bakeryDisplayPath;
  return <main id="main-content" lang={locale === 'zh' ? 'zh-CN' : locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="ddnz-catalogue ddnz-page bg-slate-50 text-slate-900">
    <div className="mx-auto max-w-7xl space-y-14 px-6 py-10 md:space-y-20 md:py-14">
      <header className="grid items-center gap-8 lg:grid-cols-[1fr_0.86fr]">
        <div>
          <a className={linkStyle} href={localizedProductPath(refrigeration, locale)}>{t.refrigeration}</a>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">{t[page.heading]}</h1>
          <p className="mt-5 max-w-xl text-lg leading-8">{t[page.description]}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a className={buttonStyle} href={'#' + page.groups[0].id}>{t.compare} ↓</a>
            <a className={linkStyle} href="#order-checks">{t.installation} ↓</a>
          </div>
        </div>
        <figure className="ddnz-control overflow-hidden border border-slate-200 bg-white">
          <img className={pictureStyle} src={page.hero} alt={t[page.label] + " · " + t.series} width="640" height="480" fetchPriority="high" />
          <figcaption className="border-t border-slate-200 px-5 py-3 text-sm text-slate-600">{t.series}</figcaption>
        </figure>
      </header>
      {bakery && <nav aria-label={t.chooseInstall} className="grid gap-3 sm:grid-cols-3">{page.groups.map(group =>
        <a className={linkStyle + ' ddnz-control border border-slate-200 bg-white px-4'} key={group.id} href={'#' + group.id}>{t[group.title]} ↓</a>
      )}</nav>}
      {page.groups.map(group => <section className="scroll-mt-28" id={group.id} key={group.id}>
        <h2 className="text-3xl font-bold">{t[group.title]}</h2>
        <p className="mt-3 max-w-3xl leading-7">{t[group.use]}</p>
        {group.id === 'built-in' && <figure className="ddnz-control mt-5 grid overflow-hidden border border-slate-200 bg-white sm:grid-cols-2">
          <img src={merchandisingMedia + 'bakery-built-in-scene.webp'} alt={t.builtAlt} width="800" height="800" className="aspect-[16/10] w-full object-cover" loading="lazy" />
          <figcaption className="flex flex-col justify-center gap-2 p-5 sm:p-7">
            <strong className="text-lg">{t.builtPhotoTitle}</strong>
            <p className="leading-7">{t.builtPhotoBody}</p>
            <span className="text-sm text-slate-600">{t.layoutCaption}</span>
          </figcaption>
        </figure>}
        <div className={`mt-5 grid gap-4 sm:grid-cols-2 ${bakery ? '' : 'lg:grid-cols-3'}`}>
          {group.models.map(model => <ModelCard key={model.code} model={model} category={t[page.label]} locale={locale} temperature="2–8 °C" />)}
        </div>
      </section>)}
      <section className="scroll-mt-28" id="order-checks">
        <h2 className="text-3xl font-bold">{t.installation}</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">{page.questions.map(([question, answer]) =>
          <article key={question} className="ddnz-control border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold">{t[question]}</h3><p className="mt-3 leading-7">{t[answer]}</p>
          </article>
        )}</div>
        <p className="mt-5 max-w-3xl leading-7">{bakery ? t.bakeryRequest : t.railRequest}</p>
        <div className="mt-5 flex flex-wrap gap-4">
          <a className={buttonStyle} {...quoteLinkProps(quoteHref(locale, t[page.label]))}>{t.quote} <span aria-hidden="true">{locale === 'ar' ? '↖' : '↗'}</span></a>
          <a className={linkStyle} href={localizedProductPath(bakeryProject + '#bakery-front-counter', locale)}>{t.projectLink} <span aria-hidden="true">{locale === 'ar' ? '↖' : '↗'}</span></a>
          <a className={linkStyle} href={localizedProductPath(kitchen + '#commercial-kitchen-list', locale)}>{t.list} <span aria-hidden="true">{locale === 'ar' ? '↖' : '↗'}</span></a>
        </div>
      </section>
    </div>
  </main>;
}

export function RefrigerationMerchandising({locale = 'en'}:{locale?:MerchandisingLocale}) {
  const t = copy[locale];
  return <section id="display-merchandising" className="scroll-mt-28">
    <h2 className="text-3xl font-bold">{t.displayHeading}</h2>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {Object.values(merchandisingPages).map(page => <a className="ddnz-control flex items-center gap-4 border border-slate-200 bg-white p-4" key={page.path} href={localizedProductPath(page.path, locale)}>
        <img className="h-20 w-24 shrink-0 object-contain" src={page.hero} alt="" width="128" height="104" loading="lazy" />
        <span><strong className="text-lg text-purple-800">{t[page.label]} <span aria-hidden="true">{locale === 'ar' ? '↖' : '↗'}</span></strong><span className="mt-1 block text-sm leading-6">{page.path === bakeryDisplayPath ? t.bakeryTeaser : t.railTeaser}</span></span>
      </a>)}
    </div>
    <h3 id="compact-drinks" className="mt-9 scroll-mt-28 text-2xl font-bold">{t.coolerHeading}</h3>
    <p className="mt-3 max-w-3xl leading-7">{t.coolerBody}</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {compactCoolers.map(model => <ModelCard key={model.code} model={model} category={t.coolerHeading} locale={locale} temperature={model.temperature} />)}
    </div>
  </section>;
}

export function BakeryFrontCounter({locale = 'en'}:{locale?:MerchandisingLocale}) {
  const t = copy[locale];
  const stations = [
    {
      title:t.dessertTitle,
      body:t.dessertBody,
      image:merchandisingMedia + 'bakery-display-scene.webp',
      alt:t.dessertAlt,
      href:bakeryDisplayPath, link:t.dessertLink,
    },
    {
      title:t.coffeeTitle,
      body:t.coffeeBody,
      image:'/images/product-series/coffee-planning-scene.webp',
      alt:t.coffeeAlt,
      href:'/sourcing/commercial-ice-machines-from-china/', link:t.iceLink,
    },
    {
      title:t.prepTitle,
      body:t.prepBody,
      image:merchandisingMedia + 'ingredient-prep-scene.webp',
      alt:t.prepAlt,
      href:ingredientRailPath, link:t.railLink,
    },
  ];
  return <section id="bakery-front-counter" className="scroll-mt-28">
    <h2 className="text-3xl font-bold">{t.frontTitle}</h2>
    <p className="mt-3 max-w-3xl leading-7">{t.frontBody}</p>
    <div className="mt-5 grid gap-4 md:grid-cols-3">{stations.map(item =>
      <article className="ddnz-control border border-slate-200 bg-white p-5" key={item.title}>
        <figure className="mb-3">
          <img src={item.image} alt={item.alt} width="480" height="360" className="aspect-[4/3] w-full rounded-lg object-cover" loading="lazy" />
          <figcaption className="mt-2 text-xs text-slate-600">{t.sceneCaption}</figcaption>
        </figure>
        <h3 className="text-lg font-bold">{item.title}</h3><p className="mt-2 leading-7">{item.body}</p>
        <a className={linkStyle} href={localizedProductPath(item.href, locale)}>{item.link} <span aria-hidden="true">{locale === 'ar' ? '↖' : '↗'}</span></a>
      </article>
    )}</div>
    <div className="mt-4 flex flex-wrap gap-4">
      <a className={linkStyle} href={localizedProductPath('/sourcing/commercial-coffee-machines-from-china/', locale)}>{t.coffeeLink} <span aria-hidden="true">{locale === 'ar' ? '↖' : '↗'}</span></a>
      <a className={linkStyle} href="#package-rfq">{t.shopQuote} ↓</a>
    </div>
  </section>;
}
