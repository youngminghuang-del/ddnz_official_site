import { SharedKitchenListBar } from './components/SharedKitchenList';
import InductionCatalogue from './components/InductionCatalogue';
import { steamCabinetBreadcrumb } from './data/steamCabinetPage.mjs';
import { steamModels } from './data/inductionModels.mjs';
import copy from './locales/planning/steam-cabinets.json';
import navigationCopy from './locales/planning/induction-use.json';

export default function SteamCabinetContent({ locale, onAdd, count = 0, status = '' }: {
  locale: keyof typeof copy;
  onAdd?: (id: string) => void;
  count?: number;
  status?: string;
}) {
  const text = copy[locale];
  const breadcrumb = steamCabinetBreadcrumb(locale);
  const [single, double] = steamModels;
  return <main id="main-content" className="ddnz-kitchen kitchen-brand induction-page steam-cabinet-page"
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
          <a className="button primary" href="#steam-cabinet-selection">{text.choose} ↓</a>
          <a className="text-link" href="#steam-cabinet-installation">{text.installation} ↓</a>
        </div>
      </div>
      <figure className="induction-hero-photo">
        <img src={double.image} alt={text.doors[1]} width="1536" height="1024" fetchPriority="high"/>
        <figcaption><bdi>{double.model}</bdi></figcaption>
      </figure>
    </section>
    <SharedKitchenListBar locale={locale} count={count} status={status}/>
    <section className="section wrap induction-use-section" id="steam-cabinet-selection" aria-labelledby="steam-cabinet-selection-title">
      <h2 id="steam-cabinet-selection-title">{text.choose}</h2>
      <nav className="induction-use-nav" aria-labelledby="steam-cabinet-selection-title">
        {[single, double].map((model, index) => <a key={model.id} href={'#model-' + model.id}>
          <img src={model.image} width="100" height="78" alt="" loading="lazy"/>
          <span><strong>{text.doors[index]} <span aria-hidden="true">↓</span></strong><span><bdi>{model.model}</bdi></span></span>
        </a>)}
      </nav>
    </section>
    <InductionCatalogue locale={locale} group="steam" expanded showTotal steamSelection onAdd={onAdd}/>
    <section className="section wrap induction-quote-checks" id="steam-cabinet-installation">
      <h2>{text.installation}</h2>
      <div className="induction-site-checks">
        {text.checks.map(([heading, body]) => <article key={heading}><h3>{heading}</h3><p>{body}</p></article>)}
      </div>
    </section>
  </main>;
}
