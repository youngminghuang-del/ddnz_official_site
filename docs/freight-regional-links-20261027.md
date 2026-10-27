# 地区总览与国家内链（2026-10-27）

状态：代码完成、本地验证完成；未推送、未建 PR、未发布、未做线上效果验证。

## 基线与范围

本地基线 5759dcd，沿用前批 Nigeria 浅色编辑式视觉。开始时 GitHub main 仍为 f8193e2dd0ff1613a06ea2159e65baec2dbebd56；读取线上拉美页作基线核对。

- 四个地区（拉美、西非、中东、中亚）的八语总览采用纸白、深蓝文字、浅紫分区和橙色 CTA。
- 新增 FreightRelatedLinks 纯内容组件，接入 22 个国家及 4 个地区的八种语言，共 208 页。
- 国家返回所属地区、同地区国家互访、地区互访及海运/拼箱服务入口保持当前语言。
- 印度、巴基斯坦、孟加拉互相连接；没有新建或链接不存在的南亚总览。
- 保留各国正文、媒体、既有链接和地区地图/案例。未使用新的社媒素材。
- 内链区增加锚点滚动留白，避免固定页头遮挡标题。

## 变更文件

新增 `src/features/freight/FreightRelatedLinks.tsx`；修改 `country-editorial.css`、RegionContent、CentralAsiaOverviewContent、UsedGoodsContent、MarketFreightContent、MarketLocalizedContent、BrazilCountryContent、BrazilPortugueseContent、InternationalCountryContent、MexicoContent、UaeContent、GulfFreightPage；三个 legacy 国家模板（latin-america / central-asia / middle-east）接入组件；静态生成器补上西语巴西分支。

## 验证

- TypeScript 与 diff whitespace 检查通过。
- 最终完整预览构建：836 HTML，815 sitemap URL，0 failures。
- 208 静态页面检查：内链区唯一、H1 唯一、目标存在、父级和兄弟国家链接完整、没有自链或新增重复链接；原正文/媒体/旧链接逐项保持。
- 64 次地区浏览器版面检查（4 地区 × 8 语言 × 桌面/手机）：无横向溢出，首屏纸白色一致。
- 44 次国家浏览器版面检查（22 国家中文 × 桌面/手机）：内链区和 H1 唯一，无横向溢出；另截图检查阿语尼日利亚 RTL 手机布局。
- 实际点击：葡语巴西 → 拉美 → 秘鲁；中文中亚选择器 → 乌兹别克斯坦 → 中亚。未提交询价。
- 24 货运服务多语回归、16 尼日利亚/秘鲁静态回归通过。
- 搜索意图审计：683 pass、127 context-only、5 review；5 项为既有手机膜比较页，未宣称全站全部通过。
- 预览沿用同日已审阅的 47 篇 CMS 快照，未重新同步 CMS；构建后恢复源码生成文件，未把临时数据及 sitemap 变化提交。

## 证据与预览

证据目录：`/Users/huangyangming/Documents/New project/outputs/freight-regional-links-20261027/`，含 build/types/regression/search-intent 日志、208 静态检查、64+44 浏览器检查、截图与 patch。

最终冻结产物：`/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-0YlDRA/dist`。

- http://127.0.0.1:4225/zh-cn/shipping-from-china-to-latin-america/?ddnz_test=1
- http://127.0.0.1:4225/zh-cn/shipping-from-china-to-central-asia/?ddnz_test=1
- http://127.0.0.1:4225/zh-cn/shipping-from-china-to-india/?ddnz_test=1#freight-related-routes

## 下一步

用户审阅本批预览；之后继续未深化的国家内容及素材缺口。没有新发布授权，本地验证不代表已上线。
