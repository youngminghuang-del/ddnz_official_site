# 第四轮：清关官方资源与区域地图

2026-10-14，沿用1a579ac与codex/freight-first-round-20261014。仅Qatar/Oman EN/AR四页；代码与本地验证完成后本地提交，不push、PR、部署或真实提交询价。开始核对main仍b4156a7938672a7ebf3130285cc9d3e135a64880，最新成功部署/CMS仍38456135838。其他任务原未跟踪成果保留。

## 可审阅版本

4187四URL保持：/shipping-from-china-to-qatar/、/ar/shipping-from-china-to-qatar/、/shipping-from-china-to-oman/、/ar/shipping-from-china-to-oman/。

最终stage `/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-KKtpyw/dist`，入口`index-CzhUoj3O.js`，样板`GulfFreightPage-mCyu26dd.js`。样板JS gzip27.22kB。区域地理为独立静态SVG文件，不增地图SDK、依赖、API key或Google底图。

## 实际实现

- 每国2项官方资源职责卡：Qatar Customs/Al Nadeeb，Oman Customs/Bayan。卡片含英阿真实机构/系统名称、职责、准备事项、公开官方入口；Oman阿语卡的英文要求入口有明确提示。合并原同义段落，保留港口信息与Oman原详细文件说明（包括出口国申报文件）。不表述DDNZ认证、合作或保证清关。
- 实际使用2张官方原图，均本地保存、哈希不变、白底等比完整呈现。Qatar使用当前官网CustomsLog.png。Oman使用完整官方页眉，左侧为Vision2040，中间ROP-DGC文字，右侧ROP徽章；仅出现一次，alt为中性官方页眉，不称Bayan标识、不裁切分离。Al Nadeeb/Bayan没有核实独立图样，使用普通文字名称，不伪造4个独立logo。
- 大图改为Natural Earth10m真实区域海岸线和国家边界：浅蓝海、米白目的国、灰邻国。保留所有Oman7环与穆桑代姆分离部分，统一投影，北向不变。首屏小轮廓不动。
- 地图直接标主要港口/示例城市名称，紫色点位，少量国家与海域名。引线只连接文字与节点，不表示航线/道路。海域背景不是法律海域边界或Google底图。
- 4点使用上轮核实的原经纬度；打开Google Maps使用官方Maps URLs格式`api=1&query=LAT,LON`，URLSearchParams编码，明确从源数据[lon,lat]换序。只有主动点击才打开外链，无嵌入Google数据。原港口/示例城市身份、用途限制及Natural Earth来源说明保留。
- 保留章节导航、货物旅程、媒体、RFQ、路由和SEO。RFQ、产品交接、CMS、其他六语代码未改。

代码：GulfCustomsResources.tsx / gulfCustoms.json；GulfDestinationMap.tsx / gulfRegionalMaps.json；GulfFreightPage.tsx / gulf-stories.css；public/media/freight-20261014-round4/两图两SVG。source/保存原manifest、区域几何、内容说明和来源记录，prepare-assets.py记录原图哈希核验及同投影派生过程。

## 验证与修正记录

- lint通过；相关现有测试13/13通过（货运语言切换、货量、询价链接）。未重复无变更的320项全套与真实表单流程。
- 最终build:preview：754HTML、733sitemap、0failures。静态四页检查官方卡/href、原图hash、4点原坐标/投影、Oman7环、H1/9alternates等通过。原12媒体hash、CMS SHA及733路由继续保护。
- 20浏览器组合，4页×360/390/430/1110/1536：4列/2×2、整块点击、键盘/焦点/锚点避让/current、无横溢、地理不镜像、官方图实际加载、正确官方链接、Google经纬顺序、五阶段旅程、RFQ三个模式/目的国/unknown通过，0page errors。全部外部请求阻断，0真实表单提交。该批绑定LRzRrf/index-AFClNjnd；之后仅调整Oman文字层。
- 独立内容复核R4-C01发现Sea of Oman部分贴伊朗陆地；R4-C02发现Sohar文字下移后靠近Muscat点。最终海域标签(660,170)、Sohar文字(665,225)；节点经纬/投影点不变。
- 最终针对Oman两语×5尺寸补做10组合：海域整个文字bbox每4SVG单位采样均为水面；海域与节点名不重叠；所有节点名与全部紫色节点至少30SVG单位间隔；无溢出。最终map-label-results.json及10张Oman地图截图绑定KKtpyw，四页8张arrival-context截图亦最终版。其他目录/资源卡截图来自LRzRrf，组件未变。旧中间地图版本不作为最终证据。
- 意图审计仍610pass/117context-only/6review；6项为已有手机膜多语比较用语，本轮不扩大处理。

最终内容独立复核已通过，R4-C01/C02关闭，绑定KKtpyw/index-CzhUoj3O；回执见内容组集成复核.md。总控已查看区域背景及Oman资源区，初审无视觉返工。

## 边界和后续

本地准备、代码和验证不等于发布或效果验证。仍无独立Al Nadeeb/Bayan logo、目的国交付实拍、阿语母语审校；F13其余六语、F08其他路线事实队列、F04生产后台/CRM/分析不在本轮完成范围。Google点位是发布港口参考/示例城市，不是客户门址。下一步由总控结合预览决定发布范围；共享总台账和当前进度仍由总控维护。
