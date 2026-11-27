import RouteDecisionPhotos from './RouteDecisionPhotos';
import { quoteLinkProps } from '../../lib/quoteLinkPolicy.mjs';

type DecisionOption = {
  name: string;
  handoff: string;
  charges: string;
  destination: string;
  quoteNote: string;
};

type Decision = {
  title: string;
  intro: string;
  options: DecisionOption[];
  note: string;
  source: 'central_asia_route_builder' | 'international_country';
};

const decisions: Partial<Record<string, Partial<Record<string, Decision>>>> = {
  kyrgyzstan: { en: {
    source: 'central_asia_route_builder',
    title: 'One warehouse in Bishkek or split delivery to Osh?',
    intro: 'Ask the carrier which crossing it proposes for your cargo, such as Irkeshtam or Torugart, and where the truck would change. Then price both receiving plans using the same shipment.',
    options: [
      {name:'One warehouse in Bishkek', handoff:'Give the warehouse address, unloading hours and receiving contact. Confirm whether the quote ends at a terminal or includes delivery to the warehouse.', charges:'Ask which charges cover border waiting, any truck change and unloading at the warehouse.', destination:'Kyrgyzstan · Bishkek', quoteNote:'Quote one Bishkek warehouse. Identify the planned border crossing, any truck change, waiting, final delivery and unloading.'},
      {name:'Split delivery to Bishkek and Osh', handoff:'List carton marks, package counts, weights and receiving contacts for each city. Ask where the load would be split and how each delivery will be signed for.', charges:'Itemise sorting and handling, the second delivery leg and any separate unloading charge.', destination:'Kyrgyzstan · Bishkek / Osh', quoteNote:'Quote split delivery to Bishkek and Osh. Identify the split point, second delivery charges and proof of delivery for each city.'},
    ],
    note:'Ask the carrier to confirm the crossing and transfer plan for your cargo and ready date.',
  }, zh: {
    source: 'central_asia_route_builder',
    title: '吉尔吉斯斯坦送货怎么选：比什凯克单仓还是分拨到奥什？',
    intro: '请承运商按同一批货比较伊尔克什坦、吐尔尕特或经哈萨克斯坦的备选线路，并注明计划口岸、换车地点和边境等待是否包含。',
    options: [
      {name:'比什凯克单仓', handoff:'报一个仓库地址、卸货条件及收货时间，明确由仓库签收还是买家自提。', charges:'区分到站交接与送仓，单列卸货和等待。', destination:'吉尔吉斯斯坦 · 比什凯克', quoteNote:'请按比什凯克单仓报价，注明口岸、换车、等待、末段及卸货范围。'},
      {name:'比什凯克、奥什两地分拨', handoff:'按城市提供箱号、件数、重量和各自的签收联系人。', charges:'单列分拨操作、第二站运费及两地签收凭证。', destination:'吉尔吉斯斯坦 · 比什凯克 / 奥什', quoteNote:'请按比什凯克与奥什两地分拨报价，列出各地交接、第二站运费和签收安排。'},
    ],
    note:'过境安排以承运商对实际起运地、货物和货好日的确认为准。',
  }},
  tajikistan: { en: {
    source: 'central_asia_route_builder',
    title: 'All-road or rail-to-road delivery to Dushanbe or Khujand?',
    intro: 'Use the same warehouse address and cargo dimensions for both quotes. Compare when the warehouse can receive the cargo and who takes responsibility at each handover.',
    options: [
      {name:'All-road to the warehouse', handoff:'Ask which countries and crossings the load would pass through. Confirm whether the same truck reaches the warehouse and whether it can enter the receiving yard.', charges:'Ask if border waiting, a truck change and unloading are included. Confirm the waiting allowance at delivery.', destination:'Tajikistan · Dushanbe / Khujand', quoteNote:'Quote all-road delivery to Dushanbe or Khujand. List transit countries, any truck change, waiting allowances and unloading scope.'},
      {name:'Rail-to-road to the warehouse', handoff:'Ask for the last rail station, the point where the cargo is loaded onto a truck and who arranges collection. Give the trucker the warehouse access requirements.', charges:'Separate transfer handling, short-term storage and the final truck leg. Confirm who pays if collection is delayed.', destination:'Tajikistan · Dushanbe / Khujand', quoteNote:'Quote rail-to-road delivery to Dushanbe or Khujand. Name the last rail station, transfer point and receiving party. Itemise handling, storage and final trucking.'},
    ],
    note:'Confirm availability, handover points and charges against the actual shipment and address.',
  }, zh: {
    source: 'central_asia_route_builder',
    title: '杜尚别或苦盏到仓：全程公路和铁转公怎么比？',
    intro: '把同一个最终地址写进两份询价。提前确认铁路与公路的交接地点、负责接货的一方，以及到中转点和送达仓库的费用差别。',
    options: [
      {name:'全程公路', handoff:'确认过境国家和公路段交接方式，注明送到杜尚别或苦盏的具体地址。', charges:'核对边境等待、可能换车和到仓卸货是否另计。', destination:'塔吉克斯坦 · 杜尚别 / 苦盏', quoteNote:'请比较全程公路到仓，列明经行国家、边境等待、换车及末段交付范围。'},
      {name:'铁转公', handoff:'请注明转公地点、谁接货和谁负责最后一段运输。', charges:'单列换装、短存和送仓费用，确认车辆能否进入收货点。', destination:'塔吉克斯坦 · 杜尚别 / 苦盏', quoteNote:'请比较铁转公到仓，列明换装地点、接货方、短存和送仓费用。'},
    ],
    note:'路线、换装和费用按具体货物与收货地址确认。',
  }},
  chile: { es: {
    source: 'international_country',
    title: 'San Antonio o Valparaíso para entregar en Santiago',
    intro: 'Pida dos cotizaciones para el mismo contenedor y la misma dirección en Santiago. La terminal de descarga, la cita de retiro y el regreso del contenedor vacío pueden cambiar el costo hasta la bodega.',
    options: [
      {name:'San Antonio → Santiago', handoff:'Pida el nombre de la terminal confirmada y quién coordina el retiro con el agente y el camionero.', charges:'Separe la operación en terminal, el transporte a Santiago y la devolución del vacío.', destination:'Chile · San Antonio → Santiago', quoteNote:'Compare vía San Antonio hasta la dirección en Santiago. Indique terminal, retiro y devolución del vacío.'},
      {name:'Valparaíso → Santiago', handoff:'Confirme la terminal del servicio ofrecido y cruce la cita de retiro con los horarios de la bodega.', charges:'Pida el tramo interior al mismo domicilio y confirme qué espera de camión se cobra aparte.', destination:'Chile · Valparaíso → Santiago', quoteNote:'Compare vía Valparaíso hasta la misma dirección en Santiago. Indique terminal, cita de retiro y espera de camión.'},
    ],
    note:'Cotice solo las terminales disponibles para el servicio y la fecha de salida previstos.',
  }},
  argentina: { es: {
    source: 'international_country',
    title: 'Buenos Aires: separar una muestra de un pedido de reposición',
    intro: 'Una muestra con fecha de evaluación y un pedido comercial para reponer inventario pueden requerir cotizaciones distintas. Defina quién recibe cada envío y dónde termina el servicio antes de comparar precios.',
    options: [
      {name:'Muestra de evaluación', handoff:'Indique bultos, dimensiones, valor declarado, destinatario y fecha límite para recibirla.', charges:'Pida el valor hasta el punto de recepción, con entrega y gestiones en destino por separado.', destination:'Argentina · Buenos Aires', quoteNote:'Cotice una muestra de evaluación por separado. Indique modalidad disponible, recepción y alcance de entrega.'},
      {name:'Reposición comercial por Buenos Aires', handoff:'Confirme terminal o depósito, importador, domicilio de la bodega y quién coordina el retiro.', charges:'Separe flete, gastos de retiro, almacenaje cuando corresponda y traslado a la bodega.', destination:'Argentina · Puerto Buenos Aires', quoteNote:'Cotice la reposición comercial por Buenos Aires. Separe terminal o depósito, retiro y transporte hasta la bodega.'},
    ],
    note:'Confirme la modalidad y las responsabilidades con el importador antes de reservar cada envío.',
  }},
};

const labels = {
  en: {option:'Delivery option', handoff:'What to confirm at handover', charges:'Charges to itemise', quote:'Get a quote for this option', reference:'See route timing and sources'},
  zh: {option:'报价方案', handoff:'交接要确认什么', charges:'哪些费用要单列', quote:'按此方案询价', reference:'查看线路时效及来源'},
  es: {option:'Opción', handoff:'Qué confirmar para la entrega', charges:'Qué costos separar', quote:'Cotizar esta opción', reference:'Ver plazos y fuentes de la ruta'},
};

export function routeDecision(country: string, locale: string) {
  return decisions[country]?.[locale];
}

export default function RouteDecision({decision, country, locale}: {decision: Decision; country: string; locale: string}) {
  const text = locale === 'en' ? labels.en : locale === 'zh' ? labels.zh : labels.es;
  const prefix = locale === 'en' ? '' : locale === 'zh' ? '/zh-cn' : '/es';
  return <section className="route-depth latin-arrival" id="freight-transit-reference" aria-labelledby="freight-decision-heading" data-route-decision>
    <div className="route-depth-inner">
      <h2 id="freight-decision-heading">{decision.title}</h2>
      <p className="route-depth-intro">{decision.intro}</p>
      <RouteDecisionPhotos country={country} locale={locale} />
      <table className="latin-transit-table freight-decision-table">
        <thead><tr><th scope="col">{text.option}</th><th scope="col">{text.handoff}</th><th scope="col">{text.charges}</th><th scope="col">{text.quote}</th></tr></thead>
        <tbody>{decision.options.map(option => {
          const params = new URLSearchParams({
            leadGoal: 'Freight Export',
            source: decision.source,
            destinationText: option.destination,
            notes: option.quoteNote,
          });
          return <tr key={option.name}>
            <th scope="row">{option.name}</th><td>{option.handoff}</td><td>{option.charges}</td>
            <td><a aria-label={text.quote + ' · ' + option.name} {...quoteLinkProps(prefix + '/get-a-quote/?' + params)}>{text.quote} ↗</a></td>
          </tr>;
        })}</tbody>
      </table>
      <p className="route-depth-note">{decision.note} <a className="underline underline-offset-4" href="#freight-route-options">{text.reference} ↓</a></p>
    </div>
  </section>;
}
