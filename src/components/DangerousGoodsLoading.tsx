import { ExternalLink, ShieldAlert } from 'lucide-react';
type SupportedLanguage = 'zh' | 'en' | 'es';
const COPY = {
zh: {
    proofEyebrow: '实际装柜记录',
    proofTitle: '绑扎、支撑与空隙填充',
    proofIntro: '不同货物使用的固定方式不同。我们根据包装强度、重量分布、货物属性和运输路线确定衬垫、支撑与绑扎方案。',
    proofNoteTitle: '危险品说明',
    proofNote: '危险品是否可接，要看 UN 编号、正确运输名称、类别、包装、资料、承运人和具体航线。装载顺序也应以隔离要求、重量分布和装卸计划为准，不能套用一条固定口诀。',
    proofItems: [
      { src: '/images/operations/carton-cargo-net-restraint-anonymized.webp', alt: '纸箱货在集装箱门端使用网兜约束', title: '整面网兜约束', detail: '在门端形成连续约束面，减少纸箱向柜门方向移动。' },
      { src: '/images/operations/lithium-battery-pallet-lashing-anonymized.webp', alt: '托盘货在集装箱内交叉绑扎', title: '托盘货交叉绑扎', detail: '先稳定托盘单元，再结合柜内锚点进行交叉约束。' },
      { src: '/images/operations/dangerous-goods-drums-lashing-anonymized.webp', alt: '危险品容器使用横杆拉带和填充气袋固定', title: '横向支撑与空隙填充', detail: '横杆、拉带和填充材料共同限制前后与横向位移。' },
      { src: '/images/operations/equipment-crate-blocking-anonymized.webp', alt: '大型设备木箱使用挡板与缓冲材料加固', title: '设备木箱挡固', detail: '根据重心和底座结构设置挡板、支撑及侧向缓冲。' },
    ],
    referenceTitle: '装载与危险品参考资料',
    referenceIntro: '下列资料用于说明通用装载原则；具体货物仍需按运输方式、货物属性和承运条件逐票确认。',
},
en: {
    proofEyebrow: 'Real loading records',
    proofTitle: 'Lashing, bracing and void filling',
    proofIntro: 'Securing methods vary by packaging strength, weight distribution, cargo properties and route. Dunnage, blocking and lashing are planned for the actual shipment.',
    proofNoteTitle: 'Dangerous-goods note',
    proofNote: 'Acceptance depends on the UN number, proper shipping name, class, packaging, documents, carrier and route. Loading order follows segregation, weight distribution and handling needs—not one universal rule.',
    proofItems: [
      { src: '/images/operations/carton-cargo-net-restraint-anonymized.webp', alt: 'Carton cargo restrained with a full-width net at the container door', title: 'Full-width cargo net', detail: 'Creates a continuous restraint surface near the doors to reduce carton movement.' },
      { src: '/images/operations/lithium-battery-pallet-lashing-anonymized.webp', alt: 'Pallet cargo cross-lashed inside a container', title: 'Cross-lashed pallet units', detail: 'Stabilises each pallet unit before tying it into the container securing points.' },
      { src: '/images/operations/dangerous-goods-drums-lashing-anonymized.webp', alt: 'Dangerous goods containers secured with bars straps and void fillers', title: 'Bracing and void filling', detail: 'Bars, straps and void fillers work together to limit longitudinal and lateral movement.' },
      { src: '/images/operations/equipment-crate-blocking-anonymized.webp', alt: 'Equipment crate blocked and braced inside a container', title: 'Blocked equipment crate', detail: 'Blocking and side cushioning are arranged around the base and centre of gravity.' },
    ],
    referenceTitle: 'Loading and dangerous-goods references',
    referenceIntro: 'These sources explain general principles. Shipment-specific acceptance still depends on the mode, cargo properties and carrier conditions.',
},
es: {
    proofEyebrow: 'Registros reales de carga',
    proofTitle: 'Amarre, refuerzo y relleno de huecos',
    proofIntro: 'La sujeción depende del embalaje, reparto de peso, tipo de mercancía y ruta. El relleno, bloqueo y amarre se definen para cada embarque.',
    proofNoteTitle: 'Nota sobre mercancías peligrosas',
    proofNote: 'La aceptación depende del número UN, nombre de expedición, clase, embalaje, documentos, transportista y ruta. El orden de carga responde a segregación, peso y manipulación; no a una regla universal.',
    proofItems: [
      { src: '/images/operations/carton-cargo-net-restraint-anonymized.webp', alt: 'Cajas sujetas con red de ancho completo en la puerta del contenedor', title: 'Red de ancho completo', detail: 'Forma una superficie continua para reducir el movimiento hacia las puertas.' },
      { src: '/images/operations/lithium-battery-pallet-lashing-anonymized.webp', alt: 'Carga paletizada con amarres cruzados dentro del contenedor', title: 'Palés con amarre cruzado', detail: 'Primero estabiliza cada unidad y después la une a los puntos de sujeción.' },
      { src: '/images/operations/dangerous-goods-drums-lashing-anonymized.webp', alt: 'Recipientes de mercancía peligrosa con barras cintas y relleno', title: 'Refuerzo y relleno de huecos', detail: 'Barras, cintas y relleno limitan el movimiento longitudinal y lateral.' },
      { src: '/images/operations/equipment-crate-blocking-anonymized.webp', alt: 'Caja de equipo bloqueada y reforzada dentro del contenedor', title: 'Equipo bloqueado y reforzado', detail: 'El bloqueo y amortiguado lateral se ajustan a la base y centro de gravedad.' },
    ],
    referenceTitle: 'Referencias sobre carga y mercancías peligrosas',
    referenceIntro: 'Estas fuentes explican principios generales. La aceptación de cada envío depende de la modalidad, la mercancía y el transportista.',
},
};
const REFERENCE_LINKS: Array<{
  href: string;
  label: Record<SupportedLanguage, string>;
}> = [
  {
    href: 'https://www.imo.org/en/ourwork/safety/pages/ctu-code.aspx',
    label: { zh: 'IMO / ILO / UNECE CTU Code', en: 'IMO / ILO / UNECE CTU Code', es: 'Código CTU de OMI / OIT / UNECE' },
  },
  {
    href: 'https://www.imo.org/en/ourwork/safety/pages/dangerousgoods-default.aspx',
    label: { zh: 'IMO IMDG Code 危险品说明', en: 'IMO IMDG Code overview', es: 'Resumen del Código IMDG de la OMI' },
  },
  {
    href: 'https://www.iata.org/lithiumbatteries',
    label: { zh: 'IATA 电池运输资料', en: 'IATA battery guidance', es: 'Guía de IATA para baterías' },
  },
];

export default function DangerousGoodsLoading({language}: {language: SupportedLanguage}) {
const activeLanguage = language;
const page = COPY[language];
return (
      <section className="border-b border-[#163b59] bg-[#0b1c2c] py-16 text-white md:py-24" aria-labelledby="dangerous-goods-loading-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#f59e0b]">{page.proofEyebrow}</p>
              <h2 id="dangerous-goods-loading-title" className="text-3xl font-black tracking-tight sm:text-4xl">{page.proofTitle}</h2>
            </div>
            <p className="text-base leading-8 text-slate-300">{page.proofIntro}</p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {page.proofItems.map((item) => (
              <figure key={item.src} className="group overflow-hidden rounded-xl border border-white/[0.12] bg-[#071827]">
                <div className="aspect-[4/5] overflow-hidden bg-slate-900">
                  <img src={item.src} alt={item.alt} width="1090" height="1440" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
                </div>
                <figcaption className="p-5">
                  <h3 className="text-base font-black text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-6 flex gap-4 border-l-2 border-amber-300 bg-amber-400/[0.07] p-5 md:p-6">
            <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-amber-300" aria-hidden="true" />
            <div>
              <h3 className="font-black text-amber-100">{page.proofNoteTitle}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">{page.proofNote}</p>
            </div>
          </div>

          <div className="mt-5 border-y border-white/[0.1] bg-[#071827] p-5 md:flex md:items-center md:justify-between md:gap-8 md:p-6">
            <div className="max-w-2xl">
              <h3 className="font-black text-white">{page.referenceTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{page.referenceIntro}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 md:mt-0 md:justify-end">
              {REFERENCE_LINKS.map((reference) => (
                <a
                  key={reference.href}
                  href={reference.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/[0.14] bg-white/[0.035] px-4 text-xs font-bold text-slate-200 transition hover:border-[#f59e0b]/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b]"
                >
                  {reference.label[activeLanguage]}
                  <ExternalLink className="h-3.5 w-3.5 text-[#f59e0b]" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

 );
}
