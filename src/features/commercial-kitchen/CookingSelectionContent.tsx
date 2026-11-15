import { SharedKitchenListBar } from './components/SharedKitchenList';
import InductionCatalogue from './components/InductionCatalogue';
import { cookingSelectionBreadcrumb, cookingSelections } from './data/cookingSelectionPages.mjs';
import catalogueCopy from './locales/planning/induction-catalogue.json';
import navigationCopy from './locales/planning/induction-use.json';

export default function CookingSelectionContent({ group, locale, onAdd, count = 0, status = '' }: {
  group: keyof typeof cookingSelections;
  locale: keyof typeof catalogueCopy;
  onAdd?: (id: string) => void;
  count?: number;
  status?: string;
}) {
  const { copy, id, models } = cookingSelections[group];
  const text = copy[locale];
  const breadcrumb = cookingSelectionBreadcrumb(group, locale);
  const heroModel = models[1];
  const names = 'doors' in text ? text.doors : catalogueCopy[locale].noodleNames;
  const selectionId = id + '-selection';
  const titleId = selectionId + '-title';
  const installationId = id + '-installation';
  return <main id="main-content" className={`ddnz-kitchen kitchen-brand induction-page ${id}-page`}
    lang={locale === 'zh' ? 'zh-CN' : locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
    <nav className="kitchen-breadcrumb wrap" aria-label={navigationCopy[locale].labels[4]}><ol>
      {breadcrumb.slice(0, -1).map(([name, path]) => <li key={path}><a href={path}>{name}</a></li>)}
      <li aria-current="page">{text.label}</li>
    </ol></nav>
    <section className="section wrap induction-intro-section">
      <div className="induction-intro-copy">
        <h1>{text.heading}</h1>
        <p>{text.intro}</p>
        <div className="induction-page-actions">
          <a className="button primary" href={'#' + selectionId}>{text.choose} ↓</a>
          {'installation' in text && <a className="text-link" href={'#' + installationId}>{text.installation} ↓</a>}
        </div>
      </div>
      <figure className="induction-hero-photo">
        <img src={heroModel.image} alt={names[1]} width="1536" height="1024" fetchPriority="high"/>
        <figcaption><bdi>{heroModel.model}</bdi></figcaption>
      </figure>
    </section>
    <SharedKitchenListBar locale={locale} count={count} status={status}/>
    <section className="section wrap induction-use-section" id={selectionId} aria-labelledby={titleId}>
      <h2 id={titleId}>{text.choose}</h2>
      <nav className="induction-use-nav" aria-labelledby={titleId}>
        {models.map((model, index) => <a key={model.id} href={'#model-' + model.id}>
          <img src={model.image} width="100" height="78" alt="" loading="lazy"/>
          <span><strong>{names[index]} <span aria-hidden="true">↓</span></strong><span><bdi>{model.model}</bdi></span></span>
        </a>)}
      </nav>
      {'note' in text && <p className="noodle-configuration-note">{text.note}</p>}
    </section>
    <InductionCatalogue locale={locale} group={group} expanded showTotal standaloneSelection onAdd={onAdd}/>
    {'checks' in text && <section className="section wrap induction-quote-checks" id={installationId}>
      <h2>{text.installation}</h2>
      <div className="induction-site-checks">
        {text.checks.map(([heading, body]) => <article key={heading}><h3>{heading}</h3><p>{body}</p></article>)}
      </div>
    </section>}
  </main>;
}
