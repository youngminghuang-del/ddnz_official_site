# 货运首轮工程候选（2026-10-14）

独立检出：`/Users/huangyangming/Documents/New project/ddnz-freight-engineering-20261014`。
分支：`codex/freight-first-round-20261014`。基于官方main `b4156a7938672a7ebf3130285cc9d3e135a64880`，没有重置或更改旧代码目录。

本地预览：[卡塔尔](http://127.0.0.1:4187/shipping-from-china-to-qatar/?ddnz_test=1)、[阿语卡塔尔](http://127.0.0.1:4187/ar/shipping-from-china-to-qatar/?ddnz_test=1)、[通用报价](http://127.0.0.1:4187/get-a-quote/?ddnz_test=1)。本地电脑及预览进程需在线；没有部署。

## 基线与CMS

- 官方仓库 `https://github.com/youngminghuang-del/ddnz_official_site`。本轮ls-remote及GitHub API复核main，证据`evidence/remote-main.json`。
- PR64合并`ebe136796c354b698f1ec22784440b01c46ccc54`，PR65合并`b4156a7938672a7ebf3130285cc9d3e135a64880`；保留防窥膜文章及其下载表单。
- 启动资料记录生产run38428563963；再次只读核对发现较新成功run38456135838（2026-10-13 19:39:35 UTC），同一代码基线。两次Notion归档逐字比较一致。`evidence/recent-production-runs.json`及`latest-production-cms/`保留来源。
- 仓库main提交内CMS为36篇；本地同步最新生产归档至37篇。新增差异仅生产已有文章，非本轮另写/发布文章。public/sitemap.xml由构建同步已有生产第733条URL。
- 当前线上sitemap733与预览733完全对齐，无缺失。19国+4地区×8语=184路线静态页都有单H1、自引用canonical、9个alternate声明；不代表Google收录或内容事实已验收。

## 代码范围

- `src/components/SourcingHomepageNav.tsx`：独立手机顶栏语言、原生语言名、窄屏字标、关闭/焦点/RTL、原路径参数与锚点保护。
- `src/components/GetAQuote.tsx`：空货量/明确未知/小数估计、取消滑杆预设、手机标签/布局、通用提交错误显示。现有接口字段和统计事件保留。
- `src/lib/quoteCargo.ts`、`src/features/freight/quoteCargoCopy.ts`：货量序列化与8语提示。
- `src/index.css`：用局部浅色表单规则替换四地区嵌入表单的深色强制覆盖；无国家正文改写。
- `src/components/WhatsAppFloat.tsx`、`ScrollToTop.tsx`：仅增加局部避让标记，手机货运表单进入视口时隐藏悬浮控件，离开后恢复，避免覆盖输入框和提交按钮；保留其他联系入口。
- `src/pages/InternationalCountryPage.tsx`：按URL取得葡语/土语，修复SPA语言切换瞬间读取上一语言导致的渲染失败；不改正文。
- `tests/quote-cargo.test.ts`：未知、估计及非法数值单元测试。
- `tests/freight-language-transition.test.mjs`：以前一语言上下文渲染葡语/土语路由的8种组合，保证不崩溃。
- `src/data/notionBlogData.json`、`public/sitemap.xml`：与最新生产CMS同步。

详见[接口与品牌说明](接口与品牌说明.md)。[验收记录](验收记录.md)汇总320项测试、70项浏览器检查及本地验证边界。所有检查和截图放`evidence/`。浏览器脚本`browser-check.mjs`阻断外部请求，Formspree由隔离模拟响应；禁止去掉该拦截后在真实接口跑提交测试。

## 复用方式

本机node_modules软链接至此前B1目录（package-lock完全一致），仅复用安装依赖，旧源码与未提交成果保持。新机器先`npm ci`。此工作区没有拷贝生产密钥；使用已发布CMS归档做本地构建，正式发布须重新严格同步CMS。

```
npm run lint
node --import tsx --test tests/*.test.mjs tests/*.test.ts tests/*.test.tsx tests/kitchen/*.test.mjs
node --import tsx scripts/test-notion-article-routing.ts
node --import tsx scripts/test-notion-publishing-guards.ts
node --import tsx scripts/test-analytics-policy.ts
node --import tsx scripts/test-analytics-runtime.ts
npm run build:preview
npm run audit:search-intent
node --import tsx scripts/test-freight-eight-languages.ts
node docs/freight-20261014/browser-check.mjs
```

`build:preview`输出临时dist目录。启动Vite preview时使用该输出路径、`--host 127.0.0.1 --port 4187 --strictPort`；重建后需要更新预览进程路径。browser-check默认4187，可用PREVIEW_URL指定本地端口。脚本使用本机Codex提供的Playwright包和安装的Chrome，无用户浏览器资料。

本轮未推送、未新建PR、未部署、未真实提交询盘、未修改共享总台账。F08事实核实与两国样板/素材集成、接收后台及生产统计入库仍未完成，不能把本地共用修复视为完整货运包完成或增长效果验证。
