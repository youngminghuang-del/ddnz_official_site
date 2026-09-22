import ImportOrderPlanning from '../features/freight/ImportOrderPlanning';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  PackageCheck,
  ReceiptText,
  Warehouse,
} from 'lucide-react';

type Country = 'mexico' | 'brazil' | 'argentina' | 'peru' | 'chile';
type SupportedLanguage = 'zh' | 'en' | 'es';

interface LatinAmericaFreightDepthProps {
  country: Country;
  language: string;
  onQuote: () => void;
  media?: Array<{
    src: string;
    type: 'image' | 'video';
    title: string;
    caption?: string;
    poster?: string;
  }>;
}

const COUNTRY_DETAILS: Record<Country, Record<SupportedLanguage, {
  countryName: string;
  heading: string;
  intro: string;
  importerTitle: string;
  importerChecks: string[];
  routeNote: string;
}>> = {
  mexico: {
    zh: {
      countryName: '墨西哥',
      heading: '先把整票成本和进口责任说清楚',
      intro: '墨西哥进口不能只比较一条“海运费”。RFC、进口商登记、报关代理、产品要求和目的地派送都会改变最终成本。',
      importerTitle: '墨西哥进口商需要先确认',
      importerChecks: ['进口主体的 RFC 与进口商登记状态', '负责申报的墨西哥报关代理', '产品是否涉及 NOM、标签或其他监管要求', '提单、发票、装箱单上的品名、数量和货值是否一致'],
      routeNote: '报价应明确写出 Manzanillo 或 Lázaro Cárdenas 的目的港费用、免箱期、查验除外项和最终派送地址。',
    },
    en: {
      countryName: 'Mexico',
      heading: 'Clarify the landed cost and importer responsibilities first',
      intro: 'A China–Mexico quote is more than an ocean rate. RFC data, importer registration, customs representation, product rules and inland delivery all affect the final cost.',
      importerTitle: 'Confirm with the Mexican importer',
      importerChecks: ['RFC and importer-registration status', 'The licensed customs broker responsible for entry', 'Whether NOM, labelling or other product rules apply', 'Consistent descriptions, quantities and values across all documents'],
      routeNote: 'The written quote should identify the destination charges, free-time terms, customs-exam exclusions and final delivery point for Manzanillo or Lázaro Cárdenas.',
    },
    es: {
      countryName: 'México',
      heading: 'Primero aclaremos el costo total y la responsabilidad de importación',
      intro: 'Una cotización China–México no es solo el flete marítimo. El RFC, el padrón, el agente aduanal, las normas del producto y la entrega interior cambian el costo final.',
      importerTitle: 'Confirma con el importador en México',
      importerChecks: ['RFC y situación en el Padrón de Importadores', 'Agente aduanal responsable del despacho', 'NOM, etiquetado u otros requisitos aplicables', 'Descripción, cantidades y valores coherentes en todos los documentos'],
      routeNote: 'La cotización debe indicar gastos en destino, días libres, exclusiones por reconocimiento aduanero y entrega final desde Manzanillo o Lázaro Cárdenas.',
    },
  },
  brazil: {
    zh: {
      countryName: '巴西',
      heading: '巴西报价必须从 NCM 和进口主体开始',
      intro: '运费只是其中一段。进口主体、NCM、产品许可、税费口径和 Santos 到最终地址的操作范围需要在订舱前确认。',
      importerTitle: '巴西进口商需要先确认',
      importerChecks: ['进口主体及 CNPJ 资料', 'NCM 分类和当前进口处理要求', '是否涉及 INMETRO、ANATEL、ANVISA 等产品要求', 'Santos 清关、提柜和内陆派送责任'],
      routeNote: '不要把港到港海运费当成到岸总成本。报价应单列起运地、主运、目的港、税费、清关和内陆派送。',
    },
    en: {
      countryName: 'Brazil',
      heading: 'A Brazil quote starts with the importer and NCM',
      intro: 'Freight is only one cost layer. Importer status, NCM, product approvals, tax scope and the Santos-to-door handover must be confirmed before booking.',
      importerTitle: 'Confirm with the Brazilian importer',
      importerChecks: ['Importer identity and CNPJ details', 'NCM classification and current import treatment', 'Any INMETRO, ANATEL or ANVISA requirement', 'Responsibility for clearance, pickup and inland delivery from Santos'],
      routeNote: 'Do not treat a port-to-port rate as landed cost. Separate origin, main freight, destination, tax, clearance and inland delivery.',
    },
    es: {
      countryName: 'Brasil',
      heading: 'La cotización para Brasil empieza con el importador y el NCM',
      intro: 'El flete es solo una parte. Antes de reservar hay que confirmar importador, NCM, permisos, alcance fiscal y la entrega desde Santos.',
      importerTitle: 'Confirma con el importador en Brasil',
      importerChecks: ['Datos del importador y CNPJ', 'Clasificación NCM y tratamiento de importación', 'Requisitos de INMETRO, ANATEL o ANVISA', 'Responsabilidad de despacho, retiro y entrega interior desde Santos'],
      routeNote: 'No compares un flete puerto a puerto con un costo puesto en destino. Separa origen, transporte principal, destino, impuestos, despacho y entrega.',
    },
  },
  argentina: {
    zh: {
      countryName: '阿根廷',
      heading: '先确认进口资格与付款条件，再安排出运',
      intro: '阿根廷项目应在装货前核对进口主体、CUIT、产品分类、许可和当地付款安排，避免货到港后才发现责任没有落实。',
      importerTitle: '阿根廷进口商需要先确认',
      importerChecks: ['进口主体和 CUIT 信息', 'NCM 分类及可能适用的许可', '商业付款与外汇安排', 'Buenos Aires 清关和最终派送责任'],
      routeNote: '所有时效都应拆成中国端准备、等船、海上运输、清关和内陆派送，而不是只写航程。',
    },
    en: {
      countryName: 'Argentina',
      heading: 'Confirm importer eligibility and payment arrangements before shipping',
      intro: 'Importer status, CUIT, classification, permits and local payment arrangements should be checked before loading, not after arrival.',
      importerTitle: 'Confirm with the Argentine importer',
      importerChecks: ['Importer identity and CUIT', 'NCM classification and possible permits', 'Commercial payment and foreign-exchange arrangements', 'Clearance and final-delivery responsibility in Buenos Aires'],
      routeNote: 'Transit should be shown as origin preparation, waiting time, ocean leg, clearance and inland delivery—not only days at sea.',
    },
    es: {
      countryName: 'Argentina',
      heading: 'Confirma al importador y el pago antes del embarque',
      intro: 'La situación del importador, CUIT, clasificación, permisos y pago local deben revisarse antes de cargar, no cuando la mercancía ya llegó.',
      importerTitle: 'Confirma con el importador argentino',
      importerChecks: ['Identidad del importador y CUIT', 'NCM y permisos que puedan aplicar', 'Forma de pago y operación cambiaria', 'Responsable del despacho y entrega en Buenos Aires'],
      routeNote: 'El plazo debe separar preparación en China, espera, travesía, despacho y entrega interior; no solo los días de navegación.',
    },
  },
  peru: {
    zh: {
      countryName: '秘鲁',
      heading: '把 Callao 到最终地址的费用一起核对',
      intro: '中国到秘鲁的报价应同时确认进口主体、商品分类、产品许可、Callao 目的港操作和 Lima 派送范围。',
      importerTitle: '秘鲁进口商需要先确认',
      importerChecks: ['进口主体及 RUC 信息', '商品分类与适用税费', '产品是否需要许可、登记或标签', 'Callao 清关、提货与 Lima 派送责任'],
      routeNote: '拼箱尤其要写清目的港拆箱、仓库、文件和派送费用，避免只比较每立方米海运费。',
    },
    en: {
      countryName: 'Peru',
      heading: 'Review the full cost from Callao to the final address',
      intro: 'A China–Peru quote should align the importer, classification, product permits, Callao handling and Lima delivery scope.',
      importerTitle: 'Confirm with the Peruvian importer',
      importerChecks: ['Importer identity and RUC', 'Classification and applicable duty or tax treatment', 'Any permit, registration or labelling requirement', 'Responsibility for Callao clearance, pickup and Lima delivery'],
      routeNote: 'For LCL, identify deconsolidation, warehouse, document and delivery charges instead of comparing only an ocean rate per CBM.',
    },
    es: {
      countryName: 'Perú',
      heading: 'Revisa el costo completo desde Callao hasta el destino final',
      intro: 'La cotización China–Perú debe alinear importador, clasificación, permisos, manejo en Callao y entrega en Lima.',
      importerTitle: 'Confirma con el importador peruano',
      importerChecks: ['Identidad del importador y RUC', 'Clasificación y tratamiento arancelario', 'Permisos, registros o etiquetado aplicables', 'Responsable del despacho, retiro y entrega desde Callao'],
      routeNote: 'En LCL conviene separar desconsolidación, almacén, documentos y entrega; no compares solo el precio por metro cúbico.',
    },
  },
  chile: {
    zh: {
      countryName: '智利',
      heading: '港口选择要和收货地址、船期与清关一起看',
      intro: 'San Antonio 或 Valparaíso 并不是单纯比海运费。收货人位置、可用船期、进口文件和内陆派送共同决定合适路线。',
      importerTitle: '智利进口商需要先确认',
      importerChecks: ['进口主体及 RUT 信息', '商品分类与产品要求', '使用 San Antonio 或 Valparaíso 的操作安排', '清关、提柜、还箱和最终派送责任'],
      routeNote: '报价应明确目的港、承运人条款、免箱期和 Santiago 或其他城市的派送边界。',
    },
    en: {
      countryName: 'Chile',
      heading: 'Choose the port together with the consignee location and clearance plan',
      intro: 'San Antonio and Valparaíso cannot be compared on ocean freight alone. Sailing options, importer documents and inland delivery shape the route.',
      importerTitle: 'Confirm with the Chilean importer',
      importerChecks: ['Importer identity and RUT', 'Classification and product requirements', 'Operating plan for San Antonio or Valparaíso', 'Responsibility for clearance, pickup, empty return and final delivery'],
      routeNote: 'The quote should name the port, carrier terms, free time and the delivery boundary for Santiago or the final city.',
    },
    es: {
      countryName: 'Chile',
      heading: 'El puerto se elige junto con la ubicación del consignatario y el despacho',
      intro: 'San Antonio y Valparaíso no se comparan solo por flete. Las salidas, documentos del importador y entrega interior definen la ruta.',
      importerTitle: 'Confirma con el importador chileno',
      importerChecks: ['Identidad del importador y RUT', 'Clasificación y requisitos del producto', 'Plan operativo para San Antonio o Valparaíso', 'Responsable de despacho, retiro, devolución y entrega final'],
      routeNote: 'La cotización debe indicar puerto, condiciones del transportista, días libres y límite de entrega en Santiago o la ciudad final.',
    },
  },
};

const PAGE_COPY: Record<SupportedLanguage, {
  eyebrow: string;
  costTitle: string;
  costIntro: string;
  stages: Array<{ title: string; detail: string }>;
  quoteCard: string;
  quoteItems: string[];
  routeLabel: string;
  quoteCta: string;
  consolidationTitle: string;
  consolidationIntro: string;
  consolidationSteps: Array<{ title: string; detail: string }>;
}> = {
  zh: {
    eyebrow: '报价与责任',
    costTitle: '一份能比较的报价，至少要拆成六段',
    costIntro: '只报一个“每立方米”或“每公斤”数字，很容易漏掉目的港和交付费用。下面六段应写进同一份报价。',
    stages: [
      { title: '中国提货', detail: '供应商地址、提货次数、等待及特殊装卸' },
      { title: '起运地费用', detail: '入仓、报关、文件、码头或拼箱操作' },
      { title: '国际运输', detail: '海运/空运费、航线、承运人和预计窗口' },
      { title: '目的港费用', detail: '码头、拆箱、文件、仓库及可能的第三方费用' },
      { title: '清关与税费', detail: '谁是进口商、谁申报、税费是否包含' },
      { title: '内陆交付', detail: '最终地址、车型、预约、等待和卸货责任' },
    ],
    quoteCard: '为了给出可执行报价，我们需要',
    quoteItems: ['产品名称、用途和 HS Code（如有）', '箱数、单箱尺寸、毛重和总体积', '货值、贸易条款和货好日期', '供应商数量及每个提货城市', '是否带电、液体、磁性或其他敏感属性', '目的地邮编、进口主体和清关范围'],
    routeLabel: '本线路特别注意',
    quoteCta: '按完整口径询价',
    consolidationTitle: '多个供应商拼成一票货，关键是交接证据',
    consolidationIntro: '集货不是把箱子堆在一起。每一次收货、差异、加固和出仓都应该有记录。',
    consolidationSteps: [
      { title: '预约与到仓', detail: '记录供应商、箱数、到仓时间和外包装状态。' },
      { title: '点数与拍照', detail: '发现短少、破损或标签问题时，在装柜前反馈。' },
      { title: '合并装箱资料', detail: '统一箱号、尺寸、重量、SKU 与供应商明细。' },
      { title: '托盘与加固', detail: '按货物属性和目的地要求决定是否打托、换箱或加固。' },
      { title: '出仓与交接', detail: '提供最终件重尺、装载照片和交接信息。' },
    ],
  },
  en: {
    eyebrow: 'Quote scope and responsibility',
    costTitle: 'A comparable quote should separate at least six cost layers',
    costIntro: 'A single price per CBM or kilogram can hide destination and delivery costs. Put all six layers on the same written quote.',
    stages: [
      { title: 'China pickup', detail: 'Supplier addresses, pickup count, waiting and special handling' },
      { title: 'Origin charges', detail: 'Receiving, export clearance, documents, terminal or CFS handling' },
      { title: 'Main freight', detail: 'Mode, routing, carrier and realistic transit window' },
      { title: 'Destination charges', detail: 'Terminal, deconsolidation, documents, warehouse and third-party fees' },
      { title: 'Clearance and tax', detail: 'Importer of record, declaration party and included taxes' },
      { title: 'Inland delivery', detail: 'Final address, vehicle, appointment, waiting and unloading' },
    ],
    quoteCard: 'For a usable quote, send us',
    quoteItems: ['Product name, use and HS code if known', 'Carton count, dimensions, gross weight and CBM', 'Cargo value, Incoterm and cargo-ready date', 'Supplier count and pickup cities', 'Battery, liquid, magnetic or other sensitive attributes', 'Destination postcode, importer and customs scope'],
    routeLabel: 'Route-specific note',
    quoteCta: 'Request a complete quote',
    consolidationTitle: 'When several suppliers become one shipment, the handover record matters',
    consolidationIntro: 'Consolidation is more than stacking cartons. Each receipt, discrepancy, repacking action and release should be recorded.',
    consolidationSteps: [
      { title: 'Book and receive', detail: 'Record supplier, carton count, arrival time and outer condition.' },
      { title: 'Count and photograph', detail: 'Report shortages, damage or label issues before loading.' },
      { title: 'Merge packing data', detail: 'Align carton IDs, dimensions, weights, SKUs and supplier details.' },
      { title: 'Palletise and secure', detail: 'Choose pallets, repacking or reinforcement for the cargo and destination.' },
      { title: 'Release and hand over', detail: 'Provide final dimensions, loading photographs and handover details.' },
    ],
  },
  es: {
    eyebrow: 'Alcance y responsabilidad',
    costTitle: 'Una cotización comparable separa al menos seis capas de costo',
    costIntro: 'Un único precio por CBM o kilo puede ocultar gastos de destino. Las seis capas deben aparecer en la misma cotización escrita.',
    stages: [
      { title: 'Recogida en China', detail: 'Direcciones, número de recogidas, espera y manejo especial' },
      { title: 'Gastos de origen', detail: 'Recepción, exportación, documentos, terminal o almacén CFS' },
      { title: 'Flete principal', detail: 'Modalidad, ruta, transportista y plazo realista' },
      { title: 'Gastos en destino', detail: 'Terminal, desconsolidación, documentos, almacén y terceros' },
      { title: 'Despacho e impuestos', detail: 'Importador, responsable de declarar e impuestos incluidos' },
      { title: 'Entrega interior', detail: 'Dirección, vehículo, cita, espera y descarga' },
    ],
    quoteCard: 'Para preparar una cotización útil necesitamos',
    quoteItems: ['Producto, uso y código HS si se conoce', 'Cajas, medidas, peso bruto y CBM', 'Valor, Incoterm y fecha de mercancía lista', 'Número de proveedores y ciudades de recogida', 'Baterías, líquidos, imanes u otras características sensibles', 'Código postal, importador y alcance aduanal'],
    routeLabel: 'Nota específica de la ruta',
    quoteCta: 'Solicitar cotización completa',
    consolidationTitle: 'Cuando varios proveedores forman un envío, importa la trazabilidad',
    consolidationIntro: 'Consolidar no es solo apilar cajas. Cada recepción, diferencia, refuerzo y salida debe quedar registrada.',
    consolidationSteps: [
      { title: 'Reserva y recepción', detail: 'Registrar proveedor, cajas, hora de llegada y estado exterior.' },
      { title: 'Conteo y fotografías', detail: 'Informar faltantes, daños o etiquetas antes de cargar.' },
      { title: 'Unificar datos', detail: 'Alinear cajas, medidas, pesos, SKU y datos de proveedores.' },
      { title: 'Paletizar y asegurar', detail: 'Definir palés, reembalaje o refuerzo según carga y destino.' },
      { title: 'Salida y entrega', detail: 'Facilitar medidas finales, fotos de carga y datos de entrega.' },
    ],
  },
};

export default function LatinAmericaFreightDepth({ country, language, onQuote, media = [] }: LatinAmericaFreightDepthProps) {
  const activeLanguage: SupportedLanguage | null = language === 'zh' || language === 'en' || language === 'es' ? language : null;

  if (!activeLanguage) return null;

  const page = PAGE_COPY[activeLanguage];
  const market = COUNTRY_DETAILS[country][activeLanguage];

  return (
    <>
      {country === 'brazil' && <ImportOrderPlanning locale={activeLanguage} market="brazil" />}
      <section className="border-y border-[#dce3ea] bg-[#fffdf9] py-16 text-[#10243f] md:py-24" aria-labelledby="latam-cost-scope-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#c94f2f]">{page.eyebrow}</p>
              <h2 id="latam-cost-scope-title" className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
                {market.heading}
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{market.intro}</p>

              <div className="mt-10 grid border-l border-t border-[#dce3ea] sm:grid-cols-2 xl:grid-cols-3">
                {page.stages.map((stage, index) => (
                  <article key={stage.title} className="border-b border-r border-[#dce3ea] bg-white p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-mono text-sm font-black text-[#c94f2f]">0{index + 1}</span>
                      <ReceiptText className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-black text-[#10243f]">{stage.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{stage.detail}</p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-[#dce3ea] bg-[#f3f5f7] p-6 md:p-8">
              <ClipboardCheck className="h-8 w-8 text-[#c94f2f]" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-black text-[#10243f]">{market.importerTitle}</h3>
              <ul className="mt-5 space-y-4">
                {market.importerChecks.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 border-l-2 border-[#c94f2f] bg-white p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c94f2f]">{page.routeLabel}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{market.routeNote}</p>
              </div>
            </aside>
          </div>

          <div className="mt-8 border-y border-[#dce3ea] bg-[#f3f5f7] p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.55fr_1fr] lg:items-center">
              <div>
                <PackageCheck className="h-8 w-8 text-[#c94f2f]" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-black text-[#10243f]">{page.quoteCard}</h3>
                <button type="button" onClick={onQuote} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#c94f2f] px-5 text-sm font-black text-white transition hover:bg-[#a84028] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c94f2f] focus-visible:ring-offset-4">
                  {page.quoteCta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {page.quoteItems.map((item) => (
                  <div key={item} className="flex gap-3 border-b border-[#dce3ea] bg-white p-4 text-sm leading-6 text-slate-600">
                    <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-[#246b93]" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {media.length > 0 && (
        <section className="border-b border-[#dce3ea] bg-[#fffdf9] py-16 text-[#10243f] md:py-20" aria-label="Additional freight records">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
            {media.map((item) => (
              <figure key={item.src} className="overflow-hidden rounded-xl border border-[#dce3ea] bg-white">
                {item.type === 'video' ? (
                  <video controls preload="metadata" poster={item.poster} className="aspect-video w-full bg-[#0b1c2c] object-cover">
                    <source src={item.src} />
                  </video>
                ) : (
                  <img src={item.src} alt={item.title} loading="lazy" decoding="async" className="aspect-video w-full object-cover" />
                )}
                <figcaption className="p-5">
                  <h3 className="font-black">{item.title}</h3>
                  {item.caption && <p className="mt-2 text-sm leading-6 text-slate-600">{item.caption}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="border-b border-[#dce3ea] bg-[#f3f5f7] py-16 text-[#10243f] md:py-24" aria-labelledby="latam-consolidation-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Warehouse className="h-9 w-9 text-[#c94f2f]" aria-hidden="true" />
            <h2 id="latam-consolidation-title" className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">{page.consolidationTitle}</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">{page.consolidationIntro}</p>
          </div>

          <a className="mt-6 inline-block font-bold underline underline-offset-4" href={`${activeLanguage === 'en' ? '' : activeLanguage === 'zh' ? '/zh-cn' : '/es'}/sourcing-services/consolidation-export/`}>{activeLanguage === 'zh' ? '查看多供应商集货：流程、费用与出货准备 →' : activeLanguage === 'es' ? 'Ver consolidación: proceso, costos y preparación →' : 'Explore consolidation: process, costs and preparation →'}</a>
          {country !== 'brazil' && <ol className="mt-10 grid border-l border-t border-[#d4dce4] md:grid-cols-5">
            {page.consolidationSteps.map((step, index) => (
              <li key={step.title} className="relative border-b border-r border-[#d4dce4] bg-[#fffdf9] p-5">
                <span className="font-mono text-sm font-black text-[#c94f2f]">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-base font-black text-[#10243f]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.detail}</p>
              </li>
            ))}
          </ol>}
        </div>
      </section>
    </>
  );
}
