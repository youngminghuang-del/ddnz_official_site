from pathlib import Path
import json,re
out=Path('docs/freight-20261014/round11');before=Path('/var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-VMzNkY/dist');after=Path('dist');changed=[];same=[]
main=lambda s:re.search(r'<main\b[\s\S]*?</main>',s)
for f in before.rglob('*.html'):
 rel=f.relative_to(before);a=main(f.read_text());b=main((after/rel).read_text())
 if a and b:
  if a[0]==b[0]:same.append(str(rel))
  else:changed.append(str(rel))
expected=['index.html']+[l+'/index.html' for l in ['zh-cn','ru','fr','es','ar','pt','tr']]
assert sorted(changed)==sorted(expected),changed
for rel in expected:
 s=(after/rel).read_text();assert 'world-freight-heading' in s;assert len(re.findall('class="world-freight-pin"',s))==12;assert 'four priority' not in s.lower()
assert (before/'sitemap.xml').read_bytes()==(after/'sitemap.xml').read_bytes()
(out/'static-results.json').write_text(json.dumps({'changedMain':changed,'unchangedMainCount':len(same),'sitemapUnchanged':True},indent=2)+'\n')
print(len(same),'unchanged main bodies; exactly eight homepages changed; sitemap preserved')
