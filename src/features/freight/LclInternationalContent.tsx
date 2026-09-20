import { lclInternationalCopy, type LclExtraLocale } from './lclInternationalCopy';
export function internationalLclMetadata(locale: LclExtraLocale) {
  const c = lclInternationalCopy[locale];
  return { title: `${c.title} | DDNZ Global`, desc: c.intro, keywords: '' };
}
export default function LclInternationalContent({ locale }: { locale: LclExtraLocale }) {
  const c = lclInternationalCopy[locale];
  const quote = `/${locale}/get-a-quote/?leadGoal=Freight+Only&source=lcl_shipping`;
  const anchors = ['lcl-fit','lcl-costs','lcl-field-record','lcl-loading-mistakes','lcl-brief'];
  const photos = [
    ['/media/freight-20260918/mixed-cargo-loading.jpg',1290,1490],
    ['/media/lcl-20260920/loading-in-progress.webp',1200,1547],
    ['/media/lcl-20260920/crates-and-pallets.webp',1200,1328],
    ['/media/lcl-20260920/bags-and-cartons.webp',1200,2145],
  ] as const;
  return <main id="main-content" className="freight-editorial freight-next" dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
    <header className="freight-cover"><div className="freight-cover-copy"><p className="freight-kicker">LCL · DDNZ GLOBAL</p><h1>{c.title}</h1><p>{c.intro}</p><a className="freight-cta" href={quote}>{c.quote} ↗</a></div><div className="country-route-board"><h2>{c.briefTitle}</h2><ol>{c.fit.map(([title], i) => <li key={title}><span>0{i+1}</span>{title}</li>)}</ol></div></header>
    <nav className="freight-chapters" aria-label={c.title}>{c.nav.map((label,i) => <a href={`#${anchors[i]}`} key={label}>0{i+1} / {label}</a>)}</nav>
    <section id="lcl-fit" className="freight-wrap freight-section"><h2>{c.fitTitle}</h2><div className="freight-questions">{c.fit.map(([title,body])=><details key={title}><summary>{title}</summary><p>{body}</p></details>)}</div></section>
    <section id="lcl-costs" className="freight-wrap freight-section"><div id="consolidation-cost-comparison"><h2>{c.costsTitle}</h2><p className="freight-intro">{c.costsIntro}</p><dl className="mt-8 divide-y border-y border-slate-300">{c.costs.map(([title,body])=><div key={title} className="py-6 md:grid md:grid-cols-[14rem_1fr] md:gap-8"><dt className="text-xl font-bold">{title}</dt><dd className="mt-3 leading-8 md:mt-0">{body}</dd></div>)}</dl></div><h2 className="mt-14">{c.questionsTitle}</h2><div className="freight-questions">{c.questions.map(([title,body])=><details key={title}><summary>{title}</summary><p>{body}</p></details>)}</div></section>
    <section id="lcl-field-record" className="freight-wrap freight-section lcl-loading-details"><h2>{c.photosTitle}</h2><p className="freight-intro">{c.photosIntro}</p><div className="lcl-detail-grid">{photos.map(([src,width,height],i)=><figure key={src}><a className="lcl-detail-image" href={src} target="_blank" rel="noreferrer" aria-label={`${c.open}: ${c.photos[i][0]}`}><img src={src} width={width} height={height} alt={c.photos[i][0]} loading="lazy" decoding="async"/><span className="lcl-image-open">{c.open} ↗</span></a><figcaption><h3>{c.photos[i][0]}</h3><p>{c.photos[i][1]}</p></figcaption></figure>)}</div></section>
    <section id="lcl-loading-mistakes" className="lcl-errors"><div className="freight-wrap freight-section lcl-loading-details"><p className="freight-kicker">{c.errorLabel}</p><h2>{c.errorsTitle}</h2><p className="freight-intro">{c.errorsIntro}</p><div className="lcl-error-grid">{c.errors.map(([title,body],i)=>{const src=`/media/lcl-20260920/wrong-example-${i === 0 ? 'mixed' : 'carton'}-stack.webp`;return <figure key={src}><a className="lcl-detail-image" href={src} target="_blank" rel="noreferrer" aria-label={`${c.open}: ${title}`}><span className="lcl-error-badge">{c.errorLabel}</span><img src={src} alt={title} width={1200} height={i === 0 ? 1901 : 1615} loading="lazy" decoding="async"/><span className="lcl-image-open">{c.open} ↗</span></a><figcaption><h3>{title}</h3><p>{body}</p></figcaption></figure>})}</div><a className="lcl-review-link" href="#lcl-brief">{c.quote} →</a></div></section>
    <section className="freight-wrap freight-section"><h2>{c.sourcingTitle}</h2><p className="freight-intro">{c.sourcingBody}</p><a href={`/${locale}/sourcing-services/consolidation-export/`}>{c.sourcingLink} →</a></section>
    <section id="lcl-brief" className="freight-destination-band"><div className="freight-wrap freight-section"><h2>{c.briefTitle}</h2><p className="freight-intro">{c.brief}</p><p className="freight-intro">{c.scope}</p><a href={quote} className="freight-cta">{c.quote} ↗</a></div></section>
  </main>;
}
