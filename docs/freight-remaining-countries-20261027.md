# 剩余12国线路与视觉统一 — 2026-10-27

状态：本地代码与预览验证完成；未推送、未建PR、未部署、未验证线上效果。

基线：本地 d73a244；本批开始 GitHub main 仍为 f8193e2dd0ff1613a06ea2159e65baec2dbebd56，读取线上沙特页面核对。复用既有工作区，保留前批预览。

## 范围与变化

沙特、科威特、巴林、卡塔尔、阿曼；哈萨克斯坦、吉尔吉斯斯坦、塔吉克斯坦、土库曼斯坦、俄罗斯；智利、阿根廷，共12国8语96个新增规划模块。

新增 `src/features/freight/remainingRouteCopy.ts`：按目的国保留不同交付问题，海运整柜/拼箱或陆路/铁路比较、急需货分票、到站与末段交接。国别主题来自现有国家页及 `countryBuyerBriefs.ts`：利雅得交付、科威特分店、麦纳麦安装地点、多哈配件先行、马斯喀特交接终点、阿拉木图/阿斯塔纳分批收货、比什凯克分拨、杜尚别末段转运、阿什哈巴德收货指示、莫斯科自提、智利餐厅安装、阿根廷样品与商业订单分票。六语复用明确的流程表达并翻译各国重点，葡/土语沿用现有国别详细简介。

改动 `RoutePlanningDepth.tsx` 接入新数据；`InternationalCountryContent.tsx` 全部套用浅色；`GulfFreightPage.tsx` 为卡塔尔/阿曼增加模块及浅色修饰；三个 legacy 国家模板（中东、中亚、拉美）扩大浅色及规划模块范围；`country-editorial.css` 增加海湾案例页样式和旧浅黄文字对比度修正。

不新增国家URL、不挪用他国素材、不新增社媒图片、不把到港/到站写作到门。所有原正文、媒体、既有链接保留。新增内容只描述询价与比较条件，没有新固定时效或承接承诺。旧正文的时效/合规措辞未在本批逐项核实或改写，不能把本批视为业务事实全量确认；当前可订路线、可接货类及报价仍待业务确认。

## 验证与证据

- 类型检查通过，完整预览构建836 HTML / 815 sitemap / 0 failures。
- 全22国176语言页静态核对：路线模块各1个，H1各1个，排除新增模块后原文字/媒体/链接逐项一致，本地媒体引用完整。
- 本批96页 × 桌面1440及手机390 = 192布局检查：无横向溢出、无模块重复、浅色样式存在。另人工查看沙特、卡塔尔、哈萨克斯坦、智利与手机预览。
- 24页货运服务与16页市场国家回归通过。
- 搜索意图815页：683 pass / 127 context-only / 5 review；5项为既有手机膜比较页，未视作全站全部通过。
- 浏览器首次英文沙特动态脚本请求一次失败，刷新成功，完整96页手机复跑无重试；随后96页桌面检查通过。
- 复用同日已审阅47篇CMS快照构建，非重新同步CMS；生成后恢复临时CMS及sitemap源码。

证据目录：`/Users/huangyangming/Documents/New project/outputs/freight-remaining-countries-20261027/`。

预览：
- http://127.0.0.1:4226/zh-cn/shipping-from-china-to-saudi-arabia/?ddnz_test=1
- http://127.0.0.1:4226/zh-cn/shipping-from-china-to-qatar/?ddnz_test=1
- http://127.0.0.1:4226/zh-cn/shipping-from-china-to-kazakhstan/?ddnz_test=1#freight-route-options
- http://127.0.0.1:4226/zh-cn/shipping-from-china-to-chile/?ddnz_test=1

下一步：用户审阅；后续旧时效来源/承接条件核对与母语校审、订单案例关联；新国家扩展仍按业务依据推进。发布须另按授权整合生产CMS与上线验证。

最终冻结产物：`/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-YXPYzb/dist`。最终智利强调文字计算色为 rgb(147,64,37)，阿语阿曼手机阅读与RTL截图已复核。
