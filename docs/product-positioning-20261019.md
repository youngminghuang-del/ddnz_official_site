# 首页与About产品定位预览

日期：2026-10-19。用户先确认“DDNZ以产品供货、制造与出口为主角，HB执行国际运输”的调整顺序，再指示“开始”。本轮交付范围为EN/ZH首页与About可审阅预览。

## 基线与范围

远端main只读核对：c24c388d7ea805611180c5727f4e9d72fec8d6e8。工作目录ddnz-freight-depth-20261019，分支codex/freight-depth-20261019，尚无本轮提交、PR或部署。保留前两轮四国货运页及45HC成果，本轮未覆盖其素材和内容。

使用用户已确认的文案简报：目标客户为海外进口商、批发商与经销商；主行动是产品批发报价，次行动为目录；已有供应商及纯运输需求仍可进入独立流程。没有重新要求用户确认已批准的方向。

## 实现

- Homepage hero：EN “Products from China. Ready for your market.”，ZH“中国产品供货，面向您的市场。”。产品规格/OEM/包装/质量与出口信息，以及批发报价、产品目录和产品团队WhatsApp入口。
- 六个既有目录入口：手机配件、餐厨、食品机械、户外电源、便携空调、音响。食品机械的中文卡明确指向英文目录；没有新增空目录或虚构车型页。
- 原双品牌并列桥接区改为DDNZ产品供货、OEM订单准备、质量与出口三项内容；保留真实办公入口照片、旧company-identity锚点，并用较小区域呈现Heaven Born运输执行。
- 首页下方流程、首条FAQ、最终转化区、该两页导航/页脚CTA同步产品主线。内部Product Sourcing等表单枚举及统计契约保留。
- About首屏、供货模式、企业介绍、报价准备检查项与联系CTA调整；注册主体/日期、实际音响与装柜案例保留。DDNZ卡与HB卡仍分别展示真实公司资料，视觉层级区分主业务和运输伙伴。
- EN/ZH title、description、Organization说明与静态内容同步。其余六语保持既有首页版式，等待主文案审阅后本地化。
- 客户端与静态首页共用新版主体；静态渲染补入相同的下方流程与转化内容。新CSS纳入主入口样式，避免JS加载前缺样式。

主要变更文件：
- src/features/product-positioning/ProductSupply.tsx、product-supply.css（新）
- src/components/SourcingHomepageHero.tsx、HomeOneTeamBridge.tsx、SourcingHomepageNav.tsx、Footer.tsx、SchemaMarkup.tsx
- src/features/search-intent/positioning.mjs；src/features/company-identity/aboutCopy.ts、copy.ts
- src/pages/Home.tsx、About.tsx；src/data/homeV2Copy.ts、homeFaqData.ts、seoTitleOverrides.json
- src/main.tsx、scripts/render-country-pages.tsx

## 事实范围

使用现有产品和真实企业/团队记录；工贸结合与合作制造商按既有资料表述。本轮不把附件里全品类“自有生产线”、全部认证、15–30%降本、统一MOQ、统一质保或示例型号当已确认事实。HB从业经验始于1997，不等于HB公司成立于1997。没有新增未经证实的生产规模、销量或出口覆盖保证。

电动车独立目录、全站导航重排、各产品详情深化、其他六语以及全站询价文案重构继续属于下一阶段；不能把本轮首页/About预览标成全站定位已完成。

## 检查

- npm run lint通过。
- 完整build:preview通过：778 HTML /757 sitemap URLs /21显式产物 /0失败。最新暂存ddnz-preview-TMe9Dj。
- 四个EN/ZH静态页面各一个H1、新产品CSS及HB角色说明存在；两个首页六产品卡与新版下方转化区存在。其他六语未误入新产品版式。
- 首页/About中英×390/745/1440共12组检查：无水平溢出、单H1；首页6产品入口。图片和布局目视检查中文手机首页、中文桌面首页/About。
- 主按钮滚动并聚焦产品报价选择；提交入口进入产品需求第一步。已有供应商选项进入验货与集货需求；纯货运进入运输报价。只验证交接，未提交真实询盘，不冒称全表单重新验收。
- 搜索意图初筛：634 pass /117 context-only /6既有屏幕保护膜compare review。未新增待复核项；自动检查不代表搜索量、排名或母语审校。
- git diff --check通过。

预览：
- http://127.0.0.1:4193/zh-cn/?ddnz_test=1
- http://127.0.0.1:4193/?ddnz_test=1
- http://127.0.0.1:4193/zh-cn/about/?ddnz_test=1
- http://127.0.0.1:4193/about/?ddnz_test=1

截图与JSON检查：工作区outputs/product-positioning-20261019/。未发布。下一步收敛主文案与视觉，再推进全局导航、产品页和其余语言；当前采购表单的内页文案仍为原版，不能视为全站角色切换完成。


## 2026-10-19 制造与出口定位纠偏
用户指出上一版仍偏采购代理。该意见成立：不能以个别规格/认证需核对为由，把已确认的制造商/出口商身份降为供货协调。

- 首页EN/ZH H1改为“Factory-direct products. Shipped worldwide.”/“工厂直供，出口全球。”；介绍明确“我们制造并出口”，工贸一体、OEM/ODM、生产质量和出口为主线，询盘首选工厂报价。
- About首屏、制造能力、企业介绍、页脚、SEO/Organization同步；Logo文字在这四页改MANUFACTURING & EXPORT。首页移除EN/ZH供应商评分大块，保留真实产品、现场和装柜记录；工厂报价步骤链接回报价简报。Partners报价入口同步。
- 本轮修改主要位于ProductSupply.tsx、positioning.mjs、SourcingHomepageHero/Nav、Footer、SchemaMarkup、Partners、HomeV2Preview/Home、homeV2Copy、seoTitleOverrides、company-identity三份文案/CompanyStrength；此前四国未提交成果保留。
- 沿用本轮此前核对main c24c388d基线；本次未再次核对远端或声称线上更新。
- 验证：npm run lint、build:preview通过，778HTML/757sitemap/0失败；采购意图634pass/117context/6既有review；浏览器四页×390/745/1440共12组无横溢且单H1，确认供应商评分块已移出首页。最新静态构建ddnz-preview-P3l6oP。
- 证据：outputs/product-positioning-20261019/home-manufacturing-desktop.png、home-manufacturing-mobile.png、manufacturing-responsive-checks.json。预览4193；无提交/PR/部署。
- 待做：全局导航功能及产品内页、其余六语继续按制造与出口主线推进；电动车尚未补独立目录/真实产品素材，不把已有音响目录冒充电动车。截图里的统一认证、所有品类自有工厂、固定节省比例和空调示例参数未照搬。


### 七类业务口径与首页重复模块评估
用户明确首屏七类：商用餐厨设备、食品加工机械、便携电源、家庭储能系统、电动单车、电动滑板、手机配件。已同步ProductSupply.tsx及positioning.mjs中英首屏/摘要。lint、build:preview通过（ddnz-preview-3fWGKD，778HTML/757sitemap/0失败）；意图634/117/6既有review。未发布。用户随后指出主营产品区与ProductDiscoveryLinks重复，建议保留一个产品总览、细分入口并入对应卡片；当前仅分析建议，尚未实施合并。主营产品卡仍待按七类整理，新增类目不沿用不相关图片或虚构目录链接。


### 2026-10-19 七类产品入口合并完成
用户确认电动滑板车为electric scooter。ProductSupply.tsx与positioning.mjs首屏同步更正；SourcingHomepageHero撤下EN/ZH旧ProductDiscoveryLinks，仅留七类主营区。设备目录/利润工具、电源选型、手机壳/保护膜/挂绳并入对应卡片。CSS桌面4+3、平板双列、手机单列。家庭储能/电动单车/电动滑板车缺已整理图片，用图标和现有报价入口，待补产品图与目录。
验证lint/build:preview通过，ddnz-preview-lYfldM，778HTML/757sitemap/0失败；意图634pass/117context/6既有review。中英×390/745/1440共6组均7卡、无重复旧区、无横溢。证据outputs/product-positioning-20261019/merged-product-checks.json、merged-products-desktop.png。未发送询盘。无PR/部署，4193预览。全局导航与表单仍有旧分类，未声称全站同步。


## 2026-10-20 Alibaba分批第一批：主站滑板车目录与全局入口
用户提供alibaba目录，允许分批先做新版本，并询问导航/Google影响。45份835页逐页全文提取与分类完成，不等于所有图片/规格已核对。清单：outputs/alibaba-catalogue-20261020/资料批次清单.csv；分批安排与证据：分批计划与第一批验收.md。
第一批已将之前验收五款38图接入主站英文/中文 /sourcing/electric-scooters-from-china/；成人、儿童和平衡车分别筛选，单款询价传递目录代码，图库保留细节。首页实图入口、产品总目录入口、中英文全局菜单及页脚同步。储能/单车目录仍待下一批，菜单暂指向首页对应模块；不建空页。其他既有采购、户外、音响、货运国家地区URL与入口保留。
本批变更文件：src/features/electric-mobility/ElectricScootersPage.tsx、src/features/electric-mobility/ScooterCatalogueEntry.tsx、src/features/electric-mobility/electric-mobility.css、src/features/electric-mobility/catalogue.json、public/images/electric-mobility/、src/App.tsx、src/lib/productLanguageRouting.ts、src/lib/productLocalization.mjs、src/features/product-positioning/ProductSupply.tsx、src/components/SourcingHomepageNav.tsx、src/components/Footer.tsx、src/pages/product-showcase/ProductsIndex.jsx、src/features/overview/LocalizedOverviewContent.tsx、scripts/generate-static-pages.ts、scripts/render-country-pages.tsx、scripts/prerender-core-pages.mjs、scripts/check-core-prerender.mjs
验证：类型通过；build:preview 780 HTML/759 sitemap/0失败；58核心SSR检查通过；搜索意图636 pass/117 context-only/6既有review，两新页pass。静态canonical/hreflang/一H1/五卡/首页及产品总目录内链/询价上下文已核对。中文1440、中文及英文390无横溢；手机导航、分类、大图、中英同页切换、SC-K01填入表单已验证，未提交。截图与static-checks.json保存outputs/alibaba-catalogue-20261020/。
预览4195，最终dist=/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-CzzR4j/dist。原4193、4194保留。本轮未PR、未部署。工作区原未提交成果保留。
基线HEAD c24c388；远端main a523455（PR75家庭储能文章）已只读核对。正式发布前仍需同步最新main/CMS差异，不能用本地旧基线覆盖线上新文章。
下一批：储能3份→单车6份→便携电源8份→滑板车增补；燃油ATV/越野摩托、三轮四轮、轮椅、露营推车和零部件先独立评估，不混同主营产品。
Google：导航和内链会影响站点结构/相对重要性的理解；此次不更换旧URL，以可抓取链接、静态正文和准确语言关系承接新增产品，不承诺即时增量或零波动。官方来源见分批验收文件。


## 2026-10-20 五类产品导航调整与验收
按用户确认将产品目录整理为商用餐厨设备、食品加工机械、能源与户外设备、电动出行与运输、消费电子与配件五组，八种语言统一层级。能源下分便携电源/太阳能、家庭储能、便携空调、车载冰箱及原户外总览；电动出行区分单车、成人/儿童滑板车、平衡车；消费电子保留手机配件与音响。已有URL保留，尚未制作的储能/单车目录仍用现有首页模块或相应语言询价入口。
变更文件：src/components/ProductDirectoryMenu.tsx（新增）、src/components/SourcingHomepageNav.tsx。桌面680px分组菜单、展开内容两列；手机逐级手风琴；键盘仅聚焦可见项；产品链接保留在初始HTML。
检查：lint通过；build:preview 780 HTML/759 sitemap/0失败；58核心SSR检查通过；八语首页均5组且初始HTML链接存在；搜索意图636 pass/117 context-only/6既有review。浏览器390px实测无横溢、顶层仅展开一组、子类展开及成人车型锚点跳转正常，跳转后菜单关闭；桌面1440px视觉检查通过。
预览：http://127.0.0.1:4195/zh-cn/?ddnz_test=1 。最终静态构建ddnz-preview-inMCfn/dist。证据：outputs/alibaba-catalogue-20261020/directory-desktop.png、directory-mobile.png、directory-static-checks.json。本批无PR、未部署；原工作区成果保留。发布前仍需同步最新main/CMS，不能由旧基线覆盖线上新文章。
下一批：家庭储能三份资料已整理制作前核对JSON（容量单位、净毛重及型号对应存在冲突），目录和图片尚未完成；随后单车与便携电源。详见家庭储能_制作前核对.json。


## 2026-10-20 导航命名与洞察页重复入口修订
用户指出选型指南被误称目录且层级多余，洞察页产品大卡片与目录重复。能源组现在直接链接准确本地化的电源选型指南与折叠太阳能板，取消这一层子展开。洞察页撤下文章之前的4张产品大卡片，8个原工具/产品链接收为文章列表后的紧凑文字区，事件保留。其他页面的ProductDiscoveryLinks不变。
变更：ProductDirectoryMenu.tsx、ProductDiscoveryLinks.tsx、InsightsHub.tsx。lint及build:preview通过，780 HTML/759 sitemap/0失败；58核心SSR检查；搜索意图636 pass/117 context-only/6既有review；8语指南直达初始HTML检查通过。中文桌面1440与手机390导航、指南跳转、文章入口顺序与无横溢通过。证据directory-refined-desktop.png、directory-refined-mobile.png、insights-refined-mobile.png、navigation-refinement-checks.json。
4195已更新到ddnz-preview-Unrekg/dist；无PR/部署。远端main只读核对仍a523455，本地HEAD c24c388，发布前同步依赖不变。家庭储能制作仍为下一批，未称完成。
Google依据：https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure 。菜单展开不是新增网页跳转；保留真实href和旧URL，不承诺排名或曝光变化。


## 2026-10-20 第二批：家庭储能目录与洞察入口合并
用户指示开始，落实上一轮确认的洞察重复模块合并，并完成家庭储能中英文目录预览。
新增 /sourcing/home-energy-storage-from-china/ 及中文页：壁挂51.2 V/100 Ah/5.12 kWh；低压48/51.2 V ×100/200/314 Ah六配置；高压3–6模块四配置。共三系列11种配置，非11个独立页面。用参数图对应尺寸、重量和容量，不把280 Ah商品选项与314 Ah图表型号合并；高压能量按单模块51.2 V/50 Ah核对，未沿用错误Ah单位或10 kg包装记录。
6张图片由内置imagegen去厂家/品牌/广告文字，保留外观、侧面接口、提手和模块扩展示意。WebP及缩略图在public/images/home-storage/，原始清理PNG在outputs/alibaba-catalogue-20261020/storage-cleaned-originals/；准确prompt和源图对应在storage-generated-assets.json；参数采用依据在家庭储能_参数采用记录.md。
页面可切换配置，同步参数、目录代码和询价描述；图库支持放大、前后翻图和键盘。导航、首页、产品总目录与页脚入口已接入；其他六语导航回退英文储能目录，不伪造未翻译页面。洞察页取消独立产品工具条，原8个链接合入对应采购问题，新增手机膜价差问题，共6个问题，八语同步；无新重复URL。
变更文件：src/features/home-storage/{HomeStoragePage.tsx,HomeStorageEntry.tsx,catalogue.json,home-storage.css}；public/images/home-storage/；src/features/electric-mobility/ElectricScootersPage.tsx（复用图库）；src/App.tsx；src/components/{ProductDirectoryMenu.tsx,SourcingHomepageNav.tsx,Footer.tsx}；src/features/product-positioning/ProductSupply.tsx；src/features/overview/LocalizedOverviewContent.tsx；src/pages/{InsightsHub.tsx,product-showcase/ProductsIndex.jsx}；src/features/search-intent/{BuyerDecisionContent.jsx,insight-product-links.mjs}；src/lib/{productLanguageRouting.ts,productLocalization.mjs}；scripts/{generate-static-pages.ts,render-country-pages.tsx,prerender-core-pages.mjs,check-core-prerender.mjs}。
检查：lint通过；build:preview 782 HTML/761 sitemap/0失败；核心SSR60页通过；搜索意图638 pass/117 context-only/6既有review。初次构建在旧58页数量断言失败，按新增两页更新到60后完整构建通过。静态检查：两语单H1、canonical、EN/ZH互链、3系列、CSS及Other询价分类；八语洞察均6问题且独立工具条撤下。浏览器：中文1440、中文/英文390无横溢；10个可切换配置的代码/规格/询价描述逐项核对；侧面细节图库翻图；最终中文壁挂询价正确预填HS-W01并选中其他产品，英文高压H6正确预填。只检查表单，无提交。首次发现默认厨房分类，已修复；储能页头制造出口品牌已同步。
预览：http://127.0.0.1:4195/zh-cn/sourcing/home-energy-storage-from-china/?ddnz_test=1 （英文去掉zh-cn）。最终dist ddnz-preview-eAMJkq/dist。证据storage-static-checks.json、storage-desktop.png、storage-desktop-config.png、storage-zh-mobile.png、storage-en-mobile.png、storage-mobile-config.png、insights-merged-mobile.png。无PR/部署，仍为已验证预览；工作区其他未提交成果保留。
本地HEAD c24c388；远端main本轮只读核对仍a523455（已发布西语储能市场文章），正式发布前仍须同步main/CMS差异，不能覆盖该文章。型号可供性、最终MOQ/价格/交期、逆变器与控制单元/底座/附件供货范围按配置询价，未用平台广告承诺代替DDNZ报价。下一批电动单车6份，其后便携电源8份与滑板车增补。


## 2026-10-20 第三批：单车目录、储能首屏与服务页视觉修订
本轮按用户批注将储能首屏改用hv-modules.webp完整模块组合图，桌面叠加半透明浅紫渐变支撑文案；1000px以下改为文案与完整图片上下排列，不将手机产品图裁成背景。采购服务总览七个本地化版本撤下深色大块，使用主站浅色丝带、深蓝文字、紫色辅助与橙色主按钮；英文总览原本浅色，补同源丝带。共用LocalizedOverviewContent的产品总览也沿用浅色主题。补入ddnz-home作用域令主题变量生效，修复检查发现的按钮文字白底不可见；服务页导航品牌同步制造出口标识，询价目的与服务内容不变。
新增中英 /sourcing/electric-bicycles-from-china/：6款，折叠2款、长座胖胎3款、26英寸电助力1款。对应资料18/19/27/28/41/43；统一10个选型字段，保留型号真实差异。12张整车/仪表/折叠/胎纹/减震/刹车图，其中11张内置imagegen去品牌/广告字，1张原始无品牌图仅复制缩放；生成图已对照原图人工复核。精确prompt、来源与文件映射在bicycle-generated-assets.json，参数采用和冲突在电动单车_参数采用与待确认.json。
待确认：EB-L01电机500/1000 W及电池10/25 Ah冲突；EB-L02电机250/750 W冲突；EB-F01电机350/480 W及胎宽3.0/2.5英寸冲突，前台写订货时确认，未择大宣传。EB-T01表格104 Ah错字以SKU10.4 Ah对应；EB-F02净毛重颠倒未采用。所有款未沿用平台限时价、现货、无条件续航、道路准入或通用认证承诺。
变更：src/features/electric-bicycles/{ElectricBicyclesPage.tsx,ElectricBicyclesEntry.tsx,electric-bicycles.css,catalogue.json}、public/images/electric-bicycles/；src/features/home-storage/{HomeStoragePage.tsx,home-storage.css}；src/features/overview/LocalizedOverviewContent.tsx；src/pages/product-showcase/{SourcingServices CSS,ProductsIndex.jsx}；src/features/electric-mobility/ElectricScootersPage.tsx（共享图库询价类别）；src/components/{ProductDirectoryMenu.tsx,SourcingHomepageNav.tsx,Footer.tsx}；src/features/product-positioning/ProductSupply.tsx；src/App.tsx；src/lib/{productLanguageRouting.ts,productLocalization.mjs}；scripts/{generate-static-pages.ts,render-country-pages.tsx,prerender-core-pages.mjs,check-core-prerender.mjs}。
检查：lint通过；完整build:preview 784 HTML/763 sitemap/0失败；核心SSR62页通过；采购意图640 pass/117 context-only/6既有review。两语新页初始HTML 6卡、canonical及两语互链、六型号Other询价上下文和全部12图/缩略图文件验证；七语服务页浅色主题验证。浏览器：中英单车390/1440，筛选6/2/3/1结果正确，手机导航直达、图库放大翻图与EB-F02预填及Other分类正确；中英服务页手机无横溢，主按钮背景rgb(201,79,47)/白字；中文储能桌面与手机新首屏检查通过。只有表单检查，无发送。
本地预览切换构建后英文单车与英文服务各出现一次动态模块抓取失败，点击页面重载后恢复，相关JS文件存在，未作假成功记录；后续页面交互与筛选已完成核验。正式发布仍需正常生产部署与新会话验收。
最终预览4195，dist=ddnz-preview-dMxpIy/dist；单车中文页、英文去掉zh-cn。证据：bicycle-and-visual-static-checks.json、bicycles-zh-desktop.png、bicycles-zh-mobile.png、bicycles-en-desktop.png、bicycles-en-mobile.png、bicycle-mobile-detail.png、storage-module-hero-desktop.png、storage-module-hero-mobile.png、services-aligned-desktop.png、services-aligned-mobile.png、services-en-desktop.png。图像工作文件在bicycle-cleaned-originals/。无PR/部署，保留其他任务未提交内容。
基线本地HEAD c24c388；远端main本轮只读核对仍a523455。线上服务页网页抓取工具返回不可访问，因此没有将本轮称为线上验收；最新已发布文章PR75需在正式合并前保留，同步main/CMS仍是发布依赖。下一批便携电源8份，随后滑板车增补；单车上述冲突项可再补资料核定，未冒称已解决。


## 2026-10-20 第四批：便携电源目录与指南分工
用户继续授权后处理8份171页便携电源PDF，6份归为5款中英目录（36/37为一个1200W系列）；6/8因SKU功率/容量冲突暂缓。300W两款分别纯正弦波/修正波，前台明确区分。统一10项字段，不采用尺寸/重量冲突值。14图含13张imagegen去广告品牌与1张原始无品牌图；500W主图遗漏USB-A复核发现后修正。型号、参数采用、待确认和精确图像处理记录见outputs/alibaba-catalogue-20261020/第四批便携电源目录验收.md及便携电源_参数采用与待确认.json。
新增EN/ZH /sourcing/portable-power-stations-from-china/；首页/产品总览/八语菜单及中英页脚接入真实产品目录，保留原八语电源选型指南，中英指南加目录直达链接。型号询价传递Other产品类别。变更文件完整清单在验收报告；主要新增src/features/portable-power-catalogue/和public/images/portable-power-catalogue/，同步路由/语言白名单/SSR/SEO/导航/入口/共享图库询价逻辑。
lint及完整build:preview通过（786HTML/765sitemap/0失败，64核心SSR）；采购意图642pass/117context/6既有review；两语静态单H1/5卡/canonical/hreflang/报价上下文通过。浏览器中英390/745/1440无横溢，分类5/2/2/1、手机图库与中PP-H01/英PP-M01询价预填通过，未发送表单。证据power-static-checks.json、power-browser-checks.json及power-zh-desktop.png等5截图。
最终预览4195，临时dist ddnz-preview-XHcjuz/dist。后续只读审计发现Documents工作dist产生异步index 2/3.html冲突副本，目录审计失败；未删除这些文件。隔离的最终临时预览再次审计786/765/0失败，所有最终图像与public一致（power-final-preview-inventory.json）。正式发布前须在干净产物上复核，不用受同步影响的工作dist。
本地HEAD c24c388，远端main本轮只读核对仍a523455；发布前仍须同步main/CMS保留PR75西语储能文章。无提交/PR/部署，状态已验证本地预览。下一批滑板车增补；电源资料6/8和部分尺寸重量需对应配置表，待确认项已记录。


## 2026-10-20 第五批：滑板车增补
核对8份218页（9/12/15/24/25/26/32/34），新增SC-A03双驱、SC-A04座椅双碟刹、SC-A05前后减震、SC-A06立杆电池及SC-K03三轮儿童电动款。目录10款53图，成人6/儿童3/平衡车1；原五款38图保留。9/25/32因混合配置、重复或轮径对应问题暂不新增卡片。15张新增图内置imagegen去品牌/中文广告，原图与精确prompt在scooter-extra-generated-assets.json，结构示意明确标识。电机/标称电压/净毛重等冲突不择大填写，新增滑板车参数回填表.csv可直接回填，完整依据滑板车增补_参数采用与待确认.json。
实际改src/features/electric-mobility/{catalogue.json,ElectricScootersPage.tsx}、public/images/electric-mobility/extra-*；同步构建输出及搜索意图。共享图库现有四种品类均Other，修复滑板车原先省略industry的默认分类；滑板车主CTA亦Other，表单契约不变。
lint/build:preview通过，786HTML/765sitemap/0失败、64核心SSR；意图642pass/117context/6既有review；两语静态10卡/单H1/SEO/全部10型号Other上下文通过。浏览器中英390/745/1440无横溢，分类10/6/3/1、手机图库、英文结构示意说明及中SC-K03/英SC-A06询价预填通过，无提交；本轮错误日志空。53图/缩略图与隔离预览一致，最终目录审计0失败。
最终4195预览dist=ddnz-preview-aBJNFe/dist；验收与截图：outputs/alibaba-catalogue-20261020/第五批滑板车增补验收.md、scooter-extra-static-checks.json、scooter-extra-browser-checks.json、scooter-extra-preview-inventory.json及scooter-extra-*.png。无提交/PR/部署。本地c24c388，远端main本轮只读核对仍a523455，发布前同步main/CMS保留PR75并使用干净构建。下一步汇总主产品缺项与发布基线；余下三/四轮/燃油类先独立评估，不混入滑板车。
