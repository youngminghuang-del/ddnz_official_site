import { words, type FreightLocale } from './regions';

export default function LclLoadingDetails({ locale }: { locale: FreightLocale }) {
  const t = (zh: string, en: string, es: string) => words(zh, en, es)[locale];
  const photos = [
    { file: 'crates-and-pallets', height: 1328, title: t('木箱与托盘，同柜不同包装', 'Crates and pallets in one load', 'Cajones y palés en una carga'), body: t('木箱上方还有托盘货。询价时，除了尺寸重量，也把包装结构与允许堆叠条件一起说明。', 'Palletized cargo sits above wooden crates. Include packaging construction and permitted stacking conditions with dimensions and weight.', 'Hay carga paletizada sobre cajones de madera. Indica estructura del embalaje y condiciones de apilamiento junto con medidas y peso.') },
    { file: 'bags-and-cartons', height: 2145, title: t('袋装与纸箱，留意层间接触', 'Bags and cartons: look between the layers', 'Sacos y cajas: observar las capas'), body: t('袋装货与纸箱分层摆放，画面中可见层间衬垫。包装是否能承受上层货物，需要结合实际重量与包装强度确认。', 'Bags and cartons occupy different layers, with padding visible between them. Check actual weights and packaging strength before deciding what can go above.', 'Sacos y cajas en capas distintas, con material intermedio visible. Revisa pesos reales y resistencia del embalaje antes de decidir qué colocar encima.') },
  ];
  const errors = [
    { file: 'wrong-example-mixed-stack', height: 1901, title: t('混装高低不齐，部分外箱已变形', 'Uneven mixed stacks and deformed cartons', 'Pilas mixtas desiguales y cajas deformadas'), body: t('先看纸箱的边角与受压位置，再看袋装货和纸箱之间的空隙。发现变形时，应先检查包装与货物状态，再决定是否换箱、调整摆放或补充支撑。', 'Look at carton corners, compressed areas and gaps between bags and boxes. When deformation is found, inspect the packing and cargo before deciding on repacking, rearrangement or additional support.', 'Observa esquinas, zonas comprimidas y huecos entre sacos y cajas. Si hay deformación, revisa embalaje y mercancía antes de decidir si reembalar, reorganizar o añadir apoyo.') },
    { file: 'wrong-example-carton-stack', height: 1615, title: t('纸箱倾斜、错位，箱体出现变形', 'Leaning, offset cartons with visible deformation', 'Cajas inclinadas, desplazadas y deformadas'), body: t('层与层没有对齐，部分箱体已经弯曲。不要只凭“还能塞进去”继续加货；先核对单箱重量、堆叠限制和现有包装状态。', 'Layers are offset and some cartons are visibly bent. Space remaining is not enough reason to add cargo; first check carton weights, stacking limits and packaging condition.', 'Las capas están desplazadas y algunas cajas dobladas. Que quede espacio no basta para añadir carga: revisa pesos, límites de apilamiento y estado del embalaje.') },
  ];
  const photo = (item: typeof photos[number], warning = false) => <figure key={item.file}>
    <a className="lcl-detail-image" href={`/media/lcl-20260920/${item.file}.webp`} target="_blank" rel="noreferrer" aria-label={`${item.title} — ${t('打开完整图片', 'Open full image', 'Abrir imagen completa')}`}>
      {warning && <span className="lcl-error-badge">{t('错误示范', 'Incorrect example', 'Ejemplo incorrecto')}</span>}
      <img src={`/media/lcl-20260920/${item.file}.webp`} alt={item.title} width={1200} height={item.height} loading="lazy" decoding="async" />
      <span className="lcl-image-open">{t('查看完整图片', 'View full image', 'Ver imagen completa')} ↗</span>
    </a>
    <figcaption><h3>{item.title}</h3><p>{item.body}</p></figcaption>
  </figure>;
  return <>
    <section id="lcl-packaging-details" className="freight-wrap freight-section lcl-loading-details">
      <p className="freight-kicker">LCL / PACKAGING DETAILS</p>
      <h2>{t('同样是拼柜，\n要看的细节并不一样。', 'Shared container.\nDifferent packing details.', 'Un contenedor compartido.\nDistintos detalles de embalaje.')}</h2>
      <p className="freight-intro">{t('从木箱、托盘到袋装货，先把货物拍清楚，再讨论怎么装。', 'From crates and pallets to bags: show the cargo clearly before discussing the loading plan.', 'Desde cajones y palés hasta sacos: muestra la carga antes de hablar del plan de estiba.')}</p>
      <div className="lcl-detail-grid">{photos.map(item => photo(item))}</div>
    </section>
    <section id="lcl-loading-mistakes" className="lcl-errors">
      <div className="freight-wrap freight-section lcl-loading-details">
        <p className="freight-kicker">{t('错误示范 / 装柜前要发现的问题', 'INCORRECT EXAMPLES / ISSUES TO CATCH', 'EJEMPLOS INCORRECTOS / PROBLEMAS A DETECTAR')}</p>
        <h2>{t('装得进去，\n不代表就能这样装。', 'It fits.\nThat does not make it a good load.', 'Que quepa no significa\nque esté bien cargado.')}</h2>
        <p className="freight-intro">{t('下面两张是错误示范。看外箱变形、堆叠错位和货物之间的空隙，而不只是看装了多少。', 'These two photos show incorrect examples. Look beyond quantity: check carton deformation, offset stacks and gaps between packages.', 'Estas dos fotos son ejemplos incorrectos. Además de la cantidad, observa deformaciones, pilas desplazadas y huecos entre bultos.')}</p>
        <div className="lcl-error-grid">{errors.map(item => photo(item, true))}</div>
        <a className="lcl-review-link" href="#lcl-brief">{t('有类似包装？把照片与件重尺一起发来', 'Similar packing? Send photos, dimensions and weight', '¿Embalaje similar? Envía fotos, medidas y peso')} →</a>
      </div>
    </section>
  </>;
}
