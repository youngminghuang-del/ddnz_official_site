# 国家及地区页 schema 专项复核（2026-10-27）

状态：本地代码、验证与预览完成；未推送、无 PR、未发布。起点 f8d4e9c；GitHub main 只读核对 f8193e2dd0ff1613a06ea2159e65baec2dbebd56，线上法语阿联酋页面读取成功。按用户指定 `/Users/huangyangming/.codex/skills/schema/SKILL.md` 执行。覆盖22国+4地区×8语=208页。

## 修正

- `freightBreadcrumbs.json`、`FreightBreadcrumbs.tsx`：现有49处面包屑与JSON-LD共享名字、顺序和URL。32地区页去除不恰当的海运服务父级（地区包含铁路/公路等），用首页→地区；16个卡塔尔/阿曼页面保留地区→国家；葡语巴西改首页→拉美→巴西。保留原样式位置，当前项 aria-current=page；分隔符隐藏给辅助技术，国家文字不隐藏。
- 四个使用者：RegionContent、CentralAsiaOverviewContent、GulfFreightPage、BrazilPortugueseContent。其余159页没有可见面包屑，不添加隐藏层级；其他国家的地区返回链接保留。
- `freightPageSchema.ts`：现有 WebPage+Service / CollectionPage+ItemList 图谱加唯一 BreadcrumbList 和 page.breadcrumb 引用。保持各语言服务类型、国家ISO和同语言地区成员，保持报价/时效服务边界，不引入无依据Offer、评分、FAQ富结果。
- `SEO.tsx`：已识别的26个目的地路由使用实际路径确定canonical及hreflang；`?country=mexico` 不再让巴西正文的元数据指向墨西哥。
- `test-freight-page-schema.ts` 增补图谱唯一身份、面包屑顺序/引用/URL回归。

## 验证证据

证据目录：`/Users/huangyangming/Documents/New project/outputs/freight-schema-review-20261027/`。

- 类型检查、208图谱测试、208多语metadata及18组文案FAQ测试、24服务页、16市场页回归通过。
- 最终构建836HTML、815sitemap、0失败。沿用已审阅47篇CMS快照，未重新同步CMS。生成后恢复CMS/sitemap源文件。
- 208静态页各只有一个JSON-LD，无microdata/RDFa竞争标记；节点ID唯一。49面包屑逐项匹配可见文字和URL，目的页存在。元数据和图谱一致；地区成员有正文链接。
- 208手机浏览器结果：图谱字符串与静态相同，无横溢出；49运行时面包屑和图谱也逐项一致。全量检查在6ND9ga构建完成；最后仅追加country参数对hreflang的保护，最终ganw7E构建全量静态重查，并定向复测葡巴/阿卡塔尔/土中亚/法阿联酋参数页全部正确。
- 法语阿联酋→中东地区→返回，最终路由加载完成后均只有当前图谱。第一次过早读取到了路由过渡中的旧页面；完成加载后复核正确，未将短暂过渡当作最终状态。
- 208页main除面包屑外逐字节一致；媒体列表、CSS文件哈希和815条sitemap完全保留。
- 搜索意图683pass/127context-only/5既有review。人工查看review均为手机膜compare五语首段来源提示，不属于本批线路变更；未重做历史去重，不宣称全站全绿。

## 官方工具（代码片段测试）

从构建HTML原样抽取JSON-LD script，不提交localhost URL，不发布。

| 样例 | Schema.org Validator | Google Rich Results Test |
|---|---|---|
| 阿语卡塔尔 WebPage+Service+Breadcrumb | 0错误0警告 | 1个有效 Breadcrumbs |
| 土语中亚 CollectionPage+ItemList+Breadcrumb | 0错误0警告 | 1个有效 Breadcrumbs |
| 法语阿联酋 WebPage+Service，无可见面包屑 | 0错误0警告 | 未重复测试；泛Service无专门富结果 |

Google结果：
- https://search.google.com/test/rich-results/result?id=uJGyRL03yNSvMxY34yHBuA&hl=en
- https://search.google.com/test/rich-results/result?id=oGGGQg822xBxy_mcI-NnHg&hl=en

各有截图和结果文本。3份代表验证不等于208页逐份外部测试；内部208全量验证另列。工具检测有效不保证Google实际展示；未做GSC或生产抓取验证。

官方依据：https://developers.google.com/search/docs/appearance/structured-data/breadcrumb 与 https://developers.google.com/search/docs/appearance/structured-data/sd-policies 。

## 预览与下一步

最终冻结 `/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-ganw7E/dist`，仅127.0.0.1:4229；保留4228等旧预览。
- http://127.0.0.1:4229/pt/shipping-from-china-to-brazil/?ddnz_test=1
- http://127.0.0.1:4229/ar/shipping-from-china-to-qatar/?ddnz_test=1
- http://127.0.0.1:4229/tr/shipping-from-china-to-central-asia/?ddnz_test=1

下一步用户审阅；如之后明确授权发布，再同步main/CMS、回归、部署及生产URL检查/GSC观察。业务可订条件与外部母语专家签审未替代为本批schema验证。
