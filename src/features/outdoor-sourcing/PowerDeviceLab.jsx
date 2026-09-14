import React from 'react';
import { copy } from './catalog.mjs';
import { devices } from './power-guide.mjs';
import { guideUI } from './guide-copy.mjs';
import { sceneCopy } from './power-scenes.mjs';

const shapes = {
  light: <><path d="M15 31h18M17 37h14M24 6a12 12 0 0 1 8 21c-2 2-2 4-2 4H18s0-2-2-4a12 12 0 0 1 8-21Z"/><path d="M7 10 4 7m37 3 3-3M4 22H1m46 0h-3"/></>,
  phone: <><rect x="14" y="4" width="20" height="39" rx="4"/><path d="M20 9h8M22 37h4"/></>,
  router: <><rect x="6" y="26" width="36" height="15" rx="4"/><path d="M12 26V12m24 14V12M17 14q7-7 14 0m-11 4q4-4 8 0M12 34h1m6 0h1m6 0h10"/></>,
  laptop: <><rect x="9" y="8" width="30" height="24" rx="2"/><path d="M5 39h38l-4-7H9ZM19 35h10"/></>,
  projector: <><rect x="5" y="14" width="38" height="24" rx="5"/><circle cx="31" cy="26" r="6"/><path d="M10 21h9m-9 5h9m-9 5h6M11 38v3m26-3v3"/></>,
  fridge: <><rect x="10" y="4" width="28" height="39" rx="4"/><path d="M10 19h28M16 9v5m0 10v10M14 43v2m20-2v2"/></>,
  kettle: <><path d="M12 15h21v20a7 7 0 0 1-7 7h-7a7 7 0 0 1-7-7ZM16 15v-4h13v4M12 19 4 15l8 17M33 18h4a7 7 0 0 1 0 14h-4M19 5V2m8 3V2"/></>,
  custom: <><rect x="7" y="7" width="34" height="34" rx="7"/><path d="M16 24h16M24 16v16"/></>,
};
export function DeviceIcon({ id }) { return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[id] || shapes.custom}</svg>; }
export default function PowerDeviceCards({ rows, locale, onEdit }) {
  const c = value => copy(value, locale), t = key => c(guideUI[key]);
  return <div className="opg-device-grid">{rows.map(row => { const d = devices.find(x => x.id === row.id); return <article className={'opg-device-card' + (row.on ? ' is-selected' : '')} key={row.id} data-device-card={row.id}>
    <label className="opg-device-toggle" htmlFor={'power-device-' + row.id}><input type="checkbox" id={'power-device-' + row.id} checked={row.on} onChange={e => onEdit(row.id, 'on', e.target.checked)}/><DeviceIcon id={row.id}/><span>{c(d.name)}</span><small>{c(sceneCopy[row.on ? 'on' : 'off'])}</small></label>
    <div className="opg-device-values"><label><span>{t('watts')}</span><input id={'power-watts-' + row.id} aria-label={c(d.name) + ' · ' + t('watts')} inputMode="decimal" value={row.watts} disabled={!row.on} onChange={e => onEdit(row.id, 'watts', e.target.value)}/></label><label><span>{t('count')}</span><input id={'power-count-' + row.id} aria-label={c(d.name) + ' · ' + t('count')} inputMode="numeric" value={row.count} disabled={!row.on} onChange={e => onEdit(row.id, 'count', e.target.value)}/></label></div>
  </article>; })}</div>;
}
export function PowerSourceVisual({ model, rows, result, locale }) {
  const selected = rows.filter(row => row.on), c = value => copy(value, locale);
  return <div className={'opg-source-visual' + (result.status === 'complete' && result.overload ? ' is-over' : '')}>
    <div className="opg-lab-battery"><strong><bdi>{model.wh.toLocaleString(locale)} <small>Wh</small></bdi></strong><span>{c(sceneCopy.stored)}</span></div>
    <div className={'opg-source-wire' + (selected.length ? ' is-connected' : '')} aria-hidden="true"><i/></div>
    <div className="opg-connected-devices" aria-label={c(sceneCopy.selected)}>{selected.length ? selected.slice(0, 3).map(row => <span key={row.id} title={c(devices.find(d => d.id === row.id).name)}><DeviceIcon id={row.id}/><span className="opg-visually-hidden">{c(devices.find(d => d.id === row.id).name)}</span></span>) : <small>{c(sceneCopy.empty)}</small>}{selected.length > 3 ? <span className="opg-device-overflow">+{selected.length - 3}</span> : null}</div>
  </div>;
}
