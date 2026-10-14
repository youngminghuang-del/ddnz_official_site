const copy = {
 en: { title: 'Delivery planning checklist', items: ['Delivery to the agreed address', 'Unloading from the vehicle', 'Moving goods indoors', 'Installation'], note: 'Confirm the scope and responsible party for each step.' },
 ar: { title: 'قائمة مراجعة تخطيط التسليم', items: ['التوصيل إلى العنوان المتفق عليه', 'التفريغ من المركبة', 'نقل البضاعة إلى الداخل', 'التركيب'], note: 'أكّد نطاق العمل والجهة المسؤولة عن كل خطوة.' },
};
export default function GulfDeliveryChecklist({ locale }: { locale: 'en' | 'ar' }) {
 const data = copy[locale];
 return <aside className="gulf-delivery-checklist" data-delivery-checklist aria-labelledby="gulf-delivery-checklist-title">
  <h3 id="gulf-delivery-checklist-title">{data.title}</h3>
  <ol>{data.items.map((item,index) => <li key={item}><span aria-hidden="true">0{index+1}</span>{item}</li>)}</ol>
  <p>{data.note}</p>
 </aside>;
}
