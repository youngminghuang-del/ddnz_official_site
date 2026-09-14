import { renderImpact001 } from './impact001.mjs';
export function renderPrivacy001(locale = 'en') {
 const localized = {
 es: ['001 en detalle.', ['Presentación de venta','El embalaje naranja identifica la gama 001. Confirme el contenido de cada paquete.'], ['Privacidad lateral de 28°','Diseñado para limitar la visión lateral. Compare brillo y ángulos en el teléfono elegido.'], ['Malla del auricular','La ilustración muestra la malla sobre el auricular. Compruebe ajuste, adhesión y claridad de las llamadas en la muestra.']],
 ar: ['نظرة أقرب على 001.', ['عبوة البيع','تميّز العبوة البرتقالية مجموعة 001. تأكد من محتويات كل عبوة.'], ['خصوصية جانبية بزاوية 28°','مصمم للحد من الرؤية الجانبية. قارن السطوع وزوايا الرؤية على هاتفك المختار.'], ['شبكة سماعة الأذن','يوضح الرسم الشبكة فوق فتحة السماعة. تحقق من الملاءمة والالتصاق ووضوح المكالمات على العينة.']]
 }[locale];
 return `<section class="privacy001" aria-labelledby="privacy001-title"><p class="eyebrow">001 / PRIVACY GLASS</p><h2 id="privacy001-title">${localized?.[0] || 'A closer look at 001.'}</h2><div class="privacy001-grid">${[
 ['001-pack-ddnz.webp','Retail presentation','Orange 001 packaging makes the privacy range easy to identify. Confirm the individual pack contents for your order.'],
 ['001-view-28deg-ddnz.webp','28° side-view privacy','Designed to limit side viewing while keeping the screen visible from the front. Compare brightness and viewing angles on your chosen phone.'],
 ['001-mesh-ddnz.webp','Earpiece mesh detail','The illustrated mesh covers the earpiece opening. Check model fit, adhesion and call clarity on the sample.']
 ].map(([file,title,body],index)=> { if(localized) [title,body]=localized[index+1]; return `<figure><img src="/screen-protector-media/assets/${file}" width="1254" height="1254" loading="lazy" alt="${title}"><figcaption><h3>${title}</h3><p>${body}</p></figcaption></figure>`; }).join('')}</div>${renderImpact001(locale)}</section>`;
}
