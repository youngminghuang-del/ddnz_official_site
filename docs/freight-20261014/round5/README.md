# 第五轮：货物参考图片与紧凑图文

2026-10-14，沿用11d780e1fee191b1a4e5f000c143680f194500eb与原独立检出/分支。仅Qatar/Oman ENAR四页。开始时main仍b4156a7938672a7ebf3130285cc9d3e135a64880，最新成功部署/CMS38456135838。原6组未跟踪证据保留。

## 最终可审阅预览

4187四个原URL；stage `/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-6OQHgi/dist`，入口`index-BGa-L5Qi.js`，样板`GulfFreightPage-CcmWZokQ.js`（gzip27.72kB）。未push、PR、部署或真实提交询价。

## 实际变化

- Qatar供应商模块加入一张Via Trading帽饰产品参考图，替代旧960px说明图。正文清单及起运/目的国货运意图保留；图片不作为中国供货、该询盘订单或HB实绩证明。
- Oman包装模块加入Rebul台球桌主图、运输箱辅助图，替代旧纯包装尺寸图。原规划情景、每件外尺寸/毛重/堆叠/操作要求保留。箱的材质未证实，不称木箱；不把一张桌参考照片写成六桌装运记录。
- 三图共86,524bytes，保持来源原字节和原宽高（1014×676、925×616、473×514）；lazy/async解码、响应式CSS、object-fit:contain。小运输箱图单独限制≤236CSSpx，实际390px页更小；不放大或裁切，不重复隐藏加载DOM。不需要衍生大图或额外图片库。
- 短图注为产品/包装reference及ENAR准确alt，附简短来源链接。无AI/版权大段前台说明。外部参考与原China-origin记录分开，不套HB实拍身份。
- Oman交接旧大幅说明图改为紧凑4责任清单：配送至约定地址、卸货、室内搬运、安装；各项范围/责任方另行确认，原正文拆包等约定仍保留。没有完成勾或自动包含服务的暗示。
- 首个模块自然DOM顺序为标题简介→图片组→4行详细清单→收尾说明。手机直接按此阅读，桌面CSS grid保持两栏。总控初审发现中间版图片过晚，最终重排已解决，只有一份图像DOM。
- 局部缩小上下padding。实际360px首模块Qatar比前轮短125px；Oman因增加两张图长184px，因此不宣称所有首段都变短；Oman后段大型交接图另已压缩为清单。1536px首模块两国均缩短27–38px。具体测量见layout-height-comparison.json。

改动文件：GulfFreightPage.tsx、gulf-stories.css；新增GulfCargoReferences.tsx、gulfCargoReferences.json、GulfDeliveryChecklist.tsx；public/media/freight-20261014-round5/三张webp。没有修改RFQ、地图、章节导航、旅程、官方资源、CMS、依赖、路由或其他六语。旧说明图原文件仍保留归档，四页不再加载。

## 素材与过程状态

素材任务先遇跨任务授权与Chrome连接问题；其后收到用户直接Google找图授权，完成两项Google图片搜索、原页核对与6候选目视。实际采用3张原图，来源/哈希/尺寸/适用范围见source/media-manifest.json。旧3张一般操作候选不用于替代特定货物。候选素材manifest.json、素材状态.md和preliminary材料为历史过程记录，当前已解除阻塞。

本轮范围仅已授权本地预览。未核实独立发布许可或开放许可，不将本地预览等同发布准备已齐；来源范围记录内部，前台不堆叠授权说明。

## 验证

- lint及最终build:preview通过，754HTML、733sitemap、0failures。未重复无改动RFQ全套或320项测试。
- 静态四页：H1、canonical、9alternates、货运意图、媒体/字幕、公开来源、RFQ入口与静态CSS；3新图原hash/准确caption-alt/旧explainer不再加载；原12媒体hash、CMS SHA及733URL保护通过。
- 初版8NgE3n/index-DuxgfbvH：20组合，4页×360/390/430/1110/1536，真实图片加载、lazy/alt/尺寸、无横溢、4章/5旅程/地图/2官方卡以及Oman4项清单通过，0page errors。layout-results.json保留该阶段记录。
- 最终6OQHgi/index-BGa-L5Qi：12组合，4页×360/390/1536，标题简介→图→清单的自然DOM与视觉顺序、单份图像、真实加载、桌面两栏、4行信息、箱图≤236px、无溢出通过，0page errors。order-results.json为最终图片与顺序检查。
- 最终四页390px原导航保护：4个锚点键盘/焦点/激活/固定顶栏避让，地图不镜像、小图尺寸通过。9项地图/导航/旅程/官方资源/正文源文件与第四轮SHA逐项一致。外部请求全部阻断，0真实提交。
- search-intent：610pass/117context-only/6review，与基线相同，不重做既有手机膜问题。
- 总控最终手机/桌面截图复核无返工。内容组独立390×844四页最终复核通过，绑定6OQHgi/index-BGa-L5Qi，见内容组集成复核.md。

证据：static-results.json、layout-results.json、order-results.json、protection-results.json、source-sha256.json、build/lint/search-intent日志。screenshots/final-*为最终12组合24张图；其他无final前缀为初版，preliminary-*为无图片准备阶段。旧图不作为最终排序证据。

## 未完成与下一步

没有发布、效果验证、当地货物交付实拍或阿语母语审校。其他六语F13、其他路线业务事实F08、后台/CRM/分析F04仍未完成。外图是产品/包装参考，后续若获得对应实际包装照片和逐件数据，可用实物需求替换参考例；任何发布范围由总控结合用户授权另定。
