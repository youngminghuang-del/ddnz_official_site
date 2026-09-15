import React from 'react';
import { copyFor } from './catalog.mjs';
const t=(en,es,ar)=>({en,es,ar});
const M='/images/product-showcase/mobile/';
const visuals={
 history:{caption:t('Records to verify operating history','Documentos para verificar la trayectoria','وثائق للتحقق من تاريخ النشاط'),steps:[t('Business licence','Licencia comercial','الترخيص التجاري'),t('Operating address','Dirección operativa','عنوان التشغيل'),t('Relevant order records','Pedidos comparables','سجلات الطلبات المشابهة')]},
 funding:{caption:t('Review the order funding plan','Revisar la financiación del pedido','مراجعة خطة تمويل الطلب'),steps:[t('Material purchase','Compra de materiales','شراء المواد'),t('Production milestones','Hitos de producción','مراحل الإنتاج'),t('Payment schedule','Calendario de pagos','جدول الدفعات')]},
 design:{image:M+'phone-case-colorway-proof-v1.webp',caption:t('Colour and design sample example','Ejemplo de muestras de color y diseño','مثال لعينات اللون والتصميم')},
 materials:{image:M+'phone-case-finish-samples-v1.webp',caption:t('Material and finish sample example','Ejemplo de muestras de material y acabado','مثال لعينات المواد والتشطيب')},
 scale:{image:M+'phone-case-machine-proof-v1.webp',caption:t('Phone-case production example','Ejemplo de producción de fundas','مثال لإنتاج أغطية الهواتف')},
 team:{caption:t('Agree responsibilities for each handover','Acordar responsables en cada entrega','تحديد المسؤوليات عند كل تسليم'),steps:[t('Engineering & purchasing','Ingeniería y compras','الهندسة والمشتريات'),t('Production owner','Responsable de producción','مسؤول الإنتاج'),t('Quality approval','Aprobación de calidad','اعتماد الجودة')]},
 service:{caption:t('Agree the response and follow-up process','Acordar respuesta y seguimiento','الاتفاق على الرد والمتابعة'),steps:[t('Report the issue','Informar del problema','الإبلاغ عن المشكلة'),t('Corrective action','Acción correctiva','الإجراء التصحيحي'),t('Confirm the next order','Confirmar la reposición','تأكيد الطلب التالي')]},
};
export default function SupplierDimensionVisual({dimension,locale='en'}){
 const visual=visuals[dimension.id];
 return <figure key={dimension.id} data-dimension-visual={dimension.id}>
 {visual.image?<img src={visual.image} alt={copyFor(visual.caption,locale)} width="800" height="600" loading="lazy"/>:
 <div className="ms-verification-visual"><p>{copyFor(t('VERIFICATION OUTLINE','ESQUEMA DE VERIFICACIÓN','مخطط التحقق'),locale)}</p><h4>{copyFor(dimension.name,locale)}</h4><ol>{visual.steps.map((step,i)=><li key={i}><span aria-hidden="true">{String(i+1).padStart(2,'0')}</span>{copyFor(step,locale)}</li>)}</ol></div>}
 <figcaption>{copyFor(visual.caption,locale)}</figcaption></figure>;
}
