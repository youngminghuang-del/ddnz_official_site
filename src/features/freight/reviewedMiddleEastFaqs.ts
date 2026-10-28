import {COUNTRY_SPEC_DATA} from '../../data/countrySpecData';
import claims from './freightClaimCopy.json';
const questions:Record<string,string[]>={
 en:['Which documents should be checked before booking?','How should origin marking and labels be prepared?','How is the transit estimate confirmed?','What must be agreed for UAE clearance?','Which origin and product labels apply?','Is DDP available for this shipment?','Which KUCAS/TABEK documents apply?','Which labels and technical specifications need checking?','What should be checked before departure?'],
 zh:['订舱前要核对哪些文件？','如何准备原产地标记与产品标签？','如何确认运输时效？','阿联酋清关需要先确认什么？','原产地与产品标识有哪些要求？','本票货物是否适用 DDP？','需要哪些 KUCAS/TABEK 文件？','哪些标签和技术参数需要核对？','出运前还要核对什么？'],
 es:['¿Qué documentos se revisan antes de reservar?','¿Cómo preparar el marcado de origen y las etiquetas?','¿Cómo se confirma el plazo de transporte?','¿Qué se acuerda para el despacho en EAU?','¿Qué marcado de origen y etiquetas corresponden?','¿Es viable DDP para este envío?','¿Qué documentos KUCAS/TABEK se requieren?','¿Qué etiquetas y especificaciones deben revisarse?','¿Qué debe comprobarse antes de la salida?'],
 fr:['Quels documents vérifier avant réservation ?','Comment préparer le marquage d’origine et les étiquettes ?','Comment confirmer le délai de transport ?','Que faut-il convenir pour le dédouanement aux EAU ?','Quels marquages d’origine et étiquettes s’appliquent ?','Le DDP est-il possible pour cette expédition ?','Quels documents KUCAS/TABEK sont nécessaires ?','Quelles étiquettes et caractéristiques vérifier ?','Que vérifier avant le départ ?'],
 ru:['Какие документы проверить до бронирования?','Как подготовить маркировку происхождения и этикетки?','Как подтвердить расчётный срок перевозки?','Что согласовать для оформления в ОАЭ?','Какие требования к происхождению и маркировке применяются?','Возможен ли DDP для этой отправки?','Какие документы KUCAS/TABEK нужны?','Какие этикетки и характеристики нужно проверить?','Что проверить перед отправлением?'],
 ar:['ما المستندات التي تُراجع قبل الحجز؟','كيف تُجهز علامات المنشأ وملصقات المنتج؟','كيف تُؤكد مدة النقل التقديرية؟','ما الذي يجب الاتفاق عليه للتخليص في الإمارات؟','ما علامات المنشأ وملصقات المنتج المنطبقة؟','هل يتاح DDP لهذه الشحنة؟','ما مستندات KUCAS/TABEK المطلوبة؟','ما الملصقات والمواصفات التي يجب مراجعتها؟','ما الذي يجب فحصه قبل الانطلاق؟'],
};
export function reviewedMiddleEastFaqs(country:string,locale:string){
 if(!['Saudi-Arabia','UAE','Kuwait'].includes(country))return undefined;
 const key=country as keyof typeof COUNTRY_SPEC_DATA;
 const spec=COUNTRY_SPEC_DATA[key][locale];const q=questions[locale];if(!spec||!q)return undefined;
 const c=claims[locale as keyof typeof claims]||claims.en;
 const offset=country==='Saudi-Arabia'?0:country==='UAE'?3:6;
 const answers=country==='Saudi-Arabia'?[spec.guideCards[0].desc,spec.redlines[1].desc,c[1]]:country==='UAE'?[spec.guideCards[0].desc,spec.redlines[0].desc,c[2]]:[spec.redlines[0].desc,spec.redlines[2].desc,spec.guideCards[1].desc];
 const id=country==='Saudi-Arabia'?'sa':country==='UAE'?'ae':'kw';
 return answers.map((desc,i)=>({id:`${id}-${i+1}`,title:q[offset+i],desc}));
}
