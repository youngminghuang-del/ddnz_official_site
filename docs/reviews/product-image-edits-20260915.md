# 产品图加工

使用内置 imagegen 编辑，两张输出均保存到项目，原图保留。仅更新移动配件页面组件的展示图与询盘缩略图，商品资料、价格和原始来源记录不变。

输出：

- `public/mobile-sourcing-media/edited-20260915/mesh-longan.png`
- `public/mobile-sourcing-media/edited-20260915/og28-privacy.png`

## 最终提示词

### 三星壳

Edit target: supplied phone case photo. Use case: precise-object-edit. Create a clean square ecommerce product photo for this exact five-case assortment. Remove the hand, tabletop, cup and room background. Preserve all five cases, their exact black, muted red, orange, blue and white colors, camera cutouts, perforation patterns, magnetic rings, proportions and fan arrangement. Reconstruct only the small areas obscured by fingers consistently with existing shell edges. Center on an off-white studio background with subtle natural contact shadows and generous margins. No text, logos, accessories, additional cases or altered product design.

### OG28

Edit target: supplied OG28 privacy screen protector packaging photograph. Use case: precise-object-edit. Create a clean square ecommerce product photo. Preserve the actual black/gold outer box and exact fan of ten individual packs, printed package artwork, logos and lettering, quantity and proportions. Remove only the orange backdrop and top/bottom overlaid advertising text outside the packaging. Arrange the same box above the same fan centered with comfortable margins on an off-white studio background, softly lit natural shadows. Do not redesign packaging, add copy, change lettering on packs, invent extra pieces or show a bare screen protector. Keep source product details as faithfully as possible.

## 检查

两张输出已目视检查；生成式加工可能改变细小纹理与包装小字，原始照片继续作为采购核对依据。浏览器确认两张页面图片均使用新地址且成功加载；lint 通过。未部署。
