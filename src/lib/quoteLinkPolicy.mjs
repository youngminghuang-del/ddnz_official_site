import { QUOTE_ENUMS } from './quoteLinkEnums.mjs';
const BASE = 'https://www.ddnzglobal.com';
const PATH = /^\/(?:zh-cn\/|es\/|ar\/|ru\/|fr\/|pt\/|tr\/)?get-a-quote\/?$/;
const PREFIX = 'ddnz_quote_context_v2:';
const TTL = 10 * 60 * 1000;
const TEXT_KEYS = new Set(['overviewBrief','productScope','industry','notes','article','country','projectNeed','buyingStage','orderVolume','sourcingPath','buyerType','skuCount','quantityPerSku','freightPreference','destinationText','utm_source','utm_medium','utm_campaign','utm_content','utm_term']);
let memoryDraft = null;
function baseUrl() { return typeof window === 'undefined' ? BASE : window.location.origin; }
function quoteUrl(value) {
  if (typeof value !== 'string' || !value || /^(?:#|mailto:|tel:|javascript:)/i.test(value)) return null;
  try {
    const u = new URL(value, baseUrl());
    if (!['http:','https:'].includes(u.protocol) || ![new URL(baseUrl()).hostname,'www.ddnzglobal.com','ddnzglobal.com'].includes(u.hostname) || !PATH.test(u.pathname)) return null;
    return u;
  } catch { return null; }
}
export function sanitizeQuoteContext(input) {
  const out = Object.create(null);
  for (const [key, raw] of Object.entries(input || {})) {
    if (typeof raw !== 'string') continue;
    const value = raw.slice(0, 8000);
    if (Object.hasOwn(QUOTE_ENUMS, key)) {
      if (QUOTE_ENUMS[key].includes(value)) out[key] = value;
      else if (key === 'dest') out.destinationText = value;
      else if (key === 'subcategory') out.productScope = [out.productScope,value].filter(Boolean).join('\n').slice(0,8000);
    } else if (TEXT_KEYS.has(key)) out[key] = value;
  }
  return out;
}
// Runs before React creates an anchor. Raw strings are treated as legacy context
// inputs; only the query-free path is ever emitted as an href/to.
export function quoteLinkProps(value, prop = 'href') {
  if (value && typeof value === 'object' && typeof value.pathname === 'string') {
    const result = quoteLinkProps(value.pathname + (value.search || '') + (value.hash || ''), prop);
    if (!quoteUrl(value.pathname)) return { [prop]: value };
    const target = new URL(result[prop], baseUrl());
    return { ...result, [prop]: { ...value, pathname: target.pathname, search: '', hash: target.hash } };
  }
  const u = quoteUrl(value);
  if (!u) return { [prop]: value };
  const href = u.pathname.replace(/\/?$/, '/') + u.hash;
  if (!u.search) return { [prop]: href };
  return { [prop]: href, 'data-quote-context': JSON.stringify(sanitizeQuoteContext(Object.fromEntries(u.searchParams))) };
}
function storage(kind) { try { return typeof window === 'undefined' ? null : window[kind]; } catch { return null; } }
export function saveQuoteContext(path, context, now = Date.now()) {
  const u = quoteUrl(path); if (!u) return false;
  const target = u.pathname.replace(/\/?$/, '/');
  const draft = { version: 2, target, createdAt: now, values: sanitizeQuoteContext(context) };
  memoryDraft = draft;
  let persisted = false;
  for (const kind of ['sessionStorage','localStorage']) {
    try { storage(kind)?.setItem(PREFIX+target, JSON.stringify(draft)); persisted = !!storage(kind) || persisted; } catch { /* A blocked store does not block navigation. */ }
  }
  return persisted;
}
export function readQuoteContext(path, now = Date.now()) {
  const u = quoteUrl(path); if (!u) return null;
  const target = u.pathname.replace(/\/?$/, '/'); const candidates = [];
  for (const kind of ['sessionStorage','localStorage']) {
    try { const raw = storage(kind)?.getItem(PREFIX+target); if (raw) candidates.push(JSON.parse(raw)); } catch { /* Ignore malformed or blocked stores. */ }
  }
  if (memoryDraft) candidates.push(memoryDraft);
  const valid = candidates.filter(d => d?.version===2 && d.target===target && Number.isFinite(d.createdAt) && now>=d.createdAt && now-d.createdAt<=TTL).sort((a,b)=>b.createdAt-a.createdAt);
  return valid.length ? sanitizeQuoteContext(valid[0].values) : null;
}
export function clearQuoteContext(path) {
  const u = quoteUrl(path); if (!u) return;
  const target = u.pathname.replace(/\/?$/, '/');
  for (const kind of ['sessionStorage','localStorage']) { try { storage(kind)?.removeItem(PREFIX+target); } catch {} }
  if (memoryDraft?.target===target) memoryDraft = null;
}
export function quoteParamsForLocation(search, path) {
  // Existing bookmarked / externally linked parameter URLs keep their behavior.
  const params = new URLSearchParams(search);
  if (params.toString()) return params;
  const values = readQuoteContext(path);
  return values ? new URLSearchParams({ ...values, _ddnz_handoff:'1' }) : params;
}
export function navigateQuoteContext(value) {
  const props = quoteLinkProps(value);
  if (props['data-quote-context']) saveQuoteContext(props.href, JSON.parse(props['data-quote-context']));
  return props.href;
}
export function captureQuoteLink(event) {
  const anchor = event.target?.closest?.('a[data-quote-context]');
  if (!anchor || anchor.hasAttribute('download')) return;
  try { saveQuoteContext(anchor.getAttribute('href'), JSON.parse(anchor.getAttribute('data-quote-context'))); } catch {}
}
export function installQuoteLinkHandoff() {
  if (typeof document === 'undefined') return () => {};
  for (const kind of ['sessionStorage','localStorage']) {
    try {
      const s = storage(kind);
      for (let i = (s?.length || 0) - 1; i >= 0; i--) {
        const key = s.key(i); if (!key?.startsWith(PREFIX)) continue;
        let draft; try { draft = JSON.parse(s.getItem(key)); } catch {}
        if (!draft || !Number.isFinite(draft.createdAt) || Date.now() - draft.createdAt > TTL) s.removeItem(key);
      }
    } catch { /* Optional browser storage. */ }
  }
  // Capture before React Router/native navigation, including middle-click/new-tab.
  for (const type of ['click','auxclick','contextmenu']) document.addEventListener(type, captureQuoteLink, true);
  return () => { for (const type of ['click','auxclick','contextmenu']) document.removeEventListener(type, captureQuoteLink, true); };
}
const escapeAttribute = s => String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const decodeAttribute = s => s.replace(/&(?:amp|quot|apos|lt|gt|#39|#\d+|#x[0-9a-f]+);/gi, m => {
  const named = {'&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>','&#39;':"'"};
  return named[m.toLowerCase()] ?? String.fromCodePoint(m[2].toLowerCase()==='x'?parseInt(m.slice(3,-1),16):parseInt(m.slice(2,-1),10));
});
export function normalizeQuoteHtml(html) {
  // Match only actual anchor opening tags, not JSON-LD URLs, scripts or prose.
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>|<style\b[^>]*>[\s\S]*?<\/style\s*>|<!--[^]*?-->|<a\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi, tag => {
    if (!/^<a\s/i.test(tag)) return tag;
    const match = /\shref\s*=\s*(["'])(.*?)\1/i.exec(tag); if (!match) return tag;
    const original = decodeAttribute(match[2]); const props = quoteLinkProps(original);
    if (props.href === original && !props['data-quote-context']) return tag;
    let result = tag.replace(match[0], ` href="${escapeAttribute(props.href)}"`);
    if (props['data-quote-context']) {
      result = result.replace(/\sdata-quote-context\s*=\s*(["']).*?\1/gi,'');
      result = result.replace(/>$/, ` data-quote-context="${escapeAttribute(props['data-quote-context'])}">`);
    }
    return result;
  });
}
