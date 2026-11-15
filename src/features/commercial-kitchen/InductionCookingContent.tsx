import { SharedKitchenListBar, sharedKitchenListHref } from './components/SharedKitchenList';
import InductionCatalogue from './components/InductionCatalogue';
import { KITCHEN_PATH } from './data/discovery.mjs';
import { inductionGroups, zhHotCookingPage } from './data/inductionPage.mjs';
import { localizedProductPath } from '../../lib/productLocalization.mjs';
import copy from './locales/planning/induction-use.json';

export type InductionLocale = keyof typeof copy;

const [single, multi, large] = inductionGroups;
const useEntries = [
  ...single.models.map(model => ({ anchor: 'model-' + model.id, image: model.image })),
  { anchor: multi.anchor, image: multi.models[0].image },
  { anchor: large.anchor, image: large.models[0].image },
];

export default function InductionCookingContent({ locale = 'en', onAdd, count = 0, status = '' }: {
  locale?: InductionLocale;
  onAdd?: (id: string) => void;
  count?: number;
  status?: string;
}) {
  const text = copy[locale];
  const [home, products, kitchen, current, breadcrumb] = text.labels;
  const homePath = locale === 'en' ? '/' : `/${locale === 'zh' ? 'zh-cn' : locale}/`;
  const kitchenPath = localizedProductPath(KITCHEN_PATH, locale);
  const listPath = sharedKitchenListHref(locale);
  return <main id="main-content" className="ddnz-kitchen kitchen-brand induction-page" lang={locale === 'zh' ? 'zh-CN' : locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
    <nav className="kitchen-breadcrumb wrap" aria-label={breadcrumb}><ol>
      <li><a href={homePath}>{home}</a></li>
      <li><a href={localizedProductPath('/products/', locale)}>{products}</a></li>
      <li><a href={kitchenPath}>{kitchen}</a></li>
      <li aria-current="page">{current}</li>
    </ol></nav>
    <section className="section wrap induction-intro-section">
      <h1>{text.heading}</h1>
      <p>{text.intro}</p>
      <div className="induction-page-actions">
        <a className="button primary" href="#induction-uses">{text.choose} ↓</a>
        <a className="text-link" href="#induction-installation">{text.install} ↓</a>
      </div>
    </section>
    <SharedKitchenListBar locale={locale} count={count} status={status}/>
    <section className="section wrap induction-use-section" id="induction-uses" aria-labelledby="induction-uses-title">
      <h2 id="induction-uses-title">{text.choose}</h2>
      <nav aria-labelledby="induction-uses-title" className="induction-use-nav">
        {useEntries.map((item, index) => <a key={item.anchor} href={'#' + item.anchor}>
          <img src={item.image} width="100" height="78" alt="" loading="lazy" decoding="async"/>
          <span><strong>{text.uses[index][0]} <span aria-hidden="true">↓</span></strong><span>{text.uses[index][1]}</span></span>
        </a>)}
      </nav>
    </section>
    {inductionGroups.map(({ group }) => <InductionCatalogue key={group} group={group} locale={locale} expanded showTotal onAdd={onAdd}/>)}
    <section className="section wrap induction-quote-checks" id="induction-installation">
      <h2>{text.install}</h2>
      <div className="induction-site-checks">
        {text.checks.map(([heading, body]) => <article key={heading}><h3>{heading}</h3><p>{body}</p></article>)}
      </div>
      <div className="induction-page-actions">
        <a className="button primary" href={listPath}>{text.quote} ↗</a>
        <a className="text-link" href={kitchenPath + '#commercial-kitchen-equipment'}>{text.more} ↗</a>
        {locale === 'zh' && <a className="text-link" href={zhHotCookingPage.path}>{zhHotCookingPage.label} ↗</a>}
      </div>
    </section>
  </main>;
}
