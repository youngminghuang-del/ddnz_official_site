import {translatedTree,translatedText} from '../site-localization/translate.mjs';
import type { Language } from '../../i18n/translations';
import { freightPrefix } from './regions';

type Context = 'middle-east' | 'west-africa' | 'latin-america' | 'central-asia' | 'nigeria';
type Locale = 'en' | 'zh' | 'es';
type Card = { title: string; question: string; answer: string; destination?: string };
type Content = { kicker: string; heading: string; intro: string; cards: [Card, Card, Card]; note: string };

const content: Record<Context, Record<Locale, Content>> = {
  'middle-east': {
    en: { kicker: 'CHINA ORIGIN × GULF DESTINATION', heading: 'Start with the supplier city, then choose the Gulf delivery plan.', intro: 'These are cargo-planning examples, not fixed sailings. Share the factory location and exact product before selecting a port or quoting a destination.', cards: [
      { title: 'Foshan → Saudi Arabia · kitchen equipment', question: 'How should mixed kitchen equipment leave Foshan?', answer: 'List each appliance, its crate size, voltage and packing method. Compare China pickup and consolidation with the Saudi importer’s product-document requirements.', destination: 'saudi-arabia' },
      { title: 'Shenzhen → UAE · electronics', question: 'What must be checked before electronics are loaded?', answer: 'Confirm model, power source, battery status and carton marks. Then compare nearby South China terminals against the UAE receiving address and delivery boundary.', destination: 'uae' },
      { title: 'Guangzhou → Gulf markets · mixed suppliers', question: 'Should several suppliers ship together?', answer: 'Reconcile ready dates, carton counts and gross weights before choosing a shared load. A late supplier can change the collection and shipment plan.' },
    ], note: 'Origin city is not necessarily the port of loading; the actual port and service are confirmed against the shipment.' },
    zh: { kicker: '中国货源地 × 海湾目的地', heading: '先确定供应商城市，再设计海湾交付方案。', intro: '以下是货物规划场景，不是固定班期。确定工厂位置和具体货物后，再比较起运港与目的地报价。', cards: [
      { title: '佛山 → 沙特 · 餐厨设备', question: '佛山多类厨房设备如何集货？', answer: '逐台列出设备、木箱尺寸、电压和包装方式，再把中国端提货集拼与沙特进口方的产品文件要求一起核对。', destination: 'saudi-arabia' },
      { title: '深圳 → 阿联酋 · 电子产品', question: '电子货装运前要核对什么？', answer: '核对型号、供电方式、是否含电池及外箱唛头，再按阿联酋收货地址与交付边界比较华南起运港。', destination: 'uae' },
      { title: '广州 → 海湾各国 · 多供应商货', question: '几家供应商能否合并出货？', answer: '先对齐货好日期、件数与毛重。只要一家晚交货，集货与发运安排都可能改变。' },
    ], note: '货源城市不等于装船港口；具体港口和服务以本票货物核实为准。' },
    es: { kicker: 'ORIGEN EN CHINA × GOLFO', heading: 'Primero la ciudad del proveedor; después, la entrega en el Golfo.', intro: 'Son escenarios de planificación, no salidas fijas. Confirme fábrica y producto antes de elegir puerto o cotizar.', cards: [
      { title: 'Foshan → Arabia Saudita · cocinas', question: '¿Cómo agrupar equipos de cocina de Foshan?', answer: 'Detalle cada equipo, caja, voltaje y embalaje. Compare recogida y consolidación con los documentos que necesita el importador saudí.', destination: 'saudi-arabia' },
      { title: 'Shenzhen → EAU · electrónica', question: '¿Qué comprobar antes de cargar electrónicos?', answer: 'Confirme modelo, alimentación, baterías y marcas de cajas. Compare terminales del sur de China según dirección y alcance de entrega en EAU.', destination: 'uae' },
      { title: 'Guangzhou → Golfo · varios proveedores', question: '¿Conviene enviar todo junto?', answer: 'Concilie fechas, bultos y peso bruto. Un proveedor atrasado puede cambiar la recogida y el plan de salida.' },
    ], note: 'La ciudad de origen no es necesariamente el puerto de carga; se confirma por envío.' },
  },
  'west-africa': {
    en: { kicker: 'CHINA ORIGIN × WEST AFRICA', heading: 'Match the buying cluster to the receiving market.', intro: 'The useful question is not just which port is closest, but where goods are collected and where inventory will be received.', cards: [
      { title: 'Guangzhou → Nigeria · appliances', question: 'How do Guangzhou supplier cartons become one Lagos load?', answer: 'Match carton marks, models and ready dates across suppliers; agree whether the importer collects at port, warehouse or a Lagos address.', destination: 'nigeria' },
      { title: 'Shenzhen / Dongguan → Nigeria · electronics', question: 'What changes for mixed electronics?', answer: 'Separate product identities, power and battery information before consolidation, then check importer documents by product rather than by container.', destination: 'nigeria' },
      { title: 'Yiwu → Ghana · mixed wholesale goods', question: 'Is inland consolidation worth the extra collection step?', answer: 'Group small orders by supplier and packing type; compare the full China-side collection cost with the receiving plan in Ghana.', destination: 'ghana' },
    ], note: 'The examples indicate planning topics, not a claim that every city–destination route is a scheduled service.' },
    zh: { kicker: '中国货源地 × 西非', heading: '让采购产业地与目的地收货市场对上。', intro: '需要比较的不只是哪个港口近，还包括货在哪里集、库存最终在哪里接收。', cards: [
      { title: '广州 → 尼日利亚 · 家电', question: '广州多家供应商的纸箱如何合成一票拉各斯货？', answer: '按供应商核对型号、唛头和货好日期；确认进口方在港口、仓库还是拉各斯地址接货。', destination: 'nigeria' },
      { title: '深圳／东莞 → 尼日利亚 · 电子货', question: '混装电子产品多核对哪一步？', answer: '集货前区分产品型号、供电和电池资料，再按品类核对进口文件，不能按“同一个柜子”一概处理。', destination: 'nigeria' },
      { title: '义乌 → 加纳 · 多品类批发货', question: '内陆集货多一步是否划算？', answer: '按供应商与包装方式归集小订单，把中国端提货费用与加纳收货安排放在一起比较。', destination: 'ghana' },
    ], note: '以上是规划主题，不代表每组城市与目的国均有固定班期。' },
    es: { kicker: 'ORIGEN EN CHINA × ÁFRICA OCCIDENTAL', heading: 'Conecte la zona de compra con el mercado receptor.', intro: 'Importa tanto dónde se agrupa la mercancía como dónde se recibirá el inventario.', cards: [
      { title: 'Guangzhou → Nigeria · electrodomésticos', question: '¿Cómo reunir cajas de varios proveedores para Lagos?', answer: 'Compruebe modelos, marcas y fechas por proveedor; acuerde si el importador retira en puerto, almacén o dirección en Lagos.', destination: 'nigeria' },
      { title: 'Shenzhen / Dongguan → Nigeria · electrónica', question: '¿Qué cambia con electrónicos mixtos?', answer: 'Separe modelos, alimentación y baterías antes de consolidar; compruebe documentos por producto, no solo por contenedor.', destination: 'nigeria' },
      { title: 'Yiwu → Ghana · mayorista mixto', question: '¿Compensa la consolidación interior?', answer: 'Agrupe pedidos por proveedor y embalaje; compare recogida en China con el plan de recepción en Ghana.', destination: 'ghana' },
    ], note: 'Son temas de planificación, no promesas de servicio programado para cada ruta.' },
  },
  'latin-america': {
    en: { kicker: 'CHINA ORIGIN × LATIN AMERICA', heading: 'Heavy, mixed and regulated cargo need different origin plans.', intro: 'Use the cargo and destination together. A factory city alone cannot determine the port, container type or import documents.', cards: [
      { title: 'Foshan → Peru · tiles', question: 'Why measure tile weight before quoting?', answer: 'Record pallet count, gross weight, volume and loading photos. Compare a full-container plan with the importer’s Callao release and inland collection scope.', destination: 'peru' },
      { title: 'Yiwu → Mexico · mixed retail stock', question: 'How should many small supplier orders be reconciled?', answer: 'Collect product-level descriptions, carton counts and values before deciding whether to consolidate inland and which export port to compare.', destination: 'mexico' },
      { title: 'Shenzhen → Brazil · electronics', question: 'Who confirms product and importer requirements?', answer: 'Identify the exact model and importer before booking. Compare China pickup and port options only after the Brazilian entry requirements are checked.', destination: 'brazil' },
    ], note: 'The Foshan tile example uses China-side loading evidence; it does not by itself prove arrival or customs release in Peru.' },
    zh: { kicker: '中国货源地 × 拉美', heading: '重货、混货、监管货，起运方案不能一样。', intro: '货类和目的地要一起看。只知道工厂城市，不足以决定港口、柜型和进口文件。', cards: [
      { title: '佛山 → 秘鲁 · 瓷砖', question: '为什么瓷砖询价先算重量？', answer: '记录托盘数、总毛重、体积与装柜照片；把整柜方案与卡亚俄清关放货、内陆提货范围一起核算。', destination: 'peru' },
      { title: '义乌 → 墨西哥 · 混合零售货', question: '多家小订单如何对单？', answer: '先收齐逐产品的品名、箱数和货值，再决定内陆集货方式和比较哪个出口港。', destination: 'mexico' },
      { title: '深圳 → 巴西 · 电子产品', question: '谁来确认产品与进口主体要求？', answer: '订舱前明确型号和进口商。核对巴西进口要求后，再比较中国端提货与起运港。', destination: 'brazil' },
    ], note: '佛山瓷砖案例只有中国端装载证据，不能单凭照片证明已抵达或完成秘鲁清关。' },
    es: { kicker: 'ORIGEN EN CHINA × LATINOAMÉRICA', heading: 'Carga pesada, mixta y regulada: planes de salida distintos.', intro: 'Evalúe producto y destino juntos; la ciudad de fábrica no determina por sí sola puerto, contenedor ni documentos.', cards: [
      { title: 'Foshan → Perú · baldosas', question: '¿Por qué calcular primero el peso?', answer: 'Registre palés, peso bruto, volumen y fotos de carga. Compare FCL con despacho en Callao y retirada interior.', destination: 'peru' },
      { title: 'Yiwu → México · surtido minorista', question: '¿Cómo conciliar muchos pedidos pequeños?', answer: 'Reúna descripción, cajas y valor por producto antes de decidir consolidación interior y puerto de salida.', destination: 'mexico' },
      { title: 'Shenzhen → Brasil · electrónica', question: '¿Quién confirma producto e importador?', answer: 'Defina modelo e importador antes de reservar. Revise requisitos brasileños antes de comparar recogida y puerto chino.', destination: 'brazil' },
    ], note: 'La foto de carga en China de las baldosas no demuestra llegada ni despacho en Perú.' },
  },
  'central-asia': {
    en: { kicker: 'CHINA ORIGIN × CENTRAL ASIA', heading: 'The supplier location changes the inland leg before the border.', intro: 'Compare factory collection, load stability, border documents and the agreed pickup point together. These are scenarios to check, not fixed cross-border schedules.', cards: [
      { title: 'Yiwu → Kazakhstan · mixed wholesale stock', question: 'How do small supplier orders become one border-ready load?', answer: 'Reconcile supplier invoices, carton marks, weights and ready dates before choosing consolidation and road or rail handoff.', destination: 'kazakhstan' },
      { title: 'Yongkang → Uzbekistan · hardware', question: 'What matters for dense metal cargo?', answer: 'Measure pallet gross weight, footprint and forklift access. Agree blocking and securing before the cross-border road or rail plan.', destination: 'uzbekistan' },
      { title: 'Jinhua area → Central Asia · multiple factories', question: 'Is one pickup route better than separate dispatches?', answer: 'Map factory addresses and ready dates first; compare domestic collection, border transfer and destination warehouse pickup as separate cost lines.' },
    ], note: 'Our photographed wheel-hub and Jiaozhou loads are separate records; these city examples do not claim those cargoes originated in Yiwu or Yongkang.' },
    zh: { kicker: '中国货源地 × 中亚', heading: '供应商在哪里，决定了到口岸之前怎么走。', intro: '工厂提货、装载稳定性、口岸文件和目的地提货点要一起核算。以下是待确认的规划场景，并非固定班列或汽运班期。', cards: [
      { title: '义乌 → 哈萨克斯坦 · 多品类批发货', question: '小订单如何合成可过口岸的一票货？', answer: '先核对各供应商发票、唛头、毛重和货好日期，再决定集货及汽运或铁路交接。', destination: 'kazakhstan' },
      { title: '永康 → 乌兹别克斯坦 · 五金', question: '密集金属货重点量什么？', answer: '确认托盘毛重、底面积与叉车操作条件；跨境汽运或铁路方案之前先约定阻挡和加固方式。', destination: 'uzbekistan' },
      { title: '金华地区 → 中亚 · 多工厂', question: '一次巡回提货还是分批发车？', answer: '先列工厂地址与货好时间，把国内提货、口岸交接和目的地仓库自提拆成不同费用项。' },
    ], note: '现有轮毂和胶州装车照片是另外两票记录；这些城市场景不表示照片中的货来自义乌或永康。' },
    es: { kicker: 'ORIGEN EN CHINA × ASIA CENTRAL', heading: 'La ciudad del proveedor cambia el tramo previo a la frontera.', intro: 'Compare recogida, estabilidad de carga, documentos y lugar de retiro. Son escenarios, no servicios con horario fijo.', cards: [
      { title: 'Yiwu → Kazajistán · surtido mayorista', question: '¿Cómo preparar varios pedidos para la frontera?', answer: 'Concilie facturas, marcas, pesos y fechas antes de agrupar y elegir carretera o ferrocarril.', destination: 'kazakhstan' },
      { title: 'Yongkang → Uzbekistán · ferretería', question: '¿Qué medir para piezas metálicas densas?', answer: 'Confirme peso bruto, base de palé y acceso de carretilla; acuerde bloqueo y sujeción antes de planear el trayecto.', destination: 'uzbekistan' },
      { title: 'Zona de Jinhua → Asia Central · varias fábricas', question: '¿Una ruta de recogida o salidas separadas?', answer: 'Liste direcciones y fechas; separe recogida china, transferencia fronteriza y retiro en almacén de destino.' },
    ], note: 'Los casos fotografiados son otros envíos; no se afirma que sus mercancías salieran de Yiwu o Yongkang.' },
  },
  nigeria: {
    en: { kicker: 'SUPPLIER CITY × LAGOS RECEIVING', heading: 'Three China-origin questions for Lagos wholesale buyers.', intro: 'A market name is useful only when matched to product identity, receiving point and who handles the handoff.', cards: [
      { title: 'Guangzhou → Alaba · appliances', question: 'Are appliance models and cartons ready to combine?', answer: 'List model, voltage, carton count and supplier ready date; confirm the Lagos importer and whether delivery ends at port, warehouse or market address.' },
      { title: 'Shenzhen → Computer Village · electronics', question: 'Can mixed electronics be documented item by item?', answer: 'Keep exact models, power and battery details separate in the packing list before consolidation; agree the Ikeja receiving contact.' },
      { title: 'Yiwu → Lagos · mixed retail goods', question: 'Would inland consolidation save a second shipment?', answer: 'Compare collection cost, carton sizes and supplier timing with one combined load and the buyer’s stock-receiving plan.' },
    ], note: 'These are buyer-planning examples, not claims of photographed delivery to any market.' },
    zh: { kicker: '供应商城市 × 拉各斯收货', heading: '拉各斯批发买家，先回答三个中国起运问题。', intro: '市场名称只有与具体品名、收货点和交接责任对上，才能用于运输方案。', cards: [
      { title: '广州 → Alaba · 家电', question: '型号和纸箱资料能否一起装？', answer: '列出型号、电压、箱数与各供应商货好时间；确认拉各斯进口商，以及交付终点是港口、仓库还是市场地址。' },
      { title: '深圳 → Computer Village · 电子货', question: '混装电子产品能否逐项对单？', answer: '集货前在箱单中分别列出准确型号、供电和电池信息，并确认 Ikeja 收货联系人。' },
      { title: '义乌 → 拉各斯 · 混合零售货', question: '内陆集货能否少发一票？', answer: '把提货费用、箱规、供应商时间与合并后的装载和买家入库计划一起比较。' },
    ], note: '这些是买家规划场景，不代表已有照片证明货物送达任何批发市场。' },
    es: { kicker: 'PROVEEDOR × RECEPCIÓN EN LAGOS', heading: 'Tres preguntas de origen chino para compradores de Lagos.', intro: 'El nombre del mercado sirve cuando se confirma producto, lugar de recepción y responsable del relevo.', cards: [
      { title: 'Guangzhou → Alaba · electrodomésticos', question: '¿Están listos modelos y cajas para agrupar?', answer: 'Liste modelos, voltaje, cajas y fechas; confirme importador y si la entrega termina en puerto, almacén o mercado.' },
      { title: 'Shenzhen → Computer Village · electrónica', question: '¿Se puede documentar cada artículo?', answer: 'Separe modelos, alimentación y baterías en la lista antes de agrupar; confirme el contacto receptor en Ikeja.' },
      { title: 'Yiwu → Lagos · surtido minorista', question: '¿Compensa una sola carga consolidada?', answer: 'Compare recogida, tamaños y fechas de proveedores con el plan de carga e ingreso de inventario del comprador.' },
    ], note: 'Son ejemplos de planificación; no se afirma entrega fotografiada a ningún mercado.' },
  },
};

export default function OriginDestinationOpportunities({ context, locale }: { context: Context; locale: Language }) {
  const c: Content = ['en','zh','es'].includes(locale) ? content[context][locale as 'en'|'zh'|'es'] : translatedTree(content[context].en,locale);
  const prefix = freightPrefix(locale);
  const linkLabel = locale === 'zh' ? '查看目的国方案' : locale === 'es' ? 'Ver ruta del país' : translatedText('Review country route',locale);
  const planLabel = locale === 'zh' ? '起运方案' : locale === 'es' ? 'PLAN DE ORIGEN' : translatedText('ORIGIN PLAN',locale);
  return <section className="freight-origin-opportunities" aria-label={c.heading}>
    <div className="freight-origin-opportunities-head"><p className="freight-kicker">{c.kicker}</p><h2>{c.heading}</h2><p>{c.intro}</p></div>
    <div className="freight-origin-opportunities-grid">{c.cards.map((card, index) => <article key={card.title}>
      <span>0{index + 1} / {planLabel}</span><h3>{card.title}</h3><strong>{card.question}</strong><p>{card.answer}</p>
      {card.destination && <a href={`${prefix}/shipping-from-china-to-${card.destination}/`}>{linkLabel} ↗</a>}
    </article>)}</div><p className="freight-origin-opportunities-note">{c.note}</p>
  </section>;
}
