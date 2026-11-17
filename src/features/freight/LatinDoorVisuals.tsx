import {latinDoorCopy,type LatinDoorMarket} from './latinDoorMarket';
import visualCopy from './latinDoorVisualCopy.json';
import type {EcuadorLocale} from './ecuadorCopy';

type EcuadorPhoto = 'measurement' | 'consolidation';
export function EcuadorProcessPhoto({kind,locale}: {kind:EcuadorPhoto;locale:EcuadorLocale}) {
  const labels=visualCopy[locale];
  const src='/images/freight/ecuador/'+kind;
  return <figure className="ecuador-process-photo">
    <a href={src+'.webp'} target="_blank" rel="noreferrer" aria-label={labels[kind]}>
      <img src={src+'-480.webp'} srcSet={`${src}-480.webp 480w, ${src}.webp 960w`}
        sizes="(max-width: 740px) calc(100vw - 32px), 480px"
        width={960} height={720} loading="lazy" decoding="async" alt={labels[kind]}/>
    </a>
    <figcaption>{labels[kind+'Caption' as 'measurementCaption' | 'consolidationCaption']}</figcaption>
  </figure>;
}

export function LatinDoorFaq({market,locale}:{market:LatinDoorMarket;locale:EcuadorLocale}) {
  const c=latinDoorCopy(market,locale),labels=visualCopy[locale];
  const questions=market==='ecuador'
    ? [[labels.ecuadorPort,`${c.door} ${c.routeNote}`],[labels.ecuadorOrigin,c.factoryDocs]]
    : [[labels.dominicanFactory,c.factoryBody],[labels.dominicanRelease,c.clearanceRelease]];
  return <section id="route-faq" className="mp-section latin-door-faq" tabIndex={-1}>
    <h2>{labels.faq}</h2>
    {questions.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
  </section>;
}
