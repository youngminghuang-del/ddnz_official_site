# 国家与地区页：时效、服务承诺及结构化数据核对

日期：2026-10-27。状态：代码完成、本地验证完成；未推送、无 PR、未部署，线上效果未验证。

## 范围与基线

22 国家 + 4 地区 × 8 语言 = 208 页。仓库 `/private/tmp/ddnz-freight-six-locales-20261027`，分支 `codex/freight-six-locales-20261027`，开始提交 d834e0f；本批只读核对远端 main 为 f8193e2dd0ff1613a06ea2159e65baec2dbebd56。沿用 4226 已确认浅色视觉，无 CSS 或媒体文件修改；208 页图片、视频、poster、alt 与 4226 基线逐项一致。保留国家收货城市、货类、案例及内链差异。

## 时效和承诺修正

不能用公开干线时间证明 HB 当前可订或门到门交付。无对应航线/端点/班期证据的旧区间改为按具体行程确认；提货、清关衔接及末段配送另行约定。DDP 改为订舱前书面确认适用性、进口方责任、税费及除外项目。DDU 旧 FAQ 改为询问 DAP/DDP 可接范围，不声称二者合同含义相同。撤下未经证实的自营海外仓、直航排舱和锁定时效措辞。

| 国家/地区 | 本批结果 |
| --- | --- |
| 孟加拉国 | 保留 PIL CCE 宁波至吉大港 9 天干线参考；其他数字不能当作当前全程承诺 |
| 乌兹别克斯坦 | 保留 2025 年西安至塔什干 5–6 天报道，明确历史路线范围 |
| 秘鲁 | 保留 2025 年上海至钱凯 23 天走廊报道，明确非本票门到门时效 |
| 巴西 | 37/33 天明确为 2025 ASAS2 计划；补入 2026-10-01 合作终止通知和计划最后航次日期，不能写成已经停航 |
| 沙特、科威特、阿联酋、巴林 | 删除无当前依据的通用区间，DDP/派送改为条件确认；保留各国文件及收货重点 |
| 哈萨克斯坦、吉尔吉斯斯坦、塔吉克斯坦、土库曼斯坦、俄罗斯 | 旧通用陆运/铁路区间改为具体路线确认，保留口岸、目的城市及内陆交接差异 |
| 墨西哥、智利、阿根廷 | 旧通用海空区间改为当次班期和交付范围确认 |
| 尼日利亚、加纳、印度、巴基斯坦、卡塔尔、阿曼 | 核对既有规划措辞及服务条件，保留国别内容，不新增固定承诺 |
| 中东、中亚、西非、拉美 | 不给整个地区统一时效承诺；地区结构化数据反映实际展示的国家入口 |

最后视觉复核另修正沙特 FAQ“时效锁定”、认证“审核核发/保障体系”等与正文不一致的标题；中东时效表备注同步改为行程确认，不再描述不存在的数字区间。

## 可追溯公开依据

- PIL CCE 官方路线 PDF：https://www.pilship.com/wp-content/uploads/2024/08/CCE-CHINA-CHITTAGONG-EXPRESS_PIL-1.pdf
- 西安—塔什干报道（2025-01-03）：https://english.www.gov.cn/news/202501/03/content_WS677746d3c6d0868f4e8ee7c1.html
- 上海—钱凯报道（2025-12-09）：https://english.shanghai.gov.cn/en-Latest-WhatsNew/20251209/8312a7aee80b4f8896ebf4d9959e2933.html
- Maersk 2025 ASAS2 计划：https://www.maersk.com/news/articles/2025/03/04/new-service-connecting-east-coast-south-america-and-asia
- Maersk 2026-10-01 网络调整：https://www.maersk.com.cn/news/articles/2026/10/01/asia-east-coast-south-america-network
- ICC Incoterms：https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/

这些来源支持各自范围内的公开信息，不构成 HB 当前报价或服务授权。实际可订班期、货物准入、进口方及目的地操作仍需业务逐票确认。

## 结构化数据设计

采用 schema-markup 技能。国家页使用 WebPage + Service，同页稳定 @id、mainEntity/mainEntityOfPage 互联，provider 为 HB Organization，areaServed 为对应 ISO Country。地区页使用 CollectionPage + ItemList，列表与可见国家链接、顺序及语言一致。统一 canonical、标题、摘要、语言（巴西葡语 pt-BR）、静态 HTML 和客户端图谱。移除重复旧 Service/FAQ 图谱及无依据 Offer、币种等数据；未增加评分或价格。

实现入口：`src/features/freight/freightPageSchema.ts`；静态注入 `scripts/generate-static-pages.ts`，客户端 `src/components/SEO.tsx`，去重 `src/components/SchemaMarkup.tsx`，标题收尾 `scripts/finalize-p0-seo.mjs`。`scripts/test-freight-page-schema.ts` 覆盖 208 种路由和排除其他页面。

技能内部适用性判断 75/100：内容匹配25、Google富结果资格0、数据20、技术15、维护10、风险5。此分数是本批内部评估，不是外部工具评分。Service/CollectionPage 可表达页面语义，不保证 Google 富结果。

- Schema.org 官方验证器：英文沙特和拉美代表代码均 0 errors / 0 warnings；截图已保存。
- Google Rich Results Test：沙特代表代码显示 No items detected。符合选用类型不具专属富结果的预期，不能记作富结果通过或获得展示资格。
- 没有部署，未进行 Search Console 线上增强报告/收录或流量验证。
- 指南：https://schema.org/Service 与 https://developers.google.com/search/docs/appearance/structured-data/sd-policies

## 检查及证据

最终构建 836 HTML / 815 sitemap / 0 failures；类型检查、24 服务页与16市场页回归通过。208 静态页核对图谱、可见内容对应、媒体保留和链接；208 手机浏览器页核对图谱与静态逐字节一致、标题摘要、唯一 H1、无横向溢出；32 桌面语言布局通过。最后标题细修后重建并复核受影响页面。一次本机动态模块加载失败刷新恢复，后续全量复跑通过。

搜索意图仍 683 pass / 127 context-only / 5 既有 review（手机膜比较相关）；不将这些既有 review 记为通过。本批构建使用同日已审阅的47篇 CMS 快照，没有新同步 CMS；生成源数据和 sitemap 不作为业务变更提交。

证据目录：`/Users/huangyangming/Documents/New project/outputs/freight-claims-schema-20261027/`。包括 source-claims-before.json、claim-edits.json（初轮改写记录，最终代码另有细修）、visible-claims-after.json、schemas-after.json、static-checks.json、browser-208.json、desktop-32.json、构建/类型/回归日志、验证器和页面截图。

## 预览与下一步

本地预览端口 4227：
- http://127.0.0.1:4227/zh-cn/shipping-from-china-to-saudi-arabia/?ddnz_test=1
- http://127.0.0.1:4227/zh-cn/shipping-from-china-to-brazil/?ddnz_test=1#freight-route-options
- http://127.0.0.1:4227/zh-cn/shipping-from-china-to-latin-america/?ddnz_test=1

下一步：用户审阅本批预览；业务确认真实可接条件和班期；母语校审。发布及线上效果验证保持未完成，须另获用户发布指示。

最终预览冻结目录：`/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-QyO9T9/dist`。最后细修后208静态检查与类型/服务/市场回归重新通过；沙特八语桌面复核记录 final-label-checks.json。sitemap 815 URL 集合与4226基线完全相同。
