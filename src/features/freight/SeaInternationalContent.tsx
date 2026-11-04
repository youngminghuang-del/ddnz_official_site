import {DoorDeliveryLink} from './DoorDeliveryContent';
import { seaInternationalCopy } from './seaInternationalCopy';
import { lclInternationalCopy, type LclExtraLocale } from './lclInternationalCopy';
export const internationalSeaMetadata=(locale:LclExtraLocale)=>({title:`${seaInternationalCopy[locale].title} | DDNZ Global`,desc:seaInternationalCopy[locale].intro,keywords:''});
const seaFreightTracks = [
  { code: 'LCL', label: 'Сборный груз', steps: ['Приём груза', 'Объединение партий в контейнере', 'Морская перевозка', 'Расформирование контейнера', 'Самовывоз или доставка'] },
  { code: 'FCL', label: 'Целый контейнер', steps: ['Загрузка отдельного контейнера', 'Морская перевозка', 'Выдача контейнера или выгрузка'] },
];

export default function SeaInternationalContent({locale}:{locale:LclExtraLocale}) {
 const c=seaInternationalCopy[locale], l=lclInternationalCopy[locale];
 const prefix=`/${locale}`, base='/media/freight-20260918/';
 const quote=`${prefix}/get-a-quote/?leadGoal=Freight+Export&source=sea_freight_fieldwork`;
 const regionPrefix=locale==='pt'||locale==='tr'?'':prefix;
 const regionLanguageNote=locale==='pt'?'Guias regionais disponíveis em inglês.':locale==='tr'?'Bölgesel rehberler İngilizce olarak sunulmaktadır.':null;
 const anchors=['loading-proof-title','mixed-loads','load-planning','freight-destinations'];
 return <main id="main-content" className="freight-editorial freight-next" lang={locale} dir={locale==='ar'?'rtl':'ltr'}>
  <header className="freight-cover"><div className="freight-cover-copy"><p className="freight-kicker">DDNZ / HEAVEN BORN · FCL / LCL</p><h1>{c.title}</h1><p>{c.intro}</p>{locale==='ru' && <><p>Сборный груз (LCL) подходит для партии, которой не нужен целый контейнер. Полный контейнер (FCL) бронируют целиком. Для расчёта укажите города отправления и назначения, товар, число мест, размеры и вес брутто.</p><p><a href={`${prefix}/services/lcl-shipping-from-china/`}>Подробнее о сборных грузах из Китая ↓</a></p></>}<div className="freight-cover-actions"><a className="freight-cta" href={quote}>{c.quote} ↗</a><a href="#loading-proof-title">{c.nav[0]} ↓</a></div></div><figure className="freight-cover-image"><img src={`${base}factory-container.jpg`} width={1290} height={1700} alt={c.hero} fetchPriority="high"/><figcaption>{c.hero}</figcaption></figure></header>
  <nav className="freight-chapters" aria-label={c.title}>{c.nav.map((label,i)=><a key={label} href={`#${anchors[i]}`}>0{i+1} / {label}</a>)}</nav>
  <section className="freight-wrap freight-section" id="choose-freight-service"><h2>{c.choose}</h2><div className="mt-8 divide-y border-y border-current/20">{c.services.map(([title,body],i)=><a key={title} className="flex flex-col gap-3 py-6 sm:flex-row sm:gap-8" href={i===0?'#load-planning':i===1?`${prefix}/services/lcl-shipping-from-china/`:`${prefix}/sourcing-services/consolidation-export/`}><span className="w-28 shrink-0">{['FCL','LCL','DDNZ'][i]}</span><span><strong className="text-2xl">{title}</strong><span className="mt-2 block leading-7">{body}</span></span><span>↗</span></a>)}</div>
    {locale === 'ru' && (
      <div className="mt-10">
        <h3 className="text-2xl font-semibold">Доставка сборных грузов из Китая морем (LCL)</h3>
        <p className="mt-3 max-w-3xl leading-7">
          LCL подходит для небольшой партии, которую можно разместить в одном контейнере с грузами других отправителей.
          Если размеры или упаковка требуют отдельной загрузки, стоит сравнить условия с FCL.
        </p>
        <figure className="mt-6">
          <figcaption className="mb-3 font-semibold">Как проходит морская перевозка LCL и FCL</figcaption>
          <div className="grid gap-4 sm:grid-cols-2">
            {seaFreightTracks.map(({ code, label, steps }) => (
              <div key={code} className="min-w-0 rounded-xl border border-current/20 p-4 sm:p-5">
                <h4 className="font-semibold">{code} · {label}</h4>
                <ol className="mt-3 space-y-2">
                  {steps.map((step, index) => (
                    <li key={step} className="flex items-start gap-3">
                      <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-current/25 text-sm">{index + 1}</span>
                      <span className="pt-0.5 leading-6">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </figure>
        <p className="mt-6 max-w-3xl leading-7">
          Для предварительного расчёта укажите город отправления в Китае и пункт назначения, наименование груза,
          число грузовых мест, размеры каждого места и общий вес брутто. Уточните, нужен ли самовывоз или доставка
          до склада, чтобы в расчёте можно было отдельно показать расходы в пункте назначения.
        </p>
      </div>
    )}
  </section>
  <section id="loading-proof-title" className="freight-wrap freight-section"><h2>{c.loadingTitle}</h2><p className="freight-intro">{c.loadingIntro}</p><div className="freight-film-grid">{[['loading-01','loading-01-poster'],['loading-02','loading-02-poster'],['receiving-silent','receiving-poster']].map(([file,poster],i)=><figure className="freight-film" key={file}><video controls playsInline muted preload="none" src={`${base}${file}.mp4`} poster={`${base}${poster}.jpg`} aria-label={c.films[i]}/><figcaption><h3>{c.films[i]}</h3></figcaption></figure>)}</div><div className="freight-questions">{[...l.fit,l.questions[0],...l.questions.slice(3)].map(([title,body])=><details key={title}><summary>{title}</summary><p>{body}</p></details>)}</div></section>
  <section id="destination-records" className="freight-wrap freight-section"><h2>{c.arrivalTitle}</h2><div className="freight-arrival-films"><figure><video controls playsInline muted preload="none" src="/media/freight-additions-20260918/uganda.mp4" poster="/media/freight-additions-20260918/uganda.jpg" aria-label={c.arrival}/><figcaption>{c.arrival}</figcaption></figure></div></section>
  <section id="mixed-loads" className="freight-dark"><div className="freight-wrap freight-section"><h2>{c.mixedTitle}</h2><p className="freight-intro">{c.mixed}</p><a className="freight-cta" href={`${prefix}/services/lcl-shipping-from-china/#lcl-field-record`}>{c.lclLink} ↗</a></div></section>
  <section id="load-planning" className="freight-wrap freight-section"><div className="freight-planning-layout"><div><h2>{c.planTitle}</h2><p className="freight-intro">{c.plan}</p><a className="freight-cta" href={quote}>{c.quote} ↗</a></div><figure><a href={`${base}load-plan.png`} target="_blank" rel="noreferrer"><img src={`${base}load-plan.webp`} alt={c.simulation} loading="lazy"/></a><figcaption>{c.simulation}</figcaption></figure></div></section>
  <section id="freight-destinations" className="freight-destination-band"><div className="freight-wrap freight-section"><h2>{c.destTitle}</h2>{regionLanguageNote&&<p className="mt-4">{regionLanguageNote}</p>}<div className="freight-destination-links">{['latin-america','west-africa','middle-east'].map((id,i)=><a key={id} href={`${regionPrefix}/shipping-from-china-to-${id}/`} hrefLang={regionLanguageNote?'en':locale}>{c.destinations[i]} ↗</a>)}</div><a className="freight-specialist-link" href={`${prefix}/services/dangerous-goods-shipping-from-china/`}>{c.specialist} →</a></div></section>
  <section id="rfq-form-section" className="freight-wrap freight-section freight-close"><h2>{c.close}</h2><p>{l.brief}</p><p>{l.scope}</p><a className="freight-cta" href={quote}>{c.quote} ↗</a><small>{c.signature}</small></section>
 <DoorDeliveryLink locale={locale} context="services/sea-freight"/></main>;
}
