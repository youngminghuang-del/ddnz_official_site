import { useId } from 'react';

export interface GulfMapNode {
 id: string;
 kind: 'port' | 'city';
 x: number;
 y: number;
 labelX: number;
 labelY: number;
 name: { en: string; ar: string };
 role: { en: string; ar: string };
 source: string;
}
export interface GulfMapData {
 country: { en: string; ar: string };
 outline: string;
 nodes: GulfMapNode[];
 source: { title: string; url: string };
 note: { en: string; ar: string };
}
export function GulfCountryMark({ map, locale }: { map: GulfMapData; locale: 'en' | 'ar' }) {
 return <div className="gulf-country-mark"><svg viewBox="0 0 600 600" aria-hidden="true"><path d={map.outline} fill="currentColor" fillRule="evenodd" /></svg><span><small>{locale === 'ar' ? 'الوجهة' : 'DESTINATION'}</small><strong>{map.country[locale]}</strong></span></div>;
}
export default function GulfDestinationMap({ map, locale }: { map: GulfMapData; locale: 'en' | 'ar' }) {
 const id = useId();
 return <figure className="gulf-map" data-destination-map>
  <div className="gulf-map-heading"><span>{locale === 'ar' ? 'نقاط الوصول' : 'ARRIVAL POINTS'}</span><strong>{map.country[locale]}</strong></div>
  <svg viewBox="0 0 600 600" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
   <title id={`${id}-title`}>{map.country[locale]}</title><desc id={`${id}-desc`}>{map.nodes.map(node => `${node.name[locale]}: ${node.role[locale]}`).join('. ')}. {map.note[locale]}</desc>
   <defs><pattern id={`${id}-grid`} width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="#ded6e5" strokeWidth=".5" /></pattern></defs>
   <rect width="600" height="600" fill={`url(#${id}-grid)`} />
   <path className="gulf-map-outline" d={map.outline} fillRule="evenodd" />
   <g className="gulf-map-north" aria-hidden="true"><path d="M46 73V36m-7 11 7-11 7 11" /><text x="46" y="25" textAnchor="middle">N</text></g>
   {map.nodes.map((node,index) => <g key={node.id}>
    <path d={`M${node.x} ${node.y} L${node.labelX} ${node.labelY}`} fill="none" stroke="#8e789f" strokeWidth="1.5" />
    <>{node.kind === 'port' ? <rect x={node.x-12} y={node.y-12} width="24" height="24" rx="3" fill="#fff7f0" stroke="#c94f2f" strokeWidth="2" /> : <circle cx={node.x} cy={node.y} r="13" fill="#fff7f0" stroke="#c94f2f" strokeWidth="2" />}</>
    <circle cx={node.x} cy={node.y} r="5" fill="#c94f2f" />
    <rect x={node.labelX-20} y={node.labelY-23} width="40" height="40" rx="20" fill="#632b89" />
    <text x={node.labelX} y={node.labelY+4} textAnchor="middle" fill="white" fontSize="19" fontWeight="700" direction="ltr">0{index+1}</text>
   </g>)}
  </svg>
  <ol className="gulf-map-nodes">{map.nodes.map((node,index) => <li key={node.id}><span className="gulf-map-number" aria-hidden="true">0{index+1}</span><div><strong><a href={node.source}>{node.name[locale]}</a></strong><span>{node.role[locale]}</span></div></li>)}</ol>
  <figcaption>{map.note[locale]} <a href={map.source.url}>{locale === 'ar' ? 'مصدر الحدود: ' : 'Outline: '}{map.source.title}</a></figcaption>
 </figure>;
}
