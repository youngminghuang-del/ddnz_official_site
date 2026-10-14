import { useId, useRef, useState, type KeyboardEvent } from 'react';
import content from './qatarCargoGallery.json';

type Group = 'production' | 'style' | 'packing';
export default function QatarCargoGallery({ locale, group }: { locale: 'en' | 'ar'; group: Group }) {
 const config = content.groups.find(item => item.id === group)!;
 const photos = content.images.filter(item => config.imageIds.includes(item.id));
 const [selected, setSelected] = useState(photos.findIndex(item => item.id === config.defaultImageId));
 const buttons = useRef<(HTMLButtonElement | null)[]>([]);
 const id = useId();
 const photo = photos[selected];
 const packing = photo.packingData;
 const ar = locale === 'ar';
 const selectWithKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
  let next = index;
  if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = photos.length - 1;
  else if (event.key === 'ArrowRight') next = (index + (ar ? -1 : 1) + photos.length) % photos.length;
  else if (event.key === 'ArrowLeft') next = (index + (ar ? 1 : -1) + photos.length) % photos.length;
  else return;
  event.preventDefault();setSelected(next);buttons.current[next]?.focus();
 };
 return <div className={`gulf-cargo-references qatar-cargo-gallery qatar-gallery-${group}`} data-qatar-gallery={group}>
  <div className="qatar-gallery-intro"><h3>{config.heading[locale]}</h3><p>{config.intro[locale]}</p></div>
  <div className="qatar-gallery-body"><figure id={`${id}-image`}>
   <div className="qatar-gallery-title"><span dir="ltr">{selected+1} / {photos.length}</span><strong>{photo.title[locale]}</strong></div>
   <div className="qatar-gallery-frame"><img key={photo.id} data-gallery-main data-photo-id={photo.id} src={photo.src} width={photo.width} height={photo.height} alt={photo.alt[locale]} loading="lazy" decoding="async" /></div>
   <figcaption aria-live="polite" aria-atomic="true">{packing ? <dl className="qatar-packing-data">
    <div><dt>{ar ? 'عدد القبعات' : 'Caps shown'}</dt><dd><bdi dir="ltr">{packing.quantity}</bdi></dd></div>
    <div><dt>{ar ? 'أبعاد الصندوق الخارجي' : 'Outer carton'}</dt><dd><bdi dir="ltr">{packing.outerCartonCm.join(' × ')} {ar ? 'سم' : 'cm'}</bdi></dd></div>
    <div><dt>{packing.weightLabel[locale]}</dt><dd><bdi dir="ltr">{packing.productWeightKg} {ar ? 'كجم' : 'kg'}</bdi></dd></div>
   </dl> : <p>{photo.caption[locale]}</p>}{group !== 'production' && <a className="qatar-gallery-full" href={photo.src} target="_blank" rel="noopener noreferrer">{ar ? 'عرض الصورة بالحجم الكامل' : 'View full image'}<span aria-hidden="true"> ↗</span></a>}</figcaption>
  </figure>
  <div className="qatar-gallery-thumbnails" role="group" aria-label={config.heading[locale]}>
   {photos.map((item,index) => <button key={item.id} type="button" ref={element => { buttons.current[index] = element; }} aria-controls={`${id}-image`} aria-pressed={selected === index} aria-label={`${index+1}: ${item.title[locale]}`} onClick={() => setSelected(index)} onKeyDown={event => selectWithKey(event,index)}>
    <img src={item.thumbnail} width={item.width} height={item.height} alt="" loading="lazy" decoding="async" /><span aria-hidden="true">{index+1}</span>
   </button>)}
  </div></div>
 </div>;
}
