import json,hashlib,re,subprocess
from pathlib import Path
out=Path('docs/freight-20261014/round6');manifest=json.loads((out/'source/user-manifest.json').read_text());photos=json.loads(Path('src/features/freight/omanCargoGallery.json').read_text())['images'];checks=[]
for a in manifest['assets']:assert hashlib.sha256((Path('public/media/freight-20261014-round6')/a['file']).read_bytes()).hexdigest()==a['sha256']
for lang in ['en','ar']:
 prefix='' if lang=='en' else 'ar/';route=prefix+'shipping-from-china-to-oman/index.html';html=(Path('dist')/route).read_text();assert html.count('data-oman-gallery')==1 and html.count('aria-pressed=')==6;assert 'rebul.com' not in html and 'billiard-table-reference.webp' not in html and 'table-packing-reference.webp' not in html;assert html.count('<h1')==1 and html.count('rel="alternate"')==9
 for photo in photos:assert photo['thumbnail'] in html and photo['title'][lang] in html
 qpath=prefix+'shipping-from-china-to-qatar/index.html';before=(Path('/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-6OQHgi/dist')/qpath).read_text();after=(Path('dist')/qpath).read_text();main=lambda s:re.search(r'<main id="main-content"[\s\S]*?</main>',s)[0];assert main(before)==main(after),'Qatar main changed';checks.append({'locale':lang,'galleryButtons':6,'noRebul':True,'qatarMainIdentical':True})
files=['src/components/GetAQuote.tsx','src/features/freight/GulfDestinationMap.tsx','src/features/freight/GulfChapters.tsx','src/features/freight/GulfCargoJourney.tsx','src/features/freight/GulfCargoReferences.tsx','src/features/freight/gulfStories.json','src/features/freight/gulfRegionalMaps.json','src/data/notionBlogData.json']
for f in files:assert Path(f).read_bytes()==subprocess.check_output(['git','show','25e5a87:'+f]),f
assert Path('dist/sitemap.xml').read_text().count('<loc>')==733
(out/'static-results.json').write_text(json.dumps({'pages':checks,'originalPhotoHashes':6,'unchangedFiles':files,'sitemap':733},indent=2)+'\n');print('6 source hashes, two Oman galleries, Qatar ENAR main byte-identical, protected files and 733 routes passed')
