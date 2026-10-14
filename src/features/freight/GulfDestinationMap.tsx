import { useId } from 'react';
import regions from './gulfRegionalMaps.json';

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
 const country = map.country.en.toLowerCase() as 'qatar' | 'oman';
 const region = regions[country];
 const locationUrl = (coordinates: number[]) => `https://www.google.com/maps/search/?${new URLSearchParams({ api: '1', query: `${coordinates[1]},${coordinates[0]}` })}`;
 return <figure className="gulf-map gulf-regional-map" data-destination-map data-regional-map={country}>
  <div className="gulf-map-heading"><span>{locale === 'ar' ? 'الموقع الإقليمي' : 'REGIONAL CONTEXT'}</span><strong>{map.country[locale]}</strong></div>
  <svg viewBox="0 0 800 600" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
   <title id={`${id}-title`}>{map.country[locale]}</title><desc id={`${id}-desc`}>{map.nodes.map(node => `${node.name[locale]}: ${node.role[locale]}`).join('. ')}. {map.note[locale]}</desc>
   <image href={`/media/freight-20261014-round4/${country}-regional.svg`} width="800" height="600" />
   <g className="gulf-map-north" aria-hidden="true"><path d="M46 83V46m-7 11 7-11 7 11" /><text x="46" y="33" textAnchor="middle">N</text></g>
   {region.labels.map(label => <text className="gulf-region-label" key={label.name.en} x={label.x} y={label.y} textAnchor="middle" direction={locale === 'ar' ? 'rtl' : 'ltr'}>{label.name[locale]}</text>)}
   {region.nodes.map(point => {
    const node = map.nodes.find(node => node.id === point.id)!;
    return <g key={node.id} data-map-point={node.id}>
     <path d={`M${point.x} ${point.y} L${point.labelX} ${point.labelY}`} fill="none" stroke="#86609e" strokeWidth="1.5" />
     <circle cx={point.x} cy={point.y} r="8" fill="#763c9c" stroke="white" strokeWidth="3" />
     <text className="gulf-point-label" x={point.labelX} y={point.labelY} textAnchor="middle" direction={locale === 'ar' ? 'rtl' : 'ltr'}>{node.name[locale]}</text>
    </g>;
   })}
  </svg>
  <ol className="gulf-map-nodes">{map.nodes.map((node,index) => <li key={node.id}><span className="gulf-map-number" aria-hidden="true">0{index+1}</span><div><strong>{node.name[locale]}</strong><span>{node.role[locale]}</span><a data-map-node={node.id} href={locationUrl(region.nodes.find(point => point.id === node.id)!.coordinates)} target="_blank" rel="noopener noreferrer">{locale === 'ar' ? 'افتح خريطة الموقع' : 'Open location map'} ↗</a></div></li>)}</ol>
  <figcaption>{map.note[locale]} <a href={map.source.url}>{locale === 'ar' ? 'مصدر الحدود: ' : 'Boundaries: '}{map.source.title}</a></figcaption>
 </figure>;
}
