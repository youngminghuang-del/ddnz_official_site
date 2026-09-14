import React, { useState } from 'react';
import { ArrowDown, ArrowUpRight, Plus, Check } from 'lucide-react';
import { copy } from './catalog.mjs';
import { guideUI } from './guide-copy.mjs';
import { devices, powerModels } from './power-guide.mjs';
import { powerScenes, powerScene, sceneCopy } from './power-scenes.mjs';
import { numberInput } from './buying.mjs';

const media = '/outdoor-sourcing-media/';
export default function PowerSceneHero({ locale, sceneId, model, rows, onScenario, onModel, onEditRow, onAction=()=>{}, catalogue }) {
  const c = value => copy(value, locale), t = key => c(sceneCopy[key]), g = key => c(guideUI[key]);
  const [spot, setSpot] = useState('power');
  const scene = powerScene(sceneId), active = scene.hotspots.find(p => p.id === spot) || scene.hotspots[0];
  const device = devices.find(d => d.id === active.id), row = rows.find(r => r.id === active.id);
  const f = n => Number(n).toLocaleString(locale, { maximumFractionDigits: 1 });
  const name = id => id === 'power' ? t('power') : c(devices.find(d => d.id === id).name);
  return <section className="opg-scene-hero">
    <div className="opg-scene-heading"><div><p className="ods-eyebrow">DDNZ / {g('eyebrow')}</p><h1>{t('heading')}</h1></div><div><p>{t('intro')}</p><a className="ods-button" href="#appliance-plan">{g('plan')} <ArrowDown size={18}/></a></div></div>
    <div className="opg-scene-tabs" role="group" aria-label={t('start')}>{powerScenes.map((s, i) => <button type="button" key={s.id} aria-pressed={scene.id === s.id} onClick={() => { setSpot('power'); onScenario(s.id); }} data-power-scene={s.id}><img src={media + s.image.replace('.webp', '-thumb.webp')} alt="" width="78" height="52" loading="lazy"/><span><small>0{i + 1}</small>{c(s.label)}</span><ArrowUpRight size={18} aria-hidden="true"/></button>)}</div>
    <div className="opg-scene-grid">
      <div className="opg-scene-canvas">
        <img className="opg-scene-photo" src={media + scene.image} srcSet={`${media + scene.image.replace('.webp', '-768.webp')} 768w, ${media + scene.image} 1536w`} sizes="(max-width: 900px) 100vw, 850px" alt={c(scene.alt)} width="1536" height="1024" fetchPriority="high"/>
        <div className="opg-scene-shade" aria-hidden="true"/><div className="opg-scene-title"><span>{t('setup')}</span><h2>{c(scene.title)}</h2></div>
        {scene.hotspots.map((point, i) => <button type="button" key={point.id} className="opg-scene-hotspot" style={{ left: `${point.x}%`, top: `${point.y}%` }} aria-label={name(point.id)} aria-pressed={active.id === point.id} aria-controls="power-scene-detail" onClick={() => { setSpot(point.id); onAction('hotspot_open',{deviceId:point.id}); }} data-power-hotspot={point.id}><span>{i + 1}</span></button>)}
        <span className="opg-scene-hint">{t('hint')}</span>
      </div>
      <div className="opg-scene-sidebar">
        <div id="power-scene-detail" className="opg-scene-detail" aria-live="polite"><p className="ods-eyebrow">{active.id === 'power' ? t('power') : t('inspect')}</p><h3>{active.id === 'power' ? t('powerTitle') : c(device.name)}</h3><p>{active.id === 'power' ? t('powerNote') : t('deviceNote')}</p>{row ? <><strong className="opg-hotspot-load"><bdi>{numberInput(row.watts) === null ? '—' : f(numberInput(row.watts))} W × {row.count || '—'}</bdi></strong><button type="button" className={'opg-hotspot-add' + (row.on ? ' is-added' : '')} aria-pressed={row.on} onClick={() => onEditRow(row.id, 'on', !row.on)}>{row.on ? <Check size={18}/> : <Plus size={18}/>} {t(row.on ? 'remove' : 'add')}</button></> : null}<a href="#appliance-plan" className="ods-text-link">{t('edit')} <ArrowDown size={16}/></a></div>
        <div className="opg-scene-reference"><label className="ods-field"><span>{t('reference')}</span><select id="power-guide-model" value={model.id} onChange={e => onModel(e.target.value)}>{powerModels.map(p => <option key={p.id} value={p.id}>{p.model}</option>)}</select></label><div className="opg-scene-product"><img src={media + model.image} alt={model.model} width="200" height="160"/><div><strong><bdi>{f(model.wh)} <small>Wh</small></bdi></strong><strong><bdi>{f(model.watts)} <small>W</small></bdi></strong></div></div><a className="ods-text-link" href={catalogue + '#product-' + model.id}>{g('catalogue')} <ArrowUpRight size={16}/></a></div>
      </div>
    </div>
  </section>;
}
