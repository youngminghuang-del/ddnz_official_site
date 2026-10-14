import json,hashlib,re,subprocess
from pathlib import Path
out=Path('docs/freight-20261014/round7');manifest=json.loads((out/'source/user-manifest.json').read_text());photos=json.loads(Path('src/features/freight/qatarCargoGallery.json').read_text())['images'];checks=[]
for a in manifest:assert hashlib.sha256((Path('public/media/freight-20261014-round7')/a['file']).read_bytes()).hexdigest()==a['sha256']
for lang in ['en','ar']:
 prefix='' if lang=='en' else 'ar/';route=prefix+'shipping-from-china-to-qatar/index.html';html=(Path('dist')/route).read_text();assert html.count('data-qatar-gallery=')==3 and html.count('aria-pressed=')==12;assert 'viatrading' not in html.lower();assert html.count('<h1')==1 and html.count('rel="alternate"')==9
 for photo in photos:assert photo['thumbnail'] in html
 opath=prefix+'shipping-from-china-to-oman/index.html';before=(Path('/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-JwqWee/dist')/opath).read_text();after=(Path('dist')/opath).read_text();main=lambda s:re.search(r'<main id="main-content"[\s\S]*?</main>',s)[0];assert main(before)==main(after),'Oman main changed';checks.append({'locale':lang,'galleryButtons':12,'noViaTrading':True,'omanMainIdentical':True})
files=['src/components/GetAQuote.tsx','src/features/freight/GulfDestinationMap.tsx','src/features/freight/GulfChapters.tsx','src/features/freight/GulfCargoJourney.tsx','src/features/freight/OmanCargoGallery.tsx','src/features/freight/omanCargoGallery.json','src/features/freight/gulfStories.json','src/features/freight/gulfRegionalMaps.json','src/data/notionBlogData.json']
for f in files:assert Path(f).read_bytes()==subprocess.check_output(['git','show','0b6244b:'+f]),f
assert Path('dist/sitemap.xml').read_text().count('<loc>')==733
(out/'static-results.json').write_text(json.dumps({'pages':checks,'originalPhotoHashes':12,'unchangedFiles':files,'sitemap':733},indent=2)+'\n');print('12 hashes, Qatar galleries, Oman ENAR main identical, protected files and 733 routes passed')
