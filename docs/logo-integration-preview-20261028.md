# Logo 网站接入预览 — 2026-10-28

状态：本地接入与回归完成，未推送、未发布。

用户批准开始将已选01简化地球+03字标排版接入实际网站。基线main e673cb2，分支codex/logo-integration-20261028。新增DdnzBrand.tsx、ddnz-brand.css、ddnz-global-mark-v2.png；共用页头与页脚采用紫色粗体DDNZ、轻体深蓝GLOBAL、橙色横线和橙色&。公司身份及产品展示的DDNZ标识同步新图标，客户端/静态schema的logo引用一致。HB标识及旧资源保留。当前为网页字体实现，非概念稿切角字形的精确矢量复刻；图标沿用已审阅透明PNG，印刷矢量稿不在本批。

验证：类型检查通过；8项导航/schema相关现有测试通过；836HTML/815sitemap构建0失败；991 JSON-LD可解析且无旧logo引用，815 URL保留。八语首页/产品页/线路页24个360px页面图标加载、页头页脚边界/方向正常；八语1440px首页已检查。西语手机菜单展开收起通过，未发送询价。搜索意图683pass/127context-only/5既有review保持原结果。

构建使用此前已验收47篇CMS快照，本轮未重新同步CMS；临时CMS/sitemap/audit输出已恢复。证据outputs/logo-integration-20261028/。冻结构建 /var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-V4BUXv/dist。

预览：http://127.0.0.1:4235/es/?ddnz_test=1 。旧4234概念页及4233网站预览保留。
下一步：用户确认实际网站效果后，另行同步最新main/CMS、远端检查和发布；本轮授权不包含发布。


## 2026-10-28 字体纠正
用户指出网页字体不对。撤掉DdnzBrand中的Arial/HTML文字拼接，改用按已批准组合稿整理的完整横版PNG ddnz-global-lockup-v3.png，包含自定义粗体切角DDNZ、细体GLOBAL、橙色线和副标题，避免操作系统字体替换。图标独立资产/schema引用维持v2。保留本地化链接accessible name及LTR方向。
类型检查/836HTML815URL构建0失败；八语360px首页页头页脚图片加载及边界检查通过，桌面中文目视核验。搜索意图683/127/5保持原有结果。证据outputs/logo-wordmark-fix-20261028/；新冻结预览http://127.0.0.1:4236/zh-cn/?ddnz_test=1 。旧4235保留用于对照。依旧仅本地，未推送未发布。
