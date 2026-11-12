import InductionCatalogue from './InductionCatalogue';
import { inductionGroups, inductionPage } from '../data/inductionPage.mjs';

const otherGroups = [
  { group: 'steam', anchor: 'steam-cabinets', label: 'Steam cabinets', description: 'Compare cabinet layouts and batch requirements.' },
  { group: 'noodle', anchor: 'noodle-cookers', label: 'Noodle cookers', description: 'Compare basket layouts and station dimensions.' },
  { group: 'round', anchor: 'soup-bun-cookers', label: 'Soup cookers and bun steamers', description: 'Choose equipment for your soup or steaming station.' },
] as const;

type Props = {
  activeAnchor?: string;
  onAdd?: (id: string) => void;
  onCompare?: (id: string) => void;
  isCompared?: (id: string) => boolean;
};

export default function HotCookingDirectory({ activeAnchor, onAdd, onCompare, isCompared }: Props) {
  return <section id="kitchen-induction-range" className="wrap section hot-cooking-directory" aria-labelledby="hot-cooking-heading">
    <h2 id="hot-cooking-heading">Hot cooking equipment</h2>
    <div className="hot-cooking-grid">
      <div className="hot-cooking-card">
        <a href={inductionPage.path}>Commercial induction cooking ↗</a>
        <p>Compare eight single-unit, multi-zone and large-wok models.</p>
        <ul className="hot-cooking-shortcuts">
          {inductionGroups.map(({ anchor, label, models }) => <li key={anchor} id={anchor}>
            <a href={inductionPage.path + '#' + anchor}>{label}</a>
            {models.map(model => <a className={activeAnchor === '#model-' + model.id ? 'old-model-link is-current-anchor' : 'old-model-link'} key={model.id} id={'model-' + model.id}
              href={inductionPage.path + '#model-' + model.id}>View {model.model} ↗</a>)}
          </li>)}
        </ul>
      </div>
      {otherGroups.map(({ anchor, label, description }) => <a className="hot-cooking-card" key={anchor} href={'#' + anchor}>
        <strong>{label} ↓</strong><p>{description}</p>
      </a>)}
    </div>
    <div className="hot-cooking-other">
      {otherGroups.map(({ group, label }) => <InductionCatalogue key={group} group={group} compactTitle={label} onAdd={onAdd}
        onCompare={onCompare} isCompared={isCompared}/>)}
    </div>
  </section>;
}
