# 货运运价扩采与页面预览验收

状态：本批采集、代码与本地验证完成；业务条件仍待HB核对。仅本机预览，未推送、未PR、未部署或发布。
预览：http://127.0.0.1:4271/rate-review/

## 范围与结果
- 核对30个目的港目标（含BAHRAIN通用记录）。29个可准确选择的目标已完成盐田、宁波、上海查询；阿联酋Khalifa未匹配准确名称，不用巴林Khalifa Bin Salman Port替代。广州查询范围的实际装运港仍分南沙、黄埔。
- 巴西五个遗漏港口已补采；此前四个无价目标已复查。舒艾拜、蒙格拉查得上海方案；钱凯、卡西姆本次四组起运选择均无报价。无报价不等于停航。
- 新增220条原始报价、1062条杂费，220条完整备注。原始成本、月日有效期、完整船期与重量/免柜条件均保留。查询分页条数见query-manifest.json，数据与工作簿验收见data-check.json。
- 新增实际装运港分布：盐田83、上海109、宁波1、南沙19、黄埔8。宁波记录为吉大港方案；其余已查询但无记录的组合继续单独询价，不套用广州价格。
- 覆盖矩阵30×4组起运选择：60组有完整记录，54组本次无报价，4组Khalifa未匹配准确港名，2组巴林通用记录码头待确认。另列6个陆运国家，合计126行。
- 两组分页可见字段重复，原始220条及费用完整保留并标记，预览合并为218组新增参考。连同原105条快照，本机数据共323条。

## 预览与修复
1. 五国与两个区域样板接入补采快照。沿用2026年Q4参考、成本÷0.9计算10%毛利率、向上保留两位小数；主价USD，杂费按原币种列示。无采集日期、无供应商月日有效期前台栏，不承诺固定更新周期。
2. 起运港选项按当前国家/目的港实际记录显示；无记录组合保留单独询价。
3. 修复从盐田等路线进入询价后仍默认广州的问题：新增originText本地交接字段，表单预填真实起运港，询价URL保持无参数。
4. 条件性附费另询，包含斜线金额和美元符号的原成本不直接作为对客金额展示；保留重量、柜型、体积和时限单位。
5. 源站一条中转地等于目的港的记录保留内部原文，前台显示“中转安排待确认”。源站HAMAD同名候选已改选中文“哈马德港”重查，首选空结果另档。
6. LCL、空运、DDP仍由HB按票核价。DDNZ制造与出口、HB货运执行角色及现有案例/页面风格保留。

## 检查证据
- 19项模型与询价交接测试、TypeScript、diff-check通过。完整构建849HTML、828URL，门禁0失败。
- 849HTML的标题、描述、canonical、hreflang、robots、H1及JSON-LD与原4270冻结产物逐页相同。真实新增采集ID没有进入构建文件，成本快照仅本机接口提供。
- 七页1440/390共14个最终运行视图，单H1，无重复ID/横向溢出、无采集日期。320窄屏另检。最终JSON-LD与静态产物相同。
- 结构化数据实际为国家WebPage/Service及区域CollectionPage/ItemList/BreadcrumbList。七页名称、HB提供方、目的地及链接已复核；UAE简称/全称、秘鲁说明式H1和当前页文本面包屑人工确认无语义冲突。没有FAQPage或Offer；FAQ仅为页面内容，巴西折叠问答另有交互验证。未新跑Google富结果测试，不声称新增富结果资格。
- 宁波→吉大港40HQ参考4366.67美元已核对；盐田→Paranaguá 40HQ参考5111.12美元及按币种费用已核对；五个巴西新增港口20个筛选组合、更多展开、宁波空状态、七页筛选已验证。
- 盐田→Paranaguá询价实走到第4步，始发地/目的港/柜型/记录ID/Q4非锁价说明完整；宁波→吉大港第2步始发地正确。未提交表单。
- 搜索意图：691 pass / 132 context-only / 5既有review，启发式检查不等于排名或语言质量全量合格。
- 内部Excel五表：126行覆盖、220运价、1062杂费、573备注分段、280核对事项。Artifact重算、错误扫描、五表渲染及导出结构检查通过；未做原生Excel应用操作验收。
- 开始及结束远程main均48354419884935a4b9b4c98eb7840c27a9e3364e。线上巴西页只读核对仍无本批运价模块，证据live-baseline.json；没有部署操作。
- 冻结目录：/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-c3CmGO/dist。仅127.0.0.1:4271，noindex/nofollow/no-store。此前4266/4267/4268/4270不动。52篇CMS快照仅用于本次构建，生成物归档后恢复仓库原状态。

## 文件
代码：src/components/GetAQuote.tsx、src/lib/quoteLinkPolicy.mjs、tests/quote-link-policy.test.mjs、src/features/freight/rates/FreightRatePreview.tsx、model.mjs、model.test.mjs。
内部交付：FCL运价补采-20261030.xlsx、五CSV、raw/、query-manifest.json、preview-payload.json、preview-deduplication.json、data-check.json、runtime.json、schema-visible.json、schema-alias-review.json、static-parity.json、interactions.json、截图和日志。
代码基线5a7f8bb，本批本地提交见completion.json，分支codex/freight-expansion-preview-20261030。

## 尚需完成
- HB确认阿联酋Khalifa平台准确入口、巴林通用记录的具体码头，不把候选近似名当作已确认路线。
- 本批280条核对事项含条件项，不能都视为报价错误：108航程显示差异、104免柜条件、52未列杂费、7日期待核、1中转自指、4重复记录行及范围/年份/港名等事项。
- 实际承接、缺失杂费、目的港费用、重量/免柜批准与当次船期仍需业务确认；效果未验证。LCL/空运/DDP另询HB。
- 发布前另行整合最新线上/CMS并获得发布指示；本批不发布，不建立固定报价更新自动化。

港名核对来源：https://www.mtt.gov.bh/khalifa-bin-salman-port 、https://www2.apmterminals.com/en/bahrain 。
