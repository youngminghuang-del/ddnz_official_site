# 四国二手货案例接入 — 2026-10-15

状态：代码完成，本地构建及布局核查完成，兼容转码与内嵌播放抽查完成；未提交PR、未发布。

## 变更
- 加纳现有货运页改为实货案例；新增印度、孟加拉、巴基斯坦国家货运路由，共32个八语版本。
- 新增UsedGoodsContent/Page、usedGoodsCopy.json、usedGoodsMaps.json、used-goods.css；App、siteNavigation、generate-static-pages、quoteLinkEnums接入。
- 媒体在public/media/used-goods-20261015：四张装柜图、分拣/打包/货包/搬运视频、八语说明字幕、官方logo。仓内视频保留备用；来访及明显车牌图不公开。
- 四卡章节导航、真实国家轮廓地图、官方机构资源、同语四国互链、询价目的国带入。
- 80kg/包与28吨/40HQ均含包装；28吨不含箱体自重；约350包仅历史衣鞋参考，箱包另核。

## 已验证
- npm run lint通过；build:preview通过，757 sitemap页，778HTML，部署文件审计零失败。
- 32版本静态检查：单H1、媒体/字幕、资源存在、地图、quote context、hreflang、样式。
- 搜索意图初筛：本批32版本pass；全站634pass/117context-only/6review，不能等同搜索排名或人工语言验收。
- CUA目视：390中文加纳，745英文印度，1440英文孟加拉，390阿语巴基斯坦；无横向溢出，四卡导航、固定头部避让、官方logo加载正常。
- 印度询价入口→Sea→第二步实测destination=India，未提交表单。

## 尚待
- 原Main-profile视频在IAB触发renderer崩溃；改用Baseline3.1后sorting直接播放完整32.1667秒，页面内嵌播放readyState4/currentTime30.34秒且中文字幕可见。其余4条已统一Baseline3.1；全部5段首中尾解码15次通过。Safari原始黑屏测试未通过，不声称Safari端已验收。
- 图库第二张实测切换到loading-1.jpg，aria-pressed对应更新。
- 桌面竖视频布局改为居中、图注在下，避免短图注旁产生整列空白。
- 本轮没有PR/部署证据，不得标为上线。

预览：http://127.0.0.1:4191/zh-cn/shipping-from-china-to-ghana/?ddnz_test=1


## 2026-10-15 视觉细节第二轮（本地验证，未发布）
- UsedGoodsContent.tsx / used-goods.css：四国独立首屏实拍、不同场景图库，手机上下排列，完整图库保留原图入口。加纳装柜、印度打包、孟加拉仓内货包、巴基斯坦搬运装载。
- UsedGoodsPortMap.tsx / usedGoodsPortMaps.json / used-goods-port-map.css / UsedGoodsPage.tsx：每国两港坐标标记、分离标签、Google Maps与官方入口，八语。港区参考不声称实际案例走港。
- public/media/used-goods-20261015/*-clear.jpg 与缩略图：原MOV重新选5帧；来源、时间、尺寸见clear-frame-selection.json；港口来源见port-reference-sources.json。
- npm run build:preview通过（778 HTML / 757 sitemap / failures 0）；npm run lint通过；audit:search-intent通过运行，634 pass / 117 context-only / 6 review（全站既有项）。detail-checks.json记录32语言/国家组合的资源、hero和双港链接检查均通过。
- CUA目视：1403桌面加纳首屏，693孟加拉双港地图，390印度首屏与阿语巴基斯坦；无横向溢出。首屏图片说明对比度已修正。Safari视频专项仍未完成，本轮未改视频。
- 预览 http://127.0.0.1:4191/zh-cn/shipping-from-china-to-bangladesh/?ddnz_test=1 。未新建PR、未部署；下一步为用户视觉复核及Safari专项验证。


### 2026-10-15 视频区域响应式排版修正
用户反馈桌面竖版视频两侧空白过大。UsedGoodsContent.tsx将第一节全部说明归组，used-goods.css在>900px采用说明+视频两栏顶端对齐；<=900px单栏文字后接视频，视频完整contain、最大高度500px。四国八语共用。build:preview通过（778HTML/757sitemap/0失败）、TypeScript通过；search-intent结果保持634 pass/117 context-only/6 review。CUA检查1403中文桌面、390手机视频完整显示无横向溢出、745法语长文案单栏。预览4191，未PR/未部署；Safari专项仍待验证。


### 2026-10-15 发布准备验收
Safari原生验证：sorting.mp4播放至32秒结束且画面可见；孟加拉页面内cargo.mp4点击播放、中文字幕显示，播放至13秒结束。此前Safari未验证项已完成代表性直连与内嵌测试，不声称所有设备覆盖。
独立发布分支codex/used-goods-four-countries-20261015基于最新main 6288b51，保留PR69印尼文章。集成build:preview、tsc、Notion路由与发布防护、analytics policy/runtime、24 freight+16 market已有页回归和搜索意图审计通过。原工程339测试通过。未发布。
