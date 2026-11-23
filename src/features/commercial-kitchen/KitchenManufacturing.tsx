import copy from '../refrigeration/merchandising-copy.json';
import type {MerchandisingLocale} from '../refrigeration/MerchandisingContent';
import {localizedProductPath} from '../../lib/productLocalization.mjs';

const steps = [
  {title:'configTitle', text:'configBody', image:'/images/product-showcase/refrigeration/merchandising/cake-counter-straight.webp', caption:'configCaption'},
  {title:'inspectTitle', text:'inspectBody', image:'/commercial-kitchen-media/factory.webp', caption:'inspectCaption'},
  {title:'packTitle', text:'packBody', image:'/images/product-showcase/refrigeration/ice-maker-packout-source.webp', caption:'packCaption'},
] as const;

export default function KitchenManufacturing({locale = 'en'}:{locale?:MerchandisingLocale}) {
  const t = copy[locale];
  return <section className="section wrap" id="commercial-kitchen-manufacturing">
    <h2>{t.factoryTitle}</h2>
    <p>{t.factoryBody}</p>
    <div className="mt-5 grid gap-4 md:grid-cols-3">
      {steps.map(({title,text,image,caption}) => <article key={title} className="ddnz-control overflow-hidden border border-slate-200 bg-white">
        <figure><img src={image} alt="" width="640" height="390" className="aspect-video w-full object-contain" loading="lazy" />
          <figcaption className="px-5 pt-2 text-xs text-slate-600">{t[caption]}</figcaption></figure>
        <div className="p-5"><h3>{t[title]}</h3><p className="mt-2 leading-7">{t[text]}</p></div>
      </article>)}
    </div>
    <div className="mt-5 flex flex-wrap gap-5">
      <a className="text-link" href={localizedProductPath('/refrigeration-equipment/#display-merchandising', locale)}>{t.factoryLink} ↗</a>
      <a className="text-link" href={localizedProductPath('/sourcing/kitchen-equipment-for-distributors/', locale)}>{t.dealerLink} ↗</a>
      <a className="text-link" href={localizedProductPath('/sourcing/restaurant-project-equipment/', locale)}>{t.buyerLink} ↗</a>
    </div>
  </section>;
}
