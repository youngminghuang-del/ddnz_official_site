import { useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import type { GeometryCollection, Topology } from 'topojson-specification';
import worldAtlas from 'world-atlas/countries-110m.json';
import { ArrowUpRight } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { buildQuoteHref } from '../lib/quoteLinks';
import copyData from './worldFreightCopy.json';
import nodeData from './worldFreightNodes.json';

const topology = worldAtlas as unknown as Topology;
const countries = feature(topology, topology.objects.countries as GeometryCollection) as unknown as FeatureCollection<Geometry>;
// Rectangular geographic view, cropped below Antarctica and above 76 N.
const projection = geoMercator().scale(175).translate([560, 363]);
const path = geoPath(projection);
const origin: [number, number] = [114.26, 22.57];
const originPoint = projection(origin)!;
const regions = ['middle-east', 'central-asia', 'europe', 'north-america', 'latin-america', 'africa', 'oceania'] as const;
type Region = typeof regions[number];
type Copy = {title:string;eyebrow:string;intro:string;scopeNote:string;regionLabel:string;destinationLabel:string;cta:string;originLabel:string;allRegions:string;regions:Record<Region,string>;nodes:Record<string,string>};
type Node = {id:string;region:Region;coordinates:[number,number];destination:string};
const nodes = nodeData as Node[];
const labelPositions: Record<Region,[number,number]> = {'middle-east':[740,390],'central-asia':[850,125],europe:[540,105],'north-america':[280,115],'latin-america':[285,495],africa:[550,475],oceania:[1010,565]};

export default function WorldFreightMap({language}:{language:Language}) {
 const copy = copyData[language] as Copy;
 const [selected,setSelected]=useState<Region|'all'>('all');
 const visible=selected==='all'?nodes:nodes.filter(n=>n.region===selected);
 const routes=selected==='all'?regions.map(region=>nodes.find(node=>node.region===region)!):visible;
 return <section className="world-freight" dir={language==='ar'?'rtl':'ltr'} aria-labelledby="world-freight-heading">
  <header className="world-freight-heading"><p>{copy.eyebrow}</p><h2 id="world-freight-heading">{copy.title}</h2><p>{copy.intro}</p></header>
  <div className="world-freight-filters" role="group" aria-label={copy.regionLabel}>
   {(['all',...regions] as const).map(region=><button type="button" key={region} aria-pressed={selected===region} onClick={()=>setSelected(region)}>{region==='all'?copy.allRegions:copy.regions[region]}</button>)}
  </div>
  <figure className="world-freight-figure">
   <svg viewBox="0 0 1120 610" role="img" aria-labelledby="world-freight-title world-freight-desc" direction="ltr">
    <title id="world-freight-title">{copy.title} — {selected==='all'?copy.allRegions:copy.regions[selected]}</title><desc id="world-freight-desc">{copy.scopeNote}</desc>
    <defs><clipPath id="world-freight-clip"><rect width="1120" height="610" rx="12"/></clipPath></defs>
    <g clipPath="url(#world-freight-clip)">
     <rect width="1120" height="610" className="world-freight-water"/>
     {countries.features.map(country=><path key={String(country.id)} d={path(country)||undefined} className={String(country.id)==='156'?'world-freight-land world-freight-china':'world-freight-land'}/>)}
     {routes.map(node=>{const end=projection(node.coordinates)!;const mid=[(originPoint[0]+end[0])/2,Math.min(originPoint[1],end[1])-70];return <path key={node.id} className={`world-freight-line ${selected==='all'?'world-freight-line-overview':''}`} d={`M${originPoint} Q${mid} ${end}`}/>;})}
     {nodes.map((node,index)=>{const point=projection(node.coordinates)!;const active=selected==='all'||node.region===selected;const badgeX=point[0]+(node.id==='sydney'?30:node.id==='melbourne'?-30:0);const badgeY=point[1]+(node.id==='sydney'?-35:node.id==='melbourne'?35:index%2===0?35:-35);return <g key={node.id} className={active?'world-freight-pin':'world-freight-pin world-freight-muted'}><circle cx={point[0]} cy={point[1]} r="5"/><title>{copy.nodes[node.id]}</title>{active&&<g className="world-freight-badge"><line x1={point[0]} y1={point[1]} x2={badgeX} y2={badgeY}/><circle cx={badgeX} cy={badgeY} r="16"/><text className="world-freight-number" x={badgeX} y={badgeY+6} textAnchor="middle">{index+1}</text></g>}{selected!=='all'&&active&&<text className="world-freight-city" x={badgeX+(point[0]>800?-25:25)} y={badgeY+6} textAnchor={language==='ar'?(point[0]>800?'start':'end'):(point[0]>800?'end':'start')} direction={language==='ar'?'rtl':'ltr'}>{copy.nodes[node.id]}</text>}</g>;})}
     <g className="world-freight-origin"><circle cx={originPoint[0]} cy={originPoint[1]} r="7"/><text x={originPoint[0]-14} y={originPoint[1]-24} textAnchor="end">{copy.originLabel}</text></g>
     {selected==='all'&&regions.map(region=><text key={region} className={`world-freight-label ${selected!=='all'&&selected!==region?'world-freight-muted':''}`} x={labelPositions[region][0]} y={labelPositions[region][1]} textAnchor="middle" direction={language==='ar'?'rtl':'ltr'}>{copy.regions[region]}</text>)}
    </g>
   </svg>
   <figcaption><span>{copy.scopeNote}</span><a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer">Natural Earth</a></figcaption>
  </figure>
  <div className="world-freight-destinations" aria-label={copy.destinationLabel}>
   {visible.map(node=><a key={node.id} href={buildQuoteHref({language,intent:'Freight Export',source:'homepage_v2_freight',destination:node.destination})}><span><small>{copy.regions[node.region]}</small><strong><span className="world-freight-card-number">{nodes.indexOf(node)+1}</span>{copy.nodes[node.id]}</strong></span><span className="world-freight-cta">{copy.cta}<ArrowUpRight aria-hidden="true"/></span></a>)}
  </div>
 </section>;
}
