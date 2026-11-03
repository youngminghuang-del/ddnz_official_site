const slug = 'envios-china-latinoamerica-maritimo-aereo-q4-2026';

const timingSummary = `<ul id="plazos-mar-y-aire">
<li><strong>Por mar, de puerto a puerto:</strong> las rotaciones citadas van de 18 a 49 días desde Shanghai. Manzanillo figura con 18–20 días y Buenos Aires con 44. <a href="#cua-nto-tarda-el-transporte-mari-timo-de-china-a-latinoame-rica">Ver la tabla por puerto</a>.</li>
<li><strong>Por aire:</strong> pida el tránsito de aeropuerto a aeropuerto y la fecha estimada en almacén para la misma expedición. Confirme ambos plazos según ruta, peso y medidas. <a href="#cua-ndo-conviene-enviar-una-parte-por-avio-n">Ver cuándo conviene el aéreo</a>.</li>
<li><strong>Hasta el almacén:</strong> sume al tránsito el despacho, la liberación y la entrega interior. El ejemplo marítimo de Ciudad de México estima 22–29 días desde la salida del barco, con documentos completos y liberación normal. <a href="#cua-nto-tarda-un-envi-o-de-china-a-me-xico-hasta-el-almace-n">Ver el desglose hasta almacén</a>.</li>
</ul>`;

export function addLatinAmericaFreightTiming(articleSlug: string | undefined, html: string) {
  if (articleSlug !== slug || html.includes('id="plazos-mar-y-aire"')) return html;
  return timingSummary + html;
}
