import overrides from '../data/seoTitleOverrides.json' with { type: 'json' };
export function normalizeSeoTitle(value) {
  return String(value).trim().replace(/\bDDNZ Global(?: Insights)?\b/g, 'DDNZ')
    .replace(/\s*[|｜]\s*(?:DDNZ|华正邦泰(?:国际货运)?)\s*$/, '')
    .replace(/^DDNZ\s*[|｜]\s*/, '').trim() + ' | DDNZ';
}
export function resolveSeoTitle(pathname, fallback) {
  const key='/' + String(pathname).split('?')[0].split('/').filter(Boolean).join('/');
  return normalizeSeoTitle(overrides[key==='/'?key:key+'/'] || fallback);
}
