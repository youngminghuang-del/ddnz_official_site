export function addGulfRefrigerationSelection(slug: string | undefined, html: string) {
  if (slug !== 'commercial-refrigerators-gulf-kitchens-climate-class-high-ambient' || html.includes('id="high-ambient-selection"')) return html;

  const nextSection = '<h2 id="record-the-gulf-kitchen-conditions-before-ordering">';
  return html.replace(nextSection, `<section id="high-ambient-selection">
<h2>High-ambient refrigeration selection map</h2>
<p>Record the cabinet’s installation conditions and check them against the test data for the exact model.</p>
<ol class="my-5 grid list-none gap-3 p-0 sm:grid-cols-3" aria-label="High-ambient cabinet selection steps">
<li class="rounded-xl border border-slate-200 p-4"><strong>01 · Ambient heat</strong><p>Record peak room temperature at the cabinet and note nearby ovens, fryers or direct sunlight.</p></li>
<li class="rounded-xl border border-slate-200 p-4"><strong>02 · Ventilation</strong><p>Check intake, exhaust and clearances against the installation drawing. Note any enclosure around the cabinet.</p></li>
<li class="rounded-xl border border-slate-200 p-4"><strong>03 · Door openings</strong><p>Record opening frequency at peak service, the stock temperature at loading and the target holding temperature.</p></li>
</ol>
<p>Use those conditions to request the model’s test report and confirm its installation requirements before ordering.</p>
<p><a href="/sourcing/commercial-kitchen-equipment-from-china/#commercial-kitchen-equipment">Explore the commercial kitchen equipment catalogue</a></p>
</section>${nextSection}`);
}
