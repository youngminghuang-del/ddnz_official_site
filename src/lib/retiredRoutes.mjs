// Exact legacy URL aliases. HTTP 301s are configured at the Cloudflare edge;
// generators use these targets directly so new internal links avoid redirects.
export const retiredRoutes = Object.freeze({
 '/zh': '/zh-cn/',
 '/blog/turkey-kitchen-equipment-dealers-china-sourcing-margin-checklist': '/sourcing/commercial-kitchen-equipment-from-china/',
 '/blog/commercial-kitchen-equipment-china-nigeria-dealer-first-container': '/sourcing/kitchen-equipment-for-distributors/',
 '/blog/portable-power-stations-china-dealer-range-camping-outage-backup': '/portable-power/selection-guide/',
 '/screen-protector-media/media/001-drop-ball-impact.mp4/': '/screen-protector-media/media/001-drop-ball-impact.mp4',
});
export function repairedInternalHref(value, base='https://www.ddnzglobal.com') {
 if(typeof value!=='string'||!value||value.startsWith('#'))return value;
 try {
  const u=new URL(value,base);
  if(!['http:','https:'].includes(u.protocol)||![new URL(base).hostname,'www.ddnzglobal.com','ddnzglobal.com'].includes(u.hostname))return value;
  const target=retiredRoutes[u.pathname]||retiredRoutes[u.pathname.replace(/\/$/,'')];
  return target?target+u.search+u.hash:value;
 }catch{return value;}
}
