# Formspree真实接收核对 · 2026-10-30

网站候选仍4eb55a4，4275预览保留，未发布。本轮没有网站实现修改；仅记录一个受控测试及接收证据。

## 实际操作与结果

用户提供Chrome已登录Formspree mdabvqbd后台。浏览器扩展连接不可用，改用Chrome原生界面操作，未读取Cookie、未接管后台API。核对到DDNZ_RFQ表单与Submission Archive已启用，现有工作流配置每次提交的业务邮件通知；未修改设置、未启用付费API、未购买升级。

只发送1条合成测试：DDNZ-QA-20261030-A，保留域名qa-test@example.com，明确“测试，请勿报价、订舱或联系测试地址”。使用候选八语本地提交验收中的真实中文字段对象，仅替换合成联系人并在message加测试前缀，经独立本机临时标准HTML表单POST到同一生产端点。测试页与原始数据均不进入网站/dist；没有解除候选站的本机不外发保护，也未将未发布页面冒称线上提交。

提交返回Formspree Thanks / The form was submitted successfully。进一步在后台Spam分类找到了实际存档，submission ID **166969253**，界面显示Oct 30, 2026, 15:24。不是仅依赖成功响应作结论。

- message与预期测试payload逐字一致，中文与换行完整，无截断。
- 公开参考号FCL26Q4-0128、南沙→特马、40HQ、Sea、ghana_country来源正确。
- 9项到门字段（交付方式、邮编、地址/城市、货值、币种、HS、进口主体、缴税凭证、卸货）均按客户未知值保存“待确认”，未误写已确认承接。
- 其他非空核心字段name/email/Origin/Destination/Selected_Service/Lead_Source/Lead_Goal/Inquiry_Type/Weight_Status/Volume_Status与预期一致。字段仍使用既有message通道。

## 不能据此认定的部分

该合成测试在**Spam**，未出现在正常Inbox。未找到证据证明正常业务通知邮件已经进入实际邮箱，不能把后台存档等同邮件送达，也不能仅凭这条合成测试判断所有正常客户询价被误拦截。没有修改Formshield、放行规则、CAPTCHA或把测试移出Spam来制造通过结论，未重复发测试单。

正常非Spam接收及业务邮箱通知仍需受控复核；新候选部署后的真实页面发送与成功/失败体验也必须等明确发布指示后检查。HB事实、案例与母语人工审校继续待核。

## 证据

- receipt-check.json：单次发送与后台接收状态，归类Spam，邮件未验证。
- expected-payload.json：本次合成测试预期字段。
- received-detail.txt：仅截取本次测试详情，不存其他客户提交正文；文本比对通过。
- received-message-fields.png、received-spam-detail.png：真实Chrome后台截图。

后台搜索功能要求升级，未升级；直接通过分类查看单条测试。后台曾加载停滞，重新开同一登录会话的只读标签后恢复；过程中未重发测试。
