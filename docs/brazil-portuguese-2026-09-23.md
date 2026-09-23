# 巴西葡萄牙语页面补齐

本地独立 URL：`/pt/shipping-from-china-to-brazil/`。页面语言标记为 `pt-BR`，不再跳转到英文巴西页。尚未发布线上。

完成内容：
- 葡语正文覆盖海运 FCL/LCL、空运、中国供应商集货、Santos/圣保罗交接、单据与责任、食品加工设备和混合货物运输。
- 6 个葡语问答覆盖运价构成、时效、多个供应商、进口主体与 NCM、费用边界、食品加工机械进口。
- 核心主题：frete da China para o Brasil；中尾：frete marítimo / carga consolidada / frete aéreo；长尾由实际问答承接，例如 quanto custa o frete da China para o Brasil、consolidar pedidos de vários fornecedores chineses、importar máquinas de processamento de alimentos da China。未测量搜索量。
- Title、description、canonical、静态正文、HTML `pt-BR`、7 种语言相互 hreflang（其中葡语为 `pt-BR`）及 sitemap 已配套。
- 葡语页脚增加巴西入口；巴西页语言切换提供葡语，其他未翻译目的国仍回退到现有语言版本。
- 询价按钮进入葡语表单，保留 `leadGoal=Freight Export`、`dest=Brasil` 和来源标记。浏览器验证第二步实际显示 Brasil；未发送询盘。
- 补充葡语询价页中的海运/空运/陆运/仓储标签和采购协助说明；页脚“equipa/Contacto”改为巴西常用“equipe/Contato”。

关于进口要求，只建议按具体产品和操作核对，并提供 [Siscomex 官方指引](https://www.gov.br/siscomex/pt-br/informacoes/tratamento-administrativos/tratamento-administrativo-na-importacao)；没有编造统一税率、固定班期、包税或无条件清关承诺。

验证：TypeScript 通过；相关自动测试 16/16 通过；完整预览构建成功，333 个 sitemap 页面和 347 个 HTML 文件，SEO/部署检查 0 失败。7 个巴西语言版本的 hreflang 集合一致；葡语页一个 H1、内部页面链接有效，浏览器确认 `pt-BR` 和 canonical。搜索意图检查为 271 pass、62 context-only、0 review。

当前只补齐巴西运输页与入口，不代表食品加工设备目录或其他国家已全部翻译成葡语。目录链接在葡语正文中明确标为英文。
