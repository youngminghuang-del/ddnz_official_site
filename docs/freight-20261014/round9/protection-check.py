from pathlib import Path
import subprocess,json,re,hashlib
out=Path('docs/freight-20261014/round9');files=['src/features/freight/QatarCargoGallery.tsx','src/features/freight/qatarCargoGallery.json','src/features/freight/OmanCargoGallery.tsx','src/features/freight/omanCargoGallery.json','src/components/GetAQuote.tsx','src/features/freight/GulfDestinationMap.tsx','src/features/freight/GulfChapters.tsx','src/features/freight/GulfCargoJourney.tsx','src/features/freight/gulfStories.json','src/features/freight/gulfRegionalMaps.json','src/data/notionBlogData.json']
for f in files:assert Path(f).read_bytes()==subprocess.check_output(['git','show','f8d9189:'+f]),f
main=lambda s:re.search(r'<main id="main-content"[\s\S]*?</main>',s)[0]
for lang in ['', 'ar/']:
 for country in ['oman','qatar']:
  route=lang+'shipping-from-china-to-'+country+'/index.html';old=main((Path('/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-wniRLf/dist')/route).read_text());new=main((Path('dist')/route).read_text());assert old==new.replace('gulf-section gulf-split qatar-consolidation-section','gulf-section gulf-split '),(lang,country)
assets=[]
for folder in ['public/media/freight-20261014-round7','public/media/freight-20261014-round8']:
 for p in Path(folder).iterdir():assert p.read_bytes()==subprocess.check_output(['git','show','f8d9189:'+str(p)]);assets.append(str(p))
assert Path('dist/sitemap.xml').read_text().count('<loc>')==733
(out/'protection-results.json').write_text(json.dumps({'baseline':'f8d91899f90d4c4dfb9c1f969b8438b8bb06a12b','protectedFiles':files,'unchangedMediaFiles':len(assets),'omanMainIdentical':True,'qatarMainOnlySectionClassChanged':True,'sitemap':733},indent=2)+'\n');print('All protected source/media/HTML checks passed')
