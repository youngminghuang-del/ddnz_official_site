import {useId,useState} from 'react';
import type {MarketCountry} from './MarketFreightContent';
const root='/media/freight-20261014-round19/';
const portSource='https://www.gob.pe/institucion/mtc/noticias/1182446-mtc-otorga-al-terminal-portuario-de-chancay-la-licencia-para-el-inicio-oficial-de-sus-operaciones';
type Slide={title:string;image:string;caption:string;video?:string;source?:string};
const galleries:Record<MarketCountry,Slide[]>={
 nigeria:[
  {title:'Container unloading in Lagos',image:root+'lagos-unloading.jpg',video:root+'lagos-unloading.mp4',caption:'Lagos site record: unloading and warehouse intake. Match package counts and visible condition to the receiving list.'},
  {title:'Cargo transfer in Lagos',image:root+'lagos-transfer.jpg',video:root+'lagos-transfer.mp4',caption:'Lagos site record: cargo transfer. Confirm the collection vehicle, handling needs and onward receiving point.'},
  {title:'Collection registration in Lagos',image:root+'lagos-collection.jpg',video:root+'lagos-collection.mp4',caption:'Lagos site record: collection registration. Agree the collection reference and receiving contact before handover.'},
 ],
 peru:[
  {title:'Pallets and cargo restraint',image:'/images/operations/peru-tile-loading-case.webp',caption:'Loading reference: palletised cargo, wrapping and strapping. Use measured pallet dimensions and gross weight for the freight review.'},
  {title:'Chancay port, Peru',image:root+'chancay.jpeg',caption:'Destination context: Chancay port. Confirm the proposed gateway and receiving arrangements for the shipment.',source:portSource},
 ],
};
export function MarketGallery({country}:{country:MarketCountry}) {
 const slides=galleries[country];const [index,setIndex]=useState(0);const slide=slides[index];const id=useId();
 return <div className={`market-gallery market-gallery-${country}`}>
  <figure id={id}><div className="market-gallery-title"><span>{index+1} / {slides.length}</span><strong>{slide.title}</strong></div>
   {slide.video?<video key={slide.video} controls playsInline preload="none" poster={slide.image} aria-label={slide.title}><source src={slide.video} type="video/mp4"/><track kind="captions" src={slide.video.replace('.mp4','.en.vtt')} srcLang="en" label="English" default/></video>:<img src={slide.image} alt={slide.title} loading="lazy"/>}
   <figcaption><p>{slide.caption}</p>{slide.video?<span className="market-media-note">Silent footage · English context captions</span>:<a href={slide.image} target="_blank" rel="noreferrer">View full image ↗</a>}{slide.source&&<a href={slide.source} target="_blank" rel="noreferrer">Photo: Peru Ministry of Transport and Communications ↗</a>}</figcaption>
  </figure>
  <div className="market-gallery-controls" role="group" aria-label="Choose a cargo or destination view">{slides.map((item,i)=><button key={item.title} type="button" aria-pressed={index===i} aria-controls={id} onClick={()=>setIndex(i)}><img src={item.image} alt="" loading="lazy"/><span>{String(i+1).padStart(2,'0')} · {item.title}</span></button>)}</div>
 </div>;
}
export function MarketOfficialResources({country}:{country:MarketCountry}) {
 const nigeria=country==='nigeria';
 const cards=nigeria?[
  {logo:'son.png',name:'Standards Organisation of Nigeria',role:'Product conformity · SONCAP',text:'Check whether the actual product falls within SONCAP scope and prepare the applicable product certification before dispatch.',url:'https://son.gov.ng/soncapservice/'},
  {logo:'npa.png',name:'Nigerian Ports Authority',role:'Port and gateway information',text:'Use official port information when confirming the proposed arrival gateway. Terminal handling, release and local collection remain separate arrangements.',url:'https://nigerianports.gov.ng/'},
 ]:[{logo:'sunat.gif',name:'SUNAT',role:'Customs and importer information',text:'Review RUC status, product classification and the commercial and transport documents with the importer before shipping.',url:'https://www.sunat.gob.pe/legislacion/procedim/despacho/importacion/importac/procGeneral/despa-pg.01.htm'}];
 return <section className="market-official" data-customs-resources aria-label="Official import and port resources"><h3>Official import & port resources</h3><div className="market-official-grid">{cards.map(card=><article key={card.name}><div className="market-official-logo"><img src={root+card.logo} loading="lazy" alt={card.name}/></div><h4>{card.name}</h4><strong>{card.role}</strong><p>{card.text}</p><a href={card.url} target="_blank" rel="noreferrer">Official guidance ↗</a></article>)}</div>{nigeria&&<a className="market-authority-link" href="https://customs.gov.ng/" target="_blank" rel="noreferrer">Nigeria Customs Service · import procedures ↗</a>}<small>Official reference resources; marks identify the respective organisations.</small></section>;
}
export function MarketRouteMap({country}:{country:MarketCountry}) {
 const peru=country==='peru';const cities=peru?['Callao port, Peru','Chancay port, Peru','Lima, Peru']:['Lagos Port Complex, Nigeria','Onitsha, Nigeria','Kano, Nigeria'];
 return <figure className="market-route-map"><div className="market-gallery-title"><span>DESTINATION CONTEXT</span><strong>{peru?'Peru':'Nigeria'}</strong></div><img src={root+country+'-map.svg'} alt={peru?'Peru country outline with Callao gateway marked':'Nigeria country outline with Lagos gateway marked'} loading="lazy"/><figcaption><p>Locate the gateway, then confirm the collection point or final receiving address.</p><div>{cities.map(city=><a key={city} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city)}`} target="_blank" rel="noreferrer">{city} ↗</a>)}</div><small>Geographic context, not a sailing itinerary. <a href="https://www.naturalearthdata.com/">Boundaries: Natural Earth</a>.</small></figcaption></figure>;
}
export function MarketJourney({country}:{country:MarketCountry}) {
 const stages=country==='peru'?['Check each pallet','Confirm importer data','Review freight & gateway','Arrange unloading']:['List supplier orders','Reconcile arrivals','Confirm import readiness','Agree the handover'];
 return <ol className="market-journey" aria-label="Shipment preparation stages">{stages.map((stage,i)=><li key={stage}><span>0{i+1}</span><strong>{stage}</strong></li>)}</ol>;
}

export function NigeriaTileCase() {
 const [selected,setSelected]=useState(2);
 const photos=[{title:'Tile cartons before reinforcement',caption:'Review carton condition, tile dimensions and edge protection before agreeing the export packing.'},{title:'Large-format ceramic tiles',caption:'Check tile size and handling needs. Confirm the final packed dimensions and gross weight after reinforcement.'},{title:'Wrapped and reinforced cargo',caption:'Wrapped cargo, straps, protective frames and fragile markings. Agree pallet or crate construction and handling requirements before collection.'}];
 const photo=photos[selected];const src=root+`ceramic-tiles-${selected+1}.jpg`;const id=useId();
 return <section className="market-tile-case" aria-label="Nigeria ceramic tile shipment case"><p className="freight-kicker">NIGERIA · CERAMIC TILE CASE</p><h3>Three checks before a first shipment to Africa</h3><p>A customer shipping ceramic tiles to Nigeria initially expected the same arrangements as a Southeast Asia shipment. The review focused on heavy-cargo charging, certification and protective packing.</p>
 <div className="market-gallery"><figure id={id}><div className="market-gallery-title"><span>{selected+1} / 3</span><strong>{photo.title}</strong></div><img src={src} alt={photo.title} loading="lazy"/><figcaption><p>{photo.caption}</p><a href={src} target="_blank" rel="noreferrer">View full image ↗</a></figcaption></figure><div className="market-gallery-controls" role="group" aria-label="Ceramic tile case photos">{photos.map((item,i)=><button key={item.title} type="button" aria-controls={id} aria-pressed={selected===i} onClick={()=>setSelected(i)}><img src={root+`ceramic-tiles-${i+1}.jpg`} alt="" loading="lazy"/><span>{item.title}</span></button>)}</div></div>
 <div className="market-case-checks"><article><h4>01 / Check the charging basis</h4><p>This shipment: <strong>4,719 kg · 3.5 CBM</strong>. The quoted heavy-cargo conversion was <strong>500 kg per chargeable unit</strong>.</p><p className="market-case-formula">4,719 ÷ 500 = 9.438 ≈ <strong>9.44 units</strong></p><p>That is about 2.70 times the volume-only quantity of 3.5. This is the calculation for this quotation, not a universal sea-freight tariff. Confirm the conversion, rounding, minimums and local charges in writing.</p></article>
 <article><h4>02 / Prepare SONCAP before shipment</h4><p>Check the tile specification and HS code with the importer and certification provider. For regulated goods, prepare the applicable testing and Product Certificate (PC), then the shipment’s SONCAP Certificate (SC). Align importer details across certification and shipping documents.</p><a href="https://son.gov.ng/soncap-faq/" target="_blank" rel="noreferrer">SON: pre-shipment certification guidance ↗</a></article>
 <article><h4>03 / Protect the tiles for handling</h4><p>Review pallets or crates, corner and edge protection, wrapping and strapping. Confirm lifting access, stacking restrictions and the unloading plan. Photograph the finished packing before dispatch.</p></article></div></section>;
}
