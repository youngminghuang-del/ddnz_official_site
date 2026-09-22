import { Link } from 'react-router-dom';

export default function FclSpeakerCaseZh({ quoteHref }: { quoteHref: string }) {
  return <section className="sc-case" id="service-case" aria-labelledby="sc-title"><div className="sc-inner">
    <p className="sc-kicker">FCL 整柜出口案例 · 广州 → 阿比让</p>
    <h2 id="sc-title">同一只 40HQ，多装 103 套音箱。</h2>
    <p className="sc-intro">这是一项四柜 40HQ 的蓝牙派对音箱出口项目。客户具备当地组装和基础维修能力，DDNZ 与工厂工程师据此调整了包装和装载方案。</p>
    <div className="sc-capacity" aria-label="首款型号整柜装载数量对比"><div><span>原方案：整机包装</span><strong>637</strong><div style={{width:'86.1%'}}/><small>台 / 40HQ</small></div><div><span>调整后：部件分装</span><strong>740</strong><div style={{width:'100%'}}/><small>套 / 40HQ</small></div></div>
    <ol><li><span>01</span><h3>先看客户能否在当地组装</h3><p>客户可以完成组装和基础维修，因此可以讨论部件分装，而不是只压缩整机外包装。</p></li><li><span>02</span><h3>和工厂一起调整包装</h3><p>扬声器单元、箱体和电路板分别包装，彩盒随货发运；该方案取消泡沫内衬。</p></li><li><span>03</span><h3>重新规划柜内装载</h3><p>DDNZ 与工厂工程师在一天内制定方案。首款型号由每柜 637 台整机，调整为可组装 740 套音箱的部件。</p></li></ol>
    <div className="sc-result"><strong>整柜装载优化结果</strong><p>每柜增加 103 套，较原方案提升约 16.2%。数字对应项目首款型号，并非四柜所有型号；这是 FCL 整柜案例，不是 LCL 拼箱案例。</p></div>
    <div className="sc-actions"><Link className="ddnz-button ddnz-button-primary" to={quoteHref}>讨论整柜包装与出运方案 →</Link><Link to="/sourcing/audio-speakers-from-china/">查看音响与扬声器 →</Link></div>
  </div></section>;
}
