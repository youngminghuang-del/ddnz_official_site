import type { Language } from '../i18n/translations';
const copy = {
 en:['Phone cases','Straps & charms','Case materials & prices'],
 es:['Fundas de teléfono','Correas y colgantes','Materiales y precios de fundas'],
 ar:['أغطية الهواتف','الأحزمة والزينة','مواد الأغطية وأسعارها'],
 zh:['手机壳','挂绳与挂饰','手机壳材质与价格'],fr:['Coques de téléphone','Cordons et breloques','Matériaux et prix des coques'],ru:['Чехлы для телефонов','Ремешки и подвески','Материалы и цены чехлов'],pt:['Capas de telefone','Cordões e pingentes','Materiais e preços de capas'],tr:['Telefon kılıfları','Askılar ve aksesuarlar','Kılıf malzemeleri ve fiyatları'],
};
export const mobileCategoryNavigation=(language:Language)=>['/phone-cases','/phone-straps-charms','/phone-cases/materials-and-pricing'].map((to,i)=>({to,label:copy[language][i]}));
