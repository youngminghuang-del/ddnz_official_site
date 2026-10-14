# 第六轮：Oman六张用户照片图库

2026-10-14，沿用25e5a87。只Oman ENAR，Qatar保持不变。开始核对main仍b4156a7938672a7ebf3130285cc9d3e135a64880，最新成功部署/CMS38456135838。原6组未跟踪材料保留。本轮代码与本地验证完成，未push、PR、部署或真实询价。

## 预览与改动

4187：/shipping-from-china-to-oman/、/ar/shipping-from-china-to-oman/。最终stage `/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-JwqWee/dist`；入口`index-CGkdhfmv.js`，样板`GulfFreightPage-DkGF9vll.js`（gzip29.15kB）。

新增OmanCargoGallery.tsx、omanCargoGallery.json及public/media/freight-20261014-round6/；更新GulfFreightPage.tsx、gulfCargoReferences.json与gulf-stories.css。Oman两张Rebul图片及其数据/链接从当前网页资产移除，旧版本仍在Git历史。Qatar帽饰图、文案、顺序及来源保持。

六原图来自用户附件，总控归档于团队/第六轮用户素材。项目内六JPG与原件逐字节哈希相同，共2,890,380bytes；没有裁切、重绘、生成式处理或像素文字。另以sips缩最长边至160px，制作六张仅用于导航的缩略图，共58,008bytes，明确属于网页尺寸优化。原图与缩略图hash见website-assets.json及source/user-manifest.json。

默认图1，一张完整主图+六个缩略按钮；主图按contain，手机410px/桌面500px固定框，避免六大图纵向堆叠与切换导致版面跳动。标题使用独立HTML叠层、图下显示简短运输准备动作；计数和aria-live图注随选中更新。图片lazy/async解码，仅当前主图与小缩略图呈现，其他大图按选择加载。

按钮有aria-pressed、aria-controls、可见焦点和选中边框；可点击/Tab/方向键/Home/End切换，RTL左右键按视觉方向工作。手机依旧标题简介→图库→详细清单，桌面仍两栏。六张图都可查看，不把照片数当六桌订单数量。

图1/2展示整桌，3/5展示包裹框架部件，4/6展示台面包装。内容只说可见物及准备动作，不判透明结构材质，不称同型号/同票货/Oman已交付/HB履约，也不评价包装已符合出口标准。原Oman规划情景、进口与末端边界保持，不添加前台版权或AI大备注。

## 验证

- lint、最终build:preview通过；754HTML、733sitemap、0failures。未重跑未变RFQ全套或无关测试。
- 六原图哈希通过。两语SSR有六缩略按钮及当前主图、准确标题、H1/9alternates；Rebul链接和两旧图不再出现。
- Qatar EN/AR的main HTML与第五轮6OQHgi逐字相同；RFQ、地图、导航、旅程、Qatar图片组件、正文、区域数据及CMS源文件与25e5a87逐字节一致。
- Oman两语×360/390/430/1110/1536共10组合：逐一点击六图，60次主图src/alt/真实加载/caption匹配；单一选中、所有按钮≥44px、contain/lazy、无横溢、手机自然顺序通过。方向键/Home/End和全部四章节键盘/focus/current状态通过，0page errors，外部请求全部阻断。
- 内容组独立EN桌面六图与AR390×844六图，12次逐张核对实际src/title/caption/alt/loaded和规划身份，通过无修复项，绑定JwqWee/index-CGkdhfmv。
- 上下文截图初次受之前FAQ键盘焦点/滚动绘制时序影响，出现FAQ/空白画面；已用context-check.mjs独立新页面、等图加载/滚动绘制重拍全部10张并目视。最终screenshots/*-context.png是真实首模块，不把采集错误判为页面故障。24张*-image-N.png记录ENAR手机/桌面全部六图。
- 意图审计610pass/117context-only/6review，沿用基线，不扩既有手机膜问题。

证据：gallery-results.json、static-results.json、website-assets.json、source-sha256.json、内容组集成复核.md和build/lint/search-intent日志；screenshots共34张最终图。

## 未完成与下一步

本轮只完成本地图片替换与图库。没有发布/效果验证、对应订单/型号/尺寸重量真实性确认、目的国现场交付或独立阿语母语审校。用户图不是此前外图许可问题的延续，但仍不能据可见照片新增运输履约/材质/合规承诺。F13六语、F08其他路线事实、F04生产后台/CRM/分析继续待后续。下一步由总控结合用户审阅决定发布范围或补实际包装数据。
