# 第十五轮询盘链路核查

结论：前端链路已核查，真实Formspree入库未验证；两个前端问题已本地修复并验证，尚未发布。生产仍e4522899313cf17b79d5ce507a76597ab741d9c9 / run38550216872 / index-DiCXCsm7.js。本地分支codex/inquiry-chain-audit-20261014从origin/main建立，保留旧六组未跟踪资料。

## 接收入口与字段

所有已发现网络询盘提交共用 https://formspree.io/f/mdabvqbd 。仓库未发现另一个询盘接收API；不能由此推断后台通知/CRM配置。

| 实际入口/实现 | 发送方式 | 目的国、货物与货量 | 准备阶段、来源 | 接收状态证据 |
| --- | --- | --- | --- | --- |
| 八语独立/get-a-quote货运；国家页内嵌GetAQuote；首页/区域/现代服务CTA交接 | @formspree/react useForm，FormData POST | Destination、Origin、Selected_Service；Product_Category/industry/message；Estimated_Weight_KG/Estimated_Volume_CBM和Weight_Status/Volume_Status | 无独立准备阶段；Lead_Goal/Lead_Source/Source_Article_Slug、UTM_Source/Medium/Campaign/Content；无UTM_Term、语言/页面路径字段 | 八语Qatar及Oman重试拦截通过，不是实际接收 |
| Product Sourcing / Supplier Inspection & Consolidation → TradeSupportInquiry | 同一React SDK、FormData；本地预览仅展示payload | Destination、Product_or_Order_Details、Product_Category、Requested_Services；数量可在详情中，无重量体积字段 | Order_Readiness、Target_Timing正常；Lead_Source、UTM前三项正常；article、UTM_Content/Term未写入payload | EN采购/AR验货两个实际拦截payload通过 |
| 已现代化空运/仓储等服务页 | CTA进入共用货运询价，不是旧内嵌服务表单 | 共用GetAQuote字段 | source=air_freight/warehouse_services实际交接保留 | 两类CTA→询价→拦截提交通过 |
| 商用厨房原/多语混批询价 | inquiry.mjs，URL-encoded POST | name/email/_subject/message；message含目的国/港口、买家类型、型号、数量和备注 | 供应准备阶段/UTM无独立字段；subject识别厨房需求 | 源码及既有相关测试；本轮未声称全厨房浏览器矩阵 |
| PRIVACY10 worksheet | privacyWorksheet.mjs，JSON POST | contact_method/value、name、destination、buying_requirements；Email额外映射email；message | source/article/resource/language/page_url；无独立准备阶段或UTM | 相关测试覆盖HTTP/业务失败/断网/无效联系；未新增真实提交 |
| 其他产品配置/选型/首页brief本地表单 | 组织需求或session handoff到TradeSupportInquiry/GetAQuote，无直接接收 | 按对应handoff政策传递；不能把本地prepare视为已发送 | 下游收集并提交 | 本轮复用quote-link-policy tests，不称遍历所有产品工具 |
| mailto / WhatsApp入口 | 用户打开外部通讯草稿，不是Formspree入库 | URL预填正文；WhatsApp保留85261077362 | source/campaign/content参考信息 | 未打开/外发真实消息 |

ServiceDetail.tsx保留旧useForm提交分支，但App已用精确现代服务路由覆盖sea/air/amazon/warehouse；不将读到旧源码误报为本轮生产活跃入口。未知serviceId的fallback也不算推荐公开入口。

## 实际payload核查与边界

- 生产八语Qatar：Destination=Qatar，weight/volume空白均序列化为`Unknown — awaiting cargo details`且status=unknown；绝不自动填样例重量。货物/件数/计划阶段放message时可完整传递。货物备注与类别可不填，因此“能提交”不等于业务资料齐全。
- 客户估计重量/体积保留KG/CBM单位；零/负数/无穷/非法值不能作为有效估计，quote-cargo测试通过。
- 独立EN采购/AR验货：Oman、货物详情、服务、准备阶段、时间与来源正常。阶段/服务值采用本地语言，未建立统一CRM枚举；如后台需要自动分类，需另定映射。
- 货运本身未收集独立准备阶段；现代服务CTA来源可保留，但用户仍选择运输方式，不默认把空运来源强制当Air订单。
- 货运缺UTM_Term，采购缺article/UTM_Content/Term；厨房无独立UTM。这是归因完整性缺口，不能称所有入口同一字段标准。未擅自重命名原接收字段。

## 两项本地修复

1. GetAQuote连续询价的错误成功状态：生产拦截复现首次成功→Send another inquiry→选Air，UI再次显示成功但累计请求仍1。原因是resetFunnel仅清本地状态，未reset Formspree succeeded。修复调用useForm返回的resetFormspree；本地同路径不再提前成功，完整第二次表单提交后请求数实际+1，payload为新Air/Oman。
2. 未证实的回复时限/只回邮箱承诺：GetAQuote RU/FR/ES/AR成功文案；八语独立报价页SEO description；共享translations四个基础语subtitle/alertSuccess和ES/AR/PT/TR successText改为按提交联系方式确认路线、货物、服务范围。不改产品技术参数中的24小时，也不把本轮当全站事实清理。

修改仅src/components/GetAQuote.tsx、src/i18n/translations.ts、src/pages/get-a-quote.tsx。未改后端、endpoint、字段名、事件名、CMS、依赖或工作流。准备阶段属于下一轮产品改进，本轮不扩表单。

## 验证

- 生产原状live-inquiry-results.json：8语成功payload、EN错误再次成功复现、Oman模拟422/断网/成功重试，共11个拦截POST；0真实Formspree请求、0 pageerror。
- 本地local-inquiry-results.json：8语、第二次实际提交、422/断网重试，共12个拦截POST；错误再次成功=false；0真实Formspree请求、0 pageerror。新提交重置后Origin为空，允许用户重新填写，未将空值当广州或其他实际起运地。
- other-forms-results.json：EN采购、AR验货、现代空运/仓储CTA四个拦截提交，来源/目的国保留。
- 这些测试返回模拟成功，仅验证前端状态机和payload。浏览器网络层在发送前拦截Formspree，其余非GET也阻断。cookieConsent declined，使用ddnz_test=1，假联系为qa@example.invalid。不能据此声称后台收到询盘。
- 31项相关测试通过（quote-cargo、quote-link-policy、privacy-worksheet、kitchen），lint通过；build:preview 754HTML/733sitemap/0失败；search-intent610pass/117context-only/6历史review。无新页面。
- 本地候选9amw0H；独立Vite4192用于回归，不替换原4187预览。初次Python静态服务4191并发连接重置，改Vite后通过。测试最初Send Another Request名称和main form假设不符实际，已修正；不算产品故障。

## 后台证据缺口

用户确认用Formspree后台。总控已在Chrome只读打开该后台，进入login?next=/forms?，尚未登录；工程没有访问邮箱/CRM或搜取凭据。当前缺：

1. mdabvqbd表单归属、启用状态、接收限制/垃圾箱等后台配置只读证据。
2. 该表单一条已有真实submission的ID、时间、来源页面及原始字段（联系信息须脱敏），核对目的国/货物/货量/阶段/来源是否实际保存；不同入口字段并不完全相同。
3. 如需证明本次生产版本端到端送达，必须另行明确授权一条可识别测试询盘，并在后台找到同一条记录。目前未授权、未执行；已有旧记录只能证明历史接收，不能证明新版本新提交送达。

当前完成状态：审计及两项代码修复/本地验证完成；后台接收验证待登录/证据；修复发布未授权、未push/PR/merge/deploy。不能把第14轮发布授权延用于本轮。下一步先查看既有Formspree记录，再决定修复发布与准备阶段/归因字段改进。
