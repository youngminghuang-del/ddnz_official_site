# 第十一轮：首页全球参考地图

基线e9fe6d7008725e6caf25eb08cc338bea8abe4570。本轮只更改八语首页地图；原国家页和区域地图保持。核对远程main b4156a7938672a7ebf3130285cc9d3e135a64880、成功部署38456135838，线上中文入口index-DtHSJ0sE.js。本轮未push、PR、部署或真实提交询价。

## 实现

新增WorldFreightMap.tsx、world-freight-map.css、worldFreightCopy.json、worldFreightNodes.json；FreightRouteMap world入口切至独立组件，旧区域节点/路线/投影/CSS未改。index.css加载独立前缀样式。render-country-pages.tsx补八语首页静态输出，避免仅JS浏览可见。

采用现有world-atlas/Natural Earth真实地理与d3 Mercator矩形视图，裁去极地大部；浅米灰陆地、淡蓝海洋、细国界与品牌紫方向线。并非Google底图，无新增收费API或地图网络请求。保留Natural Earth来源入口。7区域、12参考港口/城市：中东、中亚、欧洲、北美、拉美、非洲、大洋洲。默认每区1条淡弧线，选区只显示对应1–2条；曲线是投影平面上的方向示意，不是航道、船期或服务承诺。

区域按钮原生键盘可操作，aria-pressed表示状态；12编号与目的地列表对应，手机徽标加大、欧洲和澳洲分开放置并加引线。地图地理不随RTL镜像；阿语文字/卡片RTL，地名对齐独立调整。标题说明紧凑置顶，移除原门户长列表和地理核验标签。

节点经内容组查证/沿用基线，精度区别见节点来源与接入说明.md。Khorgos为中国侧城市参考，向Kazakhstan询价不把城市划归哈国。Jebel Ali坐标沿旧基线，官方仅核名，不声称本轮精确坐标验证。其余城市点不等于具体码头。

所有节点用现有buildQuoteHref、合法source=homepage_v2_freight、Freight Export意图进入同语询价。既有quoteLinkPolicy将目的地交接保存本地，href无参数；未创建新国家URL，未改字段、事件或提交后端。

## 验证与阶段

- lint与build通过：754HTML、733sitemap、0失败；9项quote-link-policy测试通过；search-intent 610通过/117上下文/6历史待审，未变化。
- OujFKf阶段32组合：8语×390/745/1082/1440，8个区域键盘状态、按钮≥44px、地图/卡片/同语链接、无横向溢出通过。browser-results.json为该阶段32记录；随后仅标注位置与RTL对齐改变，不重复全量交互。
- 最终AcN5Ax/index-Gqk9PUJ7.js：8语1082及AR390/745，20张全览/北美图，DOM检查全部可见区域/城市/origin文字与编号徽标不碰撞；final-results.json记录实际结果。
- 最终20次真实询价交接：八语北美首节点及全部12节点英文实际点击、选择海运后目的地预填正确；没有个人信息输入或提交。
- 最终静态：726个其他main字节相同，仅8首页主体变化；sitemap字节相同。国家页/区域地图及既有媒体没有改写。
- 内容独立64筛选状态、8语390、AR阿联酋及ZH霍尔果斯→哈萨克斯坦实际交接；各阶段与最终差异回执见内容独立复核.md。不等于母语专业审校。

初版Python预览曾出现动态模块加载失败，文件实际存在且HTTP200；改用Vite preview后检查无该失败，未据此修改网站加载逻辑。初版手机欧洲编号过近、长标签压徽标已修正。截图前blur移除键盘焦点残留，未移除网站跳转主要内容功能。

最终预览http://127.0.0.1:4187/zh-cn/?ddnz_test=1，stage /var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-AcN5Ax/dist。本地成果待总控交付审阅；未发布、未验证线上效果。
