# 加纳 / 尼日利亚线路深化 — 2026-10-27

## 范围与基线
本地接续8528049；本批开始只读GitHub main仍f8193e2dd0ff1613a06ea2159e65baec2dbebd56，线上两国页面成功获取。仅制作及本地验证，未推送、未创建PR、未部署。

实际路由先分发到UsedGoodsPage（加纳）与MarketFreightPage（尼日利亚），因此不编辑已被覆盖的旧GhanaContent/NigeriaContent或西非总览来冒充国家页完成。

## 变更
- route-locales/ghana-nigeria.json：两国EN/ZH/ES/PT/FR/RU/TR/AR路线、交接与货物准备文案。
- RoutePlanningDepth.tsx：接入西非数据，保留前六国数据。
- UsedGoodsContent.tsx：加纳八语接入模块，保留二手货分拣、打包、历史装载及地图。
- MarketFreightContent.tsx / MarketLocalizedContent.tsx：尼日利亚八语接入模块，保留实拍、瓷砖案例、市场和库存内容。

加纳：特马FCL/LCL、到阿克拉或库马西的独立公路段、急需样品空运；按现有货类强调成色/包块与进口方确认。
尼日利亚：具体卸货港及码头、拼箱放货仓库、急需补货空运，区分市场地址与内陆配送。港口名单是询价比较范围，不承诺任何班次或代理能力。
没有新增固定时效、关税、许可证、认证或当前可订航线断言。未修改旧法规正文，未做全面法律更新。

## 研究来源与采用界限
2026-10-27公开检索港口主管机构来源，用于港口名称/地理范围；没有由港口存在推导本公司承接能力。
- Ghana Ports & Harbours Authority：https://www.ghanaports.gov.gh/ （搜索可读取Tema/Takoradi机构信息；正文打开超时）。既有UsedGoodsPortMap也包含该来源。
- Nigerian Ports Authority handbook：https://nigerianports.gov.ng/wp-content/uploads/2024/07/NPA-HANDBOOK.pdf （搜索可读取Lagos Port Complex、Tin-Can Island、Lekki；整份PDF过大未读取，不称完整核阅）。
- Nigeria Customs area commands：https://dev.customs.gov.ng/about-us/area-commands （搜索出现Lekki/Tin-Can，未采用海关手续结论）。

## 素材
本批只增加文字比较模块，无新增图片或视频。加纳沿用中国端分拣装柜实拍；尼日利亚沿用拉各斯卸货/转运/提货和瓷砖素材。16页本地媒体引用均存在。未冒称第三方为DDNZ履约；未来缺素材先列视觉社媒候选供用户选择后再加工。

## 验证
证据：工作区outputs/freight-ghana-nigeria-20261027/。
- TypeScript通过；完整预览构建836 HTML / 815 sitemap / 0部署文件失败。
- 64个国家语言模块静态通过（本批16+前批48），815既有URL保留。
- 24服务页与16市场页回归通过。
- 两国八语各390/1440视宽，共32次浏览器检查：模块唯一、三卡片、无页面或卡片横溢出；中文桌面与阿语手机截图复核。
- 尼日利亚中文CTA进入海运表单，第二步正确预填尼日利亚；未输入联系人、未提交。其余语言未逐项走完表单。
- 搜索意图683 pass / 127 context-only / 5 review；5项为既有手机膜compare页面，未称全站全绿。
构建复用此前47篇已核定CMS快照，不称本轮重新拉取CMS；临时CMS/sitemap不入提交。

## 预览与下一步
http://127.0.0.1:4220/zh-cn/shipping-from-china-to-nigeria/?ddnz_test=1#freight-route-options
http://127.0.0.1:4220/zh-cn/shipping-from-china-to-ghana/?ddnz_test=1#freight-route-options
预览目录 /var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-DHmjcx/dist。
下一组印度/巴基斯坦；之后旧模板与地区总览、内链。母语商业校审、实际承接条件和案例订单关联仍是独立余项；本地验证不替代发布及效果验证。
