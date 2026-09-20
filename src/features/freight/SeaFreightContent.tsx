import { useEffect } from 'react';
import NewFreightEvidence from './NewFreightEvidence';
import ShipmentPreparation from './ShipmentPreparation';
import { freightPrefix, regions, words, type FreightLocale } from './regions';

const media = '/media/freight-20260918/';
export function seaFreightMetadata(locale: FreightLocale) {
  return {
    keywords: words('中国海运,整柜,拼箱,集货,装载规划', 'sea freight China,FCL,LCL,consolidation,load planning', 'transporte marítimo China,FCL,LCL,consolidación,carga')[locale],
    title: words('中国海运｜整柜、拼箱与装载规划 | DDNZ Global', 'Sea Freight from China | FCL, LCL & Loading Plans | DDNZ Global', 'Transporte marítimo desde China | FCL, LCL y carga | DDNZ Global')[locale],
    desc: words('查看中国端装柜、收货与配载现场。根据货物包装、供应商地点与目的地，确认整柜、拼箱及出口交接安排。', 'Explore origin loading, receiving and cargo planning records. Plan FCL, LCL and export handover around your packaging, supplier locations and destination.', 'Ver registros de carga, recepción y planificación en China. Organizar FCL, LCL y entrega para exportación según embalaje, proveedores y destino.')[locale],
  };
}

/** Pure markup: the same evidence and links are available in pre-rendered HTML. */
export default function SeaFreightContent({ locale }: { locale: FreightLocale }) {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!['loading-proof-title', 'mixed-loads', 'load-planning', 'freight-destinations', 'rfq-form-section', 'destination-records'].includes(id)) return;
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, []);
  const t = (zh: string, en: string, es: string) => words(zh, en, es)[locale];
  const prefix = freightPrefix(locale);
  const quote = `${prefix}/get-a-quote/?leadGoal=Freight+Export&source=sea_freight_fieldwork`;
  return <main id="main-content" className="freight-editorial freight-next">
    <header className="freight-cover">
      <div className="freight-cover-copy">
        <p className="freight-kicker">DDNZ / HEAVEN BORN · {t('中国海运', 'SEA FREIGHT FROM CHINA', 'TRANSPORTE MARÍTIMO DESDE CHINA')}</p>
        <h1>{t('一柜货。', 'One container.', 'Un contenedor.')}<br /><em>{t('每一步，都算数。', 'Every detail counts.', 'Cada detalle cuenta.')}</em></h1>
        <p>{t('从几家工厂的货，到一票清楚的出运安排。整柜、拼箱、集货与装载，先看现场，再谈方案。', 'From several suppliers to one shipment plan. Full containers, shared loads and consolidation—see the work behind the booking.', 'De varios proveedores a un plan de envío. Contenedor completo, carga consolidada y preparación: conoce el trabajo antes de reservar.')}</p>
        <div className="freight-cover-actions"><a className="freight-cta" href={quote}>{t('讨论这票货', 'Plan your shipment', 'Planificar mi envío')} ↗</a><a href="#loading-proof-title">{t('看装柜现场', 'See the loading records', 'Ver la carga')} <span aria-hidden="true">↓</span></a></div>
        <div className="freight-cover-signature">FCL / LCL <span>{t('采购衔接 · 中国端操作 · 国际运输', 'Sourcing handover · Origin operations · Freight', 'Compras · Operaciones en origen · Transporte')}</span></div>
      </div>
      <figure className="freight-cover-image"><img src={`${media}factory-container.jpg`} alt={t('工厂外的集装箱及装柜现场', 'Container loading outside a factory', 'Carga de contenedor frente a una fábrica')} fetchPriority="high" width="1290" height="1700" /><figcaption><span>FIELD RECORD / 01</span>{t('中国端 · 工厂装柜现场', 'China origin · Factory loading', 'China · Carga en fábrica')}</figcaption></figure>
    </header>
    <nav className="freight-chapters" aria-label={t('本页内容', 'On this page', 'En esta página')}>
      <a href="#loading-proof-title">01 / {t('装柜现场', 'Loading', 'Carga')}</a><a href="#mixed-loads">02 / {t('拼柜细节', 'Mixed cargo', 'Carga mixta')}</a><a href="#load-planning">03 / {t('装载规划', 'Load planning', 'Planificación')}</a><a href="#freight-destinations">04 / {t('目的地', 'Destinations', 'Destinos')}</a>
    </nav>
    <section className="freight-wrap freight-section" id="choose-freight-service">
      <p className="freight-kicker">FCL / LCL / CONSOLIDATION</p>
      <h2>{t('货怎么走，先从这里选。', 'Start with how your cargo moves.', 'Elige cómo mover tu carga.')}</h2>
      <div className="mt-8 divide-y border-y border-current/20">
        {[
          ['#load-planning', 'FCL', t('整柜运输', 'Full container', 'Contenedor completo'), t('为整批货规划装载、船期与交付。', 'Plan loading, sailing and delivery for a full shipment.', 'Planifica carga, salida y entrega del envío completo.')],
          [`${prefix}/services/lcl-shipping-from-china/`, 'LCL', t('海运拼箱', 'Less than container load', 'Carga marítima compartida'), t('货量不足一柜？一起核对包装、计费与目的地操作。', 'Less than a full container? Review packing, charges and destination handling.', '¿Menos de un contenedor? Revisa embalaje, cargos y operaciones en destino.')],
          [`${prefix}/sourcing-services/consolidation-export/`, 'CONSOLIDATION', t('多供应商集货', 'Multi-supplier consolidation', 'Consolidación de proveedores'), t('几家工厂的货，先收齐、核对，再安排拼箱或整柜。', 'Receive and reconcile several suppliers before arranging LCL or FCL.', 'Recibe y coteja varios proveedores antes de organizar LCL o FCL.')],
        ].map(([href, label, title, description]) => <a key={label} href={href} className="group flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:gap-8 focus-visible:outline focus-visible:outline-2"><span className="w-40 shrink-0 text-sm font-bold">{label}</span><span className="flex-1"><strong className="text-2xl">{title}</strong><span className="mt-2 block leading-7">{description}</span></span><span aria-hidden="true" className="text-2xl group-hover:translate-x-1">↗</span></a>)}
      </div>
    </section>
    <section className="freight-wrap freight-section" id="loading-proof-title">
      <div className="freight-section-heading"><p className="freight-kicker">01 / {t('装柜与收货', 'FROM THE LOADING FLOOR', 'DESDE LA ZONA DE CARGA')}</p><h2>{t('把镜头拉近。\n看货物怎么装。', 'A closer look.\nHow cargo gets loaded.', 'Más de cerca.\nAsí se carga la mercancía.')}</h2><p>{t('进柜、码放、核标。三个现场片段，分别看清装载与收货的实际动作。', 'Loading, positioning and label checks. Three separate field records show the handling behind a shipment.', 'Carga, colocación y etiquetas. Tres registros independientes muestran el manejo de la mercancía.')}</p></div>
      <div className="freight-film-grid">
        {[
          ['loading-01', 'loading-01-poster.jpg', '00:27', t('从柜口，到柜内。', 'From the door, into the container.', 'De la puerta al contenedor.'), t('装柜现场 · 纸箱入柜与码放', 'Loading record · Cartons entering and being positioned', 'Registro de carga · Entrada y colocación de cajas')],
          ['loading-02', 'loading-02-poster.jpg', '00:38', t('另一视角，看搬运。', 'Another view of cargo handling.', 'Otra vista de la manipulación.'), t('装柜现场 · 搬运设备与柜内作业', 'Loading record · Handling equipment and work inside', 'Registro de carga · Equipo y trabajo interior')],
          ['receiving-silent', 'receiving-poster.jpg', '00:36', t('箱号，先对清楚。', 'Check the carton marks first.', 'Primero, revisar las marcas.'), t('收货现场 · 标签与到货件数核对', 'Receiving record · Label and package-count checks', 'Recepción · Revisión de etiquetas y bultos')],
        ].map(([file, poster, duration, title, caption], i) => <figure className="freight-film" key={file}><div className="freight-film-top"><span>0{i + 1} / {duration}</span><span>{t('点击播放', 'PLAY RECORD', 'REPRODUCIR')} ↗</span></div><video controls playsInline muted preload="none" poster={`${media}${poster}`} src={`${media}${file}.mp4`} aria-label={caption} /><figcaption><h3>{title}</h3><p>{caption}</p></figcaption></figure>)}
      </div>
      <div className="freight-questions">
        {[
          [t('整柜还是拼箱，先看什么？', 'FCL or LCL: where do we start?', '¿FCL o LCL: por dónde empezar?'), t('先看单件尺寸、总量、包装、货好时间和交付地址。整柜与拼箱的费用组成、仓库操作和交接环节不同，不能只用一个立方数门槛决定。', 'Start with package dimensions, quantity, packaging, ready date and delivery address. FCL and LCL have different cost components and handling steps; volume alone is not enough.', 'Empezar por medidas, cantidad, embalaje, fecha y dirección. FCL y LCL tienen costes y operaciones distintos; el volumen no basta.')],
          [t('几家供应商的货，能一起出吗？', 'Can goods from several suppliers ship together?', '¿Pueden salir juntos varios proveedores?'), t('先列出每家供应商的位置、货好时间与装箱资料，再确认集货地点和可接受的等待时间。到货不齐、包装差异和需要额外检查的货，分别记录后决定。', 'List supplier locations, ready dates and packing details, then agree the consolidation point and acceptable wait. Record missing cargo, packing differences and inspection needs separately.', 'Indicar ubicaciones, fechas y embalaje; acordar punto de consolidación y espera. Registrar faltantes, diferencias e inspecciones por separado.')],
          [t('到港和到门，报价差在哪里？', 'What changes between port and door quotes?', '¿Qué cambia entre puerto y domicilio?'), t('核对起运端提货、仓储、装柜、运输、目的港处理、清关和派送由谁负责、哪些已包含。目的地税费和特殊操作另列，避免到货后才发现范围不同。', 'Check who handles pickup, storage, loading, transport, destination handling, clearance and delivery—and what is included. List taxes and special handling separately.', 'Confirmar recogida, almacén, carga, transporte, gestión en destino, despacho y reparto, con sus responsables. Separar impuestos y operaciones especiales.')],
        ].map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
      </div>
    </section>
    <NewFreightEvidence locale={locale} />
    <ShipmentPreparation locale={locale} />
    <section className="freight-dark" id="mixed-loads"><div className="freight-wrap freight-section">
      <div className="freight-section-heading"><p className="freight-kicker">02 / LCL & CONSOLIDATION</p><h2>{t('不是所有包装，\n都能用同一种装法。', 'Different packages.\nDifferent loading decisions.', 'Distintos embalajes.\nDistintas decisiones de carga.')}</h2><p>{t('纸箱、袋装、托盘和木箱放在一起，要看的不只是总体积。把包装形态和单件尺寸提前说清楚。', 'Cartons, bags, pallets and crates need more than a total-volume figure. Share the packing format and individual dimensions early.', 'Cajas, sacos, palés y cajones requieren algo más que el volumen total. Indicar embalaje y medidas por bulto.')}</p></div>
      <a className="freight-cta" href={`${prefix}/services/lcl-shipping-from-china/#lcl-field-record`}>{t('查看 LCL 混装与托盘加固实拍', 'View LCL mixed loading and pallet securing', 'Ver carga mixta LCL y sujeción de palés')} ↗</a>
    </div></section>
    <section className="freight-wrap freight-section" id="load-planning"><div className="freight-planning-layout"><div><p className="freight-kicker">03 / {t('装载规划', 'LOAD PLANNING', 'PLANIFICACIÓN')}</p><h2>{t('立方数够，\n不等于装得下。', 'Volume fits.\nDoes the cargo?', 'Cabe el volumen.\n¿Y la mercancía?')}</h2><p className="freight-intro">{t('单箱尺寸、摆放方向和货物组合，都会改变装入数量。先把箱单变成可以讨论的装载方案。', 'Package dimensions, orientation and cargo mix affect what fits. Turn the packing list into a loading plan before dispatch.', 'Medidas, orientación y combinación afectan la capacidad. Convertir la lista de embalaje en un plan antes de salir.')}</p><a className="freight-cta" href={quote}>{t('带着箱单讨论方案', 'Discuss your packing list', 'Consultar mi lista de carga')} ↗</a></div><figure><a href={`${media}load-plan.png`} target="_blank" rel="noreferrer"><img src={`${media}load-plan.webp`} alt={t('40HC装载模拟截图，Item B 需求1000件、模拟装入906件', '40HC simulation: Item B requested 1,000, loaded 906', 'Simulación 40HC: Item B solicitado 1000, cargado 906')} loading="lazy" /></a><figcaption>{t('40HC 装载模拟：Item B 计划 1,000 件，模拟装入 906 件。装载数量需结合箱单与现场条件确认。', '40HC loading simulation: 1,000 units of Item B planned, 906 fitted. Confirm capacity against the packing list and loading conditions.', 'Simulación 40HC: 1000 unidades de Item B previstas, 906 colocadas. Confirmar capacidad según lista de embalaje y condiciones de carga.')}</figcaption></figure></div></section>
    <section className="freight-destination-band" id="freight-destinations"><div className="freight-wrap freight-section"><p className="freight-kicker">04 / {t('下一站，哪里？', 'WHERE NEXT?', '¿PRÓXIMO DESTINO?')}</p><h2>{t('选市场，再定路线。', 'Choose the market. Then the route.', 'Primero el mercado. Después la ruta.')}</h2><div className="freight-destination-links">{Object.entries(regions).map(([id, region]) => <a key={id} href={`${prefix}/shipping-from-china-to-${id}/`}><span>{region.name[locale]}</span><span aria-hidden="true">↗</span></a>)}</div><a className="freight-specialist-link" href={`${prefix}/services/dangerous-goods-shipping-from-china/`}>{t('危险品、锂电池等特殊货物 → 查看专项运输与装柜记录', 'Dangerous goods or lithium batteries → Specialist shipping and loading records', 'Mercancías peligrosas o baterías → Transporte especializado y registros')}</a></div></section>
    <section className="freight-wrap freight-section freight-close" id="rfq-form-section"><p className="freight-kicker">LET’S GET THE DETAILS RIGHT</p><h2>{t('把这票货，\n具体聊一聊。', 'Let’s talk about\nyour actual cargo.', 'Hablemos de\ntu carga concreta.')}</h2><p>{t('发来品名、包装尺寸、毛重、供应商地点与目的地。提货、装柜、到港还是到门，我们逐项确认。', 'Send product details, package dimensions, gross weight, supplier location and destination. We will clarify pickup, loading and port or door delivery scope.', 'Enviar producto, medidas, peso bruto, proveedor y destino. Revisaremos recogida, carga y entrega en puerto o domicilio.')}</p><a className="freight-cta" href={quote}>{t('提交货运需求', 'Discuss your shipment', 'Consultar un envío')} ↗</a><small>{t('DDNZ 协调采购与出口衔接 · 国际货运由华正邦泰执行', 'DDNZ coordinates sourcing and export handover · Freight executed by Heaven Born', 'DDNZ coordina compras y exportación · Transporte por Heaven Born')}</small></section>
  </main>;
}
