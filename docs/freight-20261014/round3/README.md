# 第三轮：导航、目的国地理与货物旅程

2026-10-14。沿用eb805f0，当前分支codex/freight-first-round-20261014。本轮本地代码与验证完成，未push、PR或部署。

## 最终可审阅预览

4187：`/shipping-from-china-to-qatar/`、`/ar/shipping-from-china-to-qatar/`、`/shipping-from-china-to-oman/`、`/ar/shipping-from-china-to-oman/`。

最终stage目录`/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-2VNBSd/dist`；入口bundle `/assets/index-gkI6OPWv.js`，样板bundle `/assets/GulfFreightPage-CHzVMLFf.js`（gzip25.27kB）。不新增地图SDK、字体或依赖。早期xMF0pH对应index-E41PW1cU，仅当前章节阈值差异；最终版修复148.1875px锚点未被148px阈值纳入的问题。

开始复核main=b4156a7938672a7ebf3130285cc9d3e135a64880，最新成功部署/CMS仍38456135838，与第二轮一致。CMS原件哈希保护通过；原有未跟踪资料未删除。

## 交付内容

- `GulfChapters.tsx`：4个真实整块锚点，编号、线图、短标题、箭头、明确边界；桌面4列，手机2×2。hover/focus、aria-current=location和“Reading/تقرأ الآن”文字反馈；键盘聚焦章节标题，148px顶栏避让，滚动状态由实测位置计算。不使用tab语义。
- `GulfDestinationMap.tsx`、`gulfMaps.json`：真实Natural Earth国家轮廓与同投影节点。Qatar单环241点，Oman7环1033点，保留穆桑代姆等分离区域与evenodd填充。港口方形、城市圆形，编号引线只连标记标签，没有海路/公路线、ETA或跟踪状态。北向固定，RTL只改变文本和布局。SVG title/desc与外部节点清单提供文字等价。
- 地图节点：Hamad Port和Doha示例城市；SOHAR Port作为海运选项、Muscat示例城市。节点定义、经纬度、svg_xy、坐标核验层级及来源均保留在media-manifest.json。Hamad坐标来自官方PDF索引表、直取超时；SOHAR官方PDF正文已核读；城市来自NE地理数据，不冒称实测客户地址。
- 首屏中国端照片保留China-origin图注，角上加纯国家轮廓与目的地名称；正式地图在到达章节与进口/尾程说明结合。手机点击到达入口首先看到章节标题，再看地图，不跳过地图。
- `GulfCargoJourney.tsx`、`gulfJourneys.json`：两国不同的五阶段询盘规划示例。Qatar帽饰/多供应商；Oman广州六张台球桌，明确桌数不等于包装件数。每步原创线图与短文案；覆盖报价、准备、运输、进口文件和交接，不用完成绿勾或假追踪。清关文件在出运前准备，步骤不宣称严格串行。
- `GulfFreightPage.tsx`与`gulf-stories.css`负责集成与响应式样式。所有新界面仅Qatar/Oman EN/AR；其他六语、既有12媒体、询价字段、mode、统计、CMS与产品交接保持。

素材组的4项地理原件与哈希归档geography/；网页直接使用派生SVG路径，不发布原始地理zip。当地照片仅为官方引用候选，未复制未获转载依据的照片。本轮不是目的国实拍交付。

## 验证

- lint、现有完整测试320/320、build:preview通过；754HTML、733sitemap、0failures。
- 新静态检查：四页真实完整轮廓与原SVG逐字比对、4节点坐标与来源匹配、ENAR五阶段及示例身份、图像文字等价、无tab/虚构路线、H1/9alternates及原视频字幕。
- 20项浏览器：四URL×360/390/430/1110/1536；真实4列/2×2、每块>44px、整块指针点击、全部4锚点键盘Enter/目标focus/顶栏避让/current状态、SVG不镜像、2节点清单/5步骤、无水平溢出、CTA到RFQ、目的国与unknown保留。零page errors，外部请求全部阻断。
- motion两种设置：普通hover0.18秒与平滑滚动；reduced-motion遵循站点全局0.01ms规则并使用auto滚动，锚点状态通过。
- 6项询价/产品回归：非法值、部分未知量、联系人、模拟失败重试/成功、已知值清空、UAE目的国、SOG-1/20台/UAE产品交接、PR64文章表单。2次本地模拟POST，没有真实提交，0errors。
- 第二轮静态保护继续通过：12媒体哈希、733路由与CMS原件SHA；另24页八语静态检查通过。
- 必需search-intent审计：610pass/117context-only/6review，与上一基线一致；6项是既有手机膜多语比较措辞，本轮不扩展处理，不重做去重。
- 独立内容组四页复核通过，绑定index-gkI6OPWv；总控实际检查Qatar导航/地图/旅程和Oman地图，无返工项。内容组检查与素材检查均归档，不冒称工程以外团队做了手机/键盘测试。

证据：browser-results.json、static-results.json、motion-results.json、regression/browser-results.json、tests.log、build.log、source-sha256.json；screenshots/含76张视口与整页图。长旅程使用真实视口截图，避免长元素自动拼接造成固定顶栏假重叠。

## 未完成与下一步

仍只有EN/AR四页；其余6语F13未同步，F08其他路线业务承诺待核，F04真实后台/CRM/生产分析未验证。无新增已授权目的国交付实拍、独立阿语母语审校、实际航线/班期数据。不能把本轮地图/旅程示意或测试完成等同完整货运计划、生产上线或效果验证。

后续由总控结合用户对本地预览的反馈决定更多目的国/货型资料及发布范围；工程不修改共享总台账或总进度。
