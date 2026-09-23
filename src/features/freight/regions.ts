import type { Language } from '../../i18n/translations';
export type FreightLocale = Language;
export type RegionId = 'latin-america' | 'west-africa' | 'middle-east';
type Words = Record<'zh' | 'en' | 'es', string>;
export const words = (zh: string, en: string, es: string): Words => ({ zh, en, es });
export const freightPrefix = (locale: FreightLocale) => locale === 'zh' ? '/zh-cn' : locale === 'en' ? '' : `/${locale}`;
export const regions = {
  'latin-america': {
    name: words('拉美', 'Latin America', 'Latinoamérica'),
    intro: words('目的国决定文件要求，交付地址决定后半程。先选市场，再一起确认货物、起运港与交付范围。', 'The destination country shapes document requirements; the delivery address shapes the final leg. Select your market, then review the cargo, origin port and delivery scope.', 'El país define los requisitos documentales; la dirección define el tramo final. Elige tu mercado y revisemos la carga, el puerto de origen y el alcance de entrega.'),
    countries: [
      { slug: 'mexico', name: words('墨西哥', 'Mexico', 'México'), focus: words('先核对进口主体、产品资料与最终交付地址；产品适用要求需在订舱前确认。', 'Review the importer, product details and final delivery address before booking.', 'Revisar importador, producto y dirección final antes de reservar.') },
      { slug: 'brazil', name: words('巴西', 'Brazil', 'Brasil'), focus: words('将进口商、单证、目的港费用与内陆运输放在同一份报价范围里核对。', 'Review importer details, documents, destination charges and inland transport together.', 'Revisar importador, documentos, gastos en destino y transporte interior en conjunto.') },
      { slug: 'argentina', name: words('阿根廷', 'Argentina', 'Argentina'), focus: words('明确由谁处理进口手续，先确认货好时间与收货安排，再确定运输方案。', 'Agree who handles import formalities, cargo readiness and receiving arrangements.', 'Acordar quién gestiona la importación, la fecha de carga y la recepción.') },
      { slug: 'peru', name: words('秘鲁', 'Peru', 'Perú'), focus: words('分别确认到港与到门范围，把拆箱、提货和内陆派送列清楚。', 'Separate port delivery from door delivery, including release, collection and inland transport.', 'Distinguir entrega a puerto y a domicilio, incluyendo retiro y transporte interior.') },
      { slug: 'chile', name: words('智利', 'Chile', 'Chile'), focus: words('从最终收货城市倒推港口与运输衔接，比较整柜和拼箱的完整费用。', 'Work back from the delivery city to compare gateways and complete FCL/LCL costs.', 'Partir de la ciudad de entrega para comparar puertos y costos completos FCL/LCL.') },
    ],
  },
  'west-africa': {
    name: words('西非', 'West Africa', 'África Occidental'),
    intro: words('海运到港只是其中一段。把清关分工、提货、内陆配送与补货安排放在一起，才能比较一票货的完整成本。', 'Arrival at port is only one stage. Compare clearance responsibilities, collection, inland delivery and replenishment as one shipment plan.', 'La llegada al puerto es solo una etapa. Compara despacho, retiro, entrega interior y reposición dentro de un mismo plan.'),
    countries: [
      { slug: 'nigeria', name: words('尼日利亚', 'Nigeria', 'Nigeria'), focus: words('不仅看运到哪里，还要看订单在哪里：将到港提货、库存位置和后续配送一起规划。', 'Plan port collection, stock location and onward delivery around actual customer orders.', 'Planificar retiro, ubicación del inventario y reparto según los pedidos reales.') },
      { slug: 'ghana', name: words('加纳', 'Ghana', 'Ghana'), focus: words('先明确进口文件与收货主体，再核对目的港操作及最终地址的派送范围。', 'Confirm the importer and documents, then destination handling and final-address delivery.', 'Confirmar importador y documentos, después la operación portuaria y entrega final.') },
    ],
  },
  'middle-east': {
    name: words('中东', 'Middle East', 'Oriente Medio'),
    intro: words('同在一个地区，不代表可以套用同一套运输与进口方案。按目的国核对货物、收货主体、交付地址与可用运输方式。', 'One region does not mean one shipping or import plan. Review cargo, importer, delivery address and available transport for each country.', 'Una región no implica un único plan de transporte o importación. Revisar carga, importador, dirección y modalidades por país.'),
    countries: [
      { slug: 'saudi-arabia', name: words('沙特阿拉伯', 'Saudi Arabia', 'Arabia Saudita'), focus: words('先核对产品资料和进口要求，再确认港口、文件分工与内陆交付。', 'Review product and import requirements before agreeing the gateway and inland delivery.', 'Revisar producto y requisitos de importación antes de acordar puerto y entrega interior.') },
      { slug: 'uae', name: words('阿联酋', 'United Arab Emirates', 'Emiratos Árabes Unidos'), focus: words('明确本地交付或后续转运，不同收货安排分别核对费用与文件。', 'Distinguish local delivery from onward transit when checking costs and documents.', 'Distinguir entrega local y tránsito posterior al revisar costos y documentos.') },
      { slug: 'kuwait', name: words('科威特', 'Kuwait', 'Kuwait'), focus: words('核对收货人信息、货物包装和末端交付条件。', 'Check consignee details, packaging and final-delivery conditions.', 'Revisar consignatario, embalaje y condiciones de entrega final.') },
      { slug: 'qatar', name: words('卡塔尔', 'Qatar', 'Catar'), focus: words('按货好时间和收货计划，比较海运与空运方案。', 'Compare sea and air options against cargo readiness and receiving dates.', 'Comparar mar y aire según disponibilidad de carga y fecha de recepción.') },
      { slug: 'oman', name: words('阿曼', 'Oman', 'Omán'), focus: words('以最终地址为依据，核对进港与内陆运输衔接。', 'Use the final address to review the gateway and inland connection.', 'Usar la dirección final para revisar puerto y conexión interior.') },
      { slug: 'bahrain', name: words('巴林', 'Bahrain', 'Baréin'), focus: words('先明确货物资料、进口分工与交付范围，再确认可用班期。', 'Confirm cargo, import responsibilities and delivery scope before checking departures.', 'Confirmar carga, responsabilidades y alcance antes de revisar salidas.') },
    ],
  },
} as const;
