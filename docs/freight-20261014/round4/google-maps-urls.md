# 坐标外链

2026-10-14核读官方Maps URLs说明：https://developers.google.com/maps/documentation/urls/get-started

使用 https://www.google.com/maps/search/?api=1&query=LAT%2CLON，api=1必需，query按纬度、经度顺序，以URLSearchParams编码。不需要API key。原素材为[longitude,latitude]，生成链接时明确换序；保留原数值精度，不添加虚构Place ID。

仅在用户点击“Open location map / افتح خريطة الموقع”时打开外链，不嵌入Google底图、SDK、截图或导航路线。网页地理为Natural Earth派生静态SVG，归属与来源单独标注。端口坐标是发布参考点，城市是示例城市，不是客户门址。测试检查URL字符串且阻断外部请求，不在生产Google Maps上提交任何资料。
