type PlanningNote = readonly [heading: string, instruction: string];

const pilotNotes = {
  zh: {
    kyrgyzstan: ['吉尔吉斯斯坦交接前确认', '若比什凯克和奥什分别收货，按仓库拆分箱单和唛头，逐仓确认联系人、卸货条件及二次分拨是否单独计费。'],
    tajikistan: ['塔吉克斯坦到仓前确认', '如果报价含铁转公，列明铁路段截至哪个站、谁安排接车，以及杜尚别或苦盏仓库的卸货和等待费用由谁承担。'],
  },
  es: {
    argentina: ['Antes de recoger la carga para Argentina', 'Si la muestra viaja antes que la reposición, entrega al almacén listas de bultos separadas y confirma con tu despachante qué documentación necesita cada envío.'],
    chile: ['Antes de recoger la carga para Chile', 'Si compras a varias fábricas, identifica los bultos por proveedor y pide dimensiones y peso finales antes de comparar el retiro desde San Antonio y Valparaíso.'],
  },
} as const;

const regionalLinks = {
  zh: [{ href: '/zh-cn/shipping-from-china-to-central-asia/#central-asia-shipping-checklist', label: '查看中亚口岸、单证与运输常见问题' }],
  es: [
    { href: '/es/shipping-from-china-to-latin-america/#latin-america-shipping-checklist', label: 'Comparar modalidades y preparar el despacho en Latinoamérica' },
    { href: '/es/sourcing-services/consolidation-export/', label: 'Ver cómo consolidamos pedidos de varios proveedores en China' },
  ],
};

export function countryPlanningNote(country: string, locale: string) {
  if (locale !== 'zh' && locale !== 'es') return undefined;
  const notes: Record<string, PlanningNote> = pilotNotes[locale];
  return notes[country];
}

export default function CountryPlanningLinks({ note, locale }: { note: PlanningNote; locale: 'zh' | 'es' }) {
  return (
    <section className="border-y border-slate-200 bg-[#f3f5f7] text-[#10243f]" aria-labelledby="country-planning-heading">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 id="country-planning-heading" className="text-2xl font-black">{note[0]}</h2>
        <p className="mt-3 max-w-3xl leading-7">{note[1]}</p>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {regionalLinks[locale].map(({ href, label }) => (
            <li key={href}><a className="inline-flex min-h-11 items-center font-bold underline underline-offset-4" href={href}>{label}</a></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
