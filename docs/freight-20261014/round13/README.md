# 第十三轮发布前验收

结论：本地技术与指定内容验收通过，可进入整批发布审批。当前未授权上线，未push、PR、merge或deploy，未真实提交询价或发送WhatsApp。代码基线e25a17ba6f7d2614cbd6159d305430a6a5907619，本轮删除停用的Via Trading帽参考图及GulfCargoReferences组件/JSON，并修复移动浮标遮挡图库末项；页面现用用户图库不变。

## 线上、CMS与候选

远程main仍b4156a7938672a7ebf3130285cc9d3e135a64880，最新成功生产部署38456135838。线上中文入口index-DtHSJ0sE.js。重新下载该部署Notion审计：文章37篇及redirects与本分支逐字/哈希相同；main提交内36篇与生产37篇差异来自此前自动CMS同步，不是本次新增文章。线上sitemap和候选均733条，无新增/丢失URL。

最终本地候选PtenH6/index-BauLSYrp.js，http://127.0.0.1:4187/zh-cn/?ddnz_test=1；stage /var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-PtenH6/dist。完整1808文件SHA256清单candidate-dist-sha256.json用于识别验收产物。构建754HTML、733sitemap、21其他显式产物、0失败。

## 累计发布范围

与生产main相比，前十二轮加本轮清理、但不含本轮新增审计文件：1170变更文件，其中1022为docs/audit证据，62应用源码/数据、79 public文件、7构建脚本/测试。详见cumulative-files.json；这不是1170个上线页面。public当前相关文件约11.52MB，包含既有生产CMS的sitemap更新。

重点正文/视觉路由为八语首页及Qatar/Oman共24页，明确列表见release-scope.json。累计共享影响还有手机语言导航、全站页脚货运角色称谓、GetAQuote未知货量/显示/校验、嵌入表单CSS、公开页面单一WhatsApp；早期定向修正中东SABER适用口径/询价卡、中亚协调角色、PT/TR国家页语言切换。发布单元是完整dist，不能只部署24个HTML而遗漏共用chunk。依赖锁文件、package清单与部署workflow未改。

最终dist共418451324bytes，历史媒体占主要体积；内部docs/audit/screenshots与测试脚本未被复制进去，旧caps-product-reference.webp不存在。旧媒体来源及哈希保留在e25a17b历史，不重新暴露为站点文件。Rebul图此前已移除。第五轮仅本地预览许可未核实的遗留发布包阻碍因此关闭；当前页面没有把该图冒称HB实拍。

## 验证与证据复用

- 总控在Node22.14执行完整CI等效本地测试：323/323通过，Notion routing/guards与analytics policy/runtime均通过；同名txt及coordinator-test-results.json归档。CI实际Node24尚未执行，不能称远程CI通过。tsx CLI沙箱IPC限制通过等效node --import tsx解决，不是产品故障。
- lint与最终build:preview通过。24重点页面单H1、自引用canonical、9alternate、非noindex通过；既有freight-eight-languages检查通过；search-intent610/117/6保持，不是排名或母语质量认证。
- cJbQJd阶段390手机首页/Qatar/Oman各8次实际语言切换，共24；首页节点→同语询价目的国、两国未知货量→第四步目的国/摘要正确，共3报价路径；首页WA打开被拦截并核原号码。27记录、0页面错误，未输入个人联系或提交。
- cJbQJd阶段Qatar/Oman主图补等decode、complete且naturalWidth>0后截图（image-smoke-results.json）；第一次截图过早不作为图片加载证据。报价测试首次用“未知”字样及form子树断言不符实际“暂不清楚”且摘要在form外，修正选择器后通过；未修改产品文案或行为。
- 复用第10轮48视口组合/112截图、16字幕及语言切换、内容独立图库FAQ；第11轮32地图组合、20交接及最终长标签检查；第12轮8语WA链接、21布局检查及隔离单次事件。此次未无意义重复全矩阵。
- 内容独立指定范围验收见内容发布前验收.md：中文首页参考方向、Qatar产品重量与运输毛重边界、AR Oman六桌规划/责任/FAQ/字幕及CTA均通过。最终只清理dead资源，页面内容不变，不冒称最终全部母语审校。

## 最终图库浮标修复

总控在解码完成的截图发现WA盖住Qatar第五缩略图，实际问题不是图片缺失。WhatsAppFloat在≤820px测量浮标与两国缩略图区域，外扩8px相交时临时隐藏并关闭pointer events；滚动/resize/内容变化重算，离开恢复。新增被动scroll监听和清理，不改图库选择、提交或事件。

PtenH6最终针对Qatar三图库+Oman一图库×390/745，共8个末项：主动将控件滚到WA原位置，6次实际矩形重叠均避让、2次不重叠也正常点击，全部aria-pressed选中且主图decode通过；4次回到顶部浮标恢复。gallery-float-results.json及8截图归档。最终lint/build通过，734页面主体与第十二轮字节相同，SEO/产物哈希已刷新。323完整测试发生在这次局部避让之前，最后补针对性浏览器回归以及隔离WA单次事件/单次打开检查（analytics-results.json）；不冒称远程Node24 CI或变更后全套重跑。

## 条件、非阻碍边界与后续发布门槛

本地未发现未关闭的新增代码、CMS、SEO或指定内容阻碍。发布仍需明确授权，并在发布当时重新核对main、CMS和线上路由；远程Node24 CI、STRICT_NOTION_SYNC=true的正式构建及部署产物检查必须通过。本地使用已发布CMS快照，未读取或运行生产Notion密钥，不把预览构建当正式严格同步成功。

未执行真实询价后台/CRM入库、邮件通知或生产GA统计验证；这些仍需上线后经许可做业务验收。地图为规划参考而非直航/网点承诺；中国端图片/视频不代表目的国已交付；货量、路线、清关、安装责任逐票确认。专业母语审校、本人头像选择不是当前交付的完成声称。其他既有路线的历史时效/DDP等口径仍属后续事实队列，此次未把整站所有事实判为已核实，也未扩改无关产品。

## 回滚候选

优先回滚对象为当前生产成功run38456135838的github-pages产物（artifact11844250379），以及同run的37篇CMS/redirects快照。不能仅以main代码36篇重建冒充相同生产状态。artifact元数据见rollback-artifacts.json：Pages源归档2026-10-14 19:38:38 UTC到期，Notion审计10月27日到期。大型Pages归档下载长时间未产生完整本地输出，已中止，不声称已有本地二进制备份。rollback-local.json记录实际状态；Git基线、37篇CMS/redirects及线上sitemap已完整保留，可按下述方法重建。发布执行前确认远程产物仍可用或准备经验证的重建回滚包。

若今后只能从源码回滚，应使用b4156a7加该次CMS快照构建并完整校验733路由与已发布文章表单，再经授权部署。后续Notion若新增内容，回滚前需选择保留新文章或精确旧站，不能盲目覆盖。任何回滚执行同样未在本轮授权或执行。

原六组未跟踪生产/审计证据留在原位，不纳入本轮提交。下一步交总控汇总审批条件；当前状态是“发布前验收完成”，不是“已发布”或“效果验证完成”。
