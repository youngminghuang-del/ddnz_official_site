export default function SpanishInspectionScope({ quoteHref }: { quoteHref: string }) {
  return (
    <section id="auditoria-o-inspeccion" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h2 className="text-3xl font-bold">Auditoría de fábrica e inspección de producto en China</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="flex flex-col rounded-xl border border-slate-200 p-5">
          <h3 className="text-xl font-bold">Inspección de producto</h3>
          <p className="mt-2">Durante la producción o antes del embarque, revisa un lote según el alcance acordado. El informe documenta cantidades, defectos, pruebas funcionales y empaque con fotos cuando corresponda.</p>
          <figure className="mt-auto pt-4">
            <img
              src="/images/posts/cairo-mixed-phone-cases-screen-protectors-packing/open-cartons-content-check.webp"
              alt="Personal fotografiando el contenido de cajas abiertas en un almacén."
              width={3648}
              height={1712}
              loading="lazy"
              decoding="async"
              className="aspect-video w-full rounded-lg object-cover"
            />
            <figcaption className="mt-2 text-sm text-slate-600">Registro fotográfico del contenido y del embalaje interior de un lote de accesorios.</figcaption>
          </figure>
        </article>
        <article className="flex flex-col rounded-xl border border-slate-200 p-5">
          <h3 className="text-xl font-bold">Auditoría de fábrica</h3>
          <p className="mt-2">Antes de aprobar una planta, define qué procesos, equipos y controles deben comprobarse. El informe recoge los registros revisados, las observaciones de la visita y los puntos pendientes.</p>
          <figure className="mt-auto pt-4">
            <img
              src="/images/product-showcase/kitchen/kitchen-factory-inspection-sanitized.webp"
              alt="Tres personas revisando equipos de acero inoxidable en un taller de producción."
              width={1536}
              height={1024}
              loading="lazy"
              decoding="async"
              className="aspect-video w-full rounded-lg object-cover"
            />
            <figcaption className="mt-2 text-sm text-slate-600">Revisión en planta de equipos para cocinas comerciales en China.</figcaption>
          </figure>
        </article>
      </div>
      <p className="mt-5">Indica la ciudad, el producto, la cantidad, la etapa del pedido y los criterios de aceptación que quieres verificar.</p>
      <a className="mt-4 inline-block font-bold underline underline-offset-4" href={quoteHref}>Solicitar una auditoría o inspección ↗</a>
    </section>
  );
}
