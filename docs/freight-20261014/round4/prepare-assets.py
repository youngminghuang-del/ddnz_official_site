from pathlib import Path
import json,hashlib,shutil
root=Path(__file__).resolve().parents[3];team=root.parent/'业务与网站总控台/2026-10增长计划/货运专项/团队';out=root/'public/media/freight-20261014-round4';archive=Path(__file__).parent/'source'
m=json.loads((team/'素材/第四轮/manifest.json').read_text());shutil.copy2(team/'素材/第四轮/manifest.json',archive/'media-manifest.json')
for a in m['logos']+m['map_assets']:
 if not a.get('absolute_path'):continue
 p=Path(a['absolute_path']);assert hashlib.sha256(p.read_bytes()).hexdigest()==a['sha256']
 if a['id'] in ['qatar-customs','oman-customs']:shutil.copy2(p,out/p.name)
 if a['id']=='regional-geometry':shutil.copy2(p,archive/p.name)
shutil.copy2(team/'内容/第四轮/清关卡片.json',root/'src/features/freight/gulfCustoms.json')
for name in ['清关卡片与地图标签-ENAR.md','来源核查.md']:shutil.copy2(team/'内容/第四轮'/name,archive/name)
g=json.loads((archive/'regional-geometry.json').read_text());maps={}
labels={
'qatar':[(220,460,'Saudi Arabia','السعودية'),(685,530,'UAE','الإمارات'),(665,85,'Iran','إيران'),(235,215,'Bahrain','البحرين'),(335,285,'Qatar','قطر'),(575,210,'Gulf','الخليج')],
'oman':[(245,295,'Saudi Arabia','السعودية'),(375,170,'UAE','الإمارات'),(495,30,'Iran','إيران'),(190,490,'Yemen','اليمن'),(450,345,'Oman','عُمان'),(660,170,'Sea of Oman','بحر عُمان'),(615,465,'Arabian Sea','بحر العرب')]}
nodepos={'hamad-port':(550,405),'doha':(530,290),'sohar-port':(665,225),'muscat':(670,280)}
for r in g['regions']:
 p=r['projection'];x0,_,_,y1=r['extent'];c=p['cos_mid_latitude'];s=p['scale'];ox,oy=p['offset']
 def xy(coord):return [round((coord[0]-x0)*c*s+ox,2),round((y1-coord[1])*s+oy,2)]
 svg=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#e4f1f6"/>']
 for f in g['features']:
  if f['id'] not in r['country_ids']:continue
  d=' '.join('M'+' L'.join(','.join(map(str,xy(pt))) for pt in ring)+' Z' for ring in f['rings']);target=f['id']==r['target']
  svg.append(f'<path data-country="{f["id"]}" d="{d}" fill="{"#fff5df" if target else "#e9e9e4"}" stroke="{"#ac9b77" if target else "#c4c6c1"}" stroke-width="1.3" fill-rule="evenodd"/>')
 svg.append('</svg>');(out/f'{r["id"]}-regional.svg').write_text(''.join(svg))
 nodes=[]
 for ident in r['node_ids']:
  n=next(n for n in g['nodes'] if n['id']==ident);x,y=xy(n['coordinates']);lx,ly=nodepos[ident];nodes.append({'id':ident,'coordinates':n['coordinates'],'x':x,'y':y,'labelX':lx,'labelY':ly})
 maps[r['id']]={'nodes':nodes,'labels':[{'x':x,'y':y,'name':{'en':en,'ar':ar}} for x,y,en,ar in labels[r['id']]]}
(root/'src/features/freight/gulfRegionalMaps.json').write_text(json.dumps(maps,ensure_ascii=False,indent=2)+'\n')
print('Verified and prepared 2 original logos, 2 regional backgrounds, 4 projected nodes; source archived')
