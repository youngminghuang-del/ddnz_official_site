#!/usr/bin/env python3
"""Fail closed on registered/new blog releases, using the complete built template."""
import argparse, hashlib, html, json, re
from pathlib import Path
from datetime import datetime
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit, unquote
PROTECTED='top-10-screen-protector-manufacturers-alibaba'
def load(p): return json.loads(Path(p).read_text())
def digest(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def zoned(s):
 try: return bool(re.fullmatch(r'\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)',s)) and datetime.fromisoformat(s.replace('Z','+00:00')).utcoffset() is not None
 except (TypeError,ValueError): return False
def plain(s): return ' '.join(html.unescape(re.sub('<[^>]+>',' ',s)).split())
def safe_file(root, rel):
 p=(root/rel).resolve()
 if not p.is_relative_to(root.resolve()) or not p.is_file(): raise ValueError('Invalid or missing release file: '+str(rel))
 return p
class Page(HTMLParser):
 def __init__(self):
  super().__init__(); self.images=[];self.ids=[];self.graphs=[];self.text=[];self.h1=[];self.lang=None;self.canonical=None;self.noindex=False;self.published_time=None;self.script=None;self.style=0;self.h=0
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if a.get('id'): self.ids.append(a['id'])
  if t=='html': self.lang=a.get('lang')
  if t=='link' and a.get('rel')=='canonical': self.canonical=a.get('href')
  if t=='meta' and a.get('name')=='robots' and 'noindex' in a.get('content',''): self.noindex=True
  if t=='meta' and a.get('property')=='article:published_time': self.published_time=a.get('content')
  if t=='img': self.images.append(a)
  if t=='script': self.script={'json':a.get('type')=='application/ld+json','data':''}
  if t=='style': self.style+=1
  if t=='h1': self.h+=1;self.h1.append('')
 def handle_endtag(self,t):
  if t=='script' and self.script:
   if self.script['json']: self.graphs.append(json.loads(self.script['data']))
   self.script=None
  if t=='style': self.style=max(0,self.style-1)
  if t=='h1': self.h=max(0,self.h-1)
 def handle_data(self,s):
  if self.script is not None: self.script['data']+=s
  elif not self.style:
   self.text.append(s)
   if self.h: self.h1[-1]+=s

def check(root,dist=None,slug=None):
 root=Path(root).resolve();catalog=load(root/'src/data/blog-release-manifest.json');registry=load(root/'src/data/blog-publications.json')['publications'];legacy=set(load(root/'src/data/blog-release-legacy-ids.json')['ids']);entries=catalog['releases'];slugs=[e['slug'] for e in entries]
 assert len(slugs)==len(set(slugs)), 'Duplicate release slug'
 posts=load(root/'src/data/notionBlogData.json')
 for post in posts:
  if post.get('slug')==PROTECTED: continue
  assert post['id'] in legacy or post.get('slug') in slugs, 'New blog requires approved release registration: '+str(post.get('slug'))
 results=[]
 for e in entries:
  if slug and e['slug']!=slug: continue
  assert e['slug']!=PROTECTED, 'Protected legacy article must not enter the release catalog'
  url=urlsplit(e['canonical']);assert url.scheme=='https' and url.netloc==urlsplit(catalog['site']).netloc and not url.query and not url.fragment
  assert e['publication_authorized'] and e['image_rights_confirmed'] and e['reviewer'].strip(), 'Human approval/rights/reviewer missing'
  matching=next((p for p in posts if p.get('slug')==e['slug']),None)
  if matching: assert matching['id']==e['notion_page_id'], 'Registered Notion page does not match published article'
  if dist: assert matching, 'Registered article missing from the built CMS snapshot'
  release_path=safe_file(root,e['release_file']);schema_path=safe_file(root,e['schema_file']);release=load(release_path);g=load(schema_path);nodes=g['@graph'];types={n['@type']:n for n in nodes};a=types['BlogPosting'];web=types['WebPage'];faq=types.get('FAQPage',{}).get('mainEntity',[]);lists=[n for n in nodes if n['@type']=='ItemList'];images=[n for n in nodes if n['@type']=='ImageObject']
  assert all(t in types for t in ['Organization','WebPage','BlogPosting','BreadcrumbList']), 'Baseline schema types missing'
  assert release['publication_authorized'] and release['slug']==e['slug'] and release['url']==e['canonical'] and release['language']==e['language']
  assert e['reviewer'] in release['reviewer'] and web.get('reviewedBy',{}).get('name')==e['reviewer'], 'Reviewer mismatch'
  assert a['inLanguage']==web['inLanguage']==e['language'] and (a.get('url') or web.get('url'))==e['canonical']
  assert zoned(a.get('datePublished')) and zoned(a.get('dateModified')), 'Release dates require seconds and timezone'
  assert a['datePublished']==release['articleDate'], 'Visible date and schema date differ'
  if e['slug'] in registry: assert a['datePublished']==registry[e['slug']]['published_at'], 'Immutable first publication date changed'
  ids=[n.get('@id') for n in nodes];assert len(ids)==len(set(ids)), 'Duplicate graph IDs'
  assert len(faq)==e['faq_count'] and len(images)==len(e['images']), 'FAQ/image count mismatch'
  assert sum(n['numberOfItems'] for n in lists)==e['item_list_count']
  assert not any(p.get('@id') in [n['@id'] for n in lists] or p.get('@type')=='ItemList' for p in a.get('hasPart',[])), 'ItemList belongs outside BlogPosting.hasPart'
  assert [urlsplit(n['contentUrl']).path for n in images]==list(dict.fromkeys(urlsplit(n['contentUrl']).path for n in images))
  assert set(urlsplit(n['contentUrl']).path for n in images)==set(e['images'])
  result={'canonical_url':e['canonical'],'release_schema_file':str(schema_path),'release_schema_sha256':digest(schema_path),'passed':True}
  if dist:
   dist=Path(dist).resolve();pagepath=safe_file(dist,unquote(url.path.lstrip('/'))+'index.html');source=pagepath.read_text();page=Page();page.feed(source);text=' '.join(' '.join(page.text).split());rendered_nodes=[n for x in page.graphs for n in x.get('@graph',[x])]
   assert sum(n.get('@type')=='BlogPosting' for n in rendered_nodes)==1, 'Duplicate/missing rendered article schema'
   assert g in page.graphs, 'Built JSON-LD differs from final release schema'
   assert page.lang==e['language'] and page.canonical==e['canonical'] and not page.noindex, 'Locale/canonical/indexability mismatch'
   assert len(page.h1)==1 and plain(page.h1[0])==a['headline'], 'Headline/H1 mismatch'
   assert len(page.ids)==len(set(page.ids)), 'Duplicate DOM anchors'
   assert e['reviewer'] in text, 'Human reviewer not visible'
   assert page.published_time==a['datePublished'], 'Rendered publication metadata differs from schema'
   if 'date' in matching: assert matching['date']==a['datePublished'], 'CMS display date differs from schema'
   for q in faq:
    assert q['name'] in text and q['acceptedAnswer']['text'] in text, 'FAQ differs from visible text'
   for listing in lists:
    fragment=listing['@id'].rsplit('#',1)[-1];assert fragment in page.ids
    table=source.split('id="'+fragment+'"',1)[1].split('</table>',1)[0]
    names=[plain(cells[0]) for tr in re.findall(r'<tr[^>]*>(.*?)</tr>',table,re.S) if (cells:=re.findall(r'<td[^>]*>(.*?)</td>',tr,re.S))]
    assert names==[i['name'] for i in listing['itemListElement']], 'Checklist differs from visible rows'
   occurrences={}
   for src in e['images']:
    matches=[im for im in page.images if urlsplit(urljoin(e['canonical'],im.get('src',''))).path==src];occurrences[src]=len(matches)
    assert len(matches)==1, 'Image must display once including template cover: '+src
    assert matches[0].get('alt','').strip(), 'Image alt missing: '+src
    safe_file(dist,unquote(src.lstrip('/')))
   assert '<figcaption' not in release['content'], 'Unexpected body image caption'
   result.update(rendered_html=str(pagepath),rendered_html_sha256=digest(pagepath),image_occurrences=occurrences,faq_count=len(faq),item_list_count=e['item_list_count'])
  results.append(result)
 assert results, 'No registered release matched'
 return {'version':1,'site_root':str(root),'dist':str(Path(dist).resolve()) if dist else None,'passed':True,'entries':results}
if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--root',type=Path,default=Path.cwd());parser.add_argument('--dist',type=Path);parser.add_argument('--slug');parser.add_argument('--report',type=Path);args=parser.parse_args()
 try: result=check(args.root,args.dist,args.slug)
 except Exception as ex: result={'passed':False,'error':str(ex)}
 if args.report: args.report.parent.mkdir(parents=True,exist_ok=True);args.report.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(result,ensure_ascii=False,indent=2));raise SystemExit(0 if result['passed'] else 1)
