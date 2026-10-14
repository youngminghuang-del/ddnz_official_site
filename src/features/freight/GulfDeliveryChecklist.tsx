import type { GulfLocale } from './gulfLocale';
import copy from './gulfDeliveryChecklist.json';
export default function GulfDeliveryChecklist({ locale }: { locale: GulfLocale }) {
 const data = copy[locale];
 return <aside className="gulf-delivery-checklist" data-delivery-checklist aria-labelledby="gulf-delivery-checklist-title">
  <h3 id="gulf-delivery-checklist-title">{data.title}</h3>
  <ol>{data.items.map((item,index) => <li key={item}><span aria-hidden="true">0{index+1}</span>{item}</li>)}</ol>
  <p>{data.note}</p>
 </aside>;
}
