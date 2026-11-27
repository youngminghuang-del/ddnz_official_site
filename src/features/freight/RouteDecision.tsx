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
  }, fr: {
    source: 'central_asia_route_builder',
    title: 'Bichkek seul ou livraison répartie entre Bichkek et Och ?',
    intro: 'Demandez au transporteur quel poste-frontière convient à votre lot, par exemple Irkechtam ou Torougart. Comparez ensuite les deux plans de réception sur la même liste de colis.',
    options: [
      {name:'Un entrepôt à Bichkek', handoff:'Transmettez l’adresse, les créneaux de déchargement et le contact du quai.', charges:'Distinguez l’attente à la frontière, le transfert éventuel entre camions et la livraison à l’entrepôt.', destination:'Kirghizistan · Bichkek', quoteNote:'Chiffrer un entrepôt à Bichkek. Préciser le poste-frontière, le transfert éventuel et le déchargement.'},
      {name:'Répartition entre Bichkek et Och', handoff:'Indiquez les marques de colis, les poids et les contacts par ville. Identifiez le lieu de séparation du lot.', charges:'Isolez le tri, le second trajet et le coût de deux remises signées.', destination:'Kirghizistan · Bichkek / Och', quoteNote:'Chiffrer la répartition Bichkek–Och. Indiquer le point de séparation, le second trajet et les preuves de remise.'},
    ],
    note:'Le passage et le transfert de camion sont à confirmer selon le chargement et la date de départ.',
  }, es: {
    source: 'central_asia_route_builder',
    title: '¿Un almacén en Biskek o entregas en Biskek y Osh?',
    intro: 'Pida al transportista el paso fronterizo propuesto, por ejemplo Irkeshtam o Torugart. Use el mismo lote para comprobar si la segunda entrega justifica separar los bultos antes del despacho.',
    options: [
      {name:'Un almacén en Biskek', handoff:'Facilite el domicilio, el horario de descarga y el contacto que firmará la entrega.', charges:'Pida partidas para espera en frontera, transbordo si aplica y descarga en el almacén.', destination:'Kirguistán · Biskek', quoteNote:'Cotizar un almacén en Biskek. Indicar el paso, el transbordo previsto y el alcance de la descarga.'},
      {name:'Reparto entre Biskek y Osh', handoff:'Asigne marcas, bultos y peso a cada ciudad. Pregunte dónde se separa la carga y quién firma en cada destino.', charges:'Separe el costo de clasificación, el segundo reparto y las dos entregas.', destination:'Kirguistán · Biskek / Osh', quoteNote:'Cotizar reparto en Biskek y Osh. Detallar punto de separación, segundo tramo y comprobantes de recepción.'},
    ],
    note:'El transportista confirma el paso y los cambios de vehículo según el lote y la fecha.',
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
  }, fr: {
    source: 'central_asia_route_builder',
    title: 'Douchanbé ou Khodjent : tout routier ou relais rail-route ?',
    intro: 'Faites chiffrer les deux solutions jusqu’au même entrepôt. Demandez au prestataire le point exact où sa responsabilité commence et où le destinataire reprend le lot.',
    options: [
      {name:'Tout routier jusqu’à l’entrepôt', handoff:'Demandez les pays traversés et vérifiez si le camion final peut accéder à la cour de réception.', charges:'Précisez le temps d’attente inclus à la frontière et au quai, ainsi que le déchargement.', destination:'Tadjikistan · Douchanbé / Khodjent', quoteNote:'Chiffrer le tout routier. Préciser les pays traversés, les changements de camion et les conditions au quai.'},
      {name:'Rail puis camion', handoff:'Faites nommer la dernière gare desservie, le point de transfert et la partie chargée d’enlever le lot.', charges:'Séparez manutention au transfert, stockage court et dernier trajet routier.', destination:'Tadjikistan · Douchanbé / Khodjent', quoteNote:'Chiffrer le relais rail-route. Identifier dernière gare, équipe de transfert, stockage et camion final.'},
    ],
    note:'Vérifiez la disponibilité du parcours complet et la responsabilité en cas de retard à l’enlèvement.',
  }, es: {
    source: 'central_asia_route_builder',
    title: 'Dusambé o Juyand: ¿todo por carretera o enlace tren-camión?',
    intro: 'Mantenga fijo el domicilio de entrega para comparar los dos recorridos. Antes de reservar, aclare quién recibe la mercancía en cada cambio de transporte.',
    options: [
      {name:'Carretera hasta la bodega', handoff:'Confirme los países de tránsito y si el vehículo de reparto puede entrar al patio de recepción.', charges:'Defina el tiempo de espera incluido y quién paga la descarga si la bodega no dispone de equipo.', destination:'Tayikistán · Dusambé / Juyand', quoteNote:'Cotizar solo carretera. Indicar países de tránsito, posibles cambios de camión, espera y descarga final.'},
      {name:'Tren con último tramo en camión', handoff:'Pida el nombre de la última estación, el lugar de transbordo y quién recoge allí la carga.', charges:'Desglose la maniobra, el almacenaje breve y el camión al domicilio pactado.', destination:'Tayikistán · Dusambé / Juyand', quoteNote:'Cotizar tren más camión. Indicar estación final, responsable del retiro, almacenaje y transporte a bodega.'},
    ],
    note:'Confirme que la combinación propuesta está disponible para la carga y fecha concretas.',
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
  }, fr: {
    source: 'international_country',
    title: 'San Antonio ou Valparaíso pour livrer à Santiago ?',
    intro: 'Comparez le même conteneur livré à la même adresse à Santiago. Demandez un prix qui identifie le terminal, le créneau d’enlèvement et le lieu de restitution du conteneur vide.',
    options: [
      {name:'Via San Antonio', handoff:'Demandez quel terminal reçoit le navire et qui coordonne l’enlèvement avec le camionneur.', charges:'Séparez les frais de terminal, le trajet jusqu’à Santiago et le retour du vide.', destination:'Chili · San Antonio → Santiago', quoteNote:'Comparer via San Antonio vers Santiago. Indiquer terminal, rendez-vous d’enlèvement et restitution du vide.'},
      {name:'Via Valparaíso', handoff:'Faites coïncider le créneau de retrait avec les heures de réception de l’entrepôt à Santiago.', charges:'Chiffrez le même domicile et précisez à partir de quand l’attente camion est facturée.', destination:'Chili · Valparaíso → Santiago', quoteNote:'Comparer via Valparaíso vers la même adresse. Préciser le terminal, le retrait et l’attente camion.'},
    ],
    note:'Le service maritime et les créneaux se confirment pour la date, le terminal et le conteneur retenus.',
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
  }, fr: {
    source: 'international_country',
    title: 'Buenos Aires : séparer l’échantillon du réassort',
    intro: 'Fixez la date de réception de l’échantillon et le lieu de livraison du stock. Identifiez le destinataire de chaque envoi et demandez deux devis lorsque les échéances diffèrent.',
    options: [
      {name:'Échantillon pour validation', handoff:'Indiquez les dimensions, la valeur déclarée, le destinataire et la date limite d’évaluation.', charges:'Demandez ce que couvre le prix jusqu’au destinataire et les éventuelles opérations locales.', destination:'Argentine · Buenos Aires', quoteNote:'Chiffrer un échantillon séparément et préciser la modalité proposée, le délai visé et le périmètre de remise.'},
      {name:'Réassort commercial par Buenos Aires', handoff:'Identifiez le terminal ou dépôt, le courtier et la personne qui réserve le créneau de retrait.', charges:'Détaillez le retrait, le stockage éventuel et le trajet jusqu’à l’entrepôt.', destination:'Argentine · Port de Buenos Aires', quoteNote:'Chiffrer le réassort via Buenos Aires. Séparer terminal ou dépôt, retrait et livraison à l’entrepôt.'},
    ],
    note:'Faites confirmer à l’importateur les documents et les responsabilités propres à chaque envoi.',
  }},
};

const labels = {
  en: {option:'Delivery option', handoff:'What to confirm at handover', charges:'Charges to itemise', quote:'Get a quote for this option', reference:'See route timing and sources'},
  zh: {option:'报价方案', handoff:'交接要确认什么', charges:'哪些费用要单列', quote:'按此方案询价', reference:'查看线路时效及来源'},
  fr: {option:'Option de livraison', handoff:'Points de remise à confirmer', charges:'Frais à détailler', quote:'Demander un devis pour cette option', reference:'Consulter les délais et les sources'},
  es: {option:'Opción', handoff:'Qué confirmar para la entrega', charges:'Qué costos separar', quote:'Cotizar esta opción', reference:'Ver plazos y fuentes de la ruta'},
};

export function routeDecision(country: string, locale: string) {
  return decisions[country]?.[locale];
}

export default function RouteDecision({decision, country, locale}: {decision: Decision; country: string; locale: string}) {
  const text = labels[locale as keyof typeof labels] ?? labels.en;
  const prefix = locale === 'en' ? '' : locale === 'zh' ? '/zh-cn' : `/${locale}`;
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
