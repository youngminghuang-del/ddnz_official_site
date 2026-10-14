import { useId, useRef, useState, type KeyboardEvent } from 'react';
import content from './omanCargoGallery.json';
const photos = content.images;

export default function OmanCargoGallery({ locale }: { locale: 'en' | 'ar' }) {
 const [selected, setSelected] = useState(0);
 const buttons = useRef<(HTMLButtonElement | null)[]>([]);
 const id = useId();
 const photo = photos[selected];
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
 return <div className="gulf-cargo-references oman-cargo-gallery" data-oman-gallery>
  <p className="gulf-reference-heading">{content.galleryTitle[locale]}</p>
  <figure id={`${id}-image`}>
   <div className="oman-gallery-frame"><img key={photo.id} data-gallery-main src={photo.src} width={photo.width} height={photo.height} alt={photo.alt[locale]} loading="lazy" decoding="async" /><span className="oman-gallery-overlay">{photo.title[locale]}</span></div>
   <figcaption aria-live="polite" aria-atomic="true"><span className="oman-gallery-count" dir="ltr">{selected+1} / {photos.length}</span><p>{photo.caption[locale]}</p></figcaption>
  </figure>
  <div className="oman-gallery-thumbnails" role="group" aria-label={ar ? 'اختر صورة البضاعة أو التعبئة' : 'Choose a cargo or packing photo'}>
   {photos.map((item,index) => <button key={item.id} type="button" ref={element => { buttons.current[index] = element; }} aria-controls={`${id}-image`} aria-pressed={selected === index} aria-label={`${index+1}: ${item.title[locale]}`} onClick={() => setSelected(index)} onKeyDown={event => selectWithKey(event,index)}>
    <img src={item.thumbnail} width={item.width} height={item.height} alt="" loading="lazy" decoding="async" /><span aria-hidden="true">{index+1}</span>
   </button>)}
  </div>
 </div>;
}
