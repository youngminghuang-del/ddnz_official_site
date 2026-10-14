from pathlib import Path
import json,re,subprocess,hashlib
out=Path('docs/freight-20261014/round10');root=Path('src/features/freight');langs=['en','zh','ru','fr','es','ar','pt','tr'];rows=[]
stories=json.loads((root/'gulfStories.json').read_text())
for lang in langs:
 prefix='' if lang=='en' else 'zh-cn/' if lang=='zh' else lang+'/'
 for country in ['qatar','oman']:
  route=prefix+'shipping-from-china-to-'+country+'/';html=(Path('dist')/route/'index.html').read_text();assert 'data-country-cargo-planning="gulf-story"' in html;assert html.count('<h1')==1;assert html.count('rel="alternate"')==9;assert 'https://www.ddnzglobal.com/'+route in re.search(r'<link[^>]*rel="canonical"[^>]*>',html)[0];assert f'lang="{"zh-CN" if lang=="zh" else lang}"' in html;assert stories[country][lang]['heading'].replace('&','&amp;') in html
  for target in re.findall(r'href="([^"?#]+)',html):
   if target.startswith('/') and not Path(target).suffix:assert (Path('dist')/target.lstrip('/')/'index.html').exists(),(route,target)
  assert html.count('kind="captions"')==8
  for l in langs:assert (Path('public/media/freight-20261014')/f'{"qatar-receiving" if country=="qatar" else "oman-loading"}.{l}.vtt').exists()
  if lang in ['en','ar']:
   before=(Path('/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-msnd8T/dist')/route/'index.html').read_text();main=lambda s:re.sub(r'<track[^>]*>','',re.search(r'<main id="main-content"[\s\S]*?</main>',s)[0]);assert main(before)==main(html),(lang,country,'ENAR main changed beyond caption tracks')
  rows.append({'locale':lang,'country':country,'story':True,'canonical':True,'alternates':9,'tracks':8})
# Old EN/AR translations and all geographic facts remain unchanged.
for name in ['gulfStories','gulfJourneys','qatarCargoGallery','omanCargoGallery','gulfMaps','gulfRegionalMaps','gulfCustoms']:
 before=json.loads(subprocess.check_output(['git','show','b5ab8fb:src/features/freight/'+name+'.json']));after=json.loads((root/(name+'.json')).read_text())
 def preserved(a,b,path=''):
  if isinstance(a,dict):
   for k,v in a.items():preserved(v,b[k],path+'/'+k)
  elif isinstance(a,list):
   assert len(a)==len(b),path
   for i,v in enumerate(a):preserved(v,b[i],path+'/'+str(i))
  else:assert a==b,(name,path)
 preserved(before,after)
media=subprocess.check_output(['git','ls-tree','-r','--name-only','b5ab8fb','public/media'],text=True).splitlines();count=0
for f in media:
 if 'freight-20261014' in f:assert Path(f).read_bytes()==subprocess.check_output(['git','show','b5ab8fb:'+f]);count+=1
assert Path('src/data/notionBlogData.json').read_bytes()==subprocess.check_output(['git','show','b5ab8fb:src/data/notionBlogData.json'])
assert Path('dist/sitemap.xml').read_text().count('<loc>')==733
(out/'static-results.json').write_text(json.dumps({'pages':rows,'oldMediaUnchanged':count,'oldLocaleAndGeographyPreserved':True,'enArMainIdenticalExceptTracks':True,'cmsUnchanged':True,'sitemap':733},indent=2)+'\n');print('16 route/SEO/link/track checks, ENAR preservation, geography, media and CMS passed')
