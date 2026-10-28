# 国家与地区页多语言文案审阅 — 2026-10-27

状态：代码完成、本地验证完成、待用户审阅；未推送、无 PR、未发布，线上效果未验证。

## 本批范围与基线

用户批准继续检查各国和地区页多语言文案，修正不自然翻译、语言混杂及服务表述不一致，保留视觉和国别差异，暂不发布。

仓库 `/private/tmp/ddnz-freight-six-locales-20261027`；分支 `codex/freight-six-locales-20261027`；开始提交17186a5，工作树干净。只读 GitHub main 仍为 f8193e2dd0ff1613a06ea2159e65baec2dbebd56。线上法语阿联酋页面浏览器读取成功（online-baseline.json）；线上仍是此前发布版本，本批修订仅在本地。命令行 curl 因沙箱 DNS 解析失败，改用浏览器核对，没有修改线上。

使用 i18n-localization 技能。本批八语覆盖22国+4地区=208页，逐页提取可见文本并扫描；重点逐句修订地区场景、旧中东国家说明、标题语法和跨模块术语。自动扫描、作者语言审阅和浏览器验证不等于外部母语专家逐字签审。

## 发现与修正

1. 中东、西非、拉美、中亚和尼日利亚采购地场景的五语翻译存在机器直译：土语夹带 Reconcile / crate / Gulf；俄语将 origin、gross weight 等错误直译；法语出现“voiles fixes”；阿语残留整段英文；葡语把箱唛译成卡片标记。逐句审阅335个字典条目，实际更改325条（阿67、法64、葡66、俄62、土66）。保留佛山餐厨/瓷砖、深圳电子、义乌集货、永康五金等各自场景、目的国和链接。
2. 阿联酋西语/阿语缺少完整国家详情，原先回退英文。补齐两语；沙特、阿联酋和科威特法语/俄语详情使用独立语言文件，替换旧固定清关时间、全局重量/电压规则和税费保证等与本版正文不一致的说法。保持SABER、KUCAS/TABEK、JAFZA等国别内容；适用条件请进口方与承运方按本票确认。
3. 六语旧中东模板的运输对照列、首屏按钮、提示、验货和文件支持说明统一服务边界：运输方式不自动等于门到门/DDP；文件核对不等于签发认证。中文与英文阿联酋自由区描述也同步改为核对适用程序和税费，不保留一概免税保证。
4. 三国六语共18组FAQ改用已审阅的国别文件说明和服务条件，避免展开答案恢复旧承诺。保留国家特定问题和原FAQ标识。
5. 增加目的地语法形式：法语冠词、葡语冠词、俄语格变化和土语方向后缀。葡语/土语国家H1与共享元数据使用同一来源；结构化数据serviceType使用本页语言。区域ItemList仍使用适合列表的国名，不将带介词形式作为国家实体名称。
6. 地区地图的华南/华东/华北标签、国别内链模块的货运标签本地化。葡语货运模块统一常用巴西葡语词形（如planejamento、coleta、contêiner、escopo）；品牌名、正式机构原名、港口国际拼写、授权署名和行业缩写保留。不把这些名称算作未译句子。

## 结构、素材和功能边界

没有改CSS、媒体文件、URL、报价字段或埋点；最终构建CSS资产与4227基线逐字节一致。208页媒体src/poster和链接集合逐项保持，815 sitemap URL集合一致。少量葡语图片说明随文字术语修正，未换素材。既有国家案例、产品和城市差异保留，没有把国家页改为统一泛文。

本批不重新宣布业务能力、法律适用性或真实班次；沿用上一批已注明来源的历史干线参考，仍需逐票业务确认。产品、博客正文未纳入改写；葡语字典修改限定在货运场景和已出现的货运用语。

## 验证

- 类型检查通过；最终836 HTML /815 sitemap /0构建失败。
- test-freight-localization：208组本地化元数据图谱及18组国家文件/FAQ通过。
- test-freight-page-schema：208图谱身份、语言、provider和地区列表通过。
- 208静态页：唯一H1，图谱标题摘要与meta一致，国家ISO/provider正确，地区列表与可见链接一致，无无依据Offer/价格/评分；媒体与链接保留。
- 208手机页面（390×844）：图谱字符串与静态逐字节一致，标题摘要一致，无横向溢出；26阿语页面均RTL。
- 56桌面页面（1440×1000）：阿联酋、科威特、巴西及四地区×8语，无横向溢出，H1唯一。
- 阿联酋阿语自由区标签页、阿语/法语DDP FAQ、阿语到法语键盘语言切换、关闭隐私提示后法语到葡语鼠标切换通过，保持阿联酋目的国。未提交询价。
- 24服务页、16市场页既有回归通过；采购意图683 pass /127 context-only /5既有review，不将review记为通过。
- 阿语/俄语最终可见正文无整段英文或夹中文残留；法语/土语已识别机器翻译混杂词清除。检测词表只是辅助，不代表语言质量可用数字完全证明。

初次本机语言切换曾记录一次动态模块fetch失败；文件存在，扩大本地预览连接队列并用新标签页复测，复测无控制台错误。另一次鼠标语言链接受底部隐私提示遮挡，关闭提示后通过。未证明所有历史偶发网络问题均已根治。

本批未重新运行外部Schema.org/Rich Results或Search Console：图谱类型和结构延续上批，主要变更为本地化字段，并已完成静态/运行时一致性检查；不称获得Google富结果或线上收录。构建继续使用同日已审阅47篇CMS快照，非本次新同步；源快照与生成sitemap恢复后不提交。

## 文件与证据

主要源码：
- src/features/site-localization/locales/{ar,fr,pt,ru,tr}.json
- src/data/countrySpecData.ts、countrySpec.{ar,es,fr,ru}.json
- src/features/freight/destinationGrammar.ts、freightPageSchema.ts、InternationalCountryContent.tsx
- src/features/freight/reviewedMiddleEastCopy.ts、reviewedMiddleEastLabels.json、reviewedMiddleEastFaqs.ts
- src/pages/shipping-from-china-to-middle-east.tsx、src/components/FreightRouteMap.tsx
- src/features/freight/FreightRelatedLinks.tsx、remainingRouteCopy.ts及葡语货运文案文件
- scripts/test-freight-localization.ts

完整逐文件补丁见同批证据 implementation.patch，变更文件列表见 changed-files.txt。
证据目录：`/Users/huangyangming/Documents/New project/outputs/freight-language-review-20261027/`。
包括 rendered-before/after.json、coverage.json、fallbacks前后扫描、static-checks.json、expected-graphs.json、browser-208.json、desktop-56.json、preservation.json、interaction-checks.json、构建/测试日志、采购意图报告和截图。

## 交付预览

最终冻结：`/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-u61VJ6/dist`。
仅本机127.0.0.1:4228；旧4227保留。

- 中文阿联酋：http://127.0.0.1:4228/zh-cn/shipping-from-china-to-uae/?ddnz_test=1
- 阿语阿联酋：http://127.0.0.1:4228/ar/shipping-from-china-to-uae/?ddnz_test=1
- 葡语巴西：http://127.0.0.1:4228/pt/shipping-from-china-to-brazil/?ddnz_test=1
- 土语中东：http://127.0.0.1:4228/tr/shipping-from-china-to-middle-east/?ddnz_test=1
- 法语中东：http://127.0.0.1:4228/fr/shipping-from-china-to-middle-east/?ddnz_test=1

下一步：用户预览审阅；如需要独立母语专家校审，另行安排。业务本票承接确认、后续发布授权及线上效果验证保持未完成。不得从本批制作完成推导发布授权。
