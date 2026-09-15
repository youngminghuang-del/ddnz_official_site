# 手机壳与钢化膜混单候选版

状态：仅本地候选，未部署。原工作区 `ddnz-official-release-20260912` 未修改。

预览：http://127.0.0.1:3195/sourcing/mobile-accessories-from-china/

## 本次实现

1. 手机壳、挂绳与钢化膜共用同一份清单。支持相同产品按不同机型或颜色分行；保留原有联系人、目的地、包装与检查要求。英文、西语和阿语入口接通。
2. 每行显示产品参考起订量和适用范围。OG28 按自身产品累计，手机壳数量不抵扣其起订量。低于已公布要求时显示需供应商批准，不代表可按该数量成交。尚未确认的混款、分色、样品、定制包装条件不作承诺。
3. 新请求为空，实际目的地由客户填写。伊斯坦布尔计算器保留为可选工具；只有主动点击导入计算器产品时才加入清单，不带入伊斯坦布尔目的地或运费。原已保存的计算器样例不会自动变成请求。

沿用现有询盘提交渠道与本地模拟保护。参考单价与定制、验货、运费、税费区分；货币转换说明仅适用于原手机壳／挂饰供应商参考。

## 验证

- TypeScript 检查通过。
- 55 项相关测试通过，覆盖原手机配件、钢化膜、多语言、分析事件及新增混单回归。
- 本地完整构建、SEO 输出检查与部署文件检查通过：286 个 HTML 页面，272 个 sitemap 页面，检查失败为 0。
- 浏览器验证：C06 手机壳 100 件 + 001 钢化膜两行各 500 件（iPhone 16 / iPhone 15），目的地 Accra, Ghana；跨英文、西语与阿语保留，西语审核后回到混单表单仍保留手机壳。
- 已清除本轮浏览器测试清单与目的地。没有发送询盘，没有进行索引提交或上线发布。

## 待业务确认

- 真实的每款／每机型／每色最低数量，以及能否跨款合并。
- 样品收费、整单门槛与定制包装门槛。
- 不同目的地运费和服务费用的实际报价规则。

这些规则当前均需人工确认。原供应商和钢化膜参考参数保持原有业务口径。

## 主要文件

- `src/features/mobile-sourcing/mixed-products.mjs`：统一产品引用、逐项 MOQ 提示与三语说明。
- `src/features/mobile-sourcing/mixed-storage.mjs`：共享草稿、旧草稿迁移、计算器显式导入。
- `src/features/mobile-sourcing/buying.mjs` / `MobileContent.jsx`：统一清单、校验与完整询盘预览。
- `src/features/screen-protectors/controller.mjs` / `LocalizedScreenProtectorContent.jsx`：英文及西语／阿语入口接通。
- `tests/mixed-order.test.mjs` / `tests/screen-protector-analytics.test.mjs`：混单与变更流程回归。

预览进程关闭后，可在候选目录运行：

```sh
node_modules/.bin/vite --host 127.0.0.1 --port 3195 --strictPort
```
