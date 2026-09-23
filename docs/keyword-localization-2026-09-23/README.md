# 八语关键词本地化：入口与采购决策

日期：2026-09-23。范围是本地预览，不是线上发布。Blog 文章不翻译。

## 本次实际完成

- Products、Sourcing Services 两个入口各 8 种语言：共 16 个页面版本的 Title、H1 分工调整；采购服务首段同时明确客户任务及 DDNZ / Heaven Born 的职责。
- 葡语首页 Title、H1 改用 compras、frete、importação，保留采购和国际运输的组合定位。
- 采购服务页 7 个非英语版本的 4 组问答：重写 28 个问题、答案和内链文字，并修复本地化入口此前未挂载该问答组件的问题。英文原稿保留。修复采购代理、货代、订单集货、分项报价等语义错误。
- 共享产品导览中的俄、法、葡、土手机配件标题、手机壳及挂饰链接、批发采购描述共 16 条译文修正。葡语不再把手机壳写成“电话盒”、挂饰写成“魔法”。
- 浏览器与静态页面共用入口标题，避免页面加载前后的关键词不同。

`entry-matrix.csv` 列出 16 个入口的实际标题与 32 个采购问题（包含原有 4 个英文问题）及各自承接链接。不是全站 632 个版本逐页通过母语审校的证明。

## 页面分工

| 页面 | 核心需求 | 中尾需求 | 长尾问题及承接 |
|---|---|---|---|
| 首页 | 中国采购 + 国际运输 | 从中国采购并安排出运 | 首先区分寻找产品、已有供应商、只需运输，导向对应入口 |
| Sourcing Services | 中国采购代理／采购服务 | 供应商搜索、样品、验货、集货 | 已向自己的供应商下单还能验货和集货吗 → consolidation-export；需要采购代理还是货代 → how-we-work |
| Products | 从中国批发采购产品与设备 | 品类 + 中国来源 + 采购动作 | 型号、用途、规格、数量 → 对应产品页；场景配套 → 对应组合页 |
| supplier-search | 寻找中国供应商 | 比较报价、准备样品选择 | 需要提供什么规格、各款数量和目标市场 |
| inspection-quality-control | 中国出货前验货 | 外观、功能、配件、包装检查 | 已确认样品后如何核对货物，不暗示检测认证 |
| consolidation-export | 多供应商订单集货 | 数量、箱唛、装箱单核对 | 多个现有订单如何一起交运 |
| warehouse-services | 中国仓储服务 | 收货、存放、批次管理 | 实物收货和储存条件，区别于采购订单核对 |
| Freight 服务／国家页 | 运输方式／中国到目的地 | FCL、LCL、空运、目的地交付范围 | 货物、尺寸、包装、交货点；不插入无关 buying 词 |
| Process | 采购到运输的流程 | 样品批准、检查、放行与交接 | 何时由买家决定、何时交给运输团队 |
| Insights | 采购与运输知识入口 | 成本、产品选择、报价比较 | 导向工具与相关指南，Blog 原文保留 |

以上“核心／中尾／长尾”指需求范围与具体程度，不是已测得的高频／中频／低频。

## 八语用词依据

公开同行页面仅用于确认行业表达确实存在；不能证明用户搜索量、竞争难度、排名机会或 DDNZ 具备同行承诺的服务。下列来源均在本次核对，查询无国家定向，因此不能视为当地完整 SERP 调研。

| 语言 | 采购服务入口表达 | 使用判断与来源 |
|---|---|---|
| 英 | China sourcing agent / buying services | 同行区分找供应商与购买已选产品；[Yunsource](https://www.yunsource.com/)、[True Price Agent](https://truepriceagent.com/) |
| 中 | 中国采购代理／供应商采购服务 | 采购代理及供应商协调的行业表达；[EasySail](https://easysailchina.com/zh/) |
| 西 | agente de compras en China | 相比直译 abastecimiento，更明确表达客户寻找采购支持；[Chinatify](https://chinatify.com/) |
| 阿 | وكيل شراء من الصين | 采用采购代理含义，避免把 agent 译成客户或公司内部职员；[True Price Agent 阿语页](https://truepriceagent.com/ar/) |
| 俄 | агент по закупкам в Китае | 采购服务；产品来源用 из Китая；[How Much in China](https://howmuchinchina.com/ru) |
| 法 | agent de sourcing en Chine | sourcing 在法国服务商页面中确有使用，不必一律排除英语借词；[Agent Sourcing](https://agent-sourcing.com/) |
| 葡 | agente de compras na China／assessoria de compras | 以巴西葡语为当前编辑取向。巴西同行使用 assessoria de importação，但本站只说明已确认的中国采购与运输范围，不直接照搬全程进口代理承诺；[BRChina](https://www.brchina.com.br/)、[Yiwu China 服务](https://www.yiwuchina.com.br/servicos/) |
| 土 | Çin’den tedarik／satın alma hizmetleri | 用采购服务、产品采购等本地表达，避免 tedarik ajanı 等机械拼接；[Tedarik Çin](https://www.tedarikcin.net/iletisim) |

货代术语另参考 [DHL 巴西](https://www.dhl.com/br-pt/home/dhl-for-your-business/desafios-de-envio/envio-de-artigos-pesados-grandes-ou-de-formato-fora-do-comum.html) 的 agente de cargas 和 [DHL 西语](https://www.dhl.com/hn-es/home/transporte-de-envios/centro-educativo-para-el-transporte-de-carga/find-air-cargo-partner.html) 的 transitario；不把 shipper／发货人当作 freight forwarder。

## 验证边界与后续队列

本次验证：`npm run lint`、`npm run build:preview` 均通过；SEO 与部署文件审计 0 失败。16 个入口页面的实际构建 HTML 中 Title / H1 一致，32 组采购问题、答案、链接文字与对应语言 URL 验证通过，详见 `rendered-verification.json`。659 个 sitemap 页面搜索意图初筛：552 pass、107 context-only、0 review；context-only 是文章、知识及工具等按自身用途处理的页面，并非缺少翻译。

浏览器核实葡语首页的新 Title / H1 及手机壳、挂饰内链；葡语、阿语采购服务各显示 4 组问答，链接使用对应语言前缀；阿语 RTL 正常，所测视口无横向溢出。构建快照：`/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-E5u1LI/dist`。未部署。

已有 79 个非 Blog 主题的 8 语 URL 覆盖仍然保留。构建审计确认的是静态内容、路由和基础搜索意图，不代表全部译文自然。本次实查发现旧自动译文存在语义缺陷，故不能宣称全站“关键词全部翻译正确”。

Products 的购买问答、Process、Insights 导览已在下述第二轮完成。后续深入设备型号／场景与货运路线长尾，使用逐页实际正文核对标题、首段、问题、答案和链接，不只检查语言文件有无缺键。

无 Search Console 或关键词工具搜索量数据，本次不填写搜索量、不承诺可搜索词数或流量增长。下一阶段可用上线后分语言的展示、点击、查询和着陆页数据，调整同义词与页面分工。

## 第二轮：Products、Process、Insights 长尾问答

- 完成 3 类页面 × 7 个非英语版本，共 21 个页面版本。
- 每种语言包含 Products 4 组、Process 4 组、Insights 5 组，共新校订 91 组问题、答案及内链文字，另有 21 个模块标题。语言为中、西、阿、俄、法、葡、土。
- Products 原非英语页面未挂载购买问答，已补上。承接混合订单、批发系列与餐饮项目组合、食品机械选型、包装及出口要求。
- Process 承接样品批准、出货前验货差异、多供应商出口交接、只需运输等问题。
- Insights 承接首次采购、经销商设备系列、手机壳多款采购、便携储能选型及货运询价。指向 Blog 的链接保留原文 URL，标注 English 与 hreflang=en；产品和服务链接使用当前语言。
- 四类入口（包含第一轮采购服务）的完整问题映射见 `buyer-decisions-matrix.csv`：32 个页面版本、136 组问答，其中 119 组非英语校订、17 组既有英文内容。

验证：lint、完整 preview 构建、SEO 与部署文件审计通过；解析 32 个实际构建页面的问答模块，逐项核对问题、答案、链接文字、href、hreflang、目标静态文件存在性，136 组全部通过，见 `buyer-decisions-verification.json`。搜索意图初筛仍为 552 pass、107 context-only、0 review。

浏览器抽查葡语 Products、阿语 Insights、土语 Process：问答显示及语言链接正确，所测视口无横向溢出。最新构建快照为 `/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-cCVvjl/dist`，本地预览已更新，未发布到线上。

这些验证确认本轮模块落地及路由正确；不代表设备与运输子页全部通过语义校订，也不证明任何关键词的实测搜索频次或排名。
