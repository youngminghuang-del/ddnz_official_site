import {Box, FileText, ReceiptText} from 'lucide-react';
import type {EcuadorLocale} from './ecuadorCopy';

const labels = {
  zh: ['字段示意','进口商登记','电子签名','注册状态','进口税费明细','关税','快件简化申报','申报类别','包裹重量','FOB 货值'],
  en: ['Field example','Importer registration','Electronic signature','Registration status','Import tax breakdown','Customs duty','Simplified courier declaration','Declaration category','Parcel weight','FOB value'],
  es: ['Campos de ejemplo','Registro del importador','Firma electrónica','Estado del registro','Liquidación de tributos','Arancel','Declaración simplificada de courier','Categoría','Peso del paquete','Valor FOB'],
  fr: ['Champs à titre indicatif','Enregistrement importateur','Signature électronique','Statut de l’inscription','Décompte des droits et taxes','Droits de douane','Déclaration simplifiée express','Catégorie','Poids du colis','Valeur FOB'],
  ru: ['Пример полей','Регистрация импортёра','Электронная подпись','Статус регистрации','Расчёт импортных платежей','Таможенная пошлина','Упрощённая декларация','Категория','Вес посылки','Стоимость FOB'],
  ar: ['مثال للحقول','تسجيل المستورد','التوقيع الإلكتروني','حالة التسجيل','تفصيل ضرائب الاستيراد','الرسوم الجمركية','إقرار الشحن السريع المبسّط','فئة الإقرار','وزن الطرد','قيمة FOB'],
  pt: ['Exemplo de campos','Cadastro do importador','Assinatura eletrônica','Situação do cadastro','Demonstrativo de tributos','Imposto de importação','Declaração simplificada de courier','Categoria','Peso do pacote','Valor FOB'],
  tr: ['Örnek alanlar','İthalatçı kaydı','Elektronik imza','Kayıt durumu','İthalat vergileri dökümü','Gümrük vergisi','Basitleştirilmiş kurye beyanı','Beyan kategorisi','Paket ağırlığı','FOB değeri'],
} as const;

export function EcuadorImportFormPreview({locale,index}:{locale:EcuadorLocale;index:number}) {
  const [caption, registration, signature, status, settlement, duty, courier, category, weight, fob]=labels[locale];
  const sheet=[
    {code:'ECUAPASS',title:registration,rows:['RUC',signature,status],Icon:FileText},
    {code:'DAI',title:settlement,rows:[duty,'FODINFA','IVA','ICE'],Icon:ReceiptText},
    {code:'DAS',title:courier,rows:[category,weight,fob],Icon:Box},
  ][index];
  const {Icon}=sheet;
  return <figure className="ecuador-form-preview">
    <div className="ecuador-form-preview__header">
      <Icon size={20} aria-hidden="true"/>
      <bdi>{sheet.code}</bdi>
    </div>
    <div className="ecuador-form-preview__title">{sheet.title}</div>
    <ul>{sheet.rows.map(field=><li key={field}><bdi>{field}</bdi><span aria-hidden="true"/></li>)}</ul>
    <figcaption>{caption}</figcaption>
  </figure>;
}
