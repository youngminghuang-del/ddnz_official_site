import json,hashlib,re,subprocess
from pathlib import Path
out=Path('docs/freight-20261014/round8');baseline=json.loads((out/'baseline.json').read_text());current=json.loads(Path('src/features/freight/qatarCargoGallery.json').read_text());previous=json.loads(subprocess.check_output(['git','show','a079b18:src/features/freight/qatarCargoGallery.json']));checks=[]
protected={f:h for f,h in baseline['protectedFiles'].items() if f not in ['src/features/freight/QatarCargoGallery.tsx','src/features/freight/gulf-stories.css']}
for f,h in protected.items():assert hashlib.sha256(Path(f).read_bytes()).hexdigest()==h,f
assert current['groups']==previous['groups']
for old,new in zip(previous['images'],current['images']):
 assert old['id']==new['id']
 if old['id']<=5:assert old==new
 else:
  assert new['src']!=old['src'] and new['thumbnail']!=old['thumbnail']
  assert 'Chinese' not in new['alt']['en']
  assert old.get('packingData')==new.get('packingData')
  assert Path('public'+old['src']).exists(),'original archive removed'
for lang in ['en','ar']:
 prefix='' if lang=='en' else 'ar/';route=prefix+'shipping-from-china-to-qatar/index.html';html=(Path('dist')/route).read_text();assert html.count('data-qatar-gallery=')==3 and html.count('aria-pressed=')==12;assert html.count('<h1')==1 and html.count('rel="alternate"')==9
 for photo in current['images']:assert photo['thumbnail'] in html
 opath=prefix+'shipping-from-china-to-oman/index.html';before=(Path('/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-RZGMrM/dist')/opath).read_text();after=(Path('dist')/opath).read_text();main=lambda s:re.search(r'<main id="main-content"[\s\S]*?</main>',s)[0];assert main(before)==main(after),'Oman main changed';checks.append({'locale':lang,'galleryButtons':12,'omanMainIdentical':True})
assert Path('dist/sitemap.xml').read_text().count('<loc>')==733
(out/'static-results.json').write_text(json.dumps({'pages':checks,'factoryImagesUnchanged':5,'packingDataUnchanged':5,'originalArchivePreserved':True,'protectedFiles':list(protected),'sitemap':733},indent=2)+'\n');print('Protected source bytes, factory photos, packing values, original archive, Oman ENAR main and 733 routes passed')
