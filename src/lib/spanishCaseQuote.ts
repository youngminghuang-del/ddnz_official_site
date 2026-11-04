export function addSpanishCaseQuote(slug: string | undefined, html: string) {
  if (slug !== 'fundas-celular-mayoreo-china-comparar-precios' || html.includes('id="cotizacion-de-fabrica"')) return html;

  const nextSection = '<h2 id="una-oferta-incluye-la-caja-la-otra-solo-la-funda">';
  return html.replace(nextSection, `<h3 id="cotizacion-de-fabrica">Qué comparar en una cotización de fundas al mayoreo</h3>
<p>Fija el mismo modelo de teléfono, material, acabado y cantidad por variante. Usa la tabla anterior y separa el precio por unidad, el mínimo por modelo y color, el empaque, la personalización y el transporte al mismo destino.</p>
<p>DDNZ fabrica fundas en China y exporta pedidos al mayoreo. Elige las referencias que quieres cotizar y comparte las cantidades por modelo y color. <a href="/es/phone-cases/">Ver fundas al mayoreo y solicitar cotización de fábrica</a>.</p>
${nextSection}`);
}
