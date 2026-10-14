# 卡塔尔／阿曼 EN/AR 第二轮工程交付

2026-10-14。本地代码与验证完成，未发布。首轮基础8e9bf00；当前分支codex/freight-first-round-20261014。

## 可预览结果

- http://127.0.0.1:4187/shipping-from-china-to-qatar/
- http://127.0.0.1:4187/ar/shipping-from-china-to-qatar/
- http://127.0.0.1:4187/shipping-from-china-to-oman/
- http://127.0.0.1:4187/ar/shipping-from-china-to-oman/

预览来自最终构建 `/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-AsV9eO/dist`，754 HTML、733 sitemap URL。主页面保留真实询价后端；检查使用隔离脚本，未发送真实询盘。ddnz_test=1仅抑制测试分析，不代替请求拦截。

## 改动与客户价值

- `src/features/freight/GulfFreightPage.tsx`、`gulfStories.json`、`gulf-stories.css`：四个现有路由的专用图文视频页；Qatar按供应商清单、收货核对、合箱与LCL、进口准备及费用范围组织；Oman按包装件、装载选择、到场卸货、进口准备组织。使用首页浅底、紫色与珊瑚色，不继承旧时效／DDP徽章和通用国家矩阵。
- 12个最终来源manifest资产放在`public/media/freight-20261014/`：4秒收货与10秒装柜片段、封面、EN/AR VTT、720×960解释图。静音、用户主动播放、preload=none、双字幕轨、可访问图注；不伪造完整案例或自有仓库身份。
- `GetAQuote.tsx`：仅样板启用隐藏Land推荐，正常显示Sea/Air/Warehouse，mode枚举及字段不变。过滤条件明确保留已有selectedService=Land，且没有自动改写服务状态的逻辑；若外部调用显式预选Land则该项仍显示中性说明。通用／中亚默认不隐藏。修正AR标题、导语和摘要。重量体积仍可独立未知，目的国由现有presetDestination保留。
- 新页主副CTA都进入真实嵌入RFQ。副CTA只定位，不声称已自动保存采购阶段。FAQs可展开，章节锚点、同语言服务页和官方来源均可读。
- `App.tsx`、静态renderer、SEO生成/标题覆盖与prerender守卫同步。新模板守卫检查H1、目的国、真实表单和字幕；独立static-check检查国家意图、官方链接、媒体、CSS、canonical/hreflang、CMS与资产哈希。其余语言和旧模板原检查保留。
- F08最低范围：导航／页脚八语删除将HB与1997绑定的年份；中东相关六语替换通用SABER徽章、占位表头、经验年份，三卡改可键盘操作并聚焦真实表单；Saudi保留限定SABER文档核对。中亚insureText改为无年份协调角色。About已区分主体的时间线保留。

## 验证证据

- lint通过；完整现有测试320/320；Notion routing/guards、analytics policy/runtime通过；build:preview通过，0 failures。
- `browser-results.json`：16（4页×360/390/430/1536）布局、图片解码、实际视频播放与选定字幕cues、全部正文链接与锚点、FAQ、目的国/未知值表单；12（三mode×四页）原枚举保值；2（两国各8语）来回切换，共30通过、零page errors。
- `f08-results.json`：八语导航页脚、实际六语旧模板三卡键盘按钮；Saudi限定标签保留。PT/TR模板边界单独记录，不称六语正文缺陷八语同源。
- `regression/browser-results.json`与`regression.log`：6项包括键盘导航、非法/部分货量、联系校验、失败重试与模拟成功、已知量清空、UAE目的国、空调SOG-1/20台/UAE交接、PR64文章/表单；仅2次本地模拟POST，外部请求阻断，0 errors。
- `static-results.json`与`eight-languages.log`：四页单H1/9 alternates/目的国来源内容/字幕/CSS；12个manifest哈希；733路由及CMS原件SHA不变；另24页八语静态检查通过。
- `screenshots/`：48个首屏/视频/表单视口图，4个完整桌面页与4个390px解释图。已目视EN/AR首屏、视频字幕、表单和纵向解释图。内容组独立只读复核见`内容组复核.md`，CR01–03关闭。
- `browser-initial-language-timing.log`保留测试等待不足的初次记录；28项已通过，语言往返在等待懒加载H1后专项重跑通过。不是删掉内容守卫或忽略页面错误。regression/initial-selector-failure.*为把自动前进的方式按钮误当成Next按钮的初次测试证据；最终回归结果为6项通过。

## 边界与下一步

这里只完成Qatar/Oman EN/AR样板；其他六语保留原内容，F13未完成。F08仍有其他路线旧时效/DDP/能力口径及跨类目年份待事实审核，不称全站修复。F04真实后端/CRM入库与生产分析效果尚未验证。阿语无母语审校，正式发布和效果验证未完成。

下一步由总控审阅本地预览与独立内容/素材记录，决定其余语言与事实队列，并另行决定PR/发布。工程没有修改总README、总台账或当前进度。
