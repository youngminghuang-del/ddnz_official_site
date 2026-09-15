import { EN } from '../screen-protectors/locales/en.mjs';
import { PHONE_LOCALES } from '../screen-protectors/locales/localized.mjs';
import { productById as mobileProductById, copyFor } from './catalog.mjs';
import { PRODUCTS } from '../screen-protectors/calculator.mjs';
const t=(en,es,ar)=>({en,es,ar});
export const mixedCopy={
 title:t('Your mobile accessories order','Su pedido de accesorios para móviles','طلب إكسسوارات الهاتف'),
 addModel:t('Add another model / colour','Añadir otro modelo / color','إضافة طراز أو لون آخر'),
 scope:t('Minimums apply to each product and model. Combining products does not reduce a supplier’s minimum. Samples, mixed models, custom packaging, inspection and destination shipping require confirmation.','Los mínimos se aplican por producto y modelo. Combinar productos no reduce el mínimo del proveedor. Las muestras, modelos combinados, embalaje personalizado, inspección y envío al destino requieren confirmación.','تطبق الحدود الدنيا على كل منتج وطراز. جمع المنتجات لا يخفض الحد الأدنى للمورد. تخضع العينات وخلط الطرازات والتغليف المخصص والفحص والشحن إلى الوجهة للتأكيد.'),
 perModel:t('pieces per phone model','piezas por modelo de móvil','قطعة لكل طراز هاتف'),
 perProduct:t('pieces across this product only','piezas de este producto únicamente','قطعة من هذا المنتج فقط'),
 pending:t('Minimum by model / colour and mixed-order terms: to confirm.','Mínimo por modelo / color y condiciones del pedido combinado: por confirmar.','الحد الأدنى لكل طراز أو لون وشروط الطلب المختلط: للتأكيد.'),
 below:t('Below this product’s published minimum; supplier approval is required.','Por debajo del mínimo publicado de este producto; requiere aprobación del proveedor.','أقل من الحد الأدنى المنشور لهذا المنتج؛ يلزم موافقة المورد.'),
 reference:t('Product reference only; packaging as listed. Inspection, custom packaging, freight and taxes quoted separately. Reference: 11 September 2026.','Referencia del producto; embalaje según la ficha. Inspección, embalaje personalizado, flete e impuestos se cotizan por separado. Referencia: 11 de septiembre de 2026.','سعر مرجعي للمنتج مع التغليف المذكور. تسعّر تكاليف الفحص والتغليف المخصص والشحن والضرائب بشكل منفصل. المرجع: 11 سبتمبر 2026.'),
 storage:t('Your browser could not save this request. Keep this page open and copy the preview before leaving.','El navegador no pudo guardar la solicitud. Mantenga esta página abierta y copie la vista previa antes de salir.','تعذر على المتصفح حفظ الطلب. أبق هذه الصفحة مفتوحة وانسخ المعاينة قبل المغادرة.'),
};
export const filmProducts=Object.entries(PRODUCTS).map(([key,p])=>({...p,id:'film-'+key,filmId:key,code:key.toUpperCase(),group:'film',name:{en:EN.product.names[key],es:PHONE_LOCALES.es.names[key],ar:PHONE_LOCALES.ar.names[key]},image:'/screen-protector-media/assets/'+p.image,tiers:[[p.minQty,p.price]],url:'https://www.ddnzglobal.com/screen-protectors/compare/'}));
export const productById=id=>mobileProductById(id)||filmProducts.find(p=>p.id===id);
export const rowKey=row=>row.rowId||row.id;
const quantityNumber=value=>Number(String(value??'').replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-0x660)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-0x6f0)));
export function minimumNote(row,rows,locale='en'){
 const p=productById(row.id);if(!p)return '';
 if(p.orderNote)return copyFor(p.orderNote,locale);
 if(p.group!=='film')return (p.tiers?`${p.tiers[0][0]}+ · `:'')+copyFor(mixedCopy.pending,locale);
 const total=rows.filter(r=>r.id===row.id).reduce((n,r)=>n+(quantityNumber(r.quantity)||0),0);
 return `${p.minQty} ${copyFor(mixedCopy.perModel,locale)}`+(p.minOrderQty?`; ${p.minOrderQty} ${copyFor(mixedCopy.perProduct,locale)}`:'')+((quantityNumber(row.quantity)<p.minQty||(p.minOrderQty&&total<p.minOrderQty))?' — '+copyFor(mixedCopy.below,locale):'');
}
