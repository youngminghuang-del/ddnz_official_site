type Localized = { en: string; ar: string };
export interface CargoReference {
 id: string;
 src: string;
 srcSet?: string;
 width: number;
 height: number;
 alt: Localized;
 caption: Localized;
 sourceUrl?: string;
 sourceLabel?: string;
}
export default function GulfCargoReferences({ images, country, locale }: { images: CargoReference[]; country: 'qatar' | 'oman'; locale: 'en' | 'ar' }) {
 const title = country === 'qatar' ? { en: 'Supplier orders & cargo details', ar: 'طلبات الموردين وبيانات البضاعة' } : { en: 'Cargo & packing details', ar: 'البضاعة وتفاصيل التعبئة' };
 return <div className="gulf-cargo-references" data-cargo-references={country}>
  <p className="gulf-reference-heading">{title[locale]}</p>
  <div className="gulf-reference-grid">{images.map(image => <figure key={image.id} data-cargo-reference={image.id}>
   <img src={image.src} srcSet={image.srcSet} sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1100px) 42vw, 480px" width={image.width} height={image.height} loading="lazy" decoding="async" alt={image.alt[locale]} />
   <figcaption>{image.caption[locale]}{image.sourceUrl && <a href={image.sourceUrl}>{image.sourceLabel}</a>}</figcaption>
  </figure>)}</div>
 </div>;
}
