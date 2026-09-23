# 创业预算与零售选品长尾承接

2026-09-23，本地预览更新，未部署。关键词按客户需求具体程度划分，无搜索量或排名承诺。Blog 未修改。

## 已落实的页面分工

| 客户需求 | 主要承接页与锚点 | 新增内容 |
|---|---|---|
| 餐饮创业低成本起步 | `/sourcing/restaurant-project-equipment/#restaurant-startup` | 精简菜单、出品量、场地、开业必需设备与后期扩充清单 |
| 最便宜／预算内厨房方案 | `/sourcing/restaurant-project-equipment/#kitchen-budget` | 同菜单同产能比较、基础与扩充方案、设备和运输安装费用拆分 |
| 零售商防窥膜供应商 | `/screen-protectors/wholesale-for-stores/#retail-privacy` | 机型、样品、正面清晰度、触控、包装与安装、起订量及首批库存投入 |
| 手机配件创业方案 | `/sourcing/mobile-accessories-from-china/#accessory-startup` | 实体店／维修／线上渠道、手机壳挂绳保护膜组合、样品与现货及定制区别、周转资金 |

使用已有页面增加独立可链接的正文模块，没有新增独立 URL。每个模块含标题、说明、三步采购建议、一个长尾问答、相关产品／方案内链和询价入口。英、中、西、阿、俄、法、葡、土全部完成：4 × 8 = 32 个模块，分布在 24 个页面版本。

Products 的 8 个语言版本各增加 4 个入口，共 32 条发现链接。询价链接使用 `source=startup_plan`，按厨房／手机配件选择类别，并用 `overviewBrief` 传递当前语言的方案名称；仅预填，未提交询价。

关键词分工同时记录到 `src/features/search-intent/keyword-owners.mjs`。八语页面与标题映射见 `page-map.csv`。

## 内容约束

- “最便宜”作为客户比较问题，正文解释统一产能、配置和交付范围，不声称全网最低价。
- 没有编造固定创业预算、利润或开业总价；预算需明确币种及设备／运输／安装范围。
- 防窥膜数量依据项目现有产品资料：OG28 每单至少 1,000 片、每机型至少 100 片；001、Titan 每机型至少 500 片。要求确认最新供货条件，不承诺创业客户低于这些起订量。
- 混合询价不等于降低各供应商起订量或保证合并运输。产品价格、币种、既有计算器均未修改。
- 基础厨房方案仍需满足菜单、生产能力、食品分隔及场地条件，未默认包含安装。

## 验证

- `npm run lint`、`npm run build:preview` 通过，SEO 与部署文件审计 0 失败。
- 解析实际构建 HTML：32 个模块的全部文案、目标链接、Products 锚点入口、询价类别和方案参数通过，详见 `verification.json`。
- Sitemap 仍为 659 页；搜索意图初筛 552 pass、107 context-only、0 review。初筛不代表全部译文审校、搜索频次或排名。
- 浏览器验证葡语 Products → 手机配件创业模块 → 询价页：正确选择手机配件，方案名称成功预填；未提交。
- 浏览器验证阿语防窥膜模块起订量与 RTL、中文餐饮创业和预算模块；所测视口无横向溢出。
- 构建快照：`/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-uan6Uq/dist`。

## 第二批：咖啡店、酒吧、派对音箱与电商卖家

新增 4 个角度，每个均有英、中、西、阿、俄、法、葡、土版本，共新增 32 个模块：

| 需求 | 承接页与锚点 | 正文重点 |
|---|---|---|
| 小咖啡店低成本设备 | `/sourcing/restaurant-project-equipment/#small-cafe-budget` | 菜单、峰值出杯、咖啡机与磨豆机、水处理、牛奶冷藏；必需与扩充分别报价 |
| 酒吧／调酒吧低成本设备 | `/sourcing/restaurant-project-equipment/#bar-equipment-budget` | 冰量、冷藏、洗杯、备料、给排水和扩容；工具及其他设备按需寻源确认 |
| 更便宜的蓝牙派对音箱供应商 | `/sourcing/audio-speakers-from-china/#party-speaker-budget` | 同规格比价、持续功率与峰值区别、电池、麦克风、样品、包装、运费 |
| 手机壳电商创业，Noon／Amazon／Jumia 卖家 | `/phone-cases/#marketplace-seller-startup` | 少量机型颜色、现货与定制、样品检查、图片与兼容描述、目标平台和国家、履约及补货预算 |

第二批仍使用现有页面与独立锚点，没有新增独立页面。Products 八语入口由每页 4 个增加为 8 个。累计 64 个模块，分布在 40 个落地页面版本，另有 8 个 Products 发现入口版本。

咖啡店概念布局不是最小开业预算清单；酒吧工具、玻璃清洗及其他设备属于按需寻源确认范围，不表述为现货完整套装。音箱不承诺全市场最低价。电商采购不包含账户代运营、平台上架批准、品牌授权或利润保证。

平台信息仅用于要求卖家核对自己所选国家、账户及履约方式的现行要求；没有把某一个国家的规定推广为所有市场规则，也没有发布固定佣金、包装规格或平台审核承诺。参考官方资料（2026-09-23 核对）：

- [Amazon FBA 包装与标签说明](https://sell.amazon.com/blog/fba-packaging-prep-labeling)
- [Noon 商品上架政策](https://helpcenter.noon.partners/en/category/product-listing/product-listing-policy)
- [Jumia Nigeria 包装说明](https://vendorhub.jumia.com.ng/how-to-package-your-order/)

最终验证：lint、preview 构建、SEO 及部署审计通过；`verification.json` 已更新为全部 64 个模块的正文、发现链接、目标文件和询价参数验证，0 失败。全站初筛保持 552 pass、107 context-only、0 review。

浏览器核实葡语音箱模块，并实际点击询价：正确预填音箱类别和方案名称；阿语电商模块 RTL、内链和询价参数正确；中文咖啡店和酒吧模块显示正常。所测页面无横向溢出，未提交询价。最新快照：`/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-2ipeaO/dist`。本地预览已更新，未上线。
