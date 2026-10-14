# 第十二轮：公开页面WhatsApp浮标统一覆盖

基线60356fcb4abd77d806d88133ec7432541696ccb7，第十一轮全球地图完整保留。开批核对远程main b4156a7938672a7ebf3130285cc9d3e135a64880、最新成功部署38456135838未变化。仅本地实现与验证；没有push/PR/发布/发送消息。

## 原因与实现

原WhatsAppFloat由16个页面文件各自挂载，首页及多类产品/内容页面没有挂载。App公共Router内统一一个实例，清理旧挂载点（previous-mounts.json）。/content-ops与/design-preview内部页面排除。覆盖所有通过App呈现的公开页面；浮标需要客户端脚本，静态无JS内容不新增不可用按钮。

保留号码85261077362、buildAttributedWhatsAppUrl/readAttribution及floating_button归因。既有en/es/ar/pt/tr预填不变，新增zh/ru/fr消息、aria与title。按钮标记data-analytics-tracked防全局追踪器重复计数，window.open明确noopener,noreferrer。保留标准绿色WhatsApp气泡电话图标，不擅选头像，不作在线或响应时间承诺，移除无必要脉冲动画。

右侧56×56按钮保留键盘焦点与安全区。测量Cookie banner、电源手机固定操作条、厨房浮动清单/提示实际高度并置于其上16px；返回顶部随clearance上移。Cookie偏好弹窗及手机输入聚焦时避让；原手机询价区可见时隐藏浮动快捷控件规则保留，离开该区域恢复，不是挂载缺失。观察器随路由清理，未改后端或表单字段。

变更包括App、WhatsAppFloat、CookieConsent两个data标记、ScrollToTop标记、index.css和16处旧挂载清理；无国家正文/地图/产品数据改动。

## 验证

最终预览JsUm7C/index-B_DtiFh6.js，http://127.0.0.1:4187/zh-cn/?ddnz_test=1，stage /var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-JsUm7C/dist。

- 八语首页按钮唯一、aria、键盘一次触发、号码/语言/归因链接通过；window.open被测试拦截，不发送消息。browser-results.json前8项为完整链接证据，其后6项为早期布局检查；早期home-*-390截图部分是加载骨架，不用作视觉验收。
- layout-results.json最终21/21：9类页面×390/1082，等待真实正文后浮标唯一/可见或按手机询价规则隐藏、边界与遮挡检查；2类内部路由排除；Cookie手机避让。正常截图route-0-390.png、route-0-1082.png、cookie-390.png及route-1…8对应脚本中的路由表。自动化初次抢在懒加载正文前检查失败，修正等待条件后通过，无产品故障未解决。
- analytics-check.mjs以全部本地响应模拟生产域名，阻断所有外部请求：一次真实按钮点击仅1条whatsapp_click(cta_location=floating_button)+1次被拦截open；0真实生产请求、3外部请求中止。只证明隔离场景事件去重，不声称生产统计验证。
- 内容独立ZH首页/冰箱/国家/询价390与1440、8语首页390通过；电源底部操作条与浮标16px间距、输入聚焦隐藏/失焦恢复、Cookie偏好弹窗隐藏/关闭恢复通过。未外发。
- lint、analytics-policy与analytics-runtime检查、build通过；754HTML/733sitemap/0失败。734页面main字节相同，sitemap字节相同；搜索意图610/117/6保持。最终提交只另清理删除挂载后的空白行，不影响预览代码行为。

原六组未跟踪生产/审计证据保留。头像需用户指定真实照片后再做；当前标准图标已交付。发布授权、实际部署与上线效果验证均未执行。
