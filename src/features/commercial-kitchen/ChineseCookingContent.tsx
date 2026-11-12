import InductionCatalogue from './components/InductionCatalogue';
import { SharedKitchenListBar, sharedKitchenListHref } from './components/SharedKitchenList';
import { KITCHEN_PATH } from './data/discovery.mjs';
import { zhInductionPage, zhHotCookingPage } from './data/inductionPage.mjs';

type CookingPage = typeof zhInductionPage | typeof zhHotCookingPage;

export default function ChineseCookingContent({ page, onAdd, count = 0, status = '' }: {
  page: CookingPage;
  onAdd?: (id: string) => void;
  count?: number;
  status?: string;
}) {
  const list = sharedKitchenListHref('zh');
  const other = page === zhInductionPage ? zhHotCookingPage : zhInductionPage;
  return <main id="main-content" className="ddnz-kitchen kitchen-brand induction-page" lang="zh-CN">
    <nav className="kitchen-breadcrumb wrap" aria-label="面包屑"><ol>
      <li><a href="/zh-cn/">首页</a></li><li><a href="/zh-cn/products/">产品目录</a></li>
      <li><a href={'/zh-cn' + KITCHEN_PATH}>商用厨房设备</a></li>
      <li aria-current="page">{page.label}</li>
    </ol></nav>
    <section className="section wrap induction-intro-section">
      <h1>{page.heading}</h1>
      <p>{page.intro}</p>
      <nav className="category-entry-links" aria-label="按工位选设备">
        {page.groups.map(({ anchor, label }) => <a key={anchor} href={'#' + anchor}>{label} ↓</a>)}
      </nav>
      <div className="induction-page-actions">
        <a className="button primary" href={list}>查看设备清单 →</a>
        <a className="text-link" href={other.path}>{other.label} ↗</a>
      </div>
    </section>
    <SharedKitchenListBar locale="zh" count={count} status={status}/>
    {page.groups.map(({ group, label }) => <InductionCatalogue key={group} group={group} locale="zh" expanded sectionTitle={label} onAdd={onAdd}/>)}
    <section className="section wrap induction-quote-checks">
      <h2>按型号与数量询价</h2>
      <p>提供型号、采购数量、目的地、现场电源和安装空间。具体配置、起订量与交付条件以报价为准。</p>
      <p className="fine">{page === zhInductionPage
        ? '按同时使用的工位核对灶位与锅具。需要估算出餐量时，请提供每批份量和加热周期。'
        : '按每批份量和使用频率核对篮位、蒸盘或炉口尺寸。需要估算出餐量时，请提供每批用量和蒸煮周期。'}</p>
      <a className="button primary" href={list}>用设备清单询价 →</a>
    </section>
  </main>;
}
