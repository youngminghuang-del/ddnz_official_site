# 本轮集成记录

主源码：`ddnz-kitchen-packages-mvp`，与“改版｜中亚运输多国运输”任务所用项目一致。原有货运改动已保留，未提交、推送或部署。

- 新模块：`src/features/food-processing/`，16个明确配置、4个分类页、6个场景组合页、1个总页。
- 图片：`public/food-processing-media/`，从画册原图提取并保留PDF透明通道，压缩为WebP。图片代表型号系列，未冒充独立拍摄或交付证据。
- 主入口：`ProductsIndex.jsx`、`SourcingHomepageNav.tsx`。
- 路由：`App.tsx`、`productLanguageRouting.ts`。
- 静态正文、sitemap、SEO：`generate-static-pages.ts`、`ShowcaseSEO.jsx`。
- 询价：`TradeSupportInquiry.tsx`仅为`source=food_processing`增加组合文本预填；沿用现有表单流程。
- 关键词分工详见同目录`food-processing-keyword-page-map-2026-09-23.md`。

验证：食品机械与产品语言路由共14项测试通过；类型检查通过；静态构建SEO审计332页零失败，发布文件检查346个HTML零失败。11个新页面另核canonical、唯一H1、型号正文、sitemap与Products链接。浏览器核对1440桌面及390手机布局、筛选、数量和报价预填。

工作区现有`node_modules`软链缺少地图依赖，并有`node_modules 2`干扰类型检查。已使用隔离目录`/private/tmp/ddnz-food-processing-20260923`与现成完整依赖验证，不改动原项目依赖。

本地预览：http://127.0.0.1:4188/products/#food-processing-packages

数据口径：仅批发价列，CNY；包装与可选附件单列。无折扣系数。未发布供应商原始PDF或其收款信息。备货状态、电气配置、最新价格、包装升级和出口费用须在正式报价确认。
