import { SharedKitchenListBar } from './components/SharedKitchenList';
import InductionCatalogue from './components/InductionCatalogue';
import { KITCHEN_PATH } from './data/discovery.mjs';
import { inductionGroups, kitchenListHref } from './data/inductionPage.mjs';

export default function InductionCookingContent({ onAdd, count = 0, status = '' }: {
  onAdd?: (id: string) => void;
  count?: number;
  status?: string;
}) {
  return <main id="main-content" className="ddnz-kitchen kitchen-brand induction-page" lang="en">
    <nav className="kitchen-breadcrumb wrap" aria-label="Breadcrumb"><ol>
      <li><a href="/">Home</a></li><li><a href="/products/">Products</a></li>
      <li><a href={KITCHEN_PATH}>Commercial kitchen equipment</a></li>
      <li aria-current="page">Induction cooking equipment</li>
    </ol></nav>
    <section className="section wrap induction-intro-section">
      <h1>Commercial induction cooking equipment from China</h1>
      <p>Compare eight models for restaurant projects and wholesale orders. Start with the cooking layout, then check rated power, electrical supply and installation space for the models you want quoted.</p>
      <nav className="category-entry-links" aria-label="Induction cooking types">
        {inductionGroups.map(({ anchor, label }) => <a key={anchor} href={'#' + anchor}>{label} ↓</a>)}
      </nav>
      <div className="induction-page-actions">
        <a className="button primary" href={kitchenListHref}>Review mixed equipment list{count > 0 ? ' (' + count + ')' : ''} →</a>
        <a className="text-link" href={KITCHEN_PATH + '#commercial-kitchen-equipment'}>Browse all kitchen equipment ↗</a>
      </div>
    </section>
    <SharedKitchenListBar count={count} status={status}/>
    {inductionGroups.map(({ group }) => <InductionCatalogue key={group} group={group} expanded onAdd={onAdd}/>)}
    <section className="section wrap induction-quote-checks">
      <h2>What to include in your quote request</h2>
      <p>List the models, quantities and destination. Include the available electrical supply, the space for each unit and the cookware or pot sizes you use. Confirm phase, connection and clearance requirements for the selected configuration.</p>
      <a className="button primary" href={kitchenListHref}>Review your equipment list →</a>
    </section>
  </main>;
}
