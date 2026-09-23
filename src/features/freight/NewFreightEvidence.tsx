import { words, type FreightLocale } from './regions';
import { useEffect } from 'react';

const base = '/media/freight-additions-20260918/';

export default function NewFreightEvidence({ locale, specialist = false, uaeOnly = false }: { locale: FreightLocale; specialist?: boolean; uaeOnly?: boolean }) {
  const sectionId = specialist ? 'specialist-field-records' : 'destination-records';
  useEffect(() => {
    if (window.location.hash !== `#${sectionId}`) return;
    const frame = requestAnimationFrame(() => document.getElementById(sectionId)?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, [sectionId]);
  const t = (zh: string, en: string, es: string) => words(zh, en, es)[locale];
  const films = specialist ? [
    ['lithium-1', t('锂电池装柜 · 搬运与进柜', 'Lithium cargo · Handling and loading', 'Carga de litio · Manipulación y carga'), '00:16'],
    ['lithium-2', t('锂电池装柜 · 托盘与柜口', 'Lithium cargo · Pallets and container door', 'Carga de litio · Palés y puerta'), '00:08'],
    ['lithium-3', t('锂电池装柜 · 约束与关门片段', 'Lithium cargo · Restraint and door-closing views', 'Carga de litio · Sujeción y cierre'), '00:14'],
  ] : [
    ...(uaeOnly ? [['uae', t('阿联酋 · 拆柜与转运现场', 'UAE · Unloading and transfer', 'EAU · Descarga y traslado'), '00:43']] : []),
    ...(!uaeOnly ? [['uganda', t('乌干达 · 开柜与卸货现场', 'Uganda · Container opening and unloading', 'Uganda · Apertura y descarga'), '00:55']] : []),
  ];
  return <section id={specialist ? 'specialist-field-records' : 'destination-records'} className="freight-editorial freight-next freight-new-evidence">
    <div className="freight-wrap freight-section">
      <div className="freight-section-heading"><p className="freight-kicker">{specialist ? t("特殊货物 / 现场记录","SPECIALIST CARGO / FIELD RECORDS","CARGA ESPECIAL / REGISTROS DE OPERACIONES") : t("目的地 / 现场记录","AT DESTINATION / FIELD RECORDS","EN DESTINO / REGISTROS DE OPERACIONES")}</p><h2>{specialist ? t('从桶装货，\n到锂电池。', 'From drums\nto lithium cargo.', 'De bidones\na carga de litio.') : t('镜头，到了目的地。', 'The view from destination.', 'La vista desde el destino.')}</h2><p>{specialist ? t('桶装货搬运、托盘入柜、柜内作业与关门现场。', 'Drum handling, pallet loading, work inside the container and door closing.', 'Manipulación de bidones, carga de palés, trabajo interior y cierre del contenedor.') : t('开柜、卸货、转运。看货物抵达后的实际操作，而不只看起运端装柜。', 'Opening, unloading and transfer. See the handling after arrival, as well as the work at origin.', 'Apertura, descarga y traslado. Ver las operaciones a la llegada, además de las realizadas en origen.')}</p></div>
      {specialist && <div className="freight-drum-gallery">{[
        t('桶装货 · 柜内摆放', 'Drums · Inside the container', 'Bidones · Interior del contenedor'),
        t('桶装货 · 叉车搬运', 'Drums · Forklift handling', 'Bidones · Manipulación con carretilla'),
        t('桶装货 · 柜口视角', 'Drums · Door-side view', 'Bidones · Vista desde la puerta'),
      ].map((caption, i) => <figure key={caption}><a href={`${base}chemical-${i + 1}.webp`} target="_blank" rel="noreferrer"><img src={`${base}chemical-${i + 1}.webp`} alt={caption} loading="lazy" width="1270" height="1700" /></a><figcaption>0{i + 1} / {caption}</figcaption></figure>)}</div>}
      <div className={`freight-arrival-films ${specialist ? 'freight-arrival-three' : ''} ${uaeOnly ? 'freight-arrival-single' : ''}`}>{films.map(([id, caption, duration]) => <figure key={id}><div className="freight-film-top"><span>{caption}</span><span>{duration}</span></div><video controls playsInline muted preload="none" poster={`${base}${id}.jpg`} src={`${base}${id}.mp4`} aria-label={caption} /><figcaption>{caption}</figcaption></figure>)}</div>
    </div>
  </section>;
}
