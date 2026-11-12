import { chineseCookingPages, zhInductionPage } from './data/inductionPage.mjs';

export default function ChineseCookingDirectory() {
  return <section className="section wrap" id="kitchen-induction-range" aria-labelledby="zh-cooking-heading">
    <h2 id="zh-cooking-heading">按热厨工位选设备</h2>
    <div className="zh-cooking-directory">
      {chineseCookingPages.map(page => <article key={page.path} className="hot-cooking-card">
        <a className="zh-cooking-card-link" href={page.path}>
          <img src={page.image} alt="" width="480" height="320" loading="lazy" decoding="async"/>
          <div><strong>{page.label} ↗</strong><p>{page === zhInductionPage ? '8 款 · 按灶位、锅具和电源选型' : '6 款 · 按批量、篮位和台面空间选型'}</p></div>
        </a>
        <ul className="zh-cooking-group-links">
          {page.groups.map(group => <li key={group.anchor} id={group.anchor}>
            <a className="zh-cooking-group-link" href={page.path + '#' + group.anchor}>
              <img src={group.models[0].image} alt="" width="96" height="72" loading="lazy" decoding="async"/>
              <span>{group.label} <span aria-hidden="true">↗</span></span>
            </a>
            {group.models.map(model => <span className="zh-cooking-legacy" id={'catalog-' + model.id} key={model.id}>
              <a id={'model-' + model.id} href={page.path + '#model-' + model.id}>查看 {model.model} ↗</a>
            </span>)}
          </li>)}
        </ul>
      </article>)}
    </div>
  </section>;
}
