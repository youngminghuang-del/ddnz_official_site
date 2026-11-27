type PlanningNote = readonly [heading: string, instruction: string];

const pilotNotes: Record<string, Record<string, PlanningNote>> = {
  en: {
    kyrgyzstan: ['Confirm the importer and receiving plan', 'Have the Kyrgyz importer or broker check which EAEU customs and product documents apply. For a split load, give them carton marks and a packing breakdown by receiving city before pickup.'],
    tajikistan: ['Confirm clearance and warehouse access', 'Ask the Tajik importer or broker which documents apply under Tajikistan’s import rules. Give the carrier the receiving hours and unloading equipment at the final address before booking either option.'],
  },
  zh: {
    kyrgyzstan: ['吉尔吉斯斯坦交接前确认', '若比什凯克和奥什分别收货，按仓库拆分箱单和唛头，逐仓确认联系人、卸货条件及二次分拨是否单独计费。'],
    tajikistan: ['塔吉克斯坦到仓前确认', '如果报价含铁转公，列明铁路段截至哪个站、谁安排接车，以及杜尚别或苦盏仓库的卸货和等待费用由谁承担。'],
  },
  fr: {
    kyrgyzstan: ['Préparer la réception au Kirghizistan', 'Faites confirmer les justificatifs applicables par l’importateur ou son courtier. En cas de répartition, transmettez des listes de colis distinctes, avec les marques et le contact qui signe dans chaque ville.'],
    tajikistan: ['Préparer la remise à l’entrepôt tadjik', 'Demandez au courtier de vérifier les pièces applicables à votre importation. Indiquez au transporteur les heures du quai, les restrictions d’accès et l’équipement disponible pour la dernière livraison.'],
    chile: ['Organiser le retrait et la restitution au Chili', 'Demandez à l’agent le terminal indiqué au connaissement, la disponibilité du conteneur et le lieu de retour du vide. Donnez au camionneur l’adresse et la plage de réception à Santiago.'],
    argentina: ['Préparer deux dossiers pour Buenos Aires', 'Si l’échantillon part avant le réassort, distinguez les listes de colis et les destinataires. Pour le stock, confirmez l’importateur, le retrait au terminal ou au dépôt et le créneau de réception.'],
  },
  es: {
    kyrgyzstan: ['Prepare la recepción en Kirguistán', 'Pida al importador o a su agente que confirme la documentación aplicable. Para dos entregas, identifique las marcas y los destinatarios por ciudad antes de recoger la carga.'],
    tajikistan: ['Prepare la entrega en la bodega tayika', 'Confirme con el agente los documentos que corresponden a ese embarque. Si el último tramo es en camión, indique acceso, horario y medios de descarga en el domicilio pactado.'],
    argentina: ['Antes de recoger la carga para Argentina', 'Si la muestra viaja antes que la reposición, entrega al almacén listas de bultos separadas y confirma con tu despachante qué documentación necesita cada envío.'],
    chile: ['Antes de recoger la carga para Chile', 'Si compras a varias fábricas, identifica los bultos por proveedor y pide dimensiones y peso finales antes de comparar el retiro desde San Antonio y Valparaíso.'],
  },
};

type Region = 'central-asia' | 'latin-america';
const regionalLinks: Record<Region, Record<string, { href: string; label: string }[]>> = {
  'central-asia': {
    en: [{ href: '/shipping-from-china-to-central-asia/#central-asia-shipping-checklist', label: 'See the Central Asia shipment checklist and FAQs' }],
    zh: [{ href: '/zh-cn/shipping-from-china-to-central-asia/#central-asia-shipping-checklist', label: '查看中亚口岸、单证与运输常见问题' }],
    fr: [{ href: '/fr/shipping-from-china-to-central-asia/', label: 'Consulter le guide du fret en Asie centrale' }],
    es: [{ href: '/es/shipping-from-china-to-central-asia/', label: 'Consultar la guía de transporte a Asia Central' }],
  },
  'latin-america': {
    fr: [{ href: '/fr/shipping-from-china-to-latin-america/', label: 'Comparer les options de fret en Amérique latine' }],
    es: [
      { href: '/es/shipping-from-china-to-latin-america/#latin-america-shipping-checklist', label: 'Comparar modalidades y preparar el despacho en Latinoamérica' },
      { href: '/es/sourcing-services/consolidation-export/', label: 'Ver cómo consolidamos pedidos de varios proveedores en China' },
    ],
  },
};

export function countryPlanningNote(country: string, locale: string) {
  return pilotNotes[locale]?.[country];
}

export default function CountryPlanningLinks({ note, locale, region }: { note: PlanningNote; locale: string; region: Region }) {
  const links = regionalLinks[region][locale] ?? [];
  return (
    <section className="border-y border-slate-200 bg-[#f3f5f7] text-[#10243f]" aria-labelledby="country-planning-heading">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 id="country-planning-heading" className="text-2xl font-black">{note[0]}</h2>
        <p className="mt-3 max-w-3xl leading-7">{note[1]}</p>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {links.map(({ href, label }) => (
            <li key={href}><a className="inline-flex min-h-11 items-center font-bold underline underline-offset-4" href={href}>{label}</a></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
