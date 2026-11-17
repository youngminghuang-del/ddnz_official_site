import {FileCheck2} from 'lucide-react';
import type {EcuadorLocale} from './ecuadorCopy';

const labels={
  zh:['码头现场','中厄自贸协定原产地证','出口商或生产商','收货人','HS 税则号（6 位）','原产地标准','附件 5 · 字段示意'],
  en:['Terminal photograph','China–Ecuador FTA certificate of origin','Exporter or producer','Consignee','HS code (6 digits)','Origin criterion','Annex 5 · Field example'],
  es:['Fotografía de la terminal','Certificado de origen del TLC China–Ecuador','Exportador o productor','Consignatario','Código SA (6 dígitos)','Criterio de origen','Anexo 5 · Campos de ejemplo'],
  fr:['Photographie du terminal','Certificat d’origine de l’ALE Chine–Équateur','Exportateur ou producteur','Destinataire','Code SH (6 chiffres)','Critère d’origine','Annexe 5 · Champs indicatifs'],
  ru:['Фотография терминала','Сертификат происхождения по соглашению Китай–Эквадор','Экспортёр или производитель','Грузополучатель','Код ГС (6 знаков)','Критерий происхождения','Приложение 5 · Пример полей'],
  ar:['صورة المحطة','شهادة المنشأ لاتفاقية الصين والإكوادور','المصدّر أو المنتج','المرسل إليه','رمز النظام المنسق (6 أرقام)','معيار المنشأ','الملحق 5 · مثال للحقول'],
  pt:['Fotografia do terminal','Certificado de origem do acordo China–Equador','Exportador ou produtor','Consignatário','Código SH (6 dígitos)','Critério de origem','Anexo 5 · Exemplo de campos'],
  tr:['Terminal fotoğrafı','Çin–Ekvador STA menşe belgesi','İhracatçı veya üretici','Alıcı','GTİP / HS kodu (6 hane)','Menşe kriteri','Ek 5 · Örnek alanlar'],
} as const;

export function EcuadorPortPhoto({locale,terminal}:{locale:EcuadorLocale;terminal:'contecon'|'posorja'}) {
  const port=terminal==='contecon'
    ? {name:'Contecon Guayaquil',source:'ICTSI',file:'contecon-guayaquil',height:461}
    : {name:'DP World Posorja',source:'DP World',file:'dp-world-posorja',height:540};
  const src='/images/freight/ecuador/'+port.file;
  return <figure className="ecuador-terminal-photo">
    <img src={src+'-480.webp'} srcSet={`${src}-480.webp 480w, ${src}.webp 960w`} sizes="(max-width: 540px) calc(100vw - 32px), (max-width: 900px) calc((100vw - 72px) / 2), 570px" width={960} height={port.height} alt={`${port.name} · ${labels[locale][0]}`} loading="lazy" decoding="async"/>
    <figcaption>{labels[locale][0]} · <bdi>{port.source}</bdi></figcaption>
  </figure>;
}

export function EcuadorOriginFields({locale}:{locale:EcuadorLocale}) {
  const [,title,...fields]=labels[locale];
  const [exporter,consignee,hs,criterion,caption]=fields;
  return <figure className="ecuador-form-preview ecuador-origin-preview">
    <div className="ecuador-form-preview__header"><FileCheck2 size={20} aria-hidden="true"/><bdi>CO</bdi></div>
    <div className="ecuador-form-preview__title">{title}</div>
    <ul>{[exporter,consignee,hs,criterion].map(field=><li key={field}><bdi>{field}</bdi><span aria-hidden="true"/></li>)}</ul>
    <figcaption>{caption}</figcaption>
  </figure>;
}
