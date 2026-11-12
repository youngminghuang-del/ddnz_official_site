const dealerPath = '/zh-cn/sourcing/kitchen-equipment-for-distributors/';
const projectPath = '/zh-cn/sourcing/restaurant-project-equipment/';
export const chineseProjectPlanningHref = projectPath + '#commercial-kitchen-gulf';

export function chineseDealerPriceHref(model, quantity) {
  const params = new URLSearchParams();
  if (model) params.set('model', model);
  if (quantity) params.set('quantity', String(quantity));
  return dealerPath + (params.size ? '?' + params : '') + '#commercial-kitchen-margin';
}

export function ChineseKitchenSupport() {
  return <section className="section wrap" id="commercial-kitchen-guide" aria-labelledby="localized-guide-title">
    <h2 id="localized-guide-title">按采购需求继续</h2>
    <div className="localized-two-columns">
      <article className="localized-panel" id="commercial-kitchen-benchmarks">
        <h3 id="localized-prices-title">经销定价</h3>
        <p id="commercial-kitchen-trade-pricing">按目标市场查看零售参考，再用供货参考价和采购数量估算毛利。</p>
        <a className="text-link" id="commercial-kitchen-margin" href={chineseDealerPriceHref()}>查看零售参考与毛利估算 ↗</a>
      </article>
      <article className="localized-panel" id="commercial-kitchen-gulf">
        <h3 id="gulf-kitchen-title">海湾餐厨项目</h3>
        <p id="equipment-configuration">按现场环境、电源及安装条件确认设备配置。</p>
        <a className="text-link" href={chineseProjectPlanningHref}>查看海湾项目选型 ↗</a>
        <a className="text-link" id="factory-production" href={projectPath + '#factory-production'}>查看生产参考 ↗</a>
      </article>
      <article className="localized-panel" id="equipment-buying-support">
        <h3 id="equipment-support-title">验货与出口交付</h3>
        <p>了解样品确认、验货、包装和交付流程。</p>
        <a className="text-link" href="/zh-cn/how-we-work/">查看服务流程 ↗</a>
      </article>
    </div>
  </section>;
}
