from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,urljoin,unquote
from collections import deque
import json,re,csv
root=Path.cwd();dist=root/'dist'
class Page(HTMLParser):
 def __init__(self,s):
  super().__init__();self.links=[];self.title='';self.in_title=False;self.in_head=False;self.h1=0;self.feed(s)
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='a' and a.get('href'):self.links.append(a['href'])
  if t=='head':self.in_head=True
  if t=='title' and self.in_head:self.in_title=True
  if t=='h1':self.h1+=1
 def handle_endtag(self,t):
  if t=='head':self.in_head=False
  if t=='title':self.in_title=False
 def handle_data(self,s):
  if self.in_title:self.title+=s
routes=[urlsplit(u).path for u in re.findall(r'<loc>(.*?)</loc>',(dist/'sitemap.xml').read_text())];pages={r:Page((dist/r.lstrip('/')/'index.html').read_text()) for r in routes}
fail=[];adj={r:set() for r in routes}
for r,p in pages.items():
 for link in p.links:
  u=urlsplit(urljoin('https://www.ddnzglobal.com'+r,link))
  if u.hostname not in ['www.ddnzglobal.com','ddnzglobal.com']:continue
  path=unquote(u.path);path=path.rstrip('/')+'/'
  if path in pages:adj[r].add(path)
q=deque(['/']);seen={'/'}
while q:
 for t in adj[q.popleft()]-seen:seen.add(t);q.append(t)
missing=set(routes)-seen
if missing:fail.append({'unreachable':sorted(missing)})
changes=json.loads((root/'src/data/seoTitleOverrides.json').read_text())
for r,title in changes.items():
 if len(title)>60 or (r in pages and pages[r].title!=title):fail.append({'title':r})
posts=json.loads((root/'src/data/restoredBlogPosts.json').read_text())
for p in posts:
 r=('' if p['language']=='en' else '/'+p['language'])+'/blog/'+p['slug']+'/'
 if r not in pages or pages[r].h1!=1:fail.append({'restored':r})
redirects=json.loads((root/'docs/p0-remediation/redirects.json').read_text());sources={r['from'].rstrip('/') for r in redirects}
for row in redirects:
 if row['to'] not in pages or row['to'].rstrip('/') in sources:fail.append({'redirect_target':row})
report={'sitemap_urls':len(routes),'reachable_from_home':len(seen),'title_overrides_checked':len(changes),'active_title_overrides':sum(r in pages for r in changes),'inactive_prior_urls':[r for r in changes if r not in pages],'restored_posts_checked':len(posts),'redirect_targets_checked':len(redirects),'failures':fail}
(root/'docs/p0-remediation/build-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2));assert not fail
