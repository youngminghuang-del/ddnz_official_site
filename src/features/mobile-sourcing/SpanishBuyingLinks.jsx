import React from 'react';

// Short routes into the existing catalogue and mixed-order form; no separate cart.
export default function SpanishBuyingLinks(){
 return <section className="ms-section ms-editorial" aria-labelledby="es-buying-paths">
  <p className="ms-eyebrow">PARA TIENDAS Y DISTRIBUIDORES</p>
  <h2 id="es-buying-paths">Elija cómo preparar su compra</h2>
  <div>
   <article><h3>Reponer fundas por modelo</h3><p>Compare materiales y precios en CNY. Indique cada modelo de teléfono, color y cantidad para confirmar los mínimos.</p><a className="ms-secondary" href="/es/phone-cases/">Ver fundas y precios ↗</a></article>
   <article><h3>Elegir protectores de pantalla</h3><p>Distinga vidrio transparente y de privacidad. Revise las cantidades por modelo y las condiciones de cada configuración.</p><a className="ms-secondary" href="/es/screen-protectors/compare/">Comparar protectores ↗</a></article>
   <article><h3>Reunir varios accesorios</h3><p>Añada referencias a una misma solicitud. Los mínimos siguen aplicándose por producto; transporte y personalización se cotizan aparte.</p><a className="ms-secondary" href="#collection">Elegir productos ↓</a></article>
  </div>
 </section>;
}
