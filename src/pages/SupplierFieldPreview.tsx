import { FieldGallery } from './ServiceMotion';
import { useState } from 'react';
import { Check, SlidersHorizontal } from 'lucide-react';

const stages = [
  {label:'Product fit', title:'Start with the product.', body:'Compare materials, features and packaging against your buying brief.', tags:['Materials','Features','Packing']},
  {label:'Price & MOQ', title:'Make quotes comparable.', body:'Review unit price, minimum order quantity and lead time on the same basis.', tags:['Unit price','MOQ','Lead time']},
  {label:'Samples', title:'Know what to check next.', body:'Confirm sample requirements and the points to review before a bulk order.', tags:['Sample scope','Quality points','Next steps']},
];

export default function SupplierFieldPreview(_props:{image:string;alt:string}) {
  const [active,setActive] = useState(0);
  const stage = stages[active];
  return <figure className="sf-story" aria-label="Supplier visit and comparison process">
    <FieldGallery />
    <figcaption className="sf-desk">
      <div className="sf-desk-heading"><SlidersHorizontal size={16} aria-hidden="true" /><span>WHAT WE COMPARE</span><small>0{active+1} / 03</small></div>
      <div className="sf-tabs" role="group" aria-label="Comparison topics">{stages.map((item,index)=><button type="button" key={item.label} aria-pressed={active===index} onClick={()=>setActive(index)}>{item.label}</button>)}</div>
      <div className="sf-panel" aria-live="polite"><strong>{stage.title}</strong><p>{stage.body}</p><div>{stage.tags.map(tag=><span key={tag}><Check size={12} aria-hidden="true" />{tag}</span>)}</div></div>
    </figcaption>
  </figure>;
}
