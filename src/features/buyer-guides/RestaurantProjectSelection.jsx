import React from 'react';
import { localizedProductPath } from '../../lib/productLocalization.mjs';
import { getLocalizedKitchenProducts } from '../commercial-kitchen/data/localization.mjs';
import products from '../commercial-kitchen/data/products.mjs';
import { kitchenModelHref } from '../commercial-kitchen/data/categories.mjs';

const selections = [
 { id: 'cold-2', displayImage: '/commercial-kitchen-media/project-selection/gn650tnpro-studio.webp', role: 'Chilled holding', check: 'Confirm usable storage, door swing, ambient rating and access for delivery.' },
 { id: 'cold-7', displayImage: '/commercial-kitchen-media/project-selection/gnt2mtnpro-studio.webp', role: 'Cold preparation', check: 'Confirm ingredient separation, worktop use and the offered refrigeration configuration.' },
 { id: 'ZH-101V', displayImage: '/commercial-kitchen-media/ddnz-products/ZH-101V-ddnz-v1.webp', role: 'Frying', check: 'Confirm the food batch, recovery requirement, electrical configuration and quantity terms.' },
 { id: 'ZH-818', displayImage: '/commercial-kitchen-media/ddnz-products/ZH-818-ddnz-v1.webp', role: 'Griddle cooking', check: 'Confirm cooking surface, menu mix, electrical configuration and extraction requirements.' },
].map(selection => ({ ...selection, product: products.find(p => p.id === selection.id) }));

const esProducts = getLocalizedKitchenProducts('es');
const esRoles = ['Conservación en frío', 'Preparación en frío', 'Fritura', 'Cocción en plancha'];
const esChecks = [
 'Confirme el espacio útil, la apertura de la puerta, las condiciones ambientales y el acceso para la entrega.',
 'Confirme la separación de ingredientes, el uso de la superficie y la configuración de refrigeración.',
 'Confirme el tamaño de cada tanda, la recuperación de temperatura, la alimentación eléctrica y la cantidad.',
 'Confirme la superficie de cocción, el menú, la alimentación eléctrica y la extracción.',
];

export function RestaurantProjectHero({ locale = 'en' }) {
 const es = locale === 'es';
 return <figure className="restaurant-hero-board" aria-label={es ? 'Cuatro modelos de catálogo para comida para llevar' : 'Four catalogue models for a takeaway equipment selection'}>
  <figcaption><span>{es ? 'COMIDA PARA LLEVAR' : 'THE TAKEAWAY SELECTION'}</span><strong>{es ? 'Preparación en frío.' : 'Cold preparation.'}<br/>{es ? 'Dos formas de cocinar.' : 'Two ways to cook.'}</strong></figcaption>
  <div className="restaurant-hero-products">{selections.map(({id, displayImage, product:p}, i) => <a href={'#project-model-'+id} key={id} aria-label={(es ? 'Ver modelo ' : 'View model ') + p.model}><img src={displayImage} alt={p.model} width="1024" height="1024" loading={i===0?'eager':'lazy'} decoding="async"/><span>{p.model}</span></a>)}</div>
  <p className="restaurant-hero-note">{es ? 'Cuatro modelos de referencia. Confirme la configuración al cotizar.' : '4 model references · Configuration confirmed in your quote'}</p>
 </figure>;
}

export default function RestaurantProjectSelection({ locale = 'en', onAction = (_action) => {} }) {
 const es = locale === 'es';
 const copy = (english, spanish) => es ? spanish : english;
 const catalogue = localizedProductPath('/sourcing/commercial-kitchen-equipment-from-china', locale);
 const modelHref = id => es ? catalogue + '?model=' + encodeURIComponent(id) + '#commercial-kitchen-equipment' : kitchenModelHref(id);

 return <section className="restaurant-selection" id="project-takeaway" aria-labelledby="project-takeaway-heading">
  <header><p className="buyer-eyebrow">{copy('TAKEAWAY / FRYING & GRIDDLE MENU', 'COMIDA PARA LLEVAR / FRITURA Y PLANCHA')}</p><h2 id="project-takeaway-heading">{copy('Build the equipment selection around the menu.', 'Elija el equipo según su menú.')}</h2>
   <p>{copy('Start with chilled holding, cold preparation and two countertop cooking functions for a takeaway menu. These four catalogue models are a starting selection for a DDNZ equipment quote. Confirm quantities, food batches and peak demand before choosing the final combination.', 'Esta selección reúne conservación y preparación en frío, una freidora y una plancha de sobremesa. Use los cuatro modelos de catálogo como punto de partida para cotizar con DDNZ. Confirme las cantidades, las tandas y la demanda en hora punta.')}</p></header>
  <figure className="restaurant-flow" aria-labelledby="restaurant-flow-caption">
   <p className="restaurant-flow-label">{copy('FOOD WORKFLOW', 'FLUJO DE ALIMENTOS')}</p>
   <ol>{(es ? [
    ['Recepción y control', 'Mercancía, temperatura y almacenamiento'],
    ['Conservación en frío', 'GN650TNPro'],
    ['Preparación', 'GNT2MTNPro'],
    ['Cocción', 'Freidora ZH-101V / plancha ZH-818'],
    ['Empaque y entrega', 'Conservación, empaque y recogida'],
   ] : [
    ['Receive & check', 'Goods, temperatures and storage needs'],
    ['Chilled holding', 'GN650TNPro'],
    ['Prepare', 'GNT2MTNPro'],
    ['Cook', 'ZH-101V fryer / ZH-818 griddle'],
    ['Pass & pickup', 'Holding, packing and handover'],
   ]).map(([title, note], i) => <li key={title}><span className="restaurant-flow-number">0{i+1}</span><strong>{title}</strong><span>{note}</span></li>)}</ol>
   <div className="restaurant-wash-flow"><strong>{copy('USED UTENSILS', 'UTENSILIOS USADOS')}</strong><span>{copy('Return → wash → dry / store', 'Retorno → lavado → secado y almacenamiento')}</span><span>{copy('Plan this route separately from food preparation.', 'Planifique este recorrido por separado de la preparación.')}</span></div>
   <figcaption id="restaurant-flow-caption">{copy('Illustrative workflow, not a measured floor plan or an installation drawing. Washing, ventilation, handwashing and other site provisions must be planned for the premises.', 'Flujo ilustrativo. El equipo del local debe planificar lavado, ventilación, lavamanos y conexiones en el plano de instalación.')}</figcaption>
  </figure>
  <div className="restaurant-model-heading"><p className="buyer-eyebrow">{copy('THE EQUIPMENT / 04 REFERENCES', 'CUATRO MODELOS DE CATÁLOGO')}</p><h2>{copy('Compare the working parts.', 'Compare los equipos por puesto de trabajo.')}</h2><p>{copy('Review the footprint, cooking or storage specification, and the configuration for your site.', 'Revise dimensiones, capacidad y configuración según las condiciones del local.')}</p></div>
  <div className="restaurant-model-grid">{selections.map(({id, role, check, displayImage, product}, index) => { const p = es ? esProducts.find(item => item.id === id) : product; return <article key={id} id={'project-model-'+id}>
   <a className="restaurant-model-image" href={modelHref(id)} onClick={() => onAction('view_range')} aria-label={copy('View configuration for ', 'Ver configuración de ') + p.model}><span className="restaurant-model-index">0{index+1}</span><img src={displayImage} alt={p.model + ' · ' + p.name} width="1024" height="1024" loading="lazy" decoding="async"/><span className="restaurant-image-action" aria-hidden="true">{copy('View configuration ↗', 'Ver configuración ↗')}</span></a>
   <div className="restaurant-model-copy"><p className="buyer-eyebrow">{es ? esRoles[index] : role}</p><h3>{p.model}</h3><p>{p.name}</p><dl><div><dt>{copy('Overall dimensions', 'Dimensiones exteriores')}</dt><dd>{p.dimensions}</dd></div><div><dt>{copy('Listed specification', 'Dato de catálogo')}</dt><dd>{p.metric} · {p.detail}</dd></div></dl><p>{es ? esChecks[index] : check}</p>
   <a className="buyer-secondary" href={modelHref(id)} onClick={() => onAction('view_range')}>{copy('Review configuration for', 'Ver configuración de')} {p.model} ↗</a></div>
  </article>; })}</div>
  <p className="buyer-small">{copy('Retouched catalogue illustrations; confirm appearance and configuration against the approved sample. Listed specifications remain the model references. Confirm the order quantity for each item; this selection does not set a package price, minimum order or guaranteed output.', 'Imágenes de catálogo retocadas. Confirme el aspecto, la configuración, los mínimos por modelo y el rendimiento previsto en la cotización.')}</p>
  <div className="restaurant-scope-grid">
   <div><h3>{copy('In your equipment quote', 'Qué solicitar en la cotización')}</h3><p>{copy('Ask DDNZ to confirm the selected models, quantities, manufacturing and complementary supply scope, samples or tests, packaging, spare parts and export delivery terms. Goods, packing, freight and destination costs should be itemised.', 'Solicite modelos y cantidades por partida, alcance de fabricación y suministro, pruebas, embalaje, repuestos y condiciones de exportación. Pida que se desglosen equipo, embalaje, flete y gastos en destino.')}</p></div>
   <div><h3>{copy('Confirm with your site team', 'Qué confirmar con el equipo del local')}</h3><p>{copy('Provide the floor plan, doorway clearances, voltage, frequency, phase, water and drainage. Confirm extraction, handwashing, washing and local installation separately. Site works, engineered drawings and installation are not included by default.', 'Indique el plano, los accesos, la tensión, la frecuencia, las fases, el agua y el desagüe. Acuerde por separado la extracción, los lavamanos, el lavado, los planos de ingeniería, la obra y la instalación.')}</p></div>
  </div>
  <div className="restaurant-quote-note"><h3>{copy('Request this selection or an alternative.', 'Cotice esta selección o una alternativa.')}</h3><p>{copy('Include GN650TNPro, GNT2MTNPro, ZH-101V and ZH-818 with quantities, your menu, peak portions, site dimensions, destination, budget scope and requested delivery window. Mark equipment already owned and functions still missing.', 'Indique los modelos y cantidades, el menú, las raciones en hora punta, las dimensiones, el destino, el presupuesto y la fecha de entrega. Señale los equipos que ya tiene.')}</p>
   <div className="buyer-actions"><a className="buyer-button" href="#buyer-brief" onClick={() => onAction('start_brief')}>{copy('Request an equipment quote ', 'Solicitar cotización de equipos ')}<span aria-hidden="true">↓</span></a><a className="buyer-secondary" href={catalogue + '#commercial-kitchen-equipment'} onClick={() => onAction('view_range')}>{copy('Browse the equipment catalogue ↗', 'Ver el catálogo de equipos ↗')}</a></div>
  </div>
 </section>;
}
