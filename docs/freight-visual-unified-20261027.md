# 八国视觉统一预览 — 2026-10-27

用户要求：先按尼日利亚新版统一这几批国家页视觉，保留各国素材与内容差异，做好预览，再继续后续线路。此要求优先于先前印度/巴基斯坦排期。

基线：本地0197f7d，GitHub main只读复核f8193e2。范围：孟加拉、乌兹别克斯坦、秘鲁、巴西、墨西哥、阿联酋、加纳、尼日利亚，各八语64页。未推送、无PR、未部署。

## 实现
- 新增country-editorial.css，以尼日利亚既有样式为参照：#fffdf9浅底、#10243e标题、#506079正文、淡紫信息区域、珊瑚色询价按钮，统一标题尺度、章节入口、卡片边框和焦点样式。
- 在App引入共用样式；实际国家组件/旧地区衍生模板仅在上述国家添加country-editorial标记。西语巴西独立静态分支补标记。
- 墨西哥、阿联酋旧版深色首屏和章节改浅底，去除标题背后的品牌装饰底图。
- 中亚旧版首屏照片从文字背后的满幅底图转为独立图片区域，保留原图片及替代文字；中东旧模板装饰照片同样独立呈现。
- 葡语巴西、土葡语通用国家模板保留原内容布局与图库，统一表面样式。各国内容顺序、章节数量与已有图库交互不强制相同。
- 全局导航、HB执行横条、页脚、产品页和地区总览保持原样。没有新增或加工第三方素材。

变更文件：src/App.tsx；scripts/generate-static-pages.ts；src/features/freight/country-editorial.css；BrazilCountryContent、BrazilPortugueseContent、InternationalCountryContent、MarketFreightContent、MarketLocalizedContent、MexicoContent、UaeContent、UsedGoodsContent；三份shipping-from-china-to-{central-asia,latin-america,middle-east}.tsx。

## 验证
证据目录：outputs/freight-visual-unified-20261027/。
- TypeScript及完整构建通过：836 HTML、815 sitemap、部署文件0失败。
- 与前一批4220冻结预览比较：64页正文文本、媒体src/poster/alt、全部链接相同，64页静态样式标记均存在（content-parity.json）。不把装饰CSS背景移除算作实拍删除。
- 64路线模块静态检查及815旧URL保留通过；24服务页、16市场页回归通过。
- 64页面×390/1440两视宽共128次布局检查通过；最终构建补查八国中阿语×两视宽32次，通过。最终葡语巴西与中文墨西哥截图复核。无横溢出，页根背景一致。
- 搜索意图683pass/127context-only/5既有review，未称全站全绿。未做本轮真实询盘提交。
- 构建沿用同日已核47篇CMS快照，非新一次CMS同步；临时CMS和sitemap恢复，不提交。

## 预览
最终目录：/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-mmpSJA/dist
最终端口4223。4218–4220为保留的旧批次预览，4221/4222为本轮检查中间版，均不得误作最新版本。
- http://127.0.0.1:4223/zh-cn/shipping-from-china-to-mexico/?ddnz_test=1
- http://127.0.0.1:4223/pt/shipping-from-china-to-brazil/?ddnz_test=1
- http://127.0.0.1:4223/zh-cn/shipping-from-china-to-nigeria/?ddnz_test=1

本批视觉实现与本地验证完成，未发布、效果未验证。保留母语校审、实际承接/班次确认、案例订单关联等余项。用户查看本批预览后，继续印度/巴基斯坦与旧模板/地区摘要；未来国家沿用本批视觉规则，不回到深色旧版。
