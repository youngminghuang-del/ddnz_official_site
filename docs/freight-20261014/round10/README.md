# 第十轮：卡塔尔、阿曼八语共用国家页

本地代码与验证完成；没有 push、PR、部署、真实询价提交或发布后效果验证。基线 b5ab8fbb2cc4f5a689e1a0267063a27db5b89acc。线上/main 仍 b4156a7938672a7ebf3130285cc9d3e135a64880（批次开始核对，成功部署38456135838）。

## 实现与复用边界

两国新增 zh/ru/fr/es/pt/tr，与既有 en/ar 共16页。GulfLocale统一八语及中文zh-cn路径；gulfUi、gulfChapterLabels、gulfDeliveryChecklist集中通用显示文案，正文/图库/旅程/地图/海关继续按国家及语言取JSON。组件共享照片交互、章节、地图、海关、字幕和询价；Qatar包装/拼单与Oman六桌/交接清单保留不同顺序与内容，不自动复制国家事实。新国家仍需独立内容、事实、素材与组合配置。

App通用国家路由、PT/TR显式路由和静态生成的PT/TR旧分支均接入同一Q/O模板；仅改通用路由不足以覆盖PT/TR。URL、canonical、9项alternate、同语阅读链接与语言切换保持国家。新增12字幕，8轨默认匹配页面语言。图片内英文保持批准版本。

仅两个布局修正：Oman 641–820px缩略图三列，修复745px宽度小于44px；Qatar新增六语≤640px拼单对照卡单列，避免法语断词。原地理坐标、67个既有货运媒体、原ENAR数据、CMS数据保持。ENAR静态main除新增字幕轨相同；Oman中宽触控修正与共用RFQ显示修正是明确例外。

GetAQuote仅更新八语显示标签、摘要、六种类别及土语采购说明，保留字段、枚举value、目的地preset、unknown逻辑、提交后端与事件。中文摘要显示卡塔尔/阿曼，提交值仍Qatar/Oman。

## 最终预览与验证

- 最终stage：/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-VMzNkY/dist；入口index-koAHb0o3.js；本地http://127.0.0.1:4187/。
- lint通过；15项相关测试通过；构建754 HTML、733 sitemap、0失败；静态16页SEO/同语链接/8字幕轨通过。
- browser-results.json：最终stage 48/48（8语×2国×390/745/1440），图库键盘/触控、4章节焦点、地图标签边界、横向溢出通过；390下16次RFQ未知重量/体积、目的地值及展开区检查通过。112截图。地图边界允许1 SVG像素字体bbox误差，未改变地图坐标。
- language-switch-results.json：16次真实切换保持国家，captions-results.json：16次真实加载字幕语言/内容/时间正确。两项在y9OLLf/index-CReCehq-.js执行，此后路由/字幕逻辑与媒体未改，不冒称最终构建重跑。
- 共用表单t()及35个ft()实际消费键全八语扫描通过，缺失项为空；本地覆盖项已计入。
- 内容组独立108次图片切换、48FAQ及16手机页面检查，最终CSS/中文/西语/土语展开RFQ差异复核通过。详见内容独立复核.md，其中明确各阶段证据；未经过独立母语审校。
- 其他168货运路由：最终110条main字节相同，58条仅共享RFQ运输方式显示标签变化（ZH/RU/FR/ES），无国家正文变化。详见other-routes-final-results.json；other-routes-results.json的168条全同属于此前阶段，不代表最终结果。

## 文件与状态

代码涉及App、两处静态生成、Gulf组件与JSON、GetAQuote/quoteSummaryCopy、CSS、12个VTT和gulf-locales测试；本目录保存源交接、检查脚本/结果、日志与截图。既有六组未跟踪审计/生产证据留在原地，不纳入本轮提交。

下一步由总控按共用标准审阅本地成果；发布授权、正式发布及上线效果验证均尚未完成。
