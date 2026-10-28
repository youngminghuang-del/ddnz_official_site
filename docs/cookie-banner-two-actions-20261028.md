# Cookie 首层双按钮预览（2026-10-28）

用户参考截图要求首次提示不直接显示拒绝按钮，仅保留接受全部和设置。只修改CookieConsent.tsx：首层移除拒绝按钮，手机两按钮并排；设置面板保留拒绝/接受全部/保存偏好。手机长语言设置操作按钮原先有负left裁切，修为自动换行及不压缩，最小高度44px。没有改变默认同意、统计调用、持久化处理或国家页内容。

验证：类型检查、analytics policy/runtime通过；836HTML/815sitemap/0构建失败。八语360px首次提示均2按钮，设置内3操作完整可见；实际拒绝后刷新tracking=false、接受全部后刷新=true、自定义关闭并保存后刷新=false。桌面1440px中文两按钮预览已截图。208线路main正文逐字节同4231，sitemap相同。搜索意图保留683pass/127context/5既有review。

最新main/CMS和正式构建完成记录见freight-final-build-20261028.md；本次是在该基线上使用同一最新47篇CMS快照重建预览，前轮正式构建和392测试不冒称包含本UI补丁。本次类型/构建/分析守卫与八语交互专项已完成。统计与拒绝逻辑未改，不声称新增法律合规认证。

证据：outputs/freight-cookie-preview-20261028/含八语修正前后按钮边界、偏好交互、手机设置、桌面/手机banner截图及日志。

最新预览：http://127.0.0.1:4232/zh-cn/shipping-from-china-to-central-asia/?ddnz_test=1 ，冻结ddnz-preview-eqpHLq/dist，旧4231保留。Cookie组件为全站共享，将加入当前待发布清单。未推送、无PR、未部署；待用户审阅。
