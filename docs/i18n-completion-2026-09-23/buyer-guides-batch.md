# 客户采购专页八语言补齐

本批为以下四页新增中文、俄语、法语、葡萄牙语、土耳其语，共 20 个版本；沿用英、西、阿页面与共享交互。

- /sourcing/kitchen-equipment-for-distributors/
- /sourcing/restaurant-project-equipment/
- /screen-protectors/wholesale-for-stores/
- /screen-protectors/private-label/

译文覆盖首屏、采购三步骤、三组问答、客户专属字段、错误提示、隐私说明、请求摘要和结果状态。文本采用自然表达，保留原有商业边界与流程：参考价适用数量、按型号确认最低量、定制单独报价、当地安装默认不包含、英文计算器仅为伊斯坦布尔参考。没有新增产品价格或承诺。

四页语言切换、canonical、八语言 hreflang、站点地图和静态正文已接入。修正中文首页链接为 /zh-cn/；尚未翻译的产品总览/对比链接明确标注英文。语言切换后表单组件重新初始化，避免沿用上一语言的提交状态。

验证：TypeScript、完整 build:preview、14 项买家指南及语言路由测试通过。20 个新增静态页面均有单一 H1、八语言关联、正确首页和询价正文。葡语浏览器本地表单显示预览完成且未发送；未向外部提交询价。

构建输出 579 个 sitemap 页面、593 个 HTML；采购意图初筛 517 pass、62 context-only、0 review，不代表实际搜索量或排名。非 Blog 仍有 14 个主题、80 个语言路径版本缺口；既有正文模块缺口见 remaining-pages.md。本批仅本地预览，未部署。
