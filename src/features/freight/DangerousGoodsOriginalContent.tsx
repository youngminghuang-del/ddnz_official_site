import DangerousGoodsLoading from '../../components/DangerousGoodsLoading';
import NewFreightEvidence from './NewFreightEvidence';
import { freightLanguagePrefix } from './freightLanguages';
export const copy = {
  zh: {
    title: '危险品运输与装柜加固',
    intro: '从货物资料核对到装柜现场，了解危险品出运需要确认的信息，以及不同包装的绑扎、支撑与填充方式。',
    service: '专项货运服务', quote: '提交危险品运输需求',
    heading: '询价时，请一并提供这些资料',
    items: ['品名、用途、UN 编号及现有 MSDS', '包装形式、件数、单件尺寸和毛重', '起运地、目的地及计划出货时间'],
    note: '根据货物资料与具体航线确认可接范围、运输方式和报价。',
    media: '待补素材：装柜操作视频',
    mediaNote: '预留 16:9 视频位置：同一票货的衬垫、绑扎、检查和封柜过程。素材补齐后显示播放器。',
  },
  en: {
    title: 'Dangerous goods shipping & container securing',
    intro: 'Review the information needed before dispatch and see loading records showing lashing, bracing and void filling for different packaging formats.',
    service: 'Specialist freight services', quote: 'Request dangerous goods shipping',
    heading: 'Include these details with your inquiry',
    items: ['Product name, use, UN number and available MSDS', 'Packaging, package count, dimensions and gross weight', 'Origin, destination and cargo-ready date'],
    note: 'Cargo information and routing determine acceptance, transport options and quotation scope.',
    media: 'Media slot: container loading video',
    mediaNote: '16:9 video: dunnage, lashing, inspection and sealing of the same shipment. The player will appear when footage is available.',
  },
  es: {
    title: 'Transporte de mercancías peligrosas y sujeción de carga',
    intro: 'Consulta la información necesaria antes del embarque y los registros de amarre, refuerzo y relleno para distintos embalajes.',
    service: 'Servicios de carga especializada', quote: 'Consultar transporte de mercancías peligrosas',
    heading: 'Incluye estos datos en tu consulta',
    items: ['Producto, uso, número UN y MSDS disponible', 'Embalaje, bultos, dimensiones y peso bruto', 'Origen, destino y fecha de mercancía lista'],
    note: 'La información de la carga y la ruta permiten confirmar aceptación, modalidad y alcance de la cotización.',
    media: 'Espacio para video de carga del contenedor',
    mediaNote: 'Video 16:9 del relleno, amarre, inspección y sellado de un mismo envío. Se mostrará cuando esté disponible.',
  },
};

export function DangerousGoodsOriginalContent({lang}: {lang:'zh'|'en'|'es'}) {
  const text=copy[lang];
  const quote=`${freightLanguagePrefix(lang)}/get-a-quote/?leadGoal=Freight+Export&source=dangerous_goods_shipping`;
  return <main id="main-content" className="freight-dg-page">
    <header className="border-b border-[#dce3ea] py-16 md:py-24"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><p className="mb-5 text-sm font-bold tracking-widest text-[#c94f2f]">{text.service} · HEAVEN BORN</p><h1 className="max-w-4xl text-3xl font-black leading-tight sm:text-5xl">{text.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{text.intro}</p><a className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-[#c94f2f] px-6 font-bold text-white" href={quote}>{text.quote}</a></div></header>
    <DangerousGoodsLoading language={lang}/><NewFreightEvidence locale={lang} specialist/>
    <section id="dg-brief" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><h2 className="text-2xl font-black sm:text-3xl">{text.heading}</h2><ul className="mt-6 divide-y divide-slate-200 border-y border-slate-200">{text.items.map((item,index)=><li key={item} className="flex gap-5 py-5"><span className="font-mono text-[#c94f2f]">0{index+1}</span><span>{item}</span></li>)}</ul><p className="mt-5 leading-7 text-slate-600">{text.note}</p><a href={quote} className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-[#c94f2f] px-6 font-bold text-white">{text.quote}</a></section>
  </main>;
}
