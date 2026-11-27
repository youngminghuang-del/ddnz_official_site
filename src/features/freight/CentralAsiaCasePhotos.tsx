import type { Language } from '../../i18n/translations';
import { FreightPhotoStory, type FreightPhoto } from './FreightPhotoStory';
import regional from './regionalPhotoCopy.json';
import labels from './routePhotoCopy.json';

const inspection = {
  en: { caption: 'Wheel-hub pallet inspection', alt: 'Two warehouse workers checking wrapped wheel hubs on a pallet', detail: 'Record the pallet count, condition and receiving contact before handing over the load.' },
  zh: { caption: '轮毂托盘检查', alt: '两位仓库人员检查托盘上缠膜固定的轮毂', detail: '交接前记录托盘数量、包装状况及收货联系人。' },
  es: { caption: 'Inspección de un palé de cubos de rueda', alt: 'Dos operarios revisan cubos de rueda envueltos en film sobre un palé', detail: 'Antes de la entrega, anote el número de palés, su estado y el contacto de recepción.' },
  fr: { caption: 'Contrôle d’une palette de moyeux de roue', alt: 'Deux opérateurs vérifient des moyeux filmés sur une palette', detail: 'Avant la remise, notez le nombre de palettes, leur état et le contact à la réception.' },
  ru: { caption: 'Проверка палеты со ступицами', alt: 'Двое работников проверяют ступицы, закреплённые плёнкой на палете', detail: 'Перед передачей груза зафиксируйте количество палет, их состояние и контакт получателя.' },
  ar: { caption: 'فحص منصة نقالة تحمل صُرر عجلات', alt: 'عاملان يفحصان صُرر عجلات ملفوفة على منصة نقالة', detail: 'قبل تسليم الشحنة، سجّل عدد المنصات وحالتها وبيانات مسؤول الاستلام.' },
  pt: { caption: 'Inspeção do palete de cubos de roda', alt: 'Dois operários conferem cubos de roda protegidos com filme sobre um palete', detail: 'Antes da entrega, registre o número de paletes, o estado deles e o contato de recebimento.' },
  tr: { caption: 'Tekerlek poyrası paletinin kontrolü', alt: 'Palet üzerindeki streç filmle sarılmış tekerlek poyralarını kontrol eden iki çalışan', detail: 'Yükü teslim etmeden önce palet adedini, durumunu ve teslim alacak kişinin iletişim bilgilerini kaydedin.' },
} satisfies Record<Language, {caption: string; alt: string; detail: string}>;

const inspectionPhoto = '/images/freight/route-photo-stories/kg-pallet-handoff';

export function CentralAsiaInspectionCard({ locale }: { locale: Language }) {
  const { caption, alt, detail } = inspection[locale];
  return <article><img src={inspectionPhoto + '-760.webp'}
    srcSet={inspectionPhoto + '-384.webp 384w, ' + inspectionPhoto + '-760.webp 760w'}
    sizes="(max-width: 767px) 95vw, 33vw" alt={alt} width={760} height={924}
    loading="lazy" decoding="async" /><div><h3>{caption}</h3><p>{detail}</p></div></article>;
}

const forklift = { file: 'tj-forklift-transfer', width: 760, height: 935, focus: 'center 58%' };
const casePhotos: Record<string, readonly FreightPhoto[]> = {
  kazakhstan: [
    { file: 'tj-pallet-restraint', width: 760, height: 927 },
    forklift,
    { file: 'kg-pallet-handoff', width: 760, height: 924, focus: 'center 62%' },
  ],
  uzbekistan: [
    { file: 'kg-road-loading', width: 760, height: 895, focus: 'center 67%' },
    forklift,
  ],
};

const tashkentLoading = {
  pt: { caption: 'Carregamento em Jiaozhou para Tashkent', alt: 'Operário carregando caixas na carreta de um caminhão', detail: 'Neste embarque rodoviário, a equipe conferiu as caixas e a ordem de carregamento antes da saída.' },
  tr: { caption: 'Jiaozhou’da Taşkent sevkiyatı için yükleme', alt: 'Kamyon römorkuna koli yükleyen çalışan', detail: 'Bu karayolu sevkiyatında ekip, araç yola çıkmadan önce kolileri ve yükleme sırasını kontrol etti.' },
};

export function CentralAsiaCountryPhotos({ country, locale }: { country: string; locale: 'pt' | 'tr' }) {
  const entries = casePhotos[country];
  if (!entries) return null;
  return <div className="route-depth-inner"><FreightPhotoStory entries={entries} copy={{
    credit: labels[locale].credit,
    adjustment: labels[locale].adjustment,
    photos: {
      ...regional[locale],
      'kg-road-loading': tashkentLoading[locale],
      'kg-pallet-handoff': inspection[locale],
    },
  }}/></div>;
}
