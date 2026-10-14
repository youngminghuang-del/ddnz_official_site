from pathlib import Path
import re,json,hashlib
p=Path('docs/freight-20261014/round13');dist=Path('dist');rows=[]
for lang in ['en','zh-cn','ru','fr','es','ar','pt','tr']:
 for route in ['','shipping-from-china-to-qatar','shipping-from-china-to-oman']:
  url='/'+('' if lang=='en' else lang+'/')+(route+'/' if route else '');s=(dist/url.lstrip('/')/'index.html').read_text();canon=re.search(r'<link[^>]*rel="canonical"[^>]*href="([^"]+)',s)
  assert canon and canon[1]=='https://www.ddnzglobal.com'+url;assert len(re.findall(r'<h1\b',s))==1;assert s.count('rel="alternate"')==9;assert not re.search(r'<meta[^>]+name="robots"[^>]+noindex',s)
  rows.append({'route':url,'canonical':canon[1],'h1':1,'alternates':9})
entries=[f for f in dist.rglob('*') if f.is_file()];bad=[str(f) for f in entries if any(s in f.parts for s in ['docs','audit','screenshots','round13']) or f.name in ['caps-product-reference.webp','browser-check.mjs','smoke-check.mjs']];assert not bad,bad
manifest={str(f.relative_to(dist)):hashlib.sha256(f.read_bytes()).hexdigest() for f in entries};(p/'candidate-dist-sha256.json').write_text(json.dumps(manifest,indent=2)+'\n');(p/'seo-smoke.json').write_text(json.dumps(rows,indent=2)+'\n')
base=Path('/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-JsUm7C/dist');count=0
for f in base.rglob('*.html'):
 a=re.search(r'<main\b[\s\S]*?</main>',f.read_text());b=re.search(r'<main\b[\s\S]*?</main>',(dist/f.relative_to(base)).read_text())
 if a and b:assert a[0]==b[0],str(f);count+=1
assert (base/'sitemap.xml').read_bytes()==(dist/'sitemap.xml').read_bytes()
(p/'deployment-package.json').write_text(json.dumps({'files':len(entries),'bytes':sum(f.stat().st_size for f in entries),'unchangedMainSinceRound12':count,'sitemapUnchanged':True,'evidenceFilesInDist':bad,'obsoleteThirdPartyAssetAbsent':not(dist/'media/freight-20261014-round5/caps-product-reference.webp').exists(),'largestFiles':sorted([{'path':str(f.relative_to(dist)),'bytes':f.stat().st_size} for f in entries],key=lambda x:x['bytes'],reverse=True)[:8]},indent=2)+'\n');print('Package/SEO/content preservation passed:',len(entries),'files;',count,'unchanged main bodies')
