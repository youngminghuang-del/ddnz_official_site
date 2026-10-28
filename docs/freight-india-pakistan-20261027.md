# 印度 / 巴基斯坦线路深化 — 2026-10-27

用户确认31c27f9的统一浅色视觉，要求继续印度和巴基斯坦，保留国家素材和内容差异并提供预览。本批仅本地制作验证，不推送、无PR、未部署。

基线：本地31c27f9；本批只读GitHub main仍f8193e2，线上两国页面成功获取。

## 实现与差异
- route-locales/india-pakistan.json：EN/ZH/ES/AR/FR/RU/PT/TR两国路线、港后交接和货物准备。
- RoutePlanningDepth.tsx：接入两国数据，保留既有八国内容。
- UsedGoodsContent.tsx：印度/巴基斯坦启用已确认country-editorial视觉及路线模块；其余内容与现有询价保持。
- 印度：按具体货物先确认可入境口岸，再比较Nhava Sheva/Mundra海运、内陆场站/仓库交接和样品空运；原压缩打包实拍及DGFT等进口准备说明保留。
- 巴基斯坦：区分Karachi Port与Port Qasim提货点，单列Lahore/Faisalabad内陆段及样品空运；原装柜、搬运、货包记录与进口资料保留。
- 无新固定时效、税费、库存、可承接能力或许可承诺。所列港口和运输方式是询价比较事项，具体货物/入口/承运接受条件由进口方与承运人逐票确认。

## 来源与素材
公开检索日期2026-10-27，仅采用港口名称及地理/内陆连接背景，不声称已订舱或查验实际能力：
- JNPA官方概览 https://www.jnport.gov.in/page/overview/MzZYdVM4U0d4dFhMN0hKVlk4OStqQT09
- JNPA码头 https://www.jnport.gov.in/page/terminals/VDRTUFJlSzllbDRDY05hVzdmdG5KZz09
- Mundra港运营方 https://www.adaniports.com/ports-and-terminals/mundra-port
- Karachi Port Trust https://kpt.gov.pk/pages/89/overview-of-karachi-port
- Port Qasim Authority https://www.pqa.gov.pk/en/about-us/introduction
以上检索摘要足以核命名；未据此发布当前航班/班期或进口法律结论。未改写原法规说明。
素材沿用public/media/used-goods-20261015/：印度packing及packing-clear/loading-4；巴基斯坦handling及loading-2/handling-clear。没有新增或加工社媒图片。缺素材的后续批次仍先列候选供用户选择。

## 验证与证据
工作区outputs/freight-india-pakistan-20261027/：
- TypeScript通过；完整预览构建836HTML / 815sitemap / 0部署文件失败。
- 80个国家语言路线模块静态检查通过（新16+已有64），815旧URL保留。
- 16页去除新增模块后与4223冻结预览逐项对比：原正文/媒体src/poster/alt/链接完全相同；本地媒体引用无缺失。
- 24服务页及16市场页回归通过。
- 两国八语×390/1440宽度共32次浏览器检查通过，无横溢出、三卡片/单模块、统一背景；中文桌面与阿语手机截图复核。
- 两国中文页面CTA进入海运表单，第二步分别预填India/Pakistan（沿用现有英文国家值），未填联系人、未提交询盘。其余语言未完整走表单。
- 搜索意图683pass/127context-only/5既有review，不称全站全绿。
- 沿用此前已核47篇CMS快照，非本轮重新同步；临时CMS/sitemap不提交。

## 预览与后续
最新预览4224（包含此前所有线路及统一视觉）：
http://127.0.0.1:4224/zh-cn/shipping-from-china-to-india/?ddnz_test=1
http://127.0.0.1:4224/zh-cn/shipping-from-china-to-pakistan/?ddnz_test=1#freight-route-options
冻结目录：/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-vjgEcJ/dist。
当前十国80路线模块本地实现；不代表全部线路工作完成。后续是地区总览/内链及Saudi、Kuwait、Bahrain、其余中亚、Chile/Argentina旧模板核对。母语商业校审、真实业务可接条件、案例订单关联、发布和效果验证保持独立状态。
