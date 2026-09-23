import { BASIS, estimate, makeBrief } from './model.mjs';
import { EN } from './locales/en.mjs';
import { LOCALIZED_INQUIRY_SOURCE, validateLocalizedHandoff } from './localization.mjs';

export const HANDOFF_KEY = 'ddnz_screen_protector_inquiry_v1';
export const DRAFT_KEY = 'ddnz_screen_protector_plan_v1';
const MAX_AGE = 24 * 60 * 60 * 1000;

// Only user inputs cross the handoff. Prices and totals are recalculated on arrival.
export function validateHandoff(value, now = Date.now(), displayLocale='en') {
  if (!value || value.version !== 1 || value.source !== 'screen_protector_planner'
      || !Number.isFinite(value.createdAt) || now - value.createdAt > MAX_AGE
      || value.createdAt > now + 60_000 || !value.state
      || !Array.isArray(value.state.rows) || value.state.rows.length > 100 || value.state.rows.some(row => !row || typeof row !== 'object')) return null;
  const input = value.state;
  if (!['product', 'model'].includes(input.packing) || !['shipment', 'carton'].includes(input.charging)
      || !['sea', 'air'].includes(input.route)) return null;
  const state = {
    rows: input.rows.map(row => ({ product: row.product, model: String(row.model ?? ''), qty: row.qty })),
    packing: input.packing, charging: input.charging, route: input.route,
    requests: Array.isArray(input.requests) ? [...new Set(input.requests.filter(id => Object.hasOwn(EN.requests, id)))] : [],
  };
  const result = estimate(state.rows, state.packing, state.charging);
  if (!result.valid) return null;
  const selected = result[state.route];
  return {
    version: 1, source: 'screen_protector_planner', createdAt: value.createdAt, basisDate: BASIS.date,
    state, brief: makeBrief(result, state, displayLocale), displayLocale,
    summary: { pieces: result.qty, goodsCny: result.goods, route: state.route, freightCny: selected.fee,
      landedCny: selected.total, cartons: result.cartons, cbm: result.cbm, actualKg: result.actualKg,
      billableKg: result.chargeKg, missingModels: result.missingModels, checks: state.requests.length },
  };
}
export function saveHandoff(storage, state, now = Date.now()) {
  const draft = validateHandoff({ version: 1, source: 'screen_protector_planner', createdAt: now, state }, now);
  if (!draft) return { ok: false, reason: 'invalid' };
  try {
    storage.setItem(HANDOFF_KEY, JSON.stringify({ version: 1, source: draft.source, createdAt: now, state: draft.state }));
    return { ok: true };
  } catch { return { ok: false, reason: 'storage' }; }
}
export function readHandoff(storage, search, now = Date.now(), displayLocale = undefined) {
  const query = new URLSearchParams(search);
  if (query.get('source') === LOCALIZED_INQUIRY_SOURCE && query.get('leadGoal') === 'Product Sourcing') {
    try {
      const raw = storage.getItem(HANDOFF_KEY);
      const plan = raw && raw.length <= 100_000 ? validateLocalizedHandoff(JSON.parse(raw), now) : null;
      if (!plan || plan.locale !== query.get('phoneLocale') || plan.state.destination !== query.get('dest')) return null;
      // Bind the source query to the saved plan first. A quote-page language
      // change may then translate labels without changing buyer-entered text.
      return ['zh','es','ar','ru','fr','pt','tr'].includes(displayLocale)
        ? validateLocalizedHandoff({ ...plan, locale: displayLocale }, now) : plan;
    } catch { return null; }
  }
  if (query.get('source') !== 'screen_protector_planner' || query.get('leadGoal') !== 'Product Sourcing') return null;
  try { const raw = storage.getItem(HANDOFF_KEY); return raw && raw.length <= 100_000 ? validateHandoff(JSON.parse(raw), now, displayLocale) : null; }
  catch { return null; }
}

export function saveLocalizedHandoff(storage, locale, state, now = Date.now()) {
  const plan = validateLocalizedHandoff({ version: 2, source: LOCALIZED_INQUIRY_SOURCE, locale, state, createdAt: now }, now);
  if (!plan) return { ok: false, reason: 'invalid' };
  try {
    storage.setItem(HANDOFF_KEY, JSON.stringify({ version: 2, source: plan.source, locale, state: plan.state, createdAt: now }));
    return { ok: true };
  } catch { return { ok: false, reason: 'storage' }; }
}
