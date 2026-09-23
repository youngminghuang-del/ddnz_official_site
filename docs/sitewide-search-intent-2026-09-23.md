# 全站采购意图补强与检查 · 2026-09-23

更新：本报告下方的 99 个运输页缺口已于同日后续修复。最新复查为 270 页通过初筛、62 页按信息／功能意图保留、0 个待复核项；详见 [运输页修复记录](freight-static-repair-2026-09-23.md)。下方原始检查结果保留为历史基线。

本次针对本地下一版本，不代表生产站已经发布。检查范围为当前 sitemap 的 332 个可索引页面、8 种语言。未调用付费关键词数据库，因此“核心词、品类词、长尾词”是意图与页面层级，不是实测搜索频次。

## 已落地的承接规则

| 层级 / 意图 | 示例 | 承接位置 |
|---|---|---|
| 品牌及采购服务 | product sourcing from China / China sourcing services | 首页、采购服务总页；说明对象、服务范围及交接 |
| 跨品类选择 | source products from China | Products 首屏；链接至真实产品类别 |
| 产品核心词 | food processing machinery sourcing from China | 食品机械总页标题、H1、首段 |
| 品类与采购动作 | source meat processing machinery from China | 产品分类页首段；设备列表、规格和采购检查项 |
| 场景组合 | buy a meatball preparation equipment package from China | 独立组合页首段；型号、数量、组合成本、范围和询价 |
| 型号、配置与条件长尾 | H20 spiral mixer / 20 L bowl / flour capacity；meat grinder configuration；vegetable slicer blade set | 相关产品页可读的型号、参数、采购说明及 FAQ；不新增薄弱型号页 |
| 客群需求 | source wholesale kitchen equipment from China for distributors | 经销商、餐厅项目、门店和自有品牌页面 |
| 服务需求 | pre-shipment inspection and quality control in China | 具体服务页；服务适用情况、产出、流程、边界 |
| 运输目的地 | shipping from China to Kazakhstan / Central Asia | 相应运输页面；不强加 buying/sourcing 产品关键词 |

正文中的采购动作必须指向具体产品或服务，不把孤立的 China、网址中的 from-china、导航或页脚视为已经承接采购意图。标题与首屏应自然、明确；同一页面不机械重复完整关键词。`from Asia` 需要真实的亚洲多国供货依据，不能用来替代 `from China`。`Central Asia` 当前是运输目的地。

依据：Google 建议标题准确且简明，并避免重复堆词；链接文字应有描述性并符合上下文。参见 [标题链接](https://developers.google.com/search/docs/appearance/title-link) 和 [可抓取链接与锚文本](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)。这些原则不构成排名保证。

## 本次修改

- 食品机械 11 个页面补充完整采购表达；总页标题与 H1 明确中国来源。
- Products、音响、制冷、厨房设备、三类厨房单品、六类餐厅场景及采购服务补强可见正文。
- 手机壳、手机挂绳、户外设备及四类买家页面同步补充英文，以及已有西语、阿语版本的对应表达。
- 三类采购服务的八种语言版本明确服务与中国地点。
- 从现有页面抽出共享服务文案及餐厅场景资料，使 24 个采购服务页面、6 个餐厅场景页面的静态 HTML 也有真实正文、范围和询价链接。数据由客户端和预渲染共用。
- 调整危险品运输三种语言及中文拼箱首段，使起运地明确；修复巴西中文页面静态 H1 的英文回退。
- 价格仍按供应商 PDF 的批发价列，设备与包装单列。本次未改变型号价格或组合计算。

## 检查结果与界限

完整逐页结果见 [CSV](search-intent-audit-2026-09-23/pages.csv)、[JSON](search-intent-audit-2026-09-23/pages.json) 和 [自动报告](search-intent-audit-2026-09-23/summary.md)。

- 90 个首页、产品页及采购服务页面：首屏来源及采购/服务表达通过自动初筛。
- 81 个运输页面：首屏起运地表达通过自动初筛。
- 62 个文章、指南、流程、资讯及询价辅助页面：按信息/功能意图保留，不强行加产品购买句式。
- **99 个现有运输国家/语言页面：静态 HTML 缺少 H1/正文，无法仅凭静态输出判断可见文案，保留为技术复核项。** 这不等于浏览器里一定没有页面，也不应算作采购意图已通过。路径已逐条列入报告。本次补强并未完成这批运输页面的预渲染重构。

自动结果只检查首屏词语证据，不证明语义完整、翻译质量、真实搜索量或排名。页面功能与布局另行抽查，不把词汇命中率当成全部 SEO 质量。

## 复用

项目 AGENTS.md 已记录此规则。构建后运行：

```sh
npm run audit:search-intent
```

也可指定构建目录和报告目录：

```sh
python3 scripts/audit-search-intent.py --dist /path/to/dist --out /path/to/report
```

审查器不把 meta、导航、页脚或 JSON-LD 的关键词当作首屏证据；只扫描 sitemap 内页面。`review` 是待人工复核，不是静默通过。

验证：TypeScript 检查通过；完整预览构建及现有 SEO/部署检查通过；食品机械与产品语言路由测试 14/14 通过。浏览器抽查食品机械和餐厅组合页的首屏表达与正文。
