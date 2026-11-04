import { ROUTES } from './routes.mjs';

export const bulkSupply = `<section id="bulk-screen-protector-supply" class="rounded-xl border border-slate-200 bg-white p-5 my-8">
  <h2>Factory supply for bulk screen protector orders</h2>
  <p>DDNZ manufactures screen protectors in China and exports wholesale orders. For a factory quote, share the glass type, exact phone models, quantity per model, and packaging or branding requirements. Confirm the approved sample, minimum order by model and packing configuration before production.</p>
  <figure class="my-4">
    <div class="grid gap-3 sm:grid-cols-2">
      <div><img class="aspect-video w-full object-contain" src="/screen-protector-media/assets/001-kit-photo.jpg" alt="Screen protector and installation kit sample" loading="lazy"><p>Protector and installation kit</p></div>
      <div><img class="aspect-video w-full object-contain" src="/screen-protector-media/assets/titan-kit.jpg" alt="Screen protector with retail packaging sample" loading="lazy"><p>Retail pack and included accessories</p></div>
    </div>
    <figcaption>Sample photos. Confirm the contents and packaging for each model in your quote.</figcaption>
  </figure>
  <a class="button" href="${ROUTES.quote}/">Prepare a bulk factory quote request ↗</a>
</section>`;

const priceFactors = [
  ['Material', 'Glass type, thickness, adhesive coverage and any privacy layer.'],
  ['Processing', 'Edge profile, cutouts, coatings and finish requirements.'],
  ['Packaging', 'Retail box, installation tray, wipes and any custom artwork.'],
  ['Order quantity', 'Units per phone model, minimums per variant and repeat-order quantities.'],
];

export const priceFactorsTable = `<section id="screen-protector-price-factors" class="rounded-xl border border-slate-200 bg-white p-5 my-8">
  <h2>What changes the unit price?</h2>
  <p>Start with the same phone model and protector specification, then check what each quote includes.</p>
  <table class="my-4 w-full table-fixed text-sm">
    <thead><tr><th scope="col" class="w-1/3 p-2 text-left">Cost factor</th><th scope="col" class="p-2 text-left">What to check</th></tr></thead>
    <tbody>${priceFactors.map(([label, detail]) => `<tr class="border-t"><th scope="row" class="p-2 text-left align-top">${label}</th><td class="p-2 align-top">${detail}</td></tr>`).join('')}</tbody>
  </table>
  <a class="button secondary" href="${ROUTES.products}/">Compare screen protector configurations ↗</a>
</section>`;
