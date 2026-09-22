import { Helmet } from 'react-helmet-async';
import FreightRouteMap from '../components/FreightRouteMap';
import SourcingHomepageNav from '../components/SourcingHomepageNav';

export default function FreightMapPreview() {
  return (
    <div className="ddnz-home min-h-screen bg-[#fffdf9] text-[var(--ddnz-ink)]">
      <Helmet>
        <title>DDNZ Freight Map Preview</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <SourcingHomepageNav showFreightExecutor />
      <main id="main-content">
        <header className="border-b border-slate-200 bg-[#f7f0fb]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <p className="text-xs font-black tracking-[0.16em] text-[var(--ddnz-coral-strong)]">FREIGHT MAP DESIGN PREVIEW</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.045em] text-[var(--ddnz-ink)] md:text-6xl">地图不是装饰，是货运决策的阅读入口。</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">以下为三个页面层级的视觉方案。世界、区域与国家级地图均由同一套地理底图、经纬度节点和 DDNZ 路线规则生成。</p>
          </div>
        </header>
        <FreightRouteMap variant="world" locale="zh" />
        <FreightRouteMap variant="central-asia" locale="zh" />
        <FreightRouteMap variant="uzbekistan" locale="zh" />
      </main>
    </div>
  );
}
