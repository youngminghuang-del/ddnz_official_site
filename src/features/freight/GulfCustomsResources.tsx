import ui from './gulfUi.json';
import type { GulfLocale } from './gulfLocale';
import content from './gulfCustoms.json';

export default function GulfCustomsResources({ country, locale }: { country: 'qatar' | 'oman'; locale: GulfLocale }) {
 const oman = country === 'oman';
 return <section className="gulf-customs" data-customs-resources aria-labelledby={`customs-${country}`}>
  <h3 id={`customs-${country}`}>{content.sectionHeading[locale]}</h3>
  <div className={`gulf-official-mark ${oman ? 'gulf-official-mark-wide' : ''}`}><img src={`/media/freight-20261014-round4/${country}-customs-official.png`} width={oman ? 709 : 2218} height={oman ? 174 : 1422} loading="lazy" alt={ui[locale][country].customsAlt} /></div>
  <div className="gulf-customs-cards">{content.cards.filter(card => card.country === country).map(card => <article key={card.id} data-official-resource={card.id}>
   <h4>{card.entityName[locale]}</h4><p className="gulf-customs-role">{card.role[locale]}</p><p>{card.prepare[locale]}</p>
   <a href={card.officialUrl[locale]}>{card.linkLabel[locale]} <span aria-hidden="true">↗</span></a>{card.linkNote[locale] && <small>{card.linkNote[locale]}</small>}
  </article>)}</div>
 </section>;
}
