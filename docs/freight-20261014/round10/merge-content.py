from pathlib import Path
import json,shutil
src=Path('../业务与网站总控台/2026-10增长计划/货运专项/团队/内容/第十轮');dest=Path('src/features/freight');out=Path('docs/freight-20261014/round10/source')
def merge(a,b):
 if isinstance(a,dict) and isinstance(b,dict):
  for k,v in b.items():a[k]=merge(a[k],v) if k in a else v
  return a
 if isinstance(a,list) and isinstance(b,list) and b and isinstance(b[0],dict) and 'id' in b[0]:
  for item in b:
   old=next(x for x in a if x['id']==item['id']);merge(old,item)
  return a
 return b
for name in ['gulfStories','gulfJourneys','qatarCargoGallery','omanCargoGallery','gulfDeliveryChecklist']:
 source=src/(name+('.json' if name=='gulfDeliveryChecklist' else '.patch.json'));target=dest/(name+'.json');data=merge(json.loads(target.read_text()),json.loads(source.read_text()));target.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');shutil.copyfile(source,out/source.name)
