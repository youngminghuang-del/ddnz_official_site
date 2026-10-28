# 国家及地区页最终待发布验收（2026-10-28）

## 状态与范围

用户授权同步最新main/CMS、正式构建及最后回归，明确暂不发布。本轮仅本地操作，未推送、未建PR、未触发GitHub CI、未部署或发送询盘。

起点eb72ef5；`git fetch origin main`取得f8193e2dd0ff1613a06ea2159e65baec2dbebd56，随后`git merge origin/main`返回Already up to date，无待合入提交或冲突。已审阅的货运源码无需改动，本轮只增加最终验收记录。

## 最新CMS与正式构建

使用现有CMS配置，以STRICT_NOTION_SYNC=true执行完整`npm run build`生产构建链，严格只读读取Notion，没有使用旧快照回退。42篇Published文章、7条redirect，加5篇保留文章共47篇。与前批审阅47篇快照逐项比较：新增0、删除0、字段变更0。

构建完成836HTML、815sitemap、21显式产物、0部署文件审计失败。对照昨日4230冻结预览：836HTML逐字节一致，CSS哈希一致；从线上重新读取的815条sitemap URL全部保留，无增删。208国家/地区页正文、媒体、视觉和schema因此均保持前批审阅结果。

最新CMS/redirect快照保存在证据目录；生成的源码缓存、sitemap和缩略图在验证后恢复，避免把自动生成物混入待发布源码。冻结正式构建完整保留这些产物。密钥没有复制到预览或验收文件。

## 最后一轮回归

- 本地运行与CI相同的测试集合：`tests/*.test.mjs tests/*.test.ts tests/*.test.tsx tests/kitchen/*.test.mjs`，最新CMS下392项全部通过；类型检查通过。
- Notion路由、严格发布/图片失败守卫按最新47篇重新检查通过；analytics policy/runtime通过。最初tsx CLI在沙箱内遇到IPC限制，改用node --import tsx执行同一测试脚本通过，并非跳过测试。
- 208图谱、208多语言元数据及18文案组、24服务页、16市场页回归通过。836HTML中的991份JSON-LD可解析；208线路页各一份图谱且节点身份唯一、canonical一致，正式静态robots可索引。
- 208页14,119个站内链接/锚点/媒体目标/重复ID检查无问题。
- 最新4231构建实际操作64次八语切换，覆盖4国家模板+4地区；360px手机无横溢出，H1/语言/图谱正确。补测8个八语桌面代表页面通过。
- 八语中亚选路器另选“哈萨克斯坦、多供应商集货、公路”走到询价最后一步，目的地及完整本地化备注保留，无横溢出，未发送表单。浏览器对隐藏表单input脱敏为<redacted>，不将基于脱敏值的比较当作业务错误；可见备注与目的地已实测，源码/单元检查覆盖归因逻辑，但不声称已验证真实发送载荷或邮件送达。
- 与昨日836HTML完全一致，因此昨日208全量手机/语言切换、32组地区往返内链、22国询价抽样、八语手机菜单及32桌面结果继续有效；本轮新增抽测详见独立记录，不冒称重新手测全部208询价。
- 搜索意图683pass/127context-only/5既有手机膜compare review，人工复核后保持原状态。没有重做已修复手机膜去重。
- 本轮图谱没有变化，沿用Schema.org三代表0错误0警告、Google两代表各1有效Breadcrumbs的证据；未重新提交官方测试，也未做GSC生产抓取。

## 最终待发布清单

22国×8语：沙特、阿联酋、科威特、卡塔尔、阿曼、巴林、哈萨克斯坦、乌兹别克斯坦、吉尔吉斯斯坦、塔吉克斯坦、土库曼斯坦、俄罗斯、尼日利亚、加纳、印度、巴基斯坦、孟加拉国、墨西哥、巴西、阿根廷、秘鲁、智利。

4地区×8语：中东、中亚及俄罗斯、西非、拉丁美洲。共208页面，语言为英/中/西/葡/法/俄/阿/土。

整批待发范围包含之前审阅的国家视觉与规划、国别素材、地区内链、八语文案、服务时效边界、schema/面包屑及中亚询价备注修正；本次没有扩增国家或更换视觉。

证据目录`outputs/freight-final-build-20261028/`内：
- `208页最终待发布清单.csv`：逐URL、语言、标题及状态。
- `pending-files.tsv`、`pending-commits.txt`：相对最新main的准确文件/提交范围。
- `cms-comparison.json`、`latest-notionBlogData.json`、`latest-notionRedirects.json`：本次新同步与对照。
- `production-build.log`、`ci-tests-final-cms.log`、`build-comparison.json`、`static-final.json`、`static-links.json`：正式构建及检查。
- `final-browser-64.json`、`final-quote-eight.json`、`desktop-eight.json`、截图：末轮浏览器验收。

## 预览与发布边界

正式构建冻结：`/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-b06rj7/dist`，仅本机127.0.0.1:4231。旧4230及此前预览保留。

- http://127.0.0.1:4231/zh-cn/shipping-from-china-to-central-asia/?ddnz_test=1
- http://127.0.0.1:4231/pt/shipping-from-china-to-brazil/?ddnz_test=1
- http://127.0.0.1:4231/ar/shipping-from-china-to-qatar/?ddnz_test=1

最新main/CMS同步和本地正式构建依赖已完成。下一步仅待用户审阅及明确发布授权；届时推送/PR运行远端CI，若main或CMS再次变化则检查差异，再部署及线上URL/语言/询价/GSC验证。不能将本地生产构建成功称为线上已发布或远端CI已通过。业务逐票承接条件和外部母语专家签审未被本轮技术验收替代。
