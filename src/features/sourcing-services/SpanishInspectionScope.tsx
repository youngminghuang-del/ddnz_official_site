export default function SpanishInspectionScope({ quoteHref }: { quoteHref: string }) {
  return (
    <section id="auditoria-o-inspeccion" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h2 className="text-3xl font-bold">Auditoría de fábrica e inspección de producto en China</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 p-5">
          <h3 className="text-xl font-bold">Auditoría de fábrica</h3>
          <p className="mt-2">Antes de aprobar una planta, define qué procesos, equipos y controles deben comprobarse. El informe recoge los registros revisados, las observaciones de la visita y los puntos pendientes.</p>
        </article>
        <article className="rounded-xl border border-slate-200 p-5">
          <h3 className="text-xl font-bold">Inspección de producto</h3>
          <p className="mt-2">Durante la producción o antes del embarque, revisa un lote según el alcance acordado. El informe documenta cantidades, defectos, pruebas funcionales y empaque con fotos cuando corresponda.</p>
        </article>
      </div>
      <p className="mt-5">Indica la ciudad, el producto, la cantidad, la etapa del pedido y los criterios de aceptación que quieres verificar.</p>
      <a className="mt-4 inline-block font-bold underline underline-offset-4" href={quoteHref}>Solicitar una auditoría o inspección ↗</a>
    </section>
  );
}
