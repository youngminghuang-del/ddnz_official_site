import React, {useState} from 'react';
const profiles=[
 ['Venta diaria','Fundas de silicona, TPU o PC: indique los modelos que más se reponen y las unidades por color.'],
 ['Colección de mayor valor','Fundas con acabado PU: seleccione el diseño, el acabado y los modelos antes de confirmar el surtido.'],
 ['Marca propia','Indique logo, presentación individual, código de barras e idioma del embalaje. Confirme el mínimo de personalización por separado.'],
];
export default function SpanishRestock({onApply}){
 const [selected,setSelected]=useState(0),[applied,setApplied]=useState(false);
 return <section className="ms-section ms-editorial" id="plan-de-reposicion"><p className="ms-eyebrow">PARA DISTRIBUIDORES Y TIENDAS</p><h2>Prepare una reposición por modelo, material y color</h2><p>Empiece por su surtido real. Una compra mixta permite comparar estilos, pero no elimina los mínimos de cada referencia ni los de personalización.</p><div>{profiles.map(([title,body],i)=><article key={title}><h3>{title}</h3><p>{body}</p><button type="button" className="ms-secondary" aria-pressed={selected===i} onClick={()=>{setSelected(i);setApplied(false);}}>{selected===i?'Seleccionado':'Elegir este objetivo'}</button></article>)}</div><ol><li>Seleccione las fundas del catálogo y añada una fila por modelo de teléfono.</li><li>Indique unidades y colores por referencia; no use solo una cantidad total.</li><li>Separe el pedido inicial de la reposición prevista para confirmar plazo y continuidad.</li></ol><button type="button" className="ms-button" onClick={()=>{onApply(`Objetivo de compra: ${profiles[selected][0]}. ${profiles[selected][1]} Confirmar mínimos por referencia, plazo inicial y disponibilidad para reposición.`);setApplied(true);}}>Añadir objetivo a mi solicitud</button>{applied&&<p role="status">Objetivo añadido. Complete los modelos y cantidades en <a href="#buying-brief">su solicitud</a>.</p>}</section>;
}
